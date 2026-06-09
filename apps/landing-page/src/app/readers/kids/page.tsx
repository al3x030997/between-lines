'use client';

// BetweenReads Kids — the /readers/kids landing page, implemented 2026-06-09
// from the kids-landing mockup. Reuses the site nav pattern (mirrors /pricing),
// the shared Footer, and the WaitlistOverlay for every CTA. Palette stays on the
// brand yellow/ink/paper system, with playful accents for the book covers.

import { useState } from 'react';
import { SiteNav } from '@/components/SiteNav';
import { WaitlistOverlay } from '../../v8/WaitlistForm';
import Footer from '../../v8/sections/Footer';

const KIDS_CSS = `
.kids-root {
  --k-paper: var(--bl-surface);
  --k-ink: #1a1a1a;
  --k-yellow: #FFE800;
  --k-divider: rgba(14,14,12,0.1);
  --k-orange: #e0571a;
  --k-green: #1d9e75;
  --k-purple: #7c52c8;
  --k-blue: #2d6fb5;
  min-height: 100vh;
  background: #ffffff;
  font-family: var(--bl-font-body);
  color: var(--k-ink);
}
.kids-serif { font-family: var(--bl-font-serif); }

/* === hero === */
.kids-hero { background: var(--k-yellow); padding: 90px 24px 96px; text-align: center; }
.kids-hero-kicker {
  font-family: var(--bl-font-eyebrow);
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: #6b5c00;
  margin-bottom: 10px;
}
.kids-hero-subkicker { font-size: 15px; letter-spacing: 0.02em; color: #7a6a10; margin-bottom: 40px; }
.kids-hero h1 {
  font-family: var(--bl-font-serif);
  font-size: clamp(34px, 6vw, 58px);
  line-height: 1.05;
  font-weight: 700;
  color: var(--k-ink);
  max-width: 1000px;
  margin: 0 auto;
}
.kids-hero h1 em { font-style: italic; }
.kids-hero-links { display: flex; gap: 48px; justify-content: center; margin: 48px 0 18px; flex-wrap: wrap; }
.kids-hero-link {
  appearance: none;
  border: 0;
  background: none;
  cursor: pointer;
  font-family: var(--bl-font-serif);
  font-size: 28px;
  font-weight: 700;
  color: var(--k-ink);
  text-decoration: none;
  border-bottom: 3px solid var(--k-ink);
  padding-bottom: 4px;
  transition: opacity 0.15s;
}
.kids-hero-link:hover { opacity: 0.6; }
.kids-hero-tagline {
  font-family: var(--bl-font-serif);
  font-size: 21px;
  font-style: italic;
  color: #3a3000;
  margin: 30px 0 14px;
}

/* === section shell === */
.kids-section { max-width: 1040px; margin: 0 auto; padding: 62px 24px; }
.kids-eyebrow {
  font-family: var(--bl-font-eyebrow);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #bba94f;
  text-align: center;
  margin-bottom: 10px;
}
.kids-sec-title {
  font-family: var(--bl-font-serif);
  font-size: clamp(28px, 4vw, 38px);
  font-weight: 700;
  text-align: center;
  color: var(--k-ink);
  margin-bottom: 12px;
  line-height: 1.15;
}
.kids-lede {
  font-size: 17px;
  color: #777;
  text-align: center;
  max-width: 600px;
  margin: 0 auto 40px;
  line-height: 1.6;
}

/* === kid quotes (post-its) === */
.kids-quote-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  align-items: start;
  max-width: 900px;
  margin: 0 auto;
}
.kids-quote {
  margin: 0;
  padding: 30px 26px 22px;
  border-radius: 4px;
  transform: rotate(var(--rot));
  box-shadow: 0 8px 20px rgba(0,0,0,0.12);
  transition: transform 0.18s;
}
.kids-quote:hover { transform: rotate(0deg); }
.kids-quote blockquote {
  font-family: var(--bl-font-serif);
  font-size: 17px;
  line-height: 1.55;
  color: var(--k-ink);
  margin: 0 0 18px;
  text-align: center;
}
.kids-quote figcaption {
  font-size: 13px;
  color: #6a6250;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-align: center;
}

/* === age tiers === */
.kids-tiers { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; max-width: 680px; margin: 0 auto; }
.kids-tier { background: #fff; border: 1px solid #ececec; border-radius: 20px; padding: 26px 24px; transition: 0.15s; }
.kids-tier:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,.05); }
.kids-tier .kids-age {
  font-family: var(--bl-font-eyebrow);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-bottom: 4px;
}
.kids-tier h4 { font-family: var(--bl-font-serif); font-size: 20px; font-weight: 700; margin-bottom: 8px; }
.kids-tier p { font-size: 13px; color: #777; line-height: 1.55; }
.kids-tier.t1 .kids-age { color: var(--k-orange); }
.kids-tier.t2 .kids-age { color: var(--k-blue); }

/* === story sparks (prompts) === */
.kids-prompts {
  background: #f3eefe;
  border-radius: 24px;
  padding: 38px;
  max-width: 1040px;
  margin: 0 auto;
}
.kids-crayons { width: 160px; margin-bottom: 18px; }
.kids-crayons svg { width: 100%; height: auto; display: block; }
.kids-prompts .kids-eyebrow { text-align: left; color: #9575cd; }
.kids-prompts .kids-sec-title { text-align: left; font-size: 30px; }
.kids-prompts-lede {
  font-size: 15px;
  color: var(--k-purple);
  max-width: 580px;
  margin-bottom: 6px;
  line-height: 1.6;
}
.kids-prompt-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-top: 8px; }
.kids-prompt-card {
  background: #fff;
  border: 1px solid #dccbf7;
  border-radius: 16px;
  padding: 20px;
  font-family: var(--bl-font-serif);
  font-size: 16px;
  font-style: italic;
  color: #2a1a5a;
  line-height: 1.5;
  position: relative;
}
.kids-prompt-card .kids-q {
  font-size: 40px;
  color: #d9ccf7;
  font-family: var(--bl-font-serif);
  position: absolute;
  top: 6px;
  left: 12px;
  line-height: 1;
}
.kids-prompt-card span:last-child { position: relative; }
.kids-prompt-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
  font-size: 13px;
  color: var(--k-purple);
  flex-wrap: wrap;
  gap: 10px;
}
.kids-prompt-badge {
  background: #fff;
  border: 1px solid #dccbf7;
  border-radius: 14px;
  padding: 4px 12px;
  font-weight: 700;
  color: var(--k-purple);
}

/* === book cards === */
.kids-books { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; max-width: 820px; margin: 0 auto; }
.kids-book {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  aspect-ratio: 3 / 4;
  box-shadow: 0 4px 14px rgba(0,0,0,0.12);
  transition: transform 0.2s, box-shadow 0.2s;
}
.kids-book:hover { transform: translateY(-4px); box-shadow: 0 12px 28px rgba(0,0,0,0.18); }
.kids-book-cover { position: absolute; inset: 0; display: flex; flex-direction: column; color: #fff; }
.kids-book-cover::before {
  content: '';
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 8px;
  background: rgba(0,0,0,0.18);
  z-index: 2;
}
.kids-book-illo { flex: 1; display: flex; align-items: center; justify-content: center; padding: 18px 18px 0; }
.kids-book-illo svg { width: 74%; height: auto; display: block; }
.kids-book-foot { padding: 0 22px 22px; position: relative; }
.kids-book .kids-book-lbl {
  font-family: var(--bl-font-eyebrow);
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  opacity: 0.7;
  margin-bottom: 6px;
}
.kids-book h3 { font-family: var(--bl-font-serif); font-size: 20px; font-weight: 700; line-height: 1.2; margin-bottom: 5px; }
.kids-book .kids-book-by { font-size: 12px; opacity: 0.8; }
.kids-book-blurb {
  position: absolute;
  inset: 0;
  background: rgba(20,18,14,0.93);
  color: #fff;
  display: flex;
  align-items: center;
  padding: 24px;
  font-family: var(--bl-font-serif);
  font-size: 15px;
  font-style: italic;
  line-height: 1.5;
  opacity: 0;
  transition: opacity 0.22s;
}
.kids-book:hover .kids-book-blurb,
.kids-book:focus-within .kids-book-blurb { opacity: 1; }
.kids-card-note { text-align: center; font-size: 13px; color: #aaa; margin-top: 24px; }

/* === safe list === */
.kids-safe-list { list-style: none; max-width: 640px; margin: 0 auto; padding: 0; }
.kids-safe-list li {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 14px 0;
  border-bottom: 1px solid #f0eee9;
  font-size: 15px;
  color: #3a3a3a;
  line-height: 1.55;
}
.kids-safe-list li:last-child { border: none; }
.kids-safe-list li b { font-weight: 700; color: var(--k-ink); }
.kids-safe-check {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #eafaf2;
  color: var(--k-green);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 800;
  margin-top: 1px;
}

/* === pricing === */
.kids-price-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; align-items: stretch; }
.kids-price {
  background: #fff;
  border: 1px solid #ececec;
  border-radius: 22px;
  padding: 30px 26px;
  display: flex;
  flex-direction: column;
}
.kids-price.feat { border: 2px solid var(--k-ink); position: relative; }
.kids-price .kids-price-flag {
  position: absolute;
  top: -13px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--k-yellow);
  font-family: var(--bl-font-eyebrow);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 5px 14px;
  border-radius: 20px;
  white-space: nowrap;
}
.kids-price h4 { font-family: var(--bl-font-serif); font-size: 22px; font-weight: 700; margin-bottom: 4px; }
.kids-price .kids-cost { font-size: 34px; font-weight: 800; margin: 8px 0 2px; }
.kids-price .kids-cost small { font-size: 14px; font-weight: 600; color: #999; }
.kids-price .kids-per { font-size: 13px; color: #999; margin-bottom: 18px; }
.kids-price ul { list-style: none; flex: 1; margin: 0 0 20px; padding: 0; }
.kids-price li { font-size: 14px; color: #555; padding: 7px 0; display: flex; gap: 8px; line-height: 1.4; }
.kids-price li::before { content: '✓'; color: var(--k-green); font-weight: 800; flex-shrink: 0; }
.kids-price .kids-pick {
  appearance: none;
  border: none;
  border-radius: 24px;
  padding: 13px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  font-family: var(--bl-font-eyebrow);
  transition: transform 200ms var(--bl-ease), box-shadow 200ms var(--bl-ease);
}
.kids-price .kids-pick.dark { background: var(--k-ink); color: #fff; }
.kids-price .kids-pick.dark:hover { transform: translateY(-1px); box-shadow: 0 8px 18px rgba(14,14,12,0.24); }
.kids-price .kids-pick.ghost { background: #f5f0e6; color: var(--k-ink); }
.kids-price .kids-pick.ghost:hover { background: #ede5d4; }

.kids-access {
  max-width: 760px;
  margin: 34px auto 0;
  background: #fff8ee;
  border: 1px solid #f5dca8;
  border-radius: 18px;
  padding: 22px 28px;
  text-align: center;
}
.kids-access h4 { font-family: var(--bl-font-serif); font-size: 19px; font-weight: 700; color: #7a5b06; margin-bottom: 6px; }
.kids-access p { font-size: 14px; color: #8a6c1a; line-height: 1.6; }

/* === final === */
.kids-final { background: var(--k-yellow); text-align: center; padding: 64px 24px; margin-top: 62px; }
.kids-final h2 { font-family: var(--bl-font-serif); font-size: clamp(30px, 5vw, 44px); font-weight: 700; margin-bottom: 24px; line-height: 1.1; }
.kids-cta-dark {
  appearance: none;
  background: var(--k-ink);
  color: #fff;
  border: none;
  border-radius: 30px;
  padding: 15px 32px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  font-family: var(--bl-font-serif);
  transition: transform 200ms var(--bl-ease), box-shadow 200ms var(--bl-ease);
}
.kids-cta-dark:hover { transform: translateY(-1px); box-shadow: 0 10px 24px rgba(14,14,12,0.28); }

.kids-root :where(button, a, [role="button"]):focus-visible {
  outline: 2px solid var(--k-ink);
  outline-offset: 3px;
}

@media (max-width: 860px) {
  .kids-quote-row,
  .kids-tiers,
  .kids-price-grid,
  .kids-prompt-grid,
  .kids-books { grid-template-columns: 1fr; }
}
`;

