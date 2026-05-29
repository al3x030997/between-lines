export type TabId =
  | 'ebooks'
  | 'illustrations'
  | 'betweenlines'
  | 'volume'
  | 'credits'
  | 'merch'
  | 'gifts';

export type StoreTab = {
  id: TabId;
  label: string;
  emoji: string;
};

export const storeTabs: StoreTab[] = [
  { id: 'ebooks', label: 'Ebooks', emoji: '📖' },
  { id: 'illustrations', label: 'Illustrations', emoji: '🎨' },
  { id: 'betweenlines', label: 'BetweenLines', emoji: '📰' },
  { id: 'volume', label: 'Volume', emoji: '🎧' },
  { id: 'credits', label: 'Reading Credits', emoji: '⭐' },
  { id: 'merch', label: 'Merch', emoji: '👕' },
  { id: 'gifts', label: 'Gift', emoji: '🎁' },
];

type BadgeKind =
  | 'new'
  | 'rp'
  | 'bl'
  | 'inaugural'
  | 'bundle'
  | 'ai'
  | 'author'
  | 'merch'
  | 'free'
  | 'mp';

export type StoreProduct = {
  id: string;
  kind: 'book' | 'illustration' | 'journal' | 'audio' | 'merch' | 'gift';
  title: string;
  byline: string;
  blurb: string;
  cover: string;
  coverIsDark?: boolean;
  emoji?: string;
  emojiByline?: string;
  badge?: { kind: BadgeKind; label: string };
  price: string;
  rc?: number;
  memberPrice?: string;
};

const coverArt = (filename: string) =>
  `linear-gradient(180deg, rgba(8, 8, 8, 0.05) 0%, rgba(8, 8, 8, 0.34) 58%, rgba(8, 8, 8, 0.58) 100%), url('/covers/${filename}.jpg') center/cover no-repeat`;

// ============================================================
// EBOOKS — first row from storefront HTML
// ============================================================
export const ebooks: StoreProduct[] = [
  {
    id: 'sb-quiet-hours',
    kind: 'book',
    title: 'The Quiet Hours',
    byline: 'Clara Ashworth',
    blurb: 'A housekeeper discovers a box of letters that reframes thirty years of loyal service — and one life she never knew existed.',
    cover: coverArt('the-quiet-hours'),
    badge: { kind: 'new', label: 'New' },
    price: '$4.99',
    rc: 100,
    memberPrice: '$3.99',
  },
  {
    id: 'sb-empty-chair',
    kind: 'book',
    title: 'The Empty Chair',
    byline: 'James Okafor',
    blurb: "A son returns home to sort his father's belongings — and finds a life hidden in plain sight.",
    cover: coverArt('the-empty-chair'),
    badge: { kind: 'rp', label: 'Reader Pick' },
    price: '$2.99',
    rc: 60,
    memberPrice: '$2.39',
  },
  {
    id: 'sb-before-frost',
    kind: 'book',
    title: 'Before the Frost',
    byline: 'Priya Menon',
    blurb: "Two sisters share a house for one last winter before it is sold. What they say — and don't — is everything.",
    cover: coverArt('before-the-frost'),
    badge: { kind: 'new', label: 'New' },
    price: '$2.99',
    rc: 60,
    memberPrice: '$2.39',
  },
  {
    id: 'sb-three-tuesdays',
    kind: 'book',
    title: 'Three Tuesdays in November',
    byline: 'David Liang',
    blurb: "Linked stories across three decades. Each narrator shares a secret — but only the reader knows what it is.",
    cover: coverArt('three-tuesdays-in-november'),
    price: '$5.99',
    rc: 120,
    memberPrice: '$4.79',
  },
  {
    id: 'sb-margin-notes',
    kind: 'book',
    title: 'The Margin Notes',
    byline: 'Fatima Al-Rashid',
    blurb: 'A graduate student falls in love with a stranger through the annotations left in a second-hand copy of Middlemarch.',
    cover: coverArt('the-margin-notes'),
    price: '$3.99',
    rc: 80,
    memberPrice: '$3.19',
  },
  {
    id: 'sb-ink-wander',
    kind: 'book',
    title: 'Ink and Wander',
    byline: 'Sofia Reyes',
    blurb: 'A poet documents a year of walking the same city street — and what she finally sees when she stops looking.',
    cover: coverArt('ink-and-wander'),
    badge: { kind: 'rp', label: 'Reader Pick' },
    price: '$4.99',
    rc: 100,
    memberPrice: '$3.99',
  },
];

