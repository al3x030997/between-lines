'use client';

import type { WriterLibraryStatus, WriterLibraryWork } from '@/lib/mock-writers';

type Props = {
  works: WriterLibraryWork[];
  allWorks: WriterLibraryWork[];
  onAddWork: () => void;
  onOpenEditor: (id: string) => void;
  onOpenSettings: (id: string) => void;
  onOpenStorefront: (id: string) => void;
  onPreview: (work: WriterLibraryWork) => void;
};

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

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <span className="br-write-lib-metric">
      <strong>{value}</strong>
      <span>{label}</span>
    </span>
  );
}

function WriterLibraryRow({
  work,
  canOpen,
  onOpenEditor,
  onOpenSettings,
  onOpenStorefront,
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

  return (
    <article className={`br-write-lib-row ${work.status === 'Published' ? 'is-live' : ''}`}>
      <div className="br-write-lib-cover" style={{ background: work.cover }} aria-hidden="true">
        <div className="br-write-lib-cover-inner">
          <span>{work.title}</span>
        </div>
      </div>

      <div className="br-write-lib-body">
        <div className="br-write-lib-titleline">
          <div>
            <div className="br-write-lib-kicker">{work.meta}</div>
            <h2>{work.title}</h2>
          </div>
          <span className={`br-write-lib-status ${statusClass[work.status]}`}>{work.status}</span>
        </div>

        <div className="br-write-lib-grid">
          <section>
            <div className="br-write-lib-label">Published chapters</div>
            <div className="br-write-lib-mainstat">
              {work.publishedChapters}/{work.totalChapters}
            </div>
            <div className="br-write-lib-progress" aria-hidden="true">
              <span style={{ width: `${progress}%` }} />
            </div>
            <p>{work.wordsLabel} words · {work.lastUpdated}</p>
          </section>

          <section>
            <div className="br-write-lib-label">Readiness</div>
            <div className="br-write-lib-mainstat">{work.readiness}</div>
            <p>{work.audience}</p>
          </section>

          <section>
            <div className="br-write-lib-label">Storefront</div>
            <div className="br-write-lib-mainstat">{work.storefront.state}</div>
            <p>{work.storefront.price}</p>
            <div className="br-write-lib-options">
              {work.storefront.options.slice(0, 3).map((option) => (
                <span key={option}>{option}</span>
              ))}
            </div>
          </section>

          <section className="br-write-lib-activity">
            <div className="br-write-lib-label">Activity</div>
            <div className="br-write-lib-metrics">
              <Metric value={compact(work.activity.reads)} label="reads" />
              <Metric value={compact(work.activity.readerPicks)} label="picks" />
              <Metric value={compact(work.activity.betaRequests)} label="beta" />
              <Metric value={compact(work.activity.coins)} label="coins" />
            </div>
          </section>
        </div>

        <div className="br-write-lib-actions" aria-label={`${work.title} actions`}>
          <button type="button" onClick={() => onOpenEditor(work.id)} disabled={!canOpen} title={actionTitle}>
            Open editor
          </button>
          <button type="button" onClick={() => onPreview(work)} disabled={!canOpen} title={actionTitle}>
            Preview
          </button>
          <button type="button" onClick={() => onOpenStorefront(work.id)} disabled={!canOpen} title={actionTitle}>
            Storefront
          </button>
          <button type="button" onClick={() => onOpenSettings(work.id)} disabled={!canOpen} title={actionTitle}>
            Settings
          </button>
        </div>
      </div>
    </article>
  );
}

export function WriterLibrary({ works, allWorks, onAddWork, onOpenEditor, onOpenSettings, onOpenStorefront, onPreview }: Props) {
  const publishedCount = allWorks.filter((w) => w.status === 'Published').length;
  const chapterCount = allWorks.reduce((sum, w) => sum + w.publishedChapters, 0);
  const reads = allWorks.reduce((sum, w) => sum + w.activity.reads, 0);

  return (
    <div className="br-write-library">
      <div className="br-write-lib-summary" aria-label="Writing library summary">
        <Metric value={publishedCount.toString()} label="published" />
        <Metric value={chapterCount.toString()} label="chapters live" />
        <Metric value={compact(reads)} label="total reads" />
        <Metric value={works.length.toString()} label="shown" />
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
