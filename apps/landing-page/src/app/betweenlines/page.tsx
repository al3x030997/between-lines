'use client';

import { type FormEvent, useRef, useState } from 'react';
import Link from 'next/link';
import { SiteNav } from '@/components/SiteNav';

type SubmissionFields = {
  title: string;
  name: string;
  email: string;
  format: string;
  genre: string;
  length: string;
  note: string;
  original: boolean;
  rights: boolean;
};

type TextField = Exclude<keyof SubmissionFields, 'original' | 'rights'>;

const initialFields: SubmissionFields = {
  title: '',
  name: '',
  email: '',
  format: '',
  genre: '',
  length: '',
  note: '',
  original: false,
  rights: false,
};

const streams = [
  {
    icon: 'P',
    title: 'Prose',
    spec: 'Up to 7,500 words',
    body: 'Fiction and narrative nonfiction - flash, short stories, and standalone excerpts. Honorarium up to $50 if selected.',
  },
  {
    icon: '3',
    title: 'Poetry',
    spec: '1-3 poems',
    body: 'A single poem or a short set. We recommend three to give a fuller sense of your voice. Honorarium up to $30 if selected.',
  },
  {
    icon: 'A',
    title: 'Illustration',
    spec: '1-3 works',
    body: 'Original illustration and visual storytelling. Submit a small portfolio of your strongest pieces. Honorarium up to $30 if selected.',
  },
];

const benefits = [
  'An honorarium from the submission pool - up to $50 for prose, up to $30 for poetry and illustration.',
  "That month's issue free, delivered to your account.",
  'A BetweenLines Pick badge on your author page.',
  'The Read Here First distinction - your work debuts here, exclusively.',
  'All rights revert to you 90 days after the issue publishes.',
  'You keep full copyright, always.',
];

const selectionNotes = [
  {
    title: 'Editorial judgment',
    body: 'Selected on craft and fit for the issue - not popularity, follower counts, or platform metrics.',
  },
  {
    title: 'No paid placement',
    body: 'You cannot buy a feature. The $5 fee covers reading and funds the honorarium pool, nothing more.',
  },
  {
    title: 'Read here first',
    body: 'Debut your work before publication anywhere else and earn the Read Here First distinction.',
  },
];

const rightsTerms = [
  {
    title: 'What rights do I grant on acceptance?',
    body: 'BetweenLines publishes originals only. If selected, you grant BetweenReads exclusive first serial rights to publish your work digitally on the platform and in the journal issue. All rights revert to you 90 days after that issue publishes.',
    open: true,
  },
  {
    title: 'Does my work need to be unpublished?',
    body: 'Yes. Submissions must be entirely original and never published anywhere before - in print or online. Work that has appeared elsewhere is not eligible for the journal.',
  },
  {
    title: 'What if I get a traditional publishing offer?',
    body: 'You may request early rights reversion before the 90 days conclude. We aim to respond within 5 business days.',
  },
  {
    title: 'Is the fee refundable?',
    body: 'The $5 fee is non-refundable. It funds the honorarium pool that pays the writers selected for each issue.',
  },
];

function honorariumFor(format: string) {
  return format.startsWith('prose') ? 'up to $50' : 'up to $30';
}

function validEmail(email: string) {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
}

