// Data + mapping for the 4-role intake pop-up (reader / writer / poet /
// illustrator). The UI lives in IntakeFlow.tsx; everything role-specific —
// option lists, local form state, the payload mapping, and submit gating —
// is centralized here so IntakeFlow stays focused on rendering.
//
// The waitlist payload still discriminates on region 'reader' | 'writer'
// (see lib/schemas.ts), so the three creator roles all serialize to region
// 'writer' with practice = prose | poetry | illustration. The new, richer
// answers ride along in the optional `discover` (reader) and `creator`
// (writer) objects that the schema now carries.

import type { IntakePayload } from '@/lib/schemas';
import {
  WRITER_INITIAL,
  serializeWriter,
  type WriterAnswers,
} from '../../v8/intake/writer/writerTypes';

export type IntakeRole = 'reader' | 'writer' | 'poet' | 'illustrator';
export const ROLES: IntakeRole[] = ['reader', 'writer', 'poet', 'illustrator'];

export const ROLE_TAB_LABEL: Record<IntakeRole, string> = {
  reader: 'Reader',
  writer: 'Writer',
  poet: 'Poet',
  illustrator: 'Illustrator',
};

export const ROLE_NOUN: Record<IntakeRole, string> = {
  reader: 'reader',
  writer: 'writer',
  poet: 'poet',
  illustrator: 'illustrator',
};

// --- Shared option lists -------------------------------------------------

// Genres are shared by the reader (what you read) and writer (what you write)
// flows in the prototype.
export const GENRES_PRIMARY = [
  'Romance',
  'Thriller',
  'Mystery',
  'Fantasy',
  'Sci-fi',
  'Literary Fiction',
];
export const GENRES_MORE = [
  'Historical Fiction',
  'Horror',
  'Young Adult',
  "Children's",
  'Poetry',
  'Memoir',
  'Biography',
  'Essays',
  'True Crime',
  'Self-help',
  'Science',
  'Philosophy',
  'Travel',
  'Magical realism',
  'Mythology',
  'Graphic novels',
];

export const FORMATS = [
  'Microstory',
  'Flash fiction',
  'Short story',
  'Chapterwise',
  'Full manuscript',
];

export const FORMAT_TIP =
  'Microstory — 10–300 words · Flash fiction — 301–1,000 words · Short story — 1,001–7,500 words · Chapterwise — one chapter at a time · Full manuscript — novel, novella, or collection';

export const READER_WHENS = [
  'Commute',
  'Lunchtime',
  'Bedtime',
  'Weekends',
  'Breaks',
];

export const MOODS = [
  '🏃 Adventurous',
  '🌿 Calming',
  '🌍 Escapist',
  '😊 Feel-good',
  '😂 Funny',
  '🔥 Intense',
  '💭 Reflective',
  '😨 Scary',
  '🕯️ Slow Burn',
  '☀️ Upbeat',
  '🌑 Dark',
];

// Poet
export const POET_FORMS_PRIMARY = [
  'Free verse',
  'Sonnet',
  'Haiku',
  'Spoken word',
  'Prose poetry',
  'Lyric poetry',
];
export const POET_FORMS_MORE = [
  'Ode',
  'Elegy',
  'Villanelle',
  'Ballad',
  'Ghazal',
  'Sestina',
  'Blank verse',
  'Experimental',
];
export const POET_THEMES_PRIMARY = [
  'Love',
  'Grief',
  'Nature',
  'Identity',
  'Loss',
  'Memory',
];
export const POET_THEMES_MORE = [
  'Politics',
  'Spirituality',
  'Resistance',
  'Mythology',
  'Place',
  'Body',
  'War',
  'Justice',
  'Coming of age',
  'Diaspora',
  'Belonging',
];

// Illustrator
export const ILLO_MEDIUMS = [
  'Digital',
  'Watercolour',
  'Ink',
  'Pencil',
  'Mixed media',
  'Charcoal',
  'Gouache',
];
export const ILLO_STYLES = [
  'Whimsical',
  'Realistic',
  'Minimalist',
  'Graphic',
  'Abstract',
  'Folk',
  'Vintage',
];
export const ILLO_USES = [
  "Children's books",
  'Book covers',
  'Editorial',
  'Graphic novels',
  'Poetry',
  'Short fiction',
  'Chapter headers',
];

export const CREDITS = [
  'Longlisted',
  'Shortlisted',
  'Contest winner',
  'Award winner',
];

// --- Goals (Q3) ----------------------------------------------------------

export type Goal = { label: string; tip?: string };

export const GOAL_SCOUT = 'Be a ReaderScout';
const SCOUT_TIP_READER =
  'ReaderScouts read unpublished work before anyone else and earn extra reader credits for their feedback.';
