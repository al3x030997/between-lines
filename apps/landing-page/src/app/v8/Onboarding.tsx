'use client';

// NOTE: dormant. The v6 landing page now uses InlineQuestions for entry intent;
// this overlay is kept on disk as a reference for the longer post-signup flow.

import { useEffect, useMemo, useState } from 'react';

/**
 * Backlog — questions removed or deferred while shaping v6 onboarding.
 * Add back by reinserting into the appropriate per-page array.
 *
 * Reader:
 *   - sourcing (multi): Borrow library · Buy used · Buy new · Ebook · Audio
 *
 * Author:
 *   - awards (text, optional): "Contest or award wins"
 *   - giveaways (single): "Offer free reading giveaways to interested readers?"
 *   - timeline (single): "This quarter · 3–6 months · 6–12 months"
 *
 * Both:
 *   - email (text) + interview (checkbox) — was on the final step
 */

export type Mode = 'reader' | 'author';

type SingleQ = {
  kind: 'single';
  id: string;
  label: string;
  hint?: string;
  options: string[];
  showIf?: (a: Answers) => boolean;
};
type MultiQ = {
  kind: 'multi';
  id: string;
  label: string;
  hint?: string;
  options: string[];
  allowCustom?: boolean;
  showIf?: (a: Answers) => boolean;
};
type TextQ = {
  kind: 'text';
  id: string;
  label: string;
  hint?: string;
  placeholder?: string;
  showIf?: (a: Answers) => boolean;
};
type Q = SingleQ | MultiQ | TextQ;

type Answers = Record<string, string | string[]>;

const READER_QS_P1: Q[] = [
  {
    kind: 'single',
    id: 'frequency',
    label: 'Reading frequency',
    options: ['1–2 / month', '1–2 / week', '1–5 / month', 'Quarterly', 'Yearly'],
  },
  {
    kind: 'single',
    id: 'engagement',
    label: 'How do you want to read?',
    options: [
      'Casual / low engagement',
      'Engaged with community',
      'Beta reader for pre-published manuscripts',
    ],
  },
  {
    kind: 'multi',
    id: 'discovery',
    label: 'How you discover',
    hint: 'Pick any',
    options: ['Try new authors', 'Experiment with genres', 'Mostly bestseller list'],
  },
  {
    kind: 'single',
    id: 'club',
    label: 'Book clubs',
    options: ['In a book club', 'Want to join a virtual book club', 'Not interested'],
  },
];

const READER_QS_P2: Q[] = [
  {
    kind: 'multi',
    id: 'genres',
    label: 'Favorite genres',
    hint: 'Pick a few — or add your own',
    options: ['Fantasy', 'Romance', 'Sci-fi', 'Lit fic', 'Mystery', 'Non-fiction'],
    allowCustom: true,
  },
  {
    kind: 'text',
    id: 'favorite_book',
    label: 'A book you really enjoyed',
    placeholder: 'Title…',
  },
];

const AUTHOR_QS_P1: Q[] = [
  {
    kind: 'single',
    id: 'journey',
    label: 'Where are you on the journey?',
    options: ['Aspiring writer', 'Emerging writer', 'Established writer'],
  },
  {
    kind: 'single',
    id: 'working_on',
    label: 'What are you currently working on?',
    options: ['Debut novel', 'New novel', 'Still thinking'],
  },
  {
    kind: 'single',
    id: 'route',
    label: 'Intended publishing route',
    hint: 'You can change this later',
    options: ['Traditional', 'Self-publish', 'Online reading group only', 'Not sure'],
  },
];

const AUTHOR_QS_BETA: Q[] = [
  {
    kind: 'single',
    id: 'beta_count',
    label: 'How many beta readers?',
    options: ['1–3', '4–10', '11–25', '25+'],
  },
  {
    kind: 'single',
    id: 'beta_scope',
    label: 'What should readers cover?',
    options: [
      'First chapter only',
      'First 3 chapters',
      'First half',
      'Full manuscript',
      'Specific scenes I’ll mark',
    ],
  },
  {
    kind: 'multi',
    id: 'beta_audience',
    label: 'Audience focus',
    hint: 'Pick any',
    options: [
      'Genre fans',
      'General fiction readers',
      'Sensitivity readers',
      'Industry / agents',
      'Friends & family',
    ],
  },
  {
    kind: 'multi',
    id: 'beta_feedback_style',
    label: 'Feedback you want',
    hint: 'Pick any',
    options: [
      'Quick reactions',
      'Line-level edits',
      'Big-picture critique',
      'Plot / pacing notes',
      'Character notes',
    ],
  },
  {
    kind: 'single',
    id: 'beta_timeline',
    label: 'Turnaround',
    options: ['Within 2 weeks', '2–4 weeks', '1–2 months', 'Flexible'],
  },
  {
    kind: 'single',
    id: 'beta_compensation',
    label: 'Compensation offered',
    options: [
      'Free',
      'Token thanks (book / acknowledgment)',
      'Small paid fee',
      'Open to discuss',
    ],
  },
];

const AUTHOR_QS_PUB: Q[] = [
  {
    kind: 'multi',
    id: 'pub_format',
    label: 'Formats you want',
    options: ['Digital', 'Print on demand', 'Hardcover', 'Audiobook'],
  },
  {
    kind: 'single',
    id: 'pub_rights',
    label: 'Rights preference',
    options: [
      'Keep all rights',
      'Open to selling some',
      'Open to selling all',
      'Not sure yet',
    ],
  },
  {
    kind: 'multi',
    id: 'pub_distribution',
    label: 'Where it should be available',
    options: [
      'Direct on Between Lines',
      'Major retailers (Amazon, etc.)',
      'Indie bookstores',
      'Libraries',
    ],
  },
  {
    kind: 'single',
    id: 'pub_marketing',
    label: 'Marketing support',
    options: [
      'I’ll handle it',
      'Light help (templates, tips)',
      'Co-driven campaign',
      'Full campaign',
    ],
  },
  {
    kind: 'single',
    id: 'pub_timeline',
    label: 'Target window',
    options: ['ASAP', '~3 months', '~6 months', '12+ months', 'Flexible'],
  },
  {
    kind: 'single',
    id: 'pub_audience',
    label: 'Existing audience',
    options: ['None yet', 'Newsletter list', 'Active social presence', 'Both'],
  },
];

