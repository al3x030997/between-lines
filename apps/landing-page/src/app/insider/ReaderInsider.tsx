import type { IntakePayload } from '@/lib/schemas';

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

function buildSchedule(lengths: string[]): {
  date: string;
  chip: string;
  title: string;
  byline: string;
}[] {
  const lengthPool =
    lengths.length > 0 ? lengths : ['Flash', 'Chapter 1', 'Excerpt', 'Microstory'];
  const pickLen = (i: number) => lengthPool[i % lengthPool.length] ?? 'Flash';
  return [
    {
      date: 'Wed · Jun 3',
      chip: pickLen(0),
      title: 'A House for the Almost-Departed',
      byline: 'Imogen Velasco',
    },
    {
      date: 'Sun · Jun 7',
      chip: pickLen(1),
      title: 'The Cartographer Refuses',
      byline: 'Tomas Vinter',
    },
    {
      date: 'Thu · Jun 11',
      chip: pickLen(2),
      title: 'How to Read a Phone Call You Did Not Make',
      byline: 'Eli Marsh',
    },
    {
      date: 'Mon · Jun 15',
      chip: pickLen(3),
      title: 'Open Mic: Five First Pages',
      byline: 'Workshop, Issue 04',
    },
  ];
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

export default function ReaderInsider({ intake }: { intake: ReaderIntake }) {
  const { answers, intent } = intake;
  const heroTitle =
    intent === 'now' ? (
      <>
        The first chapters
        <br />
        are <span className="bl-h1-accent">loading.</span>
      </>
    ) : (
      <>
        Your shelf is
        <br />
        being <span className="bl-h1-accent">set.</span>
      </>
    );

  const shelf = pickShelf(answers.genres);
  const schedule = buildSchedule(answers.lengths);

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
      <header className="bl-hero">
        <p className="bl-eyebrow">
          <span className="bl-eyebrow-dot" />
          Insider · reader
        </p>
        <h1 className="bl-h1">{heroTitle}</h1>
        <p className="bl-pitch">{buildPitch(intake)}</p>
        <div className="bl-hero-actions">
          <a className="bl-btn is-primary" href={`#shelf`}>
            Open my shelf
          </a>
          <a className="bl-btn is-ghost" href="/?intake=reader">
            Edit preferences
          </a>
        </div>
      </header>

      <section id="shelf">
        <div className="bl-section-head">
          <h2 className="bl-h2">Your shelf — first chapters waiting</h2>
          <p className="bl-section-note">Three, hand-picked from this week’s drops.</p>
        </div>
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
                <a className="bl-btn is-primary is-small" href={`#`}>
                  Read · {s.readMinutes} min
                </a>
                <a className="bl-shelf-save" href={`#`}>
                  save for later
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section>
        <div className="bl-section-head">
          <h2 className="bl-h2">How you’ve set this up</h2>
          <a className="bl-confirm-edit" href="/?intake=reader">
            change anything →
          </a>
        </div>
        <div className="bl-confirm">
          <p className="bl-confirm-label">We’re reading you as</p>
          <div className="bl-chip-row">
            {confirmChips.map((c, i) => (
              <span key={`${c.label}-${i}`} className={`bl-chip${c.mono ? ' is-mono' : ''}`}>
                {c.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="bl-section-head">
          <h2 className="bl-h2">Coming up this month</h2>
          <p className="bl-section-note">Subject to last-minute edits — they usually are.</p>
        </div>
        <div className="bl-schedule">
          {schedule.map((row) => (
            <div key={row.title} className="bl-schedule-row">
              <span className="bl-schedule-date">{row.date}</span>
              <span className="bl-chip is-mono bl-schedule-chip">{row.chip}</span>
              <span className="bl-schedule-title">{row.title}</span>
              <span className="bl-schedule-byline">{row.byline}</span>
            </div>
          ))}
        </div>
      </section>

      {answers.club ? (
        <section>
          <div className="bl-club">
            <div>
              <p className="bl-club-when">Next session · Thu Jun 19 · 19:30 CET</p>
              <h2 className="bl-club-title">The reader’s room: opening sentences that earn their keep</h2>
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
                "The trick is not the first sentence. It’s whether the second one earns it."
              </p>
              <p className="bl-club-side-attrib">— Mira, reader since Feb</p>
            </aside>
          </div>
        </section>
      ) : (
        <section>
          <div className="bl-card" style={{ padding: '28px' }}>
            <p className="bl-eyebrow" style={{ marginBottom: 12 }}>
              <span className="bl-eyebrow-dot" />
              Open seat
            </p>
            <h2 className="bl-h2" style={{ marginBottom: 10 }}>
              The reader’s room meets twice a month. There’s still space.
            </h2>
            <p className="bl-pitch" style={{ marginBottom: 18 }}>
              Six readers, two writers, one stopwatch. We read openings out loud and ask whether
              we’d turn the page. Forty-five minutes, no homework.
            </p>
            <a className="bl-btn is-ghost is-small" href="/?intake=reader">
              Join the room
            </a>
          </div>
        </section>
      )}

      <section>
        <div className="bl-section-head">
          <h2 className="bl-h2">Behind the lines</h2>
          <p className="bl-section-note">Notes from the editors. Insider-only.</p>
        </div>
        <div className="bl-editorial-grid">
          <article className="bl-card">
            <p className="bl-editorial-kicker">Editor’s note · 3 min</p>
            <h3 className="bl-editorial-title">Why we pay for "no thank yous"</h3>
            <p className="bl-editorial-body">
              A short letter on why every reader who declines a piece gets a small honorarium —
              and why that quietly changed the kind of work we receive.
            </p>
            <a className="bl-editorial-link" href="#">
              read the note
            </a>
          </article>
          <article className="bl-card">
            <p className="bl-editorial-kicker">Q&amp;A · 6 min</p>
            <h3 className="bl-editorial-title">Tomas Vinter on writing a map of a place that doesn’t exist</h3>
            <p className="bl-editorial-body">
              A short interview with the author of "The Salt-Cut Coast" about cartography,
              grief, and why he wrote the second draft entirely in margin notes.
            </p>
            <a className="bl-editorial-link" href="#">
              read the Q&amp;A
            </a>
          </article>
          <article className="bl-card">
            <p className="bl-editorial-kicker">From the desk · 2 min</p>
            <h3 className="bl-editorial-title">What we’re reading next week</h3>
            <p className="bl-editorial-body">
              Two excerpts from new writers and a short essay on reading in public. The lineup is
              moving — bookmark this page or watch your inbox.
            </p>
            <a className="bl-editorial-link" href="#">
              see the lineup
            </a>
          </article>
        </div>
      </section>

      <footer className="bl-footnote">
        <strong>How you respond.</strong> {reactionMicrocopy(answers.reaction)} We never publish
        a reaction with your name on it — authors only ever see the room, never the seat.
      </footer>
    </article>
  );
}
