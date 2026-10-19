const request = require('supertest');
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'a-test-only-secret-that-is-at-least-32-characters-long';
const app = require('../src/app');

test('health endpoint returns liveness status', async () => {
  const response = await request(app).get('/health').expect(200);
  expect(response.body.status).toBe('ok');
});

test('unknown route returns a JSON 404', async () => {
  const response = await request(app).get('/not-a-route').expect(404);
  expect(response.body.error).toBe('Route not found');
});

test('signup validates required fields before database access', async () => {
  const response = await request(app).post('/api/v1/user/signup').send({ username: 'x', email: 'invalid', password: 'short' }).expect(400);
  expect(response.body.error).toBe('Validation failed');
  expect(response.body.details.length).toBeGreaterThan(0);
});

test('login validates missing credentials before database access', async () => {
  const response = await request(app).post('/api/v1/user/login').send({}).expect(400);
  expect(response.body.error).toBe('Validation failed');
});

test('malformed JSON returns a safe 400 response', async () => {
  const response = await request(app).post('/api/v1/user/signup').set('Content-Type', 'application/json').send('{bad json').expect(400);
  expect(response.body.error).toBe('Malformed JSON body');
});
