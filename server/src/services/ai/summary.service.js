import { z } from 'zod';
import { generateValidatedJson, UNTRUSTED_EMAIL_RULE, asBoundedText } from './ai.service.js';

const resultSchema = z.object({ summary: z.string().min(1).max(4000), keyPoints: z.array(z.string()).max(12), actionItems: z.array(z.string()).max(12), deadlines: z.array(z.object({ description: z.string(), date: z.string().nullable() })).max(12) });
const responseSchema = {
  type: 'object', additionalProperties: false,
  properties: {
    summary: { type: 'string' },
    keyPoints: { type: 'array', items: { type: 'string' } },
    actionItems: { type: 'array', items: { type: 'string' } },
    deadlines: { type: 'array', items: { type: 'object', additionalProperties: false, properties: {
      description: { type: 'string' }, date: { type: ['string', 'null'] }
    }, required: ['description', 'date'] } }
  },
  required: ['summary', 'keyPoints', 'actionItems', 'deadlines']
};
export async function summarizeEmail(email, thread = []) {
  const messages = (thread.length ? thread : [email]).slice(-12).map((item) => ({ from: item.sender?.name || item.sender?.email, subject: item.subject, date: item.receivedAt, body: asBoundedText(item.bodyText) }));
  return generateValidatedJson({
    system: `You summarize emails accurately. ${UNTRUSTED_EMAIL_RULE} Return JSON with summary, keyPoints, actionItems, and deadlines[{description,date}]. Use null when a deadline date is not stated. State clearly if there is no action.`,
    prompt: JSON.stringify(messages), responseSchema, outputSchema: resultSchema
  });
}
