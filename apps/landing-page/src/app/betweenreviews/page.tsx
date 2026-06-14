'use client';

import { type FormEvent, useRef, useState } from 'react';
import Link from 'next/link';
import { SiteNav } from '@/components/SiteNav';

type ReviewFields = {
  title: string;
  author: string;
  name: string;
  email: string;
  format: string;
  genre: string;
  link: string;
  note: string;
  read: boolean;
  honest: boolean;
};

type TextField = Exclude<keyof ReviewFields, 'read' | 'honest'>;

const initialFields: ReviewFields = {
  title: '',
  author: '',
  name: '',
  email: '',
  format: '',
  genre: '',
  link: '',
  note: '',
  read: false,
  honest: false,
};

const lanes = [
  {
    icon: 'F',
    title: 'Featured Review',
    spec: '600-1,200 words',
    body: 'A considered, full-length take on a single book - the case for (or against) reading it. Honorarium up to $40 if selected for the issue.',
  },
  {
    icon: 'C',
    title: 'Capsule',
    spec: '120-250 words',
    body: 'A tight, opinionated recommendation. One book, one verdict, no padding. Honorarium up to $20 if selected.',
  },
  {
    icon: 'L',
    title: 'Reading List',
    spec: '4-8 titles',
    body: 'A themed shelf with a sentence on each - the books that belong together and why. Honorarium up to $25 if selected.',
  },
];

const benefits = [
  'An honorarium from the review pool - up to $40 featured, up to $25 lists, up to $20 capsules.',
  "That month's issue free, delivered to your account.",
  'A BetweenReviews Critic badge on your reader profile.',
  'Your byline beside the book, linked from its page on BetweenReads.',
  'Full editorial pass - we copyedit, you approve, nothing ships without your sign-off.',
  'You keep full copyright in your words, always.',
];

const selectionNotes = [
  {
    title: 'Independent voice',
    body: 'We run honest reviews - praise and pans both. Publishers and authors never see a draft, and never pay for placement.',
  },
  {
    title: 'No paid placement',
    body: 'You cannot buy a review. The $3 fee covers reading and funds the honorarium pool, nothing more.',
  },
  {
    title: 'Read it first',
    body: 'Reviews are for books you have actually finished. We ask you to confirm it before you submit.',
  },
];

const rightsTerms = [
  {
    title: 'What rights do I grant on acceptance?',
    body: 'If selected, you grant BetweenReads first serial rights to publish your review digitally on the platform and in the journal issue. Non-exclusive rights revert to you 30 days after the issue publishes - reprint it anywhere you like after that.',
    open: true,
  },
  {
    title: 'Can I review a book I disliked?',
    body: 'Yes. We publish honest criticism. What we will not run is a personal attack on the author - keep it about the book.',
  },
  {
    title: 'Do you accept self-published and indie titles?',
    body: 'Absolutely. Featured, indie, and self-published books are read on the same terms. Editorial fit and the quality of your writing are what decide it.',
  },
  {
    title: 'Is the fee refundable?',
    body: 'The $3 fee is non-refundable. It funds the honorarium pool that pays the critics selected for each issue.',
  },
];

function honorariumFor(format: string) {
  if (format === 'featured') return 'up to $40';
  if (format === 'list') return 'up to $25';
  return 'up to $20';
}

function validEmail(email: string) {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
}

