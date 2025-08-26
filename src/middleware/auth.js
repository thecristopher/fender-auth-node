import { verifyToken } from '../utils/jwt.js';
import { prisma } from '../db.js';

export async function requireAuth(req, res, next) {
  try {
    const [scheme, token] = (req.headers.authorization || '').split(' ');
    if(scheme !== 'Bearer' || !token)
      return res.status(401).json({error: 'Missing/Invalid Authorization'});

    const payload = verifyToken(token);
    const denied = await prisma.revokedToken.findUnique({ where: { jti: payload.jti } });
    if(denied)
      return res.status(401).json({ error: 'Token was revoked'});

    req.auth = { userId: Number(payload.sub), jti: payload.jti, exp: payload.exp };
    next();
  }
  catch {
    res.status(401).json({ error: 'Unauthorized'});
  }
}
