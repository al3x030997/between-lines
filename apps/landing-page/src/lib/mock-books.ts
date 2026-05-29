import { exampleCoverArt, requireExampleBookMetadata } from './example-book-library';

export type Tier = 'free' | 'rc' | 'subscribe';

export type ChapterAccess =
  | { type: 'free' }
  | { type: 'rc'; cost: number }
  | { type: 'subscribe' };

export type Chapter = {
  num: number;
  slug: string;
  title: string;
  words: number;
  access: ChapterAccess;
  body?: string;
};

export type BookBadge = 'bl' | 'rp' | 'bp' | 'mp' | 'free';

export type Book = {
  slug: string;
  title: string;
  author: string;
  authorHandle?: string;
  publishYear?: string;
  category: string;
  cover: string;
  coverIsDark?: boolean;
  badges: { kind: BookBadge; label: string }[];
  tags: string[];
  blurb: string;
  blurbLong?: string;
  format: string;
  access: { type: 'free' | 'rc'; label: string };
  price?: string;
  rcPrice?: number;
  memberPrice?: string;
  words: number;
  wordsLabel?: string;
  chapterCount: number;
  readerPicks?: number;
  estRead: string;
  chapters: Chapter[];
  alsoOn?: { label: string; href: string }[];
  section: 'bl' | 'foryou' | 'new' | 'classics';
};

const coverArt = exampleCoverArt;

function libraryChapterSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function libraryChapterAccess(access: 'free' | 'rc' | 'subscribe'): ChapterAccess {
  if (access === 'rc') return { type: 'rc', cost: 5 };
  return { type: access };
}

function bookFromLibrary(slug: string, chapters?: Chapter[]): Book {
  const {
    cover,
    storeBadge: _storeBadge,
    storeBlurb: _storeBlurb,
    chapters: libraryChapters,
    readerQuotes: _readerQuotes,
    ...book
  } = requireExampleBookMetadata(slug);
  return {
    ...book,
    cover: coverArt(cover.filename),
    chapters:
      chapters ??
      (libraryChapters ?? []).map((chapter, index) => ({
        num: index + 1,
        slug: libraryChapterSlug(chapter.title),
        title: chapter.title,
        words: chapter.words,
        access: libraryChapterAccess(chapter.access),
      })),
  };
}

// ============================================================
// THE QUIET HOURS — full chapter 1 text
// ============================================================
const quietHoursCh1: string = `
<p>Eleanor Marsh had not opened the east corridor in eleven years. This was not an oversight. The east corridor was where the family kept things they did not wish to examine — the first wife's watercolours, the boy's things, the grandfather's unfinished letters. Eleanor had learned, in thirty years of service, that the correct relationship with such rooms was one of respectful avoidance.</p>
<p>It was the damp that had changed her mind. A cold October had brought water in through the eaves, and the housekeeper's duty, however carefully circumscribed, extended to the preservation of the house itself. She had gone in with a torch and a bucket and found, behind the panel at the far end of the corridor, a box.</p>
<p>The box was not, in itself, remarkable. It was wooden, plain, roughly the size of a hatbox, sealed with a length of brown twine that had been knotted so many times it had become almost ornamental. What was remarkable was the name written across its lid in a hand she had never seen before, in ink that had barely faded.</p>
<p>The name was hers.</p>
<p>She stood for a long time in the cold of the corridor, holding the torch at an angle so that the light fell across the letters without quite committing to illuminating them. She was aware of the particular quality of the silence around her — a silence that had been stored here, preserved like the watercolours and the boy's things and the grandfather's letters, waiting for exactly this moment.</p>
<p>She had put the box back. She had gone downstairs and made the family their supper. She had not slept.</p>
<p>In the morning she went back.</p>
`.trim();

