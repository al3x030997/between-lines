import type { IntakePayload } from '@/lib/schemas';
import InsiderCountdown from './InsiderCountdown';
import InsiderReferral from './InsiderReferral';

type ReaderIntake = Extract<IntakePayload, { region: 'reader' }>;

function slug(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

type ShelfStory = {
  title: string;
  byline: string;
  lengthLabel: string;
  readMinutes: number;
  genre: string;
  spine: string;
  blurb: string;
};

const SHELF_BY_GENRE: Record<string, ShelfStory> = {
  fantasy: {
    title: 'The Salt-Cut Coast',
    byline: 'Tomas Vinter',
    lengthLabel: 'Chapter 1',
    readMinutes: 14,
    genre: 'Fantasy',
    spine: 'linear-gradient(180deg, #7C4DFF, #2A1B7A)',
    blurb:
      'A cartographer is hired to draw the kingdom that drowned. The map is finished. The kingdom is not.',
  },
  romance: {
    title: 'After the Wedding Party',
    byline: 'Imani Ortega',
    lengthLabel: 'Excerpt',
    readMinutes: 9,
    genre: 'Romance',
    spine: 'linear-gradient(180deg, #FF6F91, #B22B5A)',
    blurb:
      'Two strangers share a cab home and find out, three blocks in, they are not strangers at all.',
  },
  'sci-fi': {
    title: 'A Quiet Year on Halsey-7',
    byline: 'Lex Tanaka',
    lengthLabel: 'Flash',
    readMinutes: 6,
    genre: 'Sci-fi',
    spine: 'linear-gradient(180deg, #34D1BF, #114D4B)',
    blurb:
      'The colony asked the AI for one thing every month. By month nine, it stopped answering in words.',
  },
  thriller: {
    title: 'The Last Mile Open',
    byline: 'Ren Sallinen',
    lengthLabel: 'Chapter 1',
    readMinutes: 11,
    genre: 'Thriller',
    spine: 'linear-gradient(180deg, #FFB347, #8A3E00)',
    blurb:
      'A night-shift dispatcher hears the same address twice in one shift. The second call is in her own voice.',
  },
  litfic: {
    title: 'Houses That Belong to Other People',
    byline: 'Adela Quinn',
    lengthLabel: 'Excerpt',
    readMinutes: 12,
    genre: 'Litfic',
    spine: 'linear-gradient(180deg, #E94B36, #6B0F00)',
    blurb:
      'A house-sitter for the famously rich starts writing letters to the owners — and then receives one back.',
  },
  historical: {
    title: 'Notes from the Lighthouse Census',
    byline: 'Joren Bekker',
    lengthLabel: 'Excerpt',
    readMinutes: 10,
    genre: 'Historical',
    spine: 'linear-gradient(180deg, #C7B07C, #5A4521)',
    blurb:
      '1894. A clerk is sent to count every lighthouse keeper in the empire. Most of them do not want to be counted.',
  },
  horror: {
    title: 'Vespers',
    byline: 'Mira Kowal',
    lengthLabel: 'Microstory',
    readMinutes: 4,
    genre: 'Horror',
    spine: 'linear-gradient(180deg, #4B0082, #0E0030)',
    blurb:
      'The church rings the bell at the wrong time. The village starts ringing back.',
  },
  mystery: {
    title: 'The Apartment Above the Bakery',
    byline: 'Dani Reyes',
    lengthLabel: 'Chapter 1',
    readMinutes: 13,
    genre: 'Mystery',
    spine: 'linear-gradient(180deg, #4F8BFF, #0F2E73)',
    blurb:
      'Three tenants in fifteen years. None of them moved out. The new tenant is supposed to be the fourth.',
  },
  crime: {
    title: 'Cold Open',
    byline: 'Yusra Halabi',
    lengthLabel: 'Flash',
    readMinutes: 7,
    genre: 'Crime',
    spine: 'linear-gradient(180deg, #2C2C2C, #0A0A0A)',
    blurb:
      'The detective writes the confession before the interrogation. He gets a 70% return rate.',
  },
  memoir: {
    title: 'A Year of Calling My Brother',
    byline: 'Eli Marsh',
    lengthLabel: 'Excerpt',
    readMinutes: 11,
    genre: 'Memoir',
    spine: 'linear-gradient(180deg, #F2EFE8, #8A8170)',
    blurb:
      'He never picked up. The voicemails became a book about what we keep saying anyway.',
  },
  poetry: {
    title: 'Seven Almost-Sonnets',
    byline: 'Noor Anand',
    lengthLabel: 'Microstory',
    readMinutes: 5,
    genre: 'Poetry',
    spine: 'linear-gradient(180deg, #FFD166, #946F00)',
    blurb:
      'Seven poems that try and fail to be sonnets. The failure is the point. The point keeps cutting.',
  },
  essays: {
    title: 'On Reading in Public',
    byline: 'Ben Holloway',
    lengthLabel: 'Excerpt',
    readMinutes: 8,
    genre: 'Essays',
    spine: 'linear-gradient(180deg, #6EE7B7, #1F5E45)',
    blurb:
      'Why we still bring books to cafés we cannot afford. A defence of the visible reader.',
  },
};

const DEFAULT_SHELF: ShelfStory[] = [
  SHELF_BY_GENRE.litfic,
  SHELF_BY_GENRE.fantasy,
  SHELF_BY_GENRE['sci-fi'],
];

function pickShelf(genres: string[]): ShelfStory[] {
  const picks: ShelfStory[] = [];
  const seen = new Set<string>();
  for (const g of genres) {
    const s = SHELF_BY_GENRE[slug(g)];
    if (s && !seen.has(s.title)) {
      picks.push(s);
      seen.add(s.title);
    }
    if (picks.length === 3) break;
  }
  for (const fallback of DEFAULT_SHELF) {
    if (picks.length === 3) break;
    if (!seen.has(fallback.title)) {
      picks.push(fallback);
      seen.add(fallback.title);
    }
  }
  return picks;
}

type ScheduleRow = {
  date: string;
  iso: string;
  chip: string;
  title: string;
  byline: string;
};

function nextDropIso(): string {
  const now = new Date();
  const day = now.getDay();
  const daysUntilSunday = (7 - day) % 7 || 7;
  const next = new Date(now);
  next.setDate(now.getDate() + daysUntilSunday);
  next.setHours(8, 0, 0, 0);
  return next.toISOString();
}

function formatDateLabel(iso: string): string {
  const d = new Date(iso);
  const wd = d.toLocaleDateString('en-US', { weekday: 'short' });
  const mo = d.toLocaleDateString('en-US', { month: 'short' });
  return `${wd} · ${mo} ${d.getDate()}`;
}

function buildSchedule(lengths: string[]): ScheduleRow[] {
  const lengthPool =
    lengths.length > 0 ? lengths : ['Flash', 'Chapter 1', 'Excerpt', 'Microstory'];
  const pickLen = (i: number) => lengthPool[i % lengthPool.length] ?? 'Flash';
  const baseIso = nextDropIso();
  const baseMs = new Date(baseIso).getTime();
  const offsets = [0, 4, 8, 12];
  const rows = [
    { title: 'A House for the Almost-Departed', byline: 'Imogen Velasco' },
    { title: 'The Cartographer Refuses', byline: 'Tomas Vinter' },
    { title: 'How to Read a Phone Call You Did Not Make', byline: 'Eli Marsh' },
    { title: 'Open Mic: Five First Pages', byline: 'Workshop, Issue 04' },
  ];
  return rows.map((row, i) => {
    const iso = new Date(baseMs + offsets[i] * 86400000).toISOString();
    return {
      iso,
      date: formatDateLabel(iso),
      chip: pickLen(i),
      title: row.title,
      byline: row.byline,
    };
  });
}

function reactionMicrocopy(reaction: string | null): string {
  switch ((reaction ?? '').toLowerCase()) {
    case 'just react':
      return 'A tap is enough — a heart, a sigh, a "more please." We will infer the rest.';
    case 'answer a few questions':
      return 'Three short prompts after each piece. None of them ask you to be a critic.';
    case 'deep thoughts':
      return 'A blank page after each piece. Write as much or as little as you want — the author reads everything.';
    default:
      return 'How you respond is up to you. A tap, a sentence, or a page — all of it lands with the author.';
  }
}

function joinPretty(items: string[], max = 2): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  const head = items.slice(0, max);
  return `${head.join(', ')}, and more`;
}

