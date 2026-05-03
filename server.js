const express = require('express');
require('dotenv').config();


const { spawn } = require('child_process');
const https = require('https');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Groq API configuration
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

function analyzeCodebase(repoPath) {
  // Simple codebase analysis
  const files = [];
  
  function walkDir(dir, depth = 0) {
    if (depth > 3) return; // Limit depth
    
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        // Skip common directories
        if (['node_modules', '.git', 'dist', 'build', '.next'].includes(entry.name)) {
          continue;
        }
        
        if (entry.isDirectory()) {
          walkDir(fullPath, depth + 1);
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name);
          if (['.js', '.ts', '.jsx', '.tsx', '.py', '.go', '.java', '.md', '.json'].includes(ext)) {
            try {
              const content = fs.readFileSync(fullPath, 'utf8');
              if (content.length < 50000) { // Skip very large files
                files.push({
                  path: path.relative(repoPath, fullPath),
                  content: content.substring(0, 5000) // Limit content
                });
              }
            } catch (e) {
              // Skip files we can't read
            }
          }
        }
      }
    } catch (e) {
      // Skip directories we can't read
    }
  }
  
  walkDir(repoPath);
  
  // Take top 15 files
  return files.slice(0, 15);
}

function callGroqAPI(prompt, apiKey, retries = 3) {
  return new Promise((resolve, reject) => {
    const requestBody = JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 4000
    });
    
    const url = new URL(GROQ_API_URL);
    
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Content-Length': Buffer.byteLength(requestBody)
      },
      timeout: 30000 // 30 second timeout
    };
    
    const attemptRequest = (attemptsLeft) => {
      const req = https.request(options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          if (res.statusCode === 200) {
            try {
              const response = JSON.parse(data);
              const content = response.choices?.[0]?.message?.content || '';
              resolve(content);
            } catch (error) {
              if (attemptsLeft > 0) {
                setTimeout(() => attemptRequest(attemptsLeft - 1), 2000);
              } else {
                reject(new Error(`Failed to parse Groq response: ${error.message}`));
              }
            }
          } else {
            if (attemptsLeft > 0 && res.statusCode >= 500) {
              setTimeout(() => attemptRequest(attemptsLeft - 1), 2000);
            } else {
              reject(new Error(`Groq API error (${res.statusCode}): ${data}`));
            }
          }
        });
      });
      
      req.on('timeout', () => {
        req.destroy();
        if (attemptsLeft > 0) {
          setTimeout(() => attemptRequest(attemptsLeft - 1), 2000);
        } else {
          reject(new Error('Request timeout after multiple retries'));
        }
      });
      
      req.on('error', (error) => {
        if (attemptsLeft > 0) {
          setTimeout(() => attemptRequest(attemptsLeft - 1), 2000);
        } else {
          reject(error);
        }
      });
      
      req.write(requestBody);
      req.end();
    };
    
    attemptRequest(retries);
  });
}

async function generateWithGroq(repoPath, repoUrl, res) {
  const groqApiKey = process.env.GROQ_API_KEY;
  
  if (!groqApiKey) {
    res.write('data: {"type":"error","data":"GROQ_API_KEY not found in environment"}\n\n');
    res.end();
    return;
  }
  
  try {
    res.write('data: {"type":"log","data":"📊 Analyzing codebase..."}\n\n');
    
    // Analyze codebase
    const files = analyzeCodebase(repoPath);
    
    res.write(`data: {"type":"log","data":"   Found ${files.length} relevant files"}\n\n`);
    
    // Build concise snapshot (limit to 3000 chars per file)
    let snapshot = `Repository: ${repoUrl}\n\nKey Files (${files.length} analyzed):\n\n`;
    files.forEach(file => {
      const truncated = file.content.length > 3000 ? file.content.substring(0, 3000) + '\n[... truncated]' : file.content;
      snapshot += `--- ${file.path} ---\n${truncated}\n\n`;
    });
    
    // Limit total snapshot size
    if (snapshot.length > 15000) {
      snapshot = snapshot.substring(0, 15000) + '\n\n[... snapshot truncated for API limits]';
    }
    
    // Generate README
    res.write('data: {"type":"log","data":"✔ Generating README-GENERATED.md..."}\n\n');
    const readmePrompt = `You are a technical documentation expert. Based on this codebase analysis, write a comprehensive README.md in markdown format.

${snapshot}

Write a clear, professional README with:
- Project title and description
- Main features
- Installation/setup
- Usage examples
- Key technologies

Keep it concise but informative (max 500 words).`;
    const readme = await callGroqAPI(readmePrompt, groqApiKey);
    
    // Generate Architecture
    res.write('data: {"type":"log","data":"✔ Generating ARCHITECTURE.md..."}\n\n');
    const archPrompt = `You are a software architect. Analyze this codebase and generate an architecture overview in markdown format explaining code organization, components, and design patterns.\n\n${snapshot}\n\nGenerate architecture doc:`;
    const architecture = await callGroqAPI(archPrompt, groqApiKey);
    
    // Generate Getting Started
    res.write('data: {"type":"log","data":"✔ Generating GETTING-STARTED.md..."}\n\n');
    const gsPrompt = `You are a developer onboarding specialist. Analyze this codebase and generate a getting started guide in markdown format for new developers.\n\n${snapshot}\n\nGenerate getting started guide:`;
    const gettingStarted = await callGroqAPI(gsPrompt, groqApiKey);
    
    // Generate Tests
    res.write('data: {"type":"log","data":"✔ Generating TESTS-GENERATED.js..."}\n\n');
    const testsPrompt = `You are a test engineer. Analyze this codebase and generate unit tests for the main functions using an appropriate testing framework.\n\n${snapshot}\n\nGenerate unit tests:`;
    const tests = await callGroqAPI(testsPrompt, groqApiKey);
    
    // Send final payload
    const finalMessage = {
      type: 'complete',
      files: {
        readme,
        architecture,
        gettingStarted,
        tests
      }
    };
    res.write(`data: ${JSON.stringify(finalMessage)}\n\n`);
    res.end();
    
  } catch (error) {
    res.write(`data: {"type":"error","data":"Groq API error: ${error.message}"}\n\n`);
    res.end();
  }
}

