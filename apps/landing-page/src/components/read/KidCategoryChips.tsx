'use client';

export type KidCategory = 'all' | 'funny' | 'animals' | 'adventure' | 'picture';

type Chip = { id: KidCategory; label: string; emoji: string };

export const KID_CATEGORIES: Chip[] = [
  { id: 'all', label: 'Everything', emoji: '📚' },
  { id: 'funny', label: 'Funny', emoji: '😂' },
  { id: 'animals', label: 'Animals', emoji: '🦊' },
  { id: 'adventure', label: 'Adventure', emoji: '🗺️' },
  { id: 'picture', label: 'Picture Books', emoji: '🎨' },
];

/**
 * Keywords each chip matches against a book's tags/title/blurb. The mock
 * library is tagged for the adult app, so most chips won't match much yet —
 * they're functional (they narrow via the same matcher search uses) but
 * largely presentational on the current mock data.
 */
export const KID_CATEGORY_TERMS: Record<KidCategory, string[]> = {
  all: [],
  funny: ['funny', 'humor', 'humour', 'comedy'],
  animals: ['animal', 'creature', 'beast'],
  adventure: ['adventure', 'quest', 'journey'],
  picture: ['picture', 'illustrated', 'illustration'],
};

type Props = {
  selected: KidCategory;
  onSelect: (next: KidCategory) => void;
};

export function KidCategoryChips({ selected, onSelect }: Props) {
  return (
    <div className="br-kid-chips" role="group" aria-label="Pick what to read">
      {KID_CATEGORIES.map((c) => (
        <button
          key={c.id}
          type="button"
          className={`br-kid-chip ${selected === c.id ? 'is-on' : ''}`}
          aria-pressed={selected === c.id}
          onClick={() => onSelect(c.id)}
        >
          <span className="br-kid-chip-emoji" aria-hidden="true">{c.emoji}</span>
          <span className="br-kid-chip-label">{c.label}</span>
        </button>
      ))}
    </div>
  );
}
