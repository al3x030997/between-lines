'use client';

import { useState } from 'react';

const STATS: { num: string; label: string }[] = [
  { num: 'Free', label: 'To take part' },
  { num: '3 ch', label: 'Minimum read' },
  { num: '25–50', label: 'Credits per read' },
  { num: '∞', label: 'Credits never expire' },
];

const STEPS: { num: string; title: string; body: string }[] = [
  {
    num: '01',
    title: 'Tell us what you read',
    body: 'Pick the genres, formats, and feedback style you like. We match you with manuscripts that fit your taste. No qualifications needed — just read carefully and respond honestly.',
  },
  {
    num: '02',
    title: 'Read the minimum',
    body: 'Every beta read is at least 3 chapters or 5,000 words, whichever comes first. Prefer the whole book? Opt in to full manuscripts. You choose what you commit to.',
  },
  {
    num: '03',
    title: 'Give feedback, earn credits',
    body: 'React, leave a quick comment, or write deep thoughts. Each response earns Swap Credits — 25 for a partial read, 50 for a full manuscript. Always free.',
  },
  {
    num: '04',
    title: 'Become an Early Discoverer',
    body: 'If a writer you beta read gets agented, shortlisted, or published, you are credited forever on their author page. It cannot be bought. Only earned.',
  },
];

const WAYS: { title: string; credit: string; body: string }[] = [
  {
    title: 'React',
    credit: '+2 credits',
    body: 'An emoji reaction plus 1–5 stars on plot, characters, pacing, writing, and emotional resonance — and whether you’d keep reading.',
  },
  {
    title: 'Quick Comment',
    credit: '+5 credits',
    body: 'One to three sentences on what worked, what didn’t, and what stood out.',
  },
  {
    title: 'Deep Thoughts',
    credit: '+10 credits',
    body: 'Open text or a voice note. Write or record as much as you like — the feedback writers remember.',
  },
];

const GENRES = [
  'Literary Fiction',
  'Romance',
  'Fantasy',
  'Science Fiction',
  'Thriller',
  'Mystery',
  'Historical',
  'Horror',
  'Young Adult',
  'Romantasy',
  'Poetry',
  'Non-fiction',
];

const COMMITMENTS: { id: string; title: string; desc: string }[] = [
  {
    id: 'partial',
    title: 'A few chapters',
    desc: 'The minimum — 3 chapters or 5,000 words. A quick, focused read.',
  },
  {
    id: 'full',
    title: 'Full manuscripts',
    desc: 'Go the distance and read whole books from first page to last.',
  },
  {
    id: 'either',
    title: 'Either — match me to anything',
    desc: 'Surprise me. I’ll take partial or full reads as they come.',
  },
];

