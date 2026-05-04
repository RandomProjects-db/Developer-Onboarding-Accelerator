# Express.js: Fast, Unopinionated, Minimalist Web Framework for Node.js

Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications. It is the de facto standard server framework for Node.js, designed to make building web applications and APIs quick and easy.

## Main Features and Purpose

Express acts as a thin layer on top of the native Node.js HTTP module, providing essential web application features without obscuring the underlying Node.js capabilities.

| Feature | Description |
| :--- | :--- |
| *Robust Routing* | A powerful routing API that supports parameters, regular expressions, and nested routers to handle complex URL structures. |
| *Middleware Architecture* | A pluggable middleware system that allows developers to execute code, make changes to request and response objects, and end the request-response cycle. |
| *Template Engine Support* | Built-in support for numerous template engines (EJS, Pug, HBS, etc.) to render dynamic HTML content on the server. |
| *Request/Response Enhancements* | High-level helpers for handling redirects, cookies, headers, and file transfers, simplifying common web development tasks. |
| *Content Negotiation* | Built-in support for content negotiation, allowing the server to serve different formats (JSON, HTML, Text) based on the client's preferences. |

## Key Benefits

Express is built with a focus on performance and developer productivity, offering several key advantages:

	⁠"Express is unopinionated, meaning it doesn't force a specific project structure or database choice on the developer, providing maximum flexibility."

1.  *High Performance*: Due to its minimalist nature, Express introduces minimal overhead, ensuring high-speed request handling.
2.  *Extensibility*: With thousands of middleware packages available in the npm ecosystem, developers can easily add functionality like authentication, logging, and security.
3.  *Ease of Learning*: Its straightforward API and extensive documentation make it accessible for beginners while remaining powerful for experts.
4.  *Mature Ecosystem*: Being one of the oldest and most widely used Node.js frameworks, it has a stable codebase and a vast community for support.

## Common Use Cases

Express is versatile and can be used for a wide range of applications:

*   *Single-Page Applications (SPAs)*: Serving the initial HTML and providing a RESTful API for the frontend.
*   *RESTful APIs*: Building scalable and maintainable backend services for web and mobile clients.
*   *Server-Side Rendered (SSR) Websites*: Creating traditional multi-page applications using template engines.
*   *Microservices*: Developing small, independent services that communicate over HTTP.
*   *Real-time Applications*: Integrating with libraries like Socket.io for chat apps or live dashboards.

# Express.js Architecture Overview

Express.js is a minimalist, unopinionated web framework for Node.js, designed to provide a robust set of features for building web applications and APIs. Its architecture is characterized by a layered structure, a strong emphasis on middleware, and a flexible routing system. This document outlines the core components, their responsibilities, key design patterns, and the rationale behind this architectural approach.

## Code Organization

The Express.js codebase is primarily organized within the ⁠ lib/ ⁠ directory, with each file representing a core functional area or an extension of Node.js's built-in HTTP objects. The main entry point is ⁠ index.js ⁠, which simply re-exports the ⁠ lib/express.js ⁠ module.


express/
├── lib/
│   ├── application.js    # Core application logic, settings, and routing delegation
│   ├── express.js        # Main module, application factory, and prototype extensions
│   ├── request.js        # Enhancements to Node.js's IncomingMessage (req object)
│   ├── response.js       # Enhancements to Node.js's ServerResponse (res object)
│   ├── router/           # (External dependency) Handles route matching and dispatch
│   ├── utils.js          # Internal utility functions (ETag, query parsing, etc.)
│   └── view.js           # View rendering logic and template engine integration
├── examples/             # Illustrative example applications
├── test/                 # Comprehensive test suite
├── package.json          # Project metadata and dependencies
└── README.md             # Project overview


## Main Components and Their Responsibilities

Express's architecture revolves around several key components that work in concert to process HTTP requests and generate responses:

