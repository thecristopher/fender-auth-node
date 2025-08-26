import { prisma } from '../db.js';
import { verifyPassword } from '../utils/password.js';
import { signForUser, verifyToken } from '../utils/jwt.js';

export async function login(req, res) {
  const { email, password } = req.body || {};
  if (!email || !password) 
    return res.status(400).json({ error: 'email and password are required' });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) 
    return res.status(401).json({ error: 'Invalid credentials' });

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) 
    return res.status(401).json({ error: 'Invalid credentials' });

  const { token } = signForUser(user.id);
  res.json({ token_type: 'Bearer', expires_in: 900, access_token: token });
}

export async function logout(req, res) {
  const [scheme, token] = (req.headers.authorization || '').split(' ');
  if (scheme !== 'Bearer' || !token) 
    return res.status(401).json({ error: 'Missing/invalid Authorization' });

  try {
    const payload = verifyToken(token);
    await prisma.revokedToken.create({
      data: { jti: payload.jti, expiresAt: new Date(payload.exp * 1000) }
    });
    res.status(204).send();
  } catch {
    res.status(401).json({ error: 'Unauthorized' });
  }
}

