'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SiteNav } from '@/components/SiteNav';

/**
 * Logged-out /read page: an EMPTY, editable reader-profile builder.
 *
 * The page now starts blank to nudge a visitor into making the profile their
 * own — every field is inline-editable. Nothing is persisted server-side
 * (the marketing site has no backend); when the reader hits "Save profile" we
 * stash the draft in localStorage and demand a sign-in via the mock auth
 * handoff. After they sign in, the draft is theirs to keep.
 *
 * Styling stays on the landing brand: scoped under `.rp-root`, built on the
 * global `--theme-*` tokens (Outfit for UI/body, Playfair Display for display
 * moments, the yellow / ink / paper palette + brand green), with editable
 * affordances (`.ed`, chips, save bar, sign-in modal) layered on top.
 */

const CSS = `
.rp-root{font-family:'Outfit',system-ui,sans-serif;background:var(--theme-page);color:var(--theme-text);min-height:100vh}
.rp-root *,.rp-root *::before,.rp-root *::after{box-sizing:border-box;margin:0;padding:0}
.rp-root a{color:inherit}

.rp-page{max-width:900px;margin:0 auto;padding:clamp(24px,4vw,44px) clamp(20px,4vw,32px) 160px}

/* === Nudge headline === */
.rp-root .nudge{background:var(--theme-accent-soft);border:1px solid color-mix(in srgb, var(--theme-accent-strong) 30%, transparent);border-radius:24px;padding:clamp(28px,4.5vw,52px);margin-bottom:2.5rem}
.rp-root .nudge-title{font-family:'Playfair Display',Georgia,serif;font-weight:700;font-size:clamp(32px,5.5vw,52px);line-height:1.05;letter-spacing:-0.01em;color:var(--theme-text);margin-bottom:0.7rem}
.rp-root .nudge-text{font-size:clamp(16px,1.9vw,19px);color:var(--theme-text-muted);line-height:1.6;max-width:60ch}

/* === Editable fields === */
.rp-root :where(.ed){font:inherit;color:inherit;width:100%;display:block;-webkit-appearance:none;appearance:none;border:none;background:transparent;outline:none;padding:3px 7px;border-radius:8px;box-shadow:inset 0 0 0 1px transparent;transition:box-shadow .15s,background .15s}
.rp-root .ed:hover{box-shadow:inset 0 0 0 1px var(--theme-border)}
.rp-root .ed:focus{box-shadow:inset 0 0 0 1px var(--theme-accent-strong);background:var(--theme-page)}
.rp-root .ed::placeholder{color:var(--theme-text-faint);opacity:.85;font-style:normal;font-weight:400}
.rp-root :where(.ed-area){resize:vertical;min-height:3.4em;line-height:1.6}

/* === Cards: shared parts + brand tint system === */
.rp-root .tint-yellow{background:var(--theme-accent-soft);border:1px solid color-mix(in srgb, var(--theme-accent-strong) 34%, transparent)}
.rp-root .tint-yellow .card-eyebrow{color:var(--theme-accent-strong)}
.rp-root .tint-green{background:#eef8f1;border:1px solid #c2e4d0}
.rp-root .tint-green .card-eyebrow{color:#0c6b4f}
.rp-root .tint-paper{background:var(--theme-page);border:1px solid var(--theme-border)}
.rp-root .tint-paper .card-eyebrow{color:var(--theme-text-muted)}

.rp-root .card-eyebrow{font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:0.7rem}
.rp-root .card-title{font-size:18px;color:var(--theme-text);margin-bottom:4px;line-height:1.4}
.rp-root .card-src{font-size:14px;color:var(--theme-text-faint);margin-bottom:0.6rem}
.rp-root .card-note{font-size:15px;color:var(--theme-text-muted);line-height:1.6;font-style:italic}
.rp-root .card-quote{font-family:'Playfair Display',Georgia,serif;font-size:18px;line-height:1.55;font-style:italic;color:var(--theme-text);margin-bottom:0.4rem}
.rp-root .card-attr{font-size:14px;color:var(--theme-text-faint)}

/* === Hero === */
.rp-root .hero{background:var(--theme-page);border-radius:24px;border:1px solid var(--theme-border-subtle);padding:clamp(28px,4vw,44px);margin-bottom:2rem;box-shadow:0 1px 3px rgba(0,0,0,0.03)}
.rp-root .hero-top{display:flex;gap:2rem;align-items:flex-start;margin-bottom:2rem}
.rp-root .av{width:108px;height:108px;border-radius:50%;border:3px dashed var(--theme-border);background:var(--theme-paper-bg);flex-shrink:0;display:flex;align-items:center;justify-content:center}
.rp-root .av input{width:100%;height:100%;border:none;background:transparent;text-align:center;font-size:52px;outline:none;border-radius:50%;cursor:pointer}
.rp-root .av input:focus{background:var(--theme-page-soft)}
.rp-root .hero-main{flex:1;min-width:0}
.rp-root .display-name{font-family:'Playfair Display',Georgia,serif;font-size:clamp(28px,4vw,40px);font-weight:700;color:var(--theme-text);line-height:1.1;margin-bottom:12px}
.rp-root .bio{font-size:17px;color:var(--theme-text-muted);line-height:1.65}
.rp-root .hq{border-top:1px solid var(--theme-border-subtle);padding-top:1.5rem;margin-top:1.5rem}
.rp-root .hq-lbl{font-size:12px;color:var(--theme-text-faint);letter-spacing:0.08em;text-transform:uppercase;font-weight:600;margin-bottom:10px}
.rp-root .hq-text{font-family:'Playfair Display',Georgia,serif;font-size:clamp(19px,2.3vw,24px);line-height:1.5;color:var(--theme-text);font-style:italic}
.rp-root .hq-attr{font-size:14px;color:var(--theme-text-faint);margin-top:8px}

/* === Credits strip === */
.rp-root .credits{display:grid;grid-template-columns:repeat(4,1fr);background:var(--theme-page);border-radius:18px;border:1px solid var(--theme-border-subtle);overflow:hidden;margin-bottom:2rem}
.rp-root .credit{padding:1.5rem 1rem;text-align:center;border-right:1px solid var(--theme-border-subtle)}
.rp-root .credit:last-child{border-right:none}
.rp-root .credit-icon{font-size:20px;margin-bottom:6px}
.rp-root .credit-num{font-family:'Playfair Display',Georgia,serif;font-size:32px;font-weight:700;color:var(--theme-text-faint)}
.rp-root .credit-label{font-size:11px;color:var(--theme-text-faint);letter-spacing:0.05em;text-transform:uppercase;margin-top:4px}

/* === Sections === */
.rp-root .section{border-radius:18px;border:1px solid var(--theme-border-subtle);padding:clamp(24px,3vw,36px);margin-bottom:2.25rem}
.rp-root .section:last-child{margin-bottom:0}
/* tinted card surfaces so each section lifts off the white page */
.rp-root .tone-yellow{background:var(--theme-accent-soft);border-color:color-mix(in srgb, var(--theme-accent-strong) 26%, transparent)}
.rp-root .tone-green{background:#eef8f1;border-color:#c2e4d0}
.rp-root .tone-paper{background:var(--theme-paper-bg);border-color:color-mix(in srgb, var(--theme-text) 12%, transparent)}
.rp-root .section .sec-head{border-bottom-color:color-mix(in srgb, var(--theme-text) 14%, transparent)}
.rp-root .sec-head{display:flex;align-items:baseline;gap:12px;margin-bottom:1.5rem;padding-bottom:1rem;border-bottom:1px solid var(--theme-border-subtle)}
.rp-root .sec-title{flex:1;font-family:'Playfair Display',Georgia,serif;font-size:23px;font-weight:700;color:var(--theme-text);line-height:1.2}
.rp-root .sec-hint{font-size:13px;color:var(--theme-text-faint)}

/* === Fields / tags / lists === */
.rp-root .field{margin-bottom:1.4rem}
.rp-root .field:last-child{margin-bottom:0}
.rp-root .fl{font-size:12px;color:var(--theme-text-faint);letter-spacing:0.05em;text-transform:uppercase;font-weight:600;margin-bottom:7px}
.rp-root .fv{font-size:17px;color:var(--theme-text);line-height:1.6}
.rp-root .two-col{display:grid;grid-template-columns:1fr 1fr;gap:1.5rem}

/* chips */
.rp-root .tagfield{display:flex;flex-wrap:wrap;gap:7px;align-items:center}
.rp-root .chip{display:inline-flex;align-items:center;gap:8px;font-size:14px;padding:6px 8px 6px 14px;border-radius:999px;background:var(--theme-paper-bg);color:var(--theme-text-soft);border:1px solid var(--theme-border-subtle)}
.rp-root .chip-x{cursor:pointer;border:none;background:transparent;color:var(--theme-text-faint);font-size:16px;line-height:1;padding:0 2px;border-radius:50%}
.rp-root .chip-x:hover{color:var(--theme-text)}
.rp-root .chip-add{font:inherit;font-size:14px;border:1px dashed var(--theme-border);background:transparent;border-radius:999px;padding:6px 16px;outline:none;color:var(--theme-text);min-width:150px}
.rp-root .chip-add:focus{border-color:var(--theme-accent-strong);border-style:solid;background:var(--theme-page-soft)}
.rp-root .chip-add::placeholder{color:var(--theme-text-faint)}

/* card grids */
.rp-root .mem-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem}
.rp-root .mem-card{border-radius:14px;padding:1.4rem}
.rp-root .got-grid{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
.rp-root .got-card{border-radius:14px;padding:1.4rem 1.6rem}
.rp-root .emo-grid{display:grid;grid-template-columns:1fr 1fr;gap:1.25rem}
.rp-root .emo-card{border-radius:14px;padding:1.4rem}
.rp-root .emo-icon{font-size:26px;margin-bottom:8px}
.rp-root .meet-card{border-radius:14px;padding:1.4rem 1.6rem}
.rp-root .haiku{border-radius:14px;padding:1.5rem 1.6rem}
.rp-root .genre-block{border-radius:14px;padding:1.4rem 1.6rem}
.rp-root .genre-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:1.25rem}

/* lists */
.rp-root .booklist{display:flex;flex-direction:column;gap:8px}
.rp-root .booklist-row{display:flex;align-items:center;gap:10px}
.rp-root .bn{font-size:13px;color:var(--theme-text-faint);flex-shrink:0;width:16px;text-align:center}
.rp-root .links-list{display:flex;flex-direction:column;gap:12px}
.rp-root .link-row{display:flex;align-items:center;gap:10px}
.rp-root .link-row .ed{flex:1}
.rp-root .row-x{flex-shrink:0;cursor:pointer;border:none;background:transparent;color:var(--theme-text-faint);font-size:18px;padding:4px 8px;border-radius:8px}
.rp-root .row-x:hover{color:var(--theme-text);background:var(--theme-page-soft)}
.rp-root .add-row{font:inherit;font-size:14px;font-weight:600;color:#0c6b4f;background:transparent;border:none;cursor:pointer;padding:8px 0;margin-top:4px}
.rp-root .add-row:hover{text-decoration:underline}

/* === Save bar === */
.rp-root .savebar{position:fixed;left:0;right:0;bottom:0;display:flex;justify-content:center;padding:18px 16px;background:linear-gradient(to top,var(--theme-page) 55%,transparent);z-index:40;pointer-events:none}
.rp-root .savebar-inner{pointer-events:auto;display:flex;align-items:center;gap:18px;background:var(--theme-page);border:1px solid var(--theme-border-subtle);box-shadow:0 8px 28px rgba(0,0,0,.12);border-radius:999px;padding:10px 10px 10px 24px;max-width:100%}
.rp-root .savebar-hint{font-size:14px;color:var(--theme-text-muted);white-space:nowrap}
.rp-root .save-btn{font:inherit;font-weight:700;font-size:15px;padding:12px 26px;border-radius:999px;border:none;background:#1D9E75;color:#fff;cursor:pointer;white-space:nowrap;transition:background .15s}
.rp-root .save-btn:hover{background:#177e5d}

/* === Sign-in modal === */
.rp-root .modal-scrim{position:fixed;inset:0;background:rgba(20,18,14,0.5);backdrop-filter:blur(2px);z-index:60;display:flex;align-items:center;justify-content:center;padding:24px}
.rp-root .modal{background:var(--theme-page);border-radius:22px;border:1px solid var(--theme-border-subtle);box-shadow:0 24px 70px rgba(0,0,0,.3);max-width:420px;width:100%;padding:clamp(28px,4vw,40px);text-align:center;position:relative}
.rp-root .modal-x{position:absolute;top:16px;right:16px;border:none;background:transparent;font-size:22px;color:var(--theme-text-faint);cursor:pointer;line-height:1;padding:4px 8px;border-radius:8px}
.rp-root .modal-x:hover{color:var(--theme-text);background:var(--theme-page-soft)}
.rp-root .modal-icon{font-size:40px;margin-bottom:14px}
.rp-root .modal-title{font-family:'Playfair Display',Georgia,serif;font-size:26px;font-weight:700;color:var(--theme-text);margin-bottom:10px;line-height:1.2}
.rp-root .modal-text{font-size:15px;color:var(--theme-text-muted);line-height:1.6;margin-bottom:1.6rem}
.rp-root .modal-btn{font:inherit;font-weight:700;font-size:15px;width:100%;padding:14px;border-radius:12px;border:none;cursor:pointer}
.rp-root .modal-btn-primary{background:#1D9E75;color:#fff;margin-bottom:10px}
.rp-root .modal-btn-primary:hover{background:#177e5d}
.rp-root .modal-btn-ghost{background:transparent;color:var(--theme-text-soft);border:1px solid var(--theme-border-subtle)}
.rp-root .modal-btn-ghost:hover{background:var(--theme-page-soft)}
.rp-root .modal-fine{font-size:12px;color:var(--theme-text-faint);margin-top:1.2rem;line-height:1.5}

@media (max-width:760px){
  .rp-page{padding:20px 16px 150px}
  .rp-root .hero-top{flex-direction:column;gap:1.25rem}
  .rp-root .mem-grid,.rp-root .got-grid,.rp-root .emo-grid,.rp-root .two-col,.rp-root .genre-grid{grid-template-columns:1fr}
  .rp-root .credits{grid-template-columns:1fr 1fr}
  .rp-root .credit:nth-child(1),.rp-root .credit:nth-child(2){border-bottom:1px solid var(--theme-border-subtle)}
  .rp-root .credit:nth-child(2){border-right:none}
  .rp-root .savebar-hint{display:none}
}
`;

