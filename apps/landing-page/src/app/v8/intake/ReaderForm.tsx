'use client';

import { useState } from 'react';

export type ReaderAnswers = {
  audience: string | null;
  genres: string[];
  lengths: string[];
  devices: string[];
  modes: string[];
  whens: string[];
  reaction: string | null;
  club: boolean;
};

export const READER_INITIAL: ReaderAnswers = {
  audience: null,
  genres: [],
  lengths: [],
  devices: [],
  modes: [],
  whens: [],
  reaction: null,
  club: false,
};

const AUDIENCES = ['Adult Fiction', 'Young Adult', 'Children’s'];
const GENRES_PRIMARY = ['Fantasy', 'Romance', 'Sci-fi', 'Thriller', 'Litfic'];
const GENRES_MORE = [
  'Historical',
  'Horror',
  'Mystery',
  'Crime',
  'Memoir',
  'Poetry',
  'Essays',
  'YA-crossover',
];
const LENGTHS = ['Microstory', 'Flash', 'Chapter 1', 'Excerpt'];
const DEVICES = ['Mobile', 'E-reader', 'Tablet', 'Desktop'];
const MODES = ['Read', 'Listen', 'Both'];
const WHENS = ['Commute', 'Bedtime', 'Weekends', 'Breaks'];
const REACTIONS = ['Just react', 'Answer a few questions', 'Deep thoughts'];

const GENRE_CAP = 3;

type Props = {
  answers: ReaderAnswers;
  onChange: (next: ReaderAnswers) => void;
  onSubmit: (intent: 'later' | 'now') => void;
};

export default function ReaderForm({ answers, onChange, onSubmit }: Props) {
  const [moreOpen, setMoreOpen] = useState(false);

  const setSingle = (key: keyof ReaderAnswers, value: string) =>
    onChange({ ...answers, [key]: value });

  const toggleMulti = (key: keyof ReaderAnswers, value: string, cap?: number) => {
    const list = answers[key] as string[];
    const has = list.includes(value);
    if (has) {
      onChange({ ...answers, [key]: list.filter((v) => v !== value) });
    } else {
      if (cap && list.length >= cap) return;
      onChange({ ...answers, [key]: [...list, value] });
    }
  };

  const genreAtCap = answers.genres.length >= GENRE_CAP;

  return (
    <div className="v8-intake-form" aria-label="Reader profile">
      <Group num="01" label="Audience">
        <Prompt>What do you read?</Prompt>
        <Chips>
          {AUDIENCES.map((a) => (
            <Chip
              key={a}
              selected={answers.audience === a}
              onClick={() => setSingle('audience', a)}
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
            const selected = answers.genres.includes(g);
            const disabled = !selected && genreAtCap;
            return (
              <Chip
                key={g}
                selected={selected}
                disabled={disabled}
                onClick={() => toggleMulti('genres', g, GENRE_CAP)}
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
                const selected = answers.genres.includes(g);
                const disabled = !selected && genreAtCap;
                return (
                  <Chip
                    key={g}
                    selected={selected}
                    disabled={disabled}
                    onClick={() => toggleMulti('genres', g, GENRE_CAP)}
                  >
                    {g}
                  </Chip>
                );
              })}
            </div>
          </div>
        </div>
      </Group>

      <Group num="03" label="Length">
        <Prompt>What do you like to read?</Prompt>
        <Chips>
          {LENGTHS.map((l) => (
            <Chip
              key={l}
              selected={answers.lengths.includes(l)}
              onClick={() => toggleMulti('lengths', l)}
            >
              {l}
            </Chip>
          ))}
        </Chips>
      </Group>

      <Group num="04" label="How you read">
        <Prompt>Tell us about your reading routine.</Prompt>
        <div className="v8-intake-subgroup">
          <span className="v8-intake-sublabel">Device</span>
          <Chips>
            {DEVICES.map((d) => (
              <Chip
                key={d}
                selected={answers.devices.includes(d)}
                onClick={() => toggleMulti('devices', d)}
              >
                {d}
              </Chip>
            ))}
          </Chips>
        </div>
        <div className="v8-intake-subgroup">
          <span className="v8-intake-sublabel">Mode</span>
          <Chips>
            {MODES.map((m) => (
              <Chip
                key={m}
                selected={answers.modes.includes(m)}
                onClick={() => toggleMulti('modes', m)}
              >
                {m}
              </Chip>
            ))}
          </Chips>
        </div>
        <div className="v8-intake-subgroup">
          <span className="v8-intake-sublabel">When</span>
          <Chips>
            {WHENS.map((w) => (
              <Chip
                key={w}
                selected={answers.whens.includes(w)}
                onClick={() => toggleMulti('whens', w)}
              >
                {w}
              </Chip>
            ))}
          </Chips>
        </div>
      </Group>

      <Group num="05" label="Reaction">
        <Prompt>How will you respond after reading?</Prompt>
        <Chips>
          {REACTIONS.map((r) => (
            <Chip
              key={r}
              selected={answers.reaction === r}
              onClick={() => setSingle('reaction', r)}
            >
              {r}
            </Chip>
          ))}
        </Chips>
      </Group>

      <Group num="06" label="Reader club">
        <button
          type="button"
          className={`v8-toggle-chip${answers.club ? ' is-on' : ''}`}
          aria-pressed={answers.club}
          onClick={() => onChange({ ...answers, club: !answers.club })}
        >
          <span className="v8-toggle-chip-box" aria-hidden="true">
            <svg className="v8-toggle-chip-tick" viewBox="0 0 16 16">
              <polyline points="3 8.5 6.5 12 13 4.5" />
            </svg>
          </span>
          <span>
            Yes, add me to a virtual reader’s club
            <span className="v8-toggle-chip-sub">(You can change this in preferences)</span>
          </span>
        </button>
      </Group>

      <p className="v8-intake-caption">
        <strong>Content filters</strong> are set in your profile, not upfront. Not allowed on the
        platform: smut, explicit sexual scenes, extreme violence, incest.
      </p>

      <div className="v8-intake-actions">
        <button
          type="button"
          className="v8-cta v8-cta-secondary"
          onClick={() => onSubmit('later')}
        >
          Read Later
        </button>
        <button
          type="button"
          className="v8-cta v8-cta-primary"
          onClick={() => onSubmit('now')}
        >
          Read Now
          <span className="v8-cta-arrow" aria-hidden="true">→</span>
        </button>
      </div>

      <p className="v8-intake-fomo">
        Turn on <strong>Drops</strong> notifications to claim limited early-reader slots in your
        genres before they fill.
      </p>
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
