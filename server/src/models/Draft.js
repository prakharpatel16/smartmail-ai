import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({ name: { type: String, default: '', maxlength: 200 }, email: { type: String, required: true, lowercase: true, trim: true, maxlength: 254 } }, { _id: false });
const draftSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  gmailAccountId: { type: mongoose.Schema.Types.ObjectId, ref: 'GmailAccount', default: null },
  gmailDraftId: { type: String, default: '' },
  threadId: { type: String, default: '' },
  inReplyTo: { type: String, default: '', maxlength: 1000 },
  references: { type: String, default: '', maxlength: 4000 },
  to: { type: [contactSchema], default: [] }, cc: { type: [contactSchema], default: [] }, bcc: { type: [contactSchema], default: [] },
  subject: { type: String, default: '', maxlength: 998 }, bodyText: { type: String, default: '', maxlength: 100_000 },
  attachments: { type: [{ filename: String, mimeType: String, size: Number, attachmentId: String }], default: [] },
  aiGenerated: { type: Boolean, default: false }, lastAiAction: { type: String, enum: ['WRITE', 'REWRITE', 'REPLY', 'NONE'], default: 'NONE' }
}, { timestamps: true, versionKey: false });
draftSchema.index({ userId: 1, updatedAt: -1 });
draftSchema.index({ gmailAccountId: 1, gmailDraftId: 1 }, { unique: true });
export default mongoose.model('Draft', draftSchema);
