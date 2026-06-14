import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteNav } from '@/components/SiteNav';
import Footer from '../v8/sections/Footer';

export const metadata: Metadata = {
  title: 'About — BetweenReads',
  description:
    'BetweenReads is a premium reading platform built to reduce noise and elevate quality — curated stories, emerging writers, and real readers. Whether you publish or discover, there is a path built for you.',
};

const CSS = `
.bl-about-root {
  min-height: 100vh;
  background: var(--bl-surface);
  color: var(--bl-ink);
  font-family: var(--bl-font-display);
  --v6-ease: var(--bl-ease);
  --bl-footer-accent: var(--bl-accent);
}
.bl-about-shell {
  max-width: 1100px;
  margin: 0 auto;
  padding: clamp(40px, 6vw, 80px) clamp(20px, 5vw, 48px) clamp(64px, 8vw, 120px);
}

/* === Hero === */
.bl-about-hero {
  margin-bottom: clamp(40px, 5vw, 64px);
  max-width: 880px;
}
.bl-about-eyebrow {
  font-family: var(--bl-font-eyebrow);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--bl-accent-strong);
  margin: 0 0 16px;
  position: relative;
  display: inline-block;
  padding-bottom: 9px;
}
.bl-about-eyebrow::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  height: 3px;
  width: 56px;
  background: var(--bl-accent);
}
.bl-about-title {
  font-family: var(--bl-font-eyebrow);
  font-weight: 800;
  font-size: clamp(44px, 6vw, 84px);
  line-height: 1.02;
  letter-spacing: -0.03em;
  color: var(--bl-ink);
  margin: 0 0 24px;
  text-wrap: balance;
}
.bl-about-lede {
  font-family: var(--bl-font-body);
  font-size: clamp(18px, 1.5vw, 22px);
  line-height: 1.64;
  color: var(--bl-ink-soft);
  margin: 0;
  max-width: 62ch;
  text-wrap: pretty;
}

/* === Writer / reader split card === */
.bl-about-split {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(40px, 6vw, 80px);
  margin: 0 0 clamp(48px, 6vw, 80px);
  padding: clamp(36px, 4vw, 56px) clamp(28px, 4vw, 48px);
  background: var(--theme-surface);
  border: 1px solid var(--theme-border-subtle);
  border-radius: 20px;
  box-shadow: 0 1px 0 rgba(14,14,12,0.02), 0 24px 56px -32px rgba(14,14,12,0.20);
}
.bl-about-split::before {
  content: '';
  position: absolute;
  left: 50%;
  top: clamp(24px, 4vw, 44px);
  bottom: clamp(24px, 4vw, 44px);
  width: 1px;
  background: linear-gradient(to bottom, transparent, var(--bl-divider), transparent);
  pointer-events: none;
}
.bl-about-split-col {
  display: flex;
  flex-direction: column;
  gap: 14px;
  align-items: flex-start;
}
.bl-about-split-eyebrow {
  font-family: var(--bl-font-eyebrow);
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--bl-accent-strong);
  margin: 0;
}
.bl-about-split-headline {
  font-family: var(--bl-font-serif);
  font-weight: 500;
  font-size: clamp(28px, 2.9vw, 38px);
  line-height: 1.1;
  letter-spacing: -0.01em;
  color: var(--bl-ink);
  margin: 0;
  text-wrap: balance;
  font-feature-settings: "kern", "liga";
}
.bl-about-split-invitation {
  font-family: var(--bl-font-body);
  font-weight: 400;
  font-size: clamp(16px, 1.2vw, 18px);
  line-height: 1.6;
  color: var(--bl-ink-muted);
  margin: 0;
  max-width: 36ch;
  text-wrap: pretty;
}
.bl-about-split-cta {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  margin-top: 8px;
  padding: 12px 26px;
  border: none;
  border-radius: 999px;
  background: var(--bl-accent);
  color: var(--theme-on-yellow);
  font-family: var(--bl-font-eyebrow);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  text-decoration: none;
  cursor: pointer;
  transition: background 220ms cubic-bezier(.22,1,.36,1), transform 220ms cubic-bezier(.22,1,.36,1);
}
.bl-about-split-cta:hover,
.bl-about-split-cta:focus-visible {
  background: var(--theme-yellow-strong);
  transform: translateY(-1px);
  outline: none;
}
.bl-about-split-cta > span {
  transition: transform 240ms cubic-bezier(.22,1,.36,1);
}
.bl-about-split-cta:hover > span,
.bl-about-split-cta:focus-visible > span {
  transform: translateX(4px);
}

/* === Questions, answered === */
.bl-about-faq-head {
  margin-bottom: clamp(24px, 3vw, 36px);
}
.bl-about-faq-title {
  font-family: var(--bl-font-eyebrow);
  font-weight: 800;
  font-size: clamp(32px, 4vw, 52px);
  line-height: 1.04;
  letter-spacing: -0.025em;
  color: var(--bl-ink);
  margin: 0;
  text-wrap: balance;
}
.bl-about-faq-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.bl-about-faq-card {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 28px 30px 24px;
  background: var(--theme-surface);
  border: 1px solid var(--theme-border-subtle);
  border-radius: 16px;
  text-decoration: none;
  color: inherit;
  position: relative;
  transition:
    border-color 220ms cubic-bezier(.22, 1, .36, 1),
    box-shadow 220ms cubic-bezier(.22, 1, .36, 1),
    transform 220ms cubic-bezier(.22, 1, .36, 1);
}
.bl-about-faq-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 16px;
  border-top: 2px solid var(--bl-accent);
  opacity: 0;
  transition: opacity 220ms cubic-bezier(.22, 1, .36, 1);
  pointer-events: none;
}
.bl-about-faq-card:hover,
.bl-about-faq-card:focus-visible {
  border-color: var(--theme-border);
  box-shadow: 0 16px 36px rgb(var(--theme-shadow-rgb) / 0.16);
  transform: translateY(-2px);
  outline: none;
}
.bl-about-faq-card:hover::before,
.bl-about-faq-card:focus-visible::before { opacity: 1; }
.bl-about-faq-card-meta {
  font-family: var(--bl-font-eyebrow);
  font-weight: 700;
  font-size: 11px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--bl-accent-strong);
  font-variant-numeric: tabular-nums;
}
.bl-about-faq-card-title {
  font-family: var(--bl-font-display);
  font-weight: 700;
  font-size: clamp(22px, 2vw, 28px);
  line-height: 1.12;
  letter-spacing: -0.015em;
  color: var(--bl-ink);
  margin: 0;
  text-wrap: balance;
}
.bl-about-faq-card-blurb {
  font-family: var(--bl-font-body);
  font-size: 14.5px;
  line-height: 1.55;
  color: var(--bl-ink-muted);
  margin: 0;
  text-wrap: pretty;
}
.bl-about-faq-card-browse {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 6px;
  font-family: var(--bl-font-eyebrow);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--bl-ink);
}
.bl-about-faq-card-browse > span {
  transition: transform 240ms cubic-bezier(.22, 1, .36, 1);
}
.bl-about-faq-card:hover .bl-about-faq-card-browse,
.bl-about-faq-card:focus-visible .bl-about-faq-card-browse { color: var(--bl-accent-strong); }
.bl-about-faq-card:hover .bl-about-faq-card-browse > span,
.bl-about-faq-card:focus-visible .bl-about-faq-card-browse > span { transform: translateX(4px); }

.bl-about-faq-all {
  margin: clamp(28px, 4vw, 40px) 0 0;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--bl-font-eyebrow);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--bl-ink-muted);
  text-decoration: none;
  padding: 10px 0;
  position: relative;
}
.bl-about-faq-all::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 4px;
  height: 1px;
  background: var(--bl-accent);
  transform: scaleX(0.32);
  transform-origin: left;
  transition: transform 320ms cubic-bezier(.22, 1, .36, 1);
}
.bl-about-faq-all:hover,
.bl-about-faq-all:focus-visible { color: var(--bl-ink); outline: none; }
.bl-about-faq-all:hover::after,
.bl-about-faq-all:focus-visible::after { transform: scaleX(1); }
.bl-about-faq-all > span { transition: transform 240ms cubic-bezier(.22, 1, .36, 1); }
.bl-about-faq-all:hover > span,
.bl-about-faq-all:focus-visible > span { transform: translateX(4px); }

@media (max-width: 760px) {
  .bl-about-split { grid-template-columns: 1fr; gap: 40px; padding: 32px 24px; }
  .bl-about-split::before { display: none; }
  .bl-about-faq-grid { grid-template-columns: 1fr; }
}
`;