const AUTHOR_QS_BOOK: Q[] = [
  {
    kind: 'single',
    id: 'manuscript_stage',
    label: 'Manuscript stage',
    options: [
      'Draft',
      'Final draft',
      'Editing',
      'Proofreading',
      'Complete',
      'Seeking beta readers',
    ],
  },
  {
    kind: 'single',
    id: 'language',
    label: 'Primary language',
    options: ['English', 'Spanish', 'French', 'German', 'Hindi'],
  },
  {
    kind: 'single',
    id: 'length',
    label: 'Target length (rough word count)',
    options: [
      'Under 15,000',
      '15,000 – 40,000',
      '40,000 – 80,000',
      '80,000 – 120,000',
      '120,000+',
      'Not sure',
    ],
  },
  {
    kind: 'multi',
    id: 'fiction_genres',
    label: 'Fiction genres',
    hint: 'Pick any — or add your own',
    options: ['Fantasy', 'Romance', 'Sci-fi', 'Mystery / Thriller', 'Literary', 'Young Adult'],
    allowCustom: true,
  },
  {
    kind: 'multi',
    id: 'nonfic_genres',
    label: 'Non-fiction genres',
    hint: 'Pick any — or add your own',
    options: ['Memoir', 'Business', 'Self-help', 'Health', 'History'],
    allowCustom: true,
  },
];

const READER_QS_NEWS: Q[] = [
  {
    kind: 'single',
    id: 'news_frequency',
    label: 'How often',
    options: ['Weekly', 'Biweekly', 'Monthly'],
  },
  {
    kind: 'single',
    id: 'news_format',
    label: 'Format',
    options: ['Quick digest with picks', 'Single deep-dive essay', 'Mix of both'],
  },
  {
    kind: 'multi',
    id: 'news_topics',
    label: 'Topics',
    hint: 'Pick any',
    options: [
      'New releases',
      'Hidden gems',
      'Author interviews',
      'Industry trends',
      'Reading challenges',
    ],
  },
];

const READER_QS_PUB: Q[] = [
  {
    kind: 'multi',
    id: 'rpub_interests',
    label: 'What’s interesting',
    hint: 'Pick any',
    options: [
      'Indie authors',
      'Translated fiction',
      'Debut novelists',
      'Pre-release manuscripts',
      'Specific genre drops',
    ],
  },
  {
    kind: 'multi',
    id: 'rpub_format',
    label: 'Reading format',
    options: ['Digital', 'Print', 'Audio'],
  },
  {
    kind: 'single',
    id: 'rpub_discovery',
    label: 'How you find books',
    options: ['Curated lists', 'Browse by genre', 'Friend recommendations', 'Mix'],
  },
];

const READER_QS_BETA: Q[] = [
  {
    kind: 'single',
    id: 'rbeta_hours',
    label: 'Hours per week you can give',
    options: ['1–3', '4–7', '8–15', 'More'],
  },
  {
    kind: 'multi',
    id: 'rbeta_genres',
    label: 'Genres you’ll beta',
    hint: 'Pick any — or add your own',
    options: ['Fantasy', 'Romance', 'Sci-fi', 'Lit fic', 'Mystery / Thriller', 'Non-fiction'],
    allowCustom: true,
  },
  {
    kind: 'multi',
    id: 'rbeta_feedback',
    label: 'Feedback style you give',
    options: [
      'Quick reactions',
      'Line-level notes',
      'Big-picture critique',
      'Plot / pacing',
      'Character',
    ],
  },
  {
    kind: 'single',
    id: 'rbeta_turnaround',
    label: 'Turnaround you can commit to',
    options: ['Within a week', '1–2 weeks', '2–4 weeks', 'Flexible'],
  },
  {
    kind: 'single',
    id: 'rbeta_experience',
    label: 'Beta-reading experience',
    options: ['First time', 'Some experience', 'Regular beta reader'],
  },
];

type AuthorServiceId = 'agentmatch' | 'agentlist' | 'betareading' | 'publishing';
type ServiceId = AuthorServiceId | 'newsletter' | 'r-publishing' | 'r-betareads';

type IconName =
  | 'search'
  | 'clipboard'
  | 'feedback'
  | 'book'
  | 'envelope'
  | 'sparkle'
  | 'pencil';

type Service = {
  id: ServiceId;
  title: string;
  kicker: string;
  pitch: string;
  color: string;
  number: string;
  icon: IconName;
};

const SERVICES: Record<AuthorServiceId, Service> = {
  agentlist: {
    id: 'agentlist',
    title: 'Build your agent list with us',
    kicker: '',
    pitch: 'No Excel files or Word docs — every query, status, and reply in one place.',
    color: '#0a3a23',
    number: '01',
    icon: 'clipboard',
  },
  agentmatch: {
    id: 'agentmatch',
    title: 'Search relevant agents in minutes, not hours',
    kicker: '',
    pitch: 'Match your manuscript against hundreds of real agent profiles.',
    color: '#e94b36',
    number: '02',
    icon: 'search',
  },
  betareading: {
    id: 'betareading',
    title: 'Get readers who actually shape your draft',
    kicker: '',
    pitch: 'Genre-matched beta readers with structured feedback — not random opinions.',
    color: '#b8842f',
    number: '03',
    icon: 'feedback',
  },
  publishing: {
    id: 'publishing',
    title: 'Publish on your terms — keep the rights',
    kicker: '',
    pitch: 'Digital, print, audio. We handle the heavy lifting; you keep the audience.',
    color: '#14140f',
    number: '04',
    icon: 'book',
  },
};

