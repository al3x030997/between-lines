import Link from 'next/link';

export default function PricingPage() {
  return (
    <main className="bl-stub">
      <style>{STUB_CSS}</style>
      <Link className="bl-stub-brand" href="/" aria-label="Back to BetweenReads">
        <span>between</span>
        <span className="bl-stub-brand-dot">.</span>
        <span>reads</span>
      </Link>
      <div className="bl-stub-body">
        <span className="bl-stub-eyebrow">Section</span>
        <h1 className="bl-stub-title">Pricing</h1>
        <p className="bl-stub-sub">Coming soon.</p>
        <Link className="bl-stub-back" href="/">← Back home</Link>
      </div>
    </main>
  );
}

const STUB_CSS = `
.bl-stub {
  min-height: 100vh;
  background: #ffffff;
  color: #0e0e0c;
  display: flex;
  flex-direction: column;
  font-family: var(--bl-font-display, 'Inter Tight', system-ui, sans-serif);
}
.bl-stub-brand {
  display: inline-flex;
  align-items: baseline;
  padding: 28px clamp(20px, 4vw, 56px);
  font-family: var(--bl-font-eyebrow, system-ui, sans-serif);
  font-size: 17px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: inherit;
  text-decoration: none;
  font-variation-settings: 'wdth' 95;
  width: fit-content;
}
.bl-stub-brand-dot { color: #C5283D; padding: 0 4px; font-weight: 800; transform: translateY(-1px); }
.bl-stub-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 16px;
  padding: 64px 24px;
}
.bl-stub-eyebrow {
  font-family: var(--bl-font-eyebrow, system-ui, sans-serif);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: #C5283D;
}
.bl-stub-title {
  margin: 0;
  font-family: var(--bl-font-display, 'Inter Tight', system-ui, sans-serif);
  font-weight: 800;
  font-variation-settings: 'wdth' 92, 'opsz' 96;
  font-size: clamp(40px, 6vw, 96px);
  letter-spacing: -0.035em;
  line-height: 1.0;
}
.bl-stub-sub {
  margin: 0;
  font-family: 'Fraunces', Georgia, serif;
  font-style: italic;
  font-size: 18px;
  color: rgba(14, 14, 12, 0.6);
}
.bl-stub-back {
  margin-top: 16px;
  font-family: var(--bl-font-eyebrow, system-ui, sans-serif);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #0e0e0c;
  text-decoration: none;
  padding: 6px 0;
  border-bottom: 1px solid rgba(14, 14, 12, 0.25);
  transition: color 200ms ease, border-color 200ms ease;
}
.bl-stub-back:hover {
  color: #C5283D;
  border-bottom-color: #C5283D;
}
`;
