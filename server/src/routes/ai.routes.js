import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { aiLimiter } from '../middleware/rateLimit.js';
import { summary, reply, writer, rewriter, priority, meeting, phishing, check } from '../controllers/ai.controller.js';

const router = Router();
router.use(requireAuth, aiLimiter);
router.post('/summary', summary);
router.post('/reply', reply);
router.post('/write', writer);
router.post('/rewrite', rewriter);
router.post('/priority', priority);
router.post('/meeting', meeting);
router.post('/phishing', phishing);
router.post('/check', check);
export default router;
