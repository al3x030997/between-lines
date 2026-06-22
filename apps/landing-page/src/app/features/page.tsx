'use client';

import { SiteNav } from '@/components/SiteNav';
import Footer from '../v8/sections/Footer';

const CSS = `
.bl-features-root {
  min-height: 100vh;
  background: var(--theme-page);
  color: var(--theme-text);
  font-family: var(--bl-font-body);
  --bl-footer-accent: var(--bl-accent);
}
.bl-features-hero {
  max-width: 720px;
  margin: 0 auto;
  padding: clamp(96px, 16vh, 160px) clamp(20px, 5vw, 40px) clamp(96px, 14vh, 140px);
  text-align: center;
}
.bl-features-eyebrow {
  font-family: var(--bl-font-eyebrow);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--theme-text-faint);
  margin: 0 0 18px;
}
.bl-features-title {
  font-family: var(--bl-font-serif);
  font-size: clamp(34px, 5vw, 52px);
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.1;
  margin: 0 0 16px;
  text-wrap: balance;
}
.bl-features-sub {
  font-size: clamp(17px, 1.6vw, 19px);
  color: var(--theme-text-muted);
  line-height: 1.6;
  text-wrap: pretty;
}
`;

export default function FeaturesPage() {
  return (
    <div className="bl-features-root">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <SiteNav />
      <section className="bl-features-hero" aria-label="Features">
        <p className="bl-features-eyebrow">Features</p>
        <h1 className="bl-features-title">More on the way.</h1>
        <p className="bl-features-sub">
          We&rsquo;re still writing this page. Check back soon.
        </p>
      </section>
      <Footer />
    </div>
  );
}
