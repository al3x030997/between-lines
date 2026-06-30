'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { SiteNav } from '@/components/SiteNav';
import {
  FilterSidebar,
  type FilterState,
  type SidebarSection,
  type SidebarShelfId,
} from '@/components/FilterSidebar';
import { getAllBooks, getBooksBySection, type Book } from '@/lib/mock-books';
import { audiobooks, illustrations, type StoreProduct } from '@/lib/mock-products';

// The logged-out /read library. A standalone, ungated, light-themed gallery in
// the marketing hero brand. It's organised by CONTENT TYPE — novels, short
// stories & poetry, illustrated works, audiobooks, and free classics — to show
// the breadth of what BetweenReads offers (mirrors the FAQ's format taxonomy).
// Every cover nudges a guest into the free sign-up; the real pages live behind
// the session gate.
//
// The left sidebar is the *actual* in-app `FilterSidebar`, fed our content-type
// sections via its custom-sections path. Only positioning + accent theming are
// re-skinned, scoped under `.rl-root .br-fsidebar` (see CSS) so nothing leaks
// back into the reader app. Everything else here stays namespaced `.rl-*`.

const JOIN_HREF = '/start?mode=reader';

// Content-type sections, mirrored in the sidebar Browse list. `all` shows every
// section; any other id shows only that one.
type ReadSectionId =
  | 'all'
  | 'novels'
  | 'shorts'
  | 'illustrations'
  | 'audiobooks'
  | 'classics';

const READ_SECTIONS: SidebarSection[] = [
  { id: 'all', label: 'All' },
  { id: 'novels', label: 'Novels' },
  { id: 'shorts', label: 'Short Stories' },
  { id: 'illustrations', label: 'Illustrations' },
  { id: 'audiobooks', label: 'Audiobooks' },
  { id: 'classics', label: 'Classics' },
];

// One row per section — the catalogue is small, so a single curated row per
// category (≈20 offers total) reads better than padding thin content into
// multiple sparse rows. Counts match each grid's desktop column count.
const ROW = { novels: 5, shorts: 4, illustrations: 2, audiobooks: 3, classics: 5 } as const;

// Required-but-unused props for FilterSidebar's filter UI. With `showFilters`
// false the component never reads these, so no-op values are safe.
const NO_FILTERS: FilterState = {};
const noop = () => {};

// `Book` has no structural content-type field, only free-text format/category/
// tags — so classify from those. Poetry first (a poetry collection can also
// read as "stories"), then the short forms, else a novel.
function contentType(b: Book): 'novel' | 'short' | 'poetry' {
  const hay = `${b.format} ${b.category} ${b.tags.join(' ')}`.toLowerCase();
  if (/poetry|poem/.test(hay)) return 'poetry';
  if (/short stor|stories|novella|novelette|flash|microfiction/.test(hay)) return 'short';
  return 'novel';
}

function matches(book: Book, q: string): boolean {
  if (!q) return true;
  return [book.title, book.author, book.blurb, ...book.tags]
    .join(' ')
    .toLowerCase()
    .includes(q);
}

function productMatches(p: StoreProduct, q: string): boolean {
  if (!q) return true;
  return [p.title, p.byline, p.blurb].join(' ').toLowerCase().includes(q);
}

function Poster({ book }: { book: Book }) {
  const keywords = book.tags.slice(0, 3);
  const readTime = book.estRead ? `${book.estRead} read` : null;
  return (
    <Link className="rl-poster" href={JOIN_HREF}>
      <span className="rl-poster-cover" style={{ background: book.cover }}>
        {keywords.length > 0 && (
          <span className="rl-poster-chips" aria-hidden="true">
            {keywords.map((kw) => (
              <span key={kw} className="rl-poster-chip">
                {kw}
              </span>
            ))}
          </span>
        )}
      </span>
      <span className="rl-poster-body">
        <span className="rl-poster-title">{book.title}</span>
        <span className="rl-poster-author">{book.author}</span>
        <span className="rl-poster-blurb">{book.blurb}</span>
        <span className="rl-poster-meta">
          <span className="rl-pill">{book.format}</span>
          {readTime && <span className="rl-pill">{readTime}</span>}
          <span className={`rl-pill is-${book.access.type === 'free' ? 'free' : 'rc'}`}>
            {book.access.label}
          </span>
        </span>
      </span>
    </Link>
  );
}

