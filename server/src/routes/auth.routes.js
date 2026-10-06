import { Router } from 'express';
import { loginUser, logoutUser, currentUser, registerUser, resendEmailVerification, verifyEmail } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { loginLimiter, verificationLimiter } from '../middleware/rateLimit.js';

const router = Router();
router.post('/register', loginLimiter, registerUser);
router.post('/verify-email', verificationLimiter, verifyEmail);
router.post('/resend-verification', verificationLimiter, resendEmailVerification);
router.post('/login', loginLimiter, loginUser);
router.post('/logout', requireAuth, logoutUser);
router.get('/me', requireAuth, currentUser);
export default router;
