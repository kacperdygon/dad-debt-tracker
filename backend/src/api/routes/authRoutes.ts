import { Router } from 'express';
import { signIn, signOut, verifySession } from '../controllers/authController';

const router = Router();

router.post('/sign-in', signIn);
router.post('/verify-session', verifySession);
router.post('/sign-out', signOut);

export default router;