const SCOUT_TIP_CREATOR =
  'Read unpublished work before anyone else and earn extra reader credits for your feedback.';

export const READER_GOALS: Goal[] = [
  { label: 'Discover new voices' },
  { label: 'Support independent writers' },
  { label: 'Find my next great read' },
  { label: GOAL_SCOUT, tip: SCOUT_TIP_READER },
  { label: 'Listen to stories' },
  { label: 'Join a reading community' },
];

export const WRITER_GOALS: Goal[] = [
  {
    label: 'Find ReaderScouts',
    tip: 'ReaderScouts read your unpublished work before anyone else and give you structured feedback.',
  },
  {
    label: 'Form a Writer Pod',
    tip: 'A small group of 4–6 writers who support and give feedback on each other’s work.',
  },
  {
    label: 'Form a Reader Pod',
    tip: 'A curated reading group built around your work and your readers.',
  },
  { label: 'Find my next great read' },
  { label: 'Sell my books' },
  { label: 'Narrate my stories' },
  { label: 'Join a reading and writing community' },
  { label: GOAL_SCOUT, tip: SCOUT_TIP_CREATOR },
];

export const POET_GOALS: Goal[] = [
  { label: 'Find Readers' },
  { label: 'Sell my books' },
  { label: 'Narrate my poems' },
  {
    label: 'Form a Reader Pod',
    tip: 'A curated reading group built around your poetry and your readers.',
  },
  {
    label: 'Find ReaderScouts',
    tip: 'ReaderScouts read your unpublished poems before anyone else and give you structured feedback.',
  },
  { label: 'Join a reading and writing community' },
  { label: GOAL_SCOUT, tip: SCOUT_TIP_CREATOR },
];

export const ILLO_GOALS: Goal[] = [
  { label: 'Find writers to collaborate with' },
  { label: 'Sell my work' },
  { label: 'Accept commissions' },
  { label: 'Join a creative community' },
  { label: GOAL_SCOUT, tip: SCOUT_TIP_CREATOR },
];

export function goalsFor(role: IntakeRole): Goal[] {
  switch (role) {
    case 'reader':
      return READER_GOALS;
    case 'writer':
      return WRITER_GOALS;
    case 'poet':
      return POET_GOALS;
    case 'illustrator':
      return ILLO_GOALS;
  }
}

// --- Creator identity bits (writer / poet / illustrator) -----------------

export function stageOptions(
  role: IntakeRole,
): { key: 'emerging' | 'established'; label: string }[] {
  const noun = ROLE_NOUN[role];
  return [
    { key: 'emerging', label: `Emerging ${noun}` },
    {
      key: 'established',
      // The prototype calls an established writer an "author".
      label: role === 'writer' ? 'Established author' : `Established ${noun}`,
    },
  ];
}

export const LINK_PLACEHOLDER: Record<IntakeRole, string> = {
  reader: '',
  writer: 'Bluesky, Medium, Substack, Draft2Digital, Website, Instagram, X…',
  poet: 'Bluesky, Medium, Substack, Website, Instagram, X…',
  illustrator: 'Behance, Instagram, Website, Bluesky, X…',
};

export const MAX_LINKS = 5;
export const BIO_WORD_CAP = 100;
export const WHY_WORD_CAP = 50;

export function wordCount(s: string): number {
  const t = s.trim();
  return t === '' ? 0 : t.split(/\s+/).length;
}

// Mirror the prototype's lenient URL check (optional scheme, a dotted host).
const LINK_RE = /^(https?:\/\/)?[\w-]+(\.[\w-]+)+[^\s]*$/;
export function isValidLink(v: string): boolean {
  const t = v.trim();
  return t === '' || LINK_RE.test(t);
}

// --- Local form state ----------------------------------------------------

export type ReaderState = {
  bookTitle: string;
  bookAuthor: string;
  bookWhy: string;
  genres: string[];
  formats: string[];
  whens: string[];
  goals: string[];
  goalsOther: string;
};

export const READER_STATE_INITIAL: ReaderState = {
  bookTitle: '',
  bookAuthor: '',
  bookWhy: '',
  genres: [],
  formats: [],
  whens: [],
  goals: [],
  goalsOther: '',
};

// A single uploaded title (writer flow). Writers can add a second — the
// prototype caps at MAX_WORKS.
export type WorkItem = {
  title: string;
  genres: string[];
  moods: string[];
  format: string | null;
};

export const MAX_WORKS = 2;

export const WORK_ITEM_INITIAL: WorkItem = {
  title: '',
  genres: [],
  moods: [],
  format: null,
};

