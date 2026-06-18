import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteNav } from '@/components/SiteNav';
import Footer from '../v8/sections/Footer';

export const metadata: Metadata = {
  title: 'Read - BetweenReads',
  description:
    'Discover curated fiction, poetry, illustrations, beta reads, reader clubs, Reading Credits, and reader pages on BetweenReads.',
};

type Feature = {
  index: string;
  title: string;
  blurb: string;
  highlights: string[];
  illustration: FeatureIllustration;
};

type FeatureIllustration =
  | 'curation'
  | 'credits'
  | 'feedback'
  | 'beta'
  | 'community'
  | 'shelves';

const FEATURES: Feature[] = [
  {
    index: '01',
    title: 'Find writing worth your quiet hour',
    blurb:
      'Browse curated fiction, poetry, and illustrations across formats - from microfiction and short stories to novels read chapter by chapter.',
    highlights: [
      'Reader Picks and BetweenReads team picks surface quality work',
      'Children, young adult, and adult shelves stay clearly separated',
      'Follow genres, writers, and formats that fit the way you read',
    ],
    illustration: 'curation',
  },
  {
    index: '02',
    title: 'Read free, then unlock more by participating',
    blurb:
      'Every reader gets free monthly reading, and Reading Credits give active readers a no-cash path to keep going.',
    highlights: [
      'Read 3 pieces per month free across the platform',
      'The first 3 pieces from any single writer are free',
      'Earn credits through feedback and spend them on more reading',
    ],
    illustration: 'credits',
  },
  {
    index: '03',
    title: 'Leave feedback writers can actually use',
    blurb:
      'A response can be as light as a reaction or as deep as a voice note. Your taste helps shape what rises.',
    highlights: [
      'React, rate, quick-comment, or leave Deep Thoughts',
      'Credits reward thoughtful participation without making it noisy',
      'Reader responses help writers improve before publication',
    ],
    illustration: 'feedback',
  },
  {
    index: '04',
    title: 'Become a beta reader and an early discoverer',
    blurb:
      'Opt in to read unpublished work, give structured feedback, and be credited when a writer you supported goes on to bigger stages.',
    highlights: [
      'Matched by genre, format, and feedback preferences',
      'Protected manuscripts with confidentiality commitments',
      'Early Discoverer credit cannot be bought - only earned',
    ],
    illustration: 'beta',
  },
  {
    index: '05',
    title: 'Read with clubs, pods, and the writers you follow',
    blurb:
      'BetweenReads is built for smaller rooms: reading clubs, Reader Pods, and writer updates without a public-feed frenzy.',
    highlights: [
      'Start or join book clubs around a work, genre, or author',
      'Writers can invite up to 6 readers into private Reader Pods',
      'Follow writers for new chapters, works, and milestones',
    ],
    illustration: 'community',
  },
  {
    index: '06',
    title: 'Build a reader page that remembers your taste',
    blurb:
      'Your reader page keeps shelves, reading lists, favorite writers, and discoveries in one place - free and yours to customize.',
    highlights: [
      'Show read and to-be-read shelves for published and emerging work',
      'List favorite authors from any platform, including newsletters',
      'Family profiles keep young readers in age-appropriate sections',
    ],
    illustration: 'shelves',
  },
];

