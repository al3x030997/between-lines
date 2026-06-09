'use client';

import { useState } from 'react';
import { track } from '@vercel/analytics';
import type { IntakePayload } from '@/lib/schemas';
import { INTAKE_CSS } from '../../v8/intake/intakeCss';
import { Chip, Chips, Group, Prompt, ToggleChip } from '../../v8/intake/shared/intakeAtoms';
import {
  READER_INITIAL,
  type ReaderAnswers,
  AUDIENCES,
  GENRES_PRIMARY,
  GENRES_MORE,
  LENGTHS,
  REACTIONS,
  GENRE_CAP,
} from '../../v8/intake/ReaderForm';
import {
  WRITER_INITIAL,
  serializeWriter,
  type WriterAnswers,
} from '../../v8/intake/writer/writerTypes';
import {
  PRACTICE,
  JOURNEY,
  PUB_ROUTE,
  AGENT_STAGE,
  MS_STAGE,
  FICTION_GENRES_PRIMARY,
  FICTION_GENRES_MORE,
} from '../../v8/intake/writer/writerConstants';

export type IntakeRegion = 'reader' | 'writer';
type Step = 'hook' | 'email' | 'more' | 'pending';

type Props = {
  initialMode?: IntakeRegion;
  onBack?: () => void;
};

// Build the (possibly partial) intake payload from whatever's answered so far.
// The reader/writer Zod schemas accept empty arrays / null, so the same builder
// works for both the early email POST and the post-email enrichment POST.
function buildIntake(
  mode: IntakeRegion,
  reader: ReaderAnswers,
  writer: WriterAnswers,
): IntakePayload {
  return mode === 'reader'
    ? { region: 'reader', intent: 'now', answers: reader }
    : { region: 'writer', answers: serializeWriter(writer) };
}

