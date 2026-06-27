'use client';

import { useState, type ReactNode } from 'react';
import { track } from '@vercel/analytics';
import { INTAKE_CSS } from '../../v8/intake/intakeCss';
import { Chip, Chips, ExpandRow, Group, Prompt } from '../../v8/intake/shared/intakeAtoms';
import SignupStep from './SignupStep';
import WelcomeStep from './WelcomeStep';
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
  type WorkItem,
  WORK_ITEM_INITIAL,
  MAX_WORKS,
  readerReady,
  creatorReady,
  buildIntake,
} from './roleData';

// Kept as `IntakeRegion` for the existing IntakeDialog / start-page callers,
// which import this type and pass `initialMode`. It now spans all four roles.
export type IntakeRegion = IntakeRole;

// signup → profile (question chapters) → welcome.
type Step = 'signup' | 'profile' | 'welcome';

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

// Hover/focus tooltip for the "Format" label (the lengths cheat-sheet).
function FormatLabel() {
  return (
    <span className="v8-intake-sublabel v12-fmt-label">
      Format
      <span className="v12-infotip" tabIndex={0} role="note" aria-label={FORMAT_TIP}>
        i
        <span className="v12-infotip-pop" aria-hidden="true">
          {FORMAT_TIP}
        </span>
      </span>
    </span>
  );
}

