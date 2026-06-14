import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteNav } from '@/components/SiteNav';
import { FAQ, type FaqQuestion } from '@/lib/faq';
import Footer from '../v8/sections/Footer';

export const metadata: Metadata = {
  title: 'About — BetweenReads',
  description:
    'Answers on reading, writing, beta reads, credits, copyright, AI policy, and platform standards.',
};

const CSS = `
.bl-faq-root {
  min-height: 100vh;
  background: var(--bl-surface);
  color: var(--bl-ink);
  font-family: var(--bl-font-display);
  --v6-ease: var(--bl-ease);
  --bl-footer-accent: var(--bl-accent);
}
.bl-faq-shell {
  max-width: 1100px;
  margin: 0 auto;
  padding: clamp(40px, 6vw, 80px) clamp(20px, 5vw, 48px) clamp(64px, 8vw, 120px);
}
.bl-faq-hero {
  margin-bottom: clamp(40px, 5vw, 64px);
  max-width: 860px;
}
.bl-faq-hero-eyebrow {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--bl-accent);
  margin: 0 0 14px;
}
.bl-faq-hero-title {
  font-family: var(--bl-font-eyebrow);
  font-weight: 800;
  font-size: var(--bl-hero-title-size);
  letter-spacing: var(--bl-hero-title-letter-spacing);
  line-height: var(--bl-hero-title-line-height);
  color: var(--bl-ink);
  margin: 0 0 24px;
}
.bl-faq-hero-lede {
  font-family: var(--bl-font-body);
  font-size: var(--bl-hero-lede-size);
  line-height: var(--bl-hero-lede-line-height);
  color: var(--bl-ink-soft);
  margin: 0;
  max-width: 60ch;
  text-wrap: pretty;
}
.bl-faq-questions-head {
  margin-bottom: clamp(40px, 5vw, 64px);
}

.bl-faq-layout {
  display: grid;
  grid-template-columns: 240px minmax(0, 1fr);
  gap: clamp(32px, 5vw, 72px);
  align-items: start;
}
.bl-faq-side {
  position: sticky;
  top: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-left: 1px solid rgba(14,14,12,0.1);
  padding-left: 18px;
  width: 100%;
  min-width: 0;
}
.bl-faq-side-label {
  font-family: var(--bl-font-eyebrow);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--bl-ink-muted);
  margin: 0 0 6px;
}
.bl-faq-side a {
  font-family: var(--bl-font-eyebrow);
  font-size: 15px;
  font-weight: 500;
  color: var(--bl-ink);
  text-decoration: none;
  padding: 6px 0;
  display: flex;
  align-items: baseline;
  gap: 10px;
  transition: color 180ms ease;
}
.bl-faq-side a:hover { color: var(--bl-accent); }
.bl-faq-side-num {
  font-variant-numeric: tabular-nums;
  font-size: 12px;
  color: var(--bl-ink-muted);
  letter-spacing: 0.1em;
}

.bl-faq-main {
  display: flex;
  flex-direction: column;
  gap: clamp(48px, 6vw, 72px);
}
.bl-faq-section {
  scroll-margin-top: 32px;
}
.bl-faq-section-head {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(14,14,12,0.1);
}
.bl-faq-section-eyebrow {
  font-family: var(--bl-font-eyebrow);
  font-weight: 600;
  font-size: 12px;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--bl-accent);
  margin: 0 0 10px;
  font-variant-numeric: tabular-nums;
}
.bl-faq-section-title {
  font-family: var(--bl-font-display);
  font-weight: 600;
  font-size: clamp(36px, 4.4vw, 52px);
  letter-spacing: -0.02em;
  line-height: 1.05;
  color: var(--bl-ink);
  margin: 0;
  font-kerning: normal;
  text-rendering: optimizeLegibility;
  font-feature-settings: "kern", "liga", "calt", "dlig";
}

.bl-faq-items {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
}
.bl-faq-item {
  border-bottom: 1px solid rgba(14,14,12,0.08);
}
.bl-faq-item[open] {
  background: rgba(233, 75, 54, 0.025);
}
.bl-faq-q {
  list-style: none;
  cursor: pointer;
  padding: 20px 4px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  font-family: var(--bl-font-eyebrow);
  font-weight: 600;
  font-size: clamp(17px, 1.35vw, 20px);
  line-height: 1.45;
  color: var(--bl-ink);
  transition: color 180ms ease;
}
.bl-faq-q::-webkit-details-marker { display: none; }
.bl-faq-q:hover { color: var(--bl-accent); }
.bl-faq-q-icon {
  flex: 0 0 auto;
  width: 18px;
  height: 18px;
  position: relative;
  margin-top: 4px;
}
.bl-faq-q-icon::before,
.bl-faq-q-icon::after {
  content: '';
  position: absolute;
  background: currentColor;
  transition: transform 220ms cubic-bezier(.22, 1, .36, 1), opacity 220ms ease;
}
.bl-faq-q-icon::before {
  top: 50%;
  left: 0;
  right: 0;
  height: 1.5px;
  transform: translateY(-50%);
}
.bl-faq-q-icon::after {
  left: 50%;
  top: 0;
  bottom: 0;
  width: 1.5px;
  transform: translateX(-50%);
}
.bl-faq-item[open] .bl-faq-q-icon::after {
  opacity: 0;
  transform: translateX(-50%) rotate(90deg);
}
.bl-faq-a {
  padding: 6px 28px 24px 4px;
  font-family: var(--bl-font-body);
  font-size: 17px;
  line-height: 1.65;
  color: var(--bl-ink-soft);
}
.bl-faq-a p { margin: 0 0 12px; text-wrap: pretty; }
.bl-faq-a p:last-child { margin-bottom: 0; }
.bl-faq-a ul {
  margin: 0 0 12px 18px;
  padding: 0;
}
.bl-faq-a li { margin: 4px 0; }
.bl-faq-table-wrap {
  margin: 4px 0 12px;
  overflow-x: auto;
}
.bl-faq-table {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--bl-font-body);
  font-size: 15px;
  min-width: 360px;
}
.bl-faq-table th,
.bl-faq-table td {
  text-align: left;
  padding: 11px 14px;
  border-bottom: 1px solid rgba(14,14,12,0.08);
  vertical-align: top;
}
.bl-faq-table thead th {
  font-family: var(--bl-font-eyebrow);
  font-weight: 600;
  font-size: 12px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--bl-ink-muted);
  background: rgba(14,14,12,0.03);
  border-bottom: 1px solid rgba(14,14,12,0.15);
}
.bl-faq-table tbody tr:last-child td { border-bottom: 0; }

/* Hero CTA row */
.bl-faq-hero-actions {
  margin-top: clamp(20px, 3vw, 32px);
  display: inline-flex;
  flex-wrap: wrap;
  gap: 14px;
  align-items: center;
}
.bl-faq-cta-primary {
  font-family: var(--bl-font-eyebrow);
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.06em;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: var(--bl-ink);
  color: var(--bl-surface);
  padding: 13px 24px;
  border-radius: 999px;
  text-decoration: none;
  transition: transform 220ms cubic-bezier(.22, 1, .36, 1), background 180ms ease;
}
.bl-faq-cta-primary:hover { transform: translateY(-1px); background: var(--bl-accent); }
.bl-faq-cta-ghost {
  font-family: var(--bl-font-eyebrow);
  font-weight: 600;
  font-size: 13px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--bl-ink);
  text-decoration: none;
  padding: 6px 2px;
  border-bottom: 1px solid currentColor;
  transition: color 180ms ease;
}
.bl-faq-cta-ghost:hover { color: var(--bl-accent); }

/* Writer/Reader value split — mirrors home-page FaqTeaser */
.bl-faq-split {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(40px, 6vw, 80px);
  margin: clamp(40px, 5vw, 64px) 0 clamp(40px, 5vw, 64px);
  padding: clamp(36px, 4vw, 56px) clamp(28px, 4vw, 48px);
  background: var(--bl-surface);
  border: 1px solid rgba(14,14,12,0.08);
  border-radius: 18px;
  box-shadow: 0 1px 0 rgba(14,14,12,0.02), 0 20px 50px -28px rgba(14,14,12,0.18);
}
.bl-faq-split::before {
  content: '';
  position: absolute;
  left: 50%;
  top: clamp(20px, 4vw, 40px);
  bottom: clamp(20px, 4vw, 40px);
  width: 1px;
  background: linear-gradient(to bottom, transparent, var(--bl-divider), transparent);
  pointer-events: none;
}
.bl-faq-split-col {
  display: flex;
  flex-direction: column;
  gap: 14px;
  align-items: flex-start;
}
.bl-faq-split-eyebrow {
  font-family: var(--bl-font-eyebrow);
  font-weight: 600;
  font-size: 12px;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--bl-accent);
  margin: 0;
}
.bl-faq-split-headline {
  font-family: 'Fraunces', 'Cormorant Garamond', Georgia, serif;
  font-weight: 500;
  font-variation-settings: 'opsz' 144, 'SOFT' 40;
  font-size: clamp(24px, 2.6vw, 34px);
  line-height: 1.12;
  letter-spacing: -0.01em;
  color: var(--bl-ink);
  margin: 0;
  text-wrap: balance;
}
.bl-faq-split-invitation {
  font-family: var(--bl-font-body);
  font-weight: 400;
  font-size: clamp(15px, 1.1vw, 17px);
  line-height: 1.55;
  color: var(--bl-ink-muted);
  margin: 0;
  max-width: 34ch;
  text-wrap: pretty;
}
.bl-faq-split-cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
  padding: 11px 24px;
  border: none;
  border-radius: 999px;
  background: var(--bl-accent);
  color: #fff;
  font-family: var(--bl-font-eyebrow);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  text-decoration: none;
  cursor: pointer;
  transition: background 220ms cubic-bezier(.22,1,.36,1), transform 220ms cubic-bezier(.22,1,.36,1);
}
.bl-faq-split-cta:hover,
.bl-faq-split-cta:focus-visible {
  background: var(--bl-accent-strong);
  transform: translateY(-1px);
  outline: none;
}
.bl-faq-split-cta > span {
  transition: transform 240ms cubic-bezier(.22,1,.36,1);
}
.bl-faq-split-cta:hover > span,
.bl-faq-split-cta:focus-visible > span {
  transform: translateX(4px);
}
@media (max-width: 760px) {
  .bl-faq-split { grid-template-columns: 1fr; gap: 40px; padding: 32px 24px; }
  .bl-faq-split::before { display: none; }
}

/* Split promo card: 3 free reads + Volume audio */
.bl-faq-promo-card {
  margin-top: clamp(64px, 9vw, 112px);
  padding: clamp(36px, 5vw, 56px) clamp(28px, 5vw, 56px);
  background: var(--bl-paper-ink);
  color: #F4EFE3;
  border-radius: 18px;
  display: grid;
  grid-template-columns: 1fr 1px 1fr;
  gap: clamp(28px, 4vw, 56px);
  align-items: stretch;
  position: relative;
  overflow: hidden;
}
.bl-faq-promo-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
  opacity: 0.06;
  mix-blend-mode: overlay;
  pointer-events: none;
}
.bl-faq-promo-panel {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: clamp(14px, 1.6vw, 20px);
  min-width: 0;
}
.bl-faq-promo-divider {
  background: rgba(244, 239, 227, 0.16);
  width: 1px;
  align-self: stretch;
}
.bl-faq-promo-eyebrow {
  font-family: var(--bl-font-eyebrow);
  font-weight: 700;
  font-size: 11px;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: #E9B547;
  margin: 0;
  display: inline-flex;
  align-items: center;
  gap: 14px;
}
.bl-faq-promo-eyebrow::before {
  content: '';
  display: inline-block;
  width: 28px;
  height: 1px;
  background: currentColor;
  opacity: 0.55;
}
.bl-faq-promo-title {
  font-family: var(--bl-font-display);
  font-weight: 500;
  font-size: clamp(28px, 3.2vw, 40px);
  line-height: 1.05;
  letter-spacing: -0.02em;
  color: #F4EFE3;
  margin: 0;
  text-wrap: balance;
  font-feature-settings: "kern", "liga", "calt";
}
.bl-faq-promo-title em {
  font-family: 'Fraunces', 'Cormorant Garamond', Georgia, serif;
  font-style: italic;
  font-weight: 500;
  color: #E9B547;
}
.bl-faq-promo-volume {
  display: block;
  font-family: 'Fraunces', 'Cormorant Garamond', Georgia, serif;
  font-style: italic;
  font-weight: 500;
  font-variation-settings: 'opsz' 144, 'SOFT' 60;
  font-size: clamp(44px, 5.4vw, 70px);
  line-height: 0.95;
  letter-spacing: -0.025em;
  color: #F4EFE3;
}
.bl-faq-promo-volume-sub {
  display: block;
  margin-top: 6px;
  font-family: var(--bl-font-display);
  font-weight: 500;
  font-size: clamp(20px, 2.1vw, 27px);
  line-height: 1.15;
  letter-spacing: -0.015em;
  color: #F4EFE3;
}
.bl-faq-promo-volume-sub em {
  font-family: 'Fraunces', 'Cormorant Garamond', Georgia, serif;
  font-style: italic;
  font-weight: 500;
  color: #E9B547;
}
.bl-faq-promo-body {
  font-family: var(--bl-font-body);
  font-size: 15.5px;
  line-height: 1.6;
  color: rgba(244, 239, 227, 0.74);
  margin: 0;
  max-width: 44ch;
  text-wrap: pretty;
}
.bl-faq-promo-covers {
  display: flex;
  gap: 12px;
  margin: 4px 0 2px;
  align-items: flex-end;
}
.bl-faq-promo-cover {
  flex: 0 0 auto;
  width: clamp(64px, 7vw, 88px);
  aspect-ratio: 2 / 3;
  border-radius: 3px;
  padding: 8px 8px 7px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.32);
  font-family: 'Fraunces', 'Cormorant Garamond', Georgia, serif;
  transition: transform 240ms cubic-bezier(.22, 1, .36, 1);
}
.bl-faq-promo-cover:hover { transform: translateY(-2px) rotate(0deg) !important; }
.bl-faq-promo-cover-publisher {
  font-family: var(--bl-font-eyebrow);
  font-size: 7px;
  font-weight: 600;
  letter-spacing: 0.22em;
  opacity: 0.85;
  text-transform: uppercase;
}
.bl-faq-promo-cover-title {
  font-size: clamp(12px, 1.1vw, 15px);
  font-weight: 500;
  line-height: 1.05;
  letter-spacing: -0.01em;
}
.bl-faq-promo-cover-title em { font-style: italic; font-weight: 500; }
.bl-faq-promo-cover-foot { display: flex; flex-direction: column; gap: 3px; }
.bl-faq-promo-cover-rule { height: 1px; background: currentColor; opacity: 0.55; }
.bl-faq-promo-cover-author {
  font-family: var(--bl-font-eyebrow);
  font-size: 7px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}
.bl-faq-promo-audio {
  position: relative;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 4px 0;
  margin: 2px 0;
}
.bl-faq-promo-wave {
  flex: 1;
  height: 44px;
  fill: rgba(244, 239, 227, 0.32);
  display: block;
}
.bl-faq-promo-play {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 999px;
  background: #E9B547;
  color: var(--bl-paper-ink);
  flex: 0 0 auto;
  box-shadow: 0 8px 22px rgba(233, 181, 71, 0.28);
}
.bl-faq-promo-cta {
  margin-top: auto;
  align-self: flex-start;
  font-family: var(--bl-font-eyebrow);
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.06em;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  background: #F4EFE3;
  color: var(--bl-paper-ink);
  padding: 14px 26px;
  border-radius: 999px;
  text-decoration: none;
  transition: transform 220ms cubic-bezier(.22, 1, .36, 1), background 180ms ease, color 180ms ease;
}
.bl-faq-promo-cta:hover {
  transform: translateY(-1px);
  background: #E9B547;
  color: var(--bl-paper-ink);
}
.bl-faq-promo-cta-ghost {
  background: transparent;
  color: rgba(244, 239, 227, 0.92);
  border: 1px solid rgba(244, 239, 227, 0.45);
}
.bl-faq-promo-cta-ghost:hover {
  background: transparent;
  color: #E9B547;
  border-color: #E9B547;
}
.bl-faq-promo-cta-arrow {
  display: inline-block;
  transition: transform 220ms cubic-bezier(.22, 1, .36, 1);
}
.bl-faq-promo-cta:hover .bl-faq-promo-cta-arrow { transform: translateX(3px); }

@media (max-width: 820px) {
  .bl-faq-promo-card {
    grid-template-columns: 1fr;
    gap: clamp(32px, 5vw, 48px);
  }
  .bl-faq-promo-divider {
    width: auto;
    height: 1px;
  }
}

/* Bottom CTA card */
.bl-faq-cta-card {
  margin-top: clamp(40px, 5vw, 64px);
  padding: clamp(36px, 5vw, 56px) clamp(28px, 5vw, 56px);
  background: var(--bl-paper-ink);
  color: #F4EFE3;
  border-radius: 18px;
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: clamp(24px, 4vw, 56px);
  align-items: center;
  position: relative;
  overflow: hidden;
}
.bl-faq-cta-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
  opacity: 0.06;
  mix-blend-mode: overlay;
  pointer-events: none;
}
.bl-faq-cta-card-eyebrow {
  font-family: var(--bl-font-eyebrow);
  font-weight: 700;
  font-size: 11px;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: #E9B547;
  margin: 0 0 14px;
}
.bl-faq-cta-card-title {
  font-family: var(--bl-font-display);
  font-weight: 500;
  font-size: clamp(28px, 3.4vw, 44px);
  line-height: 1.05;
  letter-spacing: -0.015em;
  margin: 0 0 14px;
  max-width: 18ch;
  text-wrap: balance;
}
.bl-faq-cta-card-title em { font-style: italic; color: #E9B547; }
.bl-faq-cta-card-body {
  font-family: var(--bl-font-body);
  font-size: 16px;
  line-height: 1.6;
  color: rgba(244, 239, 227, 0.78);
  margin: 0;
  max-width: 48ch;
  text-wrap: pretty;
}
.bl-faq-cta-card-actions {
  display: flex;
  flex-direction: column;
  gap: 14px;
  align-items: stretch;
}
.bl-faq-cta-card-primary {
  font-family: var(--bl-font-eyebrow);
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.06em;
  background: #F4EFE3;
  color: var(--bl-ink);
  padding: 16px 26px;
  border-radius: 999px;
  text-decoration: none;
  text-align: center;
  transition: transform 220ms cubic-bezier(.22, 1, .36, 1), background 180ms ease;
}
.bl-faq-cta-card-primary:hover {
  transform: translateY(-1px);
  background: #E9B547;
  color: var(--bl-paper-ink);
}
.bl-faq-cta-card-ghost {
  font-family: var(--bl-font-eyebrow);
  font-weight: 600;
  font-size: 13px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(244, 239, 227, 0.78);
  text-decoration: none;
  padding: 6px 4px;
  border-bottom: 1px solid currentColor;
  text-align: center;
  transition: color 200ms ease;
}
.bl-faq-cta-card-ghost:hover { color: #E9B547; }

.bl-faq-foot {
  margin-top: clamp(40px, 5vw, 56px);
  padding-top: 28px;
  border-top: 1px solid rgba(14,14,12,0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  font-family: var(--bl-font-eyebrow);
  font-size: 13px;
  color: var(--bl-ink-muted);
}
.bl-faq-foot a {
  color: var(--bl-ink);
  text-decoration: none;
  transition: color 180ms ease;
}
.bl-faq-foot a:hover { color: var(--bl-accent); }

@media (max-width: 820px) {
  .bl-faq-cta-card { grid-template-columns: 1fr; gap: 24px; }
}

@media (max-width: 820px) {
  .bl-faq-layout { grid-template-columns: 1fr; }
  .bl-faq-side {
    position: static;
    flex-direction: row;
    flex-wrap: wrap;
    border-left: 0;
    border-top: 1px solid rgba(14,14,12,0.1);
    border-bottom: 1px solid rgba(14,14,12,0.1);
    padding: 16px 0;
    gap: 14px 20px;
  }
  .bl-faq-side-label { width: 100%; margin: 0; }
  .bl-faq-side a { padding: 0; }
}
`;