/* ----------------------------- editable atoms ----------------------------- */
/* Defined at module scope so React keeps their identity across renders
   (inline-defined components would remount on every keystroke and drop focus). */

type TxtProps = {
  value: string;
  onChange: (v: string) => void;
  cls?: string;
  placeholder?: string;
  label: string;
};

function Txt({ value, onChange, cls = '', placeholder, label }: TxtProps) {
  return (
    <input
      className={`ed ${cls}`}
      type="text"
      value={value}
      placeholder={placeholder}
      aria-label={label}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

function Area({ value, onChange, cls = '', placeholder, label }: TxtProps) {
  return (
    <textarea
      className={`ed ed-area ${cls}`}
      value={value}
      placeholder={placeholder}
      aria-label={label}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

function TagField({
  items,
  onAdd,
  onRemove,
  placeholder,
}: {
  items: string[];
  onAdd: (v: string) => void;
  onRemove: (i: number) => void;
  placeholder: string;
}) {
  const [draft, setDraft] = useState('');
  const commit = () => {
    const v = draft.trim();
    if (v) onAdd(v);
    setDraft('');
  };
  return (
    <div className="tagfield">
      {items.map((t, i) => (
        <span className="chip" key={`${t}-${i}`}>
          {t}
          <button
            type="button"
            className="chip-x"
            aria-label={`Remove ${t}`}
            onClick={() => onRemove(i)}
          >
            ×
          </button>
        </span>
      ))}
      <input
        className="chip-add"
        value={draft}
        placeholder={placeholder}
        aria-label={placeholder}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            commit();
          }
        }}
        onBlur={commit}
      />
    </div>
  );
}

/* ------------------------------- state types ------------------------------ */

type LinkItem = { label: string; url: string };

const SCALAR_DEFAULTS = {
  emoji: '',
  name: '',
  bio: '',
  hqText: '',
  hqAttr: '',
  // memorables
  memCharName: '',
  memCharSrc: '',
  memCharNote: '',
  memQuote: '',
  memQuoteAttr: '',
  memWriter: '',
  memWriterSrc: '',
  memWriterNote: '',
  // ones that got away
  gotWorld: '',
  gotWorldSrc: '',
  gotWorldNote: '',
  gotSooner: '',
  gotSoonerSrc: '',
  gotSoonerNote: '',
  gotMeet: '',
  gotMeetSrc: '',
  gotMeetNote: '',
  // undid me
  undoLaugh: '',
  undoLaughSrc: '',
  undoCry: '',
  undoCrySrc: '',
  // sit with anyone
  sitPerson: '',
  haiku: '',
  haikuAttr: '',
  // how I read
  readWhat: '',
  readOften: '',
  readDevice: '',
  readLangs: '',
  // genre passions
  genreName: '',
  genreChar: '',
  genreCharSrc: '',
  genreBook: '',
  genreBookSrc: '',
  genreWriter: '',
  // library
  libBlurb: '',
};

type ScalarKey = keyof typeof SCALAR_DEFAULTS;

const TAG_KEYS = [
  'otherChars',
  'genres',
  'recentAuthors',
  'allTimeAuthors',
  'tbr',
  'adaptations',
] as const;
type TagKey = (typeof TAG_KEYS)[number];

const DRAFT_KEY = 'br_read_profile_draft';

/* -------------------------------- component ------------------------------- */

export function ReaderProfilePage() {
  const router = useRouter();
  const [f, setF] = useState<Record<ScalarKey, string>>({ ...SCALAR_DEFAULTS });
  const [tags, setTags] = useState<Record<TagKey, string[]>>(() =>
    TAG_KEYS.reduce((acc, k) => ({ ...acc, [k]: [] }), {} as Record<TagKey, string[]>),
  );
  const [lastRead, setLastRead] = useState<string[]>(['', '', '']);
  const [allTime, setAllTime] = useState<string[]>(['', '', '']);
  const [links, setLinks] = useState<LinkItem[]>([{ label: '', url: '' }]);
  const [showSignIn, setShowSignIn] = useState(false);

  const set = useCallback(
    (k: ScalarKey) => (v: string) => setF((s) => ({ ...s, [k]: v })),
    [],
  );
  const addTag = (k: TagKey) => (v: string) =>
    setTags((s) => ({ ...s, [k]: [...s[k], v] }));
  const rmTag = (k: TagKey) => (i: number) =>
    setTags((s) => ({ ...s, [k]: s[k].filter((_, idx) => idx !== i) }));

  const onSave = useCallback(() => {
    try {
      localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({ f, tags, lastRead, allTime, links, savedAt: Date.now() }),
      );
    } catch {
      /* storage may be unavailable; sign-in is still demanded */
    }
    setShowSignIn(true);
  }, [f, tags, lastRead, allTime, links]);

  const goSignIn = useCallback(() => {
    // Hand off to the mock auth flow (same origin → localStorage draft survives).
    const qs = new URLSearchParams({ next: '/read', reason: 'save-profile' });
    router.push(`/auth/handoff?${qs.toString()}`);
  }, [router]);

  return (
    <div className="rp-root">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <SiteNav activeHref="/read" />

      <div className="rp-page">
        <div className="nudge">
          <div className="nudge-title">Start your reader profile.</div>
          <div className="nudge-text">
            This page is empty on purpose — make it yours. Add as much or as little as you
            like, then save. You&apos;ll be asked to sign in so we can keep it for you.
          </div>
        </div>

        {/* Hero */}
        <div className="hero">
          <div className="hero-top">
            <div className="av">
              <input
                type="text"
                value={f.emoji}
                placeholder="🙂"
                aria-label="Profile emoji"
                maxLength={2}
                onChange={(e) => set('emoji')(e.target.value)}
              />
            </div>
            <div className="hero-main">
              <Txt
                cls="display-name"
                label="Reader name"
                placeholder="Your reader name"
                value={f.name}
                onChange={set('name')}
              />
              <Area
                cls="bio"
                label="Short bio"
                placeholder="A line or two about you as a reader. When do you read? What pulls you in?"
                value={f.bio}
                onChange={set('bio')}
              />
            </div>
          </div>
          <div className="hq">
            <div className="hq-lbl">The line that was written for me</div>
            <Area
              cls="hq-text"
              label="The line that was written for you"
              placeholder="A sentence from a book that feels like it was written for you…"
              value={f.hqText}
              onChange={set('hqText')}
            />
            <Txt
              cls="hq-attr"
              label="Line attribution"
              placeholder="— character, title (author)"
              value={f.hqAttr}
              onChange={set('hqAttr')}
            />
          </div>
        </div>

        {/* Credits (fresh account = zeros) */}
        <div className="credits">
          <div className="credit"><div className="credit-icon">📚</div><div className="credit-num">0</div><div className="credit-label">Chapters read</div></div>
          <div className="credit"><div className="credit-icon">✍️</div><div className="credit-num">0</div><div className="credit-label">Beta reads</div></div>
          <div className="credit"><div className="credit-icon">🔥</div><div className="credit-num">0</div><div className="credit-label">Chapter streak</div></div>
          <div className="credit"><div className="credit-icon">📌</div><div className="credit-num">0</div><div className="credit-label">Want to read</div></div>
        </div>

        {/* The Memorables */}
        <Section tone="paper" title="The Memorables" hint="The characters, lines and writers you carry with you.">
          <div className="mem-grid">
            <div className="mem-card tint-paper">
              <div className="card-eyebrow">Character</div>
              <Txt cls="card-title" label="Favourite character" placeholder="A character you love" value={f.memCharName} onChange={set('memCharName')} />
              <Txt cls="card-src" label="Character's book" placeholder="From which book?" value={f.memCharSrc} onChange={set('memCharSrc')} />
              <Area cls="card-note" label="Why this character" placeholder="Why them?" value={f.memCharNote} onChange={set('memCharNote')} />
            </div>
            <div className="mem-card tint-yellow">
              <div className="card-eyebrow">Quote</div>
              <Area cls="card-quote" label="Favourite quote" placeholder="A quote that stayed with you…" value={f.memQuote} onChange={set('memQuote')} />
              <Txt cls="card-attr" label="Quote attribution" placeholder="— who said it, where" value={f.memQuoteAttr} onChange={set('memQuoteAttr')} />
            </div>
            <div className="mem-card tint-green">
              <div className="card-eyebrow">Writer</div>
              <Txt cls="card-title" label="Favourite writer" placeholder="A writer you admire" value={f.memWriter} onChange={set('memWriter')} />
              <Txt cls="card-src" label="Writer's works" placeholder="What of theirs?" value={f.memWriterSrc} onChange={set('memWriterSrc')} />
              <Area cls="card-note" label="Why this writer" placeholder="What draws you to them?" value={f.memWriterNote} onChange={set('memWriterNote')} />
            </div>
          </div>
          <div className="field" style={{ marginTop: '1.4rem' }}>
            <div className="fl">Other characters I love</div>
            <TagField items={tags.otherChars} onAdd={addTag('otherChars')} onRemove={rmTag('otherChars')} placeholder="Add a character…" />
          </div>
        </Section>

        {/* The Ones That Got Away */}
        <Section tone="paper" title="The Ones That Got Away" hint="Worlds, books and people you wish you could reach.">
          <div className="got-grid">
            <div className="got-card tint-green">
              <div className="card-eyebrow">If I could time-travel I&apos;d enter the world of…</div>
              <Txt cls="card-title" label="World to enter" placeholder="A book world" value={f.gotWorld} onChange={set('gotWorld')} />
              <Txt cls="card-src" label="World author" placeholder="Author" value={f.gotWorldSrc} onChange={set('gotWorldSrc')} />
              <Area cls="card-note" label="Why this world" placeholder="Why there?" value={f.gotWorldNote} onChange={set('gotWorldNote')} />
            </div>
            <div className="got-card tint-yellow">
              <div className="card-eyebrow">A book I wish I had discovered sooner…</div>
              <Txt cls="card-title" label="Book discovered late" placeholder="A book" value={f.gotSooner} onChange={set('gotSooner')} />
              <Txt cls="card-src" label="Book author" placeholder="Author" value={f.gotSoonerSrc} onChange={set('gotSoonerSrc')} />
              <Area cls="card-note" label="Note" placeholder="Why?" value={f.gotSoonerNote} onChange={set('gotSoonerNote')} />
            </div>
            <div className="got-card tint-paper">
              <div className="card-eyebrow">A character I wish I could meet…</div>
              <Txt cls="card-title" label="Character to meet" placeholder="A character" value={f.gotMeet} onChange={set('gotMeet')} />
              <Txt cls="card-src" label="Character's book" placeholder="From which book?" value={f.gotMeetSrc} onChange={set('gotMeetSrc')} />
              <Area cls="card-note" label="Note" placeholder="What would you ask them?" value={f.gotMeetNote} onChange={set('gotMeetNote')} />
            </div>
          </div>
        </Section>

        {/* Books That Undid Me */}
        <Section tone="green" title="Books That Undid Me" hint="The ones that got a real reaction out of you.">
          <div className="emo-grid">
            <div className="emo-card tint-yellow">
              <div className="emo-icon">😂</div>
              <div className="card-eyebrow">Made me laugh out loud</div>
              <Txt cls="card-title" label="Funniest book" placeholder="A book" value={f.undoLaugh} onChange={set('undoLaugh')} />
              <Txt cls="card-src" label="Author" placeholder="Author" value={f.undoLaughSrc} onChange={set('undoLaughSrc')} />
            </div>
            <div className="emo-card tint-paper">
              <div className="emo-icon">😭</div>
              <div className="card-eyebrow">Made me cry</div>
              <Txt cls="card-title" label="Saddest book" placeholder="A book" value={f.undoCry} onChange={set('undoCry')} />
              <Txt cls="card-src" label="Author" placeholder="Author" value={f.undoCrySrc} onChange={set('undoCrySrc')} />
            </div>
          </div>
        </Section>

        {/* If I Could Sit With Anyone */}
        <Section tone="yellow" title="If I Could Sit With Anyone" hint="The literary company you&apos;d keep.">
          <div className="field">
            <div className="meet-card tint-paper">
              <div className="card-eyebrow">The literary person I&apos;d most want to meet</div>
              <Area cls="fv" label="Person you'd want to meet" placeholder="Who, and what you&apos;d want to say or ask…" value={f.sitPerson} onChange={set('sitPerson')} />
            </div>
          </div>
          <div className="field">
            <div className="fl">A poem or haiku I love</div>
            <div className="haiku tint-green">
              <Area cls="card-quote" label="A poem you love" placeholder="A few lines you return to…" value={f.haiku} onChange={set('haiku')} />
              <Txt cls="card-attr" label="Poem attribution" placeholder="— poet" value={f.haikuAttr} onChange={set('haikuAttr')} />
            </div>
          </div>
        </Section>

        {/* How I Read */}
        <Section tone="green" title="How I Read" hint="Your reading habits at a glance.">
          <div className="two-col">
            <div className="field"><div className="fl">What I most often read</div><Txt cls="fv" label="What you read" placeholder="e.g. Literary fiction, fantasy" value={f.readWhat} onChange={set('readWhat')} /></div>
            <div className="field"><div className="fl">How often</div><Txt cls="fv" label="How often you read" placeholder="e.g. Most evenings" value={f.readOften} onChange={set('readOften')} /></div>
            <div className="field"><div className="fl">My favourite device</div><Txt cls="fv" label="Favourite device" placeholder="e.g. A real book. Always." value={f.readDevice} onChange={set('readDevice')} /></div>
            <div className="field"><div className="fl">Languages</div><Txt cls="fv" label="Languages you read in" placeholder="e.g. English, French" value={f.readLangs} onChange={set('readLangs')} /></div>
          </div>
          <div className="field">
            <div className="fl">Favourite genres</div>
            <TagField items={tags.genres} onAdd={addTag('genres')} onRemove={rmTag('genres')} placeholder="Add a genre…" />
          </div>
        </Section>

        {/* My Favourite Authors */}
        <Section tone="yellow" title="My Favourite Authors">
          <div className="two-col">
            <div className="field">
              <div className="fl">Recently reading</div>
              <TagField items={tags.recentAuthors} onAdd={addTag('recentAuthors')} onRemove={rmTag('recentAuthors')} placeholder="Add an author…" />
            </div>
            <div className="field">
              <div className="fl">All-time favourites</div>
              <TagField items={tags.allTimeAuthors} onAdd={addTag('allTimeAuthors')} onRemove={rmTag('allTimeAuthors')} placeholder="Add an author…" />
            </div>
          </div>
        </Section>

        {/* My Genre Passions */}
        <Section tone="green" title="My Genre Passions" hint="Go deep on a genre you love.">
          <div className="genre-block tint-paper">
            <div className="field" style={{ marginBottom: '1.2rem' }}>
              <div className="fl">Genre</div>
              <Txt cls="card-title" label="Genre name" placeholder="e.g. Science fiction" value={f.genreName} onChange={set('genreName')} />
            </div>
            <div className="genre-grid">
              <div><div className="fl">Favourite character</div><Txt cls="fv" label="Genre favourite character" placeholder="Character" value={f.genreChar} onChange={set('genreChar')} /><Txt cls="card-src" label="Character source" placeholder="From…" value={f.genreCharSrc} onChange={set('genreCharSrc')} /></div>
              <div><div className="fl">Favourite book</div><Txt cls="fv" label="Genre favourite book" placeholder="Book" value={f.genreBook} onChange={set('genreBook')} /><Txt cls="card-src" label="Book author" placeholder="Author" value={f.genreBookSrc} onChange={set('genreBookSrc')} /></div>
              <div><div className="fl">Favourite writer</div><Txt cls="fv" label="Genre favourite writer" placeholder="Writer" value={f.genreWriter} onChange={set('genreWriter')} /></div>
            </div>
          </div>
        </Section>

        {/* Library */}
        <Section tone="yellow" title="What You&apos;d Find in My Library">
          <div className="field">
            <Area cls="fv" label="Your library" placeholder="Describe your shelves — what&apos;s on them, what&apos;s dog-eared, what you&apos;re heavy and light on." value={f.libBlurb} onChange={set('libBlurb')} />
          </div>
          <div className="field">
            <div className="fl">What&apos;s on my TBR</div>
            <TagField items={tags.tbr} onAdd={addTag('tbr')} onRemove={rmTag('tbr')} placeholder="Add a book…" />
          </div>
        </Section>

        {/* Books */}
        <Section tone="green" title="Last Three Read & All-Time Favourites">
          <div className="two-col">
            <div>
              <div className="fl">Last three read</div>
              <div className="booklist">
                {lastRead.map((v, i) => (
                  <div className="booklist-row" key={`lr-${i}`}>
                    <span className="bn">{i + 1}</span>
                    <input
                      className="ed"
                      value={v}
                      placeholder="Title — Author"
                      aria-label={`Last read ${i + 1}`}
                      onChange={(e) =>
                        setLastRead((s) => s.map((x, idx) => (idx === i ? e.target.value : x)))
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="fl">All-time favourites</div>
              <div className="booklist">
                {allTime.map((v, i) => (
                  <div className="booklist-row" key={`at-${i}`}>
                    <span className="bn">{i + 1}</span>
                    <input
                      className="ed"
                      value={v}
                      placeholder="Title — Author"
                      aria-label={`All-time favourite ${i + 1}`}
                      onChange={(e) =>
                        setAllTime((s) => s.map((x, idx) => (idx === i ? e.target.value : x)))
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* Adaptations */}
        <Section tone="yellow" title="When the Book Became a Film">
          <div className="field">
            <div className="fl">Favourite adaptations</div>
            <TagField items={tags.adaptations} onAdd={addTag('adaptations')} onRemove={rmTag('adaptations')} placeholder="Add an adaptation…" />
          </div>
        </Section>

        {/* Links */}
        <Section tone="green" title="Other Places You Can Find Me">
          <div className="links-list">
            {links.map((lnk, i) => (
              <div className="link-row" key={`lnk-${i}`}>
                <input
                  className="ed"
                  value={lnk.label}
                  placeholder="Label (e.g. My Goodreads)"
                  aria-label={`Link ${i + 1} label`}
                  onChange={(e) =>
                    setLinks((s) => s.map((x, idx) => (idx === i ? { ...x, label: e.target.value } : x)))
                  }
                />
                <input
                  className="ed"
                  value={lnk.url}
                  placeholder="https://…"
                  aria-label={`Link ${i + 1} URL`}
                  onChange={(e) =>
                    setLinks((s) => s.map((x, idx) => (idx === i ? { ...x, url: e.target.value } : x)))
                  }
                />
                {links.length > 1 && (
                  <button
                    type="button"
                    className="row-x"
                    aria-label={`Remove link ${i + 1}`}
                    onClick={() => setLinks((s) => s.filter((_, idx) => idx !== i))}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            className="add-row"
            onClick={() => setLinks((s) => [...s, { label: '', url: '' }])}
          >
            + Add another place
          </button>
        </Section>
      </div>

      {/* Save bar */}
      <div className="savebar">
        <div className="savebar-inner">
          <span className="savebar-hint">Looking good — ready to make it official?</span>
          <button type="button" className="save-btn" onClick={onSave}>
            Save profile
          </button>
        </div>
      </div>

      {/* Sign-in demand */}
      {showSignIn && (
        <div
          className="modal-scrim"
          role="dialog"
          aria-modal="true"
          aria-labelledby="rp-signin-title"
          onClick={() => setShowSignIn(false)}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="modal-x"
              aria-label="Close"
              onClick={() => setShowSignIn(false)}
            >
              ×
            </button>
            <div className="modal-icon" aria-hidden="true">🔖</div>
            <div className="modal-title" id="rp-signin-title">Sign in to save your profile</div>
            <div className="modal-text">
              Create a free BetweenReads account (or sign in) to publish your reader profile and
              start beta reading. We&apos;ve kept your draft — nothing you typed is lost.
            </div>
            <button type="button" className="modal-btn modal-btn-primary" onClick={goSignIn}>
              Sign in &amp; save
            </button>
            <button type="button" className="modal-btn modal-btn-ghost" onClick={() => setShowSignIn(false)}>
              Keep editing
            </button>
            <div className="modal-fine">Free to join. Your profile stays private until you choose to share it.</div>
          </div>
        </div>
      )}
    </div>
  );
}

function Section({
  title,
  hint,
  tone = 'paper',
  children,
}: {
  title: string;
  hint?: string;
  tone?: 'yellow' | 'green' | 'paper';
  children: React.ReactNode;
}) {
  return (
    <div className={`section tone-${tone}`}>
      <div className="sec-head">
        <span className="sec-title">{title}</span>
        {hint && <span className="sec-hint">{hint}</span>}
      </div>
      {children}
    </div>
  );
}
