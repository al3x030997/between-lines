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
import { exampleCoverArt } from './example-book-library';
import { getBook } from './mock-books';

export type WipCard = {
  link: LinkRef;
  meta: string;
  stage: 'Drafting' | 'Editing' | 'Final';
  description: string;
};

export type BetaActiveCard = {
  title: string;
  chapters: string;
  stage: string;
  meta: string;
  betaReaders: Array<{ icon: string; handle: string; displayName: string }>;
};

export type WriterProfile = {
  handle: string;
  hero: ProfileHeroData;
  /** Optional "line I wrote that surprised even me" override for the hero quote */
  surpriseLine?: SignatureQuote;
  now: NowCard[];
  credits: CreditStat[];
  seekingBeta?: { title: string; meta: string };
  readMeNow?: { link: LinkRef; meta: string };

  memorables: MemorableCard[];
  myLine?: { label: string; text: string; attribution: string };

  myWriting: {
    genre: string;
    style: string;
    influences: Tag[];
    languages: string;
    wips: WipCard[];
    onPlatform: BookEntry[];
  };

  writersWhoMadeMe: {
    influences: Tag[];
    booksThatChangedMe: BookEntry[];
  };

  myReader: {
    body: string;
    idealGenres: string[];
    moods: string[];
  };

  myWritingLife: Array<{ label: string; value: string }>;

  myBetaCircle: {
    active: BetaActiveCard;
    pod: PodEntry;
    acceptRequests: Toggle;
  };

  library: {
    body: string;
    tbr: Tag[];
  };

  last3Read: BookEntry[];
  allTimeFavourites: BookEntry[];

  gotAway: WishCard[];

  sitWithAnyone?: {
    label: string;
    body: string;
    haiku?: { text: string; attribution: string };
  };

  readingCircles: {
    open: Toggle[];
    clubs: ClubEntry[];
  };

  otherPlaces: ExternalLink[];
};

// ============================================================
// SHARED HELPERS
// ============================================================
function plain(title: string, subtitle?: string): LinkRef {
  return { kind: 'plain', title, subtitle };
}
function book(slug: string, title: string, author?: string): BookEntry {
  return { kind: 'book', slug, title, subtitle: author, author };
}