const CSS = `
.br-readm-root {
  min-height: 100vh;
  background: var(--theme-page);
  color: var(--theme-text);
  font-family: var(--bl-font-display);
  --br-readm-ease: var(--bl-ease, cubic-bezier(.22, 1, .36, 1));
  --br-readm-ink: var(--theme-text);
  --br-readm-muted: var(--theme-text-muted);
  --br-readm-line: var(--theme-border-subtle, var(--theme-border));
  --br-readm-gold: color-mix(in srgb, var(--theme-yellow) 76%, #c6862f);
  --br-readm-sage: #dceee7;
  --br-readm-sky: #dce8f5;
  --br-readm-rose: #f1d8d0;
  --br-readm-lilac: #e8e1f1;
}

.br-readm-root a {
  color: inherit;
}

/* === Hero === */
.br-readm-hero {
  max-width: 1040px;
  margin: 0 auto;
  padding: clamp(56px, 8vw, 104px) clamp(20px, 5vw, 48px) clamp(40px, 6vw, 72px);
}
.br-readm-eyebrow {
  font-family: var(--bl-font-eyebrow);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--br-readm-muted);
  margin: 0 0 18px;
  display: inline-flex;
  align-items: center;
  gap: 14px;
}
.br-readm-eyebrow::before {
  content: '';
  width: 32px;
  height: 1px;
  background: currentColor;
  opacity: 0.6;
}
.br-readm-title {
  font-family: var(--bl-font-serif);
  font-weight: 500;
  font-size: var(--bl-hero-title-size);
  line-height: var(--bl-hero-title-line-height);
  letter-spacing: var(--bl-hero-title-letter-spacing);
  color: var(--br-readm-ink);
  margin: 0 0 24px;
  max-width: 100%;
  text-wrap: balance;
}
.br-readm-lede {
  font-family: var(--bl-font-body);
  font-size: var(--bl-hero-lede-size);
  line-height: var(--bl-hero-lede-line-height);
  color: var(--br-readm-muted);
  margin: 0;
  max-width: none;
  text-wrap: pretty;
}
.br-readm-actions {
  margin-top: clamp(28px, 4vw, 40px);
  display: inline-flex;
  flex-wrap: wrap;
  gap: 18px;
  align-items: center;
}
.br-readm-cta {
  font-family: var(--bl-font-display);
  font-size: clamp(15px, 1.3vw, 17px);
  font-weight: 800;
  letter-spacing: 0.2px;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  color: var(--theme-paper-bg, #f6f1e3);
  background: var(--theme-strong-cta-bg, var(--br-readm-ink));
  padding: 15px 30px;
  border-radius: 999px;
  text-decoration: none;
  box-shadow: 0 14px 34px -14px color-mix(in srgb, var(--br-readm-ink) 70%, transparent);
  transition:
    transform 220ms var(--br-readm-ease),
    background 220ms var(--br-readm-ease),
    box-shadow 220ms var(--br-readm-ease);
}
.br-readm-cta:hover,
.br-readm-cta:focus-visible {
  background: var(--theme-strong-cta-hover-bg, var(--theme-accent-strong, var(--br-readm-ink)));
  transform: translateY(-2px);
  box-shadow: 0 20px 42px -14px color-mix(in srgb, var(--br-readm-ink) 72%, transparent);
  outline: none;
}
.br-readm-cta-mark {
  font-size: 0.92em;
  transition: transform 220ms var(--br-readm-ease);
}
.br-readm-cta:hover .br-readm-cta-mark,
.br-readm-cta:focus-visible .br-readm-cta-mark {
  transform: translateX(4px);
}
.br-readm-ghost {
  font-family: var(--bl-font-eyebrow);
  font-weight: 600;
  font-size: 13px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--br-readm-ink);
  text-decoration: none;
  padding: 6px 2px;
  border-bottom: 1px solid currentColor;
  transition: color 180ms ease;
}
.br-readm-ghost:hover,
.br-readm-ghost:focus-visible {
  color: var(--theme-accent-strong, var(--theme-accent));
  outline: none;
}
.br-readm-proof {
  display: flex;
  flex-wrap: wrap;
  gap: clamp(14px, 2vw, 28px);
  margin-top: clamp(28px, 4vw, 40px);
}
.br-readm-proof-note {
  display: inline-flex;
  align-items: center;
  font-size: clamp(12px, 1.2vw, 13px);
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--br-readm-muted);
}
.br-readm-proof-note::before {
  content: '';
  width: 7px;
  height: 7px;
  border-radius: 50%;
  margin-right: 10px;
  background: var(--theme-accent-strong, var(--theme-accent));
}

/* === Features === */
.br-readm-features {
  max-width: 1040px;
  margin: 0 auto;
  padding: clamp(24px, 4vw, 48px) clamp(20px, 5vw, 48px) clamp(64px, 9vw, 112px);
}
.br-readm-features-head {
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-width: 640px;
  margin-bottom: clamp(32px, 4vw, 52px);
}
.br-readm-features-eyebrow {
  font-family: var(--bl-font-eyebrow);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--br-readm-muted);
  margin: 0;
}
.br-readm-features-title {
  font-family: var(--bl-font-serif);
  font-weight: 600;
  font-size: clamp(30px, 3.8vw, 48px);
  line-height: 1.06;
  letter-spacing: 0;
  color: var(--br-readm-ink);
  margin: 0;
  text-wrap: balance;
}
.br-readm-feature-list {
  display: flex;
  flex-direction: column;
  border-top: 1px solid var(--br-readm-line);
}
.br-readm-feature-row {
  --br-readm-wash: var(--br-readm-sage);
  --br-readm-wash-2: var(--br-readm-rose);
  --br-readm-pop: var(--theme-accent);
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(230px, 340px);
  gap: clamp(28px, 5vw, 72px);
  align-items: center;
  position: relative;
  padding: clamp(34px, 6vw, 66px) 0;
  border-bottom: 1px solid var(--br-readm-line);
}
.br-readm-feature-row:nth-child(2) {
  --br-readm-wash: var(--br-readm-sky);
  --br-readm-wash-2: #f5e2c6;
  --br-readm-pop: #d6a63f;
}
.br-readm-feature-row:nth-child(3) {
  --br-readm-wash: #e6ecd6;
  --br-readm-wash-2: var(--br-readm-lilac);
  --br-readm-pop: #e78663;
}
.br-readm-feature-row:nth-child(4) {
  --br-readm-wash: var(--br-readm-lilac);
  --br-readm-wash-2: #d8eef2;
  --br-readm-pop: #d6b23f;
}
.br-readm-feature-row:nth-child(5) {
  --br-readm-wash: #f2ded5;
  --br-readm-wash-2: var(--br-readm-sage);
  --br-readm-pop: var(--theme-accent);
}
.br-readm-feature-row:nth-child(6) {
  --br-readm-wash: #e7efe0;
  --br-readm-wash-2: var(--br-readm-sky);
  --br-readm-pop: #c78944;
}
.br-readm-feature-row::before {
  content: '';
  position: absolute;
  left: 0;
  top: -1px;
  width: 0;
  height: 1px;
  background: var(--br-readm-ink);
  transition: width 320ms var(--br-readm-ease);
  pointer-events: none;
}
.br-readm-feature-row:hover::before {
  width: 100%;
}
.br-readm-feature-copy {
  display: grid;
  grid-template-columns: 64px minmax(0, 1fr);
  gap: clamp(16px, 3vw, 32px);
  align-items: start;
}
.br-readm-feature-index {
  font-family: var(--bl-font-eyebrow);
  font-weight: 600;
  font-size: 13px;
  letter-spacing: 0.18em;
  line-height: 1;
  color: var(--theme-accent-strong, var(--theme-accent));
  font-variant-numeric: tabular-nums;
  text-transform: uppercase;
  padding-top: 8px;
}
.br-readm-feature-body {
  min-width: 0;
}
.br-readm-feature-title {
  font-family: var(--bl-font-serif);
  font-weight: 600;
  font-size: 32px;
  line-height: 1.08;
  letter-spacing: 0;
  color: var(--br-readm-ink);
  margin: 0;
  text-wrap: balance;
}
.br-readm-feature-blurb {
  font-family: var(--bl-font-body);
  font-size: 18px;
  line-height: 1.62;
  color: var(--theme-text);
  margin: 12px 0 0;
  max-width: none;
  text-wrap: pretty;
}
.br-readm-feature-points {
  list-style: none;
  margin: 18px 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.br-readm-feature-points li {
  position: relative;
  padding-left: 24px;
  font-family: var(--bl-font-body);
  font-size: 18px;
  line-height: 1.5;
  color: var(--theme-text);
  text-wrap: pretty;
}
.br-readm-feature-points li::before {
  content: '';
  position: absolute;
  left: 2px;
  top: 9px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--theme-accent);
}
.br-readm-feature-art {
  justify-self: end;
  width: min(100%, 340px);
  min-height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.br-readm-illo {
  width: 100%;
  max-width: 340px;
  height: auto;
  overflow: visible;
  color: var(--br-readm-ink);
}
.br-readm-illo .line,
.br-readm-illo .thin,
.br-readm-illo .pop-stroke,
.br-readm-illo .soft-stroke {
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.br-readm-illo .line {
  stroke: currentColor;
  stroke-width: 2.4;
}
.br-readm-illo .thin {
  stroke: color-mix(in srgb, var(--br-readm-ink) 48%, transparent);
  stroke-width: 1.6;
}
.br-readm-illo .paper {
  fill: color-mix(in srgb, var(--theme-surface) 92%, var(--theme-page));
  stroke: color-mix(in srgb, var(--br-readm-ink) 72%, transparent);
  stroke-width: 2;
}
.br-readm-illo .wash {
  fill: color-mix(in srgb, var(--br-readm-wash) 76%, var(--theme-page));
}
.br-readm-illo .wash-2 {
  fill: color-mix(in srgb, var(--br-readm-wash-2) 78%, var(--theme-page));
}
.br-readm-illo .pop {
  fill: color-mix(in srgb, var(--br-readm-pop) 88%, var(--theme-page));
}
.br-readm-illo .pop-stroke {
  stroke: color-mix(in srgb, var(--br-readm-pop) 92%, var(--br-readm-ink));
  stroke-width: 2.4;
}
.br-readm-illo .soft-stroke {
  stroke: color-mix(in srgb, var(--br-readm-ink) 28%, transparent);
  stroke-width: 1.4;
}

/* === Closing CTA band === */
.br-readm-band {
  background: var(--theme-hero, var(--theme-yellow));
  color: var(--theme-hero-text, var(--theme-on-yellow, var(--br-readm-ink)));
  padding: clamp(56px, 8vw, 96px) clamp(20px, 5vw, 48px);
}
.br-readm-band-inner {
  max-width: 760px;
  margin: 0 auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}
.br-readm-band-title {
  font-family: var(--bl-font-serif);
  font-weight: 500;
  font-size: clamp(30px, 4vw, 52px);
  line-height: 1.06;
  letter-spacing: 0;
  margin: 0;
  text-wrap: balance;
}
.br-readm-band-sub {
  font-family: var(--bl-font-body);
  font-size: clamp(16px, 1.4vw, 19px);
  line-height: 1.55;
  margin: 0;
  max-width: 48ch;
  color: color-mix(in srgb, var(--theme-hero-text, var(--br-readm-ink)) 78%, transparent);
  text-wrap: pretty;
}

@media (max-width: 760px) {
  .br-readm-feature-row {
    grid-template-columns: 1fr;
    gap: 22px;
    padding: 34px 0;
  }
  .br-readm-feature-copy {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  .br-readm-feature-index {
    padding-top: 0;
  }
  .br-readm-feature-title {
    font-size: 25px;
  }
  .br-readm-feature-art {
    justify-self: start;
    width: min(100%, 288px);
    min-height: 0;
  }
  .br-readm-illo {
    max-width: 288px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .br-readm-root *,
  .br-readm-root *::before {
    transition-duration: 0.01ms !important;
  }
}
`;

