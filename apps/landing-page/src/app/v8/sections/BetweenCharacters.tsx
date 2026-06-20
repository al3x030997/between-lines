'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  IconChevronLeft,
  IconChevronRight,
  IconGrid,
  IconPlayCircle,
  IconPlus,
} from '@/components/read/sidebar-icons';
import {
  CARD_PALETTE,
  MOOD_LABELS,
  MOOD_ORDER,
  MOOD_TO_QUOTE,
  PILL_BG,
  QUOTES,
  type Quote,
} from './opencall/quotes';

type Props = {
  onAddQuote: () => void;
};

type Audience = 'all' | 'young';
type ViewMode = 'carousel' | 'wall';
type ChipKind = 'mood' | 'genre';

type ResponseChip = {
  id: string;
  kind: ChipKind;
  label: string;
  targetText: string;
  youngTargetText?: string;
  fallbackCategory?: Quote['category'];
};

const WALL_SIZE = 6;

const CURATED_EXTRA_QUOTES: Quote[] = [
  {
    text: 'No tears in the writer, no tears in the reader.',
    author: 'Robert Frost',
    category: 'write',
    pill: 'On writing',
    young: false,
  },
  {
    text: 'The reading of all good books is like a conversation with the finest minds of past centuries.',
    author: 'Rene Descartes',
    source: 'Discourse on the Method',
    category: 'read',
    pill: 'On reading',
    young: false,
  },
  {
    text: 'Tell me a story, and in the telling, we shall both live a little longer.',
    author: 'Scheherazade',
    source: 'One Thousand and One Nights',
    category: 'read',
    pill: 'On reading',
    young: false,
  },
  {
    text: "Fantasy is hardly an escape from reality. It's a way of understanding it.",
    author: 'Lloyd Alexander',
    category: 'read',
    pill: 'On reading',
    young: true,
  },
  {
    text: 'A story is a letter the author writes to the world.',
    author: 'Cornelia Funke',
    source: 'Inkheart',
    category: 'write',
    pill: 'On writing',
    young: true,
  },
  {
    text: 'Some people care too much. I think it is called love.',
    author: 'Winnie the Pooh',
    source: 'A.A. Milne',
    category: 'character',
    pill: 'Character',
    young: true,
  },
  {
    text: 'The simplest idea can open a whole universe.',
    author: 'Isaac Asimov',
    category: 'write',
    pill: 'On writing',
    young: false,
  },
  {
    text: 'The oldest and strongest emotion of mankind is fear, and the oldest and strongest kind of fear is fear of the unknown.',
    author: 'H.P. Lovecraft',
    source: 'Supernatural Horror in Literature',
    category: 'read',
    pill: 'On reading',
    young: false,
  },
  {
    text: 'It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.',
    author: 'Jane Austen',
    source: 'Pride and Prejudice',
    category: 'character',
    pill: 'Character',
    young: false,
  },
  {
    text: 'A book is proof that humans can work magic.',
    author: 'Carl Sagan',
    source: 'Cosmos',
    category: 'read',
    pill: 'On reading',
    young: true,
  },
];

const QUOTE_POOL: Quote[] = [...QUOTES, ...CURATED_EXTRA_QUOTES].filter((quote, index, all) => {
  const key = `${quote.author}::${quote.text}`;
  return all.findIndex((candidate) => `${candidate.author}::${candidate.text}` === key) === index;
});

const MOOD_CHIPS: ResponseChip[] = MOOD_ORDER.map((mood) => {
  const target = QUOTES[MOOD_TO_QUOTE[mood]] ?? QUOTES[0];
  return {
    id: mood,
    kind: 'mood',
    label: MOOD_LABELS[mood],
    targetText: target.text,
    fallbackCategory: target.category,
  };
});

