import { pool } from '../config/db.js';

export async function getInventoryReport(req, res, next) {
  try {
    const [inventory] = await pool.query(`
      SELECT id, code, name, category, unit, stock, description
      FROM spare_parts
      ORDER BY name
    `);
    const [transactions] = await pool.query(`
      SELECT t.id, t.type, t.quantity, t.notes, t.created_at,
             s.code AS spare_part_code, s.name AS spare_part_name, s.unit,
             u.name AS recorded_by
      FROM transactions t
      JOIN spare_parts s ON s.id = t.spare_part_id
      JOIN users u ON u.id = t.user_id
      ORDER BY t.created_at DESC, t.id DESC
      LIMIT 500
    `);
    return res.json({ inventory, transactions, generatedAt: new Date().toISOString() });
  } catch (error) {
    return next(error);
  }
}
