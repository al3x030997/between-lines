'use client';

import { useState } from 'react';
import type { Chapter } from '@/lib/mock-books';
import type { WorkSummary } from '@/lib/mock-writers';

type Audience = 'beta' | 'pr' | 'wp' | 'rp';

const GENRES = [
  { id: 'litfic', label: '📖 Literary Fiction' },
  { id: 'romance', label: '💕 Romance' },
  { id: 'fantasy', label: '🔮 Fantasy' },
  { id: 'thriller', label: '⚡ Thriller' },
  { id: 'mystery', label: '🔍 Mystery' },
  { id: 'scifi', label: '🪐 Sci-fi' },
  { id: 'horror', label: '👻 Horror' },
  { id: 'historical', label: '🏛️ Historical Fiction' },
  { id: 'escapist', label: '🌍 Escapist' },
  { id: 'feelgood', label: '😊 Feel-good' },
  { id: 'ya', label: '🧒 Young Adult' },
  { id: 'classic', label: '📚 Classic' },
];

const MOODS = [
  { id: 'reflective', label: '💭 Reflective' },
  { id: 'calming', label: '🌿 Calming' },
  { id: 'intense', label: '🔥 Intense' },
  { id: 'feelgood', label: '😊 Feel-good' },
  { id: 'slow', label: '🕯️ Slow Burn' },
  { id: 'funny', label: '😂 Funny' },
  { id: 'scary', label: '😨 Scary' },
  { id: 'upbeat', label: '☀️ Upbeat' },
  { id: 'escapist2', label: '🌍 Escapist' },
];

const AUDIENCE_OPTS: Array<{ id: Audience; icon: string; lbl: string }> = [
  { id: 'beta', icon: '🔒', lbl: 'Beta' },
  { id: 'pr', icon: '👁️', lbl: 'PowerReaders' },
  { id: 'wp', icon: '✍️', lbl: 'Writer Pod' },
  { id: 'rp', icon: '📖', lbl: 'Reader Pod' },
];

type Props = {
  work: WorkSummary | undefined;
  chapters: Chapter[];
  onCancel: () => void;
};

type ChAudience = Record<number, Set<Audience>>;

