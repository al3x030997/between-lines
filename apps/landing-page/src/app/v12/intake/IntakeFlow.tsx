'use client';

import { useState, type ReactNode } from 'react';
import { track } from '@vercel/analytics';
import { INTAKE_CSS } from '../../v8/intake/intakeCss';
import { Chip, Chips, ExpandRow, Group, Prompt } from '../../v8/intake/shared/intakeAtoms';
import {
  type IntakeRole,
  ROLES,
  ROLE_TAB_LABEL,
  ROLE_NOUN,
  GENRES_PRIMARY,
  GENRES_MORE,
  FORMATS,
  FORMAT_TIP,
  READER_WHENS,
  MOODS,
  POET_FORMS_PRIMARY,
  POET_FORMS_MORE,
  POET_THEMES_PRIMARY,
  POET_THEMES_MORE,
  ILLO_MEDIUMS,
  ILLO_STYLES,
  ILLO_USES,
  CREDITS,
  goalsFor,
  type Goal,
  stageOptions,
  LINK_PLACEHOLDER,
  MAX_LINKS,
  BIO_WORD_CAP,
  WHY_WORD_CAP,
  wordCount,
  isValidLink,
  type ReaderState,
  READER_STATE_INITIAL,
  type CreatorState,
  CREATOR_STATE_INITIAL,
  readerReady,
  creatorReady,
  buildIntake,
} from './roleData';

// Kept as `IntakeRegion` for the existing IntakeDialog / start-page callers,
// which import this type and pass `initialMode`. It now spans all four roles.
export type IntakeRegion = IntakeRole;

type Step = 'profile' | 'pending';

type Props = {
  initialMode?: IntakeRole;
  onBack?: () => void;
};

// Toggle a value in/out of a list, with an optional selection cap.
function toggle(list: string[], value: string, cap?: number): string[] {
  if (list.includes(value)) return list.filter((v) => v !== value);
  if (cap && list.length >= cap) return list;
  return [...list, value];
}

