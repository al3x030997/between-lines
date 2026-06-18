import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteNav } from '@/components/SiteNav';
import Footer from '../v8/sections/Footer';

export const metadata: Metadata = {
  title: 'Create — BetweenReads',
  description:
    'Publish your work and build an audience, find beta readers, turn your manuscript into audio, submit to the between·lines journal, and earn — all on a platform built around what writers actually need.',
};

type Feature = {
  index: string;
  title: string;
  blurb: string;
  highlights: string[];
  illustration: FeatureIllustration;
};

type FeatureIllustration = 'publish' | 'beta' | 'audio' | 'journal' | 'monetization';

const FEATURES: Feature[] = [
  {
    index: '01',
    title: 'Publish your work & build an audience',
    blurb:
      'Writing is free. Upload work in any genre or format — from microstories to novels — and build the catalogue readers will discover as we open up.',
    highlights: [
      'Visible to readers once you upload 5,000 words',
      'A generated, customisable author page for your whole catalogue',
      'Build agent-ready bios and highlight your best work for agents',
    ],
    illustration: 'publish',
  },
  {
    index: '02',
    title: 'Find beta readers',
    blurb:
      'SecureBetaReads is built to pair you with real human beta readers — not bots — and to protect your manuscript while they read.',
    highlights: [
      'Matched by genre and format preferences',
      'Structured feedback, from emoji reactions to deep thoughts',
      'First three chapters read free; no copy-paste, no AI training',
    ],
    illustration: 'beta',
  },
  {
    index: '03',
    title: 'Your path to audio',
    blurb:
      'Volume turns your manuscript into an audiobook. Narrate it in your own voice, or choose a human narrator.',
    highlights: [
      'Author services to produce your audio',
      'Voiced by writers — or a narrator you pick',
      'Early access now forming',
    ],
    illustration: 'audio',
  },
  {
    index: '04',
    title: 'Submit to the between·lines journal',
    blurb:
      'Each month the between·lines journal curates the finest writing on the platform — a wholesome literary magazine for a quiet hour and a good cup of coffee.',
    highlights: [
      'Submit your work for a small $2 entry fee',
      'Chosen on quality and editorial fit, not platform metrics',
      'Readers can recommend your work for free',
    ],
    illustration: 'journal',
  },
  {
    index: '05',
    title: 'Monetization paths',
    blurb:
      'Optional ways to earn from your writing — you retain full copyright, always.',
    highlights: [
      'Storefront — list your book and keep 80% of every sale',
      'Journal — featured writers share new-subscription revenue',
      'Tips from readers, plus a 10% referral fee',
    ],
    illustration: 'monetization',
  },
];

