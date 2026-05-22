'use client';

import { useState, useId, type KeyboardEvent } from 'react';

type Props = {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  cap?: number;
};

const MAX_LEN = 120;

export default function FavoriteBooks({
  value,
  onChange,
  placeholder = 'Title — and author if you have it',
  cap = 10,
}: Props) {
  const [draft, setDraft] = useState('');
  const inputId = useId();
  const atCap = value.length >= cap;

  const commit = () => {
    const trimmed = draft.trim().slice(0, MAX_LEN);
    if (!trimmed) return;
    const exists = value.some((v) => v.toLowerCase() === trimmed.toLowerCase());
    if (exists) {
      setDraft('');
      return;
    }
    if (atCap) return;
    onChange([...value, trimmed]);
    setDraft('');
  };

  const remove = (book: string) => {
    onChange(value.filter((v) => v !== book));
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      commit();
    }
  };

  return (
    <div className="v8-favbooks">
      <style>{CSS}</style>
      <div className="v8-favbooks-input">
        <input
          id={inputId}
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value.slice(0, MAX_LEN))}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          disabled={atCap}
          aria-label="Add a favorite book"
        />
        <button
          type="button"
          className="v8-favbooks-add"
          onClick={commit}
          disabled={!draft.trim() || atCap}
        >
          Add
        </button>
      </div>
      {atCap && (
        <p className="v8-favbooks-helper">That&rsquo;s the max — remove one to add another.</p>
      )}
      {value.length > 0 && (
        <ul className="v8-favbooks-list">
          {value.map((book) => (
            <li key={book} className="v8-favbooks-card">
              <span className="v8-favbooks-title">{book}</span>
              <button
                type="button"
                className="v8-favbooks-remove"
                onClick={() => remove(book)}
                aria-label={`Remove ${book}`}
              >
                &times;
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const CSS = `
.v8-favbooks {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.v8-favbooks-input {
  display: flex;
  gap: 10px;
  align-items: stretch;
}
.v8-favbooks-input input {
  flex: 1 1 auto;
  appearance: none;
  background: rgba(14, 14, 12, 0.04);
  border: 1px solid var(--v6-divider);
  border-radius: 999px;
  padding: 12px 18px;
  font-family: 'Outfit', sans-serif;
  font-size: 15px;
  color: var(--v6-text-strong);
  transition: border-color 180ms var(--v6-ease), background 180ms var(--v6-ease);
}
.v8-favbooks-input input:focus {
  border-color: var(--v6-accent);
  background: var(--v6-accent-soft);
  outline: none;
}
.v8-favbooks-input input:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.v8-favbooks-add {
  appearance: none;
  font: inherit;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 12px 22px;
  border-radius: 999px;
  background: var(--v6-text-strong);
  color: var(--v6-bg, #f7f3ea);
  border: 1px solid var(--v6-text-strong);
  cursor: pointer;
  transition: opacity 180ms var(--v6-ease), transform 180ms var(--v6-ease);
}
.v8-favbooks-add:hover:not(:disabled) {
  transform: translateY(-1px);
}
.v8-favbooks-add:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}
.v8-favbooks-helper {
  font-family: 'Outfit', sans-serif;
  font-size: 12px;
  color: var(--v6-text-muted);
  opacity: 0.75;
  margin: 0;
}
.v8-favbooks-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.v8-favbooks-card {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 6px 8px 14px;
  border-radius: 999px;
  border: 1px solid var(--v6-divider);
  background: rgba(14, 14, 12, 0.04);
  font-family: 'Outfit', sans-serif;
  font-size: 14px;
  color: var(--v6-text-strong);
  max-width: 100%;
}
.v8-favbooks-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 280px;
}
.v8-favbooks-remove {
  appearance: none;
  border: 0;
  background: transparent;
  font: inherit;
  font-size: 18px;
  line-height: 1;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  color: var(--v6-text-muted);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background 160ms var(--v6-ease), color 160ms var(--v6-ease);
}
.v8-favbooks-remove:hover {
  color: var(--v6-accent);
  background: var(--v6-accent-soft);
}
`;
