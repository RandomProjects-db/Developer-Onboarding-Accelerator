const https = require('https');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const GROQ_MODELS = [
  'llama-3.3-70b-versatile',
  'meta-llama/llama-4-scout-17b-16e-instruct',
  'llama-3.1-8b-instant',
  'allam-2-7b'
];

// Load .env manually (no dotenv dependency needed)
function loadEnv() {
  try {
    const envPath = path.join(__dirname, '.env');
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const match = line.match(/^([^#=]+)=(.*)$/);
      if (match) process.env[match[1].trim()] = match[2].trim();
    }
  } catch (e) {}
}
loadEnv();

function callBobCLI(prompt) {
  // Prepend instruction to prevent Bob from trying to read files
  const fullPrompt = `IMPORTANT: Do not use any file reading tools. Use ONLY the codebase snapshot provided in this prompt. Here is the task:\n\n${prompt}`;
  const escaped = fullPrompt.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/`/g, '\\`');
  const result = execSync(`bob do "${escaped}"`, { encoding: 'utf8', timeout: 180000 });
  const match = result.match(/---output---\n([\s\S]*?)\n---output---/);
  return match ? match[1].trim() : result.trim();
}

function formatSnapshot(snapshot) {
  let formatted = `Repository Analysis:\n`;
  formatted += `Total files found: ${snapshot.totalFiles}\n`;
  formatted += `Analyzed files: ${snapshot.analyzedFiles}\n\n`;
  formatted += `Key Files:\n`;
  
  for (const file of snapshot.files) {
    formatted += `\n--- ${file.path} (priority: ${file.priority}) ---\n`;
    formatted += file.content;
    formatted += `\n--- End of ${file.path} ---\n`;
  }
  
  return formatted;
}

function callGroqModel(prompt, model, apiKey) {
  return new Promise((resolve, reject) => {
    const requestBody = JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 4000
    });

    const options = {
      hostname: 'api.groq.com',
      port: 443,
      path: '/openai/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Content-Length': Buffer.byteLength(requestBody)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          const content = response.choices?.[0]?.message?.content?.trim();
          if (content) resolve(content);
          else reject(new Error(`Empty response from ${model}: ${data.substring(0, 100)}`));
        } catch (e) {
          reject(new Error(`Parse error from ${model}: ${e.message}`));
        }
      });
    });

    req.on('error', (e) => reject(new Error(`Network error: ${e.message}`)));
    req.write(requestBody);
    req.end();
  });
}

async function callGroqAPI(prompt, description) {
  console.log(`✔ Generating ${description}...`);

  // Try Bob CLI first
  try {
    const content = callBobCLI(prompt);
    if (content && content.length > 50) {
      console.log(`   ✅ Generated via IBM Bob`);
      return content;
    }
  } catch (e) {
    process.stderr.write(`   ⚠️  Bob CLI failed: ${e.message.split('\n')[0]}\n`);
  }

  // Fallback to Groq model chain
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return `# ${description}\n\nError: GROQ_API_KEY not set.`;

  for (const model of GROQ_MODELS) {
    try {
      const content = await callGroqModel(prompt, model, apiKey);
      return content;
    } catch (e) {
      process.stderr.write(`   ⚠️  ${model} failed: ${e.message}\n`);
      // If rate limited, wait and retry once before trying next model
      if (e.message.includes('Rate limit')) {
        await sleep(10000);
        try {
          const content = await callGroqModel(prompt, model, apiKey);
          return content;
        } catch (e2) {
          process.stderr.write(`   ⚠️  ${model} retry failed\n`);
        }
      }
    }
  }

  return `# ${description}\n\nAll models failed. Check API key and rate limits.`;
}

// Use longer delays on cloud (no Bob CLI) to avoid Groq rate limits
const GROQ_DELAY = (process.env.RAILWAY_ENVIRONMENT || process.env.RAILWAY_SERVICE_NAME || process.env.PORT) ? 20000 : 8000;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function generateDocumentation(snapshot, outputDir) {
  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const snapshotText = formatSnapshot(snapshot);
  
  // Truncate snapshot if too large (API has token limits)
  const maxSnapshotLength = 6000; // Keep under all models' limits
  const truncatedSnapshot = snapshotText.length > maxSnapshotLength 
    ? snapshotText.substring(0, maxSnapshotLength) + '\n\n[... truncated for length ...]'
    : snapshotText;
  
  // Generate README-GENERATED.md
  const readmePrompt = `You are a technical documentation expert. Given the following codebase snapshot, generate a comprehensive README in markdown format that explains:
- What this repository does
- Its main features and purpose
- Key benefits and use cases

Codebase Snapshot:
${truncatedSnapshot}

Generate a clear, well-structured README.md:`;
  
  const readmeContent = await callGroqAPI(readmePrompt, 'README-GENERATED.md');
  fs.writeFileSync(path.join(outputDir, 'README-GENERATED.md'), readmeContent);
  await sleep(GROQ_DELAY);
  
  // Generate ARCHITECTURE.md
  const archPrompt = `You are a software architect. Given the following codebase snapshot, generate an architecture overview in markdown format that explains:
- How the code is organized
- Main components and their responsibilities
- Design patterns used
- Why this structure was chosen

Codebase Snapshot:
${truncatedSnapshot}

Generate a detailed architecture document:`;
  
  const archContent = await callGroqAPI(archPrompt, 'ARCHITECTURE.md');
  fs.writeFileSync(path.join(outputDir, 'ARCHITECTURE.md'), archContent);
  await sleep(GROQ_DELAY);
  
  // Generate GETTING-STARTED.md
  const gettingStartedPrompt = `You are a developer onboarding specialist. Given the following codebase snapshot, generate a getting started guide in markdown format that includes:
- Where new developers should start reading the code
- Key files to understand first
- How to set up the development environment
- Common workflows and commands

Codebase Snapshot:
${truncatedSnapshot}

Generate a comprehensive getting started guide:`;
  
  const gettingStartedContent = await callGroqAPI(gettingStartedPrompt, 'GETTING-STARTED.md');
  fs.writeFileSync(path.join(outputDir, 'GETTING-STARTED.md'), gettingStartedContent);
  await sleep(GROQ_DELAY);
  
  // Generate TESTS-GENERATED.js - use smaller snapshot to avoid timeout
  const testsSnapshot = snapshotText.length > 3000
    ? snapshotText.substring(0, 3000) + '\n\n[... truncated ...]'
    : snapshotText;
  const testsPrompt = `You are a test engineer. Given the following codebase snapshot, generate unit tests for the main functions. Use an appropriate testing framework (Jest for JavaScript, pytest for Python, etc.). Include:
- Test cases for typical use cases
- Edge case tests
- Proper test structure and assertions

Codebase Snapshot:
${testsSnapshot}

Generate comprehensive unit tests:`;
  
  const testsContent = await callGroqAPI(testsPrompt, 'TESTS-GENERATED.js');
  fs.writeFileSync(path.join(outputDir, 'TESTS-GENERATED.js'), testsContent);
}

module.exports = { generateDocumentation };
