'use client';

import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  FilterSidebar,
  type FilterState,
  type SidebarShelfId,
  hasActiveFilters,
  matchesFilters,
} from '@/components/FilterSidebar';
import { ProductCard, type CardVariant } from '@/components/ProductCard';
import { ContinueReadingHero } from '@/components/ContinueReadingHero';
import { FeaturedCarousel } from '@/components/FeaturedCarousel';
import { ProfileBlock } from '@/components/ProfileBlock';
import { StoreTabs, type TabDef } from '@/components/StoreTabs';
import { getBetaReadingRequests } from '@/lib/mock-beta-reading';
import { getBooksBySection, sections, type Section, type Book } from '@/lib/mock-books';

type TopReadTabId =
  | 'betweenreads'
  | 'betweenlines'
  | 'betareading'
  | 'audio'
  | 'magazine'
  | 'community';

const tabs: TabDef<TopReadTabId>[] = [
  { id: 'betweenreads', label: 'BetweenReads' },
  { id: 'betweenlines', label: 'BetweenLines' },
  { id: 'betareading', label: 'Beta Reading' },
  { id: 'audio', label: 'Audio' },
  { id: 'magazine', label: 'Magazine' },
  { id: 'community', label: 'Community' },
];

const visibility: Record<SidebarShelfId, Section['id'][]> = {
  all: ['bl', 'foryou', 'new', 'classics'],
  foryou: ['foryou'],
  readerpicks: ['bl', 'foryou', 'new', 'classics'],
  memberpicks: ['bl', 'foryou', 'new', 'classics'],
  new: ['new'],
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
  {
    feature: 'Reading profile',
    free: 'BetweenPages reader profile',
    premium: 'Everything in EmergingReader',
  },
  {
    feature: 'Stories',
    free: 'Public content and free chapters',
    premium: 'Unlimited premium chapters',
  },
  {
    feature: 'BetweenLines journal',
    free: 'Not included',
    premium: 'All issues',
  },
  {
    feature: 'Reader Pods',
    free: 'Not included',
    premium: 'Join writer inner circles',
  },
  {
    feature: 'Beta reading',
    free: 'Basic access',
    premium: 'Priority beta reader matching',
  },
  {
    feature: 'Discovery',
    free: 'Standard mood filters',
    premium: 'Mood-based discovery - full access',
  },
  {
    feature: 'New content',
    free: 'Standard release timing',
    premium: 'Early access',
  },
  {
    feature: 'BetweenCharacters',
    free: 'Read and submit quotes',
    premium: 'Featured rotation eligible',
  },
];

const betaReadingPosts = getBetaReadingRequests();

function isTopReadTabId(value: string | null): value is TopReadTabId {
  return tabs.some((t) => t.id === value);
}

function isSidebarShelfId(value: string | null): value is SidebarShelfId {
  return value === 'all' || value === 'foryou' || value === 'readerpicks' || value === 'memberpicks' || value === 'new';
}

