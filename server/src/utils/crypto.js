import crypto from 'node:crypto';
import { env } from '../config/env.js';
import { AppError } from './AppError.js';

function encryptionKey() {
  const key = Buffer.from(env.TOKEN_ENCRYPTION_KEY, 'base64');
  if (key.length !== 32) throw new AppError(503, 'GMAIL_NOT_CONFIGURED', 'Gmail token encryption is not configured.');
  return key;
}

export function encryptSecret(value) {
  if (!value) return '';
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', encryptionKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
  return [iv, cipher.getAuthTag(), ciphertext].map((part) => part.toString('base64url')).join('.');
}

export function decryptSecret(value) {
  if (!value) return '';
  try {
    const [encodedIv, encodedTag, encodedData] = value.split('.');
    const decipher = crypto.createDecipheriv('aes-256-gcm', encryptionKey(), Buffer.from(encodedIv, 'base64url'));
    decipher.setAuthTag(Buffer.from(encodedTag, 'base64url'));
    return Buffer.concat([decipher.update(Buffer.from(encodedData, 'base64url')), decipher.final()]).toString('utf8');
  } catch {
    throw new AppError(503, 'GMAIL_RECONNECT_REQUIRED', 'Gmail credentials need to be reconnected.');
  }
}

export const randomToken = (bytes = 32) => crypto.randomBytes(bytes).toString('base64url');