// ============================================================
// MIDNIGHTDRAFTSMAN — full profile (source: writer_profile (5).html)
// ============================================================
const midnightDraftsman: WriterProfile = {
  handle: 'midnightdraftsman',
  hero: {
    avatarEmoji: '🖊️',
    displayName: 'MidnightDraftsman',
    badges: [
      { label: 'Member since 2024', tone: 'member' },
      { label: 'Writer', tone: 'writer' },
      { label: '📋 Longlisted', tone: 'longlist' },
    ],
    bio:
      'Writing literary fiction at midnight, mostly. Interested in the space between what people say and what they mean. Currently on my second novel and learning that the second is always harder.',
    quote: {
      label: 'The line I wrote that surprised even me',
      text: 'She had learned to love the silence — not because it was peaceful, but because it was honest.',
      attribution: '— From The Quiet Hours, Chapter 7',
    },
  },
  now: [
    {
      variant: 'gold',
      label: '📖 Currently reading',
      link: plain('The Remains of the Day', 'Kazuo Ishiguro'),
    },
    {
      variant: 'writer',
      label: '✍️ Currently writing',
      link: plain('The Quiet Hours'),
      subtitle: 'Literary Fiction · Editing · Ch. 14 of 22',
    },
    {
      variant: 'neutral',
      label: '📋 On my TBR',
      values: [plain('James'), plain('Intermezzo')],
      subtitle: 'Percival Everett · Sally Rooney',
    },
    {
      variant: 'sage',
      label: '📝 Also wrote',
      values: [
        book('the-empty-chair', 'The Empty Chair'),
        book('before-the-frost', 'Before the Frost'),
      ],
      subtitle: 'Short stories · Public on Between Reads',
    },
  ],
  credits: [
    { icon: '📝', num: '14', label: 'Chapters wrote' },
    { icon: '🔒', num: '5', label: 'Beta readers' },
    { icon: '⭐', num: '38', label: 'Reader picks' },
    { icon: '🔥', num: '41', label: 'Writing streak' },
  ],
  seekingBeta: {
    title: 'The Quiet Hours — Ch. 1–14',
    meta: 'Literary Fiction · 2 spots open',
  },
  readMeNow: {
    link: book('the-empty-chair', 'The Empty Chair'),
    meta: 'Short story · Free to read · Public',
  },
  memorables: [
    {
      kind: 'Character',
      link: plain('Stevens', 'The Remains of the Day'),
      source: 'The Remains of the Day',
      note:
        'The most devastating portrait of self-deception in literature. I return to him every time I write a character who won\'t admit what they feel.',
    },
    {
      kind: 'Quote',
      quote: 'We do not know what we want and yet we are responsible for what we are.',
      attribution: '— Jean-Paul Sartre',
    },
    {
      kind: 'Writer',
      link: plain('Kazuo Ishiguro'),
      source: 'The Remains of the Day, Never Let Me Go',
      note:
        'He taught me that restraint is not absence. That what a character does not say is the story.',
    },
  ],
  myLine: {
    label: 'The line that was written for me',
    text: 'No tears in the writer, no tears in the reader.',
    attribution: '— Robert Frost',
  },
  myWriting: {
    genre: 'Literary Fiction',
    style: 'Quiet, interior, character-driven',
    influences: [
      { label: 'Ishiguro' },
      { label: 'Marilynne Robinson' },
      { label: 'Alice Munro' },
      { label: 'James Salter' },
    ],
    languages: 'English',
    wips: [
      {
        link: book('the-quiet-hours', 'The Quiet Hours'),
        meta: 'Literary Fiction · Novel · Ch. 14 of 22',
        stage: 'Editing',
        description:
          "A housekeeper in a crumbling country house discovers a box of letters that reframes everything she thought she knew about the family she served for thirty years.",
      },
      {
        link: book('three-tuesdays', 'Three Tuesdays in November'),
        meta: 'Literary Fiction · Short story collection',
        stage: 'Drafting',
        description:
          "Linked stories set in the same small town across three decades. Each told by a different narrator who doesn't know they share a secret.",
      },
    ],
    onPlatform: [
      book('the-quiet-hours', 'The Quiet Hours — Ch. 1–7', 'Beta readers only'),
      book('the-empty-chair', 'The Empty Chair', 'Short story · Public'),
      book('before-the-frost', 'Before the Frost', 'Short story · Public'),
    ],
  },
  writersWhoMadeMe: {
    influences: [
      { label: 'Kazuo Ishiguro' },
      { label: 'Marilynne Robinson' },
      { label: 'Alice Munro' },
      { label: 'Chekhov' },
      { label: 'James Salter' },
    ],
    booksThatChangedMe: [
      book('', 'The Remains of the Day', 'Ishiguro'),
      book('', 'Gilead', 'Robinson'),
      book('', 'A Sport and a Pastime', 'Salter'),
    ],
  },
  myReader: {
    body:
      "I write for the reader who slows down at a sentence they didn't expect. Who reads the last page twice. Who leaves a book on the nightstand for a week after finishing it because they're not ready to be done with it yet.",
    idealGenres: ['Literary Fiction', 'Historical Fiction', 'Short Stories'],
    moods: ['Quiet', 'Reflective', 'Melancholic', 'Hopeful'],
  },
  myWritingLife: [
    { label: 'When I write', value: 'Late at night — after midnight mostly' },
    { label: 'How often', value: 'Every day — even if only a paragraph' },
    { label: 'My writing tool', value: 'Scrivener on a laptop with no wifi' },
    { label: 'My ritual', value: 'Re-read the last paragraph. Delete the first sentence. Begin.' },
    { label: 'I dream in...', value: "English — but my characters sometimes don't." },
    { label: 'Languages I write in', value: 'English' },
  ],
  myBetaCircle: {
    active: {
      title: 'The Quiet Hours — Ch. 1–14',
      chapters: 'Ch. 1–14',
      stage: 'Editing',
      meta: '5 beta readers · Watermarked · Copy disabled',
      betaReaders: [
        { icon: '🦉', handle: 'the-wandering-owl', displayName: 'The Wandering Owl' },
        { icon: '🌙', handle: 'nocturnal-reader', displayName: 'NocturnalReader' },
        { icon: '📚', handle: 'marginnotes', displayName: 'MarginNotes' },
        { icon: '🌿', handle: 'theopenchapter', displayName: 'TheOpenChapter' },
        { icon: '🦋', handle: 'the-quiet-page', displayName: 'The Quiet Page' },
      ],
    },
    pod: {
      icon: '✍️',
      name: 'The Craft Circle',
      type: 'Writer Pod',
      description: 'Four writers. Literary fiction. Monthly craft conversations and manuscript swaps.',
      members: '4 of 4 members · Private',
    },
    acceptRequests: {
      label: 'Accept new beta reader requests',
      subtitle: 'Readers matching your genre can request access',
      on: true,
    },
  },
  library: {
    body:
      'Mostly fiction. A lot of Ishiguro. Every Marilynne Robinson. Chekhov on the desk always. Some poetry. A shelf of books I keep meaning to finish.',
    tbr: [
      { label: 'James — Percival Everett' },
      { label: 'Intermezzo — Sally Rooney' },
      { label: 'Orbital — Samantha Harvey' },
      { label: '+ 18 more' },
    ],
  },
  last3Read: [
    book('', 'The Remains of the Day', 'Ishiguro'),
    book('', 'Gilead', 'Robinson'),
    book('', 'The Sympathizer', 'Nguyen'),
  ],
  allTimeFavourites: [
    book('', 'The Remains of the Day', 'Ishiguro'),
    book('', 'Gilead', 'Robinson'),
    book('', 'A Sport and a Pastime', 'Salter'),
  ],
  gotAway: [
    {
      variant: 'mint',
      tall: true,
      label: "If I could time-travel I'd enter the world of...",
      link: plain('The Remains of the Day'),
      source: 'Kazuo Ishiguro',
      body:
        "Not to fix anything. Just to sit in Darlington Hall and understand what Stevens couldn't say about himself.",
      echo: '9 other writers would also enter this world',
    },
    {
      variant: 'amber',
      label: 'A book I wish I had discovered sooner...',
      link: plain('A Sport and a Pastime'),
      source: 'James Salter',
      body: 'I found it at 38. Every sentence embarrassed me with how good it was.',
    },
    {
      variant: 'rose',
      label: 'A character I wish I had written...',
      link: plain('Stevens'),
      source: 'The Remains of the Day',
      body:
        "The most complete portrait of a person who doesn't know themselves. I'll spend my whole career chasing that.",
    },
    {
      variant: 'writer',
      label: 'A character I wish I could meet...',
      link: plain('John Ames'),
      source: 'Gilead — Marilynne Robinson',
      body:
        'To ask him how he found that much grace. And whether he knew, when he was writing those letters, that he was writing them for all of us.',
    },
  ],
  sitWithAnyone: {
    label: "The literary person I'd most want to meet",
    body: 'Chekhov. Just to ask him how he knew when a story was finished. Because I never do.',
    haiku: {
      text: 'Over the wintry\nforest, winds howl in rage\nwith no leaves to blow.',
      attribution: '— Natsume Soseki',
    },
  },
  readingCircles: {
    open: [
      { label: "Reader's Clubs", subtitle: 'Open to invitations', on: true },
      { label: 'Reader Pods', subtitle: 'Open to invitations', on: false },
    ],
    clubs: [
      {
        icon: '📖',
        iconBg: '#f5f0fe',
        link: plain('Literary Fiction — The Long Form'),
        meta: '88 readers · BetweenReads curated',
      },
      {
        icon: '✒️',
        iconBg: '#f0faf4',
        link: plain('Writers Who Read — Classic Fiction'),
        meta: '54 members · Hosted by @TheOpenMargin',
      },
    ],
  },
  otherPlaces: [
    {
      icon: '🌐',
      link: { kind: 'external', href: '#', title: 'midnightdraftsman.com' },
      subtitle: 'Personal writing site',
    },
    {
      icon: '✉️',
      link: { kind: 'external', href: '#', title: 'Substack — The Midnight Draft' },
      subtitle: 'A weekly note on writing and not writing',
    },
    {
      icon: '📗',
      link: { kind: 'external', href: '#', title: 'My Goodreads' },
      subtitle: '22 reviews · goodreads.com/midnightdraftsman',
    },
    {
      icon: '📝',
      link: { kind: 'external', href: '#', title: 'My reading notes on Between Reads' },
      subtitle: 'Thoughts between books',
    },
  ],
};

