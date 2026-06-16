import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteNav } from '@/components/SiteNav';
import Footer from '../v8/sections/Footer';

export const metadata: Metadata = {
  title: 'About — BetweenReads',
  description:
    'BetweenReads is an ad-free home for readers, writers, poets, and illustrators, where great work is discovered through community, conversation, and thoughtful participation — not visibility-driven algorithms.',
};

// Brushstroke underline (recolored to the brand yellow token via currentColor → fill).
const BRUSH =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 20' preserveAspectRatio='none'%3E%3Cpath d='M0,3 C20,2 50,2 80,3 C110,4 130,3 160,4 C190,4 220,5 260,6 C275,6.5 290,7 300,8 L300,12 C285,11 265,10 240,10 C210,9 180,9 150,9 C120,9 90,10 60,10 C35,10 15,11 0,12 Z' fill='%23FFE600'/%3E%3Cpath d='M0,1.5 C15,0.5 35,1 60,0.5 C80,0 95,1 110,0.5' stroke='%23FFE600' stroke-width='1.2' fill='none' stroke-linecap='round' opacity='0.8'/%3E%3Cpath d='M0,0.5 C20,0 40,0.5 65,0 C82,-0.3 94,0.3 105,0' stroke='%23FFE600' stroke-width='0.7' fill='none' stroke-linecap='round' opacity='0.55'/%3E%3Cpath d='M2,2 C18,1 38,1.5 62,1 C78,0.5 90,1.2 108,0.8' stroke='%23FFE600' stroke-width='0.5' fill='none' stroke-linecap='round' opacity='0.4'/%3E%3Cpath d='M0,13 C20,14.5 50,13.5 85,14 C105,14.5 118,13.5 135,14' stroke='%23FFE600' stroke-width='1' fill='none' stroke-linecap='round' opacity='0.65'/%3E%3Cpath d='M0,14.5 C18,16 45,15 78,15.5 C98,16 112,15 128,15.5' stroke='%23FFE600' stroke-width='0.6' fill='none' stroke-linecap='round' opacity='0.45'/%3E%3C/svg%3E";