// ============================================================
// MONTE CRISTO — full chapter 1 text (public domain)
// ============================================================
const monteCristoCh1: string = `
<p>On the 24th of February, 1815, the look-out at Notre-Dame de la Garde signalled the three-master, the <em>Pharaon</em> from Smyrna, Trieste, and Naples.</p>
<p>As usual, a pilot put off immediately, and rounding the Château d'If, got on board the vessel between Cape Morgiou and Rion island.</p>
<p>Immediately, and according to custom, the ramparts of Fort Saint-Jean were covered with spectators; it is always an event at Marseilles for a ship to come into port, especially when this ship, like the <em>Pharaon</em>, has been built, rigged, and laden at the old Phocee docks, and belongs to an owner of the city.</p>
<p>The ship drew on and had safely passed the strait, which some volcanic shock has made between the Calasareigne and Jaros islands; had doubled Pomègue, and approached the harbor under topsails, jib, and spanker, but so slowly and sedately that the idlers, with that instinct which is the forerunner of evil, asked one another what misfortune could have happened on board.</p>
<p>Standing by the side of the pilot, who was steering the <em>Pharaon</em> towards the narrow entrance of the inner port, was a young man, who, with activity and vigilant eye, watched every motion of the ship, and repeated each direction of the pilot.</p>
<p>He was a fine, tall, slim young fellow of eighteen or twenty, with black eyes, and hair as dark as a raven's wing; and his whole appearance bespoke that calmness and resolution peculiar to men accustomed from their cradle to contend with danger.</p>
<p>"Ah, is it you, Dantès?" cried the man in the skiff. "What's the matter? and why have you such an air of sadness aboard?"</p>
<p>"A great misfortune, M. Morrel," replied the young man, "a great misfortune, for me especially! Off Civita Vecchia we lost our brave Captain Leclere."</p>
<p>"And the cargo?" inquired the owner, eagerly.</p>
<p>"Is all safe, M. Morrel; and I think you will be satisfied on that head. But poor Captain Leclere——"</p>
<p>"What happened to him?" asked the owner, with an air of considerable resignation. "What happened to the worthy captain?"</p>
<p>"He died."</p>
<p>"Fell into the sea?"</p>
<p>"No, sir, he died of brain-fever in dreadful agony." Then turning to the crew, he said, "Bear a hand there, to take in sail!"</p>
<p>All hands obeyed, and at once the eight or ten seamen who composed the crew sprang to their respective stations. The young sailor gave a look to see that his orders were promptly and accurately obeyed, and then turned again to the owner.</p>
<p>"And how did this misfortune occur?" inquired the latter, resuming the interrupted conversation.</p>
<p>"Alas, sir, in the most unexpected manner. After a long talk with the harbor-master, Captain Leclere left Naples greatly disturbed in mind. In twenty-four hours he was attacked by a fever, and died three days afterwards. We performed the usual burial service, and he is at his rest, sewn up in his hammock with a thirty-six-pound shot at his head and his heels, off El Giglio island. We bring to his widow his sword and cross of honor."</p>
<p>"Well, well, my dear Edmond," continued the owner, "don't let me detain you. You have managed my affairs so well that I ought to allow you all the time you require for your own."</p>
<p>"Then I have your leave, sir?"</p>
<p>"Yes, if you have nothing more to say to me."</p>
<p>"Nothing."</p>
<p>"Then you can come and dine with me?"</p>
<p>"I really must ask you to excuse me, M. Morrel. My first visit is due to my father, though I am not the less grateful for the honor you have done me."</p>
<p>"Right, Dantès, quite right. I always knew you were a good son."</p>
`.trim();

