'use client';

import { useEffect, useState } from 'react';
import { InlineQuestions, type InlineAnswers, type Region } from '../../v6/InlineQuestions';
import { CountdownClock } from '../components/CountdownClock';
import { MarginNote } from '../components/MarginNote';
import { PaperGrain } from '../components/PaperGrain';
import { WrappedCover, type WrappedBook } from '../components/WrappedCover';

const HERO_BOOK: WrappedBook = {
  id: 'hero',
  genre: 'Literary fiction',
  firstLine:
    'The morning her mother stopped speaking, the dishes did not break.',
  authorRedacted: 'Iona Hollis',
  dropDate: '14.06',
  coverGradient: 'linear-gradient(155deg, #C9A876 0%, #5C3A1F 100%)',
};

const STYLES = `
.v7-hero {
  position: relative;
  background: var(--bl-paper);
  color: var(--bl-ink);
  min-height: calc(100vh - 76px);
  padding: clamp(48px, 8vh, 96px) clamp(24px, 5vw, 80px) clamp(64px, 10vh, 128px);
  display: flex;
  align-items: center;
  overflow: hidden;
}
.v7-grain {
  position: absolute;
  inset: 0;
  pointer-events: none;
  mix-blend-mode: multiply;
  background-size: 320px 320px;
  background-repeat: repeat;
}

.v7-hero-stage {
  position: relative;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
}

.v7-hero-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: clamp(40px, 6vw, 96px);
  align-items: center;
  transition: opacity 360ms ease, transform 360ms cubic-bezier(.22,1,.36,1);
}
.v7-hero-grid.is-leaving,
.v7-hero-grid.is-hidden {
  opacity: 0;
  transform: translateY(-12px) scale(.985);
  pointer-events: none;
}
@media (max-width: 900px) {
  .v7-hero-grid { grid-template-columns: 1fr; gap: 56px; }
}

/* === Left column === */
.v7-hero-text {
  display: flex;
  flex-direction: column;
  gap: clamp(20px, 3vh, 36px);
  position: relative;
  z-index: 2;
}
.v7-hero-eyebrow {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.36em;
  text-transform: uppercase;
  color: var(--bl-accent);
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 14px;
}
.v7-hero-eyebrow-bullet {
  width: 4px; height: 4px;
  border-radius: 50%;
  background: var(--bl-divider);
}
.v7-hero-eyebrow-sub {
  color: var(--bl-wash);
  font-weight: 600;
}
.v7-hero-eyebrow-clock {
  color: var(--bl-ink);
  font-weight: 700;
  letter-spacing: 0.12em;
}
.v7-hero-eyebrow-clock .v7-clock-num {
  font-family: 'Fraunces', serif;
  font-style: italic;
  font-weight: 500;
  font-size: 16px;
  letter-spacing: 0;
  color: var(--bl-accent);
  margin-right: 2px;
}
.v7-hero-eyebrow-clock .v7-clock-sec { opacity: 0.5; }

.v7-hero-title {
  font-family: 'Fraunces', 'Cormorant Garamond', serif;
  font-weight: 400;
  font-size: clamp(44px, 6.5vw, 96px);
  line-height: 0.98;
  letter-spacing: -0.025em;
  color: var(--bl-ink);
  margin: 0;
  font-variation-settings: 'opsz' 144, 'SOFT' 50;
}
.v7-hero-title em {
  font-style: italic;
  font-weight: 400;
  color: var(--bl-accent);
}
.v7-hero-title-l1 {
  display: block;
  opacity: 0;
  transform: translateY(20px);
  animation: v7-fade-up 900ms cubic-bezier(.22,1,.36,1) 80ms forwards;
}
.v7-hero-title-l2 {
  display: block;
  opacity: 0;
  transform: translateY(20px);
  animation: v7-fade-up 900ms cubic-bezier(.22,1,.36,1) 280ms forwards;
}
@keyframes v7-fade-up {
  to { opacity: 1; transform: none; }
}

.v7-hero-sub {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-size: clamp(18px, 1.5vw, 24px);
  line-height: 1.5;
  color: var(--bl-wash);
  max-width: 36ch;
  margin: 0;
  opacity: 0;
  transform: translateY(20px);
  animation: v7-fade-up 900ms cubic-bezier(.22,1,.36,1) 440ms forwards;
}

.v7-doors {
  margin-top: clamp(8px, 2vh, 16px);
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: stretch;
  opacity: 0;
  transform: translateY(20px);
  animation: v7-fade-up 900ms cubic-bezier(.22,1,.36,1) 620ms forwards;
}
.v7-door {
  appearance: none;
  background: var(--bl-ink);
  color: var(--bl-paper);
  border: 1px solid var(--bl-ink);
  padding: 18px 26px 16px;
  border-radius: 0;
  font: inherit;
  cursor: pointer;
  text-align: left;
  display: inline-flex;
  flex-direction: column;
  gap: 4px;
  min-width: 200px;
  transition: background 280ms ease, color 280ms ease, transform 280ms cubic-bezier(.22,1,.36,1);
  position: relative;
  overflow: hidden;
}
.v7-door:hover {
  background: var(--bl-accent);
  border-color: var(--bl-accent);
  transform: translateY(-2px);
}
.v7-door-secondary {
  background: transparent;
  color: var(--bl-ink);
  border: 1px solid var(--bl-ink);
}
.v7-door-secondary:hover {
  background: var(--bl-ink);
  color: var(--bl-paper);
  border-color: var(--bl-ink);
}
.v7-door-eye {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  opacity: 0.7;
}
.v7-door-label {
  font-family: 'Fraunces', serif;
  font-style: italic;
  font-weight: 400;
  font-size: 22px;
  letter-spacing: -0.01em;
  line-height: 1.1;
  display: inline-flex;
  align-items: baseline;
  gap: 10px;
}
.v7-door-label::after {
  content: '→';
  font-style: normal;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 18px;
  transition: transform 280ms cubic-bezier(.22,1,.36,1);
}
.v7-door:hover .v7-door-label::after { transform: translateX(4px); }

.v7-door-both {
  margin-top: 6px;
  appearance: none;
  background: none;
  border: 0;
  padding: 6px 0;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--bl-wash);
  cursor: pointer;
  align-self: flex-start;
  position: relative;
  opacity: 0;
  animation: v7-fade-up 900ms cubic-bezier(.22,1,.36,1) 760ms forwards;
}
.v7-door-both::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  background: var(--bl-accent);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 360ms cubic-bezier(.22,1,.36,1);
}
.v7-door-both:hover { color: var(--bl-ink); }
.v7-door-both:hover::after { transform: scaleX(1); }

/* === Right column === */
.v7-hero-object {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: clamp(360px, 60vh, 540px);
}
.v7-hero-stamp {
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%) rotate(-2deg);
  z-index: 2;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: var(--bl-accent);
  background: var(--bl-paper);
  padding: 6px 16px;
  border: 1px solid var(--bl-accent);
  border-radius: 0;
}
.v7-hero-wrap-frame {
  width: clamp(220px, 28vw, 340px);
  opacity: 0;
  transform: translateY(30px) rotate(-4deg);
  animation: v7-wrap-enter 1100ms cubic-bezier(.22,1,.36,1) 360ms forwards;
  position: relative;
}
@keyframes v7-wrap-enter {
  to { opacity: 1; transform: translateY(0) rotate(-2.4deg); }
}
.v7-hero-margin {
  position: absolute;
  top: 32%;
  right: -90px;
  max-width: 200px;
  z-index: 3;
  opacity: 0;
  animation: v7-fade-up 1000ms cubic-bezier(.22,1,.36,1) 980ms forwards;
}
.v7-hero-margin-2 {
  position: absolute;
  bottom: 16%;
  left: -64px;
  max-width: 160px;
  z-index: 3;
  opacity: 0;
  animation: v7-fade-up 1000ms cubic-bezier(.22,1,.36,1) 1180ms forwards;
}
@media (max-width: 900px) {
  .v7-hero-margin { right: -20px; top: 14%; }
  .v7-hero-margin-2 { left: -10px; bottom: 4%; }
}
@media (max-width: 540px) {
  .v7-hero-margin, .v7-hero-margin-2 { display: none; }
}

/* === Marginalia handwriting === */
.v7-margin {
  display: inline-block;
  font-family: 'Caveat', 'Bradley Hand', cursive;
  font-weight: 500;
  font-size: 18px;
  line-height: 1.18;
  color: var(--bl-margin-ink);
  transform: rotate(var(--v7-margin-rotate, -1.5deg));
  position: relative;
}
.v7-margin-sm { font-size: 16px; }
.v7-margin-md { font-size: 18px; }
.v7-margin-lg { font-size: 22px; }
.v7-margin-body {
  display: inline-block;
  letter-spacing: 0.01em;
}
.v7-margin-arrow-svg {
  position: absolute;
  width: 60px;
  height: 24px;
  color: var(--bl-margin-ink);
}
.v7-margin-arrow-left .v7-margin-arrow-svg {
  left: -64px;
  top: 50%;
  transform: translateY(-50%);
}
.v7-margin-arrow-right .v7-margin-arrow-svg {
  right: -64px;
  top: 50%;
  transform: translateY(-50%);
}
.v7-margin-arrow-down .v7-margin-arrow-svg {
  bottom: -28px;
  left: 50%;
  transform: translateX(-50%);
}

/* === Redacted text === */
.v7-redact {
  position: relative;
  display: inline-block;
  vertical-align: baseline;
}
.v7-redact-clear {
  visibility: hidden;
  user-select: none;
}
.v7-redact-mask {
  position: absolute;
  inset: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0;
  pointer-events: none;
}
.v7-redact-block {
  display: inline-block;
  background: var(--bl-redaction);
  color: transparent;
  padding: 1px 1px;
  border-radius: 1px;
  margin: 0;
  position: relative;
}
.v7-redact-ghost {
  display: inline-block;
  color: transparent;
}
.v7-redact-paper .v7-redact-block { background: var(--bl-paper); color: transparent; }
.v7-redact-accent .v7-redact-block { background: var(--bl-accent); }
.v7-redact-hover:hover .v7-redact-mask { opacity: 0; transition: opacity 220ms ease; }
.v7-redact-hover:hover .v7-redact-clear { visibility: visible; color: inherit; }
.v7-redact-hover { cursor: help; }
`;