function ReaderFeatureIllustration({ kind }: { kind: FeatureIllustration }) {
  if (kind === 'curation') {
    return (
      <svg
        className="br-readm-illo br-readm-illo-curation"
        viewBox="0 0 320 220"
        aria-hidden="true"
        focusable="false"
      >
        <ellipse className="wash" cx="160" cy="184" rx="110" ry="20" />
        <path className="paper" d="M68 68h42v96H68z" />
        <path className="paper" d="M118 50h52v114h-52z" />
        <path className="paper" d="M180 76h42v88h-42z" />
        <path className="thin" d="M84 92h10M84 116h10M84 140h10M136 78h18M136 102h18M136 126h18M196 102h10M196 126h10" />
        <path className="pop" d="M250 75l8 17 18 3-13 13 3 18-16-8-16 8 3-18-13-13 18-3z" />
        <path className="line" d="M55 164h185" />
        <path className="pop-stroke" d="M116 40c22-14 47-14 70 0" />
      </svg>
    );
  }

  if (kind === 'credits') {
    return (
      <svg
        className="br-readm-illo br-readm-illo-credits"
        viewBox="0 0 320 220"
        aria-hidden="true"
        focusable="false"
      >
        <ellipse className="wash-2" cx="160" cy="184" rx="106" ry="20" />
        <path className="paper" d="M80 58h110v122H80z" />
        <path className="thin" d="M104 91h64M104 116h50M104 141h66" />
        <circle className="pop" cx="226" cy="84" r="24" />
        <circle className="wash" cx="246" cy="130" r="28" />
        <circle className="paper" cx="230" cy="132" r="32" />
        <path className="line" d="M214 132h32M230 116v32M214 84h24M226 72v24" />
        <path className="pop-stroke" d="M83 181c18-18 36-18 54 0s36 18 54 0 36-18 54 0" />
      </svg>
    );
  }

  if (kind === 'feedback') {
    return (
      <svg
        className="br-readm-illo br-readm-illo-feedback"
        viewBox="0 0 320 220"
        aria-hidden="true"
        focusable="false"
      >
        <ellipse className="wash" cx="160" cy="184" rx="108" ry="20" />
        <path className="paper" d="M74 62h132c15 0 27 12 27 27v54c0 15-12 27-27 27h-42l-35 25v-25H74c-15 0-27-12-27-27V89c0-15 12-27 27-27z" />
        <path className="thin" d="M82 96h92M82 120h66M82 144h102" />
        <path className="pop" d="M236 60l7 14 16 2-12 11 3 16-14-7-14 7 3-16-12-11 16-2z" />
        <path className="line" d="M244 128c10-15 32-9 32 9 0 20-32 34-32 34s-32-14-32-34c0-18 22-24 32-9z" />
      </svg>
    );
  }

  if (kind === 'beta') {
    return (
      <svg
        className="br-readm-illo br-readm-illo-beta"
        viewBox="0 0 320 220"
        aria-hidden="true"
        focusable="false"
      >
        <ellipse className="wash-2" cx="160" cy="184" rx="110" ry="20" />
        <path className="paper" d="M77 58h106v126H77z" />
        <path className="thin" d="M99 88h62M99 112h44M99 136h66M99 160h50" />
        <path className="line" d="M214 61l54 17v42c0 37-25 63-54 76-29-13-54-39-54-76V78z" />
        <path className="wash" d="M214 82l32 10v26c0 21-14 37-32 47-18-10-32-26-32-47V92z" />
        <path className="pop-stroke" d="M199 123l12 12 26-34" />
        <path className="pop" d="M64 171l7 13 15 2-11 11 3 15-14-7-13 7 2-15-11-11 15-2z" />
      </svg>
    );
  }

  if (kind === 'community') {
    return (
      <svg
        className="br-readm-illo br-readm-illo-community"
        viewBox="0 0 320 220"
        aria-hidden="true"
        focusable="false"
      >
        <ellipse className="wash" cx="160" cy="184" rx="110" ry="20" />
        <path className="thin" d="M96 92l64 38 66-42M96 150l64-20 66 24" />
        <circle className="paper" cx="92" cy="88" r="32" />
        <circle className="paper" cx="228" cy="84" r="32" />
        <circle className="paper" cx="160" cy="132" r="38" />
        <path className="line" d="M78 91c6 12 22 12 28 0M215 87c6 12 22 12 28 0M143 136c8 14 26 14 34 0" />
        <circle className="pop" cx="92" cy="74" r="5" />
        <circle className="pop" cx="228" cy="70" r="5" />
        <circle className="pop" cx="160" cy="116" r="6" />
        <path className="pop-stroke" d="M56 181c12-21 58-21 72 0M195 181c14-23 61-23 75 0" />
      </svg>
    );
  }

  return (
    <svg
      className="br-readm-illo br-readm-illo-shelves"
      viewBox="0 0 320 220"
      aria-hidden="true"
      focusable="false"
    >
      <ellipse className="wash-2" cx="160" cy="184" rx="110" ry="20" />
      <rect className="paper" x="73" y="45" width="174" height="136" rx="18" />
      <circle className="wash" cx="122" cy="91" r="28" />
      <path className="line" d="M105 116c9-18 25-18 34 0" />
      <path className="thin" d="M167 76h48M167 98h58M94 142h132M94 162h94" />
      <path className="pop" d="M229 130h28v45h-28z" />
      <path className="line" d="M229 130h28v45h-28M236 145h14M236 160h14" />
      <path className="pop-stroke" d="M88 193h148" />
    </svg>
  );
}