export default function BetweenReviewsPage() {
  const [fields, setFields] = useState<ReviewFields>(initialFields);
  const [showError, setShowError] = useState(false);
  const [confirmation, setConfirmation] = useState<{
    name: string;
    email: string;
    honorarium: string;
  } | null>(null);
  const doneRef = useRef<HTMLDivElement>(null);

  const updateText = (field: TextField, value: string) => {
    setFields((current) => ({ ...current, [field]: value }));
  };

  const updateCheck = (field: 'read' | 'honest', value: boolean) => {
    setFields((current) => ({ ...current, [field]: value }));
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const ready =
      fields.title.trim() &&
      fields.author.trim() &&
      fields.name.trim() &&
      validEmail(fields.email.trim()) &&
      fields.format &&
      fields.note.trim() &&
      fields.read &&
      fields.honest;

    if (!ready) {
      setShowError(true);
      return;
    }

    setShowError(false);
    setConfirmation({
      name: fields.name.trim(),
      email: fields.email.trim(),
      honorarium: honorariumFor(fields.format),
    });

    window.requestAnimationFrame(() => {
      doneRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  };

  return (
    <main className="brv-page">
      <style dangerouslySetInnerHTML={{ __html: REVIEW_CSS }} />

      <SiteNav />

      <section className="brv-hero" aria-labelledby="betweenreviews-title">
        <div className="brv-wrap">
          <div className="brv-book-scene" aria-hidden="true">
            <div className="brv-book">
              <div className="brv-cover-face">
                <div>
                  <div className="brv-cover-top">The Critics&apos; Issue</div>
                  <div className="brv-cover-rule" />
                </div>
                <div className="brv-cover-spacer" />
                <div>
                  <div className="brv-cover-name">
                    Between
                    <em>Reviews</em>
                  </div>
                  <div className="brv-cover-genres">Features &middot; Capsules &middot; Lists</div>
                </div>
                <div className="brv-cover-spacer" />
                <div className="brv-cover-issue">No. 01 - 2026</div>
                <div className="brv-cover-pub">a BetweenReads Journal</div>
              </div>
            </div>
          </div>

          <p className="brv-label brv-kicker">The Monthly Book Review</p>
          <h1 id="betweenreviews-title" className="brv-masthead">
            Write for BetweenReviews
          </h1>
          <p className="brv-hero-copy">
            Honest, reader-first criticism of the books worth your time - and the ones that
            aren&apos;t. Featured titles, indie, and self-published, all read on the same terms.
            Never paid placement.
          </p>
          <div className="brv-meta-row" aria-label="Review facts">
            <div>
              <div className="brv-meta-value">$3</div>
              <div className="brv-meta-label">Per review</div>
            </div>
            <div>
              <div className="brv-meta-value">~15</div>
              <div className="brv-meta-label">Reviews per issue</div>
            </div>
            <div>
              <div className="brv-meta-value">Monthly</div>
              <div className="brv-meta-label">Reading window</div>
            </div>
          </div>
        </div>
      </section>

      <section className="brv-section">
        <div className="brv-wrap">
          <p className="brv-label">What we publish</p>
          <h2>Three lanes, one standard</h2>
          <p className="brv-sub">
            Your own writing about a book you have actually finished, in English, clean and
            proofread. We edit for clarity, never for verdict - the take is always yours.
          </p>
          <div className="brv-lanes">
            {lanes.map((lane) => (
              <article className="brv-lane" key={lane.title}>
                <div className="brv-lane-icon" aria-hidden="true">
                  {lane.icon}
                </div>
                <h3>{lane.title}</h3>
                <div className="brv-lane-spec">{lane.spec}</div>
                <p>{lane.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="brv-section">
        <div className="brv-wrap brv-grid-two">
          <div>
            <p className="brv-label">If your review is selected</p>
            <h2>What you receive</h2>
            <ul className="brv-benefits">
              {benefits.map((benefit) => (
                <li key={benefit}>
                  <span aria-hidden="true">✓</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
          <aside className="brv-fee-box" aria-label="Review fee and honoraria">
            <p className="brv-label">Submission fee</p>
            <div className="brv-fee">$3</div>
            <p className="brv-fee-note">All lanes &middot; non-refundable &middot; funds the honorarium pool</p>
            <div className="brv-rule" />
            <div className="brv-pay">
              <span>Featured review</span>
              <b>up to $40</b>
            </div>
            <div className="brv-pay">
              <span>Reading list</span>
              <b>up to $25</b>
            </div>
            <div className="brv-pay">
              <span>Capsule</span>
              <b>up to $20</b>
            </div>
            <div className="brv-rule" />
            <p className="brv-fee-detail">
              Honoraria are paid from that issue&apos;s review pool, shared among the selected
              critics.
            </p>
          </aside>
        </div>
      </section>

      <section className="brv-section">
        <div className="brv-wrap">
          <p className="brv-label">How selection works</p>
          <h2>Honesty is the only criterion</h2>
          <p className="brv-sub">
            Our editors read every review. AI assists only in surfacing pieces that might otherwise
            be missed - the choice, and the opinion, are always human.
          </p>
          <div className="brv-ethos">
            {selectionNotes.map((note) => (
              <article key={note.title}>
                <h3>{note.title}</h3>
                <p>{note.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="brv-section">
        <div className="brv-wrap">
          <p className="brv-label">The fine print</p>
          <h2>Rights &amp; terms</h2>
          <p className="brv-sub">Plain-language summary. You always retain full copyright in your words.</p>
          <div className="brv-rights">
            {rightsTerms.map((term) => (
              <details key={term.title} open={term.open}>
                <summary>
                  <span>{term.title}</span>
                  <span className="brv-plus" aria-hidden="true">
                    +
                  </span>
                </summary>
                <p>{term.body}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="brv-section" id="review-submission">
        <div className="brv-wrap">
          <p className="brv-label">Your review</p>
          <h2>Send us your take</h2>
          <p className="brv-sub">
            One book per review. You&apos;ll be asked to confirm you finished it and agree to the
            terms above before paying.
          </p>

          {confirmation ? (
            <div className="brv-done" ref={doneRef} role="status" aria-live="polite">
              <div className="brv-seal" aria-hidden="true">
                ✓
              </div>
              <h2>Review received</h2>
              <p>
                Thank you, <strong>{confirmation.name}</strong> - your review is now with the
                editorial team. If selected, your honorarium for this lane is{' '}
                <strong>{confirmation.honorarium}</strong> and you&apos;ll receive that month&apos;s
                issue free. A confirmation has been sent to <strong>{confirmation.email}</strong>.
              </p>
            </div>
          ) : (
            <form className="brv-form-card" onSubmit={submit} noValidate>
              <div className="brv-form-row">
                <div className="brv-field">
                  <label htmlFor="brv-title">
                    Book title <span>*</span>
                  </label>
                  <input
                    id="brv-title"
                    className="brv-input"
                    type="text"
                    value={fields.title}
                    onChange={(event) => updateText('title', event.target.value)}
                    placeholder="The book you reviewed"
                    required
                  />
                </div>
                <div className="brv-field">
                  <label htmlFor="brv-author">
                    Book author <span>*</span>
                  </label>
                  <input
                    id="brv-author"
                    className="brv-input"
                    type="text"
                    value={fields.author}
                    onChange={(event) => updateText('author', event.target.value)}
                    placeholder="Who wrote it"
                    required
                  />
                </div>
              </div>

              <div className="brv-form-row">
                <div className="brv-field">
                  <label htmlFor="brv-name">
                    Your name / pen name <span>*</span>
                  </label>
                  <input
                    id="brv-name"
                    className="brv-input"
                    type="text"
                    value={fields.name}
                    onChange={(event) => updateText('name', event.target.value)}
                    placeholder="As your byline should read"
                    required
                  />
                </div>
                <div className="brv-field">
                  <label htmlFor="brv-email">
                    Email <span>*</span>
                  </label>
                  <input
                    id="brv-email"
                    className="brv-input"
                    type="email"
                    value={fields.email}
                    onChange={(event) => updateText('email', event.target.value)}
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div className="brv-form-row">
                <div className="brv-field">
                  <label htmlFor="brv-format">
                    Lane <span>*</span>
                  </label>
                  <select
                    id="brv-format"
                    className="brv-input"
                    value={fields.format}
                    onChange={(event) => updateText('format', event.target.value)}
                    required
                  >
                    <option value="">Select a lane...</option>
                    <option value="featured">Featured review</option>
                    <option value="capsule">Capsule</option>
                    <option value="list">Reading list</option>
                  </select>
                </div>
                <div className="brv-field">
                  <label htmlFor="brv-genre">Genre</label>
                  <input
                    id="brv-genre"
                    className="brv-input"
                    type="text"
                    value={fields.genre}
                    onChange={(event) => updateText('genre', event.target.value)}
                    placeholder="e.g. literary, fantasy, memoir"
                  />
                </div>
              </div>

              <div className="brv-field brv-field-full">
                <label htmlFor="brv-link">Link to your draft (optional)</label>
                <input
                  id="brv-link"
                  className="brv-input"
                  type="url"
                  value={fields.link}
                  onChange={(event) => updateText('link', event.target.value)}
                  placeholder="A Google Doc or shared link, if you have one"
                />
              </div>

              <div className="brv-field brv-field-full">
                <label htmlFor="brv-note">
                  Your review <span>*</span>
                </label>
                <textarea
                  id="brv-note"
                  className="brv-input brv-textarea"
                  value={fields.note}
                  onChange={(event) => updateText('note', event.target.value)}
                  placeholder="Paste your review here, or a strong excerpt if it's long. Tell us what the book does and whether it's worth reading."
                />
              </div>

              <div className="brv-checks">
                <label>
                  <input
                    type="checkbox"
                    checked={fields.read}
                    onChange={(event) => updateCheck('read', event.target.checked)}
                  />
                  <span>I have read this book in full - this is a review, not a preview.</span>
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={fields.honest}
                    onChange={(event) => updateCheck('honest', event.target.checked)}
                  />
                  <span>
                    This is my own honest opinion, written by me, and I was not paid or asked by the
                    author or publisher to write it.
                  </span>
                </label>
              </div>

              {showError ? (
                <p className="brv-error" role="alert">
                  Please complete the required fields, paste your review, and agree to both terms.
                </p>
              ) : null}

              <div className="brv-submit-row">
                <div className="brv-total">
                  Total today <b>$3.00</b>
                </div>
                <button className="brv-button" type="submit">
                  Submit &amp; Pay $3
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      <footer className="brv-footnote">
        <div className="brv-wrap">
          <p>
            Want to write longer original work instead? <Link href="/betweenlines">Submit to BetweenLines</Link>,
            our curated journal of fiction, poetry, and illustration.
          </p>
          <p className="brv-footer-mark">BetweenReviews is the book-review journal of between&bull;reads.</p>
        </div>
      </footer>
    </main>
  );
}

const REVIEW_CSS = `
.brv-page {
  --brv-paper: #faf8f4;
  --brv-card: #ffffff;
  --brv-ink: #1c1a17;
  --brv-muted: #6f6a61;
  --brv-faint: #9a9489;
  --brv-line: #e7e2d8;
  --brv-gold: #a9842f;
  --brv-gold-soft: #f3ecda;
  --brv-green: #2e7d55;
  --brv-blue: #244f73;
  --brv-serif: "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, "Times New Roman", serif;
  --brv-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
  --brv-display: "Playfair Display", Georgia, "Times New Roman", serif;
  min-height: 100vh;
  background:
    linear-gradient(90deg, rgba(28, 26, 23, 0.035) 1px, transparent 1px),
    linear-gradient(180deg, rgba(28, 26, 23, 0.03) 1px, transparent 1px),
    var(--brv-paper);
  background-size: 46px 46px;
  color: var(--brv-ink);
  font-family: var(--brv-sans);
  line-height: 1.55;
  -webkit-font-smoothing: antialiased;
}

.brv-wrap {
  max-width: 920px;
  margin: 0 auto;
  padding: 0 24px;
}

.brv-footnote a {
  color: inherit;
  text-decoration: none;
}

.brv-hero {
  text-align: center;
  padding: 52px 0 38px;
  border-bottom: 1px solid var(--brv-line);
}

.brv-label {
  margin: 0;
  font-size: 11px;
  letter-spacing: 0;
  text-transform: uppercase;
  color: var(--brv-faint);
  font-weight: 800;
}

.brv-kicker {
  color: var(--brv-gold);
  margin-bottom: 18px;
}

.brv-masthead {
  font-family: var(--brv-display);
  font-size: 64px;
  line-height: 1;
  letter-spacing: 0;
  margin: 0 0 14px;
  font-weight: 900;
}

.brv-hero-copy {
  max-width: 560px;
  margin: 0 auto;
  color: var(--brv-muted);
  font-family: var(--brv-serif);
  font-size: 17px;
}

.brv-meta-row {
  display: flex;
  justify-content: center;
  gap: 34px;
  margin-top: 30px;
  flex-wrap: wrap;
}

.brv-meta-value {
  font-family: var(--brv-display);
  font-size: 26px;
  color: var(--brv-ink);
  font-weight: 700;
}

.brv-meta-label {
  margin-top: 2px;
  color: var(--brv-faint);
  font-size: 12px;
  text-transform: uppercase;
}

.brv-book-scene {
  perspective: 2000px;
  display: flex;
  justify-content: center;
  margin: 0 0 38px;
}

.brv-book {
  position: relative;
  width: 250px;
  height: 342px;
  border-radius: 2px 6px 6px 2px;
  background: #ffe600;
  transform: rotateY(-17deg) rotateX(3deg);
  box-shadow:
    inset 9px 0 12px -7px rgba(0, 0, 0, 0.3),
    3px 0 0 #f4e7bf,
    5px 0 0 #efe1ad,
    7px 0 0 #f4e7bf,
    16px 24px 30px -10px rgba(40, 32, 0, 0.4);
  animation: brv-bookfloat 7s ease-in-out infinite;
}

@keyframes brv-bookfloat {
  0%,
  100% {
    transform: rotateY(-17deg) rotateX(3deg) translateY(0);
  }
  50% {
    transform: rotateY(-13deg) rotateX(3deg) translateY(-9px);
  }
}

.brv-cover-face {
  position: absolute;
  inset: 15px 14px 15px 18px;
  border: 1px solid rgba(26, 26, 26, 0.9);
  box-shadow: inset 0 0 0 3px #ffe600, inset 0 0 0 4px rgba(26, 26, 26, 0.32);
  padding: 16px;
  display: flex;
  flex-direction: column;
  text-align: center;
}

.brv-cover-spacer {
  flex: 1;
}

.brv-cover-top {
  font-family: var(--brv-display);
  font-size: 10px;
  letter-spacing: 0;
  text-transform: uppercase;
  color: #1a1a1a;
  font-weight: 700;
}

.brv-cover-rule {
  width: 30px;
  height: 1px;
  background: #1a1a1a;
  margin: 9px auto 0;
}

.brv-cover-name {
  font-family: var(--brv-display);
  font-weight: 900;
  font-size: 36px;
  line-height: 0.9;
  letter-spacing: 0;
  color: #1a1a1a;
}

.brv-cover-name em {
  display: block;
  font-style: italic;
  font-weight: 700;
}

.brv-cover-genres {
  margin-top: 14px;
  font-family: var(--brv-display);
  font-style: italic;
  font-size: 13px;
  color: #1a1a1a;
}

.brv-cover-issue {
  font-family: var(--brv-display);
  font-size: 11px;
  letter-spacing: 0;
  text-transform: uppercase;
  color: #1a1a1a;
  font-weight: 700;
}

.brv-cover-pub {
  margin-top: 5px;
  font-family: var(--brv-display);
  font-style: italic;
  font-size: 12.5px;
  color: rgba(26, 26, 26, 0.72);
}

.brv-section {
  padding: 52px 0;
  border-bottom: 1px solid var(--brv-line);
}

.brv-section h2,
.brv-done h2 {
  font-family: var(--brv-display);
  font-size: 32px;
  line-height: 1.08;
  font-weight: 700;
  margin: 10px 0 8px;
}

.brv-sub {
  color: var(--brv-muted);
  max-width: 620px;
  margin: 0 0 30px;
}

.brv-lanes,
.brv-ethos {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.brv-lane,
.brv-ethos article,
.brv-fee-box,
.brv-rights,
.brv-form-card,
.brv-done {
  background: var(--brv-card);
  border: 1px solid var(--brv-line);
  border-radius: 8px;
}

.brv-lane,
.brv-ethos article {
  padding: 24px;
}

.brv-lane-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--brv-line);
  border-radius: 50%;
  color: var(--brv-gold);
  font-family: var(--brv-display);
  font-weight: 900;
}

.brv-lane h3 {
  font-family: var(--brv-display);
  font-size: 21px;
  margin: 12px 0 6px;
  font-weight: 700;
}

.brv-lane-spec {
  margin-bottom: 10px;
  color: var(--brv-gold);
  font-size: 13px;
  font-weight: 700;
}

.brv-lane p,
.brv-ethos p {
  color: var(--brv-muted);
  font-size: 14px;
  margin: 0;
}

.brv-grid-two {
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: 22px;
  align-items: start;
}

.brv-benefits {
  list-style: none;
  padding: 0;
  margin: 0;
}

.brv-benefits li {
  display: flex;
  gap: 11px;
  align-items: flex-start;
  padding: 9px 0;
  font-size: 15px;
}

.brv-benefits li > span:first-child {
  flex: 0 0 auto;
  color: var(--brv-green);
  font-weight: 900;
}

.brv-fee-box {
  padding: 28px;
  background: var(--brv-gold-soft);
  border-color: #e8dcc0;
}

.brv-fee-box .brv-label {
  color: var(--brv-gold);
}

.brv-fee {
  margin: 10px 0 2px;
  font-family: var(--brv-display);
  font-size: 52px;
  line-height: 1;
  font-weight: 900;
}

.brv-fee-note {
  margin: 0 0 20px;
  color: var(--brv-muted);
  font-size: 13px;
}

.brv-rule {
  height: 1px;
  background: #e6d8b8;
  margin: 18px 0;
}

.brv-pay {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  padding: 5px 0;
  font-size: 14px;
}

.brv-pay b {
  font-family: var(--brv-display);
}

.brv-fee-detail {
  color: var(--brv-muted);
  font-size: 13px;
  margin: 0;
}

.brv-ethos h3 {
  margin: 0 0 6px;
  font-size: 15px;
}

.brv-rights {
  padding: 8px 26px;
}

.brv-rights details {
  border-bottom: 1px solid var(--brv-line);
}

.brv-rights details:last-child {
  border-bottom: 0;
}

.brv-rights summary {
  cursor: pointer;
  list-style: none;
  padding: 18px 0;
  font-size: 15.5px;
  font-weight: 700;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 18px;
}

.brv-rights summary::-webkit-details-marker {
  display: none;
}

.brv-plus {
  color: var(--brv-gold);
  font-size: 20px;
  font-weight: 400;
  transition: transform 160ms ease;
}

.brv-rights details[open] .brv-plus {
  transform: rotate(45deg);
}

.brv-rights p {
  max-width: 660px;
  margin: 0 0 18px;
  color: var(--brv-muted);
  font-size: 14.5px;
}

.brv-form-card {
  padding: 34px;
}

.brv-form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
  margin-bottom: 18px;
}

.brv-field {
  display: flex;
  flex-direction: column;
}

.brv-field-full {
  margin-bottom: 18px;
}

.brv-field label {
  margin-bottom: 7px;
  color: var(--brv-muted);
  font-size: 12px;
  font-weight: 700;
}

.brv-field label span {
  color: var(--brv-gold);
}

.brv-input {
  width: 100%;
  border: 1px solid var(--brv-line);
  border-radius: 8px;
  padding: 12px 13px;
  background: #fdfcfa;
  color: var(--brv-ink);
  font-family: var(--brv-sans);
  font-size: 15px;
}

.brv-input:focus {
  outline: none;
  border-color: var(--brv-gold);
  box-shadow: 0 0 0 3px var(--brv-gold-soft);
}

.brv-textarea {
  min-height: 132px;
  resize: vertical;
}

.brv-checks {
  margin: 6px 0 4px;
}

.brv-checks label {
  display: flex;
  gap: 11px;
  align-items: flex-start;
  padding: 9px 0;
  color: var(--brv-muted);
  font-size: 14px;
}

.brv-checks input {
  flex: 0 0 auto;
  width: 16px;
  height: 16px;
  margin-top: 3px;
  accent-color: var(--brv-gold);
}

.brv-error {
  margin: 8px 0 0;
  color: #b73528;
  font-size: 12.5px;
}

.brv-submit-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-top: 26px;
  flex-wrap: wrap;
}

.brv-total {
  color: var(--brv-muted);
  font-size: 14px;
}

.brv-total b {
  margin-left: 8px;
  color: var(--brv-ink);
  font-family: var(--brv-display);
  font-size: 22px;
}

.brv-button {
  border: 0;
  border-radius: 8px;
  padding: 15px 30px;
  background: var(--brv-ink);
  color: #fff;
  font-size: 14px;
  font-weight: 800;
  text-transform: uppercase;
  cursor: pointer;
  transition: transform 160ms ease, background 160ms ease;
}

.brv-button:hover,
.brv-button:focus-visible {
  background: #000;
  transform: translateY(-1px);
}

.brv-done {
  padding: 50px 34px;
  text-align: center;
}

.brv-seal {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 18px;
  border: 1px solid #e8dcc0;
  background: var(--brv-gold-soft);
  color: var(--brv-gold);
  font-size: 28px;
}

.brv-done h2 {
  margin: 0 0 8px;
}

.brv-done p {
  max-width: 520px;
  margin: 0 auto;
  color: var(--brv-muted);
}

.brv-footnote {
  padding: 46px 0 70px;
  text-align: center;
}

.brv-footnote p {
  max-width: 620px;
  margin: 0 auto 6px;
  color: var(--brv-muted);
  font-size: 14.5px;
}

.brv-footnote a {
  color: var(--brv-gold);
  font-weight: 700;
}

.brv-footer-mark {
  color: var(--brv-faint) !important;
  font-size: 13px !important;
}

@media (prefers-reduced-motion: reduce) {
  .brv-book,
  .brv-plus,
  .brv-button {
    animation: none;
    transition: none;
  }
}

@media (max-width: 760px) {
  .brv-wrap {
    padding: 0 18px;
  }

  .brv-hero {
    padding: 34px 0 30px;
  }

  .brv-book {
    width: 202px;
    height: 276px;
  }

  .brv-cover-name {
    font-size: 30px;
  }

  .brv-masthead {
    font-size: 44px;
  }

  .brv-meta-row {
    gap: 22px;
  }

  .brv-lanes,
  .brv-ethos,
  .brv-grid-two,
  .brv-form-row {
    grid-template-columns: 1fr;
  }

  .brv-form-card {
    padding: 24px;
  }

  .brv-section {
    padding: 42px 0;
  }
}
`;
