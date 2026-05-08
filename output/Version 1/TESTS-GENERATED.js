const express = require('express');
const supertest = require('supertest');
const assert = require('assert');

describe('GET /', () => {
  it('should return 200', (done) => {
    const app = express();
    app.get('/', (req, res) => {
      res.send('Hello World');
    });

    supertest(app)
      .get('/')
      .expect(200)
      .expect('Hello World')
      .end(done);
  });
});

describe('POST /', () => {
  it('should return 200 with body', (done) => {
    const app = express();
    app.use(express.json());
    app.post('/', (req, res) => {
      res.json({ received: req.body.name });
    });

    supertest(app)
      .post('/')
      .send({ name: 'John' })
      .expect(200)
      .expect((res) => {
        assert.strictEqual(res.body.received, 'John');
      })
      .end(done);
  });
});

describe('Error handling', () => {
  it('should return 500 on thrown error', (done) => {
    const app = express();
    app.get('/', (req, res) => {
      throw new Error('Test error');
    });
    app.use((err, req, res, next) => {
      res.status(500).json({ error: err.message });
    });

    supertest(app)
      .get('/')
      .expect(500)
      .end(done);
  });
});

describe('Middleware', () => {
  it('should execute middleware in order', (done) => {
    const app = express();
    let middlewareCalled = false;

    app.use((req, res, next) => {
      middlewareCalled = true;
      next();
    });

    app.get('/', (req, res) => {
      res.send('Hello World');
    });

    supertest(app)
      .get('/')
      .expect(200)
      .expect('Hello World')
      .end((err) => {
        assert.strictEqual(middlewareCalled, true);
        done(err);
      });
  });
});

describe('Edge cases', () => {
  it('should return 404 for unknown routes', (done) => {
    const app = express();
    app.get('/', (req, res) => {
      res.send('Hello World');
    });

    supertest(app)
      .get('/invalid')
      .expect(404)
      .end(done);
  });
});