type Book = {
  bg: string;
  illo: React.ReactNode;
  label: string;
  title: string;
  by: string;
  blurb: string;
};

const EMERGING_BOOKS: Book[] = [
  {
    bg: 'linear-gradient(165deg,#1a3a4a,#2d6f8a)',
    illo: (
      <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle cx="92" cy="30" r="12" fill="#ffe27a" />
        <path d="M44 96 L52 44 L68 44 L76 96 Z" fill="#f4efe4" />
        <rect x="50" y="52" width="20" height="9" fill="#1a3a4a" />
        <rect x="50" y="68" width="20" height="9" fill="#1a3a4a" />
        <path d="M50 38 L70 38 L66 30 L54 30 Z" fill="#e0571a" />
        <path d="M58 30 L62 30 L62 22 L58 22 Z" fill="#1a3a4a" />
        <path d="M40 96 L80 96 L84 104 L36 104 Z" fill="#d8d0bc" />
        <path d="M28 90 c0 6 5 10 11 10 -3 -3 -3 -8 0 -11 -4 -1 -8 -1 -11 1 Z" fill="#1a1a1a" />
        <circle cx="31" cy="86" r="1.6" fill="#ffe27a" />
      </svg>
    ),
    label: "Children's writer",
    title: 'The Lighthouse Cat',
    by: 'R. Okonkwo · Ages 6–9',
    blurb: "A cat who keeps the harbour's secrets — until the night the light goes out.",
  },
  {
    bg: 'linear-gradient(165deg,#3a2a1a,#7a5a2d)',
    illo: (
      <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M30 34 L58 28 L90 34 L90 86 L58 80 L30 86 Z" fill="#f4efe4" stroke="#2a1a0a" strokeWidth="2" />
        <path d="M36 44 q10 -4 18 2 q8 6 18 -2 q8 -4 -2 12 q-12 14 -22 4 q-8 -8 -12 -16Z" fill="none" stroke="#7a5a2d" strokeWidth="2" strokeLinecap="round" />
        <circle cx="48" cy="48" r="2.5" fill="#e0571a" />
        <path d="M48 48 L64 64" stroke="#e0571a" strokeWidth="1.5" strokeDasharray="2 3" />
        <path d="M62 62 l3 6 l6 -2 l-4 5 l3 5 l-6 -2 l-4 5 l0 -6 l-6 -2 l6 -3 Z" fill="#e0571a" />
      </svg>
    ),
    label: "Children's writer",
    title: 'Marigold & the Map',
    by: 'S. Patel · Ages 9–12',
    blurb: 'A girl, a grandmother, and a map that hums when no one is listening.',
  },
  {
    bg: 'linear-gradient(165deg,#2a1a3a,#5a3d7a)',
    illo: (
      <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect x="40" y="26" width="40" height="74" rx="3" fill="#f4efe4" stroke="#2a1a3a" strokeWidth="2" />
        <rect x="46" y="32" width="28" height="62" rx="2" fill="#5a3d7a" />
        <circle cx="68" cy="64" r="3" fill="#ffe27a" />
        <path d="M46 94 q14 -30 28 0" fill="#7a5a9a" opacity="0.5" />
        <circle cx="60" cy="20" r="2" fill="#ffe27a" />
        <circle cx="86" cy="42" r="1.6" fill="#ffe27a" />
        <circle cx="34" cy="54" r="1.6" fill="#ffe27a" />
      </svg>
    ),
    label: "Children's writer",
    title: 'The Tuesday Door',
    by: 'J. Mercer · Ages 10–13',
    blurb: 'Every Tuesday a new door appears in the school corridor. Today, someone opened one.',
  },
];

