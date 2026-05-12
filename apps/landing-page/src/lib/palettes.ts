export type Palette = {
  bg: string;
  primary: string;
  mute: string;
  accent: string;
  live: string;
  amber: string;
  brown: string;
  burgundy: string;
  cardBg: string;
  cardText: string;
  cardSub: string;
  cardLabel: string;
  cardCta: string;
  ctaHov: string;
  shelfWood: string;
  shelfTrim: string;
  proofText: string;
};

export type PaletteName = 'forest' | 'folio' | 'pub';

export const PALETTES: Record<PaletteName, Palette> = {
  forest: {
    bg: '#F5EDE0', primary: '#0A3A23', mute: '#6B7563', accent: '#688763',
    live: '#E0BC85', amber: '#B8842F', brown: '#3E2723', burgundy: '#7B3B4B',
    cardBg: '#0A3A23', cardText: '#F5EDE0', cardSub: 'rgba(245,237,224,0.6)',
    cardLabel: '#688763', cardCta: '#688763', ctaHov: '#688763',
    shelfWood: '#3E2723', shelfTrim: '#0A3A23', proofText: '#4D5648',
  },
  folio: {
    bg: '#FAF7F0', primary: '#14141A', mute: '#8B8580', accent: '#2E3FE5',
    live: '#E07856', amber: '#E07856', brown: '#2A2520', burgundy: '#5B2D3B',
    cardBg: '#14141A', cardText: '#FAF7F0', cardSub: 'rgba(250,247,240,0.55)',
    cardLabel: '#2E3FE5', cardCta: '#2E3FE5', ctaHov: '#2E3FE5',
    shelfWood: '#2A2520', shelfTrim: '#14141A', proofText: '#6B6560',
  },
  pub: {
    bg: '#1A1310', primary: '#E8D5B4', mute: '#8A7E6A', accent: '#C4963A',
    live: '#C4963A', amber: '#C4963A', brown: '#E8D5B4', burgundy: '#8B4D3B',
    cardBg: '#2A211A', cardText: '#E8D5B4', cardSub: 'rgba(232,213,180,0.5)',
    cardLabel: '#C4963A', cardCta: '#C4963A', ctaHov: '#C4963A',
    shelfWood: '#E8D5B4', shelfTrim: '#C4963A', proofText: '#8A7E6A',
  },
};

export type Book = {
  title: string;
  author: string;
  bg: string;
  text: string;
  w: number;
  h: number;
  accent?: string;
  accentY?: number;
  accentH?: number;
  stroke?: string;
  hasSlots: boolean;
  lines?: boolean;
  genre?: string;
};

export function getBooks(P: Palette): Book[] {
  return [
    { title: 'THE QUIET WAR', author: '@MERRAN', bg: P.primary, text: P.bg, w: 60, h: 470, accent: P.amber, accentY: 20, accentH: 2, hasSlots: true },
    { title: 'FLASH', author: '@JOON', bg: P.brown, text: '#D9A05B', w: 38, h: 450, hasSlots: false },
    { title: 'LETTERS HOME', author: '@PETRA', bg: P.bg, text: P.primary, w: 60, h: 460, accent: P.primary, accentY: 60, accentH: 3, stroke: P.primary, hasSlots: true },
    { title: 'GLASS HOUR', author: '@KADE', bg: P.accent, text: P.bg, w: 45, h: 440, accent: P.primary, accentY: 30, accentH: 3, hasSlots: false, lines: true },
    { title: 'SLOW BURN', author: '@ARIA', bg: P.primary, text: P.bg, w: 55, h: 470, accent: P.accent, accentY: 180, accentH: 60, genre: 'ROMANCE', hasSlots: true },
    { title: 'THE LENDER', author: '@RIN', bg: P.burgundy, text: P.bg, w: 42, h: 445, hasSlots: true },
    { title: 'SALT & IRON', author: '', bg: P.brown, text: P.bg, w: 22, h: 460, accent: P.live, accentY: 0, accentH: 40, hasSlots: false },
  ];
}
