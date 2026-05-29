export type ExampleBookSection = 'bl' | 'foryou' | 'new' | 'classics';

export type ExampleBookBadgeKind = 'bl' | 'rp' | 'bp' | 'mp' | 'free';

export type ExampleBookMetadata = {
  slug: string;
  title: string;
  author: string;
  authorHandle?: string;
  publishYear?: string;
  category: string;
  cover: {
    filename: string;
    path: string;
    width: number;
    height: number;
  };
  coverIsDark?: boolean;
  badges: { kind: ExampleBookBadgeKind; label: string }[];
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
  chapters?: {
    title: string;
    words: number;
    access: 'free' | 'rc' | 'subscribe';
  }[];
  readerPicks?: number;
  readerQuotes?: {
    quote: string;
    reader: string;
  }[];
  estRead: string;
  section: ExampleBookSection;
  storeBadge?: { kind: 'new' | 'rp' | 'bl' | 'mp' | 'free'; label: string };
  storeBlurb?: string;
};

const cover = (filename: string, width = 768, height = 1152): ExampleBookMetadata['cover'] => ({
  filename,
  path: `/covers/${filename}.jpg`,
  width,
  height,
});

export const exampleCoverArt = (filename: string) =>
  `linear-gradient(180deg, rgba(8, 8, 8, 0.05) 0%, rgba(8, 8, 8, 0.34) 58%, rgba(8, 8, 8, 0.58) 100%), url('/covers/${filename}.jpg') center/cover no-repeat`;