const CSS = `
.br-create-root {
  min-height: 100vh;
  background: var(--theme-page);
  color: var(--theme-text);
  font-family: var(--bl-font-display);
  --br-create-ease: var(--bl-ease, cubic-bezier(.22, 1, .36, 1));
}

/* === Hero === */
.br-create-hero {
  max-width: 1040px;
  margin: 0 auto;
  padding: clamp(56px, 8vw, 104px) clamp(20px, 5vw, 48px) clamp(40px, 6vw, 72px);
  text-align: center;
}
.br-create-title {
  font-family: var(--br-font-display);
  font-weight: 900;
  font-size: clamp(34px, 5.6vw, 56px);
  line-height: 1.02;
  letter-spacing: -0.03em;
  color: var(--theme-text);
  margin: 0 0 24px;
  max-width: 100%;
  text-wrap: balance;
}
.br-create-title em {
  font-style: normal;
}
.br-create-lede {
  font-family: var(--bl-font-body);
  font-size: var(--bl-hero-lede-size);
  line-height: var(--bl-hero-lede-line-height);
  color: var(--theme-text-muted);
  margin: 0 auto;
  max-width: 60ch;
  text-wrap: pretty;
}
.br-create-actions {
  margin-top: clamp(28px, 4vw, 40px);
  display: inline-flex;
  flex-wrap: wrap;
  gap: 18px;
  align-items: center;
}
.br-create-cta {
  font-family: var(--bl-font-display);
  font-size: clamp(15px, 1.3vw, 17px);
  font-weight: 800;
  letter-spacing: 0.2px;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  color: var(--theme-strong-cta-fg, #f6f1e3);
  background: var(--theme-strong-cta-bg, var(--theme-text));
  padding: 15px 30px;
  border-radius: 999px;
  text-decoration: none;
  box-shadow: 0 14px 34px -14px color-mix(in srgb, var(--theme-text) 70%, transparent);
  transition: transform 220ms var(--br-create-ease), background 220ms var(--br-create-ease),
    box-shadow 220ms var(--br-create-ease);
}
.br-create-cta:hover,
.br-create-cta:focus-visible {
  background: var(--theme-strong-cta-hover-bg, var(--theme-accent-strong, var(--theme-text)));
  transform: translateY(-2px);
  box-shadow: 0 20px 42px -14px color-mix(in srgb, var(--theme-text) 72%, transparent);
  outline: none;
}
.br-create-cta-arrow {
  font-size: 0.92em;
  transition: transform 220ms var(--br-create-ease);
}
.br-create-cta:hover .br-create-cta-arrow,
.br-create-cta:focus-visible .br-create-cta-arrow {
  transform: translateX(4px);
}
.br-create-ghost {
  font-family: var(--bl-font-eyebrow);
  font-weight: 600;
  font-size: 13px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--theme-text);
  text-decoration: none;
  padding: 6px 2px;
  border-bottom: 1px solid currentColor;
  transition: color 180ms ease;
}
.br-create-ghost:hover { color: var(--theme-accent-strong, var(--theme-accent)); }
.br-create-proof {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: clamp(14px, 2vw, 28px);
  margin-top: clamp(28px, 4vw, 40px);
}
.br-create-proof-note {
  display: inline-flex;
  align-items: center;
  font-size: clamp(12px, 1.2vw, 13px);
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--theme-text-muted);
}
.br-create-proof-note::before {
  content: "✓";
  margin-right: 9px;
  font-weight: 900;
  color: var(--theme-accent-strong, var(--theme-accent));
}

/* === Features === */
.br-create-features {
  max-width: 1120px;
  margin: 0 auto;
  padding: clamp(24px, 4vw, 48px) clamp(20px, 5vw, 48px) clamp(64px, 9vw, 112px);
}
.br-create-features-head {
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-width: 640px;
  margin-bottom: clamp(32px, 4vw, 52px);
}
.br-create-features-eyebrow {
  font-family: var(--bl-font-eyebrow);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--theme-text-muted);
  margin: 0;
}
.br-create-features-title {
  font-family: var(--bl-font-serif);
  font-weight: 600;
  font-size: clamp(30px, 3.8vw, 48px);
  line-height: 1.06;
  letter-spacing: -0.02em;
  color: var(--theme-text);
  margin: 0;
  text-wrap: balance;
}
.br-create-feature-list {
  display: flex;
  flex-direction: column;
  border-top: 1px solid var(--theme-border-subtle, var(--theme-border));
}
.br-create-feature-row {
  --br-illo-wash: #dceee7;
  --br-illo-wash-2: #f7e2cf;
  --br-illo-pop: var(--theme-accent);
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(230px, 340px);
  gap: clamp(28px, 5vw, 72px);
  align-items: center;
  position: relative;
  padding: clamp(34px, 6vw, 66px) 0;
  border-bottom: 1px solid var(--theme-border-subtle, var(--theme-border));
}
.br-create-feature-row:nth-child(2) {
  --br-illo-wash: #dce8f5;
  --br-illo-wash-2: #d9efe7;
  --br-illo-pop: #e9c34a;
}
.br-create-feature-row:nth-child(3) {
  --br-illo-wash: #e8e1f1;
  --br-illo-wash-2: #d8eef2;
  --br-illo-pop: #efc36a;
}
.br-create-feature-row:nth-child(4) {
  --br-illo-wash: #e6ecd6;
  --br-illo-wash-2: #f2ded5;
  --br-illo-pop: var(--theme-accent);
}
.br-create-feature-row:nth-child(5) {
  --br-illo-wash: #f5e1d2;
  --br-illo-wash-2: #dce8f5;
  --br-illo-pop: #d6b23f;
}
.br-create-feature-row::before {
  content: '';
  position: absolute;
  left: 0;
  top: -1px;
  width: 0;
  height: 1px;
  background: var(--theme-text);
  transition: width 320ms var(--br-create-ease);
  pointer-events: none;
}
.br-create-feature-row:hover::before {
  width: 100%;
}
.br-create-feature-copy {
  display: grid;
  grid-template-columns: 64px minmax(0, 660px);
  gap: clamp(16px, 3vw, 32px);
  align-items: start;
}
.br-create-feature-index {
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
.br-create-feature-body {
  min-width: 0;
}
.br-create-feature-title {
  font-family: var(--bl-font-serif);
  font-weight: 600;
  font-size: 32px;
  line-height: 1.08;
  letter-spacing: 0;
  color: var(--theme-text);
  margin: 0;
  text-wrap: balance;
}
.br-create-feature-blurb {
  font-family: var(--bl-font-body);
  font-size: 20px;
  line-height: 1.6;
  color: var(--theme-text-muted);
  margin: 12px 0 0;
  max-width: 58ch;
  text-wrap: pretty;
}
.br-create-feature-points {
  list-style: none;
  margin: 18px 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.br-create-feature-points li {
  position: relative;
  padding-left: 24px;
  font-family: var(--bl-font-body);
  font-size: 19px;
  line-height: 1.5;
  color: var(--theme-text-muted);
  text-wrap: pretty;
}
.br-create-feature-points li::before {
  content: '';
  position: absolute;
  left: 2px;
  top: 9px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--theme-accent);
}
.br-create-feature-art {
  justify-self: end;
  width: min(100%, 340px);
  min-height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.br-create-illo {
  width: 100%;
  max-width: 340px;
  height: auto;
  overflow: visible;
  color: var(--theme-text);
}
.br-create-illo .line,
.br-create-illo .thin,
.br-create-illo .pop-stroke,
.br-create-illo .soft-stroke {
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
}
.br-create-illo .line {
  stroke: currentColor;
  stroke-width: 2.4;
}
.br-create-illo .thin {
  stroke: color-mix(in srgb, var(--theme-text) 48%, transparent);
  stroke-width: 1.6;
}
.br-create-illo .paper {
  fill: color-mix(in srgb, var(--theme-surface) 92%, var(--theme-page));
  stroke: color-mix(in srgb, var(--theme-text) 72%, transparent);
  stroke-width: 2;
}
.br-create-illo .wash {
  fill: color-mix(in srgb, var(--br-illo-wash) 76%, var(--theme-page));
}
.br-create-illo .wash-2 {
  fill: color-mix(in srgb, var(--br-illo-wash-2) 78%, var(--theme-page));
}
.br-create-illo .pop {
  fill: color-mix(in srgb, var(--br-illo-pop) 88%, var(--theme-page));
}
.br-create-illo .pop-stroke {
  stroke: color-mix(in srgb, var(--br-illo-pop) 92%, var(--theme-text));
  stroke-width: 2.4;
}
.br-create-illo .soft-stroke {
  stroke: color-mix(in srgb, var(--theme-text) 28%, transparent);
  stroke-width: 1.4;
}

/* === Closing CTA band === */
.br-create-band {
  position: relative;
  overflow: hidden;
  background: #161410;
  color: #f6f1e3;
  padding: clamp(56px, 8vw, 96px) clamp(20px, 5vw, 48px);
}
/* Warm radial glow at the top, matching the main-page closing CTA. */
.br-create-band::after {
  content: '';
  position: absolute;
  left: 50%;
  top: -40%;
  width: min(680px, 90%);
  height: 80%;
  transform: translateX(-50%);
  background: radial-gradient(ellipse at center, color-mix(in srgb, var(--theme-accent) 18%, transparent), transparent 70%);
  pointer-events: none;
}
.br-create-band-inner {
  position: relative;
  z-index: 1;
  max-width: 760px;
  margin: 0 auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}
.br-create-band .br-create-cta {
  background: var(--theme-accent);
  color: #161410;
  border: 1px solid var(--theme-accent);
  box-shadow: 0 8px 22px color-mix(in srgb, var(--theme-accent) 30%, transparent);
}
.br-create-band .br-create-cta:hover,
.br-create-band .br-create-cta:focus-visible {
  background: var(--theme-accent-strong);
  box-shadow: 0 14px 30px color-mix(in srgb, var(--theme-accent) 42%, transparent);
}
.br-create-band-title {
  font-family: var(--bl-font-serif);
  font-weight: 500;
  font-size: clamp(30px, 4vw, 52px);
  line-height: 1.06;
  letter-spacing: -0.02em;
  margin: 0;
  text-wrap: balance;
}
.br-create-band-sub {
  font-family: var(--bl-font-body);
  font-size: clamp(16px, 1.4vw, 19px);
  line-height: 1.55;
  margin: 0;
  max-width: 48ch;
  color: color-mix(in srgb, #f6f1e3 76%, transparent);
  text-wrap: pretty;
}

@media (max-width: 760px) {
  .br-create-feature-row {
    grid-template-columns: 1fr;
    gap: 22px;
    padding: 34px 0;
  }
  .br-create-feature-copy {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  .br-create-feature-index {
    padding-top: 0;
  }
  .br-create-feature-title {
    font-size: 25px;
  }
  .br-create-feature-art {
    justify-self: start;
    width: min(100%, 288px);
    min-height: 0;
  }
  .br-create-illo {
    max-width: 288px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .br-create-root *,
  .br-create-root *::before {
    transition-duration: 0.01ms !important;
  }
}
`;

