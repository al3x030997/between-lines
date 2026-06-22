'use client';

import { useMemo, useState } from 'react';
import { getLaunchOriginals, getBooksBySection, type Book } from '@/lib/mock-books';

type Props = {
  onJoin: () => void;
};

const MIN_PICKS = 3;
const MAX_PICKS = 6;
const GRID_SIZE = 15;

// Curated picker pool: the launch originals (real cover art) first, then the
// public-domain classics (gradient covers). Dedupe by slug, cap the grid.
function useBookPool(): Book[] {
  return useMemo(() => {
    const pool = [...getLaunchOriginals(), ...getBooksBySection('classics')];
    const seen = new Set<string>();
    const deduped = pool.filter((book) => {
      if (seen.has(book.slug)) return false;
      seen.add(book.slug);
      return true;
    });
    return deduped.slice(0, GRID_SIZE);
  }, []);
}

export default function BookWall({ onJoin }: Props) {
  const books = useBookPool();
  const bySlug = useMemo(() => new Map(books.map((b) => [b.slug, b])), [books]);
  const [selected, setSelected] = useState<string[]>([]);
  const [bumped, setBumped] = useState(false);

  const count = selected.length;
  const ready = count >= MIN_PICKS;
  const atMax = count >= MAX_PICKS;

  const toggle = (slug: string) => {
    setSelected((prev) => {
      if (prev.includes(slug)) return prev.filter((s) => s !== slug);
      if (prev.length >= MAX_PICKS) {
        // Flash the "max reached" note instead of silently swallowing the tap.
        setBumped(true);
        window.setTimeout(() => setBumped(false), 900);
        return prev;
      }
      return [...prev, slug];
    });
  };

  // Wall slots: the chosen covers, then ghost frames — fill to the minimum of
  // 3 when under-picked, or a single trailing "add more" ghost until the cap.
  const ghostCount = count < MIN_PICKS ? MIN_PICKS - count : atMax ? 0 : 1;

  return (
    <section className="bl-bookwall" aria-labelledby="bl-bookwall-title">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <div className="bl-bookwall-inner">
        <header className="bl-bookwall-head">
          <p className="bl-bookwall-eyebrow">Start with what you love</p>
          <h2 className="bl-bookwall-title" id="bl-bookwall-title">
            Build your book wall
          </h2>
          <p className="bl-bookwall-sub">
            Tap the books that made you. We&rsquo;ll find your people, your shelves, and your
            next obsession from there.
          </p>
        </header>

        <div className="bl-bookwall-grid">
          {/* The picker — a shelf of covers you tap to select */}
          <div className="bl-bookwall-shelf">
            <ul className="bl-bookwall-covers" role="list">
              {books.map((book, index) => {
                const isSelected = selected.includes(book.slug);
                const order = selected.indexOf(book.slug) + 1;
                return (
                  <li key={book.slug} className="bl-bookwall-cell">
                    <button
                      type="button"
                      className={`bl-bookwall-cover${isSelected ? ' is-selected' : ''}`}
                      style={{ background: book.cover, animationDelay: `${index * 36}ms` }}
                      aria-pressed={isSelected}
                      aria-label={`${isSelected ? 'Remove' : 'Add'} ${book.title} by ${book.author}`}
                      onClick={() => toggle(book.slug)}
                    >
                      <span className="bl-bookwall-cover-scrim" aria-hidden="true" />
                      <span className="bl-bookwall-cover-meta">
                        <span className="bl-bookwall-cover-title">{book.title}</span>
                        <span className="bl-bookwall-cover-author">{book.author}</span>
                      </span>
                      <span className="bl-bookwall-check" aria-hidden="true">
                        {isSelected ? <span className="bl-bookwall-check-num">{order}</span> : '+'}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* The wall — the artifact you're building, and the sign-up gate */}
          <aside className="bl-bookwall-panel" aria-label="Your book wall">
            <div className="bl-bookwall-frame">
              <div className="bl-bookwall-frame-head">
                <span className="bl-bookwall-frame-kicker">Your wall</span>
                <p className={`bl-bookwall-counter${ready ? ' is-ready' : ''}`} aria-live="polite">
                  {ready ? (
                    <>
                      <strong>{count}</strong> {count === 1 ? 'book' : 'books'} on your wall
                    </>
                  ) : (
                    <>
                      <strong>{count}</strong>/{MIN_PICKS} chosen
                    </>
                  )}
                </p>
              </div>

              <div className="bl-bookwall-wall" role="list" aria-live="polite">
                {selected.map((slug) => {
                  const book = bySlug.get(slug);
                  if (!book) return null;
                  return (
                    <button
                      type="button"
                      role="listitem"
                      key={slug}
                      className="bl-bookwall-wall-cover"
                      style={{ background: book.cover }}
                      aria-label={`Remove ${book.title}`}
                      title={`${book.title} — tap to remove`}
                      onClick={() => toggle(slug)}
                    >
                      <span className="bl-bookwall-wall-remove" aria-hidden="true">
                        ×
                      </span>
                    </button>
                  );
                })}
                {Array.from({ length: ghostCount }).map((_, i) => (
                  <span
                    className={`bl-bookwall-ghost${count >= MIN_PICKS ? ' is-add' : ''}`}
                    key={`ghost-${i}`}
                    aria-hidden="true"
                  >
                    {count >= MIN_PICKS ? '+' : ''}
                  </span>
                ))}
              </div>

              <p className={`bl-bookwall-hint${bumped ? ' is-bumped' : ''}`} aria-live="polite">
                {atMax
                  ? 'Six is plenty to start — save it.'
                  : ready
                    ? 'Looking good. Add a few more, or save it now.'
                    : `Pick ${MIN_PICKS - count} more to unlock your wall.`}
              </p>
            </div>

            <button
              type="button"
              className="bl-bookwall-cta"
              disabled={!ready}
              onClick={onJoin}
            >
              <span>Save your wall — join free</span>
              <span className="bl-bookwall-cta-arrow" aria-hidden="true">
                →
              </span>
            </button>
            <p className="bl-bookwall-cta-note">
              No spam, no ads. Your wall becomes your reading home.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}

const STYLES = `
.bl-bookwall {
  --bw-ink: var(--theme-text);
  --bw-muted: var(--theme-text-muted);
  --bw-faint: var(--theme-text-faint);
  --bw-line: var(--theme-border-subtle);
  position: relative;
  padding: clamp(72px, 10vh, 116px) clamp(20px, 5vw, 80px);
  background:
    linear-gradient(180deg, var(--theme-page) 0%, var(--theme-page-soft) 60%, var(--theme-page) 100%);
  color: var(--bw-ink);
  font-family: var(--br-font-sans, var(--bl-font-body));
  overflow: hidden;
}
.bl-bookwall-inner {
  max-width: 1180px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: clamp(28px, 3.6vw, 44px);
}
.bl-bookwall-head {
  max-width: 720px;
  margin: 0 auto;
  text-align: center;
}
.bl-bookwall-eyebrow,
.bl-bookwall-frame-kicker {
  font-family: var(--bl-font-eyebrow);
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--bw-ink) 50%, transparent);
}
.bl-bookwall-title {
  margin: 8px 0 0;
  font-family: var(--br-font-display, var(--bl-font-serif));
  font-size: clamp(42px, 6vw, 70px);
  line-height: 0.96;
  font-weight: 900;
  letter-spacing: -0.03em;
}
.bl-bookwall-sub {
  max-width: 52ch;
  margin: 16px auto 0;
  color: var(--bw-muted);
  font-size: clamp(16px, 1.6vw, 19px);
  line-height: 1.58;
}
.bl-bookwall-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.42fr) minmax(310px, 0.78fr);
  gap: clamp(22px, 3.4vw, 44px);
  align-items: start;
}

/* === The picker shelf === */
.bl-bookwall-covers {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: clamp(10px, 1.4vw, 18px);
}
.bl-bookwall-cell {
  min-width: 0;
}
.bl-bookwall-cover {
  appearance: none;
  cursor: pointer;
  position: relative;
  display: block;
  width: 100%;
  aspect-ratio: 2 / 3;
  border: 0;
  padding: 0;
  border-radius: 6px;
  background-size: cover !important;
  background-position: center !important;
  overflow: hidden;
  box-shadow:
    0 1px 2px rgb(var(--theme-shadow-rgb) / 0.18),
    0 14px 28px -16px rgb(var(--theme-shadow-rgb) / 0.42);
  transform: translateY(0);
  opacity: 0;
  animation: bl-bookwall-rise 520ms var(--bl-ease, cubic-bezier(.22,1,.36,1)) both;
  transition:
    transform 220ms var(--bl-ease, cubic-bezier(.22,1,.36,1)),
    box-shadow 220ms var(--bl-ease, cubic-bezier(.22,1,.36,1)),
    outline-color 160ms ease;
  outline: 0 solid transparent;
}
@keyframes bl-bookwall-rise {
  from { opacity: 0; transform: translateY(14px) scale(0.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.bl-bookwall-cover:hover {
  transform: translateY(-5px) rotate(-0.6deg);
  box-shadow:
    0 2px 4px rgb(var(--theme-shadow-rgb) / 0.22),
    0 26px 44px -18px rgb(var(--theme-shadow-rgb) / 0.5);
}
.bl-bookwall-cover:focus-visible {
  outline: 3px solid var(--theme-accent-strong);
  outline-offset: 3px;
}
.bl-bookwall-cover.is-selected {
  outline: 3px solid var(--theme-accent-strong);
  outline-offset: 3px;
  transform: translateY(-3px);
  box-shadow:
    0 0 0 6px color-mix(in srgb, var(--theme-accent) 24%, transparent),
    0 24px 46px -18px rgb(var(--theme-shadow-rgb) / 0.5);
}
.bl-bookwall-cover-scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    transparent 40%,
    rgb(8 8 8 / 0.18) 64%,
    rgb(8 8 8 / 0.82) 100%
  );
  pointer-events: none;
}
.bl-bookwall-cover-meta {
  position: absolute;
  inset: auto 0 0 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 9px 10px 11px;
  text-align: left;
  color: #fff;
  pointer-events: none;
}
.bl-bookwall-cover-title {
  font-family: var(--br-font-serif, var(--bl-font-serif));
  font-size: 12.5px;
  font-weight: 700;
  line-height: 1.16;
  letter-spacing: -0.01em;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-shadow: 0 1px 6px rgb(0 0 0 / 0.5);
}
.bl-bookwall-cover-author {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: rgb(255 255 255 / 0.82);
  text-shadow: 0 1px 5px rgb(0 0 0 / 0.55);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.bl-bookwall-check {
  position: absolute;
  top: 7px;
  right: 7px;
  width: 24px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  background: color-mix(in srgb, var(--theme-page) 72%, transparent);
  color: var(--bw-ink);
  border: 1px solid rgb(255 255 255 / 0.4);
  font-size: 16px;
  font-weight: 800;
  line-height: 1;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  transform: scale(0.86);
  transition: transform 200ms var(--bl-ease, cubic-bezier(.22,1,.36,1)), background 200ms ease, color 200ms ease;
}
.bl-bookwall-cover:hover .bl-bookwall-check {
  transform: scale(1);
}
.bl-bookwall-cover.is-selected .bl-bookwall-check {
  background: var(--theme-accent-strong);
  color: var(--theme-strong-cta-fg, #fff);
  border-color: transparent;
  transform: scale(1);
}
.bl-bookwall-check-num {
  font-variant-numeric: tabular-nums;
  font-size: 13px;
}

/* === The wall panel (sticky artifact + gate) === */
.bl-bookwall-panel {
  position: sticky;
  top: 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.bl-bookwall-frame {
  position: relative;
  border: 1px solid var(--bw-line);
  border-radius: 10px;
  background:
    linear-gradient(180deg, var(--theme-surface) 0%, var(--theme-surface-subtle, var(--theme-surface)) 100%);
  padding: clamp(18px, 2.4vw, 26px);
  box-shadow: 0 22px 52px -26px rgb(var(--theme-shadow-rgb) / 0.4);
}
.bl-bookwall-frame::after {
  content: '';
  position: absolute;
  inset: 9px;
  border: 1px solid rgb(var(--theme-shadow-rgb) / 0.08);
  border-radius: 5px;
  pointer-events: none;
}
.bl-bookwall-frame-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  position: relative;
  z-index: 1;
}
.bl-bookwall-counter {
  margin: 0;
  font-size: 13px;
  font-weight: 700;
  color: var(--bw-muted);
  font-variant-numeric: tabular-nums;
}
.bl-bookwall-counter strong {
  font-size: 16px;
  color: var(--bw-ink);
}
.bl-bookwall-counter.is-ready {
  color: var(--theme-accent-strong);
}
.bl-bookwall-counter.is-ready strong {
  color: var(--theme-accent-strong);
}
.bl-bookwall-wall {
  position: relative;
  z-index: 1;
  margin: 16px 0 0;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  min-height: 116px;
}
.bl-bookwall-wall-cover {
  appearance: none;
  cursor: pointer;
  position: relative;
  width: clamp(52px, 8vw, 64px);
  aspect-ratio: 2 / 3;
  border: 0;
  padding: 0;
  border-radius: 4px;
  background-size: cover !important;
  background-position: center !important;
  box-shadow: 0 6px 16px -8px rgb(var(--theme-shadow-rgb) / 0.5);
  animation: bl-bookwall-pop 300ms var(--bl-ease, cubic-bezier(.22,1,.36,1)) both;
}
@keyframes bl-bookwall-pop {
  from { opacity: 0; transform: scale(0.7) translateY(6px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
.bl-bookwall-wall-remove {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  background: color-mix(in srgb, var(--theme-overlay, #000) 52%, transparent);
  color: #fff;
  font-size: 22px;
  font-weight: 700;
  opacity: 0;
  transition: opacity 160ms ease;
}
.bl-bookwall-wall-cover:hover .bl-bookwall-wall-remove,
.bl-bookwall-wall-cover:focus-visible .bl-bookwall-wall-remove {
  opacity: 1;
}
.bl-bookwall-ghost {
  width: clamp(52px, 8vw, 64px);
  aspect-ratio: 2 / 3;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  border: 1.5px dashed color-mix(in srgb, var(--bw-ink) 22%, transparent);
  background: color-mix(in srgb, var(--bw-ink) 3%, transparent);
  color: var(--bw-faint);
  font-size: 20px;
  font-weight: 700;
}
.bl-bookwall-ghost.is-add {
  border-color: color-mix(in srgb, var(--theme-accent) 50%, transparent);
  color: var(--theme-accent-strong);
}
.bl-bookwall-hint {
  position: relative;
  z-index: 1;
  margin: 14px 0 0;
  font-size: 13px;
  line-height: 1.45;
  color: var(--bw-muted);
}
.bl-bookwall-hint.is-bumped {
  color: var(--theme-accent-strong);
  font-weight: 700;
}
.bl-bookwall-cta {
  appearance: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  min-height: 54px;
  border: 0;
  border-radius: 999px;
  background: var(--theme-strong-cta-bg);
  color: var(--theme-strong-cta-fg);
  font-family: inherit;
  font-size: 15px;
  font-weight: 900;
  letter-spacing: 0.02em;
  box-shadow: 0 16px 30px -14px rgb(var(--theme-shadow-rgb) / 0.5);
  transition: transform 180ms var(--bl-ease, cubic-bezier(.22,1,.36,1)), background 180ms ease, box-shadow 180ms ease, opacity 180ms ease;
}
.bl-bookwall-cta:not(:disabled):hover {
  background: var(--theme-strong-cta-hover-bg);
  transform: translateY(-2px);
  box-shadow: 0 22px 40px -16px rgb(var(--theme-shadow-rgb) / 0.55);
}
.bl-bookwall-cta:disabled {
  cursor: not-allowed;
  opacity: 0.4;
  box-shadow: none;
}
.bl-bookwall-cta-arrow {
  transition: transform 180ms var(--bl-ease, cubic-bezier(.22,1,.36,1));
}
.bl-bookwall-cta:not(:disabled):hover .bl-bookwall-cta-arrow {
  transform: translateX(4px);
}
.bl-bookwall-cta-note {
  margin: 0;
  text-align: center;
  font-size: 12px;
  line-height: 1.4;
  color: var(--bw-faint);
}

@media (max-width: 980px) {
  .bl-bookwall-grid {
    grid-template-columns: 1fr;
  }
  .bl-bookwall-panel {
    position: static;
  }
}
@media (max-width: 760px) {
  .bl-bookwall {
    padding-inline: 16px;
  }
  .bl-bookwall-title {
    font-size: clamp(30px, 9vw, 40px);
    letter-spacing: -0.04em;
  }
  .bl-bookwall-covers {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
@media (max-width: 420px) {
  .bl-bookwall-covers {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (prefers-reduced-motion: reduce) {
  .bl-bookwall *,
  .bl-bookwall *::before,
  .bl-bookwall *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
`;