// ============================================================
// SARAH M. — slim writer profile (her view of /write origin)
// ============================================================
const sarahM: WriterProfile = {
  handle: 'sarah-m',
  hero: {
    avatarEmoji: '✒️',
    displayName: 'Sarah M.',
    badges: [
      { label: 'Member since 2025', tone: 'member' },
      { label: 'Writer', tone: 'writer' },
    ],
    bio:
      "Drafting in the margins of weeknights. First novel — eight chapters in, still convinced the second sentence is the hardest. I'm here for slow conversations about why stories work.",
    quote: {
      label: 'The line I wrote that surprised even me',
      text: "I had thought I was writing about her — and then I realised I had been writing about who I had to be to keep loving her.",
      attribution: '— From The Salt Letters, Chapter 3',
    },
  },
  now: [
    {
      variant: 'gold',
      label: '📖 Currently reading',
      link: plain('Gilead', 'Marilynne Robinson'),
    },
    {
      variant: 'writer',
      label: '✍️ Currently writing',
      link: plain('The Salt Letters'),
      subtitle: 'Literary Fiction · Drafting · Ch. 8 of 18',
    },
    {
      variant: 'neutral',
      label: '📋 On my TBR',
      values: [plain('Orbital'), plain('James')],
      subtitle: 'Samantha Harvey · Percival Everett',
    },
    {
      variant: 'beta',
      label: '🔒 Beta reading',
      link: { kind: 'writer', handle: 'midnightdraftsman', title: 'The Quiet Hours' },
      subtitle: 'For @MidnightDraftsman · Ch. 1–7',
    },
  ],
  credits: [
    { icon: '📝', num: '8', label: 'Chapters wrote' },
    { icon: '🔒', num: '3', label: 'Beta readers' },
    { icon: '⭐', num: '4', label: 'Reader picks' },
    { icon: '🔥', num: '12', label: 'Writing streak' },
  ],
  seekingBeta: {
    title: 'The Salt Letters — Ch. 1–6',
    meta: 'Literary Fiction · 3 spots open',
  },
  memorables: [
    {
      kind: 'Character',
      link: plain('Dorothea Brooke', 'Middlemarch'),
      source: 'Middlemarch',
      note:
        'For showing me what it costs to want a larger life — and what makes it worth wanting anyway.',
    },
    {
      kind: 'Quote',
      quote: 'A book is a heart that beats in the chest of another.',
      attribution: '— Rebecca Solnit',
    },
    {
      kind: 'Writer',
      link: plain('Marilynne Robinson'),
      source: 'Gilead, Housekeeping',
      note: 'For sentences that are slow on purpose. For grace as a verb.',
    },
  ],
  myWriting: {
    genre: 'Literary Fiction',
    style: 'Epistolary, intimate, family-shaped',
    influences: [{ label: 'Robinson' }, { label: 'Eliot' }, { label: 'Lahiri' }],
    languages: 'English',
    wips: [
      {
        link: plain('The Salt Letters'),
        meta: 'Literary Fiction · Novel · Ch. 8 of 18',
        stage: 'Drafting',
        description:
          'Sisters trading letters across a seven-year silence. What goes unsaid takes the shape of weather, of seasons, of the salt on a coastline that refuses to forget.',
      },
    ],
    onPlatform: [book('the-salt-letters', 'The Salt Letters — Ch. 1–6', 'Beta readers only')],
  },
  writersWhoMadeMe: {
    influences: [
      { label: 'Marilynne Robinson' },
      { label: 'George Eliot' },
      { label: 'Jhumpa Lahiri' },
      { label: 'Toni Morrison' },
    ],
    booksThatChangedMe: [
      book('', 'Middlemarch', 'Eliot'),
      book('', 'Housekeeping', 'Robinson'),
      book('', 'Interpreter of Maladies', 'Lahiri'),
    ],
  },
  myReader: {
    body:
      'I write for the reader who keeps a notebook in their bag. Who underlines in pencil. Who knows that a quiet chapter can hold more than a loud one.',
    idealGenres: ['Literary Fiction', 'Family Saga', 'Epistolary'],
    moods: ['Reflective', 'Tender', 'Slow Burn'],
  },
  myWritingLife: [
    { label: 'When I write', value: 'Weeknight evenings · 9pm onward' },
    { label: 'How often', value: 'Five days a week' },
    { label: 'My writing tool', value: 'A notebook for first drafts. Plain text after.' },
    { label: 'My ritual', value: 'Read aloud what I wrote yesterday. Cross out one adjective.' },
  ],
  myBetaCircle: {
    active: {
      title: 'The Salt Letters — Ch. 1–6',
      chapters: 'Ch. 1–6',
      stage: 'Drafting',
      meta: '3 beta readers · Watermarked · Copy disabled',
      betaReaders: [
        { icon: '🦉', handle: 'the-wandering-owl', displayName: 'The Wandering Owl' },
        { icon: '📚', handle: 'marginnotes', displayName: 'MarginNotes' },
        { icon: '🌿', handle: 'theopenchapter', displayName: 'TheOpenChapter' },
      ],
    },
    pod: {
      icon: '✍️',
      name: 'Family Sentences',
      type: 'Writer Pod',
      description: 'Three writers working on intimate, family-shaped fiction.',
      members: '3 of 4 members · Private',
    },
    acceptRequests: {
      label: 'Accept new beta reader requests',
      subtitle: 'Readers matching your genre can request access',
      on: true,
    },
  },
  library: {
    body: 'A lot of Robinson. Eliot once a year. Stacks of poetry by the bed.',
    tbr: [
      { label: 'James — Percival Everett' },
      { label: 'Orbital — Samantha Harvey' },
      { label: '+ 8 more' },
    ],
  },
  last3Read: [
    book('', 'Gilead', 'Robinson'),
    book('', 'Interpreter of Maladies', 'Lahiri'),
    book('', 'Demon Copperhead', 'Kingsolver'),
  ],
  allTimeFavourites: [
    book('', 'Middlemarch', 'Eliot'),
    book('', 'Housekeeping', 'Robinson'),
    book('', 'Beloved', 'Morrison'),
  ],
  gotAway: [
    {
      variant: 'mint',
      tall: true,
      label: "If I could time-travel I'd enter the world of...",
      link: plain('Gilead'),
      source: 'Marilynne Robinson',
      body: 'To sit on John Ames\'s porch and ask him to read me what he wrote that morning.',
      echo: '4 other writers would also enter this world',
    },
    {
      variant: 'amber',
      label: 'A book I wish I had discovered sooner...',
      link: plain('Housekeeping'),
      source: 'Marilynne Robinson',
      body: 'Should have found it in my twenties. Came to it last winter and wept.',
    },
    {
      variant: 'rose',
      label: 'A character I wish I had written...',
      link: plain('Sethe'),
      source: 'Beloved',
      body: 'I will spend my career trying to understand how that voice was made.',
    },
  ],
  sitWithAnyone: {
    label: "The literary person I'd most want to meet",
    body: 'George Eliot. To ask her if she ever feared she was writing only for herself.',
  },
  readingCircles: {
    open: [
      { label: "Reader's Clubs", subtitle: 'Open to invitations', on: true },
      { label: 'Reader Pods', subtitle: 'Open to invitations', on: true },
    ],
    clubs: [
      {
        icon: '📖',
        iconBg: '#f5f0fe',
        link: plain('Literary Fiction — The Long Form'),
        meta: '88 readers · BetweenReads curated',
      },
    ],
  },
  otherPlaces: [
    { icon: '✉️', link: { kind: 'external', href: '#', title: 'Substack — Drafts in Pencil' }, subtitle: 'Letters about writing on weeknights' },
    { icon: '📗', link: { kind: 'external', href: '#', title: 'My Goodreads' }, subtitle: '47 reviews · goodreads.com/sarah-m' },
  ],
};

