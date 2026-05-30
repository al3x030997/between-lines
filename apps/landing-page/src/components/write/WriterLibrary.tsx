'use client';

import type { WriterLibraryStatus, WriterLibraryWork } from '@/lib/mock-writers';

export type LibraryStatusFilter = 'all' | WriterLibraryStatus;

type Props = {
  works: WriterLibraryWork[];
  allWorks: WriterLibraryWork[];
  statusFilter: LibraryStatusFilter;
  onStatusChange: (next: LibraryStatusFilter) => void;
  counts: Record<LibraryStatusFilter, number>;
  onAddWork: () => void;
  onOpenEditor: (id: string) => void;
  onOpenSettings: (id: string) => void;
  onOpenStorefront: (id: string) => void;
  onPreview: (work: WriterLibraryWork) => void;
};

const STATUS_PILLS: { id: LibraryStatusFilter; emoji: string; label: string }[] = [
  { id: 'all', emoji: '📚', label: 'All' },
  { id: 'Published', emoji: '🌿', label: 'Published' },
  { id: 'Drafting', emoji: '✍️', label: 'Drafting' },
  { id: 'Editing', emoji: '🪶', label: 'Editing' },
  { id: 'Private', emoji: '🔒', label: 'Private' },
];

const statusClass: Record<WriterLibraryStatus, string> = {
  Published: 'is-published',
  Drafting: 'is-drafting',
  Editing: 'is-editing',
  Private: 'is-private',
};

function pct(work: WriterLibraryWork) {
  if (work.totalChapters <= 0) return 0;
  return Math.min(100, Math.round((work.publishedChapters / work.totalChapters) * 100));
}