export function NovelSettingsTab({ work, chapters, onCancel }: Props) {
  const [genre, setGenre] = useState<string>('litfic');
  const [moods, setMoods] = useState<Set<string>>(new Set(['reflective', 'calming', 'intense']));
  const [defaultAudience, setDefaultAudience] = useState<Set<Audience>>(new Set(['beta', 'pr']));

  const [chAudience, setChAudience] = useState<ChAudience>(() => {
    const out: ChAudience = {};
    chapters.forEach((c) => {
      const set = new Set<Audience>();
      if (c.num <= 3) {
        set.add('beta');
        set.add('pr');
      } else if (c.num <= 9) {
        set.add('pr');
      } else {
        set.add('beta');
      }
      out[c.num] = set;
    });
    return out;
  });

  const toggleMood = (id: string) => {
    setMoods((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (next.size >= 3) return prev; // max 3
        next.add(id);
      }
      return next;
    });
  };

  const toggleDefaultAudience = (a: Audience) => {
    setDefaultAudience((prev) => {
      const next = new Set(prev);
      if (next.has(a)) next.delete(a);
      else next.add(a);
      return next;
    });
  };

  const toggleChCell = (n: number, a: Audience) => {
    setChAudience((prev) => {
      const cur = new Set(prev[n] ?? []);
      if (cur.has(a)) cur.delete(a);
      else cur.add(a);
      return { ...prev, [n]: cur };
    });
  };

  return (
    <>
      <div className="br-write-settings">
        <div className="br-write-section-card">
          <div className="br-write-section-lbl">Work details</div>
          <div className="br-write-field">
            <div className="br-write-field-label">Title</div>
            <input type="text" className="br-write-input" defaultValue={work?.title ?? ''} />
          </div>
          <div className="br-pf-two-col">
            <div className="br-write-field">
              <div className="br-write-field-label">Format</div>
              <select className="br-write-select" defaultValue="novel">
                <option>Microfiction</option>
                <option>Flash Fiction</option>
                <option>Short Story</option>
                <option>Novelette</option>
                <option>Novella</option>
                <option value="novel">Novel</option>
                <option>Poetry</option>
              </select>
            </div>
            <div className="br-write-field">
              <div className="br-write-field-label">Stage</div>
              <select className="br-write-select" defaultValue={(work?.stage ?? 'Editing').toLowerCase()}>
                <option value="drafting">Drafting</option>
                <option value="editing">Editing</option>
                <option value="complete">Complete</option>
              </select>
            </div>
          </div>
          <div className="br-write-field">
            <div className="br-write-field-label">Genre</div>
            <div className="br-write-genre-grid">
              {GENRES.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  className={`br-write-genre-btn ${genre === g.id ? 'is-on' : ''}`}
                  onClick={() => setGenre(g.id)}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </div>
          <div className="br-write-field" style={{ marginTop: '1rem' }}>
            <div className="br-write-field-label">
              Mood <span style={{ color: 'var(--v11-ink-trace)', fontSize: 9, textTransform: 'none', letterSpacing: 0 }}>Up to 3</span>
            </div>
            <div className="br-write-genre-grid">
              {MOODS.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  className={`br-write-genre-btn ${moods.has(m.id) ? 'is-on' : ''}`}
                  onClick={() => toggleMood(m.id)}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="br-write-section-card">
          <div className="br-write-section-lbl">How readers find you</div>
          <div className="br-write-field">
            <div className="br-write-field-label">Your pitch to readers</div>
            <textarea
              className="br-write-textarea"
              rows={3}
              defaultValue="A housekeeper in a crumbling country house discovers a box of letters that reframes everything she thought she knew about the family she served for thirty years."
            />
          </div>
          <div className="br-write-field">
            <div className="br-write-field-label">Back cover blurb</div>
            <textarea
              className="br-write-textarea"
              rows={5}
              defaultValue="Eleanor Marsh has given thirty years to Ashwick Hall. She knows every room, every creak, every silence. Then, behind a loose panel in the east corridor, she finds a box of letters addressed to no one she recognises. And everything she thought she understood begins to come apart."
            />
          </div>
        </div>

        <div className="br-write-section-card">
          <div className="br-write-section-lbl">Author</div>
          <div className="br-pf-two-col">
            <div className="br-write-field">
              <div className="br-write-field-label">Display name / pen name</div>
              <input type="text" className="br-write-input" defaultValue="MidnightDraftsman" />
            </div>
            <div className="br-write-field">
              <div className="br-write-field-label">Author tagline</div>
              <input
                type="text"
                className="br-write-input"
                defaultValue="Writing literary fiction at midnight, mostly."
              />
            </div>
          </div>
        </div>

        <div className="br-write-section-card">
          <div className="br-write-section-lbl">Novel visibility</div>
          <div className="br-write-field">
            <div className="br-write-field-label">Published</div>
            <select className="br-write-select" defaultValue="yes" style={{ marginBottom: '0.75rem' }}>
              <option value="no">No — private, not visible to anyone</option>
              <option value="yes">Yes — visible to audience below</option>
            </select>
          </div>
          <div className="br-write-field">
            <div className="br-write-field-label">
              Default audience{' '}
              <span style={{ color: 'var(--v11-ink-trace)', fontSize: 9, textTransform: 'none', letterSpacing: 0 }}>
                Applied to all chapters unless overridden in Chapter Settings
              </span>
            </div>
            <div className="br-write-vis-grid">
              {AUDIENCE_OPTS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  className={`br-write-vis-opt ${defaultAudience.has(opt.id) ? 'is-on' : ''}`}
                  onClick={() => toggleDefaultAudience(opt.id)}
                >
                  <div className="br-write-vis-opt-icon">{opt.icon}</div>
                  <div className="br-write-vis-opt-lbl">{opt.lbl}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="br-write-section-card">
          <div className="br-write-section-lbl">Chapter audience</div>
          <div style={{ fontSize: 12, color: 'var(--v11-ink-trace)', marginBottom: '1rem' }}>
            Who can read each chapter. Click a dot to toggle.
          </div>
          <table className="br-write-audience-table">
            <thead>
              <tr style={{ borderBottom: '0.5px solid var(--br-border-hair)' }}>
                <th>Chapter</th>
                <th className="is-center is-beta">Beta</th>
                <th className="is-center is-pr">PowerReaders</th>
                <th className="is-center is-wp">Writer Pod</th>
                <th className="is-center is-rp">Reader Pod</th>
              </tr>
            </thead>
            <tbody>
              {chapters.map((c) => {
                const set = chAudience[c.num] ?? new Set<Audience>();
                return (
                  <tr key={c.num}>
                    <td>{c.num}. {c.title}</td>
                    {(['beta', 'pr', 'wp', 'rp'] as Audience[]).map((a) => (
                      <td key={a} className="is-center">
                        <span
                          className={`br-write-aud-dot ${set.has(a) ? `is-on is-${a}` : ''}`}
                          onClick={() => toggleChCell(c.num, a)}
                          role="button"
                          tabIndex={0}
                        >
                          {set.has(a) ? '●' : '○'}
                        </span>
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="br-write-section-card">
          <div className="br-write-section-lbl">Storefront &amp; distribution</div>
          <div className="br-pf-toggle-row">
            <div>
              <div className="br-pf-toggle-label">List on BetweenReads storefront</div>
              <div className="br-pf-toggle-sub">Sell your work — you keep 80%</div>
            </div>
            <label className="br-pf-toggle"><input type="checkbox" /><span className="br-pf-toggle-slider" /></label>
          </div>
          <div className="br-pf-toggle-row">
            <div>
              <div className="br-pf-toggle-label">Include in BetweenReads Magazine pool</div>
              <div className="br-pf-toggle-sub">
                Platform may select chapters for the curated reader magazine — you earn a revenue share
              </div>
            </div>
            <label className="br-pf-toggle"><input type="checkbox" /><span className="br-pf-toggle-slider" /></label>
          </div>
          <div className="br-pf-toggle-row">
            <div>
              <div className="br-pf-toggle-label">SecureBetaReads</div>
              <div className="br-pf-toggle-sub">Watermarked · Copy disabled</div>
            </div>
            <label className="br-pf-toggle"><input type="checkbox" defaultChecked /><span className="br-pf-toggle-slider" /></label>
          </div>
          <div className="br-pf-toggle-row">
            <div>
              <div className="br-pf-toggle-label">Accept new beta reader requests</div>
              <div className="br-pf-toggle-sub">Readers matching your genre can request access</div>
            </div>
            <label className="br-pf-toggle"><input type="checkbox" defaultChecked /><span className="br-pf-toggle-slider" /></label>
          </div>
        </div>
      </div>
      <div className="br-write-settings-foot">
        <button type="button" className="br-write-btn-sm" onClick={onCancel}>Cancel</button>
        <button type="button" className="br-write-btn-sm is-primary">Save</button>
      </div>
    </>
  );
}
