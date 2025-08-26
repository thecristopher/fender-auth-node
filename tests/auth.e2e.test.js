import request from 'supertest';
import './helpers/env.js';
import { app } from '../src/server.js';
import { prisma } from '../src/db.js';

describe('Auth E2E', () => {
  const email = 'cris@example.com';
  const pass = 'SuperSecret123!';

  beforeAll(async () => {
    await prisma.revokedToken.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('health ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('register -> login -> me -> logout -> me(401)', async () => {
    const reg = await request(app)
      .post('/api/users/register')
      .send({ name: 'Cris', email, password: pass });
    expect(reg.status).toBe(201);
    expect(reg.body.email).toBe(email);

    const login = await request(app)
      .post('/api/auth/login')
      .send({ email, password: pass });
    expect(login.status).toBe(200);
    const token = login.body.access_token;
    expect(token).toBeTruthy();

    const me = await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${token}`);
    expect(me.status).toBe(200);
    expect(me.body.email).toBe(email);

    const logout = await request(app)
      .post('/api/auth/logout')
      .set('Authorization', `Bearer ${token}`);
    expect(logout.status).toBe(204);

    const meAgain = await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${token}`);
    expect(meAgain.status).toBe(401);
  });
});