function slugifyQ(q: string): string {
  return q
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 64);
}

function AnswerBody({ a, table }: { a: string; table?: FaqQuestion['table'] }) {
  // Render paragraphs and bullet groups from the plain-text answer; tables go last.
  const blocks = a.trim() ? a.trim().split(/\n\n+/) : [];
  return (
    <div className="bl-faq-a">
      {blocks.map((block, idx) => {
        const lines = block.split('\n');
        const isBulleted = lines.length > 1 && lines.every((l) => l.startsWith('- '));
        if (isBulleted) {
          return (
            <ul key={idx}>
              {lines.map((l, j) => (
                <li key={j}>{l.replace(/^- /, '')}</li>
              ))}
            </ul>
          );
        }
        return <p key={idx}>{block}</p>;
      })}
      {table && (
        <div className="bl-faq-table-wrap">
          <table className="bl-faq-table">
            <thead>
              <tr>
                {table.headers.map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function FaqPage() {
  return (
    <div className="bl-faq-root">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <SiteNav />

      <main className="bl-faq-shell">
        <div className="bl-faq-hero">
          <p className="bl-faq-hero-eyebrow">Writers &amp; readers</p>
          <h1 className="bl-faq-hero-title">About BetweenReads</h1>
          <p className="bl-faq-hero-lede">
            In a world built to distract, we&rsquo;re a premium reading platform designed to
            reduce noise and elevate quality. Imagine browsing an indie store: it&rsquo;s eclectic,
            random, and rewards the wandering reader. We curate outstanding stories and spotlight
            writers at every stage &mdash; from established authors to rising talent &mdash; helping
            readers discover work that deserves attention.
          </p>
        </div>

        <section className="bl-faq-split" aria-label="What BetweenReads gives writers and readers">
          <div className="bl-faq-split-col">
            <span className="bl-faq-split-eyebrow">For writers</span>
            <h2 className="bl-faq-split-headline">
              A place to show your work.
            </h2>
            <p className="bl-faq-split-invitation">
              Reach readers who care &mdash; and beta readers before you publish.
            </p>
            <Link href="/?intake=writer" className="bl-faq-split-cta">
              Submit a manuscript <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="bl-faq-split-col">
            <span className="bl-faq-split-eyebrow">For readers</span>
            <h2 className="bl-faq-split-headline">
              Discover writers before the world does.
            </h2>
            <p className="bl-faq-split-invitation">
              Read emerging authors first &mdash; and earn Early Discoverer credit when they
              break out.
            </p>
            <Link href="/?intake=reader" className="bl-faq-split-cta">
              Open the shelf <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        <div className="bl-faq-questions-head">
          <p className="bl-faq-hero-eyebrow">Help</p>
          <h2 className="bl-faq-hero-title">Frequently asked questions.</h2>
          <p className="bl-faq-hero-lede bl-faq-questions-lede">
            Answers on what BetweenReads is, how reading and writing work on the platform, beta
            reading, credits, copyright, manuscript protection, and our position on AI. Click any
            question to expand.
          </p>
        </div>

        <div className="bl-faq-layout">
          <aside className="bl-faq-side" aria-label="Sections">
            <p className="bl-faq-side-label">Sections</p>
            {FAQ.map((cat, i) => (
              <a key={cat.slug} href={`#${cat.slug}`}>
                <span className="bl-faq-side-num">{String(i + 1).padStart(2, '0')}</span>
                <span>{cat.title}</span>
              </a>
            ))}
          </aside>

          <div className="bl-faq-main">
            {FAQ.map((cat, i) => (
              <section key={cat.slug} id={cat.slug} className="bl-faq-section">
                <div className="bl-faq-section-head">
                  <p className="bl-faq-section-eyebrow">Section {String(i + 1).padStart(2, '0')}</p>
                  <h2 className="bl-faq-section-title">{cat.title}</h2>
                </div>
                <ul className="bl-faq-items">
                  {cat.questions.map((item) => (
                    <li key={item.q} id={slugifyQ(item.q)}>
                      <details className="bl-faq-item">
                        <summary className="bl-faq-q">
                          <span>{item.q}</span>
                          <span className="bl-faq-q-icon" aria-hidden="true" />
                        </summary>
                        <AnswerBody a={item.a} table={item.table} />
                      </details>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>

        <section className="bl-faq-promo-card" aria-label="Free reads and Volume audio">
          <article className="bl-faq-promo-panel" aria-labelledby="bl-faq-promo-reader-title">
            <p className="bl-faq-promo-eyebrow">Free on signup</p>
            <h2 className="bl-faq-promo-title" id="bl-faq-promo-reader-title">
              Three originals, <em>on the house.</em>
            </h2>
            <div className="bl-faq-promo-covers" aria-hidden="true">
              <div
                className="bl-faq-promo-cover"
                style={{ background: '#1F7A3E', color: '#F3EFE6', transform: 'rotate(-3deg)' }}
              >
                <div className="bl-faq-promo-cover-publisher">BETWEENREADS</div>
                <div className="bl-faq-promo-cover-title">
                  <em>Hollow</em> Latitude
                </div>
                <div className="bl-faq-promo-cover-foot">
                  <div className="bl-faq-promo-cover-rule" />
                  <div className="bl-faq-promo-cover-author">M. OSEI</div>
                </div>
              </div>
              <div
                className="bl-faq-promo-cover"
                style={{ background: '#F3EFE6', color: '#0e0e0c', transform: 'rotate(0.5deg)' }}
              >
                <div className="bl-faq-promo-cover-publisher">BETWEENREADS</div>
                <div className="bl-faq-promo-cover-title">
                  Ash &amp; <em>Anise</em>
                </div>
                <div className="bl-faq-promo-cover-foot">
                  <div className="bl-faq-promo-cover-rule" />
                  <div className="bl-faq-promo-cover-author">P. NAIR</div>
                </div>
              </div>
              <div
                className="bl-faq-promo-cover"
                style={{ background: '#1F3A8A', color: '#F3EFE6', transform: 'rotate(2.5deg)' }}
              >
                <div className="bl-faq-promo-cover-publisher">BETWEENREADS</div>
                <div className="bl-faq-promo-cover-title">
                  The <em>Undertow</em> Hours
                </div>
                <div className="bl-faq-promo-cover-foot">
                  <div className="bl-faq-promo-cover-rule" />
                  <div className="bl-faq-promo-cover-author">J.T. CALLOWAY</div>
                </div>
              </div>
            </div>
            <p className="bl-faq-promo-body">
              Pick three when you join &mdash; hand-selected debut fiction, yours to
              keep. No trial, no card.
            </p>
            <Link href="/?intake=reader" className="bl-faq-promo-cta">
              Claim 3 free
              <span className="bl-faq-promo-cta-arrow" aria-hidden="true">→</span>
            </Link>
          </article>

          <div className="bl-faq-promo-divider" aria-hidden="true" />

          <article className="bl-faq-promo-panel" aria-labelledby="bl-faq-promo-volume-title">
            <p className="bl-faq-promo-eyebrow">Introducing</p>
            <h2 className="bl-faq-promo-title" id="bl-faq-promo-volume-title">
              <span className="bl-faq-promo-volume">Volume.</span>
              <span className="bl-faq-promo-volume-sub">
                Audiobooks, voiced by <em>writers.</em>
              </span>
            </h2>
            <div className="bl-faq-promo-audio" aria-hidden="true">
              <svg
                className="bl-faq-promo-wave"
                viewBox="0 0 320 56"
                preserveAspectRatio="none"
                role="presentation"
              >
                {Array.from({ length: 48 }).map((_, i) => {
                  const t = i / 47;
                  const base = Math.sin(t * Math.PI * 3.2) * 0.45 + 0.55;
                  const jitter = Math.sin(i * 7.13) * 0.18;
                  const h = Math.max(0.08, Math.min(1, base + jitter));
                  const height = 4 + h * 44;
                  return (
                    <rect
                      key={i}
                      x={i * 6.4 + 1}
                      y={(56 - height) / 2}
                      width="3"
                      height={height}
                      rx="1.5"
                    />
                  );
                })}
              </svg>
              <span className="bl-faq-promo-play">
                <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                  <path d="M8 5.5v13l11-6.5L8 5.5z" fill="currentColor" />
                </svg>
              </span>
            </div>
            <p className="bl-faq-promo-body">
              Narrate your work. Or choose a human narrator. Early access now forming.
            </p>
            <Link href="/?intake=writer" className="bl-faq-promo-cta bl-faq-promo-cta-ghost">
              Sign up for early access
              <span className="bl-faq-promo-cta-arrow" aria-hidden="true">→</span>
            </Link>
          </article>
        </section>

        <section className="bl-faq-cta-card" aria-label="Get started">
          <div>
            <p className="bl-faq-cta-card-eyebrow">Ready when you are</p>
            <h2 className="bl-faq-cta-card-title">
              Read writers worth reading, or <em>get yours read.</em>
            </h2>
            <p className="bl-faq-cta-card-body">
              Join the waitlist to be in the first cohort, or submit your work to between.lines &mdash;
              we&rsquo;re looking for strong, serious writers and we are author-friendly.
            </p>
          </div>
          <div className="bl-faq-cta-card-actions">
            <Link href="/" className="bl-faq-cta-card-primary">
              Join the waitlist →
            </Link>
            <Link href="/about" className="bl-faq-cta-card-ghost">
              Read more about BetweenReads
            </Link>
          </div>
        </section>

        <div className="bl-faq-foot">
          <span>Didn’t find your answer? <Link href="/">Join the waitlist →</Link></span>
          <a href="#top">Back to top ↑</a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
