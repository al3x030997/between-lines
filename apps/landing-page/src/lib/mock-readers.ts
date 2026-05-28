import type {
  BookEntry,
  ClubEntry,
  CreditStat,
  ExternalLink,
  LinkRef,
  MemorableCard,
  NowCard,
  PodEntry,
  ProfileHeroData,
  SignatureQuote,
  Tag,
  Toggle,
  WishCard,
} from './profile-shared';

export type EmoCard = {
  icon: string;
  label: string;
  link: LinkRef;
  author?: string;
  variant: 'amber' | 'blue' | 'mint' | 'rose';
};

export type ReaderProfile = {
  handle: string;
  hero: ProfileHeroData;
  now: NowCard[];
  credits: CreditStat[];

  memorables: MemorableCard[];
  myLine?: { label: string; text: string; attribution: string };

  otherCharactersILove: Tag[];

  gotAway: WishCard[];

  library: {
    body: string;
    tbr: Tag[];
  };

  last3Read: BookEntry[];
  allTimeFavourites: BookEntry[];

  howIRead: Array<{ label: string; value: string }>;
  favouriteGenres: string[];

  favouriteAuthors: {
    recently: Tag[];
    allTime: Tag[];
    onPlatform: Tag[];
  };

  booksThatUndidMe: EmoCard[];

  whenBookBecameFilm: Tag[];

  genrePassion?: {
    icon: string;
    label: string;
    favouriteCharacter: { link: LinkRef; meta: string };
    favouriteBook: { link: LinkRef; meta: string };
    favouriteWriter: { link: LinkRef; meta: string };
  };

  readingCircles: {
    open: Toggle[];
    clubs: ClubEntry[];
    pods: PodEntry[];
  };

  sitWithAnyone?: {
    label: string;
    body: string;
    haiku?: { text: string; attribution: string };
  };

  otherPlaces: ExternalLink[];
};

// helpers
function plain(title: string, subtitle?: string): LinkRef {
  return { kind: 'plain', title, subtitle };
}
function ext(title: string, href = '#', subtitle?: string): LinkRef {
  return { kind: 'external', href, title, subtitle };
}
function book(slug: string, title: string, author?: string): BookEntry {
  return { kind: 'book', slug, title, subtitle: author, author };
}