// ============================================================
// BOOKS
// ============================================================
const books: Book[] = [
  {
    slug: 'the-quiet-hours',
    title: 'The Quiet Hours',
    author: 'Clara Ashworth',
    authorHandle: 'MidnightDraftsman',
    category: 'Literary Fiction · Novel',
    cover: coverArt('the-quiet-hours'),
    badges: [
      { kind: 'bl', label: '📰 BetweenLines Pick' },
      { kind: 'rp', label: '📖 38 Reader Picks' },
      { kind: 'bp', label: '🔍 12 Beta Picks' },
    ],
    tags: ['Literary Fiction', 'Reflective', 'Calming', 'Novel'],
    blurb:
      "A housekeeper discovers a box of letters that reframes everything she thought she knew about the family she served for thirty years.",
    blurbLong:
      "Eleanor Marsh has given thirty years to Ashwick Hall. She knows every room, every creak, every silence. Then, behind a loose panel in the east corridor, she finds a box of letters addressed to no one she recognises. And everything she thought she understood begins to come apart.\n\nA quiet, devastating novel about what we choose not to see.",
    format: 'Novel · 41,240 words',
    access: { type: 'free', label: '✓ Free to start' },
    price: '$4.99',
    rcPrice: 100,
    memberPrice: '$3.99',
    words: 41240,
    wordsLabel: '41,240',
    chapterCount: 14,
    readerPicks: 38,
    estRead: '~4hr',
    chapters: [
      { num: 1, slug: 'the-letter-in-the-wall', title: 'The Letter in the Wall', words: 3120, access: { type: 'free' }, body: quietHoursCh1 },
      { num: 2, slug: 'what-mrs-avery-kept', title: 'What Mrs Avery Kept', words: 2840, access: { type: 'free' } },
      { num: 3, slug: 'the-first-winter', title: 'The First Winter', words: 3200, access: { type: 'free' } },
      { num: 4, slug: 'a-name-on-the-door', title: 'A Name on the Door', words: 2960, access: { type: 'rc', cost: 5 } },
      { num: 5, slug: 'the-east-corridor', title: 'The East Corridor', words: 3080, access: { type: 'subscribe' } },
    ],
    alsoOn: [
      { label: 'Amazon', href: '#' },
      { label: 'Kobo', href: '#' },
    ],
    section: 'bl',
  },
  {
    slug: 'three-tuesdays',
    title: 'Three Tuesdays in November',
    author: 'David Liang',
    authorHandle: 'MidnightDraftsman',
    category: 'Short Story Collection',
    cover: coverArt('three-tuesdays-in-november'),
    badges: [{ kind: 'bl', label: '📰 BetweenLines Pick' }],
    tags: ['Literary Fiction', 'Short Stories', 'Reflective'],
    blurb: "Linked stories across three decades. Each narrator shares a secret — but only the reader knows what it is.",
    format: 'Short Story Collection',
    access: { type: 'free', label: '✓ Free to start' },
    price: '$5.99',
    rcPrice: 120,
    memberPrice: '$4.79',
    words: 28500,
    wordsLabel: '28,500',
    chapterCount: 9,
    estRead: '~3hr',
    chapters: [
      { num: 1, slug: 'the-first-tuesday', title: 'The First Tuesday', words: 3200, access: { type: 'free' } },
      { num: 2, slug: 'a-borrowed-coat', title: 'A Borrowed Coat', words: 2900, access: { type: 'free' } },
    ],
    section: 'bl',
  },
  {
    slug: 'the-glass-meridian',
    title: 'The Glass Meridian',
    author: 'NocturnalReader',
    category: 'Speculative · Novel',
    cover: coverArt('the-glass-meridian'),
    badges: [{ kind: 'bl', label: '📰 BetweenLines Pick' }],
    tags: ['Speculative', 'Reflective', 'Novel'],
    blurb: "A climate scientist in 2047 discovers her models have been predicting not just weather — but memory.",
    format: 'Novel',
    access: { type: 'rc', label: '5 RC to unlock more' },
    price: '$6.99',
    rcPrice: 140,
    memberPrice: '$5.59',
    words: 54000,
    wordsLabel: '54,000',
    chapterCount: 22,
    estRead: '~5hr',
    chapters: [
      { num: 1, slug: 'the-thirteenth-anomaly', title: 'The Thirteenth Anomaly', words: 4100, access: { type: 'free' } },
    ],
    section: 'bl',
  },
  {
    slug: 'ember-and-the-cartographer',
    title: 'Ember & the Cartographer',
    author: 'TheOpenChapter',
    category: 'Adventure · Novel',
    cover: coverArt('ember-and-the-cartographer'),
    badges: [{ kind: 'bp', label: '🔍 Beta Pick' }],
    tags: ['Adventure', 'Reflective', 'Novel'],
    blurb: "A young woman inherits a map that updates itself in real time — and starts leading her somewhere she can't explain.",
    format: 'Novel',
    access: { type: 'free', label: '✓ Free to start' },
    price: '$4.99',
    rcPrice: 100,
    memberPrice: '$3.99',
    words: 48200,
    wordsLabel: '48,200',
    chapterCount: 18,
    estRead: '~5hr',
    chapters: [
      { num: 1, slug: 'an-inheritance', title: 'An Inheritance', words: 3800, access: { type: 'free' } },
    ],
    section: 'foryou',
  },
  {
    slug: 'salt-and-the-sea-between',
    title: 'Salt & the Sea Between',
    author: 'MarginNotes',
    category: 'Historical · Novel',
    cover: coverArt('salt-and-the-sea-between'),
    badges: [{ kind: 'mp', label: '✦ Member Pick' }],
    tags: ['Historical', 'Slow Burn', 'Novel'],
    blurb: "Two lighthouse keepers, one storm, and letters written over fifty years that never arrived.",
    format: 'Novel',
    access: { type: 'rc', label: '5 RC to unlock more' },
    price: '$5.99',
    rcPrice: 120,
    memberPrice: '$4.79',
    words: 62000,
    wordsLabel: '62,000',
    chapterCount: 24,
    estRead: '~6hr',
    chapters: [
      { num: 1, slug: 'the-first-storm', title: 'The First Storm', words: 3500, access: { type: 'free' } },
    ],
    section: 'foryou',
  },
  {
    slug: 'before-the-frost',
    title: 'Before the Frost',
    author: 'Priya Menon',
    authorHandle: 'MidnightDraftsman',
    category: 'Short Story',
    cover: coverArt('before-the-frost'),
    badges: [{ kind: 'rp', label: '📖 Reader Pick' }],
    tags: ['Literary Fiction', 'Reflective', 'Short Story'],
    blurb: "A woman returns to her childhood home to find it exactly as she left it — except for one room.",
    format: 'Short Story · 3,200 words',
    access: { type: 'free', label: '✓ Free to read' },
    price: '$2.99',
    rcPrice: 60,
    memberPrice: '$2.39',
    words: 3200,
    wordsLabel: '3,200',
    chapterCount: 1,
    estRead: '~20min',
    chapters: [
      { num: 1, slug: 'before-the-frost', title: 'Before the Frost', words: 3200, access: { type: 'free' } },
    ],
    section: 'foryou',
  },
  bookFromLibrary('the-empty-chair', [
    { num: 1, slug: 'a-house-with-one-light-on', title: 'A House With One Light On', words: 2100, access: { type: 'free' } },
    { num: 2, slug: 'what-the-desk-kept', title: 'What the Desk Kept', words: 1800, access: { type: 'free' } },
    { num: 3, slug: 'the-empty-chair', title: 'The Empty Chair', words: 1700, access: { type: 'rc', cost: 5 } },
  ]),
  bookFromLibrary('the-margin-notes', [
    { num: 1, slug: 'a-copy-of-middlemarch', title: 'A Copy of Middlemarch', words: 2600, access: { type: 'free' } },
    { num: 2, slug: 'pencil-answers', title: 'Pencil Answers', words: 2400, access: { type: 'free' } },
    { num: 3, slug: 'the-return-shelf', title: 'The Return Shelf', words: 2500, access: { type: 'rc', cost: 5 } },
  ]),
  bookFromLibrary('ink-and-wander', [
    { num: 1, slug: 'mile-one', title: 'Mile One', words: 1800, access: { type: 'free' } },
    { num: 2, slug: 'rain-in-the-crosswalk', title: 'Rain in the Crosswalk', words: 1400, access: { type: 'free' } },
    { num: 3, slug: 'the-map-is-a-habit', title: 'The Map Is a Habit', words: 1650, access: { type: 'rc', cost: 5 } },
  ]),
  {
    slug: 'the-archivist-of-small-things',
    title: 'The Archivist of Small Things',
    author: 'QuietPageTurner',
    category: 'Literary Fiction · Novel',
    cover: coverArt('the-archivist-of-small-things'),
    badges: [{ kind: 'bp', label: '🔍 Beta Pick' }],
    tags: ['Literary Fiction', 'Reflective', 'Novel'],
    blurb: "A woman who collects other people's discarded photographs begins to notice the same stranger in all of them.",
    format: 'Novel · Ch. 1–4 available',
    access: { type: 'free', label: '✓ Free to start' },
    price: '$4.99',
    rcPrice: 100,
    memberPrice: '$3.99',
    words: 36000,
    wordsLabel: '36,000',
    chapterCount: 4,
    estRead: '~4hr',
    chapters: [
      { num: 1, slug: 'shoebox-no-7', title: 'Shoebox No. 7', words: 3200, access: { type: 'free' } },
    ],
    section: 'new',
  },
  {
    slug: 'what-the-river-keeps',
    title: 'What the River Keeps',
    author: 'SilverMarginal',
    category: 'Poetry Collection',
    cover: coverArt('what-the-river-keeps'),
    badges: [],
    tags: ['Poetry', 'Reflective'],
    blurb: "Six voices. One river. The things left behind when people move on.",
    format: 'Poetry Collection',
    access: { type: 'free', label: '✓ Free to read' },
    price: '$3.99',
    rcPrice: 80,
    memberPrice: '$3.19',
    words: 7800,
    wordsLabel: '7,800',
    chapterCount: 6,
    estRead: '~45min',
    chapters: [
      { num: 1, slug: 'the-first-voice', title: 'The First Voice', words: 1100, access: { type: 'free' } },
    ],
    section: 'new',
  },
  {
    slug: 'the-count-of-monte-cristo',
    title: 'The Count of Monte Cristo',
    author: 'Alexandre Dumas',
    publishYear: '1844',
    category: 'Adventure · Classic · 1844',
    cover: coverArt('the-count-of-monte-cristo'),
    badges: [
      { kind: 'free', label: '✓ Free · Public Domain' },
      { kind: 'rp', label: '📖 Reader Pick' },
    ],
    tags: ['Adventure', 'Classic', 'Thriller', 'Intense', 'Novel'],
    blurb: "Falsely imprisoned on his wedding day, Edmond Dantès escapes after fourteen years and returns as the mysterious Count — to reward the loyal and destroy those who betrayed him.",
    blurbLong:
      "On the 24th of February 1815, young sailor Edmond Dantès returns to Marseilles to marry the woman he loves and take command of his ship. By nightfall he is arrested, falsely accused by jealous rivals, and imprisoned without trial in the Château d'If.\n\nFourteen years later, he escapes — transformed, wealthy, and patient. Returning to Paris as the mysterious Count of Monte Cristo, he sets in motion a plan of perfect, devastating vengeance.",
    format: 'Novel · 117 chapters',
    access: { type: 'free', label: '✓ Free to read' },
    words: 1200000,
    wordsLabel: '~1.2M',
    chapterCount: 117,
    estRead: '~60hr',
    chapters: [
      { num: 1, slug: 'marseilles-the-arrival', title: 'Marseilles — The Arrival', words: 3800, access: { type: 'free' }, body: monteCristoCh1 },
      { num: 2, slug: 'father-and-son', title: 'Father and Son', words: 2200, access: { type: 'free' } },
      { num: 3, slug: 'the-catalans', title: 'The Catalans', words: 3100, access: { type: 'free' } },
    ],
    alsoOn: [{ label: 'Project Gutenberg', href: 'https://www.gutenberg.org/ebooks/1184' }],
    section: 'classics',
  },
  bookFromLibrary('the-lantern-orchard'),
  bookFromLibrary('a-map-of-quiet-rooms'),
  bookFromLibrary('weather-for-borrowed-houses'),
  bookFromLibrary('the-ninth-harbor'),
  bookFromLibrary('small-fires-soft-rain'),
  bookFromLibrary('the-museum-of-last-requests'),
  bookFromLibrary('red-thread-under-snow'),
  bookFromLibrary('the-choir-at-the-end-of-august'),
  bookFromLibrary('where-the-blue-letters-go'),
  bookFromLibrary('the-clockmakers-daughter'),
];

