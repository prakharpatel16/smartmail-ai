import { rateLimit, ipKeyGenerator } from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import { env } from '../config/env.js';
import { queuesEnabled, redisConnection } from '../queues/index.js';

const common = (prefix) => ({
  standardHeaders: 'draft-8', legacyHeaders: false,
  ...(queuesEnabled ? { store: new RedisStore({ prefix, sendCommand: (...args) => redisConnection.call(...args) }) } : {}),
  handler: (_req, res) => res.status(429).json({ success: false, error: { code: 'RATE_LIMITED', message: 'Too many requests. Please try again shortly.' } })
});
const keyFor = (req) => req.user?.id ? `user:${req.user.id}` : ipKeyGenerator(req.ip || 'unknown');

export const apiLimiter = rateLimit({ ...common('rl:api:'), windowMs: 15 * 60 * 1000, limit: 600, keyGenerator: keyFor });
export const loginLimiter = rateLimit({ ...common('rl:auth:'), windowMs: 15 * 60 * 1000, limit: 12, keyGenerator: keyFor });
export const verificationLimiter = rateLimit({ ...common('rl:verify:'), windowMs: 15 * 60 * 1000, limit: 20, keyGenerator: keyFor });
export const aiLimiter = rateLimit({ ...common('rl:ai:'), windowMs: 60 * 1000, limit: 20, keyGenerator: keyFor });
export const syncLimiter = rateLimit({ ...common('rl:sync:'), windowMs: 60 * 1000, limit: 3, keyGenerator: keyFor });
export const sendLimiter = rateLimit({ ...common('rl:send:'), windowMs: 60 * 1000, limit: 10, keyGenerator: keyFor });