// ============================================================
// SARAH M. (handle 'sarah-m') — full reader profile
// (port of the source HTML, rebadged as Sarah M.)
// ============================================================
const sarahM: ReaderProfile = {
  handle: 'sarah-m',
  hero: {
    avatarEmoji: '🦉',
    displayName: 'Sarah M.',
    badges: [
      { label: 'Reader', tone: 'reader' },
      { label: 'Beta Reader', tone: 'beta' },
      { label: 'Member since 2024', tone: 'member' },
    ],
    bio:
      'Lost between books and loving every minute of it. Reads mostly at night, always with tea. Cries at the last chapter. Every time.',
    quote: {
      label: 'The line that was written for me',
      text: 'I am not afraid of storms, for I am learning how to sail my ship.',
      attribution: '— Jo March, Little Women (Louisa May Alcott)',
    },
  },
  now: [
    {
      variant: 'gold',
      label: 'Reading right now',
      link: plain('The Midnight Library', 'Matt Haig'),
    },
    {
      variant: 'writer',
      label: '🔒 Beta reading',
      link: { kind: 'writer', handle: 'midnightdraftsman', title: 'An unreleased work' },
      subtitle: '@MidnightDraftsman',
    },
  ],
  credits: [
    { icon: '📚', num: '127', label: 'Books logged' },
    { icon: '✍️', num: '14', label: 'Quotes added' },
    { icon: '🔥', num: '23', label: 'Day streak' },
    { icon: '⭐', num: '31', label: 'Reviews' },
  ],
  memorables: [
    {
      kind: 'Character',
      link: plain('Elizabeth Bennet'),
      source: 'Pride and Prejudice',
      note: "Because I'd rather say the wrong thing than nothing at all.",
    },
    {
      kind: 'Quote',
      quote: "It's no use going back to yesterday, because I was a different person then.",
      attribution: '— Alice, Alice in Wonderland',
    },
    {
      kind: 'Writer',
      link: plain('Sylvia Plath'),
      source: 'Journals, The Bell Jar',
      note: '"There is a voice within me that will not be still."',
    },
  ],
  myLine: {
    label: 'The line that was written for me',
    text: 'I am not afraid of storms, for I am learning how to sail my ship.',
    attribution: '— Jo March, Little Women (Louisa May Alcott)',
  },
  otherCharactersILove: [
    { label: 'Atticus Finch' },
    { label: 'Jay Gatsby' },
    { label: 'Dorothea Brooke' },
    { label: 'Holden Caulfield' },
    { label: 'Hermione Granger' },
  ],
  gotAway: [
    {
      variant: 'mint',
      tall: true,
      label: "If I could time-travel I'd enter the world of...",
      link: plain('Alice in Wonderland'),
      source: 'Lewis Carroll',
      body: "Somewhere between the rabbit hole and the tea party, I think I'd feel perfectly at home.",
      echo: '17 other readers would also enter Wonderland',
    },
    {
      variant: 'amber',
      label: 'A book I wish I had discovered sooner...',
      link: plain('Middlemarch'),
      source: 'George Eliot',
      body: 'Found it at 34. Should have found it at 17.',
    },
    {
      variant: 'rose',
      label: 'A character I wish I could meet...',
      link: plain('Atticus Finch'),
      source: 'To Kill a Mockingbird',
      body: 'To ask if he ever lost faith. And what kept him going.',
    },
    {
      variant: 'writer',
      label: 'A character I wish I had written...',
      link: plain('Dorothea Brooke'),
      source: 'Middlemarch — George Eliot',
      body: 'She contains everything. George Eliot was operating on a different plane entirely.',
    },
  ],
  library: {
    body:
      'Dog-eared paperbacks, too many bookmarks, at least three books on the go at once. Heavy on literary fiction and poetry. Light on anything with a spaceship — unless it\'s Le Guin.',
    tbr: [
      { label: 'James — Percival Everett' },
      { label: 'Intermezzo — Sally Rooney' },
      { label: 'The Women — Kristin Hannah' },
      { label: 'Orbital — Samantha Harvey' },
      { label: '+ 30 more' },
    ],
  },
  last3Read: [
    book('', 'The Midnight Library', 'Matt Haig'),
    book('', 'Pachinko', 'Min Jin Lee'),
    book('', 'Normal People', 'Sally Rooney'),
  ],
  allTimeFavourites: [
    book('', 'To Kill a Mockingbird', 'Harper Lee'),
    book('', 'One Hundred Years of Solitude', 'García Márquez'),
    book('', 'Middlemarch', 'George Eliot'),
  ],
  howIRead: [
    { label: 'What I most often read', value: 'Literary fiction, historical fiction' },
    { label: 'What I also enjoy', value: 'Magical realism, poetry, the occasional thriller' },
    { label: 'How often I read', value: 'Every day — at least an hour' },
    { label: 'My favourite device', value: 'A real book. Always.' },
    { label: 'Languages I enjoy reading in', value: 'English, French, Bengali' },
    { label: 'I dream in...', value: 'English — though my grandmother would be disappointed.' },
  ],
  favouriteGenres: ['Literary Fiction', 'Historical Fiction', 'Magical Realism', 'Poetry', 'Classic', 'Thriller'],
  favouriteAuthors: {
    recently: [{ label: 'Matt Haig' }, { label: 'Min Jin Lee' }, { label: 'Sally Rooney' }, { label: 'Arundhati Roy' }, { label: 'Susanna Clarke' }],
    allTime: [{ label: 'George Eliot' }, { label: 'Virginia Woolf' }, { label: 'Harper Lee' }, { label: 'García Márquez' }, { label: 'Tolstoy' }],
    onPlatform: [
      { label: '@MidnightDraftsman', href: '/writer/midnightdraftsman' },
      { label: '@TheOpenChapter', href: '/writer/theopenchapter' },
      { label: '@MarginNotes', href: '/writer/marginnotes' },
      { label: '@NocturnalReader', href: '/writer/nocturnalreader' },
    ],
  },
  booksThatUndidMe: [
    { variant: 'amber', icon: '😂', label: 'Made me laugh out loud', link: plain('Good Omens'), author: 'Terry Pratchett & Neil Gaiman' },
    { variant: 'blue', icon: '😭', label: 'Made me cry', link: plain('A Little Life'), author: 'Hanya Yanagihara' },
  ],
  whenBookBecameFilm: [
    { label: 'The English Patient' },
    { label: 'Atonement' },
    { label: 'Little Women (2019)' },
    { label: 'The Remains of the Day' },
    { label: 'Pride and Prejudice (2005)' },
  ],
  genrePassion: {
    icon: '🚀',
    label: 'Sci-fi',
    favouriteCharacter: { link: plain('HAL 9000'), meta: '2001: A Space Odyssey' },
    favouriteBook: { link: plain('The Left Hand of Darkness'), meta: 'Ursula K. Le Guin' },
    favouriteWriter: { link: plain('Ursula K. Le Guin'), meta: 'Pioneer. Visionary.' },
  },
  readingCircles: {
    open: [
      { label: "Reader's Clubs", subtitle: 'Hosts can invite me to join their club', on: true },
      { label: 'Reader Pods', subtitle: 'Writers can invite me into their inner circle', on: true },
    ],
    clubs: [
      { icon: '📖', iconBg: '#fff8ee', link: plain('The Literary Fiction Society'), meta: '142 readers · Hosted by @TheOpenChapter' },
      { icon: '🌿', iconBg: '#f0faf4', link: plain('Magical Realism Collective'), meta: '89 readers · Hosted by @MarginNotes' },
      { icon: '🏛️', iconBg: '#f5f0fe', link: plain('Classic Reads — Women Writers'), meta: '214 readers · BetweenReads curated' },
    ],
    pods: [
      {
        icon: '🔒',
        name: 'The Midnight Circle',
        type: 'Reader Pod',
        description: 'An intimate pod around the work of @MidnightDraftsman. Deep conversations. Trusted readers only.',
        members: '5 of 6 members · Invited by the writer',
      },
    ],
  },
  sitWithAnyone: {
    label: "The literary person I'd most want to meet",
    body: "Virginia Woolf. I'd want to sit with her in a garden somewhere and ask her if she knew how much she changed everything.",
    haiku: {
      text: 'An old silent pond\nA frog jumps into the pond\nSplash! Silence again.',
      attribution: '— Matsuo Bashō',
    },
  },
  otherPlaces: [
    { icon: '📗', link: ext('My Goodreads reviews', '#'), subtitle: '31 reviews written · goodreads.com/sarah-m' },
    { icon: '✉️', link: ext("My Substack — The Owl's Reading Notes", '#'), subtitle: "A weekly letter about what I'm reading" },
    { icon: '🎬', link: ext('My Letterboxd', '#'), subtitle: 'For when the book became a film' },
    { icon: '📝', link: ext('My reading notes on Between Reads', '#'), subtitle: 'Thoughts, reflections, between books' },
  ],
};

