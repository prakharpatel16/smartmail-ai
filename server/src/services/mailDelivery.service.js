import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import { AppError } from '../utils/AppError.js';

const mailTransport = env.SMTP_HOST
  ? nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_SECURE,
      ...(env.SMTP_USER ? { auth: { user: env.SMTP_USER, pass: env.SMTP_PASSWORD } } : {})
    })
  : null;

export async function sendVerificationCode({ email, fullName, code, expiresInMinutes }) {
  if (!mailTransport || !(env.SMTP_FROM || env.SMTP_USER)) {
    throw new AppError(503, 'EMAIL_DELIVERY_UNAVAILABLE', 'Email delivery is not configured. Add your SMTP host, sender address, and mail-provider credentials to server/.env, then restart the API.');
  }

  const safeName = String(fullName || 'there').slice(0, 100) || 'there';
  const safeNameHtml = safeName.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
  const from = env.SMTP_FROM || env.SMTP_USER;
  try {
    await mailTransport.sendMail({
      from,
      to: email,
      subject: 'Your SmartMail verification code',
      text: `Hi ${safeName},\n\nYour SmartMail verification code is ${code}. It expires in ${expiresInMinutes} minutes.\n\nIf you did not create this account, you can ignore this email.`,
      html: `<div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;color:#25243a"><h2>Verify your email</h2><p>Hi ${safeNameHtml},</p><p>Enter this code in SmartMail to finish creating your account:</p><p style="font-size:30px;letter-spacing:8px;font-weight:bold;padding:12px 16px;background:#f2f1ff;border-radius:10px;display:inline-block">${code}</p><p>This code expires in ${expiresInMinutes} minutes. If you did not create this account, you can ignore this email.</p></div>`
    });
  } catch {
    throw new AppError(503, 'EMAIL_DELIVERY_FAILED', 'We could not send the verification email right now. Please try again.');
  }
}
