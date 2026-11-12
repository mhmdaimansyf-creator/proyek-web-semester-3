import { pool } from '../config/db.js';
import { validateTransaction } from '../validation.js';

export async function listTransactions(req, res, next) {
  try {
    const [rows] = await pool.query(`
      SELECT t.id, t.type, t.quantity, t.notes, t.created_at,
             s.id AS spare_part_id, s.code AS spare_part_code, s.name AS spare_part_name,
             s.unit, u.name AS recorded_by
      FROM transactions t
      JOIN spare_parts s ON s.id = t.spare_part_id
      JOIN users u ON u.id = t.user_id
      ORDER BY t.created_at DESC, t.id DESC
      LIMIT 500
    `);
    return res.json({ items: rows });
  } catch (error) {
    return next(error);
  }
}

export async function createTransaction(req, res, next) {
  const validationError = validateTransaction(req.body);
  if (validationError) return res.status(400).json({ message: validationError });
  const { sparePartId, type, quantity, notes } = req.body;
  const partId = Number(sparePartId);

  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();
    const [parts] = await connection.execute(
      'SELECT id, stock FROM spare_parts WHERE id = ? FOR UPDATE',
      [partId]
    );
    if (!parts.length) {
      await connection.rollback();
      return res.status(404).json({ message: 'Spare part tidak ditemukan.' });
    }

    const currentStock = Number(parts[0].stock);
    if (type === 'out' && currentStock < quantity) {
      await connection.rollback();
      return res.status(409).json({ message: 'Stok tidak mencukupi untuk barang keluar.' });
    }
    if (type === 'in' && currentStock + quantity > 4294967295) {
      await connection.rollback();
      return res.status(409).json({ message: 'Jumlah transaksi melebihi kapasitas stok.' });
    }

    const change = type === 'in' ? quantity : -quantity;
    await connection.execute('UPDATE spare_parts SET stock = stock + ? WHERE id = ?', [change, partId]);
    await connection.execute(
      'INSERT INTO transactions (spare_part_id, user_id, type, quantity, notes) VALUES (?, ?, ?, ?, ?)',
      [partId, req.user.id, type, quantity, notes?.trim() || null]
    );
    await connection.commit();
    return res.status(201).json({ message: 'Transaksi berhasil dicatat.' });
  } catch (error) {
    if (connection) await connection.rollback();
    return next(error);
  } finally {
    connection?.release();
  }
}
