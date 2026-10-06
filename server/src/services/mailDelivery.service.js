import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

const mailTransport = env.EMAIL_PROVIDER === 'smtp' && env.SMTP_HOST
  ? nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_SECURE,
      connectionTimeout: 8_000,
      greetingTimeout: 8_000,
      socketTimeout: 15_000,
      ...(env.SMTP_USER ? { auth: { user: env.SMTP_USER, pass: env.SMTP_PASSWORD } } : {})
    })
  : null;

function verificationMessage({ fullName, code, expiresInMinutes }) {
  const safeName = String(fullName || 'there').slice(0, 100) || 'there';
  const safeNameHtml = safeName.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
  return {
    subject: 'Your SmartMail verification code',
    text: `Hi ${safeName},\n\nYour SmartMail verification code is ${code}. It expires in ${expiresInMinutes} minutes.\n\nIf you did not create this account, you can ignore this email.`,
    html: `<div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;color:#25243a"><h2>Verify your email</h2><p>Hi ${safeNameHtml},</p><p>Enter this code in SmartMail to finish creating your account:</p><p style="font-size:30px;letter-spacing:8px;font-weight:bold;padding:12px 16px;background:#f2f1ff;border-radius:10px;display:inline-block">${code}</p><p>This code expires in ${expiresInMinutes} minutes. If you did not create this account, you can ignore this email.</p></div>`
  };
}

async function sendWithResend({ email, message }) {
  if (!env.RESEND_API_KEY || !env.RESEND_FROM) {
    throw new AppError(503, 'EMAIL_DELIVERY_UNAVAILABLE', 'Email delivery is not configured. Set RESEND_API_KEY and RESEND_FROM on the API host.');
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: env.RESEND_FROM, to: [email], ...message }),
    signal: AbortSignal.timeout(12_000)
  });
  if (!response.ok) {
    const providerResponse = await response.json().catch(() => null);
    const failure = new Error('The email provider rejected the request.');
    failure.providerStatus = response.status;
    const providerCode = providerResponse?.name || providerResponse?.code;
    if (typeof providerCode === 'string' && /^[a-z\d_.-]{1,60}$/i.test(providerCode)) failure.providerCode = providerCode;
    throw failure;
  }
}

function deliveryError(error) {
  if (error instanceof AppError) return error;

  const status = error?.providerStatus;
  const errorCode = typeof error?.code === 'string' && /^[A-Z\d_.-]{1,60}$/.test(error.code) ? error.code : undefined;
  const diagnostics = {
    provider: env.EMAIL_PROVIDER,
    ...(Number.isInteger(status) ? { status } : {}),
    ...(error?.providerCode ? { providerCode: error.providerCode } : {}),
    ...(errorCode ? { transportCode: errorCode } : {}),
    ...(['TimeoutError', 'AbortError'].includes(error?.name) ? { failure: 'timeout' } : {})
  };

  let result;
  if (status === 401) {
    result = new AppError(503, 'EMAIL_PROVIDER_AUTH_FAILED', 'Resend rejected its API key. Check RESEND_API_KEY in the Render service environment.');
  } else if ([400, 403, 422].includes(status)) {
    result = new AppError(503, 'EMAIL_SENDER_REJECTED', 'Resend rejected the sender. Verify your domain and make RESEND_FROM use an address on that verified domain.');
  } else if (status === 429) {
    result = new AppError(503, 'EMAIL_PROVIDER_RATE_LIMITED', 'The email provider is temporarily rate limiting requests. Wait briefly and try again.');
  } else {
    result = new AppError(503, 'EMAIL_DELIVERY_FAILED', 'We could not send the verification email right now. Check the email provider configuration and try again.');
  }
  result.emailDeliveryDiagnostics = diagnostics;
  return result;
}

export async function sendVerificationCode({ email, fullName, code, expiresInMinutes }) {
  const message = verificationMessage({ fullName, code, expiresInMinutes });
  try {
    if (env.EMAIL_PROVIDER === 'resend') {
      await sendWithResend({ email, message });
      return;
    }

    if (!mailTransport || !(env.SMTP_FROM || env.SMTP_USER)) {
      throw new AppError(503, 'EMAIL_DELIVERY_UNAVAILABLE', 'Email delivery is not configured. Add SMTP settings, or configure the Resend email provider.');
    }
    await mailTransport.sendMail({ from: env.SMTP_FROM || env.SMTP_USER, to: email, ...message });
  } catch (error) {
    throw deliveryError(error);
  }
}
