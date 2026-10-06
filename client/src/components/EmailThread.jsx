import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, Copy, Mail, Reply } from 'lucide-react';
import { emailApi } from '../services/emailApi.js';
import { useToast } from './Toast.jsx';
import '../styles/email-thread.css';

const normalizeContentId = (value) => {
  let contentId = String(value || '').trim().replace(/^cid:/i, '').replace(/^<|>$/g, '');
  try { contentId = decodeURIComponent(contentId); } catch {}
  return contentId.trim().toLowerCase();
};
const contentIdsFromHtml = (html = '') => new Set([...String(html).matchAll(/\bdata-inline-cid=(['"])(.*?)\1/gi)].map((match) => normalizeContentId(match[2])));
const previewableImage = (mimeType = '') => /^image\/(?:jpeg|png|gif|webp|avif|bmp)$/i.test(mimeType);
const escapeAttribute = (value) => String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const displayName = (person) => person?.name ? `${person.name} <${person.email}>` : person?.email || 'Unknown sender';
const attachmentReference = (attachment) => attachment.attachmentId || (attachment.partId ? `part-${attachment.partId}` : '');

function MessageBody({ html, text, emailId, attachments = [] }) {
  const [showExternalImages, setShowExternalImages] = useState(false);
  const [inlineImageUrls, setInlineImageUrls] = useState({});
  useEffect(() => {
    let disposed = false;
    const objectUrls = [];
    setInlineImageUrls({});
    const referencedContentIds = contentIdsFromHtml(html);
    const inlineImages = [...new Map(attachments
      .filter((attachment) => previewableImage(attachment.mimeType) && attachment.contentId && referencedContentIds.has(normalizeContentId(attachment.contentId)))
      .map((attachment) => [normalizeContentId(attachment.contentId), attachment])).values()];
    void Promise.all(inlineImages.map(async (attachment) => {
      try {
        const response = await emailApi.inlineImage(emailId, attachment.contentId);
        const url = URL.createObjectURL(response.data);
        if (disposed) {
          URL.revokeObjectURL(url);
          return null;
        }
        objectUrls.push(url);
        return [normalizeContentId(attachment.contentId), url];
      } catch {
        return null;
      }
    })).then((entries) => {
      if (!disposed) setInlineImageUrls(Object.fromEntries(entries.filter(Boolean)));
    });
    return () => {
      disposed = true;
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [emailId, attachments, html]);
  if (html) {
    const withInlineImages = html.replace(/\bdata-inline-cid=(['"])(.*?)\1/gi, (_attribute, _quote, rawContentId) => {
      const contentId = normalizeContentId(rawContentId);
      const imageUrl = inlineImageUrls[contentId];
      return imageUrl ? `src="${escapeAttribute(imageUrl)}"` : '';
    });
    const hasExternalImages = /\bdata-remote-src=/i.test(withInlineImages);
    const displayHtml = showExternalImages ? withInlineImages.replace(/\bdata-remote-src=/gi, 'src=') : withInlineImages;
    return <>
      {hasExternalImages && <div className="remote-images-notice"><span>External images are blocked for privacy.</span><button className="text-button" onClick={() => setShowExternalImages(true)} disabled={showExternalImages}>{showExternalImages ? 'Images loaded' : 'Load images'}</button></div>}
      <div className="email-body-html" dangerouslySetInnerHTML={{ __html: displayHtml }} />
    </>;
  }
  return <div className="email-body-text">{text || 'This message has no plain text content.'}</div>;
}

function ImageAttachmentPreview({ emailId, attachment }) {
  const [source, setSource] = useState('');
  const reference = attachmentReference(attachment);
  useEffect(() => {
    if (!reference) return undefined;
    let disposed = false;
    let objectUrl = '';
    emailApi.attachment(emailId, reference).then((response) => {
      objectUrl = URL.createObjectURL(response.data);
      if (disposed) URL.revokeObjectURL(objectUrl);
      else setSource(objectUrl);
    }).catch(() => {});
    return () => {
      disposed = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [emailId, reference]);
  return source ? <div className="attachment-preview"><img src={source} alt={attachment.filename || 'Email image attachment'} loading="lazy" /></div> : null;
}

export function EmailThread({ messages, expanded, setExpanded, onReply, onDownload }) {
  const toast = useToast();
  return <div className="thread-list">{messages.map((message, index) => {
    const isOpen = expanded[String(message._id)] ?? index === messages.length - 1;
    const referencedContentIds = contentIdsFromHtml(message.bodyHtml);
    const imageAttachments = (message.attachments || []).filter((attachment) => previewableImage(attachment.mimeType) && !(attachment.contentId && referencedContentIds.has(normalizeContentId(attachment.contentId))));
    return <article className={`thread-message ${isOpen ? 'expanded' : ''}`} key={message._id || index}>
      <button className="thread-message-head" onClick={() => setExpanded((value) => ({ ...value, [String(message._id)]: !isOpen }))}>
        <div className="avatar">{(message.sender?.name || message.sender?.email || '?').slice(0, 1).toUpperCase()}</div>
        <div className="thread-person"><b>{displayName(message.sender)}</b><small>to {message.recipients?.map((person) => person.email).join(', ') || 'me'}</small></div>
        <time>{new Date(message.receivedAt).toLocaleString()}</time>
        {isOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
      </button>
      {isOpen && <div className="thread-body">
        <MessageBody html={message.bodyHtml} text={message.bodyText} emailId={message._id} attachments={message.attachments} />
        {imageAttachments.length > 0 && <div className="attachment-previews" aria-label="Image attachments">
          {imageAttachments.map((attachment) => <ImageAttachmentPreview key={attachment.attachmentId || attachment.partId || attachment.filename} emailId={message._id} attachment={attachment} />)}
        </div>}
        {message.attachments?.length > 0 && <div className="attachment-list"><strong>Attachments</strong>{message.attachments.map((attachment) => {
          const reference = attachmentReference(attachment);
          return <button className="attachment-item" key={attachment.attachmentId || attachment.partId || attachment.filename} onClick={() => onDownload(message, attachment)} disabled={!reference}>
            <span><Mail size={14} />{attachment.filename || 'Attachment'}</span>
            <small>{attachment.size ? `${Math.max(1, Math.round(attachment.size / 1024))} KB` : 'Download'}</small>
          </button>;
        })}</div>}
        <div className="thread-actions">
          <button className="btn small" onClick={() => onReply(message)}><Reply size={14} /> Reply</button>
          <button className="btn small" onClick={() => { navigator.clipboard?.writeText(message.bodyText || '').then(() => toast('Message copied.')).catch(() => toast('Unable to copy message.', 'error')); }}><Copy size={14} /> Copy text</button>
        </div>
      </div>}
    </article>;
  })}</div>;
}
