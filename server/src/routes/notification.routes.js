import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { listNotifications, markAllRead, markNotificationRead } from '../controllers/notification.controller.js';

const router = Router();
router.use(requireAuth);
router.get('/', listNotifications);
router.put('/read-all', markAllRead);
router.put('/:id/read', markNotificationRead);
export default router;