const GENRE_CHIPS: ResponseChip[] = [
  {
    id: 'romance',
    kind: 'genre',
    label: 'Romance',
    targetText: 'We write to taste life twice, in the moment and in retrospect.',
    youngTargetText: 'Some people care too much. I think it is called love.',
    fallbackCategory: 'character',
  },
  {
    id: 'fantasy',
    kind: 'genre',
    label: 'Fantasy',
    targetText: "Fantasy is hardly an escape from reality. It's a way of understanding it.",
    fallbackCategory: 'read',
  },
  {
    id: 'thriller',
    kind: 'genre',
    label: 'Thriller',
    targetText: 'There is nothing more deceptive than an obvious fact.',
    youngTargetText: 'Curiouser and curiouser!',
    fallbackCategory: 'character',
  },
  {
    id: 'mystery',
    kind: 'genre',
    label: 'Mystery',
    targetText: 'There is nothing more deceptive than an obvious fact.',
    youngTargetText: 'Curiouser and curiouser!',
    fallbackCategory: 'character',
  },
  {
    id: 'sci-fi',
    kind: 'genre',
    label: 'Sci-fi',
    targetText: 'The simplest idea can open a whole universe.',
    youngTargetText: 'A book is proof that humans can work magic.',
    fallbackCategory: 'write',
  },
  {
    id: 'horror',
    kind: 'genre',
    label: 'Horror',
    targetText: 'The oldest and strongest emotion of mankind is fear, and the oldest and strongest kind of fear is fear of the unknown.',
    youngTargetText: 'Stories are light. Light is precious in a world so dark.',
    fallbackCategory: 'read',
  },
  {
    id: 'literary',
    kind: 'genre',
    label: 'Literary Fiction',
    targetText: 'I write only because there is a voice within me that will not be still.',
    youngTargetText: 'I am not afraid of storms, for I am learning how to sail my ship.',
    fallbackCategory: 'write',
  },
  {
    id: 'historical',
    kind: 'genre',
    label: 'Historical Fiction',
    targetText: 'The reading of all good books is like a conversation with the finest minds of past centuries.',
    youngTargetText: 'The more that you read, the more things you will know. The more that you learn, the more places you’ll go.',
    fallbackCategory: 'read',
  },
  {
    id: 'young-adult',
    kind: 'genre',
    label: 'Young Adult',
    targetText: 'Stories are light. Light is precious in a world so dark.',
    fallbackCategory: 'read',
  },
  {
    id: 'classic',
    kind: 'genre',
    label: 'Classic',
    targetText: 'It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.',
    youngTargetText: 'I am not afraid of storms, for I am learning how to sail my ship.',
    fallbackCategory: 'character',
  },
  {
    id: 'any',
    kind: 'genre',
    label: 'Any',
    targetText: 'A reader lives a thousand lives before he dies. The man who never reads lives only one.',
    youngTargetText: 'The more that you read, the more things you will know. The more that you learn, the more places you’ll go.',
    fallbackCategory: 'read',
  },
  {
    id: 'surprise',
    kind: 'genre',
    label: 'Surprise me',
    targetText: 'If there’s a book you want to read but it hasn’t been written yet, then you must write it.',
    youngTargetText: 'Not all those who wander are lost.',
    fallbackCategory: 'both',
  },
];

const DEFAULT_CUE = {
  kind: 'mood' as ChipKind,
  label: MOOD_CHIPS[0]?.label ?? 'Feel-good',
};

function modulo(value: number, length: number) {
  return ((value % length) + length) % length;
}

function quoteKey(quote: Quote) {
  return `${quote.author}::${quote.text}`;
}

function cleanChipLabel(label: string) {
  return label.replace(/^[^\w]+/u, '').trim();
}

function findQuoteIndex(quotes: Quote[], chip: ResponseChip, audience: Audience) {
  const targetText = audience === 'young' && chip.youngTargetText ? chip.youngTargetText : chip.targetText;
  const exact = quotes.findIndex((quote) => quote.text === targetText);
  if (exact >= 0) return exact;

  if (chip.fallbackCategory) {
    const categoryMatch = quotes.findIndex((quote) => quote.category === chip.fallbackCategory);
    if (categoryMatch >= 0) return categoryMatch;
  }

  return 0;
}

function paletteFor(index: number) {
  return CARD_PALETTE[index % CARD_PALETTE.length] ?? CARD_PALETTE[0];
}

