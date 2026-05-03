const fs = require('fs');
const path = require('path');

// Files and directories to skip
const SKIP_PATTERNS = [
  'node_modules',
  '.git',
  '.next',
  '.nuxt',
  'dist',
  'build',
  'coverage',
  '.cache',
  'vendor',
  '__pycache__',
  '.pytest_cache',
  '.venv',
  'venv',
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml',
  '.DS_Store',
  'Thumbs.db'
];

// Priority file patterns (higher score = higher priority)
const PRIORITY_PATTERNS = [
  { pattern: /^package\.json$/i, score: 100 },
  { pattern: /^readme\.md$/i, score: 90 },
  { pattern: /^index\.(js|ts|jsx|tsx|py|go|rs)$/i, score: 85 },
  { pattern: /^main\.(js|ts|jsx|tsx|py|go|rs)$/i, score: 85 },
  { pattern: /^app\.(js|ts|jsx|tsx|py|go|rs)$/i, score: 85 },
  { pattern: /^server\.(js|ts|jsx|tsx|py|go|rs)$/i, score: 80 },
  { pattern: /^config\.(js|ts|json|yaml|yml)$/i, score: 75 },
  { pattern: /\.config\.(js|ts|json)$/i, score: 70 },
  { pattern: /^tsconfig\.json$/i, score: 70 },
  { pattern: /^webpack\.config\.(js|ts)$/i, score: 70 },
  { pattern: /^vite\.config\.(js|ts)$/i, score: 70 },
  { pattern: /\.(js|ts|jsx|tsx|py|go|rs|java|cpp|c|h)$/i, score: 50 },
  { pattern: /\.md$/i, score: 30 }
];

function shouldSkip(filePath) {
  const basename = path.basename(filePath);
  return SKIP_PATTERNS.some(pattern => basename === pattern || filePath.includes(`/${pattern}/`));
}

function getPriority(filePath) {
  const basename = path.basename(filePath);
  for (const { pattern, score } of PRIORITY_PATTERNS) {
    if (pattern.test(basename)) {
      return score;
    }
  }
  return 0;
}

function walkDirectory(dir, files = []) {
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (shouldSkip(fullPath)) {
        continue;
      }
      
      if (entry.isDirectory()) {
        walkDirectory(fullPath, files);
      } else if (entry.isFile()) {
        const priority = getPriority(fullPath);
        if (priority > 0) {
          files.push({ path: fullPath, priority });
        }
      }
    }
  } catch (error) {
    // Skip directories we can't read
    console.warn(`⚠️  Skipping ${dir}: ${error.message}`);
  }
  
  return files;
}

function readFileContent(filePath, maxSize = 50000) {
  try {
    const stats = fs.statSync(filePath);
    
    // Skip very large files
    if (stats.size > maxSize) {
      return `[File too large: ${(stats.size / 1024).toFixed(2)} KB]`;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    return content;
  } catch (error) {
    return `[Error reading file: ${error.message}]`;
  }
}

function analyzeCodebase(repoPath, topN = 20) {
  console.log('✔ Analyzing codebase...');
  
  // Walk directory and collect files
  const files = walkDirectory(repoPath);
  
  // Sort by priority (highest first)
  files.sort((a, b) => b.priority - a.priority);
  
  // Take top N files
  const topFiles = files.slice(0, topN);
  
  // Build snapshot object
  const snapshot = {
    repoPath,
    totalFiles: files.length,
    analyzedFiles: topFiles.length,
    files: topFiles.map(({ path: filePath, priority }) => {
      const relativePath = path.relative(repoPath, filePath);
      const content = readFileContent(filePath);
      
      return {
        path: relativePath,
        priority,
        content
      };
    })
  };
  
  console.log(`   Found ${files.length} relevant files, analyzing top ${topFiles.length}`);
  
  return snapshot;
}

module.exports = { analyzeCodebase };