export const EXAMPLE_BOOK_LIBRARY: ExampleBookMetadata[] = [
  {
    slug: 'the-quiet-hours',
    title: 'The Quiet Hours',
    author: 'Clara Ashworth',
    authorHandle: 'MidnightDraftsman',
    category: 'Literary Fiction - Novel',
    cover: cover('the-quiet-hours'),
    badges: [
      { kind: 'bl', label: 'BetweenLines Pick' },
      { kind: 'rp', label: '38 Reader Picks' },
      { kind: 'bp', label: '12 Beta Picks' },
    ],
    tags: ['Literary Fiction', 'Reflective', 'Calming', 'Novel'],
    blurb:
      'A housekeeper discovers a box of letters that reframes everything she thought she knew about the family she served for thirty years.',
    blurbLong:
      'Eleanor Marsh has given thirty years to Ashwick Hall. She knows every room, every creak, every silence. Then, behind a loose panel in the east corridor, she finds a box of letters addressed to no one she recognises. And everything she thought she understood begins to come apart.\n\nA quiet, devastating novel about what we choose not to see.',
    format: 'Novel - 41,240 words',
    access: { type: 'free', label: 'Free to start' },
    price: '$4.99',
    rcPrice: 100,
    memberPrice: '$3.99',
    words: 41240,
    wordsLabel: '41,240',
    chapterCount: 14,
    readerPicks: 38,
    estRead: '~4hr',
    section: 'bl',
    storeBadge: { kind: 'new', label: 'New' },
    storeBlurb:
      'A housekeeper discovers a box of letters that reframes thirty years of loyal service - and one life she never knew existed.',
  },
  {
    slug: 'three-tuesdays',
    title: 'Three Tuesdays in November',
    author: 'David Liang',
    authorHandle: 'MidnightDraftsman',
    category: 'Short Story Collection',
    cover: cover('three-tuesdays-in-november'),
    badges: [{ kind: 'bl', label: 'BetweenLines Pick' }],
    tags: ['Literary Fiction', 'Short Stories', 'Reflective'],
    blurb: 'Linked stories across three decades. Each narrator shares a secret - but only the reader knows what it is.',
    format: 'Short Story Collection',
    access: { type: 'free', label: 'Free to start' },
    price: '$5.99',
    rcPrice: 120,
    memberPrice: '$4.79',
    words: 28500,
    wordsLabel: '28,500',
    chapterCount: 9,
    estRead: '~3hr',
    section: 'bl',
  },
  {
    slug: 'the-glass-meridian',
    title: 'The Glass Meridian',
    author: 'NocturnalReader',
    category: 'Speculative - Novel',
    cover: cover('the-glass-meridian'),
    badges: [{ kind: 'bl', label: 'BetweenLines Pick' }],
    tags: ['Speculative', 'Reflective', 'Novel'],
    blurb: 'A climate scientist in 2047 discovers her models have been predicting not just weather - but memory.',
    format: 'Novel',
    access: { type: 'rc', label: '5 RC to unlock more' },
    price: '$6.99',
    rcPrice: 140,
    memberPrice: '$5.59',
    words: 54000,
    wordsLabel: '54,000',
    chapterCount: 22,
    estRead: '~5hr',
    section: 'bl',
  },
  {
    slug: 'ember-and-the-cartographer',
    title: 'Ember & the Cartographer',
    author: 'TheOpenChapter',
    category: 'Adventure - Novel',
    cover: cover('ember-and-the-cartographer'),
    badges: [{ kind: 'bp', label: 'Beta Pick' }],
    tags: ['Adventure', 'Reflective', 'Novel'],
    blurb: "A young woman inherits a map that updates itself in real time - and starts leading her somewhere she can't explain.",
    format: 'Novel',
    access: { type: 'free', label: 'Free to start' },
    price: '$4.99',
    rcPrice: 100,
    memberPrice: '$3.99',
    words: 48200,
    wordsLabel: '48,200',
    chapterCount: 18,
    estRead: '~5hr',
    section: 'foryou',
  },
  {
    slug: 'salt-and-the-sea-between',
    title: 'Salt & the Sea Between',
    author: 'MarginNotes',
    category: 'Historical - Novel',
    cover: cover('salt-and-the-sea-between'),
    badges: [{ kind: 'mp', label: 'Member Pick' }],
    tags: ['Historical', 'Slow Burn', 'Novel'],
    blurb: 'Two lighthouse keepers, one storm, and letters written over fifty years that never arrived.',
    format: 'Novel',
    access: { type: 'rc', label: '5 RC to unlock more' },
    price: '$5.99',
    rcPrice: 120,
    memberPrice: '$4.79',
    words: 62000,
    wordsLabel: '62,000',
    chapterCount: 24,
    estRead: '~6hr',
    section: 'foryou',
  },
  {
    slug: 'before-the-frost',
    title: 'Before the Frost',
    author: 'Priya Menon',
    authorHandle: 'MidnightDraftsman',
    category: 'Short Story',
    cover: cover('before-the-frost'),
    badges: [{ kind: 'rp', label: 'Reader Pick' }],
    tags: ['Literary Fiction', 'Reflective', 'Short Story'],
    blurb: 'A woman returns to her childhood home to find it exactly as she left it - except for one room.',
    format: 'Short Story - 3,200 words',
    access: { type: 'free', label: 'Free to read' },
    price: '$2.99',
    rcPrice: 60,
    memberPrice: '$2.39',
    words: 3200,
    wordsLabel: '3,200',
    chapterCount: 1,
    estRead: '~20min',
    section: 'foryou',
    storeBadge: { kind: 'new', label: 'New' },
    storeBlurb: "Two sisters share a house for one last winter before it is sold. What they say - and don't - is everything.",
  },
  {
    slug: 'the-empty-chair',
    title: 'The Empty Chair',
    author: 'James Okafor',
    authorHandle: 'MidnightDraftsman',
    category: 'Literary Fiction - Short Story',
    cover: cover('the-empty-chair'),
    badges: [{ kind: 'rp', label: 'Reader Pick' }],
    tags: ['Literary Fiction', 'Family', 'Reflective', 'Short Story'],
    blurb: "A son returns home to sort his father's belongings and finds a life hidden in plain sight.",
    blurbLong:
      "After his father's funeral, Daniel comes home to a house already half-packed by relatives who think grief should be practical. The study is empty except for one chair, one locked drawer, and a stack of receipts from journeys nobody in the family remembers.\n\nA spare, intimate story about absence, inheritance, and the people our parents were before they belonged to us.",
    format: 'Short Story - 5,600 words',
    access: { type: 'free', label: 'Free to read' },
    price: '$2.99',
    rcPrice: 60,
    memberPrice: '$2.39',
    words: 5600,
    wordsLabel: '5,600',
    chapterCount: 3,
    readerPicks: 21,
    estRead: '~35min',
    section: 'foryou',
    storeBadge: { kind: 'rp', label: 'Reader Pick' },
  },
  {
    slug: 'the-margin-notes',
    title: 'The Margin Notes',
    author: 'Fatima Al-Rashid',
    category: 'Literary Romance - Novella',
    cover: cover('the-margin-notes'),
    badges: [{ kind: 'bl', label: 'BetweenLines Pick' }],
    tags: ['Literary Fiction', 'Romantic', 'Reflective', 'Novella'],
    blurb: 'A graduate student falls in love with a stranger through the annotations left in a second-hand copy of Middlemarch.',
    blurbLong:
      'Mina buys a battered copy of Middlemarch for her qualifying exams and finds its margins filled with arguments, jokes, and one unsent apology. She starts answering in pencil, knowing the previous owner may never see it. Then the book returns to the same shop with a new note tucked inside.\n\nA bookish novella about intimacy at a distance and the risks hidden in being understood.',
    format: 'Novella - 18,400 words',
    access: { type: 'free', label: 'Free to start' },
    price: '$3.99',
    rcPrice: 80,
    memberPrice: '$3.19',
    words: 18400,
    wordsLabel: '18,400',
    chapterCount: 7,
    readerPicks: 17,
    estRead: '~2hr',
    section: 'new',
  },
  {
    slug: 'ink-and-wander',
    title: 'Ink and Wander',
    author: 'Sofia Reyes',
    category: 'Poetry & Essays',
    cover: cover('ink-and-wander'),
    badges: [{ kind: 'rp', label: 'Reader Pick' }],
    tags: ['Poetry', 'Essays', 'Reflective', 'City'],
    blurb: 'A poet documents a year of walking the same city street - and what she finally sees when she stops looking.',
    blurbLong:
      'For one year, Sofia Reyes walks the same twelve blocks every morning and records what changes: shop windows, weather, strangers, grief. The result is part poetry collection, part field journal, and part love letter to attention.\n\nA quiet, observant book for readers who like lyric essays, city notebooks, and work that rewards rereading.',
    format: 'Poetry & Essays - 12,200 words',
    access: { type: 'free', label: 'Free to start' },
    price: '$4.99',
    rcPrice: 100,
    memberPrice: '$3.99',
    words: 12200,
    wordsLabel: '12,200',
    chapterCount: 12,
    readerPicks: 29,
    estRead: '~90min',
    section: 'new',
    storeBadge: { kind: 'rp', label: 'Reader Pick' },
  },
  {
    slug: 'the-archivist-of-small-things',
    title: 'The Archivist of Small Things',
    author: 'QuietPageTurner',
    category: 'Literary Fiction - Novel',
    cover: cover('the-archivist-of-small-things'),
    badges: [{ kind: 'bp', label: 'Beta Pick' }],
    tags: ['Literary Fiction', 'Reflective', 'Novel'],
    blurb: "A woman who collects other people's discarded photographs begins to notice the same stranger in all of them.",
    format: 'Novel - Ch. 1-4 available',
    access: { type: 'free', label: 'Free to start' },
    price: '$4.99',
    rcPrice: 100,
    memberPrice: '$3.99',
    words: 36000,
    wordsLabel: '36,000',
    chapterCount: 4,
    estRead: '~4hr',
    section: 'new',
  },
  {
    slug: 'what-the-river-keeps',
    title: 'What the River Keeps',
    author: 'SilverMarginal',
    category: 'Poetry Collection',
    cover: cover('what-the-river-keeps'),
    badges: [],
    tags: ['Poetry', 'Reflective'],
    blurb: 'Six voices. One river. The things left behind when people move on.',
    format: 'Poetry Collection',
    access: { type: 'free', label: 'Free to read' },
    price: '$3.99',
    rcPrice: 80,
    memberPrice: '$3.19',
    words: 7800,
    wordsLabel: '7,800',
    chapterCount: 6,
    estRead: '~45min',
    section: 'new',
  },
  {
    slug: 'the-count-of-monte-cristo',
    title: 'The Count of Monte Cristo',
    author: 'Alexandre Dumas',
    publishYear: '1844',
    category: 'Adventure - Classic - 1844',
    cover: cover('the-count-of-monte-cristo'),
    badges: [
      { kind: 'free', label: 'Free - Public Domain' },
      { kind: 'rp', label: 'Reader Pick' },
    ],
    tags: ['Adventure', 'Classic', 'Thriller', 'Intense', 'Novel'],
    blurb:
      'Falsely imprisoned on his wedding day, Edmond Dantes escapes after fourteen years and returns as the mysterious Count - to reward the loyal and destroy those who betrayed him.',
    blurbLong:
      "On the 24th of February 1815, young sailor Edmond Dantes returns to Marseilles to marry the woman he loves and take command of his ship. By nightfall he is arrested, falsely accused by jealous rivals, and imprisoned without trial in the Chateau d'If.\n\nFourteen years later, he escapes - transformed, wealthy, and patient. Returning to Paris as the mysterious Count of Monte Cristo, he sets in motion a plan of perfect, devastating vengeance.",
    format: 'Novel - 117 chapters',
    access: { type: 'free', label: 'Free to read' },
    words: 1200000,
    wordsLabel: '~1.2M',
    chapterCount: 117,
    estRead: '~60hr',
    section: 'classics',
  },
  {
    slug: 'the-lantern-orchard',
    title: 'The Lantern Orchard',
    author: 'Mira Choudhury',
    category: 'Literary Fantasy - Novel',
    cover: cover('the-lantern-orchard', 1024, 1536),
    badges: [{ kind: 'bl', label: 'BetweenLines Pick' }],
    tags: ['Literary Fantasy', 'Magical Realism', 'Hopeful', 'Lush', 'Novel'],
    blurb:
      'After inheriting a failing pear orchard, a grieving botanist discovers the lanterns between the trees bloom only for people ready to tell the truth.',
    blurbLong:
      "Nadia Sen returns to her grandmother's orchard planning to sell it before winter. The trees are diseased, the ledgers are impossible, and every neighbor in town seems to know more about her family than she does. Then the old paper lanterns begin lighting themselves at dusk, each one revealing a memory someone tried to bury.\n\nA warm, grounded novel about inheritance, repair, and the strange courage it takes to stay.",
    format: 'Novel - 68,500 words',
    access: { type: 'free', label: 'Free to start' },
    price: '$6.99',
    rcPrice: 140,
    memberPrice: '$5.59',
    words: 68500,
    wordsLabel: '68,500',
    chapterCount: 24,
    chapters: [
      { title: 'The Trees Remember Light', words: 3600, access: 'free' },
      { title: 'A Ledger Written in Rain', words: 3300, access: 'free' },
      { title: 'Lanterns for the Missing', words: 3900, access: 'rc' },
      { title: 'The Orchard After Midnight', words: 4200, access: 'subscribe' },
    ],
    readerPicks: 46,
    readerQuotes: [
      { reader: 'Evelyn R.', quote: 'It feels magical without ever losing the ache of a real family story.' },
      { reader: 'Jonah M.', quote: 'The kind of book that makes you want to call your grandmother.' },
    ],
    estRead: '~7hr',
    section: 'bl',
    storeBadge: { kind: 'new', label: 'New' },
  },
  {
    slug: 'a-map-of-quiet-rooms',
    title: 'A Map of Quiet Rooms',
    author: 'Elias Venn',
    category: 'Mystery - Novel',
    cover: cover('a-map-of-quiet-rooms', 1024, 1536),
    badges: [{ kind: 'bp', label: 'Beta Pick' }],
    tags: ['Mystery', 'Gothic', 'Reflective', 'Slow Burn', 'Novel'],
    blurb:
      'A restoration architect cataloguing a sealed manor finds a floor plan that changes whenever someone lies inside the house.',
    blurbLong:
      "Thomas Vale accepts a quiet winter contract: document the rooms of Ashmere House before it is converted into a hotel. The work should be simple. But one room has no door, one staircase appears only after midnight, and the house's original map keeps redrawing itself around the secrets of the living.\n\nA restrained gothic mystery for readers who like atmosphere, architecture, and clues hidden in ordinary rooms.",
    format: 'Novel - 74,200 words',
    access: { type: 'rc', label: '5 RC to unlock more' },
    price: '$6.99',
    rcPrice: 140,
    memberPrice: '$5.59',
    words: 74200,
    wordsLabel: '74,200',
    chapterCount: 27,
    chapters: [
      { title: 'North Wing Inventory', words: 4100, access: 'free' },
      { title: 'The Room Behind the Wall', words: 3700, access: 'free' },
      { title: 'A Door Drawn Twice', words: 3900, access: 'rc' },
      { title: 'The House Tells the Truth', words: 4400, access: 'subscribe' },
    ],
    readerPicks: 31,
    readerQuotes: [
      { reader: 'Mina P.', quote: 'Every room felt like a clue. I kept rereading the descriptions for hidden logic.' },
      { reader: 'Samir K.', quote: 'Quietly tense, beautifully built, and much stranger than it first appears.' },
    ],
    estRead: '~8hr',
    section: 'new',
  },
  {
    slug: 'weather-for-borrowed-houses',
    title: 'Weather for Borrowed Houses',
    author: 'Naomi Calder',
    category: 'Literary Fiction - Novel',
    cover: cover('weather-for-borrowed-houses', 1024, 1536),
    badges: [{ kind: 'rp', label: 'Reader Pick' }],
    tags: ['Literary Fiction', 'Family', 'Melancholic', 'Coastal', 'Novel'],
    blurb:
      "Three adult siblings rent a storm-battered seaside house to divide their mother's belongings and find the weather knows their old arguments by name.",
    blurbLong:
      "Mara, June, and Ellis have not spent more than one day together in nine years. Their mother's final instruction brings them to a coastal rental in March with boxes, legal papers, and a storm warning that keeps changing by the hour. Inside the borrowed house, every room seems to hold a different version of the family they thought they had survived.\n\nA clear-eyed, tender novel about grief, siblings, and the homes we use when our own memories become unsafe.",
    format: 'Novel - 59,800 words',
    access: { type: 'free', label: 'Free to start' },
    price: '$5.99',
    rcPrice: 120,
    memberPrice: '$4.79',
    words: 59800,
    wordsLabel: '59,800',
    chapterCount: 20,
    chapters: [
      { title: 'The House Smelled of Salt', words: 3200, access: 'free' },
      { title: 'Inventory in Bad Weather', words: 3000, access: 'free' },
      { title: 'A Room for Each Version', words: 3400, access: 'rc' },
      { title: 'Low Tide, High Windows', words: 3800, access: 'subscribe' },
    ],
    readerPicks: 39,
    readerQuotes: [
      { reader: 'Clare W.', quote: 'A family novel with no easy forgiveness, which made the tenderness hit harder.' },
      { reader: 'Nico D.', quote: 'The storm never felt like a gimmick. It felt like the fourth sibling.' },
    ],
    estRead: '~6hr',
    section: 'foryou',
  },
  {
    slug: 'the-ninth-harbor',
    title: 'The Ninth Harbor',
    author: 'Julian Arce',
    category: 'Historical Adventure - Novel',
    cover: cover('the-ninth-harbor', 1024, 1536),
    badges: [{ kind: 'mp', label: 'Member Pick' }],
    tags: ['Historical', 'Adventure', 'Nautical', 'Intense', 'Novel'],
    blurb:
      'In 1898, a harbor pilot is hired to guide a ship into a port that does not appear on any chart and may not exist twice.',
    blurbLong:
      'Mateo Ibarra knows every shoal between Cadiz and the outer islands. When a silent captain offers him a fortune to enter the Ninth Harbor before dawn, Mateo assumes the job is smuggling, not impossible geography. But the fog opens onto a city of abandoned piers, and every tide brings the harbor closer to erasing the people who found it.\n\nA propulsive historical adventure with sea air, old maps, and a mystery that keeps tightening.',
    format: 'Novel - 82,100 words',
    access: { type: 'rc', label: '5 RC to unlock more' },
    price: '$7.99',
    rcPrice: 160,
    memberPrice: '$6.39',
    words: 82100,
    wordsLabel: '82,100',
    chapterCount: 31,
    chapters: [
      { title: 'Fog Beyond the Breakwater', words: 4300, access: 'free' },
      { title: "The Pilot's Fee", words: 3900, access: 'free' },
      { title: 'Nine Docks, No Bells', words: 4200, access: 'rc' },
      { title: 'A City Below the Tide', words: 4700, access: 'subscribe' },
    ],
    readerPicks: 28,
    readerQuotes: [
      { reader: 'Rafi L.', quote: 'Old-school adventure pacing, but with a literary sense of dread.' },
      { reader: 'Moira S.', quote: 'I could smell the salt and old rope in every chapter.' },
    ],
    estRead: '~9hr',
    section: 'foryou',
  },
  {
    slug: 'small-fires-soft-rain',
    title: 'Small Fires, Soft Rain',
    author: 'Lena Park',
    category: 'Short Story Collection',
    cover: cover('small-fires-soft-rain', 1024, 1536),
    badges: [{ kind: 'bl', label: 'BetweenLines Pick' }],
    tags: ['Short Stories', 'Literary Fiction', 'Bittersweet', 'Urban', 'Quiet'],
    blurb:
      'Twelve linked stories follow the residents of one apartment courtyard through one wet spring of private losses and ordinary kindness.',
    blurbLong:
      'A retired pianist keeps candles for neighbors whose names she pretends not to know. A delivery cyclist learns which windows stay lit after midnight. Two sisters argue through notes left in a laundry room. Across twelve stories, one courtyard becomes a map of small disasters and smaller mercies.\n\nA humane, finely observed collection for readers who like linked stories and emotional precision.',
    format: 'Stories - 34,600 words',
    access: { type: 'free', label: 'Free to start' },
    price: '$5.99',
    rcPrice: 120,
    memberPrice: '$4.79',
    words: 34600,
    wordsLabel: '34,600',
    chapterCount: 12,
    chapters: [
      { title: 'The Candle in 3B', words: 2800, access: 'free' },
      { title: 'Laundry Room Weather', words: 2600, access: 'free' },
      { title: 'Soft Rain in the Courtyard', words: 3100, access: 'rc' },
      { title: 'Small Fires', words: 3400, access: 'subscribe' },
    ],
    readerPicks: 52,
    readerQuotes: [
      { reader: 'Avery T.', quote: 'It made strangers feel knowable without making them simple.' },
      { reader: 'Bea N.', quote: 'Every story landed softly, then stayed with me for days.' },
    ],
    estRead: '~4hr',
    section: 'bl',
    storeBadge: { kind: 'rp', label: 'Reader Pick' },
  },
  {
    slug: 'the-museum-of-last-requests',
    title: 'The Museum of Last Requests',
    author: 'Beatrice Wynn',
    category: 'Speculative Mystery - Novel',
    cover: cover('the-museum-of-last-requests', 1024, 1536),
    badges: [{ kind: 'bp', label: 'Beta Pick' }],
    tags: ['Speculative', 'Mystery', 'Poignant', 'Uncanny', 'Novel'],
    blurb:
      'A museum registrar discovers that each object in a closed gallery fulfills the final wish of someone who has not died yet.',
    blurbLong:
      "Elspeth Gray is hired to catalogue a private collection with one rule: never touch an object after closing. The rule seems theatrical until a cracked teacup repairs a marriage, a railway token prevents an accident, and Elspeth finds her own childhood coat sealed behind glass with tomorrow's date on the label.\n\nA precise, elegant mystery about objects, endings, and the dangerous comfort of being remembered.",
    format: 'Novel - 71,300 words',
    access: { type: 'free', label: 'Free to start' },
    price: '$6.99',
    rcPrice: 140,
    memberPrice: '$5.59',
    words: 71300,
    wordsLabel: '71,300',
    chapterCount: 25,
    chapters: [
      { title: 'Accession No. 0', words: 3700, access: 'free' },
      { title: 'The Teacup Request', words: 3500, access: 'free' },
      { title: 'Objects That Know Your Name', words: 4100, access: 'rc' },
      { title: 'The Gallery After Closing', words: 4300, access: 'subscribe' },
    ],
    readerPicks: 34,
    readerQuotes: [
      { reader: 'Priya G.', quote: 'Clever premise, but the emotional payoffs are what made me keep reading.' },
      { reader: 'Theo B.', quote: 'Uncanny in a clean, almost museum-lit way. I loved the restraint.' },
    ],
    estRead: '~7hr',
    section: 'new',
  },
  {
    slug: 'red-thread-under-snow',
    title: 'Red Thread Under Snow',
    author: 'Anika Sorensen',
    category: 'Historical Romance - Novel',
    cover: cover('red-thread-under-snow', 1024, 1536),
    badges: [{ kind: 'mp', label: 'Member Pick' }],
    tags: ['Historical', 'Romance', 'Slow Burn', 'Winter', 'Tender'],
    blurb:
      'A widowed seamstress in 1912 Norway follows a red thread through a snowbound village to letters her husband never sent.',
    blurbLong:
      "Ingeborg Lien earns her living mending other people's coats and keeping her own grief neat. When red thread begins appearing under fresh snow, it leads her to unfinished letters, hidden debts, and the schoolteacher who has been quietly delivering wood to her door all winter.\n\nA slow-burn historical romance about work, weather, and learning that loyalty to the dead does not forbid tenderness with the living.",
    format: 'Novel - 63,900 words',
    access: { type: 'free', label: 'Free to start' },
    price: '$5.99',
    rcPrice: 120,
    memberPrice: '$4.79',
    words: 63900,
    wordsLabel: '63,900',
    chapterCount: 23,
    chapters: [
      { title: 'The First Red Thread', words: 3300, access: 'free' },
      { title: 'Mending Coats for Winter', words: 3100, access: 'free' },
      { title: 'Letters Under the Woodpile', words: 3600, access: 'rc' },
      { title: 'Snowmelt', words: 3900, access: 'subscribe' },
    ],
    readerPicks: 44,
    readerQuotes: [
      { reader: 'Helen K.', quote: 'A romance where every small gesture matters. Exactly my kind of slow burn.' },
      { reader: 'Sasha V.', quote: 'The winter setting is beautiful, but the emotional restraint is better.' },
    ],
    estRead: '~7hr',
    section: 'foryou',
  },
  {
    slug: 'the-choir-at-the-end-of-august',
    title: 'The Choir at the End of August',
    author: 'Malcolm Reed',
    category: 'Coming-of-Age - Novel',
    cover: cover('the-choir-at-the-end-of-august', 1024, 1536),
    badges: [{ kind: 'rp', label: 'Reader Pick' }],
    tags: ['Coming of Age', 'Literary Fiction', 'Music', 'Warm', 'Nostalgic'],
    blurb:
      'During the last week before his high school closes forever, a reluctant choir captain tries to hold together one final concert.',
    blurbLong:
      'Seventeen-year-old Aaron Bell has one job before Carrington High shuts its doors: get the choir through the alumni concert without anyone noticing half the singers have stopped showing up. But the building is being stripped around them, his best friend has a secret, and every song sounds like goodbye before anyone is ready.\n\nA warm, bittersweet coming-of-age novel about voice, place, and the people who teach us how to leave.',
    format: 'Novel - 52,400 words',
    access: { type: 'free', label: 'Free to start' },
    price: '$4.99',
    rcPrice: 100,
    memberPrice: '$3.99',
    words: 52400,
    wordsLabel: '52,400',
    chapterCount: 19,
    chapters: [
      { title: 'Last Week of Summer', words: 2900, access: 'free' },
      { title: 'Tenors Missing', words: 2700, access: 'free' },
      { title: 'The Auditorium Listens Back', words: 3200, access: 'rc' },
      { title: 'One Final Note', words: 3500, access: 'subscribe' },
    ],
    readerPicks: 48,
    readerQuotes: [
      { reader: 'Leah J.', quote: 'Nostalgic without being sugary. It remembered how big small places feel at seventeen.' },
      { reader: 'Marcus E.', quote: 'The music scenes worked because they were about belonging, not performance.' },
    ],
    estRead: '~5hr',
    section: 'bl',
  },
  {
    slug: 'where-the-blue-letters-go',
    title: 'Where the Blue Letters Go',
    author: 'Imani Bell',
    category: 'Contemporary Epistolary - Novel',
    cover: cover('where-the-blue-letters-go', 1024, 1536),
    badges: [{ kind: 'bl', label: 'BetweenLines Pick' }],
    tags: ['Contemporary', 'Epistolary', 'Tender', 'Friendship', 'Reflective'],
    blurb:
      'A postal worker secretly preserves undeliverable blue envelopes and starts finding replies to letters nobody sent.',
    blurbLong:
      'Ruthie Cole works the dawn shift at a sorting office where misaddressed blue envelopes keep arriving without return names. She saves them because they feel too personal to destroy. When replies begin appearing in the same handwriting as her late best friend, Ruthie has to decide whether a miracle is a comfort, a warning, or one last conversation she is not ready to finish.\n\nA tender contemporary novel told through letters, sorting-room notes, and the quiet rituals of missing someone.',
    format: 'Novel - 46,700 words',
    access: { type: 'free', label: 'Free to start' },
    price: '$4.99',
    rcPrice: 100,
    memberPrice: '$3.99',
    words: 46700,
    wordsLabel: '46,700',
    chapterCount: 16,
    chapters: [
      { title: 'Undeliverable', words: 2800, access: 'free' },
      { title: 'The Blue Bin', words: 2600, access: 'free' },
      { title: 'A Reply With No Sender', words: 3100, access: 'rc' },
      { title: 'Forwarding Address Unknown', words: 3400, access: 'subscribe' },
    ],
    readerPicks: 36,
    readerQuotes: [
      { reader: 'Nora A.', quote: 'It made grief feel practical and sacred at the same time.' },
      { reader: 'Felix R.', quote: 'The letter format never felt cute. It felt necessary.' },
    ],
    estRead: '~5hr',
    section: 'new',
  },
  {
    slug: 'the-clockmakers-daughter',
    title: "The Clockmaker's Daughter",
    author: 'Theo Marsh',
    category: 'Young Adult Fantasy - Novel',
    cover: cover('the-clockmakers-daughter', 1024, 1536),
    badges: [{ kind: 'bp', label: 'Beta Pick' }],
    tags: ['Young Adult', 'Fantasy', 'Adventure', 'Hopeful', 'Inventive'],
    blurb:
      "A clockmaker's apprentice builds a mechanical bird that can rewind one minute, then discovers her missing mother left the design unfinished on purpose.",
    blurbLong:
      "Twelve minutes before the city bells fail, Elian Marsh finds a brass bird beating its wings inside her father's forbidden drawer. The bird can return one minute of time, but each use changes something small and permanent. To repair the clocktower and find her mother, Elian must learn which mistakes are worth keeping.\n\nA bright, clever YA fantasy about craft, consequences, and the bravery of imperfect inventions.",
    format: 'Novel - 57,600 words',
    access: { type: 'free', label: 'Free to start' },
    price: '$5.99',
    rcPrice: 120,
    memberPrice: '$4.79',
    words: 57600,
    wordsLabel: '57,600',
    chapterCount: 21,
    chapters: [
      { title: 'The Bird in the Drawer', words: 3100, access: 'free' },
      { title: 'One Minute Backward', words: 3000, access: 'free' },
      { title: 'The Clocktower Refuses', words: 3500, access: 'rc' },
      { title: 'A Gear Missing Teeth', words: 3700, access: 'subscribe' },
    ],
    readerPicks: 33,
    readerQuotes: [
      { reader: 'Junie M.', quote: 'Whimsical, but the rules of the magic actually matter.' },
      { reader: 'Peter C.', quote: 'A great example of YA fantasy that trusts readers with consequences.' },
    ],
    estRead: '~6hr',
    section: 'foryou',
    storeBadge: { kind: 'new', label: 'New' },
  },
];

export function getExampleBookMetadata(slug: string): ExampleBookMetadata | undefined {
  return EXAMPLE_BOOK_LIBRARY.find((book) => book.slug === slug);
}

export function requireExampleBookMetadata(slug: string): ExampleBookMetadata {
  const book = getExampleBookMetadata(slug);
  if (!book) {
    throw new Error(`Unknown example book: ${slug}`);
  }
  return book;
}

export function getExampleBooksBySection(section: ExampleBookSection): ExampleBookMetadata[] {
  return EXAMPLE_BOOK_LIBRARY.filter((book) => book.section === section);
}
