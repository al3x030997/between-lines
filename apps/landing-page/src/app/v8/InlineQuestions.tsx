'use client';

import { useEffect, useRef, useState } from 'react';

export type Region = 'author' | 'reader' | 'both';

type Choice = {
  id: string;
  label: string;
  servicesHint?: string[];
};

type Question = {
  id: string;
  prompt: string;
  choices: Choice[];
};

type Flow = {
  region: Region;
  questions: Question[];
};

export type InlineAnswers = Record<string, string>;

export const INLINE_FLOWS: Record<Region, Flow> = {
  author: {
    region: 'author',
    questions: [
      {
        id: 'goal',
        prompt: 'What do you want most right now?',
        choices: [
          { id: 'find-agent', label: 'Find a literary agent', servicesHint: ['agentlist', 'agentmatch'] },
          { id: 'beta-readers', label: 'Get beta readers for my draft', servicesHint: ['betareading'] },
          { id: 'publish', label: 'Publish on my own terms', servicesHint: ['publishing'] },
          { id: 'explore', label: 'Just exploring', servicesHint: ['agentlist', 'agentmatch', 'betareading', 'publishing'] },
        ],
      },
      {
        id: 'stage',
        prompt: 'Where is the manuscript?',
        choices: [
          { id: 'idea', label: 'Still an idea' },
          { id: 'draft', label: 'Rough draft' },
          { id: 'final', label: 'Final draft / editing' },
          { id: 'done', label: 'Complete' },
        ],
      },
      {
        id: 'route',
        prompt: 'Publishing route in mind?',
        choices: [
          { id: 'trad', label: 'Traditional' },
          { id: 'self', label: 'Self-publish' },
          { id: 'group', label: 'Online reading group only' },
          { id: 'unsure', label: 'Not sure yet' },
        ],
      },
    ],
  },
  reader: {
    region: 'reader',
    questions: [
      {
        id: 'want',
        prompt: 'What do you want most?',
        choices: [
          { id: 'newsletter', label: 'Curated picks in my inbox', servicesHint: ['newsletter'] },
          { id: 'early', label: 'Early access to new fiction', servicesHint: ['r-publishing'] },
          { id: 'beta', label: 'Beta-read upcoming novels', servicesHint: ['r-betareads'] },
        ],
      },
      {
        id: 'frequency',
        prompt: 'How much do you read?',
        choices: [
          { id: 'weekly', label: 'A book a week' },
          { id: 'monthly', label: 'A few a month' },
          { id: 'quarterly', label: 'Now and then' },
        ],
      },
    ],
  },
  both: {
    region: 'both',
    questions: [
      {
        id: 'first',
        prompt: 'Which side do you want to start with?',
        choices: [
          { id: 'author', label: 'Set up my author profile first' },
          { id: 'reader', label: 'Set up my reader profile first' },
        ],
      },
    ],
  },
};

const INLINE_CSS = `
.v8-inline { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
  opacity: 0; transform: translateY(8px); pointer-events: none;
  transition: opacity 320ms ease 80ms, transform 360ms cubic-bezier(.22,1,.36,1) 80ms;
  font-family: 'Bricolage Grotesque', 'Outfit', system-ui, sans-serif;
  padding: clamp(20px, 4vw, 56px);
}
.v8-inline.is-visible { opacity: 1; transform: none; pointer-events: auto; }

.v8-inline-card {
  position: relative;
  width: 100%;
  max-width: 720px;
  display: flex; flex-direction: column; align-items: stretch; gap: 36px;
}

.v8-inline-header {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}
.v8-inline-step {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 600; font-size: 12px; letter-spacing: 0.28em; text-transform: uppercase;
  color: var(--v6-accent);
  font-variant-numeric: tabular-nums;
}
.v8-inline-progress {
  width: 100%;
  height: 6px;
  background: var(--v6-divider);
  border-radius: 3px;
  overflow: hidden;
}
.v8-inline-progress-fill {
  height: 100%;
  background: var(--v6-accent);
  transform-origin: left center;
  transition: width 480ms cubic-bezier(.22, 1, .36, 1);
}

.v8-inline-q {
  display: flex; flex-direction: column; align-items: center; gap: 28px;
  width: 100%;
  transition: opacity 220ms ease, transform 220ms ease;
}
.v8-inline-q.is-q-leaving { opacity: 0; transform: translateY(-6px); }

.v8-inline-prompt-slot {
  min-height: 132px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  width: 100%;
}
.v8-inline-prompt {
  font-family: 'Bricolage Grotesque', 'Outfit', sans-serif;
  font-weight: 800;
  font-size: clamp(30px, 4.4vw, 54px);
  letter-spacing: -0.03em;
  line-height: 1.06;
  color: var(--v6-text-strong);
  text-align: center;
  font-variation-settings: 'wdth' 92, 'opsz' 96;
  max-width: 18ch;
  margin: 0;
  text-wrap: balance;
  font-kerning: normal;
  text-rendering: optimizeLegibility;
  font-feature-settings: "kern", "liga", "calt";
}

.v8-inline-chips-slot {
  min-height: 132px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
}
.v8-inline-chips {
  display: flex; flex-wrap: wrap; gap: 12px; justify-content: center;
}

.v8-inline-chip {
  appearance: none;
  font: inherit;
  font-size: 16px;
  font-weight: 500;
  padding: 14px 22px;
  border-radius: 999px;
  border: 1px solid var(--v6-divider);
  background: transparent;
  color: var(--v6-text-strong);
  cursor: pointer;
  transition: background 180ms var(--v6-ease), border-color 180ms var(--v6-ease), transform 180ms var(--v6-ease);
  -webkit-tap-highlight-color: transparent;
  text-wrap: balance;
}
.v8-inline-chip:hover,
.v8-inline-chip:focus-visible {
  background: var(--v6-accent-soft);
  border-color: var(--v6-accent);
}
.v8-inline-chip.is-selected {
  background: var(--v6-accent);
  color: #fff;
  border-color: var(--v6-accent);
}
.v8-root.is-palette-forest .v8-inline-chip.is-selected { color: #F5EDE0; }

.v8-inline-back {
  position: absolute;
  bottom: -8px;
  left: 0;
  appearance: none;
  font: inherit;
  font-size: 13px;
  font-weight: 500;
  background: transparent;
  border: 0;
  color: var(--v6-text-muted);
  cursor: pointer;
  padding: 4px 0;
  transition: color 180ms var(--v6-ease);
}
.v8-inline-back:hover,
.v8-inline-back:focus-visible { color: var(--v6-accent); }
`;

