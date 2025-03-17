import { Router } from 'express'
import { signIn, verifySession } from '../controllers/authController';

const router = Router();

router.post('/', signIn)
router.post('/verify-session', verifySession)

export default router;