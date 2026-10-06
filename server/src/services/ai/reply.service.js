import { z } from 'zod';
import { generateValidatedJson, UNTRUSTED_EMAIL_RULE, asBoundedText } from './ai.service.js';

const schema = z.object({ subject: z.string().max(998), bodyText: z.string().min(1).max(20_000) });
const responseSchema = { type: 'object', additionalProperties: false, properties: {
  subject: { type: 'string' }, bodyText: { type: 'string' }
}, required: ['subject', 'bodyText'] };
export async function generateReply(email, thread = [], { tone = 'professional', instruction = '' } = {}) {
  const context = (thread.length ? thread : [email]).slice(-10).map((item) => ({ from: item.sender?.name || item.sender?.email, subject: item.subject, body: asBoundedText(item.bodyText) }));
  return generateValidatedJson({
    system: `Write a natural editable email reply in a ${tone} tone. ${UNTRUSTED_EMAIL_RULE} Preserve facts. Do not invent dates, links, names, commitments, or attachments. Never send the message. Return JSON {subject,bodyText}.`,
    prompt: JSON.stringify({ instruction: asBoundedText(instruction), conversation: context }), responseSchema, outputSchema: schema
  });
}
