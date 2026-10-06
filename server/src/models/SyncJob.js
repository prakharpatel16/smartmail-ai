import mongoose from 'mongoose';

const syncJobSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  queueJobId: { type: String, required: true, unique: true },
  status: { type: String, enum: ['QUEUED', 'ACTIVE', 'COMPLETED', 'FAILED'], default: 'QUEUED' },
  imported: { type: Number, default: 0 },
  errorCode: { type: String, default: '' },
  startedAt: Date,
  completedAt: Date
}, { timestamps: true, versionKey: false });
syncJobSchema.index({ userId: 1, createdAt: -1 });
export default mongoose.model('SyncJob', syncJobSchema);
