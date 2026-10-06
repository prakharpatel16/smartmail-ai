import { http, unwrap } from './api.js';
export const authApi = {
  me: () => unwrap(http.get('/auth/me')),
  login: (input) => unwrap(http.post('/auth/login', input)),
  register: (input) => unwrap(http.post('/auth/register', input)),
  verifyEmail: (input) => unwrap(http.post('/auth/verify-email', input)),
  resendVerification: (input) => unwrap(http.post('/auth/resend-verification', input)),
  logout: () => http.post('/auth/logout')
};
