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
// PROJECT GUTENBERG CLASSICS — public-domain catalogue
// Covers are gradient-only (no jpg in /public/covers), the same technique the
// writer-side covers use. Each carries a short public-domain opening excerpt on
// chapter 1 and links back to Project Gutenberg.
// ============================================================
function classicCover(from: string, mid: string, to: string): string {
  return [
    'linear-gradient(180deg, rgba(8, 8, 8, 0.06) 0%, rgba(8, 8, 8, 0.4) 60%, rgba(8, 8, 8, 0.66) 100%)',
    `linear-gradient(150deg, ${from} 0%, ${mid} 50%, ${to} 100%)`,
  ].join(', ');
}

type ClassicSeed = {
  slug: string;
  title: string;
  author: string;
  publishYear: string;
  category: string;
  cover: string;
  tags: string[];
  blurb: string;
  format: string;
  words: number;
  wordsLabel: string;
  chapterCount: number;
  estRead: string;
  gutenbergId: number;
  readerPicks?: number;
  ch1: { title: string; slug: string; words: number; body: string };
  ch2?: { title: string; slug: string; words: number };
  ch3?: { title: string; slug: string; words: number };
};

function classic(seed: ClassicSeed): Book {
  const chapters: Chapter[] = [
    { num: 1, slug: seed.ch1.slug, title: seed.ch1.title, words: seed.ch1.words, access: { type: 'free' }, body: seed.ch1.body },
  ];
  if (seed.ch2) chapters.push({ num: 2, slug: seed.ch2.slug, title: seed.ch2.title, words: seed.ch2.words, access: { type: 'free' } });
  if (seed.ch3) chapters.push({ num: 3, slug: seed.ch3.slug, title: seed.ch3.title, words: seed.ch3.words, access: { type: 'free' } });
  return {
    slug: seed.slug,
    title: seed.title,
    author: seed.author,
    publishYear: seed.publishYear,
    category: seed.category,
    cover: seed.cover,
    coverIsDark: true,
    badges: [{ kind: 'free', label: '✓ Free · Public Domain' }],
    tags: seed.tags,
    blurb: seed.blurb,
    format: seed.format,
    access: { type: 'free', label: '✓ Free to read' },
    words: seed.words,
    wordsLabel: seed.wordsLabel,
    chapterCount: seed.chapterCount,
    readerPicks: seed.readerPicks,
    estRead: seed.estRead,
    chapters,
    alsoOn: [{ label: 'Project Gutenberg', href: `https://www.gutenberg.org/ebooks/${seed.gutenbergId}` }],
    section: 'classics',
  };
}

