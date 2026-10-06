import axios from 'axios';

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api').replace(/\/+$/, '');

export const http = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 75_000,
  headers: { 'X-Requested-With': 'XMLHttpRequest' }
});

http.interceptors.request.use((config) => {
  if (!['get', 'head', 'options'].includes((config.method || 'get').toLowerCase())) {
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
  }
  return config;
});

export function apiError(error, fallback = 'Something went wrong. Please try again.') {
  return error?.response?.data?.error?.message || error?.message || fallback;
}

export const unwrap = async (request) => (await request).data.data;
