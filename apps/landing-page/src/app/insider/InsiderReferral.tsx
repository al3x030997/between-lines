'use client';

import { useState } from 'react';

type Props = {
  sid: string;
  eyebrow: string;
  title: string;
  body: string;
  foot?: string;
};

function buildLink(sid: string): string {
  if (typeof window === 'undefined') return `betweenreads.co/i/${sid.slice(0, 8)}`;
  const host = window.location.host.replace(/^www\./, '');
  return `${host}/i/${sid.slice(0, 8)}`;
}

export default function InsiderReferral({ sid, eyebrow, title, body, foot }: Props) {
  const [copied, setCopied] = useState(false);
  const link = buildLink(sid);

  const onCopy = async () => {
    const url = `https://${link}`;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const ta = document.createElement('textarea');
        ta.value = url;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* no-op */
    }
  };

  return (
    <aside className="bl-referral" aria-label={eyebrow}>
      <div>
        <p className="bl-referral-eyebrow">{eyebrow}</p>
        <h3 className="bl-referral-title">{title}</h3>
        <p className="bl-referral-body">{body}</p>
      </div>
      <div className="bl-referral-action">
        <div className="bl-referral-field">
          <span className="bl-referral-link">{link}</span>
          <button
            type="button"
            className={`bl-referral-copy${copied ? ' is-copied' : ''}`}
            onClick={onCopy}
          >
            {copied ? 'copied' : 'copy link'}
          </button>
        </div>
        {foot ? <p className="bl-referral-foot">{foot}</p> : null}
      </div>
    </aside>
  );
}
