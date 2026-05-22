import type { IntakePayload } from '@/lib/schemas';
import InsiderCountdown from './InsiderCountdown';
import InsiderReferral from './InsiderReferral';

type WriterIntake = Extract<IntakePayload, { region: 'writer' }>;
type WriterAnswers = WriterIntake['answers'];

const TARGET_LENGTH_LABEL: Record<string, string> = {
  lt15k: 'Short — under 15k',
  '15-40k': 'Novella — 15–40k',
  '40-80k': 'Novel — 40–80k',
  '80-120k': 'Novel — 80–120k',
  '120kplus': 'Epic — 120k+',
  unsure: 'Length not set',
};

function formatBytes(bytes: number | null): string {
  if (bytes == null) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function poolEstimate(targetLength: string | null): { num: string; label: string } {
  const map: Record<string, { num: string; label: string }> = {
    lt15k: { num: '5,118', label: 'readers waiting on short-form work' },
    '15-40k': { num: '3,420', label: 'readers waiting on novellas' },
    '40-80k': { num: '6,802', label: 'readers waiting on novels' },
    '80-120k': { num: '4,377', label: 'readers waiting on long novels' },
    '120kplus': { num: '1,260', label: 'beta readers cleared for long manuscripts' },
  };
  return (
    map[targetLength ?? ''] ?? {
      num: '12,348',
      label: 'readers in the pool right now',
    }
  );
}

function focusAreasFor(answers: WriterAnswers): { kicker: string; body: string }[] {
  // Derive editorial focus areas from goals + month goal, so the insider page
  // can talk meaningfully even before we collect explicit feedback prefs.
  const out: { kicker: string; body: string }[] = [];
  const goals = answers.goals.selected;
  if (goals.includes('uploadSample')) {
    out.push({
      kicker: 'First-reader reactions',
      body: 'We route this draft to the readers whose taste profile matches your genre and length first.',
    });
  }
  if (goals.includes('buildAgentList')) {
    out.push({
      kicker: 'Agent-ready prep',
      body: 'AgentReady surfaces agents repping your genre, tracked against open / closed status.',
    });
  }
  if (goals.includes('buildAuthorPage')) {
    out.push({
      kicker: 'Your author page',
      body: 'A generated starter page is queued — themes, portfolio, agent-ready bio.',
    });
  }
  if (answers.monthGoal === 'beta-feedback') {
    out.push({
      kicker: 'Beta feedback',
      body: 'Matched to readers who marked “deep thoughts” as their reaction style.',
    });
  }
  if (out.length === 0) {
    out.push({
      kicker: 'Open read',
      body: 'You didn’t flag a focus area, so we’ll read for everything — and surface the strongest signal.',
    });
  }
  return out;
}

function todayMasthead(): string {
  const d = new Date();
  return `${d.getDate()} ${d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}`;
}

function firstReaderTargetIso(): string {
  const d = new Date();
  d.setDate(d.getDate() + 2);
  d.setHours(14, 0, 0, 0);
  return d.toISOString();
}

function ChapterHead({ num, title, italicWord, note }: {
  num: string;
  title: string;
  italicWord?: string;
  note?: string;
}) {
  const idx = italicWord ? title.toLowerCase().indexOf(italicWord.toLowerCase()) : -1;
  const head = idx >= 0 ? title.slice(0, idx) : title;
  const tail = idx >= 0 ? title.slice(idx + italicWord!.length) : '';
  const mid = idx >= 0 ? title.slice(idx, idx + italicWord!.length) : '';
  return (
    <div className="bl-section-head">
      <div className="bl-section-titles">
        <p className="bl-chapter-eyebrow">
          <span className="bl-chapter-num">{num}</span>
          Chapter
        </p>
        <h2 className="bl-h2">
          {head}
          {mid ? <span className="bl-h2-italic">{mid}</span> : null}
          {tail}
        </h2>
      </div>
      {note ? <p className="bl-section-note">{note}</p> : null}
    </div>
  );
}

function Intermission() {
  return (
    <div className="bl-intermission" aria-hidden="true">
      <span className="bl-intermission-mark">⁂</span>
    </div>
  );
}

export default function WriterInsider({
  intake,
  sid,
}: {
  intake: WriterIntake;
  sid: string;
}) {
  const { answers } = intake;
  const sample = answers.goals.uploadSample.sample;
  const fileName = sample?.name ?? 'your_draft.docx';
  const fileSize = formatBytes(sample?.size ?? null);
  const submissionLabel = answers.targetLength
    ? TARGET_LENGTH_LABEL[answers.targetLength] ?? 'draft'
    : 'draft';
  const pool = poolEstimate(answers.targetLength);
  const focusAreas = focusAreasFor(answers);
  const todayDate = todayMasthead();
  const firstReaderIso = firstReaderTargetIso();

  return (
    <article className="bl-page">
      <header className="bl-masthead" aria-label="The Insider masthead">
        <div className="bl-masthead-inner">
          <span className="bl-masthead-brand">Between Lines</span>
          <span className="bl-masthead-sep">·</span>
          <span className="bl-masthead-tag">the insider</span>
          <span className="bl-masthead-sep">·</span>
          <span className="bl-masthead-issue">issue 04 · {todayDate}</span>
          <span className="bl-masthead-sep">·</span>
          <span className="bl-masthead-tag">writer</span>
        </div>
      </header>

      <header className="bl-hero">
        <p className="bl-hero-kicker">
          <span className="bl-hero-kicker-mark">▍</span>
          Today, in the room
        </p>
        <h1 className="bl-h1">
          Your <span className="bl-h1-roman">draft</span>
          <br />
          is in <span className="bl-h1-accent">the room.</span>
        </h1>
        <p className="bl-pitch">
          Queued for first read. You’ll get the first reactions before anything else — no public
          posting, no scoring, no leaderboard.
        </p>
        <div className="bl-hero-actions">
          <a className="bl-btn is-primary" href="#status">
            See where it is
          </a>
          <a className="bl-btn is-ghost" href="/?intake=writer">
            Submit another
          </a>
        </div>
      </header>

      <InsiderCountdown
        label="First reader"
        targetIso={firstReaderIso}
        prefix="A first reader picks this up in"
        when="paid · matched on taste"
      />

      <section id="status">
        <ChapterHead
          num="01"
          title="Where your draft is"
          italicWord="is"
          note="Updated whenever a reader picks it up."
        />
        <p className="bl-proof" aria-live="polite">
          <span className="bl-proof-pulse" aria-hidden="true" />
          <span>
            <span className="bl-proof-num">4</span> writers had drafts move forward today.
          </span>
        </p>
        <div className="bl-submission">
          <div className="bl-submission-head">
            <div className="bl-submission-file">
              <span className="bl-submission-fname">{fileName}</span>
              <span className="bl-submission-fmeta">
                {submissionLabel}
                {fileSize ? ` · ${fileSize}` : ''}
              </span>
            </div>
            <span className="bl-chip is-accent">Queued for first reader</span>
          </div>
          <div className="bl-stepper" role="list" aria-label="Submission progress">
            <div className="bl-step is-done" role="listitem">
              <span className="bl-step-dot">✓</span>
              <span className="bl-step-label">Received</span>
              <span className="bl-step-sub">today</span>
            </div>
            <div className="bl-step is-current" role="listitem">
              <span className="bl-step-dot">2</span>
              <span className="bl-step-label">First reader</span>
              <span className="bl-step-sub">~5 days</span>
            </div>
            <div className="bl-step" role="listitem">
              <span className="bl-step-dot">3</span>
              <span className="bl-step-label">Reader cohort</span>
              <span className="bl-step-sub">day 14</span>
            </div>
            <div className="bl-step" role="listitem">
              <span className="bl-step-dot">4</span>
              <span className="bl-step-label">Notes back</span>
              <span className="bl-step-sub">day 30</span>
            </div>
          </div>
        </div>
      </section>

      <Intermission />

      <section>
        <ChapterHead
          num="02"
          title="What we’re listening for"
          italicWord="listening"
          note="You picked these. We route accordingly."
        />
        <div className="bl-editorial-grid">
          {focusAreas.map((f) => (
            <article key={f.kicker} className="bl-card">
              <p className="bl-editorial-kicker">{f.kicker}</p>
              <p className="bl-editorial-body" style={{ margin: 0 }}>
                {f.body}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section>
        <ChapterHead
          num="03"
          title="Who’s in the room with you"
          italicWord="in the room"
          note="A snapshot of the active reader pool."
        />
        <div className="bl-stat-grid">
          <div className="bl-stat-tile">
            <p className="bl-stat-num">
              <span className="bl-stat-num-accent">{pool.num.slice(0, 1)}</span>
              {pool.num.slice(1)}
            </p>
            <p className="bl-stat-label">{pool.label}</p>
          </div>
          <div className="bl-stat-tile">
            <p className="bl-stat-num">
              <span className="bl-stat-num-accent">8</span>91
            </p>
            <p className="bl-stat-label">
              flagged “deep thoughts” as their reaction style — long notes welcome
            </p>
          </div>
          <div className="bl-stat-tile">
            <p className="bl-stat-num">
              <span className="bl-stat-num-accent">2</span>14
            </p>
            <p className="bl-stat-label">
              read on commute or bedtime — short bursts, attention earned twice
            </p>
          </div>
        </div>
      </section>

      <Intermission />

      <section>
        <ChapterHead
          num="04"
          title="Bring one writer you trust"
          italicWord="trust"
          note="Insiders who bring one writer unlock the second-month archive."
        />
        <InsiderReferral
          sid={sid}
          eyebrow="Open invitation"
          title="Know a writer who’s been sitting on a draft?"
          body="Forward your link. They land on a personalised intake — no public sign-up page, no slush. We seat them in the same cohort, with readers matched on taste."
          foot="Your link is private. We don’t show who you sent it to — only that someone you invited joined."
        />
      </section>

      <section>
        <ChapterHead
          num="05"
          title="What happens next"
          italicWord="next"
          note="No surprises. Same timeline for every draft."
        />
        <div className="bl-schedule">
          <div className="bl-schedule-row">
            <span className="bl-schedule-date">Day 0</span>
            <span className="bl-chip is-mono bl-schedule-chip">Queued</span>
            <span className="bl-schedule-title">Draft received and indexed</span>
            <span className="bl-schedule-byline">done ✓</span>
          </div>
          <div className="bl-schedule-row is-next">
            <span className="bl-schedule-date">Day 1–5</span>
            <span className="bl-chip is-mono bl-schedule-chip">Next</span>
            <span className="bl-schedule-title">
              We pair you with a reader whose taste fits, not a slush pile
            </span>
            <span className="bl-schedule-byline">paid reader</span>
          </div>
          <div className="bl-schedule-row">
            <span className="bl-schedule-date">Day 14</span>
            <span className="bl-chip is-mono bl-schedule-chip">Reactions</span>
            <span className="bl-schedule-title">
              Anonymized first reactions land in your inbox
            </span>
            <span className="bl-schedule-byline">3–6 readers</span>
          </div>
          <div className="bl-schedule-row">
            <span className="bl-schedule-date">Day 30</span>
            <span className="bl-chip is-mono bl-schedule-chip">Notes</span>
            <span className="bl-schedule-title">
              Aggregated craft notes on the focus areas you picked
            </span>
            <span className="bl-schedule-byline">editor-checked</span>
          </div>
        </div>
      </section>

      <Intermission />

      <section>
        <ChapterHead
          num="06"
          title="From the desk"
          italicWord="desk"
          note="Insider-only craft notes."
        />
        <div className="bl-editorial-grid has-lede">
          <article className="bl-card is-lede">
            <p className="bl-editorial-kicker">01 · Craft note · 5 min</p>
            <h3 className="bl-editorial-title">
              How to read your own notes without flinching.
            </h3>
            <p className="bl-editorial-body">
              A short field guide to reading anonymized reactions: which patterns to trust, which
              single voices to discount, and when to put the notes down for a week.
            </p>
            <a className="bl-editorial-link" href="#">
              read the guide
            </a>
          </article>
          <article className="bl-card">
            <p className="bl-editorial-kicker">02 · Open call · until Jun 30</p>
            <h3 className="bl-editorial-title">
              Issue 04: openings under 800 words.
            </h3>
            <p className="bl-editorial-body">
              Reading short-form openings for the next anthology. Paid on acceptance, insider
              readers see the long-list first.
            </p>
            <a className="bl-editorial-link" href="/?intake=writer">
              submit another →
            </a>
          </article>
          <article className="bl-card">
            <p className="bl-editorial-kicker">03 · From the desk · 2 min</p>
            <h3 className="bl-editorial-title">
              The two notes you can ignore.
            </h3>
            <p className="bl-editorial-body">
              A short list of feedback patterns that look like signal and aren’t — and one that
              looks like noise and almost always is.
            </p>
            <a className="bl-editorial-link" href="#">
              read the note
            </a>
          </article>
        </div>
      </section>

      <section aria-label="What returns next">
        <div className="bl-tease">
          <div>
            <p className="bl-tease-stamp">What returns to you next</p>
            <h3 className="bl-tease-title">Three reactions — and one question worth keeping.</h3>
            <p className="bl-tease-blurb">
              Around day 14 we deliver short reactions from the readers who picked up your draft.
              No scores, no ranks — just the kind of notes you’d get over coffee, if your reader
              had nothing to lose.
            </p>
          </div>
          <ul className="bl-tease-list">
            <li className="bl-tease-item is-open">
              <span className="bl-tease-item-num">01</span>
              <div className="bl-tease-item-body">
                <p className="bl-tease-item-title">First reactions</p>
                <p className="bl-tease-item-byline">3–6 anonymous readers · arriving ~day 14</p>
              </div>
              <span className="bl-tease-item-mark">queued</span>
            </li>
            <li className="bl-tease-item is-locked">
              <span className="bl-tease-item-num">02</span>
              <div className="bl-tease-item-body">
                <p className="bl-tease-item-title">Aggregated craft notes on the focus areas you flagged</p>
                <p className="bl-tease-item-byline">editor-checked · day 30</p>
              </div>
              <span className="bl-tease-item-mark">Jun</span>
            </li>
            <li className="bl-tease-item is-locked">
              <span className="bl-tease-item-num">03</span>
              <div className="bl-tease-item-body">
                <p className="bl-tease-item-title">A single question the readers couldn’t shake</p>
                <p className="bl-tease-item-byline">surfaced with the notes</p>
              </div>
              <span className="bl-tease-item-mark">Jun</span>
            </li>
          </ul>
        </div>
      </section>

      <footer className="bl-footnote">
        <p className="bl-footnote-line">
          Reply to any of this — the desk reads everything.
        </p>
        <p className="bl-footnote-detail">
          Drafts arrive without your name on them. Readers choose to read on length, genre, and
          the focus areas you flagged — not on author bio. We never publish reactions with your
          name attached unless you ask us to.
        </p>
        <p className="bl-footnote-sign">— the desk</p>
      </footer>
    </article>
  );
}