function CreatorFeatureIllustration({ kind }: { kind: FeatureIllustration }) {
  if (kind === 'publish') {
    return (
      <svg
        className="br-create-illo br-create-illo-publish"
        viewBox="0 0 320 220"
        aria-hidden="true"
        focusable="false"
      >
        <ellipse className="wash" cx="160" cy="184" rx="108" ry="20" />
        <path className="paper" d="M86 42h106l34 34v94H86z" />
        <path className="soft-stroke" d="M192 43v34h34" />
        <path className="thin" d="M108 94h80M108 116h92M108 138h60" />
        <path className="line" d="M209 147l39-39 17 17-39 39-27 9z" />
        <path className="pop-stroke" d="M245 111l17 17" />
        <circle className="pop" cx="63" cy="154" r="8" />
        <circle className="wash-2" cx="48" cy="178" r="10" />
        <circle className="wash-2" cx="78" cy="178" r="10" />
        <path className="thin" d="M39 198c8-16 39-16 48 0M27 198c6-11 22-11 28-1M75 197c6-10 23-10 29 1" />
      </svg>
    );
  }

  if (kind === 'beta') {
    return (
      <svg
        className="br-create-illo br-create-illo-beta"
        viewBox="0 0 320 220"
        aria-hidden="true"
        focusable="false"
      >
        <ellipse className="wash-2" cx="160" cy="184" rx="106" ry="20" />
        <path className="thin" d="M76 84l51 32M76 139l51-19M233 116l-72 2" />
        <circle className="wash" cx="72" cy="80" r="20" />
        <circle className="wash" cx="64" cy="144" r="20" />
        <circle className="pop" cx="238" cy="116" r="22" />
        <path className="paper" d="M116 50h106v126H116z" />
        <path className="thin" d="M137 82h62M137 104h42M137 126h68M137 148h54" />
        <path className="line" d="M221 76l38 12v29c0 27-18 45-38 55-20-10-38-28-38-55V88z" />
        <path className="pop-stroke" d="M208 122l10 10 21-28" />
      </svg>
    );
  }

  if (kind === 'audio') {
    return (
      <svg
        className="br-create-illo br-create-illo-audio"
        viewBox="0 0 320 220"
        aria-hidden="true"
        focusable="false"
      >
        <ellipse className="wash" cx="162" cy="184" rx="110" ry="20" />
        <path className="paper" d="M76 64h70c16 0 28 12 28 28v66H76z" />
        <path className="thin" d="M98 94h50M98 116h42M98 138h54" />
        <rect className="wash-2" x="201" y="54" width="44" height="88" rx="22" />
        <rect className="line" x="209" y="43" width="56" height="106" rx="28" />
        <path className="line" d="M237 149v28M215 177h44M192 115c0 25 20 45 45 45s45-20 45-45" />
        <path className="pop-stroke" d="M84 180c10-29 24-29 34 0s24 29 34 0 24-29 34 0" />
        <path className="thin" d="M91 164c9-17 21-17 30 0s21 17 30 0 21-17 30 0" />
      </svg>
    );
  }

  if (kind === 'journal') {
    return (
      <svg
        className="br-create-illo br-create-illo-journal"
        viewBox="0 0 320 220"
        aria-hidden="true"
        focusable="false"
      >
        <ellipse className="wash-2" cx="160" cy="184" rx="110" ry="20" />
        <path className="paper" d="M58 62c35-14 69-12 102 6v104c-33-18-67-20-102-6z" />
        <path className="paper" d="M160 68c33-18 67-20 102-6v104c-35-14-69-12-102 6z" />
        <path className="soft-stroke" d="M160 68v104" />
        <path className="thin" d="M82 96c18-5 35-4 52 2M82 118c18-5 35-4 52 2M186 94c18-7 35-8 52-4M186 118c18-7 35-8 52-4" />
        <path className="pop" d="M111 137l8 16 18 3-13 13 3 18-16-8-16 8 3-18-13-13 18-3z" />
        <path className="line" d="M226 160h43v15c0 13-10 23-23 23s-23-10-23-23v-15z" />
        <path className="thin" d="M269 166h10c0 13-7 22-20 22M232 147c-8-9 8-13 0-22M252 147c-8-9 8-13 0-22" />
      </svg>
    );
  }

  return (
    <svg
      className="br-create-illo br-create-illo-monetization"
      viewBox="0 0 320 220"
      aria-hidden="true"
      focusable="false"
    >
      <ellipse className="wash" cx="160" cy="184" rx="110" ry="20" />
      <path className="paper" d="M72 82h138v88H72z" />
      <path className="pop" d="M61 56h160l-13 36H74z" />
      <path className="line" d="M61 56h160l-13 36H74zM88 92v78M194 92v78M72 170h138" />
      <path className="thin" d="M95 119h90M95 142h90" />
      <circle className="wash-2" cx="243" cy="78" r="20" />
      <circle className="pop" cx="267" cy="124" r="18" />
      <circle className="wash-2" cx="237" cy="164" r="16" />
      <path className="line" d="M210 124h39M228 89c-8 17-4 29 12 36M226 156c-5-16 0-27 16-32" />
      <path className="pop-stroke" d="M259 124h17M267 116v16" />
    </svg>
  );
}

