'use client';

import type { ReaderSignal } from '@/lib/mock-writers';

type Props = {
  todayWords: number;
  dailyTarget: number;
  streakDays: number;
  signals: ReaderSignal[];
};

export type WriterInboxCounts = {
  betaRequests: number;
  readerNotes: number;
  agentInvites: number;
};

export function WriterInbox({ inbox }: { inbox: WriterInboxCounts }) {
  return (
    <section className="br-profile-inbox" aria-label="Inbox">
      <div className="br-fs-label">Inbox</div>
      <button type="button" className="br-fs-row is-on">
        <span className="br-fs-row-emoji" aria-hidden="true">📨</span>
        <span className="br-fs-row-label">Beta requests</span>
        <span className="br-fs-count">{inbox.betaRequests}</span>
      </button>
      <button type="button" className="br-fs-row">
        <span className="br-fs-row-emoji" aria-hidden="true">💬</span>
        <span className="br-fs-row-label">Reader notes</span>
        <span className="br-fs-count">{inbox.readerNotes}</span>
      </button>
      <button type="button" className="br-fs-row">
        <span className="br-fs-row-emoji" aria-hidden="true">🪪</span>
        <span className="br-fs-row-label">Agent invites</span>
        <span className="br-fs-count">{inbox.agentInvites}</span>
      </button>
    </section>
  );
}

export function WriterSidebar({
  todayWords,
  dailyTarget,
  streakDays,
  signals,
}: Props) {
  const progress = Math.min(100, Math.round((todayWords / dailyTarget) * 100));

  return (
    <aside className="br-fsidebar" aria-label="Writer sidebar">
      <section className="br-fs-section">
        <div className="br-fs-label">Today</div>
        <div className="br-write-side-card">
          <div className="br-write-side-target">
            <span className="br-write-side-target-num">{todayWords.toLocaleString('en-US')}</span>
            <span className="br-write-side-target-lbl">/ {dailyTarget.toLocaleString('en-US')} words</span>
          </div>
          <div className="br-write-side-bar" aria-hidden="true">
            <span style={{ width: `${progress}%` }} />
          </div>
          <div className="br-write-side-streak">🔥 Day {streakDays} streak</div>
        </div>
      </section>

      {signals.length > 0 ? (
        <section className="br-fs-section">
          <div className="br-fs-label">Reader signals</div>
          <ul className="br-write-signals">
            {signals.map((s) => (
              <li className="br-write-signal" key={s.workId}>
                <div className="br-write-signal-title">{s.workTitle}</div>
                <div className="br-write-signal-line">{s.line}</div>
                <div className="br-write-signal-sub">{s.sub}</div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

    </aside>
  );
}