export default function IntakeFlow({ initialMode = 'reader', onBack }: Props) {
  const [mode, setMode] = useState<IntakeRegion>(initialMode);
  const [step, setStep] = useState<Step>('hook');
  const [reader, setReader] = useState<ReaderAnswers>(READER_INITIAL);
  const [writer, setWriter] = useState<WriterAnswers>(WRITER_INITIAL);
  const [moreOpen, setMoreOpen] = useState(false);

  // Email step state.
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState(''); // honeypot
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // --- Reader hook helpers -------------------------------------------------
  const genreAtCap = reader.genres.length >= GENRE_CAP;
  const toggleGenre = (g: string) => {
    const has = reader.genres.includes(g);
    if (has) {
      setReader({ ...reader, genres: reader.genres.filter((x) => x !== g) });
    } else if (!genreAtCap) {
      setReader({ ...reader, genres: [...reader.genres, g] });
    }
  };
  const toggleLength = (l: string) => {
    const has = reader.lengths.includes(l);
    setReader({
      ...reader,
      lengths: has ? reader.lengths.filter((x) => x !== l) : [...reader.lengths, l],
    });
  };

  // --- Writer hook helpers -------------------------------------------------
  const [wMoreOpen, setWMoreOpen] = useState(false);
  const writerGenreAtCap = writer.genre.fictionPrimary.length >= GENRE_CAP;
  const setPractice = (p: WriterAnswers['practice']) =>
    setWriter({ ...writer, practice: p });
  const setGenre = (next: WriterAnswers['genre']) =>
    setWriter({ ...writer, genre: next });
  const toggleFiction = (g: string) => {
    const has = writer.genre.fictionPrimary.includes(g);
    if (has) {
      setGenre({
        ...writer.genre,
        fictionPrimary: writer.genre.fictionPrimary.filter((x) => x !== g),
      });
    } else if (!writerGenreAtCap) {
      setGenre({ ...writer.genre, fictionPrimary: [...writer.genre.fictionPrimary, g] });
    }
  };

  // --- Step gating ---------------------------------------------------------
  const hookReady =
    mode === 'reader'
      ? reader.audience !== null
      : writer.practice !== null && writer.journey !== null;

  const canSubmitEmail = email.trim().length > 0 && consent && !submitting;

  // --- Email submit: persist immediately, then advance (no redirect) -------
  const submitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmitEmail) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          consent: true,
          website,
          intake: buildIntake(mode, reader, writer),
        }),
      });
      track('waitlist_submit', { ok: res.ok, region: mode });
      if (!res.ok) {
        setError(
          res.status === 429
            ? 'Too many attempts. Please try again in a few minutes.'
            : 'Something went wrong. Please try again.',
        );
        return;
      }
      const data = (await res.json().catch(() => ({}))) as { insider?: boolean };
      // insider === true means the cookie is set and we can enrich after.
      // Otherwise Kit is reconciling via email — show the check-inbox state.
      setStep(data.insider ? 'more' : 'pending');
    } catch {
      track('waitlist_submit', { ok: false, region: mode });
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // --- Post-email enrichment: attach the fuller answers via the cookie -----
  const enrichAndGo = async () => {
    try {
      await fetch('/api/waitlist/intake', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ intake: buildIntake(mode, reader, writer) }),
      });
    } catch {
      // Best-effort — the partial intake is already saved from the email step.
    }
    window.location.assign('/insider');
  };

  const skipToInsider = () => window.location.assign('/insider');

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: INTAKE_CSS }} />
      <style dangerouslySetInnerHTML={{ __html: FLOW_CSS }} />
      <div className="v8-intake" role="region" aria-label="Get started">
        {onBack && step === 'hook' && (
          <button type="button" className="v8-intake-back" onClick={onBack}>
            <span aria-hidden="true">←</span> back
          </button>
        )}

        {/* Step rail */}
        <ol className="v12-steps" aria-label="Progress">
          {(['hook', 'email', 'more'] as const).map((s, i) => {
            const order: Step[] = ['hook', 'email', 'more'];
            const currentIdx = step === 'pending' ? 2 : order.indexOf(step);
            const state = i < currentIdx ? 'done' : i === currentIdx ? 'current' : 'todo';
            const labels = ['You', 'Email', 'A bit more'];
            return (
              <li key={s} className={`v12-step is-${state}`}>
                <span className="v12-step-dot" aria-hidden="true">
                  {state === 'done' ? '✓' : i + 1}
                </span>
                <span className="v12-step-label">{labels[i]}</span>
              </li>
            );
          })}
        </ol>

        {/* Role toggle — modern segmented control, locked after email capture */}
        {step === 'hook' && (
          <div
            className={`v12-seg${mode === 'reader' ? ' is-reader' : ''}`}
            role="tablist"
            aria-label="Choose your path"
          >
            <span className="v12-seg-thumb" aria-hidden="true" />
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'writer'}
              className={`v12-seg-btn${mode === 'writer' ? ' is-active' : ''}`}
              onClick={() => setMode('writer')}
            >
              Writer first
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'reader'}
              className={`v12-seg-btn${mode === 'reader' ? ' is-active' : ''}`}
              onClick={() => setMode('reader')}
            >
              Reader first
            </button>
          </div>
        )}

        {/* ============ STEP 1 — HOOK ============ */}
        {step === 'hook' && (
          <div className="v8-intake-form" key={`hook-${mode}`}>
            {mode === 'reader' ? (
              <>
                <Group num="01" label="Audience">
                  <Prompt>What do you read?</Prompt>
                  <Chips>
                    {AUDIENCES.map((a) => (
                      <Chip
                        key={a}
                        selected={reader.audience === a}
                        onClick={() => setReader({ ...reader, audience: a })}
                      >
                        {a}
                      </Chip>
                    ))}
                  </Chips>
                </Group>

                <Group num="02" label="Genres">
                  <Prompt>Pick up to three you keep coming back to.</Prompt>
                  <Chips>
                    {GENRES_PRIMARY.map((g) => {
                      const selected = reader.genres.includes(g);
                      return (
                        <Chip
                          key={g}
                          selected={selected}
                          disabled={!selected && genreAtCap}
                          onClick={() => toggleGenre(g)}
                        >
                          {g}
                        </Chip>
                      );
                    })}
                    <button
                      type="button"
                      className={`v8-chip is-more${moreOpen ? ' is-open' : ''}`}
                      aria-expanded={moreOpen}
                      onClick={() => setMoreOpen((v) => !v)}
                    >
                      {moreOpen ? 'Less' : 'More…'}
                    </button>
                  </Chips>
                  <div className={`v8-intake-expand${moreOpen ? ' is-open' : ''}`}>
                    <div className="v8-intake-expand-inner">
                      <div className="v8-intake-chips">
                        {GENRES_MORE.map((g) => {
                          const selected = reader.genres.includes(g);
                          return (
                            <Chip
                              key={g}
                              selected={selected}
                              disabled={!selected && genreAtCap}
                              onClick={() => toggleGenre(g)}
                            >
                              {g}
                            </Chip>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </Group>
              </>
            ) : (
              <>
                <Group num="01" label="Practice">
                  <Prompt>What do you create?</Prompt>
                  <Chips>
                    {Object.entries(PRACTICE).map(([key, label]) => (
                      <Chip
                        key={key}
                        selected={writer.practice === key}
                        onClick={() => setPractice(key as WriterAnswers['practice'])}
                      >
                        {label}
                      </Chip>
                    ))}
                  </Chips>
                </Group>

                {writer.practice !== 'illustration' && (
                  <Group num="02" label="Genres">
                    <Prompt>What genres? Pick up to three — or open to all.</Prompt>
                    <Chips>
                      {FICTION_GENRES_PRIMARY.map((g) => {
                        const selected = writer.genre.fictionPrimary.includes(g);
                        return (
                          <Chip
                            key={g}
                            selected={selected}
                            disabled={!selected && writerGenreAtCap}
                            onClick={() => toggleFiction(g)}
                          >
                            {g}
                          </Chip>
                        );
                      })}
                      <button
                        type="button"
                        className={`v8-chip is-more${wMoreOpen ? ' is-open' : ''}`}
                        aria-expanded={wMoreOpen}
                        onClick={() => setWMoreOpen((v) => !v)}
                      >
                        {wMoreOpen ? 'Less' : 'More…'}
                      </button>
                    </Chips>
                    <div className={`v8-intake-expand${wMoreOpen ? ' is-open' : ''}`}>
                      <div className="v8-intake-expand-inner">
                        <div className="v8-intake-chips">
                          {FICTION_GENRES_MORE.map((g) => {
                            const selected = writer.genre.fictionPrimary.includes(g);
                            return (
                              <Chip
                                key={g}
                                selected={selected}
                                disabled={!selected && writerGenreAtCap}
                                onClick={() => toggleFiction(g)}
                              >
                                {g}
                              </Chip>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                    <ToggleChip
                      on={writer.genre.openToAll}
                      onClick={() =>
                        setGenre({ ...writer.genre, openToAll: !writer.genre.openToAll })
                      }
                    >
                      I&rsquo;m open to all genres
                    </ToggleChip>
                  </Group>
                )}

                <Group num="03" label="Journey">
                  <Prompt>Where are you on your writing journey?</Prompt>
                  <Chips>
                    {Object.entries(JOURNEY).map(([key, label]) => (
                      <Chip
                        key={key}
                        selected={writer.journey === key}
                        onClick={() =>
                          setWriter({ ...writer, journey: key as WriterAnswers['journey'] })
                        }
                      >
                        {label}
                      </Chip>
                    ))}
                  </Chips>
                </Group>
              </>
            )}

            <div className="v8-intake-actions">
              <button
                type="button"
                className="v8-cta v8-cta-primary"
                disabled={!hookReady}
                onClick={() => setStep('email')}
              >
                Continue
                <span className="v8-cta-arrow" aria-hidden="true">→</span>
              </button>
            </div>
            <p className="v8-intake-caption">
              Just one question first. You&rsquo;ll grab your spot next — the rest you can set in
              your profile any time.
            </p>
          </div>
        )}

        {/* ============ STEP 2 — EMAIL ============ */}
        {step === 'email' && (
          <div className="v8-intake-form" key="email">
            <Group num="03" label="Save your spot">
              <Prompt>Save your spot.</Prompt>
            </Group>
            <p className="v12-email-pitch">
              {mode === 'reader'
                ? 'Drop your email to lock in your three free reads — then a couple of quick taps to tune your feed.'
                : 'Drop your email to start your creator profile — then a couple of quick taps and you’re set.'}
            </p>

            <form className="v12-email-form" onSubmit={submitEmail} noValidate>
              <label className="v12-email-field">
                <span className="v8-intake-sublabel">Email</span>
                <input
                  type="email"
                  inputMode="email"
                  spellCheck={false}
                  autoCapitalize="none"
                  className="v12-email-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@somewhere.com"
                  autoComplete="email"
                  required
                />
              </label>

              {/* Honeypot — humans never see this. */}
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
                aria-hidden="true"
              />

              <label className="v12-email-consent">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  required
                />
                <span>
                  I agree to receive launch updates from Between Reads and to the processing
                  described in our{' '}
                  <a href="/privacy" target="_blank" rel="noopener">
                    Privacy Policy
                  </a>
                  . Unsubscribe anytime.
                </span>
              </label>

              {error && <p className="v12-email-error">{error}</p>}

              <div className="v8-intake-actions">
                <button
                  type="button"
                  className="v8-cta v8-cta-secondary"
                  onClick={() => setStep('hook')}
                >
                  <span aria-hidden="true">←</span> Back
                </button>
                <button
                  type="submit"
                  className="v8-cta v8-cta-primary"
                  disabled={!canSubmitEmail}
                >
                  {submitting ? 'Saving…' : 'Save my spot'}
                  <span className="v8-cta-arrow" aria-hidden="true">→</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ============ STEP 3 — A BIT MORE ============ */}
        {step === 'more' && (
          <div className="v8-intake-form" key="more">
            <div className="v12-saved" role="status">
              <span className="v12-saved-tick" aria-hidden="true">✓</span>
              <span>
                You&rsquo;re in — saved <strong>{email}</strong>. A couple more, then you&rsquo;re
                off.
              </span>
            </div>

            {mode === 'reader' ? (
              <>
                <Group num="04" label="Length">
                  <Prompt>What length do you like to read?</Prompt>
                  <Chips>
                    {LENGTHS.map((l) => (
                      <Chip
                        key={l}
                        selected={reader.lengths.includes(l)}
                        onClick={() => toggleLength(l)}
                      >
                        {l}
                      </Chip>
                    ))}
                  </Chips>
                </Group>
                <Group num="05" label="Reaction">
                  <Prompt>How will you respond after reading?</Prompt>
                  <Chips>
                    {REACTIONS.map((r) => (
                      <Chip
                        key={r}
                        selected={reader.reaction === r}
                        onClick={() => setReader({ ...reader, reaction: r })}
                      >
                        {r}
                      </Chip>
                    ))}
                  </Chips>
                </Group>
              </>
            ) : writer.practice !== 'prose' ? (
              <Group num="04" label="Almost there">
                <Prompt>You&rsquo;re all set.</Prompt>
                <p className="v8-intake-caption">
                  {writer.practice === 'poetry' ? 'Poetry' : 'Illustration'} goes live fast — a
                  light spot-check, no heavy gate. Add any extra details from your creator profile
                  whenever you like.
                </p>
              </Group>
            ) : (
              <>
                <Group num="04" label="Publishing route">
                  <Prompt>How do you plan to publish?</Prompt>
                  <Chips>
                    {Object.entries(PUB_ROUTE).map(([key, label]) => (
                      <Chip
                        key={key}
                        selected={writer.pubRoute === key}
                        onClick={() =>
                          setWriter({ ...writer, pubRoute: key as WriterAnswers['pubRoute'] })
                        }
                      >
                        {label}
                      </Chip>
                    ))}
                  </Chips>
                  {writer.pubRoute === 'traditional' && (
                    <div className="v8-intake-subgroup">
                      <span className="v8-intake-sublabel">Agent stage</span>
                      <Chips>
                        {Object.entries(AGENT_STAGE).map(([key, label]) => (
                          <Chip
                            key={key}
                            selected={writer.agentStage === key}
                            onClick={() =>
                              setWriter({
                                ...writer,
                                agentStage: key as WriterAnswers['agentStage'],
                              })
                            }
                          >
                            {label}
                          </Chip>
                        ))}
                      </Chips>
                    </div>
                  )}
                </Group>
                <Group num="05" label="Manuscript stage">
                  <Prompt>Where&rsquo;s your manuscript right now?</Prompt>
                  <Chips>
                    {Object.entries(MS_STAGE).map(([key, label]) => (
                      <Chip
                        key={key}
                        selected={writer.manuscriptStage === key}
                        onClick={() =>
                          setWriter({
                            ...writer,
                            manuscriptStage: key as WriterAnswers['manuscriptStage'],
                          })
                        }
                      >
                        {label}
                      </Chip>
                    ))}
                  </Chips>
                </Group>
              </>
            )}

            <div className="v8-intake-actions">
              <button type="button" className="v8-cta v8-cta-secondary" onClick={skipToInsider}>
                Skip for now
              </button>
              <button type="button" className="v8-cta v8-cta-primary" onClick={enrichAndGo}>
                {mode === 'reader' ? 'Start reading' : 'Go to my profile'}
                <span className="v8-cta-arrow" aria-hidden="true">→</span>
              </button>
            </div>
            <p className="v8-intake-caption">
              <strong>Everything else</strong> — favorite books, reading routine, beta-reader pool —
              lives in your profile. Set it whenever you like.
            </p>
          </div>
        )}

        {/* ============ PENDING — Kit reconciling via email ============ */}
        {step === 'pending' && (
          <div className="v8-intake-form" key="pending">
            <Group num="" label="Check your email">
              <Prompt>Check your email.</Prompt>
            </Group>
            <p className="v12-email-pitch">
              We sent a confirmation link to <strong>{email}</strong>. Click it and we&rsquo;ll send
              your private insider link.
            </p>
            {onBack && (
              <div className="v8-intake-actions">
                <button type="button" className="v8-cta v8-cta-secondary" onClick={onBack}>
                  Done
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

const FLOW_CSS = `
/* Prompt text: black + bold + larger instead of the small yellow accent */
.v8-intake .v8-intake-prompt {
  color: var(--v6-text-strong);
  font-weight: 800;
  font-size: clamp(19px, 2.2vw, 24px);
  line-height: 1.2;
  margin-bottom: 8px;
}
.v8-intake .v8-intake-prompt-num {
  font-size: 0.8em;
}

/* === Colorful tags (rotating palette) === */
.v8-intake .v8-intake-chips .v8-chip:not(.is-more) {
  background: var(--cs, var(--theme-surface-muted));
  border-color: color-mix(in srgb, var(--c, var(--v6-divider)) 36%, transparent);
  color: var(--c, var(--v6-text-strong));
  font-weight: 600;
}
.v8-intake .v8-intake-chips .v8-chip:not(.is-more):hover {
  border-color: var(--c, var(--v6-accent));
  background: color-mix(in srgb, var(--c, var(--v6-accent)) 16%, var(--theme-surface));
}
.v8-intake .v8-intake-chips .v8-chip:not(.is-more).is-selected {
  background: var(--c, var(--v6-accent));
  border-color: var(--c, var(--v6-accent));
  color: #fff;
}
.v8-intake .v8-intake-chips .v8-chip:not(.is-more):nth-of-type(6n+1) { --c: #d6455d; --cs: #fdeaee; }
.v8-intake .v8-intake-chips .v8-chip:not(.is-more):nth-of-type(6n+2) { --c: #b9760a; --cs: #fbf0d8; }
.v8-intake .v8-intake-chips .v8-chip:not(.is-more):nth-of-type(6n+3) { --c: #0d8c7d; --cs: #e1f5f1; }
.v8-intake .v8-intake-chips .v8-chip:not(.is-more):nth-of-type(6n+4) { --c: #4f56c9; --cs: #ebecfc; }
.v8-intake .v8-intake-chips .v8-chip:not(.is-more):nth-of-type(6n+5) { --c: #4f8a2b; --cs: #eef6e5; }
.v8-intake .v8-intake-chips .v8-chip:not(.is-more):nth-of-type(6n+6) { --c: #9148c4; --cs: #f4e9fb; }

/* === Modern segmented toggle === */
.v12-seg {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: stretch;
  gap: 0;
  padding: 4px;
  margin: 0 auto 8px;
  width: 100%;
  max-width: 380px;
  background: var(--theme-surface-muted);
  border: 1px solid var(--v6-divider);
  border-radius: 999px;
  isolation: isolate;
}
.v12-seg-thumb {
  position: absolute;
  z-index: 0;
  top: 4px;
  bottom: 4px;
  left: 4px;
  width: calc(50% - 4px);
  border-radius: 999px;
  background: var(--theme-surface, #fff);
  box-shadow: 0 1px 2px rgb(var(--theme-shadow-rgb, 0 0 0) / 0.10),
              0 2px 10px rgb(var(--theme-shadow-rgb, 0 0 0) / 0.07);
  transition: transform 280ms var(--v6-ease);
}
.v12-seg.is-reader .v12-seg-thumb { transform: translateX(100%); }
.v12-seg-btn {
  position: relative;
  z-index: 1;
  appearance: none;
  background: transparent;
  border: 0;
  cursor: pointer;
  padding: 11px 16px;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: clamp(14px, 1.5vw, 16px);
  font-weight: 800;
  letter-spacing: -0.01em;
  color: var(--v6-text-muted);
  transition: color 200ms var(--v6-ease);
  -webkit-tap-highlight-color: transparent;
}
.v12-seg-btn.is-active { color: var(--v6-text-strong); }
.v12-seg-btn:hover { color: var(--v6-text-strong); }

.v12-steps {
  list-style: none;
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  padding: 0;
  flex-wrap: wrap;
}
.v12-step {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  opacity: 0.5;
  transition: opacity 200ms var(--v6-ease);
}
.v12-step + .v12-step::before {
  content: '';
  width: 18px;
  height: 1px;
  background: var(--v6-divider);
  margin-right: 8px;
}
.v12-step.is-current, .v12-step.is-done { opacity: 1; }
.v12-step-dot {
  width: 22px;
  height: 22px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 12px;
  font-weight: 700;
  border: 1px solid var(--v6-divider);
  color: var(--v6-text-muted);
  background: transparent;
}
.v12-step.is-current .v12-step-dot {
  border-color: var(--v6-accent);
  color: var(--theme-accent-contrast);
  background: var(--v6-accent);
}
.v12-step.is-done .v12-step-dot {
  border-color: var(--v6-accent);
  color: var(--v6-accent);
}
.v12-step-label {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--v6-text-strong);
}

.v12-email-pitch {
  font-family: 'Outfit', sans-serif;
  font-size: 15.5px;
  line-height: 1.55;
  color: var(--v6-text-muted);
  margin: -16px 0 0;
  max-width: 46ch;
  text-wrap: pretty;
}
.v12-email-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.v12-email-field { display: flex; flex-direction: column; gap: 6px; max-width: 420px; }
.v12-email-input {
  font-family: 'Outfit', sans-serif;
  font-weight: 500;
  font-size: 16px;
  padding: 13px 16px;
  border: 1px solid var(--v6-divider);
  border-radius: 10px;
  background: var(--theme-surface-raised, var(--theme-surface-muted));
  color: var(--v6-text-strong);
  width: 100%;
  transition: border-color 160ms var(--v6-ease), background 160ms var(--v6-ease);
}
.v12-email-input:focus {
  outline: none;
  border-color: var(--v6-accent);
  background: var(--v6-accent-soft);
}
.v12-email-consent {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-family: 'Outfit', sans-serif;
  font-size: 13px;
  line-height: 1.45;
  color: var(--v6-text-muted);
  cursor: pointer;
  max-width: 52ch;
}
.v12-email-consent input[type="checkbox"] {
  margin-top: 3px;
  width: 16px;
  height: 16px;
  flex: 0 0 auto;
  accent-color: var(--v6-accent);
  cursor: pointer;
}
.v12-email-consent a { color: inherit; text-decoration: underline; text-underline-offset: 2px; }
.v12-email-consent a:hover { color: var(--v6-accent); }
.v12-email-error {
  font-family: 'Outfit', sans-serif;
  font-size: 13px;
  color: var(--v6-accent);
  margin: 0;
}

.v12-saved {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  border-left: 2px solid var(--v6-accent);
  background: var(--v6-accent-soft);
  border-radius: 0 8px 8px 0;
  font-family: 'Outfit', sans-serif;
  font-size: 14px;
  line-height: 1.45;
  color: var(--v6-text-strong);
}
.v12-saved strong { font-weight: 600; }
.v12-saved-tick {
  flex: 0 0 auto;
  width: 24px;
  height: 24px;
  border-radius: 999px;
  background: var(--v6-accent);
  color: var(--theme-accent-contrast);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
}
`;
