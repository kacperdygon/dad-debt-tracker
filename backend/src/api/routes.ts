import { Router } from 'express';
import entryRoutes from './routes/entryRoutes';
import authRoutes from './routes/authRoutes';
import actionRoutes from './routes/actionRoutes';

const router = Router();

router.use('/entries', entryRoutes);
router.use('/auth', authRoutes);
router.use('/actions', actionRoutes)

export default router;
