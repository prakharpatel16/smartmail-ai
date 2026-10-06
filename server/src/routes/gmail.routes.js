import { Router } from 'express';
import { gmailCallback, gmailDisconnect, gmailStatus, startGmailConnect } from '../controllers/gmail.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.get('/connect', requireAuth, startGmailConnect);
router.get('/callback', gmailCallback);
router.get('/status', requireAuth, gmailStatus);
router.delete('/connection', requireAuth, gmailDisconnect);
export default router;
