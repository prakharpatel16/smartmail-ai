import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, CheckCheck, Search, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { settingsApi } from '../services/settingsApi.js';
import { updateNotification } from '../store/notificationSlice.js';
import { useToast } from './Toast.jsx';

const titles = { '/dashboard': 'Overview', '/inbox': 'Inbox', '/starred': 'Starred', '/sent': 'Sent', '/drafts': 'Drafts', '/trash': 'Trash', '/ask': 'Ask My Inbox', '/meetings': 'Meetings', '/security': 'Security', '/settings': 'Settings', '/compose': 'New message' };
export function Topbar() {
  const location = useLocation(); const navigate = useNavigate(); const dispatch = useDispatch(); const toast = useToast();
  const [search, setSearch] = useState(new URLSearchParams(location.search).get('search') || '');
  const [open, setOpen] = useState(false); const [busy, setBusy] = useState(false); const popover = useRef(null);
  const { items, unread } = useSelector((state) => state.notifications);
  useEffect(() => { setSearch(new URLSearchParams(location.search).get('search') || ''); }, [location.search]);
  useEffect(() => {
    const close = (event) => { if (!popover.current?.contains(event.target)) setOpen(false); };
    document.addEventListener('mousedown', close); return () => document.removeEventListener('mousedown', close);
  }, []);
  const submit = (event) => { event.preventDefault(); navigate(`/inbox${search.trim() ? `?search=${encodeURIComponent(search.trim())}` : ''}`); };
  const markRead = async (item) => { try { await settingsApi.markNotificationRead(item.id); dispatch(updateNotification({ id: item.id, isRead: true })); } catch { toast('Unable to update notification.', 'error'); } };
  const markAll = async () => { if (!unread) return; setBusy(true); try { await settingsApi.markAllNotificationsRead(); items.filter((item) => !item.isRead).forEach((item) => dispatch(updateNotification({ id: item.id, isRead: true }))); } catch { toast('Unable to update notifications.', 'error'); } finally { setBusy(false); } };
  const title = titles[location.pathname] || (location.pathname.startsWith('/email/') ? 'Message' : 'SmartMail');
  return <header className="topbar"><div className="mobile-brand">smartmail<span>.ai</span></div><div className="topbar-title">{title}</div><form className="search-box" onSubmit={submit}><Search size={17} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search emails..." aria-label="Search emails" />{search && <button type="button" className="icon-button" onClick={() => setSearch('')} aria-label="Clear search"><X size={15} /></button>}</form><div className="notification-anchor" ref={popover}><button className={`icon-button notification-button ${unread ? 'has-unread' : ''}`} onClick={() => setOpen(!open)} aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`}><Bell size={19} />{unread > 0 && <i />}</button>{open && <div className="notification-popover"><div className="popover-header"><strong>Notifications</strong><button className="text-button" disabled={!unread || busy} onClick={markAll}><CheckCheck size={14} /> Mark all read</button></div><div className="notification-list">{items.length ? items.slice(0, 12).map((item) => <button className={`notification-item ${item.isRead ? '' : 'unread'}`} key={item.id} onClick={() => { if (!item.isRead) markRead(item); setOpen(false); if (item.relatedEmailId) navigate(`/email/${item.relatedEmailId}`); }}><span className="notification-dot" /><span><b>{item.title}</b><small>{item.message || item.type}</small><time>{new Date(item.createdAt).toLocaleString()}</time></span></button>) : <div className="empty-mini">You're all caught up.</div>}</div></div>}</div></header>;
}
