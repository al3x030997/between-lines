'use client'

export interface FilterState {
  agency: string
  genre: string
  q: string
}

export default function FilterBar({
  value,
  onChange,
}: {
  value: FilterState
  agencies: string[]
  genres: string[]
  onChange: (next: FilterState) => void
}) {
  const hasFilters = value.q
  return (
    <div className="flex items-center gap-2 py-2">
      <div className="flex items-center gap-2 flex-1 max-w-xs">
        <SearchIcon />
        <input
          value={value.q}
          onChange={(e) => onChange({ ...value, q: e.target.value })}
          placeholder="Search"
          className="bg-transparent text-[13px] text-text outline-none placeholder:text-muted/60 w-full"
        />
      </div>
      {hasFilters && (
        <button
          onClick={() => onChange({ agency: '', genre: '', q: '' })}
          className="text-[11px] text-muted hover:text-text"
        >
          Clear
        </button>
      )}
    </div>
  )
}

function SearchIcon() {
  return (
    <svg
      className="w-3.5 h-3.5 text-muted/70 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="7" />
      <line x1="20" y1="20" x2="16.65" y2="16.65" />
    </svg>
  )
}