// ============================================================
// Slim public reader profiles referenced as beta readers
// ============================================================
function slimReader(
  handle: string,
  displayName: string,
  avatarEmoji: string,
  bio: string,
  nowReading: { title: string; author: string },
  fav: BookEntry[],
  followsOnPlatform: Tag[] = []
): ReaderProfile {
  return {
    handle,
    hero: {
      avatarEmoji,
      displayName,
      badges: [
        { label: 'Reader', tone: 'reader' },
        { label: 'Beta Reader', tone: 'beta' },
        { label: 'Member since 2024', tone: 'member' },
      ],
      bio,
      quote: {
        label: 'The line that was written for me',
        text: 'Every book begins as a private silence.',
        attribution: '— ' + displayName,
      },
    },
    now: [
      { variant: 'gold', label: 'Reading right now', link: plain(nowReading.title, nowReading.author) },
    ],
    credits: [
      { icon: '📚', num: '—', label: 'Books logged' },
      { icon: '✍️', num: '—', label: 'Quotes added' },
      { icon: '🔥', num: '—', label: 'Day streak' },
      { icon: '⭐', num: '—', label: 'Reviews' },
    ],
    memorables: [],
    otherCharactersILove: [],
    gotAway: [],
    library: { body: '', tbr: [] },
    last3Read: fav,
    allTimeFavourites: fav,
    howIRead: [],
    favouriteGenres: [],
    favouriteAuthors: { recently: [], allTime: [], onPlatform: followsOnPlatform },
    booksThatUndidMe: [],
    whenBookBecameFilm: [],
    readingCircles: { open: [], clubs: [], pods: [] },
    otherPlaces: [],
  };
}

