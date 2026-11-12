import { Router } from 'express';
import {
  createSparePart, deleteSparePart, listSpareParts, updateSparePart
} from '../controllers/sparePartsController.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();
router.get('/', listSpareParts);
router.post('/', requireAdmin, createSparePart);
router.put('/:id', requireAdmin, updateSparePart);
router.delete('/:id', requireAdmin, deleteSparePart);
export default router;
