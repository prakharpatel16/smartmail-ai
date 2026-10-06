import { z } from 'zod';
import { Notification } from '../models/index.js';
import { asyncHandler, AppError } from '../utils/AppError.js';

export const listNotifications = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 30));
  const [items, total, unread] = await Promise.all([
    Notification.find({ userId: req.user.id }).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    Notification.countDocuments({ userId: req.user.id }), Notification.countDocuments({ userId: req.user.id, isRead: false })
  ]);
  res.json({ success: true, data: { items: items.map((item) => ({ id: String(item._id), type: item.type, title: item.title, message: item.message, relatedEmailId: item.relatedEmailId ? String(item.relatedEmailId) : null, isRead: item.isRead, createdAt: item.createdAt })), page, limit, total, unread } });
});

export const markNotificationRead = asyncHandler(async (req, res) => {
  const isRead = req.body.isRead === undefined ? true : z.boolean().parse(req.body.isRead);
  const item = await Notification.findOneAndUpdate({ _id: req.params.id, userId: req.user.id }, { $set: { isRead } }, { new: true });
  if (!item) throw new AppError(404, 'RESOURCE_NOT_FOUND', 'Notification was not found.');
  res.json({ success: true, data: { id: String(item._id), isRead: item.isRead } });
});

export const markAllRead = asyncHandler(async (req, res) => {
  const result = await Notification.updateMany({ userId: req.user.id, isRead: false }, { $set: { isRead: true } });
  res.json({ success: true, data: { modifiedCount: result.modifiedCount } });
});
