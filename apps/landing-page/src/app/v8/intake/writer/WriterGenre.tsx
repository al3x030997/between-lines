'use client';

import { useState } from 'react';
import { Chip, Chips, Group, Prompt, ToggleChip } from '../shared/intakeAtoms';
import {
  FICTION_GENRES_MORE,
  FICTION_GENRES_PRIMARY,
  GENRE_CAP,
  NONFICTION_GENRES_MORE,
  NONFICTION_GENRES_PRIMARY,
} from './writerConstants';
import type { WriterAnswers } from './writerTypes';

type Props = {
  num: string;
  value: WriterAnswers['genre'];
  onChange: (next: WriterAnswers['genre']) => void;
};

export default function WriterGenre({ num, value, onChange }: Props) {
  const [fictionMore, setFictionMore] = useState(false);
  const [nonfictionMore, setNonfictionMore] = useState(false);
  const totalPicked = value.fictionPrimary.length + value.nonfictionPrimary.length;
  const atCap = totalPicked >= GENRE_CAP;

  const toggleFiction = (g: string) => {
    const has = value.fictionPrimary.includes(g);
    if (has) {
      onChange({ ...value, fictionPrimary: value.fictionPrimary.filter((x) => x !== g) });
    } else if (!atCap) {
      onChange({ ...value, fictionPrimary: [...value.fictionPrimary, g] });
    }
  };
  const toggleNonfiction = (g: string) => {
    const has = value.nonfictionPrimary.includes(g);
    if (has) {
      onChange({ ...value, nonfictionPrimary: value.nonfictionPrimary.filter((x) => x !== g) });
    } else if (!atCap) {
      onChange({ ...value, nonfictionPrimary: [...value.nonfictionPrimary, g] });
    }
  };

  return (
    <Group num={num} label="Genre">
      <Prompt>
        What do you like to write? Choose primary and secondary genres &mdash; or open to all.
      </Prompt>

      <Chips>
        <Chip
          selected={value.focus === 'single'}
          onClick={() => onChange({ ...value, focus: 'single' })}
        >
          Single primary genre
        </Chip>
        <Chip
          selected={value.focus === 'cross'}
          onClick={() => onChange({ ...value, focus: 'cross' })}
        >
          Cross-genre
        </Chip>
      </Chips>

      <div className="v8-intake-subgroup">
        <span className="v8-intake-sublabel">Fiction</span>
        <Chips>
          {FICTION_GENRES_PRIMARY.map((g) => {
            const selected = value.fictionPrimary.includes(g);
            const disabled = !selected && atCap;
            return (
              <Chip key={g} selected={selected} disabled={disabled} onClick={() => toggleFiction(g)}>
                {g}
              </Chip>
            );
          })}
          <button
            type="button"
            className={`v8-chip is-more${fictionMore ? ' is-open' : ''}`}
            aria-expanded={fictionMore}
            onClick={() => setFictionMore((v) => !v)}
          >
            {fictionMore ? 'Less' : 'More…'}
          </button>
        </Chips>
        <div className={`v8-intake-expand${fictionMore ? ' is-open' : ''}`}>
          <div className="v8-intake-expand-inner">
            <div className="v8-intake-chips">
              {FICTION_GENRES_MORE.map((g) => {
                const selected = value.fictionPrimary.includes(g);
                const disabled = !selected && atCap;
                return (
                  <Chip key={g} selected={selected} disabled={disabled} onClick={() => toggleFiction(g)}>
                    {g}
                  </Chip>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="v8-intake-subgroup">
        <span className="v8-intake-sublabel">Non-fiction</span>
        <Chips>
          {NONFICTION_GENRES_PRIMARY.map((g) => {
            const selected = value.nonfictionPrimary.includes(g);
            const disabled = !selected && atCap;
            return (
              <Chip key={g} selected={selected} disabled={disabled} onClick={() => toggleNonfiction(g)}>
                {g}
              </Chip>
            );
          })}
          <button
            type="button"
            className={`v8-chip is-more${nonfictionMore ? ' is-open' : ''}`}
            aria-expanded={nonfictionMore}
            onClick={() => setNonfictionMore((v) => !v)}
          >
            {nonfictionMore ? 'Less' : 'More…'}
          </button>
        </Chips>
        <div className={`v8-intake-expand${nonfictionMore ? ' is-open' : ''}`}>
          <div className="v8-intake-expand-inner">
            <div className="v8-intake-chips">
              {NONFICTION_GENRES_MORE.map((g) => {
                const selected = value.nonfictionPrimary.includes(g);
                const disabled = !selected && atCap;
                return (
                  <Chip key={g} selected={selected} disabled={disabled} onClick={() => toggleNonfiction(g)}>
                    {g}
                  </Chip>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <ToggleChip
        on={value.openToAll}
        onClick={() => onChange({ ...value, openToAll: !value.openToAll })}
      >
        I&rsquo;m open to all genres
      </ToggleChip>

      <p className="v8-intake-helper">
        What if your genre isn&rsquo;t listed?{' '}
        <a href="mailto:hello@betweenreads.com" style={{ color: 'inherit', textDecoration: 'underline' }}>
          Email us.
        </a>
      </p>
    </Group>
  );
}
