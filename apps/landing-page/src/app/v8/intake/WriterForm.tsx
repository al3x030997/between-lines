'use client';

import { useRef } from 'react';

export type WriterAnswers = {
  submission: string | null;
  feedback: string[];
  warningsMode: 'none' | 'list' | null;
  warnings: string[];
  file: File | null;
  fileError: string | null;
};

export const WRITER_INITIAL: WriterAnswers = {
  submission: null,
  feedback: [],
  warningsMode: null,
  warnings: [],
  file: null,
  fileError: null,
};

const SUBMISSIONS = ['Microstory', 'Flash', 'Chapter 1', 'Excerpt', 'Full manuscript'];
const FEEDBACK = [
  'Outline / big-picture',
  'Plot clarity',
  'Characters',
  'Pacing',
  'Hook (would you keep reading?)',
];
const WARNINGS = ['Violence', 'Profanity', 'Drug use', 'Self-harm', 'Trauma', 'Bereavement'];
const ACCEPTED_EXTS = ['.doc', '.docx', '.pdf', '.txt', '.md'];
const MAX_BYTES = 10 * 1024 * 1024;

type Props = {
  answers: WriterAnswers;
  onChange: (next: WriterAnswers) => void;
  onSubmit: () => void;
};

export default function WriterForm({ answers, onChange, onSubmit }: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const setSubmission = (value: string) => onChange({ ...answers, submission: value });
  const toggleFeedback = (value: string) => {
    const has = answers.feedback.includes(value);
    onChange({
      ...answers,
      feedback: has
        ? answers.feedback.filter((v) => v !== value)
        : [...answers.feedback, value],
    });
  };
  const setWarningsMode = (mode: 'none' | 'list') => {
    onChange({ ...answers, warningsMode: mode, warnings: mode === 'none' ? [] : answers.warnings });
  };
  const toggleWarning = (value: string) => {
    const has = answers.warnings.includes(value);
    onChange({
      ...answers,
      warnings: has
        ? answers.warnings.filter((v) => v !== value)
        : [...answers.warnings, value],
    });
  };

  const handleFile = (file: File | null) => {
    if (!file) {
      onChange({ ...answers, file: null, fileError: null });
      return;
    }
    const ext = '.' + (file.name.split('.').pop() ?? '').toLowerCase();
    if (!ACCEPTED_EXTS.includes(ext)) {
      onChange({
        ...answers,
        file: null,
        fileError: `Unsupported format. Try ${ACCEPTED_EXTS.join(', ')}`,
      });
      return;
    }
    if (file.size > MAX_BYTES) {
      onChange({
        ...answers,
        file: null,
        fileError: 'File is over 10 MB. Trim and try again.',
      });
      return;
    }
    onChange({ ...answers, file, fileError: null });
  };

  const fmtSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  const canSubmit =
    answers.submission !== null && answers.warningsMode !== null && answers.file !== null;

  return (
    <div className="v8-intake-form" aria-label="Writer submission">
      <Group num="01" label="Submission">
        <Prompt>What are you submitting?</Prompt>
        <Chips>
          {SUBMISSIONS.map((s) => (
            <Chip
              key={s}
              selected={answers.submission === s}
              onClick={() => setSubmission(s)}
            >
              {s}
            </Chip>
          ))}
        </Chips>
      </Group>

      <Group num="02" label="Feedback">
        <Prompt>What kind of notes do you want back?</Prompt>
        <Chips>
          {FEEDBACK.map((f) => (
            <Chip
              key={f}
              selected={answers.feedback.includes(f)}
              onClick={() => toggleFeedback(f)}
            >
              {f}
            </Chip>
          ))}
        </Chips>
      </Group>

      <Group num="03" label="Content warnings">
        <Prompt>Any content warnings?</Prompt>
        <Chips>
          <Chip
            selected={answers.warningsMode === 'none'}
            onClick={() => setWarningsMode('none')}
          >
            None
          </Chip>
          <Chip
            selected={answers.warningsMode === 'list'}
            onClick={() => setWarningsMode('list')}
          >
            Select from list
          </Chip>
        </Chips>
        <div className={`v8-intake-expand${answers.warningsMode === 'list' ? ' is-open' : ''}`}>
          <div className="v8-intake-expand-inner">
            <div className="v8-intake-chips">
              {WARNINGS.map((w) => (
                <Chip
                  key={w}
                  selected={answers.warnings.includes(w)}
                  onClick={() => toggleWarning(w)}
                >
                  {w}
                </Chip>
              ))}
            </div>
          </div>
        </div>
        <p className="v8-intake-helper">
          Auto-rejected: explicit sexual scenes, extreme violence, incest.
        </p>
      </Group>

      <Group num="04" label="Sample">
        <Prompt>Upload your draft.</Prompt>
        <div className="v8-upload">
          <label
            className={`v8-upload-dropzone${answers.file ? ' has-file' : ''}${answers.fileError ? ' has-error' : ''}`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_EXTS.join(',')}
              hidden
              onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
            />
            <span className="v8-upload-text">
              <span className="v8-upload-title">
                {answers.file ? answers.file.name : 'Choose a file to upload'}
              </span>
              <span className="v8-upload-sub">
                {answers.file
                  ? fmtSize(answers.file.size)
                  : `${ACCEPTED_EXTS.join(' · ')} · up to 10 MB`}
              </span>
            </span>
            <span className="v8-upload-icon" aria-hidden="true">
              {answers.file ? '✓' : '↑'}
            </span>
          </label>
          {answers.fileError && (
            <span className="v8-upload-error" role="alert">
              {answers.fileError}
            </span>
          )}
          {answers.file && (
            <button
              type="button"
              className="v8-upload-clear"
              onClick={() => {
                if (fileInputRef.current) fileInputRef.current.value = '';
                handleFile(null);
              }}
            >
              Remove
            </button>
          )}
        </div>
      </Group>

      <p className="v8-intake-caption">
        We do the rest: <strong>wordcount verification</strong>, readability check, packaging help
        (hook · pitch · synopsis), and a quick curator triage before it goes live in a drop.
      </p>

      <div className="v8-intake-actions">
        <button
          type="button"
          className="v8-cta v8-cta-primary"
          onClick={onSubmit}
          disabled={!canSubmit}
          style={canSubmit ? undefined : { opacity: 0.45, cursor: 'not-allowed' }}
        >
          Submit for review
          <span className="v8-cta-arrow" aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  );
}

function Group({
  num,
  label,
  children,
}: {
  num: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className="v8-intake-group">
      <div className="v8-intake-label">
        <span className="v8-intake-label-num">{num}</span>
        <span>{label}</span>
      </div>
      {children}
    </section>
  );
}

function Prompt({ children }: { children: React.ReactNode }) {
  return <h3 className="v8-intake-prompt">{children}</h3>;
}

function Chips({ children }: { children: React.ReactNode }) {
  return <div className="v8-intake-chips">{children}</div>;
}

function Chip({
  selected,
  disabled,
  onClick,
  children,
}: {
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className={`v8-chip${selected ? ' is-selected' : ''}`}
      aria-pressed={selected}
      aria-disabled={disabled || undefined}
      onClick={() => {
        if (disabled) return;
        onClick();
      }}
    >
      {children}
    </button>
  );
}