const CLASSIC_BOOKS: Book[] = [
  {
    bg: 'linear-gradient(165deg,#1a0a2a,#3a1a4a)',
    illo: (
      <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M20 80 q40 -14 80 0 l-6 14 q-34 -10 -68 0 Z" fill="#6a4a2a" />
        <rect x="58" y="34" width="3" height="46" fill="#f4efe4" />
        <path d="M61 36 L86 46 L61 56 Z" fill="#e0571a" />
        <path d="M61 58 L80 66 L61 74 Z" fill="#f4efe4" />
        <circle cx="92" cy="28" r="9" fill="#ffe27a" />
        <path d="M30 60 l2 5 l5 0 l-4 4 l2 5 l-5 -3 l-5 3 l2 -5 l-4 -4 l5 0 Z" fill="#ffe27a" opacity="0.8" />
      </svg>
    ),
    label: 'Classic · Free',
    title: 'Treasure Island',
    by: 'Robert Louis Stevenson',
    blurb: 'Pirates, a treasure map, and a boy named Jim Hawkins who should never have gone to sea.',
  },
  {
    bg: 'linear-gradient(165deg,#1a3a2a,#2d6f4a)',
    illo: (
      <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <ellipse cx="60" cy="98" rx="26" ry="6" fill="#1a3a2a" opacity="0.4" />
        <path d="M48 96 q-6 -30 4 -44 q8 -10 16 0 q10 14 4 44 Z" fill="#f4efe4" />
        <circle cx="60" cy="38" r="14" fill="#ffe27a" />
        <path d="M48 40 q12 8 24 0" fill="none" stroke="#e0571a" strokeWidth="2" />
        <rect x="50" y="30" width="20" height="5" fill="#1a3a2a" />
        <path d="M46 33 L74 33 L70 26 L50 26 Z" fill="#3a8c5a" />
      </svg>
    ),
    label: 'Classic · Free',
    title: 'Alice in Wonderland',
    by: 'Lewis Carroll',
    blurb: "Down the rabbit hole and into a world where nothing makes sense — and that's the fun of it.",
  },
  {
    bg: 'linear-gradient(165deg,#1a2a14,#3a5a24)',
    illo: (
      <svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect x="38" y="40" width="44" height="56" rx="2" fill="#6a4a2a" />
        <rect x="44" y="46" width="32" height="44" rx="1" fill="#3a5a24" />
        <circle cx="60" cy="68" r="14" fill="#e85a8a" />
        <circle cx="60" cy="68" r="7" fill="#ffe27a" />
        <path d="M30 40 q30 -20 60 0" fill="none" stroke="#f4efe4" strokeWidth="2" />
        <circle cx="72" cy="58" r="2.5" fill="#f4a0c0" />
        <circle cx="50" cy="80" r="2.5" fill="#f4a0c0" />
      </svg>
    ),
    label: 'Classic · Free',
    title: 'The Secret Garden',
    by: 'Frances Hodgson Burnett',
    blurb: 'A lonely girl finds a locked garden — and brings it, and herself, back to life.',
  },
];

