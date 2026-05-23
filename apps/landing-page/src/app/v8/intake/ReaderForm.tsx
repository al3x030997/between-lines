'use client';

import { useState } from 'react';
import FavoriteBooks from './shared/FavoriteBooks';
import { Chip, Chips, Group, Prompt, ToggleChip } from './shared/intakeAtoms';

export type ReaderAnswers = {
  audience: string | null;
  genres: string[];
  lengths: string[];
  devices: string[];
  modes: string[];
  whens: string[];
  reaction: string | null;
  betaPool: boolean;
  club: boolean;
  newsletter: boolean;
  favoriteBooks: string[];
};

export const READER_INITIAL: ReaderAnswers = {
  audience: null,
  genres: [],
  lengths: [],
  devices: [],
  modes: [],
  whens: [],
  reaction: null,
  betaPool: false,
  club: false,
  newsletter: false,
  favoriteBooks: [],
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

      <Group num="06" label="Favorite books">
        <Prompt>A few titles that made you a reader.</Prompt>
        <FavoriteBooks
          value={answers.favoriteBooks}
          onChange={(next) => onChange({ ...answers, favoriteBooks: next })}
        />
      </Group>

      <Group num="07" label="Beta-reader pool">
        <Prompt>Want to beta-read drafts for other writers?</Prompt>
        <ToggleChip
          on={answers.betaPool}
          onClick={() => onChange({ ...answers, betaPool: !answers.betaPool })}
        >
          Yes, add me to the beta-reader pool
          <span className="v8-toggle-chip-sub">
            Read writers&rsquo; drafts before publication and earn <strong>SwapCredits</strong>.
          </span>
        </ToggleChip>
        <p className="v8-intake-helper">
          Earn credits by giving a beta-read; spend them to request beta-reads of your own work.
        </p>
      </Group>

      <Group num="08" label="Reader club">
        <Prompt>Join a virtual reader&rsquo;s club?</Prompt>
        <ToggleChip
          on={answers.club}
          onClick={() => onChange({ ...answers, club: !answers.club })}
        >
          Yes, add me to a virtual reader&rsquo;s club
          <span className="v8-toggle-chip-sub">(You can change this in preferences)</span>
        </ToggleChip>
      </Group>

      <Group num="09" label="Newsletter">
        <Prompt>Get the BetweenLines newsletter?</Prompt>
        <ToggleChip
          on={answers.newsletter}
          onClick={() => onChange({ ...answers, newsletter: !answers.newsletter })}
        >
          Yes, I&rsquo;d like the BetweenLines newsletter
          <span className="v8-toggle-chip-sub">
            Notified of new writers and new submissions. Unsubscribe any time.
          </span>
        </ToggleChip>
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
