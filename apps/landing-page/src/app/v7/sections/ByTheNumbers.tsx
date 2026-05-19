'use client';

import { useInView } from '../../v6/sections/useInView';

const NUMBERS: { eyebrow: string; value: string; caption: string; emphasis?: boolean }[] = [
  { eyebrow: 'intake', value: '847', caption: 'manuscripts read this year' },
  { eyebrow: 'annual output', value: '12', caption: 'will reach a publisher', emphasis: true },
  { eyebrow: 'March alone', value: '2,431', caption: 'margin notes left by readers' },
  { eyebrow: 'cadence', value: '1', caption: 'magazine, every month, since April' },
];

const STYLES = `
.v7-nums {
  position: relative;
  background: var(--bl-dark-bg);
  color: var(--bl-dark-fg);
  padding: clamp(96px, 14vh, 160px) clamp(24px, 5vw, 80px);
  overflow: hidden;
}
.v7-nums::before,
.v7-nums::after {
  content: '';
  position: absolute;
  left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(240,233,217,0.18) 20%, rgba(240,233,217,0.18) 80%, transparent);
}
.v7-nums::before { top: 0; }
.v7-nums::after { bottom: 0; }
.v7-nums-inner {
  max-width: 1280px;
  margin: 0 auto;
}
.v7-nums-eyebrow {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.36em;
  text-transform: uppercase;
  color: var(--bl-dark-accent);
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 32px;
}
.v7-nums-eyebrow .v7-nums-roman {
  font-family: 'Fraunces', serif;
  font-style: italic;
  font-weight: 500;
  font-size: 22px;
  letter-spacing: 0;
  text-transform: none;
  color: var(--bl-dark-fg);
}
.v7-nums-eyebrow .v7-nums-rule {
  flex: 1;
  height: 1px;
  background: rgba(240,233,217,0.16);
  max-width: 140px;
}
.v7-nums-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0;
  border-top: 1px solid rgba(240,233,217,0.16);
  border-bottom: 1px solid rgba(240,233,217,0.16);
}
@media (max-width: 900px) {
  .v7-nums-grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 520px) {
  .v7-nums-grid { grid-template-columns: 1fr; }
}
.v7-num {
  position: relative;
  padding: clamp(40px, 5vh, 64px) clamp(20px, 2.5vw, 36px);
  border-right: 1px solid rgba(240,233,217,0.12);
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 800ms ease, transform 800ms cubic-bezier(.22,1,.36,1);
}
.v7-num:last-child { border-right: 0; }
@media (max-width: 900px) {
  .v7-num:nth-child(2) { border-right: 0; }
  .v7-num:nth-child(1), .v7-num:nth-child(2) { border-bottom: 1px solid rgba(240,233,217,0.12); }
}
@media (max-width: 520px) {
  .v7-num { border-right: 0; border-bottom: 1px solid rgba(240,233,217,0.12); }
  .v7-num:last-child { border-bottom: 0; }
}
.v7-num.is-in { opacity: 1; transform: none; }
.v7-num.is-in:nth-child(2) { transition-delay: 120ms; }
.v7-num.is-in:nth-child(3) { transition-delay: 240ms; }
.v7-num.is-in:nth-child(4) { transition-delay: 360ms; }

.v7-num-eyebrow {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: var(--bl-dark-accent);
  margin-bottom: 24px;
}
.v7-num-value {
  font-family: 'Fraunces', serif;
  font-weight: 300;
  font-size: clamp(72px, 9vw, 144px);
  line-height: 0.9;
  letter-spacing: -0.04em;
  color: var(--bl-dark-fg);
  font-variation-settings: 'opsz' 144, 'SOFT' 0;
  margin-bottom: 20px;
}
.v7-num-emphasis .v7-num-value {
  font-style: italic;
  color: var(--bl-dark-accent);
}
.v7-num-caption {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-size: clamp(15px, 1.1vw, 18px);
  line-height: 1.4;
  color: rgba(240, 233, 217, 0.78);
  max-width: 22ch;
}

.v7-nums-foot {
  margin-top: 40px;
  display: flex;
  justify-content: flex-end;
}
.v7-nums-link {
  appearance: none;
  background: none;
  border: 0;
  padding: 0;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--bl-dark-accent);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: color 200ms ease;
}
.v7-nums-link::after {
  content: '→';
  transition: transform 220ms cubic-bezier(.22,1,.36,1);
}
.v7-nums-link:hover { color: var(--bl-dark-fg); }
.v7-nums-link:hover::after { transform: translateX(4px); }
`;

export default function ByTheNumbers({ onRequestOutcomes }: { onRequestOutcomes: () => void }) {
  const [ref, inView] = useInView<HTMLDivElement>(0.2);
  return (
    <section className="v7-nums" aria-label="By the numbers">
      <style>{STYLES}</style>
      <div className="v7-nums-inner" ref={ref}>
        <div className="v7-nums-eyebrow">
          <span className="v7-nums-roman">V.</span>
          <span>By the numbers</span>
          <span className="v7-nums-rule" />
        </div>
        <div className="v7-nums-grid">
          {NUMBERS.map((n, i) => (
            <div
              key={i}
              className={`v7-num${n.emphasis ? ' v7-num-emphasis' : ''}${inView ? ' is-in' : ''}`}
            >
              <div className="v7-num-eyebrow">{n.eyebrow}</div>
              <div className="v7-num-value">{n.value}</div>
              <div className="v7-num-caption">{n.caption}</div>
            </div>
          ))}
        </div>
        <div className="v7-nums-foot">
          <button type="button" className="v7-nums-link" onClick={onRequestOutcomes}>
            See Issue №00 outcomes
          </button>
        </div>
      </div>
    </section>
  );
}