export default function BetweenCharacters({ onAddQuote }: Props) {
  const [audience, setAudience] = useState<Audience>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('carousel');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [wallPage, setWallPage] = useState(0);
  const [cue, setCue] = useState(DEFAULT_CUE);
  const [chipQuote, setChipQuote] = useState<Quote | null>(null);
  const [quoteDialogOpen, setQuoteDialogOpen] = useState(false);
  const [draft, setDraft] = useState({
    text: '',
    author: '',
    work: '',
    young: false,
  });
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const activeQuotes = useMemo(
    () => (audience === 'young' ? QUOTE_POOL.filter((quote) => quote.young) : QUOTE_POOL),
    [audience],
  );

  const currentQuote = activeQuotes[currentIndex] ?? activeQuotes[0] ?? QUOTE_POOL[0];
  const currentPalette = paletteFor(currentIndex);
  const currentPill = PILL_BG[currentQuote.category];
  const wallPageCount = Math.max(1, Math.ceil(activeQuotes.length / WALL_SIZE));
  const wallQuotes = activeQuotes.slice(wallPage * WALL_SIZE, wallPage * WALL_SIZE + WALL_SIZE);

  useEffect(() => {
    setCurrentIndex(0);
    setWallPage(0);
  }, [audience]);

  useEffect(() => {
    if (currentIndex >= activeQuotes.length) setCurrentIndex(0);
  }, [activeQuotes.length, currentIndex]);

  useEffect(() => {
    if (wallPage >= wallPageCount) setWallPage(0);
  }, [wallPage, wallPageCount]);

  useEffect(() => {
    if (!quoteDialogOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setQuoteDialogOpen(false);
    };

    document.addEventListener('keydown', onKeyDown);
    window.setTimeout(() => dialogRef.current?.focus(), 0);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
      previouslyFocused?.focus?.();
    };
  }, [quoteDialogOpen]);

  const goToQuote = (delta: number) => {
    if (activeQuotes.length === 0) return;
    setCurrentIndex((index) => modulo(index + delta, activeQuotes.length));
  };

  const applyChip = (chip: ResponseChip) => {
    const nextIndex = findQuoteIndex(activeQuotes, chip, audience);
    const matched = activeQuotes[nextIndex] ?? activeQuotes[0];
    setCue({ kind: chip.kind, label: cleanChipLabel(chip.label) });
    setChipQuote(matched);
  };

  const openQuoteDialog = () => {
    setQuoteDialogOpen(true);
    setQuoteError(null);
  };

  const closeQuoteDialog = () => {
    setQuoteDialogOpen(false);
    setQuoteError(null);
  };

  const submitQuote = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft.text.trim()) {
      setQuoteError('Add the quote text before continuing.');
      return;
    }

    setQuoteDialogOpen(false);
    setQuoteError(null);
    setDraft({ text: '', author: '', work: '', young: false });
    onAddQuote();
  };

  return (
    <section className="bl-bchars" aria-labelledby="bl-bchars-title">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <div className="bl-bchars-inner">
        <header className="bl-bchars-head">
          <p className="bl-bchars-eyebrow">Between Reads</p>
          <h2 className="bl-bchars-title" id="bl-bchars-title">Find your next read.</h2>
          <p className="bl-bchars-sub">
            Words, lines, and characters that stayed with readers long after the book closed.
          </p>
        </header>

        <div className="bl-bchars-toolbar">
          <div className="bl-bchars-segment" role="group" aria-label="Filter quotes by audience">
            <button
              type="button"
              className="bl-bchars-segment-btn"
              aria-pressed={audience === 'all'}
              onClick={() => setAudience('all')}
            >
              All Quotes
            </button>
            <button
              type="button"
              className="bl-bchars-segment-btn"
              aria-pressed={audience === 'young'}
              onClick={() => setAudience('young')}
            >
              Young Readers
            </button>
          </div>

          <div className="bl-bchars-toolbar-actions">
            <div className="bl-bchars-view" role="group" aria-label="Choose quote view">
              <button
                type="button"
                className="bl-bchars-icon-btn"
                aria-pressed={viewMode === 'carousel'}
                onClick={() => setViewMode('carousel')}
                title="Carousel"
              >
                <IconPlayCircle size={17} />
                <span className="bl-bchars-sr">Carousel</span>
              </button>
              <button
                type="button"
                className="bl-bchars-icon-btn"
                aria-pressed={viewMode === 'wall'}
                onClick={() => setViewMode('wall')}
                title="Wall"
              >
                <IconGrid size={17} />
                <span className="bl-bchars-sr">Wall</span>
              </button>
            </div>

            <button type="button" className="bl-bchars-add" onClick={openQuoteDialog}>
              <IconPlus size={17} />
              <span>Add a quote</span>
            </button>
          </div>
        </div>

        <div className="bl-bchars-stage">
            {viewMode === 'carousel' ? (
              <div className="bl-bchars-carousel">
                <article
                  className="bl-bchars-feature"
                  aria-live="polite"
                  style={{
                    background: currentPalette.bg,
                    borderColor: currentPalette.border,
                  }}
                >
                  <span className="bl-bchars-feature-mark" aria-hidden="true">&ldquo;</span>
                  <div className="bl-bchars-feature-body">
                    <span
                      className="bl-bchars-pill"
                      style={{ background: currentPill.bg, color: currentPill.color }}
                    >
                      {currentQuote.pill}
                    </span>
                    <p className="bl-bchars-quote">&ldquo;{currentQuote.text}&rdquo;</p>
                  </div>
                  <footer className="bl-bchars-attr">
                    <span className="bl-bchars-author">{currentQuote.author}</span>
                    {currentQuote.source && <span className="bl-bchars-source">{currentQuote.source}</span>}
                  </footer>
                </article>

                <div className="bl-bchars-carousel-nav" aria-label="Carousel controls">
                  <button
                    type="button"
                    className="bl-bchars-nav-btn"
                    onClick={() => goToQuote(-1)}
                    aria-label="Previous quote"
                  >
                    <IconChevronLeft size={18} />
                  </button>
                  <span className="bl-bchars-count">
                    {String(currentIndex + 1).padStart(2, '0')} / {String(activeQuotes.length).padStart(2, '0')}
                  </span>
                  <button
                    type="button"
                    className="bl-bchars-nav-btn"
                    onClick={() => goToQuote(1)}
                    aria-label="Next quote"
                  >
                    <IconChevronRight size={18} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="bl-bchars-wall" aria-live="polite">
                <div className="bl-bchars-wall-grid">
                  {wallQuotes.map((quote, index) => {
                    const absoluteIndex = wallPage * WALL_SIZE + index;
                    const palette = paletteFor(absoluteIndex);
                    const pill = PILL_BG[quote.category];
                    return (
                      <article
                        className="bl-bchars-note"
                        key={quoteKey(quote)}
                        style={{ background: palette.bg, borderColor: palette.border }}
                      >
                        <span
                          className="bl-bchars-note-pill"
                          style={{ background: pill.bg, color: pill.color }}
                        >
                          {quote.pill}
                        </span>
                        <p>&ldquo;{quote.text}&rdquo;</p>
                        <footer>
                          <span>{quote.author}</span>
                          {quote.source && <em>{quote.source}</em>}
                        </footer>
                      </article>
                    );
                  })}
                </div>

                <div className="bl-bchars-carousel-nav" aria-label="Wall controls">
                  <button
                    type="button"
                    className="bl-bchars-nav-btn"
                    onClick={() => setWallPage((page) => Math.max(0, page - 1))}
                    disabled={wallPage === 0}
                    aria-label="Previous wall page"
                  >
                    <IconChevronLeft size={18} />
                  </button>
                  <span className="bl-bchars-count">
                    {String(wallPage + 1).padStart(2, '0')} / {String(wallPageCount).padStart(2, '0')}
                  </span>
                  <button
                    type="button"
                    className="bl-bchars-nav-btn"
                    onClick={() => setWallPage((page) => Math.min(wallPageCount - 1, page + 1))}
                    disabled={wallPage >= wallPageCount - 1}
                    aria-label="Next wall page"
                  >
                    <IconChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
        </div>

        <div className="bl-bchars-board" aria-label="Mood and genre board">
          <div className="bl-bchars-board-head">
            <span className="bl-bchars-board-kicker">What do you want to read?</span>
          </div>

          <div className="bl-bchars-chip-groups">
            <div className="bl-bchars-chip-group">
              <span className="bl-bchars-chip-label">Mood</span>
              <div className="bl-bchars-chip-row">
                {MOOD_CHIPS.map((chip) => (
                  <button
                    type="button"
                    className={`bl-bchars-chip${chipQuote && cue.label === cleanChipLabel(chip.label) ? ' bl-bchars-chip--active' : ''}`}
                    key={chip.id}
                    onClick={() => applyChip(chip)}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="bl-bchars-chip-group">
              <span className="bl-bchars-chip-label">Genre</span>
              <div className="bl-bchars-chip-row">
                {GENRE_CHIPS.map((chip) => (
                  <button
                    type="button"
                    className={`bl-bchars-chip${chipQuote && cue.label === cleanChipLabel(chip.label) ? ' bl-bchars-chip--active' : ''}`}
                    key={chip.id}
                    onClick={() => applyChip(chip)}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {chipQuote && (
            <div className="bl-bchars-response" aria-live="polite">
              <p className="bl-bchars-response-quote">&ldquo;{chipQuote.text}&rdquo;</p>
              <span className="bl-bchars-response-attr">
                {chipQuote.author}{chipQuote.source ? ` · ${chipQuote.source}` : ''}
              </span>
            </div>
          )}
        </div>
      </div>

      {quoteDialogOpen && (
        <div className="bl-bchars-modal-root">
          <div className="bl-bchars-modal-backdrop" aria-hidden="true" onClick={closeQuoteDialog} />
          <div
            className="bl-bchars-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="bl-bchars-modal-title"
            ref={dialogRef}
            tabIndex={-1}
          >
            <button
              type="button"
              className="bl-bchars-modal-close"
              onClick={closeQuoteDialog}
              aria-label="Close quote form"
            >
              X
            </button>
            <form className="bl-bchars-form" onSubmit={submitQuote} noValidate>
              <header>
                <p className="bl-bchars-form-kicker">BetweenCharacters</p>
                <h3 id="bl-bchars-modal-title">Add a quote</h3>
                <p>Share the line first. The next step opens the reader intake.</p>
              </header>

              <label className="bl-bchars-field">
                <span>Quote text</span>
                <textarea
                  value={draft.text}
                  onChange={(event) => {
                    const value = event.currentTarget.value;
                    setDraft((next) => ({ ...next, text: value }));
                    if (quoteError) setQuoteError(null);
                  }}
                  aria-invalid={quoteError ? 'true' : 'false'}
                  aria-describedby={quoteError ? 'bl-bchars-quote-error' : undefined}
                  rows={5}
                  placeholder="Paste the words that stayed with you."
                />
              </label>

              {quoteError && (
                <p className="bl-bchars-error" id="bl-bchars-quote-error">
                  {quoteError}
                </p>
              )}

              <div className="bl-bchars-form-row">
                <label className="bl-bchars-field">
                  <span>Author or character</span>
                  <input
                    type="text"
                    value={draft.author}
                    onChange={(event) => {
                      const value = event.currentTarget.value;
                      setDraft((next) => ({ ...next, author: value }));
                    }}
                    placeholder="Author or character"
                  />
                </label>
                <label className="bl-bchars-field">
                  <span>Book or work</span>
                  <input
                    type="text"
                    value={draft.work}
                    onChange={(event) => {
                      const value = event.currentTarget.value;
                      setDraft((next) => ({ ...next, work: value }));
                    }}
                    placeholder="Book or work"
                  />
                </label>
              </div>

              <label className="bl-bchars-check">
                <input
                  type="checkbox"
                  checked={draft.young}
                  onChange={(event) => {
                    const checked = event.currentTarget.checked;
                    setDraft((next) => ({ ...next, young: checked }));
                  }}
                />
                <span>Include this quote in Young Readers</span>
              </label>

              <div className="bl-bchars-form-actions">
                <button type="button" className="bl-bchars-form-secondary" onClick={closeQuoteDialog}>
                  Cancel
                </button>
                <button type="submit" className="bl-bchars-form-submit">
                  Continue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

const STYLES = `
.bl-bchars {
  --bc-ink: #1a1714;
  --bc-muted: #6b6358;
  --bc-faint: #948b7c;
  --bc-line: rgba(14, 14, 12, 0.10);
  --bc-line-mid: rgba(14, 14, 12, 0.18);
  --bc-accent: #0e0e0c;
  --bc-accent-dim: rgba(14, 14, 12, 0.06);
  --bc-on-accent: #f3d84a;
  position: relative;
  padding: clamp(72px, 10vh, 120px) clamp(24px, 5.5vw, 88px);
  background: var(--theme-page, #FFF9F0);
  color: var(--bc-ink);
  font-family: var(--br-font-sans, var(--bl-font-body));
  overflow: hidden;
  isolation: isolate;
}
.bl-bchars-inner {
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: clamp(32px, 4.5vw, 52px);
}

/* Header: editorial two-column split */
.bl-bchars-head {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  grid-template-rows: auto auto;
  align-items: end;
  column-gap: clamp(24px, 4vw, 60px);
  max-width: none;
  margin: 0;
  text-align: left;
  padding-bottom: 36px;
  border-bottom: 1px solid var(--bc-line);
  position: relative;
}
.bl-bchars-head::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 64px;
  height: 3px;
  background: var(--bc-accent);
}
.bl-bchars-eyebrow {
  grid-column: 1 / -1;
  grid-row: 1;
  margin-bottom: 14px;
  font-family: var(--bl-font-eyebrow);
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--bc-accent);
}
.bl-bchars-title {
  grid-column: 1;
  grid-row: 2;
  margin: 0;
  font-family: var(--br-font-display, var(--bl-font-serif));
  font-size: clamp(44px, 6.5vw, 84px);
  line-height: 0.9;
  font-weight: 900;
  letter-spacing: -0.04em;
  color: var(--bc-ink);
}
.bl-bchars-sub {
  grid-column: 2;
  grid-row: 2;
  max-width: none;
  margin: 0;
  padding-bottom: 6px;
  color: var(--bc-muted);
  font-size: clamp(15px, 1.5vw, 17px);
  line-height: 1.66;
}

/* Toolbar: bare / frameless */
.bl-bchars-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 0;
  background: transparent;
  border: 0;
  border-radius: 0;
  box-shadow: none;
}
.bl-bchars-segment,
.bl-bchars-view {
  display: inline-flex;
  align-items: center;
  border: 1px solid var(--bc-line-mid);
  border-radius: 3px;
  overflow: hidden;
  background: var(--theme-surface, #fff);
}
.bl-bchars-segment-btn,
.bl-bchars-icon-btn,
.bl-bchars-add,
.bl-bchars-nav-btn,
.bl-bchars-chip,
.bl-bchars-form-secondary,
.bl-bchars-form-submit,
.bl-bchars-modal-close {
  appearance: none;
  font: inherit;
  cursor: pointer;
}
.bl-bchars-segment-btn {
  border: 0;
  background: transparent;
  color: var(--bc-muted);
  padding: 9px 18px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  transition: background 160ms, color 160ms;
}
.bl-bchars-segment-btn + .bl-bchars-segment-btn,
.bl-bchars-icon-btn + .bl-bchars-icon-btn {
  border-left: 1px solid var(--bc-line-mid);
}
.bl-bchars-segment-btn[aria-pressed='true'],
.bl-bchars-icon-btn[aria-pressed='true'] {
  background: var(--bc-ink);
  color: var(--theme-page, #FFF9F0);
}
.bl-bchars-segment-btn:hover:not([aria-pressed='true']),
.bl-bchars-icon-btn:hover:not([aria-pressed='true']) {
  background: rgba(14, 14, 12, 0.06);
  color: var(--bc-ink);
}
.bl-bchars-toolbar-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}
.bl-bchars-icon-btn {
  width: 38px;
  height: 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  background: transparent;
  color: var(--bc-muted);
  transition: background 160ms, color 160ms;
}
.bl-bchars-add {
  min-height: 38px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  border: 0;
  border-radius: 2px;
  background: var(--bc-accent);
  color: var(--bc-on-accent);
  padding: 0 20px;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  transition: transform 140ms, background 140ms, box-shadow 140ms;
  white-space: nowrap;
}
.bl-bchars-add:hover,
.bl-bchars-add:focus-visible {
  background: #ffe948;
  transform: translateY(-1px);
  box-shadow: 0 6px 22px rgba(243, 216, 74, 0.3);
}

.bl-bchars-stage {
  min-width: 0;
}
.bl-bchars-carousel,
.bl-bchars-wall {
  max-width: 760px;
  margin: 0 auto;
}

/* Feature card: pastel card floats in the dark */
.bl-bchars-feature {
  position: relative;
  min-height: 450px;
  border: 1px solid;
  border-radius: 3px;
  padding: clamp(28px, 4.5vw, 48px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 32px;
  overflow: hidden;
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.14), 0 24px 60px rgba(0, 0, 0, 0.42);
  transition: box-shadow 220ms, transform 220ms;
}
.bl-bchars-feature:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 10px rgba(0, 0, 0, 0.16), 0 32px 72px rgba(0, 0, 0, 0.52);
}
.bl-bchars-feature::after {
  display: none;
}
.bl-bchars-feature-mark {
  position: absolute;
  top: -32px;
  right: 16px;
  font-family: var(--bl-font-serif);
  font-size: clamp(180px, 22vw, 300px);
  line-height: 1;
  color: rgba(0, 0, 0, 0.07);
  pointer-events: none;
  user-select: none;
}
.bl-bchars-feature-body,
.bl-bchars-attr {
  position: relative;
  z-index: 1;
}

/* Pills: sharp-cornered tags */
.bl-bchars-pill,
.bl-bchars-note-pill {
  align-self: flex-start;
  display: inline-flex;
  border-radius: 2px;
  font-family: var(--bl-font-eyebrow);
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 0.2em;
  line-height: 1;
  text-transform: uppercase;
  padding: 6px 10px;
}
.bl-bchars-quote {
  margin: clamp(20px, 3.5vw, 36px) 0 0;
  max-width: 24ch;
  font-family: var(--br-font-display, var(--bl-font-serif));
  font-size: clamp(30px, 4.2vw, 52px);
  font-weight: 700;
  letter-spacing: -0.025em;
  line-height: 1.1;
  text-wrap: balance;
  color: #161410;
}
.bl-bchars-attr {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.bl-bchars-author {
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(22, 20, 16, 0.8);
}
.bl-bchars-source {
  font-family: var(--br-font-serif, var(--bl-font-serif));
  font-size: 14px;
  font-style: italic;
  color: rgba(22, 20, 16, 0.52);
}

/* Navigation */
.bl-bchars-carousel-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  min-height: 52px;
  margin-top: 20px;
}
.bl-bchars-nav-btn {
  width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--bc-line-mid);
  border-radius: 50%;
  color: var(--bc-ink);
  background: var(--theme-surface, #fff);
  transition: transform 150ms, background 150ms, border-color 150ms;
}
.bl-bchars-nav-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  background: var(--theme-surface-muted, #f5f3ef);
  border-color: rgba(14, 14, 12, 0.32);
}
.bl-bchars-nav-btn:disabled {
  cursor: not-allowed;
  opacity: 0.28;
}
.bl-bchars-count {
  min-width: 80px;
  text-align: center;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.24em;
  color: var(--bc-faint);
  font-variant-numeric: tabular-nums;
}

/* Wall grid: cards hover up */
.bl-bchars-wall-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}
.bl-bchars-note {
  min-height: 180px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  justify-content: space-between;
  border: 1px solid;
  border-radius: 3px;
  padding: 18px;
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.28);
  transition: transform 200ms, box-shadow 200ms;
}
.bl-bchars-note:hover {
  transform: translateY(-3px);
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.42);
}
.bl-bchars-note p {
  margin: 0;
  font-family: var(--br-font-serif, var(--bl-font-serif));
  font-size: 15px;
  line-height: 1.52;
  color: #161410;
}
.bl-bchars-note footer {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.bl-bchars-note footer span {
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(22, 20, 16, 0.72);
}
.bl-bchars-note footer em {
  font-family: var(--br-font-serif, var(--bl-font-serif));
  font-size: 12px;
  color: rgba(22, 20, 16, 0.48);
}

/* Mood board: full-width below carousel */
.bl-bchars-board {
  border-top: 1px solid var(--bc-line);
  padding-top: clamp(28px, 4vw, 44px);
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.bl-bchars-board-head {
  max-width: 760px;
  margin: 0 auto;
  width: 100%;
}
.bl-bchars-board-kicker {
  font-family: var(--bl-font-eyebrow);
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--bc-accent);
}
.bl-bchars-chip-groups {
  max-width: 760px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.bl-bchars-chip-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.bl-bchars-chip-label {
  font-family: var(--bl-font-eyebrow);
  font-size: 9px;
  font-weight: 900;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--bc-faint);
}
.bl-bchars-chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}
.bl-bchars-chip {
  border: 1px solid var(--bc-line-mid);
  border-radius: 20px;
  background: var(--theme-surface, #fff);
  color: var(--bc-muted);
  padding: 7px 14px;
  font-size: 12px;
  font-weight: 600;
  line-height: 1;
  transition: transform 140ms, background 140ms, border-color 140ms, color 140ms;
  white-space: nowrap;
}
.bl-bchars-chip:hover,
.bl-bchars-chip:focus-visible {
  background: var(--theme-surface-muted, #f5f3ef);
  border-color: rgba(14, 14, 12, 0.3);
  color: var(--bc-ink);
  transform: translateY(-1px);
}
.bl-bchars-chip--active {
  background: var(--bc-ink) !important;
  border-color: var(--bc-ink) !important;
  color: var(--theme-page, #FFF9F0) !important;
  transform: none !important;
}
.bl-bchars-response {
  max-width: 760px;
  margin: 0 auto;
  width: 100%;
  padding-top: 20px;
  border-top: 1px solid var(--bc-line);
}
.bl-bchars-response-quote {
  margin: 0;
  font-family: var(--br-font-serif, var(--bl-font-serif));
  font-size: clamp(17px, 2vw, 22px);
  font-style: italic;
  line-height: 1.62;
  color: var(--bc-ink);
}
.bl-bchars-response-attr {
  display: block;
  margin-top: 12px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--bc-muted);
}

/* Modal: cream panel over dark */
.bl-bchars-modal-root {
  position: fixed;
  inset: 0;
  z-index: 950;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(14px, 4vw, 32px);
}
.bl-bchars-modal-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(14, 14, 12, 0.56);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
.bl-bchars-modal {
  position: relative;
  z-index: 1;
  width: min(94vw, 600px);
  max-height: min(92vh, 740px);
  overflow-y: auto;
  background: #FFF9F0;
  border: 1px solid rgba(14, 14, 12, 0.16);
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.18), 0 32px 100px rgba(0, 0, 0, 0.62);
}
.bl-bchars-modal-close {
  position: absolute;
  top: 14px;
  right: 14px;
  z-index: 2;
  width: 32px;
  height: 32px;
  border: 0;
  border-radius: 3px;
  background: transparent;
  color: #948b7c;
  font-size: 12px;
  font-weight: 900;
}
.bl-bchars-modal-close:hover {
  background: #f5f0e8;
  color: #1a1714;
}
.bl-bchars-form {
  padding: clamp(24px, 4vw, 36px);
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.bl-bchars-form-kicker {
  font-family: var(--bl-font-eyebrow);
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: #948b7c;
}
.bl-bchars-form header h3 {
  margin: 8px 0 0;
  font-family: var(--br-font-display, var(--bl-font-serif));
  font-size: clamp(30px, 4vw, 42px);
  line-height: 1;
  letter-spacing: -0.025em;
  color: #1a1714;
}
.bl-bchars-form header p:not(.bl-bchars-form-kicker) {
  margin: 10px 0 0;
  color: #6b6358;
  font-size: 15px;
  line-height: 1.5;
}
.bl-bchars-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.bl-bchars-field span,
.bl-bchars-check {
  font-size: 11px;
  font-weight: 850;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #6b6358;
}
.bl-bchars-field textarea,
.bl-bchars-field input {
  width: 100%;
  border: 1px solid rgba(14, 14, 12, 0.18);
  border-radius: 3px;
  background: #f8f4ec;
  color: #1a1714;
  font: inherit;
  font-size: 16px;
  line-height: 1.45;
  padding: 12px 14px;
}
.bl-bchars-field textarea {
  resize: vertical;
  min-height: 120px;
  font-family: var(--br-font-serif, var(--bl-font-serif));
}
.bl-bchars-field textarea:focus,
.bl-bchars-field input:focus {
  border-color: #d4aa18;
  outline: 2px solid rgba(243, 216, 74, 0.28);
  outline-offset: 1px;
}
.bl-bchars-error {
  margin: -8px 0 0;
  color: #a3291f;
  font-size: 13px;
  line-height: 1.4;
}
.bl-bchars-form-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}
.bl-bchars-check {
  display: flex;
  align-items: center;
  gap: 9px;
  cursor: pointer;
}
.bl-bchars-check input {
  width: 16px;
  height: 16px;
  accent-color: #d4aa18;
}
.bl-bchars-form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 4px;
}
.bl-bchars-form-secondary,
.bl-bchars-form-submit {
  border-radius: 2px;
  min-height: 40px;
  padding: 0 20px;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}
.bl-bchars-form-secondary {
  border: 1px solid rgba(14, 14, 12, 0.18);
  background: transparent;
  color: #1a1714;
}
.bl-bchars-form-submit {
  border: 0;
  background: #0e0e0c;
  color: #f3d84a;
}
.bl-bchars-form-secondary:hover {
  background: #f0ece3;
}
.bl-bchars-form-submit:hover {
  background: #000;
}
.bl-bchars-sr {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

@media (max-width: 980px) {
  .bl-bchars-head {
    grid-template-columns: 1fr;
  }
  .bl-bchars-sub {
    grid-column: 1;
    grid-row: 3;
    margin-top: 16px;
    padding-bottom: 0;
  }
}
@media (max-width: 760px) {
  .bl-bchars {
    padding-inline: 20px;
  }
  .bl-bchars-title {
    font-size: clamp(36px, 11vw, 52px);
    letter-spacing: -0.04em;
  }
  .bl-bchars-toolbar {
    flex-direction: column;
    align-items: stretch;
  }
  .bl-bchars-segment,
  .bl-bchars-toolbar-actions,
  .bl-bchars-add {
    width: 100%;
  }
  .bl-bchars-segment-btn {
    flex: 1 1 0;
    padding-inline: 10px;
  }
  .bl-bchars-toolbar-actions {
    justify-content: space-between;
  }
  .bl-bchars-view {
    flex: 0 0 auto;
  }
  .bl-bchars-add {
    flex: 1 1 auto;
  }
  .bl-bchars-feature {
    min-height: 340px;
    padding: 24px;
  }
  .bl-bchars-quote {
    font-size: clamp(26px, 8vw, 36px);
  }
  .bl-bchars-wall-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .bl-bchars-form-row {
    grid-template-columns: 1fr;
  }
  .bl-bchars-note {
    min-height: 0;
  }
  .bl-bchars-form-actions {
    flex-direction: column-reverse;
  }
  .bl-bchars-form-secondary,
  .bl-bchars-form-submit {
    width: 100%;
  }
}
@media (prefers-reduced-motion: reduce) {
  .bl-bchars *,
  .bl-bchars *::before,
  .bl-bchars *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
`;
