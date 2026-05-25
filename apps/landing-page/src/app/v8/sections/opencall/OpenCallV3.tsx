'use client';

import { useEffect, useMemo, useState } from 'react';
import { pairs as buildPairs, type Manuscript } from './data';
import { FauxCover } from './shared';

type Props = { onReader: () => void; onWriter: () => void };

type Tally = { l: number; r: number };

export default function OpenCallV3({ onWriter }: Props) {
  const pairList = useMemo(() => buildPairs(), []);
  const [pairIdx, setPairIdx] = useState(0);
  const [votedFor, setVotedFor] = useState<'l' | 'r' | null>(null);
  const [tilt, setTilt] = useState<0 | -8 | 8>(0);
  const [tally, setTally] = useState<Tally>(() => seededTally(pairList[0]));
  const [totalVotes, setTotalVotes] = useState(0);
  const [fading, setFading] = useState(false);

  const pair = pairList[pairIdx % pairList.length];
  const [left, right] = pair;

  useEffect(() => {
    setTally(seededTally(pair));
  }, [pairIdx, pair]);

  const vote = (side: 'l' | 'r') => {
    if (votedFor) return;
    setVotedFor(side);
    setTilt(side === 'l' ? -8 : 8);
    setTally((t) => ({ ...t, [side]: t[side] + 1 }));
    setTotalVotes((n) => n + 1);
    setTimeout(() => {
      setFading(true);
      setTimeout(() => {
        setPairIdx((i) => (i + 1) % pairList.length);
        setVotedFor(null);
        setTilt(0);
        setFading(false);
      }, 280);
    }, 900);
  };

  const total = tally.l + tally.r;
  const pctL = Math.round((tally.l / total) * 100);
  const pctR = 100 - pctL;

  return (
    <section className="bl-scales" aria-label="Vote between two manuscripts">
      <style>{STYLES}</style>

      <header className="bl-scales-head">
        <span className="bl-scales-eyebrow">Tip the scales · Issue №01</span>
        <h2 className="bl-scales-title">
          Two openings. <em>One reads first.</em>
        </h2>
        <p className="bl-scales-lede">
          You&rsquo;ve read {totalVotes} {totalVotes === 1 ? 'pair' : 'pairs'}.
          Pick the manuscript you&rsquo;d open tonight.
        </p>
      </header>

      <div className="bl-scales-scale" aria-hidden="true">
        <svg viewBox="0 0 360 160" xmlns="http://www.w3.org/2000/svg" filter="url(#bl-sketch)">
          <line x1="180" y1="22" x2="180" y2="148" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <polygon points="180,148 158,158 202,158" fill="currentColor" />
          <g
            style={{
              transformOrigin: '180px 22px',
              transform: `rotate(${tilt}deg)`,
              transition: 'transform 520ms cubic-bezier(.22, 1, .36, 1)',
            }}
          >
            <line x1="40" y1="22" x2="320" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <line x1="40" y1="22" x2="40" y2="56" stroke="currentColor" strokeWidth="1.5" />
            <line x1="320" y1="22" x2="320" y2="56" stroke="currentColor" strokeWidth="1.5" />
            <path
              d="M 16 56 Q 40 78 64 56"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <path
              d="M 296 56 Q 320 78 344 56"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </g>
        </svg>
      </div>

      <div className={`bl-scales-arena${fading ? ' is-fading' : ''}`} key={pairIdx}>
        <ScaleCard
          side="l"
          ms={left}
          pct={pctL}
          voted={votedFor === 'l'}
          dimmed={votedFor === 'r'}
          onVote={() => vote('l')}
          disabled={votedFor !== null}
        />
        <div className="bl-scales-divider" aria-hidden="true">
          <span>VS.</span>
        </div>
        <ScaleCard
          side="r"
          ms={right}
          pct={pctR}
          voted={votedFor === 'r'}
          dimmed={votedFor === 'l'}
          onVote={() => vote('r')}
          disabled={votedFor !== null}
        />
      </div>

      <footer className="bl-scales-foot">
        <span className="bl-scales-foot-tag">
          {votedFor ? 'New pair in a moment…' : 'Tap the one you’d read.'}
        </span>
        <button type="button" className="bl-scales-cta" onClick={onWriter}>
          Submit your manuscript <span aria-hidden="true">→</span>
        </button>
      </footer>
    </section>
  );
}

function ScaleCard({
  side,
  ms,
  pct,
  voted,
  dimmed,
  onVote,
  disabled,
}: {
  side: 'l' | 'r';
  ms: Manuscript;
  pct: number;
  voted: boolean;
  dimmed: boolean;
  onVote: () => void;
  disabled: boolean;
}) {
  return (
    <div
      className={`bl-scales-card bl-scales-card-${side}${voted ? ' is-voted' : ''}${dimmed ? ' is-dimmed' : ''}`}
    >
      <div className="bl-scales-card-cover">
        <FauxCover ms={ms} size="md" rotate={side === 'l' ? -2.4 : 2.4} />
      </div>
      <div className="bl-scales-card-body">
        <h3 className="bl-scales-card-title">{ms.title}</h3>
        <span className="bl-scales-card-author">{ms.author}</span>
        <p className="bl-scales-card-passage">&ldquo;{ms.firstLine}&rdquo;</p>
        <button
          type="button"
          className="bl-scales-vote"
          onClick={onVote}
          disabled={disabled}
        >
          {voted ? `${pct}% agree` : "I'd read this →"}
        </button>
      </div>
    </div>
  );
}

