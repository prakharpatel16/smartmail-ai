import { z } from 'zod';
import { Email, SyncJob } from '../models/index.js';
import { asyncHandler, AppError } from '../utils/AppError.js';
import { dashboardStats, dismissMeeting, getEmail, getThread, listEmails, updateEmailState, updatePriorityOverride } from '../services/email.service.js';
import { getSyncJob, requestMailboxSync, saveDraft, listDrafts, deleteDraft, sendEmail, downloadAttachment, downloadInlineImage } from '../services/gmail.service.js';

const contactSchema = z.object({ name: z.string().max(200).optional().default(''), email: z.string().email().max(254) }).strict();
const parseListField = (value) => {
  if (value === undefined || value === '') return [];
  if (Array.isArray(value)) return value;
  try { return JSON.parse(value); } catch { throw new AppError(400, 'VALIDATION_ERROR', 'Recipient list is invalid.'); }
};
const parseFormBoolean = z.preprocess((value) => typeof value === 'string' ? value === 'true' : value, z.boolean().default(false));
const prepareComposeInput = (body) => ({
  ...body,
  to: parseListField(body.to), cc: parseListField(body.cc), bcc: parseListField(body.bcc)
});
const composeSchema = z.object({
  draftId: z.string().regex(/^[a-f\d]{24}$/i).optional(),
  threadId: z.string().max(200).optional().default(''),
  inReplyTo: z.string().max(1000).optional().default(''), references: z.string().max(4000).optional().default(''),
  to: z.array(contactSchema).max(50).default([]), cc: z.array(contactSchema).max(50).default([]), bcc: z.array(contactSchema).max(50).default([]),
  subject: z.string().max(998).default(''), bodyText: z.string().max(100_000).default(''),
  aiGenerated: parseFormBoolean, removeExistingAttachments: parseFormBoolean,
  lastAiAction: z.enum(['WRITE', 'REWRITE', 'REPLY', 'NONE']).default('NONE')
}).strict();

export const list = asyncHandler(async (req, res) => {
  const data = await listEmails(req.user.id, req.query);
  res.json({ success: true, data });
});

export const stats = asyncHandler(async (req, res) => {
  const data = await dashboardStats(req.user.id);
  res.json({ success: true, data });
});

export const detail = asyncHandler(async (req, res) => {
  const email = await getEmail(req.user.id, req.params.id);
  res.json({ success: true, data: email });
});

export const thread = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await getThread(req.user.id, req.params.threadId) });
});

export const sync = asyncHandler(async (req, res) => {
  const result = await requestMailboxSync(req.user.id);
  res.status(result.status === 'queued' ? 202 : 200).json({ success: true, data: result });
});

export const syncStatus = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await getSyncJob(req.user.id, req.params.jobId) });
});

export const readState = asyncHandler(async (req, res) => {
  const isRead = z.boolean().parse(req.body.isRead);
  const email = await updateEmailState(req.user.id, req.params.id, { isRead });
  res.json({ success: true, data: { id: String(email._id), isRead: email.isRead } });
});

export const starState = asyncHandler(async (req, res) => {
  const isStarred = z.boolean().parse(req.body.isStarred);
  const email = await updateEmailState(req.user.id, req.params.id, { isStarred });
  res.json({ success: true, data: { id: String(email._id), isStarred: email.isStarred } });
});

export const priorityState = asyncHandler(async (req, res) => {
  const level = z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']).parse(req.body.level);
  const email = await updatePriorityOverride(req.user.id, req.params.id, level);
  res.json({ success: true, data: { id: String(email._id), priority: email.ai.priority } });
});

export const trash = asyncHandler(async (req, res) => {
  const trashState = req.body?.trash === undefined ? true : z.boolean().parse(req.body.trash);
  await updateEmailState(req.user.id, req.params.id, { trash: trashState });
  res.json({ success: true, message: trashState ? 'Email moved to Trash.' : 'Email restored to Inbox.' });
});

export const removeMeeting = asyncHandler(async (req, res) => {
  await dismissMeeting(req.user.id, req.params.id);
  res.json({ success: true, message: 'Meeting removed. The email remains in your inbox.' });
});

export const draftList = asyncHandler(async (req, res) => {
  res.json({ success: true, data: { items: await listDrafts(req.user.id) } });
});

export const saveDraftController = asyncHandler(async (req, res) => {
  const input = composeSchema.parse(prepareComposeInput(req.body));
  const draft = await saveDraft(req.user.id, input, req.files || []);
  res.status(200).json({ success: true, data: { draftId: String(draft._id), status: 'saved', updatedAt: draft.updatedAt } });
});

export const removeDraft = asyncHandler(async (req, res) => {
  await deleteDraft(req.user.id, req.params.id);
  res.json({ success: true, message: 'Draft deleted.' });
});

export const send = asyncHandler(async (req, res) => {
  const input = composeSchema.parse(prepareComposeInput(req.body));
  const result = await sendEmail(req.user.id, input, req.files || []);
  res.json({ success: true, data: result });
});

export const attachment = asyncHandler(async (req, res) => {
  const email = await getEmail(req.user.id, req.params.id);
  const file = await downloadAttachment(req.user.id, email, req.params.attachmentId);
  const safeName = file.filename.replace(/[\r\n"\\]/g, '_');
  res.setHeader('Content-Type', file.mimeType || 'application/octet-stream');
  res.setHeader('Content-Disposition', `attachment; filename="${safeName}"; filename*=UTF-8''${encodeURIComponent(file.filename)}`);
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.send(file.data);
});

export const inlineImage = asyncHandler(async (req, res) => {
  const contentId = z.string().min(1).max(512).parse(req.query.cid);
  const email = await getEmail(req.user.id, req.params.id);
  const file = await downloadInlineImage(req.user.id, email, contentId);
  res.setHeader('Content-Type', file.mimeType);
  res.setHeader('Content-Disposition', 'inline');
  res.setHeader('Cache-Control', 'private, max-age=300');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.send(file.data);
});

export const dashboard = asyncHandler(async (req, res) => {
  const data = await dashboardStats(req.user.id);
  res.json({ success: true, data });
});

export const syncJobList = asyncHandler(async (req, res) => {
  const items = await SyncJob.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(10).select('queueJobId status imported errorCode createdAt completedAt');
  res.json({ success: true, data: { items } });
});
