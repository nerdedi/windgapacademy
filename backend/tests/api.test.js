
// Polyfill TextEncoder for Node.js
if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = require('util').TextEncoder;
}

const request = require('supertest');
const app = require('../server');

describe('API Endpoints', () => {
  it('should deny access to /api/users without token', async () => {
    const res = await request(app).get('/api/users');
    expect(res.statusCode).toBe(401);
  });

  it('should allow login and access with token', async () => {
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', role: 'admin' });
    expect(loginRes.body.token).toBeDefined();
    const token = loginRes.body.token;
    const usersRes = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`);
    expect(usersRes.statusCode).toBe(200);
    expect(Array.isArray(usersRes.body)).toBe(true);
  });
});