// Audiobook card: a 2:3 ebook cover with a play affordance + the narrator badge
// and duration (parsed off the product byline, e.g. "… · 4h 20m").
function AudioCard({ product }: { product: StoreProduct }) {
  const duration = product.byline.split('·').pop()?.trim();
  return (
    <Link className="rl-poster" href={JOIN_HREF}>
      <span className="rl-poster-cover rl-audio-cover" style={{ background: product.cover }}>
        <span className="rl-audio-play" aria-hidden="true">▶</span>
        {duration && <span className="rl-audio-dur">{duration}</span>}
      </span>
      <span className="rl-poster-body">
        <span className="rl-poster-title">{product.title}</span>
        <span className="rl-poster-author">{product.byline.split('·')[0]?.trim()}</span>
        <span className="rl-poster-blurb">{product.blurb}</span>
        <span className="rl-poster-meta">
          {product.badge && <span className="rl-pill is-audio">{product.badge.label}</span>}
        </span>
      </span>
    </Link>
  );
}

// Illustration card: landscape art (not a 2:3 book cover) with the medium emoji,
// so the row reads as gallery prints rather than novels.
function IllustrationCard({ product }: { product: StoreProduct }) {
  return (
    <Link className="rl-poster rl-illus" href={JOIN_HREF}>
      <span className="rl-illus-cover" style={{ background: product.cover }}>
        {product.emoji && <span className="rl-illus-emoji" aria-hidden="true">{product.emoji}</span>}
      </span>
      <span className="rl-poster-body">
        <span className="rl-poster-title">{product.title}</span>
        <span className="rl-poster-author">{product.byline}</span>
        <span className="rl-poster-blurb">{product.blurb}</span>
      </span>
    </Link>
  );
}

function InviteBanner() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      const base = typeof window !== 'undefined' ? window.location.origin : '';
      await navigator.clipboard.writeText(`${base}/`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };
  return (
    <div className="rl-banner" role="note">
      <div className="rl-banner-body">
        <span className="rl-banner-emoji" aria-hidden="true">🌱</span>
        <p className="rl-banner-text">
          <strong>We&rsquo;re building BetweenReads</strong> — and we&rsquo;d love your support.
          Share your invite link: every new reader who joins gives you both free reading credits.
        </p>
      </div>
      <button type="button" className="rl-banner-cta" onClick={copy}>
        {copied ? 'Link copied ✓' : 'Copy invite link'}
      </button>
    </div>
  );
}

