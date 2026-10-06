import { http, unwrap } from './api.js';

export const emailApi = {
  list: (params) => unwrap(http.get('/emails', { params })),
  stats: () => unwrap(http.get('/emails/stats')),
  get: (id) => unwrap(http.get(`/emails/${id}`)),
  thread: (threadId) => unwrap(http.get(`/emails/thread/${encodeURIComponent(threadId)}`)),
  sync: () => unwrap(http.post('/emails/sync')),
  syncStatus: (jobId) => unwrap(http.get(`/emails/sync/${encodeURIComponent(jobId)}`)),
  setRead: (id, isRead) => unwrap(http.put(`/emails/${id}/read`, { isRead })),
  setStar: (id, isStarred) => unwrap(http.put(`/emails/${id}/star`, { isStarred })),
  setPriority: (id, level) => unwrap(http.put(`/emails/${id}/priority`, { level })),
  setPriority: (id, level) => unwrap(http.put(`/emails/${id}/priority`, { level })),
  trash: (id, trash = true) => unwrap(http.patch(`/emails/${id}/trash`, { trash })),
  removeMeeting: (id) => unwrap(http.patch(`/emails/${id}/meeting`)),
  drafts: () => unwrap(http.get('/emails/drafts')),
  saveDraft: (formData) => unwrap(http.post('/emails/draft', formData, { headers: { 'Content-Type': 'multipart/form-data' } })),
  send: (formData) => unwrap(http.post('/emails/send', formData, { headers: { 'Content-Type': 'multipart/form-data' } })),
  deleteDraft: (id) => unwrap(http.delete(`/emails/drafts/${id}`)),
  inlineImage: (emailId, contentId) => http.get(`/emails/${emailId}/inline-image`, { params: { cid: contentId }, responseType: 'blob' }),
  attachment: (emailId, attachmentId) => http.get(`/emails/${emailId}/attachment/${encodeURIComponent(attachmentId)}`, { responseType: 'blob' })
};
