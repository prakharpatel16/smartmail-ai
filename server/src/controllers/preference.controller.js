import { z } from 'zod';
import { UserPreference } from '../models/index.js';
import { asyncHandler } from '../utils/AppError.js';

const preferenceSchema = z.object({
  replyTone: z.enum(['professional', 'friendly', 'formal', 'concise']).optional(),
  writerTone: z.enum(['professional', 'friendly', 'formal', 'concise']).optional(),
  theme: z.enum(['light', 'dark', 'system']).optional(),
  notifications: z.object({ newEmail: z.boolean().optional(), priority: z.boolean().optional(), meeting: z.boolean().optional(), phishing: z.boolean().optional() }).strict().optional(),
  aiFeatures: z.object({ priorityDetection: z.boolean().optional(), meetingDetection: z.boolean().optional(), phishingDetection: z.boolean().optional() }).strict().optional()
}).strict();

export const getPreferences = asyncHandler(async (req, res) => {
  const preferences = await UserPreference.findOneAndUpdate({ userId: req.user.id }, { $setOnInsert: { userId: req.user.id } }, { upsert: true, new: true, setDefaultsOnInsert: true });
  res.json({ success: true, data: { preferences } });
});

export const updatePreferences = asyncHandler(async (req, res) => {
  const input = preferenceSchema.parse(req.body);
  const update = {};
  for (const [key, value] of Object.entries(input)) {
    if (value && typeof value === 'object') for (const [nestedKey, nestedValue] of Object.entries(value)) update[`${key}.${nestedKey}`] = nestedValue;
    else update[key] = value;
  }
  const preferences = await UserPreference.findOneAndUpdate({ userId: req.user.id }, { $set: update, $setOnInsert: { userId: req.user.id } }, { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true });
  res.json({ success: true, data: { preferences } });
});
