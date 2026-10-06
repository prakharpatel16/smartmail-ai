import { http, unwrap } from './api.js';
export const settingsApi = {
  gmailStatus: () => unwrap(http.get('/gmail/status')),
  connectGmail: () => unwrap(http.get('/gmail/connect')),
  disconnectGmail: () => unwrap(http.delete('/gmail/connection')),
  getPreferences: () => unwrap(http.get('/preferences')),
  updatePreferences: (value) => unwrap(http.put('/preferences', value)),
  notifications: (params = {}) => unwrap(http.get('/notifications', { params })),
  markNotificationRead: (id, isRead = true) => unwrap(http.put(`/notifications/${id}/read`, { isRead })),
  markAllNotificationsRead: () => unwrap(http.put('/notifications/read-all'))
};
