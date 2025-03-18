import { Router } from 'express'
import { addEntry } from '@/backend/api/controllers/entryController';

const router = Router();

// router.get('/', )
router.post('/', addEntry);

export default router;