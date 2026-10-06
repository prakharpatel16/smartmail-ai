import cookie from 'cookie';
import jwt from 'jsonwebtoken';
import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import IORedis from 'ioredis';
import { env, clientOrigin } from './config/env.js';
import { User } from './models/index.js';
import { setSocketServer, initializeSocketEmitter } from './services/socketEvents.service.js';

export async function createSocketServer(httpServer) {
  const io = new Server(httpServer, {
    cors: { origin: clientOrigin, credentials: true, methods: ['GET', 'POST'] },
    maxHttpBufferSize: 1e6,
    connectionStateRecovery: { maxDisconnectionDuration: 2 * 60 * 1000, skipMiddlewares: false }
  });
  if (env.REDIS_URL) {
    const pubClient = new IORedis(env.REDIS_URL, { maxRetriesPerRequest: null });
    const subClient = pubClient.duplicate();
    io.adapter(createAdapter(pubClient, subClient));
    initializeSocketEmitter();
  }
  io.use(async (socket, next) => {
    try {
      const cookies = cookie.parse(socket.handshake.headers.cookie || '');
      const token = cookies.smartmail_session;
      if (!token) return next(new Error('AUTH_REQUIRED'));
      const payload = jwt.verify(token, env.JWT_SECRET, { issuer: 'smartmail-api', audience: 'smartmail-web' });
      const user = await User.findOne({ _id: payload.sub, isActive: true }).select('+sessionVersion');
      if (payload.purpose !== 'session' || !payload.sub || !user || (user.sessionVersion || 0) !== (payload.sv || 0)) return next(new Error('AUTH_REQUIRED'));
      socket.data.userId = String(payload.sub);
      next();
    } catch { next(new Error('AUTH_REQUIRED')); }
  });
  io.on('connection', (socket) => socket.join(`user:${socket.data.userId}`));
  setSocketServer(io);
  return io;
}
