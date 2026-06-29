'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { SiteNav } from '@/components/SiteNav';
import {
  FilterSidebar,
  type FilterState,
  type SidebarMvpSection,
  type SidebarShelfId,
} from '@/components/FilterSidebar';
import { getBooksBySection, getLaunchOriginals, type Book } from '@/lib/mock-books';

// The logged-out /read library. A standalone, ungated, light-themed gallery that
// mirrors the in-app MVP catalogue (featured BetweenLines pick + our first books +
// free classics) in the marketing hero brand. Every book CTA nudges a guest into
// the free sign-up — the real book pages live behind the session gate.
//
// The left sidebar is the *actual* in-app `FilterSidebar` in MVP mode — the same
// collapsible rail/panel readers see in the gated library — so the two surfaces
// stay in lockstep. Only positioning + accent theming are re-skinned, scoped under
// `.rl-root .br-fsidebar` (see CSS) so nothing leaks back into the reader app.
// Everything else here stays namespaced `.rl-*`.

const JOIN_HREF = '/start?mode=reader';

// Required-but-unused props for FilterSidebar's full (non-MVP) mode. In MVP mode
// the component never reads these, so empty/no-op values are safe.
const NO_FILTERS: FilterState = {};
const NO_SECTIONS: { id: string; label: string }[] = [];
const noop = () => {};

function matches(book: Book, q: string): boolean {
  if (!q) return true;
  return [book.title, book.author, book.blurb, ...book.tags]
    .join(' ')
    .toLowerCase()
    .includes(q);
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
  const [category, setCategory] = useState<SidebarMvpSection>('all');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const originals = useMemo(() => getLaunchOriginals(), []);
  const classics = useMemo(() => getBooksBySection('classics'), []);

  const q = query.trim().toLowerCase();
  const firstFiltered = originals.filter((b) => matches(b, q));
  const classicsFiltered = classics.filter((b) => matches(b, q));
  const featured = firstFiltered[0];
  const rowBooks = firstFiltered.slice(1);

  const showFirst = (category === 'all' || category === 'first') && firstFiltered.length > 0;
  const showClassics = (category === 'all' || category === 'classics') && classicsFiltered.length > 0;
  const empty = !showFirst && !showClassics;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <SiteNav />
      <div className="rl-root">
        <div className={`rl-shell ${sidebarOpen ? '' : 'is-railed'}`}>
          <FilterSidebar
            mvp
            open={sidebarOpen}
            onOpen={() => setSidebarOpen(true)}
            onClose={() => setSidebarOpen(false)}
            mvpSection={category}
            onMvpSectionChange={setCategory}
            query={query}
            onSearchChange={setQuery}
            /* Unused in MVP mode — the component never reads these here. */
            filters={NO_FILTERS}
            onToggle={noop}
            selectedShelf={'all' as SidebarShelfId}
            onShelfChange={noop}
            sections={NO_SECTIONS}
            activeSection="all"
            onSectionChange={noop}
            showFilters={false}
          />

          <main className="rl-main">
            <InviteBanner />

            {showFirst && (
              <section className="rl-section" aria-labelledby="rl-first">
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

                {rowBooks.length > 0 && (
                  <>
                    <header className="rl-section-head">
                      <p className="rl-kicker">Be among the first</p>
                      <h3 id="rl-first" className="rl-heading">Read our first books</h3>
                    </header>
                    <div className="rl-grid">
                      {rowBooks.map((book) => (
                        <Poster key={book.slug} book={book} />
                      ))}
                    </div>
                  </>
                )}
              </section>
            )}

            {showClassics && (
              <section className="rl-section" aria-labelledby="rl-classics">
                <header className="rl-section-head">
                  <p className="rl-kicker">Free forever · Public domain</p>
                  <h3 id="rl-classics" className="rl-heading">Timeless classics</h3>
                </header>
                <div className="rl-grid">
                  {classicsFiltered.map((book) => (
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
/* Step the 5-up cover grid down as width shrinks. */
@media (max-width: 1400px) { .rl-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
@media (max-width: 1040px) { .rl-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
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
  .rl-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
`;
