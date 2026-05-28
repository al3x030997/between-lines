import Link from 'next/link';

const deskMix = [
  {
    category: 'Literary fiction',
    state: 'Crowded',
    note: 'Strong supply of quiet, character-led work.',
    count: '42',
    tone: 'crowded',
  },
  {
    category: 'Short stories',
    state: 'Crowded',
    note: 'Many complete pieces are already in the desk stack.',
    count: '36',
    tone: 'crowded',
  },
  {
    category: 'Poetry',
    state: 'Balanced',
    note: 'Open to distinctive voice and tight editorial shape.',
    count: '18',
    tone: 'balanced',
  },
  {
    category: 'Speculative fiction',
    state: 'Wanted',
    note: 'Especially literary sci-fi, magical realism, and near future.',
    count: '9',
    tone: 'wanted',
  },
  {
    category: 'YA and children',
    state: 'Wanted',
    note: 'We need more age-aware, polished work for younger readers.',
    count: '6',
    tone: 'wanted',
  },
  {
    category: 'Romance / romantasy',
    state: 'Wanted',
    note: 'Warm, emotionally serious, non-explicit submissions welcome.',
    count: '5',
    tone: 'wanted',
  },
  {
    category: 'Thriller / mystery',
    state: 'Wanted',
    note: 'Clean pacing, strong premise, and satisfying reader pull.',
    count: '4',
    tone: 'wanted',
  },
  {
    category: 'Illustration',
    state: 'Wanted',
    note: 'Standalone art, covers, and story illustration are underfilled.',
    count: '3',
    tone: 'wanted',
  },
];

const steps = [
  {
    label: 'Prepare',
    title: 'Choose work that is clean and developed.',
    body: 'Submit a chapter, story, poem, or illustration that already meets the platform quality standard.',
  },
  {
    label: 'Submit',
    title: 'Send it to the editorial desk.',
    body: 'Journal submission is optional and costs $2 per work when the issue opens for entries.',
  },
  {
    label: 'Review',
    title: 'Editors select for quality and fit.',
    body: 'Reader Picks can surface work, but popularity and payment never buy placement.',
  },
  {
    label: 'Publish',
    title: 'Selected work appears in BetweenLines.',
    body: 'Rights remain yours. The journal receives first serial rights only upon acceptance and publication.',
  },
];

