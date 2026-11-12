import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';

export async function login(req, res, next) {
  const body = req.body;
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return res.status(400).json({ message: 'Username dan password wajib diisi.' });
  }
  const { username, password } = body;
  if (typeof username !== 'string' || typeof password !== 'string' ||
      !username.trim() || !password || username.length > 50 || password.length > 200) {
    return res.status(400).json({ message: 'Username dan password wajib diisi.' });
  }

  try {
    const [users] = await pool.execute(
      'SELECT id, name, username, password, role FROM users WHERE username = ?',
      [username.trim()]
    );
    const user = users[0];
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Username atau password tidak sesuai.' });
    }

    const token = jwt.sign({ sub: String(user.id) }, process.env.JWT_SECRET, { expiresIn: '8h' });
    return res.json({
      token,
      user: { id: user.id, name: user.name, username: user.username, role: user.role }
    });
  } catch (error) {
    return next(error);
  }
}

export function currentUser(req, res) {
  return res.json({ user: req.user });
}