const CLASSICS: Book[] = [
  classic({
    slug: 'pride-and-prejudice',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    publishYear: '1813',
    category: 'Romance · Classic · 1813',
    cover: classicCover('#e9d8c3', '#b98a6a', '#3c2a24'),
    tags: ['Romance', 'Classic', 'Comedy of manners', 'Novel'],
    blurb: 'When the wealthy Mr Darcy enters the lives of the Bennet sisters, first impressions and stubborn pride stand between Elizabeth and the love she least expects.',
    format: 'Novel · 61 chapters',
    words: 122000,
    wordsLabel: '~122k',
    chapterCount: 61,
    estRead: '~11hr',
    gutenbergId: 1342,
    readerPicks: 412,
    ch1: {
      title: 'Chapter I',
      slug: 'chapter-i',
      words: 1100,
      body: `
<p>It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.</p>
<p>However little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fixed in the minds of the surrounding families, that he is considered the rightful property of some one or other of their daughters.</p>
<p>"My dear Mr. Bennet," said his lady to him one day, "have you heard that Netherfield Park is let at last?"</p>
<p>Mr. Bennet replied that he had not.</p>
<p>"But it is," returned she; "for Mrs. Long has just been here, and she told me all about it."</p>
<p>Mr. Bennet made no answer.</p>
<p>"Do you not want to know who has taken it?" cried his wife impatiently.</p>
<p>"<em>You</em> want to tell me, and I have no objection to hearing it."</p>
<p>This was invitation enough.</p>
`.trim(),
    },
    ch2: { title: 'Chapter II', slug: 'chapter-ii', words: 1000 },
    ch3: { title: 'Chapter III', slug: 'chapter-iii', words: 1400 },
  }),
  classic({
    slug: 'frankenstein',
    title: 'Frankenstein; or, The Modern Prometheus',
    author: 'Mary Wollstonecraft Shelley',
    publishYear: '1818',
    category: 'Gothic · Classic · 1818',
    cover: classicCover('#cdd8d2', '#5d7a72', '#13201d'),
    tags: ['Gothic', 'Classic', 'Horror', 'Science', 'Novel'],
    blurb: 'A young scientist conquers the secret of life and creates a living being — then recoils from his creation, setting loose a tragedy that hunts them both to the ends of the earth.',
    format: 'Novel · 24 chapters',
    words: 75000,
    wordsLabel: '~75k',
    chapterCount: 24,
    estRead: '~7hr',
    gutenbergId: 84,
    readerPicks: 366,
    ch1: {
      title: 'Letter 1',
      slug: 'letter-1',
      words: 1200,
      body: `
<p><em>To Mrs. Saville, England.</em></p>
<p>St. Petersburgh, Dec. 11th, 17—.</p>
<p>You will rejoice to hear that no disaster has accompanied the commencement of an enterprise which you have regarded with such evil forebodings. I arrived here yesterday, and my first task is to assure my dear sister of my welfare and increasing confidence in the success of my undertaking.</p>
<p>I am already far north of London, and as I walk in the streets of Petersburgh, I feel a cold northern breeze play upon my cheeks, which braces my nerves and fills me with delight. Do you understand this feeling?</p>
<p>This breeze, which has travelled from the regions towards which I am advancing, gives me a foretaste of those icy climes. Inspirited by this wind of promise, my daydreams become more fervent and vivid.</p>
`.trim(),
    },
    ch2: { title: 'Letter 2', slug: 'letter-2', words: 1100 },
    ch3: { title: 'Chapter 1', slug: 'chapter-1', words: 1600 },
  }),
  classic({
    slug: 'dracula',
    title: 'Dracula',
    author: 'Bram Stoker',
    publishYear: '1897',
    category: 'Gothic · Classic · 1897',
    cover: classicCover('#b9a7a4', '#6a1f24', '#160708'),
    tags: ['Gothic', 'Classic', 'Horror', 'Epistolary', 'Novel'],
    blurb: "A young solicitor's journey to a remote Transylvanian castle becomes a fight for survival against an ancient evil with designs on London.",
    format: 'Novel · 27 chapters',
    words: 160000,
    wordsLabel: '~160k',
    chapterCount: 27,
    estRead: '~15hr',
    gutenbergId: 345,
    readerPicks: 298,
    ch1: {
      title: "Jonathan Harker's Journal",
      slug: 'jonathan-harkers-journal',
      words: 1500,
      body: `
<p><em>3 May. Bistritz.</em>—Left Munich at 8:35 P.M., on 1st May, arriving at Vienna early next morning; should have arrived at 6:46, but train was an hour late. Buda-Pesth seems a wonderful place, from the glimpse which I got of it from the train and the little I could walk through the streets.</p>
<p>I feared to go very far from the station, as we had arrived late and would start as near the correct time as possible. The impression I had was that we were leaving the West and entering the East; the most western of splendid bridges over the Danube, which is here of noble width and depth, took us among the traditions of Turkish rule.</p>
<p>We left in pretty good time, and came after nightfall to Klausenburgh. Here I stopped for the night at the Hotel Royale.</p>
`.trim(),
    },
    ch2: { title: 'Chapter II', slug: 'chapter-ii', words: 1700 },
    ch3: { title: 'Chapter III', slug: 'chapter-iii', words: 1900 },
  }),
  classic({
    slug: 'jane-eyre',
    title: 'Jane Eyre: An Autobiography',
    author: 'Charlotte Brontë',
    publishYear: '1847',
    category: 'Gothic Romance · Classic · 1847',
    cover: classicCover('#d7c7b0', '#7a5d4c', '#241a16'),
    tags: ['Romance', 'Gothic', 'Classic', 'Coming of age', 'Novel'],
    blurb: 'An orphaned governess of fierce conscience takes a post at Thornfield Hall, where she meets the brooding Mr Rochester — and the secret his house keeps.',
    format: 'Novel · 38 chapters',
    words: 186000,
    wordsLabel: '~186k',
    chapterCount: 38,
    estRead: '~17hr',
    gutenbergId: 1260,
    readerPicks: 351,
    ch1: {
      title: 'Chapter I',
      slug: 'chapter-i',
      words: 1300,
      body: `
<p>There was no possibility of taking a walk that day. We had been wandering, indeed, in the leafless shrubbery an hour in the morning; but since dinner (Mrs. Reed, when there was no company, dined early) the cold winter wind had brought with it clouds so sombre, and a rain so penetrating, that further out-door exercise was now out of the question.</p>
<p>I was glad of it: I never liked long walks, especially on chilly afternoons: dreadful to me was the coming home in the raw twilight, with nipped fingers and toes, and a heart saddened by the chidings of Bessie, the nurse, and humbled by the consciousness of my physical inferiority to Eliza, John, and Georgiana Reed.</p>
<p>The said Eliza, John, and Georgiana were now clustered round their mama in the drawing-room: she lay reclined on a sofa by the fireside, and with her darlings about her looked perfectly happy.</p>
`.trim(),
    },
    ch2: { title: 'Chapter II', slug: 'chapter-ii', words: 1500 },
    ch3: { title: 'Chapter III', slug: 'chapter-iii', words: 1700 },
  }),
  classic({
    slug: 'great-expectations',
    title: 'Great Expectations',
    author: 'Charles Dickens',
    publishYear: '1861',
    category: 'Bildungsroman · Classic · 1861',
    cover: classicCover('#c9ccc0', '#5b6354', '#191c16'),
    tags: ['Classic', 'Coming of age', 'Drama', 'Novel'],
    blurb: 'The orphan Pip is lifted from a blacksmith’s forge toward a fortune from an unknown benefactor — and learns what his "great expectations" truly cost.',
    format: 'Novel · 59 chapters',
    words: 183000,
    wordsLabel: '~183k',
    chapterCount: 59,
    estRead: '~17hr',
    gutenbergId: 1400,
    readerPicks: 274,
    ch1: {
      title: 'Chapter I',
      slug: 'chapter-i',
      words: 1400,
      body: `
<p>My father's family name being Pirrip, and my Christian name Philip, my infant tongue could make of both names nothing longer or more explicit than Pip. So, I called myself Pip, and came to be called Pip.</p>
<p>I give Pirrip as my father's family name, on the authority of his tombstone and my sister—Mrs. Joe Gargery, who married the blacksmith. As I never saw my father or my mother, and never saw any likeness of either of them (for their days were long before the days of photographs), my first fancies regarding what they were like were unreasonably derived from their tombstones.</p>
<p>Ours was the marsh country, down by the river, within, as the river wound, twenty miles of the sea. My first most vivid and broad impression of the identity of things seems to me to have been gained on a memorable raw afternoon towards evening.</p>
`.trim(),
    },
    ch2: { title: 'Chapter II', slug: 'chapter-ii', words: 1600 },
    ch3: { title: 'Chapter III', slug: 'chapter-iii', words: 1500 },
  }),
  classic({
    slug: 'the-adventures-of-sherlock-holmes',
    title: 'The Adventures of Sherlock Holmes',
    author: 'Arthur Conan Doyle',
    publishYear: '1892',
    category: 'Mystery · Classic · 1892',
    cover: classicCover('#cdbfa6', '#6f5a3c', '#1d180f'),
    tags: ['Mystery', 'Classic', 'Detective', 'Short stories'],
    blurb: 'Twelve cases from 221B Baker Street, where the world’s first consulting detective turns observation into deduction — beginning with the woman who outwitted him.',
    format: 'Collection · 12 stories',
    words: 105000,
    wordsLabel: '~105k',
    chapterCount: 12,
    estRead: '~10hr',
    gutenbergId: 1661,
    readerPicks: 489,
    ch1: {
      title: 'A Scandal in Bohemia',
      slug: 'a-scandal-in-bohemia',
      words: 1600,
      body: `
<p>To Sherlock Holmes she is always <em>the</em> woman. I have seldom heard him mention her under any other name. In his eyes she eclipses and predominates the whole of her sex.</p>
<p>It was not that he felt any emotion akin to love for Irene Adler. All emotions, and that one particularly, were abhorrent to his cold, precise but admirably balanced mind. He was, I take it, the most perfect reasoning and observing machine that the world has seen.</p>
<p>I had seen little of Holmes lately. My marriage had drifted us away from each other. One night—it was on the twentieth of March, 1888—I was returning from a journey to a patient, when my way led me through Baker Street.</p>
`.trim(),
    },
    ch2: { title: 'The Red-Headed League', slug: 'the-red-headed-league', words: 1700 },
    ch3: { title: 'A Case of Identity', slug: 'a-case-of-identity', words: 1400 },
  }),
  classic({
    slug: 'moby-dick',
    title: 'Moby-Dick; or, The Whale',
    author: 'Herman Melville',
    publishYear: '1851',
    category: 'Adventure · Classic · 1851',
    cover: classicCover('#bcc7cd', '#33586a', '#0a1418'),
    tags: ['Adventure', 'Classic', 'Sea', 'Epic', 'Novel'],
    blurb: 'A sailor signs aboard the whaler Pequod and is swept into Captain Ahab’s monomaniacal hunt for the white whale that maimed him.',
    format: 'Novel · 135 chapters',
    words: 209000,
    wordsLabel: '~209k',
    chapterCount: 135,
    estRead: '~20hr',
    gutenbergId: 2701,
    readerPicks: 233,
    ch1: {
      title: 'Loomings',
      slug: 'loomings',
      words: 1500,
      body: `
<p>Call me Ishmael. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world.</p>
<p>It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet—then, I account it high time to get to sea as soon as I can.</p>
<p>This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the ship.</p>
`.trim(),
    },
    ch2: { title: 'The Carpet-Bag', slug: 'the-carpet-bag', words: 1300 },
    ch3: { title: 'The Spouter-Inn', slug: 'the-spouter-inn', words: 2100 },
  }),
  classic({
    slug: 'the-picture-of-dorian-gray',
    title: 'The Picture of Dorian Gray',
    author: 'Oscar Wilde',
    publishYear: '1890',
    category: 'Gothic · Classic · 1890',
    cover: classicCover('#cdb6c4', '#6a3a55', '#1b0f17'),
    tags: ['Gothic', 'Classic', 'Philosophical', 'Novel'],
    blurb: 'A portrait ages and corrupts in secret while its beautiful subject stays young — a bargain that lets Dorian Gray pursue every pleasure without apparent cost.',
    format: 'Novel · 20 chapters',
    words: 78000,
    wordsLabel: '~78k',
    chapterCount: 20,
    estRead: '~7hr',
    gutenbergId: 174,
    readerPicks: 318,
    ch1: {
      title: 'Chapter I',
      slug: 'chapter-i',
      words: 1500,
      body: `
<p>The studio was filled with the rich odour of roses, and when the light summer wind stirred amidst the trees of the garden, there came through the open door the heavy scent of the lilac, or the more delicate perfume of the pink-flowering thorn.</p>
<p>From the corner of the divan of Persian saddle-bags on which he was lying, smoking, as was his custom, innumerable cigarettes, Lord Henry Wotton could just catch the gleam of the honey-sweet and honey-coloured blossoms of a laburnum.</p>
<p>In the centre of the room, clamped to an upright easel, stood the full-length portrait of a young man of extraordinary personal beauty, and in front of it, some little distance away, was sitting the artist himself, Basil Hallward.</p>
`.trim(),
    },
    ch2: { title: 'Chapter II', slug: 'chapter-ii', words: 1700 },
    ch3: { title: 'Chapter III', slug: 'chapter-iii', words: 1600 },
  }),
  classic({
    slug: 'little-women',
    title: 'Little Women',
    author: 'Louisa May Alcott',
    publishYear: '1868',
    category: 'Domestic Fiction · Classic · 1868',
    cover: classicCover('#e3cbb0', '#a9603f', '#2a140d'),
    tags: ['Classic', 'Coming of age', 'Family', 'Novel'],
    blurb: 'The four March sisters — Meg, Jo, Beth, and Amy — grow up together through poverty, ambition, and love in Civil-War New England.',
    format: 'Novel · 47 chapters',
    words: 186000,
    wordsLabel: '~186k',
    chapterCount: 47,
    estRead: '~17hr',
    gutenbergId: 514,
    readerPicks: 305,
    ch1: {
      title: 'Playing Pilgrims',
      slug: 'playing-pilgrims',
      words: 1400,
      body: `
<p>"Christmas won't be Christmas without any presents," grumbled Jo, lying on the rug.</p>
<p>"It's so dreadful to be poor!" sighed Meg, looking down at her old dress.</p>
<p>"I don't think it's fair for some girls to have plenty of pretty things, and other girls nothing at all," added little Amy, with an injured sniff.</p>
<p>"We've got Father and Mother, and each other," said Beth contentedly from her corner.</p>
<p>The four young faces on which the firelight shone brightened at the cheerful words, but darkened again as Jo said sadly, "We haven't got Father, and shall not have him for a long time." She didn't say "perhaps never," but each silently added it, thinking of Father far away, where the fighting was.</p>
`.trim(),
    },
    ch2: { title: 'A Merry Christmas', slug: 'a-merry-christmas', words: 1500 },
    ch3: { title: 'The Laurence Boy', slug: 'the-laurence-boy', words: 1600 },
  }),
  classic({
    slug: 'wuthering-heights',
    title: 'Wuthering Heights',
    author: 'Emily Brontë',
    publishYear: '1847',
    category: 'Gothic · Classic · 1847',
    cover: classicCover('#c2c8c4', '#4f5e58', '#141a18'),
    tags: ['Gothic', 'Classic', 'Romance', 'Tragedy', 'Novel'],
    blurb: 'On the windswept Yorkshire moors, the doomed passion between Catherine and the foundling Heathcliff curdles into a vengeance that scars two families for a generation.',
    format: 'Novel · 34 chapters',
    words: 107000,
    wordsLabel: '~107k',
    chapterCount: 34,
    estRead: '~10hr',
    gutenbergId: 768,
    readerPicks: 261,
    ch1: {
      title: 'Chapter I',
      slug: 'chapter-i',
      words: 1400,
      body: `
<p>1801.—I have just returned from a visit to my landlord—the solitary neighbour that I shall be troubled with. This is certainly a beautiful country! In all England, I do not believe that I could have fixed on a situation so completely removed from the stir of society.</p>
<p>A perfect misanthropist's heaven: and Mr. Heathcliff and I are such a suitable pair to divide the desolation between us. A capital fellow! He little imagined how my heart warmed towards him when I beheld his black eyes withdraw so suspiciously under their brows, as I rode up.</p>
<p>"Mr. Heathcliff?" I said. A nod was the answer.</p>
`.trim(),
    },
    ch2: { title: 'Chapter II', slug: 'chapter-ii', words: 1600 },
    ch3: { title: 'Chapter III', slug: 'chapter-iii', words: 1900 },
  }),
  classic({
    slug: 'adventures-of-huckleberry-finn',
    title: 'Adventures of Huckleberry Finn',
    author: 'Mark Twain',
    publishYear: '1884',
    category: 'Adventure · Classic · 1884',
    cover: classicCover('#d8c79c', '#8a6a35', '#231a0e'),
    tags: ['Adventure', 'Classic', 'Satire', 'Novel'],
    blurb: 'Huck Finn fakes his own death and lights out down the Mississippi on a raft with the runaway Jim, in Twain’s great, restless picture of America.',
    format: 'Novel · 43 chapters',
    words: 110000,
    wordsLabel: '~110k',
    chapterCount: 43,
    estRead: '~10hr',
    gutenbergId: 76,
    readerPicks: 287,
    ch1: {
      title: 'Chapter I',
      slug: 'chapter-i',
      words: 1300,
      body: `
<p>You don't know about me without you have read a book by the name of "The Adventures of Tom Sawyer"; but that ain't no matter. That book was made by Mr. Mark Twain, and he told the truth, mainly. There was things which he stretched, but mainly he told the truth.</p>
<p>That is nothing. I never seen anybody but lied one time or another, without it was Aunt Polly, or the widow, or maybe Mary. Aunt Polly—Tom's Aunt Polly, she is—and Mary, and the Widow Douglas is all told about in that book, which is mostly a true book, with some stretchers, as I said before.</p>
<p>Now the way that the book winds up is this: Tom and me found the money that the robbers hid in the cave, and it made us rich. We got six thousand dollars apiece—all gold.</p>
`.trim(),
    },
    ch2: { title: 'Chapter II', slug: 'chapter-ii', words: 1500 },
    ch3: { title: 'Chapter III', slug: 'chapter-iii', words: 1400 },
  }),
];

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
    cover: coverArt('the-quiet-hours-genre-v2'),
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
    cover: coverArt('three-tuesdays-in-november-genre-v2'),
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
    cover: coverArt('the-glass-meridian-genre-v2'),
    badges: [{ kind: 'bl', label: '📰 BetweenLines Pick' }],
    tags: ['Speculative', 'Reflective', 'Novel'],
    blurb: "A climate scientist in 2047 discovers her models have been predicting not just weather — but memory.",
    format: 'Novel',
    access: { type: 'rc', label: '5 Reading Credits to unlock more' },
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
    cover: coverArt('ember-and-the-cartographer-genre-v2'),
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
    cover: coverArt('salt-and-the-sea-between-genre-v2'),
    badges: [{ kind: 'mp', label: '✦ Member Pick' }],
    tags: ['Historical', 'Slow Burn', 'Novel'],
    blurb: "Two lighthouse keepers, one storm, and letters written over fifty years that never arrived.",
    format: 'Novel',
    access: { type: 'rc', label: '5 Reading Credits to unlock more' },
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
    cover: coverArt('before-the-frost-genre-v2'),
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
    cover: coverArt('the-archivist-of-small-things-genre-v2'),
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
    cover: coverArt('what-the-river-keeps-genre-v2'),
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
    cover: coverArt('the-count-of-monte-cristo-genre-v2'),
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
  ...CLASSICS,
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

