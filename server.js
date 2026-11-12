import 'dotenv/config';
import app from './app.js';
import { pool } from './config/db.js';

const port = Number(process.env.PORT || 5000);
const server = app.listen(port, async () => {
  try {
    await pool.query('SELECT 1');
    console.log(`API berjalan pada http://localhost:${port}`);
  } catch (error) {
    console.error('Gagal terhubung ke MySQL. Periksa layanan XAMPP dan konfigurasi .env.');
    console.error(error.code || error.message);
    server.close(() => process.exit(1));
  }
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    server.close(async () => {
      await pool.end();
      process.exit(0);
    });
  });
}