type Props = {
  region: Region;
  visible: boolean;
  onComplete: (answers: InlineAnswers, finalRegion: Region) => void;
  onBack: () => void;
};

export function InlineQuestions({ region, visible, onComplete, onBack }: Props) {
  const flow = INLINE_FLOWS[region];
  const total = flow.questions.length;
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<InlineAnswers>({});
  const [leaving, setLeaving] = useState(false);
  const firstChipRef = useRef<HTMLButtonElement | null>(null);

  // Reset whenever the region changes (new entry path) or component is hidden
  useEffect(() => {
    if (!visible) {
      setStep(0);
      setAnswers({});
      setLeaving(false);
    }
  }, [visible, region]);

  // Focus the first chip when becoming visible or advancing to a new question
  useEffect(() => {
    if (!visible) return;
    const t = window.setTimeout(() => {
      firstChipRef.current?.focus();
    }, 420);
    return () => window.clearTimeout(t);
  }, [visible, step]);

  // Escape key returns to hero
  useEffect(() => {
    if (!visible) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onBack();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [visible, onBack]);

  const question = flow.questions[step];

  const advance = (choice: Choice) => {
    const nextAnswers: InlineAnswers = { ...answers, [question.id]: choice.id };
    setAnswers(nextAnswers);

    // For the "both" routing question the answer is the side they want.
    const isLast = step >= total - 1;
    if (isLast) {
      const finalRegion: Region =
        region === 'both' && (choice.id === 'author' || choice.id === 'reader')
          ? (choice.id as Region)
          : region;
      onComplete(nextAnswers, finalRegion);
      return;
    }

    setLeaving(true);
    window.setTimeout(() => {
      setStep((s) => s + 1);
      setLeaving(false);
    }, 220);
  };

  const handleBack = () => {
    if (step === 0) {
      onBack();
      return;
    }
    setLeaving(true);
    window.setTimeout(() => {
      setStep((s) => Math.max(0, s - 1));
      setLeaving(false);
    }, 180);
  };

  const stepLabel = `${String(step + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
  const progressPct = ((step + 1) / total) * 100;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: INLINE_CSS }} />
      <div
        className={`v8-inline${visible ? ' is-visible' : ''}`}
        aria-hidden={!visible}
      >
        <div className="v8-inline-card">
          <div className="v8-inline-header">
            <div className="v8-inline-step">{stepLabel}</div>
            <div
              className="v8-inline-progress"
              role="progressbar"
              aria-valuenow={step + 1}
              aria-valuemin={1}
              aria-valuemax={total}
              aria-label={`Step ${step + 1} of ${total}`}
            >
              <div className="v8-inline-progress-fill" style={{ width: `${progressPct}%` }} />
            </div>
          </div>
          <div
            className={`v8-inline-q${leaving ? ' is-q-leaving' : ''}`}
            key={question.id}
          >
            <div className="v8-inline-prompt-slot">
              <h2 className="v8-inline-prompt">{question.prompt}</h2>
            </div>
            <div className="v8-inline-chips-slot">
              <div className="v8-inline-chips" role="group" aria-label={question.prompt}>
                {question.choices.map((c, i) => {
                  const selected = answers[question.id] === c.id;
                  return (
                    <button
                      key={c.id}
                      ref={i === 0 ? firstChipRef : undefined}
                      type="button"
                      className={`v8-inline-chip${selected ? ' is-selected' : ''}`}
                      onClick={() => advance(c)}
                    >
                      {c.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <button
            type="button"
            className="v8-inline-back"
            onClick={handleBack}
          >
            ← {step === 0 ? 'back to home' : 'back'}
          </button>
        </div>
      </div>
    </>
  );
}