const theWanderingOwl = slimReader(
  'the-wandering-owl',
  'The Wandering Owl',
  '🦉',
  'Late-night reader. Tea, paperbacks, the long quiet middle of a novel.',
  { title: 'The Midnight Library', author: 'Matt Haig' },
  [book('', 'Middlemarch', 'Eliot'), book('', 'Gilead', 'Robinson')],
  [{ label: '@MidnightDraftsman', href: '/writer/midnightdraftsman' }]
);

const nocturnalReaderRdr = slimReader(
  'nocturnal-reader',
  'NocturnalReader',
  '🌙',
  'Speculative reader by night. Climate, memory, the future as fiction.',
  { title: 'Station Eleven', author: 'Emily St. John Mandel' },
  [book('the-glass-meridian', 'The Glass Meridian')],
);

const marginNotesRdr = slimReader(
  'marginnotes',
  'MarginNotes',
  '📚',
  'Annotates everything. Leaves pencil notes for the next reader.',
  { title: 'The Empusium', author: 'Olga Tokarczuk' },
  [book('salt-and-the-sea-between', 'Salt & the Sea Between')],
);

const theOpenChapterRdr = slimReader(
  'theopenchapter',
  'TheOpenChapter',
  '🌿',
  'Believes a good chapter changes the temperature of the room.',
  { title: 'Demon Copperhead', author: 'Kingsolver' },
  [book('ember-and-the-cartographer', 'Ember & the Cartographer')],
);

const theQuietPage = slimReader(
  'the-quiet-page',
  'The Quiet Page',
  '🦋',
  'Reading for the seasons. Returning to certain books like rooms.',
  { title: 'Housekeeping', author: 'Marilynne Robinson' },
  [book('', 'A Sport and a Pastime', 'Salter')],
);

// ============================================================
// EXPORTS
// ============================================================
const readers: Record<string, ReaderProfile> = {
  [sarahM.handle]: sarahM,
  [theWanderingOwl.handle]: theWanderingOwl,
  [nocturnalReaderRdr.handle]: nocturnalReaderRdr,
  [marginNotesRdr.handle]: marginNotesRdr,
  [theOpenChapterRdr.handle]: theOpenChapterRdr,
  [theQuietPage.handle]: theQuietPage,
};

export function getReaderProfile(handle: string): ReaderProfile | undefined {
  return readers[handle.toLowerCase()];
}

export function getAllReaderHandles(): string[] {
  return Object.keys(readers);
}

export type { ProfileBadge, MemorableCard, WishCard, NowCard, BookEntry, ClubEntry, PodEntry, ExternalLink, Toggle, CreditStat, Tag, SignatureQuote, LinkRef } from './profile-shared';
