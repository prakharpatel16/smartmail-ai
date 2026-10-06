import { http, unwrap } from './api.js';

export const aiApi = {
  summary: (emailId) => unwrap(http.post('/ai/summary', { emailId })),
  reply: (input) => unwrap(http.post('/ai/reply', input)),
  write: (input) => unwrap(http.post('/ai/write', input)),
  rewrite: (input) => unwrap(http.post('/ai/rewrite', input)),
  priority: (emailId) => unwrap(http.post('/ai/priority', { emailId })),
  meeting: (emailId) => unwrap(http.post('/ai/meeting', { emailId })),
  phishing: (emailId) => unwrap(http.post('/ai/phishing', { emailId })),
  check: (input) => unwrap(http.post('/ai/check', input)),
  ask: (input) => unwrap(http.post('/rag/chat', input)),
  chatHistory: (chatId) => unwrap(http.get('/rag/history', { params: chatId ? { chatId } : {} }))
};
