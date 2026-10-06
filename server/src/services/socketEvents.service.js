import IORedis from 'ioredis';
import { Emitter } from '@socket.io/redis-emitter';
import { env } from '../config/env.js';

let localIo;
let emitter;

export function setSocketServer(io) { localIo = io; }
export function initializeSocketEmitter() {
  if (env.REDIS_URL && !emitter) emitter = new Emitter(new IORedis(env.REDIS_URL, { maxRetriesPerRequest: null, enableReadyCheck: true }));
}
export function emitToUser(userId, event, payload) {
  const room = `user:${String(userId)}`;
  if (localIo) localIo.to(room).emit(event, payload);
  else emitter?.to(room).emit(event, payload);
}
