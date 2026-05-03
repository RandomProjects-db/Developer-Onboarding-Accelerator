#!/usr/bin/env node

const { onboard } = require('./index.js');

const args = process.argv.slice(2);

if (args.length === 0) {
  console.error('❌ Error: GitHub repository URL required');
  console.log('\nUsage: node cli.js <github-repo-url>');
  console.log('Example: node cli.js https://github.com/expressjs/express');
  process.exit(1);
}

const repoUrl = args[0];

// Validate GitHub URL format
if (!repoUrl.includes('github.com')) {
  console.error('❌ Error: Invalid GitHub URL');
  console.log('Please provide a valid GitHub repository URL');
  process.exit(1);
}

console.log('🚀 Developer Onboarding Accelerator\n');
console.log(`Repository: ${repoUrl}\n`);

onboard(repoUrl)
  .then(() => {
    console.log('\n✅ Done! 4 files generated in ./output');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  });
