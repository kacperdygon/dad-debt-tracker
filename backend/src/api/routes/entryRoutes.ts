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
router.put('/:id', updateEntry);
router.delete('/:id', deleteEntry);
router.patch('/:id', patchEntry);

export default router;
