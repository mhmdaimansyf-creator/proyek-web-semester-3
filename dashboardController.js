import { pool } from '../config/db.js';

export async function getDashboard(req, res, next) {
  try {
    const [summaryRows] = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM spare_parts) AS part_count,
        (SELECT COALESCE(SUM(stock), 0) FROM spare_parts) AS total_stock,
        (SELECT COUNT(*) FROM spare_parts WHERE stock <= 5) AS low_stock_count,
        (SELECT COALESCE(SUM(quantity), 0) FROM transactions
          WHERE type = 'in' AND DATE(created_at) = CURRENT_DATE()) AS today_in,
        (SELECT COALESCE(SUM(quantity), 0) FROM transactions
          WHERE type = 'out' AND DATE(created_at) = CURRENT_DATE()) AS today_out
    `);
    const [recentTransactions] = await pool.query(`
      SELECT t.id, t.type, t.quantity, t.notes, t.created_at,
             s.code AS spare_part_code, s.name AS spare_part_name,
             u.name AS recorded_by
      FROM transactions t
      JOIN spare_parts s ON s.id = t.spare_part_id
      JOIN users u ON u.id = t.user_id
      ORDER BY t.created_at DESC, t.id DESC
      LIMIT 5
    `);
    return res.json({ summary: summaryRows[0], recentTransactions });
  } catch (error) {
    return next(error);
  }
}