export default function IntakeFlow({ initialMode = 'reader', onBack }: Props) {
  const [role, setRole] = useState<IntakeRole>(initialMode);
  const [step, setStep] = useState<Step>('profile');
  const [reader, setReader] = useState<ReaderState>(READER_STATE_INITIAL);
  const [creator, setCreator] = useState<CreatorState>(CREATOR_STATE_INITIAL);

  // "More…" expanders.
  const [moreGenres, setMoreGenres] = useState(false);
  const [morePoetForms, setMorePoetForms] = useState(false);
  const [morePoetThemes, setMorePoetThemes] = useState(false);

  // Email step state.
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState(''); // honeypot
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const isCreator = role !== 'reader';
  const setR = (patch: Partial<ReaderState>) => setReader((s) => ({ ...s, ...patch }));
  const setC = (patch: Partial<CreatorState>) => setCreator((s) => ({ ...s, ...patch }));

  const hookReady = role === 'reader' ? readerReady(reader) : creatorReady(role, creator);
  const canSubmitEmail = email.trim().length > 0 && consent && !submitting;

  const bioWords = wordCount(creator.bio);
  const bioOver = bioWords > BIO_WORD_CAP;
  const whyWords = wordCount(reader.bookWhy);
  const whyOver = whyWords > WHY_WORD_CAP;

  const submitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hookReady || !canSubmitEmail) return;
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
          intake: buildIntake(role, reader, creator),
        }),
      });
      track('waitlist_submit', { ok: res.ok, region: role });
      if (!res.ok) {
        setError(
          res.status === 429
            ? 'Too many attempts. Please try again in a few minutes.'
            : 'Something went wrong. Please try again.',
        );
        return;
      }
      const data = (await res.json().catch(() => ({}))) as { insider?: boolean };
      // insider === true means the cookie is set and we can go straight in.
      // Otherwise Kit is reconciling via email — show the check-inbox state.
      if (data.insider) {
        window.location.assign('/insider');
      } else {
        setStep('pending');
      }
    } catch {
      track('waitlist_submit', { ok: false, region: role });
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // --- Small building blocks ---------------------------------------------

  const multiChips = (
    options: string[],
    selected: string[],
    onToggle: (v: string) => void,
    cap?: number,
  ): ReactNode =>
    options.map((o) => {
      const isSel = selected.includes(o);
      return (
        <Chip
          key={o}
          selected={isSel}
          disabled={!isSel && cap !== undefined && selected.length >= cap}
          onClick={() => onToggle(o)}
        >
          {o}
        </Chip>
      );
    });

  const goalChips = (goals: Goal[], selected: string[], onToggle: (v: string) => void): ReactNode =>
    goals.map((g) => {
      const on = selected.includes(g.label);
      return (
        <button
          key={g.label}
          type="button"
          className={`v8-toggle-chip${on ? ' is-on' : ''}`}
          aria-pressed={on}
          title={g.tip}
          onClick={() => onToggle(g.label)}
        >
          <span className="v8-toggle-chip-box" aria-hidden="true">
            <svg className="v8-toggle-chip-tick" viewBox="0 0 16 16">
              <polyline points="3 8.5 6.5 12 13 4.5" />
            </svg>
          </span>
          <span>{g.label}</span>
          {g.tip && (
            <span className="v12-tip" aria-hidden="true">
              i
            </span>
          )}
        </button>
      );
    });

  // Shared creator identity block (stage + credits + bio + links).
  const identityBlock = (
    <Group num="01" label="About you">
      <Prompt>Who are you as a {ROLE_NOUN[role]}?</Prompt>
      <Chips>
        {stageOptions(role).map((s) => (
          <Chip
            key={s.key}
            selected={creator.stage === s.key}
            onClick={() => setC({ stage: s.key })}
          >
            {s.label}
          </Chip>
        ))}
        {multiChips(CREDITS, creator.credits, (v) =>
          setC({ credits: toggle(creator.credits, v) }),
        )}
      </Chips>

      <div className="v12-field">
        <span className="v8-intake-sublabel">Short bio (optional)</span>
        <textarea
          className="v12-field-textarea"
          rows={2}
          value={creator.bio}
          onChange={(e) => setC({ bio: e.target.value })}
          placeholder="A line or two about your work…"
        />
        <div className={`v12-wordcount${bioOver ? ' is-over' : ''}`}>
          {bioWords}/{BIO_WORD_CAP} words
        </div>
      </div>

      <div className="v12-field">
        <span className="v8-intake-sublabel">Links (optional)</span>
        <div className="v12-links">
          {creator.links.map((link, i) => {
            const invalid = !isValidLink(link);
            return (
              <div key={i} className="v12-link-row">
                <input
                  className={`v12-field-input${invalid ? ' is-invalid' : ''}`}
                  value={link}
                  onChange={(e) => {
                    const next = creator.links.slice();
                    next[i] = e.target.value;
                    setC({ links: next });
                  }}
                  placeholder={LINK_PLACEHOLDER[role]}
                  inputMode="url"
                  autoCapitalize="none"
                  spellCheck={false}
                />
                {invalid && (
                  <span className="v12-link-error">Enter a valid URL (e.g. https://yoursite.com)</span>
                )}
              </div>
            );
          })}
        </div>
        {creator.links.length < MAX_LINKS && (
          <button
            type="button"
            className="v12-textbtn"
            onClick={() => setC({ links: [...creator.links, ''] })}
          >
            + Add another link
          </button>
        )}
      </div>
    </Group>
  );

  const goalsBlock = (
    <Group num="03" label="Goals">
      <Prompt>What would you like to do on Between Reads?</Prompt>
      <p className="v12-hint">Pick as many as apply.</p>
      <Chips>
        {role === 'reader'
          ? goalChips(goalsFor('reader'), reader.goals, (v) =>
              setR({ goals: toggle(reader.goals, v) }),
            )
          : goalChips(goalsFor(role), creator.goals, (v) =>
              setC({ goals: toggle(creator.goals, v) }),
            )}
      </Chips>
      <input
        className="v12-field-input"
        value={role === 'reader' ? reader.goalsOther : creator.goalsOther}
        onChange={(e) =>
          role === 'reader'
            ? setR({ goalsOther: e.target.value })
            : setC({ goalsOther: e.target.value })
        }
        placeholder="Other — anything else you'd like to do? (optional)"
      />
    </Group>
  );

  // --- Per-role question pages -------------------------------------------

  const readerPage = (
    <>
      <Group num="01" label="A book you love">
        <Prompt>What&rsquo;s a book you love?</Prompt>
        <p className="v12-hint">Helps us find the right reads for you.</p>
        <div className="v12-field">
          <input
            className="v12-field-input v12-field-title"
            value={reader.bookTitle}
            onChange={(e) => setR({ bookTitle: e.target.value })}
            placeholder="Title…"
          />
        </div>
        <div className="v12-field">
          <input
            className="v12-field-input"
            value={reader.bookAuthor}
            onChange={(e) => setR({ bookAuthor: e.target.value })}
            placeholder="Author (optional)"
          />
        </div>
        <div className="v12-field">
          <span className="v8-intake-sublabel">Why do you love it? (optional)</span>
          <textarea
            className="v12-field-textarea"
            rows={2}
            value={reader.bookWhy}
            onChange={(e) => setR({ bookWhy: e.target.value })}
            placeholder="What stayed with you…"
          />
          <div className={`v12-wordcount${whyOver ? ' is-over' : ''}`}>
            {whyWords}/{WHY_WORD_CAP} words
          </div>
        </div>
      </Group>

      <Group num="02" label="What you read">
        <Prompt>What do you mostly read?</Prompt>
        <span className="v8-intake-sublabel">Genre</span>
        <Chips>
          {multiChips(GENRES_PRIMARY, reader.genres, (v) =>
            setR({ genres: toggle(reader.genres, v) }),
          )}
          <button
            type="button"
            className={`v8-chip is-more${moreGenres ? ' is-open' : ''}`}
            aria-expanded={moreGenres}
            onClick={() => setMoreGenres((v) => !v)}
          >
            {moreGenres ? 'Less' : 'More…'}
          </button>
        </Chips>
        <ExpandRow open={moreGenres}>
          <div className="v8-intake-chips">
            {multiChips(GENRES_MORE, reader.genres, (v) =>
              setR({ genres: toggle(reader.genres, v) }),
            )}
          </div>
        </ExpandRow>

        <span className="v8-intake-sublabel">Format</span>
        <p className="v12-fieldnote">{FORMAT_TIP}</p>
        <Chips>
          {multiChips(FORMATS, reader.formats, (v) =>
            setR({ formats: toggle(reader.formats, v) }),
          )}
        </Chips>

        <span className="v8-intake-sublabel">When</span>
        <Chips>
          {multiChips(READER_WHENS, reader.whens, (v) =>
            setR({ whens: toggle(reader.whens, v) }),
          )}
        </Chips>
      </Group>

      {goalsBlock}
    </>
  );

  const writerPage = (
    <>
      {identityBlock}
      <Group num="02" label="Your work">
        <Prompt>What would you like to upload?</Prompt>
        <span className="v8-intake-sublabel">Title</span>
        <div className="v12-field">
          <input
            className="v12-field-input v12-field-title"
            value={creator.workTitle}
            onChange={(e) => setC({ workTitle: e.target.value })}
            placeholder="Title…"
          />
        </div>
        <span className="v8-intake-sublabel">Genre</span>
        <Chips>
          {multiChips(GENRES_PRIMARY, creator.workGenres, (v) =>
            setC({ workGenres: toggle(creator.workGenres, v) }),
          )}
          <button
            type="button"
            className={`v8-chip is-more${moreGenres ? ' is-open' : ''}`}
            aria-expanded={moreGenres}
            onClick={() => setMoreGenres((v) => !v)}
          >
            {moreGenres ? 'Less' : 'More…'}
          </button>
        </Chips>
        <ExpandRow open={moreGenres}>
          <div className="v8-intake-chips">
            {multiChips(GENRES_MORE, creator.workGenres, (v) =>
              setC({ workGenres: toggle(creator.workGenres, v) }),
            )}
          </div>
        </ExpandRow>

        <span className="v8-intake-sublabel">Mood</span>
        <Chips>
          {multiChips(MOODS, creator.workMoods, (v) =>
            setC({ workMoods: toggle(creator.workMoods, v) }),
          )}
        </Chips>

        <span className="v8-intake-sublabel">Format</span>
        <p className="v12-fieldnote">{FORMAT_TIP}</p>
        <Chips>
          {FORMATS.map((f) => (
            <Chip
              key={f}
              selected={creator.workFormat === f}
              onClick={() => setC({ workFormat: creator.workFormat === f ? null : f })}
            >
              {f}
            </Chip>
          ))}
        </Chips>
      </Group>
      {goalsBlock}
    </>
  );

  const poetPage = (
    <>
      {identityBlock}
      <Group num="02" label="What you write">
        <Prompt>What do you write?</Prompt>
        <span className="v8-intake-sublabel">Form</span>
        <Chips>
          {multiChips(POET_FORMS_PRIMARY, creator.poetForms, (v) =>
            setC({ poetForms: toggle(creator.poetForms, v) }),
          )}
          <button
            type="button"
            className={`v8-chip is-more${morePoetForms ? ' is-open' : ''}`}
            aria-expanded={morePoetForms}
            onClick={() => setMorePoetForms((v) => !v)}
          >
            {morePoetForms ? 'Less' : 'More…'}
          </button>
        </Chips>
        <ExpandRow open={morePoetForms}>
          <div className="v8-intake-chips">
            {multiChips(POET_FORMS_MORE, creator.poetForms, (v) =>
              setC({ poetForms: toggle(creator.poetForms, v) }),
            )}
          </div>
        </ExpandRow>

        <span className="v8-intake-sublabel">Mood</span>
        <Chips>
          {multiChips(MOODS, creator.poetMoods, (v) =>
            setC({ poetMoods: toggle(creator.poetMoods, v) }),
          )}
        </Chips>

        <span className="v8-intake-sublabel">Theme</span>
        <Chips>
          {multiChips(POET_THEMES_PRIMARY, creator.poetThemes, (v) =>
            setC({ poetThemes: toggle(creator.poetThemes, v) }),
          )}
          <button
            type="button"
            className={`v8-chip is-more${morePoetThemes ? ' is-open' : ''}`}
            aria-expanded={morePoetThemes}
            onClick={() => setMorePoetThemes((v) => !v)}
          >
            {morePoetThemes ? 'Less' : 'More…'}
          </button>
        </Chips>
        <ExpandRow open={morePoetThemes}>
          <div className="v8-intake-chips">
            {multiChips(POET_THEMES_MORE, creator.poetThemes, (v) =>
              setC({ poetThemes: toggle(creator.poetThemes, v) }),
            )}
          </div>
        </ExpandRow>
      </Group>
      {goalsBlock}
    </>
  );

  const illustratorPage = (
    <>
      {identityBlock}
      <Group num="02" label="What you create">
        <Prompt>What do you create?</Prompt>
        <span className="v8-intake-sublabel">Medium</span>
        <Chips>
          {multiChips(ILLO_MEDIUMS, creator.illoMediums, (v) =>
            setC({ illoMediums: toggle(creator.illoMediums, v) }),
          )}
        </Chips>
        <span className="v8-intake-sublabel">Style</span>
        <Chips>
          {multiChips(ILLO_STYLES, creator.illoStyles, (v) =>
            setC({ illoStyles: toggle(creator.illoStyles, v) }),
          )}
        </Chips>
        <span className="v8-intake-sublabel">For</span>
        <Chips>
          {multiChips(ILLO_USES, creator.illoUses, (v) =>
            setC({ illoUses: toggle(creator.illoUses, v) }),
          )}
        </Chips>
      </Group>
      {goalsBlock}
    </>
  );

  const rolePage =
    role === 'reader'
      ? readerPage
      : role === 'writer'
        ? writerPage
        : role === 'poet'
          ? poetPage
          : illustratorPage;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: INTAKE_CSS }} />
      <style dangerouslySetInnerHTML={{ __html: FLOW_CSS }} />
      <div className="v8-intake" role="region" aria-label="Get started">
        {onBack && step === 'profile' && (
          <button type="button" className="v8-intake-back" onClick={onBack}>
            <span aria-hidden="true">←</span> back
          </button>
        )}

        {/* Role tabs — pick the path. Locked once the spot is saved. */}
        {step === 'profile' && (
          <div className="v12-roletabs" role="tablist" aria-label="Choose your path">
            {ROLES.map((r) => (
              <button
                key={r}
                type="button"
                role="tab"
                aria-selected={role === r}
                className={`v12-roletab${role === r ? ' is-active' : ''}`}
                onClick={() => setRole(r)}
              >
                {ROLE_TAB_LABEL[r]}
              </button>
            ))}
          </div>
        )}

        {/* ============ PROFILE — questions + email ============ */}
        {step === 'profile' && (
          <div className="v8-intake-form" key={`profile-${role}`}>
            {rolePage}

            <div className="v12-email-capture">
              <h2 className="v12-email-title">Save your spot.</h2>

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
                    type="submit"
                    className="v8-cta v8-cta-primary"
                    disabled={!hookReady || !canSubmitEmail}
                  >
                    {submitting ? 'Saving…' : 'Save my spot'}
                    <span className="v8-cta-arrow" aria-hidden="true">→</span>
                  </button>
                </div>
              </form>
            </div>
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

/* === Role tabs (reader / writer / poet / illustrator) === */
.v12-roletabs {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: clamp(10px, 3vw, 28px);
  margin: 0 auto 6px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--v6-divider);
}
.v12-roletab {
  appearance: none;
  background: transparent;
  border: 0;
  border-bottom: 2px solid transparent;
  margin-bottom: -11px;
  padding: 0 0 10px;
  cursor: pointer;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: clamp(13px, 1.4vw, 15px);
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--v6-text-muted);
  transition: color 180ms var(--v6-ease), border-color 180ms var(--v6-ease);
  -webkit-tap-highlight-color: transparent;
}
.v12-roletab:hover { color: var(--v6-text-strong); }
.v12-roletab.is-active {
  color: var(--v6-text-strong);
  border-bottom-color: var(--v6-accent);
}

