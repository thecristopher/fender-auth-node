import { prisma } from '../db.js';
import { hashPassword } from '../utils/password.js';

export async function register(req, res) {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) 
    return res.status(400).json({ error: 'name, email, password are required' });

  const exist = await prisma.user.findUnique({ where: { email } });
  if (exist) 
    return res.status(409).json({ error: 'Email already in use' });

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { name, email, passwordHash },
    select: { id: true, name: true, email: true, createdAt: true }
  });
  res.status(201).json(user);
}

export async function me(req, res) {
  const user = await prisma.user.findUnique({
    where: { id: req.auth.userId },
    select: { id: true, name: true, email: true, createdAt: true, updatedAt: true }
  });
  res.json(user);
}

export async function updateMe(req, res) {
  const { name, email, password } = req.body || {};
  const data = {};
  if (name) data.name = name;
  if (email) data.email = email;
  if (password) data.passwordHash = await hashPassword(password);

  try {
    const updated = await prisma.user.update({
      where: { id: req.auth.userId },
      data,
      select: { id: true, name: true, email: true, createdAt: true, updatedAt: true }
    });
    res.json(updated);
  } catch (e) {
    if (String(e).includes('Unique constraint failed')) return res.status(409).json({ error: 'Email already in use' });
    res.status(500).json({ error: 'Could not update user' });
  }
}

export async function deleteMe(req, res) {
  try {
    await prisma.user.delete({ where: { id: req.auth.userId } });
    res.status(204).send();
  } catch {
    res.status(500).json({ error: 'Could not delete user' });
  }
}
