import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentUser } from './store/authSlice.js';
import { ProtectedLayout } from './components/ProtectedLayout.jsx';
import { AuthPage } from './pages/AuthPage.jsx';
import { DashboardPage } from './pages/DashboardPage.jsx';
import { InboxPage } from './pages/InboxPage.jsx';
import { EmailPage } from './pages/EmailPage.jsx';
import { ComposePage } from './pages/ComposePage.jsx';
import { AskInboxPage } from './pages/AskInboxPage.jsx';
import { SettingsPage } from './pages/SettingsPage.jsx';
import { UtilityPage } from './pages/UtilityPage.jsx';

function AuthGate({ children }) {
  const { user, initialized, loading } = useSelector((state) => state.auth);
  const location = useLocation();
  if (!initialized || loading) return <div className="screen-loader"><span className="spinner" /> Loading SmartMail</div>;
  return user ? children : <Navigate to="/login" replace state={{ from: location }} />;
}

function GuestGate({ children }) {
  const { user, initialized, loading } = useSelector((state) => state.auth);
  if (!initialized || loading) return <div className="screen-loader"><span className="spinner" /> Loading SmartMail</div>;
  return user ? <Navigate to="/dashboard" replace /> : children;
}

export default function App() {
  const dispatch = useDispatch();
  useEffect(() => { dispatch(fetchCurrentUser()); }, [dispatch]);
  return <Routes>
    <Route path="/login" element={<GuestGate><AuthPage mode="login" /></GuestGate>} />
    <Route path="/register" element={<GuestGate><AuthPage mode="register" /></GuestGate>} />
    <Route element={<AuthGate><ProtectedLayout /></AuthGate>}>
      <Route index element={<Navigate to="/dashboard" replace />} />
      <Route path="dashboard" element={<DashboardPage />} />
      <Route path="inbox" element={<InboxPage view="inbox" />} />
      <Route path="starred" element={<InboxPage view="starred" />} />
      <Route path="sent" element={<InboxPage view="sent" />} />
      <Route path="drafts" element={<InboxPage view="drafts" />} />
      <Route path="trash" element={<InboxPage view="trash" />} />
      <Route path="email/:id" element={<EmailPage />} />
      <Route path="compose" element={<ComposePage />} />
      <Route path="ask" element={<AskInboxPage />} />
      <Route path="meetings" element={<UtilityPage kind="meetings" />} />
      <Route path="security" element={<UtilityPage kind="security" />} />
      <Route path="settings" element={<SettingsPage />} />
      <Route path="*" element={<UtilityPage kind="not-found" />} />
    </Route>
  </Routes>;
}
