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
  background: #ffffff;
  color: #0e0e0c;
  font-family: 'Bricolage Grotesque', 'Outfit', system-ui, sans-serif;
  --v6-ease: cubic-bezier(.22, 1, .36, 1);
  --bl-footer-bg: #FFC700;
  --bl-footer-fg: #0a0a0a;
  --bl-footer-muted: rgba(10,10,10,0.62);
  --bl-footer-divider: rgba(11,23,51,0.22);
  --bl-footer-accent: #C5283D;
}
.bl-faq-top {
  border-bottom: 1px solid rgba(14,14,12,0.08);
  background: #ffffff;
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
  color: #0e0e0c;
  text-decoration: none;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 700;
  font-size: 18px;
  letter-spacing: -0.02em;
}
.bl-faq-top-dot {
  color: #e94b36;
  padding: 0 4px;
  font-weight: 800;
  transform: translateY(-1px);
}
.bl-faq-top-back {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #5a5a52;
  text-decoration: none;
  transition: color 180ms ease;
}
.bl-faq-top-back:hover { color: #e94b36; }
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
  color: #e94b36;
  margin: 0 0 14px;
}
.bl-faq-hero-title {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 800;
  font-size: clamp(44px, 6vw, 68px);
  letter-spacing: -0.03em;
  line-height: 1.05;
  color: #0e0e0c;
  margin: 0 0 16px;
}
.bl-faq-hero-lede {
  font-family: 'Outfit', sans-serif;
  font-size: clamp(17px, 1.25vw, 20px);
  line-height: 1.65;
  color: #5a5a52;
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
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: #5a5a52;
  margin: 0 0 6px;
}
.bl-faq-side a {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 15px;
  font-weight: 500;
  color: #0e0e0c;
  text-decoration: none;
  padding: 6px 0;
  display: flex;
  align-items: baseline;
  gap: 10px;
  transition: color 180ms ease;
}
.bl-faq-side a:hover { color: #e94b36; }
.bl-faq-side-num {
  font-variant-numeric: tabular-nums;
  font-size: 12px;
  color: #5a5a52;
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
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 600;
  font-size: 12px;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: #e94b36;
  margin: 0 0 10px;
  font-variant-numeric: tabular-nums;
}
.bl-faq-section-title {
  font-family: 'Cormorant Garamond', 'Times New Roman', serif;
  font-weight: 600;
  font-size: clamp(36px, 4.4vw, 52px);
  letter-spacing: -0.02em;
  line-height: 1.05;
  color: #0e0e0c;
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
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 600;
  font-size: clamp(17px, 1.35vw, 20px);
  line-height: 1.45;
  color: #0e0e0c;
  transition: color 180ms ease;
}
.bl-faq-q::-webkit-details-marker { display: none; }
.bl-faq-q:hover { color: #e94b36; }
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
  font-family: 'Outfit', sans-serif;
  font-size: 17px;
  line-height: 1.65;
  color: #2a2a25;
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
  font-family: 'Outfit', sans-serif;
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
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 600;
  font-size: 12px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #5a5a52;
  background: rgba(14,14,12,0.03);
  border-bottom: 1px solid rgba(14,14,12,0.15);
}
.bl-faq-table tbody tr:last-child td { border-bottom: 0; }

.bl-faq-foot {
  margin-top: clamp(56px, 8vw, 96px);
  padding-top: 32px;
  border-top: 1px solid rgba(14,14,12,0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 14px;
  color: #5a5a52;
}
.bl-faq-foot a {
  color: #0e0e0c;
  text-decoration: none;
  transition: color 180ms ease;
}
.bl-faq-foot a:hover { color: #e94b36; }

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
          <Link href="/" className="bl-faq-top-brand" aria-label="Between Lines, home">
            <span>between</span>
            <span className="bl-faq-top-dot">·</span>
            <span>lines</span>
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
                    <li key={item.q}>
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

        <div className="bl-faq-foot">
          <span>Didn’t find your answer? <Link href="/">Join the waitlist →</Link></span>
          <a href="#top">Back to top ↑</a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