// ============================================================
// ILLUSTRATIONS
// ============================================================
export const illustrations: StoreProduct[] = [
  {
    id: 'il-reading-hour',
    kind: 'illustration',
    title: 'The Reading Hour',
    byline: 'Amara Diallo · 6 digital prints',
    blurb: 'Six quiet moments of reading — light through a window, a hand on a spine, a cup beside an open book.',
    cover: 'linear-gradient(160deg,#fbeaf0,#f5c8da)',
    coverIsDark: true,
    emoji: '🖼️',
    emojiByline: 'Digital Print Series',
    badge: { kind: 'new', label: 'New' },
    price: '$8.00',
    rc: 160,
    memberPrice: '$6.40',
  },
  {
    id: 'il-ink-wander',
    kind: 'illustration',
    title: 'Ink and Wander — Illustrated Edition',
    byline: 'Sofia Reyes · Illustrated by Yuki Tanaka',
    blurb: 'The full ebook with original illustrations — the city street reimagined in ink and watercolour.',
    cover: 'linear-gradient(160deg,#e8f5e9,#b8e8cc)',
    coverIsDark: true,
    emoji: '🎨',
    emojiByline: 'Illustrated Edition',
    badge: { kind: 'rp', label: 'Reader Pick' },
    price: '$9.99',
    rc: 200,
    memberPrice: '$7.99',
  },
  {
    id: 'il-night-rooms',
    kind: 'illustration',
    title: 'Night Rooms',
    byline: 'Leila Voss · 12 digital works',
    blurb: 'Twelve illustrations of interior spaces at night — the desk, the lamp, the half-read page. Solitude and light.',
    cover: 'linear-gradient(160deg,#E1F5EE,#b8e0cf)',
    coverIsDark: true,
    emoji: '✏️',
    emojiByline: 'Mixed Media',
    badge: { kind: 'new', label: 'New' },
    price: '$12.00',
    rc: 240,
    memberPrice: '$9.60',
  },
];

// ============================================================
// BETWEENLINES JOURNAL
// ============================================================
export const journal: StoreProduct[] = [
  {
    id: 'bl-inaugural',
    kind: 'journal',
    title: 'BetweenLines — Inaugural Issue',
    byline: 'The BetweenReads Literary Journal',
    blurb: 'The first issue. Original fiction, essays and poetry from writers who call BetweenReads home.',
    cover: '#FFE600',
    coverIsDark: true,
    badge: { kind: 'inaugural', label: 'Inaugural Issue' },
    price: '$10.00',
    rc: 200,
    memberPrice: '$8.00',
  },
  {
    id: 'bl-june-2026',
    kind: 'journal',
    title: 'BetweenLines — June 2026',
    byline: 'The BetweenReads Literary Journal',
    blurb: 'New voices, returning writers, and one essay that started a conversation across the platform.',
    cover: '#1a1a1a',
    badge: { kind: 'inaugural', label: 'June 2026' },
    price: '$10.00',
    rc: 200,
    memberPrice: '$8.00',
  },
  {
    id: 'bl-bundle-summer',
    kind: 'journal',
    title: 'BetweenLines — June to August 2025',
    byline: '3 issue bundle · Save 20%',
    blurb: 'Every issue from the beginning. The complete BetweenLines archive — growing monthly.',
    cover: '#e63946',
    badge: { kind: 'bundle', label: 'Bundle' },
    price: '$16.00',
    rc: 320,
    memberPrice: '$12.80',
  },
];

// ============================================================
// VOLUME (audiobooks)
// ============================================================
export const audiobooks: StoreProduct[] = [
  {
    id: 'au-quiet-hours',
    kind: 'audio',
    title: 'The Quiet Hours',
    byline: 'Clara Ashworth · AI narrated · 4h 20m',
    blurb: 'A housekeeper discovers a box of letters that reframes thirty years of loyal service.',
    cover: coverArt('the-quiet-hours'),
    badge: { kind: 'ai', label: '🤖 AI Narrated' },
    price: '$6.99',
    rc: 140,
    memberPrice: '$5.59',
  },
  {
    id: 'au-ink-wander',
    kind: 'audio',
    title: 'Ink and Wander',
    byline: 'Sofia Reyes · Author narrated · 2h 10m',
    blurb: 'A poet documents a year of walking the same city street — heard in her own voice.',
    cover: coverArt('ink-and-wander'),
    badge: { kind: 'author', label: '🎙️ Author Narrated' },
    price: '$7.99',
    rc: 160,
    memberPrice: '$6.39',
  },
  {
    id: 'au-margin-notes',
    kind: 'audio',
    title: 'The Margin Notes',
    byline: 'Fatima Al-Rashid · AI narrated · 3h 05m',
    blurb: 'A love story found in the margins of a second-hand copy of Middlemarch.',
    cover: coverArt('the-margin-notes'),
    badge: { kind: 'ai', label: '🤖 AI Narrated' },
    price: '$5.99',
    rc: 120,
    memberPrice: '$4.79',
  },
];

