import { Router } from 'express';
import {
  addEntry,
  deleteEntry,
  getEntries,
  getTotalDebt,
  patchEntry
} from '@/api/controllers/entries/entryController';
import { validateRequest } from '@/api/controllers/authController';
import { getChartData } from '@/api/controllers/entries/chartDataController';

const router = Router();

router.use(validateRequest)

router.get('/', getEntries);
router.post('/', addEntry);
router.delete('/:id', deleteEntry);
router.patch('/:id', patchEntry);

router.get('/chart-data', getChartData);
router.get('/total-debt', getTotalDebt);

export default router;
