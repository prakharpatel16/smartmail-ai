import { z } from 'zod';
import { asyncHandler } from '../utils/AppError.js';
import { answerInboxQuestion, getChatHistory } from '../services/ai/rag.service.js';

export const chat = asyncHandler(async (req, res) => {
  const body = z.object({ question: z.string().trim().min(3).max(4000), chatId: z.string().regex(/^[a-f\d]{24}$/i).optional() }).strict().parse(req.body);
  res.json({ success: true, data: await answerInboxQuestion(req.user.id, body.question, body.chatId) });
});

export const history = asyncHandler(async (req, res) => {
  const data = await getChatHistory(req.user.id, req.query.chatId);
  res.json({ success: true, data: Array.isArray(data) ? { items: data } : { chat: data } });
});
