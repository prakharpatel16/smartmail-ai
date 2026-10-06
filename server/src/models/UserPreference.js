import mongoose from 'mongoose';

const preferenceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  replyTone: { type: String, enum: ['professional', 'friendly', 'formal', 'concise'], default: 'professional' },
  writerTone: { type: String, enum: ['professional', 'friendly', 'formal', 'concise'], default: 'professional' },
  theme: { type: String, enum: ['light', 'dark', 'system'], default: 'light' },
  notifications: {
    newEmail: { type: Boolean, default: true }, priority: { type: Boolean, default: true },
    meeting: { type: Boolean, default: true }, phishing: { type: Boolean, default: true }
  },
  aiFeatures: {
    priorityDetection: { type: Boolean, default: true }, meetingDetection: { type: Boolean, default: true },
    phishingDetection: { type: Boolean, default: true }
  }
}, { timestamps: true, versionKey: false });
export default mongoose.model('UserPreference', preferenceSchema);