const CSS = `
.bl-about-root {
  min-height: 100vh;
  background: var(--theme-page);
  color: var(--theme-text);
  font-family: var(--bl-font-body);
  --v6-ease: var(--bl-ease);
  --bl-footer-accent: var(--bl-accent);
}

/* === Hero === */
.bl-about-hero {
  max-width: 1040px;
  margin: 0 auto;
  padding: clamp(48px, 6vw, 84px) clamp(20px, 5vw, 48px) clamp(24px, 3vw, 36px);
}
.bl-about-eyebrow {
  font-family: var(--bl-font-eyebrow);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--bl-accent-strong);
  margin: 0 0 20px;
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
  font-family: var(--bl-font-serif);
  font-weight: 900;
  font-size: clamp(42px, 6.6vw, 80px);
  line-height: 1.04;
  letter-spacing: -0.02em;
  color: var(--theme-text);
  margin: 0 0 28px;
  text-wrap: balance;
}
.bl-about-title em { font-style: italic; font-weight: 700; }
.bl-about-title .bl-about-mark {
  background: linear-gradient(to bottom, transparent 60%, var(--theme-yellow) 60%);
  padding: 0 2px;
}
.bl-about-lede {
  font-family: var(--bl-font-body);
  font-size: clamp(20px, 1.8vw, 25px);
  line-height: 1.58;
  color: var(--theme-text-muted);
  margin: 0;
  max-width: 880px;
  text-wrap: pretty;
}

/* === Center rule === */
.bl-about-rule {
  width: 40px;
  height: 1px;
  background: var(--theme-text);
  margin: clamp(20px, 2.5vw, 28px) auto;
}

/* === Manifesto body === */
.bl-about-body {
  max-width: 1040px;
  margin: 0 auto;
  padding: clamp(24px, 3vw, 36px) clamp(20px, 5vw, 48px) clamp(36px, 5vw, 48px);
}
.bl-about-h2 {
  font-family: var(--bl-font-serif);
  font-size: clamp(30px, 3.4vw, 44px);
  font-weight: 700;
  line-height: 1.18;
  letter-spacing: -0.01em;
  color: var(--theme-text);
  margin: 0 0 18px;
  text-wrap: balance;
}
.bl-about-h2 + .bl-about-p { margin-top: 0; }
.bl-about-section { margin-top: clamp(36px, 5vw, 44px); }
.bl-about-section:first-child { margin-top: 0; }
.bl-about-p {
  font-family: var(--bl-font-body);
  font-size: clamp(19px, 1.5vw, 23px);
  color: var(--theme-text-muted);
  line-height: 1.7;
  margin: 0 0 20px;
  text-wrap: pretty;
}
.bl-about-p:last-child { margin-bottom: 0; }
.bl-about-p.is-emphasis {
  font-style: italic;
  color: var(--theme-text);
}

/* === Signatures === */
.bl-about-sigs {
  max-width: 1040px;
  margin: 0 auto;
  padding: 8px clamp(20px, 5vw, 48px) clamp(40px, 6vw, 56px);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
}
.bl-about-sig-name {
  font-family: var(--bl-font-display);
  font-size: 17px;
  font-weight: 600;
  color: var(--theme-text);
  margin: 0 0 10px;
  display: inline-block;
}
.bl-about-brush {
  display: inline-block;
  position: relative;
}
.bl-about-brush::after {
  content: '';
  display: block;
  margin-top: 4px;
  height: 16px;
  width: 100%;
  background: url("${BRUSH}") no-repeat left center;
  background-size: 100% 100%;
}
.bl-about-sig-desc {
  font-family: var(--bl-font-body);
  font-size: 13px;
  color: var(--theme-text-faint);
  margin: 0;
}

/* === Writer / reader split === */
.bl-about-split-wrap {
  max-width: 1100px;
  margin: 0 auto;
  padding: clamp(8px, 2vw, 16px) clamp(20px, 5vw, 40px) clamp(48px, 6vw, 72px);
}
.bl-about-split {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(40px, 6vw, 80px);
  padding: clamp(40px, 5vw, 64px) clamp(32px, 4vw, 56px);
  background: var(--bl-paper-ink);
  color: #F4EFE3;
  border: none;
  border-radius: 20px;
  box-shadow: 0 24px 56px -32px rgba(14,14,12,0.45);
  overflow: hidden;
}
.bl-about-split::before {
  content: '';
  position: absolute;
  left: 50%;
  top: clamp(24px, 4vw, 44px);
  bottom: clamp(24px, 4vw, 44px);
  width: 1px;
  background: linear-gradient(to bottom, transparent, rgba(244, 239, 227, 0.18), transparent);
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
  color: #E9B547;
  margin: 0;
}
.bl-about-split-headline {
  font-family: var(--bl-font-serif);
  font-weight: 500;
  font-size: clamp(28px, 2.9vw, 38px);
  line-height: 1.1;
  letter-spacing: -0.01em;
  color: #F4EFE3;
  margin: 0;
  text-wrap: balance;
  font-feature-settings: "kern", "liga";
}
.bl-about-split-invitation {
  font-family: var(--bl-font-body);
  font-weight: 400;
  font-size: clamp(16px, 1.2vw, 18px);
  line-height: 1.6;
  color: rgba(244, 239, 227, 0.78);
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
  background: #F4EFE3;
  color: var(--bl-paper-ink);
  font-family: var(--bl-font-eyebrow);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  text-decoration: none;
  cursor: pointer;
  transition: background 220ms var(--bl-ease), color 180ms ease, transform 220ms var(--bl-ease);
}
.bl-about-split-cta:hover,
.bl-about-split-cta:focus-visible {
  background: #E9B547;
  color: var(--bl-paper-ink);
  transform: translateY(-1px);
  outline: none;
}
.bl-about-split-cta > span { transition: transform 240ms var(--bl-ease); }
.bl-about-split-cta:hover > span,
.bl-about-split-cta:focus-visible > span { transform: translateX(4px); }

/* === Closing CTA === */
.bl-about-cta {
  max-width: 1040px;
  margin: 0 auto;
  padding: clamp(52px, 6vw, 72px) clamp(20px, 5vw, 48px) clamp(40px, 5vw, 48px);
  text-align: center;
  border-top: 1px solid var(--theme-border-subtle);
}
.bl-about-cta-h {
  font-family: var(--bl-font-serif);
  font-size: clamp(26px, 3vw, 36px);
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--theme-text);
  margin: 0 0 12px;
}
.bl-about-cta-p {
  font-family: var(--bl-font-body);
  font-size: clamp(16px, 1.2vw, 18px);
  color: var(--theme-text-muted);
  line-height: 1.65;
  margin: 0 auto 28px;
  max-width: 56ch;
  text-wrap: pretty;
}
.bl-about-cta-actions {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  justify-content: center;
}
.bl-about-btn-primary {
  font-family: var(--bl-font-eyebrow);
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.04em;
  color: var(--theme-on-yellow);
  background: var(--theme-yellow);
  border: none;
  border-radius: 999px;
  padding: 13px 26px;
  text-decoration: none;
  cursor: pointer;
  transition: background 180ms ease, transform 220ms var(--bl-ease);
}
.bl-about-btn-primary:hover,
.bl-about-btn-primary:focus-visible {
  background: var(--theme-yellow-strong);
  transform: translateY(-2px);
  outline: none;
}
.bl-about-btn-ghost {
  font-family: var(--bl-font-eyebrow);
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--theme-text);
  background: var(--theme-surface);
  border: 1px solid var(--theme-border);
  border-radius: 999px;
  padding: 12px 24px;
  text-decoration: none;
  cursor: pointer;
  transition: background 180ms ease, transform 220ms var(--bl-ease);
}
.bl-about-btn-ghost:hover,
.bl-about-btn-ghost:focus-visible {
  background: var(--theme-surface-muted);
  transform: translateY(-2px);
  outline: none;
}

/* === Yellow CTA band === */
.bl-about-band {
  background: var(--theme-yellow);
  padding: clamp(32px, 5vw, 40px) clamp(20px, 5vw, 40px);
  text-align: center;
}
.bl-about-band h3 {
  font-family: var(--bl-font-serif);
  font-size: clamp(20px, 2.4vw, 26px);
  font-weight: 800;
  color: var(--theme-on-yellow);
  margin: 0 0 8px;
}
.bl-about-band p {
  font-family: var(--bl-font-body);
  font-size: 15px;
  color: var(--theme-on-yellow);
  opacity: 0.72;
  line-height: 1.55;
  margin: 0 auto 18px;
  max-width: 520px;
  text-wrap: pretty;
}
.bl-about-band a {
  font-family: var(--bl-font-eyebrow);
  font-size: 14px;
  font-weight: 700;
  color: var(--theme-on-yellow);
  border-bottom: 2px solid var(--theme-on-yellow);
  text-decoration: none;
  padding-bottom: 2px;
  transition: opacity 180ms ease;
}
.bl-about-band a:hover { opacity: 0.7; }

@media (max-width: 760px) {
  .bl-about-split { grid-template-columns: 1fr; gap: 40px; padding: 32px 24px; }
  .bl-about-split::before { display: none; }
}
@media (max-width: 600px) {
  .bl-about-sigs { grid-template-columns: 1fr; gap: 20px; }
}
`;

