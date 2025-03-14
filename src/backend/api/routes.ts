import { Router } from 'express';
import entryRoutes from './routes/entryRoutes'
import authRoutes from './routes/authRoutes'

const router = Router();

router.use("/entries", entryRoutes);
router.use("/auth", authRoutes);

export default router;