function servicesFor(route: string | string[] | undefined): AuthorServiceId[] {
  if (route === 'Traditional') return ['agentlist', 'agentmatch'];
  if (route === 'Self-publish') return ['betareading', 'publishing'];
  if (route === 'Not sure') return ['agentlist', 'agentmatch', 'betareading', 'publishing'];
  return [];
}

type ReaderServiceId = 'newsletter' | 'r-publishing' | 'r-betareads';

const READER_SERVICES: Record<ReaderServiceId, Service> = {
  newsletter: {
    id: 'newsletter',
    title: 'Find your next read in your inbox',
    kicker: '',
    pitch: 'Hand-picked novels each week — no algorithm soup.',
    color: '#688763',
    number: '01',
    icon: 'envelope',
  },
  'r-publishing': {
    id: 'r-publishing',
    title: 'Read fiction before it hits the shelf',
    kicker: '',
    pitch: 'Indie debuts, translated fiction, and pre-release manuscripts.',
    color: '#0a3a23',
    number: '02',
    icon: 'sparkle',
  },
  'r-betareads': {
    id: 'r-betareads',
    title: 'Help shape novels you love',
    kicker: '',
    pitch: 'Give working novelists feedback and get the first read of their next book.',
    color: '#b8842f',
    number: '03',
    icon: 'pencil',
  },
};

const READER_SERVICE_IDS: ReaderServiceId[] = ['newsletter', 'r-publishing', 'r-betareads'];

function serviceTitle(sid: string): string {
  return (
    SERVICES[sid as AuthorServiceId]?.title ??
    READER_SERVICES[sid as ReaderServiceId]?.title ??
    sid
  );
}

type PageId =
  | 'r1'
  | 'r2'
  | 'r-services'
  | 'r-newsletter'
  | 'r-publishing'
  | 'r-betareads'
  | 'r-final'
  | 'a1'
  | 'a-services'
  | 'a-betareading'
  | 'a-publishing'
  | 'a-book'
  | 'a-upload'
  | 'a-final';

type PageHeading = { eyebrow: string; title: string; pitch: string };

const HEADINGS: Record<PageId, PageHeading> = {
  r1: {
    eyebrow: 'For readers · Quick setup, 10–20 seconds',
    title: 'Tell us how you read.',
    pitch: 'Answer what’s closest. We’ll line up drafts you’ll actually want to read.',
  },
  r2: {
    eyebrow: 'A bit more',
    title: 'About what you read.',
    pitch: 'Pick the genres you love and a book that hooked you.',
  },
  'r-services': {
    eyebrow: 'Pick what you want',
    title: 'How do you want to use Between Lines?',
    pitch: 'Tick anything that fits — skip what doesn’t.',
  },
  'r-newsletter': {
    eyebrow: 'Newsletter',
    title: 'Tune the inbox you’ll actually open.',
    pitch: 'Frequency, format, topics — built around your taste.',
  },
  'r-publishing': {
    eyebrow: 'Early access',
    title: 'Set up your early-access reads.',
    pitch: 'Tell us what pulls you in — we line up the drops.',
  },
  'r-betareads': {
    eyebrow: 'Beta reads',
    title: 'Match with novels you’ll want to read.',
    pitch: 'Genres, hours, feedback style — the basics.',
  },
  'r-final': {
    eyebrow: 'Step 2 · Coming up',
    title: 'Your reading home is next.',
    pitch: 'We’ll line up drafts that match what you told us.',
  },
  a1: {
    eyebrow: 'For writers · Quick setup, 10–20 seconds',
    title: 'Where are you on the journey?',
    pitch:
      'Answer what’s closest. We’ll match you with the right readers and the right next step.',
  },
  'a-services': {
    eyebrow: 'Tools for your stage',
    title: 'Pick what fits.',
    pitch: 'Tick anything that’s relevant — skip what isn’t.',
  },
  'a-betareading': {
    eyebrow: 'BetaReading',
    title: 'Get the right beta readers in 2 weeks.',
    pitch: 'A few specifics — then we line up readers in your genre.',
  },
  'a-publishing': {
    eyebrow: 'Publishing',
    title: 'Publish without losing your rights.',
    pitch: 'Tell us how you want to release — we handle the rest.',
  },
  'a-book': {
    eyebrow: 'About the work',
    title: 'Help readers find your book.',
    pitch: 'Stage, language, genres, length — the basics.',
  },
  'a-upload': {
    eyebrow: 'Optional',
    title: 'Drop your manuscript (or skip).',
    pitch: 'Add it now or later — we keep it private either way.',
  },
  'a-final': {
    eyebrow: 'Step 2 · Coming up',
    title: 'Your writing home is next.',
    pitch: 'We’ll line up the readers and the next step that fits your stage.',
  },
};

function selectedSet(answers: Answers): Set<string> {
  return new Set((answers.services as string[]) ?? []);
}

