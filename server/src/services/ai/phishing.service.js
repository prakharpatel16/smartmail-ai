import { z } from 'zod';
import { generateValidatedJson, UNTRUSTED_EMAIL_RULE, asBoundedText } from './ai.service.js';

const schema = z.object({ risk: z.enum(['SAFE', 'SUSPICIOUS', 'HIGH_RISK']), reasons: z.array(z.string()).max(10) });
const responseSchema = { type: 'object', additionalProperties: false, properties: {
  risk: { type: 'string', enum: ['SAFE', 'SUSPICIOUS', 'HIGH_RISK'] }, reasons: { type: 'array', items: { type: 'string' } }
}, required: ['risk', 'reasons'] };
export async function analyzePhishing(email) {
  return generateValidatedJson({
    system: `Assess likely phishing and social-engineering indicators. Consider sender/domain mismatch, links, credential/payment requests, urgency, impersonation, and attachments. ${UNTRUSTED_EMAIL_RULE} Never claim certainty; SAFE is not a guarantee. Return JSON {risk,reasons}.`,
    prompt: JSON.stringify({ sender: email.sender, subject: email.subject, body: asBoundedText(email.bodyText), links: [...String(email.bodyText || '').matchAll(/https?:\/\/[^\s<>"')]+/gi)].map((match) => match[0]).slice(0, 20), attachments: email.attachments || [] }), responseSchema, outputSchema: schema
  });
}