// ============================================================
// ACCOUNT MATURITY — what catalogue / shelves a persona sees
// ============================================================
// The platform is framed as an MVP: brand-new accounts see only the three
// original titles plus the public-domain classics, and empty shelves.
// "Frequent" accounts (and anyone else — kid, anonymous, demo deep-links) see
// the whole catalogue and the populated shelves below.
export type AccountMaturity = 'mvp' | 'full';

// The launch catalogue — six originals, in display order. The first is featured;
// the rest fill the "Read our first books" row.
export const MVP_ORIGINAL_SLUGS = [
  'the-quiet-hours',
  'three-tuesdays',
  'the-glass-meridian',
  'ember-and-the-cartographer',
  'salt-and-the-sea-between',
  'before-the-frost',
] as const;

const MVP_HANDLES = new Set(['launch']);

// The six originals as Book objects, in MVP_ORIGINAL_SLUGS order.
export function getLaunchOriginals(): Book[] {
  return MVP_ORIGINAL_SLUGS.flatMap((s) => {
    const book = getBook(s);
    return book ? [book] : [];
  });
}

export function accountMaturity(handle?: string): AccountMaturity {
  return handle && MVP_HANDLES.has(handle) ? 'mvp' : 'full';
}

// MVP accounts only see the three originals + every classic; everyone else
// (including callers that pass no handle) sees the full catalogue.
function visibleBooks(handle?: string): Book[] {
  if (accountMaturity(handle) === 'full') return books;
  const mvp = new Set<string>(MVP_ORIGINAL_SLUGS);
  return books.filter((b) => b.section === 'classics' || mvp.has(b.slug));
}

