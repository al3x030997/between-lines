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
    setCue({ kind: chip.kind, label: cleanChipLabel(chip.label) });
    setCurrentIndex(nextIndex);
    setViewMode('carousel');
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
          <h2 className="bl-bchars-title" id="bl-bchars-title">BetweenCharacters</h2>
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

        <div className="bl-bchars-grid">
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

          <aside className="bl-bchars-board" aria-label="Mood and genre board">
            <div className="bl-bchars-board-head">
              <span className="bl-bchars-board-kicker">Quote finder</span>
              <h3>Pick a mood or genre</h3>
              <p>Each chip tunes the featured quote without leaving the homepage.</p>
            </div>

            <div className="bl-bchars-chip-group">
              <span className="bl-bchars-chip-label">Mood</span>
              <div className="bl-bchars-chip-row">
                {MOOD_CHIPS.map((chip) => (
                  <button
                    type="button"
                    className="bl-bchars-chip"
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
                    className="bl-bchars-chip"
                    key={chip.id}
                    onClick={() => applyChip(chip)}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="bl-bchars-response" aria-live="polite">
              <span>{cue.kind === 'mood' ? 'Mood match' : 'Genre match'}</span>
              <strong>{cue.label}</strong>
              <p>{currentQuote.author}{currentQuote.source ? `, ${currentQuote.source}` : ''}</p>
            </div>
          </aside>
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
  --bc-ink: var(--theme-text);
  --bc-muted: var(--theme-text-muted);
  --bc-faint: var(--theme-text-faint);
  --bc-line: var(--theme-border-subtle);
  position: relative;
  padding: clamp(72px, 10vh, 116px) clamp(20px, 5vw, 80px);
  background:
    linear-gradient(180deg, var(--theme-page) 0%, var(--theme-page-soft) 58%, var(--theme-page) 100%);
  color: var(--bc-ink);
  font-family: var(--br-font-sans, var(--bl-font-body));
  overflow: hidden;
}
.bl-bchars-inner {
  max-width: 1180px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: clamp(24px, 3.4vw, 38px);
}
.bl-bchars-head {
  max-width: 720px;
  margin: 0 auto;
  text-align: center;
}
.bl-bchars-eyebrow,
.bl-bchars-board-kicker,
.bl-bchars-form-kicker,
.bl-bchars-chip-label {
  font-family: var(--bl-font-eyebrow);
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--bc-ink) 50%, transparent);
}
.bl-bchars-title {
  margin: 8px 0 0;
  font-family: var(--br-font-display, var(--bl-font-serif));
  font-size: clamp(42px, 6vw, 70px);
  line-height: 0.96;
  font-weight: 900;
  letter-spacing: -0.03em;
}
.bl-bchars-sub {
  max-width: 52ch;
  margin: 16px auto 0;
  color: var(--bc-muted);
  font-size: clamp(16px, 1.6vw, 19px);
  line-height: 1.58;
}
.bl-bchars-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 10px;
  background: color-mix(in srgb, var(--theme-surface) 86%, transparent);
  border: 1px solid var(--bc-line);
  border-radius: 12px;
  box-shadow: 0 12px 32px rgb(var(--theme-shadow-rgb) / 0.06);
}
.bl-bchars-segment,
.bl-bchars-view {
  display: inline-flex;
  align-items: center;
  border: 1px solid var(--bc-line);
  border-radius: 9px;
  overflow: hidden;
  background: var(--theme-surface);
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
  padding: 10px 18px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  transition: background 180ms var(--bl-ease), color 180ms var(--bl-ease);
}
.bl-bchars-segment-btn + .bl-bchars-segment-btn,
.bl-bchars-icon-btn + .bl-bchars-icon-btn {
  border-left: 1px solid var(--bc-line);
}
.bl-bchars-segment-btn[aria-pressed='true'],
.bl-bchars-icon-btn[aria-pressed='true'] {
  background: var(--bc-ink);
  color: var(--theme-page);
}
.bl-bchars-segment-btn:hover:not([aria-pressed='true']),
.bl-bchars-icon-btn:hover:not([aria-pressed='true']) {
  background: var(--theme-surface-muted);
  color: var(--bc-ink);
}
.bl-bchars-toolbar-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}
.bl-bchars-icon-btn {
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  background: transparent;
  color: var(--bc-muted);
  transition: background 180ms var(--bl-ease), color 180ms var(--bl-ease);
}
.bl-bchars-add {
  min-height: 42px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 0;
  border-radius: 999px;
  background: var(--theme-strong-cta-bg);
  color: var(--theme-strong-cta-fg);
  padding: 0 18px;
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  transition: transform 180ms var(--bl-ease), background 180ms var(--bl-ease), box-shadow 180ms var(--bl-ease);
  box-shadow: 0 12px 24px rgb(var(--theme-shadow-rgb) / 0.14);
  white-space: nowrap;
}
.bl-bchars-add:hover,
.bl-bchars-add:focus-visible {
  background: var(--theme-strong-cta-hover-bg);
  transform: translateY(-1px);
}
.bl-bchars-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.14fr) minmax(320px, 0.86fr);
  gap: clamp(20px, 3.4vw, 40px);
  align-items: stretch;
}
.bl-bchars-stage,
.bl-bchars-board {
  min-width: 0;
}
.bl-bchars-carousel,
.bl-bchars-wall,
.bl-bchars-board {
  height: 100%;
}
.bl-bchars-feature {
  position: relative;
  min-height: 410px;
  border: 1px solid;
  border-radius: 8px;
  padding: clamp(24px, 4vw, 42px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 28px;
  overflow: hidden;
  box-shadow: 0 18px 46px rgb(var(--theme-shadow-rgb) / 0.11);
}
.bl-bchars-feature::after {
  content: '';
  position: absolute;
  inset: 14px;
  border: 1px solid rgb(var(--theme-shadow-rgb) / 0.07);
  pointer-events: none;
}
.bl-bchars-feature-mark {
  position: absolute;
  top: -26px;
  right: 22px;
  font-family: var(--bl-font-serif);
  font-size: clamp(150px, 18vw, 260px);
  line-height: 1;
  color: rgb(var(--theme-shadow-rgb) / 0.08);
  pointer-events: none;
}
.bl-bchars-feature-body,
.bl-bchars-attr {
  position: relative;
  z-index: 1;
}
.bl-bchars-pill,
.bl-bchars-note-pill {
  align-self: flex-start;
  display: inline-flex;
  border-radius: 999px;
  font-family: var(--bl-font-eyebrow);
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 0.16em;
  line-height: 1;
  text-transform: uppercase;
  padding: 7px 11px;
}
.bl-bchars-quote {
  margin: clamp(22px, 4vw, 40px) 0 0;
  max-width: 26ch;
  font-family: var(--br-font-display, var(--bl-font-serif));
  font-size: clamp(29px, 4vw, 48px);
  font-weight: 650;
  letter-spacing: -0.02em;
  line-height: 1.12;
  text-wrap: balance;
}
.bl-bchars-attr {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.bl-bchars-author {
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}
.bl-bchars-source {
  font-family: var(--br-font-serif, var(--bl-font-serif));
  font-size: 15px;
  font-style: italic;
  color: var(--bc-muted);
}
.bl-bchars-carousel-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  min-height: 48px;
  margin-top: 16px;
}
.bl-bchars-nav-btn {
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--theme-border);
  border-radius: 8px;
  color: var(--bc-ink);
  background: var(--theme-surface);
  transition: transform 160ms var(--bl-ease), background 160ms var(--bl-ease), border-color 160ms var(--bl-ease);
}
.bl-bchars-nav-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  background: var(--theme-surface-muted);
  border-color: var(--theme-border-strong);
}
.bl-bchars-nav-btn:disabled {
  cursor: not-allowed;
  opacity: 0.36;
}
.bl-bchars-count {
  min-width: 82px;
  text-align: center;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.18em;
  color: var(--bc-faint);
  font-variant-numeric: tabular-nums;
}
.bl-bchars-wall-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}
.bl-bchars-note {
  min-height: 190px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  justify-content: space-between;
  border: 1px solid;
  border-radius: 8px;
  padding: 18px;
}
.bl-bchars-note p {
  margin: 0;
  font-family: var(--br-font-serif, var(--bl-font-serif));
  font-size: 17px;
  line-height: 1.48;
  color: var(--bc-ink);
}
.bl-bchars-note footer {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.bl-bchars-note footer span {
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.bl-bchars-note footer em {
  font-family: var(--br-font-serif, var(--bl-font-serif));
  font-size: 12px;
  color: var(--bc-muted);
}
.bl-bchars-board {
  border: 1px solid var(--bc-line);
  border-radius: 8px;
  background: var(--theme-surface);
  padding: clamp(22px, 3vw, 30px);
  display: flex;
  flex-direction: column;
  gap: 24px;
  box-shadow: 0 18px 46px rgb(var(--theme-shadow-rgb) / 0.08);
}
.bl-bchars-board-head h3 {
  margin: 8px 0 0;
  font-family: var(--br-font-display, var(--bl-font-serif));
  font-size: clamp(27px, 3vw, 38px);
  line-height: 1.02;
  letter-spacing: -0.02em;
}
.bl-bchars-board-head p {
  margin: 10px 0 0;
  color: var(--bc-muted);
  font-size: 15px;
  line-height: 1.5;
}
.bl-bchars-chip-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.bl-bchars-chip-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.bl-bchars-chip {
  border: 1px solid var(--theme-border);
  border-radius: 999px;
  background: var(--theme-surface);
  color: var(--bc-ink);
  padding: 8px 13px;
  font-size: 12px;
  font-weight: 760;
  line-height: 1;
  transition: transform 160ms var(--bl-ease), background 160ms var(--bl-ease), border-color 160ms var(--bl-ease);
}
.bl-bchars-chip:hover,
.bl-bchars-chip:focus-visible {
  background: var(--theme-accent-soft);
  border-color: var(--theme-accent);
  transform: translateY(-1px);
}
.bl-bchars-response {
  margin-top: auto;
  border-top: 1px solid var(--bc-line);
  padding-top: 20px;
}
.bl-bchars-response span {
  display: block;
  font-size: 10px;
  font-weight: 900;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--bc-faint);
}
.bl-bchars-response strong {
  display: block;
  margin-top: 6px;
  font-family: var(--br-font-display, var(--bl-font-serif));
  font-size: 25px;
  line-height: 1.1;
}
.bl-bchars-response p {
  margin: 7px 0 0;
  color: var(--bc-muted);
  font-size: 14px;
  line-height: 1.42;
}
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
  background: color-mix(in srgb, var(--theme-overlay) 58%, transparent);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}
