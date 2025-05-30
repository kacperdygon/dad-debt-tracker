import { Router } from 'express';
import entryRoutes from './routes/entryRoutes';
import authRoutes from './routes/authRoutes';
import actionRoutes from './routes/actionRoutes';
import { validateRequest } from '@/api/controllers/authController';

const router = Router();

router.use(validateRequest);

router.use('/entries', entryRoutes);
router.use('/auth', authRoutes);
router.use('/actions', actionRoutes)

export default router;
