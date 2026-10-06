import mongoose from 'mongoose';

const pendingRegistrationSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, lowercase: true, trim: true, maxlength: 254 },
  passwordHash: { type: String, required: true, select: false },
  otpHash: { type: String, required: true, select: false },
  attempts: { type: Number, default: 0, min: 0, max: 5 },
  expiresAt: { type: Date, required: true },
  lastSentAt: { type: Date, required: true }
}, { timestamps: true, versionKey: false });

pendingRegistrationSchema.index({ email: 1 }, { unique: true });
pendingRegistrationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('PendingRegistration', pendingRegistrationSchema);