function seededTally(pair: [Manuscript, Manuscript]): Tally {
  const hash = (s: string) => s.split('').reduce((a, c) => (a * 31 + c.charCodeAt(0)) | 0, 0);
  const seed = Math.abs(hash(pair[0].id + pair[1].id));
  const total = 180 + (seed % 240);
  const l = 60 + (seed % 80);
  const r = total - l;
  return { l, r };
}

const STYLES = `
.bl-scales {
  position: relative;
  padding: clamp(90px, 12vh, 130px) clamp(24px, 5vw, 80px);
  background: var(--bl-surface);
  color: var(--bl-ink);
  overflow: hidden;
}
.bl-scales-head {
  max-width: 720px;
  margin: 0 auto clamp(28px, 4vw, 44px);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
}
.bl-scales-eyebrow {
  font-family: var(--bl-font-eyebrow);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--bl-accent);
}
.bl-scales-title {
  margin: 0;
  font-family: var(--bl-font-display);
  font-weight: 800;
  font-variation-settings: 'wdth' 92, 'opsz' 96;
  font-size: clamp(34px, 4.6vw, 60px);
  line-height: 1.02;
  letter-spacing: -0.035em;
  color: var(--bl-ink);
  text-wrap: balance;
}
.bl-scales-title em {
  font-family: 'Fraunces', Georgia, serif;
  font-style: italic;
  font-weight: 400;
  font-variation-settings: 'opsz' 144, 'SOFT' 60;
  color: var(--bl-accent);
}
.bl-scales-lede {
  margin: 0;
  font-family: var(--bl-font-body);
  font-size: 15px;
  color: var(--bl-ink-muted);
}

.bl-scales-scale {
  width: clamp(180px, 22vw, 320px);
  height: auto;
  margin: 0 auto clamp(8px, 1.2vw, 20px);
  color: var(--bl-ink);
}

.bl-scales-arena {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: clamp(16px, 3vw, 40px);
  align-items: stretch;
  max-width: 1100px;
  margin: 0 auto;
  transition: opacity 280ms ease;
}
.bl-scales-arena.is-fading { opacity: 0; }

.bl-scales-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(16px, 2vw, 24px);
  padding: clamp(20px, 2.4vw, 32px);
  background: var(--bl-paper-bg, var(--bl-surface));
  border: 1px solid rgba(14,14,12,0.1);
  border-radius: 16px;
  transition: transform 320ms cubic-bezier(.22, 1, .36, 1), opacity 320ms ease, border-color 320ms ease, background 320ms ease;
}
.bl-scales-card.is-voted {
  border-color: var(--bl-accent);
  background: var(--bl-accent-soft);
}
.bl-scales-card.is-dimmed { opacity: 0.45; }

.bl-scales-card-cover {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 4px;
}
.bl-scales-card-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  text-align: center;
}
.bl-scales-card-title {
  margin: 0;
  font-family: var(--bl-font-display);
  font-weight: 700;
  font-size: clamp(20px, 2vw, 26px);
  line-height: 1.1;
  letter-spacing: -0.015em;
  color: var(--bl-ink);
}
.bl-scales-card-author {
  font-family: var(--bl-font-eyebrow);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--bl-ink-muted);
}
.bl-scales-card-passage {
  margin: 0;
  font-family: 'Fraunces', Georgia, serif;
  font-style: italic;
  font-weight: 400;
  font-variation-settings: 'opsz' 96, 'SOFT' 50;
  font-size: clamp(15px, 1.25vw, 18px);
  line-height: 1.45;
  color: var(--bl-ink);
  max-width: 32ch;
  text-wrap: balance;
}
.bl-scales-vote {
  appearance: none;
  border: 1.5px solid var(--bl-ink);
  background: transparent;
  color: var(--bl-ink);
  font-family: var(--bl-font-eyebrow);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  padding: 12px 22px;
  border-radius: 999px;
  cursor: pointer;
  margin-top: 8px;
  transition: background 200ms ease, color 200ms ease, border-color 200ms ease;
  font-variant-numeric: tabular-nums;
}
.bl-scales-vote:hover:not(:disabled) {
  background: var(--bl-ink);
  color: var(--bl-surface);
}
.bl-scales-vote:disabled { cursor: default; }
.bl-scales-card.is-voted .bl-scales-vote {
  background: var(--bl-accent);
  border-color: var(--bl-accent);
  color: #fff;
}

.bl-scales-divider {
  display: flex;
  align-items: center;
  justify-content: center;
}
.bl-scales-divider span {
  font-family: var(--bl-font-eyebrow);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.32em;
  color: var(--bl-ink-muted);
  opacity: 0.6;
}

.bl-scales-foot {
  margin-top: clamp(40px, 5vw, 64px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
  max-width: 1100px;
  margin-left: auto;
  margin-right: auto;
}
.bl-scales-foot-tag {
  font-family: var(--bl-font-body);
  font-size: 14px;
  color: var(--bl-ink-muted);
  font-style: italic;
}
.bl-scales-cta {
  appearance: none;
  border: 0;
  background: var(--bl-ink);
  color: var(--bl-surface);
  padding: 14px 26px;
  border-radius: 999px;
  font-family: var(--bl-font-eyebrow);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 200ms ease, transform 200ms ease;
  display: inline-flex;
  align-items: center;
  gap: 12px;
}
.bl-scales-cta:hover { background: var(--bl-accent); transform: translateY(-1px); }

@media (max-width: 820px) {
  .bl-scales-arena { grid-template-columns: 1fr; gap: 20px; }
  .bl-scales-divider { padding: 4px 0; }
  .bl-scales-scale { width: clamp(140px, 40vw, 200px); }
}
@media (prefers-reduced-motion: reduce) {
  .bl-scales-scale svg g { transition: none !important; }
  .bl-scales-arena { transition: none; }
}
`;
