import { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Archive, CalendarDays, ChartNoAxesCombined, Inbox, LogOut, Mail, MessageCircleQuestion, PenLine, Plus, Settings, ShieldCheck, Star, Trash2, Sparkles } from 'lucide-react';
import { logoutUser } from '../store/authSlice.js';
import { clearNotifications } from '../store/notificationSlice.js';
import { emailApi } from '../services/emailApi.js';
import { useToast } from './Toast.jsx';

const primary = [
  { to: '/inbox', label: 'Inbox', icon: Inbox }, { to: '/starred', label: 'Starred', icon: Star },
  { to: '/sent', label: 'Sent', icon: Mail }, { to: '/drafts', label: 'Drafts', icon: Archive }, { to: '/trash', label: 'Trash', icon: Trash2 }
];
const work = [
  { to: '/dashboard', label: 'Overview', icon: ChartNoAxesCombined }, { to: '/ask', label: 'Ask My Inbox', icon: MessageCircleQuestion },
  { to: '/meetings', label: 'Meetings', icon: CalendarDays }, { to: '/security', label: 'Security', icon: ShieldCheck }
];

export function Sidebar() {
  const user = useSelector((state) => state.auth.user);
  const [unreadEmails, setUnreadEmails] = useState(0);
  const statsRequest = useRef(0);
  const dispatch = useDispatch(); const navigate = useNavigate(); const toast = useToast();
  useEffect(() => {
    let live = true;
    const refreshUnread = () => {
      const request = ++statsRequest.current;
      emailApi.stats().then((stats) => {
        if (live && request === statsRequest.current) setUnreadEmails(Number(stats.unread) || 0);
      }).catch(() => {});
    };
    refreshUnread();
    window.addEventListener('smartmail:emails-updated', refreshUnread);
    window.addEventListener('smartmail:mailbox-state-changed', refreshUnread);
    return () => {
      live = false;
      statsRequest.current += 1;
      window.removeEventListener('smartmail:emails-updated', refreshUnread);
      window.removeEventListener('smartmail:mailbox-state-changed', refreshUnread);
    };
  }, []);
  const signOut = async () => { try { await dispatch(logoutUser()).unwrap(); dispatch(clearNotifications()); navigate('/login'); } catch { toast('Could not sign out. Please try again.', 'error'); } };
  return <aside className="sidebar">
    <NavLink to="/dashboard" className="brand"><span className="brand-mark"><Mail size={20} /></span><span>smartmail<span className="brand-ai">.ai</span></span></NavLink>
    <NavLink to="/compose" className="compose-button"><Plus size={18} /> Compose</NavLink>
    <div className="nav-section"><div className="nav-label">MAILBOX</div>{primary.map(({ to, label, icon: Icon }) => <NavLink to={to} key={to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}><Icon size={18} /><span>{label}</span>{label === 'Inbox' && unreadEmails > 0 && <span className="nav-count">{unreadEmails > 99 ? '99+' : unreadEmails}</span>}</NavLink>)}</div>
    <div className="nav-section work-nav"><div className="nav-label">SMART WORKSPACE</div>{work.map(({ to, label, icon: Icon }) => <NavLink to={to} key={to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}><Icon size={18} /><span>{label}</span>{label === 'Ask My Inbox' && <Sparkles size={13} className="nav-spark" />}</NavLink>)}</div>
    <div className="sidebar-bottom"><NavLink to="/settings" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}><Settings size={18} /><span>Settings</span></NavLink><div className="user-card"><div className="avatar">{(user?.fullName || user?.email || 'U').slice(0, 1).toUpperCase()}</div><div className="user-meta"><strong>{user?.fullName || 'SmartMail user'}</strong><small>{user?.email}</small></div><button className="icon-button signout" onClick={signOut} title="Sign out" aria-label="Sign out"><LogOut size={16} /></button></div></div>
    <nav className="mobile-nav" aria-label="Main navigation"><NavLink to="/dashboard"><ChartNoAxesCombined size={18}/><span>Home</span></NavLink><NavLink to="/inbox"><Inbox size={18}/><span>Inbox</span></NavLink><NavLink to="/compose" className="mobile-compose"><PenLine size={18}/><span>Compose</span></NavLink><NavLink to="/ask"><MessageCircleQuestion size={18}/><span>Ask AI</span></NavLink><NavLink to="/settings"><Settings size={18}/><span>Settings</span></NavLink></nav>
  </aside>;
}
