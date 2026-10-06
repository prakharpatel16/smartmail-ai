import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: { type: String, enum: ['NEW_EMAIL', 'HIGH_PRIORITY', 'MEETING', 'PHISHING_ALERT', 'AI_COMPLETED', 'SYNC_COMPLETED'], required: true },
  title: { type: String, required: true, maxlength: 160 },
  message: { type: String, default: '', maxlength: 500 },
  relatedEmailId: { type: mongoose.Schema.Types.ObjectId, ref: 'Email', default: null },
  isRead: { type: Boolean, default: false }
}, { timestamps: true, versionKey: false });
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });
export default mongoose.model('Notification', notificationSchema);