export function getBooksBySection(id: Section['id'], handle?: string): Book[] {
  return visibleBooks(handle).filter((b) => b.section === id);
}

export function getAllBooks(): Book[] {
  return books;
}

// Mock personal-shelf data, keyed by account handle. Until the app has real
// reading state per user, this table is the source of truth for who's been
// read / saved / finished. Only the "frequent" personas carry history; new
// accounts (and the kid persona) fall through to empty shelves.
type Shelves = {
  inProgress: { slug: string; progress: number }[];
  readingList: string[];
  finished: string[];
};

const EMPTY_SHELVES: Shelves = { inProgress: [], readingList: [], finished: [] };

const SHELVES_BY_HANDLE: Record<string, Shelves> = {
  'frequent-reader': {
    inProgress: [
      { slug: 'the-quiet-hours', progress: 38 },
      { slug: 'the-glass-meridian', progress: 12 },
      { slug: 'salt-and-the-sea-between', progress: 64 },
    ],
    readingList: [
      'three-tuesdays',
      'before-the-frost',
      'the-archivist-of-small-things',
      'what-the-river-keeps',
      'pride-and-prejudice',
      'the-adventures-of-sherlock-holmes',
    ],
    finished: [
      'the-empty-chair',
      'ink-and-wander',
      'the-count-of-monte-cristo',
      'jane-eyre',
      'the-margin-notes',
      'the-lantern-orchard',
    ],
  },
  // The frequent writer reads too, just a lighter trail than the frequent reader.
  'frequent-writer': {
    inProgress: [
      { slug: 'before-the-frost', progress: 47 },
      { slug: 'frankenstein', progress: 22 },
    ],
    readingList: ['what-the-river-keeps', 'the-picture-of-dorian-gray', 'wuthering-heights'],
    finished: ['the-count-of-monte-cristo', 'great-expectations'],
  },
};

function shelvesFor(handle?: string): Shelves {
  return (handle && SHELVES_BY_HANDLE[handle]) || EMPTY_SHELVES;
}

export function getInProgressBooks(handle?: string): { book: Book; progress: number }[] {
  return shelvesFor(handle).inProgress.flatMap((p) => {
    const book = getBook(p.slug);
    return book ? [{ book, progress: p.progress }] : [];
  });
}

export function getReadingListBooks(handle?: string): Book[] {
  return shelvesFor(handle).readingList.flatMap((s) => {
    const book = getBook(s);
    return book ? [book] : [];
  });
}

export function getFinishedBooks(handle?: string): Book[] {
  return shelvesFor(handle).finished.flatMap((s) => {
    const book = getBook(s);
    return book ? [book] : [];
  });
}

export function getInProgressCount(handle?: string): number {
  return shelvesFor(handle).inProgress.length;
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
