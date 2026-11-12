import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { pool } from '../config/db.js';

const targets = [
  { username: 'admin', role: 'admin', label: 'Admin' },
  { username: 'pemilik', role: 'pemilik', label: 'Pemilik' }
];

function readHidden(prompt) {
  const input = process.stdin;
  if (!input.isTTY || typeof input.setRawMode !== 'function') {
    throw new Error('Jalankan perintah ini dari terminal interaktif agar password tidak terlihat.');
  }

  return new Promise((resolve, reject) => {
    let value = '';
    const cleanup = () => {
      input.off('data', onData);
      input.setRawMode(false);
      input.pause();
      process.stdout.write('\n');
    };
    const onData = (chunk) => {
      for (const character of chunk.toString('utf8')) {
        if (character === '\u0003') {
          cleanup();
          reject(new Error('Input dibatalkan.'));
          return;
        }
        if (character === '\r' || character === '\n') {
          cleanup();
          resolve(value);
          return;
        }
        if (character === '\u007f' || character === '\b') {
          value = value.slice(0, -1);
        } else if (character >= ' ') {
          value += character;
        }
      }
    };

    process.stdout.write(prompt);
    input.setEncoding('utf8');
    input.setRawMode(true);
    input.resume();
    input.on('data', onData);
  });
}

async function promptForPassword(label) {
  const password = await readHidden(`Password baru ${label} (minimal 12 karakter): `);
  if (password.length < 12 || password.length > 200) {
    throw new Error('Password harus memiliki panjang 12 sampai 200 karakter.');
  }
  const confirmation = await readHidden(`Ulangi password baru ${label}: `);
  if (password !== confirmation) {
    throw new Error(`Konfirmasi password ${label} tidak cocok.`);
  }
  return password;
}

let connection;
let adminPassword;
let ownerPassword;

try {
  const [accounts] = await pool.execute(
    'SELECT id, username, role FROM users WHERE username IN (?, ?)',
    targets.map(({ username }) => username)
  );
  const accountByUsername = new Map(accounts.map((account) => [account.username, account]));
  for (const target of targets) {
    const account = accountByUsername.get(target.username);
    if (!account || account.role !== target.role) {
      throw new Error(`Akun ${target.label} tidak ditemukan atau role tidak sesuai; tidak ada perubahan.`);
    }
  }

  console.log('Akun yang akan diperbarui:');
  for (const target of targets) {
    const account = accountByUsername.get(target.username);
    console.log(`ID ${account.id} — ${target.username} (${target.role})`);
  }
  adminPassword = await promptForPassword('Admin');
  ownerPassword = await promptForPassword('Pemilik');

  const hashes = [
    await bcrypt.hash(adminPassword, 12),
    await bcrypt.hash(ownerPassword, 12)
  ];
  adminPassword = '';
  ownerPassword = '';

  connection = await pool.getConnection();
  await connection.beginTransaction();
  const [lockedAccounts] = await connection.execute(
    'SELECT id, username, role FROM users WHERE username IN (?, ?) FOR UPDATE',
    targets.map(({ username }) => username)
  );
  const lockedByUsername = new Map(lockedAccounts.map((account) => [account.username, account]));
  for (const target of targets) {
    const before = accountByUsername.get(target.username);
    const current = lockedByUsername.get(target.username);
    if (!current || current.id !== before.id || current.role !== target.role) {
      throw new Error(`Akun ${target.label} berubah setelah pemeriksaan; tidak ada perubahan.`);
    }
  }

  for (const [index, target] of targets.entries()) {
    const account = lockedByUsername.get(target.username);
    const [result] = await connection.execute(
      'UPDATE users SET password = ?, updated_at = updated_at WHERE id = ? AND username = ? AND role = ?',
      [hashes[index], account.id, target.username, target.role]
    );
    if (result.affectedRows !== 1) {
      throw new Error(`Pembaruan akun ${target.label} tidak berhasil; perubahan dibatalkan.`);
    }
  }

  const [updatedAccounts] = await connection.execute(
    'SELECT id, username, role, password FROM users WHERE username IN (?, ?)',
    targets.map(({ username }) => username)
  );
  const updatedByUsername = new Map(updatedAccounts.map((account) => [account.username, account]));
  for (const [index, target] of targets.entries()) {
    const account = updatedByUsername.get(target.username);
    if (!account || account.role !== target.role ||
        account.id !== lockedByUsername.get(target.username).id ||
        account.password !== hashes[index]) {
      throw new Error(`Verifikasi hash akun ${target.label} gagal; perubahan dibatalkan.`);
    }
  }

  await connection.commit();
  console.log('Password kedua akun berhasil diperbarui. ID, username, role, dan updated_at tetap.');
} catch (error) {
  if (connection) await connection.rollback();
  console.error(`Reset password gagal: ${error.message}`);
  process.exitCode = 1;
} finally {
  connection?.release();
  await pool.end();
}
