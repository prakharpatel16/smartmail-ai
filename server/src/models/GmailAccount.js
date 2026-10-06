import mongoose from 'mongoose';

const gmailAccountSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  gmailEmail: { type: String, required: true, lowercase: true, trim: true },
  googleAccountId: { type: String, default: '' },
  accessTokenEncrypted: { type: String, required: true, select: false },
  refreshTokenEncrypted: { type: String, required: true, select: false },
  tokenExpiresAt: { type: Date, default: null },
  scopes: { type: [String], default: [] },
  historyId: { type: String, default: '' },
  lastSyncedAt: { type: Date, default: null },
  autoSyncLockUntil: { type: Date, default: null, select: false },
  isConnected: { type: Boolean, default: true }
}, { timestamps: true, versionKey: false });

gmailAccountSchema.index({ userId: 1, gmailEmail: 1 }, { unique: true });
gmailAccountSchema.index({ isConnected: 1, lastSyncedAt: 1, autoSyncLockUntil: 1 });
export default mongoose.model('GmailAccount', gmailAccountSchema);