function compact(n: number) {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`;
  return n.toLocaleString('en-US');
}

export function makeDraftWork(index: number): WriterLibraryWork {
  return {
    id: `local-draft-${Date.now()}-${index}`,
    title: index === 1 ? 'Untitled work' : `Untitled work ${index}`,
    meta: 'New work · Draft setup',
    stage: 'Drafting',
    format: 'Novel · setup needed',
    status: 'Drafting',
    readiness: 'Needs title',
    cover:
      'linear-gradient(180deg, rgba(8, 8, 8, 0.08) 0%, rgba(8, 8, 8, 0.44) 100%), linear-gradient(145deg, #f2eee4 0%, #c7b99b 48%, #5b604f 100%)',
    coverIsDark: true,
    publishedChapters: 0,
    totalChapters: 1,
    words: 0,
    wordsLabel: '0',
    audience: 'Private draft',
    lastUpdated: 'Just now',
    storefront: {
      state: 'Setup needed',
      price: 'Not priced',
      options: ['Add cover', 'Add blurb', 'Write chapter 1'],
      note: 'New work created locally for preview',
    },
    activity: {
      reads: 0,
      readerPicks: 0,
      betaRequests: 0,
      coins: 0,
    },
  };
}

function WriterLibraryRow({
  work,
  canOpen,
  onOpenEditor,
  onOpenSettings,
  onPreview,
}: {
  work: WriterLibraryWork;
  canOpen: boolean;
  onOpenEditor: (id: string) => void;
  onOpenSettings: (id: string) => void;
  onOpenStorefront: (id: string) => void;
  onPreview: (work: WriterLibraryWork) => void;
}) {
  const progress = pct(work);
  const actionTitle = canOpen ? undefined : 'This preview work is not connected to the editor yet';
  const isPublished = work.status === 'Published';

  return (
    <article
      className={`br-write-card ${isPublished ? 'is-live' : ''}`}
      data-status={statusClass[work.status]}
      role="listitem"
    >
      <div className="br-write-card-cover" style={{ background: work.cover }} aria-hidden="true">
        <div className="br-write-card-cover-spine" />
        <div className="br-write-card-cover-inner">
          <span>{work.title}</span>
        </div>
      </div>

      <div className="br-write-card-body">
        <header className="br-write-card-head">
          <div className="br-write-card-titleblock">
            <div className="br-write-card-kicker">{work.meta}</div>
            <h2 className="br-write-card-title">{work.title}</h2>
          </div>
          <span className={`br-write-card-status ${statusClass[work.status]}`}>{work.status}</span>
        </header>

        <div className="br-write-card-vitals">
          <div className="br-write-card-vital">
            <div className="br-write-card-vital-num">
              {work.publishedChapters}
              <span className="br-write-card-vital-of">/{work.totalChapters}</span>
            </div>
            <div className="br-write-card-vital-lbl">
              {work.totalChapters === 1 ? 'chapter' : 'chapters'} live
            </div>
            <div className="br-write-card-progress" aria-hidden="true">
              <span style={{ width: `${progress}%` }} />
            </div>
          </div>
          <div className="br-write-card-vital">
            <div className="br-write-card-vital-num">{compact(work.activity.reads)}</div>
            <div className="br-write-card-vital-lbl">
              readers · {compact(work.activity.readsLast24h ?? Math.round(work.activity.reads * 0.03))} last 24h
            </div>
          </div>
        </div>

        <footer className="br-write-card-foot">
          <div className="br-write-card-actions" aria-label={`${work.title} actions`}>
            <button type="button" className="br-write-card-btn is-primary" onClick={() => onOpenEditor(work.id)} disabled={!canOpen} title={actionTitle}>
              Open editor
            </button>
            <button type="button" className="br-write-card-btn" onClick={() => onPreview(work)} disabled={!canOpen} title={actionTitle}>
              Preview
            </button>
            <button type="button" className="br-write-card-btn" onClick={() => onOpenSettings(work.id)} disabled={!canOpen} title={actionTitle}>
              Settings
            </button>
          </div>
        </footer>
      </div>
    </article>
  );
}

function SummaryStat({ value, label }: { value: string; label: string }) {
  return (
    <span className="br-write-lib-metric">
      <strong>{value}</strong>
      <span>{label}</span>
    </span>
  );
}

export function WriterLibrary({ works, allWorks, statusFilter, onStatusChange, counts, onAddWork, onOpenEditor, onOpenSettings, onOpenStorefront, onPreview }: Props) {
  const publishedCount = allWorks.filter((w) => w.status === 'Published').length;
  const chapterCount = allWorks.reduce((sum, w) => sum + w.publishedChapters, 0);
  const reads = allWorks.reduce((sum, w) => sum + w.activity.reads, 0);

  return (
    <div className="br-write-library">
      <div className="br-write-lib-filterbar">
        <div className="br-write-lib-filters" role="tablist" aria-label="Filter by status">
          {STATUS_PILLS.map((pill) => {
            const on = statusFilter === pill.id;
            const count = counts[pill.id] ?? 0;
            return (
              <button
                key={pill.id}
                type="button"
                role="tab"
                aria-selected={on}
                className={`br-write-lib-filter ${on ? 'is-on' : ''}`}
                onClick={() => onStatusChange(pill.id)}
              >
                <span aria-hidden="true">{pill.emoji}</span> {pill.label}
                <span className="br-write-lib-filter-count">{count}</span>
              </button>
            );
          })}
        </div>
        <button type="button" className="br-write-lib-add" onClick={onAddWork}>
          + Add work
        </button>
      </div>

      <div className="br-write-lib-summary" aria-label="Writing library summary">
        <SummaryStat value={publishedCount.toString()} label="published" />
        <SummaryStat value={chapterCount.toString()} label="chapters live" />
        <SummaryStat value={compact(reads)} label="total reads" />
        <SummaryStat value={works.length.toString()} label="shown" />
      </div>

      <div className="br-write-lib-table" role="list" aria-label="Writer works">
        {works.length === 0 ? (
          <div className="br-write-lib-empty">No works match this filter.</div>
        ) : null}
        {works.map((work) => (
          <WriterLibraryRow
            key={work.id}
            work={work}
            canOpen={!work.id.startsWith('local-draft-')}
            onOpenEditor={onOpenEditor}
            onOpenSettings={onOpenSettings}
            onOpenStorefront={onOpenStorefront}
            onPreview={onPreview}
          />
        ))}
        <button type="button" className="br-write-lib-newrow" onClick={onAddWork}>
          <span>+</span>
          <strong>Add another work</strong>
          <em>New pieces appear below this library table.</em>
        </button>
      </div>
    </div>
  );
}
