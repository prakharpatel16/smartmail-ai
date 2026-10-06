import { configureStore } from '@reduxjs/toolkit';
import auth from './authSlice.js';
import notifications from './notificationSlice.js';

export const store = configureStore({ reducer: { auth, notifications } });