export function PublicLibrary() {
  const [query, setQuery] = useState('');
  const [activeSection, setActiveSection] = useState<ReadSectionId>('all');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Split the catalogue by content type. Classics are their own curated lane;
  // everything else is bucketed novel vs. short/poetry.
  const { novels, shorts } = useMemo(() => {
    const nonClassic = getAllBooks().filter((b) => b.section !== 'classics');
    return {
      novels: nonClassic.filter((b) => contentType(b) === 'novel'),
      shorts: nonClassic.filter((b) => contentType(b) !== 'novel'),
    };
  }, []);
  const classics = useMemo(() => getBooksBySection('classics'), []);

  const q = query.trim().toLowerCase();
  const novelsFiltered = novels.filter((b) => matches(b, q));
  const shortsFiltered = shorts.filter((b) => matches(b, q));
  const classicsFiltered = classics.filter((b) => matches(b, q));
  const illusFiltered = illustrations.filter((p) => productMatches(p, q));
  const audioFiltered = audiobooks.filter((p) => productMatches(p, q));

  // The featured BetweenLines Pick leads the novels section.
  const featured =
    novelsFiltered.find((b) => b.slug === 'the-quiet-hours') ?? novelsFiltered[0];
  const novelsRow = featured ? novelsFiltered.filter((b) => b !== featured) : novelsFiltered;

  const visible = (id: ReadSectionId) => activeSection === 'all' || activeSection === id;
  const showNovels = visible('novels') && novelsFiltered.length > 0;
  const showShorts = visible('shorts') && shortsFiltered.length > 0;
  const showIllus = visible('illustrations') && illusFiltered.length > 0;
  const showAudio = visible('audiobooks') && audioFiltered.length > 0;
  const showClassics = visible('classics') && classicsFiltered.length > 0;
  const empty = !showNovels && !showShorts && !showIllus && !showAudio && !showClassics;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <SiteNav />
      <div className="rl-root">
        <div className={`rl-shell ${sidebarOpen ? '' : 'is-railed'}`}>
          <FilterSidebar
            open={sidebarOpen}
            onOpen={() => setSidebarOpen(true)}
            onClose={() => setSidebarOpen(false)}
            sections={READ_SECTIONS}
            activeSection={activeSection}
            onSectionChange={(id) => setActiveSection(id as ReadSectionId)}
            query={query}
            onSearchChange={setQuery}
            showFilters={false}
            /* Filter UI is hidden (showFilters=false); these are unused. */
            filters={NO_FILTERS}
            onToggle={noop}
            selectedShelf={'all' as SidebarShelfId}
            onShelfChange={noop}
          />

          <main className="rl-main">
            <InviteBanner />

            {showNovels && (
              <section className="rl-section" aria-labelledby="rl-novels">
                {featured && (
                  <article className="rl-featured">
                    <Link className="rl-featured-cover" href={JOIN_HREF} style={{ background: featured.cover }} aria-hidden="true" tabIndex={-1} />
                    <div className="rl-featured-body">
                      <p className="rl-eyebrow">BetweenLines Pick</p>
                      <h2 className="rl-featured-title">{featured.title}</h2>
                      <p className="rl-featured-author">{featured.author}</p>
                      <p className="rl-featured-blurb">{featured.blurb}</p>
                      <div className="rl-featured-actions">
                        <span className="rl-featured-meta">{featured.format}</span>
                        <Link className="rl-cta" href={JOIN_HREF}>
                          Start reading <span aria-hidden="true">→</span>
                        </Link>
                      </div>
                    </div>
                  </article>
                )}

                {novelsRow.length > 0 && (
                  <>
                    <header className="rl-section-head">
                      <p className="rl-kicker">Be among the first</p>
                      <h3 id="rl-novels" className="rl-heading">Read our first chapters</h3>
                    </header>
                    <div className="rl-grid">
                      {novelsRow.slice(0, ROW.novels).map((book) => (
                        <Poster key={book.slug} book={book} />
                      ))}
                    </div>
                  </>
                )}
              </section>
            )}

            {showShorts && (
              <section className="rl-section" aria-labelledby="rl-shorts">
                <header className="rl-section-head">
                  <p className="rl-kicker">Short &amp; complete</p>
                  <h3 id="rl-shorts" className="rl-heading">Short stories &amp; poetry</h3>
                </header>
                <div className="rl-grid is-4">
                  {shortsFiltered.slice(0, ROW.shorts).map((book) => (
                    <Poster key={book.slug} book={book} />
                  ))}
                </div>
              </section>
            )}

            {showIllus && (
              <section className="rl-section" aria-labelledby="rl-illus">
                <header className="rl-section-head">
                  <p className="rl-kicker">Illustrated</p>
                  <h3 id="rl-illus" className="rl-heading">Art &amp; illustrated works</h3>
                </header>
                <div className="rl-grid is-2">
                  {illusFiltered.slice(0, ROW.illustrations).map((p) => (
                    <IllustrationCard key={p.id} product={p} />
                  ))}
                </div>
              </section>
            )}

            {showAudio && (
              <section className="rl-section" aria-labelledby="rl-audio">
                <header className="rl-section-head">
                  <p className="rl-kicker">Introducing · Volume</p>
                  <h3 id="rl-audio" className="rl-heading">Audiobooks, voiced by writers</h3>
                </header>
                <div className="rl-grid is-3">
                  {audioFiltered.slice(0, ROW.audiobooks).map((p) => (
                    <AudioCard key={p.id} product={p} />
                  ))}
                </div>
              </section>
            )}

            {showClassics && (
              <section className="rl-section" aria-labelledby="rl-classics">
                <header className="rl-section-head">
                  <p className="rl-kicker">Free forever · Public domain</p>
                  <h3 id="rl-classics" className="rl-heading">Timeless classics</h3>
                </header>
                <div className="rl-grid">
                  {classicsFiltered.slice(0, ROW.classics).map((book) => (
                    <Poster key={book.slug} book={book} />
                  ))}
                </div>
              </section>
            )}

            {empty && (
              <div className="rl-empty" role="status">
                <p className="rl-kicker">No matches</p>
                <h3 className="rl-heading">
                  {q ? `Nothing here for “${query.trim()}”` : 'Nothing here yet'}
                </h3>
                <p className="rl-empty-body">
                  {q
                    ? 'Try a different title, author, or tag.'
                    : 'Check back soon — we’re just getting started.'}
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}

const CSS = `
.rl-root {
  /* ── Surface ramp ──────────────────────────────────────────────
     One warm temperature, two elevation levels (Refactoring UI: pick a
     single grey temperature; Material/Atlassian: recessed canvas, raised
     containers). The old page mixed a COLD pure-white canvas with WARM
     cream panels — that adjacency is what read as "dirty/off". Now:
       L0 canvas  → warm paper (recessed), the brand's actual base tone
       L1 surface → pure white (raised) for every card AND the sidebar,
                    so they're one consistent material, lifted by a warm
                    border + a single soft shadow.
       inset      → a faint warm fill for pills/chips only. */
  --rl-paper: #F6F1E3;
  --rl-canvas: #F7F3EA;
  --rl-surface: #ffffff;
  --rl-surface-subtle: #fbf7ee;
  --rl-ink: var(--theme-text);
  --rl-ink-soft: var(--theme-text-soft);
  --rl-ink-muted: var(--theme-text-muted);
  --rl-ink-faint: var(--theme-text-faint);
  /* Warm-tinted hairline + shadow so edges share the canvas temperature
     instead of reading as cold neutral grey. */
  --rl-border: rgba(74, 60, 33, 0.16);
  --rl-border-strong: rgba(74, 60, 33, 0.30);
  --rl-raise: 0 10px 30px -20px rgba(60, 48, 24, 0.45);
  --rl-teal: #0E9D86;
  --rl-teal-strong: #085041;
  --rl-teal-soft: #e6f6f2;
  --rl-yellow: #FFE600;
  --rl-yellow-soft: #fdf6c8;
  --rl-ease: cubic-bezier(.22, 1, .36, 1);
  background: var(--rl-canvas);
  color: var(--rl-ink);
  font-family: 'Outfit', system-ui, sans-serif;
  min-height: 100vh;
}
.rl-shell {
  display: grid;
  /* The first track tracks the app sidebar's intrinsic width — 240px when the
     panel is open, 60px when collapsed to the icon rail — so the main column
     reflows automatically as the reader toggles it. */
  grid-template-columns: auto minmax(0, 1fr);
  gap: clamp(20px, 3vw, 48px);
  /* Full-bleed gallery — span the whole viewport with fluid side gutters
     instead of a centred max-width column, so the covers spread broad. */
  width: 100%;
  margin: 0;
  padding: clamp(20px, 3vw, 40px) clamp(20px, 4vw, 72px) 110px;
  align-items: start;
}
.rl-shell.is-railed { gap: clamp(16px, 2.4vw, 32px); }

/* ── Sidebar: the in-app FilterSidebar (.br-fsidebar), re-docked ──────────
   The shared component ships as a fixed full-height overlay anchored under the
   gated reader's 65px nav. Here it lives inside the centred marketing grid, so
   we override only positioning + accent theming, scoped under .rl-root so the
   reader app's own sidebar is untouched. Active state + focus map to the
   teal/paper marketing brand (mirrors the app's own light theme). */
.rl-root .br-fsidebar {
  position: sticky;
  top: 96px;
  left: auto;
  z-index: 1;
  height: auto;
  max-height: calc(100vh - 120px);
  /* L1 raised surface — the SAME white card material as the featured pick
     and the posters, so the sidebar is one family with the grid instead of a
     separate-coloured panel. Lifted off the warm canvas by border + shadow. */
  background: var(--rl-surface);
  border: 1px solid var(--rl-border);
  border-radius: 16px;
  box-shadow: var(--rl-raise);
  overflow: hidden;
  /* Re-point the shared design tokens at the marketing light brand. */
  --theme-surface-raised: var(--rl-surface);
  --v11-accent: var(--rl-teal);
  --v11-accent-strong: var(--rl-teal-strong);
  --v11-accent-soft: var(--rl-teal-soft);
  --v11-ink: var(--rl-ink);
  --v11-ink-soft: var(--rl-ink-soft);
  --v11-ink-mute: var(--rl-ink-muted);
  --v11-ink-trace: var(--rl-ink-faint);
  --v11-divider: var(--rl-border);
  /* Search field reads as a faint warm inset on the white panel. */
  --br-panel-bg: var(--rl-surface-subtle);
  --br-panel-warm: color-mix(in srgb, var(--rl-ink) 6%, transparent);
  --br-border-warm: var(--rl-border);
}
/* Collapsed icon rail: no card chrome — it's just structure sitting on the
   canvas, like the app's flush rail. */
.rl-root .br-fsidebar.is-rail {
  background: transparent;
  border-color: transparent;
  box-shadow: none;
}
.rl-root .br-fsidebar-inner { height: auto; }

/* ── Main column ───────────────────────────────────────── */
.rl-main {
  display: flex;
  flex-direction: column;
  gap: clamp(32px, 5vw, 56px);
  min-width: 0;
}

/* Invite banner */
.rl-banner {
  display: flex;
  align-items: center;
  gap: 22px;
  padding: 20px 26px;
  background: linear-gradient(180deg, #fffbe0 0%, var(--rl-yellow-soft) 100%);
  border: 1px solid color-mix(in srgb, var(--rl-yellow) 55%, var(--rl-border));
  border-radius: 14px;
}
.rl-banner-body { display: flex; align-items: center; gap: 16px; min-width: 0; }
.rl-banner-emoji { font-size: 26px; flex-shrink: 0; }
.rl-banner-text {
  margin: 0;
  font-size: 16.5px;
  line-height: 1.55;
  color: var(--theme-text);
}
.rl-banner-text strong { font-weight: 800; }
.rl-banner-cta {
  flex-shrink: 0;
  padding: 12px 22px;
  font: inherit;
  font-size: 15px;
  font-weight: 700;
  color: var(--rl-paper);
  background: #16110d;
  border: 0;
  border-radius: 999px;
  cursor: pointer;
  transition: background 160ms var(--rl-ease), transform 160ms var(--rl-ease);
}
.rl-banner-cta:hover { background: #000; transform: translateY(-1px); }
.rl-banner-cta:focus-visible { outline: 2px solid var(--rl-teal); outline-offset: 2px; }

/* Section scaffolding */
.rl-section { display: flex; flex-direction: column; gap: 24px; }
.rl-section-head { display: flex; flex-direction: column; gap: 4px; }
.rl-kicker {
  margin: 0;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--rl-teal);
}
.rl-eyebrow {
  margin: 0;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--rl-teal);
}
.rl-heading {
  margin: 0;
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(24px, 2.6vw, 32px);
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--rl-ink);
}

/* Featured pick */
.rl-featured {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
  background: var(--rl-surface);
  border: 1px solid var(--rl-border);
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 12px 36px -18px rgba(20, 18, 12, 0.4);
}
.rl-featured-cover {
  display: block;
  min-height: 340px;
  background-size: cover !important;
  background-position: center !important;
}
.rl-featured-body {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: clamp(26px, 3.4vw, 44px);
}
.rl-featured-title {
  margin: 0;
  font-family: 'Playfair Display', Georgia, serif;
  font-size: clamp(30px, 3.4vw, 44px);
  font-weight: 700;
  line-height: 1.06;
  letter-spacing: -0.015em;
  color: var(--rl-ink);
}
.rl-featured-author {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--rl-ink-soft);
}
.rl-featured-blurb {
  margin: 4px 0 0;
  font-size: clamp(15px, 1.4vw, 17px);
  line-height: 1.6;
  color: var(--rl-ink-soft);
}
.rl-featured-actions {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-top: auto;
  padding-top: 12px;
  flex-wrap: wrap;
}
.rl-featured-meta {
  font-size: 13px;
  font-weight: 600;
  color: var(--rl-ink-muted);
}
.rl-cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 26px;
  font-size: 15px;
  font-weight: 700;
  color: #fff;
  background: var(--rl-teal);
  border-radius: 999px;
  text-decoration: none;
  white-space: nowrap;
  box-shadow: 0 12px 28px -14px color-mix(in srgb, var(--rl-teal-strong) 80%, transparent);
  transition: background 180ms var(--rl-ease), transform 180ms var(--rl-ease), box-shadow 180ms var(--rl-ease);
}
.rl-cta:hover {
  background: var(--rl-teal-strong);
  transform: translateY(-2px);
  box-shadow: 0 18px 34px -14px color-mix(in srgb, var(--rl-teal-strong) 78%, transparent);
}
.rl-cta:focus-visible { outline: 2px solid var(--rl-teal-strong); outline-offset: 3px; }

/* Poster grid */
.rl-grid {
  display: grid;
  /* Fixed 5-up so the row spans the full width and lines up under the
     featured card, giving each cover more room. (auto-fill left empty tracks
     on the right, so the row stopped short of the featured card's edge.)
     Steps down on narrower screens below. */
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: clamp(20px, 2vw, 32px);
}
/* Per-section column counts, tuned to the medium: short stories 4-up,
   audiobooks 3-up, illustrations 2-up (landscape). Step down responsively
   in the media blocks below. */
.rl-grid.is-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
.rl-grid.is-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.rl-grid.is-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: clamp(24px, 2.4vw, 40px); }
.rl-poster {
  display: flex;
  flex-direction: column;
  gap: 12px;
  text-decoration: none;
  color: inherit;
  border-radius: 14px;
}
.rl-poster-cover {
  position: relative;
  display: block;
  aspect-ratio: 2 / 3;
  border-radius: 14px;
  border: 1px solid var(--rl-border);
  background-size: cover !important;
  background-position: center !important;
  box-shadow: 0 8px 22px -14px rgba(20, 18, 12, 0.5);
  transition: transform 220ms var(--rl-ease), box-shadow 220ms var(--rl-ease);
}
.rl-poster:hover .rl-poster-cover {
  transform: translateY(-4px);
  box-shadow: 0 18px 34px -16px rgba(20, 18, 12, 0.55);
}
.rl-poster-chips {
  position: absolute;
  left: 10px;
  bottom: 10px;
  right: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.rl-poster-chip {
  padding: 4px 9px;
  font-size: 11px;
  font-weight: 600;
  color: #fff;
  background: rgba(12, 10, 8, 0.62);
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
  border-radius: 999px;
}
.rl-poster-body { display: flex; flex-direction: column; gap: 5px; }
.rl-poster-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 19px;
  font-weight: 700;
  line-height: 1.18;
  letter-spacing: -0.01em;
  color: var(--rl-ink);
}
.rl-poster:hover .rl-poster-title { color: var(--rl-teal-strong); }
.rl-poster-author {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--rl-ink-muted);
}
.rl-poster-blurb {
  font-size: 13.5px;
  line-height: 1.5;
  color: var(--rl-ink-soft);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.rl-poster-meta { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px; }
.rl-pill {
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 600;
  color: var(--rl-ink-muted);
  background: var(--rl-surface-subtle);
  border: 1px solid var(--rl-border);
  border-radius: 999px;
}
.rl-pill.is-free {
  color: var(--rl-teal-strong);
  background: var(--rl-teal-soft);
  border-color: color-mix(in srgb, var(--rl-teal) 32%, transparent);
}
.rl-pill.is-rc {
  color: #8a6a18;
  background: var(--rl-yellow-soft);
  border-color: color-mix(in srgb, var(--rl-yellow) 50%, transparent);
}
.rl-pill.is-audio {
  color: var(--rl-teal-strong);
  background: var(--rl-teal-soft);
  border-color: color-mix(in srgb, var(--rl-teal) 32%, transparent);
}

/* Audiobook cover — same 2:3 frame, with a play affordance + duration. */
.rl-audio-cover {
  display: grid;
  place-items: center;
}
.rl-audio-play {
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  padding-left: 4px;
  font-size: 18px;
  color: #fff;
  background: color-mix(in srgb, var(--rl-teal-strong) 78%, transparent);
  border: 1.5px solid rgba(255, 255, 255, 0.85);
  border-radius: 999px;
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
  transition: transform 220ms var(--rl-ease), background 220ms var(--rl-ease);
}
.rl-poster:hover .rl-audio-play { transform: scale(1.08); background: var(--rl-teal-strong); }
.rl-audio-dur {
  position: absolute;
  right: 10px;
  bottom: 10px;
  padding: 4px 9px;
  font-size: 11px;
  font-weight: 700;
  color: #fff;
  background: rgba(12, 10, 8, 0.62);
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
  border-radius: 999px;
}

/* Illustration card — landscape art, not a book spine. */
.rl-illus-cover {
  position: relative;
  display: grid;
  place-items: center;
  aspect-ratio: 16 / 10;
  border-radius: 14px;
  border: 1px solid var(--rl-border);
  background-size: cover !important;
  background-position: center !important;
  box-shadow: 0 8px 22px -14px rgba(20, 18, 12, 0.5);
  transition: transform 220ms var(--rl-ease), box-shadow 220ms var(--rl-ease);
}
.rl-illus:hover .rl-illus-cover {
  transform: translateY(-4px);
  box-shadow: 0 18px 34px -16px rgba(20, 18, 12, 0.55);
}
.rl-illus-emoji {
  font-size: 40px;
  filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.25));
}

/* Empty state */
.rl-empty {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 48px 0;
  text-align: center;
  align-items: center;
}
.rl-empty-body { margin: 0; font-size: 15px; color: var(--rl-ink-muted); }

/* ── Responsive ────────────────────────────────────────── */
/* Step each grid down as width shrinks. Novels/classics 5→4→3→2;
   short stories 4→3→2; audiobooks 3→2; illustrations stay 2 until phones. */
@media (max-width: 1400px) {
  .rl-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
}
@media (max-width: 1040px) {
  .rl-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .rl-grid.is-4 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .rl-grid.is-3 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 900px) {
  .rl-shell, .rl-shell.is-railed { grid-template-columns: 1fr; }
  .rl-root .br-fsidebar {
    position: static;
    max-height: none;
  }
  .rl-root .br-fsidebar.is-open,
  .rl-root .br-fsidebar.is-open .br-fsidebar-inner { width: 100%; }
  .rl-featured { grid-template-columns: 1fr; }
  .rl-featured-cover { min-height: 220px; }
}
@media (max-width: 560px) {
  .rl-banner { flex-direction: column; align-items: stretch; }
  .rl-banner-cta { width: 100%; }
  .rl-grid,
  .rl-grid.is-4,
  .rl-grid.is-3,
  .rl-grid.is-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .rl-illus-emoji { font-size: 30px; }
}
`;
