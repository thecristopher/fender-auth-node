import jwt from 'jsonwebtoken';
import { randomUUID } from 'node:crypto';

const secret = process.env.JWT_SECRET;
const expiresIn = process.env.JWT_EXPIRES_IN || '15m';

export function signForUser(userId) {
  const jti = randomUUID();
  const token = jwt.sign({}, secret, { subject: String(userId), jwtid: jti, expiresIn });
  return { token, jti };
}

export function verifyToken(token) {
  return jwt.verify(token, secret);
}