1.  *⁠ application.js ⁠ (The Application Object)*:
    *   *Responsibility*: This file defines the core ⁠ app ⁠ object, which is the central hub for an Express application. It manages application settings, registers middleware, handles routing delegation, and orchestrates the request-response lifecycle. It initializes default configurations, such as the environment, ETag settings, and view engine setup.
    *   *Key Methods*: ⁠ app.init() ⁠, ⁠ app.defaultConfiguration() ⁠, ⁠ app.handle() ⁠, ⁠ app.use() ⁠, ⁠ app.set() ⁠, ⁠ app.get() ⁠, ⁠ app.enable() ⁠, ⁠ app.disable() ⁠, ⁠ app.all() ⁠, and HTTP verb methods (e.g., ⁠ app.get() ⁠, ⁠ app.post() ⁠).

2.  *⁠ express.js ⁠ (The Express Factory)*:
    *   *Responsibility*: This is the main module that exports the ⁠ createApplication ⁠ function, which is invoked when ⁠ require('express') ⁠ is called. It mixes in ⁠ EventEmitter ⁠ capabilities and the ⁠ application.js ⁠ prototype into the application instance. It also extends the Node.js ⁠ http.IncomingMessage ⁠ and ⁠ http.ServerResponse ⁠ prototypes with Express-specific functionalities defined in ⁠ request.js ⁠ and ⁠ response.js ⁠.
    *   *Key Exports*: ⁠ createApplication ⁠ function, ⁠ application ⁠ prototype, ⁠ request ⁠ prototype, ⁠ response ⁠ prototype, ⁠ Router ⁠, ⁠ Route ⁠, and built-in middleware like ⁠ json ⁠, ⁠ raw ⁠, ⁠ static ⁠, ⁠ text ⁠, ⁠ urlencoded ⁠.

3.  *⁠ request.js ⁠ (The Request Object)*:
    *   *Responsibility*: Extends Node.js's ⁠ http.IncomingMessage ⁠ prototype to add convenient methods and properties for handling incoming HTTP requests. This includes methods for content negotiation, header inspection, IP address retrieval, and URL parsing.
    *   *Key Methods/Properties*: ⁠ req.get() ⁠, ⁠ req.accepts() ⁠, ⁠ req.acceptsCharsets() ⁠, ⁠ req.acceptsEncodings() ⁠, ⁠ req.acceptsLanguages() ⁠, ⁠ req.is() ⁠, ⁠ req.ip ⁠, ⁠ req.ips ⁠, ⁠ req.protocol ⁠, ⁠ req.secure ⁠, ⁠ req.path ⁠, ⁠ req.host ⁠, ⁠ req.hostname ⁠, ⁠ req.query ⁠, ⁠ req.fresh ⁠, ⁠ req.stale ⁠.

4.  *⁠ response.js ⁠ (The Response Object)*:
    *   *Responsibility*: Extends Node.js's ⁠ http.ServerResponse ⁠ prototype to provide methods for sending various types of responses, setting headers, managing cookies, and rendering views. It simplifies common response tasks and integrates with the application's settings.
    *   *Key Methods*: ⁠ res.status() ⁠, ⁠ res.send() ⁠, ⁠ res.json() ⁠, ⁠ res.jsonp() ⁠, ⁠ res.sendFile() ⁠, ⁠ res.download() ⁠, ⁠ res.redirect() ⁠, ⁠ res.set() ⁠, ⁠ res.get() ⁠, ⁠ res.cookie() ⁠, ⁠ res.clearCookie() ⁠, ⁠ res.render() ⁠, ⁠ res.type() ⁠, ⁠ res.format() ⁠, ⁠ res.attachment() ⁠, ⁠ res.vary() ⁠, ⁠ res.locals ⁠.

5.  *⁠ router ⁠ (External Dependency)*:
    *   *Responsibility*: The ⁠ router ⁠ module (specifically ⁠ router ⁠ from npm, not directly part of the Express core ⁠ lib ⁠ directory but integrated) is responsible for matching incoming request paths against defined routes and dispatching them to the appropriate handler functions. It manages a stack of layers, each potentially containing middleware or route handlers.

