'use client';

import Link from 'next/link';
import { useMockSession } from '@/lib/useMockSession';

const activity = [
  { date: 'Today', body: 'Finished Chapter 1 of', highlight: 'The Quiet Hours', rc: '+10 RC' },
  { date: 'Yesterday', body: 'Left a Quick Comment on', highlight: 'Three Tuesdays in November', rc: '+5 RC' },
  { date: 'Sunday', body: 'Picked up Chapter 1 of', highlight: 'The Count of Monte Cristo', rc: undefined as string | undefined },
  { date: 'Last week', body: 'Joined the BetweenLines Inaugural reader pod for', highlight: 'Ink and Wander', rc: undefined as string | undefined },
];

export default function AccountPage() {
  const { session } = useMockSession();
  const name = session?.user ?? 'Reader';

  return (
    <main className="br-account">
      <div className="br-account-greeting">Welcome back</div>
      <h1 className="br-account-name">{name}</h1>
      <p className="br-account-sub">
        Three Tuesdays in November is waiting. The east corridor is open.
      </p>

      <div className="br-stat-strip">
        <div className="br-stat">
          <div className="br-stat-num">{session?.rc ?? 0}</div>
          <div className="br-stat-lbl">ReadCredits</div>
        </div>
        <div className="br-stat">
          <div className="br-stat-num">4</div>
          <div className="br-stat-lbl">In progress</div>
        </div>
        <div className="br-stat">
          <div className="br-stat-num">12</div>
          <div className="br-stat-lbl">Reader picks</div>
        </div>
      </div>

      <Link href="/read/the-quiet-hours/the-letter-in-the-wall" className="br-account-continue">
        <div
          className="br-account-continue-cover"
          style={{ background: 'linear-gradient(160deg,#2d2a24,#4a3f35)' }}
          aria-hidden="true"
        >
          <div style={{ fontFamily: 'var(--br-font-display)', color: '#fff', fontSize: 12, lineHeight: 1.2 }}>
            The Quiet Hours
          </div>
        </div>
        <div className="br-account-continue-info">
          <div className="br-account-continue-eyebrow">Continue reading</div>
          <div className="br-account-continue-title">The Quiet Hours</div>
          <div className="br-account-continue-meta">Chapter 1 — The Letter in the Wall · 22% complete</div>
          <div className="br-account-continue-progress" aria-hidden="true">
            <span />
          </div>
        </div>
      </Link>

      <div className="br-sec-head">
        <h2 className="br-sec-title">Recent activity</h2>
        <a className="br-sec-link">See all</a>
      </div>
      <div className="br-account-activity">
        {activity.map((a, i) => (
          <div key={i} className="br-account-activity-item">
            <span className="br-account-activity-date">{a.date}</span>
            <span className="br-account-activity-body">
              {a.body} <em style={{ color: 'var(--v11-ink)', fontFamily: 'var(--br-font-serif)' }}>{a.highlight}</em>
            </span>
            {a.rc ? <span className="br-account-activity-rc">{a.rc}</span> : null}
          </div>
        ))}
      </div>
    </main>
  );
}
