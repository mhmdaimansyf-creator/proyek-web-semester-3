import express from 'express';
import cors from 'cors';
import { authenticate } from './middleware/auth.js';
import authRoutes from './routes/authRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import sparePartsRoutes from './routes/sparePartsRoutes.js';
import transactionsRoutes from './routes/transactionsRoutes.js';
import reportsRoutes from './routes/reportsRoutes.js';

const app = express();
app.disable('x-powered-by');
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
app.use(express.json({ limit: '20kb' }));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api', authenticate);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/spare-parts', sparePartsRoutes);
app.use('/api/transactions', transactionsRoutes);
app.use('/api/reports', reportsRoutes);

app.use((req, res) => res.status(404).json({ message: 'Endpoint tidak ditemukan.' }));
app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  if (error instanceof SyntaxError && 'body' in error) {
    return res.status(400).json({ message: 'Format JSON tidak valid.' });
  }
  if (error.code === 'ER_NO_SUCH_TABLE' || error.code === 'ECONNREFUSED' ||
      error.code === 'ER_BAD_DB_ERROR' || error.code === 'ENOTFOUND') {
    console.error('Database is unavailable or not initialized:', error.code);
    return res.status(503).json({ message: 'Database tidak tersedia. Periksa konfigurasi dan layanan MySQL.' });
  }
  console.error('Unhandled API error:', error);
  return res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
});

export default app;
