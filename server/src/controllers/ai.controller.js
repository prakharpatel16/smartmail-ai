import { z } from 'zod';
import { Email, UserPreference } from '../models/index.js';
import { asyncHandler, AppError } from '../utils/AppError.js';
import { getEmail, getThread } from '../services/email.service.js';
import { summarizeEmail } from '../services/ai/summary.service.js';
import { generateReply } from '../services/ai/reply.service.js';
import { writeEmail } from '../services/ai/writer.service.js';
import { rewriteEmail } from '../services/ai/rewriter.service.js';
import { classifyPriority } from '../services/ai/priority.service.js';
import { detectMeeting } from '../services/ai/meeting.service.js';
import { analyzePhishing } from '../services/ai/phishing.service.js';
import { checkEmail } from '../services/ai/aiCheck.service.js';

const emailIdSchema = z.object({ emailId: z.string().regex(/^[a-f\d]{24}$/i) }).strict();
const toneSchema = z.enum(['professional', 'friendly', 'formal', 'concise']);
const getOwned = async (userId, request) => {
  const { emailId } = emailIdSchema.parse(request);
  return getEmail(userId, emailId);
};

export const summary = asyncHandler(async (req, res) => {
  const email = await getOwned(req.user.id, req.body);
  const { messages } = await getThread(req.user.id, email.threadId);
  const result = await summarizeEmail(email, messages);
  await Email.updateOne({ _id: email._id, userId: req.user.id }, { $set: { 'ai.summary': result.summary, 'ai.processedAt': new Date() } });
  res.json({ success: true, data: result });
});

export const reply = asyncHandler(async (req, res) => {
  const body = z.object({ emailId: emailIdSchema.shape.emailId, tone: toneSchema.optional(), instruction: z.string().max(2000).optional().default('') }).strict().parse(req.body);
  const email = await getEmail(req.user.id, body.emailId);
  const thread = await getThread(req.user.id, email.threadId);
  const prefs = await UserPreference.findOne({ userId: req.user.id }).select('replyTone').lean();
  const result = await generateReply(email, thread.messages, { tone: body.tone || prefs?.replyTone || 'professional', instruction: body.instruction });
  res.json({ success: true, data: result });
});

export const writer = asyncHandler(async (req, res) => {
  const body = z.object({ instruction: z.string().trim().min(3).max(6000), context: z.string().max(6000).optional().default(''), tone: toneSchema.optional(), subjectHint: z.string().max(500).optional().default('') }).strict().parse(req.body);
  const prefs = await UserPreference.findOne({ userId: req.user.id }).select('writerTone').lean();
  const result = await writeEmail({ ...body, tone: body.tone || prefs?.writerTone || 'professional' });
  res.json({ success: true, data: result });
});

export const rewriter = asyncHandler(async (req, res) => {
  const body = z.object({ text: z.string().trim().min(1).max(20_000), mode: z.enum(['GRAMMAR', 'PROFESSIONAL', 'CONCISE', 'FRIENDLY', 'FORMAL', 'CLARITY']) }).strict().parse(req.body);
  res.json({ success: true, data: await rewriteEmail(body.text, body.mode) });
});

export const priority = asyncHandler(async (req, res) => {
  const email = await getOwned(req.user.id, req.body);
  const result = await classifyPriority(email);
  if (!email.ai.priority?.manuallyOverridden) await Email.updateOne({ _id: email._id, userId: req.user.id }, { $set: { 'ai.priority.level': result.level, 'ai.priority.reason': result.reason, 'ai.processedAt': new Date() } });
  res.json({ success: true, data: { ...result, manuallyOverridden: Boolean(email.ai.priority?.manuallyOverridden) } });
});

export const meeting = asyncHandler(async (req, res) => {
  const email = await getOwned(req.user.id, req.body);
  const result = await detectMeeting(email);
  await Email.updateOne({ _id: email._id, userId: req.user.id }, { $set: { 'ai.meetingDetected': result.meetingDetected, 'ai.meeting': result.meeting || {}, 'ai.processedAt': new Date() } });
  res.json({ success: true, data: result });
});

export const phishing = asyncHandler(async (req, res) => {
  const email = await getOwned(req.user.id, req.body);
  const result = await analyzePhishing(email);
  await Email.updateOne({ _id: email._id, userId: req.user.id }, { $set: { 'ai.phishing.risk': result.risk, 'ai.phishing.reasons': result.reasons, 'ai.processedAt': new Date() } });
  res.json({ success: true, data: { ...result, disclaimer: 'AI assessment only. Verify sensitive requests independently.' } });
});

export const check = asyncHandler(async (req, res) => {
  const body = z.object({
    to: z.array(z.object({ name: z.string().max(200).optional().default(''), email: z.string().email() })).max(50).default([]),
    cc: z.array(z.object({ name: z.string().max(200).optional().default(''), email: z.string().email() })).max(50).default([]),
    bcc: z.array(z.object({ name: z.string().max(200).optional().default(''), email: z.string().email() })).max(50).default([]),
    subject: z.string().max(998).default(''), bodyText: z.string().max(20_000),
    attachments: z.array(z.object({ filename: z.string().max(200), mimeType: z.string().max(200).optional(), size: z.number().nonnegative().optional() })).max(20).default([])
  }).strict().parse(req.body);
  if (!body.subject.trim() && !body.bodyText.trim()) throw new AppError(400, 'VALIDATION_ERROR', 'Add a subject or email body to check.');
  res.json({ success: true, data: await checkEmail(body) });
});
