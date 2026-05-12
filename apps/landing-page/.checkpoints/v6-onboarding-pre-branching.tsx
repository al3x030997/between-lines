'use client';

import { useEffect, useMemo, useState } from 'react';

export type Mode = 'reader' | 'author';

type SingleQ = {
  kind: 'single';
  id: string;
  label: string;
  hint?: string;
  options: string[];
  showIf?: (a: Answers) => boolean;
};
type MultiQ = {
  kind: 'multi';
  id: string;
  label: string;
  hint?: string;
  options: string[];
  allowCustom?: boolean;
  showIf?: (a: Answers) => boolean;
};
type TextQ = {
  kind: 'text';
  id: string;
  label: string;
  hint?: string;
  placeholder?: string;
  showIf?: (a: Answers) => boolean;
};
type Q = SingleQ | MultiQ | TextQ;

type Answers = Record<string, string | string[]>;

const READER_QS: Q[] = [
  {
    kind: 'single',
    id: 'frequency',
    label: 'Reading frequency',
    options: ['1–2 / month', '1–2 / week', '1–5 / month', 'Quarterly', 'Yearly'],
  },
  {
    kind: 'single',
    id: 'engagement',
    label: 'How do you want to read?',
    options: [
      'Casual / low engagement',
      'Engaged with community',
      'Beta reader for pre-published manuscripts',
    ],
  },
  {
    kind: 'multi',
    id: 'discovery',
    label: 'How you discover',
    hint: 'Pick any',
    options: ['Try new authors', 'Experiment with genres', 'Mostly bestseller list'],
  },
  {
    kind: 'single',
    id: 'club',
    label: 'Book clubs',
    options: ['In a book club', 'Want to join a virtual book club', 'Not interested'],
  },
  {
    kind: 'multi',
    id: 'genres',
    label: 'Favorite genres',
    hint: 'Pick a few — or add your own',
    options: ['Fantasy', 'Romance', 'Sci-fi', 'Lit fic', 'Mystery', 'Non-fiction'],
    allowCustom: true,
  },
  {
    kind: 'text',
    id: 'favorite_book',
    label: 'A book you really enjoyed',
    placeholder: 'Title…',
  },
];

const AUTHOR_QS: Q[] = [
  {
    kind: 'single',
    id: 'journey',
    label: 'Where are you on the journey?',
    options: ['Aspiring writer', 'Emerging writer', 'Established writer'],
  },
  {
    kind: 'single',
    id: 'working_on',
    label: 'What are you currently working on?',
    options: ['Debut novel', 'New novel', 'Still thinking'],
  },
  {
    kind: 'single',
    id: 'route',
    label: 'Intended publishing route',
    hint: 'You can change this later',
    options: ['Traditional', 'Self-publish', 'Online reading group only', 'Not sure'],
  },
  {
    kind: 'single',
    id: 'agent_stage',
    label: 'Agent stage',
    options: [
      'Researching agents',
      'Building agent list',
      'Querying soon (30–90 days)',
      'Querying now',
    ],
    showIf: (a) => a.route === 'Traditional',
  },
  {
    kind: 'single',
    id: 'manuscript_stage',
    label: 'Manuscript stage',
    options: [
      'Draft',
      'Final draft',
      'Editing',
      'Proofreading',
      'Complete',
      'Seeking beta readers',
    ],
  },
  {
    kind: 'single',
    id: 'seeking_reviews',
    label: 'Seeking reviews?',
    options: ['Yes', 'No'],
    showIf: (a) => a.route === 'Self-publish',
  },
  {
    kind: 'single',
    id: 'language',
    label: 'Primary language',
    options: ['English', 'Spanish', 'French', 'German', 'Hindi'],
  },
  {
    kind: 'single',
    id: 'genre_focus',
    label: 'Genre focus',
    options: ['Single primary genre', 'Cross-genre'],
  },
  {
    kind: 'multi',
    id: 'fiction_genres',
    label: 'Fiction genres',
    hint: 'Pick any — or add your own',
    options: ['Fantasy', 'Romance', 'Sci-fi', 'Mystery / Thriller', 'Literary', 'Young Adult'],
    allowCustom: true,
  },
  {
    kind: 'multi',
    id: 'nonfic_genres',
    label: 'Non-fiction genres',
    hint: 'Pick any — or add your own',
    options: ['Memoir', 'Business', 'Self-help', 'Health', 'History'],
    allowCustom: true,
  },
  {
    kind: 'single',
    id: 'length',
    label: 'Target length (rough word count)',
    options: [
      'Under 15,000',
      '15,000 – 40,000',
      '40,000 – 80,000',
      '80,000 – 120,000',
      '120,000+',
      'Not sure',
    ],
  },
  {
    kind: 'single',
    id: 'submissions',
    label: 'Submissions',
    options: ['Agents', 'Journals / contests', 'Both', 'N/A'],
  },
  {
    kind: 'single',
    id: 'goal',
    label: 'Goal this month',
    options: ['Finish revision', 'Get beta feedback', 'Build agent list', 'Send queries'],
  },
];

