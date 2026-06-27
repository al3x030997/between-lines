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
    body: 'Fiction and narrative nonfiction - flash, short stories, and standalone excerpts.',
  },
  {
    icon: '3',
    title: 'Poetry',
    spec: '1-3 poems',
    body: 'A single poem or a short set; we suggest three to show a fuller sense of your voice.',
  },
  {
    icon: 'A',
    title: 'Illustration',
    spec: '1-3 works',
    body: 'Original illustration and visual storytelling - a small portfolio of your strongest pieces.',
  },
];

const benefits = [
  'An honorarium if selected - up to $50 for prose, up to $30 for poetry & illustration.',
  "That month's issue free, plus a BetweenLines Pick badge on your author page.",
  'You keep full copyright - all rights revert to you 90 days after the issue publishes.',
];

const selectionNotes = [
  {
    title: 'Editorial judgment',
    body: 'Chosen on craft and fit for the issue - not popularity, follower counts, or platform metrics.',
  },
  {
    title: 'No paid placement',
    body: 'You cannot buy a feature. The $5 fee covers reading and funds the honorarium pool.',
  },
  {
    title: 'Read here first',
    body: 'Debut your work before it appears anywhere else and earn the Read Here First distinction.',
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
        <div className="bls-hero-i">
          <p className="bls-eyebrow">The Monthly Curated Journal</p>
          <h1 id="betweenlines-title" className="bls-hero-title">
            Submit to <em>BetweenLines</em>
          </h1>
          <p className="bls-hero-sub">
            A reader-first literary journal &mdash; selected on quality and editorial fit, never
            metrics, never paid placement.
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
          <a className="bls-button bls-hero-cta" href="#journal-submission">
            Submit your work
            <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </section>

      <section className="bls-section">
        <div className="bls-wrap">
          <p className="bls-label">What we publish</p>
          <h2>Three streams, one standard</h2>
          <p className="bls-sub">
            Original, unpublished work in English, exclusive to BetweenLines - shaped,
            proofread, and ready for readers.
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

          <div className="bls-fee-strip" aria-label="Submission fee and what selected writers receive">
            <div className="bls-fee-strip-main">
              <span className="bls-fee-amount">$5</span>
              <span className="bls-fee-cap">per submission &middot; non-refundable &middot; funds the honorarium pool</span>
            </div>
            <ul className="bls-benefits">
              {benefits.map((benefit) => (
                <li key={benefit}>
                  <span aria-hidden="true">&#10003;</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bls-section">
        <div className="bls-wrap">
          <p className="bls-label">How selection works</p>
          <h2>Quality is the only criterion</h2>
          <p className="bls-sub">
            Our editorial team reads every submission. AI only surfaces pieces that might
            otherwise be missed - the choice is always human.
          </p>
          <div className="bls-ethos">
            {selectionNotes.map((note) => (
              <article key={note.title}>
                <h3>{note.title}</h3>
                <p>{note.body}</p>
              </article>
            ))}
          </div>

          <p className="bls-label bls-rights-label">The fine print</p>
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

      <section className="bls-section bls-section-form" id="journal-submission">
        <div className="bls-wrap">
          <p className="bls-label">Your submission</p>
          <h2>Send us your work</h2>
          <p className="bls-sub">
            One piece per submission. You&apos;ll confirm originality and agree to the terms
            above before paying.
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
            Are you a reader? <Link href="/read">Nominate a writer or a piece</Link> you love -
            the writer receives an invite to submit, and selection is always the editors&apos;
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
  --bls-paper: var(--theme-page-soft, #faf8f4);
  --bls-card: #ffffff;
  --bls-ink: var(--theme-text);
  --bls-muted: var(--theme-text-muted);
  --bls-faint: var(--theme-text-faint);
  --bls-line: #e7e2d8;
  --bls-yellow: var(--theme-yellow, #ffe600);
  --bls-gold: #a9842f;
  --bls-gold-soft: #f3ecda;
  --bls-green: #2e7d55;
  --bls-cta-bg: var(--theme-strong-cta-bg, #0e0e0c);
  --bls-cta-bg-hover: var(--theme-strong-cta-hover-bg, #000000);
  --bls-cta-fg: var(--theme-strong-cta-fg, #ffe600);
  --bls-accent-strong: var(--theme-accent-strong, #d4aa18);
  --bls-display: var(--bl-font-serif, "Playfair Display", Georgia, serif);
  --bls-sans: var(--bl-font-body, "Outfit", system-ui, sans-serif);
  --bls-eyebrow: var(--bl-font-eyebrow, "Outfit", system-ui, sans-serif);
  --bls-ease: var(--bl-ease, cubic-bezier(.22, 1, .36, 1));
  min-height: 100vh;
  background: var(--theme-page, #ffffff);
  color: var(--bls-ink);
  font-family: var(--bls-sans);
  font-size: 17px;
  line-height: 1.55;
  -webkit-font-smoothing: antialiased;
}

.bls-page :where(a, button, summary, input, select, textarea):focus-visible {
  outline: 2px solid var(--bls-accent-strong);
  outline-offset: 3px;
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
  background: var(--theme-yellow);
  padding: clamp(48px, 7vw, 92px) clamp(20px, 5vw, 40px) clamp(40px, 5vw, 64px);
}

.bls-hero-i {
  max-width: 860px;
  margin: 0 auto;
}

.bls-eyebrow {
  margin: 0 0 20px;
  font-family: var(--bls-eyebrow);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--theme-on-yellow);
  opacity: 0.6;
}

.bls-hero-title {
  margin: 0 0 22px;
  font-family: var(--bls-display);
  font-size: var(--bl-hero-title-size, clamp(40px, 5.6vw, 76px));
  font-weight: 800;
  line-height: 1.06;
  letter-spacing: -0.02em;
  color: var(--theme-on-yellow);
  text-wrap: balance;
}

.bls-hero-title em {
  font-style: italic;
}

.bls-hero-sub {
  margin: 0 0 28px;
  max-width: 580px;
  font-size: clamp(18px, 1.7vw, 21px);
  line-height: 1.6;
  color: var(--theme-on-yellow);
  opacity: 0.82;
  text-wrap: pretty;
}

.bls-label {
  margin: 0;
  font-size: 12px;
  letter-spacing: 1.4px;
  text-transform: uppercase;
  color: var(--bls-faint);
  font-weight: 800;
}

.bls-meta-row {
  display: flex;
  gap: 40px;
  margin: 0;
  flex-wrap: wrap;
}

.bls-meta-value {
  font-family: var(--bls-display);
  font-size: 30px;
  color: var(--theme-on-yellow);
  font-weight: 800;
}

.bls-meta-label {
  margin-top: 2px;
  color: var(--theme-on-yellow);
  opacity: 0.62;
  font-size: 13px;
  letter-spacing: 0.6px;
  text-transform: uppercase;
}

.bls-section {
  padding: 44px 0;
  border-bottom: 1px solid var(--bls-line);
}

.bls-section h2,
.bls-done h2 {
  font-family: var(--bls-display);
  font-size: clamp(28px, 3.6vw, 38px);
  line-height: 1.08;
  font-weight: 800;
  letter-spacing: -0.01em;
  margin: 10px 0 8px;
}

.bls-sub {
  color: var(--bls-muted);
  max-width: 640px;
  margin: 0 0 26px;
  font-size: clamp(17px, 1.3vw, 19px);
  line-height: 1.6;
}

.bls-streams,
.bls-ethos {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}

.bls-stream,
.bls-ethos article,
.bls-rights,
.bls-form-card,
.bls-done {
  background: var(--bls-card);
  border: 1px solid var(--bls-line);
  border-radius: 12px;
  box-shadow: 0 14px 30px -24px rgba(28, 26, 23, 0.5);
}

.bls-stream,
.bls-ethos article {
  padding: 24px;
}

.bls-stream-icon {
  width: 34px;
  height: 34px;
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
  font-size: 24px;
  margin: 12px 0 6px;
  font-weight: 700;
}

.bls-stream-spec {
  margin-bottom: 10px;
  color: var(--bls-gold);
  font-size: 15px;
  font-weight: 700;
}

.bls-stream p,
.bls-ethos p {
  color: var(--bls-muted);
  font-size: 17px;
  margin: 0;
}

.bls-fee-strip {
  margin-top: 20px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 28px;
  align-items: center;
  background: var(--bls-card);
  border: 1px solid var(--bls-line);
  border-radius: 12px;
  padding: 20px 24px;
  box-shadow: 0 14px 30px -24px rgba(28, 26, 23, 0.5);
}

.bls-fee-strip-main {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-right: 28px;
  border-right: 1px solid var(--bls-line);
}

.bls-fee-amount {
  font-family: var(--bls-display);
  font-weight: 900;
  font-size: 46px;
  line-height: 1;
}

.bls-fee-cap {
  color: var(--bls-muted);
  font-size: 15px;
  max-width: 200px;
}

.bls-benefits {
  list-style: none;
  padding: 0;
  margin: 0;
}

.bls-benefits li {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  padding: 6px 0;
  font-size: 17px;
}

.bls-benefits li > span:first-child {
  flex: 0 0 auto;
  color: var(--bls-green);
  font-weight: 900;
}

.bls-rights-label {
  margin-top: 28px;
  margin-bottom: 14px;
}

.bls-ethos h3 {
  margin: 0 0 6px;
  font-size: 18px;
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
  padding: 17px 0;
  font-size: 17.5px;
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
  transition: transform 200ms var(--bls-ease);
}

.bls-rights details[open] .bls-plus {
  transform: rotate(45deg);
}

.bls-rights p {
  max-width: 660px;
  margin: 0 0 18px;
  color: var(--bls-muted);
  font-size: 17px;
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
  font-size: 13.5px;
  font-weight: 700;
}

.bls-field label span,
.bls-file-label span {
  color: var(--bls-gold);
}

.bls-input {
  width: 100%;
  border: 1px solid var(--bls-line);
  border-radius: 10px;
  padding: 12px 13px;
  background: #fdfcfa;
  color: var(--bls-ink);
  font-family: var(--bls-sans);
  font-size: 16.5px;
  transition: border-color 180ms var(--bls-ease), box-shadow 180ms var(--bls-ease);
}

.bls-input:focus,
.bls-upload:focus-within {
  outline: none;
  border-color: var(--bls-accent-strong);
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
  border-radius: 10px;
  padding: 22px;
  background: #fdfcfa;
  color: var(--bls-muted);
  text-align: center;
  font-size: 15px;
  cursor: pointer;
  transition: border-color 180ms var(--bls-ease);
}

.bls-upload:hover {
  border-color: var(--bls-accent-strong);
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
  font-size: 15.5px;
}

.bls-checks input {
  flex: 0 0 auto;
  width: 16px;
  height: 16px;
  margin-top: 3px;
  accent-color: var(--bls-accent-strong);
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
  font-size: 15px;
}

.bls-total b {
  margin-left: 8px;
  color: var(--bls-ink);
  font-family: var(--bls-display);
  font-size: 22px;
}

.bls-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border: 0;
  border-radius: 999px;
  padding: 15px 34px;
  background: var(--bls-cta-bg);
  color: var(--bls-cta-fg);
  font-family: var(--bls-sans);
  font-size: 17px;
  font-weight: 800;
  letter-spacing: 0.2px;
  text-decoration: none;
  cursor: pointer;
  box-shadow: 0 14px 34px -14px rgba(14, 14, 12, 0.7);
  transition: transform 220ms var(--bls-ease), box-shadow 220ms var(--bls-ease),
    background 220ms var(--bls-ease);
}

.bls-button:hover,
.bls-button:focus-visible {
  background: var(--bls-cta-bg-hover);
  transform: translateY(-2px);
  box-shadow: 0 20px 42px -14px rgba(14, 14, 12, 0.75);
}

.bls-hero-cta {
  margin-top: 26px;
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
  padding: 38px 0 58px;
  text-align: center;
}

.bls-footnote p {
  max-width: 620px;
  margin: 0 auto 6px;
  color: var(--bls-muted);
  font-size: 17px;
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
  .bls-plus,
  .bls-button,
  .bls-input,
  .bls-upload {
    animation: none;
    transition: none;
  }
}

@media (max-width: 760px) {
  .bls-wrap {
    padding: 0 18px;
  }

  .bls-meta-row {
    gap: 22px 28px;
  }

  .bls-streams,
  .bls-ethos,
  .bls-form-row {
    grid-template-columns: 1fr;
  }

  .bls-fee-strip {
    grid-template-columns: 1fr;
    gap: 18px;
  }

  .bls-fee-strip-main {
    padding-right: 0;
    padding-bottom: 18px;
    border-right: 0;
    border-bottom: 1px solid var(--bls-line);
  }

  .bls-fee-cap {
    max-width: none;
  }

  .bls-form-card {
    padding: 24px;
  }

  .bls-section {
    padding: 42px 0;
  }
}
`;
