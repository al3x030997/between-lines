'use client';

import Link from 'next/link';
import { type FormEvent, useMemo, useRef, useState } from 'react';
import { SiteNav } from '@/components/SiteNav';

export type WriteReviewBook = {
  slug: string;
  title: string;
  author: string;
  category: string;
  cover: string;
  coverIsDark?: boolean;
  tags: string[];
  blurb: string;
  format: string;
  wordsLabel: string;
  estRead: string;
  readerPicks?: number;
};

type BookMode = 'catalog' | 'manual';
type ShelfStatus = 'read' | 'currently-reading' | 'want-to-read' | 'dnf';
type Visibility = 'public' | 'followers' | 'private';

type SavedReview = {
  title: string;
  author: string;
  bookSlug?: string;
  cover?: string;
  rating: number;
  shelf: ShelfStatus;
  visibility: Visibility;
  excerpt: string;
};

const shelfOptions: { value: ShelfStatus; label: string; note: string }[] = [
  { value: 'read', label: 'Read', note: 'Finished and ready to review' },
  { value: 'currently-reading', label: 'Currently reading', note: 'Keep a live note' },
  { value: 'want-to-read', label: 'Want to read', note: 'Save the intent first' },
  { value: 'dnf', label: 'Did not finish', note: 'Still leave a fair note' },
];

const visibilityOptions: { value: Visibility; label: string }[] = [
  { value: 'public', label: 'Public' },
  { value: 'followers', label: 'Followers' },
  { value: 'private', label: 'Private' },
];

function shelfLabel(value: ShelfStatus) {
  return shelfOptions.find((option) => option.value === value)?.label ?? 'Read';
}

function visibilityLabel(value: Visibility) {
  return visibilityOptions.find((option) => option.value === value)?.label ?? 'Public';
}

function excerptFrom(text: string) {
  const cleaned = text.trim().replace(/\s+/g, ' ');
  if (cleaned.length <= 180) return cleaned;
  return `${cleaned.slice(0, 177)}...`;
}

function StarRating({
  rating,
  onRate,
}: {
  rating: number;
  onRate: (rating: number) => void;
}) {
  const [preview, setPreview] = useState<number | null>(null);
  const shown = preview ?? rating;

  return (
    <div className="wr-stars" aria-label={rating ? `${rating} out of 5 stars` : 'No rating yet'}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`wr-star${star <= shown ? ' is-filled' : ''}`}
          onClick={() => onRate(star)}
          onFocus={() => setPreview(star)}
          onMouseEnter={() => setPreview(star)}
          onBlur={() => setPreview(null)}
          onMouseLeave={() => setPreview(null)}
          aria-label={`Rate ${star} out of 5`}
          aria-pressed={rating === star}
        >
          ★
        </button>
      ))}
    </div>
  );
}

type Props = {
  books: WriteReviewBook[];
  initialBookSlug?: string;
};

