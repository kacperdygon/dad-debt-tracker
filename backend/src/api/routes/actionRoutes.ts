import { Router } from 'express';
import { getActions } from '@/api/controllers/actionController';


const router = Router();

router.get('/', getActions);

export default router;