export default function CreatePage() {
  return (
    <div className="br-create-root">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <SiteNav activeHref="/write" />

      <section className="br-create-hero" aria-label="Create on BetweenReads">
        <h1 className="br-create-title">
          Create, share, learn and grow.
        </h1>
        <p className="br-create-lede">
          BetweenReads is being built around what writers actually need: honest feedback and a clear
          path toward publication. Publish for free, line up beta readers, turn your manuscript into
          audio, and reach the journal — while keeping your copyright. Join early and grow with us.
        </p>
        <div className="br-create-actions">
          <Link href="/start?mode=writer" className="br-create-cta">
            Join free
            <span className="br-create-cta-arrow" aria-hidden="true">→</span>
          </Link>
          <Link href="/faq" className="br-create-ghost">
            Read the FAQ
          </Link>
        </div>
        <div className="br-create-proof" aria-label="Platform commitments">
          <span className="br-create-proof-note">Always ad-free</span>
          <span className="br-create-proof-note">You keep your copyright</span>
        </div>
      </section>

      <section className="br-create-features" aria-label="Creator features">
        <div className="br-create-features-head">
          <p className="br-create-features-eyebrow">Five ways to build your career</p>
          <h2 className="br-create-features-title">What you can do here.</h2>
        </div>
        <div className="br-create-feature-list">
          {FEATURES.map((feature) => (
            <article key={feature.index} className="br-create-feature-row">
              <div className="br-create-feature-copy">
                <span className="br-create-feature-index">{feature.index}</span>
                <div className="br-create-feature-body">
                  <h3 className="br-create-feature-title">{feature.title}</h3>
                  <p className="br-create-feature-blurb">{feature.blurb}</p>
                  <ul className="br-create-feature-points">
                    {feature.highlights.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="br-create-feature-art">
                <CreatorFeatureIllustration kind={feature.illustration} />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="br-create-band" aria-label="Start creating">
        <div className="br-create-band-inner">
          <h2 className="br-create-band-title">Get in at the start.</h2>
          <p className="br-create-band-sub">
            Join free, set up your author page, and be ready the moment readers arrive — it&rsquo;s
            free to write, and your work is yours.
          </p>
          <Link href="/start?mode=writer" className="br-create-cta">
            Join free
            <span className="br-create-cta-arrow" aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