function computeSteps(mode: Mode, answers: Answers): PageId[] {
  const s = (answers.services as string[]) ?? [];
  if (mode === 'reader') {
    const out: PageId[] = ['r1', 'r2', 'r-services'];
    if (s.includes('newsletter')) out.push('r-newsletter');
    if (s.includes('r-publishing')) out.push('r-publishing');
    if (s.includes('r-betareads')) out.push('r-betareads');
    out.push('r-final');
    return out;
  }
  if (answers.route === 'Online reading group only') return ['a1', 'a-book', 'a-upload', 'a-final'];
  const out: PageId[] = ['a1', 'a-services'];
  if (s.length === 0) {
    out.push('a-final');
    return out;
  }
  if (s.includes('betareading')) out.push('a-betareading');
  if (s.includes('publishing')) out.push('a-publishing');
  out.push('a-book', 'a-upload', 'a-final');
  return out;
}

function nextPage(current: PageId, answers: Answers): PageId {
  const s = selectedSet(answers);
  switch (current) {
    case 'r1':
      return 'r2';
    case 'r2':
      return 'r-services';
    case 'r-services':
      if (s.has('newsletter')) return 'r-newsletter';
      if (s.has('r-publishing')) return 'r-publishing';
      if (s.has('r-betareads')) return 'r-betareads';
      return 'r-final';
    case 'r-newsletter':
      if (s.has('r-publishing')) return 'r-publishing';
      if (s.has('r-betareads')) return 'r-betareads';
      return 'r-final';
    case 'r-publishing':
      if (s.has('r-betareads')) return 'r-betareads';
      return 'r-final';
    case 'r-betareads':
      return 'r-final';
    case 'a1': {
      const route = answers.route;
      if (route === 'Online reading group only') return 'a-book';
      return 'a-services';
    }
    case 'a-services':
      if (s.has('betareading')) return 'a-betareading';
      if (s.has('publishing')) return 'a-publishing';
      if (s.size > 0) return 'a-book';
      return 'a-final';
    case 'a-betareading':
      if (s.has('publishing')) return 'a-publishing';
      return 'a-book';
    case 'a-publishing':
      return 'a-book';
    case 'a-book':
      return 'a-upload';
    case 'a-upload':
      return 'a-final';
    default:
      return current;
  }
}

function prevPage(current: PageId, answers: Answers): PageId | null {
  const s = selectedSet(answers);
  switch (current) {
    case 'r2':
      return 'r1';
    case 'r-services':
      return 'r2';
    case 'r-newsletter':
      return 'r-services';
    case 'r-publishing':
      if (s.has('newsletter')) return 'r-newsletter';
      return 'r-services';
    case 'r-betareads':
      if (s.has('r-publishing')) return 'r-publishing';
      if (s.has('newsletter')) return 'r-newsletter';
      return 'r-services';
    case 'r-final':
      if (s.has('r-betareads')) return 'r-betareads';
      if (s.has('r-publishing')) return 'r-publishing';
      if (s.has('newsletter')) return 'r-newsletter';
      return 'r-services';
    case 'a-services':
      return 'a1';
    case 'a-betareading':
      return 'a-services';
    case 'a-publishing':
      if (s.has('betareading')) return 'a-betareading';
      return 'a-services';
    case 'a-book':
      if (s.has('publishing')) return 'a-publishing';
      if (s.has('betareading')) return 'a-betareading';
      if (answers.route === 'Online reading group only') return 'a1';
      return 'a-services';
    case 'a-upload':
      return 'a-book';
    case 'a-final':
      if (s.size > 0 || answers.route === 'Online reading group only') return 'a-upload';
      return 'a-services';
    default:
      return null;
  }
}

