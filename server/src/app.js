import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import mongoose from 'mongoose';
import apiRoutes from './routes/index.js';
import { env, isProduction, clientOrigin } from './config/env.js';
import { apiLimiter } from './middleware/rateLimit.js';
import { csrfGuard } from './middleware/auth.js';
import { requestId } from './middleware/requestId.js';
import { errorHandler, notFound } from './utils/AppError.js';

const app = express();
app.disable('x-powered-by');
if (env.TRUST_PROXY > 0) app.set('trust proxy', env.TRUST_PROXY);
app.use(requestId);
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'same-site' },
  hsts: isProduction ? { maxAge: 31_536_000, includeSubDomains: true } : false
}));
app.use(compression());
app.use(cors({
  origin: (origin, callback) => callback(null, !origin || origin === clientOrigin),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'X-Requested-With'],
  maxAge: 600
}));
app.use(cookieParser());
app.use(express.json({ limit: '1mb', strict: true }));
app.use(express.urlencoded({ extended: false, limit: '100kb', parameterLimit: 100 }));

app.get('/api/health', (_req, res) => {
  const connected = mongoose.connection.readyState === 1;
  res.status(connected ? 200 : 503).json({ success: connected, data: { status: connected ? 'ok' : 'starting', database: connected ? 'connected' : 'unavailable' } });
});
app.get('/api/health/live', (_req, res) => res.json({ success: true, data: { status: 'ok' } }));
app.use('/api', (_req, res, next) => { res.setHeader('Cache-Control', 'private, no-store'); next(); });
app.use('/api', apiLimiter, csrfGuard, apiRoutes);
app.use(notFound);
app.use(errorHandler);

export default app;
