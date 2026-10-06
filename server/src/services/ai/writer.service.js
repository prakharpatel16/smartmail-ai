import { z } from 'zod';
import { generateValidatedJson } from './ai.service.js';

const schema = z.object({ subject: z.string().max(998), bodyText: z.string().min(1).max(20_000) });
const responseSchema = { type: 'object', additionalProperties: false, properties: {
  subject: { type: 'string' }, bodyText: { type: 'string' }
}, required: ['subject', 'bodyText'] };
export async function writeEmail({ instruction, context = '', tone = 'professional', subjectHint = '' }) {
  return generateValidatedJson({
    system: `Write an editable email using only facts supplied by the user. Do not invent specific names, dates, commitments, prices, or organizations. A neutral greeting is preferred when no recipient name is provided. Use a ${tone} tone. Never send email. Return JSON {subject,bodyText}.`,
    prompt: JSON.stringify({ instruction: String(instruction).slice(0, 6000), context: String(context).slice(0, 6000), subjectHint: String(subjectHint).slice(0, 500) }), responseSchema, outputSchema: schema
  });
}
