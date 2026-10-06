import { z } from 'zod';
import { generateValidatedJson, UNTRUSTED_EMAIL_RULE, asBoundedText } from './ai.service.js';

const nullableString = z.string().max(1000).nullable();
const schema = z.object({
  summary: z.string().min(1).max(3000),
  keyPoints: z.array(z.string().max(500)).max(8),
  actionItems: z.array(z.string().max(500)).max(8),
  deadlines: z.array(z.object({ description: z.string().max(500), date: z.string().max(100).nullable() })).max(8),
  priority: z.object({ level: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']), reason: z.string().min(1).max(500) }),
  meetingDetected: z.boolean(),
  meeting: z.object({
    title: nullableString,
    date: nullableString,
    time: nullableString,
    timezone: nullableString,
    location: nullableString,
    meetingLink: nullableString,
    participants: z.array(z.string().max(300)).max(20)
  }).nullable(),
  phishing: z.object({ risk: z.enum(['SAFE', 'SUSPICIOUS', 'HIGH_RISK']), reasons: z.array(z.string().max(500)).max(10) })
});

const nullableStringSchema = { anyOf: [{ type: 'string' }, { type: 'null' }] };
const responseSchema = {
  type: 'object', additionalProperties: false,
  properties: {
    summary: { type: 'string' },
    keyPoints: { type: 'array', items: { type: 'string' } },
    actionItems: { type: 'array', items: { type: 'string' } },
    deadlines: { type: 'array', items: { type: 'object', additionalProperties: false, properties: {
      description: { type: 'string' }, date: nullableStringSchema
    }, required: ['description', 'date'] } },
    priority: { type: 'object', additionalProperties: false, properties: {
      level: { type: 'string', enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] }, reason: { type: 'string' }
    }, required: ['level', 'reason'] },
    meetingDetected: { type: 'boolean' },
    meeting: { anyOf: [{ type: 'object', additionalProperties: false, properties: {
      title: nullableStringSchema, date: nullableStringSchema, time: nullableStringSchema,
      timezone: nullableStringSchema, location: nullableStringSchema, meetingLink: nullableStringSchema,
      participants: { type: 'array', items: { type: 'string' } }
    }, required: ['title', 'date', 'time', 'timezone', 'location', 'meetingLink', 'participants'] }, { type: 'null' }] },
    phishing: { type: 'object', additionalProperties: false, properties: {
      risk: { type: 'string', enum: ['SAFE', 'SUSPICIOUS', 'HIGH_RISK'] },
      reasons: { type: 'array', items: { type: 'string' } }
    }, required: ['risk', 'reasons'] }
  },
  required: ['summary', 'keyPoints', 'actionItems', 'deadlines', 'priority', 'meetingDetected', 'meeting', 'phishing']
};

export async function analyzeEmail(email, { priority = true, meeting = true, phishing = true } = {}) {
  const body = asBoundedText(email.bodyText).slice(0, 12_000);
  const links = [...body.matchAll(/https?:\/\/[^\s<>"')]+/gi)]
    .map((match) => match[0]).slice(0, 20);
  const emailSource = {
    sender: email.sender,
    recipients: email.recipients,
    subject: email.subject,
    receivedAt: email.receivedAt,
    body,
    links,
    attachments: email.attachments || []
  };
  return generateValidatedJson({
    system: `Analyze this email for its summary, key points, action items, deadlines, priority, meeting details, and phishing indicators in one pass. ${UNTRUSTED_EMAIL_RULE} Be concise and evidence-based. Do not infer meeting details or deadlines. A SAFE phishing result is not a guarantee. For disabled checks, use neutral defaults (MEDIUM priority, no meeting, SAFE phishing). Return every field required by the JSON schema.`,
    prompt: JSON.stringify({ enabledChecks: { priority, meeting, phishing }, email: emailSource }),
    responseSchema,
    outputSchema: schema,
    maxOutputTokens: 1000
  });
}
