'use client';

import Link from 'next/link';
import { useMockSession } from '@/lib/useMockSession';

function compact(n: number): string {
  if (n >= 10000) return `${(n / 1000).toFixed(0)}k`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toLocaleString('en-US');
}

export function ProfileBlock() {
  const { session } = useMockSession();
  if (!session) return null;

  const isWriter = session.roles.includes('writer');
  const isMember = session.tier === 'Member';
  const roleLine = isWriter ? 'Reader · Writer' : 'Reader';

  return (
    <Link
      href="/profile"
      className="br-pb"
      aria-label={`Open profile for ${session.user}`}
    >
      <div className="br-pb-avatar" aria-hidden="true">{session.initial}</div>
      <div className="br-pb-body">
        <div className="br-pb-name">{session.user}</div>
        <div className="br-pb-tier">
          {isMember ? <span className="br-pb-tier-tag">Member</span> : null}
          <span className="br-pb-role">{roleLine}</span>
        </div>
        <div className="br-pb-social" aria-label="Social">
          <span className="br-pb-social-item">
            <span className="br-pb-social-num">{compact(session.followers)}</span>
            <span className="br-pb-social-lbl">followers</span>
          </span>
          <span className="br-pb-social-item">
            <span className="br-pb-social-num">{compact(session.following)}</span>
            <span className="br-pb-social-lbl">following</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
