import http from 'node:http';
import mongoose from 'mongoose';
import app from './app.js';
import { connectDatabase } from './config/database.js';
import { env, isProduction } from './config/env.js';
import { closeQueues } from './queues/index.js';
import { createSocketServer } from './socket.js';
import { startLocalMailboxAutoSync } from './services/mailboxAutoSync.service.js';

if (isProduction && !env.REDIS_URL) throw new Error('REDIS_URL is required in production for shared rate limits and background workers.');
if (isProduction && !env.TOKEN_ENCRYPTION_KEY) throw new Error('TOKEN_ENCRYPTION_KEY is required in production.');

await connectDatabase();
const stopLocalMailboxAutoSync = startLocalMailboxAutoSync();
const server = http.createServer(app);
const io = await createSocketServer(server);

server.listen(env.PORT, () => console.log(JSON.stringify({ level: 'info', event: 'api_listening', port: env.PORT, environment: env.NODE_ENV })));

let shuttingDown = false;
async function shutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log(JSON.stringify({ level: 'info', event: 'shutdown_started', signal }));
  stopLocalMailboxAutoSync();
  const timer = setTimeout(() => process.exit(1), 15_000);
  timer.unref();
  io.close();
  server.close(async () => {
    await Promise.allSettled([closeQueues(), mongoose.disconnect()]);
    clearTimeout(timer);
    process.exit(0);
  });
}
process.once('SIGINT', () => shutdown('SIGINT'));
process.once('SIGTERM', () => shutdown('SIGTERM'));

process.on('unhandledRejection', (error) => {
  console.error(JSON.stringify({ level: 'error', event: 'unhandled_rejection', code: error?.code || 'UNKNOWN' }));
});
