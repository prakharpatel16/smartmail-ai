import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notifications', initialState: { items: [], unread: 0 },
  reducers: {
    setNotifications: (state, action) => { state.items = action.payload.items || []; state.unread = action.payload.unread || 0; },
    addNotification: (state, action) => { state.items = [action.payload, ...state.items.filter((item) => item.id !== action.payload.id)].slice(0, 30); if (!action.payload.isRead) state.unread += 1; },
    updateNotification: (state, action) => { state.items = state.items.map((item) => item.id === action.payload.id ? { ...item, ...action.payload } : item); state.unread = state.items.filter((item) => !item.isRead).length; },
    clearNotifications: (state) => { state.items = []; state.unread = 0; }
  }
});
export const { setNotifications, addNotification, updateNotification, clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
