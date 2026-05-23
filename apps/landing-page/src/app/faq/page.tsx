import type { Metadata } from 'next';
import Link from 'next/link';
import { FAQ, type FaqQuestion } from '@/lib/faq';
import Footer from '../v8/sections/Footer';

export const metadata: Metadata = {
  title: 'FAQ — Between Lines',
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
.bl-faq-top {
  border-bottom: 1px solid rgba(14,14,12,0.08);
  background: var(--bl-surface);
}
.bl-faq-top-inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 18px clamp(20px, 5vw, 48px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.bl-faq-top-brand {
  display: inline-flex;
  align-items: baseline;
  color: var(--bl-ink);
  text-decoration: none;
  font-family: var(--bl-font-eyebrow);
  font-weight: 700;
  font-size: 18px;
  letter-spacing: -0.02em;
}
.bl-faq-top-dot {
  color: var(--bl-accent);
  padding: 0 4px;
  font-weight: 800;
  transform: translateY(-1px);
}
.bl-faq-top-back {
  font-family: var(--bl-font-eyebrow);
  font-size: 13px;
  font-weight: 500;
  color: var(--bl-ink-muted);
  text-decoration: none;
  transition: color 180ms ease;
}
.bl-faq-top-back:hover { color: var(--bl-accent); }
.bl-faq-shell {
  max-width: 1100px;
  margin: 0 auto;
  padding: clamp(40px, 6vw, 80px) clamp(20px, 5vw, 48px) clamp(64px, 8vw, 120px);
}
.bl-faq-hero {
  margin-bottom: clamp(40px, 5vw, 64px);
  max-width: 760px;
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
  font-size: clamp(44px, 6vw, 68px);
  letter-spacing: -0.03em;
  line-height: 1.05;
  color: var(--bl-ink);
  margin: 0 0 16px;
}
.bl-faq-hero-lede {
  font-family: var(--bl-font-body);
  font-size: clamp(17px, 1.25vw, 20px);
  line-height: 1.65;
  color: var(--bl-ink-muted);
  margin: 0;
  max-width: 56ch;
  text-wrap: pretty;
}

.bl-faq-layout {
  display: grid;
  grid-template-columns: 240px 1fr;
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

/* AgentReady spotlight in the side nav */
.bl-faq-spotlight {
  margin-top: 28px;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 18px 18px 16px;
  background: #fbf6e8;
  border: 1px solid rgba(197, 40, 61, 0.18);
  border-radius: 10px;
  color: var(--bl-ink);
  text-decoration: none;
  overflow: hidden;
  transition: border-color 220ms ease, transform 220ms cubic-bezier(.22, 1, .36, 1), box-shadow 220ms ease;
}
.bl-faq-spotlight::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--bl-accent);
  opacity: 0.85;
}
.bl-faq-spotlight:hover {
  border-color: rgba(197, 40, 61, 0.42);
  transform: translateY(-1px);
  box-shadow: 0 14px 30px rgba(14, 14, 12, 0.08);
}
.bl-faq-spotlight-tag {
  font-family: var(--bl-font-eyebrow);
  font-weight: 700;
  font-size: 10px;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: var(--bl-accent);
}
.bl-faq-spotlight-title {
  font-family: var(--bl-font-display);
  font-weight: 600;
  font-size: 21px;
  line-height: 1.15;
  letter-spacing: -0.01em;
  color: var(--bl-ink);
  margin: 0;
}
.bl-faq-spotlight-title em { font-style: italic; color: var(--bl-accent); }
.bl-faq-spotlight-body {
  font-family: var(--bl-font-body);
  font-size: 13px;
  line-height: 1.5;
  color: var(--bl-paper-ink-muted);
  margin: 0;
}
.bl-faq-spotlight-link {
  font-family: var(--bl-font-eyebrow);
  font-weight: 600;
  font-size: 11px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--bl-ink);
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 4px;
  transition: color 200ms ease, gap 200ms cubic-bezier(.22, 1, .36, 1);
}
.bl-faq-spotlight:hover .bl-faq-spotlight-link {
  color: var(--bl-accent);
  gap: 10px;
}

/* Bottom CTA card */
.bl-faq-cta-card {
  margin-top: clamp(64px, 9vw, 112px);
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
  .bl-faq-spotlight { margin-top: 12px; }
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

      <header id="top" className="bl-faq-top">
        <div className="bl-faq-top-inner">
          <Link href="/" className="bl-faq-top-brand" aria-label="BetweenReads, home">
            <span>between</span>
            <span className="bl-faq-top-dot">.</span>
            <span>reads</span>
          </Link>
          <Link href="/" className="bl-faq-top-back">
            ← Back to home
          </Link>
        </div>
      </header>

      <main className="bl-faq-shell">
        <div className="bl-faq-hero">
          <p className="bl-faq-hero-eyebrow">Help</p>
          <h1 className="bl-faq-hero-title">Frequently asked questions.</h1>
          <p className="bl-faq-hero-lede">
            Answers on what BetweenReads is, how reading and writing work on the platform, beta
            reading, credits, copyright, manuscript protection, and our position on AI. Click any
            question to expand.
          </p>
          <div className="bl-faq-hero-actions">
            <Link href="/" className="bl-faq-cta-primary">
              Join the waitlist
              <span aria-hidden="true">→</span>
            </Link>
            <Link href="/?intake=writer" className="bl-faq-cta-ghost">
              Submit to between.lines
            </Link>
          </div>
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
            <Link href="#what-is-agentready" className="bl-faq-spotlight" aria-label="Learn about AgentReady">
              <span className="bl-faq-spotlight-tag">Tool · spotlight</span>
              <h3 className="bl-faq-spotlight-title">
                <em>AgentReady</em> &mdash; research, query, submit.
              </h3>
              <p className="bl-faq-spotlight-body">
                Build your agent list beyond QueryTracker. Generate tailored query letters,
                synopses, and pitches. Free to start; Pro unlocks AI-assisted drafts.
              </p>
              <span className="bl-faq-spotlight-link">
                Read how it works
                <span aria-hidden="true">→</span>
              </span>
            </Link>
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