const QUOTES = [
  {
    rot: '-1.5deg',
    bg: '#fff3a8',
    quote:
      'I wrote a story and other kids actually read it. One asked what happens next. Nobody ever asked me that before.',
    by: 'StoryFox, age 10',
  },
  {
    rot: '1.2deg',
    bg: '#d6f0df',
    quote:
      "I finally read Alice in Wonderland. I didn't know it was on here for free. I even got to tell Alice what I thought.",
    by: 'PaperKite, age 9',
  },
  {
    rot: '-0.8deg',
    bg: '#e9ddf9',
    quote: "I just like reading new stories. There's always something I haven't read yet.",
    by: 'BrambleQuill, age 12',
  },
];

const SAFE_POINTS: { lead: string; rest: string }[] = [
  { lead: 'Made-up names only.', rest: 'Every child uses a display name — never their real name, photo, or location.' },
  { lead: 'AI-screened, parent-approved.', rest: "Every story and comment is safety-checked, and for under-13s a parent approves before it's shared." },
  { lead: 'Under 13?', rest: 'A parent holds the account and can see everything their child reads and writes.' },
  { lead: 'Ages 13–17?', rest: "Reading is private to them; a parent's consent is on file and safety matters are flagged." },
  { lead: 'Share with friends.', rest: 'Kids can invite a real friend to read their story — for under-13s the parent sends the invite, teens send their own.' },
  { lead: 'Age-appropriate only.', rest: "Everything is tagged, and older material never appears for a child's profile." },
  { lead: 'Read along.', rest: 'As an adult you can open and read anything your child can.' },
  { lead: 'No ads.', rest: 'Like and react to the stories you love — and never see an advert.' },
];

