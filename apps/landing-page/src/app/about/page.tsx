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
  text-align: center;
}
.bl-about-title {
  font-family: var(--br-font-display);
  font-weight: 900;
  font-size: clamp(34px, 5.6vw, 56px);
  line-height: 1.02;
  letter-spacing: -0.03em;
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
  margin: clamp(20px, 3vw, 28px) auto 0;
  max-width: 52ch;
  text-wrap: pretty;
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
  font-size: 18px;
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

/* === Closing CTA (dark card) === */
.bl-about-cta-wrap {
  max-width: 1040px;
  margin: 0 auto;
  padding: clamp(8px, 2vw, 16px) clamp(20px, 5vw, 48px) clamp(48px, 6vw, 72px);
}
.bl-about-cta {
  background: var(--bl-paper-ink);
  color: #F4EFE3;
  border-radius: 20px;
  padding: clamp(48px, 6vw, 76px) clamp(28px, 5vw, 56px);
  text-align: center;
  box-shadow: 0 24px 56px -32px rgba(14,14,12,0.45);
}
.bl-about-cta-h {
  font-family: var(--bl-font-serif);
  font-size: clamp(28px, 3.2vw, 42px);
  font-weight: 700;
  letter-spacing: -0.01em;
  color: #F4EFE3;
  margin: 0 0 14px;
}
.bl-about-cta-p {
  font-family: var(--bl-font-body);
  font-size: clamp(18px, 1.2vw, 20px);
  color: rgba(244, 239, 227, 0.78);
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
.bl-about-cta .bl-about-btn-ghost {
  color: #F4EFE3;
  background: transparent;
  border-color: rgba(244, 239, 227, 0.5);
}
.bl-about-cta .bl-about-btn-ghost:hover,
.bl-about-cta .bl-about-btn-ghost:focus-visible {
  background: rgba(244, 239, 227, 0.12);
}

/* === CTA band (white) === */
.bl-about-band {
  background: var(--theme-surface);
  padding: clamp(40px, 6vw, 64px) clamp(20px, 5vw, 40px);
  text-align: center;
  border-top: 1px solid var(--theme-border-subtle);
}
.bl-about-band h3 {
  font-family: var(--bl-font-serif);
  font-size: clamp(22px, 2.6vw, 30px);
  font-weight: 800;
  color: var(--theme-text);
  margin: 0 0 10px;
}
.bl-about-band p {
  font-family: var(--bl-font-body);
  font-size: clamp(18px, 1.1vw, 20px);
  color: var(--theme-text-muted);
  line-height: 1.6;
  margin: 0 auto 20px;
  max-width: 560px;
  text-wrap: pretty;
}
.bl-about-band a {
  font-family: var(--bl-font-eyebrow);
  font-size: 14px;
  font-weight: 700;
  color: var(--theme-text);
  border-bottom: 2px solid var(--theme-text);
  text-decoration: none;
  padding-bottom: 2px;
  transition: color 180ms ease, border-color 180ms ease;
}
.bl-about-band a:hover { color: var(--bl-accent-strong); border-color: var(--bl-accent-strong); }

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
          <h1 className="bl-about-title">
            In a world of distractions,
            <br />
            <span className="bl-about-mark">
              we&rsquo;re built to <em>read.</em>
            </span>
          </h1>
          <p className="bl-about-lede">
            BetweenReads is an ad-free home for readers, writers, poets, and illustrators &mdash;
            where the best work rises through tailored reading, honest recommendations, and
            community trust.
          </p>
        </section>

        <div className="bl-about-body">
          <div className="bl-about-section">
            <p className="bl-about-p">
              Imagine browsing an independent bookstore. It&rsquo;s eclectic, unexpected, and rewards
              the wandering reader. You might arrive looking for one book and leave having discovered
              three others you never knew you needed.
            </p>
            <p className="bl-about-p">
              That&rsquo;s the experience we&rsquo;re building &mdash; curating outstanding books,
              stories, poetry, and illustration alongside readers&rsquo; picks and community
              recommendations, and spotlighting creators at every stage of their journey.
            </p>
          </div>

          <div className="bl-about-section">
            <h2 className="bl-about-h2">We believe there is a better way.</h2>
            <p className="bl-about-p">
              Readers today are overwhelmed by algorithms, endless recommendations, and platforms
              designed to maximize engagement rather than meaningful discovery. Writers, poets, and
              illustrators face a different challenge &mdash; they are often expected to spend as
              much time promoting their work as creating it.
            </p>
            <p className="bl-about-p">
              Readers shouldn&rsquo;t have to juggle multiple subscriptions &mdash; and the cost that
              comes with them &mdash; just to read the work they love. BetweenReads brings it
              together &mdash; a single home where great writing is discovered on demand, curated to
              your taste, and experienced like a magazine built just for you.
            </p>
            <p className="bl-about-p">
              Writers shouldn&rsquo;t have to master digital marketing, self-promote across
              platforms, post on social media, seek collabs on one site, and sell on another &mdash;
              just to find readers. BetweenReads handles the rest, enabling tips, ebook sales, and
              meaningful reader connections, so writers can focus on what they do best: write.
            </p>
            <p className="bl-about-p">BetweenReads is our attempt to change that.</p>
          </div>

          <div className="bl-about-section">
            <h2 className="bl-about-h2">Readers matter.</h2>
            <p className="bl-about-p">
              Not just as consumers, but as participants. Readers recommend books, share reviews,
              contribute feedback, highlight memorable passages, and help surface exceptional work.
              Their contributions shape discovery across the platform and create richer experiences
              for everyone.
            </p>
          </div>

          <div className="bl-about-section">
            <h2 className="bl-about-h2">So do writers, poets, and illustrators.</h2>
            <p className="bl-about-p">
              BetweenReads offers more than a place to publish. It provides a place to build
              readership, receive meaningful feedback, connect with ReaderScouts, develop works in
              progress, and share finished work with an engaged community &mdash; whether you arrive
              with a completed manuscript or an early draft, whether you&rsquo;re pursuing
              traditional publication or choosing to publish independently.
            </p>
            <p className="bl-about-p">
              Our literary journal, BetweenLines, highlights exceptional work from across the
              community, helping readers uncover new voices and overlooked books based on taste and
              shared reading experiences.
            </p>
          </div>

          <div className="bl-about-section">
            <p className="bl-about-p">
              In the dawn of AI, reading and critical thinking matter more than ever. Those who
              write and create with heart, and readers who engage with depth, acknowledge that we
              are still the guardians of culture.
            </p>
            <p className="bl-about-p">
              Reading and creating is personal. Discovery should be too.
            </p>
            <p className="bl-about-p">
              Reading remains one of the most powerful ways we connect &mdash; with ideas, with
              stories, with each other.
            </p>
            <p className="bl-about-p is-emphasis">
              We hope you will join us on this journey and help shape the community.
            </p>
          </div>
        </div>

        <div className="bl-about-sigs">
          <div>
            <p className="bl-about-sig-name">
              <span className="bl-about-brush">Jayshree</span>
            </p>
            <p className="bl-about-sig-desc">Reader. Writer. Curious wanderer.</p>
          </div>
          <div>
            <p className="bl-about-sig-name">
              <span className="bl-about-brush">Alex</span>
            </p>
            <p className="bl-about-sig-desc">Reader. Builder. Lifelong learner.</p>
          </div>
        </div>

        <section className="bl-about-cta-wrap">
          <div className="bl-about-cta">
            <h2 className="bl-about-cta-h">Welcome to the journey.</h2>
            <p className="bl-about-cta-p">
              Whether you join as a reader, writer, poet, illustrator, supporter, or simply a
              curious visitor &mdash; we hope BetweenReads becomes a place where curiosity is
              rewarded, great work is discovered, and reading remains a source of wonder.
            </p>
            <div className="bl-about-cta-actions">
              <Link href="/support" className="bl-about-btn-ghost">
                Support Us
              </Link>
              <Link href="/start?mode=reader" className="bl-about-btn-primary">
                Join Free
              </Link>
            </div>
          </div>
        </section>

        <section className="bl-about-band">
          <h3>Believe in what we&rsquo;re building?</h3>
          <p>
            Help us keep BetweenReads independent and ad-free &mdash; from a Believer contribution
            to becoming a Literary Patron, everything goes toward building a better home for readers,
            writers, poets, and illustrators.
          </p>
          <Link href="/support">Support BetweenReads &rarr;</Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
