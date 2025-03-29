import { Router } from 'express';
import {
  addEntry,
  deleteEntry,
  getEntries,
  patchEntry
} from '../controllers/entryController';
import { validateRequest } from '@/api/controllers/authController';

const router = Router();

router.use(validateRequest)

router.get('/', getEntries);
router.post('/', addEntry);
router.delete('/:id', deleteEntry);
router.patch('/:id', patchEntry);

export default router;
