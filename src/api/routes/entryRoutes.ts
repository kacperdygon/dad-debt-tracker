import { Router } from 'express';
import {
  addEntry,
  deleteEntry,
  editEntry,
  getEntries,
} from '@/api/controllers/entryController';

const router = Router();

// router.get('/', )
router.get('/', getEntries);
router.post('/', addEntry);
router.put('/', editEntry);
router.delete('/', deleteEntry);

export default router;