export default function BetweenLinesPage() {
  return (
    <main className="bl-journal-page">
      <style>{JOURNAL_CSS}</style>

      <header className="blj-topbar" aria-label="BetweenLines navigation">
        <Link className="blj-brand" href="/read" aria-label="Back to BetweenReads">
          Between<strong>Reads</strong>
        </Link>
        <nav className="blj-mini-nav" aria-label="Journal page links">
          <Link href="/read">Read</Link>
          <Link href="/write">Write</Link>
          <Link href="/faq#writers">FAQ</Link>
        </nav>
      </header>

      <section className="blj-hero" aria-labelledby="betweenlines-title">
        <div className="blj-hero-copy">
          <p className="blj-kicker">BetweenLines Journal / Open call</p>
          <h1 id="betweenlines-title">
            A monthly literary journal for work worth reading slowly.
          </h1>
          <p className="blj-lede">
            BetweenLines curates the finest writing and illustration on BetweenReads:
            reader picks, distinct voices, diverse genres, and emerging authors ready
            for a quiet hour with serious readers.
          </p>

          <div className="blj-actions" aria-label="Journal actions">
            <Link className="blj-primary" href="/write?tab=journal">
              Submit your work
              <span aria-hidden="true">-&gt;</span>
            </Link>
            <Link className="blj-secondary" href="/faq#writers">
              How selection works
            </Link>
          </div>

          <dl className="blj-facts" aria-label="Journal facts">
            <div>
              <dt>Entry</dt>
              <dd>$2 per submission</dd>
            </div>
            <div>
              <dt>Cadence</dt>
              <dd>Monthly issue</dd>
            </div>
            <div>
              <dt>Selection</dt>
              <dd>Editorial fit</dd>
            </div>
          </dl>
        </div>

        <aside className="blj-issue" aria-label="BetweenLines issue preview">
          <div className="blj-cover" aria-hidden="true">
            <div className="blj-cover-rule" />
            <div className="blj-cover-top">
              <span>BetweenReads</span>
              <span>No. 01</span>
            </div>
            <div className="blj-cover-title">
              <span>Between</span>
              <strong>Lines</strong>
            </div>
            <p>Fiction / Poetry / Illustration</p>
            <div className="blj-cover-bottom">
              <span>Inaugural issue</span>
              <span>Spring 2026</span>
            </div>
          </div>
          <div className="blj-note">
            <span>Editors are reading for:</span>
            <strong>voice, control, originality, and a reason to turn the page.</strong>
          </div>
        </aside>
      </section>

      <section className="blj-section blj-about" aria-labelledby="what-is-betweenlines">
        <div>
          <p className="blj-kicker">What it is</p>
          <h2 id="what-is-betweenlines">A curated issue, not an algorithmic feed.</h2>
        </div>
        <div className="blj-about-grid">
          <article>
            <h3>For writers</h3>
            <p>
              Submit polished work for editorial consideration. If selected, your
              piece appears in the monthly issue and you share in that issue&apos;s
              new subscription revenue after platform costs.
            </p>
          </article>
          <article>
            <h3>For readers</h3>
            <p>
              Read a monthly drop of emerging fiction, poetry, and illustration
              chosen for quality, range, and fit. Early Discoverers and Deep
              Thoughts readers may help screen selections.
            </p>
          </article>
          <article>
            <h3>For illustrators</h3>
            <p>
              Standalone art, story illustration, and cover-ready work are first
              class submissions. The journal needs visual voices alongside prose.
            </p>
          </article>
        </div>
      </section>

      <section className="blj-section blj-desk" aria-labelledby="journal-desk-title">
        <div className="blj-desk-head">
          <div>
            <p className="blj-kicker">Current editorial desk</p>
            <h2 id="journal-desk-title">Where your odds may be stronger.</h2>
          </div>
          <p>
            These are curated launch signals, not live totals. Use them to read
            the room: crowded categories need exceptional polish; wanted categories
            have more open space in the issue mix.
          </p>
        </div>

        <div className="blj-stats" role="list" aria-label="Journal submission category overview">
          {deskMix.map((item) => (
            <article className={`blj-stat is-${item.tone}`} key={item.category} role="listitem">
              <div className="blj-stat-count">{item.count}</div>
              <div className="blj-stat-body">
                <div className="blj-stat-line">
                  <h3>{item.category}</h3>
                  <span>{item.state}</span>
                </div>
                <p>{item.note}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="blj-section blj-process" aria-labelledby="submit-process">
        <div className="blj-process-head">
          <p className="blj-kicker">Submission path</p>
          <h2 id="submit-process">From writing room to issue desk.</h2>
        </div>
        <div className="blj-steps">
          {steps.map((step, index) => (
            <article key={step.label} className="blj-step">
              <span>{String(index + 1).padStart(2, '0')}</span>
              <p className="blj-step-label">{step.label}</p>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="blj-final" aria-labelledby="journal-final-title">
        <div>
          <p className="blj-kicker">Ready for the desk?</p>
          <h2 id="journal-final-title">Send the piece that best represents you.</h2>
          <p>
            Selection is based on quality and editorial fit. Your copyright remains
            yours, and BetweenReads does not train AI on your manuscript.
          </p>
        </div>
        <Link className="blj-primary" href="/write?tab=journal">
          Submit your work
          <span aria-hidden="true">-&gt;</span>
        </Link>
      </section>
    </main>
  );
}

const JOURNAL_CSS = `
.bl-journal-page {
  --blj-paper: #fbf7ed;
  --blj-ink: #171510;
  --blj-muted: #665f51;
  --blj-soft: #efe6d5;
  --blj-line: rgba(23, 21, 16, 0.16);
  --blj-green: #165f45;
  --blj-red: #b94731;
  --blj-blue: #244f73;
  --blj-gold: #a86f1e;
  min-height: 100vh;
  background:
    linear-gradient(90deg, rgba(23, 21, 16, 0.045) 1px, transparent 1px),
    linear-gradient(180deg, rgba(23, 21, 16, 0.035) 1px, transparent 1px),
    var(--blj-paper);
  background-size: 42px 42px;
  color: var(--blj-ink);
  font-family: var(--br-font-sans);
}

.blj-topbar {
  width: min(1180px, calc(100% - 40px));
  margin: 0 auto;
  min-height: 76px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  border-bottom: 1px solid var(--blj-line);
}

.blj-brand {
  font-family: var(--br-font-sans);
  font-size: 16px;
  color: var(--blj-ink);
  text-decoration: none;
}

.blj-brand strong {
  font-weight: 700;
}

.blj-mini-nav {
  display: flex;
  align-items: center;
  gap: 20px;
  color: var(--blj-muted);
  font-size: 13px;
}

.blj-mini-nav a {
  color: inherit;
  text-decoration: none;
}

.blj-mini-nav a:hover {
  color: var(--blj-ink);
}

.blj-hero {
  width: min(1180px, calc(100% - 40px));
  margin: 0 auto;
  min-height: calc(100vh - 76px);
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) 420px;
  gap: 64px;
  align-items: center;
  padding: 54px 0 70px;
}

.blj-hero-copy {
  max-width: 720px;
}

.blj-kicker {
  margin: 0 0 14px;
  color: var(--blj-green);
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0;
}

.blj-hero h1,
.blj-section h2,
.blj-final h2 {
  margin: 0;
  font-family: var(--br-font-display);
  font-weight: 700;
  line-height: 0.98;
  letter-spacing: 0;
  color: var(--blj-ink);
}

.blj-hero h1 {
  max-width: 11ch;
  font-size: 72px;
}

.blj-lede {
  margin: 26px 0 0;
  max-width: 650px;
  color: var(--blj-muted);
  font-family: var(--br-font-serif);
  font-size: 20px;
  line-height: 1.62;
}

.blj-actions {
  margin-top: 34px;
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.blj-primary,
.blj-secondary {
  min-height: 48px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border-radius: 6px;
  font-weight: 800;
  font-size: 14px;
  text-decoration: none;
  transition: transform 180ms ease, background 180ms ease, color 180ms ease, border-color 180ms ease;
}

.blj-primary {
  padding: 0 20px;
  background: var(--blj-ink);
  color: var(--blj-paper);
  border: 1px solid var(--blj-ink);
}

.blj-primary:hover {
  transform: translateY(-1px);
  background: var(--blj-green);
  border-color: var(--blj-green);
}

.blj-secondary {
  padding: 0 18px;
  color: var(--blj-ink);
  border: 1px solid var(--blj-line);
  background: rgba(255, 255, 255, 0.3);
}

.blj-secondary:hover {
  border-color: rgba(23, 21, 16, 0.34);
  background: rgba(255, 255, 255, 0.55);
}

.blj-facts {
  margin-top: 34px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  max-width: 620px;
  border-top: 1px solid var(--blj-line);
  border-bottom: 1px solid var(--blj-line);
}

.blj-facts div {
  padding: 18px 18px 18px 0;
  border-right: 1px solid var(--blj-line);
}

.blj-facts div + div {
  padding-left: 18px;
}

.blj-facts div:last-child {
  border-right: 0;
}

.blj-facts dt {
  margin-bottom: 6px;
  color: var(--blj-muted);
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
}

.blj-facts dd {
  margin: 0;
  color: var(--blj-ink);
  font-size: 15px;
  font-weight: 750;
}

.blj-issue {
  position: relative;
  justify-self: center;
  width: 100%;
  max-width: 420px;
}

.blj-cover {
  position: relative;
  aspect-ratio: 0.72;
  overflow: hidden;
  border-radius: 4px;
  padding: 30px;
  background:
    linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0) 42%),
    linear-gradient(180deg, rgba(20, 18, 12, 0.05), rgba(20, 18, 12, 0.12)),
    #b86443;
  color: #fff8ec;
  box-shadow: 0 24px 70px rgba(43, 32, 20, 0.28), 12px 12px 0 rgba(22, 95, 69, 0.2);
  display: grid;
  grid-template-rows: auto 1fr auto auto;
  transform: rotate(-2deg);
}

.blj-cover::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    repeating-linear-gradient(90deg, rgba(255,255,255,0.05), rgba(255,255,255,0.05) 1px, transparent 1px, transparent 13px),
    repeating-linear-gradient(0deg, rgba(31,19,10,0.08), rgba(31,19,10,0.08) 1px, transparent 1px, transparent 17px);
  mix-blend-mode: soft-light;
  pointer-events: none;
}

.blj-cover-rule {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 22px;
  width: 1px;
  background: rgba(255, 248, 236, 0.62);
}

.blj-cover-top,
.blj-cover-bottom {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  font-size: 12px;
  font-weight: 800;
}

.blj-cover-title {
  position: relative;
  z-index: 1;
  align-self: center;
  font-family: var(--br-font-display);
  font-size: 58px;
  line-height: 0.9;
}

.blj-cover-title span,
.blj-cover-title strong {
  display: block;
  font-weight: 700;
}

.blj-cover p {
  position: relative;
  z-index: 1;
  margin: 0 0 24px;
  color: rgba(255, 248, 236, 0.78);
  font-size: 14px;
  font-weight: 700;
}

.blj-note {
  width: calc(100% - 42px);
  margin: 24px 0 0 auto;
  border: 1px solid var(--blj-line);
  border-radius: 8px;
  padding: 18px;
  background: rgba(255, 255, 255, 0.38);
  color: var(--blj-muted);
  font-size: 13px;
  line-height: 1.55;
}

.blj-note span,
.blj-note strong {
  display: block;
}

.blj-note strong {
  margin-top: 4px;
  color: var(--blj-ink);
}

.blj-section,
.blj-final {
  width: min(1180px, calc(100% - 40px));
  margin: 0 auto;
  border-top: 1px solid var(--blj-line);
  padding: 76px 0;
}

.blj-section h2,
.blj-final h2 {
  font-size: 42px;
  max-width: 12ch;
}

.blj-about {
  display: grid;
  grid-template-columns: 330px minmax(0, 1fr);
  gap: 54px;
}

.blj-about-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.blj-about-grid article,
.blj-step,
.blj-stat {
  border: 1px solid var(--blj-line);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.32);
}

.blj-about-grid article {
  padding: 22px;
}

.blj-about-grid h3,
.blj-step h3,
.blj-stat h3 {
  margin: 0;
  color: var(--blj-ink);
  font-size: 17px;
  line-height: 1.25;
}

.blj-about-grid p,
.blj-step p,
.blj-desk-head p,
.blj-final p,
.blj-stat p {
  margin: 12px 0 0;
  color: var(--blj-muted);
  line-height: 1.65;
}

.blj-desk-head {
  display: grid;
  grid-template-columns: minmax(0, 430px) minmax(280px, 520px);
  gap: 44px;
  align-items: end;
  margin-bottom: 32px;
}

.blj-stats {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.blj-stat {
  display: grid;
  grid-template-columns: 68px minmax(0, 1fr);
  gap: 18px;
  padding: 16px;
}

.blj-stat-count {
  height: 56px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--br-font-display);
  font-size: 30px;
  font-weight: 700;
  color: var(--blj-ink);
  background: var(--blj-soft);
}

.blj-stat-line {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.blj-stat-line span {
  flex-shrink: 0;
  border-radius: 6px;
  padding: 4px 8px;
  font-size: 11px;
  font-weight: 850;
  color: var(--blj-ink);
  border: 1px solid currentColor;
}

.blj-stat.is-crowded .blj-stat-line span,
.blj-stat.is-crowded .blj-stat-count {
  color: var(--blj-red);
}

.blj-stat.is-balanced .blj-stat-line span,
.blj-stat.is-balanced .blj-stat-count {
  color: var(--blj-blue);
}

.blj-stat.is-wanted .blj-stat-line span,
.blj-stat.is-wanted .blj-stat-count {
  color: var(--blj-green);
}

.blj-process-head {
  margin-bottom: 32px;
}

.blj-steps {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.blj-step {
  min-height: 260px;
  padding: 22px;
  display: flex;
  flex-direction: column;
}

.blj-step > span {
  color: var(--blj-gold);
  font-family: var(--br-font-display);
  font-size: 34px;
  font-weight: 700;
  line-height: 1;
}

.blj-step-label {
  margin: 22px 0 10px;
  color: var(--blj-green);
  font-size: 12px;
  font-weight: 850;
  text-transform: uppercase;
}

.blj-step h3 {
  font-size: 18px;
}

.blj-step p:last-child {
  margin-top: auto;
  padding-top: 22px;
}

.blj-final {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 28px;
  padding-bottom: 96px;
}

.blj-final p {
  max-width: 620px;
  font-family: var(--br-font-serif);
  font-size: 18px;
}

@media (max-width: 980px) {
  .blj-hero,
  .blj-about,
  .blj-desk-head {
    grid-template-columns: 1fr;
  }

  .blj-hero {
    min-height: 0;
  }

  .blj-hero h1 {
    max-width: 12ch;
    font-size: 58px;
  }

  .blj-issue {
    max-width: 360px;
    justify-self: start;
  }

  .blj-about-grid,
  .blj-steps {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  .blj-topbar,
  .blj-hero,
  .blj-section,
  .blj-final {
    width: min(100% - 28px, 1180px);
  }

  .blj-topbar {
    min-height: 68px;
  }

  .blj-mini-nav {
    gap: 12px;
    font-size: 12px;
  }

  .blj-hero {
    padding: 36px 0 52px;
    gap: 38px;
  }

  .blj-hero h1 {
    font-size: 46px;
  }

  .blj-lede {
    font-size: 17px;
  }

  .blj-actions,
  .blj-final {
    align-items: stretch;
    flex-direction: column;
  }

  .blj-primary,
  .blj-secondary {
    width: 100%;
  }

  .blj-facts,
  .blj-stats,
  .blj-about-grid,
  .blj-steps {
    grid-template-columns: 1fr;
  }

  .blj-facts div,
  .blj-facts div + div {
    padding: 14px 0;
    border-right: 0;
    border-bottom: 1px solid var(--blj-line);
  }

  .blj-facts div:last-child {
    border-bottom: 0;
  }

  .blj-cover {
    padding: 24px;
    box-shadow: 0 18px 42px rgba(43, 32, 20, 0.24), 8px 8px 0 rgba(22, 95, 69, 0.18);
  }

  .blj-cover-title {
    font-size: 44px;
  }

  .blj-note {
    width: 100%;
  }

  .blj-section,
  .blj-final {
    padding: 54px 0;
  }

  .blj-section h2,
  .blj-final h2 {
    font-size: 34px;
  }

  .blj-stat {
    grid-template-columns: 56px minmax(0, 1fr);
  }

  .blj-stat-count {
    width: 56px;
    height: 56px;
    font-size: 26px;
  }
}

@media (max-width: 430px) {
  .blj-mini-nav a:first-child {
    display: none;
  }

  .blj-hero h1 {
    font-size: 40px;
  }

  .blj-stat-line {
    display: block;
  }

  .blj-stat-line span {
    display: inline-flex;
    margin-top: 8px;
  }
}
`;
