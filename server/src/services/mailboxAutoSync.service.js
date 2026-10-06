import { env } from '../config/env.js';
import { GmailAccount } from '../models/index.js';
import { enqueueEmailSync, queuesEnabled } from '../queues/index.js';
import { syncMailbox } from './gmail.service.js';

const leaseDurationMs = Math.max(env.GMAIL_AUTO_SYNC_INTERVAL_MS * 5, 5 * 60 * 1000);
let localPollRunning = false;

export async function releaseMailboxAutoSyncLease(accountId, leaseUntil) {
  if (!accountId || !leaseUntil) return;
  await GmailAccount.updateOne(
    { _id: accountId, autoSyncLockUntil: new Date(leaseUntil) },
    { $set: { autoSyncLockUntil: null } }
  );
}

export async function pollConnectedMailboxes({ enqueue = queuesEnabled } = {}) {
  const now = new Date();
  const candidates = await GmailAccount.find({
    isConnected: true,
    lastSyncedAt: { $type: 'date' },
    $or: [{ autoSyncLockUntil: null }, { autoSyncLockUntil: { $lte: now } }]
  }).select('_id userId').lean();

  let scheduled = 0;
  for (const candidate of candidates) {
    const leaseUntil = new Date(Date.now() + leaseDurationMs);
    const account = await GmailAccount.findOneAndUpdate(
      {
        _id: candidate._id,
        isConnected: true,
        lastSyncedAt: { $type: 'date' },
        $or: [{ autoSyncLockUntil: null }, { autoSyncLockUntil: { $lte: now } }]
      },
      { $set: { autoSyncLockUntil: leaseUntil } },
      { returnDocument: 'after' }
    ).select('_id userId').lean();
    if (!account) continue;

    if (enqueue) {
      try {
        await enqueueEmailSync({
          userId: String(account.userId),
          autoSync: true,
          gmailAccountId: String(account._id),
          autoSyncLockUntil: leaseUntil.toISOString()
        }, `auto-sync-${account._id}-${Date.now()}`);
        scheduled += 1;
      } catch (error) {
        await releaseMailboxAutoSyncLease(account._id, leaseUntil);
        console.error(JSON.stringify({ level: 'warn', code: 'AUTO_SYNC_ENQUEUE_FAILED', reason: error.code || 'QUEUE_ERROR' }));
      }
      continue;
    }

    try {
      await syncMailbox(String(account.userId), '', { syncDrafts: false });
      scheduled += 1;
    } catch (error) {
      console.error(JSON.stringify({ level: 'warn', code: 'AUTO_SYNC_FAILED', reason: error.code || 'GMAIL_SYNC_FAILED' }));
    } finally {
      await releaseMailboxAutoSyncLease(account._id, leaseUntil);
    }
  }
  return { scheduled };
}

export function startLocalMailboxAutoSync() {
  if (queuesEnabled) return () => {};

  const poll = async () => {
    if (localPollRunning) return;
    localPollRunning = true;
    try {
      await pollConnectedMailboxes({ enqueue: false });
    } catch (error) {
      console.error(JSON.stringify({ level: 'warn', code: 'AUTO_SYNC_POLL_FAILED', reason: error.code || 'POLL_ERROR' }));
    } finally {
      localPollRunning = false;
    }
  };

  const timer = setInterval(() => { void poll(); }, env.GMAIL_AUTO_SYNC_INTERVAL_MS);
  timer.unref();
  void poll();
  return () => clearInterval(timer);
}
