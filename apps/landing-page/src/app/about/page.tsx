import type { Metadata } from 'next';
import Link from 'next/link';
import EditorialSplit from '../v8/sections/EditorialSplit';
import Footer from '../v8/sections/Footer';

export const metadata: Metadata = {
  title: 'About — BetweenReads',
  description:
    'BetweenReads is a platform for serious readers and serious writers. We are author-friendly: you keep your copyright, your work is protected, and you can leave any time.',
};

const CSS = `
.bl-about-root {
  min-height: 100vh;
  background: #ffffff;
  color: #0e0e0c;
  font-family: 'Bricolage Grotesque', 'Outfit', system-ui, sans-serif;
  --v6-ease: cubic-bezier(.22, 1, .36, 1);
  --v6-accent: #e94b36;
  --v6-accent-soft: rgba(233, 75, 54, 0.06);
  --v6-divider: rgba(14, 14, 12, 0.12);
  --v6-text-strong: #0e0e0c;
  --v6-text-muted: #5a5a52;
  --bl-section-bg: #161410;
  --bl-section-fg: #F4EFE3;
  --bl-section-muted: rgba(244, 239, 227, 0.74);
  --bl-section-accent: #E9B547;
  --bl-footer-bg: #FFC700;
  --bl-footer-fg: #0a0a0a;
  --bl-footer-muted: rgba(10,10,10,0.62);
  --bl-footer-divider: rgba(11,23,51,0.22);
  --bl-footer-accent: #1B45FF;
}
.bl-about-top {
  border-bottom: 1px solid rgba(14, 14, 12, 0.08);
  background: #ffffff;
  position: sticky;
  top: 0;
  z-index: 4;
}
.bl-about-top-inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 18px clamp(20px, 5vw, 48px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.bl-about-brand {
  display: inline-flex;
  align-items: baseline;
  color: #0e0e0c;
  text-decoration: none;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 700;
  font-size: 18px;
  letter-spacing: -0.02em;
}
.bl-about-brand-dot {
  color: #e94b36;
  padding: 0 4px;
  font-weight: 800;
  transform: translateY(-1px);
}
.bl-about-top-meta {
  display: inline-flex;
  align-items: center;
  gap: 22px;
  font-family: 'Bricolage Grotesque', sans-serif;
}
.bl-about-top-link {
  font-size: 13px;
  font-weight: 500;
  color: #5a5a52;
  text-decoration: none;
  transition: color 180ms ease;
}
.bl-about-top-link:hover { color: #e94b36; }

.bl-about-hero {
  max-width: 1100px;
  margin: 0 auto;
  padding: clamp(64px, 9vw, 120px) clamp(20px, 5vw, 48px) clamp(48px, 7vw, 88px);
}
.bl-about-hero-eyebrow {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: #e94b36;
  margin: 0 0 18px;
  display: inline-flex;
  align-items: center;
  gap: 14px;
}
.bl-about-hero-eyebrow::before {
  content: '';
  width: 32px;
  height: 1px;
  background: currentColor;
  opacity: 0.6;
}
.bl-about-hero-title {
  font-family: 'Cormorant Garamond', 'Times New Roman', serif;
  font-weight: 500;
  font-size: clamp(40px, 5.4vw, 72px);
  line-height: 1.04;
  letter-spacing: -0.025em;
  color: #0e0e0c;
  margin: 0 0 24px;
  max-width: 20ch;
  text-wrap: balance;
}
.bl-about-hero-title em { font-style: italic; color: #e94b36; }
.bl-about-hero-lede {
  font-family: 'Outfit', sans-serif;
  font-size: clamp(17px, 1.3vw, 20px);
  line-height: 1.65;
  color: #4a4640;
  margin: 0 0 18px;
  max-width: 60ch;
  text-wrap: pretty;
}
.bl-about-hero-promise {
  font-family: 'Outfit', sans-serif;
  font-size: 15px;
  line-height: 1.6;
  color: #4a4640;
  margin: 0;
  max-width: 60ch;
  padding: 18px 22px;
  border-left: 2px solid #e94b36;
  background: rgba(233, 75, 54, 0.04);
  border-radius: 0 8px 8px 0;
  text-wrap: pretty;
}
.bl-about-hero-promise strong {
  font-weight: 600;
  color: #0e0e0c;
}
.bl-about-hero-actions {
  margin-top: clamp(28px, 4vw, 40px);
  display: inline-flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
}
.bl-about-cta-primary {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.06em;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: #0e0e0c;
  color: #ffffff;
  padding: 14px 26px;
  border-radius: 999px;
  text-decoration: none;
  transition: transform 220ms cubic-bezier(.22, 1, .36, 1), background 180ms ease;
}
.bl-about-cta-primary:hover {
  transform: translateY(-1px);
  background: #e94b36;
}
.bl-about-cta-ghost {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 600;
  font-size: 13px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #0e0e0c;
  text-decoration: none;
  padding: 6px 2px;
  border-bottom: 1px solid currentColor;
  transition: color 180ms ease;
}
.bl-about-cta-ghost:hover { color: #e94b36; }
`;

export default function AboutPage() {
  return (
    <div className="bl-about-root">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <header className="bl-about-top">
        <div className="bl-about-top-inner">
          <Link href="/" className="bl-about-brand" aria-label="BetweenReads, home">
            <span>between</span>
            <span className="bl-about-brand-dot">.</span>
            <span>reads</span>
          </Link>
          <nav className="bl-about-top-meta" aria-label="Site">
            <Link href="/" className="bl-about-top-link">Home</Link>
            <Link href="/faq" className="bl-about-top-link">FAQ</Link>
          </nav>
        </div>
      </header>

      <section className="bl-about-hero" aria-label="About BetweenReads">
        <p className="bl-about-hero-eyebrow">About</p>
        <h1 className="bl-about-hero-title">
          A platform for serious readers and <em>serious writers.</em>
        </h1>
        <p className="bl-about-hero-lede">
          BetweenReads is a home for fiction that takes itself seriously &mdash; written by emerging
          authors, read by people who turn the page. We&rsquo;re looking for strong, serious
          writers, and we&rsquo;re building the platform around what they actually need: real
          readers, real feedback, and a clear path toward publication.
        </p>
        <p className="bl-about-hero-promise">
          We are <strong>author-friendly</strong>. You keep your copyright. We never train AI on
          your work. SecureBetaReads protects your manuscript &mdash; no copy-paste, no AI
          training, beta readers under confidentiality. You can withdraw your work any time.
        </p>
        <div className="bl-about-hero-actions">
          <Link href="/?intake=writer" className="bl-about-cta-primary">
            Submit your work
            <span aria-hidden="true">→</span>
          </Link>
          <Link href="/faq" className="bl-about-cta-ghost">
            Read the FAQ
          </Link>
        </div>
      </section>

      <EditorialSplit />

      <Footer />
    </div>
  );
}
