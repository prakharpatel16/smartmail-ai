import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(5000),
  CLIENT_URL: z.string().url().default('http://localhost:5173'),
  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must contain at least 32 characters'),
  JWT_TTL: z.string().default('7d'),
  EMAIL_PROVIDER: z.enum(['smtp', 'resend']).default('smtp'),
  RESEND_API_KEY: z.string().optional().default(''),
  RESEND_FROM: z.string().optional().default(''),
  SMTP_HOST: z.string().optional().default(''),
  SMTP_PORT: z.coerce.number().int().min(1).max(65535).default(587),
  SMTP_SECURE: z.enum(['true', 'false']).default('false').transform((value) => value === 'true'),
  SMTP_USER: z.string().optional().default(''),
  SMTP_PASSWORD: z.string().optional().default(''),
  SMTP_FROM: z.string().optional().default(''),
  TOKEN_ENCRYPTION_KEY: z.string().optional().default(''),
  GOOGLE_CLIENT_ID: z.string().optional().default(''),
  GOOGLE_CLIENT_SECRET: z.string().optional().default(''),
  GOOGLE_REDIRECT_URI: z.string().url().default('http://localhost:5000/api/gmail/callback'),
  GMAIL_SYNC_LIMIT: z.coerce.number().int().min(1).max(500).default(100),
  GMAIL_AUTO_SYNC_INTERVAL_MS: z.coerce.number().int().min(30_000).max(3_600_000).default(60_000),
  AI_PROVIDER: z.enum(['gemini', 'openai']).default('gemini'),
  AI_MODEL: z.string().default(''),
  AI_WORKER_CONCURRENCY: z.coerce.number().int().min(1).max(32).default(1),
  AI_API_KEY: z.string().optional().default(''),
  GEMINI_API_KEY: z.string().optional().default(''),
  OPENAI_API_KEY: z.string().optional().default(''),
  AI_TIMEOUT_MS: z.coerce.number().int().positive().default(30_000),
  AI_MAX_CONTEXT_CHARS: z.coerce.number().int().min(1000).max(100_000).default(24_000),
  EMBEDDING_MODEL: z.string().default(''),
  EMBEDDING_DIMENSIONS: z.coerce.number().int().min(128).max(3072).default(768),
  VECTOR_INDEX_NAME: z.string().default('smartmail_email_vector'),
  REDIS_URL: z.string().optional().default(''),
  COOKIE_DOMAIN: z.string().optional().default(''),
  TRUST_PROXY: z.coerce.number().int().min(0).max(5).default(0)
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  const details = parsed.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('; ');
  throw new Error(`Invalid server configuration: ${details}`);
}

export const env = Object.freeze(parsed.data);
export const isProduction = env.NODE_ENV === 'production';
export const clientOrigin = new URL(env.CLIENT_URL).origin;
export const clientBaseUrl = env.CLIENT_URL.replace(/\/+$/, '');
export const aiTextModel = env.AI_MODEL || (env.AI_PROVIDER === 'gemini' ? 'gemini-3.1-flash-lite' : 'gpt-4o-mini');
export const aiEmbeddingModel = env.EMBEDDING_MODEL || (env.AI_PROVIDER === 'gemini' ? 'gemini-embedding-001' : 'text-embedding-3-small');
export const cookieOptions = Object.freeze({
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'lax',
  path: '/',
  ...(env.COOKIE_DOMAIN ? { domain: env.COOKIE_DOMAIN } : {})
});

if (isProduction && env.TOKEN_ENCRYPTION_KEY) {
  const key = Buffer.from(env.TOKEN_ENCRYPTION_KEY, 'base64');
  if (key.length !== 32) throw new Error('TOKEN_ENCRYPTION_KEY must decode to exactly 32 bytes');
}
