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

export type CreatorState = {
  stage: 'emerging' | 'established' | null;
  credits: string[];
  bio: string;
  links: string[];
  // writer
  workTitle: string;
  workGenres: string[];
  workMoods: string[];
  workFormat: string | null;
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
  workTitle: '',
  workGenres: [],
  workMoods: [],
  workFormat: null,
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
    return c.workTitle.trim() !== '' && c.workGenres.length > 0;
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

  const base: WriterAnswers = {
    ...WRITER_INITIAL,
    practice: practiceFor(role),
    // stage maps onto the existing journey enum (emerging | established).
    journey: c.stage,
    awards: c.credits.join(', '),
    genre: {
      ...WRITER_INITIAL.genre,
      focus: 'single',
      fictionPrimary: role === 'writer' ? c.workGenres.slice(0, 3) : [],
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
    ...(role === 'writer'
      ? {
          work: {
            title: c.workTitle.trim(),
            genres: c.workGenres,
            moods: c.workMoods,
            format: c.workFormat,
          },
        }
      : {}),
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
