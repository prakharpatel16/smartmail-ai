import { Router } from 'express';
import authRoutes from './auth.routes.js';
import gmailRoutes from './gmail.routes.js';
import emailRoutes from './email.routes.js';
import aiRoutes from './ai.routes.js';
import ragRoutes from './rag.routes.js';
import notificationRoutes from './notification.routes.js';
import preferenceRoutes from './preference.routes.js';

const router = Router();
router.use('/auth', authRoutes);
router.use('/gmail', gmailRoutes);
router.use('/emails', emailRoutes);
router.use('/ai', aiRoutes);
router.use('/rag', ragRoutes);
router.use('/notifications', notificationRoutes);
router.use('/preferences', preferenceRoutes);
export default router;
