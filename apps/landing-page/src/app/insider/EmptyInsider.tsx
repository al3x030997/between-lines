function todayMasthead(): string {
  const d = new Date();
  return `${d.getDate()} ${d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}`;
}

export default function EmptyInsider() {
  const todayDate = todayMasthead();

  return (
    <article className="bl-page">
      <header className="bl-masthead" aria-label="The Insider masthead">
        <div className="bl-masthead-inner">
          <span className="bl-masthead-brand">Between Reads</span>
          <span className="bl-masthead-sep">·</span>
          <span className="bl-masthead-tag">the insider</span>
          <span className="bl-masthead-sep">·</span>
          <span className="bl-masthead-issue">issue 04 · {todayDate}</span>
        </div>
      </header>

      <div className="bl-empty">
        <header className="bl-hero">
          <p className="bl-hero-kicker">
            <span className="bl-hero-kicker-mark">▍</span>
            You’re in
          </p>
          <h1 className="bl-h1">
            Now help us <span className="bl-h1-accent">set the shelf.</span>
          </h1>
          <p className="bl-pitch">
            The Insider page is meant to feel like yours — a shelf set for what you read, or a
            studio set for what you’re writing. We don’t have your preferences on file yet, so
            right now it’s a single page for everyone. Two minutes of intake unlocks the rest.
          </p>
          <div className="bl-hero-actions">
            <a className="bl-btn is-primary" href="/?intake=open">
              Tell us about you
            </a>
            <a className="bl-btn is-ghost" href="/">
              Back to the front
            </a>
          </div>
        </header>

        <footer className="bl-footnote" style={{ marginTop: 'clamp(56px, 8vw, 96px)' }}>
          <p className="bl-footnote-line">
            Two minutes is the whole ask — and the page rearranges itself for you.
          </p>
          <p className="bl-footnote-sign">— the desk</p>
        </footer>
      </div>
    </article>
  );
}