// ============================================================
// Slim profiles for handles cross-referenced from other profiles
// ============================================================
function slim(handle: string, displayName: string, avatarEmoji: string, bio: string, wips: WipCard[]): WriterProfile {
  return {
    handle,
    hero: {
      avatarEmoji,
      displayName,
      badges: [
        { label: 'Member since 2024', tone: 'member' },
        { label: 'Writer', tone: 'writer' },
      ],
      bio,
      quote: {
        label: 'The line I wrote that surprised even me',
        text: '',
        attribution: '',
      },
    },
    now: [
      { variant: 'writer', label: '✍️ Currently writing', link: wips[0]?.link ?? plain('Untitled') },
    ],
    credits: [
      { icon: '📝', num: '—', label: 'Chapters wrote' },
      { icon: '🔒', num: '—', label: 'Beta readers' },
      { icon: '⭐', num: '—', label: 'Reader picks' },
      { icon: '🔥', num: '—', label: 'Writing streak' },
    ],
    memorables: [],
    myWriting: {
      genre: 'Literary Fiction',
      style: '',
      influences: [],
      languages: 'English',
      wips,
      onPlatform: [],
    },
    writersWhoMadeMe: { influences: [], booksThatChangedMe: [] },
    myReader: { body: '', idealGenres: [], moods: [] },
    myWritingLife: [],
    myBetaCircle: {
      active: { title: '', chapters: '', stage: '', meta: '', betaReaders: [] },
      pod: { icon: '✍️', name: '', type: 'Writer Pod', description: '', members: '' },
      acceptRequests: { label: 'Accept new beta reader requests', on: false },
    },
    library: { body: '', tbr: [] },
    last3Read: [],
    allTimeFavourites: [],
    gotAway: [],
    readingCircles: { open: [], clubs: [] },
    otherPlaces: [],
  };
}