export default function ReadPage() {
  return (
    <div className="br-readm-root">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <SiteNav activeHref="/read" />

      <section className="br-readm-hero" aria-label="Read on BetweenReads">
        <p className="br-readm-eyebrow">For readers</p>
        <h1 className="br-readm-title">Read first. Shape what lasts.</h1>
        <p className="br-readm-lede">
          BetweenReads is built for readers who want discovery without noise: curated writing,
          generous free reading, credits for thoughtful feedback, beta-reading recognition, clubs,
          pods, and a reader page that keeps your taste in one place.
        </p>
        <div className="br-readm-actions">
          <Link href="/start?mode=reader" className="br-readm-cta">
            Become a founding reader
            <span className="br-readm-cta-mark" aria-hidden="true">-&gt;</span>
          </Link>
          <Link href="/faq#readers" className="br-readm-ghost">
            Read the FAQ
          </Link>
        </div>
        <div className="br-readm-proof" aria-label="Reader commitments">
          <span className="br-readm-proof-note">Free to join</span>
          <span className="br-readm-proof-note">Always ad-free</span>
          <span className="br-readm-proof-note">Credits never expire</span>
        </div>
      </section>

      <section className="br-readm-features" aria-label="Reader features">
        <div className="br-readm-features-head">
          <p className="br-readm-features-eyebrow">Six ways to read here</p>
          <h2 className="br-readm-features-title">What readers can do.</h2>
        </div>
        <div className="br-readm-feature-list">
          {FEATURES.map((feature) => (
            <article key={feature.index} className="br-readm-feature-row">
              <div className="br-readm-feature-copy">
                <span className="br-readm-feature-index">{feature.index}</span>
                <div className="br-readm-feature-body">
                  <h3 className="br-readm-feature-title">{feature.title}</h3>
                  <p className="br-readm-feature-blurb">{feature.blurb}</p>
                  <ul className="br-readm-feature-points">
                    {feature.highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="br-readm-feature-art">
                <ReaderFeatureIllustration kind={feature.illustration} />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="br-readm-band" aria-label="Start reading">
        <div className="br-readm-band-inner">
          <h2 className="br-readm-band-title">Your next favorite writer may not be famous yet.</h2>
          <p className="br-readm-band-sub">
            Join early, read carefully, and help a better kind of reading community take shape.
          </p>
          <Link href="/start?mode=reader" className="br-readm-cta">
            Join as a reader
            <span className="br-readm-cta-mark" aria-hidden="true">-&gt;</span>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
