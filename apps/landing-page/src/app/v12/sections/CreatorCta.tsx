import Link from 'next/link';

type Props = {
  onJoin: () => void;
};

const STYLES = `
.cc-closing {
  background: #161410;
  font-family: 'Outfit', system-ui, sans-serif;
}

/* Dark creator band */
.cc-band-outer {
  background: #161410;
}
.cc-band {
  position: relative;
  overflow: hidden;
  width: 100%;
  background: #161410;
  color: #f6f1e3;
  padding: clamp(72px, 11vw, 132px) clamp(24px, 5vw, 80px);
  text-align: center;
}
.cc-band::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
  opacity: 0.05;
  pointer-events: none;
}
.cc-band::after {
  content: '';
  position: absolute;
  left: 50%;
  top: -40%;
  width: min(680px, 90%);
  height: 80%;
  transform: translateX(-50%);
  background: radial-gradient(ellipse at center, color-mix(in srgb, var(--bl-accent, #3ecfb2) 16%, transparent), transparent 70%);
  pointer-events: none;
}
.cc-band-inner {
  position: relative;
  max-width: 720px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
}
.cc-eyebrow {
  font-family: 'Outfit', system-ui, sans-serif;
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: var(--bl-accent, #3ecfb2);
  margin: 0;
}
.cc-title {
  font-family: 'Playfair Display', Georgia, serif;
  font-weight: 500;
  font-size: clamp(34px, 5vw, 60px);
  line-height: 1.04;
  letter-spacing: -0.02em;
  color: #fdfbf4;
  margin: 0;
  text-wrap: balance;
}
.cc-title em {
  font-style: italic;
  color: var(--theme-yellow, #f3d84a);
}
.cc-sub {
  font-family: 'Outfit', system-ui, sans-serif;
  font-size: clamp(17px, 1.4vw, 20px);
  line-height: 1.55;
  color: rgba(246, 241, 227, 0.72);
  margin: 0;
  max-width: 48ch;
  text-wrap: pretty;
}
.cc-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
  margin-top: 14px;
}
.cc-pill {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 16px 32px;
  border-radius: 999px;
  font-family: 'Outfit', system-ui, sans-serif;
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.02em;
  cursor: pointer;
  text-decoration: none;
  transition:
    transform 220ms cubic-bezier(.22, 1, .36, 1),
    box-shadow 220ms cubic-bezier(.22, 1, .36, 1),
    background 220ms cubic-bezier(.22, 1, .36, 1),
    border-color 220ms cubic-bezier(.22, 1, .36, 1);
  border: 1px solid transparent;
}
.cc-pill-primary {
  background: var(--theme-yellow, #f3d84a);
  color: #161410;
  box-shadow: 0 8px 22px color-mix(in srgb, var(--theme-yellow, #f3d84a) 30%, transparent);
}
.cc-pill-primary:hover,
.cc-pill-primary:focus-visible {
  background: #ffe948;
  transform: translateY(-2px);
  box-shadow: 0 14px 30px color-mix(in srgb, var(--theme-yellow, #f3d84a) 42%, transparent);
  outline: none;
}
.cc-pill-ghost {
  background: transparent;
  color: #f6f1e3;
  border-color: rgba(246, 241, 227, 0.36);
}
.cc-pill-ghost:hover,
.cc-pill-ghost:focus-visible {
  border-color: #f6f1e3;
  background: rgba(246, 241, 227, 0.08);
  transform: translateY(-2px);
  outline: none;
}
.cc-pill-arrow {
  display: inline-block;
  transition: transform 240ms cubic-bezier(.22, 1, .36, 1);
}
.cc-pill:hover .cc-pill-arrow,
.cc-pill:focus-visible .cc-pill-arrow {
  transform: translateX(4px);
}

@media (max-width: 640px) {
  .cc-actions {
    flex-direction: column;
    align-self: stretch;
  }
  .cc-pill { justify-content: center; }
}
@media (prefers-reduced-motion: reduce) {
  .cc-band::after,
  .cc-pill,
  .cc-pill-arrow { transition: none; }
}
`;

export default function CreatorCta({ onJoin }: Props) {
  return (
    <section className="cc-closing" aria-label="Welcome to the journey">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <div className="cc-band-outer">
        <div className="cc-band">
          <div className="cc-band-inner">
            <h2 className="cc-title">Welcome to the journey.</h2>
            <p className="cc-sub">
              Whether you join as a reader, writer, poet, illustrator, supporter,
              or simply a curious visitor &mdash; we hope BetweenReads becomes a
              place where curiosity is rewarded, great work is discovered, and
              reading remains a source of wonder.
            </p>
            <div className="cc-actions">
              <Link href="/support" className="cc-pill cc-pill-ghost">
                Support Us
              </Link>
              <button
                type="button"
                className="cc-pill cc-pill-primary"
                onClick={onJoin}
              >
                Join Free
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