6.  *⁠ view.js ⁠ (The View System)*:
    *   *Responsibility*: Provides the logic for rendering views and integrating with various template engines. It handles view lookup, caching, and the rendering process, allowing developers to use templating languages like EJS, Pug, or Handlebars.
    *   *Key Methods*: ⁠ View ⁠ constructor, ⁠ View.prototype.render() ⁠.

## Design Patterns Used

Express.js leverages several common design patterns to achieve its flexibility and extensibility:

*   *Middleware Pattern*: This is perhaps the most prominent pattern. Express applications are essentially a series of middleware function calls. Each middleware function has access to the request and response objects, can perform operations, and then either terminate the request-response cycle or pass control to the next middleware function in the stack. This allows for modular and reusable components for tasks like logging, authentication, and body parsing.

*   *Chain of Responsibility Pattern*: Closely related to middleware, the routing system in Express follows this pattern. When a request comes in, it traverses a chain of routes and middleware. Each handler in the chain decides whether to process the request, pass it to the next handler, or terminate the chain.

*   *Factory Pattern*: The ⁠ createApplication ⁠ function in ⁠ lib/express.js ⁠ acts as a factory, producing new Express application instances. This allows for multiple independent Express applications within a single Node.js process.

*   *Prototype-based Inheritance/Extension*: Express extensively uses JavaScript's prototype chain to extend the core Node.js ⁠ http.IncomingMessage ⁠ and ⁠ http.ServerResponse ⁠ objects. This allows for adding new functionalities (like ⁠ req.query ⁠ or ⁠ res.json ⁠) without modifying the native objects directly, promoting a clean and extensible API.

*   *Observer Pattern (Event Emitter)*: The Express application object (⁠ app ⁠) inherits from Node.js's ⁠ EventEmitter ⁠. This allows for custom events (e.g., ⁠ mount ⁠ events when sub-applications are mounted), enabling a decoupled way for different parts of the application to communicate.

## Why This Structure Was Chosen

The architectural choices in Express.js are driven by its core philosophy of being minimalist, flexible, and performant:

*   *Minimalism and Unopinionated Design*: By providing a thin layer over Node.js's HTTP module and delegating many functionalities to external modules (like ⁠ router ⁠ and ⁠ body-parser ⁠), Express keeps its core small. This allows developers to choose their preferred tools and architectural patterns without being constrained by the framework.

*   *Modularity and Extensibility*: The heavy reliance on middleware and the prototype-based extension mechanism promotes modularity. Developers can easily create and integrate their own middleware or use a vast array of existing npm packages, making the framework highly extensible.

*   *Performance*: The minimalist design contributes to high performance. Express avoids unnecessary abstractions and overhead, allowing it to handle a large number of requests efficiently. The lazy initialization of the router (as seen in ⁠ application.js ⁠) further optimizes performance by only creating the router instance when it's first needed.

*   *Developer Experience*: The clear separation of concerns (request, response, application, routing, views) makes the codebase easier to understand, maintain, and debug. The extended ⁠ req ⁠ and ⁠ res ⁠ objects provide a convenient and intuitive API for common web development tasks, enhancing developer productivity.

*   *Leveraging Node.js Strengths*: Express builds upon Node.js's asynchronous, event-driven nature. By extending native HTTP objects and using ⁠ EventEmitter ⁠, it integrates seamlessly with the Node.js ecosystem and its non-blocking I/O model.

In summary, the architecture of Express.js is a testament to its design goals: a powerful yet flexible foundation for building high-performance web applications in Node.js, achieved through a modular, middleware-centric, and prototype-extended approach.

# Getting Started with Express.js Development

This guide is designed to help new contributors and developers quickly understand the Express.js codebase, set up their development environment, and begin contributing. Express.js is a minimalist web framework for Node.js, and understanding its core components is key to effective development.

## Where to Start Reading the Code

To grasp the fundamental architecture and flow of Express.js, new developers should focus on the ⁠ lib/ ⁠ directory, which contains the core framework logic. The recommended starting points are:

1.  *⁠ lib/express.js ⁠*: This is the entry point for the Express module. It defines the ⁠ createApplication ⁠ function, which is what ⁠ require('express') ⁠ returns. It's crucial for understanding how an Express application instance is created and how the core ⁠ application ⁠, ⁠ request ⁠, and ⁠ response ⁠ prototypes are extended.

