'use client';

import { useState } from 'react';
import { addRC } from '@/lib/mock-session';

type Tab = 'react' | 'quick' | 'deep';

const TAB_RC: Record<Tab, number> = {
  react: 2,
  quick: 5,
  deep: 10,
};

const STAR_CATEGORIES = ['Plot', 'Characters', 'Pacing', 'Writing', 'Emotional resonance'];
const EMOJIS = ['❤️', '😢', '😮', '✨', '💭'];

export function FeedbackPanel() {
  const [activeEmojis, setActiveEmojis] = useState<Record<string, boolean>>({});
  const [stars, setStars] = useState<Record<string, number>>({});
  const [keepReading, setKeepReading] = useState<'yes' | 'no' | null>(null);
  const [wouldBuy, setWouldBuy] = useState<'yes' | 'no' | null>(null);
  const [tab, setTab] = useState<Tab>('react');
  const [quickText, setQuickText] = useState('');
  const [deepText, setDeepText] = useState('');
  const [submitted, setSubmitted] = useState<number | null>(null);

  const submit = () => {
    if (submitted !== null) return;
    const earned = TAB_RC[tab];
    addRC(earned);
    setSubmitted(earned);
  };

  return (
    <section className="br-fp" aria-labelledby="br-fp-title">
      <div className="br-fp-eyebrow">— Your feedback —</div>
      <h2 id="br-fp-title" className="br-fp-title">
        Your thoughts on this chapter
      </h2>
      <p className="br-fp-sub">Earn ReadCredits for every reaction and piece of feedback you leave.</p>

      <div className="br-fp-emojis" role="group" aria-label="Quick emoji reactions">
        {EMOJIS.map((e) => (
          <button
            key={e}
            type="button"
            className={`br-fp-emoji ${activeEmojis[e] ? 'is-on' : ''}`}
            onClick={() => setActiveEmojis((p) => ({ ...p, [e]: !p[e] }))}
            aria-pressed={!!activeEmojis[e]}
          >
            {e}
          </button>
        ))}
      </div>

      <div className="br-fp-stars" role="group" aria-label="Detailed ratings">
        {STAR_CATEGORIES.map((cat) => {
          const v = stars[cat] ?? 0;
          return (
            <div key={cat} className="br-fp-star-row">
              <span className="br-fp-star-lbl">{cat}</span>
              <div className="br-stars-wrap" role="radiogroup" aria-label={cat}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <span
                    key={n}
                    className={`br-star ${n <= v ? 'is-on' : ''}`}
                    role="radio"
                    aria-checked={n === v}
                    tabIndex={0}
                    onClick={() => setStars((p) => ({ ...p, [cat]: n }))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') setStars((p) => ({ ...p, [cat]: n }));
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="br-fp-yns">
        <div>
          <div className="br-fp-yn-lbl">Would you keep reading?</div>
          <div className="br-fp-yn-row">
            <button
              type="button"
              className={`br-yn is-yes ${keepReading === 'yes' ? 'is-on' : ''}`}
              onClick={() => setKeepReading('yes')}
            >
              Yes
            </button>
            <button
              type="button"
              className={`br-yn is-no ${keepReading === 'no' ? 'is-on' : ''}`}
              onClick={() => setKeepReading('no')}
            >
              No
            </button>
          </div>
        </div>
        <div>
          <div className="br-fp-yn-lbl">Would you buy this book?</div>
          <div className="br-fp-yn-row">
            <button
              type="button"
              className={`br-yn is-yes ${wouldBuy === 'yes' ? 'is-on' : ''}`}
              onClick={() => setWouldBuy('yes')}
            >
              Yes
            </button>
            <button
              type="button"
              className={`br-yn is-no ${wouldBuy === 'no' ? 'is-on' : ''}`}
              onClick={() => setWouldBuy('no')}
            >
              No
            </button>
          </div>
        </div>
      </div>

      <div className="br-fp-tabs" role="tablist" aria-label="Feedback depth">
        {(['react', 'quick', 'deep'] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={tab === t}
            className={`br-fp-tab ${tab === t ? 'is-active' : ''}`}
            onClick={() => setTab(t)}
          >
            {t === 'react' ? 'React' : t === 'quick' ? 'Quick Comment' : 'Deep Thoughts'}{' '}
            <small>+{TAB_RC[t]} RC</small>
          </button>
        ))}
      </div>

      {tab === 'react' ? (
        <div className="br-fp-react-note">
          Your emoji reactions and ratings above count as a React.
        </div>
      ) : tab === 'quick' ? (
        <div>
          <textarea
            className="br-fp-textarea"
            rows={3}
            placeholder="1–3 sentences — what worked, what didn't, what stood out…"
            value={quickText}
            onChange={(e) => setQuickText(e.target.value)}
          />
        </div>
      ) : (
        <div>
          <textarea
            className="br-fp-textarea"
            rows={6}
            placeholder="Write as much as you like. Your voice matters to the writer."
            value={deepText}
            onChange={(e) => setDeepText(e.target.value)}
          />
        </div>
      )}

      <div className="br-fp-foot">
        <span className="br-fp-earn">
          {submitted !== null ? `✓ +${submitted} RC earned!` : `Submit to earn +${TAB_RC[tab]} RC`}
        </span>
        <button
          type="button"
          className="br-btn br-btn-primary"
          onClick={submit}
          disabled={submitted !== null}
        >
          {submitted !== null ? 'Submitted ✓' : 'Submit'}
        </button>
      </div>
    </section>
  );
}
