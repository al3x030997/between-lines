'use client';

import { Suspense, useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FeaturedCarousel } from '@/components/FeaturedCarousel';
import {
  FilterSidebar,
  type FilterState,
  type SidebarShelfId,
} from '@/components/FilterSidebar';
import { StoreTabs, type TabDef } from '@/components/StoreTabs';
import { DiscoverSearch } from '@/components/read/DiscoverSearch';
import { RailScroller } from '@/components/read/RailScroller';
import { BetaReadingHub } from '@/components/read/BetaReadingHub';
import {
  getBooksBySection,
  getInProgressBooks,
  sections,
  type Section,
  type Book,
} from '@/lib/mock-books';
import { useMockSession } from '@/lib/useMockSession';

type DiscoverTabId =
  | 'foryou'
  | 'betweenlines'
  | 'betareading'
  | 'audio'
  | 'magazine'
  | 'community';

const tabs: TabDef<DiscoverTabId>[] = [
  { id: 'foryou', label: 'For You' },
  { id: 'betweenlines', label: 'BetweenLines' },
  { id: 'betareading', label: 'Beta Reading' },
  { id: 'audio', label: 'Audio' },
  { id: 'magazine', label: 'Magazine' },
  { id: 'community', label: 'Community' },
];

const visibility: Record<DiscoverTabId, Section['id'][]> = {
  foryou: ['foryou', 'new', 'bl', 'classics'],
  betweenlines: ['bl'],
  betareading: [],
  audio: [],
  magazine: [],
  community: [],
};

const stubContent: Record<DiscoverTabId, { title: string; body: string } | null> = {
  foryou: null,
  betweenlines: null,
  betareading: null,
  audio: {
    title: 'Audio',
    body: 'Listen to stories and journal pieces narrated by their writers. Coming soon.',
  },
  magazine: {
    title: 'Magazine',
    body: 'Long-form essays and interviews from the BetweenLines editorial team. Coming soon.',
  },
  community: {
    title: 'Community',
    body: 'Reading clubs, writer Q&As, and the BetweenReads activity feed. Coming soon.',
  },
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

function isDiscoverTab(value: string | null): value is DiscoverTabId {
  return value != null && tabs.some((tab) => tab.id === value);
}

function DiscoverContent() {
  const { session } = useMockSession();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab');
  const [active, setActive] = useState<DiscoverTabId>(
    isDiscoverTab(initialTab) ? initialTab : 'foryou',
  );
  const [filters, setFilters] = useState<FilterState>({});
  const [selectedShelf, setSelectedShelf] = useState<SidebarShelfId>('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const visible = new Set<Section['id']>(visibility[active]);
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const matchesQuery = useCallback(
    (book: Book) => {
      if (!normalizedQuery) return true;
      return (
        book.title.toLowerCase().includes(normalizedQuery)
        || book.author.toLowerCase().includes(normalizedQuery)
        || book.blurb.toLowerCase().includes(normalizedQuery)
        || book.tags.some((t) => t.toLowerCase().includes(normalizedQuery))
      );
    },
    [normalizedQuery],
  );
  const featuredBooks = useMemo(() => getBooksBySection('bl'), []);
  const showFeatured = active === 'foryou' || active === 'betweenlines';
  const showContinue = session && (active === 'foryou' || active === 'betweenlines');
  const stub = stubContent[active];

  const handleToggle = (key: string) => {
    setFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="br-discover">
      <FilterSidebar
        open={sidebarOpen}
        filters={filters}
        onToggle={handleToggle}
        selectedShelf={selectedShelf}
        onShelfChange={setSelectedShelf}
      />
      <div className="br-discover-main">
        <div className="br-discover-tabsbar">
          <div className="br-discover-tabsbar-inner">
            <DiscoverSearch query={searchQuery} onChange={setSearchQuery} />
            <StoreTabs<DiscoverTabId>
              tabs={tabs}
              active={active}
              onChange={setActive}
              ariaLabel="Discover sections"
            />
          </div>
        </div>
        {active !== 'betareading' && (
          <div className="br-discover-toolbar">
            <button
              type="button"
              className={`br-fs-toggle ${sidebarOpen ? 'is-on' : ''}`}
              aria-pressed={sidebarOpen}
              aria-expanded={sidebarOpen}
              aria-label={sidebarOpen ? 'Hide filters' : 'Show filters'}
              onClick={() => setSidebarOpen((s) => !s)}
            >
              <span className="br-fs-toggle-icon" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
              <span className="br-fs-toggle-label">Filters</span>
            </button>
          </div>
        )}

        {showContinue && <ContinueReadingBox />}

        {showFeatured && (
          <div className="br-discover-featured">
            <div className="br-discover-featured-head">
              <p className="br-discover-featured-kicker">Featured this week</p>
              <h2>Editor's spotlight</h2>
            </div>
            <FeaturedCarousel books={featuredBooks} />
          </div>
        )}

        {active === 'betareading' ? (
          <BetaReadingHub />
        ) : stub ? (
          <div className="br-discover-stub" role="status">
            <p className="br-discover-stub-kicker">Coming soon</p>
            <h2 className="br-discover-stub-title">{stub.title}</h2>
            <p className="br-discover-stub-body">{stub.body}</p>
          </div>
        ) : (
          (() => {
            const renderedRails = sections
              .filter((s) => visible.has(s.id))
              .map((s) => {
                const books = getBooksBySection(s.id).filter(matchesQuery);
                if (books.length === 0) return null;
                return (
                  <Rail
                    key={s.id}
                    section={s}
                    kicker={sectionKickers[s.id]}
                    books={books}
                    showRank={s.id === 'bl'}
                  />
                );
              })
              .filter(Boolean);
            if (renderedRails.length === 0 && normalizedQuery) {
              return (
                <div className="br-discover-stub" role="status">
                  <p className="br-discover-stub-kicker">No matches</p>
                  <h2 className="br-discover-stub-title">Nothing here for “{searchQuery}”</h2>
                  <p className="br-discover-stub-body">Try a different title, author, or tag.</p>
                </div>
              );
            }
            return <div className="br-discover-rails">{renderedRails}</div>;
          })()
        )}
      </div>
    </div>
  );
}

export default function DiscoverPage() {
  return (
    <Suspense fallback={null}>
      <DiscoverContent />
    </Suspense>
  );
}

function Rail({
  section,
  kicker,
  books,
  showRank,
}: {
  section: Section;
  kicker: string;
  books: Book[];
  showRank: boolean;
}) {
  return (
    <RailScroller
      labelledById={`br-sec-${section.id}`}
      head={
        <>
          <p className="br-gallery-kicker">{kicker}</p>
          <h2 id={`br-sec-${section.id}`}>{section.label}</h2>
        </>
      }
      actions={<a className="br-gallery-rail-link" role="button">See all</a>}
    >
      {books.map((book, idx) => (
        <RailPoster
          key={book.slug}
          book={book}
          rank={showRank ? idx + 1 : undefined}
        />
      ))}
    </RailScroller>
  );
}
