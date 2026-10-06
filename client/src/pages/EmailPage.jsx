import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CalendarDays, ChevronUp, ExternalLink, Reply, RotateCcw, ShieldAlert, Sparkles, Star, Trash2 } from 'lucide-react';
import { emailApi } from '../services/emailApi.js';
import { aiApi } from '../services/aiApi.js';
import { apiError } from '../services/api.js';
import { EmailThread } from '../components/EmailThread.jsx';
import { useToast } from '../components/Toast.jsx';

export function EmailPage() {
  const { id } = useParams(); const navigate = useNavigate(); const toast = useToast();
  const [email, setEmail] = useState(null); const [thread, setThread] = useState([]); const [error, setError] = useState(''); const [busy, setBusy] = useState(true); const [action, setAction] = useState(''); const [summary, setSummary] = useState(null); const [expanded, setExpanded] = useState({});
  const hasLoaded = useRef(false); const requestId = useRef(0);
  const load = async ({ showLoading = !hasLoaded.current } = {}) => {
    const request = ++requestId.current;
    if (showLoading) setBusy(true);
    setError('');
    try {
      const message = await emailApi.get(id);
      if (request !== requestId.current) return;
      setEmail(message);
      if (!message.isRead) await emailApi.setRead(id, true).then(() => window.dispatchEvent(new Event('smartmail:mailbox-state-changed'))).catch(() => {});
      const result = await emailApi.thread(message.threadId);
      if (request !== requestId.current) return;
      const messages = result.messages || [message];
      setThread(messages);
      setExpanded(Object.fromEntries(messages.map((item, index) => [String(item._id), index === messages.length - 1])));
    } catch (e) {
      if (request === requestId.current) setError(apiError(e));
    } finally {
      if (request === requestId.current) {
        hasLoaded.current = true;
        setBusy(false);
      }
    }
  };
  useEffect(() => {
    if (!id || id === 'undefined' || id === 'null') {
      navigate('/inbox', { replace: true });
      return undefined;
    }
    load();
    const refresh = () => load({ showLoading: false });
    window.addEventListener('smartmail:emails-updated', refresh);
    return () => {
      requestId.current += 1;
      window.removeEventListener('smartmail:emails-updated', refresh);
    };
  }, [id]);
  const run = async (name) => { setAction(name); setError(''); try { if (name === 'summary') { const result = await aiApi.summary(id); setSummary(result); } else if (name === 'priority') { const result = await aiApi.priority(id); setEmail((current) => ({ ...current, ai: { ...current.ai, priority: { ...current.ai?.priority, ...result, level: result.manuallyOverridden ? current.ai?.priority?.level : result.level } } })); toast(`Priority reviewed: ${result.manuallyOverridden ? email.ai?.priority?.level : result.level}.`); } else if (name === 'meeting') { const result = await aiApi.meeting(id); setEmail((current) => ({ ...current, ai: { ...current.ai, meetingDetected: result.meetingDetected, meeting: result.meeting } })); toast(result.meetingDetected ? 'Meeting details extracted.' : 'No meeting found in this message.'); } else if (name === 'phishing') { const result = await aiApi.phishing(id); setEmail((current) => ({ ...current, ai: { ...current.ai, phishing: result } })); toast(`Security review complete: ${result.risk}.`, result.risk === 'SAFE' ? 'success' : 'info'); } } catch (e) { setError(apiError(e)); } finally { setAction(''); } };
  const reply = (message = email) => navigate(`/compose?replyTo=${encodeURIComponent(message._id)}`);
  const trash = async () => { setAction('trash'); try { const inTrash = email.labels?.includes('TRASH'); await emailApi.trash(id, !inTrash); window.dispatchEvent(new Event('smartmail:mailbox-state-changed')); toast(inTrash ? 'Message restored to Inbox.' : 'Message moved to Trash.'); navigate('/inbox'); } catch (e) { setError(apiError(e)); } finally { setAction(''); } };
  const star = async () => { try { const updated = await emailApi.setStar(id, !email.isStarred); setEmail((current) => ({ ...current, isStarred: updated.isStarred })); } catch (e) { setError(apiError(e)); } };
  const setPriority = async (level) => { setAction('priority'); try { const updated = await emailApi.setPriority(id, level); setEmail((current) => ({ ...current, ai: { ...current.ai, priority: { ...current.ai?.priority, level: updated.priority, manuallyOverridden: true } } })); toast(`Priority set to ${updated.priority}.`); } catch (e) { setError(apiError(e)); } finally { setAction(''); } };
  const download = async (message, attachment) => { try { const reference = attachment.attachmentId || `part-${attachment.partId}`; const response = await emailApi.attachment(message._id, reference); const url = URL.createObjectURL(response.data); const anchor = document.createElement('a'); anchor.href = url; anchor.download = attachment.filename || 'attachment'; anchor.click(); window.setTimeout(() => URL.revokeObjectURL(url), 1000); } catch (e) { toast(apiError(e), 'error'); } };
  const meetingLink = email?.ai?.meeting?.meetingLink;
  if (busy) return <div className="page"><div className="page-heading"><button className="btn" onClick={() => navigate(-1)}><ArrowLeft size={15} /> Back</button></div><div className="card detail-loading"><i className="skeleton" /><i className="skeleton" /><i className="skeleton" /><i className="skeleton" /></div></div>;
  if (error && !email) return <div className="page"><div className="notice error">{error}</div><button className="btn" onClick={() => navigate('/inbox')}>Back to inbox</button></div>;
  if (!email) return null;
  const messages = thread.length ? thread : [email];
  return <div className="page email-page"><div className="detail-toolbar"><button className="icon-button" onClick={() => navigate(-1)} aria-label="Back"><ArrowLeft size={18} /></button><span className="toolbar-divider"/><button className={`icon-button ${email.isStarred ? 'selected' : ''}`} onClick={star} aria-label={email.isStarred ? 'Unstar' : 'Star'} title="Star"><Star size={17} fill={email.isStarred ? 'currentColor' : 'none'} /></button><button className="icon-button" onClick={trash} disabled={action === 'trash'} aria-label={email.labels?.includes('TRASH') ? 'Restore to Inbox' : 'Move to Trash'} title={email.labels?.includes('TRASH') ? 'Restore to Inbox' : 'Move to Trash'}>{email.labels?.includes('TRASH') ? <RotateCcw size={17}/> : <Trash2 size={17}/>}</button><div className="toolbar-spacer"/><Link className="btn small subtle" to="/ask"><Sparkles size={14} /> Ask My Inbox</Link></div>
    {error && <div className="notice error" role="alert">{error}</div>}
    <section className="card email-detail-card"><div className="email-detail-head"><div className="email-tags">{email.ai?.priority?.level && <span className={`pill ${(email.ai.priority.level || '').toLowerCase()}`}>{email.ai.priority.level} PRIORITY</span>}{email.ai?.meetingDetected && <span className="pill indigo">Meeting detected</span>}{email.ai?.phishing?.risk && email.ai.phishing.risk !== 'SAFE' && <span className={`pill ${email.ai.phishing.risk.toLowerCase()}`}>{email.ai.phishing.risk.replace('_',' ')}</span>}</div><h1>{email.subject || '(no subject)'}</h1><div className="message-detail-actions"><button className="btn small" disabled={!!action} onClick={() => run('summary')}><Sparkles size={14} /> {action === 'summary' ? 'Summarizing…' : 'AI summary'}</button><label className="priority-control"><span>Priority</span><select aria-label="Set message priority" disabled={!!action} value={email.ai?.priority?.level || 'MEDIUM'} onChange={(event) => setPriority(event.target.value)}>{['CRITICAL','HIGH','MEDIUM','LOW'].map((level) => <option value={level} key={level}>{level}</option>)}</select></label><button className="btn small" disabled={!!action} onClick={() => run('priority')}>Recheck priority</button><button className="btn small" disabled={!!action} onClick={() => run('meeting')}><CalendarDays size={14} /> Detect meeting</button><button className="btn small" disabled={!!action} onClick={() => run('phishing')}><ShieldAlert size={14} /> Security check</button></div></div>
      {summary && <div className="summary-panel"><div className="summary-title"><Sparkles size={16} /><strong>AI summary</strong><span className="summary-review">Review before acting</span><button className="icon-button" onClick={() => setSummary(null)} aria-label="Close summary"><ChevronUp size={16} /></button></div><p>{summary.summary}</p>{summary.keyPoints?.length > 0 && <div className="summary-columns"><div><b>Key points</b><ul>{summary.keyPoints.map((item, index) => <li key={index}>{item}</li>)}</ul></div>{summary.actionItems?.length > 0 && <div><b>Action items</b><ul>{summary.actionItems.map((item, index) => <li key={index}>{item}</li>)}</ul></div>}</div>}</div>}
      {email.ai?.meetingDetected && <div className="meeting-banner"><CalendarDays size={17}/><div><b>{email.ai.meeting?.title || 'Possible meeting details'}</b><small>{[email.ai.meeting?.date,email.ai.meeting?.time,email.ai.meeting?.timezone,email.ai.meeting?.location].filter(Boolean).join(' · ') || 'Review the source email to confirm details.'}</small></div>{meetingLink && /^https:\/\//i.test(meetingLink) && <a href={meetingLink} target="_blank" rel="noreferrer" className="text-link">Open link <ExternalLink size={13}/></a>}</div>}
      {email.ai?.phishing?.risk && email.ai.phishing.risk !== 'SAFE' && <div className="security-banner"><ShieldAlert size={17}/><div><b>AI security review: {email.ai.phishing.risk.replace('_',' ')}</b><small>{(email.ai.phishing.reasons || []).join(' · ') || 'Treat unexpected requests cautiously.'} Verify sensitive requests independently.</small></div></div>}
      <EmailThread messages={messages} expanded={expanded} setExpanded={setExpanded} onReply={reply} onDownload={download} />
      <div className="reply-footer"><button className="btn primary" onClick={() => reply()}><Reply size={15} /> Reply</button><span>AI suggestions can be edited before sending.</span></div></section></div>;
}
