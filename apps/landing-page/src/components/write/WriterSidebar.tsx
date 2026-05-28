'use client';

export type LibraryStatusFilter = 'all' | 'Published' | 'Drafting' | 'Editing' | 'Private';

type Props = {
  statusFilter: LibraryStatusFilter;
  onStatusChange: (next: LibraryStatusFilter) => void;
  counts: Record<LibraryStatusFilter, number>;
  todayWords: number;
  dailyTarget: number;
  streakDays: number;
  continueLabel: string;
  onContinue: () => void;
  inbox: { betaRequests: number; readerNotes: number; agentInvites: number };
};

const STATUS_PILLS: { id: LibraryStatusFilter; emoji: string; label: string }[] = [
  { id: 'all', emoji: '📚', label: 'All' },
  { id: 'Published', emoji: '🌿', label: 'Published' },
  { id: 'Drafting', emoji: '✍️', label: 'Drafting' },
  { id: 'Editing', emoji: '🪶', label: 'Editing' },
  { id: 'Private', emoji: '🔒', label: 'Private' },
];

export function WriterSidebar({
  statusFilter,
  onStatusChange,
  counts,
  todayWords,
  dailyTarget,
  streakDays,
  continueLabel,
  onContinue,
  inbox,
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
          <button type="button" className="br-write-side-continue" onClick={onContinue}>
            Continue · {continueLabel}
          </button>
        </div>
      </section>

      <section className="br-fs-section">
        <div className="br-fs-label">Library</div>
        <div className="br-fs-pills">
          {STATUS_PILLS.map((pill) => {
            const on = statusFilter === pill.id;
            const count = counts[pill.id] ?? 0;
            return (
              <button
                key={pill.id}
                type="button"
                className={`br-fs-pill ${on ? 'is-on' : ''}`}
                onClick={() => onStatusChange(pill.id)}
                aria-pressed={on}
              >
                <span aria-hidden="true">{pill.emoji}</span> {pill.label}
                <span className="br-fs-pill-count">{count}</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="br-fs-section">
        <div className="br-fs-label">Inbox</div>
        <button type="button" className="br-fs-row">
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
    </aside>
  );
}
