import type { Metadata } from 'next';
import { SiteNav } from '@/components/SiteNav';

export const metadata: Metadata = {
  title: 'Privacy Policy — Between Lines',
  description: 'How Between Lines collects, uses, and protects your data.',
};

// Last reviewed by the operator before launch.
// IMPORTANT: Sections marked TODO must be filled in with the real controller
// identity, contact email, and (where required by Art. 13 GDPR) physical
// address before this site is promoted to EU audiences.
const LAST_UPDATED = '2026-05-19';

const CSS = `
.bl-privacy-root {
  min-height: 100vh;
  background: var(--bl-surface);
  color: var(--bl-ink);
  font-family: var(--bl-font-display);
  padding: clamp(48px, 8vh, 96px) clamp(20px, 5vw, 48px);
}
.bl-privacy-inner {
  max-width: 720px;
  margin: 0 auto;
  font-family: var(--bl-font-body);
  font-size: 16px;
  line-height: 1.6;
  color: var(--bl-ink-soft);
}
.bl-privacy-eyebrow {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--bl-accent);
  margin: 0 0 14px;
}
.bl-privacy-title {
  font-family: var(--bl-font-eyebrow);
  font-weight: 800;
  font-size: clamp(32px, 4.4vw, 48px);
  letter-spacing: -0.03em;
  line-height: 1.05;
  color: var(--bl-ink);
  margin: 0 0 8px;
}
.bl-privacy-updated {
  color: var(--bl-ink-muted);
  font-size: 13px;
  margin: 0 0 32px;
}
.bl-privacy-inner h2 {
  font-family: var(--bl-font-eyebrow);
  font-weight: 700;
  font-size: 20px;
  letter-spacing: -0.01em;
  color: var(--bl-ink);
  margin: 32px 0 10px;
}
.bl-privacy-inner h3 {
  font-family: var(--bl-font-eyebrow);
  font-weight: 700;
  font-size: 15px;
  color: var(--bl-ink);
  margin: 20px 0 6px;
}
.bl-privacy-inner p { margin: 0 0 12px; }
.bl-privacy-inner ul { margin: 0 0 16px 20px; }
.bl-privacy-inner li { margin: 4px 0; }
.bl-privacy-inner a {
  color: var(--bl-accent);
  text-decoration: underline;
  text-underline-offset: 2px;
}
.bl-privacy-back {
  display: inline-block;
  margin-top: 40px;
  font-family: var(--bl-font-eyebrow);
  font-weight: 600;
  color: var(--bl-ink);
}
`;

