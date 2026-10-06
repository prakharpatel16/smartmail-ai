import { Email, UserPreference } from '../../models/index.js';
import { enqueueNotification } from '../../queues/index.js';
import { emitToUser } from '../socketEvents.service.js';
import { summarizeEmail } from './summary.service.js';
import { classifyPriority } from './priority.service.js';
import { detectMeeting } from './meeting.service.js';
import { analyzePhishing } from './phishing.service.js';
import { embedEmail } from './embedding.service.js';

export async function processEmailAi({ userId, emailId }) {
  const email = await Email.findOne({ _id: emailId, userId });
  if (!email) return;
  const prefs = await UserPreference.findOne({ userId }).lean();
  const features = prefs?.aiFeatures || {};
  await Email.updateOne({ _id: email._id, userId }, { $set: { 'aiProcessing.status': 'PROCESSING', 'aiProcessing.startedAt': new Date() }, $inc: { 'aiProcessing.attempts': 1 } });
  emitToUser(userId, 'ai:processing', { emailId: String(email._id), operation: 'analysis' });

  const tasks = [
    ['summary', () => summarizeEmail(email)],
    ...(features.priorityDetection === false ? [] : [['priority', () => classifyPriority(email)]]),
    ...(features.meetingDetection === false ? [] : [['meeting', () => detectMeeting(email)]]),
    ...(features.phishingDetection === false ? [] : [['phishing', () => analyzePhishing(email)]]),
    ['embedding', () => embedEmail(email)]
  ];
  const completedTasks = new Set(email.aiProcessing?.completedTasks || []);
  const pendingTasks = tasks.filter(([key]) => !completedTasks.has(key));
  const results = [];
  let failureCode = '';
  for (const [key, task] of pendingTasks) {
    try {
      results.push({ key, status: 'fulfilled', value: await task() });
      completedTasks.add(key);
    } catch (reason) {
      results.push({ key, status: 'rejected', reason });
      // Embeddings are optional; text-based inbox search still works without them.
      if (key !== 'embedding') {
        failureCode ||= reason?.code || 'AI_PROCESSING_FAILED';
        break;
      }
    }
  }
  const updates = {};
  const notifications = [];
  for (const result of results) {
    const { key } = result;
    if (result.status === 'rejected') continue;
    const value = result.value;
    if (key === 'summary') updates['ai.summary'] = value.summary;
    if (key === 'priority') {
      if (!email.ai.priority?.manuallyOverridden) {
        updates['ai.priority.level'] = value.level;
        updates['ai.priority.reason'] = value.reason;
      }
      if (value.level === 'CRITICAL' || value.level === 'HIGH') notifications.push({ type: 'HIGH_PRIORITY', title: `${value.level === 'CRITICAL' ? 'Critical' : 'High priority'} email`, message: value.reason, relatedEmailId: email._id });
    }
    if (key === 'meeting') {
      updates['ai.meetingDetected'] = value.meetingDetected;
      updates['ai.meeting'] = value.meeting || {};
      if (value.meetingDetected) notifications.push({ type: 'MEETING', title: 'Meeting details detected', message: value.meeting?.title || email.subject, relatedEmailId: email._id });
    }
    if (key === 'phishing') {
      updates['ai.phishing.risk'] = value.risk;
      updates['ai.phishing.reasons'] = value.reasons;
      if (value.risk !== 'SAFE') notifications.push({ type: 'PHISHING_ALERT', title: 'Review an email security assessment', message: 'AI identified indicators worth checking.', relatedEmailId: email._id });
    }
  }
  const status = failureCode ? 'FAILED' : 'COMPLETED';
  Object.assign(updates, {
    ...(status === 'COMPLETED' ? { 'ai.processedAt': new Date() } : {}),
    'aiProcessing.status': status,
    'aiProcessing.lastError': failureCode,
    'aiProcessing.completedTasks': [...completedTasks],
    ...(status === 'COMPLETED' ? { 'aiProcessing.completedAt': new Date() } : {})
  });
  await Email.updateOne({ _id: email._id, userId }, { $set: updates });
  for (const notification of notifications) await enqueueNotification({ userId: String(userId), ...notification });
  emitToUser(userId, 'ai:completed', { emailId: String(email._id), operation: 'analysis', status: status.toLowerCase() });
  if (failureCode) throw Object.assign(new Error('AI email processing failed'), { code: failureCode });
}