export type CreatorState = {
  stage: 'emerging' | 'established' | null;
  credits: string[];
  bio: string;
  links: string[];
  // writer — one or more works
  works: WorkItem[];
  // poet
  poetForms: string[];
  poetMoods: string[];
  poetThemes: string[];
  // illustrator
  illoMediums: string[];
  illoStyles: string[];
  illoUses: string[];
  // goals
  goals: string[];
  goalsOther: string;
};

export const CREATOR_STATE_INITIAL: CreatorState = {
  stage: null,
  credits: [],
  bio: '',
  links: [''],
  works: [{ ...WORK_ITEM_INITIAL }],
  poetForms: [],
  poetMoods: [],
  poetThemes: [],
  illoMediums: [],
  illoStyles: [],
  illoUses: [],
  goals: [],
  goalsOther: '',
};

// --- Submit gating -------------------------------------------------------

export function readerReady(r: ReaderState): boolean {
  return r.bookTitle.trim() !== '' && r.genres.length > 0;
}

export function creatorReady(role: IntakeRole, c: CreatorState): boolean {
  if (c.stage === null) return false;
  if (wordCount(c.bio) > BIO_WORD_CAP) return false;
  if (!c.links.every(isValidLink)) return false;
  if (role === 'writer') {
    // The first title must be complete (matches the prototype's step-2 gate);
    // any additional title is optional.
    const w = c.works[0];
    return (
      !!w &&
      w.title.trim() !== '' &&
      w.genres.length > 0 &&
      w.moods.length > 0 &&
      w.format !== null
    );
  }
  if (role === 'poet') return c.poetForms.length > 0;
  return c.illoMediums.length > 0; // illustrator
}

// --- Payload mapping -----------------------------------------------------

function practiceFor(role: IntakeRole): 'prose' | 'poetry' | 'illustration' {
  if (role === 'poet') return 'poetry';
  if (role === 'illustrator') return 'illustration';
  return 'prose';
}

function buildReaderIntake(r: ReaderState): IntakePayload {
  const title = r.bookTitle.trim();
  const author = r.bookAuthor.trim();
  const bookStr = title ? (author ? `${title} — ${author}` : title) : '';
  const isScout = r.goals.includes(GOAL_SCOUT);
  return {
    region: 'reader',
    intent: 'now',
    answers: {
      audience: null,
      genres: r.genres,
      // The new "format" question reuses the lengths slot (microstory…full ms).
      lengths: r.formats,
      devices: [],
      modes: r.goals.includes('Listen to stories') ? ['Listen'] : [],
      whens: r.whens,
      reaction: null,
      betaPool: isScout,
      club: r.goals.includes('Join a reading community'),
      newsletter: false,
      favoriteBooks: bookStr ? [bookStr] : [],
      discover: {
        bookLove: { title, author, why: r.bookWhy.trim() },
        formats: r.formats,
        goals: r.goals,
        goalsOther: r.goalsOther.trim(),
      },
    },
  };
}

function buildCreatorIntake(
  role: IntakeRole,
  c: CreatorState,
): IntakePayload {
  const links = c.links.map((l) => l.trim()).filter(Boolean);
  const isScout = c.goals.includes(GOAL_SCOUT);
  const inPod = c.goals.some((g) => g.includes('Pod'));

  // Writer works: drop any blank extra titles before serializing.
  const works: WorkItem[] =
    role === 'writer'
      ? c.works
          .map((w) => ({ ...w, title: w.title.trim() }))
          .filter((w, i) => i === 0 || w.title !== '')
      : [];

  const base: WriterAnswers = {
    ...WRITER_INITIAL,
    practice: practiceFor(role),
    // stage maps onto the existing journey enum (emerging | established).
    journey: c.stage,
    awards: c.credits.join(', '),
    genre: {
      ...WRITER_INITIAL.genre,
      focus: 'single',
      fictionPrimary: works[0] ? works[0].genres.slice(0, 3) : [],
    },
    betaPool: isScout,
    pod: inPod,
  };

  const creator: NonNullable<
    Extract<IntakePayload, { region: 'writer' }>['answers']['creator']
  > = {
    stage: c.stage,
    credits: c.credits,
    bio: c.bio.trim(),
    links,
    goals: c.goals,
    goalsOther: c.goalsOther.trim(),
    ...(role === 'writer' ? { works } : {}),
    ...(role === 'poet'
      ? {
          poetry: {
            forms: c.poetForms,
            moods: c.poetMoods,
            themes: c.poetThemes,
          },
        }
      : {}),
    ...(role === 'illustrator'
      ? {
          illustration: {
            mediums: c.illoMediums,
            styles: c.illoStyles,
            uses: c.illoUses,
          },
        }
      : {}),
  };

  return {
    region: 'writer',
    answers: { ...serializeWriter(base), creator },
  };
}

