'use client';

type Props = {
  query: string;
  onChange: (next: string) => void;
};

export function WriterSearch({ query, onChange }: Props) {
  return (
    <div className="br-write-search">
      <svg
        className="br-write-search-icon"
        viewBox="0 0 20 20"
        aria-hidden="true"
        focusable="false"
      >
        <circle cx="9" cy="9" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <line x1="13.5" y1="13.5" x2="17" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <input
        type="search"
        className="br-write-search-input"
        value={query}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search your works, chapters, or notes…"
        aria-label="Search your library"
      />
      {query ? (
        <button
          type="button"
          className="br-write-search-clear"
          onClick={() => onChange('')}
          aria-label="Clear search"
        >
          ×
        </button>
      ) : null}
    </div>
  );
}
