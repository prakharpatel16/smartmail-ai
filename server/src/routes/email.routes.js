import { Router } from 'express';
import multer from 'multer';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler, AppError } from '../utils/AppError.js';
import { aiLimiter, syncLimiter, sendLimiter } from '../middleware/rateLimit.js';
import {
  list, stats, detail, thread, sync, syncStatus, readState, starState, priorityState, trash, removeMeeting,
  draftList, saveDraftController, removeDraft, send, attachment, inlineImage, dashboard, syncJobList
} from '../controllers/email.controller.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { files: 5, fileSize: 10 * 1024 * 1024, fields: 20, fieldSize: 120_000 }
});
const handleUpload = (req, res, next) => upload.array('attachments', 5)(req, res, (error) => {
  if (!error) {
    const total = (req.files || []).reduce((sum, file) => sum + file.size, 0);
    if (total > 20 * 1024 * 1024) return next(new AppError(413, 'PAYLOAD_TOO_LARGE', 'Attachments must total 20 MB or less.'));
    return next();
  }
  if (error instanceof multer.MulterError) return next(new AppError(413, 'PAYLOAD_TOO_LARGE', 'Attachments exceed the allowed size or count.'));
  next(error);
});

const router = Router();
router.use(requireAuth);
router.get('/stats', stats);
router.get('/dashboard', dashboard);
router.get('/search', list);
router.get('/sync/jobs', syncJobList);
router.post('/sync', syncLimiter, sync);
router.get('/sync/:jobId', syncStatus);
router.get('/thread/:threadId', thread);
router.get('/drafts', draftList);
router.post('/draft', aiLimiter, handleUpload, saveDraftController);
router.put('/draft', aiLimiter, handleUpload, saveDraftController);
router.delete('/drafts/:id', removeDraft);
router.post('/send', sendLimiter, handleUpload, send);
router.get('/', list);
router.get('/:id/inline-image', inlineImage);
router.get('/:id/attachment/:attachmentId', attachment);
router.put('/:id/read', readState);
router.put('/:id/star', starState);
router.put('/:id/priority', priorityState);
router.patch('/:id/trash', trash);
router.patch('/:id/meeting', removeMeeting);
router.get('/:id', detail);
export default router;
