import mysql from 'mysql2/promise';

const required = ['DB_HOST', 'DB_USER', 'DB_NAME'];
for (const name of required) {
  if (!process.env[name]) {
    throw new Error(`Environment variable ${name} is required`);
  }
}

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  decimalNumbers: true
});
