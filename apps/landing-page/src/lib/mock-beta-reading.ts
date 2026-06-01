export type BetaReadingRequest = {
  slug: string;
  title: string;
  author: string;
  authorHandle?: string;
  cover: string;
  type: string;
  words: number;
  chapters: number;
  genre: string;
  mood: string;
  stage: string;
  deadline: string;
  slotsOpen: number;
  rewardCredits: number;
  estRead: string;
  blurb: string;
  note: string;
  focusPoints: string[];
  openingTitle: string;
  openingBody: string;
};

const betaCover = (filename: string) =>
  `linear-gradient(180deg, rgba(8, 8, 8, 0.08) 0%, rgba(8, 8, 8, 0.34) 58%, rgba(8, 8, 8, 0.62) 100%), url('/covers/${filename}.jpg') center/cover no-repeat`;

const betaReadingRequests: BetaReadingRequest[] = [
  {
    slug: 'the-orchard-map',
    title: 'The Orchard Map',
    author: 'Mina Calder',
    cover: betaCover('the-orchard-map'),
    type: 'Novel',
    words: 68200,
    chapters: 21,
    genre: 'Fantasy',
    mood: 'Escapist',
    stage: 'Second draft',
    deadline: '14 days',
    slotsOpen: 2,
    rewardCredits: 25,
    estRead: '~7hr',
    blurb:
      'A young mapmaker inherits an orchard whose rows rearrange themselves each night, pointing toward a border town no one remembers building.',
    note:
      'Thank you for reading this early draft. I am especially grateful for careful notes on where the mystery pulls you forward, where the worldbuilding slows the chapter down, and which character choices feel earned.',
    focusPoints: [
      'Track where the central map mystery feels clear, confusing, or too heavily explained.',
      'Flag any scene where the pacing drifts or the chapter ends before you feel ready to continue.',
      'Note whether the emotional stakes between Rowan and her brother land on the page.',
      'Mark worldbuilding details that feel vivid, repeated, or missing from the reader experience.',
    ],
    openingTitle: 'Chapter 1 - The Trees Move at Night',
    openingBody: `
<p>Rowan Bell first noticed the orchard had moved because the pear trees were facing the wrong moon.</p>
<p>She had spent enough nights repairing fences by lanternlight to know the shape of the hill behind the house. The old stone wall should have been visible from the kitchen path. Instead, a new row of silver-leafed trees stood there, branches angled like compass needles toward the dark.</p>
<p>In the morning, her brother insisted grief had made a cartographer of her imagination. Rowan said nothing. She only unfolded their mother's final map and watched, with a chill that started under her ribs, as a road inked itself across the blank corner.</p>
    `.trim(),
  },
  {
    slug: 'northbound-after-midnight',
    title: 'Northbound After Midnight',
    author: 'Jon Bellamy',
    cover: betaCover('northbound-after-midnight'),
    type: 'Novel',
    words: 74500,
    chapters: 28,
    genre: 'Thriller',
    mood: 'Intense',
    stage: 'Line edit',
    deadline: '10 days',
    slotsOpen: 2,
    rewardCredits: 25,
    estRead: '~8hr',
    blurb:
      'A night-train conductor discovers that every missing passenger left behind the same impossible ticket number.',
    note:
      'Thank you for reading before this draft goes to final edit. I am looking for notes on tension, clue placement, and whether the reveals feel surprising without feeling unfair.',
    focusPoints: [
      'Flag any clue that feels too obvious, too hidden, or introduced too late.',
      'Watch for chapters where the train setting stops feeling physically clear.',
      'Note whether the antagonist feels present before the final third of the story.',
      'Call out any moment where urgency drops during a scene that should feel dangerous.',
    ],
    openingTitle: 'Chapter 1 - Platform 9',
    openingBody: `
<p>The northbound train arrived at 12:07 with every window dark and every seat reserved.</p>
<p>Eli Ward checked the clock above Platform 9 twice before he opened the conductor's door. The train was four minutes early, which was impossible. It had also arrived without a driver, which was worse.</p>
<p>On the first seat in the first carriage, someone had placed a folded ticket. Eli knew the number before he touched it. He had seen it on three missing-person posters that morning.</p>
    `.trim(),
  },
  {
    slug: 'every-house-has-weather',
    title: 'Every House Has Weather',
    author: 'Clara Vale',
    cover: betaCover('every-house-has-weather'),
    type: 'Novel',
    words: 59100,
    chapters: 17,
    genre: 'Literary Fiction',
    mood: 'Reflective',
    stage: 'Developmental draft',
    deadline: '21 days',
    slotsOpen: 2,
    rewardCredits: 25,
    estRead: '~6hr',
    blurb:
      'Three siblings return to sell their childhood home and discover each room preserves a different version of the same summer.',
    note:
      'Thank you for reading this draft with patience and honesty. I am most interested in character sympathy, timeline clarity, and whether the quieter emotional turns feel strong enough.',
    focusPoints: [
      'Track any timeline shift that makes you reread for orientation rather than pleasure.',
      'Note which sibling you understand most clearly and which one feels distant.',
      'Flag quiet scenes that feel emotionally charged, and scenes that only feel still.',
      'Watch whether the house imagery deepens the story or becomes too familiar.',
    ],
    openingTitle: 'Chapter 1 - The Blue Room',
    openingBody: `
<p>The house smelled different when no one wanted it.</p>
<p>Elena stood in the blue room with the estate agent's folder under one arm and rain pressing silver fingerprints against the glass. Nothing had changed except the furniture tags, the cleared shelves, and the fact that her brothers were downstairs speaking softly enough to be cruel.</p>
<p>Then the wardrobe door opened by itself, and the room filled with August heat.</p>
    `.trim(),
  },
  {
    slug: 'the-salt-letters',
    title: 'The Salt Letters',
    author: 'Owen Marr',
    cover: betaCover('the-salt-letters'),
    type: 'Novel',
    words: 81200,
    chapters: 25,
    genre: 'Historical',
    mood: 'Slow Burn',
    stage: 'Second draft',
    deadline: '18 days',
    slotsOpen: 2,
    rewardCredits: 25,
    estRead: '~9hr',
    blurb:
      'A lighthouse keeper begins receiving letters from a shipwreck survivor dated fifty years in the past.',
    note:
      'Thank you for reading and helping me test the emotional spine of this book. I would love notes on historical texture, the dual timeline, and the slow-burn relationship.',
    focusPoints: [
      'Flag historical details that feel immersive, distracting, or under-explained.',
      'Note whether both timelines carry equal emotional weight.',
      'Watch the romance pacing and mark where longing turns into repetition.',
      'Call out any chapter ending that does not give you a reason to continue.',
    ],
    openingTitle: 'Chapter 1 - Glass Light',
    openingBody: `
<p>The first letter arrived folded inside a bottle that should have shattered on the rocks.</p>
<p>Mara found it after the storm, caught in the black weed below the lighthouse steps. The glass was warm in her hand despite the rain. Inside, the paper smelled of salt, smoke, and lavender ink.</p>
<p>The date at the top was March 3, 1874. The lighthouse had not been built until 1921.</p>
    `.trim(),
  },
  {
    slug: 'a-manual-for-vanishing',
    title: 'A Manual for Vanishing',
    author: 'Leah Sato',
    cover: betaCover('a-manual-for-vanishing'),
    type: 'Novel',
    words: 63800,
    chapters: 19,
    genre: 'Mystery',
    mood: 'Calming',
    stage: 'First full draft',
    deadline: '16 days',
    slotsOpen: 2,
    rewardCredits: 25,
    estRead: '~7hr',
    blurb:
      "An archivist cataloguing a magician's estate finds a handwritten guide to disappearing from everyone who remembers you.",
    note:
      'Thank you for reading this strange little mystery. I need help seeing whether the clues accumulate cleanly, whether the narrator earns trust, and where the atmosphere becomes too quiet.',
    focusPoints: [
      'Mark clues you expect to matter later, especially if they do not pay off clearly.',
      'Note where the narrator feels observant versus emotionally withholding.',
      'Flag atmosphere-heavy pages that slow the mystery instead of deepening it.',
      'Watch whether the ending feels prepared by the draft rather than explained by it.',
    ],
    openingTitle: 'Chapter 1 - Inventory',
    openingBody: `
<p>The vanished magician left behind 312 handkerchiefs, nine locked trunks, and one instruction manual wrapped in oilcloth.</p>
<p>Nell catalogued the ordinary things first because the extraordinary ones had a way of looking back. By noon she had labelled the handkerchiefs by color, fiber, and scorch mark. By dusk, trunk seven was humming.</p>
<p>The manual waited on the table, its cover blank except for her name.</p>
    `.trim(),
  },
];

