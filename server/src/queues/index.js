import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import { env } from '../config/env.js';

export const queuesEnabled = Boolean(env.REDIS_URL);
export const redisConnection = queuesEnabled ? new IORedis(env.REDIS_URL, { maxRetriesPerRequest: null, enableReadyCheck: true }) : null;
export const emailSyncQueue = queuesEnabled ? new Queue('email-sync', { connection: redisConnection, defaultJobOptions: {
  attempts: 4, backoff: { type: 'exponential', delay: 2_000 }, removeOnComplete: { age: 86_400, count: 2000 }, removeOnFail: { age: 604_800, count: 5000 }
} }) : null;
export const aiProcessingQueue = queuesEnabled ? new Queue('ai-processing', { connection: redisConnection, defaultJobOptions: {
  attempts: 3, backoff: { type: 'exponential', delay: 3_000 }, removeOnComplete: { age: 86_400, count: 5000 }, removeOnFail: { age: 604_800, count: 5000 }
} }) : null;
export const notificationsQueue = queuesEnabled ? new Queue('notifications', { connection: redisConnection, defaultJobOptions: {
  attempts: 5, backoff: { type: 'exponential', delay: 1_000 }, removeOnComplete: { age: 86_400, count: 3000 }, removeOnFail: { age: 604_800, count: 5000 }
} }) : null;

const localAiJobs = [];
let localAiActive = 0;
const localAiConcurrency = env.AI_WORKER_CONCURRENCY;

async function processLocalAiJob(data) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const { processEmailAi } = await import('../services/ai/processing.service.js');
      await processEmailAi(data);
      return;
    }
    catch (error) {
      if (attempt === 2 || ['AI_RATE_LIMITED', 'AI_PROVIDER_CONFIGURATION', 'AI_MODEL_UNAVAILABLE', 'AI_SERVICE_UNAVAILABLE'].includes(error.code)) {
        console.error(JSON.stringify({ level: 'warn', code: 'LOCAL_AI_JOB_FAILED', emailId: data.emailId, reason: error.code || 'AI_PROCESSING_FAILED' }));
        return;
      } else {
        await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
      }
    }
  }
}

function pumpLocalAiJobs() {
  while (localAiActive < localAiConcurrency && localAiJobs.length) {
    const data = localAiJobs.shift();
    localAiActive += 1;
    void processLocalAiJob(data).catch((error) => {
      console.error(JSON.stringify({ level: 'error', code: 'LOCAL_AI_QUEUE_FAILED', emailId: data.emailId, reason: error.code || 'AI_PROCESSING_FAILED' }));
    }).finally(() => { localAiActive -= 1; pumpLocalAiJobs(); });
  }
}

export async function enqueueEmailSync(data, jobId) {
  if (!emailSyncQueue) {
    const error = new Error('Redis queues are not configured');
    error.code = 'QUEUE_NOT_CONFIGURED';
    throw error;
  }
  await emailSyncQueue.add('sync-mailbox', data, { jobId });
}

export async function enqueueAiProcessing(data) {
  if (!aiProcessingQueue) {
    localAiJobs.push(data);
    pumpLocalAiJobs();
    return true;
  }
  await aiProcessingQueue.add('analyze-email', data, { jobId: `ai-${data.emailId}-${data.attempt || 1}` });
  return true;
}

export async function enqueueNotification(data) {
  if (!notificationsQueue) {
    const { createNotification } = await import('../services/notification.service.js');
    return createNotification(data);
  }
  await notificationsQueue.add('persist-notification', data);
  return true;
}

export async function closeQueues() {
  await Promise.all([emailSyncQueue?.close(), aiProcessingQueue?.close(), notificationsQueue?.close()].filter(Boolean));
  await redisConnection?.quit();
}
