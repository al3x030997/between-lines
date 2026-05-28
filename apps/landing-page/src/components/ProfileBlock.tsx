'use client';

import Link from 'next/link';
import { useMockSession } from '@/lib/useMockSession';

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
        <div className="br-pb-wallet" aria-label="Balances">
          <span className="br-pb-rc">
            <span className="br-pb-rc-num">{session.rc}</span>
            <span className="br-pb-rc-lbl">RC</span>
          </span>
          {isWriter ? (
            <span className="br-pb-sc">
              <span className="br-pb-sc-num">{session.sc}</span>
              <span className="br-pb-sc-lbl">SC</span>
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
