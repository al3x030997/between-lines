'use client';

import { useState } from 'react';

// Shown only to first-time reader/writer preview accounts (the MVP personas).
// A founder's note in the landing-page brand yellow with a referral CTA: the
// invite link carries the inviter's handle so new sign-ups credit both sides.
export function BuildingBanner({ handle }: { handle?: string }) {
  const [copied, setCopied] = useState(false);

  const inviteUrl = () => {
    const base = typeof window !== 'undefined' ? window.location.origin : '';
    const ref = handle ? `?ref=${encodeURIComponent(handle)}` : '';
    return `${base}/${ref}`;
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="br-build-banner">
      <div className="br-build-banner-card" role="note">
        <div className="br-build-banner-body">
          <span className="br-build-banner-emoji" aria-hidden="true">🌱</span>
          <p className="br-build-banner-text">
            <strong>We&rsquo;re building BetweenReads</strong> — and we&rsquo;d love your support.
            Share your invite link: every new reader who joins gives you both free reading credits.
          </p>
        </div>
        <button type="button" className="br-build-banner-cta" onClick={copy}>
          {copied ? 'Link copied ✓' : 'Copy invite link'}
        </button>
      </div>
    </div>
  );
}
