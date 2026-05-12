'use client';
import { useState, type ReactNode } from 'react';
import type { Palette } from '@/lib/palettes';
import { Prog } from './intake/primitives';
import { RC1, RC2, RC3 } from './intake/ReaderChapters';
import { WC1, WC2, WC3, WC4, WC5, WC6 } from './intake/WriterChapters';
import { IntakeDone } from './intake/IntakeDone';

type Props = { type: 'reader' | 'writer'; P: Palette; onClose: () => void };

export function IntakeModal({ type, P, onClose }: Props) {
  const [step, setStep] = useState(0);
  const [vis, setVis] = useState(true);
  const [key, setKey] = useState(0);
  const go = () => {
    setVis(false);
    setTimeout(() => {
      setStep(s => s + 1);
      setKey(k => k + 1);
      setVis(true);
    }, 250);
  };
  const total = type === 'reader' ? 3 : 6;
  const chapters: ReactNode[] =
    type === 'reader'
      ? [
          <RC1 key="rc1" P={P} n={go} s={go} />,
          <RC2 key="rc2" P={P} n={go} s={go} />,
          <RC3 key="rc3" P={P} n={go} />,
          <IntakeDone key="rdone" P={P} type="reader" onClose={onClose} />,
        ]
      : [
          <WC1 key="wc1" P={P} n={go} s={go} />,
          <WC2 key="wc2" P={P} n={go} s={go} />,
          <WC3 key="wc3" P={P} n={go} s={go} />,
          <WC4 key="wc4" P={P} n={go} s={go} />,
          <WC5 key="wc5" P={P} n={go} s={go} />,
          <WC6 key="wc6" P={P} n={go} />,
          <IntakeDone key="wdone" P={P} type="writer" onClose={onClose} />,
        ];
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div
        onClick={onClose}
        style={{
          position: 'absolute', inset: 0,
          background: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      />
      <div
        style={{
          position: 'relative', zIndex: 1,
          width: 'min(94vw,620px)', maxHeight: 'min(90vh,820px)',
          background: P.bg, borderRadius: 20,
          boxShadow: '0 24px 80px rgba(0,0,0,0.3)',
          overflow: 'hidden', display: 'flex', flexDirection: 'column',
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute', top: 12, right: 12, zIndex: 10,
            appearance: 'none', border: 0, background: 'transparent',
            color: P.mute, fontSize: 20, cursor: 'pointer',
            width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6,
          }}
          onMouseEnter={e => (e.currentTarget.style.background = `${P.mute}18`)}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          ✕
        </button>
        <div style={{ flex: 1, overflowY: 'auto', padding: '32px 32px 40px' }}>
          {step < total && <Prog step={step} total={total} P={P} />}
          <div
            key={key}
            style={{
              opacity: vis ? 1 : 0,
              transform: vis ? 'none' : 'translateY(12px)',
              transition: 'opacity .3s, transform .3s',
            }}
          >
            {chapters[step]}
          </div>
        </div>
      </div>
    </div>
  );
}