const TITLES: Record<Mode, { eyebrow: string; title: string; pitch: string }> = {
  reader: {
    eyebrow: 'For readers · Quick setup, 10–20 seconds',
    title: 'Tell us how you read.',
    pitch: 'Answer what’s closest. We’ll line up drafts you’ll actually want to read.',
  },
  author: {
    eyebrow: 'For writers · Quick setup, 10–20 seconds',
    title: 'Where are you on the journey?',
    pitch:
      'Answer what’s closest. We’ll match you with the right readers and the right next step.',
  },
};

export function OnboardingOverlay({
  mode,
  onClose,
}: {
  mode: Mode | null;
  onClose: () => void;
}) {
  const [answers, setAnswers] = useState<Answers>({});
  const [extras, setExtras] = useState<Record<string, string[]>>({});
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [step, setStep] = useState<1 | 2>(1);

  useEffect(() => {
    if (!mode) {
      setAnswers({});
      setExtras({});
      setDrafts({});
      setStep(1);
    }
  }, [mode]);

  useEffect(() => {
    if (!mode) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mode, onClose]);

  const questions = useMemo(() => {
    if (!mode) return [] as Q[];
    return mode === 'reader' ? READER_QS : AUTHOR_QS;
  }, [mode]);

  if (!mode) return null;

  const heading = TITLES[mode];

  const setSingle = (id: string, value: string) =>
    setAnswers((a) => ({ ...a, [id]: a[id] === value ? '' : value }));
  const toggleMulti = (id: string, value: string) =>
    setAnswers((a) => {
      const cur = (a[id] as string[]) ?? [];
      return {
        ...a,
        [id]: cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value],
      };
    });
  const setText = (id: string, value: string) => setAnswers((a) => ({ ...a, [id]: value }));

  const addExtra = (id: string) => {
    const v = (drafts[id] ?? '').trim();
    if (!v) return;
    const list = extras[id] ?? [];
    if (list.includes(v)) {
      setDrafts((d) => ({ ...d, [id]: '' }));
      return;
    }
    setExtras((c) => ({ ...c, [id]: [...list, v] }));
    setAnswers((a) => {
      const cur = (a[id] as string[]) ?? [];
      return { ...a, [id]: [...cur, v] };
    });
    setDrafts((d) => ({ ...d, [id]: '' }));
  };

  const removeExtra = (id: string, value: string) => {
    setExtras((c) => ({ ...c, [id]: (c[id] ?? []).filter((v) => v !== value) }));
    setAnswers((a) => ({
      ...a,
      [id]: ((a[id] as string[]) ?? []).filter((v) => v !== value),
    }));
  };

  const goNext = () => {
    const payload = { mode, answers };
    // eslint-disable-next-line no-console
    console.log('[onboarding] step1 → next', payload);
    setStep(2);
  };

  return (
    <div className="ob-root" role="dialog" aria-modal="true" aria-labelledby="ob-title">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="ob-scrim" onClick={onClose} aria-hidden="true" />
      <div className="ob-sheet">
        <button className="ob-close" onClick={onClose} aria-label="Close onboarding">
          ×
        </button>

        {step === 2 ? (
          <div className="ob-thanks">
            <p className="ob-eyebrow">Step 2 · Coming up</p>
            <h2 className="ob-title">
              {mode === 'reader' ? 'Your reading home is next.' : 'Your writing home is next.'}
            </h2>
            <p className="ob-sub">
              {mode === 'reader'
                ? 'We’ll line up drafts that match what you told us.'
                : 'We’ll line up the readers and the next step that fits your stage.'}
            </p>
            <div className="ob-actions">
              <button
                className="ob-btn ob-btn-primary"
                type="button"
                onClick={onClose}
              >
                Take me there
              </button>
              <button
                className="ob-btn ob-btn-text"
                type="button"
                onClick={() => setStep(1)}
              >
                Back
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="ob-eyebrow">{heading.eyebrow}</p>
            <h2 id="ob-title" className="ob-title">
              {heading.title}
            </h2>
            <p className="ob-pitch">{heading.pitch}</p>

            <div className="ob-form">
              {questions.map((q) => {
                if (q.showIf && !q.showIf(answers)) return null;
                return (
                  <fieldset key={q.id} className="ob-q">
                    <legend className="ob-q-label">
                      {q.label}
                      {q.hint && <span className="ob-q-hint"> · {q.hint}</span>}
                    </legend>
                    {q.kind === 'single' && (
                      <div className="ob-chips">
                        {q.options.map((opt) => {
                          const active = answers[q.id] === opt;
                          return (
                            <button
                              key={opt}
                              type="button"
                              className={`ob-chip${active ? ' is-active' : ''}`}
                              onClick={() => setSingle(q.id, opt)}
                              aria-pressed={active}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    )}
                    {q.kind === 'multi' && (
                      <div className="ob-chips">
                        {q.options.map((opt) => {
                          const cur = (answers[q.id] as string[]) ?? [];
                          const active = cur.includes(opt);
                          return (
                            <button
                              key={opt}
                              type="button"
                              className={`ob-chip${active ? ' is-active' : ''}`}
                              onClick={() => toggleMulti(q.id, opt)}
                              aria-pressed={active}
                            >
                              {opt}
                            </button>
                          );
                        })}
                        {(extras[q.id] ?? []).map((opt) => {
                          const cur = (answers[q.id] as string[]) ?? [];
                          const active = cur.includes(opt);
                          return (
                            <span
                              key={`x-${opt}`}
                              className={`ob-chip ob-chip-custom${active ? ' is-active' : ''}`}
                            >
                              <button
                                type="button"
                                className="ob-chip-toggle"
                                onClick={() => toggleMulti(q.id, opt)}
                                aria-pressed={active}
                              >
                                {opt}
                              </button>
                              <button
                                type="button"
                                className="ob-chip-remove"
                                onClick={() => removeExtra(q.id, opt)}
                                aria-label={`Remove ${opt}`}
                              >
                                ×
                              </button>
                            </span>
                          );
                        })}
                        {q.allowCustom && (
                          <input
                            type="text"
                            className="ob-chip-input"
                            placeholder="+ Add genre"
                            value={drafts[q.id] ?? ''}
                            onChange={(e) =>
                              setDrafts((d) => ({ ...d, [q.id]: e.target.value }))
                            }
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                addExtra(q.id);
                              }
                            }}
                            onBlur={() => addExtra(q.id)}
                            aria-label={`Add a custom ${q.label.toLowerCase()} option`}
                          />
                        )}
                      </div>
                    )}
                    {q.kind === 'text' && (
                      <input
                        type="text"
                        className="ob-input"
                        placeholder={q.placeholder}
                        value={(answers[q.id] as string) ?? ''}
                        onChange={(e) => setText(q.id, e.target.value)}
                      />
                    )}
                  </fieldset>
                );
              })}

            </div>

            <div className="ob-actions">
              <button className="ob-btn ob-btn-primary" type="button" onClick={goNext}>
                Next
              </button>
              <button className="ob-btn ob-btn-text" type="button" onClick={onClose}>
                Skip
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const CSS = `
.ob-root {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(16px, 4vh, 48px) clamp(16px, 4vw, 32px);
  font-family: 'Bricolage Grotesque', 'Outfit', system-ui, sans-serif;
  color: #0e0e0c;
}
.ob-scrim {
  position: absolute;
  inset: 0;
  background: rgba(14, 14, 12, 0.45);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  animation: ob-fade 220ms ease both;
}
.ob-sheet {
  position: relative;
  width: min(720px, 100%);
  max-height: 100%;
  background: #ffffff;
  overflow-y: auto;
  padding: 56px clamp(28px, 5vw, 64px) 64px;
  border-radius: 18px;
  box-shadow:
    0 1px 0 rgba(14, 14, 12, 0.04),
    0 28px 80px rgba(14, 14, 12, 0.32);
  animation: ob-pop 320ms cubic-bezier(0.22, 1, 0.36, 1) both;
}
.ob-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  font-size: 28px;
  line-height: 1;
  color: #0e0e0c;
  cursor: pointer;
  border-radius: 999px;
  transition: background 180ms ease, color 180ms ease;
}
.ob-close:hover {
  background: rgba(14, 14, 12, 0.06);
  color: #e94b36;
}
.ob-eyebrow {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #e94b36;
  margin: 0 0 14px;
}
.ob-title {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 800;
  font-size: clamp(32px, 4.4vw, 48px);
  letter-spacing: -0.03em;
  font-variation-settings: 'wdth' 94, 'opsz' 48;
  line-height: 1.05;
  margin: 0 0 12px;
}
.ob-pitch {
  font-family: 'Outfit', sans-serif;
  font-size: 16px;
  line-height: 1.5;
  color: #4d4d47;
  margin: 0 0 32px;
  max-width: 56ch;
}
.ob-form {
  display: flex;
  flex-direction: column;
  gap: 26px;
  border-top: 1px solid rgba(14, 14, 12, 0.1);
  padding-top: 28px;
}
.ob-q {
  border: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.ob-q-label {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 700;
  font-size: 15px;
  letter-spacing: -0.005em;
  color: #0e0e0c;
  padding: 0;
}
.ob-q-hint {
  font-weight: 400;
  font-family: 'Outfit', sans-serif;
  color: #888880;
  font-size: 13px;
  letter-spacing: 0;
  text-transform: none;
}
.ob-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.ob-chip {
  font-family: 'Outfit', sans-serif;
  font-weight: 500;
  font-size: 14px;
  padding: 9px 14px;
  border: 1px solid rgba(14, 14, 12, 0.18);
  background: #ffffff;
  color: #0e0e0c;
  border-radius: 999px;
  cursor: pointer;
  transition:
    background 160ms ease,
    border-color 160ms ease,
    color 160ms ease,
    transform 120ms ease;
  letter-spacing: 0;
}
.ob-chip:hover {
  border-color: #0e0e0c;
}
.ob-chip.is-active {
  background: #0e0e0c;
  color: #ffffff;
  border-color: #0e0e0c;
}
.ob-chip:focus-visible {
  outline: 2px solid #e94b36;
  outline-offset: 2px;
}
.ob-chip-custom {
  display: inline-flex;
  align-items: stretch;
  padding: 0;
  overflow: hidden;
}
.ob-chip-custom .ob-chip-toggle {
  font-family: inherit;
  font-weight: 500;
  font-size: 14px;
  padding: 9px 6px 9px 14px;
  border: none;
  background: transparent;
  color: inherit;
  cursor: pointer;
}
.ob-chip-custom .ob-chip-remove {
  font-family: inherit;
  font-size: 16px;
  line-height: 1;
  border: none;
  background: transparent;
  color: inherit;
  cursor: pointer;
  padding: 0 12px 0 6px;
  opacity: 0.55;
  transition: opacity 160ms ease, color 160ms ease;
}
.ob-chip-custom .ob-chip-remove:hover {
  opacity: 1;
  color: #e94b36;
}
.ob-chip-custom.is-active .ob-chip-remove:hover {
  color: #ffffff;
}
.ob-chip-input {
  font-family: 'Outfit', sans-serif;
  font-weight: 500;
  font-size: 14px;
  padding: 9px 14px;
  border: 1px dashed rgba(14, 14, 12, 0.3);
  background: transparent;
  color: #0e0e0c;
  border-radius: 999px;
  outline: none;
  min-width: 150px;
  max-width: 220px;
  transition: border-color 160ms ease, background 160ms ease;
}
.ob-chip-input::placeholder {
  color: rgba(14, 14, 12, 0.5);
}
.ob-chip-input:focus,
.ob-chip-input:not(:placeholder-shown) {
  border-style: solid;
  border-color: #e94b36;
  background: rgba(233, 75, 54, 0.04);
}
.ob-input {
  font-family: 'Outfit', sans-serif;
  font-weight: 500;
  font-size: 15px;
  padding: 12px 14px;
  border: 1px solid rgba(14, 14, 12, 0.2);
  border-radius: 6px;
  background: #ffffff;
  color: #0e0e0c;
  width: 100%;
  max-width: 420px;
  transition: border-color 160ms ease;
}
.ob-input:focus {
  outline: none;
  border-color: #e94b36;
}
.ob-q-email {
  margin-top: 8px;
  padding-top: 22px;
  border-top: 1px solid rgba(14, 14, 12, 0.1);
}
.ob-check {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-family: 'Outfit', sans-serif;
  font-size: 14px;
  color: #2a2a25;
  margin-top: 6px;
  cursor: pointer;
  user-select: none;
}
.ob-check input {
  margin-top: 2px;
  accent-color: #e94b36;
  width: 16px;
  height: 16px;
}
.ob-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-top: 36px;
  padding-top: 28px;
  border-top: 1px solid rgba(14, 14, 12, 0.1);
}
.ob-btn {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 0.01em;
  padding: 13px 22px;
  border-radius: 999px;
  border: 1px solid transparent;
  cursor: pointer;
  transition:
    background 160ms ease,
    color 160ms ease,
    border-color 160ms ease,
    transform 120ms ease;
}
.ob-btn-primary {
  background: #e94b36;
  color: #ffffff;
}
.ob-btn-primary:hover {
  background: #d2402c;
}
.ob-btn-ghost {
  background: #ffffff;
  color: #0e0e0c;
  border-color: rgba(14, 14, 12, 0.22);
}
.ob-btn-ghost:hover {
  border-color: #0e0e0c;
}
.ob-btn-text {
  background: transparent;
  color: #4d4d47;
  padding: 13px 12px;
  margin-left: auto;
}
.ob-btn-text:hover {
  color: #e94b36;
}
.ob-thanks {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  padding-top: 12vh;
}
.ob-sub {
  font-family: 'Outfit', sans-serif;
  font-size: 16px;
  color: #4d4d47;
  margin: 0 0 16px;
}
@keyframes ob-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes ob-pop {
  from { transform: translateY(12px) scale(0.98); opacity: 0; }
  to { transform: translateY(0) scale(1); opacity: 1; }
}
@media (prefers-reduced-motion: reduce) {
  .ob-scrim, .ob-sheet { animation: none; }
}
@media (max-width: 720px) {
  .ob-root {
    padding: 0;
  }
  .ob-sheet {
    width: 100%;
    max-height: 100vh;
    border-radius: 0;
    padding: 56px 22px 96px;
  }
}
`;