export function buildIntake(
  role: IntakeRole,
  reader: ReaderState,
  creator: CreatorState,
): IntakePayload {
  return role === 'reader'
    ? buildReaderIntake(reader)
    : buildCreatorIntake(role, creator);
}

// --- Signup (display-name availability) ----------------------------------
//
// There is no users table yet, so availability is a front-end stub that
// mirrors the prototype. TODO: replace with a real availability endpoint
// once accounts exist.
const TAKEN_DISPLAY_NAMES = ['betweenreads', 'admin', 'test'];

export type NameStatus = 'idle' | 'available' | 'taken';

export function checkDisplayNameStub(name: string): NameStatus {
  const v = name.trim().toLowerCase();
  if (v.length < 3) return 'idle';
  return TAKEN_DISPLAY_NAMES.includes(v) ? 'taken' : 'available';
}

// --- Welcome screen ------------------------------------------------------

export type WelcomeAction = { label: string; href: string };

// Action links shown on the final welcome screen. Routes that exist today are
// wired up; the rest land on the gated insider home until those pages ship.
export function welcomeActionsFor(
  role: IntakeRole,
  bookTitle?: string,
): WelcomeAction[] {
  if (role === 'reader') {
    return [
      { label: 'Check your profile', href: '/insider' },
      {
        label: `Recommend ${bookTitle?.trim() ? bookTitle.trim() : 'a book'}`,
        href: '/insider',
      },
      { label: 'Read a classic', href: '/read' },
    ];
  }
  if (role === 'poet') {
    return [
      { label: 'Check your profile', href: '/insider' },
      { label: 'Upload your poems', href: '/insider' },
      { label: 'Submit to BetweenLines Journal', href: '/betweenlines' },
    ];
  }
  // writer + illustrator
  return [
    { label: 'Check your profile', href: '/insider' },
    { label: 'Upload your work', href: '/insider' },
    { label: 'Submit to BetweenLines Journal', href: '/betweenlines' },
  ];
}

// A closing literary quote, by role (ported from the prototype).
export type Quote = { text: string; author: string };

const READER_QUOTES: Quote[] = [
  { text: 'A reader lives a thousand lives before he dies.', author: 'George R.R. Martin' },
  {
    text: 'Reading gives us somewhere to go when we have to stay where we are.',
    author: 'Mason Cooley',
  },
  { text: 'There is no friend as loyal as a book.', author: 'Ernest Hemingway' },
  { text: 'Once you learn to read, you will be forever free.', author: 'Frederick Douglass' },
];

const WRITER_QUOTES: Quote[] = [
  { text: 'We write to taste life twice, in the moment and in retrospect.', author: 'Anaïs Nin' },
  { text: 'A word after a word after a word is power.', author: 'Margaret Atwood' },
  { text: 'Write what should not be forgotten.', author: 'Isabel Allende' },
  { text: 'You can make anything by writing.', author: 'C.S. Lewis' },
];

const POET_QUOTES: Quote[] = [
  {
    text: 'Poetry is not a turning loose of emotion, but an escape from emotion.',
    author: 'T.S. Eliot',
  },
  {
    text: 'A poem begins as a lump in the throat, a sense of wrong, a homesickness, a lovesickness.',
    author: 'Robert Frost',
  },
  { text: 'Poetry is what gets lost in translation.', author: 'Robert Frost' },
  {
    text: 'If I read a book and it makes my whole body so cold no fire can ever warm me, I know that is poetry.',
    author: 'Emily Dickinson',
  },
  {
    text: 'Poetry is the spontaneous overflow of powerful feelings.',
    author: 'William Wordsworth',
  },
];

const ILLO_QUOTES: Quote[] = [
  { text: 'An illustrator is a visual storyteller who speaks without words.', author: 'Unknown' },
  { text: 'Every picture tells a story.', author: 'Rod Stewart' },
  { text: 'The job of the artist is always to deepen the mystery.', author: 'Francis Bacon' },
  {
    text: 'Illustration is the art of clarifying the complex and making the invisible visible.',
    author: 'Milton Glaser',
  },
];

const QUOTES: Record<IntakeRole, Quote[]> = {
  reader: READER_QUOTES,
  writer: WRITER_QUOTES,
  poet: POET_QUOTES,
  illustrator: ILLO_QUOTES,
};

export function quotesFor(role: IntakeRole): Quote[] {
  return QUOTES[role];
}
