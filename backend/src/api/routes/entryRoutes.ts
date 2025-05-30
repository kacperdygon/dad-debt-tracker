import { Router } from 'express';
import {
  addEntry,
  deleteEntry,
  getEntries,
  getTotalDebt,
  patchEntry,
  getUnconfirmedEntriesCount,
  getEntryPageCount,
  getEntryPosition
} from '@/api/controllers/entries/entryController';
import { getChartData } from '@/api/controllers/entries/chartDataController';

const router = Router();

router.get('/', getEntries);
router.post('/', addEntry);
router.delete('/:id', deleteEntry);
router.patch('/:id', patchEntry);

router.get('/chart-data', getChartData);
router.get('/total-debt', getTotalDebt);
router.get('/unconfirmed-count', getUnconfirmedEntriesCount);
router.get('/page-count', getEntryPageCount);
router.get('/position/:id', getEntryPosition)

export default router;
