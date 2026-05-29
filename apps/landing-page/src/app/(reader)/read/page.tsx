'use client';

import { Suspense, useCallback, useEffect, useMemo, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  FilterSidebar,
  hasActiveFilters,
  matchesFilters,
  type FilterState,
  type SidebarShelfId,
} from '@/components/FilterSidebar';
import { BookPoster } from '@/components/gallery/BookPoster';
import { GalleryRail } from '@/components/gallery/GalleryRail';
import { ContinueGalleryHero } from '@/components/read/ContinueGalleryHero';
import { DiscoverBar } from '@/components/read/DiscoverBar';
import { ShelfChips } from '@/components/read/ShelfChips';
import type { TabDef } from '@/components/StoreTabs';
import { getBetaReadingRequests } from '@/lib/mock-beta-reading';
import {
  getAllBooks,
  getBetweenLinesInviteCount,
  getBooksBySection,
  getFinishedBooks,
  getInProgressBooks,
  getReadingListBooks,
  sections,
  type Book,
  type Section,
} from '@/lib/mock-books';

type TopReadTabId =
  | 'betweenreads'
  | 'betweenlines'
  | 'betareading'
  | 'audio'
  | 'community';

const tabs: TabDef<TopReadTabId>[] = [
  { id: 'betweenreads', label: 'BetweenReads' },
  { id: 'betweenlines', label: 'BetweenLines' },
  { id: 'betareading', label: 'Beta Reading' },
  { id: 'audio', label: 'Audio' },
  { id: 'community', label: 'Community' },
];

const visibility: Record<SidebarShelfId, Section['id'][]> = {
  all: ['bl', 'foryou', 'new', 'classics'],
  foryou: ['foryou'],
  readerpicks: ['bl', 'foryou', 'new', 'classics'],
  memberpicks: ['bl', 'foryou', 'new', 'classics'],
  new: ['new'],
  continue: ['bl', 'foryou', 'new', 'classics'],
  readinglist: ['bl', 'foryou', 'new', 'classics'],
  finished: ['bl', 'foryou', 'new', 'classics'],
};

const PERSONAL_SHELVES = new Set<SidebarShelfId>(['continue', 'readinglist', 'finished']);

const SHELF_LABELS: Record<SidebarShelfId, string> = {
  all: 'All',
  foryou: 'For You',
  readerpicks: 'Reader Picks',
  memberpicks: 'Member Picks',
  new: 'New This Week',
  continue: 'Continue',
  readinglist: 'Reading List',
  finished: 'Finished',
};

const betweenCharacterQuotes = [
  {
    tag: 'Feel-good',
    quote: 'You are braver than you believe, stronger than you seem, and smarter than you think.',
    source: 'Winnie the Pooh',
  },
  {
    tag: 'Reflective',
    quote: 'Not all those who wander are lost.',
    source: 'J.R.R. Tolkien',
  },
  {
    tag: 'Intense',
    quote: 'I write only because there is a voice within me that will not be still.',
    source: 'Sylvia Plath',
  },
];

const betweenLinesComparison = [
  { feature: 'Reading profile', free: 'BetweenPages reader profile', premium: 'Everything in EmergingReader' },
  { feature: 'Stories', free: 'Public content and free chapters', premium: 'Unlimited premium chapters' },
  { feature: 'BetweenLines journal', free: 'Not included', premium: 'All issues' },
  { feature: 'Reader Pods', free: 'Not included', premium: 'Join writer inner circles' },
  { feature: 'Beta reading', free: 'Basic access', premium: 'Priority beta reader matching' },
  { feature: 'Discovery', free: 'Standard mood filters', premium: 'Mood-based discovery - full access' },
  { feature: 'New content', free: 'Standard release timing', premium: 'Early access' },
  { feature: 'BetweenCharacters', free: 'Read and submit quotes', premium: 'Featured rotation eligible' },
];

const betaReadingPosts = getBetaReadingRequests();

function isTopReadTabId(value: string | null): value is TopReadTabId {
  return tabs.some((t) => t.id === value);
}

function isSidebarShelfId(value: string | null): value is SidebarShelfId {
  return (
    value === 'all' ||
    value === 'foryou' ||
    value === 'readerpicks' ||
    value === 'memberpicks' ||
    value === 'new' ||
    value === 'continue' ||
    value === 'readinglist' ||
    value === 'finished'
  );
}

function tabToTopTab(value: string | null): TopReadTabId {
  if (value === 'betapicks') return 'betareading';
  if (value === 'betweencharacters') return 'community';
  if (value === 'magazine') return 'betweenreads';
  return isTopReadTabId(value) ? value : 'betweenreads';
}