const nocturnalReader = slim(
  'nocturnalreader',
  'NocturnalReader',
  '🌙',
  'Speculative fiction by night. Climate models, memory, the future as a kind of grief.',
  [
    {
      link: book('the-glass-meridian', 'The Glass Meridian'),
      meta: 'Speculative · Novel · Ch. 22 of 22',
      stage: 'Final',
      description: "A climate scientist in 2047 discovers her models have been predicting not just weather — but memory.",
    },
  ]
);

const theOpenChapter = slim(
  'theopenchapter',
  'TheOpenChapter',
  '🌿',
  'Adventure stories with maps that change. Believing fiction is a way of paying attention.',
  [
    {
      link: book('ember-and-the-cartographer', 'Ember & the Cartographer'),
      meta: 'Adventure · Novel · Ch. 18 of 18',
      stage: 'Final',
      description: "A young woman inherits a map that updates itself in real time — and starts leading her somewhere she can't explain.",
    },
  ]
);

const marginNotes = slim(
  'marginnotes',
  'MarginNotes',
  '📚',
  'Historical fiction. Lighthouses, letters, what gets carried by the tide.',
  [
    {
      link: book('salt-and-the-sea-between', 'Salt & the Sea Between'),
      meta: 'Historical · Novel · Ch. 24 of 24',
      stage: 'Final',
      description: 'Two lighthouse keepers, one storm, and letters written over fifty years that never arrived.',
    },
  ]
);

const quietPageTurner = slim(
  'quietpageturner',
  'QuietPageTurner',
  '🧣',
  'Literary fiction, slow chapters. Interested in the photographs people throw away.',
  [
    {
      link: book('the-archivist-of-small-things', 'The Archivist of Small Things'),
      meta: 'Literary Fiction · Novel · Ch. 4 of 12',
      stage: 'Drafting',
      description: "A woman who collects other people's discarded photographs begins to notice the same stranger in all of them.",
    },
  ]
);

