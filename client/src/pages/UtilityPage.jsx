import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, ShieldAlert, ShieldCheck, Sparkles, X } from 'lucide-react';
import { emailApi } from '../services/emailApi.js';
import { apiError } from '../services/api.js';
import { useToast } from '../components/Toast.jsx';

export function UtilityPage({ kind }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [removingMeetingId, setRemovingMeetingId] = useState('');
  const toast = useToast();
  const meetings = kind === 'meetings';

  useEffect(() => {
    let live = true;
    const load = async () => {
      setLoading(true);
      try {
        const result = meetings
          ? await emailApi.list({ view: 'inbox', meetingDetected: true, limit: 50 })
          : kind === 'security'
            ? await Promise.all([
              emailApi.list({ view: 'inbox', phishingRisk: 'SUSPICIOUS', limit: 50 }),
              emailApi.list({ view: 'inbox', phishingRisk: 'HIGH_RISK', limit: 50 })
            ]).then((responses) => ({ items: responses.flatMap((response) => response.items || []).sort((a, b) => new Date(b.receivedAt) - new Date(a.receivedAt)) }))
            : { items: [] };
        if (live) { setItems(result.items || []); setError(''); }
      } catch (e) { if (live) setError(apiError(e)); }
      finally { if (live) setLoading(false); }
    };
    const refresh = () => { void load(); };
    void load();
    window.addEventListener('smartmail:emails-updated', refresh);
    return () => { live = false; window.removeEventListener('smartmail:emails-updated', refresh); };
  }, [kind, meetings]);

  const removeMeeting = async (mail) => {
    setRemovingMeetingId(mail._id);
    try {
      await emailApi.removeMeeting(mail._id);
      setItems((current) => current.filter((item) => item._id !== mail._id));
      toast('Meeting removed. The email is still in your inbox.');
    } catch (e) { toast(apiError(e), 'error'); }
    finally { setRemovingMeetingId(''); }
  };

  if (kind === 'not-found') return <div className="empty-state"><Sparkles size={26}/><h3>Page not found</h3><p>The page you requested could not be found.</p><Link className="btn primary small" to="/dashboard">Go to overview</Link></div>;
  const title = meetings ? 'Meetings' : 'Security review';
  const Icon = meetings ? CalendarDays : ShieldCheck;
  return <div className={`page utility-page ${meetings ? 'meetings-page' : 'security-page'}`}>
    <div className="page-heading"><div><div className="eyebrow">SMART WORKSPACE</div><h1>{title}</h1><p>{meetings ? 'Meeting details detected in your inbox. Confirm details in the source message.' : 'Messages flagged for a closer look. AI checks are signals, not proof.'}</p></div><Link className="btn subtle" to="/inbox"><Icon size={15}/><span className="button-label">Back to inbox</span></Link></div>
    {!meetings && <div className="notice warning">Never share passwords, payment details, or verification codes in response to unexpected messages. Contact the sender through a known channel to verify sensitive requests.</div>}
    {error && <div className="notice error">{error}</div>}
    <div className="card utility-list">
      {loading ? <div className="loading-lines"><i className="skeleton"/><i className="skeleton"/><i className="skeleton"/></div> : items.length ? items.map((mail) => <div className="utility-row" key={mail._id}>
        <Link className="utility-row-main" to={`/email/${mail._id}`}>
          <span className={`utility-icon ${meetings ? 'meeting' : 'risk'}`}>{meetings ? <CalendarDays size={17}/> : <ShieldAlert size={17}/>}</span>
          <span className="utility-copy"><b>{mail.ai?.meeting?.title || mail.subject || '(no subject)'}</b><small>{mail.sender?.name || mail.sender?.email} · {new Date(mail.receivedAt).toLocaleDateString()}</small><span>{meetings ? [mail.ai?.meeting?.date, mail.ai?.meeting?.time, mail.ai?.meeting?.timezone, mail.ai?.meeting?.location].filter(Boolean).join(' · ') || 'Open the source email for details.' : (mail.ai?.phishing?.reasons || []).join(' · ') || 'AI flagged this message for review.'}</span></span>
          <span className={`pill ${meetings ? 'indigo' : (mail.ai?.phishing?.risk || '').toLowerCase()}`}>{meetings ? 'DETECTED' : mail.ai?.phishing?.risk?.replace('_', ' ') || 'REVIEW'}</span>
          <ArrowRight size={16}/>
        </Link>
        {meetings && <button className="icon-button meeting-remove" type="button" disabled={removingMeetingId === mail._id} onClick={() => removeMeeting(mail)} aria-label="Remove meeting from meetings" title="Remove meeting from meetings"><X size={15}/></button>}
      </div>) : <div className="empty-state"><Icon size={25}/><h3>{meetings ? 'No meetings detected yet' : 'No messages flagged'}</h3><p>{meetings ? 'Sync your inbox to check messages for meeting details.' : 'No messages have been flagged for a security review.'}</p>{meetings && <Link to="/inbox" className="btn small">Open inbox</Link>}</div>}
    </div>
  </div>;
}
