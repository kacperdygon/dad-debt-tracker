import { Router } from 'express';
import {
  addEntry,
  deleteEntry,
  updateEntry,
  getEntries,
} from '../controllers/entryController';

const router = Router();

// router.get('/', )
router.get('/', getEntries);
router.post('/', addEntry);
router.put('/', updateEntry);
router.delete('/', deleteEntry);

export default router;
