import crypto from 'node:crypto';
import { google } from 'googleapis';
import sanitizeHtml from 'sanitize-html';
import MailComposer from 'nodemailer/lib/mail-composer/index.js';
import { createOAuthClient } from '../config/google.js';
import { env } from '../config/env.js';
import { Draft, Email, GmailAccount, SyncJob } from '../models/index.js';
import { encryptSecret, decryptSecret } from '../utils/crypto.js';
import { AppError } from '../utils/AppError.js';
import { aiProcessingQueue, enqueueAiProcessing, enqueueNotification, enqueueEmailSync } from '../queues/index.js';
import { emitToUser } from './socketEvents.service.js';

const decodePart = (data = '') => Buffer.from(data.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8');
const decodeBase64Url = (data = '') => Buffer.from(data.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
const normalizeContentId = (value = '') => {
  let contentId = String(value).trim().replace(/^cid:/i, '').replace(/^<|>$/g, '');
  try { contentId = decodeURIComponent(contentId); } catch {}
  return contentId.trim().toLowerCase();
};
const partHeader = (part, name) => part?.headers?.find((header) => header.name?.toLowerCase() === name.toLowerCase())?.value || '';
const findPart = (part, predicate) => {
  if (!part) return null;
  if (predicate(part)) return part;
  for (const child of part.parts || []) {
    const match = findPart(child, predicate);
    if (match) return match;
  }
  return null;
};
const imageExtensions = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/gif': 'gif', 'image/webp': 'webp', 'image/avif': 'avif', 'image/bmp': 'bmp' };
const isPreviewImage = (mimeType = '') => Object.hasOwn(imageExtensions, mimeType.toLowerCase());
const encodedTagPattern = /(?:&lt;|&#0*60;|&#x0*3c;)\s*\/?\s*(?:a|article|body|br|center|div|font|h[1-6]|head|hr|html|img|li|ol|p|pre|section|select|span|style|table|tbody|td|th|tr|ul)\b/gi;
function restoreEncodedMarkup(value = '') {
  const source = String(value);
  if ([...source.matchAll(encodedTagPattern)].length < 2) return source;
  return source
    .replace(/&lt;|&#0*60;|&#x0*3c;/gi, '<')
    .replace(/&gt;|&#0*62;|&#x0*3e;/gi, '>')
    .replace(/&quot;|&#0*34;|&#x0*22;/gi, '"')
    .replace(/&apos;|&#0*39;|&#x0*27;/gi, "'")
    .replace(/&amp;/gi, '&');
}
const safeEmailStyles = {
  '*': {
    color: [/^#[\da-f]{3,8}$/i, /^rgba?\([\d.,%\s]+\)$/i, /^[a-z]{1,24}$/i],
    'background-color': [/^#[\da-f]{3,8}$/i, /^rgba?\([\d.,%\s]+\)$/i, /^[a-z]{1,24}$/i],
    'font-family': [/^[\w\s,'".-]{1,100}$/i],
    'font-size': [/^\d{1,3}(?:\.\d+)?(?:px|pt|em|rem|%)$/i],
    'font-weight': [/^(?:normal|bold|[1-9]00)$/i],
    'font-style': [/^(?:normal|italic|oblique)$/i],
    'text-align': [/^(?:left|right|center|justify|start|end)$/i],
    'text-decoration': [/^(?:none|underline|line-through)$/i],
    'line-height': [/^\d{1,3}(?:\.\d+)?(?:px|pt|em|rem|%)?$/i],
    'vertical-align': [/^(?:baseline|sub|super|top|middle|bottom|text-top|text-bottom)$/i],
    'white-space': [/^(?:normal|nowrap|pre|pre-wrap|pre-line)$/i],
    width: [/^(?:auto|\d{1,4}(?:\.\d+)?(?:px|pt|em|rem|%)?)$/i],
    'max-width': [/^(?:none|\d{1,4}(?:\.\d+)?(?:px|pt|em|rem|%)?)$/i],
    height: [/^(?:auto|\d{1,4}(?:\.\d+)?(?:px|pt|em|rem|%)?)$/i],
    'max-height': [/^(?:none|\d{1,4}(?:\.\d+)?(?:px|pt|em|rem|%)?)$/i],
    margin: [/^-?\d{1,4}(?:\.\d+)?(?:px|pt|em|rem|%)(?:\s+-?\d{1,4}(?:\.\d+)?(?:px|pt|em|rem|%)){0,3}$/i],
    padding: [/^\d{1,4}(?:\.\d+)?(?:px|pt|em|rem|%)(?:\s+\d{1,4}(?:\.\d+)?(?:px|pt|em|rem|%)){0,3}$/i],
    'border-collapse': [/^(?:collapse|separate)$/i],
    'border-spacing': [/^\d{1,4}(?:\.\d+)?(?:px|pt|em|rem)$/i]
  }
};
const safeHtml = (html) => sanitizeHtml(html, {
  allowedTags: [...sanitizeHtml.defaults.allowedTags, 'img', 'table', 'thead', 'tbody', 'tfoot', 'tr', 'td', 'th', 'col', 'colgroup', 'center', 'font'],
  allowedAttributes: {
    '*': ['style', 'align', 'valign', 'width', 'height', 'bgcolor'],
    a: ['href', 'name', 'target', 'rel', 'title'],
    img: ['data-remote-src', 'data-inline-cid', 'alt', 'width', 'height', 'title'],
    td: ['colspan', 'rowspan'],
    th: ['colspan', 'rowspan', 'scope'],
    table: ['border', 'cellpadding', 'cellspacing'],
    font: ['color', 'face', 'size']
  },
  allowedStyles: safeEmailStyles,
  allowedSchemes: ['http', 'https', 'mailto'],
  transformTags: {
    a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer nofollow', target: '_blank' }),
    img: (_tagName, attributes) => {
      let remoteSource = '';
      let inlineContentId = normalizeContentId(attributes['data-inline-cid'] || '');
      const src = String(attributes.src || '').trim();
      const inlineMatch = src.match(/^cid:(.+)$/i);
      if (inlineMatch) inlineContentId = normalizeContentId(inlineMatch[1]);
      for (const candidate of [src, String(attributes['data-remote-src'] || '').trim()]) {
        try {
          const source = new URL(candidate.startsWith('//') ? `https:${candidate}` : candidate);
          if (source.protocol === 'https:' || source.protocol === 'http:') { remoteSource = source.href; break; }
        } catch {}
      }
      return {
        tagName: 'img',
        attribs: {
          ...(attributes.alt ? { alt: attributes.alt } : {}),
          ...(attributes.width ? { width: attributes.width } : {}),
          ...(attributes.height ? { height: attributes.height } : {}),
          ...(attributes.title ? { title: attributes.title } : {}),
          ...(remoteSource ? { 'data-remote-src': remoteSource } : {}),
          ...(inlineContentId ? { 'data-inline-cid': inlineContentId } : {})
        }
      };
    }
  }
});
export const sanitizeEmailHtml = (html) => safeHtml(restoreEncodedMarkup(html));
const plainFromHtml = (html) => sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} }).replace(/\s+/g, ' ').trim();
const normalizeMessageIds = (value = '') => (String(value).match(/<[^<>\s\r\n]{1,998}>/g) || []).join(' ').slice(0, 4000);
const requiredGmailScopes = [
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.compose'
];
function googleErrorReasons(error) {
  const apiError = error.response?.data?.error || {};
  return [
    ...(apiError.errors || []).map((item) => item.reason),
    ...(apiError.details || []).map((item) => item.reason),
    apiError.status,
    error.code
  ].filter((value) => typeof value === 'string').map((value) => value.toLowerCase());
}

function parseAddresses(value = '') {
  const items = [];
  const pattern = /(?:"?([^"<,]*)"?\s*)?<([^<>]+)>|([^,\s<>]+@[^,\s<>]+)/g;
  for (const match of value.matchAll(pattern)) {
    const email = (match[2] || match[3] || '').trim().toLowerCase();
    if (!email.includes('@')) continue;
    items.push({ name: (match[1] || '').trim().replace(/^"|"$/g, ''), email });
  }
  return items;
}

function flattenParts(part, result = { text: [], html: [], attachments: [] }) {
  if (!part) return result;
  const mimeType = (part.mimeType || '').toLowerCase();
  const filename = part.filename || '';
  const contentId = normalizeContentId(partHeader(part, 'content-id'));
  const disposition = partHeader(part, 'content-disposition');
  if (part.body?.data && mimeType === 'text/plain') {
    const decoded = decodePart(part.body.data);
    result.text.push(decoded);
  } else if (part.body?.data && mimeType === 'text/html') {
    result.html.push(decodePart(part.body.data));
  } else if ((filename || contentId) && (part.body?.attachmentId || part.body?.data)) {
    const isInline = Boolean(contentId) || /\binline\b/i.test(disposition);
    const extension = imageExtensions[mimeType] || 'bin';
    result.attachments.push({
      filename: filename || `inline-image-${result.attachments.length + 1}.${extension}`,
      mimeType: mimeType || 'application/octet-stream',
      size: part.body.size || 0,
      attachmentId: part.body.attachmentId || '',
      partId: part.partId || '',
      contentId,
      isInline
    });
  }
  for (const child of part.parts || []) flattenParts(child, result);
  return result;
}

function normalizeMessage(message, userId, accountId) {
  const headers = Object.fromEntries((message.payload?.headers || []).map((header) => [header.name.toLowerCase(), header.value]));
  const parts = flattenParts(message.payload);
  const html = sanitizeEmailHtml(parts.html.join('\n'));
  const bodyText = (parts.text.join('\n') || plainFromHtml(html) || message.snippet || '').trim().slice(0, 150_000);
  const labels = message.labelIds || [];
  return {
    userId, gmailAccountId: accountId, gmailMessageId: message.id, threadId: message.threadId,
    messageIdHeader: normalizeMessageIds(headers['message-id']).slice(0, 1000),
    inReplyTo: normalizeMessageIds(headers['in-reply-to']).slice(0, 1000), references: normalizeMessageIds(headers.references),
    sender: parseAddresses(headers.from)[0] || { name: '', email: '' },
    recipients: parseAddresses(headers.to), cc: parseAddresses(headers.cc), bcc: parseAddresses(headers.bcc),
    subject: (headers.subject || '').slice(0, 998), bodyText, bodyHtml: html,
    snippet: (message.snippet || bodyText).slice(0, 500),
    receivedAt: new Date(Number(message.internalDate) || Date.now()),
    labels, isRead: !labels.includes('UNREAD'), isStarred: labels.includes('STARRED'),
    hasAttachments: parts.attachments.length > 0, attachments: parts.attachments
  };
}

export async function findConnectedAccount(userId, includeTokens = false) {
  const query = GmailAccount.findOne({ userId, isConnected: true });
  if (includeTokens) query.select('+accessTokenEncrypted +refreshTokenEncrypted');
  const account = await query;
  if (!account) throw new AppError(409, 'GMAIL_NOT_CONNECTED', 'Connect a Gmail account to use this feature.');
  return account;
}

export async function getAuthorizedGmail(userId) {
  const account = await findConnectedAccount(userId, true);
  const oauth = createOAuthClient();
  oauth.setCredentials({
    access_token: decryptSecret(account.accessTokenEncrypted),
    refresh_token: decryptSecret(account.refreshTokenEncrypted),
    expiry_date: account.tokenExpiresAt?.getTime()
  });
  oauth.on('tokens', async (tokens) => {
    const update = {};
    if (tokens.access_token) update.accessTokenEncrypted = encryptSecret(tokens.access_token);
    if (tokens.refresh_token) update.refreshTokenEncrypted = encryptSecret(tokens.refresh_token);
    if (tokens.expiry_date) update.tokenExpiresAt = new Date(tokens.expiry_date);
    if (tokens.scope) update.scopes = tokens.scope.split(' ');
    if (Object.keys(update).length) await GmailAccount.updateOne({ _id: account._id, userId }, { $set: update });
  });
  return { gmail: google.gmail({ version: 'v1', auth: oauth }), account, oauth };
}

export function getGoogleAuthorizationUrl(state) {
  const oauth = createOAuthClient();
  return oauth.generateAuthUrl({ access_type: 'offline', prompt: 'consent', include_granted_scopes: true, scope: [
    'openid', 'email', 'profile', 'https://www.googleapis.com/auth/gmail.modify',
    'https://www.googleapis.com/auth/gmail.send', 'https://www.googleapis.com/auth/gmail.compose'
  ], state });
}

export async function finishGoogleAuthorization(code, userId) {
  const oauth = createOAuthClient();
  const { tokens } = await oauth.getToken(code);
  if (!tokens.refresh_token) throw new AppError(400, 'GMAIL_OAUTH_ERROR', 'Google did not return a refresh token. Reconnect and grant access.');
  oauth.setCredentials(tokens);
  const googleApi = google.oauth2({ version: 'v2', auth: oauth });
  const { data: profile } = await googleApi.userinfo.get();
  if (!profile.email || !profile.id) throw new AppError(400, 'GMAIL_OAUTH_ERROR', 'Google did not return a Gmail identity.');
  const existing = await GmailAccount.findOne({ userId, gmailEmail: profile.email.toLowerCase() }).select('+accessTokenEncrypted +refreshTokenEncrypted');
  const account = existing || new GmailAccount({ userId, gmailEmail: profile.email.toLowerCase() });
  account.googleAccountId = profile.id;
  account.accessTokenEncrypted = encryptSecret(tokens.access_token || '');
  account.refreshTokenEncrypted = encryptSecret(tokens.refresh_token);
  account.tokenExpiresAt = tokens.expiry_date ? new Date(tokens.expiry_date) : null;
  account.scopes = tokens.scope ? tokens.scope.split(' ') : [];
  account.isConnected = true;
  await account.save();
  return account;
}

export async function getConnectionStatus(userId) {
  const account = await GmailAccount.findOne({ userId, isConnected: true }).select('gmailEmail lastSyncedAt isConnected scopes');
  const oauthConfigured = Boolean(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET);
  const mailboxAccessGranted = Boolean(account && requiredGmailScopes.every((scope) => account.scopes.includes(scope)));
  return account
    ? { connected: true, email: account.gmailEmail, lastSyncedAt: account.lastSyncedAt, oauthConfigured, mailboxAccessGranted }
    : { connected: false, email: '', lastSyncedAt: null, oauthConfigured, mailboxAccessGranted: false };
}

export async function disconnectGmail(userId) {
  const account = await findConnectedAccount(userId, true);
  try {
    const oauth = createOAuthClient();
    await oauth.revokeToken(decryptSecret(account.refreshTokenEncrypted));
  } catch { /* Local credentials are still invalidated if Google's revoke endpoint is unavailable. */ }
  await Promise.all([
    Email.deleteMany({ userId, gmailAccountId: account._id }),
    Draft.deleteMany({ userId, gmailAccountId: account._id }),
    GmailAccount.deleteOne({ _id: account._id, userId })
  ]);
}

async function listMessageIds(gmail, account, limit) {
  if (account.historyId) {
    try {
      const ids = new Set();
      const deleted = new Set();
      let pageToken;
      let checkpoint = '';
      do {
        const { data } = await gmail.users.history.list({ userId: 'me', startHistoryId: account.historyId, historyTypes: ['messageAdded', 'messageDeleted', 'labelAdded', 'labelRemoved'], maxResults: 500, ...(pageToken ? { pageToken } : {}) });
        checkpoint ||= data.historyId || '';
        for (const history of data.history || []) {
          for (const item of [...(history.messagesAdded || []), ...(history.labelsAdded || []), ...(history.labelsRemoved || [])]) {
            if (item.message?.id) ids.add(item.message.id);
          }
          for (const item of history.messagesDeleted || []) if (item.message?.id) deleted.add(item.message.id);
        }
        pageToken = data.nextPageToken;
      } while (pageToken);
      for (const id of deleted) ids.delete(id);
      return { ids: [...ids], deleted: [...deleted], historyId: checkpoint || account.historyId };
    } catch (error) {
      if (error.code !== 404 && error.response?.status !== 404) throw error;
      account.historyId = '';
    }
  }
  const { data: baseline } = await gmail.users.getProfile({ userId: 'me' });
  const ids = [];
  let pageToken;
  while (ids.length < limit) {
    const { data } = await gmail.users.messages.list({ userId: 'me', q: 'in:anywhere -in:trash', maxResults: Math.min(100, limit - ids.length), pageToken });
    ids.push(...(data.messages || []).map(({ id }) => id));
    pageToken = data.nextPageToken;
    if (!pageToken || !data.messages?.length) break;
  }
  return { ids: ids.slice(0, limit), deleted: [], historyId: baseline.historyId || '' };
}

async function syncDrafts(gmail, userId, account) {
  const scanStartedAt = new Date();
  const draftIds = [];
  let pageToken;
  do {
    const { data } = await gmail.users.drafts.list({ userId: 'me', maxResults: 100, ...(pageToken ? { pageToken } : {}) });
    draftIds.push(...(data.drafts || []).map(({ id }) => id).filter(Boolean));
    pageToken = data.nextPageToken;
  } while (pageToken);

  let synced = 0;
  for (let index = 0; index < draftIds.length; index += 5) {
    await Promise.all(draftIds.slice(index, index + 5).map(async (gmailDraftId) => {
      try {
        const { data } = await gmail.users.drafts.get({ userId: 'me', id: gmailDraftId, format: 'full' });
        if (!data.message) return;
        const normalized = normalizeMessage(data.message, userId, account._id);
        await Draft.findOneAndUpdate(
          { userId, gmailAccountId: account._id, gmailDraftId },
          { $set: { gmailDraftId, to: normalized.recipients, cc: normalized.cc, bcc: normalized.bcc, subject: normalized.subject, bodyText: normalized.bodyText, threadId: normalized.threadId, inReplyTo: normalized.inReplyTo, references: normalized.references, attachments: normalized.attachments } },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        synced += 1;
      } catch (error) {
        console.error(JSON.stringify({ level: 'warn', code: 'GMAIL_DRAFT_SYNC_FAILED', status: error.response?.status || 0 }));
      }
    }));
  }
  await Draft.deleteMany({ userId, gmailAccountId: account._id, updatedAt: { $lt: scanStartedAt }, gmailDraftId: { $nin: draftIds } });
  return synced;
}

export async function syncMailbox(userId, jobId = '', { syncDrafts: includeDrafts = true } = {}) {
  const { gmail, account } = await getAuthorizedGmail(userId);
  if (jobId) await SyncJob.updateOne({ queueJobId: jobId, userId }, { $set: { status: 'ACTIVE', startedAt: new Date() } });
  try {
    const limit = env.GMAIL_SYNC_LIMIT;
    const { ids, deleted, historyId } = await listMessageIds(gmail, account, limit);
    if (deleted.length) await Email.deleteMany({ userId, gmailAccountId: account._id, gmailMessageId: { $in: deleted } });
    let imported = 0;
    let newlyAdded = 0;
    for (let i = 0; i < ids.length; i += 5) {
      await Promise.all(ids.slice(i, i + 5).map(async (id) => {
        try {
          const { data } = await gmail.users.messages.get({ userId: 'me', id, format: 'full' });
          const normalized = normalizeMessage(data, userId, account._id);
          const existed = await Email.exists({ gmailAccountId: account._id, gmailMessageId: id });
          const saved = await Email.findOneAndUpdate(
            { gmailAccountId: account._id, gmailMessageId: id },
            { $set: normalized },
            { new: true, upsert: true, setDefaultsOnInsert: true }
          ).select('_id aiProcessing');
          imported += 1;
          if (!existed) newlyAdded += 1;
          if (saved.aiProcessing.status !== 'COMPLETED') {
            const job = { userId: String(userId), emailId: String(saved._id), attempt: (saved.aiProcessing.attempts || 0) + 1 };
            try {
              await enqueueAiProcessing(job);
            } catch (error) {
              console.error(JSON.stringify({ level: 'warn', code: 'EMAIL_AI_ENQUEUE_FAILED', emailId: String(saved._id), reason: error.code || 'AI_PROCESSING_FAILED' }));
            }
          }
        } catch (error) {
          console.error(JSON.stringify({ level: 'warn', code: 'GMAIL_MESSAGE_SYNC_FAILED', messageId: id, status: error.response?.status || 0 }));
        }
      }));
    }
    if (aiProcessingQueue) {
      const pendingAi = await Email.find({ userId, labels: 'INBOX', 'aiProcessing.status': { $in: ['PENDING', 'FAILED'] } }).sort({ receivedAt: -1 }).limit(env.GMAIL_SYNC_LIMIT).select('_id aiProcessing.attempts');
      for (const email of pendingAi) {
        try { await enqueueAiProcessing({ userId: String(userId), emailId: String(email._id), attempt: (email.aiProcessing?.attempts || 0) + 1 }); }
        catch (error) { console.error(JSON.stringify({ level: 'warn', code: 'EMAIL_AI_RECOVERY_ENQUEUE_FAILED', emailId: String(email._id), reason: error.code || 'AI_PROCESSING_FAILED' })); }
      }
    }
    const syncedDrafts = includeDrafts ? await syncDrafts(gmail, userId, account) : 0;
    await GmailAccount.updateOne({ _id: account._id, userId }, { $set: { historyId: historyId || account.historyId, lastSyncedAt: new Date() } });
    if (jobId) await SyncJob.updateOne({ queueJobId: jobId, userId }, { $set: { status: 'COMPLETED', imported, completedAt: new Date() } });
    try {
      if (newlyAdded > 0) await enqueueNotification({ userId: String(userId), type: 'NEW_EMAIL', title: 'New messages synchronized', message: `${newlyAdded} new ${newlyAdded === 1 ? 'message' : 'messages'} added to your inbox.` });
    } catch (error) {
      console.error(JSON.stringify({ level: 'warn', code: 'SYNC_NOTIFICATION_ENQUEUE_FAILED', reason: error.code || 'NOTIFICATION_FAILED' }));
    }
    emitToUser(userId, 'mailbox:sync-completed', { jobId, imported, newMessages: newlyAdded, drafts: syncedDrafts });
    return { imported, drafts: syncedDrafts };
  } catch (error) {
    if (jobId) await SyncJob.updateOne({ queueJobId: jobId, userId }, { $set: { status: 'FAILED', errorCode: 'GMAIL_API_ERROR', completedAt: new Date() } });
    const apiError = error.response?.data?.error || {};
    const status = error.response?.status || 0;
    const reasons = googleErrorReasons(error);
    const providerMessage = String(apiError.message || '').toLowerCase();
    console.error(JSON.stringify({ level: 'error', code: 'GMAIL_SYNC_FAILED', status, reason: reasons[0] || 'gmail_api_error' }));
    if (status === 401 || reasons.includes('invalid_grant') || reasons.includes('invalid_credentials')) throw new AppError(409, 'GMAIL_RECONNECT_REQUIRED', 'Reconnect Gmail to continue syncing.');
    if (status === 403 && (reasons.includes('accessnotconfigured') || reasons.includes('service_disabled') || /gmail api.{0,80}(disabled|not been used)/i.test(providerMessage))) {
      throw new AppError(503, 'GMAIL_API_NOT_ENABLED', 'Enable the Gmail API in the Google Cloud project used by this OAuth client, then try syncing again.');
    }
    if (status === 403 && reasons.includes('insufficientpermissions')) throw new AppError(403, 'GMAIL_PERMISSION_REQUIRED', 'Reconnect Gmail and grant the requested mailbox permissions.');
    throw new AppError(502, 'GMAIL_API_ERROR', 'Gmail could not be synchronized right now. Please try again.');
  }
}

export async function requestMailboxSync(userId) {
  const id = `sync_${crypto.randomUUID()}`;
  await SyncJob.create({ userId, queueJobId: id, status: 'QUEUED' });
  try {
    await enqueueEmailSync({ userId: String(userId), syncJobId: id }, id);
    return { jobId: id, status: 'queued' };
  } catch (error) {
    if (error.code !== 'QUEUE_NOT_CONFIGURED') throw error;
    await syncMailbox(userId, id);
    return { jobId: id, status: 'completed' };
  }
}

export async function getSyncJob(userId, jobId) {
  const job = await SyncJob.findOne({ userId, queueJobId: jobId }).select('queueJobId status imported errorCode createdAt completedAt');
  if (!job) throw new AppError(404, 'RESOURCE_NOT_FOUND', 'Sync job was not found.');
  return job;
}

function formatRecipient(contact) {
  return contact.name ? `"${contact.name.replace(/["\r\n]/g, '')}" <${contact.email}>` : contact.email;
}

async function compileRawMessage({ from, to, cc, bcc, subject, bodyText, attachments = [], inReplyTo, references }) {
  const composer = new MailComposer({
    from, to: to.map(formatRecipient).join(', '), cc: cc.map(formatRecipient).join(', '), bcc: bcc.map(formatRecipient).join(', '),
    subject, text: bodyText, ...(inReplyTo ? { inReplyTo } : {}), ...(references ? { references } : {}),
    attachments: attachments.map((file) => ({ filename: file.originalname || file.filename, contentType: file.mimetype || file.mimeType, content: file.buffer }))
  });
  const raw = await composer.compile().build();
  return raw.toString('base64url');
}

async function loadDraftAttachments(gmail, draft) {
  if (!draft?.gmailDraftId) return [];
  const { data } = await gmail.users.drafts.get({ userId: 'me', id: draft.gmailDraftId, format: 'full' });
  const message = data.message;
  const parts = [];
  const visit = (part) => {
    if (!part) return;
    if (part.filename && (part.body?.attachmentId || part.body?.data)) parts.push(part);
    for (const child of part.parts || []) visit(child);
  };
  visit(message?.payload);
  const files = await Promise.all(parts.map(async (part) => {
    const encoded = part.body?.attachmentId
      ? (await gmail.users.messages.attachments.get({ userId: 'me', messageId: message.id, id: part.body.attachmentId })).data.data
      : part.body.data;
    return {
      filename: part.filename,
      mimeType: part.mimeType || 'application/octet-stream',
      buffer: Buffer.from(encoded.replace(/-/g, '+').replace(/_/g, '/'), 'base64')
    };
  }));
  const totalBytes = files.reduce((total, file) => total + file.buffer.length, 0);
  if (totalBytes > 25 * 1024 * 1024) throw new AppError(413, 'PAYLOAD_TOO_LARGE', 'This draft has more than 25 MB of attachments. Remove some attachments in Gmail before editing it here.');
  return files;
}

export async function saveDraft(userId, input, files = []) {
  const { gmail, account } = await getAuthorizedGmail(userId);
  const existing = input.draftId ? await Draft.findOne({ _id: input.draftId, userId, gmailAccountId: account._id }) : null;
  if (input.draftId && !existing) throw new AppError(404, 'RESOURCE_NOT_FOUND', 'Draft was not found.');
  const draft = existing || new Draft({ userId, gmailAccountId: account._id });
  const fields = { to: input.to || [], cc: input.cc || [], bcc: input.bcc || [], subject: input.subject || '', bodyText: input.bodyText || '', threadId: input.threadId || '', inReplyTo: normalizeMessageIds(input.inReplyTo).slice(0, 1000), references: normalizeMessageIds(input.references), aiGenerated: Boolean(input.aiGenerated), lastAiAction: input.lastAiAction || 'NONE' };
  const priorAttachments = existing && !input.removeExistingAttachments ? await loadDraftAttachments(gmail, existing) : [];
  const attachments = [...priorAttachments, ...files];
  const totalBytes = attachments.reduce((total, file) => total + (file.buffer?.length || file.size || 0), 0);
  if (totalBytes > 25 * 1024 * 1024) throw new AppError(413, 'PAYLOAD_TOO_LARGE', 'Attachments must total 25 MB or less.');
  const raw = await compileRawMessage({ from: account.gmailEmail, ...fields, attachments });
  const request = { userId: 'me', requestBody: { message: { raw, ...(fields.threadId ? { threadId: fields.threadId } : {}) } } };
  const response = draft.gmailDraftId
    ? await gmail.users.drafts.update({ ...request, id: draft.gmailDraftId })
    : await gmail.users.drafts.create(request);
  Object.assign(draft, fields, { gmailDraftId: response.data.id, attachments: attachments.map((file) => ({ filename: file.originalname || file.filename, mimeType: file.mimetype || file.mimeType, size: file.size || file.buffer?.length || 0 })) });
  await draft.save();
  return draft;
}

export async function listDrafts(userId) {
  return Draft.find({ userId }).sort({ updatedAt: -1 }).select('to cc bcc subject bodyText threadId inReplyTo references attachments aiGenerated lastAiAction createdAt updatedAt');
}

export async function deleteDraft(userId, draftId) {
  const draft = await Draft.findOne({ _id: draftId, userId });
  if (!draft) throw new AppError(404, 'RESOURCE_NOT_FOUND', 'Draft was not found.');
  if (draft.gmailDraftId && draft.gmailAccountId) {
    try {
      const { gmail } = await getAuthorizedGmail(userId);
      await gmail.users.drafts.delete({ userId: 'me', id: draft.gmailDraftId });
    } catch (error) {
      if (error.response?.status !== 404) throw error;
    }
  }
  await draft.deleteOne();
}

export async function sendEmail(userId, input, files = []) {
  const { gmail, account } = await getAuthorizedGmail(userId);
  if (!input.to?.length) throw new AppError(400, 'VALIDATION_ERROR', 'Add at least one recipient before sending.');
  const draft = input.draftId ? await Draft.findOne({ _id: input.draftId, userId, gmailAccountId: account._id }) : null;
  if (input.draftId && !draft) throw new AppError(404, 'RESOURCE_NOT_FOUND', 'Draft was not found.');
  const priorAttachments = draft && !input.removeExistingAttachments ? await loadDraftAttachments(gmail, draft) : [];
  const attachments = [...priorAttachments, ...files];
  const totalBytes = attachments.reduce((total, file) => total + (file.buffer?.length || file.size || 0), 0);
  if (totalBytes > 25 * 1024 * 1024) throw new AppError(413, 'PAYLOAD_TOO_LARGE', 'Attachments must total 25 MB or less.');
  const safeInput = { ...input, inReplyTo: normalizeMessageIds(input.inReplyTo).slice(0, 1000), references: normalizeMessageIds(input.references) };
  const raw = await compileRawMessage({ from: account.gmailEmail, ...safeInput, bodyText: input.bodyText || '', attachments });
  let messageId;
  if (draft?.gmailDraftId) {
    const request = { userId: 'me', id: draft.gmailDraftId, requestBody: { message: { raw, ...(input.threadId ? { threadId: input.threadId } : {}) } } };
    await gmail.users.drafts.update(request);
    const { data } = await gmail.users.drafts.send({ userId: 'me', requestBody: { id: draft.gmailDraftId } });
    messageId = data.message?.id;
  } else {
    const { data } = await gmail.users.messages.send({ userId: 'me', requestBody: { raw, ...(input.threadId ? { threadId: input.threadId } : {}) } });
    messageId = data.id;
  }
  if (draft) await draft.deleteOne();
  try {
    const { data: sentMessage } = await gmail.users.messages.get({ userId: 'me', id: messageId, format: 'full' });
    const normalized = normalizeMessage(sentMessage, userId, account._id);
    await Email.findOneAndUpdate({ gmailAccountId: account._id, gmailMessageId: messageId }, { $set: normalized }, { upsert: true, new: true, setDefaultsOnInsert: true });
  } catch (error) {
    console.error(JSON.stringify({ level: 'warn', code: 'SENT_MESSAGE_LOCAL_SYNC_FAILED', status: error.response?.status || 0 }));
  }
  return { messageId, status: 'sent' };
}

export async function mutateGmailEmail(userId, email, changes) {
  const { gmail } = await getAuthorizedGmail(userId);
  const addLabelIds = [];
  const removeLabelIds = [];
  if (typeof changes.isRead === 'boolean') (changes.isRead ? removeLabelIds : addLabelIds).push('UNREAD');
  if (typeof changes.isStarred === 'boolean') (changes.isStarred ? addLabelIds : removeLabelIds).push('STARRED');
  if (addLabelIds.length || removeLabelIds.length) await gmail.users.messages.modify({ userId: 'me', id: email.gmailMessageId, requestBody: { addLabelIds, removeLabelIds } });
    if (changes.trash === true) await gmail.users.messages.trash({ userId: 'me', id: email.gmailMessageId });
    if (changes.trash === false) await gmail.users.messages.untrash({ userId: 'me', id: email.gmailMessageId });
  return Email.findOneAndUpdate({ _id: email._id, userId }, { $set: {
    ...(typeof changes.isRead === 'boolean' ? { isRead: changes.isRead } : {}),
    ...(typeof changes.isStarred === 'boolean' ? { isStarred: changes.isStarred } : {}),
      ...(changes.trash === true ? { labels: email.labels.filter((label) => label !== 'INBOX').concat('TRASH') } : {}),
      ...(changes.trash === false ? { labels: email.labels.filter((label) => label !== 'TRASH').concat('INBOX') } : {})
  } }, { new: true });
}

export async function downloadAttachment(userId, email, attachmentId) {
  const { gmail } = await getAuthorizedGmail(userId);
  const attachment = email.attachments.find((item) => item.attachmentId === attachmentId || (!item.attachmentId && item.partId && `part-${item.partId}` === attachmentId));
  if (!attachment) throw new AppError(404, 'RESOURCE_NOT_FOUND', 'Attachment was not found.');
  let data;
  if (attachment.attachmentId) {
    const response = await gmail.users.messages.attachments.get({ userId: 'me', messageId: email.gmailMessageId, id: attachment.attachmentId });
    data = decodeBase64Url(response.data.data || '');
  } else {
    const response = await gmail.users.messages.get({ userId: 'me', id: email.gmailMessageId, format: 'full' });
    const part = findPart(response.data.payload, (candidate) => candidate.partId === attachment.partId);
    if (!part?.body?.data) throw new AppError(404, 'RESOURCE_NOT_FOUND', 'Attachment content was not found.');
    data = decodeBase64Url(part.body.data);
  }
  return { filename: attachment.filename || 'attachment', mimeType: attachment.mimeType, data };
}

export async function downloadInlineImage(userId, email, contentId) {
  const normalizedId = normalizeContentId(contentId);
  const attachment = email.attachments.find((item) => item.contentId && isPreviewImage(item.mimeType) && normalizeContentId(item.contentId) === normalizedId);
  if (!attachment) throw new AppError(404, 'RESOURCE_NOT_FOUND', 'Inline image was not found.');
  const file = await downloadAttachment(userId, email, attachment.attachmentId || `part-${attachment.partId}`);
  return file;
}

export async function loadThread(userId, threadId) {
  const items = await Email.find({ userId, threadId }).select('+bodyHtml').sort({ receivedAt: 1, _id: 1 });
  return items;
}