// ============================================================
// MERCH
// ============================================================
export const merch: StoreProduct[] = [
  {
    id: 'me-tshirt',
    kind: 'merch',
    title: 'BetweenReads T-shirt',
    byline: 'Black · Unisex',
    blurb: 'For wandering readers and writers. Clean wordmark on soft black cotton.',
    cover: '#1a1a1a',
    emoji: '👕',
    emojiByline: 'BetweenReads',
    badge: { kind: 'merch', label: 'Merch' },
    price: '$28.00',
    memberPrice: '$22.40',
  },
  {
    id: 'me-tote',
    kind: 'merch',
    title: 'BetweenReads Tote Bag',
    byline: 'Natural canvas · BetweenReads wordmark',
    blurb: 'Carry your reads in a bag that reads. Heavy natural canvas, minimal print.',
    cover: '#f0ece4',
    coverIsDark: true,
    emoji: '👜',
    emojiByline: 'BetweenReads',
    badge: { kind: 'merch', label: 'Merch' },
    price: '$22.00',
    memberPrice: '$17.60',
  },
  {
    id: 'me-bookmarks',
    kind: 'merch',
    title: 'BetweenCharacters Bookmark Set',
    byline: 'Set of 5 · BetweenReads branding',
    blurb: 'Five bookmarks. Five reasons to keep your place. Heavyweight card.',
    cover: '#faf8f4',
    coverIsDark: true,
    emoji: '🔖',
    emojiByline: 'BetweenCharacters',
    badge: { kind: 'merch', label: 'Merch' },
    price: '$12.00',
    memberPrice: '$9.60',
  },
  {
    id: 'me-notebook',
    kind: 'merch',
    title: 'BetweenLines Notebook',
    byline: 'A5 · Lined · Write here',
    blurb: 'For the notes you take between reads. And the ones you take instead of sleeping.',
    cover: '#2d2a24',
    emoji: '📓',
    emojiByline: 'BetweenLines',
    badge: { kind: 'merch', label: 'Merch' },
    price: '$18.00',
    memberPrice: '$14.40',
  },
  {
    id: 'me-mug',
    kind: 'merch',
    title: 'BetweenReads Mug',
    byline: 'For wandering readers and writers',
    blurb: 'Best read alongside something hot. Ceramic, dishwasher safe, understated.',
    cover: '#FFE600',
    coverIsDark: true,
    emoji: '☕',
    emojiByline: 'BetweenReads',
    badge: { kind: 'merch', label: 'Merch' },
    price: '$16.00',
    memberPrice: '$12.80',
  },
  {
    id: 'me-gift-set',
    kind: 'merch',
    title: 'The Reader Gift Set',
    byline: 'Tote + Notebook + Bookmark Set',
    blurb: 'Everything a reader needs to look the part. Wrapped and ready to give.',
    cover: 'linear-gradient(135deg,#E1F5EE,#b8e8cc)',
    coverIsDark: true,
    emoji: '🎁',
    emojiByline: 'The Reader Gift Set',
    badge: { kind: 'bundle', label: 'Bundle' },
    price: '$46.00',
    memberPrice: '$36.80',
  },
];

// ============================================================
// READCREDIT BUNDLES
// ============================================================
export type RCBundle = {
  id: string;
  label: string;
  amount: number;
  price: string;
  save?: string;
};

export const rcBundles: RCBundle[] = [
  { id: 'rc-starter', label: 'Starter', amount: 100, price: '$4.99' },
  { id: 'rc-reader', label: 'Reader', amount: 300, price: '$12.99', save: 'Save 13%' },
  { id: 'rc-power', label: 'Power', amount: 600, price: '$22.99', save: 'Save 23%' },
];

// ============================================================
// VOLUME TIERS
// ============================================================
export type VolumeTier = {
  id: string;
  label: string;
  price: string;
  body: string;
  variant: 'addon' | 'mid' | 'plus';
};

export const volumeTiers: VolumeTier[] = [
  { id: 'vol-addon', label: 'Volume Add-on', price: '$9.99', body: "PowerReader + one writer's full audio catalogue", variant: 'addon' },
  { id: 'vol', label: 'Volume', price: '$19.99', body: 'PowerReader + AI narration across the platform', variant: 'mid' },
  { id: 'vol-plus', label: 'Volume+', price: '$29.99', body: 'PowerReader + AI + author narration where available', variant: 'plus' },
];