2.  *⁠ lib/application.js ⁠*: This file defines the ⁠ app ⁠ object's prototype, which is the heart of an Express application. It contains methods for configuring the application (⁠ app.set ⁠, ⁠ app.enable ⁠), handling requests (⁠ app.handle ⁠), and defining middleware and routes (⁠ app.use ⁠, ⁠ app.get ⁠, ⁠ app.post ⁠, etc.). Understanding this file will clarify how an Express app processes requests and manages its settings.

3.  *⁠ lib/request.js ⁠*: This file extends Node.js's native ⁠ http.IncomingMessage ⁠ object, adding Express-specific functionalities to the ⁠ req ⁠ object. It's essential for understanding how Express enhances request handling, including methods for parsing headers, content negotiation, and accessing request properties like ⁠ req.query ⁠ and ⁠ req.ip ⁠.

4.  *⁠ lib/response.js ⁠*: Similar to ⁠ request.js ⁠, this file extends Node.js's ⁠ http.ServerResponse ⁠ object, providing convenient methods for the ⁠ res ⁠ object. It covers how Express allows developers to send various types of responses (⁠ res.send ⁠, ⁠ res.json ⁠), manage headers and cookies (⁠ res.set ⁠, ⁠ res.cookie ⁠), and render views (⁠ res.render ⁠).

## Key Files to Understand First

Beyond the core ⁠ lib/ ⁠ files, understanding the following files and directories will provide a more complete picture:

*   *⁠ package.json ⁠*: This file provides essential project metadata, including dependencies (⁠ dependencies ⁠ and ⁠ devDependencies ⁠), scripts for testing and linting, and the project's version and license. It's the first place to look for information about the project's ecosystem and development tools.

*   *⁠ lib/utils.js ⁠*: Contains various utility functions used internally by Express, such as HTTP method definitions, ETag generation, and query parser compilation. While not directly part of the public API, it's important for understanding how certain configurations and behaviors are implemented.

*   *⁠ lib/view.js ⁠*: If you're interested in how Express handles view rendering and integrates with template engines, this file defines the ⁠ View ⁠ constructor and its logic for resolving and rendering templates.

*   *⁠ test/ ⁠ directory*: The test suite is an invaluable resource for understanding expected behavior and edge cases. Files like ⁠ test/app.router.js ⁠ and ⁠ test/app.use.js ⁠ provide executable specifications of how routing and middleware function.

## Setting Up the Development Environment

To set up your local development environment for Express.js, follow these steps:

1.  *Clone the Repository*: First, clone the official Express.js repository from GitHub:
    ⁠ bash
    git clone https://github.com/expressjs/express.git
    cd express
     ⁠

2.  *Install Dependencies*: Express.js uses ⁠ npm ⁠ for package management. Install all necessary development and production dependencies:
    ⁠ bash
    npm install
     ⁠

3.  *Node.js Version*: Ensure you are using a compatible Node.js version as specified in ⁠ package.json ⁠ under the ⁠ engines ⁠ field. As of the current ⁠ package.json ⁠, it requires Node.js ⁠ >= 18 ⁠.

## Common Workflows and Commands

Here are some common commands and workflows you'll use during Express.js development:

*   *Running Tests*: The test suite is critical for verifying changes and understanding functionality. Express uses ⁠ mocha ⁠ for testing.
    *   Run all tests:
        ⁠ bash
        npm test
         ⁠
    *   Run tests with coverage reporting:
        ⁠ bash
        npm run test-cov
         ⁠
    *   Run tests with TAP reporter:
        ⁠ bash
        npm run test-tap
         ⁠

*   *Linting Code*: Express uses ⁠ eslint ⁠ to maintain code quality and consistency.
    *   Run the linter:
        ⁠ bash
        npm run lint
         ⁠
    *   Automatically fix linting issues:
        ⁠ bash
        npm run lint:fix
         ⁠

