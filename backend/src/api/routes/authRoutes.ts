import { Router } from 'express';
import { signIn, signOut, verifySession } from '../controllers/authController';

const router = Router();

router.post('/sign-in', signIn);
router.post('/is-signed-in', verifySession);
router.post('/sign-out', signOut);

export default router;
