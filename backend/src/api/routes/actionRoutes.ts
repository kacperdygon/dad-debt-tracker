import { Router } from 'express';
import { getActionPageCount, getActions } from '@/api/controllers/actionController';


const router = Router();

router.get('/', getActions);
router.get('/page-count', getActionPageCount)

export default router;