export function getBetaReadingRequests(): BetaReadingRequest[] {
  return betaReadingRequests;
}

export function getBetaReadingRequest(slug: string): BetaReadingRequest | undefined {
  return betaReadingRequests.find((request) => request.slug === slug);
}

/** Parse a deadline label like "14 days" into a number of days for sorting. */
export function deadlineDays(request: BetaReadingRequest): number {
  const match = request.deadline.match(/\d+/);
  return match ? Number(match[0]) : Number.POSITIVE_INFINITY;
}

/**
 * How early in the writing process a draft is — lower = earlier (needs the most
 * help, so it surfaces first in the "Fresh requests" rail). Unknown stages sort last.
 */
const stageRank: Record<string, number> = {
  'First full draft': 0,
  'Developmental draft': 1,
  'Second draft': 2,
  'Line edit': 3,
};

function stageOrder(request: BetaReadingRequest): number {
  return stageRank[request.stage] ?? 99;
}

export type BetaReadingSection = {
  id: string;
  label: string;
  kicker: string;
  requests: BetaReadingRequest[];
};

/**
 * Rail groupings for the Beta Reading hub. Built to read well with the current
 * thin mock data (5 requests, each a distinct genre — so we group by deadline and
 * stage rather than genre, which would yield one-card rails). Genre lives in the
 * hub's filter chips instead.
 */
export function getBetaReadingSections(): BetaReadingSection[] {
  const all = getBetaReadingRequests();
  return [
    {
      id: 'closing',
      label: 'Closing soon',
      kicker: 'Feedback windows ending first',
      requests: [...all].sort((a, b) => deadlineDays(a) - deadlineDays(b)),
    },
    {
      id: 'fresh',
      label: 'Fresh requests',
      kicker: 'Early drafts looking for readers',
      requests: [...all].sort((a, b) => stageOrder(a) - stageOrder(b)),
    },
    {
      id: 'all',
      label: 'All open beta reads',
      kicker: 'Every manuscript seeking feedback',
      requests: all,
    },
  ];
}

/** Unique genres across open requests, for the hub filter chips. */
export function betaGenres(): string[] {
  return Array.from(new Set(getBetaReadingRequests().map((r) => r.genre))).sort();
}

/** Unique moods across open requests, for the hub filter chips. */
export function betaMoods(): string[] {
  return Array.from(new Set(getBetaReadingRequests().map((r) => r.mood))).sort();
}