const silverMarginal = slim(
  'silvermarginal',
  'SilverMarginal',
  '🪶',
  'Poems that begin at the water and end somewhere upstream.',
  [
    {
      link: book('what-the-river-keeps', 'What the River Keeps'),
      meta: 'Poetry Collection · 6 of 6',
      stage: 'Final',
      description: 'Six voices. One river. The things left behind when people move on.',
    },
  ]
);

// ============================================================
// EXPORTS
// ============================================================
const writers: Record<string, WriterProfile> = {
  [midnightDraftsman.handle]: midnightDraftsman,
  [sarahM.handle]: sarahM,
  [nocturnalReader.handle]: nocturnalReader,
  [theOpenChapter.handle]: theOpenChapter,
  [marginNotes.handle]: marginNotes,
  [quietPageTurner.handle]: quietPageTurner,
  [silverMarginal.handle]: silverMarginal,
};

export function getWriterProfile(handle: string): WriterProfile | undefined {
  return writers[handle.toLowerCase()];
}

export function getAllWriterHandles(): string[] {
  return Object.keys(writers);
}

/**
 * Maps mock-books.ts authorHandle (e.g. "MidnightDraftsman") to the URL slug
 * (e.g. "midnightdraftsman"). Returns null if no profile exists for this author.
 */
export function writerSlugForHandle(authorHandle: string | undefined): string | null {
  if (!authorHandle) return null;
  const lower = authorHandle.toLowerCase();
  return writers[lower] ? lower : null;
}

// ============================================================
// WRITER WORKSPACE — works the writer is actively editing
// ============================================================
export type WorkSummary = {
  id: string;
  /** Slug of the book in mock-books.ts if it's an established work, else just an editor-only id */
  bookSlug?: string;
  title: string;
  meta: string;
  stage: 'Drafting' | 'Editing' | 'Final';
};

export type WriterLibraryStatus = 'Published' | 'Drafting' | 'Editing' | 'Private';
export type StorefrontState = 'Listed' | 'Not listed' | 'Setup needed';

export type WriterLibraryWork = WorkSummary & {
  format: string;
  status: WriterLibraryStatus;
  readiness: string;
  cover: string;
  coverIsDark?: boolean;
  publishedChapters: number;
  totalChapters: number;
  words: number;
  wordsLabel: string;
  audience: string;
  lastUpdated: string;
  /** Surfaced from Novel Settings — relevant when scanning the library */
  genre?: { icon: string; label: string };
  moods?: Array<{ icon: string; label: string }>;
  audienceTags?: Array<{ icon: string; label: string }>;
  pitch?: string;
  storefront: {
    state: StorefrontState;
    price: string;
    options: string[];
    note: string;
  };
  activity: {
    reads: number;
    /** Readers in the last 24 hours — falls back to ~3% of total reads when omitted */
    readsLast24h?: number;
    readerPicks: number;
    betaRequests: number;
    coins: number;
  };
};

const SARAH_WORKS: WorkSummary[] = [
  {
    id: 'salt-letters',
    title: 'The Salt Letters',
    meta: 'Literary Fiction · Novel · Drafting',
    stage: 'Drafting',
  },
  {
    id: 'first-frost',
    title: 'First Frost — a short story',
    meta: 'Short Story · Editing',
    stage: 'Editing',
  },
];

const MIDNIGHT_WORKS: WorkSummary[] = [
  {
    id: 'quiet-hours',
    bookSlug: 'the-quiet-hours',
    title: 'The Quiet Hours',
    meta: 'Literary Fiction · Novel · Editing',
    stage: 'Editing',
  },
  {
    id: 'three-tuesdays',
    bookSlug: 'three-tuesdays',
    title: 'Three Tuesdays in November',
    meta: 'Literary Fiction · Short stories · Drafting',
    stage: 'Drafting',
  },
  {
    id: 'the-empty-chair',
    bookSlug: 'the-empty-chair',
    title: 'The Empty Chair',
    meta: 'Short Story · Complete',
    stage: 'Final',
  },
];

export function getWriterWorks(handle: string): WorkSummary[] {
  const lower = handle.toLowerCase();
  if (lower === 'midnightdraftsman') return MIDNIGHT_WORKS;
  if (lower === 'sarah-m') return SARAH_WORKS;
  return [];
}

