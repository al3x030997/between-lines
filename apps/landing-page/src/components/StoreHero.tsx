export function StoreHero() {
  return (
    <section className="br-store-hero" aria-label="Store hero">
      <div className="br-store-hero-label">BetweenReads Store</div>
      <h1 className="br-store-hero-title">Read. Listen. Gift.</h1>
      <p className="br-store-hero-sub">Ebooks · Audiobooks · BetweenLines · ReadCredits · Merch</p>
      <div className="br-member-nudge">
        <span className="br-member-nudge-text">
          ✦ Members get <strong>20% off everything</strong> in the store + 100 RC welcome bonus.
        </span>
        <button type="button" className="br-member-nudge-cta">Join for $50/yr</button>
      </div>
    </section>
  );
}