export default function PrivacyPage() {
  return (
    <>
      <SiteNav />
      <div className="bl-privacy-root">
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
        <article className="bl-privacy-inner">
        <p className="bl-privacy-eyebrow">Legal</p>
        <h1 className="bl-privacy-title">Privacy Policy</h1>
        <p className="bl-privacy-updated">Last updated: {LAST_UPDATED}</p>

        <p>
          This policy explains what personal data Between Lines collects when you join our
          pre-launch waitlist, why we collect it, who processes it on our behalf, and how you
          can exercise your rights under the EU General Data Protection Regulation (GDPR).
        </p>

        <h2>1. Controller</h2>
        <p>
          The controller responsible for the processing described here is:
        </p>
        <ul>
          <li>
            <strong>TODO — Operator name</strong> (the natural person or legal entity
            operating Between Lines)
          </li>
          <li>TODO — Postal address</li>
          <li>
            Contact: <a href="mailto:privacy@example.com">privacy@example.com</a> (TODO — replace
            with the real mailbox before going live in the EU)
          </li>
        </ul>

        <h2>2. Data we collect</h2>
        <p>When you join the waitlist we record:</p>
        <ul>
          <li>The email address you submit.</li>
          <li>The IP address of the device used to submit the form.</li>
          <li>The User-Agent string sent by your browser.</li>
          <li>A timestamp of your consent.</li>
          <li>The fact that you ticked the consent checkbox.</li>
          <li>An internal subscriber identifier created by our email provider.</li>
        </ul>
        <p>
          We do not collect names, payment information, or precise location data on this site.
        </p>

        <h2>3. Why we collect it (legal basis)</h2>
        <p>
          We rely on your explicit consent under Art. 6(1)(a) GDPR. You give that consent by
          ticking the box on the waitlist form. The data is used solely to:
        </p>
        <ul>
          <li>Send you a confirmation email (double opt-in).</li>
          <li>
            Send you a personalized link granting access to the private &quot;insider&quot;
            area of the site.
          </li>
          <li>Notify you when Between Lines launches.</li>
        </ul>

        <h2>4. Retention</h2>
        <p>
          We keep your data until you unsubscribe, plus a further 30 days for operational
          clean-up. Records of the consent you gave (timestamp, IP, User-Agent) are retained
          as long as needed to demonstrate compliance with GDPR.
        </p>

        <h2>5. Who processes your data</h2>
        <p>We use the following processors. Each has its own privacy notice and DPA:</p>
        <ul>
          <li>
            <a href="https://kit.com/privacy" target="_blank" rel="noopener">
              Kit (ConvertKit LLC)
            </a>{' '}
            — email delivery, subscriber records, double opt-in handling.
          </li>
          <li>
            <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener">
              Vercel Inc.
            </a>{' '}
            — hosting, edge routing, server-side processing.
          </li>
          <li>
            <a href="https://neon.tech/privacy-policy" target="_blank" rel="noopener">
              Neon Inc.
            </a>{' '}
            — managed Postgres database.
          </li>
          <li>
            <a href="https://upstash.com/trust/privacy.pdf" target="_blank" rel="noopener">
              Upstash Inc.
            </a>{' '}
            — Redis-based rate limiting.
          </li>
        </ul>

        <h2>6. International transfers</h2>
        <p>
          Some of the processors listed above are located in the United States. Where data is
          transferred outside the European Economic Area, we rely on the European Commission&apos;s
          Standard Contractual Clauses with each processor.
        </p>

        <h2>7. Your rights</h2>
        <p>Under GDPR you have the right to:</p>
        <ul>
          <li>Request access to the personal data we hold about you (Art. 15).</li>
          <li>Have inaccurate data corrected (Art. 16).</li>
          <li>Have your data erased (Art. 17) — also known as the right to be forgotten.</li>
          <li>Receive your data in a portable, machine-readable format (Art. 20).</li>
          <li>Withdraw your consent at any time.</li>
          <li>
            Lodge a complaint with a supervisory authority (typically the one in your country of
            residence).
          </li>
        </ul>
        <p>
          To exercise any of these rights, email{' '}
          <a href="mailto:privacy@example.com">privacy@example.com</a> (TODO). You can also
          unsubscribe from our list at any time using the link at the bottom of every email we
          send — doing so revokes your consent and removes you from the waitlist within 30 days.
        </p>

        <h2>8. Cookies</h2>
        <p>
          Once you click your personal insider link, we set a single signed HTTP-only cookie
          named <code>bl_insider</code>. It contains an opaque identifier (no marketing or
          tracking data) and expires after 180 days. It exists only so you don&apos;t have to
          click the link again on the same device. We do not use third-party tracking cookies.
        </p>

        <h2>9. Analytics</h2>
        <p>
          We use Vercel Analytics to count page views and three custom events
          (<code>waitlist_submit</code>, <code>waitlist_confirm</code>,
          <code>insider_unlock</code>). Vercel Analytics is configured cookieless and does not
          identify individual visitors.
        </p>

        <h2>10. Changes</h2>
        <p>
          If we change this policy, we will update the &quot;Last updated&quot; date above and,
          for material changes, email everyone on the waitlist before the change takes effect.
        </p>

        <a className="bl-privacy-back" href="/">← Back to Between Lines</a>
        </article>
      </div>
    </>
  );
}
