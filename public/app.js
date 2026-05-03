// State
let currentTab = 'readme';
let generatedFiles = null;
let eventSource = null;

// DOM Elements
const githubUrlInput = document.getElementById('github-url');
const runBtn = document.getElementById('run-btn');
const progressLog = document.getElementById('progress-log');
const fileList = document.getElementById('file-list');
const copyBtn = document.getElementById('copy-btn');
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
});

function setupEventListeners() {
  // Run button
  runBtn.addEventListener('click', handleRun);
  
  // Enter key in input
  githubUrlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleRun();
    }
  });
  
  // Tab switching
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabName = tab.dataset.tab;
      switchTab(tabName);
    });
  });
  
  // File list clicking
  fileList.querySelectorAll('li').forEach(item => {
    item.addEventListener('click', () => {
      if (!item.classList.contains('disabled')) {
        const fileName = item.dataset.file;
        switchTab(fileName);
      }
    });
  });
  
  // Copy button
  copyBtn.addEventListener('click', handleCopy);
}

function handleRun() {
  const url = githubUrlInput.value.trim();
  
  if (!url || !url.includes('github.com')) {
    addLogLine('❌ Error: Please enter a valid GitHub URL', true);
    return;
  }
  
  // Reset state
  progressLog.innerHTML = '';
  generatedFiles = null;
  copyBtn.disabled = true;
  runBtn.disabled = true;
  
  // Disable file list
  fileList.querySelectorAll('li').forEach(item => {
    item.classList.add('disabled');
    item.classList.remove('active');
  });
  
  // Clear content areas
  tabContents.forEach(content => {
    if (!content.querySelector('.placeholder')) {
      content.innerHTML = '';
    }
  });
  
  // Start SSE connection
  startSSE(url);
}

function startSSE(url) {
  addLogLine('🔌 Connecting to server...');
  
  // Close existing connection if any
  if (eventSource) {
    eventSource.close();
  }
  
  // Create SSE connection via POST
  fetch('/run', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url })
  }).then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    
    function readStream() {
      reader.read().then(({ done, value }) => {
        if (done) {
          addLogLine('✅ Stream completed');
          runBtn.disabled = false;
          return;
        }
        
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        
        lines.forEach(line => {
          if (line.startsWith('data: ')) {
            const data = line.substring(6);
            try {
              const message = JSON.parse(data);
              handleSSEMessage(message);
            } catch (e) {
              console.error('Failed to parse SSE message:', e);
            }
          }
        });
        
        readStream();
      }).catch(error => {
        addLogLine(`❌ Stream error: ${error.message}`, true);
        runBtn.disabled = false;
      });
    }
    
    readStream();
  }).catch(error => {
    addLogLine(`❌ Connection error: ${error.message}`, true);
    runBtn.disabled = false;
  });
}

function handleSSEMessage(message) {
  switch (message.type) {
    case 'connected':
      addLogLine('✅ Connected to server');
      break;
      
    case 'log':
      addLogLine(message.data);
      break;
      
    case 'error':
      addLogLine(message.data, true);
      break;
      
    case 'complete':
      handleCompletion(message.files);
      break;
  }
}

function handleCompletion(files) {
  addLogLine('✅ All files generated successfully!');
  generatedFiles = files;
  
  // Enable file list
  fileList.querySelectorAll('li').forEach(item => {
    item.classList.remove('disabled');
  });
  
  // Enable copy button
  copyBtn.disabled = false;
  
  // Render all files
  renderFile('readme', files.readme);
  renderFile('architecture', files.architecture);
  renderFile('gettingStarted', files.gettingStarted);
  renderFile('tests', files.tests);
  
  // Switch to README tab
  switchTab('readme');
  
  runBtn.disabled = false;
}

function renderFile(tabName, content) {
  const contentElement = document.getElementById(`content-${tabName}`);
  
  if (tabName === 'tests') {
    // Render code with syntax highlighting
    contentElement.innerHTML = `<div class="code-content"><pre><code class="language-javascript">${escapeHtml(content)}</code></pre></div>`;
    
    // Apply syntax highlighting
    contentElement.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightElement(block);
    });
  } else {
    // Render markdown
    const html = marked.parse(content);
    contentElement.innerHTML = `<div class="markdown-content">${html}</div>`;
    
    // Apply syntax highlighting to code blocks in markdown
    contentElement.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightElement(block);
    });
  }
}

function switchTab(tabName) {
  currentTab = tabName;
  
  // Update tab buttons
  tabs.forEach(tab => {
    if (tab.dataset.tab === tabName) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });
  
  // Update tab contents
  tabContents.forEach(content => {
    if (content.id === `content-${tabName}`) {
      content.classList.add('active');
    } else {
      content.classList.remove('active');
    }
  });
  
  // Update file list
  fileList.querySelectorAll('li').forEach(item => {
    if (item.dataset.file === tabName) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

function handleCopy() {
  if (!generatedFiles) return;
  
  const fileMap = {
    readme: generatedFiles.readme,
    architecture: generatedFiles.architecture,
    gettingStarted: generatedFiles.gettingStarted,
    tests: generatedFiles.tests
  };
  
  const content = fileMap[currentTab];
  
  if (content) {
    navigator.clipboard.writeText(content).then(() => {
      // Visual feedback
      const originalText = copyBtn.textContent;
      copyBtn.textContent = '✅ Copied!';
      setTimeout(() => {
        copyBtn.textContent = originalText;
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy:', err);
      addLogLine('❌ Failed to copy to clipboard', true);
    });
  }
}

function addLogLine(text, isError = false) {
  const line = document.createElement('div');
  line.className = 'log-line' + (isError ? ' error' : '');
  line.textContent = text;
  progressLog.appendChild(line);
  
  // Auto-scroll to bottom
  progressLog.scrollTop = progressLog.scrollHeight;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
