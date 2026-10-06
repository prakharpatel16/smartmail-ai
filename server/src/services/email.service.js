import mongoose from 'mongoose';
import { Email } from '../models/index.js';
import { AppError } from '../utils/AppError.js';
import { mutateGmailEmail, loadThread, sanitizeEmailHtml } from './gmail.service.js';

const asBool = (value) => value === 'true' ? true : value === 'false' ? false : undefined;
const safeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function listFilter(userId, query = {}) {
  const filter = { userId };
  if (query.search) {
    const escaped = safeRegex(String(query.search).slice(0, 100));
    filter.$or = [
      { subject: { $regex: escaped, $options: 'i' } },
      { 'sender.name': { $regex: escaped, $options: 'i' } },
      { 'sender.email': { $regex: escaped, $options: 'i' } },
      { snippet: { $regex: escaped, $options: 'i' } },
      { bodyText: { $regex: escaped, $options: 'i' } }
    ];
  }
  if (query.q) filter.$text = { $search: String(query.q).slice(0, 200) };
  if (query.label) filter.labels = String(query.label).slice(0, 100);
  if (query.view === 'starred') filter.isStarred = true;
  if (query.view === 'sent') filter.labels = 'SENT';
  if (query.view === 'trash') filter.labels = 'TRASH';
  if (query.view === 'inbox' || !query.view) filter.labels = filter.labels || 'INBOX';
  const isRead = asBool(query.isRead);
  const isStarred = asBool(query.isStarred);
  if (isRead !== undefined) filter.isRead = isRead;
  if (isStarred !== undefined) filter.isStarred = isStarred;
  if (query.priority) filter['ai.priority.level'] = query.priority;
  if (asBool(query.meetingDetected) !== undefined) filter['ai.meetingDetected'] = asBool(query.meetingDetected);
  if (query.phishingRisk) filter['ai.phishing.risk'] = query.phishingRisk;
  if (query.hasAttachments === 'true') filter.hasAttachments = true;
  return filter;
}

export async function listEmails(userId, query = {}) {
  const page = Math.max(1, Math.min(100_000, Number(query.page) || 1));
  const limit = Math.max(1, Math.min(100, Number(query.limit) || 25));
  const sort = query.sort === 'oldest' ? { receivedAt: 1, _id: 1 }
    : query.sort === 'priority' ? { 'ai.priority.level': 1, receivedAt: -1 }
    : query.sort === 'sender' ? { 'sender.email': 1, receivedAt: -1 }
    : { receivedAt: -1, _id: -1 };
  const filter = listFilter(userId, query);
  const [items, total] = await Promise.all([
    Email.find(filter).sort(sort).skip((page - 1) * limit).limit(limit).select('sender recipients subject snippet receivedAt labels isRead isStarred hasAttachments attachments ai.priority ai.meetingDetected ai.phishing aiProcessing threadId'),
    Email.countDocuments(filter)
  ]);
  // Keep Mongo's identifier for existing clients while also exposing a stable
  // string `id` for clients that prefer API-style identifiers.
  return { items: items.map((item) => ({ ...item.toObject(), id: String(item._id) })), page, limit, total, pages: Math.ceil(total / limit) };
}

export async function getEmail(userId, emailId) {
  if (!mongoose.isValidObjectId(emailId)) throw new AppError(400, 'VALIDATION_ERROR', 'Invalid email identifier.');
  const email = await Email.findOne({ _id: emailId, userId }).select('+bodyHtml');
  if (!email) throw new AppError(404, 'RESOURCE_NOT_FOUND', 'Email was not found.');
  // Old messages may have been stored before escaped HTML bodies were normalized.
  // Normalize and sanitize again at read time so they display as email content.
  email.bodyHtml = sanitizeEmailHtml(email.bodyHtml || '');
  return email;
}

export async function getThread(userId, threadId) {
  const messages = await loadThread(userId, threadId);
  if (!messages.length) throw new AppError(404, 'RESOURCE_NOT_FOUND', 'Email thread was not found.');
  for (const message of messages) {
    message.bodyHtml = sanitizeEmailHtml(message.bodyHtml || '');
  }
  return { threadId, messages };
}

export async function updateEmailState(userId, emailId, changes) {
  const email = await getEmail(userId, emailId);
  return mutateGmailEmail(userId, email, changes);
}

export async function updatePriorityOverride(userId, emailId, level) {
  const email = await getEmail(userId, emailId);
  email.ai.priority.level = level;
  email.ai.priority.manuallyOverridden = true;
  await email.save();
  return email;
}

export async function dismissMeeting(userId, emailId) {
  if (!mongoose.isValidObjectId(emailId)) throw new AppError(400, 'VALIDATION_ERROR', 'Invalid email identifier.');
  const email = await Email.findOneAndUpdate(
    { _id: emailId, userId, 'ai.meetingDetected': true },
    {
      $set: {
        'ai.meetingDetected': false,
        'ai.meeting.title': '',
        'ai.meeting.date': '',
        'ai.meeting.time': '',
        'ai.meeting.timezone': '',
        'ai.meeting.location': '',
        'ai.meeting.meetingLink': '',
        'ai.meeting.participants': []
      }
    },
    { new: true, projection: { _id: 1 } }
  );
  if (!email) throw new AppError(404, 'RESOURCE_NOT_FOUND', 'Email was not found.');
  return email;
}

export async function dashboardStats(userId) {
  const [total, unread, highPriority, meetings, phishing, needsAttention, upcomingMeetings] = await Promise.all([
    Email.countDocuments({ userId, labels: 'INBOX' }),
    Email.countDocuments({ userId, labels: 'INBOX', isRead: false }),
    Email.countDocuments({ userId, labels: 'INBOX', 'ai.priority.level': { $in: ['CRITICAL', 'HIGH'] } }),
    Email.countDocuments({ userId, labels: 'INBOX', 'ai.meetingDetected': true }),
    Email.countDocuments({ userId, labels: 'INBOX', 'ai.phishing.risk': { $in: ['SUSPICIOUS', 'HIGH_RISK'] } }),
    Email.find({ userId, labels: 'INBOX', 'ai.priority.level': { $in: ['CRITICAL', 'HIGH'] } }).sort({ receivedAt: -1 }).limit(5).select('sender subject snippet receivedAt isRead ai.priority ai.meetingDetected ai.phishing'),
    Email.find({ userId, labels: 'INBOX', 'ai.meetingDetected': true, 'ai.meeting.date': { $gte: new Date().toISOString().slice(0, 10) } }).sort({ 'ai.meeting.date': 1 }).limit(5).select('sender subject receivedAt ai.meeting')
  ]);
  return { total, unread, highPriority, meetings, phishing, needsAttention, upcomingMeetings };
}

export async function overview(userId) {
  const [emails, stats] = await Promise.all([listEmails(userId, { page: 1, limit: 8, view: 'inbox' }), dashboardStats(userId)]);
  return { ...stats, latestEmails: emails.items };
}
