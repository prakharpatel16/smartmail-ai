import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  name: { type: String, default: '', trim: true, maxlength: 200 },
  email: { type: String, default: '', lowercase: true, trim: true, maxlength: 254 }
}, { _id: false });

const emailSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  gmailAccountId: { type: mongoose.Schema.Types.ObjectId, ref: 'GmailAccount', required: true },
  gmailMessageId: { type: String, required: true },
  threadId: { type: String, required: true, index: true },
  messageIdHeader: { type: String, default: '', maxlength: 1000 },
  inReplyTo: { type: String, default: '', maxlength: 1000 },
  references: { type: String, default: '', maxlength: 4000 },
  sender: { type: contactSchema, default: () => ({}) },
  recipients: { type: [contactSchema], default: [] },
  cc: { type: [contactSchema], default: [] },
  bcc: { type: [contactSchema], default: [] },
  subject: { type: String, default: '', maxlength: 998 },
  bodyText: { type: String, default: '' },
  bodyHtml: { type: String, default: '', select: false },
  snippet: { type: String, default: '', maxlength: 500 },
  receivedAt: { type: Date, default: Date.now, index: true },
  labels: { type: [String], default: [] },
  isRead: { type: Boolean, default: false },
  isStarred: { type: Boolean, default: false },
  hasAttachments: { type: Boolean, default: false },
  attachments: { type: [{ filename: String, mimeType: String, size: Number, attachmentId: String, partId: String, contentId: String, isInline: Boolean }], default: [] },
  ai: {
    summary: { type: String, default: '' },
    priority: {
      level: { type: String, enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'], default: 'MEDIUM' },
      reason: { type: String, default: '' },
      manuallyOverridden: { type: Boolean, default: false }
    },
    meetingDetected: { type: Boolean, default: false },
    meeting: {
      title: { type: String, default: '' }, date: { type: String, default: '' }, time: { type: String, default: '' },
      timezone: { type: String, default: '' }, location: { type: String, default: '' }, meetingLink: { type: String, default: '' },
      participants: { type: [String], default: [] }
    },
    phishing: {
      risk: { type: String, enum: ['SAFE', 'SUSPICIOUS', 'HIGH_RISK'], default: 'SAFE' },
      reasons: { type: [String], default: [] }
    },
    processedAt: { type: Date, default: null }
  },
  aiProcessing: {
    status: { type: String, enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'], default: 'PENDING' },
    attempts: { type: Number, default: 0 },
    completedTasks: { type: [{ type: String, enum: ['summary', 'priority', 'meeting', 'phishing', 'embedding'] }], default: [] },
    lastError: { type: String, default: '' }, startedAt: Date, completedAt: Date
  },
  embedding: { type: [Number], default: undefined, select: false },
  embeddingModel: { type: String, default: '', select: false },
  embeddingUpdatedAt: { type: Date, default: null, select: false }
}, { timestamps: true, versionKey: false });

emailSchema.index({ gmailAccountId: 1, gmailMessageId: 1 }, { unique: true });
emailSchema.index({ userId: 1, receivedAt: -1, _id: -1 });
emailSchema.index({ userId: 1, isRead: 1, receivedAt: -1 });
emailSchema.index({ userId: 1, isStarred: 1, receivedAt: -1 });
emailSchema.index({ userId: 1, 'ai.priority.level': 1, receivedAt: -1 });
emailSchema.index({ userId: 1, 'ai.meetingDetected': 1, receivedAt: -1 });
emailSchema.index({ userId: 1, 'ai.phishing.risk': 1, receivedAt: -1 });
emailSchema.index({ userId: 1, labels: 1, receivedAt: -1 });
emailSchema.index({ userId: 1, subject: 'text', bodyText: 'text', 'sender.email': 'text', 'sender.name': 'text' });

export default mongoose.model('Email', emailSchema);
