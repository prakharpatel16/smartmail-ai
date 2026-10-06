import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Archive, ChevronDown, ChevronLeft, ChevronRight, FileText, Filter, Mail, Paperclip, RefreshCw, RotateCcw, Star, Trash2 } from 'lucide-react';
import { emailApi } from '../services/emailApi.js';
import { apiError } from '../services/api.js';
import { useToast } from '../components/Toast.jsx';

const labels = { inbox: 'Inbox', starred: 'Starred', sent: 'Sent', drafts: 'Drafts', trash: 'Trash' };
const dateLabel = (date) => { const d = new Date(date); if (Number.isNaN(+d)) return ''; const now = new Date(); return d.toDateString() === now.toDateString() ? d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) : d.toLocaleDateString([], { month: 'short', day: 'numeric' }); };
const senderName = (email, view) => view === 'sent' ? (email.recipients?.map((person) => person.name || person.email).join(', ') || 'Sent message') : email.sender?.name || email.sender?.email || email.to?.map((person) => person.name || person.email).join(', ') || 'Unknown sender';
export function InboxPage({ view }) {
  const location = useLocation(); const navigate = useNavigate(); const toast = useToast(); const query = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const [result, setResult] = useState(null); const [busy, setBusy] = useState(true); const [error, setError] = useState(''); const [refreshing, setRefreshing] = useState(false); const [filtersOpen, setFiltersOpen] = useState(false);
  const hasLoaded = useRef(false); const requestId = useRef(0);
  const [filters, setFilters] = useState({ priority: query.get('priority') || '', meetingDetected: query.get('meetingDetected') || '', phishingRisk: query.get('phishingRisk') || '', isRead: query.get('isRead') || '', sort: 'newest' });
  useEffect(() => { setFilters({ priority: query.get('priority') || '', meetingDetected: query.get('meetingDetected') || '', phishingRisk: query.get('phishingRisk') || '', isRead: query.get('isRead') || '', sort: 'newest' }); }, [query]);
  const load = useCallback(async ({ showLoading = !hasLoaded.current } = {}) => {
    const request = ++requestId.current;
    if (showLoading) setBusy(true);
    setError('');
    try {
      const activeFilters = ['priority', 'meetingDetected', 'phishingRisk', 'isRead', 'sort']
        .map((key) => [key, query.get(key)])
        .filter(([key, value]) => value && !(key === 'sort' && value === 'newest'));
      const params = view === 'drafts' ? {} : {
        view,
        search: query.get('search') || undefined,
        page: Number(query.get('page')) || 1,
        limit: 25,
        ...Object.fromEntries(activeFilters)
      };
      const data = view === 'drafts' ? await emailApi.drafts() : await emailApi.list(params);
      if (request !== requestId.current) return;
      setResult(view === 'drafts' ? { items: data.items || [], page: 1, pages: 1, total: data.items?.length || 0 } : data);
    } catch (e) {
      if (request === requestId.current) setError(apiError(e));
    } finally {
      if (request === requestId.current) {
        hasLoaded.current = true;
        setBusy(false);
      }
    }
  }, [view, query]);
  useEffect(() => { load(); }, [load]);
  useEffect(() => { const refresh = () => load({ showLoading: false }); window.addEventListener('smartmail:emails-updated', refresh); return () => window.removeEventListener('smartmail:emails-updated', refresh); }, [load]);
  const updatePage = (page) => { const next = new URLSearchParams(location.search); next.set('page', String(page)); Object.entries(filters).forEach(([key, value]) => { if (value && !(key === 'sort' && value === 'newest')) next.set(key, value); else next.delete(key); }); navigate(`${location.pathname}?${next.toString()}`); };
  const changeFilter = (key, value) => { const updated = { ...filters, [key]: value }; setFilters(updated); const next = new URLSearchParams(location.search); next.delete('page'); Object.entries(updated).forEach(([name, item]) => { if (item && !(name === 'sort' && item === 'newest')) next.set(name, item); else next.delete(name); }); navigate(`${location.pathname}${next.toString() ? `?${next.toString()}` : ''}`); };
  const clearFilters = () => { const next = new URLSearchParams(location.search); ['priority','meetingDetected','phishingRisk','isRead','sort'].forEach((key) => next.delete(key)); navigate(`${location.pathname}${next.toString() ? `?${next.toString()}` : ''}`); };
  const toggleStar = async (event, item) => { event.preventDefault(); event.stopPropagation(); try { await emailApi.setStar(item._id || item.id, !item.isStarred); await load({ showLoading: false }); } catch (e) { toast(apiError(e), 'error'); } };
  const markRead = async (event, item) => { event.preventDefault(); event.stopPropagation(); try { await emailApi.setRead(item._id || item.id, !item.isRead); window.dispatchEvent(new Event('smartmail:mailbox-state-changed')); await load({ showLoading: false }); } catch (e) { toast(apiError(e), 'error'); } };
  const moveToTrash = async (event, item) => { event.preventDefault(); event.stopPropagation(); try { await emailApi.trash(item._id || item.id); window.dispatchEvent(new Event('smartmail:mailbox-state-changed')); toast('Message moved to Trash.'); await load({ showLoading: false }); } catch (e) { toast(apiError(e), 'error'); } };
  const restore = async (event, item) => { event.preventDefault(); event.stopPropagation(); try { await emailApi.trash(item._id || item.id, false); window.dispatchEvent(new Event('smartmail:mailbox-state-changed')); toast('Message restored to Inbox.'); await load({ showLoading: false }); } catch (e) { toast(apiError(e), 'error'); } };
  const sync = async () => { setRefreshing(true); try { const syncJob = await emailApi.sync(); toast(syncJob.status === 'queued' ? 'Sync queued. Your inbox will update shortly.' : 'Inbox sync completed.'); await load({ showLoading: false }); } catch (e) { toast(apiError(e), 'error'); } finally { setRefreshing(false); } };
  const items = result?.items || []; const title = labels[view]; const searchTerm = query.get('search');
  return <div className="page inbox-page"><div className="page-heading"><div><div className="eyebrow">MAILBOX</div><h1>{title}</h1><p>{searchTerm ? <>Search results for <b>“{searchTerm}”</b></> : view === 'inbox' ? 'Your messages, organized in one place.' : `${title} messages from your Gmail account.`}</p></div><div className="heading-actions">{view === 'inbox' && <button className={`btn ${filtersOpen ? 'subtle' : ''}`} onClick={() => setFiltersOpen(!filtersOpen)}><Filter size={15} /><span className="button-label">Filters</span><ChevronDown size={13} /></button>}{view !== 'drafts' && <button className="btn" onClick={sync} disabled={refreshing}><RefreshCw size={15} className={refreshing ? 'spin-icon' : ''} /><span className="button-label">Sync</span></button>}</div></div>
    <nav className="folder-tabs" aria-label="Mailbox folders">{Object.entries(labels).map(([key, label]) => <Link key={key} to={`/${key === 'inbox' ? 'inbox' : key}`} className={view === key ? 'active' : ''}>{label}</Link>)}</nav>
    {filtersOpen && <div className="filter-panel card"><label>Priority<select value={filters.priority} onChange={(e) => changeFilter('priority', e.target.value)}><option value="">Any priority</option>{['CRITICAL','HIGH','MEDIUM','LOW'].map((p) => <option key={p}>{p}</option>)}</select></label><label>Status<select value={filters.isRead} onChange={(e) => changeFilter('isRead', e.target.value)}><option value="">Any status</option><option value="false">Unread</option><option value="true">Read</option></select></label><label>Meeting<select value={filters.meetingDetected} onChange={(e) => changeFilter('meetingDetected', e.target.value)}><option value="">All messages</option><option value="true">Meeting emails</option></select></label><label>Security<select value={filters.phishingRisk} onChange={(e) => changeFilter('phishingRisk', e.target.value)}><option value="">Any risk</option><option value="SUSPICIOUS">Suspicious</option><option value="HIGH_RISK">High risk</option></select></label><button className="text-button" onClick={clearFilters}>Clear filters</button></div>}
    {error && <div className="notice error" role="alert">{error} <button className="text-button" onClick={load}>Retry</button></div>}
    <section className="card mailbox-card"><div className="mailbox-toolbar"><div className="result-count">{busy ? 'Loading messages…' : `${result?.total || 0} ${view === 'drafts' ? 'drafts' : 'messages'}`}</div><div className="toolbar-actions">{searchTerm && <button className="text-button" onClick={() => navigate(location.pathname)}>Clear search</button>}<button className="icon-button" onClick={load} title="Refresh" aria-label="Refresh"><RefreshCw size={15} /></button><button className="icon-button" disabled={(result?.page || 1) <= 1} onClick={() => updatePage((result?.page || 1) - 1)} title="Previous page" aria-label="Previous page"><ChevronLeft size={17} /></button><span className="page-indicator">{result?.page || 1} / {result?.pages || 1}</span><button className="icon-button" disabled={(result?.page || 1) >= (result?.pages || 1)} onClick={() => updatePage((result?.page || 1) + 1)} title="Next page" aria-label="Next page"><ChevronRight size={17} /></button></div></div>
      {busy && <div className="message-skeletons">{Array.from({ length: 6 }, (_, index) => <div key={index} className="message-skeleton"><i className="skeleton"/><i className="skeleton"/><i className="skeleton"/></div>)}</div>}
      {!busy && !items.length && <div className="empty-state"><Mail size={25} /><h3>{searchTerm ? 'No matching messages' : view === 'drafts' ? 'No drafts yet' : 'This folder is empty'}</h3><p>{searchTerm ? 'Try another search term or clear your search.' : view === 'inbox' ? 'Connect Gmail or sync your mailbox to see your email here.' : 'Messages in this folder will appear here.'}</p>{view === 'inbox' && <button className="btn primary small" onClick={sync}><RefreshCw size={14} /> Sync inbox</button>}{view === 'drafts' && <Link to="/compose" className="btn primary small">Write a message</Link>}</div>}
      {!busy && !!items.length && <div className="message-list">{items.map((item) => { const itemId = item._id || item.id; return <div className={`message-row ${view !== 'drafts' && !item.isRead ? 'unread' : ''}`} key={itemId}>{view !== 'drafts' && <><button className={`star-toggle ${item.isStarred ? 'selected' : ''}`} onClick={(e) => toggleStar(e, item)} title={item.isStarred ? 'Unstar' : 'Star'} aria-label={item.isStarred ? 'Unstar message' : 'Star message'}><Star size={16} fill={item.isStarred ? 'currentColor' : 'none'} /></button><button className="read-dot" onClick={(e) => markRead(e, item)} title={item.isRead ? 'Mark unread' : 'Mark read'} aria-label={item.isRead ? 'Mark unread' : 'Mark read'}><i className={item.isRead ? 'read' : ''} /></button></>}<Link className="message-main" to={view === 'drafts' ? `/compose?draftId=${itemId}` : `/email/${itemId}`}><div className="message-first-line"><span className="message-sender">{senderName(item, view)}</span>{(item.hasAttachments || item.attachments?.length > 0) && <Paperclip size={13} className="message-attachment" />}<span className="message-time">{dateLabel(item.updatedAt || item.receivedAt)}</span></div><div className="message-subject">{item.subject || '(no subject)'}</div><div className="message-snippet">{item.snippet || item.bodyText || 'No preview available'}</div><div className="message-tags">{item.ai?.priority?.level && ['CRITICAL','HIGH'].includes(item.ai.priority.level) && <span className={`pill ${item.ai.priority.level.toLowerCase()}`}>{item.ai.priority.level}</span>}{item.ai?.meetingDetected && <span className="pill indigo">Meeting</span>}{item.ai?.phishing?.risk && item.ai.phishing.risk !== 'SAFE' && <span className={`pill ${item.ai.phishing.risk.toLowerCase()}`}>{item.ai.phishing.risk.replace('_',' ')}</span>}</div></Link><div className="message-row-actions">{view !== 'trash' && view !== 'drafts' && <button className="icon-button" onClick={(e) => moveToTrash(e, item)} title="Move to Trash" aria-label="Move to Trash"><Trash2 size={15} /></button>}{view === 'trash' && <button className="icon-button" onClick={(e) => restore(e, item)} title="Restore to Inbox" aria-label="Restore to Inbox"><RotateCcw size={15} /></button>}{view === 'drafts' && <FileText size={15} className="muted" />}{view === 'sent' && <Archive size={15} className="muted" />}</div></div>; })}</div>}
    </section>
  </div>;
}
