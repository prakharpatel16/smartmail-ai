import { z } from 'zod';
import { generateValidatedJson, UNTRUSTED_EMAIL_RULE, asBoundedText } from './ai.service.js';

const schema = z.object({ meetingDetected: z.boolean(), meeting: z.object({ title: z.string().nullable(), date: z.string().nullable(), time: z.string().nullable(), timezone: z.string().nullable(), location: z.string().nullable(), meetingLink: z.string().nullable(), participants: z.array(z.string()).max(20) }).nullable() });
const nullableString = { anyOf: [{ type: 'string' }, { type: 'null' }] };
const responseSchema = { type: 'object', additionalProperties: false, properties: {
  meetingDetected: { type: 'boolean' },
  meeting: { anyOf: [{ type: 'object', additionalProperties: false, properties: {
    title: nullableString, date: nullableString, time: nullableString, timezone: nullableString,
    location: nullableString, meetingLink: nullableString, participants: { type: 'array', items: { type: 'string' } }
  }, required: ['title', 'date', 'time', 'timezone', 'location', 'meetingLink', 'participants'] }, { type: 'null' }] }
}, required: ['meetingDetected', 'meeting'] };
export async function detectMeeting(email) {
  const parsed = await generateValidatedJson({
    system: `Extract explicit meeting, interview, appointment, call, or scheduled-event details. ${UNTRUSTED_EMAIL_RULE} Return null for unknown fields. Do not create calendar events. Return JSON {meetingDetected,meeting}.`,
    prompt: JSON.stringify({ sender: email.sender, recipients: email.recipients, subject: email.subject, body: asBoundedText(email.bodyText) }), responseSchema, outputSchema: schema
  });
  return parsed.meetingDetected ? parsed : { meetingDetected: false, meeting: null };
}