/* === Text fields (book title/author, bio, links, "other") === */
.v12-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 4px;
}
.v12-field-input,
.v12-field-textarea {
  font-family: 'Outfit', sans-serif;
  font-weight: 500;
  font-size: 15px;
  padding: 12px 16px;
  border: 1px solid var(--v6-divider);
  border-radius: 12px;
  background: var(--theme-surface-raised, var(--theme-surface-muted));
  color: var(--v6-text-strong);
  width: 100%;
  transition: border-color 160ms var(--v6-ease), background 160ms var(--v6-ease);
}
.v12-field-textarea { resize: vertical; line-height: 1.5; min-height: 56px; }
.v12-field-input::placeholder,
.v12-field-textarea::placeholder { color: var(--v6-text-muted); opacity: 0.7; }
.v12-field-input:focus,
.v12-field-textarea:focus {
  outline: none;
  border-color: var(--v6-accent);
  background: var(--v6-accent-soft);
}
.v12-field-input.is-invalid { border-color: #c0392b; }
.v12-field-title {
  font-family: 'Bricolage Grotesque', 'Outfit', sans-serif;
  font-size: clamp(17px, 2vw, 20px);
  font-weight: 700;
}
.v12-wordcount {
  font-family: 'Outfit', sans-serif;
  font-size: 11px;
  color: var(--v6-text-muted);
  text-align: right;
}
.v12-wordcount.is-over { color: #c0392b; }
.v12-fieldnote {
  font-family: 'Outfit', sans-serif;
  font-size: 12px;
  line-height: 1.5;
  color: var(--v6-text-muted);
  margin: 0 0 2px;
}
/* Question subtext. A dedicated class (not .v8-intake-caption, which the
   pop-up hides) so the hint stays visible in both the dialog and /start. */
.v12-hint {
  font-family: 'Outfit', sans-serif;
  font-size: 13px;
  line-height: 1.5;
  color: var(--v6-text-muted);
  margin: -2px 0 4px;
}
.v12-links { display: flex; flex-direction: column; gap: 8px; }
.v12-link-row { display: flex; flex-direction: column; gap: 4px; }
.v12-link-error {
  font-family: 'Outfit', sans-serif;
  font-size: 11px;
  color: #c0392b;
}
.v12-textbtn {
  align-self: flex-start;
  appearance: none;
  background: transparent;
  border: 0;
  padding: 4px 0;
  cursor: pointer;
  font-family: 'Outfit', sans-serif;
  font-size: 13px;
  color: var(--v6-text-muted);
  text-decoration: underline;
  text-underline-offset: 3px;
}
.v12-textbtn:hover { color: var(--v6-text-strong); }

/* Info "i" appended to goal chips that carry a tooltip (native title). */
.v12-tip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  margin-left: 2px;
  border-radius: 50%;
  border: 1px solid currentColor;
  font-size: 9px;
  font-style: italic;
  font-weight: 700;
  opacity: 0.55;
  cursor: help;
}

/* === Email capture === */
.v12-email-capture {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  width: min(100%, 680px);
  margin: clamp(14px, 2vw, 24px) auto 0;
  padding-top: clamp(18px, 2.4vw, 28px);
  border-top: 1px solid color-mix(in srgb, var(--v6-divider) 82%, transparent);
  text-align: center;
}
.v12-email-title {
  font-family: 'Bricolage Grotesque', 'Outfit', sans-serif;
  font-size: clamp(28px, 3vw, 40px);
  font-weight: 850;
  line-height: 1;
  letter-spacing: -0.025em;
  color: var(--v6-text-strong);
  margin: 0;
  text-wrap: balance;
}
.v12-email-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  width: 100%;
}
.v12-email-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: min(100%, 460px);
  text-align: left;
}
.v12-email-input {
  font-family: 'Outfit', sans-serif;
  font-weight: 500;
  font-size: 18px;
  padding: 16px 18px;
  border: 1px solid var(--v6-divider);
  border-radius: 12px;
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
  max-width: 460px;
  text-align: left;
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
  text-align: center;
}
.v12-email-form .v8-intake-actions {
  justify-content: center;
  margin-top: 0;
}
.v12-email-pitch {
  font-family: 'Outfit', sans-serif;
  font-size: 14px;
  line-height: 1.5;
  color: var(--v6-text-muted);
}
`;