export type Section = {
  id: 'bl' | 'foryou' | 'new' | 'classics';
  label: string;
};

export const sections: Section[] = [
  { id: 'bl', label: 'BetweenLines Picks' },
  { id: 'foryou', label: 'For You' },
  { id: 'new', label: 'New This Week' },
  { id: 'classics', label: 'Classics — Free to Read' },
];

export function getBook(slug: string): Book | undefined {
  return books.find((b) => b.slug === slug);
}

export function getBooksBySection(id: Section['id']): Book[] {
  return books.filter((b) => b.section === id);
}

export function getAllBooks(): Book[] {
  return books;
}

// Mock counts for the Discover header eyebrow. The mock data doesn't yet
// carry per-book reading progress, so this stays a single hardcoded book
// (The Quiet Hours) until that lands.
export function getInProgressCount(): number {
  return 1;
}

export function getBetweenLinesInviteCount(): number {
  return 2;
}

export function getChapter(bookSlug: string, chapterSlug: string): { book: Book; chapter: Chapter; prev?: Chapter; next?: Chapter } | undefined {
  const book = getBook(bookSlug);
  if (!book) return undefined;
  const idx = book.chapters.findIndex((c) => c.slug === chapterSlug);
  if (idx < 0) return undefined;
  return {
    book,
    chapter: book.chapters[idx]!,
    prev: idx > 0 ? book.chapters[idx - 1] : undefined,
    next: book.chapters[idx + 1],
  };
}
