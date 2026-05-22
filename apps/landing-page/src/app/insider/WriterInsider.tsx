import type { IntakePayload } from '@/lib/schemas';

type WriterIntake = Extract<IntakePayload, { region: 'writer' }>;

function formatBytes(bytes: number | null): string {
  if (bytes == null) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function arrivedLabel(submission: string | null): string {
  if (!submission) return 'A draft arrived.';
  const s = submission.toLowerCase();
  if (s.startsWith('full')) return 'Your manuscript arrived.';
  return `Your ${s} arrived.`;
}

function poolEstimate(submission: string | null): { num: string; label: string } {
  const map: Record<string, { num: string; label: string }> = {
    Microstory: { num: '3,420', label: 'readers waiting on microstories' },
    Flash: { num: '5,118', label: 'readers waiting on flash fiction' },
    'Chapter 1': { num: '6,802', label: 'readers asked specifically for first chapters' },
    Excerpt: { num: '4,377', label: 'readers waiting on long-form excerpts' },
    'Full manuscript': { num: '1,260', label: 'beta readers cleared for full manuscripts' },
  };
  return map[submission ?? ''] ?? { num: '12,348', label: 'readers in the pool right now' };
}

const FEEDBACK_HELP: Record<string, string> = {
  'Outline / big-picture': 'Does the shape of the story hold?',
  'Plot clarity': 'Did anything land confusing or out of order?',
  Characters: 'Do they feel like people you would meet?',
  Pacing: 'Where did attention drop, and where did it grip?',
  'Hook (would you keep reading?)':
    'The only question that counts: would you turn the page?',
};

export default function WriterInsider({ intake }: { intake: WriterIntake }) {
  const { answers } = intake;
  const submission = answers.submission;
  const fileName = answers.fileName ?? 'your_draft.docx';
  const fileSize = formatBytes(answers.fileSize);
  const pool = poolEstimate(submission);

  return (
    <article className="bl-page">
      <header className="bl-hero">
        <p className="bl-eyebrow">
          <span className="bl-eyebrow-dot" />
          Insider · writer
        </p>
        <h1 className="bl-h1">
          Your draft is
          <br />
          in <span className="bl-h1-accent">the room.</span>
        </h1>
        <p className="bl-pitch">
          {arrivedLabel(submission)} It’s queued for first read. You’ll get the first reactions
          before anything else — no public posting, no scoring, no leaderboard.
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

      <section id="status">
        <div className="bl-section-head">
          <h2 className="bl-h2">Where your draft is</h2>
          <p className="bl-section-note">Updated whenever a reader picks it up.</p>
        </div>
        <div className="bl-submission">
          <div className="bl-submission-head">
            <div className="bl-submission-file">
              <span className="bl-submission-fname">{fileName}</span>
              <span className="bl-submission-fmeta">
                {submission ?? 'draft'}
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

      <section>
        <div className="bl-section-head">
          <h2 className="bl-h2">What we’re listening for</h2>
          <p className="bl-section-note">You picked these. We route accordingly.</p>
        </div>
        {answers.feedback.length === 0 ? (
          <div className="bl-card">
            <p className="bl-pitch" style={{ margin: 0 }}>
              You didn’t flag a focus area, so we’ll read for everything — and surface the
              strongest signal. You can refine this any time.
            </p>
            <div style={{ marginTop: 16 }}>
              <a className="bl-btn is-ghost is-small" href="/?intake=writer">
                Tell us what to read for
              </a>
            </div>
          </div>
        ) : (
          <div className="bl-editorial-grid">
            {answers.feedback.map((f) => (
              <article key={f} className="bl-card">
                <p className="bl-editorial-kicker">{f}</p>
                <p className="bl-editorial-body" style={{ margin: 0 }}>
                  {FEEDBACK_HELP[f] ?? 'A question we’ll keep front-of-mind while reading.'}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>

      {answers.warningsMode === 'list' && answers.warnings.length > 0 ? (
        <section>
          <div className="bl-section-head">
            <h2 className="bl-h2">Content warnings, on file</h2>
            <p className="bl-section-note">
              Readers see these before opening. No reader picks up a draft blind.
            </p>
          </div>
          <div className="bl-confirm">
            <p className="bl-confirm-label">Flagged in this draft</p>
            <div className="bl-chip-row">
              {answers.warnings.map((w) => (
                <span key={w} className="bl-chip is-accent">
                  {w}
                </span>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section>
        <div className="bl-section-head">
          <h2 className="bl-h2">Who’s in the room with you</h2>
          <p className="bl-section-note">A snapshot of the active reader pool.</p>
        </div>
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

      <section>
        <div className="bl-section-head">
          <h2 className="bl-h2">What happens next</h2>
          <p className="bl-section-note">No surprises. Same timeline for every draft.</p>
        </div>
        <div className="bl-schedule">
          <div className="bl-schedule-row">
            <span className="bl-schedule-date">Day 0</span>
            <span className="bl-chip is-mono bl-schedule-chip">Queued</span>
            <span className="bl-schedule-title">Draft received and indexed</span>
            <span className="bl-schedule-byline">done ✓</span>
          </div>
          <div className="bl-schedule-row">
            <span className="bl-schedule-date">Day 1–5</span>
            <span className="bl-chip is-mono bl-schedule-chip">First read</span>
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

      <section>
        <div className="bl-section-head">
          <h2 className="bl-h2">Behind the lines, for writers</h2>
          <p className="bl-section-note">Insider-only craft notes.</p>
        </div>
        <div className="bl-editorial-grid">
          <article className="bl-card">
            <p className="bl-editorial-kicker">Craft note · 5 min</p>
            <h3 className="bl-editorial-title">How to read your own notes without flinching</h3>
            <p className="bl-editorial-body">
              A short field guide to reading anonymized reactions: which patterns to trust,
              which single voices to discount, and when to put the notes down for a week.
            </p>
            <a className="bl-editorial-link" href="#">
              read the guide
            </a>
          </article>
          <article className="bl-card">
            <p className="bl-editorial-kicker">Open call · until Jun 30</p>
            <h3 className="bl-editorial-title">Issue 04: openings under 800 words</h3>
            <p className="bl-editorial-body">
              We’re reading short-form openings for the next anthology. Paid on acceptance,
              insider readers see the long-list first. Submit a second draft anytime.
            </p>
            <a className="bl-editorial-link" href="/?intake=writer">
              submit another →
            </a>
          </article>
        </div>
      </section>

      <footer className="bl-footnote">
        <strong>How readers see you.</strong> Drafts arrive without your name on them. Readers
        choose to read on length, genre, and the focus areas you flagged — not on author bio.
        We never publish reactions with your name attached unless you ask us to.
      </footer>
    </article>
  );
}