function writerCover(theme: 'salt' | 'frost' | 'chair') {
  if (theme === 'salt') {
    return [
      'linear-gradient(180deg, rgba(12, 14, 12, 0.04) 0%, rgba(12, 14, 12, 0.34) 62%, rgba(12, 14, 12, 0.62) 100%)',
      'linear-gradient(145deg, #e7dcc9 0%, #9fb2a1 42%, #2d4d54 100%)',
    ].join(', ');
  }
  if (theme === 'frost') {
    return [
      'linear-gradient(180deg, rgba(11, 16, 18, 0.02) 0%, rgba(11, 16, 18, 0.42) 100%)',
      'linear-gradient(145deg, #edf5f0 0%, #9ab8b8 48%, #2f4350 100%)',
    ].join(', ');
  }
  return [
    'linear-gradient(180deg, rgba(7, 8, 7, 0.08) 0%, rgba(7, 8, 7, 0.5) 100%)',
    'linear-gradient(145deg, #c4b18d 0%, #765f4c 48%, #211b18 100%)',
  ].join(', ');
}

const coverArt = exampleCoverArt;

function formatCount(n: number) {
  return n.toLocaleString('en-US');
}

const LIBRARY_OVERRIDES: Record<string, Partial<WriterLibraryWork>> = {
  'salt-letters': {
    meta: 'Literary Fiction · Novel',
    format: 'Novel · 3 chapters live',
    status: 'Published',
    readiness: 'Ready',
    cover: coverArt('the-salt-letters'),
    coverIsDark: true,
    publishedChapters: 3,
    totalChapters: 3,
    words: 2180,
    wordsLabel: '2,180',
    audience: 'Public readers',
    lastUpdated: 'Today',
    genre: { icon: '📖', label: 'Literary Fiction' },
    moods: [
      { icon: '💭', label: 'Reflective' },
      { icon: '🌿', label: 'Calming' },
      { icon: '🕯️', label: 'Slow Burn' },
    ],
    audienceTags: [
      { icon: '🔒', label: 'Beta' },
      { icon: '👁️', label: 'PowerReaders' },
    ],
    pitch:
      'Sisters trading letters across a seven-year silence. What goes unsaid takes the shape of weather, of seasons, of the salt on a coastline that refuses to forget.',
    storefront: {
      state: 'Listed',
      price: 'Free to start',
      options: ['BetweenReads storefront', 'Reader preview enabled'],
      note: 'Storefront is live',
    },
    activity: {
      reads: 142,
      readerPicks: 18,
      betaRequests: 5,
      coins: 75,
    },
  },
  'first-frost': {
    meta: 'Short Story',
    format: 'Short Story · 1 chapter',
    status: 'Editing',
    readiness: 'Needs cover',
    cover: coverArt('first-frost'),
    coverIsDark: true,
    publishedChapters: 0,
    totalChapters: 1,
    words: 3200,
    wordsLabel: '3,200',
    audience: 'Private draft',
    lastUpdated: 'Yesterday',
    genre: { icon: '📖', label: 'Literary Fiction' },
    moods: [
      { icon: '💭', label: 'Reflective' },
      { icon: '🕯️', label: 'Slow Burn' },
    ],
    audienceTags: [{ icon: '🔒', label: 'Private draft' }],
    pitch: 'A grandmother folding linen on the first cold morning of November.',
    storefront: {
      state: 'Setup needed',
      price: 'Not priced',
      options: ['Cover required', 'Blurb draft missing'],
      note: 'Finish setup before listing',
    },
    activity: {
      reads: 0,
      readerPicks: 0,
      betaRequests: 0,
      coins: 0,
    },
  },
  'quiet-hours': {
    meta: 'Literary Fiction · Novel',
    status: 'Published',
    readiness: 'Ready',
    audience: 'Public + beta readers',
    lastUpdated: '2 days ago',
    genre: { icon: '📖', label: 'Literary Fiction' },
    moods: [
      { icon: '💭', label: 'Reflective' },
      { icon: '🌿', label: 'Calming' },
      { icon: '🔥', label: 'Intense' },
    ],
    audienceTags: [
      { icon: '🔒', label: 'Beta' },
      { icon: '👁️', label: 'PowerReaders' },
    ],
    pitch:
      'A housekeeper in a crumbling country house discovers a box of letters that reframes everything she thought she knew about the family she served for thirty years.',
    storefront: {
      state: 'Listed',
      price: '$4.99 · 100 Reading Credits',
      options: ['BetweenReads storefront', 'Amazon', 'Kobo'],
      note: 'Storefront is live',
    },
    activity: {
      reads: 1248,
      readerPicks: 38,
      betaRequests: 12,
      coins: 410,
    },
  },
  'three-tuesdays': {
    meta: 'Literary Fiction · Short stories',
    status: 'Drafting',
    readiness: 'Needs chapters',
    audience: 'Private draft',
    lastUpdated: '5 days ago',
    genre: { icon: '📖', label: 'Literary Fiction' },
    moods: [
      { icon: '💭', label: 'Reflective' },
      { icon: '🕯️', label: 'Slow Burn' },
    ],
    audienceTags: [{ icon: '✍️', label: 'Writer Pod' }],
    pitch:
      "Linked stories set in the same small town across three decades. Each told by a different narrator who doesn't know they share a secret.",
    storefront: {
      state: 'Not listed',
      price: '$5.99 · 120 Reading Credits',
      options: ['Storefront draft saved'],
      note: 'List when the collection is complete',
    },
    activity: {
      reads: 0,
      readerPicks: 0,
      betaRequests: 2,
      coins: 0,
    },
  },
  'the-empty-chair': {
    meta: 'Short Story',
    format: 'Short Story · Public',
    status: 'Published',
    readiness: 'Ready',
    cover: coverArt('the-empty-chair'),
    publishedChapters: 1,
    totalChapters: 1,
    words: 4600,
    wordsLabel: '4,600',
    audience: 'Public readers',
    lastUpdated: 'Last month',
    genre: { icon: '📖', label: 'Literary Fiction' },
    moods: [
      { icon: '💭', label: 'Reflective' },
      { icon: '😊', label: 'Feel-good' },
    ],
    audienceTags: [{ icon: '📖', label: 'Reader Pod' }],
    pitch:
      'A widower learns to set the table for one — and discovers a daughter doing the same in a city three trains away.',
    storefront: {
      state: 'Listed',
      price: '$1.99 · 40 Reading Credits',
      options: ['BetweenReads storefront'],
      note: 'Eligible for magazine pool',
    },
    activity: {
      reads: 710,
      readerPicks: 24,
      betaRequests: 0,
      coins: 96,
    },
  },
};

