export default function EmptyInsider() {
  return (
    <article className="bl-page">
      <div className="bl-empty">
        <p className="bl-eyebrow">
          <span className="bl-eyebrow-dot" />
          Insider
        </p>
        <h1 className="bl-h1">
          You’re in.
          <br />
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
      </div>
    </article>
  );
}
