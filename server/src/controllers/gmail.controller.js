import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import { env, cookieOptions, clientBaseUrl } from '../config/env.js';
import { asyncHandler, AppError } from '../utils/AppError.js';
import { finishGoogleAuthorization, getConnectionStatus, getGoogleAuthorizationUrl, disconnectGmail } from '../services/gmail.service.js';

const oauthStateCookie = { ...cookieOptions, maxAge: 10 * 60 * 1000 };
const safeClientRedirect = (status) => `${clientBaseUrl}/settings?gmail=${encodeURIComponent(status)}`;

export const startGmailConnect = asyncHandler(async (req, res) => {
  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) {
    throw new AppError(503, 'GMAIL_NOT_CONFIGURED', 'Gmail OAuth is not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in server/.env, then restart the API.');
  }
  const nonce = crypto.randomBytes(24).toString('base64url');
  const state = jwt.sign({ sub: String(req.user.id), nonce, purpose: 'gmail_oauth' }, env.JWT_SECRET, { expiresIn: '10m', issuer: 'smartmail-api', audience: 'google-oauth' });
  res.cookie('gmail_oauth_state', nonce, oauthStateCookie);
  res.json({ success: true, data: { authorizationUrl: getGoogleAuthorizationUrl(state) } });
});

export const gmailCallback = asyncHandler(async (req, res) => {
  const nonce = req.cookies?.gmail_oauth_state;
  res.clearCookie('gmail_oauth_state', cookieOptions);
  if (req.query.error) return res.redirect(safeClientRedirect('cancelled'));
  if (!nonce || !req.query.state || !req.query.code) return res.redirect(safeClientRedirect('failed'));
  try {
    const state = jwt.verify(String(req.query.state), env.JWT_SECRET, { issuer: 'smartmail-api', audience: 'google-oauth' });
    const receivedNonce = Buffer.from(String(state.nonce || ''));
    const cookieNonce = Buffer.from(String(nonce));
    if (state.purpose !== 'gmail_oauth' || !state.sub || receivedNonce.length !== cookieNonce.length || !crypto.timingSafeEqual(receivedNonce, cookieNonce)) {
      return res.redirect(safeClientRedirect('failed'));
    }
    await finishGoogleAuthorization(String(req.query.code), state.sub);
    return res.redirect(safeClientRedirect('connected'));
  } catch {
    return res.redirect(safeClientRedirect('failed'));
  }
});

export const gmailStatus = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await getConnectionStatus(req.user.id) });
});

export const gmailDisconnect = asyncHandler(async (req, res) => {
  await disconnectGmail(req.user.id);
  res.json({ success: true, message: 'Gmail was disconnected and locally synchronized messages and drafts were deleted.' });
});
