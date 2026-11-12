import { pool } from '../config/db.js';
import { validateSparePart } from '../validation.js';

export async function listSpareParts(req, res, next) {
  const search = typeof req.query.search === 'string' ? req.query.search.trim().slice(0, 100) : '';
  try {
    const [rows] = await pool.execute(
      `SELECT id, code, name, category, unit, stock, description, created_at, updated_at
       FROM spare_parts
       WHERE code LIKE ? OR name LIKE ? OR COALESCE(category, '') LIKE ?
       ORDER BY name`,
      [`%${search}%`, `%${search}%`, `%${search}%`]
    );
    return res.json({ items: rows });
  } catch (error) {
    return next(error);
  }
}

export async function createSparePart(req, res, next) {
  const validationError = validateSparePart(req.body);
  if (validationError) return res.status(400).json({ message: validationError });
  try {
    const { code, name, category, unit, description } = req.body;
    const [result] = await pool.execute(
      `INSERT INTO spare_parts (code, name, category, unit, stock, description)
       VALUES (?, ?, ?, ?, 0, ?)`,
      [code.trim(), name.trim(), category?.trim() || null, unit.trim(), description?.trim() || null]
    );
    return res.status(201).json({ message: 'Data spare part berhasil ditambahkan.', id: result.insertId });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Kode spare part sudah digunakan.' });
    }
    return next(error);
  }
}

export async function updateSparePart(req, res, next) {
  const id = Number(req.params.id);
  const validationError = validateSparePart(req.body);
  if (!Number.isSafeInteger(id) || id < 1) return res.status(400).json({ message: 'ID spare part tidak valid.' });
  if (validationError) return res.status(400).json({ message: validationError });

  try {
    const { code, name, category, unit, description } = req.body;
    const [result] = await pool.execute(
      `UPDATE spare_parts SET code = ?, name = ?, category = ?, unit = ?, description = ?
       WHERE id = ?`,
      [code.trim(), name.trim(), category?.trim() || null, unit.trim(), description?.trim() || null, id]
    );
    if (!result.affectedRows) return res.status(404).json({ message: 'Spare part tidak ditemukan.' });
    return res.json({ message: 'Data spare part berhasil diperbarui.' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Kode spare part sudah digunakan.' });
    }
    return next(error);
  }
}

export async function deleteSparePart(req, res, next) {
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id < 1) return res.status(400).json({ message: 'ID spare part tidak valid.' });
  try {
    const [result] = await pool.execute('DELETE FROM spare_parts WHERE id = ?', [id]);
    if (!result.affectedRows) return res.status(404).json({ message: 'Spare part tidak ditemukan.' });
    return res.json({ message: 'Data spare part berhasil dihapus.' });
  } catch (error) {
    if (error.code === 'ER_ROW_IS_REFERENCED_2' || error.code === 'ER_ROW_IS_REFERENCED') {
      return res.status(409).json({ message: 'Spare part yang memiliki riwayat transaksi tidak dapat dihapus.' });
    }
    return next(error);
  }
}
