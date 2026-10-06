import { z } from 'zod';
import { User } from '../models/index.js';
import { asyncHandler, AppError } from '../utils/AppError.js';
import { clearSessionCookie, login, register, resendRegistrationCode, setSessionCookie, toPublicUser, verifyRegistrationEmail } from '../services/auth.service.js';

const registerSchema = z.object({
  fullName: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  password: z.string().min(12).max(128)
}).strict();
const loginSchema = z.object({ email: z.string().trim().email().max(254), password: z.string().min(1).max(128) }).strict();
const emailSchema = z.object({ email: z.string().trim().email().max(254) }).strict();
const verifyEmailSchema = z.object({
  email: z.string().trim().email().max(254),
  code: z.string().trim().regex(/^\d{6}$/)
}).strict();

export const registerUser = asyncHandler(async (req, res) => {
  const input = registerSchema.parse(req.body);
  const result = await register(input);
  res.status(202).json({ success: true, data: result });
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const input = verifyEmailSchema.parse(req.body);
  const result = await verifyRegistrationEmail(input);
  setSessionCookie(res, result.token);
  res.json({ success: true, data: { user: result.user } });
});

export const resendEmailVerification = asyncHandler(async (req, res) => {
  const input = emailSchema.parse(req.body);
  const result = await resendRegistrationCode(input);
  res.json({ success: true, data: result });
});

export const loginUser = asyncHandler(async (req, res) => {
  const input = loginSchema.parse(req.body);
  const result = await login(input);
  setSessionCookie(res, result.token);
  res.json({ success: true, data: { user: result.user } });
});

export const logoutUser = asyncHandler(async (req, res) => {
  await User.updateOne({ _id: req.user.id }, { $inc: { sessionVersion: 1 } });
  clearSessionCookie(res);
  res.json({ success: true, message: 'Logged out successfully.' });
});

export const currentUser = asyncHandler(async (req, res) => {
  res.json({ success: true, data: { user: toPublicUser(req.user) } });
});

export const requireLocalAccount = asyncHandler(async (req, _res, next) => {
  if (!req.user) throw new AppError(401, 'AUTH_REQUIRED', 'Please sign in to continue.');
  next();
});
