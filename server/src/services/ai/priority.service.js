import { z } from 'zod';
import { generateValidatedJson, UNTRUSTED_EMAIL_RULE, asBoundedText } from './ai.service.js';

const schema = z.object({ level: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']), reason: z.string().min(1).max(500) });
const responseSchema = { type: 'object', additionalProperties: false, properties: {
  level: { type: 'string', enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] }, reason: { type: 'string' }
}, required: ['level', 'reason'] };
export async function classifyPriority(email) {
  return generateValidatedJson({
    system: `Classify urgency using only evidence. Strong wording alone is not enough. ${UNTRUSTED_EMAIL_RULE} Choose CRITICAL, HIGH, MEDIUM, or LOW and explain briefly. Return JSON {level,reason}.`,
    prompt: JSON.stringify({ sender: email.sender, subject: email.subject, receivedAt: email.receivedAt, body: asBoundedText(email.bodyText) }), responseSchema, outputSchema: schema
  });
}
