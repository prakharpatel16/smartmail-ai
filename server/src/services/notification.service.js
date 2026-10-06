import { Notification, UserPreference } from '../models/index.js';
import { emitToUser } from './socketEvents.service.js';

export async function createNotification(input) {
  const preferenceKey = {
    NEW_EMAIL: 'newEmail', HIGH_PRIORITY: 'priority', MEETING: 'meeting', PHISHING_ALERT: 'phishing'
  }[input.type];
  if (preferenceKey) {
    const preference = await UserPreference.findOne({ userId: input.userId }).select(`notifications.${preferenceKey}`).lean();
    if (preference?.notifications?.[preferenceKey] === false) return null;
  }
  const notification = await Notification.create({
    userId: input.userId,
    type: input.type,
    title: input.title,
    message: input.message || '',
    relatedEmailId: input.relatedEmailId || null
  });
  const publicNotification = {
    id: String(notification._id), type: notification.type, title: notification.title,
    message: notification.message, relatedEmailId: notification.relatedEmailId ? String(notification.relatedEmailId) : null,
    isRead: notification.isRead, createdAt: notification.createdAt
  };
  emitToUser(input.userId, 'notification:new', publicNotification);
  return publicNotification;
}
