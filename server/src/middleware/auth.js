import jwt from 'jsonwebtoken';
import { env, clientOrigin } from '../config/env.js';
import { User } from '../models/index.js';
import { AppError, asyncHandler } from '../utils/AppError.js';

export const requireAuth = asyncHandler(async (req, _res, next) => {
  const token = req.cookies?.smartmail_session;
  if (!token) throw new AppError(401, 'AUTH_REQUIRED', 'Please sign in to continue.');
  try {
    const payload = jwt.verify(token, env.JWT_SECRET, { issuer: 'smartmail-api', audience: 'smartmail-web' });
    if (payload.purpose !== 'session' || !payload.sub) throw new Error('Invalid purpose');
    const user = await User.findOne({ _id: payload.sub, isActive: true }).select('fullName email avatarUrl +sessionVersion');
    if (!user || (user.sessionVersion || 0) !== (payload.sv || 0)) throw new Error('Inactive session');
    req.user = user;
    next();
  } catch {
    throw new AppError(401, 'AUTH_REQUIRED', 'Your session has expired. Please sign in again.');
  }
});

export function csrfGuard(req, _res, next) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  const origin = req.get('origin');
  if (origin && origin !== clientOrigin) return next(new AppError(403, 'FORBIDDEN', 'Request origin is not allowed.'));
  if (req.get('x-requested-with') !== 'XMLHttpRequest') return next(new AppError(403, 'FORBIDDEN', 'A valid same-origin request is required.'));
  next();
}
