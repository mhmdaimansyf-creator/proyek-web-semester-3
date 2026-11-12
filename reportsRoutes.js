import { Router } from 'express';
import { getInventoryReport } from '../controllers/reportsController.js';

const router = Router();
router.get('/inventory', getInventoryReport);
export default router;