// SSE endpoint
app.post('/run', async (req, res) => {
  const { url } = req.body;
  
  if (!url || !url.includes('github.com')) {
    res.status(400).json({ error: 'Invalid GitHub URL' });
    return;
  }
  
  // Set up SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  
  // Send initial connection message
  res.write('data: {"type":"connected"}\n\n');
  
  // Extract repo name
  const repoMatch = url.match(/github\.com\/[^\/]+\/([^\/\.]+)/);
  const repoName = repoMatch ? repoMatch[1] : 'repo';
  const tempDir = path.join(__dirname, '.temp-repos');
  const repoPath = path.join(tempDir, repoName);
  
  // Clone repository
  res.write('data: {"type":"log","data":"✔ Cloning repo..."}\n\n');
  
  // Remove existing repo dir if present
  if (fs.existsSync(repoPath)) {
    fs.rmSync(repoPath, { recursive: true, force: true });
  }
  
  const gitClone = spawn('git', ['clone', '--depth', '1', url, repoPath]);
  
  let cloneSuccess = false;
  
  gitClone.on('error', (err) => {
    res.write(`data: {"type":"error","data":"Git not available: ${err.message}. Please run this tool locally."}\n\n`);
    res.end();
  });
  
  gitClone.on('close', async (code) => {
    if (code === 0) {
      cloneSuccess = true;
      res.write(`data: {"type":"log","data":"   Cloned to ${repoPath}"}\n\n`);
      
      // Try Bob CLI first
      res.write('data: {"type":"log","data":"🤖 Attempting to use Bob CLI..."}\n\n');
      
      const child = spawn('node', ['cli.js', url], {
        cwd: __dirname,
        stdio: ['ignore', 'pipe', 'pipe']
      });
      
      let outputBuffer = '';
      let cliWorked = false;
      
      child.stdout.on('data', (data) => {
        cliWorked = true;
        outputBuffer += data.toString();
        const lines = outputBuffer.split('\n');
        outputBuffer = lines.pop();
        
        lines.forEach(line => {
          if (line.trim()) {
            const message = { type: 'log', data: line };
            res.write(`data: ${JSON.stringify(message)}\n\n`);
          }
        });
      });
      
      child.stderr.on('data', (data) => {
        const message = { type: 'error', data: data.toString() };
        res.write(`data: ${JSON.stringify(message)}\n\n`);
      });
      
      child.on('close', async (code) => {
        if (outputBuffer.trim()) {
          const message = { type: 'log', data: outputBuffer };
          res.write(`data: ${JSON.stringify(message)}\n\n`);
        }
        
        if (code === 0 && cliWorked) {
          // Bob CLI worked - read output files
          const outputDir = path.join(__dirname, 'output');
          
          const readFile = (f) => {
            try { return fs.readFileSync(path.join(outputDir, f), 'utf8'); } catch(e) { return ''; }
          };

          const files = {
            readme: readFile('README-GENERATED.md'),
            architecture: readFile('ARCHITECTURE.md'),
            gettingStarted: readFile('GETTING-STARTED.md'),
            tests: readFile('TESTS-GENERATED.js')
          };

          const finalMessage = { type: 'complete', files };
          res.write(`data: ${JSON.stringify(finalMessage)}\n\n`);
          res.end();
        } else {
          // Bob CLI failed - fallback to Groq
          res.write('data: {"type":"log","data":"⚠️  Bob CLI unavailable, switching to Groq API..."}\n\n');
          
          // Check if repo still exists, if not re-clone
          if (!fs.existsSync(repoPath)) {
            res.write('data: {"type":"log","data":"✔ Re-cloning repo for Groq analysis..."}\n\n');
            const reClone = spawn('git', ['clone', '--depth', '1', url, repoPath]);
            await new Promise((resolve) => {
              reClone.on('close', resolve);
            });
          }
          
          await generateWithGroq(repoPath, url, res);
          
          // Cleanup after Groq
          if (fs.existsSync(repoPath)) {
            fs.rmSync(repoPath, { recursive: true, force: true });
          }
        }
      });
      
    } else {
      res.write(`data: {"type":"error","data":"Failed to clone repository (exit code ${code})"}\n\n`);
      res.end();
    }
  });
  
  // Handle client disconnect
  req.on('close', () => {
    if (fs.existsSync(repoPath)) {
      fs.rmSync(repoPath, { recursive: true, force: true });
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Developer Onboarding Accelerator running at http://localhost:${PORT}`);
  console.log(`   Open your browser and enter a GitHub repository URL to get started.`);
});