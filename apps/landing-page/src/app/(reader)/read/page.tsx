'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  FilterSidebar,
  type FilterState,
  type SidebarShelfId,
} from '@/components/FilterSidebar';
import { StoreTabs, type TabDef } from '@/components/StoreTabs';
import {
  getBooksBySection,
  getInProgressBooks,
  getInProgressCount,
  getBetweenLinesInviteCount,
  sections,
  type Section,
  type Book,
} from '@/lib/mock-books';
import { useMockSession } from '@/lib/useMockSession';

type DiscoverTabId =
  | 'all'
  | 'foryou'
  | 'readerpicks'
  | 'betapicks'
  | 'memberpicks'
  | 'betweenlines'
  | 'magazine'
  | 'new';

const tabs: TabDef<DiscoverTabId>[] = [
  { id: 'all', label: 'All' },
  { id: 'foryou', label: 'For You' },
  { id: 'readerpicks', label: 'Reader Picks' },
  { id: 'betapicks', label: 'Beta Picks' },
  { id: 'memberpicks', label: 'Member Picks' },
  { id: 'betweenlines', label: 'BetweenLines' },
  { id: 'magazine', label: 'Magazine' },
  { id: 'new', label: 'New this week' },
];

const visibility: Record<DiscoverTabId, Section['id'][]> = {
  all: ['bl', 'foryou', 'new', 'classics'],
  foryou: ['foryou'],
  readerpicks: ['foryou'],
  betapicks: ['foryou'],
  memberpicks: ['foryou'],
  betweenlines: ['bl'],
  magazine: ['bl'],
  new: ['new'],
};

const sectionKickers: Record<Section['id'], string> = {
  bl: 'Journal-first fiction',
  foryou: 'Picked for you',
  new: 'Fresh this week',
  classics: 'Timeless & free',
};

function RailPoster({ book, rank }: { book: Book; rank?: number }) {
  const badge = book.badges[0];
  return (
    <Link className="br-gallery-poster" href={`/read/${book.slug}`}>
      <span className="br-gallery-poster-cover" style={{ background: book.cover }}>
        {rank != null ? <span className="br-gallery-rank">{rank}</span> : null}
        {badge ? <span className="br-gallery-poster-badge">{badge.label}</span> : null}
      </span>
      <span className="br-gallery-poster-body">
        <span className="br-gallery-poster-title">{book.title}</span>
        <span className="br-gallery-poster-author">{book.author}</span>
      </span>
    </Link>
  );
}

function ContinueReadingHero({ userName }: { userName: string }) {
  const inProgress = getInProgressBooks();
  const current = inProgress[0];
  if (!current) return null;

  const { book, progress } = current;
  const chapterIdx = Math.min(
    Math.max(0, Math.floor((progress / 100) * book.chapters.length) - 1),
    book.chapters.length - 1,
  );
  const activeChapter = book.chapters[chapterIdx];
  const chaptersLeft = Math.max(1, book.chapterCount - Math.ceil((progress / 100) * book.chapterCount));
  const totalInProgress = getInProgressCount();
  const invites = getBetweenLinesInviteCount();
  const firstName = userName.split(' ')[0] ?? userName;

  return (
    <div className="br-cr-hero">
      <div className="br-cr-inner">
        <div className="br-cr-copy">
          <p className="br-cr-eyebrow">Continue reading · Welcome back, {firstName}</p>
          <h2 className="br-cr-title">{book.title}</h2>
          {activeChapter && (
            <p className="br-cr-chapter">
              Chapter {activeChapter.num} — {activeChapter.title}
            </p>
          )}
          <p className="br-cr-excerpt">{book.blurb}</p>
          <div className="br-cr-progress-row">
            <div className="br-cr-bar">
              <div className="br-cr-fill" style={{ width: `${progress}%` }} />
            </div>
            <span className="br-cr-pct">{progress}% · {chaptersLeft} chapters left</span>
          </div>
          <div className="br-cr-ctas">
            <Link href={`/read/${book.slug}`} className="br-cr-btn-primary">
              Continue reading →
            </Link>
            <button type="button" className="br-cr-btn-secondary">
              View all {totalInProgress} in progress
            </button>
          </div>
        </div>

        <div className="br-cr-cover-wrap">
          <div className="br-cr-cover" style={{ background: book.cover }}>
            <div className="br-cr-cover-glass">
              <p className="br-cr-cover-label">Currently reading</p>
              <p className="br-cr-cover-title">{book.title}</p>
              <p className="br-cr-cover-author">by {book.author}</p>
              {activeChapter && (
                <p className="br-cr-cover-ch">
                  Chapter {activeChapter.num} of {book.chapterCount} · {activeChapter.title}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="br-cr-stats">
        <span><strong>{totalInProgress}</strong> <em>in progress</em></span>
        <span><strong>{invites}</strong> <em>BetweenLines invites</em></span>
        <span>
          <strong>by {book.author.split(' ').slice(-1)[0] ?? book.author}</strong>
          <em>now reading</em>
        </span>
      </div>
    </div>
  );
}

export default function DiscoverPage() {
  const { session } = useMockSession();
  const [active, setActive] = useState<DiscoverTabId>('all');
  const [filters, setFilters] = useState<FilterState>({});
  const [selectedShelf, setSelectedShelf] = useState<SidebarShelfId>('all');
  const visible = new Set<Section['id']>(visibility[active]);

  const handleToggle = (key: string) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="br-discover">
      <FilterSidebar
        filters={filters}
        onToggle={handleToggle}
        selectedShelf={selectedShelf}
        onShelfChange={setSelectedShelf}
      />
      <div className="br-discover-main">
        <StoreTabs<DiscoverTabId>
          tabs={tabs}
          active={active}
          onChange={setActive}
          ariaLabel="Discover sections"
        />

        {session && <ContinueReadingHero userName={session.user} />}

        <div className="br-discover-rails">
          {sections.map((s) => {
            if (!visible.has(s.id)) return null;
            const books = getBooksBySection(s.id);
            if (books.length === 0) return null;
            return (
              <section key={s.id} aria-labelledby={`br-sec-${s.id}`} className="br-gallery-rail">
                <div className="br-gallery-rail-head">
                  <div>
                    <p className="br-gallery-kicker">{sectionKickers[s.id]}</p>
                    <h2 id={`br-sec-${s.id}`}>{s.label}</h2>
                  </div>
                  <a className="br-gallery-rail-link" role="button">See all</a>
                </div>
                <div className="br-gallery-track">
                  {books.map((book, idx) => (
                    <RailPoster
                      key={book.slug}
                      book={book}
                      rank={s.id === 'bl' ? idx + 1 : undefined}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
