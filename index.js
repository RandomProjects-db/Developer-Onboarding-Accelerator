const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { analyzeCodebase } = require('./analyzer.js');
const { generateDocumentation } = require('./generator.js');

function extractRepoName(repoUrl) {
  // Extract repo name from URL like https://github.com/expressjs/express
  const match = repoUrl.match(/github\.com\/[^\/]+\/([^\/\.]+)/);
  return match ? match[1] : 'repo';
}

function cloneRepository(repoUrl, targetDir) {
  console.log('✔ Cloning repo...');
  
  try {
    // Remove target directory if it exists
    if (fs.existsSync(targetDir)) {
      fs.rmSync(targetDir, { recursive: true, force: true });
    }
    
    // Clone the repository
    execSync(`git clone --depth 1 "${repoUrl}" "${targetDir}"`, {
      stdio: 'pipe',
      encoding: 'utf8'
    });
    
    console.log(`   Cloned to ${targetDir}`);
    return true;
  } catch (error) {
    throw new Error(`Failed to clone repository: ${error.message}`);
  }
}

async function onboard(repoUrl) {
  const repoName = extractRepoName(repoUrl);
  const tempDir = path.join(process.cwd(), '.temp-repos');
  const repoPath = path.join(tempDir, repoName);
  const outputDir = path.join(process.cwd(), 'output');
  
  try {
    // Ensure temp directory exists
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    
    // Step 1: Clone repository
    cloneRepository(repoUrl, repoPath);
    
    // Step 2: Analyze codebase
    const snapshot = analyzeCodebase(repoPath);
    
    // Step 3: Generate documentation
    await generateDocumentation(snapshot, outputDir);
    
    // Cleanup: Remove cloned repository
    if (fs.existsSync(repoPath)) {
      fs.rmSync(repoPath, { recursive: true, force: true });
    }
    
    return true;
  } catch (error) {
    // Cleanup on error
    if (fs.existsSync(repoPath)) {
      fs.rmSync(repoPath, { recursive: true, force: true });
    }
    throw error;
  }
}

module.exports = { onboard };
