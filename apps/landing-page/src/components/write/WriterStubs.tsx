'use client';

type StubProps = {
  eyebrow: string;
  title: string;
  body: string;
  points: { label: string; meta: string }[];
};

function Stub({ eyebrow, title, body, points }: StubProps) {
  return (
    <section className="br-write-stub" aria-labelledby={`stub-${eyebrow}`}>
      <div className="br-write-stub-eyebrow">{eyebrow}</div>
      <h2 id={`stub-${eyebrow}`} className="br-write-stub-title">{title}</h2>
      <p className="br-write-stub-body">{body}</p>
      <div className="br-write-stub-grid">
        {points.map((p) => (
          <article key={p.label} className="br-write-stub-card">
            <div className="br-write-stub-card-title">{p.label}</div>
            <div className="br-write-stub-card-meta">{p.meta}</div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function PersonalStorefrontStub() {
  return (
    <Stub
      eyebrow="In design"
      title="Personal storefront"
      body="Your books, your shelves, your URL. Curate covers, set pricing, and run promotions on a page that's entirely yours — separate from the BetweenReads discover surface."
      points={[
        { label: 'Branded shelf URL', meta: 'betweenreads.com/sarah-m' },
        { label: 'Pricing & promotions', meta: 'Set free chapters, bundles, members-only' },
        { label: 'Cover gallery', meta: 'Reorder, hero, retire — your choice' },
        { label: 'Direct revenue', meta: 'Track payouts and reader purchases' },
      ]}
    />
  );
}

export function AgentReadyStub() {
  return (
    <Stub
      eyebrow="In design"
      title="Agent ready"
      body="The bridge between your draft and the agents who'll champion it. Track your query letter, package, and outreach in one place; let agents preview your work on their terms."
      points={[
        { label: 'Query letter workshop', meta: 'AI-assisted, agent-tested templates' },
        { label: 'Submission tracker', meta: 'Agents queried, responses, status' },
        { label: 'Preview access', meta: 'Grant agents private read links' },
        { label: 'Pitch deck', meta: 'Synopsis, comps, target list' },
      ]}
    />
  );
}

export function FindBetaReaderStub() {
  return (
    <Stub
      eyebrow="In design"
      title="Find beta readers"
      body="Match your manuscript with real readers who love what you write. SecureBetaReads protects your work on upload, and you control exactly who reads it — your first three chapters are free, and structured feedback comes straight back to you."
      points={[
        { label: 'Reader matching', meta: 'By genre, format, and feedback style' },
        { label: 'SecureBetaReads', meta: 'Watermarked, copy disabled, never AI-trained' },
        { label: 'Structured feedback', meta: 'React, quick comments, deep thoughts' },
        { label: 'You control access', meta: 'Set the window, revoke anytime' },
      ]}
    />
  );
}

export function AudioStub() {
  return (
    <Stub
      eyebrow="In design"
      title="Audio"
      body="Your prose as an audiobook — without a studio. Record chapter-by-chapter, hand off to AI narration in voices you've approved, or commission a narrator from our roster. One workspace for the whole audio pipeline."
      points={[
        { label: 'Self-record', meta: 'Browser-based booth + retakes per paragraph' },
        { label: 'AI narration', meta: 'Approve voices, generate per chapter' },
        { label: 'Narrator marketplace', meta: 'Brief, audition, hire from a vetted pool' },
        { label: 'Distribution', meta: 'Ship audio chapters to readers as a track' },
      ]}
    />
  );
}

export function CommunityStub() {
  return (
    <Stub
      eyebrow="In design"
      title="Community"
      body="Where your readers, beta partners, and fellow writers gather. Threads, swaps, and writing rooms — built around your work, not against a feed algorithm."
      points={[
        { label: 'Reader threads', meta: 'Q&A, chapter discussions, deleted scenes' },
        { label: 'Beta partner swap', meta: 'Trade a chapter for a chapter' },
        { label: 'Writing rooms', meta: 'Co-working sprints, weekly cohorts' },
        { label: 'Workshop critiques', meta: 'Targeted feedback from the community' },
      ]}
    />
  );
}