.bl-bchars-modal {
  position: relative;
  z-index: 1;
  width: min(94vw, 620px);
  max-height: min(92vh, 760px);
  overflow-y: auto;
  background: var(--theme-page);
  border: 1px solid var(--theme-border);
  border-radius: 14px;
  box-shadow: 0 28px 90px -24px rgb(var(--theme-shadow-rgb) / 0.48);
}
.bl-bchars-modal-close {
  position: absolute;
  top: 13px;
  right: 13px;
  z-index: 2;
  width: 34px;
  height: 34px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: var(--bc-muted);
  font-size: 13px;
  font-weight: 900;
}
.bl-bchars-modal-close:hover {
  background: var(--theme-surface-muted);
  color: var(--bc-ink);
}
.bl-bchars-form {
  padding: clamp(24px, 4vw, 38px);
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.bl-bchars-form header h3 {
  margin: 8px 0 0;
  font-family: var(--br-font-display, var(--bl-font-serif));
  font-size: clamp(32px, 4vw, 44px);
  line-height: 1;
  letter-spacing: -0.02em;
}
.bl-bchars-form header p:not(.bl-bchars-form-kicker) {
  margin: 10px 0 0;
  color: var(--bc-muted);
  font-size: 15px;
  line-height: 1.5;
}
.bl-bchars-field {
  display: flex;
  flex-direction: column;
  gap: 7px;
}
.bl-bchars-field span,
.bl-bchars-check {
  font-size: 12px;
  font-weight: 850;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--bc-muted);
}
.bl-bchars-field textarea,
.bl-bchars-field input {
  width: 100%;
  border: 1px solid var(--theme-border);
  border-radius: 8px;
  background: var(--theme-surface-subtle);
  color: var(--bc-ink);
  font: inherit;
  font-size: 16px;
  line-height: 1.45;
  padding: 12px 14px;
}
.bl-bchars-field textarea {
  resize: vertical;
  min-height: 128px;
  font-family: var(--br-font-serif, var(--bl-font-serif));
}
.bl-bchars-field textarea:focus,
.bl-bchars-field input:focus {
  border-color: var(--theme-accent-strong);
  outline: 2px solid color-mix(in srgb, var(--theme-accent) 35%, transparent);
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
  accent-color: var(--bc-ink);
}
.bl-bchars-form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 4px;
}
.bl-bchars-form-secondary,
.bl-bchars-form-submit {
  border-radius: 999px;
  min-height: 42px;
  padding: 0 18px;
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.bl-bchars-form-secondary {
  border: 1px solid var(--theme-border);
  background: var(--theme-surface);
  color: var(--bc-ink);
}
.bl-bchars-form-submit {
  border: 0;
  background: var(--theme-strong-cta-bg);
  color: var(--theme-strong-cta-fg);
}
.bl-bchars-form-secondary:hover {
  background: var(--theme-surface-muted);
}
.bl-bchars-form-submit:hover {
  background: var(--theme-strong-cta-hover-bg);
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
  .bl-bchars-grid {
    grid-template-columns: 1fr;
  }
  .bl-bchars-board {
    min-height: auto;
  }
}
@media (max-width: 760px) {
  .bl-bchars {
    padding-inline: 16px;
  }
  .bl-bchars-title {
    font-size: clamp(30px, 9vw, 40px);
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
    min-height: 360px;
    padding: 24px;
  }
  .bl-bchars-feature::after {
    inset: 10px;
  }
  .bl-bchars-quote {
    font-size: clamp(25px, 8vw, 34px);
  }
  .bl-bchars-wall-grid,
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
