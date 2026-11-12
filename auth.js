import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret || jwtSecret.length < 32 || jwtSecret.includes('replace-with')) {
  throw new Error('Set JWT_SECRET to a unique random value of at least 32 characters');
}

export async function authenticate(req, res, next) {
  const authorization = req.get('authorization') || '';
  const [scheme, token] = authorization.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Silakan login untuk melanjutkan.' });
  }

  try {
    const payload = jwt.verify(token, jwtSecret);
    const [users] = await pool.execute(
      'SELECT id, name, username, role FROM users WHERE id = ?',
      [payload.sub]
    );
    if (!users.length) {
      return res.status(401).json({ message: 'Sesi tidak valid. Silakan login kembali.' });
    }
    req.user = users[0];
    return next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Sesi berakhir. Silakan login kembali.' });
    }
    return next(error);
  }
}

export function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Aksi ini hanya dapat dilakukan Admin.' });
  }
  return next();
}
