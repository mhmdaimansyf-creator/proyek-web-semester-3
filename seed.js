import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { pool } from '../config/db.js';

const accounts = [
  {
    name: process.env.SEED_ADMIN_NAME,
    username: process.env.SEED_ADMIN_USERNAME,
    password: process.env.SEED_ADMIN_PASSWORD,
    role: 'admin'
  },
  {
    name: process.env.SEED_OWNER_NAME,
    username: process.env.SEED_OWNER_USERNAME,
    password: process.env.SEED_OWNER_PASSWORD,
    role: 'pemilik'
  }
];

try {
  for (const account of accounts) {
    const [existingRole] = await pool.execute(
      'SELECT id, username FROM users WHERE role = ? LIMIT 1',
      [account.role]
    );
    if (existingRole.length) {
      console.log(`Akun ${account.role} sudah tersedia (${existingRole[0].username}); tidak ada perubahan.`);
      continue;
    }

    if (!account.name?.trim() || !account.username?.trim() || !account.password || account.password.length < 12) {
      throw new Error(`Isi SEED_* untuk role ${account.role} dan gunakan password minimal 12 karakter.`);
    }

    const [existingUsername] = await pool.execute(
      'SELECT id, role FROM users WHERE username = ?',
      [account.username.trim()]
    );
    if (existingUsername.length) {
      throw new Error(`Username ${account.username} sudah digunakan untuk role ${existingUsername[0].role}.`);
    }

    const hash = await bcrypt.hash(account.password, 12);
    await pool.execute(
      'INSERT INTO users (name, username, password, role) VALUES (?, ?, ?, ?)',
      [account.name.trim(), account.username.trim(), hash, account.role]
    );
    console.log(`Akun ${account.role} siap: ${account.username}`);
  }
} catch (error) {
  console.error(`Gagal menyiapkan akun awal: ${error.message}`);
  process.exitCode = 1;
} finally {
  await pool.end();
}