function BookCard({ book }: { book: Book }) {
  return (
    <article className="kids-book" tabIndex={0}>
      <div className="kids-book-cover" style={{ background: book.bg }}>
        <div className="kids-book-illo">{book.illo}</div>
        <div className="kids-book-foot">
          <div className="kids-book-lbl">{book.label}</div>
          <h3 className="kids-serif">{book.title}</h3>
          <div className="kids-book-by">{book.by}</div>
        </div>
      </div>
      <div className="kids-book-blurb">{book.blurb}</div>
    </article>
  );
}

export default function KidsPage() {
  const [waitlist, setWaitlist] = useState<{ open: boolean; eyebrow?: string }>({ open: false });
  const openWaitlist = (eyebrow?: string) => setWaitlist({ open: true, eyebrow });
  const closeWaitlist = () => setWaitlist({ open: false });

  return (
    <main className="kids-root">
      <style dangerouslySetInnerHTML={{ __html: KIDS_CSS }} />

      {/* === nav === */}
      <SiteNav />

      {/* === hero === */}
      <section className="kids-hero">
        <div className="kids-hero-kicker">For the young creative</div>
        <div className="kids-hero-subkicker">young readers · writers · poets · illustrators</div>
        <h1 className="kids-serif">
          Read. Write. <em>Think.</em>
        </h1>
        <div className="kids-hero-links">
          <button type="button" className="kids-hero-link" onClick={() => openWaitlist('BetweenReads Kids')}>
            Start.
          </button>
        </div>
        <p className="kids-hero-tagline kids-serif">The smart alternative to social media.</p>
      </section>

      {/* === kid quotes === */}
      <section className="kids-section" style={{ paddingBottom: 34 }}>
        <div className="kids-quote-row">
          {QUOTES.map((q) => (
            <figure
              key={q.by}
              className="kids-quote"
              style={{ ['--rot' as string]: q.rot, background: q.bg }}
            >
              <blockquote>{q.quote}</blockquote>
              <figcaption>{q.by}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* === age tiers === */}
      <section className="kids-section">
        <div className="kids-eyebrow">Grows with your child</div>
        <h2 className="kids-sec-title">Two simple age bands</h2>
        <p className="kids-lede">The same as our book categories — reading and writing scale up as kids grow.</p>
        <div className="kids-tiers">
          <div className="kids-tier t1">
            <div className="kids-age">Under 13</div>
            <h4 className="kids-serif">Early Readers</h4>
            <p>Early chapter stories, short stories, and age-appropriate fiction. Write your own stories and poems. A grown-up sets up and oversees the account.</p>
          </div>
          <div className="kids-tier t2">
            <div className="kids-age">Ages 13–17</div>
            <h4 className="kids-serif">Young Adults</h4>
            <p>Young Adult fiction and the wider catalogue. Write in any format, from flash fiction to novellas. Sign up with a parent's consent.</p>
          </div>
        </div>
      </section>

      {/* === story sparks === */}
      <section className="kids-prompts">
        <div className="kids-crayons">
          <svg viewBox="0 0 200 40" xmlns="http://www.w3.org/2000/svg" aria-label="crayons">
            <g stroke="#1a1a1a" strokeWidth="2" strokeLinejoin="round">
              <path d="M20 36 L20 14 L26 4 L32 14 L32 36 Z" fill="#e0571a" />
              <path d="M44 36 L44 14 L50 4 L56 14 L56 36 Z" fill="#FFE800" />
              <path d="M68 36 L68 14 L74 4 L80 14 L80 36 Z" fill="#1d9e75" />
              <path d="M92 36 L92 14 L98 4 L104 14 L104 36 Z" fill="#7c52c8" />
              <path d="M116 36 L116 14 L122 4 L128 14 L128 36 Z" fill="#2d6fb5" />
            </g>
          </svg>
        </div>
        <div className="kids-eyebrow">Story Sparks</div>
        <h2 className="kids-sec-title">A nudge when the page is blank</h2>
        <p className="kids-prompts-lede">
          A Story Spark is a friendly nudge — never a rule. Use it, ignore it, or write something completely your own. The idea is always yours.
        </p>
        <div className="kids-prompt-grid">
          <div className="kids-prompt-card"><span className="kids-q">“</span><span>A door appeared in your garden this morning. Where does it lead?</span></div>
          <div className="kids-prompt-card"><span className="kids-q">“</span><span>Write a story where the villain turns out to be right.</span></div>
          <div className="kids-prompt-card"><span className="kids-q">“</span><span>Write from the point of view of the last tree in a city.</span></div>
        </div>
        <div className="kids-prompt-foot">
          <span>New Story Sparks every day, matched to your age.</span>
          <span className="kids-prompt-badge">Earn a Spark Writer badge</span>
        </div>
      </section>

      {/* === emerging voices === */}
      <section className="kids-section" id="emerging">
        <div className="kids-eyebrow">A real library from day one</div>
        <h2 className="kids-sec-title">Emerging voices in children&apos;s fiction</h2>
        <p className="kids-lede">
          Alongside stories by other kids, young readers discover emerging children&apos;s authors — adult writers who write <em>for</em> children, screened and verified as age-appropriate before any child sees it.
        </p>
        <div className="kids-books">
          {EMERGING_BOOKS.map((book) => (
            <BookCard key={book.title} book={book} />
          ))}
        </div>
        <p className="kids-card-note">Every piece screened and verified as age-appropriate children&apos;s fiction · clearly labelled by author</p>
      </section>

      {/* === classics === */}
      <section className="kids-section">
        <div className="kids-eyebrow">Free, forever</div>
        <h2 className="kids-sec-title">Read the classics — free</h2>
        <p className="kids-lede">Treasured public-domain stories, hosted free from Project Gutenberg.</p>
        <div className="kids-books">
          {CLASSIC_BOOKS.map((book) => (
            <BookCard key={book.title} book={book} />
          ))}
        </div>
        <p className="kids-card-note">Public domain · Hosted free from Project Gutenberg</p>
      </section>

      {/* === safe === */}
      <section className="kids-section">
        <div className="kids-eyebrow">Safe by design</div>
        <h2 className="kids-sec-title">A safe space to read and write</h2>
        <p className="kids-lede">
          Made-up names, age-appropriate stories, and a safety check on everything — so kids can create freely and parents can relax.
        </p>
        <ul className="kids-safe-list">
          {SAFE_POINTS.map((p) => (
            <li key={p.lead}>
              <span className="kids-safe-check">✓</span>
              <span><b>{p.lead}</b> {p.rest}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* === pricing === */}
      <section className="kids-section">
        <div className="kids-eyebrow">Simple, fair pricing</div>
        <h2 className="kids-sec-title">Start free. Always.</h2>
        <p className="kids-lede">No child is ever locked out of reading and writing because of what their family can afford.</p>
        <div className="kids-price-grid">
          <div className="kids-price">
            <h4 className="kids-serif">Free</h4>
            <div className="kids-cost">$0</div>
            <div className="kids-per">Every child, forever</div>
            <ul>
              <li>100 ReadCredits to start</li>
              <li>3 reads every month</li>
              <li>Free classics</li>
              <li>Story Sparks</li>
              <li>Their own writing space</li>
            </ul>
            <button type="button" className="kids-pick ghost" onClick={() => openWaitlist('Kids · Free')}>Join free</button>
          </div>
          <div className="kids-price feat">
            <span className="kids-price-flag">Most loved</span>
            <h4 className="kids-serif">CreativeKids</h4>
            <div className="kids-cost">$69.99<small>/yr</small></div>
            <div className="kids-per">Per child</div>
            <ul>
              <li>Everything in Free</li>
              <li>Unlimited reading &amp; writing</li>
              <li>Publish stories, poems &amp; illustrations</li>
              <li>Reading &amp; writing badges</li>
              <li>BetweenLines Journal — Kids Edition</li>
              <li>Parental dashboard · No AI writing tools</li>
            </ul>
            <button type="button" className="kids-pick dark" onClick={() => openWaitlist('CreativeKids')}>Get CreativeKids</button>
          </div>
          <div className="kids-price">
            <h4 className="kids-serif">Family Plan</h4>
            <div className="kids-cost">$99.99<small>/yr</small></div>
            <div className="kids-per">Up to 3 children · 2 adults</div>
            <ul>
              <li>Everything in CreativeKids</li>
              <li>Up to 3 children</li>
              <li>2 adult accounts</li>
              <li>One shared family dashboard</li>
              <li>Best value per child</li>
            </ul>
            <button type="button" className="kids-pick ghost" onClick={() => openWaitlist('Kids · Family Plan')}>Choose Family</button>
          </div>
        </div>
        <div className="kids-access">
          <h4 className="kids-serif">Can&apos;t afford it? You still belong here.</h4>
          <p>Every child earns ReadCredits by reading, giving feedback, and joining in. Credits never expire. And libraries offer full CreativeKids access free with a library card.</p>
        </div>
      </section>

      {/* === final === */}
      <section className="kids-final">
        <h2 className="kids-serif">
          Your stories matter.
          <br />
          Other kids want to read them.
        </h2>
        <button type="button" className="kids-cta-dark" onClick={() => openWaitlist('BetweenReads Kids')}>
          Join BetweenReads Kids
        </button>
      </section>

      <Footer />

      <WaitlistOverlay open={waitlist.open} eyebrow={waitlist.eyebrow} onClose={closeWaitlist} />
    </main>
  );
}