export default function IntakeFlow({ initialMode = 'reader', onBack }: Props) {
  const [role, setRole] = useState<IntakeRole>(initialMode);
  const [step, setStep] = useState<Step>('signup');

  // Slider — each question section (chapter) is one slide.
  const [slide, setSlide] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const [reader, setReader] = useState<ReaderState>(READER_STATE_INITIAL);
  const [creator, setCreator] = useState<CreatorState>(CREATOR_STATE_INITIAL);

  // "More…" expanders. Reader genres use one toggle; the writer's per-work
  // genre expanders are tracked by work index.
  const [moreGenres, setMoreGenres] = useState(false);
  const [workMoreGenres, setWorkMoreGenres] = useState<Set<number>>(new Set());
  const [morePoetForms, setMorePoetForms] = useState(false);
  const [morePoetThemes, setMorePoetThemes] = useState(false);

  // Captured at the signup step; the email feeds the waitlist submission.
  const [email, setEmail] = useState('');
  const [website] = useState(''); // honeypot — humans never fill this
  const [submitting, setSubmitting] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');

  const setR = (patch: Partial<ReaderState>) => setReader((s) => ({ ...s, ...patch }));
  const setC = (patch: Partial<CreatorState>) => setCreator((s) => ({ ...s, ...patch }));

  const hookReady = role === 'reader' ? readerReady(reader) : creatorReady(role, creator);

  const bioWords = wordCount(creator.bio);
  const bioOver = bioWords > BIO_WORD_CAP;
  const whyWords = wordCount(reader.bookWhy);
  const whyOver = whyWords > WHY_WORD_CAP;

  // The whole flow lands here on the last chapter's "Done": persist email +
  // intake to the existing waitlist pipeline, then show the welcome screen.
  const submit = async () => {
    if (!hookReady || submitting) return;
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
      // insider === true means the cookie is set and the welcome links work
      // immediately; otherwise Kit is reconciling via the confirmation email.
      setPending(!data.insider);
      setStep('welcome');
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
    <Group num="" label="About you">
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
    <Group num="" label="Goals">
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
      {/* The prototype's reader step 3 has no free-text "Other" — creators only. */}
      {role !== 'reader' && (
        <input
          className="v12-field-input"
          value={creator.goalsOther}
          onChange={(e) => setC({ goalsOther: e.target.value })}
          placeholder="Other — anything else you'd like to do? (optional)"
        />
      )}
    </Group>
  );

  // --- Per-role question sections (one per slide) ------------------------

  const readerBook = (
    <Group num="" label="A book you love">
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
  );

  const readerRead = (
    <Group num="" label="What you read">
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

      <FormatLabel />
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
  );

  // One uploadable title in the writer flow.
  const renderWork = (w: WorkItem, idx: number) => {
    const setWork = (patch: Partial<WorkItem>) =>
      setC({ works: creator.works.map((it, i) => (i === idx ? { ...it, ...patch } : it)) });
    const removeWork = () => {
      setC({ works: creator.works.filter((_, i) => i !== idx) });
      setWorkMoreGenres((prev) => {
        const next = new Set<number>();
        prev.forEach((i) => {
          if (i < idx) next.add(i);
          else if (i > idx) next.add(i - 1);
        });
        return next;
      });
    };
    const genresOpen = workMoreGenres.has(idx);
    const toggleGenres = () =>
      setWorkMoreGenres((prev) => {
        const next = new Set(prev);
        if (next.has(idx)) next.delete(idx);
        else next.add(idx);
        return next;
      });

    return (
      <div className={`v12-work${idx > 0 ? ' v12-work-extra' : ''}`} key={idx}>
        <div className="v12-work-head">
          <span className="v8-intake-sublabel">{idx === 0 ? 'Title' : `Title ${idx + 1}`}</span>
          {idx > 0 && (
            <button type="button" className="v12-textbtn" onClick={removeWork}>
              − Remove
            </button>
          )}
        </div>
        <div className="v12-field">
          <input
            className="v12-field-input v12-field-title"
            value={w.title}
            onChange={(e) => setWork({ title: e.target.value })}
            placeholder="Title…"
          />
        </div>

        <span className="v8-intake-sublabel">Genre</span>
        <Chips>
          {multiChips(GENRES_PRIMARY, w.genres, (v) => setWork({ genres: toggle(w.genres, v) }))}
          <button
            type="button"
            className={`v8-chip is-more${genresOpen ? ' is-open' : ''}`}
            aria-expanded={genresOpen}
            onClick={toggleGenres}
          >
            {genresOpen ? 'Less' : 'More…'}
          </button>
        </Chips>
        <ExpandRow open={genresOpen}>
          <div className="v8-intake-chips">
            {multiChips(GENRES_MORE, w.genres, (v) => setWork({ genres: toggle(w.genres, v) }))}
          </div>
        </ExpandRow>

        <span className="v8-intake-sublabel">Mood</span>
        <Chips>{multiChips(MOODS, w.moods, (v) => setWork({ moods: toggle(w.moods, v) }))}</Chips>

        <FormatLabel />
        <Chips>
          {FORMATS.map((f) => (
            <Chip
              key={f}
              selected={w.format === f}
              onClick={() => setWork({ format: w.format === f ? null : f })}
            >
              {f}
            </Chip>
          ))}
        </Chips>
      </div>
    );
  };

  const writerWork = (
    <Group num="" label="Your work">
      <Prompt>What would you like to upload?</Prompt>
      <p className="v12-hint">Tell us about your work.</p>
      {creator.works.map((w, i) => renderWork(w, i))}
      {creator.works.length < MAX_WORKS && (
        <button
          type="button"
          className="v12-textbtn"
          onClick={() => setC({ works: [...creator.works, { ...WORK_ITEM_INITIAL }] })}
        >
          + Add another title
        </button>
      )}
    </Group>
  );

  const poetWork = (
    <Group num="" label="What you write">
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
  );

  const illoWork = (
    <Group num="" label="What you create">
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
  );

  // --- Assemble the slide deck for the active role -----------------------

  const slides: ReactNode[] =
    role === 'reader'
      ? [readerBook, readerRead, goalsBlock]
      : role === 'writer'
        ? [identityBlock, writerWork, goalsBlock]
        : role === 'poet'
          ? [identityBlock, poetWork, goalsBlock]
          : [identityBlock, illoWork, goalsBlock];

  const lastIndex = slides.length - 1;
  const current = Math.min(slide, lastIndex);
  const isLast = current === lastIndex;

  const goNext = () => {
    setDir(1);
    setSlide((s) => Math.min(s + 1, lastIndex));
  };
  const goPrev = () => {
    setDir(-1);
    setSlide((s) => Math.max(s - 1, 0));
  };
  const goTo = (i: number) => {
    setDir(i > current ? 1 : -1);
    setSlide(i);
  };
  const pickRole = (r: IntakeRole) => {
    setRole(r);
    setSlide(0);
    setDir(1);
    setError('');
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: INTAKE_CSS }} />
      <style dangerouslySetInnerHTML={{ __html: FLOW_CSS }} />
      <div className="v8-intake" role="region" aria-label="Get started">
        {/* ============ SIGNUP — create the account first ============ */}
        {step === 'signup' && (
          <SignupStep
            onComplete={({ email: e }) => {
              setEmail(e);
              setStep('profile');
              setSlide(0);
              setDir(1);
            }}
          />
        )}

        {/* Role tabs — pick the path. Only shown during the questions. */}
        {step === 'profile' && (
          <div className="v12-roletabs" role="tablist" aria-label="Choose your path">
            {ROLES.map((r) => (
              <button
                key={r}
                type="button"
                role="tab"
                aria-selected={role === r}
                className={`v12-roletab${role === r ? ' is-active' : ''}`}
                onClick={() => pickRole(r)}
              >
                {ROLE_TAB_LABEL[r]}
              </button>
            ))}
          </div>
        )}

        {/* ============ PROFILE — one chapter per slide ============ */}
        {step === 'profile' && (
          <div className="v12-slider">
            <div className="v12-slide-viewport">
              <div
                className={`v8-intake-form v12-slide${dir > 0 ? ' from-right' : ' from-left'}`}
                key={`profile-${role}-${current}`}
              >
                {slides[current]}
                {isLast && error && <p className="v12-email-error">{error}</p>}
              </div>
            </div>

            <div className="v12-slide-nav">
              <div className="v12-nav-side v12-nav-left">
                {(current > 0 || onBack) && (
                  <button
                    type="button"
                    className="v8-cta v8-cta-secondary"
                    onClick={current > 0 ? goPrev : onBack}
                  >
                    <span aria-hidden="true">←</span> Back
                  </button>
                )}
              </div>

              <div className="v12-dots" role="tablist" aria-label="Progress">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`v12-dot${i === current ? ' is-on' : i < current ? ' is-done' : ''}`}
                    aria-current={i === current}
                    aria-label={`Step ${i + 1} of ${slides.length}`}
                    onClick={() => goTo(i)}
                  />
                ))}
              </div>

              <div className="v12-nav-side v12-nav-right">
                {isLast ? (
                  <button
                    type="button"
                    className="v8-cta v8-cta-primary"
                    disabled={!hookReady || submitting}
                    onClick={submit}
                  >
                    {submitting ? 'Saving…' : 'Done'}
                    <span className="v8-cta-arrow" aria-hidden="true">→</span>
                  </button>
                ) : (
                  <button type="button" className="v8-cta v8-cta-primary" onClick={goNext}>
                    Continue
                    <span className="v8-cta-arrow" aria-hidden="true">→</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ============ WELCOME — credits + next steps ============ */}
        {step === 'welcome' && (
          <WelcomeStep role={role} bookTitle={reader.bookTitle} pending={pending} />
        )}
      </div>
    </>
  );
}