const FEEDBACK = ['React', 'Quick Comment', 'Deep Thoughts'];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function BetaReadingHub() {
  const [step, setStep] = useState(0);
  const [genres, setGenres] = useState<string[]>([]);
  const [commitment, setCommitment] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string[]>([]);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const toggleGenre = (g: string) =>
    setGenres((p) => (p.includes(g) ? p.filter((x) => x !== g) : [...p, g]));
  const toggleFeedback = (f: string) =>
    setFeedback((p) => (p.includes(f) ? p.filter((x) => x !== f) : [...p, f]));

  const emailValid = EMAIL_RE.test(email.trim());
  const canContinue = step === 0 ? genres.length > 0 : commitment !== null;
  const canSubmit = feedback.length > 0 && emailValid;

  return (
    <div className="br-beta-hub">
      {/* hero — what beta reading is */}
      <section className="br-beta-hero">
        <p className="br-beta-hero-eyebrow">SecureBetaReads · Beta reading</p>
        <h1 className="br-beta-hero-title">Read it before the world does.</h1>
        <p className="br-beta-hero-lede">
          A beta reader is a writer’s first real audience. Read unpublished manuscripts from emerging
          authors, give honest, structured feedback, and help shape a book while it’s still forming —
          earning Swap Credits and Early Discoverer status as you go. Always free.
        </p>
        <div className="br-beta-stats">
          {STATS.map((s) => (
            <div key={s.label}>
              <div className="br-beta-stat-num">{s.num}</div>
              <div className="br-beta-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* volunteer intake flow — sits directly under the hero */}
      <section className="br-beta-block">
        <div className="br-beta-sec-head">
          <p className="br-beta-sec-eyebrow">Volunteer</p>
          <h2 className="br-beta-sec-title">Get matched with a writer who needs you</h2>
          <p className="br-beta-sec-sub">
            Beta reading is always free — no plan, no upgrade. Tell us what you love to read and we’ll
            email you the moment an author is searching for a beta reader like you.
          </p>
        </div>

        <div className="br-beta-intake">
          {submitted ? (
            <div className="br-beta-intake-done">
              <span className="br-beta-intake-done-mark" aria-hidden="true">✓</span>
              <h3 className="br-beta-intake-done-title">You’re on the list.</h3>
              <p className="br-beta-intake-done-body">
                We’ll email you at <strong>{email.trim()}</strong> the moment an author is looking for
                a beta reader who loves what you do. No upgrade, no fee — beta reading stays free and
                earns the most Swap Credits on the platform.
              </p>
              {genres.length > 0 && (
                <div className="br-beta-intake-done-recap">
                  {genres.map((g) => (
                    <span className="br-beta-intake-done-tag" key={g}>
                      {g}
                    </span>
                  ))}
                </div>
              )}
              <button
                type="button"
                className="br-beta-intake-reset"
                onClick={() => {
                  setSubmitted(false);
                  setStep(0);
                }}
              >
                Edit my preferences
              </button>
            </div>
          ) : (
            <>
              <div className="br-beta-intake-head">
                <div className="br-beta-intake-progress" aria-hidden="true">
                  {[0, 1, 2].map((i) => (
                    <span key={i} className={`br-beta-intake-seg${i <= step ? ' is-on' : ''}`} />
                  ))}
                </div>
                <span className="br-beta-intake-step">Question {step + 1} of 3</span>
              </div>

              {step === 0 && (
                <div>
                  <h3 className="br-beta-intake-q">What do you love to read?</h3>
                  <p className="br-beta-intake-hint">
                    Pick the genres you’d happily beta read. Choose as many as you like.
                  </p>
                  <div className="br-beta-intake-chips">
                    {GENRES.map((g) => (
                      <button
                        key={g}
                        type="button"
                        aria-pressed={genres.includes(g)}
                        className={`br-beta-intake-chip${genres.includes(g) ? ' is-on' : ''}`}
                        onClick={() => toggleGenre(g)}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 1 && (
                <div>
                  <h3 className="br-beta-intake-q">How much will you commit to?</h3>
                  <p className="br-beta-intake-hint">
                    You can change this anytime — and read more whenever you want.
                  </p>
                  <div className="br-beta-intake-opts">
                    {COMMITMENTS.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        aria-pressed={commitment === c.id}
                        className={`br-beta-intake-opt${commitment === c.id ? ' is-on' : ''}`}
                        onClick={() => setCommitment(c.id)}
                      >
                        <span className="br-beta-intake-opt-title">{c.title}</span>
                        <span className="br-beta-intake-opt-desc">{c.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h3 className="br-beta-intake-q">How do you like to give feedback?</h3>
                  <p className="br-beta-intake-hint">
                    Pick the styles that suit you — every one earns Swap Credits.
                  </p>
                  <div className="br-beta-intake-chips">
                    {FEEDBACK.map((f) => (
                      <button
                        key={f}
                        type="button"
                        aria-pressed={feedback.includes(f)}
                        className={`br-beta-intake-chip${feedback.includes(f) ? ' is-on' : ''}`}
                        onClick={() => toggleFeedback(f)}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                  <label className="br-beta-intake-field">
                    <span className="br-beta-intake-label">Where should we email you?</span>
                    <input
                      className="br-beta-intake-input"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      placeholder="you@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </label>
                </div>
              )}

              <div className="br-beta-intake-actions">
                {step > 0 ? (
                  <button
                    type="button"
                    className="br-beta-intake-btn is-ghost"
                    onClick={() => setStep((s) => s - 1)}
                  >
                    ← Back
                  </button>
                ) : (
                  <span />
                )}
                {step < 2 ? (
                  <button
                    type="button"
                    className="br-beta-intake-btn is-primary"
                    disabled={!canContinue}
                    onClick={() => setStep((s) => s + 1)}
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    type="button"
                    className="br-beta-intake-btn is-primary"
                    disabled={!canSubmit}
                    onClick={() => setSubmitted(true)}
                  >
                    Join the beta reader list
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </section>

      {/* how it works */}
      <section className="br-beta-block">
        <div className="br-beta-sec-head">
          <p className="br-beta-sec-eyebrow">How it works</p>
          <h2 className="br-beta-sec-title">From reader to first audience in four steps</h2>
          <p className="br-beta-sec-sub">
            Beta reading is free — and it’s the activity that earns the most Swap Credits on the
            platform. Here’s the whole loop.
          </p>
        </div>
        <div className="br-beta-how-grid">
          {STEPS.map((s) => (
            <div className="br-beta-step" key={s.num}>
              <div className="br-beta-step-num">{s.num}</div>
              <h3 className="br-beta-step-title">{s.title}</h3>
              <p className="br-beta-step-body">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* three ways to respond */}
      <section className="br-beta-block">
        <div className="br-beta-sec-head">
          <p className="br-beta-sec-eyebrow">Your feedback</p>
          <h2 className="br-beta-sec-title">Three ways to respond</h2>
          <p className="br-beta-sec-sub">
            Choose the depth that suits you and the work. Every level earns Swap Credits and goes
            straight to the writer.
          </p>
        </div>
        <div className="br-beta-ways">
          {WAYS.map((w) => (
            <div className="br-beta-way" key={w.title}>
              <div className="br-beta-way-top">
                <h3 className="br-beta-way-title">{w.title}</h3>
                <span className="br-beta-way-credit">{w.credit}</span>
              </div>
              <p className="br-beta-way-body">{w.body}</p>
            </div>
          ))}
        </div>
        <p className="br-beta-note">
          <span className="br-beta-note-mark" aria-hidden="true">🔒</span>
          <span>
            <strong>Every manuscript is protected.</strong> Beta readers agree to confidentiality on
            opt-in — copy is disabled, and we never train AI on the work.
          </span>
        </p>
      </section>
    </div>
  );
}
