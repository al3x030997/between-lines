'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { FeaturedCarousel } from '@/components/FeaturedCarousel';
import {
  FilterSidebar,
  type FilterState,
  type SidebarShelfId,
} from '@/components/FilterSidebar';
import { StoreTabs, type TabDef } from '@/components/StoreTabs';
import {
  getBooksBySection,
  getInProgressBooks,
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
  const keywords = book.tags.slice(0, 3);
  const formatHasWords = /\d/.test(book.format);
  const wordCount =
    !formatHasWords && book.words
      ? `${book.words.toLocaleString('en-US')} words`
      : null;
  return (
    <Link className="br-gallery-poster" href={`/read/${book.slug}`}>
      <span className="br-gallery-poster-cover" style={{ background: book.cover }}>
        {rank != null ? <span className="br-gallery-rank">{rank}</span> : null}
        {keywords.length > 0 ? (
          <span className="br-gallery-poster-keywords" aria-hidden="true">
            {keywords.map((kw) => (
              <span key={kw} className="br-gallery-poster-keyword">
                {kw}
              </span>
            ))}
          </span>
        ) : null}
      </span>
      <span className="br-gallery-poster-body">
        <span className="br-gallery-poster-title">{book.title}</span>
        <span className="br-gallery-poster-author">{book.author}</span>
        <span className="br-gallery-poster-blurb">{book.blurb}</span>
        <span className="br-gallery-poster-tags">
          <span className="br-gallery-poster-tag">{book.format}</span>
          {wordCount ? <span className="br-gallery-poster-tag">{wordCount}</span> : null}
          <span
            className={`br-gallery-poster-tag is-${book.access.type === 'free' ? 'free' : 'rc'}`}
          >
            {book.access.label}
          </span>
        </span>
      </span>
    </Link>
  );
}

function ContinueReadingBox() {
  const inProgress = getInProgressBooks();
  const current = inProgress[0];
  if (!current) return null;

  const { book, progress } = current;
  const isDark = book.coverIsDark === true;

  return (
    <div className="br-continue-wrap">
      <div className="br-continue" role="region" aria-label="Continue reading">
        <div className="br-continue-cover" style={{ background: book.cover }}>
          <div className="br-cover-inner">
            <div className={`br-cover-title ${isDark ? 'is-dark' : ''}`}>{book.title}</div>
            <div className={`br-cover-rule ${isDark ? 'is-dark' : ''}`} />
            <div className={`br-cover-author ${isDark ? 'is-dark' : ''}`}>{book.author}</div>
          </div>
        </div>

        <div className="br-continue-body">
          <span className="br-continue-eyebrow">Continue reading</span>
          <h3 className="br-continue-title">{book.title}</h3>
          <div className="br-continue-author">{book.author}</div>
          <div className="br-continue-meta">{book.format}</div>
        </div>

        <div className="br-continue-progress">
          <div className="br-continue-percent">{progress}% complete</div>
          <div className="br-continue-bar" aria-hidden="true">
            <div className="br-continue-bar-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <Link
          href={`/read/${book.slug}`}
          className="br-btn br-btn-primary br-continue-cta"
        >
          Continue reading →
        </Link>
      </div>
    </div>
  );
}

export default function DiscoverPage() {
  const { session } = useMockSession();
  const [active, setActive] = useState<DiscoverTabId>('all');
  const [filters, setFilters] = useState<FilterState>({});
  const [selectedShelf, setSelectedShelf] = useState<SidebarShelfId>('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const visible = new Set<Section['id']>(visibility[active]);
  const featuredBooks = useMemo(() => getBooksBySection('bl'), []);
  const showFeatured = active === 'all' || active === 'betweenlines';

  const handleToggle = (key: string) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="br-discover">
      {sidebarOpen && (
        <FilterSidebar
          filters={filters}
          onToggle={handleToggle}
          selectedShelf={selectedShelf}
          onShelfChange={setSelectedShelf}
        />
      )}
      <div className="br-discover-main">
        <div className="br-discover-tabsbar">
          <button
            type="button"
            className={`br-fs-toggle ${sidebarOpen ? 'is-on' : ''}`}
            aria-pressed={sidebarOpen}
            aria-expanded={sidebarOpen}
            onClick={() => setSidebarOpen((s) => !s)}
          >
            <span className="br-fs-toggle-icon" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
            <span>{sidebarOpen ? 'Hide filters' : 'Filters'}</span>
          </button>
          <StoreTabs<DiscoverTabId>
            tabs={tabs}
            active={active}
            onChange={setActive}
            ariaLabel="Discover sections"
          />
        </div>

        {session && <ContinueReadingBox />}

        {showFeatured && (
          <div className="br-discover-featured">
            <div className="br-discover-featured-head">
              <p className="br-discover-featured-kicker">Featured this week</p>
              <h2>Editor's spotlight</h2>
            </div>
            <FeaturedCarousel books={featuredBooks} />
          </div>
        )}

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
