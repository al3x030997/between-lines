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

const betweenLinesPremiumBenefits = [
  'All BetweenLines issues',
  'Unlimited premium chapters',
  'Reader Pods',
  'Early access',
];

const betweenLinesLockedPieces = [
  {
    kind: 'Fiction',
    issue: 'Issue 01',
    title: 'A Room That Remembered Rain',
    author: 'Mara Venn',
    deck: 'A woman returns to a hotel where every room keeps the weather from its last guest.',
    length: '18 min read',
    accent: 'green',
  },
  {
    kind: 'Essay',
    issue: 'Issue 01',
    title: 'On Reading Slowly in Public',
    author: 'Theo March',
    deck: 'A defense of the visible reader, the borrowed hour, and the cafe table as desk.',
    length: '9 min read',
    accent: 'ink',
  },
  {
    kind: 'Poetry',
    issue: 'Issue 01',
    title: 'Six Notes Left Under a Door',
    author: 'Inez Cora',
    deck: 'A sequence about apartments, grief, and the tiny documents people leave behind.',
    length: '7 min read',
    accent: 'gold',
  },
  {
    kind: 'Illustration',
    issue: 'Issue 01',
    title: 'The Night Shelf',
    author: 'Amara Diallo',
    deck: 'Four quiet interiors, drawn for readers who leave a lamp on after the last page.',
    length: 'Gallery',
    accent: 'blue',
  },
  {
    kind: 'Short Story',
    issue: 'Issue 02',
    title: 'The Cartographer of Lost Kitchens',
    author: 'Nadia Bell',
    deck: 'A mapmaker charts family recipes by the rooms where no one speaks of them anymore.',
    length: '22 min read',
    accent: 'red',
  },
  {
    kind: 'Conversation',
    issue: 'Issue 02',
    title: 'The First Reader Was Right',
    author: 'BetweenLines Desk',
    deck: 'Editors unpack how one reader note changed the ending of a launch issue story.',
    length: '12 min read',
    accent: 'paper',
  },
];

const betaCover = (filename: string) =>
  `linear-gradient(180deg, rgba(8, 8, 8, 0.08) 0%, rgba(8, 8, 8, 0.34) 58%, rgba(8, 8, 8, 0.62) 100%), url('/covers/${filename}.jpg') center/cover no-repeat`;

const betaReadingPosts = [
  {
    title: 'The Orchard Map',
    author: 'Mina Calder',
    cover: betaCover('ember-and-the-cartographer'),
    type: 'Novel',
    words: 68200,
    genre: 'Fantasy',
    mood: 'Escapist',
  },
  {
    title: 'Northbound After Midnight',
    author: 'Jon Bellamy',
    cover: betaCover('the-glass-meridian'),
    type: 'Novel',
    words: 74500,
    genre: 'Thriller',
    mood: 'Intense',
  },
  {
    title: 'Every House Has Weather',
    author: 'Clara Vale',
    cover: betaCover('the-quiet-hours'),
    type: 'Novel',
    words: 59100,
    genre: 'Literary Fiction',
    mood: 'Reflective',
  },
  {
    title: 'The Salt Letters',
    author: 'Owen Marr',
    cover: betaCover('salt-and-the-sea-between'),
    type: 'Novel',
    words: 81200,
    genre: 'Historical',
    mood: 'Slow Burn',
  },
  {
    title: 'A Manual for Vanishing',
    author: 'Leah Sato',
    cover: betaCover('the-archivist-of-small-things'),
    type: 'Novel',
    words: 63800,
    genre: 'Mystery',
    mood: 'Calming',
  },
];

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

              <button type="button" className="br-btn br-btn-primary br-beta-cta">
                Gain 25 Swap Credits
              </button>
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

      <div className="br-blines-lock-frame">
        <div className="br-blines-locked-grid" aria-hidden="true">
          {betweenLinesLockedPieces.map((piece) => (
            <article className={`br-blines-piece is-${piece.accent}`} key={piece.title}>
              <div className="br-blines-piece-cover">
                <span>{piece.issue}</span>
                <strong>{piece.kind}</strong>
              </div>
              <div className="br-blines-piece-body">
                <div className="br-blines-piece-meta">
                  <span>{piece.kind}</span>
                  <span>{piece.length}</span>
                </div>
                <h3>{piece.title}</h3>
                <p className="br-blines-piece-author">by {piece.author}</p>
                <p>{piece.deck}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="br-blines-upgrade" role="region" aria-label="Upgrade to read BetweenLines">
          <div className="br-blines-upgrade-mark" aria-hidden="true">BL</div>
          <p className="br-blines-upgrade-eyebrow">Premium reading experience</p>
          <h3>Upgrade to read curated picks from our journal.</h3>
          <p className="br-blines-upgrade-copy">
            PowerReader unlocks every BetweenLines issue, unlimited premium chapters,
            Reader Pods, early access, priority beta reader matching, and full mood-based discovery.
          </p>
          <div className="br-blines-price-row" aria-label="PowerReader pricing">
            <div>
              <strong>$100</strong>
              <span>per year</span>
            </div>
            <div>
              <strong>14 days</strong>
              <span>free trial</span>
            </div>
            <div>
              <strong>$20</strong>
              <span>annual saving</span>
            </div>
          </div>
          <div className="br-blines-benefits" aria-label="Included with PowerReader">
            {betweenLinesPremiumBenefits.map((benefit) => (
              <span key={benefit}>{benefit}</span>
            ))}
          </div>
          <div className="br-blines-actions">
            <Link
              className="br-btn br-btn-premium br-btn-lg"
              href="/checkout?plan=powerreader&billing=annual&source=betweenlines"
            >
              Upgrade to PowerReader
            </Link>
            <Link
              className="br-blines-monthly"
              href="/checkout?plan=powerreader&billing=monthly&source=betweenlines"
            >
              or $10/month
            </Link>
          </div>
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