const FLOW_CSS = `
/* Prompt text: black + bold + large — the headline of each slide. */
.v8-intake .v8-intake-prompt {
  color: var(--v6-text-strong);
  font-weight: 800;
  font-size: clamp(26px, 3vw, 34px);
  line-height: 1.15;
  margin-bottom: 10px;
}
.v8-intake .v8-intake-prompt-num {
  font-size: 0.8em;
}

/* Larger body copy across the flow — sublabels, hints, field notes. */
.v8-intake .v8-intake-sublabel { font-size: 15px; }
.v8-intake .v12-hint { font-size: 16px; margin: -2px 0 6px; }
.v8-intake .v12-fieldnote { font-size: 14px; }
.v8-intake .v8-chip { font-size: 16px; padding: 12px 20px; }
.v8-intake .v8-toggle-chip { font-size: 16px; }

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
  font-size: 17px;
  padding: 14px 18px;
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

/* Hover/focus tooltip on the "Format" label. */
.v12-fmt-label { display: inline-flex; align-items: center; gap: 6px; }
.v12-infotip {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  border: 1px solid var(--v6-text-muted);
  font-size: 10px;
  font-style: italic;
  font-weight: 700;
  color: var(--v6-text-muted);
  cursor: help;
}
.v12-infotip-pop {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  width: 250px;
  padding: 10px 12px;
  border-radius: 8px;
  background: var(--v6-text-strong);
  color: var(--theme-page, #fff);
  font-family: 'Outfit', sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 11px;
  line-height: 1.6;
  text-align: left;
  opacity: 0;
  visibility: hidden;
  transition: opacity 140ms var(--v6-ease);
  z-index: 30;
}
.v12-infotip:hover .v12-infotip-pop,
.v12-infotip:focus-visible .v12-infotip-pop { opacity: 1; visibility: visible; }

/* === Writer multi-work === */
.v12-work { display: flex; flex-direction: column; gap: 8px; }
.v12-work-extra {
  margin-top: 14px;
  padding-top: 16px;
  border-top: 1px solid color-mix(in srgb, var(--v6-divider) 82%, transparent);
}
.v12-work-head { display: flex; align-items: center; justify-content: space-between; }
.v12-work-head .v12-textbtn { padding: 0; }

/* === Signup step === */
.v12-signup {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: min(100%, 440px);
  margin: 0 auto;
}
.v12-signup-title {
  font-family: 'Bricolage Grotesque', 'Outfit', sans-serif;
  font-size: clamp(24px, 3vw, 30px);
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--v6-text-strong);
  text-align: center;
  margin: 0 0 6px;
}
.v12-signup-social {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--v6-divider);
  border-radius: 12px;
  background: var(--theme-surface-raised, var(--theme-surface-muted));
  color: var(--v6-text-strong);
  font-family: 'Outfit', sans-serif;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 160ms var(--v6-ease);
}
.v12-signup-social:hover { border-color: var(--v6-text-muted); }
.v12-signup-note {
  font-family: 'Outfit', sans-serif;
  font-size: 12px;
  color: var(--v6-text-muted);
  text-align: center;
  margin: 0;
}
.v12-signup-or {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 4px 0;
}
.v12-signup-or span {
  font-family: 'Outfit', sans-serif;
  font-size: 12px;
  color: var(--v6-text-muted);
}
.v12-signup-or hr { flex: 1; border: 0; border-top: 1px solid var(--v6-divider); }
.v12-signup-status {
  font-family: 'Outfit', sans-serif;
  font-size: 12px;
  margin: -4px 0 2px;
}
.v12-signup-status.is-ok { color: #1d9e75; }
.v12-signup-status.is-taken { color: #c0392b; }
.v12-signup-age {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Outfit', sans-serif;
  font-size: 14px;
  color: var(--v6-text);
  cursor: pointer;
  margin-top: 2px;
}
.v12-signup-age input[type="checkbox"] {
  width: 16px;
  height: 16px;
  flex: 0 0 auto;
  accent-color: var(--v6-accent);
  cursor: pointer;
}
.v12-signup-hint {
  font-family: 'Outfit', sans-serif;
  font-size: 12px;
  color: var(--v6-text-muted);
  margin: 0;
}
.v12-signup-submit { width: 100%; justify-content: center; margin-top: 6px; }

/* === Email / inline error === */
.v12-email-error {
  font-family: 'Outfit', sans-serif;
  font-size: 13px;
  color: var(--v6-accent);
  margin: 4px 0 0;
  text-align: center;
}

/* === Welcome step === */
.v12-welcome {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(18px, 3vw, 28px);
  text-align: center;
  padding: clamp(8px, 2vw, 20px) 0;
}
.v12-welcome-head { display: flex; flex-direction: column; gap: 6px; }
.v12-welcome-title {
  font-family: 'Bricolage Grotesque', 'Outfit', sans-serif;
  font-size: clamp(40px, 6vw, 56px);
  font-weight: 850;
  letter-spacing: -0.03em;
  line-height: 1;
  color: var(--v6-text-strong);
  margin: 0;
}
.v12-welcome-credits {
  font-family: 'Outfit', sans-serif;
  font-size: 16px;
  color: var(--v6-text-muted);
  margin: 0;
}
.v12-welcome-credits strong { color: var(--v6-text-strong); }
.v12-welcome-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: clamp(16px, 4vw, 40px);
  width: 100%;
  padding: clamp(16px, 2.4vw, 22px) clamp(20px, 4vw, 32px);
  background: var(--v6-accent);
  border-radius: 14px;
}
.v12-welcome-action {
  font-family: 'Outfit', sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: #1a1a1a;
  text-decoration: underline;
  text-underline-offset: 3px;
  cursor: pointer;
}
.v12-welcome-action:hover { opacity: 0.7; }
.v12-welcome-pending {
  font-family: 'Outfit', sans-serif;
  font-size: 13px;
  color: var(--v6-text-muted);
  margin: 0;
  max-width: 440px;
}
.v12-welcome-quote {
  margin: 0;
  max-width: 560px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.v12-welcome-quote blockquote {
  font-family: 'Playfair Display', Georgia, serif;
  font-style: italic;
  font-size: 15px;
  line-height: 1.7;
  color: var(--v6-text-muted);
  margin: 0;
}
.v12-welcome-quote figcaption {
  font-family: 'Outfit', sans-serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--v6-text-muted);
}
.v12-welcome-about {
  font-family: 'Outfit', sans-serif;
  font-size: 12px;
  margin: 0;
}
.v12-welcome-about a {
  color: var(--v6-text-muted);
  text-decoration: none;
  border-bottom: 1px solid var(--v6-divider);
}
.v12-welcome-about a:hover { color: var(--v6-text-strong); }

/* === Slider — one chapter per slide === */
.v12-slider {
  display: flex;
  flex-direction: column;
  gap: clamp(16px, 2.4vw, 24px);
}
.v12-slide-viewport {
  overflow: hidden;
}
.v12-slide {
  animation: v12-slide-in 320ms var(--v6-ease) both;
}
.v12-slide.from-left {
  animation-name: v12-slide-in-left;
}
@keyframes v12-slide-in {
  from { opacity: 0; transform: translateX(26px); }
  to { opacity: 1; transform: none; }
}
@keyframes v12-slide-in-left {
  from { opacity: 0; transform: translateX(-26px); }
  to { opacity: 1; transform: none; }
}
@media (prefers-reduced-motion: reduce) {
  .v12-slide { animation-duration: 1ms; }
}

/* Footer nav: Back · dots · Continue/Done */
.v12-slide-nav {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-top: clamp(12px, 2vw, 18px);
  border-top: 1px solid color-mix(in srgb, var(--v6-divider) 82%, transparent);
}
.v12-nav-side {
  flex: 1 1 0;
  display: flex;
  min-width: 0;
}
.v12-nav-left { justify-content: flex-start; }
.v12-nav-right { justify-content: flex-end; }
.v12-slide-nav .v8-cta { margin: 0; }

.v12-dots {
  display: flex;
  align-items: center;
  gap: 9px;
  flex: 0 0 auto;
}
.v12-dot {
  appearance: none;
  width: 8px;
  height: 8px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: var(--v6-divider);
  cursor: pointer;
  transition: background 180ms var(--v6-ease), transform 180ms var(--v6-ease);
  -webkit-tap-highlight-color: transparent;
}
.v12-dot.is-done { background: color-mix(in srgb, var(--v6-accent) 55%, var(--v6-divider)); }
.v12-dot.is-on {
  background: var(--v6-accent);
  transform: scale(1.4);
}

@media (max-width: 460px) {
  .v12-slide-nav { gap: 8px; }
  .v12-slide-nav .v8-cta { padding-left: 16px; padding-right: 16px; }
}
`;
