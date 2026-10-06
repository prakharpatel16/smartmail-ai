import { UnrecoverableError, Worker } from 'bullmq';
import { closeQueues, emailSyncQueue, redisConnection } from '../queues/index.js';
import { env } from '../config/env.js';
import { connectDatabase } from '../config/database.js';
import { syncMailbox } from '../services/gmail.service.js';
import { pollConnectedMailboxes, releaseMailboxAutoSyncLease } from '../services/mailboxAutoSync.service.js';
import { processEmailAi } from '../services/ai/processing.service.js';
import { createNotification } from '../services/notification.service.js';
import { initializeSocketEmitter } from '../services/socketEvents.service.js';

if (!redisConnection) throw new Error('REDIS_URL is required to start the SmartMail worker.');
await connectDatabase();
initializeSocketEmitter();
await emailSyncQueue.upsertJobScheduler(
  'connected-mailboxes-auto-sync',
  { every: env.GMAIL_AUTO_SYNC_INTERVAL_MS },
  { name: 'poll-connected-mailboxes', data: {} }
);

const workers = [
  new Worker('email-sync', async (job) => {
    if (job.name === 'poll-connected-mailboxes') return pollConnectedMailboxes({ enqueue: true });
    if (!job.data.autoSync) return syncMailbox(job.data.userId, job.data.syncJobId || '');

    let completed = false;
    try {
      const result = await syncMailbox(job.data.userId, '', { syncDrafts: false });
      completed = true;
      return result;
    } finally {
      const attempts = Number(job.opts.attempts) || 1;
      if (completed || job.attemptsMade + 1 >= attempts) {
        try { await releaseMailboxAutoSyncLease(job.data.gmailAccountId, job.data.autoSyncLockUntil); }
        catch { console.error(JSON.stringify({ level: 'warn', code: 'AUTO_SYNC_LEASE_RELEASE_FAILED' })); }
      }
    }
  }, { connection: redisConnection, concurrency: 3 }),
  new Worker('ai-processing', async (job) => {
    try {
      return await processEmailAi(job.data);
    } catch (error) {
      if (['AI_RATE_LIMITED', 'AI_PROVIDER_CONFIGURATION', 'AI_MODEL_UNAVAILABLE', 'AI_SERVICE_UNAVAILABLE'].includes(error.code)) {
        throw new UnrecoverableError(error.message);
      }
      throw error;
    }
  }, { connection: redisConnection, concurrency: env.AI_WORKER_CONCURRENCY }),
  new Worker('notifications', (job) => createNotification(job.data), { connection: redisConnection, concurrency: 8 })
];

for (const worker of workers) {
  worker.on('failed', (job, error) => console.error(JSON.stringify({ level: 'error', code: 'QUEUE_JOB_FAILED', queue: worker.name, jobId: job?.id, attempt: job?.attemptsMade, message: error.code || 'JOB_FAILED' })));
}

console.log('SmartMail background workers are ready.');
async function shutdown() {
  await Promise.all(workers.map((worker) => worker.close()));
  await closeQueues();
  process.exit(0);
}
process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown);