// ============================================================
// READER SIGNALS — mock telemetry on the writer's published work,
// shown in the writer sidebar.
// ============================================================
export type ReaderSignal = {
  workId: string;
  workTitle: string;
  line: string;
  sub: string;
};

const SARAH_SIGNALS: ReaderSignal[] = [
  {
    workId: 'salt-letters',
    workTitle: 'The Salt Letters',
    line: '+18 reads this week ↗',
    sub: '4 new highlights',
  },
  {
    workId: 'first-frost',
    workTitle: 'First Frost',
    line: 'Ch 1 · 92% finish rate',
    sub: '2 new beta notes',
  },
];

const MIDNIGHT_SIGNALS: ReaderSignal[] = [
  {
    workId: 'quiet-hours',
    workTitle: 'The Quiet Hours',
    line: '+126 reads this week ↗',
    sub: '12 new highlights · 3 reader picks',
  },
  {
    workId: 'the-empty-chair',
    workTitle: 'The Empty Chair',
    line: '88% finish rate',
    sub: '4 new reader notes',
  },
];

export function getWriterReaderSignals(handle: string): ReaderSignal[] {
  const lower = handle.toLowerCase();
  if (lower === 'midnightdraftsman') return MIDNIGHT_SIGNALS;
  if (lower === 'sarah-m') return SARAH_SIGNALS;
  return [];
}

export function getWriterLibraryWorks(handle: string): WriterLibraryWork[] {
  return getWriterWorks(handle).map((work) => {
    const book = work.bookSlug ? getBook(work.bookSlug) : undefined;
    const override = LIBRARY_OVERRIDES[work.id] ?? {};
    const publishedChapters =
      override.publishedChapters ?? (book ? Math.max(1, book.chapters.filter((c) => c.words > 0).length) : 0);
    const totalChapters = override.totalChapters ?? book?.chapterCount ?? Math.max(1, publishedChapters);
    const words = override.words ?? book?.words ?? 0;

    return {
      ...work,
      meta: override.meta ?? work.meta,
      format: override.format ?? book?.format ?? work.meta,
      status: override.status ?? (work.stage === 'Drafting' ? 'Drafting' : 'Editing'),
      readiness: override.readiness ?? 'Needs review',
      cover: override.cover ?? book?.cover ?? writerCover('chair'),
      coverIsDark: override.coverIsDark ?? book?.coverIsDark,
      publishedChapters,
      totalChapters,
      words,
      wordsLabel: override.wordsLabel ?? book?.wordsLabel ?? formatCount(words),
      audience: override.audience ?? 'Private draft',
      lastUpdated: override.lastUpdated ?? 'This week',
      genre: override.genre,
      moods: override.moods,
      audienceTags: override.audienceTags,
      pitch: override.pitch,
      storefront: override.storefront ?? {
        state: 'Not listed',
        price: book?.price ?? 'Not priced',
        options: ['Storefront draft saved'],
        note: 'Not visible in the store',
      },
      activity: override.activity ?? {
        reads: book?.readerPicks ? book.readerPicks * 12 : 0,
        readerPicks: book?.readerPicks ?? 0,
        betaRequests: 0,
        coins: 0,
      },
    };
  });
}

// Re-export for components
export type { ProfileBadge, MemorableCard, WishCard, NowCard, BookEntry, ClubEntry, PodEntry, ExternalLink, Toggle, CreditStat, Tag, SignatureQuote, LinkRef } from './profile-shared';