export default function AboutPage() {
  return (
    <div className="bl-about-root">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <SiteNav activeHref="/about" />

      <main className="bl-about-shell">
        <div className="bl-about-hero">
          <p className="bl-about-eyebrow">Writers &amp; readers</p>
          <h1 className="bl-about-title">About BetweenReads</h1>
          <p className="bl-about-lede">
            In a world built to distract, we&rsquo;re a premium reading platform designed to
            reduce noise and elevate quality. Imagine browsing an indie store: it&rsquo;s eclectic,
            random, and rewards the wandering reader. We curate outstanding stories and spotlight
            writers at every stage &mdash; from established authors to rising talent &mdash; helping
            readers discover work that deserves attention.
          </p>
        </div>

        <section className="bl-about-split" aria-label="What BetweenReads gives writers and readers">
          <div className="bl-about-split-col">
            <span className="bl-about-split-eyebrow">For writers</span>
            <h2 className="bl-about-split-headline">A place to show your work.</h2>
            <p className="bl-about-split-invitation">
              Reach readers who care &mdash; and beta readers before you publish.
            </p>
            <Link href="/?intake=writer" className="bl-about-split-cta">
              Submit a manuscript <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="bl-about-split-col">
            <span className="bl-about-split-eyebrow">For readers</span>
            <h2 className="bl-about-split-headline">Discover writers before the world does.</h2>
            <p className="bl-about-split-invitation">
              Read emerging authors first &mdash; and earn Early Discoverer credit when they
              break out.
            </p>
            <Link href="/?intake=reader" className="bl-about-split-cta">
              Open the shelf <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