export default function WriteReviewClient({ books, initialBookSlug }: Props) {
  const initialBook = books.find((book) => book.slug === initialBookSlug) ?? books[0];
  const [bookMode, setBookMode] = useState<BookMode>('catalog');
  const [selectedSlug, setSelectedSlug] = useState(initialBook?.slug ?? '');
  const [bookSearch, setBookSearch] = useState('');
  const [manualTitle, setManualTitle] = useState('');
  const [manualAuthor, setManualAuthor] = useState('');
  const [rating, setRating] = useState(0);
  const [shelf, setShelf] = useState<ShelfStatus>('read');
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewBody, setReviewBody] = useState('');
  const [startedAt, setStartedAt] = useState('');
  const [finishedAt, setFinishedAt] = useState('');
  const [tags, setTags] = useState(initialBook?.tags.slice(0, 2).join(', ') ?? '');
  const [spoiler, setSpoiler] = useState(false);
  const [visibility, setVisibility] = useState<Visibility>('public');
  const [showErrors, setShowErrors] = useState(false);
  const [draftMessage, setDraftMessage] = useState('');
  const [savedReview, setSavedReview] = useState<SavedReview | null>(null);
  const savedRef = useRef<HTMLDivElement>(null);

  const selectedBook = books.find((book) => book.slug === selectedSlug);

  const filteredBooks = useMemo(() => {
    const query = bookSearch.trim().toLowerCase();
    const source = query
      ? books.filter((book) =>
          `${book.title} ${book.author} ${book.category} ${book.tags.join(' ')}`
            .toLowerCase()
            .includes(query),
        )
      : books;
    return source.slice(0, 7);
  }, [books, bookSearch]);

  const activeTitle = bookMode === 'catalog' ? selectedBook?.title ?? '' : manualTitle.trim();
  const activeAuthor = bookMode === 'catalog' ? selectedBook?.author ?? '' : manualAuthor.trim();
  const missingBook = bookMode === 'catalog' ? !selectedBook : !activeTitle || !activeAuthor;
  const missingRating = rating < 1;
  const missingBody = reviewBody.trim().length < 20;
  const reviewWordCount = reviewBody.trim() ? reviewBody.trim().split(/\s+/).length : 0;

  const chooseBook = (book: WriteReviewBook) => {
    setSelectedSlug(book.slug);
    setBookMode('catalog');
    setBookSearch('');
    setSavedReview(null);
    if (!tags.trim()) setTags(book.tags.slice(0, 2).join(', '));
  };

  const submitReview = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (missingBook || missingRating || missingBody) {
      setShowErrors(true);
      setDraftMessage('');
      return;
    }

    setShowErrors(false);
    setDraftMessage('');
    setSavedReview({
      title: activeTitle,
      author: activeAuthor,
      bookSlug: bookMode === 'catalog' ? selectedBook?.slug : undefined,
      cover: bookMode === 'catalog' ? selectedBook?.cover : undefined,
      rating,
      shelf,
      visibility,
      excerpt: excerptFrom(reviewBody),
    });

    window.requestAnimationFrame(() => {
      savedRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const saveDraft = () => {
    setDraftMessage('Draft saved locally for this preview session.');
    setSavedReview(null);
  };

  return (
    <main className="wr-page">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <SiteNav activeHref="/reviews" />

      <section className="wr-hero" aria-labelledby="wr-title">
        <div className="wr-hero-copy">
          <Link href="/reviews" className="wr-back">
            Back to reviews
          </Link>
          <p className="wr-kicker">Reader review</p>
          <h1 id="wr-title">Log the book while the ending is still close.</h1>
          <p>
            Rate it, shelve it, and leave the kind of note another reader would actually use. This
            preview saves nothing to a backend yet.
          </p>
        </div>
        <div className="wr-ledger" aria-hidden="true">
          <span>rating</span>
          <strong>{rating || '-'}/5</strong>
          <span>shelf</span>
          <strong>{shelfLabel(shelf)}</strong>
        </div>
      </section>

      {savedReview ? (
        <section className="wr-saved" ref={savedRef} role="status" aria-live="polite">
          <div
            className="wr-saved-cover"
            style={savedReview.cover ? { background: savedReview.cover } : undefined}
            aria-hidden="true"
          />
          <div>
            <p className="wr-kicker">Review saved</p>
            <h2>
              {savedReview.rating}/5 for <em>{savedReview.title}</em>
            </h2>
            <p>
              Shelved as <strong>{shelfLabel(savedReview.shelf)}</strong> and visible to{' '}
              <strong>{visibilityLabel(savedReview.visibility).toLowerCase()}</strong>. Mock
              confirmation only; no review has been published.
            </p>
            <blockquote>{savedReview.excerpt}</blockquote>
            <div className="wr-saved-actions">
              {savedReview.bookSlug ? (
                <Link href={`/read/${savedReview.bookSlug}`}>Return to book</Link>
              ) : null}
              <button type="button" onClick={() => setSavedReview(null)}>
                Edit review
              </button>
            </div>
          </div>
        </section>
      ) : null}

      <section className="wr-workspace" aria-label="Write a review form">
        <aside className="wr-book-slip" aria-label="Selected book">
          <div
            className={`wr-cover${selectedBook?.coverIsDark ? ' is-dark' : ''}`}
            style={selectedBook ? { background: selectedBook.cover } : undefined}
          >
            {!selectedBook ? <span>Any book</span> : null}
          </div>
          <div className="wr-slip-copy">
            <p className="wr-kicker">On your shelf</p>
            <h2>{bookMode === 'catalog' ? selectedBook?.title ?? 'Choose a book' : manualTitle || 'Any book'}</h2>
            <p className="wr-author">
              {bookMode === 'catalog' ? selectedBook?.author ?? 'BetweenReads library' : manualAuthor || 'Author name'}
            </p>
            {bookMode === 'catalog' && selectedBook ? (
              <>
                <p className="wr-blurb">{selectedBook.blurb}</p>
                <dl className="wr-book-facts">
                  <div>
                    <dt>Format</dt>
                    <dd>{selectedBook.format}</dd>
                  </div>
                  <div>
                    <dt>Length</dt>
                    <dd>{selectedBook.wordsLabel} words</dd>
                  </div>
                  <div>
                    <dt>Read time</dt>
                    <dd>{selectedBook.estRead}</dd>
                  </div>
                  <div>
                    <dt>Picks</dt>
                    <dd>{selectedBook.readerPicks ?? 'New'}</dd>
                  </div>
                </dl>
              </>
            ) : (
              <p className="wr-blurb">
                Use manual mode for a book outside the mock catalogue. The preview will still let
                you rate, shelve, and save a sample confirmation.
              </p>
            )}
          </div>
        </aside>

        <form className="wr-form" onSubmit={submitReview} noValidate>
          <section className="wr-form-section">
            <div className="wr-section-head">
              <p className="wr-kicker">Book</p>
              <h2>Choose what you read</h2>
            </div>
            <div className="wr-mode-tabs" role="tablist" aria-label="Book source">
              <button
                type="button"
                role="tab"
                aria-selected={bookMode === 'catalog'}
                className={bookMode === 'catalog' ? 'is-active' : ''}
                onClick={() => setBookMode('catalog')}
              >
                BetweenReads book
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={bookMode === 'manual'}
                className={bookMode === 'manual' ? 'is-active' : ''}
                onClick={() => setBookMode('manual')}
              >
                Any other book
              </button>
            </div>

            {bookMode === 'catalog' ? (
              <div className="wr-picker">
                <label htmlFor="wr-book-search">Search the mock library</label>
                <input
                  id="wr-book-search"
                  className="wr-input"
                  value={bookSearch}
                  onChange={(event) => setBookSearch(event.target.value)}
                  placeholder="Search by title, author, or shelf"
                />
                <div className="wr-results" aria-label="Book results">
                  {filteredBooks.map((book) => (
                    <button
                      type="button"
                      key={book.slug}
                      className={book.slug === selectedSlug ? 'is-selected' : ''}
                      onClick={() => chooseBook(book)}
                    >
                      <span>
                        <strong>{book.title}</strong>
                        <small>{book.author}</small>
                      </span>
                      <em>{book.category}</em>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="wr-grid-two">
                <label>
                  Book title
                  <input
                    className="wr-input"
                    value={manualTitle}
                    onChange={(event) => setManualTitle(event.target.value)}
                    placeholder="The book you finished"
                  />
                </label>
                <label>
                  Author
                  <input
                    className="wr-input"
                    value={manualAuthor}
                    onChange={(event) => setManualAuthor(event.target.value)}
                    placeholder="Who wrote it"
                  />
                </label>
              </div>
            )}

            {showErrors && missingBook ? (
              <p className="wr-error" role="alert">
                Choose a book, or enter a title and author.
              </p>
            ) : null}
          </section>

          <section className="wr-form-section">
            <div className="wr-section-head">
              <p className="wr-kicker">Rating</p>
              <h2>How did it land?</h2>
            </div>
            <StarRating rating={rating} onRate={setRating} />
            <p className="wr-rating-note">
              {rating ? `${rating} star${rating === 1 ? '' : 's'} selected.` : 'Tap a star to rate this book.'}
            </p>
            {showErrors && missingRating ? (
              <p className="wr-error" role="alert">
                Add a star rating before saving.
              </p>
            ) : null}
          </section>

          <section className="wr-form-section">
            <div className="wr-section-head">
              <p className="wr-kicker">Shelf</p>
              <h2>Place it where it belongs</h2>
            </div>
            <div className="wr-shelf-grid">
              {shelfOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={shelf === option.value ? 'is-active' : ''}
                  onClick={() => setShelf(option.value)}
                >
                  <strong>{option.label}</strong>
                  <span>{option.note}</span>
                </button>
              ))}
            </div>
            <div className="wr-grid-two">
              <label>
                Started
                <input
                  className="wr-input"
                  type="date"
                  value={startedAt}
                  onChange={(event) => setStartedAt(event.target.value)}
                />
              </label>
              <label>
                Finished
                <input
                  className="wr-input"
                  type="date"
                  value={finishedAt}
                  onChange={(event) => setFinishedAt(event.target.value)}
                />
              </label>
            </div>
          </section>

          <section className="wr-form-section">
            <div className="wr-section-head">
              <p className="wr-kicker">Review</p>
              <h2>Write the useful part</h2>
            </div>
            <label>
              Review title
              <input
                className="wr-input"
                value={reviewTitle}
                onChange={(event) => setReviewTitle(event.target.value)}
                placeholder="A short headline for your take"
              />
            </label>
            <label>
              Your review
              <textarea
                className="wr-input wr-textarea"
                value={reviewBody}
                onChange={(event) => setReviewBody(event.target.value)}
                placeholder="What worked, what did not, and who should read it next?"
              />
            </label>
            <div className="wr-review-tools">
              <span>{reviewWordCount} words</span>
              <label className="wr-check">
                <input
                  type="checkbox"
                  checked={spoiler}
                  onChange={(event) => setSpoiler(event.target.checked)}
                />
                Contains spoilers
              </label>
            </div>
            {showErrors && missingBody ? (
              <p className="wr-error" role="alert">
                Write at least 20 characters so the review is useful.
              </p>
            ) : null}
          </section>

          <section className="wr-form-section">
            <div className="wr-section-head">
              <p className="wr-kicker">Shelves</p>
              <h2>Add context</h2>
            </div>
            <div className="wr-grid-two">
              <label>
                Tags or shelves
                <input
                  className="wr-input"
                  value={tags}
                  onChange={(event) => setTags(event.target.value)}
                  placeholder="slow burn, book club, reread"
                />
              </label>
              <label>
                Visibility
                <select
                  className="wr-input"
                  value={visibility}
                  onChange={(event) => setVisibility(event.target.value as Visibility)}
                >
                  {visibilityOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </section>

          <div className="wr-submit-row">
            <div>
              <strong>Mock save only</strong>
              <span>No backend, no publication, no payment.</span>
            </div>
            <div className="wr-submit-actions">
              <button type="button" className="wr-secondary" onClick={saveDraft}>
                Save draft
              </button>
              <button type="submit" className="wr-primary">
                Save review
              </button>
            </div>
          </div>
          {draftMessage ? (
            <p className="wr-draft" role="status">
              {draftMessage}
            </p>
          ) : null}
        </form>
      </section>
    </main>
  );
}

const CSS = `
.wr-page {
  --wr-paper: #f2f5ed;
  --wr-paper-rule: rgba(47, 94, 67, 0.08);
  --wr-card: #fffefa;
  --wr-ink: #1d251f;
  --wr-muted: #667268;
  --wr-faint: #879186;
  --wr-line: #d6ddd1;
  --wr-green: #2f5e43;
  --wr-green-dark: #193827;
  --wr-gold: #b77b22;
  --wr-blue: #355b73;
  --wr-red: #9e4236;
  min-height: 100vh;
  color: var(--wr-ink);
  background:
    linear-gradient(180deg, transparent 31px, var(--wr-paper-rule) 32px),
    var(--wr-paper);
  background-size: 100% 32px;
  font-family: var(--br-font-sans), -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.wr-page :where(a, button, input, textarea, select):focus-visible {
  outline: 2px solid var(--wr-blue);
  outline-offset: 3px;
}

.wr-hero {
  max-width: 1180px;
  margin: 0 auto;
  padding: clamp(42px, 7vw, 88px) clamp(20px, 5vw, 44px) clamp(28px, 4vw, 48px);
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(190px, 250px);
  gap: clamp(24px, 5vw, 72px);
  align-items: end;
}

.wr-hero-copy {
  max-width: 760px;
}

.wr-back {
  display: inline-flex;
  margin-bottom: 22px;
  color: var(--wr-green);
  font-size: 14px;
  font-weight: 800;
  text-decoration: none;
  border-bottom: 1px solid currentColor;
}

.wr-kicker {
  margin: 0 0 10px;
  color: var(--wr-green);
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0;
  text-transform: uppercase;
}

.wr-hero h1 {
  margin: 0;
  max-width: 12ch;
  font-family: var(--br-font-display), Georgia, serif;
  font-size: clamp(42px, 8vw, 86px);
  line-height: 0.98;
  font-weight: 900;
  letter-spacing: 0;
}

.wr-hero p:not(.wr-kicker) {
  max-width: 58ch;
  margin: 22px 0 0;
  color: var(--wr-muted);
  font-family: var(--br-font-serif), Georgia, serif;
  font-size: clamp(17px, 2vw, 21px);
  line-height: 1.55;
}

.wr-ledger {
  justify-self: end;
  width: min(100%, 250px);
  background: var(--wr-green-dark);
  color: #f6f7ef;
  border-radius: 8px;
  padding: 22px;
  box-shadow: 12px 12px 0 rgba(47, 94, 67, 0.14);
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
}

.wr-ledger span {
  color: rgba(246, 247, 239, 0.64);
  font-size: 11px;
  font-weight: 900;
  text-transform: uppercase;
}

.wr-ledger strong {
  margin-bottom: 8px;
  font-family: var(--br-font-display), Georgia, serif;
  font-size: 28px;
  line-height: 1;
}

.wr-saved,
.wr-workspace {
  max-width: 1180px;
  margin: 0 auto;
  padding: 0 clamp(20px, 5vw, 44px);
}

.wr-saved {
  display: grid;
  grid-template-columns: 96px minmax(0, 1fr);
  gap: 22px;
  align-items: start;
  margin-bottom: 28px;
  padding-top: 26px;
  padding-bottom: 26px;
  background: color-mix(in srgb, var(--wr-green) 10%, var(--wr-card));
  border: 1px solid color-mix(in srgb, var(--wr-green) 28%, var(--wr-line));
  border-radius: 8px;
}

.wr-saved-cover {
  width: 96px;
  aspect-ratio: 2 / 3;
  border-radius: 6px;
  background:
    linear-gradient(150deg, #dce4d5 0%, #9cae9a 52%, #335b47 100%);
  box-shadow: 0 12px 24px rgba(29, 37, 31, 0.18);
}

.wr-saved h2 {
  margin: 0;
  font-family: var(--br-font-display), Georgia, serif;
  font-size: clamp(27px, 4vw, 42px);
  line-height: 1.08;
}

.wr-saved h2 em {
  color: var(--wr-green);
  font-style: normal;
}

.wr-saved p {
  max-width: 72ch;
  margin: 12px 0 0;
  color: var(--wr-muted);
  line-height: 1.55;
}

.wr-saved blockquote {
  margin: 16px 0 0;
  padding-left: 18px;
  border-left: 4px solid var(--wr-green);
  color: var(--wr-ink);
  font-family: var(--br-font-serif), Georgia, serif;
  font-size: 18px;
  line-height: 1.55;
}

.wr-saved-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 18px;
}

.wr-saved-actions a,
.wr-saved-actions button {
  border: 1px solid var(--wr-green);
  border-radius: 999px;
  background: var(--wr-card);
  color: var(--wr-green-dark);
  padding: 10px 16px;
  font: inherit;
  font-weight: 800;
  text-decoration: none;
  cursor: pointer;
}

.wr-workspace {
  display: grid;
  grid-template-columns: minmax(260px, 340px) minmax(0, 1fr);
  gap: clamp(24px, 4vw, 44px);
  align-items: start;
  padding-bottom: clamp(70px, 10vw, 128px);
}

.wr-book-slip {
  position: sticky;
  top: 118px;
  background: var(--wr-card);
  border: 1px solid var(--wr-line);
  border-radius: 8px;
  padding: 18px;
  box-shadow: 0 18px 36px rgba(29, 37, 31, 0.08);
}

.wr-cover {
  display: grid;
  place-items: center;
  width: 100%;
  aspect-ratio: 2 / 3;
  border-radius: 6px;
  background:
    linear-gradient(150deg, #dce4d5 0%, #9cae9a 52%, #335b47 100%);
  color: #f6f7ef;
  font-family: var(--br-font-display), Georgia, serif;
  font-size: 28px;
  font-weight: 900;
  box-shadow: inset 0 0 0 1px rgba(29, 37, 31, 0.18);
}

.wr-cover.is-dark {
  box-shadow:
    inset 0 0 0 1px rgba(246, 247, 239, 0.16),
    0 14px 28px rgba(29, 37, 31, 0.16);
}

.wr-slip-copy {
  padding-top: 18px;
}

.wr-slip-copy h2 {
  margin: 0;
  font-family: var(--br-font-display), Georgia, serif;
  font-size: 30px;
  line-height: 1.06;
}

.wr-author {
  margin: 8px 0 0;
  color: var(--wr-green);
  font-weight: 800;
}

.wr-blurb {
  margin: 16px 0 0;
  color: var(--wr-muted);
  font-family: var(--br-font-serif), Georgia, serif;
  line-height: 1.55;
}

.wr-book-facts {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin: 18px 0 0;
}

.wr-book-facts div {
  border-top: 1px solid var(--wr-line);
  padding-top: 10px;
}

.wr-book-facts dt {
  color: var(--wr-faint);
  font-size: 11px;
  font-weight: 900;
  text-transform: uppercase;
}

.wr-book-facts dd {
  margin: 3px 0 0;
  color: var(--wr-ink);
  font-size: 14px;
  font-weight: 800;
}

.wr-form {
  background: var(--wr-card);
  border: 1px solid var(--wr-line);
  border-radius: 8px;
  box-shadow: 0 18px 40px rgba(29, 37, 31, 0.09);
}

.wr-form-section {
  padding: clamp(22px, 4vw, 34px);
  border-bottom: 1px solid var(--wr-line);
}

.wr-section-head {
  margin-bottom: 18px;
}

.wr-section-head h2 {
  margin: 0;
  font-family: var(--br-font-display), Georgia, serif;
  font-size: clamp(26px, 3vw, 34px);
  line-height: 1.08;
}

.wr-mode-tabs,
.wr-shelf-grid {
  display: grid;
  gap: 10px;
}

.wr-mode-tabs {
  grid-template-columns: 1fr 1fr;
  margin-bottom: 18px;
}

.wr-mode-tabs button,
.wr-shelf-grid button {
  border: 1px solid var(--wr-line);
  border-radius: 8px;
  background: #fbfcf6;
  color: var(--wr-ink);
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.wr-mode-tabs button {
  padding: 13px 16px;
  font-weight: 900;
  text-align: center;
}

.wr-mode-tabs button.is-active,
.wr-shelf-grid button.is-active {
  border-color: var(--wr-green);
  background: color-mix(in srgb, var(--wr-green) 10%, #fbfcf6);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--wr-green) 34%, transparent);
}

.wr-picker label,
.wr-grid-two label,
.wr-form-section > label {
  display: grid;
  gap: 8px;
  color: var(--wr-green-dark);
  font-size: 13px;
  font-weight: 900;
}

.wr-input {
  width: 100%;
  border: 1px solid var(--wr-line);
  border-radius: 8px;
  background: #fffffc;
  color: var(--wr-ink);
  padding: 13px 14px;
  font: inherit;
  line-height: 1.3;
}

.wr-input::placeholder {
  color: var(--wr-faint);
}

.wr-results {
  display: grid;
  gap: 8px;
  margin-top: 12px;
}

.wr-results button {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 12px;
  align-items: center;
  border: 1px solid var(--wr-line);
  border-radius: 8px;
  background: #fbfcf6;
  color: var(--wr-ink);
  padding: 12px 14px;
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.wr-results button.is-selected {
  border-color: var(--wr-green);
  background: color-mix(in srgb, var(--wr-green) 10%, #fbfcf6);
}

.wr-results span {
  display: grid;
  min-width: 0;
}

.wr-results strong {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.wr-results small,
.wr-results em {
  color: var(--wr-muted);
  font-size: 12px;
  font-style: normal;
}

.wr-grid-two {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.wr-stars {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.wr-star {
  width: 48px;
  height: 48px;
  border: 1px solid var(--wr-line);
  border-radius: 8px;
  background: #fbfcf6;
  color: #b6bcae;
  font-size: 28px;
  line-height: 1;
  cursor: pointer;
  transition: transform 160ms ease, border-color 160ms ease, color 160ms ease;
}

.wr-star:hover {
  transform: translateY(-2px);
}

.wr-star.is-filled {
  border-color: color-mix(in srgb, var(--wr-gold) 70%, var(--wr-line));
  color: var(--wr-gold);
  background: #fff8e8;
}

.wr-rating-note {
  margin: 12px 0 0;
  color: var(--wr-muted);
  font-size: 14px;
}

.wr-shelf-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin-bottom: 18px;
}

.wr-shelf-grid button {
  display: grid;
  gap: 5px;
  padding: 14px;
}

.wr-shelf-grid strong {
  font-size: 15px;
}

.wr-shelf-grid span {
  color: var(--wr-muted);
  font-size: 12px;
  line-height: 1.35;
}

.wr-textarea {
  min-height: 210px;
  resize: vertical;
  font-family: var(--br-font-serif), Georgia, serif;
  font-size: 17px;
  line-height: 1.55;
}

.wr-form-section > label + label,
.wr-form-section .wr-grid-two + .wr-grid-two,
.wr-form-section .wr-grid-two + label,
.wr-form-section label + .wr-review-tools {
  margin-top: 16px;
}

.wr-review-tools {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
  color: var(--wr-muted);
  font-size: 13px;
}

.wr-check {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  color: var(--wr-ink);
  font-weight: 800;
}

.wr-error {
  margin: 12px 0 0;
  color: var(--wr-red);
  font-size: 14px;
  font-weight: 800;
}

.wr-submit-row {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  align-items: center;
  padding: clamp(22px, 4vw, 34px);
}

.wr-submit-row strong,
.wr-submit-row span {
  display: block;
}

.wr-submit-row span {
  margin-top: 3px;
  color: var(--wr-muted);
  font-size: 13px;
}

.wr-submit-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 10px;
}

.wr-primary,
.wr-secondary {
  border-radius: 999px;
  padding: 13px 20px;
  font: inherit;
  font-weight: 900;
  cursor: pointer;
}

.wr-primary {
  border: 1px solid var(--wr-green-dark);
  background: var(--wr-green-dark);
  color: #f6f7ef;
}

.wr-secondary {
  border: 1px solid var(--wr-line);
  background: #fbfcf6;
  color: var(--wr-green-dark);
}

.wr-draft {
  margin: -14px clamp(22px, 4vw, 34px) 28px;
  color: var(--wr-green);
  font-size: 14px;
  font-weight: 800;
}

@media (max-width: 860px) {
  .wr-hero,
  .wr-workspace {
    grid-template-columns: 1fr;
  }

  .wr-hero h1 {
    max-width: 100%;
  }

  .wr-ledger {
    justify-self: stretch;
    grid-template-columns: auto 1fr auto 1fr;
    align-items: baseline;
  }

  .wr-ledger strong {
    margin-bottom: 0;
    font-size: 22px;
  }

  .wr-book-slip {
    position: static;
    display: grid;
    grid-template-columns: 132px minmax(0, 1fr);
    gap: 18px;
  }

  .wr-slip-copy {
    padding-top: 0;
  }
}

@media (max-width: 620px) {
  .wr-hero {
    padding-top: 34px;
  }

  .wr-saved,
  .wr-book-slip,
  .wr-grid-two,
  .wr-mode-tabs,
  .wr-shelf-grid,
  .wr-results button {
    grid-template-columns: 1fr;
  }

  .wr-book-slip {
    padding: 14px;
  }

  .wr-cover {
    max-width: 170px;
  }

  .wr-submit-row,
  .wr-review-tools {
    align-items: stretch;
    flex-direction: column;
  }

  .wr-submit-actions {
    justify-content: stretch;
  }

  .wr-submit-actions button {
    width: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .wr-star {
    transition: none;
  }

  .wr-star:hover {
    transform: none;
  }
}
`;
