# Getting Started with Express.js Development

## Overview

Express.js is a fast, unopinionated, minimalist web framework for Node.js. This guide will help you navigate the codebase and start contributing to the project.

## Prerequisites

- **Node.js**: Version 18 or higher is required
- **npm**: Comes bundled with Node.js
- **Git**: For version control and contributing

## Development Environment Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/expressjs/express.git
cd express

# Install dependencies
npm install
```

### 2. Verify Installation

```bash
# Run the test suite to ensure everything is working
npm test

# Check code style
npm run lint
```

## Where to Start Reading the Code

### Entry Point
**Start here:** `index.js` (root level)
- This is the main entry point that exports the Express framework
- It provides the initial understanding of what Express exposes to users

### Core Architecture Files (Read in this order)

1. **`lib/express.js`**
   - The heart of Express
   - Creates the application factory function
   - Sets up the core application prototype
   - Essential for understanding how Express applications are created

2. **`lib/application.js`**
   - Defines the Express application object
   - Contains methods like `app.get()`, `app.post()`, `app.listen()`, etc.
   - Core routing and middleware registration logic
   - **Key concepts**: middleware stack, routing, settings management

3. **`lib/request.js`**
   - Extends Node.js's `http.IncomingMessage`
   - Adds Express-specific request properties and methods
   - Examples: `req.params`, `req.query`, `req.body`, `req.get()`

4. **`lib/response.js`**
   - Extends Node.js's `http.ServerResponse`
   - Adds Express-specific response methods
   - Examples: `res.send()`, `res.json()`, `res.render()`, `res.redirect()`

5. **`lib/router/`**
   - The routing system implementation
   - `router/index.js`: Main router logic
   - `router/route.js`: Individual route handling
   - `router/layer.js`: Middleware layer abstraction

6. **`lib/middleware/`**
   - Built-in middleware implementations
   - Study these to understand middleware patterns

## Key Concepts to Understand

### 1. Middleware Pattern
Express is built around middleware - functions that have access to request, response, and the next middleware function:

```javascript
function middleware(req, res, next) {
  // Do something
  next(); // Pass control to next middleware
}
```

### 2. Routing System
- Routes are matched in the order they're defined
- Route parameters and pattern matching
- HTTP method handling (GET, POST, PUT, DELETE, etc.)

### 3. Application vs Router
- `app` is the main application instance
- `Router` is a mini-application for modular route handling

## Common Development Workflows

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test-cov

# Run tests for CI (with coverage report)
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

### Testing Your Changes

1. **Unit Tests**: Located in `test/` directory
   - Test individual functions and methods
   - Use Mocha as the test framework
   - Use Supertest for HTTP assertions

2. **Acceptance Tests**: Located in `test/acceptance/`
   - End-to-end testing of Express features
   - Test real-world usage scenarios

### Making Changes

1. **Create a branch** for your feature/fix
2. **Write tests first** (TDD approach is encouraged)
3. **Implement your changes**
4. **Run tests**: `npm test`
5. **Check linting**: `npm run lint`
6. **Ensure coverage**: `npm run test-cov`

## Project Structure

```
express/
├── index.js              # Main entry point
├── lib/                  # Core Express source code
│   ├── express.js        # Application factory
│   ├── application.js    # App prototype
│   ├── request.js        # Request extensions
│   ├── response.js       # Response extensions
│   ├── router/           # Routing system
│   ├── middleware/       # Built-in middleware
│   └── utils.js          # Utility functions
├── test/                 # Unit tests
├── test/acceptance/      # Integration tests
├── examples/             # Example applications
├── benchmarks/           # Performance benchmarks
└── package.json          # Project metadata
```

## Understanding Dependencies

### Core Dependencies (from package.json)
- **body-parser**: Parse incoming request bodies
- **router**: Core routing functionality
- **send**: File sending utilities
- **serve-static**: Static file serving
- **finalhandler**: Final request handler
- **http-errors**: HTTP error creation

### Development Dependencies
- **mocha**: Test framework
- **supertest**: HTTP testing library
- **eslint**: Code linting
- **nyc**: Code coverage tool

## Common Commands Reference

```bash
# Development
npm install              # Install dependencies
npm test                 # Run tests
npm run lint             # Check code style
npm run lint:fix         # Fix linting issues

# Testing
npm run test-cov         # Run tests with coverage report
npm run test-ci          # Run tests for CI/CD

# Using Express Generator (for quick app scaffolding)
npm install -g express-generator@5
express my-app
cd my-app
npm install
npm start
```

## Next Steps

1. **Read the official documentation**: https://expressjs.com/
2. **Study the examples**: Check the `examples/` directory for real-world usage
3. **Review open issues**: https://github.com/expressjs/express/issues
4. **Join discussions**: https://github.com/expressjs/discussions
5. **Read the migration guide**: https://expressjs.com/en/guide/migrating-5 (for v5 changes)

## Contributing Guidelines

- Follow the existing code style (enforced by ESLint)
- Write tests for all new features
- Maintain test coverage above 95%
- Update documentation for API changes
- Check the Code of Conduct before contributing

## Debugging Tips

1. **Enable debug logging**:
   ```bash
   DEBUG=express:* node your-app.js
   ```

2. **Use the test suite** to understand behavior:
   - Tests serve as executable documentation
   - Look at `test/` for usage examples

3. **Study middleware execution order**:
   - Add console.logs to trace request flow
   - Use the debugger to step through middleware stack

## Resources

- **Official Website**: https://expressjs.com/
- **GitHub Repository**: https://github.com/expressjs/express
- **API Documentation**: https://expressjs.com/en/5x/api.html
- **GitHub Discussions**: https://github.com/expressjs/discussions
- **OpenCollective**: https://opencollective.com/express (for funding)

---

**Welcome to the Express.js community! Start with `index.js` and `lib/express.js`, run the tests, and explore from there.**