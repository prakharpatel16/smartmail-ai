import mongoose from 'mongoose';

const ragChatSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, default: 'Inbox question', maxlength: 160 },
  messages: [{
    role: { type: String, enum: ['user', 'assistant'], required: true },
    content: { type: String, required: true, maxlength: 20_000 },
    sources: [{ emailId: mongoose.Schema.Types.ObjectId, subject: String, sender: String, receivedAt: Date }],
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true, versionKey: false });
ragChatSchema.index({ userId: 1, updatedAt: -1 });
export default mongoose.model('RagChat', ragChatSchema);
