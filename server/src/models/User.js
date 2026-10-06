import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, lowercase: true, trim: true, maxlength: 254 },
  passwordHash: { type: String, required: true, select: false },
  emailVerifiedAt: { type: Date },
  sessionVersion: { type: Number, default: 0, select: false },
  avatarUrl: { type: String, default: '' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true, versionKey: false });

userSchema.index({ email: 1 }, { unique: true });
export default mongoose.model('User', userSchema);