export default function AboutPage() {
  return (
    <div className="bl-about-root">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <SiteNav activeHref="/about" />

      <main>
        <section className="bl-about-hero">
          <p className="bl-about-eyebrow">About BetweenReads</p>
          <h1 className="bl-about-title">
            In a world of distractions,
            <br />
            <span className="bl-about-mark">
              we&rsquo;re built to <em>read.</em>
            </span>
          </h1>
          <p className="bl-about-lede">
            BetweenReads is an ad-free home for readers, writers, poets, and illustrators, where
            great work is discovered through community, conversation, and thoughtful participation
            &mdash; not visibility-driven algorithms.
          </p>
        </section>

        <div className="bl-about-rule" aria-hidden="true" />

        <div className="bl-about-body">
          <div className="bl-about-section">
            <p className="bl-about-p">
              Imagine browsing an independent bookstore. It&rsquo;s eclectic, unexpected, and rewards
              the wandering reader. You might arrive looking for one book and leave having discovered
              three others you never knew you needed.
            </p>
            <p className="bl-about-p">
              That&rsquo;s the experience we&rsquo;re building. We curate outstanding books, stories,
              poetry, and illustration alongside readers&rsquo; picks and community recommendations,
              and spotlight creators at every stage &mdash; from established authors and
              self-published writers to emerging voices pursuing traditional publication.
            </p>
            <p className="bl-about-p">
              Our goal is simple: help readers discover work that deserves attention.
            </p>
          </div>

          <div className="bl-about-section">
            <h2 className="bl-about-h2">We believe there is a better way.</h2>
            <p className="bl-about-p">
              Readers today are overwhelmed by algorithms, endless recommendations, popularity
              metrics, and platforms designed to maximize engagement rather than meaningful
              discovery. Writers, poets, and illustrators face a different challenge &mdash; they are
              often expected to spend as much time promoting their work as creating it.
            </p>
            <p className="bl-about-p">
              BetweenReads is a reading platform built around discovery, thoughtful participation,
              and meaningful connections between readers and creators. We help readers discover
              books, stories, poetry, and illustration from emerging voices, self-published
              creators, established authors, and literary classics alike.
            </p>
          </div>

          <div className="bl-about-section">
            <h2 className="bl-about-h2">Readers matter.</h2>
            <p className="bl-about-p">
              Not just as consumers, but as participants. Readers recommend books, share reviews,
              contribute feedback, highlight memorable passages, and help surface exceptional work.
              Their contributions shape discovery across the platform and create richer experiences
              for other readers.
            </p>
          </div>

          <div className="bl-about-section">
            <h2 className="bl-about-h2">For writers, poets, and illustrators.</h2>
            <p className="bl-about-p">
              BetweenReads offers more than a place to publish. It provides a place to build
              readership, receive meaningful feedback, connect with beta readers, develop works in
              progress, and share finished work with an engaged community.
            </p>
            <p className="bl-about-p">
              Some creators arrive with completed work. Others arrive with early drafts. Some are
              pursuing traditional publication. Others choose to publish independently. BetweenReads
              supports them all.
            </p>
            <p className="bl-about-p">
              Our literary journal, BetweenLines, highlights exceptional work from across the
              community, while our editorial and community curation helps readers uncover new voices
              and overlooked books based on taste, recommendations, and shared reading experiences
              &mdash; not popularity contests.
            </p>
          </div>

          <div className="bl-about-section">
            <p className="bl-about-p">
              We believe readers are more than data points, creators are more than content
              producers, and books deserve better ways to be found. Most of all, we believe reading
              remains one of the most powerful ways people connect with ideas, stories, and each
              other.
            </p>
            <p className="bl-about-p is-emphasis">
              We hope you will join us on this journey and help shape the community.
            </p>
          </div>
        </div>

        <div className="bl-about-sigs">
          <div>
            <p className="bl-about-sig-name">
              <span className="bl-about-brush">Jayshree [Surname]</span>
            </p>
            <p className="bl-about-sig-desc">Reader. Writer. Curious wanderer.</p>
          </div>
          <div>
            <p className="bl-about-sig-name">
              <span className="bl-about-brush">Alex [Surname]</span>
            </p>
            <p className="bl-about-sig-desc">Reader. Builder. Lifelong learner.</p>
          </div>
        </div>

        <section
          className="bl-about-split-wrap"
          aria-label="What BetweenReads gives writers and readers"
        >
          <div className="bl-about-split">
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
              <h2 className="bl-about-split-headline">Read writers worth reading.</h2>
              <p className="bl-about-split-invitation">
                Read emerging authors first &mdash; and earn Early Discoverer credit when they break
                out.
              </p>
              <Link href="/?intake=reader" className="bl-about-split-cta">
                Open the shelf <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>

        <section className="bl-about-cta">
          <h2 className="bl-about-cta-h">Welcome to the journey.</h2>
          <p className="bl-about-cta-p">
            Whether you join as a reader, writer, poet, illustrator, supporter, or simply a curious
            visitor &mdash; we hope BetweenReads becomes a place where curiosity is rewarded, great
            work is discovered, and reading remains a source of wonder.
          </p>
          <div className="bl-about-cta-actions">
            <Link href="/support" className="bl-about-btn-ghost">
              Support Us
            </Link>
            <Link href="/start?mode=reader" className="bl-about-btn-primary">
              Join Free
            </Link>
          </div>
        </section>

        <section className="bl-about-band">
          <h3>Believe in what we&rsquo;re building?</h3>
          <p>
            Help us keep BetweenReads independent and ad-free &mdash; from a one-time Believer
            contribution to a Founding Membership, everything goes toward building a better home for
            readers and writers.
          </p>
          <Link href="/support">Support BetweenReads &rarr;</Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
