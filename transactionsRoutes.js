import { Router } from 'express';
import { createTransaction, listTransactions } from '../controllers/transactionsController.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();
router.get('/', listTransactions);
router.post('/', requireAdmin, createTransaction);
export default router;