*   *Exploring Examples*: The ⁠ examples/ ⁠ directory contains various small applications demonstrating different Express features. You can run these examples to see Express in action.
    For instance, to run the ⁠ hello-world ⁠ example:
    ⁠ bash
    node examples/hello-world/index.js
     ⁠
    Then, open your browser to ⁠ http://localhost:3000 ⁠.

*   *Debugging*: You can debug Express.js applications using standard Node.js debugging tools. For example, to start an application with the Node.js inspector:
    ⁠ bash
    node --inspect-brk your-express-app.js
     ⁠
    Then, use your preferred debugger (e.g., Chrome DevTools or VS Code debugger) to attach to the process.

By following this guide, new developers should be well-equipped to navigate the Express.js codebase, contribute effectively, and understand the underlying principles of this widely used framework
const request = require('supertest');
const assert = require('assert');
const express = require('../express'); // Assuming express is in the parent directory for testing

describe('Express.js Core Functionality Unit Tests', function() {

  describe('Application (app.js) Tests', function() {
    it('should create an express application instance', function() {
      const app = express();
      assert.strictEqual(typeof app, 'function');
      assert.ok(app.handle);
      assert.ok(app.set);
      assert.ok(app.get);
    });

    it('should set and get application settings', function() {
      const app = express();
      app.set('env', 'test');
      assert.strictEqual(app.get('env'), 'test');
    });

    it('should enable and disable settings', function() {
      const app = express();
      app.enable('x-powered-by');
      assert.strictEqual(app.enabled('x-powered-by'), true);
      app.disable('x-powered-by');
      assert.strictEqual(app.disabled('x-powered-by'), true);
    });

    it('should handle a basic GET request', function(done) {
      const app = express();

      app.get('/test', function(req, res) {
        res.send('Hello from Express!');
      });

      request(app)
        .get('/test')
        .expect(200, 'Hello from Express!')
        .end(done);
    });

    it('should handle a basic POST request', function(done) {
      const app = express();

      app.post('/data', function(req, res) {
        res.status(201).send('Data received');
      });

      request(app)
        .post('/data')
        .expect(201, 'Data received')
        .end(done);
    });

    it('should use middleware', function(done) {
      const app = express();
      let middlewareCalled = false;

      app.use(function(req, res, next) {
        middlewareCalled = true;
        next();
      });

      app.get('/middleware-test', function(req, res) {
        res.send('Middleware worked');
      });

      request(app)
        .get('/middleware-test')
        .expect(200, 'Middleware worked')
        .end(function(err) {
          if (err) return done(err);
          assert.strictEqual(middlewareCalled, true, 'Middleware was not called');
          done();
        });
    });

    it('should handle 404 for undefined routes', function(done) {
      const app = express();

      request(app)
        .get('/non-existent-route')
        .expect(404)
        .end(done);
    });

    it('should handle errors with a custom error handler', function(done) {
      const app = express();

      app.get('/error', function(req, res, next) {
        next(new Error('Something went wrong'));
      });

      app.use(function(err, req, res, next) {
        res.status(500).send('Custom error: ' + err.message);
      });

      request(app)
        .get('/error')
        .expect(500, 'Custom error: Something went wrong')
        .end(done);
    });
  });

  describe('Request (req.js) Tests', function() {
    let app;

    beforeEach(function() {
      app = express();
    });

    it('should get a header using req.get()', function(done) {
      app.get('/header', function(req, res) {
        res.send(req.get('User-Agent'));
      });

      request(app)
        .get('/header')
        .set('User-Agent', 'SuperTest')
        .expect(200, 'SuperTest')
        .end(done);
    });

    it('should return correct req.path', function(done) {
      app.get('/foo/bar', function(req, res) {
        res.send(req.path);
      });

      request(app)
        .get('/foo/bar?name=test')
        .expect(200, '/foo/bar')
        .end(done);
    });

    it('should return correct req.query', function(done) {
      app.get('/query', function(req, res) {
        res.json(req.query);
      });

      request(app)
        .get('/query?name=express&version=5')
        .expect(200, { name: 'express', version: '5' })
        .end(done);
    });

    it('should return true for req.fresh when content is fresh', function(done) {
      app.get('/fresh', function(req, res) {
        res.set('ETag', '"123"');
        res.send(req.fresh ? 'fresh' : 'stale');
      });

      request(app)
        .get('/fresh')
        .set('If-None-Match', '"123"')
        .expect(200, 'fresh')
        .end(done);
    });

    it('should return false for req.fresh when content is stale', function(done) {
      app.get('/stale', function(req, res) {
        res.set('ETag', '"123"');
        res.send(req.fresh ? 'fresh' : 'stale');
      });

      request(app)
        .get('/stale')
        .set('If-None-Match', '"456"')
        .expect(200, 'stale')
        .end(done);
    });

    it('should return true for req.is(\'json\') with application/json', function(done) {
      app.post('/is-json', function(req, res) {
        res.send(req.is('json') ? 'is json' : 'not json');
      });

      request(app)
        .post('/is-json')
        .set('Content-Type', 'application/json')
        .send('{}')
        .expect(200, 'is json')
        .end(done);
    });

    it('should return false for req.is(\'json\') with text/plain', function(done) {
      app.post('/is-json', function(req, res) {
        res.send(req.is('json') ? 'is json' : 'not json');
      });

      request(app)
        .post('/is-json')
        .set('Content-Type', 'text/plain')
        .send('hello')
        .expect(200, 'not json')
        .end(done);
    });
  });

  describe('Response (res.js) Tests', function() {
    let app;

    beforeEach(function() {
      app = express();
    });

    it('should send plain text with res.send()', function(done) {
      app.get('/text', function(req, res) {
        res.send('Hello World');
      });

      request(app)
        .get('/text')
        .expect('Content-Type', 'text/html; charset=utf-8') // Express defaults to text/html
        .expect(200, 'Hello World')
        .end(done);
    });

    it('should send JSON with res.json()', function(done) {
      app.get('/json', function(req, res) {
        res.json({ message: 'Hello', data: 123 });
      });

      request(app)
        .get('/json')
        .expect('Content-Type', /json/)
        .expect(200, { message: 'Hello', data: 123 })
        .end(done);
    });

    it('should set status code with res.status()', function(done) {
      app.get('/status', function(req, res) {
        res.status(202).send('Accepted');
      });

      request(app)
        .get('/status')
        .expect(202, 'Accepted')
        .end(done);
    });

    it('should redirect with res.redirect()', function(done) {
      app.get('/old-path', function(req, res) {
        res.redirect('/new-path');
      });

      request(app)
        .get('/old-path')
        .expect(302)
        .expect('Location', '/new-path')
        .end(done);
    });

    it('should set a cookie with res.cookie()', function(done) {
      app.get('/set-cookie', function(req, res) {
        res.cookie('name', 'value', { maxAge: 900000, httpOnly: true });
        res.send('Cookie set');
      });

      request(app)
        .get('/set-cookie')
        .expect('Set-Cookie', /name=value; Path=\/; Expires=.*; HttpOnly/)
        .expect(200, 'Cookie set')
        .end(done);
    });

    it('should clear a cookie with res.clearCookie()', function(done) {
      app.get('/clear-cookie', function(req, res) {
        res.clearCookie('name');
        res.send('Cookie cleared');
      });

      request(app)
        .get('/clear-cookie')
        .expect('Set-Cookie', /name=; Path=\/; Expires=Thu, 01 Jan 1970 00:00:00 GMT/)
        .expect(200, 'Cookie cleared')
        .end(done);
    });

    it('should render a view with res.render() (mocked)', function(done) {
      app.set('views', __dirname + '/views');
      app.set('view engine', 'ejs');

      // Mock a simple view engine for testing purposes
      app.engine('ejs', function(path, options, callback) {
        callback(null, ⁠ <h1>${options.title}</h1><p>${options.message}</p> ⁠);
      });

      app.get('/render', function(req, res) {
        res.render('index', { title: 'Test Page', message: 'Welcome!' });
      });

      request(app)
        .get('/render')
        .expect(200, '<h1>Test Page</h1><p>Welcome!</p>')
        .end(done);