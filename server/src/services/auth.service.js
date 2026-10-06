import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PendingRegistration, User } from '../models/index.js';
import { env, cookieOptions } from '../config/env.js';
import { AppError } from '../utils/AppError.js';
import { sendVerificationCode } from './mailDelivery.service.js';

const OTP_TTL_MS = 10 * 60 * 1000;
const OTP_RESEND_COOLDOWN_MS = 60 * 1000;
const MAX_OTP_ATTEMPTS = 5;
const genericResendMessage = 'If a registration is pending for this address, a new code will be sent.';
const publicUser = (user) => ({ id: user.id, fullName: user.fullName, email: user.email, avatarUrl: user.avatarUrl || '' });
const normalizeEmail = (email) => email.trim().toLowerCase();

function createOtp() {
  return crypto.randomInt(0, 1_000_000).toString().padStart(6, '0');
}

function hashOtp(email, code) {
  return crypto.createHmac('sha256', env.JWT_SECRET).update(`email-verification:${email}:${code}`).digest('hex');
}

function otpMatches(email, code, storedHash) {
  const expected = Buffer.from(hashOtp(email, code), 'hex');
  const actual = Buffer.from(storedHash || '', 'hex');
  return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
}

async function deliverOtp(pending, code) {
  await sendVerificationCode({ email: pending.email, fullName: pending.fullName, code, expiresInMinutes: 10 });
}

function invalidOtpError() {
  return new AppError(400, 'INVALID_OR_EXPIRED_CODE', 'That verification code is invalid or has expired. Request a new code and try again.');
}

export async function register({ fullName, email, password }) {
  const normalizedEmail = normalizeEmail(email);
  const existing = await User.exists({ email: normalizedEmail });
  if (existing) throw new AppError(409, 'ACCOUNT_EXISTS', 'An account with this email already exists.');

  const now = new Date();
  await PendingRegistration.deleteMany({ email: normalizedEmail, expiresAt: { $lte: now } });
  const pending = await PendingRegistration.findOne({ email: normalizedEmail });
  if (pending) {
    return { verificationRequired: true, message: 'A verification code was already sent to this address. Enter it below or request a new one.' };
  }

  const code = createOtp();
  let registration;
  try {
    registration = await PendingRegistration.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
      passwordHash: await bcrypt.hash(password, 12),
      otpHash: hashOtp(normalizedEmail, code),
      expiresAt: new Date(now.getTime() + OTP_TTL_MS),
      lastSentAt: now
    });
  } catch (error) {
    if (error.code === 11000) {
      return { verificationRequired: true, message: 'A verification code was already sent to this address. Enter it below or request a new one.' };
    }
    throw error;
  }

  try {
    await deliverOtp(registration, code);
  } catch (error) {
    await PendingRegistration.deleteOne({ _id: registration._id });
    throw error;
  }
  return { verificationRequired: true, message: 'A verification code was sent to your email address.' };
}

export async function resendRegistrationCode({ email }) {
  const normalizedEmail = normalizeEmail(email);
  const now = new Date();
  const existing = await PendingRegistration.findOne({ email: normalizedEmail, expiresAt: { $gt: now } }).select('+otpHash');
  if (!existing || now.getTime() - existing.lastSentAt.getTime() < OTP_RESEND_COOLDOWN_MS) {
    return { message: genericResendMessage };
  }

  const previous = { otpHash: existing.otpHash, expiresAt: existing.expiresAt, lastSentAt: existing.lastSentAt, attempts: existing.attempts };
  const code = createOtp();
  const pending = await PendingRegistration.findOneAndUpdate(
    { _id: existing._id, expiresAt: { $gt: now }, lastSentAt: { $lte: new Date(now.getTime() - OTP_RESEND_COOLDOWN_MS) } },
    { $set: { otpHash: hashOtp(normalizedEmail, code), expiresAt: new Date(now.getTime() + OTP_TTL_MS), lastSentAt: now, attempts: 0 } },
    { new: true }
  ).select('+otpHash');
  if (!pending) return { message: genericResendMessage };
  try {
    await deliverOtp(pending, code);
  } catch (error) {
    await PendingRegistration.updateOne({ _id: pending._id }, { $set: previous });
    throw error;
  }
  return { message: genericResendMessage };
}

export async function verifyRegistrationEmail({ email, code }) {
  const normalizedEmail = normalizeEmail(email);
  const now = new Date();
  const existing = await PendingRegistration.findOne({ email: normalizedEmail }).select('+passwordHash +otpHash');
  if (!existing || existing.expiresAt <= now) {
    if (existing) await PendingRegistration.deleteOne({ _id: existing._id });
    throw invalidOtpError();
  }
  if (existing.attempts >= MAX_OTP_ATTEMPTS) {
    throw new AppError(429, 'OTP_ATTEMPTS_EXCEEDED', 'Too many incorrect codes. Request a new verification code.');
  }

  const pending = await PendingRegistration.findOneAndUpdate(
    { _id: existing._id, expiresAt: { $gt: now }, attempts: { $lt: MAX_OTP_ATTEMPTS } },
    { $inc: { attempts: 1 } },
    { new: true }
  ).select('+passwordHash +otpHash');
  if (!pending) throw invalidOtpError();
  if (!otpMatches(normalizedEmail, code, pending.otpHash)) throw invalidOtpError();

  const claimed = await PendingRegistration.deleteOne({ _id: pending._id, otpHash: pending.otpHash });
  if (!claimed.deletedCount) throw invalidOtpError();

  let user;
  try {
    user = await User.create({
      fullName: pending.fullName,
      email: normalizedEmail,
      passwordHash: pending.passwordHash,
      emailVerifiedAt: now
    });
  } catch (error) {
    if (error.code === 11000) throw new AppError(409, 'ACCOUNT_EXISTS', 'An account with this email already exists.');
    throw error;
  }
  return { user: publicUser(user), token: signSession(user.id, user.sessionVersion || 0) };
}

export async function login({ email, password }) {
  const user = await User.findOne({ email: normalizeEmail(email), isActive: true }).select('+passwordHash +sessionVersion');
  const matches = user ? await bcrypt.compare(password, user.passwordHash) : false;
  if (!matches) throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password.');
  if (user.emailVerifiedAt === null) throw new AppError(403, 'EMAIL_NOT_VERIFIED', 'Verify your email address before signing in.');
  return { user: publicUser(user), token: signSession(user.id, user.sessionVersion || 0) };
}

export function signSession(userId, sessionVersion = 0) {
  return jwt.sign({ sub: String(userId), purpose: 'session', sv: sessionVersion }, env.JWT_SECRET, { expiresIn: env.JWT_TTL, issuer: 'smartmail-api', audience: 'smartmail-web' });
}

export function setSessionCookie(res, token) {
  res.cookie('smartmail_session', token, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
}

export function clearSessionCookie(res) {
  res.clearCookie('smartmail_session', cookieOptions);
}

export function toPublicUser(user) {
  return publicUser(user);
}
