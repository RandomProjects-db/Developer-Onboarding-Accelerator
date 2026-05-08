const express = require('express');
const supertest = require('supertest');
const assert = require('assert');

describe('Express App', () => {
  it('should return 200 for GET /', (done) => {
    const app = express();
    app.get('/', (req, res) => {
      res.send('Hello World!');
    });
    supertest(app)
      .get('/')
      .expect(200, 'Hello World!')
      .end(done);
  });

  it('should return 404 for GET /unknown', (done) => {
    const app = express();
    supertest(app)
      .get('/unknown')
      .expect(404)
      .end(done);
  });

  it('should return 200 for POST / with middleware', (done) => {
    const app = express();
    app.use((req, res, next) => {
      req.middleware = true;
      next();
    });
    app.post('/', (req, res) => {
      assert(req.middleware);
      res.send('Hello World!');
    });
    supertest(app)
      .post('/')
      .expect(200, 'Hello World!')
      .end(done);
  });

  it('should return 500 for GET / with error', (done) => {
    const app = express();
    app.get('/', (req, res) => {
      throw new Error('Test error');
    });
    supertest(app)
      .get('/')
      .expect(500)
      .end(done);
  });

  it('should return 200 for GET / with route parameter', (done) => {
    const app = express();
    app.get('/:id', (req, res) => {
      res.send(`Hello World! ${req.params.id}`);
    });
    supertest(app)
      .get('/123')
      .expect(200, 'Hello World! 123')
      .end(done);
  });

  it('should return 200 for GET / with query parameter', (done) => {
    const app = express();
    app.get('/', (req, res) => {
      res.send(`Hello World! ${req.query.name}`);
    });
    supertest(app)
      .get('/?name=John')
      .expect(200, 'Hello World! John')
      .end(done);
  });

  it('should return 200 for GET / with header', (done) => {
    const app = express();
    app.get('/', (req, res) => {
      res.send(`Hello World! ${req.header('X-Custom-Header')}`);
    });
    supertest(app)
      .get('/')
      .set('X-Custom-Header', 'Custom Value')
      .expect(200, 'Hello World! Custom Value')
      .end(done);
  });
});