export default function BetweenLinesPage() {
  const [fields, setFields] = useState<SubmissionFields>(initialFields);
  const [fileName, setFileName] = useState('');
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

  const updateCheck = (field: 'original' | 'rights', value: boolean) => {
    setFields((current) => ({ ...current, [field]: value }));
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const ready =
      fields.title.trim() &&
      fields.name.trim() &&
      validEmail(fields.email.trim()) &&
      fields.format &&
      fileName &&
      fields.original &&
      fields.rights;

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
    <main className="bls-page">
      <style dangerouslySetInnerHTML={{ __html: SUBMISSION_CSS }} />

      <SiteNav />

      <section className="bls-hero" aria-labelledby="betweenlines-title">
        <div className="bls-wrap">
          <div className="bls-book-scene" aria-hidden="true">
            <div className="bls-book">
              <div className="bls-cover-face">
                <div>
                  <div className="bls-cover-top">The Inaugural Issue</div>
                  <div className="bls-cover-rule" />
                </div>
                <div className="bls-cover-spacer" />
                <div>
                  <div className="bls-cover-name">
                    Between
                    <em>Lines</em>
                  </div>
                  <div className="bls-cover-genres">Fiction &middot; Poetry &middot; Illustration</div>
                </div>
                <div className="bls-cover-spacer" />
                <div className="bls-cover-issue">No. 01 - 2026</div>
                <div className="bls-cover-pub">a BetweenReads Journal</div>
              </div>
            </div>
          </div>

          <p className="bls-label bls-kicker">The Monthly Curated Journal</p>
          <h1 id="betweenlines-title" className="bls-masthead">
            Submit to BetweenLines
          </h1>
          <p className="bls-hero-copy">
            A reader-first literary journal for emerging, self-published, and traditionally
            published voices. Selected on quality and editorial fit - never metrics, never paid
            placement.
          </p>
          <div className="bls-meta-row" aria-label="Submission facts">
            <div>
              <div className="bls-meta-value">$5</div>
              <div className="bls-meta-label">Per submission</div>
            </div>
            <div>
              <div className="bls-meta-value">~10</div>
              <div className="bls-meta-label">Pieces per issue</div>
            </div>
            <div>
              <div className="bls-meta-value">Monthly</div>
              <div className="bls-meta-label">Reading window</div>
            </div>
          </div>
        </div>
      </section>

      <section className="bls-section">
        <div className="bls-wrap">
          <p className="bls-label">What we publish</p>
          <h2>Three streams, one standard</h2>
          <p className="bls-sub">
            Original work only, in English, never published anywhere before - exclusive to
            BetweenLines. Shaped and considered, clean, proofread, and ready for readers.
          </p>
          <div className="bls-streams">
            {streams.map((stream) => (
              <article className="bls-stream" key={stream.title}>
                <div className="bls-stream-icon" aria-hidden="true">
                  {stream.icon}
                </div>
                <h3>{stream.title}</h3>
                <div className="bls-stream-spec">{stream.spec}</div>
                <p>{stream.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bls-section">
        <div className="bls-wrap bls-grid-two">
          <div>
            <p className="bls-label">If your work is selected</p>
            <h2>What you receive</h2>
            <ul className="bls-benefits">
              {benefits.map((benefit) => (
                <li key={benefit}>
                  <span aria-hidden="true">✓</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
          <aside className="bls-fee-box" aria-label="Submission fee and honoraria">
            <p className="bls-label">Submission fee</p>
            <div className="bls-fee">$5</div>
            <p className="bls-fee-note">All formats &middot; non-refundable &middot; funds the honorarium pool</p>
            <div className="bls-rule" />
            <div className="bls-pay">
              <span>Prose honorarium</span>
              <b>up to $50</b>
            </div>
            <div className="bls-pay">
              <span>Poetry honorarium</span>
              <b>up to $30</b>
            </div>
            <div className="bls-pay">
              <span>Illustration honorarium</span>
              <b>up to $30</b>
            </div>
            <div className="bls-rule" />
            <p className="bls-fee-detail">
              Honoraria are paid from that issue&apos;s submission pool, shared among the selected
              writers.
            </p>
          </aside>
        </div>
      </section>

      <section className="bls-section">
        <div className="bls-wrap">
          <p className="bls-label">How selection works</p>
          <h2>Quality is the only criterion</h2>
          <p className="bls-sub">
            Our editorial team reads every submission. AI assists only in surfacing pieces that
            might otherwise be missed - the choice is always human.
          </p>
          <div className="bls-ethos">
            {selectionNotes.map((note) => (
              <article key={note.title}>
                <h3>{note.title}</h3>
                <p>{note.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bls-section">
        <div className="bls-wrap">
          <p className="bls-label">The fine print</p>
          <h2>Rights &amp; terms</h2>
          <p className="bls-sub">Plain-language summary. You always retain full copyright in your work.</p>
          <div className="bls-rights">
            {rightsTerms.map((term) => (
              <details key={term.title} open={term.open}>
                <summary>
                  <span>{term.title}</span>
                  <span className="bls-plus" aria-hidden="true">
                    +
                  </span>
                </summary>
                <p>{term.body}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bls-section" id="journal-submission">
        <div className="bls-wrap">
          <p className="bls-label">Your submission</p>
          <h2>Send us your work</h2>
          <p className="bls-sub">
            One piece per submission. You&apos;ll be asked to confirm originality and agree to the
            terms above before paying.
          </p>

          {confirmation ? (
            <div className="bls-done" ref={doneRef} role="status" aria-live="polite">
              <div className="bls-seal" aria-hidden="true">
                ✓
              </div>
              <h2>Submission received</h2>
              <p>
                Thank you, <strong>{confirmation.name}</strong> - your work is now with the
                editorial team. If selected, your honorarium for this format is{' '}
                <strong>{confirmation.honorarium}</strong> and you&apos;ll receive that month&apos;s
                issue free. A confirmation has been sent to <strong>{confirmation.email}</strong>.
              </p>
            </div>
          ) : (
            <form className="bls-form-card" onSubmit={submit} noValidate>
              <div className="bls-form-row">
                <div className="bls-field">
                  <label htmlFor="bls-title">
                    Title of work <span>*</span>
                  </label>
                  <input
                    id="bls-title"
                    className="bls-input"
                    type="text"
                    value={fields.title}
                    onChange={(event) => updateText('title', event.target.value)}
                    placeholder="The title of your piece"
                    required
                  />
                </div>
                <div className="bls-field">
                  <label htmlFor="bls-name">
                    Author / pen name <span>*</span>
                  </label>
                  <input
                    id="bls-name"
                    className="bls-input"
                    type="text"
                    value={fields.name}
                    onChange={(event) => updateText('name', event.target.value)}
                    placeholder="As it should appear in print"
                    required
                  />
                </div>
              </div>

              <div className="bls-form-row">
                <div className="bls-field">
                  <label htmlFor="bls-email">
                    Email <span>*</span>
                  </label>
                  <input
                    id="bls-email"
                    className="bls-input"
                    type="email"
                    value={fields.email}
                    onChange={(event) => updateText('email', event.target.value)}
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <div className="bls-field">
                  <label htmlFor="bls-format">
                    Format <span>*</span>
                  </label>
                  <select
                    id="bls-format"
                    className="bls-input"
                    value={fields.format}
                    onChange={(event) => updateText('format', event.target.value)}
                    required
                  >
                    <option value="">Select a format...</option>
                    <option value="prose-fiction">Prose - fiction</option>
                    <option value="prose-nonfiction">Prose - nonfiction</option>
                    <option value="poetry">Poetry</option>
                    <option value="illustration">Illustration</option>
                  </select>
                </div>
              </div>

              <div className="bls-form-row">
                <div className="bls-field">
                  <label htmlFor="bls-genre">Genre</label>
                  <input
                    id="bls-genre"
                    className="bls-input"
                    type="text"
                    value={fields.genre}
                    onChange={(event) => updateText('genre', event.target.value)}
                    placeholder="e.g. literary, speculative, memoir"
                  />
                </div>
                <div className="bls-field">
                  <label htmlFor="bls-length">Length (word count / no. of pieces)</label>
                  <input
                    id="bls-length"
                    className="bls-input"
                    type="text"
                    value={fields.length}
                    onChange={(event) => updateText('length', event.target.value)}
                    placeholder="e.g. 3,200 words / 3 poems"
                  />
                </div>
              </div>

              <div className="bls-field bls-field-full">
                <span className="bls-file-label">
                  Your manuscript or portfolio <span>*</span>
                </span>
                <input
                  id="bls-file"
                  className="bls-file-input"
                  type="file"
                  accept=".doc,.docx,.pdf,.png,.jpg,.jpeg"
                  onChange={(event) => setFileName(event.target.files?.[0]?.name ?? '')}
                  required
                />
                <label className="bls-upload" htmlFor="bls-file">
                  <strong>Click to upload</strong>
                  <span>.docx, .pdf, .png, .jpg - one piece per submission</span>
                  {fileName ? <b>{fileName}</b> : null}
                </label>
              </div>

              <div className="bls-field bls-field-full">
                <label htmlFor="bls-note">Cover note (optional)</label>
                <textarea
                  id="bls-note"
                  className="bls-input bls-textarea"
                  value={fields.note}
                  onChange={(event) => updateText('note', event.target.value)}
                  placeholder="A few words about the piece, or anything the editors should know."
                />
              </div>

              <div className="bls-checks">
                <label>
                  <input
                    type="checkbox"
                    checked={fields.original}
                    onChange={(event) => updateCheck('original', event.target.checked)}
                  />
                  <span>
                    This is my own original work, in English, never published anywhere before, and
                    the rights are mine to grant.
                  </span>
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={fields.rights}
                    onChange={(event) => updateCheck('rights', event.target.checked)}
                  />
                  <span>
                    I understand that, if selected, I grant exclusive first serial rights, reverting
                    to me 90 days after the issue publishes.
                  </span>
                </label>
              </div>

              {showError ? (
                <p className="bls-error" role="alert">
                  Please complete the required fields, upload your work, and agree to both terms.
                </p>
              ) : null}

              <div className="bls-submit-row">
                <div className="bls-total">
                  Total today <b>$5.00</b>
                </div>
                <button className="bls-button" type="submit">
                  Submit &amp; Pay $5
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      <footer className="bls-footnote">
        <div className="bls-wrap">
          <p>
            Are you a reader? <Link href="/read">Nominate a writer or a piece</Link> you love - the
            writer receives an invite to submit for $5, and selection is always the editors&apos;
            call.
          </p>
          <p className="bls-footer-mark">BetweenLines is the curated journal of between&bull;reads.</p>
        </div>
      </footer>
    </main>
  );
}

const SUBMISSION_CSS = `
.bls-page {
  --bls-paper: #faf8f4;
  --bls-card: #ffffff;
  --bls-ink: var(--theme-text);
  --bls-muted: var(--theme-text-muted);
  --bls-faint: var(--theme-text-faint);
  --bls-line: #e7e2d8;
  --bls-gold: #a9842f;
  --bls-gold-soft: #f3ecda;
  --bls-green: #2e7d55;
  --bls-blue: #244f73;
  --bls-serif: "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, "Times New Roman", serif;
  --bls-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
  --bls-display: "Playfair Display", Georgia, "Times New Roman", serif;
  min-height: 100vh;
  background:
    linear-gradient(90deg, rgba(28, 26, 23, 0.035) 1px, transparent 1px),
    linear-gradient(180deg, rgba(28, 26, 23, 0.03) 1px, transparent 1px),
    var(--bls-paper);
  background-size: 46px 46px;
  color: var(--bls-ink);
  font-family: var(--bls-sans);
  line-height: 1.55;
  -webkit-font-smoothing: antialiased;
}

.bls-wrap {
  max-width: 920px;
  margin: 0 auto;
  padding: 0 24px;
}

.bls-footnote a {
  color: inherit;
  text-decoration: none;
}

.bls-hero {
  text-align: center;
  padding: 52px 0 38px;
  border-bottom: 1px solid var(--bls-line);
}

.bls-label {
  margin: 0;
  font-size: 11px;
  letter-spacing: 0;
  text-transform: uppercase;
  color: var(--bls-faint);
  font-weight: 800;
}

.bls-kicker {
  color: var(--bls-gold);
  margin-bottom: 18px;
}

.bls-masthead {
  font-family: var(--bls-display);
  font-size: 64px;
  line-height: 1;
  letter-spacing: 0;
  margin: 0 0 14px;
  font-weight: 900;
}

.bls-hero-copy {
  max-width: 560px;
  margin: 0 auto;
  color: var(--bls-muted);
  font-family: var(--bls-serif);
  font-size: 17px;
}

.bls-meta-row {
  display: flex;
  justify-content: center;
  gap: 34px;
  margin-top: 30px;
  flex-wrap: wrap;
}

.bls-meta-value {
  font-family: var(--bls-display);
  font-size: 26px;
  color: var(--bls-ink);
  font-weight: 700;
}

.bls-meta-label {
  margin-top: 2px;
  color: var(--bls-faint);
  font-size: 12px;
  text-transform: uppercase;
}

.bls-book-scene {
  perspective: 2000px;
  display: flex;
  justify-content: center;
  margin: 0 0 38px;
}

.bls-book {
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
  animation: bls-bookfloat 7s ease-in-out infinite;
}

@keyframes bls-bookfloat {
  0%,
  100% {
    transform: rotateY(-17deg) rotateX(3deg) translateY(0);
  }
  50% {
    transform: rotateY(-13deg) rotateX(3deg) translateY(-9px);
  }
}

.bls-cover-face {
  position: absolute;
  inset: 15px 14px 15px 18px;
  border: 1px solid rgba(26, 26, 26, 0.9);
  box-shadow: inset 0 0 0 3px #ffe600, inset 0 0 0 4px rgba(26, 26, 26, 0.32);
  padding: 16px;
  display: flex;
  flex-direction: column;
  text-align: center;
}

.bls-cover-spacer {
  flex: 1;
}

.bls-cover-top {
  font-family: var(--bls-display);
  font-size: 10px;
  letter-spacing: 0;
  text-transform: uppercase;
  color: var(--bls-ink);
  font-weight: 700;
}

.bls-cover-rule {
  width: 30px;
  height: 1px;
  background: #1a1a1a;
  margin: 9px auto 0;
}

.bls-cover-name {
  font-family: var(--bls-display);
  font-weight: 900;
  font-size: 36px;
  line-height: 0.9;
  letter-spacing: 0;
  color: var(--bls-ink);
}

.bls-cover-name em {
  display: block;
  font-style: italic;
  font-weight: 700;
}

.bls-cover-genres {
  margin-top: 14px;
  font-family: var(--bls-display);
  font-style: italic;
  font-size: 13px;
  color: var(--bls-ink);
}

.bls-cover-issue {
  font-family: var(--bls-display);
  font-size: 11px;
  letter-spacing: 0;
  text-transform: uppercase;
  color: var(--bls-ink);
  font-weight: 700;
}

.bls-cover-pub {
  margin-top: 5px;
  font-family: var(--bls-display);
  font-style: italic;
  font-size: 12.5px;
  color: var(--bls-muted);
}

.bls-section {
  padding: 52px 0;
  border-bottom: 1px solid var(--bls-line);
}

.bls-section h2,
.bls-done h2 {
  font-family: var(--bls-display);
  font-size: 32px;
  line-height: 1.08;
  font-weight: 700;
  margin: 10px 0 8px;
}

.bls-sub {
  color: var(--bls-muted);
  max-width: 620px;
  margin: 0 0 30px;
}

.bls-streams,
.bls-ethos {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.bls-stream,
.bls-ethos article,
.bls-fee-box,
.bls-rights,
.bls-form-card,
.bls-done {
  background: var(--bls-card);
  border: 1px solid var(--bls-line);
  border-radius: 8px;
}

.bls-stream,
.bls-ethos article {
  padding: 24px;
}

.bls-stream-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--bls-line);
  border-radius: 50%;
  color: var(--bls-gold);
  font-family: var(--bls-display);
  font-weight: 900;
}

.bls-stream h3 {
  font-family: var(--bls-display);
  font-size: 21px;
  margin: 12px 0 6px;
  font-weight: 700;
}

.bls-stream-spec {
  margin-bottom: 10px;
  color: var(--bls-gold);
  font-size: 13px;
  font-weight: 700;
}

.bls-stream p,
.bls-ethos p {
  color: var(--bls-muted);
  font-size: 14px;
  margin: 0;
}

.bls-grid-two {
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: 22px;
  align-items: start;
}

.bls-benefits {
  list-style: none;
  padding: 0;
  margin: 0;
}

.bls-benefits li {
  display: flex;
  gap: 11px;
  align-items: flex-start;
  padding: 9px 0;
  font-size: 15px;
}

.bls-benefits li > span:first-child {
  flex: 0 0 auto;
  color: var(--bls-green);
  font-weight: 900;
}

.bls-fee-box {
  padding: 28px;
  background: var(--bls-gold-soft);
  border-color: #e8dcc0;
}

.bls-fee-box .bls-label {
  color: var(--bls-gold);
}

.bls-fee {
  margin: 10px 0 2px;
  font-family: var(--bls-display);
  font-size: 52px;
  line-height: 1;
  font-weight: 900;
}

.bls-fee-note {
  margin: 0 0 20px;
  color: var(--bls-muted);
  font-size: 13px;
}

.bls-rule {
  height: 1px;
  background: #e6d8b8;
  margin: 18px 0;
}

.bls-pay {
  display: flex;
  justify-content: space-between;
  gap: 14px;
  padding: 5px 0;
  font-size: 14px;
}

.bls-pay b {
  font-family: var(--bls-display);
}

.bls-fee-detail {
  color: var(--bls-muted);
  font-size: 13px;
  margin: 0;
}

.bls-ethos h3 {
  margin: 0 0 6px;
  font-size: 15px;
}

.bls-rights {
  padding: 8px 26px;
}

.bls-rights details {
  border-bottom: 1px solid var(--bls-line);
}

.bls-rights details:last-child {
  border-bottom: 0;
}

.bls-rights summary {
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

.bls-rights summary::-webkit-details-marker {
  display: none;
}

.bls-plus {
  color: var(--bls-gold);
  font-size: 20px;
  font-weight: 400;
  transition: transform 160ms ease;
}

.bls-rights details[open] .bls-plus {
  transform: rotate(45deg);
}

.bls-rights p {
  max-width: 660px;
  margin: 0 0 18px;
  color: var(--bls-muted);
  font-size: 14.5px;
}

.bls-form-card {
  padding: 34px;
}

.bls-form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
  margin-bottom: 18px;
}

.bls-field {
  display: flex;
  flex-direction: column;
}

.bls-field-full {
  margin-bottom: 18px;
}

.bls-field label,
.bls-file-label {
  margin-bottom: 7px;
  color: var(--bls-muted);
  font-size: 12px;
  font-weight: 700;
}

.bls-field label span,
.bls-file-label span {
  color: var(--bls-gold);
}

.bls-input {
  width: 100%;
  border: 1px solid var(--bls-line);
  border-radius: 8px;
  padding: 12px 13px;
  background: #fdfcfa;
  color: var(--bls-ink);
  font-family: var(--bls-sans);
  font-size: 15px;
}

.bls-input:focus,
.bls-upload:focus-within,
.bls-file-input:focus-visible + .bls-upload {
  outline: none;
  border-color: var(--bls-gold);
  box-shadow: 0 0 0 3px var(--bls-gold-soft);
}

.bls-textarea {
  min-height: 88px;
  resize: vertical;
}

.bls-upload {
  min-height: 96px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: 1.5px dashed var(--bls-line);
  border-radius: 8px;
  padding: 22px;
  background: #fdfcfa;
  color: var(--bls-muted);
  text-align: center;
  font-size: 14px;
  cursor: pointer;
}

.bls-upload strong {
  color: var(--bls-ink);
}

.bls-upload b {
  color: var(--bls-gold);
  font-size: 13px;
}

.bls-file-input {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.bls-checks {
  margin: 6px 0 4px;
}

.bls-checks label {
  display: flex;
  gap: 11px;
  align-items: flex-start;
  padding: 9px 0;
  color: var(--bls-muted);
  font-size: 14px;
}

.bls-checks input {
  flex: 0 0 auto;
  width: 16px;
  height: 16px;
  margin-top: 3px;
  accent-color: var(--bls-gold);
}

.bls-error {
  margin: 8px 0 0;
  color: #b73528;
  font-size: 12.5px;
}

.bls-submit-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-top: 26px;
  flex-wrap: wrap;
}

.bls-total {
  color: var(--bls-muted);
  font-size: 14px;
}

.bls-total b {
  margin-left: 8px;
  color: var(--bls-ink);
  font-family: var(--bls-display);
  font-size: 22px;
}

.bls-button {
  border: 0;
  border-radius: 8px;
  padding: 15px 30px;
  background: var(--bls-ink);
  color: #fff;
  font-size: 14px;
  font-weight: 800;
  text-transform: uppercase;
  cursor: pointer;
  transition: transform 160ms ease, background 160ms ease;
}

.bls-button:hover,
.bls-button:focus-visible {
  background: #000;
  transform: translateY(-1px);
}

.bls-done {
  padding: 50px 34px;
  text-align: center;
}

.bls-seal {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 18px;
  border: 1px solid #e8dcc0;
  background: var(--bls-gold-soft);
  color: var(--bls-gold);
  font-size: 28px;
}

.bls-done h2 {
  margin: 0 0 8px;
}

.bls-done p {
  max-width: 520px;
  margin: 0 auto;
  color: var(--bls-muted);
}

.bls-footnote {
  padding: 46px 0 70px;
  text-align: center;
}

.bls-footnote p {
  max-width: 620px;
  margin: 0 auto 6px;
  color: var(--bls-muted);
  font-size: 14.5px;
}

.bls-footnote a {
  color: var(--bls-gold);
  font-weight: 700;
}

.bls-footer-mark {
  color: var(--bls-faint) !important;
  font-size: 13px !important;
}

@media (prefers-reduced-motion: reduce) {
  .bls-book,
  .bls-plus,
  .bls-button {
    animation: none;
    transition: none;
  }
}

@media (max-width: 760px) {
  .bls-wrap {
    padding: 0 18px;
  }

  .bls-hero {
    padding: 34px 0 30px;
  }

  .bls-book {
    width: 202px;
    height: 276px;
  }

  .bls-cover-name {
    font-size: 30px;
  }

  .bls-masthead {
    font-size: 44px;
  }

  .bls-meta-row {
    gap: 22px;
  }

  .bls-streams,
  .bls-ethos,
  .bls-grid-two,
  .bls-form-row {
    grid-template-columns: 1fr;
  }

  .bls-form-card {
    padding: 24px;
  }

  .bls-section {
    padding: 42px 0;
  }
}
`;
