import { z } from 'zod';
import { generateValidatedJson } from './ai.service.js';

const schema = z.object({ rewrittenText: z.string().min(1).max(20_000), changes: z.array(z.string()).max(10) });
const responseSchema = { type: 'object', additionalProperties: false, properties: {
  rewrittenText: { type: 'string' }, changes: { type: 'array', items: { type: 'string' } }
}, required: ['rewrittenText', 'changes'] };
export async function rewriteEmail(text, mode) {
  return generateValidatedJson({
    system: `Rewrite an email in the selected mode: ${mode}. Preserve original intent, names, dates, numbers, facts, commitments, and requests. Do not add facts or send the email. Return JSON {rewrittenText,changes}.`,
    prompt: JSON.stringify({ originalText: String(text).slice(0, 20_000) }), responseSchema, outputSchema: schema
  });
}