type Phase = 'choose' | 'leaving' | 'questions';
type Props = {
  onComplete: (answers: InlineAnswers, finalRegion: Region) => void;
  dropClosesAt: string;
};

export default function HeroIssue({ onComplete, dropClosesAt }: Props) {
  const [phase, setPhase] = useState<Phase>('choose');
  const [region, setRegion] = useState<Region>('reader');

  const open = (r: Region) => {
    if (phase !== 'choose') return;
    setRegion(r);
    setPhase('leaving');
    window.setTimeout(() => setPhase('questions'), 360);
  };

  const handleComplete = (answers: InlineAnswers, finalRegion: Region) => {
    setPhase('choose');
    onComplete(answers, finalRegion);
  };

  const handleBack = () => {
    setPhase('choose');
  };

  useEffect(() => {
    if (phase !== 'choose') return;
  }, [phase]);

  return (
    <section className="v7-hero" aria-label="Issue №01">
      <style>{STYLES}</style>
      <PaperGrain opacity={0.08} />

      <div className="v7-hero-stage">
        <div
          className={`v7-hero-grid${
            phase === 'leaving' ? ' is-leaving' : phase === 'questions' ? ' is-hidden' : ''
          }`}
          aria-hidden={phase !== 'choose'}
        >
          <div className="v7-hero-text">
            <div className="v7-hero-eyebrow">
              <span>Issue №01</span>
              <span className="v7-hero-eyebrow-bullet" />
              <span className="v7-hero-eyebrow-sub">A monthly literary drop</span>
              <span className="v7-hero-eyebrow-bullet" />
              <span className="v7-hero-eyebrow-clock">
                <span style={{ color: 'var(--bl-wash)', fontWeight: 600, marginRight: 8 }}>closes in</span>
                <CountdownClock target={dropClosesAt} />
              </span>
            </div>

            <h1 className="v7-hero-title">
              <span className="v7-hero-title-l1">There&apos;s a book you&apos;ll love.</span>
              <span className="v7-hero-title-l2">
                <em>Nobody&apos;s published it</em> yet.
              </span>
            </h1>

            <p className="v7-hero-sub">
              Twelve debut manuscripts a year. Read them before anyone else does — and help
              decide which two reach the shelf.
            </p>

            <div className="v7-doors">
              <button type="button" className="v7-door" onClick={() => open('reader')}>
                <span className="v7-door-eye">For readers</span>
                <span className="v7-door-label">Open the issue</span>
              </button>
              <button type="button" className="v7-door v7-door-secondary" onClick={() => open('author')}>
                <span className="v7-door-eye">For writers</span>
                <span className="v7-door-label">Submit a draft</span>
              </button>
            </div>

            <button type="button" className="v7-door-both" onClick={() => open('both')}>
              Both? Walk in through both doors →
            </button>
          </div>

          <div className="v7-hero-object">
            <span className="v7-hero-stamp" aria-hidden="true">№01 · unread</span>
            <div className="v7-hero-wrap-frame">
              <WrappedCover book={HERO_BOOK} index={0} onClick={() => open('reader')} />
            </div>
            <MarginNote rotate={-4} arrow="left" size="md" className="v7-hero-margin">
              reader 037 said:
              <br />
              &ldquo;the first page knocked the wind out of me&rdquo;
            </MarginNote>
            <MarginNote rotate={3} size="sm" className="v7-hero-margin-2">
              wrap stays on
              <br />
              until you do
            </MarginNote>
          </div>
        </div>

        <InlineQuestions
          region={region}
          visible={phase === 'questions'}
          onComplete={handleComplete}
          onBack={handleBack}
        />
      </div>
    </section>
  );
}
