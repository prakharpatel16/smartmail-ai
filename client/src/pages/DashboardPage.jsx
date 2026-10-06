import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, ChevronRight, Inbox, Mail, RefreshCw, ShieldAlert, Sparkles, Star, TrendingUp, X } from 'lucide-react';
import { emailApi } from '../services/emailApi.js';
import { settingsApi } from '../services/settingsApi.js';
import { apiError } from '../services/api.js';
import { useToast } from '../components/Toast.jsx';

const priorityColor = (level) => (level || 'medium').toLowerCase();
const firstName = (mail) => mail.sender?.name || mail.sender?.email || 'Unknown sender';
const dateLabel = (date) => { const d = new Date(date); return Number.isNaN(+d) ? '' : d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }); };
export function DashboardPage() {
  const [data, setData] = useState(null); const [gmail, setGmail] = useState(null); const [error, setError] = useState(''); const [syncing, setSyncing] = useState(false); const [removingMeetingId, setRemovingMeetingId] = useState(''); const toast = useToast();
  const load = () => Promise.all([emailApi.stats(), settingsApi.gmailStatus()]).then(([stats, status]) => { setData(stats); setGmail(status); setError(''); }).catch((e) => setError(apiError(e)));
  useEffect(() => { load(); }, []);
  useEffect(() => { const refresh = () => load(); window.addEventListener('smartmail:emails-updated', refresh); return () => window.removeEventListener('smartmail:emails-updated', refresh); }, []);
  const sync = async () => { setSyncing(true); try { const result = await emailApi.sync(); toast(result.status === 'queued' ? 'Inbox sync added to the queue.' : 'Inbox sync complete.'); await load(); } catch (e) { toast(apiError(e), 'error'); } finally { setSyncing(false); } };
  const removeMeeting = async (mail) => {
    setRemovingMeetingId(mail._id);
    try {
      await emailApi.removeMeeting(mail._id);
      setData((current) => current ? { ...current, meetings: Math.max(0, (current.meetings || 0) - 1), upcomingMeetings: (current.upcomingMeetings || []).filter((meeting) => meeting._id !== mail._id) } : current);
      toast('Meeting removed. The email is still in your inbox.');
      await load();
    } catch (e) { toast(apiError(e), 'error'); }
    finally { setRemovingMeetingId(''); }
  };
  if (error && !data) return <div className="page"><div className="page-heading"><div><h1>Overview</h1><p>Your inbox at a glance.</p></div></div><div className="notice error">{error}</div><button className="btn" onClick={load}>Try again</button></div>;
  const stats = data || {}; const recent = stats.needsAttention || [];
  return <div className="page dashboard-page"><div className="page-heading"><div><div className="eyebrow">{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }).toUpperCase()}</div><h1>Your inbox, in focus.</h1><p>A quick look at what needs your attention today.</p></div><div className="heading-actions"><button className="btn" disabled={syncing} onClick={sync}><RefreshCw size={15} className={syncing ? 'spin-icon' : ''} /><span className="button-label">{syncing ? 'Syncing' : 'Sync inbox'}</span></button><Link className="btn primary" to="/compose"><Mail size={15} /><span className="button-label">Compose</span></Link></div></div>
    {gmail && !gmail.connected && <div className="connect-callout"><div className="callout-icon"><Mail size={18} /></div><div><strong>Connect your Gmail to get started</strong><p>Sync messages and use AI tools across your own mailbox.</p></div><Link to="/settings" className="btn primary small">Connect Gmail <ArrowRight size={14} /></Link></div>}
    <div className="stat-grid"><Stat icon={Inbox} label="Inbox" value={stats.total} foot={`${stats.unread || 0} unread`} color="violet" /><Stat icon={TrendingUp} label="Needs attention" value={stats.highPriority} foot="High priority" color="peach" /><Stat icon={CalendarDays} label="Meetings found" value={stats.meetings} foot="In your messages" color="blue" /><Stat icon={ShieldAlert} label="Security alerts" value={stats.phishing} foot="Review carefully" color="rose" /></div>
    <div className="dashboard-grid"><section className="card dash-card"><div className="card-heading"><div><h2>Needs your attention</h2><p>Messages marked high priority by AI</p></div><Link to="/inbox?priority=HIGH" className="text-link">View inbox <ArrowRight size={14} /></Link></div>{!data ? <CardLoading /> : recent.length ? <div className="attention-list">{recent.map((mail) => <Link to={`/email/${mail._id}`} className="attention-row" key={mail._id}><div className={`sender-avatar ${mail.isRead ? '' : 'unread-avatar'}`}>{firstName(mail).slice(0,1).toUpperCase()}</div><div className="attention-content"><div className="attention-top"><strong>{firstName(mail)}</strong><span className={`pill ${priorityColor(mail.ai?.priority?.level)}`}>{mail.ai?.priority?.level || 'MEDIUM'}</span><time>{dateLabel(mail.receivedAt)}</time></div><b>{mail.subject || '(no subject)'}</b><small>{mail.snippet || 'Open message to review.'}</small></div><ChevronRight size={17} className="row-arrow" /></Link>)}</div> : <div className="empty-inline"><Sparkles size={17} /><span>You're all caught up. No priority messages right now.</span></div>}</section>
      <section className="card dash-card meetings-card"><div className="card-heading"><div><h2>Upcoming meetings</h2><p>Invitations noticed in your email</p></div><Link to="/meetings" className="icon-link" aria-label="View meetings"><ArrowRight size={16} /></Link></div>{!data ? <CardLoading /> : stats.upcomingMeetings?.length ? <div className="meeting-list">{stats.upcomingMeetings.map((mail) => <div className="meeting-row" key={mail._id}><Link to={`/email/${mail._id}`} className="meeting-row-link"><span className="date-block"><b>{mail.ai?.meeting?.date ? new Date(`${mail.ai.meeting.date}T00:00:00`).getDate() : '—'}</b><small>{mail.ai?.meeting?.date ? new Date(`${mail.ai.meeting.date}T00:00:00`).toLocaleDateString(undefined,{month:'short'}) : 'DATE'}</small></span><span className="meeting-copy"><b>{mail.ai?.meeting?.title || mail.subject || 'Meeting invitation'}</b><small>{mail.ai?.meeting?.time || 'Time not stated'}{mail.ai?.meeting?.location ? ` · ${mail.ai.meeting.location}` : ''}</small></span></Link><button className="icon-button meeting-remove" type="button" disabled={removingMeetingId === mail._id} onClick={() => removeMeeting(mail)} aria-label="Remove meeting from overview" title="Remove meeting from overview"><X size={15}/></button></div>)}</div> : <div className="empty-inline"><CalendarDays size={17} /><span>No upcoming meetings detected.</span></div>}</section>
      <section className="card assistant-card"><div className="assistant-orb"><Sparkles size={18} /></div><div className="assistant-copy"><span className="eyebrow">SMARTMAIL AI</span><h2>Ask your inbox a question.</h2><p>Find a detail, decision, or conversation across your synced messages.</p><Link to="/ask" className="btn primary small">Ask My Inbox <ArrowRight size={14} /></Link></div><div className="assistant-decoration">“</div></section>
      <section className="card quick-card"><h2>Quick access</h2><Link to="/starred"><Star size={16} /><span>Starred messages</span><ChevronRight size={15} /></Link><Link to="/inbox?phishingRisk=HIGH_RISK"><ShieldAlert size={16} /><span>High risk messages</span><ChevronRight size={15} /></Link><Link to="/inbox?meetingDetected=true"><CalendarDays size={16} /><span>Meeting emails</span><ChevronRight size={15} /></Link></section></div>
  </div>;
}
function Stat({ icon: Icon, label, value, foot, color }) { return <div className="card stat-card"><div className={`stat-icon ${color}`}><Icon size={18} /></div><span>{label}</span><strong>{value ?? '—'}</strong><small>{foot}</small></div>; }
function CardLoading() { return <div className="loading-lines"><i className="skeleton"/><i className="skeleton"/><i className="skeleton"/></div>; }