function tabToTopTab(value: string | null): TopReadTabId {
  if (value === 'betapicks') return 'betareading';
  if (value === 'betweencharacters') return 'community';
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

function bookToCard(b: Book, variant: CardVariant = 'default'): ReactNode {
  const primaryBadge = b.badges[0];
  return (
    <ProductCard
      key={b.slug}
      kind="book"
      variant={variant}
      href={`/read/${b.slug}`}
      title={b.title}
      author={b.author}
      blurb={b.blurb}
      cover={b.cover}
      coverIsDark={b.coverIsDark}
      badge={primaryBadge ? { kind: primaryBadge.kind, label: primaryBadge.label } : undefined}
      format={b.format}
      access={b.access}
    />
  );
}

function BetaReadingPanel() {
  return (
    <section className="br-beta-read" aria-labelledby="br-sec-beta-reading">
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

function ReadPlaceholderPanel({ title, body }: { title: string; body: string }) {
  return (
    <section className="br-read-placeholder" aria-labelledby={`read-placeholder-${title}`}>
      <span className="br-continue-eyebrow">Coming soon</span>
      <h2 id={`read-placeholder-${title}`}>{title}</h2>
      <p>{body}</p>
    </section>
  );
}

function BetweenLinesLockedPanel() {
  return (
    <section className="br-blines-lock" aria-labelledby="br-sec-betweenlines">
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
  const [filters, setFilters] = useState<FilterState>({});
  const visible = new Set<Section['id']>(visibility[activeShelf]);
  const filtersActive = hasActiveFilters(filters);
  const showFeaturedLayout = active === 'betweenreads' && activeShelf === 'all' && !filtersActive;
  const showCommunity = active === 'community' && !filtersActive;
  const showLockedBetweenLines = active === 'betweenlines';
  const showBetaReading = active === 'betareading';

  useEffect(() => {
    const tab = searchParams.get('tab');
    const shelf = searchParams.get('shelf');
    setActive(tabToTopTab(tab));
    setActiveShelf(isSidebarShelfId(shelf) ? shelf : tabToShelf(tab));
  }, [searchParams]);

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

  const filteredBooks = useMemo(() => {
    return sections
      .filter((s) => visible.has(s.id))
      .flatMap((s) => getBooksBySection(s.id))
      .filter((b) => bookMatchesShelf(b, activeShelf))
      .filter((b) => matchesFilters(b.tags, filters));
  }, [activeShelf, filters, visible]);

  const featuredBooks = useMemo(() => getBooksBySection('bl'), []);
  const recommendedBooks = useMemo(
    () => [
      ...getBooksBySection('foryou'),
      ...getBooksBySection('new'),
      ...getBooksBySection('classics'),
    ],
    [],
  );

  return (
    <>
      <header className="br-discover-head">
        <ProfileBlock />
        <div className="br-discover-head-title">
          <h1 className="br-discover-h1">Discover</h1>
          <p className="br-discover-sub">Stories matched to your current mood</p>
        </div>
        <div className="br-discover-actions">
          <button type="button" className="br-sort" aria-disabled="true">
            <span aria-hidden="true">↕</span> Sort: Relevance <span aria-hidden="true">▾</span>
          </button>
          <button type="button" className="br-btn br-btn-ghost br-discover-filters" aria-disabled="true">
            <span aria-hidden="true">⚙</span> Filters
          </button>
        </div>
      </header>
      <div className="br-discover">
        <FilterSidebar
          filters={filters}
          onToggle={toggle}
          selectedShelf={activeShelf}
          onShelfChange={changeShelf}
        />
        <div className="br-discover-main">
          <StoreTabs<TopReadTabId>
            tabs={tabs}
            active={active}
            onChange={changeTab}
            ariaLabel="Discover sections"
          />

        <div className="br-stage">
          {active === 'betweenreads' ? <ContinueReadingHero /> : null}

          {active === 'betweenreads' && filtersActive && !showLockedBetweenLines && (
            <div className="br-filter-status" role="status" aria-live="polite">
              <span>
                {filteredBooks.length === 0
                  ? 'No books match your filters.'
                  : `${filteredBooks.length} book${filteredBooks.length === 1 ? '' : 's'} match your filters.`}
              </span>
              <button type="button" className="br-filter-clear" onClick={clearFilters}>
                Clear filters
              </button>
            </div>
          )}

          {showLockedBetweenLines ? (
            <BetweenLinesLockedPanel />
          ) : showBetaReading ? (
            <BetaReadingPanel />
          ) : showCommunity ? (
            <section aria-labelledby="br-sec-characters">
              <div className="br-sec-head">
                <h2 id="br-sec-characters" className="br-sec-label">Community</h2>
                <a className="br-sec-link">See all</a>
              </div>
              <div className="br-character-grid">
                {betweenCharacterQuotes.map((item) => (
                  <article key={item.source} className="br-character-card">
                    <div className="br-character-tag">{item.tag}</div>
                    <p className="br-character-quote">“{item.quote}”</p>
                    <div className="br-character-source">— {item.source}</div>
                  </article>
                ))}
              </div>
            </section>
          ) : active === 'audio' ? (
            <ReadPlaceholderPanel
              title="Audio"
              body="Audiobook shelves and narrated samples will live here."
            />
          ) : active === 'magazine' ? (
            <ReadPlaceholderPanel
              title="Magazine"
              body="Magazine issues, interviews, and culture notes will live here."
            />
          ) : showFeaturedLayout ? (
            <>
              <section aria-labelledby="br-sec-featured">
                <div className="br-sec-head">
                  <h2 id="br-sec-featured" className="br-sec-label">Featured this week</h2>
                  <a className="br-sec-link">View all</a>
                </div>
                <FeaturedCarousel books={featuredBooks} />
              </section>

              <section aria-labelledby="br-sec-recommended">
                <div className="br-sec-head">
                  <h2 id="br-sec-recommended" className="br-sec-label">Recommended for you</h2>
                  <a className="br-sec-link">View all</a>
                </div>
                <div className="br-recommended-row">
                  {recommendedBooks.map((b) => bookToCard(b))}
                </div>
              </section>
            </>
          ) : (
            <section aria-label="Filtered books">
              <div className="br-recommended-row">
                {filteredBooks.map((b) => bookToCard(b))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
    </>
  );
}

export default function DiscoverPage() {
  return (
    <Suspense fallback={null}>
      <DiscoverContent />
    </Suspense>
  );
}
