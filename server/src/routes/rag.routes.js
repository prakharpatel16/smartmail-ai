import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { aiLimiter } from '../middleware/rateLimit.js';
import { chat, history } from '../controllers/rag.controller.js';

const router = Router();
router.use(requireAuth);
router.get('/history', history);
router.post('/chat', aiLimiter, chat);
export default router;
