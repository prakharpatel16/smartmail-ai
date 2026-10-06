import { Email } from '../../models/index.js';
import { aiEmbeddingModel } from '../../config/env.js';
import { generateEmbedding } from './ai.service.js';

export async function embedEmail(email) {
  const text = [email.subject, email.sender?.name, email.sender?.email, email.bodyText].filter(Boolean).join('\n');
  if (!text.trim()) return false;
  const vector = await generateEmbedding(text, 'RETRIEVAL_DOCUMENT');
  await Email.updateOne({ _id: email._id, userId: email.userId }, { $set: { embedding: vector, embeddingModel: aiEmbeddingModel, embeddingUpdatedAt: new Date() } });
  return true;
}
