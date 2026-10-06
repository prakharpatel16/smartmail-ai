import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getPreferences, updatePreferences } from '../controllers/preference.controller.js';

const router = Router();
router.use(requireAuth);
router.get('/', getPreferences);
router.put('/', updatePreferences);
export default router;
