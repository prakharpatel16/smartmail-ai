import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { useToast } from './Toast.jsx';
import { setNotifications } from '../store/notificationSlice.js';
import { settingsApi } from '../services/settingsApi.js';
import { watchTheme } from '../services/theme.js';
import { Sidebar } from './Sidebar.jsx';
import { Topbar } from './Topbar.jsx';
import { ToastProvider } from './Toast.jsx';

export function ProtectedLayout() {
  const dispatch = useDispatch();
  useEffect(() => {
    let live = true;
    settingsApi.notifications({ limit: 30 }).then((data) => {
      if (live) dispatch(setNotifications(data));
    }).catch(() => {});
    let stopTheme = () => {};
    settingsApi.getPreferences().then(({ preferences }) => { if (live) stopTheme = watchTheme(preferences?.theme); }).catch(() => { if (live) stopTheme = watchTheme('light'); });
    return () => { live = false; stopTheme(); };
  }, [dispatch]);
  return <ToastProvider><RealtimeBridge /><div className="app-shell"><Sidebar /><div className="app-main"><Topbar /><main className="page-wrap"><Outlet /></main></div></div></ToastProvider>;
}

function RealtimeBridge() {
  const dispatch = useDispatch(); const toast = useToast(); const location = useLocation(); const pathname = useRef(location.pathname);
  useEffect(() => { pathname.current = location.pathname; }, [location.pathname]);
  useEffect(() => {
    const socket = io(import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_BASE_URL?.replace(/\/api\/?$/, '') || 'http://localhost:5000', { withCredentials: true, transports: ['websocket', 'polling'] });
    let refreshTimer;
    socket.on('notification:new', (notification) => dispatch({ type: 'notifications/addNotification', payload: notification }));
    socket.on('mailbox:sync-completed', (event) => {
      window.dispatchEvent(new Event('smartmail:emails-updated'));
      if (pathname.current === '/inbox') toast(`${event.imported} messages synchronized.`, 'info');
    });
    socket.on('ai:completed', (event) => {
      window.clearTimeout(refreshTimer);
      refreshTimer = window.setTimeout(() => window.dispatchEvent(new Event('smartmail:emails-updated')), 500);
      if (event.status === 'completed' && pathname.current === `/email/${event.emailId}`) toast('AI analysis is ready for this message.', 'info');
    });
    return () => { window.clearTimeout(refreshTimer); socket.disconnect(); };
  }, [dispatch, toast]);
  return null;
}