export function OnboardingOverlay({
  mode,
  onClose,
  onComplete,
}: {
  mode: Mode | null;
  onClose: () => void;
  onComplete?: () => void;
}) {
  const [answers, setAnswers] = useState<Answers>({});
  const [extras, setExtras] = useState<Record<string, string[]>>({});
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [pageId, setPageId] = useState<PageId>('r1');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  useEffect(() => {
    if (!mode) {
      setAnswers({});
      setExtras({});
      setDrafts({});
      setPageId('r1');
      setUploadedFile(null);
      return;
    }
    setPageId(mode === 'reader' ? 'r1' : 'a1');
  }, [mode]);

  useEffect(() => {
    if (!mode) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mode, onClose]);

  const questions = useMemo<Q[]>(() => {
    switch (pageId) {
      case 'r1':
        return READER_QS_P1;
      case 'r2':
        return READER_QS_P2;
      case 'r-newsletter':
        return READER_QS_NEWS;
      case 'r-publishing':
        return READER_QS_PUB;
      case 'r-betareads':
        return READER_QS_BETA;
      case 'a1':
        return AUTHOR_QS_P1;
      case 'a-betareading':
        return AUTHOR_QS_BETA;
      case 'a-publishing':
        return AUTHOR_QS_PUB;
      case 'a-book':
        return AUTHOR_QS_BOOK;
      default:
        return [];
    }
  }, [pageId]);

  if (!mode) return null;

  const heading = HEADINGS[pageId];
  const QUESTION_PAGES: PageId[] = [
    'r1',
    'r2',
    'r-newsletter',
    'r-publishing',
    'r-betareads',
    'a1',
    'a-betareading',
    'a-publishing',
    'a-book',
  ];
  const isQuestionsPage = QUESTION_PAGES.includes(pageId);
  const isServicesPage = pageId === 'a-services' || pageId === 'r-services';
  const isUploadPage = pageId === 'a-upload';
  const isFinalPage = pageId === 'r-final' || pageId === 'a-final';

  const setSingle = (id: string, value: string) =>
    setAnswers((a) => ({ ...a, [id]: a[id] === value ? '' : value }));
  const toggleMulti = (id: string, value: string) =>
    setAnswers((a) => {
      const cur = (a[id] as string[]) ?? [];
      return {
        ...a,
        [id]: cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value],
      };
    });
  const setText = (id: string, value: string) => setAnswers((a) => ({ ...a, [id]: value }));

  const addExtra = (id: string) => {
    const v = (drafts[id] ?? '').trim();
    if (!v) return;
    const list = extras[id] ?? [];
    if (list.includes(v)) {
      setDrafts((d) => ({ ...d, [id]: '' }));
      return;
    }
    setExtras((c) => ({ ...c, [id]: [...list, v] }));
    setAnswers((a) => {
      const cur = (a[id] as string[]) ?? [];
      return { ...a, [id]: [...cur, v] };
    });
    setDrafts((d) => ({ ...d, [id]: '' }));
  };

  const removeExtra = (id: string, value: string) => {
    setExtras((c) => ({ ...c, [id]: (c[id] ?? []).filter((v) => v !== value) }));
    setAnswers((a) => ({
      ...a,
      [id]: ((a[id] as string[]) ?? []).filter((v) => v !== value),
    }));
  };

  const toggleService = (id: ServiceId) => {
    setAnswers((a) => {
      const cur = (a.services as string[]) ?? [];
      return {
        ...a,
        services: cur.includes(id) ? cur.filter((v) => v !== id) : [...cur, id],
      };
    });
  };

  const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setUploadedFile(f);
  };
  const clearFile = () => setUploadedFile(null);

  const goNext = () => {
    const next = nextPage(pageId, answers);
    // eslint-disable-next-line no-console
    console.log('[onboarding] page→next', { from: pageId, to: next, mode, answers });
    setPageId(next);
  };

  const goBack = () => {
    const prev = prevPage(pageId, answers);
    if (prev) setPageId(prev);
  };

  const serviceIds: string[] = isServicesPage
    ? pageId === 'r-services'
      ? READER_SERVICE_IDS
      : servicesFor(answers.route as string | undefined)
    : [];
  const serviceMapForCards: Record<string, Service> =
    pageId === 'r-services' ? (READER_SERVICES as Record<string, Service>) : (SERVICES as Record<string, Service>);
  const selectedServices = (answers.services as string[]) ?? [];

  return (
    <div className="ob-root" role="dialog" aria-modal="true" aria-labelledby="ob-title">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="ob-scrim" onClick={onClose} aria-hidden="true" />
      <div className="ob-sheet">
        <button className="ob-close" onClick={onClose} aria-label="Close onboarding">
          ×
        </button>

        {(() => {
          const steps = computeSteps(mode, answers);
          const idx = steps.indexOf(pageId);
          if (idx < 0) return null;
          return (
            <div className="ob-progress" aria-hidden="true">
              {steps.map((sid, i) => (
                <span
                  key={sid}
                  className={`ob-progress-step${i < idx ? ' is-done' : ''}${
                    i === idx ? ' is-current' : ''
                  }`}
                />
              ))}
            </div>
          );
        })()}

        <p className="ob-eyebrow">{heading.eyebrow}</p>
        <h2 id="ob-title" className="ob-title">
          {heading.title}
        </h2>
        <p className="ob-pitch">{heading.pitch}</p>

        {isQuestionsPage && (
          <div className="ob-form">
            {questions.map((q) => {
              if (q.showIf && !q.showIf(answers)) return null;
              return (
                <fieldset key={q.id} className="ob-q">
                  <legend className="ob-q-label">
                    {q.label}
                    {q.hint && <span className="ob-q-hint"> · {q.hint}</span>}
                  </legend>
                  {q.kind === 'single' && (
                    <div className="ob-chips">
                      {q.options.map((opt) => {
                        const active = answers[q.id] === opt;
                        return (
                          <button
                            key={opt}
                            type="button"
                            className={`ob-chip${active ? ' is-active' : ''}`}
                            onClick={() => setSingle(q.id, opt)}
                            aria-pressed={active}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  )}
                  {q.kind === 'multi' && (
                    <div className="ob-chips">
                      {q.options.map((opt) => {
                        const cur = (answers[q.id] as string[]) ?? [];
                        const active = cur.includes(opt);
                        return (
                          <button
                            key={opt}
                            type="button"
                            className={`ob-chip${active ? ' is-active' : ''}`}
                            onClick={() => toggleMulti(q.id, opt)}
                            aria-pressed={active}
                          >
                            {opt}
                          </button>
                        );
                      })}
                      {(extras[q.id] ?? []).map((opt) => {
                        const cur = (answers[q.id] as string[]) ?? [];
                        const active = cur.includes(opt);
                        return (
                          <span
                            key={`x-${opt}`}
                            className={`ob-chip ob-chip-custom${active ? ' is-active' : ''}`}
                          >
                            <button
                              type="button"
                              className="ob-chip-toggle"
                              onClick={() => toggleMulti(q.id, opt)}
                              aria-pressed={active}
                            >
                              {opt}
                            </button>
                            <button
                              type="button"
                              className="ob-chip-remove"
                              onClick={() => removeExtra(q.id, opt)}
                              aria-label={`Remove ${opt}`}
                            >
                              ×
                            </button>
                          </span>
                        );
                      })}
                      {q.allowCustom && (
                        <input
                          type="text"
                          className="ob-chip-input"
                          placeholder="+ Add genre"
                          value={drafts[q.id] ?? ''}
                          onChange={(e) =>
                            setDrafts((d) => ({ ...d, [q.id]: e.target.value }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addExtra(q.id);
                            }
                          }}
                          onBlur={() => addExtra(q.id)}
                          aria-label={`Add a custom ${q.label.toLowerCase()} option`}
                        />
                      )}
                    </div>
                  )}
                  {q.kind === 'text' && (
                    <input
                      type="text"
                      className="ob-input"
                      placeholder={q.placeholder}
                      value={(answers[q.id] as string) ?? ''}
                      onChange={(e) => setText(q.id, e.target.value)}
                    />
                  )}
                </fieldset>
              );
            })}
          </div>
        )}

        {isServicesPage && (
          <div className="ob-cards">
            {serviceIds.map((sid) => {
              const svc = serviceMapForCards[sid];
              if (!svc) return null;
              const active = selectedServices.includes(sid);
              return (
                <button
                  key={sid}
                  type="button"
                  className={`ob-card${active ? ' is-active' : ''}`}
                  onClick={() => toggleService(sid as ServiceId)}
                  aria-pressed={active}
                >
                  <span className="ob-card-circle" aria-hidden="true">
                    <svg
                      className="ob-card-check"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 8.5l3.5 3.5L13 5" />
                    </svg>
                  </span>
                  <span className="ob-card-icon" aria-hidden="true">
                    <Icon name={svc.icon} />
                  </span>
                  <span className="ob-card-body">
                    <span className="ob-card-title">{svc.title}</span>
                    <span className="ob-card-pitch">{svc.pitch}</span>
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {isUploadPage && (
          <div className="ob-upload">
            <label
              className={`ob-dropzone${uploadedFile ? ' is-filled' : ''}`}
              tabIndex={0}
            >
              <input
                type="file"
                accept=".doc,.docx,.pdf,.epub,.txt,.md"
                onChange={onPickFile}
                className="ob-dropzone-input"
              />
              {uploadedFile ? (
                <span className="ob-dropzone-meta">
                  <span className="ob-dropzone-name">{uploadedFile.name}</span>
                  <span className="ob-dropzone-size">
                    {Math.max(1, Math.round(uploadedFile.size / 1024))} KB
                  </span>
                  <button
                    type="button"
                    className="ob-dropzone-remove"
                    onClick={(e) => {
                      e.preventDefault();
                      clearFile();
                    }}
                  >
                    Remove
                  </button>
                </span>
              ) : (
                <span className="ob-dropzone-prompt">
                  <span className="ob-dropzone-title">Drop your manuscript here</span>
                  <span className="ob-dropzone-sub">
                    or click to browse · .doc, .docx, .pdf, .epub, .txt, .md
                  </span>
                </span>
              )}
            </label>
            {uploadedFile && uploadedFile.size > 25 * 1024 * 1024 && (
              <p className="ob-dropzone-warn">
                Heads up — that’s over 25 MB. We’ll still take it.
              </p>
            )}
          </div>
        )}

        {isFinalPage && (
          <div className="ob-final">
            {selectedServices.length > 0 && (
              <div className="ob-summary">
                <span className="ob-summary-label">Coming next:</span>
                {selectedServices.map((sid) => (
                  <span key={sid} className="ob-summary-chip">
                    {serviceTitle(sid)}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="ob-actions">
          {isFinalPage ? (
            <>
              <button
                className="ob-btn ob-btn-primary"
                type="button"
                onClick={onComplete ?? onClose}
              >
                Take me there
              </button>
              <button className="ob-btn ob-btn-text" type="button" onClick={goBack}>
                Back
              </button>
            </>
          ) : (
            <>
              <button className="ob-btn ob-btn-primary" type="button" onClick={goNext}>
                Next
              </button>
              {prevPage(pageId, answers) ? (
                <button className="ob-btn ob-btn-ghost" type="button" onClick={goBack}>
                  Back
                </button>
              ) : null}
              <button className="ob-btn ob-btn-text" type="button" onClick={onClose}>
                Skip
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const CSS = `
.ob-root {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(16px, 4vh, 48px) clamp(16px, 4vw, 32px);
  font-family: 'Bricolage Grotesque', 'Outfit', system-ui, sans-serif;
  color: #0e0e0c;
}
.ob-scrim {
  position: absolute;
  inset: 0;
  background: rgba(14, 14, 12, 0.45);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  animation: ob-fade 220ms ease both;
}
.ob-sheet {
  position: relative;
  width: min(720px, 100%);
  max-height: 100%;
  background: #ffffff;
  overflow-y: auto;
  padding: 56px clamp(28px, 5vw, 64px) 64px;
  border-radius: 18px;
  box-shadow:
    0 1px 0 rgba(14, 14, 12, 0.04),
    0 28px 80px rgba(14, 14, 12, 0.32);
  animation: ob-pop 320ms cubic-bezier(0.22, 1, 0.36, 1) both;
}
.ob-progress {
  position: absolute;
  top: 24px;
  left: clamp(28px, 5vw, 64px);
  right: clamp(64px, 7vw, 88px);
  display: flex;
  gap: 4px;
  height: 4px;
  z-index: 1;
}
.ob-progress-step {
  flex: 1 1 0;
  background: var(--v6-divider);
  border-radius: 2px;
  transition: background 200ms ease, opacity 200ms ease;
}
.ob-progress-step.is-done {
  background: var(--v6-accent);
  opacity: 0.55;
}
.ob-progress-step.is-current {
  background: var(--v6-accent);
}
.ob-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  font-size: 28px;
  line-height: 1;
  color: #0e0e0c;
  cursor: pointer;
  border-radius: 999px;
  transition: background 180ms ease, color 180ms ease;
}
.ob-close:hover {
  background: rgba(14, 14, 12, 0.06);
  color: var(--v6-accent);
}
.ob-eyebrow {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--v6-accent);
  margin: 0 0 14px;
}
.ob-title {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 800;
  font-size: clamp(32px, 4.4vw, 48px);
  letter-spacing: -0.03em;
  font-variation-settings: 'wdth' 94, 'opsz' 48;
  line-height: 1.05;
  margin: 0 0 12px;
}
.ob-pitch {
  font-family: 'Outfit', sans-serif;
  font-size: 16px;
  line-height: 1.5;
  color: #4d4d47;
  margin: 0 0 32px;
  max-width: 56ch;
}
.ob-form {
  display: flex;
  flex-direction: column;
  gap: 26px;
  border-top: 1px solid rgba(14, 14, 12, 0.1);
  padding-top: 28px;
}
.ob-q {
  border: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.ob-q-label {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 700;
  font-size: 15px;
  letter-spacing: -0.005em;
  color: #0e0e0c;
  padding: 0;
}
.ob-q-hint {
  font-weight: 400;
  font-family: 'Outfit', sans-serif;
  color: #888880;
  font-size: 13px;
  letter-spacing: 0;
  text-transform: none;
}
.ob-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.ob-chip {
  font-family: 'Outfit', sans-serif;
  font-weight: 500;
  font-size: 14px;
  padding: 9px 14px;
  border: 1px solid rgba(14, 14, 12, 0.18);
  background: #ffffff;
  color: #0e0e0c;
  border-radius: 999px;
  cursor: pointer;
  transition:
    background 160ms ease,
    border-color 160ms ease,
    color 160ms ease,
    transform 120ms ease;
  letter-spacing: 0;
}
.ob-chip:hover {
  border-color: #0e0e0c;
}
.ob-chip.is-active {
  background: #0e0e0c;
  color: #ffffff;
  border-color: #0e0e0c;
}
.ob-chip:focus-visible {
  outline: 2px solid var(--v6-accent);
  outline-offset: 2px;
}
.ob-chip-custom {
  display: inline-flex;
  align-items: stretch;
  padding: 0;
  overflow: hidden;
}
.ob-chip-custom .ob-chip-toggle {
  font-family: inherit;
  font-weight: 500;
  font-size: 14px;
  padding: 9px 6px 9px 14px;
  border: none;
  background: transparent;
  color: inherit;
  cursor: pointer;
}
.ob-chip-custom .ob-chip-remove {
  font-family: inherit;
  font-size: 16px;
  line-height: 1;
  border: none;
  background: transparent;
  color: inherit;
  cursor: pointer;
  padding: 0 12px 0 6px;
  opacity: 0.55;
  transition: opacity 160ms ease, color 160ms ease;
}
.ob-chip-custom .ob-chip-remove:hover {
  opacity: 1;
  color: var(--v6-accent);
}
.ob-chip-custom.is-active .ob-chip-remove:hover {
  color: #ffffff;
}
.ob-chip-input {
  font-family: 'Outfit', sans-serif;
  font-weight: 500;
  font-size: 14px;
  padding: 9px 14px;
  border: 1px dashed rgba(14, 14, 12, 0.3);
  background: transparent;
  color: #0e0e0c;
  border-radius: 999px;
  outline: none;
  min-width: 150px;
  max-width: 220px;
  transition: border-color 160ms ease, background 160ms ease;
}
.ob-chip-input::placeholder {
  color: rgba(14, 14, 12, 0.5);
}
.ob-chip-input:focus,
.ob-chip-input:not(:placeholder-shown) {
  border-style: solid;
  border-color: var(--v6-accent);
  background: var(--v6-accent-soft);
}
.ob-input {
  font-family: 'Outfit', sans-serif;
  font-weight: 500;
  font-size: 15px;
  padding: 12px 14px;
  border: 1px solid rgba(14, 14, 12, 0.2);
  border-radius: 6px;
  background: #ffffff;
  color: #0e0e0c;
  width: 100%;
  max-width: 420px;
  transition: border-color 160ms ease;
}
.ob-input:focus {
  outline: none;
  border-color: var(--v6-accent);
}

.ob-cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  border-top: 1px solid var(--v6-divider);
  padding-top: 28px;
}
.ob-card {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 14px;
  text-align: left;
  padding: 14px 18px;
  border: 1px solid var(--v6-divider);
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.02);
  color: var(--v6-text-strong);
  cursor: pointer;
  font-family: inherit;
  transition: background 180ms ease, border-color 180ms ease,
              transform 140ms ease;
}
.ob-card:hover {
  transform: translateY(-1px);
  background: rgba(0, 0, 0, 0.04);
}
.ob-card.is-active {
  border-color: var(--v6-accent);
  background: var(--v6-accent-soft);
}
.ob-card-circle {
  flex: 0 0 auto;
  width: 22px;
  height: 22px;
  margin-top: 2px;
  border: 1.5px solid var(--v6-divider);
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  transition: background 160ms ease, border-color 160ms ease;
}
.ob-card.is-active .ob-card-circle {
  background: var(--v6-accent);
  border-color: var(--v6-accent);
}
.ob-card-check {
  width: 12px;
  height: 12px;
  color: #ffffff;
  opacity: 0;
  transform: scale(0.7);
  transition: opacity 160ms ease, transform 160ms ease;
}
.ob-card.is-active .ob-card-check {
  opacity: 1;
  transform: scale(1);
}
.ob-card-icon {
  flex: 0 0 auto;
  width: 22px;
  height: 22px;
  margin-top: 1px;
  color: var(--v6-accent);
  display: flex;
  align-items: center;
  justify-content: center;
}
.ob-card-body {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  flex: 1 1 auto;
}
.ob-card-title {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 700;
  font-size: 17px;
  letter-spacing: -0.01em;
  line-height: 1.25;
  color: var(--v6-text-strong);
}
.ob-card-pitch {
  font-family: 'Outfit', sans-serif;
  font-weight: 500;
  font-size: 13.5px;
  line-height: 1.45;
  color: rgba(14, 14, 12, 0.62);
  max-width: 56ch;
}

.ob-upload {
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-top: 1px solid rgba(14, 14, 12, 0.1);
  padding-top: 28px;
}
.ob-dropzone {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 180px;
  padding: 24px;
  border: 2px dashed rgba(14, 14, 12, 0.22);
  border-radius: 14px;
  background: transparent;
  color: var(--v6-text-strong);
  cursor: pointer;
  text-align: center;
  transition: border-color 160ms ease, background 160ms ease;
}
.ob-dropzone:hover,
.ob-dropzone:focus-within {
  border-color: var(--v6-accent);
  background: var(--v6-accent-soft);
}
.ob-dropzone.is-filled {
  border-style: solid;
  border-color: var(--v6-accent);
  background: var(--v6-accent-soft);
}
.ob-dropzone-input {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}
.ob-dropzone-prompt {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.ob-dropzone-title {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 700;
  font-size: 16px;
  letter-spacing: -0.01em;
}
.ob-dropzone-sub {
  font-family: 'Outfit', sans-serif;
  font-size: 13px;
  color: rgba(14, 14, 12, 0.55);
}
.ob-dropzone-meta {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  font-family: 'Outfit', sans-serif;
  font-size: 14px;
}
.ob-dropzone-name {
  font-weight: 600;
}
.ob-dropzone-size {
  color: rgba(14, 14, 12, 0.55);
  font-size: 13px;
}
.ob-dropzone-remove {
  position: relative;
  z-index: 2;
  appearance: none;
  border: 1px solid rgba(14, 14, 12, 0.22);
  background: #ffffff;
  font: inherit;
  font-weight: 600;
  font-size: 12px;
  padding: 6px 10px;
  border-radius: 999px;
  color: var(--v6-text-strong);
  cursor: pointer;
  transition: border-color 160ms ease, color 160ms ease;
}
.ob-dropzone-remove:hover {
  border-color: var(--v6-accent);
  color: var(--v6-accent);
}
.ob-dropzone-warn {
  margin: 0;
  font-family: 'Outfit', sans-serif;
  font-size: 13px;
  color: rgba(14, 14, 12, 0.6);
}

.ob-final {
  margin-bottom: 16px;
}
.ob-summary {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  padding: 14px 16px;
  border-radius: 10px;
  background: var(--v6-accent-soft);
  border: 1px solid var(--v6-accent-soft);
}
.ob-summary-label {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--v6-accent);
}
.ob-summary-chip {
  font-family: 'Outfit', sans-serif;
  font-weight: 600;
  font-size: 13px;
  padding: 4px 10px;
  background: #ffffff;
  border-radius: 999px;
  color: #0e0e0c;
  border: 1px solid rgba(14, 14, 12, 0.12);
}

.ob-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-top: 36px;
  padding-top: 28px;
  border-top: 1px solid rgba(14, 14, 12, 0.1);
}
.ob-btn {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 0.01em;
  padding: 13px 22px;
  border-radius: 999px;
  border: 1px solid transparent;
  cursor: pointer;
  transition:
    background 160ms ease,
    color 160ms ease,
    border-color 160ms ease,
    transform 120ms ease;
}
.ob-btn-primary {
  background: var(--v6-accent);
  color: #ffffff;
}
.ob-btn-primary:hover {
  filter: brightness(0.92);
}
.ob-btn-ghost {
  background: #ffffff;
  color: #0e0e0c;
  border-color: rgba(14, 14, 12, 0.22);
}
.ob-btn-ghost:hover {
  border-color: #0e0e0c;
}
.ob-btn-text {
  background: transparent;
  color: #4d4d47;
  padding: 13px 12px;
  margin-left: auto;
}
.ob-btn-text:hover {
  color: var(--v6-accent);
}

@keyframes ob-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes ob-pop {
  from { transform: translateY(12px) scale(0.98); opacity: 0; }
  to { transform: translateY(0) scale(1); opacity: 1; }
}
@media (prefers-reduced-motion: reduce) {
  .ob-scrim, .ob-sheet { animation: none; }
}
@media (max-width: 720px) {
  .ob-root {
    padding: 0;
  }
  .ob-sheet {
    width: 100%;
    max-height: 100vh;
    border-radius: 0;
    padding: 56px 22px 96px;
  }
  .ob-cards {
    grid-template-columns: 1fr;
  }
}
`;

function Icon({ name }: { name: IconName }) {
  const common = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    width: 18,
    height: 18,
  };
  switch (name) {
    case 'search':
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" />
        </svg>
      );
    case 'clipboard':
      return (
        <svg {...common}>
          <rect x="6" y="4" width="12" height="16" rx="2" />
          <path d="M9 4h6v3H9z" />
          <path d="M9 12h6M9 16h6" />
        </svg>
      );
    case 'feedback':
      return (
        <svg {...common}>
          <path d="M4 6a2 2 0 012-2h12a2 2 0 012 2v9a2 2 0 01-2 2H9l-4 4v-4H6a2 2 0 01-2-2z" />
          <path d="M9 9h6M9 12h4" />
        </svg>
      );
    case 'book':
      return (
        <svg {...common}>
          <path d="M5 4a2 2 0 012-2h11v18H7a2 2 0 01-2-2z" />
          <path d="M5 18a2 2 0 002 2h11" />
        </svg>
      );
    case 'envelope':
      return (
        <svg {...common}>
          <rect x="3" y="6" width="18" height="12" rx="2" />
          <path d="M3 7l9 6 9-6" />
        </svg>
      );
    case 'sparkle':
      return (
        <svg {...common}>
          <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" />
        </svg>
      );
    case 'pencil':
      return (
        <svg {...common}>
          <path d="M16 3l5 5-12 12H4v-5z" />
          <path d="M14 5l5 5" />
        </svg>
      );
  }
}