function tabToShelf(value: string | null): SidebarShelfId {
  return isSidebarShelfId(value) ? value : 'all';
}

function shelfToPath(shelf: SidebarShelfId): string {
  return shelf === 'all' ? '/read' : `/read?shelf=${shelf}`;
}

function bookMatchesShelf(book: Book, shelf: SidebarShelfId): boolean {
  if (shelf === 'readerpicks') return book.badges.some((b) => b.kind === 'rp');
  if (shelf === 'memberpicks') return book.badges.some((b) => b.kind === 'mp');
  return visibility[shelf].includes(book.section);
}

function matchesQuery(book: Book, q: string): boolean {
  if (!q) return true;
  const needle = q.trim().toLowerCase();
  if (!needle) return true;
  return book.title.toLowerCase().includes(needle) || book.author.toLowerCase().includes(needle);
}

function hasBadge(book: Book, kind: string): boolean {
  return book.badges.some((badge) => badge.kind === kind);
}

function uniqueBooks(books: Book[]): Book[] {
  const seen = new Set<string>();
  return books.filter((b) => (seen.has(b.slug) ? false : (seen.add(b.slug), true)));
}

function BetaReadingPanel() {
  return (
    <section className="br-beta-read br-beta-read-gallery" aria-labelledby="br-sec-beta-reading">
      <div className="br-sec-head">
        <div>
          <h2 id="br-sec-beta-reading" className="br-sec-label">Beta Reading</h2>
          <p className="br-beta-read-kicker">Open manuscripts looking for careful early readers</p>
        </div>
      </div>

      <div className="br-beta-list" role="list">
        {betaReadingPosts.map((post) => {
          const coverStyle: CSSProperties = { background: post.cover };
          return (
            <article className="br-beta-post" role="listitem" key={post.title}>
              <div className="br-beta-cover" style={coverStyle}>
                <div className="br-cover-inner">
                  <div className="br-cover-title">{post.title}</div>
                  <div className="br-cover-rule" />
                  <div className="br-cover-author">{post.author}</div>
                </div>
              </div>

              <div className="br-beta-post-body">
                <span className="br-continue-eyebrow">Beta request</span>
                <h3 className="br-beta-post-title">{post.title}</h3>
                <div className="br-beta-post-author">by {post.author}</div>
                <div className="br-beta-post-meta">
                  {post.type} · {post.words.toLocaleString('en-US')} words
                </div>
                <div className="br-beta-tags" aria-label="Genre and mood">
                  <span>{post.genre}</span>
                  <span>{post.mood}</span>
                </div>
              </div>

              <div className="br-beta-slots" aria-label="Open beta reading slots">
                <strong>2</strong>
                <span>slots open</span>
              </div>

              <Link href={`/read/beta/${post.slug}`} className="br-btn br-btn-primary br-beta-cta">
                Gain 25 Swap Credits
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function BetweenLinesLockedPanel() {
  return (
    <section className="br-blines-lock br-blines-lock-gallery" aria-labelledby="br-sec-betweenlines">
      <div className="br-sec-head br-blines-lock-head">
        <div>
          <h2 id="br-sec-betweenlines" className="br-sec-label">BetweenLines Journal</h2>
          <p className="br-blines-lock-kicker">Curated fiction, poetry, essays and illustration</p>
        </div>
        <span className="br-blines-lock-pill">PowerReader</span>
      </div>

      <div className="br-blines-offer" role="region" aria-label="Upgrade to read BetweenLines">
        <div className="br-blines-offer-top">
          <div>
            <div className="br-blines-upgrade-mark" aria-hidden="true">BL</div>
            <p className="br-blines-upgrade-eyebrow">Premium reading experience</p>
            <h3>Read every BetweenLines issue with PowerReader</h3>
            <p className="br-blines-upgrade-copy">
              Get the journal, unlimited premium chapters, Reader Pods, early access,
              priority beta reader matching, and full mood-based discovery.
            </p>
          </div>

          <div className="br-blines-price-card" aria-label="PowerReader pricing">
            <span className="br-blines-price-label">PowerReader</span>
            <strong>$10</strong>
            <span>per month</span>
            <em>or $100/year - save $20</em>
            <small>14-day free trial</small>
          </div>
        </div>

        <div className="br-blines-compare" aria-label="Free and PowerReader benefits comparison">
          <div className="br-blines-compare-row is-head">
            <span>Benefit</span>
            <span>Free</span>
            <span>PowerReader</span>
          </div>
          {betweenLinesComparison.map((row) => (
            <div className="br-blines-compare-row" key={row.feature}>
              <span>{row.feature}</span>
              <span>{row.free}</span>
              <span>{row.premium}</span>
            </div>
          ))}
        </div>

        <div className="br-blines-actions">
          <Link
            className="br-btn br-btn-premium br-btn-lg"
            href="/checkout?plan=powerreader&billing=monthly&source=betweenlines"
          >
            Upgrade to PowerReader
          </Link>
          <Link
            className="br-blines-monthly"
            href="/checkout?plan=powerreader&billing=annual&source=betweenlines"
          >
            Choose annual billing
          </Link>
        </div>
      </div>
    </section>
  );
}

function DiscoverContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [active, setActive] = useState<TopReadTabId>('betweenreads');
  const [activeShelf, setActiveShelf] = useState<SidebarShelfId>('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({});
  const [query, setQuery] = useState('');
  const filtersActive = hasActiveFilters(filters) || query.trim().length > 0;
  const visible = useMemo(() => new Set<Section['id']>(visibility[activeShelf]), [activeShelf]);

  useEffect(() => {
    const tab = searchParams.get('tab');
    const shelf = searchParams.get('shelf');
    setActive(tabToTopTab(tab));
    setActiveShelf(isSidebarShelfId(shelf) ? shelf : tabToShelf(tab));
  }, [searchParams]);

  useEffect(() => {
    if (!sidebarOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSidebarOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [sidebarOpen]);

  const toggle = useCallback((key: string) => {
    setFilters((prev) => {
      const next = { ...prev };
      if (next[key]) delete next[key];
      else next[key] = true;
      return next;
    });
  }, []);

  const clearFilters = useCallback(() => setFilters({}), []);

  const changeTab = useCallback(
    (id: TopReadTabId) => {
      setActive(id);
      router.replace(id === 'betweenreads' ? shelfToPath(activeShelf) : `/read?tab=${id}`, { scroll: false });
    },
    [activeShelf, router],
  );

  const changeShelf = useCallback(
    (id: SidebarShelfId) => {
      setActive('betweenreads');
      setActiveShelf(id);
      router.replace(shelfToPath(id), { scroll: false });
    },
    [router],
  );

  const inProgressBooks = useMemo(() => getInProgressBooks(), []);
  const inProgressMap = useMemo(
    () => Object.fromEntries(inProgressBooks.map((p) => [p.book.slug, p.progress])),
    [inProgressBooks],
  );
  const readingListBooks = useMemo(() => getReadingListBooks(), []);
  const finishedBooks = useMemo(() => getFinishedBooks(), []);

  const heroPick = inProgressBooks[0];

  const allBooks = useMemo(() => getAllBooks(), []);

  const betweenLinesBooks = useMemo(
    () => uniqueBooks(allBooks.filter((b) => b.section === 'bl' || hasBadge(b, 'bl'))),
    [allBooks],
  );
  const readerFavorites = useMemo(
    () =>
      uniqueBooks(
        allBooks
          .filter((b) => hasBadge(b, 'rp') || (b.readerPicks ?? 0) >= 35)
          .filter((b) => b.slug !== heroPick?.book.slug),
      ).slice(0, 8),
    [allBooks, heroPick],
  );
  const recommendedBooks = useMemo(
    () =>
      uniqueBooks([
        ...getBooksBySection('foryou'),
        ...getBooksBySection('new'),
        ...getBooksBySection('classics'),
      ]).slice(0, 8),
    [],
  );
  const midnightShelf = useMemo(
    () =>
      uniqueBooks(
        allBooks.filter((b) =>
          b.tags.some((tag) => ['Reflective', 'Quiet', 'Gothic', 'Mystery'].includes(tag)),
        ),
      ).slice(0, 8),
    [allBooks],
  );
  const newThisWeek = useMemo(() => getBooksBySection('new'), []);

  const filteredBooks = useMemo(() => {
    return sections
      .filter((s) => visible.has(s.id))
      .flatMap((s) => getBooksBySection(s.id))
      .filter((b) => bookMatchesShelf(b, activeShelf))
      .filter((b) => matchesFilters(b.tags, filters))
      .filter((b) => matchesQuery(b, query));
  }, [activeShelf, filters, query, visible]);

  const isPersonalShelf = PERSONAL_SHELVES.has(activeShelf);
  const showFeaturedLayout =
    active === 'betweenreads' && activeShelf === 'all' && !filtersActive;
  const showCommunity = active === 'community' && !filtersActive;
  const showLockedBetweenLines = active === 'betweenlines';
  const showBetaReading = active === 'betareading';
  const showFiltered = active === 'betweenreads' && filtersActive && !isPersonalShelf;

  return (
    <main className="br-gallery-page br-read-gallery">
      <button
        type="button"
        className={`br-read-sidebar-toggle${sidebarOpen ? ' is-open' : ''}`}
        onClick={() => setSidebarOpen((open) => !open)}
        aria-label={sidebarOpen ? 'Hide reader sidebar' : 'Show reader sidebar'}
        aria-expanded={sidebarOpen}
        aria-controls="br-read-sidebar-panel"
      >
        <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
          <path
            d="M4 6h12M7 10h9M4 14h7"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {sidebarOpen ? (
        <div
          id="br-read-sidebar-panel"
          className="br-read-sidebar-panel"
          aria-label="Reader sidebar"
        >
          <div className="br-read-sidebar-head">
            <span>Browse</span>
            <button
              type="button"
              className="br-read-sidebar-close"
              onClick={() => setSidebarOpen(false)}
              aria-label="Hide reader sidebar"
            >
              ×
            </button>
          </div>
          <FilterSidebar
            filters={filters}
            onToggle={toggle}
            selectedShelf={activeShelf}
            onShelfChange={changeShelf}
          />
        </div>
      ) : null}

      <DiscoverBar<TopReadTabId>
        tabs={tabs}
        active={active}
        onChange={changeTab}
        query={query}
        onQueryChange={setQuery}
        filters={filters}
        onFilterToggle={toggle}
        onFiltersClear={clearFilters}
      />

      {active === 'betweenreads' ? (
        <ShelfChips active={activeShelf} onChange={changeShelf} />
      ) : null}

      {active === 'betweenreads' && !filtersActive && !isPersonalShelf && heroPick ? (
        <ContinueGalleryHero
          book={heroPick.book}
          progress={heroPick.progress}
          totalInProgress={inProgressBooks.length}
          invites={getBetweenLinesInviteCount()}
        />
      ) : null}

      <div className="br-read-gallery-body">
        {showLockedBetweenLines ? (
          <BetweenLinesLockedPanel />
        ) : showBetaReading ? (
          <BetaReadingPanel />
        ) : active === 'audio' ? (
          <section className="br-read-placeholder br-read-placeholder-gallery" aria-labelledby="read-placeholder-audio">
            <span className="br-continue-eyebrow">Coming soon</span>
            <h2 id="read-placeholder-audio">Audio</h2>
            <p>Audiobook shelves and narrated samples will live here.</p>
          </section>
        ) : showCommunity ? (
          <section className="br-read-community" aria-labelledby="br-sec-characters">
            <div className="br-gallery-rail-head">
              <div>
                <p className="br-gallery-kicker">BetweenCharacters</p>
                <h2 id="br-sec-characters">Community quotes</h2>
              </div>
            </div>
            <div className="br-character-grid">
              {betweenCharacterQuotes.map((item) => (
                <article key={item.source} className="br-character-card">
                  <div className="br-character-tag">{item.tag}</div>
                  <p className="br-character-quote">&ldquo;{item.quote}&rdquo;</p>
                  <div className="br-character-source">— {item.source}</div>
                </article>
              ))}
            </div>
          </section>
        ) : active === 'betweenreads' && isPersonalShelf ? (
          activeShelf === 'continue' ? (
            inProgressBooks.length === 0 ? (
              <ShelfEmpty
                title="Nothing in progress"
                line="Open a book and BetweenReads will remember the line you stopped on."
                onBrowse={() => changeShelf('all')}
              />
            ) : (
              <GalleryRail
                title="Continue reading"
                kicker={`${inProgressBooks.length} in progress`}
                books={inProgressBooks.map((p) => p.book)}
                inProgressMap={inProgressMap}
                action={null}
              />
            )
          ) : activeShelf === 'readinglist' ? (
            readingListBooks.length === 0 ? (
              <ShelfEmpty
                title="Reading list is empty"
                line="Save books to come back to. They'll show up here."
                onBrowse={() => changeShelf('all')}
              />
            ) : (
              <GalleryRail
                title="Reading list"
                kicker={`${readingListBooks.length} saved`}
                books={readingListBooks}
                action={null}
              />
            )
          ) : finishedBooks.length === 0 ? (
            <ShelfEmpty
              title="No finished books yet"
              line="Mark a book as read when you finish — it'll appear here."
              onBrowse={() => changeShelf('all')}
            />
          ) : (
            <GalleryRail
              title="Finished"
              kicker={`${finishedBooks.length} complete`}
              books={finishedBooks}
              action={null}
            />
          )
        ) : showFiltered ? (
          <section className="br-gallery-rail" aria-label="Filtered books">
            <div className="br-gallery-rail-head">
              <div>
                <p className="br-gallery-kicker">{SHELF_LABELS[activeShelf]}</p>
                <h2>
                  {filteredBooks.length === 0
                    ? 'No matches'
                    : `${filteredBooks.length} match${filteredBooks.length === 1 ? '' : 'es'}`}
                </h2>
              </div>
              <button type="button" className="br-gallery-rail-link" onClick={clearFilters}>
                Clear filters
              </button>
            </div>
            {filteredBooks.length === 0 ? (
              <p className="br-read-filter-empty">
                Nothing matches. Try removing a mood or genre.
              </p>
            ) : (
              <div className="br-read-grid">
                {filteredBooks.map((b) => (
                  <BookPoster key={b.slug} book={b} progress={inProgressMap[b.slug]} />
                ))}
              </div>
            )}
          </section>
        ) : showFeaturedLayout ? (
          <>
            {inProgressBooks.length > 1 ? (
              <GalleryRail
                title="Keep reading"
                kicker={`${inProgressBooks.length} in progress`}
                books={inProgressBooks.map((p) => p.book)}
                inProgressMap={inProgressMap}
                action={
                  <button
                    type="button"
                    className="br-gallery-rail-link"
                    onClick={() => changeShelf('continue')}
                  >
                    View all
                  </button>
                }
              />
            ) : null}

            <GalleryRail
              title="BetweenLines premieres"
              kicker="Journal-first fiction"
              books={betweenLinesBooks}
              ranked
              action={
                <button
                  type="button"
                  className="br-gallery-rail-link"
                  onClick={() => changeTab('betweenlines')}
                >
                  Inside BetweenLines
                </button>
              }
            />

            <GalleryRail
              title="Recommended for you"
              kicker="Based on your reading"
              books={recommendedBooks}
              action={
                <button
                  type="button"
                  className="br-gallery-rail-link"
                  onClick={() => changeShelf('foryou')}
                >
                  See For You shelf
                </button>
              }
            />

            <GalleryRail
              title="Reader favorites"
              kicker="Most-shelved by readers"
              books={readerFavorites}
              ranked
              action={
                <button
                  type="button"
                  className="br-gallery-rail-link"
                  onClick={() => changeShelf('readerpicks')}
                >
                  All reader picks
                </button>
              }
            />

            <GalleryRail
              title="Quiet rooms after dark"
              kicker="Atmospheric discoveries"
              books={midnightShelf}
            />

            {readingListBooks.length > 0 ? (
              <GalleryRail
                title="From your reading list"
                kicker={`${readingListBooks.length} saved`}
                books={readingListBooks}
                action={
                  <button
                    type="button"
                    className="br-gallery-rail-link"
                    onClick={() => changeShelf('readinglist')}
                  >
                    Open list
                  </button>
                }
              />
            ) : null}

            <GalleryRail
              title="New this week"
              kicker="Fresh on BetweenReads"
              books={newThisWeek}
              action={
                <button
                  type="button"
                  className="br-gallery-rail-link"
                  onClick={() => changeShelf('new')}
                >
                  See all new
                </button>
              }
            />
          </>
        ) : (
          <section className="br-gallery-rail" aria-label="Shelf">
            <div className="br-gallery-rail-head">
              <div>
                <p className="br-gallery-kicker">{SHELF_LABELS[activeShelf]}</p>
                <h2>{filteredBooks.length} book{filteredBooks.length === 1 ? '' : 's'}</h2>
              </div>
            </div>
            <div className="br-read-grid">
              {filteredBooks.map((b) => (
                <BookPoster key={b.slug} book={b} progress={inProgressMap[b.slug]} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function ShelfEmpty({ title, line, onBrowse }: { title: string; line: string; onBrowse: () => void }) {
  return (
    <section className="br-read-shelf-empty" aria-label={title}>
      <h2>{title}</h2>
      <p>{line}</p>
      <button type="button" className="br-gallery-secondary" onClick={onBrowse}>
        Browse the gallery →
      </button>
    </section>
  );
}

export default function DiscoverPage() {
  return (
    <Suspense fallback={null}>
      <DiscoverContent />
    </Suspense>
  );
}
