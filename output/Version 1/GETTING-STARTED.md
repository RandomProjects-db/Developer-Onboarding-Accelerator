# Express.js Developer Onboarding Guide

## Welcome to Express.js! 🚀

This guide will help you get started contributing to Express.js, the fast, unopinionated, minimalist web framework for Node.js.

## Prerequisites

Before you begin, ensure you have:
- **Node.js 18 or higher** installed ([Download here](https://nodejs.org/en/download/))
- **npm** (comes with Node.js)
- **Git** for version control
- A code editor (VS Code, WebStorm, etc.)

## Initial Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/expressjs/express.git
cd express

# Install dependencies
npm install
```

### 2. Verify Your Setup

```bash
# Run the test suite
npm test

# Check code style
npm run lint
```

## Where to Start Reading the Code

### Essential Files (Read in This Order)

1. **`Readme.md`** (Priority: 90)
   - Start here for project overview, philosophy, and quick examples
   - Understand Express's core features and design principles

2. **`package.json`** (Priority: 100)
   - Review dependencies and dev dependencies
   - Understand available npm scripts
   - Note the Node.js version requirement (>= 18)

3. **`index.js`** (Main Entry Point)
   - This is the primary entry point for the Express module
   - Exports the main Express application factory

4. **`lib/` Directory** (Core Implementation)
   - Contains the core Express framework code
   - Key modules to explore:
     - `lib/application.js` - Main application logic
     - `lib/request.js` - Request object extensions
     - `lib/response.js` - Response object extensions
     - `lib/router/` - Routing implementation

### Understanding the Architecture

```
express/
├── index.js              # Main entry point
├── lib/                  # Core framework code
│   ├── application.js    # Express app logic
│   ├── request.js        # HTTP request extensions
│   ├── response.js       # HTTP response extensions
│   ├── router/           # Routing system
│   └── middleware/       # Built-in middleware
├── test/                 # Test suite
│   ├── acceptance/       # Integration tests
│   └── support/          # Test utilities
├── examples/             # Example applications
└── benchmarks/           # Performance benchmarks
```

## Development Environment Setup

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage report
npm run test-cov

# Run tests in CI mode (with coverage)
npm run test-ci

# Run tests with TAP reporter
npm run test-tap
```

### Code Quality

```bash
# Check code style
npm run lint

# Auto-fix linting issues
npm run lint:fix
```

### Working with Examples

Express includes numerous examples in the `examples/` directory:

```bash
# Navigate to an example
cd examples/hello-world

# Install example dependencies
npm install

# Run the example
node index.js
```

## Common Workflows

### 1. Adding a New Feature

```bash
# Create a feature branch
git checkout -b feature/my-new-feature

# Make your changes in lib/

# Write tests in test/

# Run tests
npm test

# Check code style
npm run lint:fix

# Commit your changes
git commit -m "feat: add new feature"
```

### 2. Fixing a Bug

```bash
# Create a bugfix branch
git checkout -b fix/issue-number

# Write a failing test first (TDD approach)
# Edit test/your-test-file.js

# Fix the bug in lib/

# Verify the fix
npm test

# Ensure code quality
npm run lint
```

### 3. Running Specific Tests

```bash
# Run a specific test file
npx mocha test/app.router.js

# Run tests matching a pattern
npx mocha --grep "routing"
```

## Key Dependencies to Understand

### Core Dependencies
- **router** (^2.2.0) - Routing functionality
- **body-parser** (^2.2.1) - Request body parsing
- **send** (^1.1.0) - File sending utilities
- **finalhandler** (^2.1.0) - Final request handler

### Development Tools
- **mocha** (^10.7.3) - Test framework
- **supertest** (^6.3.0) - HTTP assertion library
- **nyc** (^17.1.0) - Code coverage tool
- **eslint** (8.47.0) - Code linting

## Testing Philosophy

Express maintains **super-high test coverage**. When contributing:

1. **Write tests first** (TDD approach recommended)
2. **Test both success and error cases**
3. **Use `supertest` for HTTP testing**
4. **Ensure no memory leaks** (tests run with `--check-leaks`)
5. **Maintain or improve coverage** (check with `npm run test-cov`)

## Code Style Guidelines

- Follow the existing code style (enforced by ESLint)
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Keep functions focused and small
- Run `npm run lint:fix` before committing

## Useful Resources

- **Official Documentation**: https://expressjs.com/
- **API Reference**: https://expressjs.com/en/5x/api.html
- **Migration Guide to v5**: https://expressjs.com/en/guide/migrating-5
- **GitHub Discussions**: https://github.com/expressjs/discussions
- **Code of Conduct**: Review before contributing

## Next Steps

1. **Explore the examples** - Run and modify examples to understand Express patterns
2. **Read the tests** - Tests are excellent documentation of expected behavior
3. **Review open issues** - Find good first issues to contribute
4. **Join discussions** - Engage with the community on GitHub Discussions
5. **Read the migration guide** - Understand v5 changes if coming from v4

## Getting Help

- **GitHub Discussions**: Ask questions and share ideas
- **Issues**: Report bugs or request features
- **Documentation**: Comprehensive guides at expressjs.com

---

**Welcome to the Express.js community! Happy coding! 🎉**