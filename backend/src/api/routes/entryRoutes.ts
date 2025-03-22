import { Router } from 'express';
import {
  addEntry,
  deleteEntry,
  updateEntry,
  getEntries,
  patchEntry
} from '../controllers/entryController';
import { validateRequest } from '@/api/controllers/authController';

const router = Router();

router.use(validateRequest)

router.get('/', getEntries);
router.post('/', addEntry);
router.put('/', updateEntry);
router.delete('/', deleteEntry);
router.patch('/:id', patchEntry);

export default router;
