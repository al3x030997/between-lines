'use client';

import { useState } from 'react';
import type { Chapter } from '@/lib/mock-books';

type Audience = 'beta' | 'pr' | 'wp' | 'rp';

const AUDIENCE_OPTS: Array<{ id: Audience; icon: string; lbl: string }> = [
  { id: 'beta', icon: '🔒', lbl: 'Beta' },
  { id: 'pr', icon: '👁️', lbl: 'PowerReaders' },
  { id: 'wp', icon: '✍️', lbl: 'Writer Pod' },
  { id: 'rp', icon: '📖', lbl: 'Reader Pod' },
];

const CAST: Array<{ icon: string; name: string; chapters: string; visibility: 'public' | 'private'; note: string }> = [
  { icon: '🪞', name: 'Eleanor Marsh', chapters: 'Ch. 1 3 5 7 9 11 13 14', visibility: 'public', note: 'The housekeeper. Thirty years of secrets.' },
  { icon: '📜', name: 'The Colonel', chapters: 'Ch. 2 6 10 12', visibility: 'private', note: 'Private — notes only' },
  { icon: '✉️', name: 'Clara (voice in letters)', chapters: 'Ch. 1 4 8 13', visibility: 'public', note: 'She never appears. Only her letters do.' },
];

type Props = {
  chapter: Chapter | null;
  onCancel: () => void;
};

export function ChapterSettingsTab({ chapter, onCancel }: Props) {
  const [audience, setAudience] = useState<Set<Audience>>(new Set(['beta', 'pr']));
  const [castOpen, setCastOpen] = useState(true);

  const toggle = (a: Audience) => {
    setAudience((prev) => {
      const next = new Set(prev);
      if (next.has(a)) next.delete(a);
      else next.add(a);
      return next;
    });
  };

  return (
    <>
      <div className="br-write-settings">
        <div className="br-write-section-card">
          <div className="br-write-section-lbl">Chapter properties</div>
          <div className="br-write-field">
            <div className="br-write-field-label">Chapter title</div>
            <input type="text" className="br-write-input" defaultValue={chapter?.title ?? 'New chapter'} />
          </div>
          <div className="br-pf-two-col">
            <div className="br-write-field">
              <div className="br-write-field-label">Stage</div>
              <select className="br-write-select" defaultValue="draft">
                <option value="draft">Draft</option>
                <option value="editing">Editing</option>
                <option value="final">Final</option>
              </select>
            </div>
            <div className="br-write-field">
              <div className="br-write-field-label">Published</div>
              <select className="br-write-select" defaultValue="no">
                <option value="no">No — draft only</option>
                <option value="yes">Yes — visible to audience</option>
              </select>
            </div>
          </div>
          <div className="br-write-field" style={{ marginTop: '0.5rem' }}>
            <div className="br-write-field-label">Audience for this chapter</div>
            <div className="br-write-vis-grid">
              {AUDIENCE_OPTS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  className={`br-write-vis-opt ${audience.has(opt.id) ? 'is-on' : ''}`}
                  onClick={() => toggle(opt.id)}
                >
                  <div className="br-write-vis-opt-icon">{opt.icon}</div>
                  <div className="br-write-vis-opt-lbl">{opt.lbl}</div>
                </button>
              ))}
            </div>
            <div style={{ fontSize: 11, color: 'var(--v11-ink-trace)', marginTop: 8 }}>
              Chapters 1–3 are always visible to all signed-in members. Audience applies from Chapter 4.
            </div>
          </div>
        </div>

        <div className="br-write-section-card">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.75rem',
            }}
          >
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--v11-ink)', marginBottom: 2 }}>Cast list</div>
              <div style={{ fontSize: 11, color: 'var(--v11-ink-trace)' }}>Optional — tag characters in this chapter</div>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <button type="button" className="br-write-btn-sm">✦ Auto-extract</button>
              <label className="br-pf-toggle">
                <input type="checkbox" defaultChecked={castOpen} onChange={(e) => setCastOpen(e.target.checked)} />
                <span className="br-pf-toggle-slider" />
              </label>
            </div>
          </div>
          {castOpen ? (
            <>
              <div className="br-write-callout">
                <div className="br-write-callout-lbl">Only on BetweenReads</div>
                <div className="br-write-callout-title">Your cast list — a living dramatis personae</div>
                <div className="br-write-callout-body">Private notes are your writing room. Readers see only what you choose.</div>
              </div>
              <ul style={{ listStyle: 'none' }}>
                {CAST.map((c) => (
                  <li key={c.name} className="br-write-cast-item">
                    <div className="br-write-cast-avatar" aria-hidden="true">{c.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div className="br-write-cast-name">{c.name}</div>
                      <div className="br-write-cast-ch">{c.chapters}</div>
                      <div className={c.visibility === 'public' ? 'br-write-cast-vp' : 'br-write-cast-vn'}>
                        {c.visibility === 'public' ? `Visible — "${c.note}"` : c.note}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <span style={{ fontSize: 15, color: c.visibility === 'public' ? 'var(--br-mint-ink)' : 'var(--v11-ink-trace)' }}>
                        {c.visibility === 'public' ? '✓' : '○'}
                      </span>
                      <button type="button" className="br-write-btn-sm">Edit</button>
                    </div>
                  </li>
                ))}
              </ul>
              <div
                style={{
                  background: 'var(--br-panel-warm)',
                  borderRadius: 10,
                  padding: '1rem',
                  marginTop: '0.85rem',
                }}
              >
                <div className="br-write-field-label">Add a character</div>
                <div className="br-pf-two-col" style={{ marginTop: 6 }}>
                  <div className="br-write-field">
                    <div className="br-write-field-label">Name</div>
                    <input type="text" className="br-write-input" placeholder="Character name" />
                  </div>
                  <div className="br-write-field">
                    <div className="br-write-field-label">Show readers?</div>
                    <select className="br-write-select" defaultValue="namedesc">
                      <option value="namedesc">Name + description</option>
                      <option value="name">Name only</option>
                      <option value="private">No — private</option>
                    </select>
                  </div>
                </div>
                <div className="br-write-field">
                  <div className="br-write-field-label">Private notes</div>
                  <textarea className="br-write-textarea" rows={3} placeholder="Continuity, backstory..." />
                </div>
                <div className="br-write-field">
                  <div className="br-write-field-label">What readers see</div>
                  <input type="text" className="br-write-input" placeholder="One line..." />
                </div>
                <button type="button" className="br-write-btn-sm" style={{ marginTop: 4 }}>Add to cast</button>
              </div>
            </>
          ) : null}
        </div>

        <div className="br-write-section-card">
          <div className="br-write-section-lbl">SecureBetaReads</div>
          <div className="br-pf-toggle-row">
            <div>
              <div className="br-pf-toggle-label">Include in beta reading</div>
              <div className="br-pf-toggle-sub">Available to your beta readers</div>
            </div>
            <label className="br-pf-toggle">
              <input type="checkbox" defaultChecked />
              <span className="br-pf-toggle-slider" />
            </label>
          </div>
          <div className="br-pf-toggle-row">
            <div>
              <div className="br-pf-toggle-label">Submit to BetweenLines Journal</div>
              <div className="br-pf-toggle-sub">Editorial consideration — $5 entry fee</div>
            </div>
            <label className="br-pf-toggle">
              <input type="checkbox" />
              <span className="br-pf-toggle-slider" />
            </label>
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
