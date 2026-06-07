// Label maps for writer intake. Keys are the stable slugs used in storage +
// Kit fields/tags; values are the labels shown in the UI. Adding a new option
// means adding here only; the chip rows derive from these maps.

export const PRACTICE: Record<string, string> = {
  prose: 'Prose',
  poetry: 'Poetry',
  illustration: 'Illustration',
};

export const JOURNEY: Record<string, string> = {
  aspiring: 'Aspiring writer',
  emerging: 'Emerging writer',
  established: 'Established writer',
};

export const WORKING_ON: Record<string, string> = {
  debut: 'Debut novel',
  new: 'New novel',
  thinking: 'Still thinking',
};

export const PUB_ROUTE: Record<string, string> = {
  traditional: 'Traditional',
  self: 'Self-publish',
  'reading-group': 'Online reading group only',
  unsure: 'Not sure',
};

export const AGENT_STAGE: Record<string, string> = {
  researching: 'Researching agents',
  'building-list': 'Building agent list',
  'querying-soon': 'Querying soon (30–90 days)',
  'querying-now': 'Querying now',
};

export const MS_STAGE: Record<string, string> = {
  draft: 'Draft',
  'final-draft': 'Final draft',
  editing: 'Editing',
  proofreading: 'Proofreading',
  complete: 'Complete',
  'seeking-betas': 'Seeking beta readers',
};

export const SELF_PUBLISH_EXTRA = 'seeking-reviews';
export const SELF_PUBLISH_EXTRA_LABEL = 'Seeking reviews';

export const LANGUAGE: Record<string, string> = {
  en: 'English',
  de: 'German',
  hi: 'Hindi',
  fr: 'French',
  es: 'Spanish',
  other: 'More…',
};

export const TARGET_LENGTH: Record<string, string> = {
  lt15k: 'Under 15,000 words',
  '15-40k': '15,000–40,000',
  '40-80k': '40,000–80,000',
  '80-120k': '80,000–120,000',
  '120kplus': '120,000+',
  unsure: 'Not sure',
};

export const SUBMISSIONS: Record<string, string> = {
  agents: 'Agents',
  journals: 'Journals / contests',
  both: 'Both',
  na: 'N/A',
};

export const TIMELINE: Record<string, string> = {
  q: 'This quarter',
  '3-6m': '3–6 months',
  '6-12m': '6–12 months',
};

export const MONTH_GOAL: Record<string, string> = {
  'finish-revision': 'Finish revision',
  'beta-feedback': 'Get beta feedback',
  'agent-list': 'Build agent list',
  'send-queries': 'Send queries',
};

export const PLATFORM: Record<string, string> = {
  prowritingaid: 'ProWritingAid',
  scrivener: 'Scrivener',
  wordpress: 'WordPress',
  tumblr: 'Tumblr',
  substack: 'Substack',
  medium: 'Medium',
  wattpad: 'Wattpad',
};

export const FICTION_GENRES_PRIMARY = [
  'Fantasy',
  'Romance',
  'Sci-fi',
  'Mystery / Thriller',
  'Literary',
  'Young Adult',
];

export const FICTION_GENRES_MORE = [
  'Historical',
  'Horror',
  'Crime',
  'Adventure',
  'Romantasy',
  'Magical Realism',
];

export const NONFICTION_GENRES_PRIMARY = [
  'Memoir',
  'Business',
  'Self-help',
  'Health',
  'History',
];

export const NONFICTION_GENRES_MORE = [
  'Science',
  'Technology',
  'Finance',
  'Travel',
  'Essays',
];

export const GENRE_CAP = 3;
