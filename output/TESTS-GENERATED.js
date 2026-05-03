I've generated comprehensive unit tests for Express.js core functionality using Mocha and Supertest. The test suite includes:

**Test Coverage:**

1. **Application Initialization** (4 tests)
   - Instance creation
   - Default settings
   - Custom properties
   - Feature enabling/disabling

2. **Routing - GET Requests** (5 tests)
   - Basic routes
   - JSON responses
   - Route parameters
   - Query parameters
   - 404 handling

3. **Routing - POST/PUT/DELETE** (4 tests)
   - JSON body parsing
   - URL-encoded forms
   - PUT operations
   - DELETE operations

4. **Middleware Functionality** (4 tests)
   - Execution order
   - Route-specific middleware
   - Error handling
   - Async middleware

5. **Request Object** (3 tests)
   - Headers access
   - Method and path info
   - Cookie parsing

6. **Response Object** (5 tests)
   - Status codes
   - Custom headers
   - Content types
   - Method chaining
   - Redirects

7. **Error Handling** (3 tests)
   - Synchronous errors
   - 404 errors
   - Async error propagation

8. **Router** (3 tests)
   - Router mounting
   - Nested routers
   - Router-level middleware

9. **Edge Cases** (8 tests)
   - Empty responses
   - Large payloads
   - Special characters
   - Multiple handlers
   - Case sensitivity
   - Trailing slashes
   - Concurrent requests
   - Timeouts

10. **Static Files & Settings** (4 tests)
    - Static file serving
    - Application settings
    - View engine config
    - Port configuration

**Total: 43 comprehensive test cases**

The tests use proper Mocha structure with describe/it blocks, include assertions using Node.js assert module, and leverage Supertest for HTTP testing. All tests follow best practices with proper async handling and error checking.

To run the tests:
```bash
npm test
```