function buildPitch(intake: ReaderIntake): string {
  const { answers, intent } = intake;
  const opener =
    intent === 'now' ? 'Starting now.' : 'Set up and waiting for you.';
  const genres = answers.genres.slice(0, 2).map((g) => g.toLowerCase());
  const lengthLabel = (answers.lengths[0] ?? 'first chapters').toLowerCase();
  const when = answers.whens[0]?.toLowerCase();
  const genrePhrase =
    genres.length > 0 ? `${joinPretty(genres)}, ` : "a few things we think you’ll like, ";
  const whenPhrase = when ? ` Sent for ${when}.` : '';
  return `${opener} We’ll start with ${genrePhrase}mostly ${lengthLabel}.${whenPhrase}`;
}

function todayMasthead(): string {
  const d = new Date();
  return `${d.getDate()} ${d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}`;
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

export default function ReaderInsider({
  intake,
  sid,
}: {
  intake: ReaderIntake;
  sid: string;
}) {
  const { answers, intent } = intake;
  const shelf = pickShelf(answers.genres);
  const schedule = buildSchedule(answers.lengths);
  const nextDrop = schedule[0];
  const todayDate = todayMasthead();

  const confirmChips: { label: string; mono?: boolean }[] = [];
  if (answers.audience) confirmChips.push({ label: answers.audience });
  for (const g of answers.genres) confirmChips.push({ label: g });
  for (const l of answers.lengths) confirmChips.push({ label: l, mono: true });
  for (const d of answers.devices) confirmChips.push({ label: d });
  for (const w of answers.whens) confirmChips.push({ label: w });
  if (answers.reaction) confirmChips.push({ label: answers.reaction });
  if (answers.club) confirmChips.push({ label: 'reader club' });

  return (
    <article className="bl-page">
      <header className="bl-masthead" aria-label="The Insider masthead">
        <div className="bl-masthead-inner">
          <span className="bl-masthead-brand">Between Reads</span>
          <span className="bl-masthead-sep">·</span>
          <span className="bl-masthead-tag">the insider</span>
          <span className="bl-masthead-sep">·</span>
          <span className="bl-masthead-issue">issue 04 · {todayDate}</span>
          <span className="bl-masthead-sep">·</span>
          <span className="bl-masthead-tag">reader</span>
        </div>
      </header>

      <header className="bl-hero">
        <p className="bl-hero-kicker">
          <span className="bl-hero-kicker-mark">▍</span>
          {intent === 'now' ? 'Today, on your shelf' : 'Your shelf, in waiting'}
        </p>
        <h1 className="bl-h1">
          {intent === 'now' ? (
            <>
              The first <span className="bl-h1-roman">chapters</span>
              <br />
              are <span className="bl-h1-accent">already loading.</span>
            </>
          ) : (
            <>
              Your <span className="bl-h1-roman">shelf</span>
              <br />
              is being <span className="bl-h1-accent">set for you.</span>
            </>
          )}
        </h1>
        <p className="bl-pitch">{buildPitch(intake)}</p>
        <div className="bl-hero-actions">
          <a className="bl-btn is-primary" href="#shelf">
            Open my shelf
          </a>
          <a className="bl-btn is-ghost" href="/?intake=reader">
            Edit preferences
          </a>
        </div>
      </header>

      <InsiderCountdown
        label="Next on your shelf"
        targetIso={nextDrop.iso}
        prefix={`The next piece —`}
        suffix={`— lands in`}
        when={nextDrop.date}
      />

      <section id="shelf">
        <ChapterHead
          num="01"
          title="Your shelf — first chapters waiting"
          italicWord="waiting"
          note="Three, hand-picked from this week’s drops."
        />
        <p className="bl-proof" aria-live="polite">
          <span className="bl-proof-pulse" aria-hidden="true" />
          <span>
            <span className="bl-proof-num">31</span> readers opened a chapter in the last hour.
          </span>
        </p>
        <div className="bl-shelf-grid">
          {shelf.map((s) => (
            <article key={s.title} className="bl-card bl-shelf-card">
              <div className="bl-shelf-cover" style={{ background: s.spine }}>
                <span className="bl-shelf-spine" />
              </div>
              <div className="bl-shelf-meta">
                <span className="bl-chip is-mono">{s.lengthLabel}</span>
                <span className="bl-chip">{s.genre}</span>
              </div>
              <h3 className="bl-shelf-title">{s.title}</h3>
              <p className="bl-shelf-byline">by {s.byline}</p>
              <p className="bl-shelf-blurb">{s.blurb}</p>
              <div className="bl-shelf-actions">
                <a className="bl-btn is-primary is-small" href="#">
                  Read · {s.readMinutes} min
                </a>
                <a className="bl-shelf-save" href="#">
                  save for later
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <Intermission />

      <section>
        <ChapterHead
          num="02"
          title="How we’ll read for you"
          italicWord="for you"
        />
        <div className="bl-confirm">
          <p className="bl-confirm-label">On file</p>
          <div className="bl-chip-row">
            {confirmChips.map((c, i) => (
              <span key={`${c.label}-${i}`} className={`bl-chip${c.mono ? ' is-mono' : ''}`}>
                {c.label}
              </span>
            ))}
          </div>
          <a className="bl-confirm-edit" href="/?intake=reader">
            change anything →
          </a>
        </div>
      </section>

      <section>
        <ChapterHead
          num="03"
          title="Bring one reader you trust"
          italicWord="trust"
          note="Insiders who bring one reader unlock the second-month archive."
        />
        <InsiderReferral
          sid={sid}
          eyebrow="Open invitation"
          title="Know someone who reads in cafés they can’t afford?"
          body="Forward your link. They land on a personalised intake — no public sign-up page, no algorithm. We seat them next to you in the reader’s room."
          foot="Your link is private. We don’t show who you sent it to — only that someone you invited joined."
        />
      </section>

      <Intermission />

      <section>
        <ChapterHead
          num="04"
          title="What’s arriving"
          italicWord="arriving"
          note="Subject to last-minute edits — they usually are."
        />
        <div className="bl-schedule">
          {schedule.map((row, i) => (
            <div
              key={row.title}
              className={`bl-schedule-row${i === 0 ? ' is-next' : ''}`}
            >
              <span className="bl-schedule-date">{row.date}</span>
              <span className="bl-chip is-mono bl-schedule-chip">
                {i === 0 ? 'Next' : row.chip}
              </span>
              <span className="bl-schedule-title">{row.title}</span>
              <span className="bl-schedule-byline">{row.byline}</span>
            </div>
          ))}
        </div>
      </section>

      {answers.club ? (
        <section>
          <ChapterHead
            num="05"
            title="The reader’s room"
            italicWord="reader’s room"
          />
          <div className="bl-club">
            <div>
              <p className="bl-club-when">Next session · Thu Jun 19 · 19:30 CET</p>
              <h3 className="bl-club-title">
                <em>Opening sentences</em> that earn their keep.
              </h3>
              <p className="bl-club-body">
                You’re in. Six readers, two writers in the room, one moderator with a stopwatch.
                We pick three openings, we read them out, we ask the same question: would you turn
                the page? You’ll get the readings list 48 hours before.
              </p>
              <a className="bl-btn is-primary" href="#">
                Add to calendar
              </a>
            </div>
            <aside className="bl-club-side">
              <span className="bl-club-side-label">Last session, in 14 words</span>
              <p className="bl-club-side-quote">
                “The trick is not the first sentence. It’s whether the second one earns it.”
              </p>
              <p className="bl-club-side-attrib">— Mira, reader since Feb</p>
            </aside>
          </div>
        </section>
      ) : (
        <section>
          <ChapterHead
            num="05"
            title="One open seat in the reader’s room"
            italicWord="open seat"
          />
          <div className="bl-card" style={{ padding: '28px' }}>
            <p className="bl-pitch" style={{ marginBottom: 18 }}>
              Six readers, two writers, one stopwatch. We read openings out loud and ask whether
              we’d turn the page. Forty-five minutes, no homework — twice a month.
            </p>
            <a className="bl-btn is-ghost is-small" href="/?intake=reader">
              Join the room
            </a>
          </div>
        </section>
      )}

      <Intermission />

      <section>
        <ChapterHead
          num="06"
          title="From the desk"
          italicWord="desk"
          note="Notes from the editors. Insider-only."
        />
        <div className="bl-editorial-grid has-lede">
          <article className="bl-card is-lede">
            <p className="bl-editorial-kicker">01 · Editor’s note · 3 min</p>
            <h3 className="bl-editorial-title">
              Why we pay for “no thank yous” — and what changed when we did.
            </h3>
            <p className="bl-editorial-body">
              A short letter on why every reader who declines a piece gets a small honorarium —
              and why that quietly changed the kind of work we receive, and the kind of declines
              we get back.
            </p>
            <a className="bl-editorial-link" href="#">
              read the note
            </a>
          </article>
          <article className="bl-card">
            <p className="bl-editorial-kicker">02 · Q&amp;A · 6 min</p>
            <h3 className="bl-editorial-title">
              Tomas Vinter on writing a map of a place that doesn’t exist.
            </h3>
            <p className="bl-editorial-body">
              The author of “The Salt-Cut Coast” on cartography, grief, and why he wrote the
              second draft entirely in margin notes.
            </p>
            <a className="bl-editorial-link" href="#">
              read the Q&amp;A
            </a>
          </article>
          <article className="bl-card">
            <p className="bl-editorial-kicker">03 · From the desk · 2 min</p>
            <h3 className="bl-editorial-title">
              On reading something the second time.
            </h3>
            <p className="bl-editorial-body">
              The reader’s second pass is not a re-read; it’s an answer. A short essay on what
              authors do with the gap between the two.
            </p>
            <a className="bl-editorial-link" href="#">
              read the essay
            </a>
          </article>
        </div>
      </section>

      <section aria-label="Next issue">
        <div className="bl-tease">
          <div>
            <p className="bl-tease-stamp">Issue 05 · arriving Sunday</p>
            <h3 className="bl-tease-title">A longer week — two chapters, one essay, one room.</h3>
            <p className="bl-tease-blurb">
              The shelf rotates Sunday at 08:00. One title is open now; two land with the issue.
              The room meets Thursday.
            </p>
          </div>
          <ul className="bl-tease-list">
            <li className="bl-tease-item is-open">
              <span className="bl-tease-item-num">01</span>
              <div className="bl-tease-item-body">
                <p className="bl-tease-item-title">{shelf[0]?.title ?? 'The opening piece'}</p>
                <p className="bl-tease-item-byline">by {shelf[0]?.byline ?? 'a returning reader’s author'}</p>
              </div>
              <span className="bl-tease-item-mark">open</span>
            </li>
            <li className="bl-tease-item is-locked">
              <span className="bl-tease-item-num">02</span>
              <div className="bl-tease-item-body">
                <p className="bl-tease-item-title">The Light in Apartment 4B</p>
                <p className="bl-tease-item-byline">by a debut writer — name with the issue</p>
              </div>
              <span className="bl-tease-item-mark">Sun</span>
            </li>
            <li className="bl-tease-item is-locked">
              <span className="bl-tease-item-num">03</span>
              <div className="bl-tease-item-body">
                <p className="bl-tease-item-title">Essay: The Reader, Late at Night</p>
                <p className="bl-tease-item-byline">by an editor — bylined Sunday</p>
              </div>
              <span className="bl-tease-item-mark">Sun</span>
            </li>
          </ul>
        </div>
      </section>

      <footer className="bl-footnote">
        <p className="bl-footnote-line">
          Reply to any of this — the desk reads everything.
        </p>
        <p className="bl-footnote-detail">
          {reactionMicrocopy(answers.reaction)} We never publish a reaction with your name on it.
          Authors only ever see the room, never the seat.
        </p>
        <p className="bl-footnote-sign">— the desk</p>
      </footer>
    </article>
  );
}
