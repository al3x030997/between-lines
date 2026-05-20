'use client';

const STYLES = `
.bl-footer {
  background: var(--bl-footer-bg);
  color: var(--bl-footer-fg);
  padding: clamp(48px, 6vw, 80px) clamp(24px, 5vw, 80px) 40px;
  font-family: 'Bricolage Grotesque', 'Inter', sans-serif;
  transition: background-color 320ms ease, color 320ms ease;
}
.bl-footer-inner {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: clamp(40px, 5vw, 64px);
}
.bl-footer-top {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
}
.bl-footer-mark {
  font-family: 'Cormorant Garamond', serif;
  font-weight: 600;
  font-size: clamp(36px, 4vw, 56px);
  letter-spacing: -0.02em;
  color: var(--bl-footer-fg);
  margin: 0;
  font-kerning: normal;
  text-rendering: optimizeLegibility;
  font-feature-settings: "kern", "liga", "calt", "dlig";
}
.bl-footer-tag {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-size: clamp(16px, 1.4vw, 20px);
  color: var(--bl-footer-muted);
  max-width: 36ch;
  text-align: right;
  margin: 0;
  text-wrap: pretty;
}
.bl-footer-cols {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(24px, 4vw, 64px);
  padding-top: clamp(32px, 4vw, 56px);
  border-top: 1px solid var(--bl-footer-divider);
}
.bl-footer-col-title {
  font-size: 12px;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--bl-footer-muted);
  margin: 0 0 16px;
  font-weight: 600;
}
.bl-footer-col ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.bl-footer-col a {
  color: var(--bl-footer-fg);
  text-decoration: none;
  font-size: 15px;
  transition: color 180ms var(--v6-ease, ease);
}
.bl-footer-col a:hover { color: var(--bl-footer-accent); }
.bl-footer-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border-top: 1px solid var(--bl-footer-divider);
  padding-top: 24px;
  font-size: 13px;
  color: var(--bl-footer-muted);
}
.bl-footer-bottom-left { display: inline-flex; align-items: center; gap: 12px; }
.bl-footer-accent {
  display: inline-block;
  width: 10px;
  height: 10px;
  background: var(--bl-footer-accent);
  transition: background-color 320ms ease;
}
.bl-footer-bottom a {
  color: var(--bl-footer-muted);
  text-decoration: none;
  transition: color 180ms var(--v6-ease, ease);
}
.bl-footer-bottom a:hover { color: var(--bl-footer-accent); }

@media (max-width: 760px) {
  .bl-footer-top { flex-direction: column; align-items: flex-start; }
  .bl-footer-tag { text-align: left; }
  .bl-footer-cols { grid-template-columns: 1fr; }
  .bl-footer-bottom { flex-direction: column; align-items: flex-start; }
}
`;

export default function Footer() {
  return (
    <footer className="bl-footer">
      <style>{STYLES}</style>
      <div className="bl-footer-inner">
        <div className="bl-footer-top">
          <h2 className="bl-footer-mark">BetweenLines</h2>
          <p className="bl-footer-tag">Discover debut authors before they’re published.</p>
        </div>

        <div className="bl-footer-cols">
          <div className="bl-footer-col">
            <h3 className="bl-footer-col-title">Product</h3>
            <ul>
              <li><a href="#">For writers</a></li>
              <li><a href="#">For readers</a></li>
              <li><a href="#">How it works</a></li>
            </ul>
          </div>
          <div className="bl-footer-col">
            <h3 className="bl-footer-col-title">Company</h3>
            <ul>
              <li><a href="#">About</a></li>
              <li><a href="#">Journal</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>
          <div className="bl-footer-col">
            <h3 className="bl-footer-col-title">Legal</h3>
            <ul>
              <li><a href="/privacy">Privacy</a></li>
              <li><a href="#">Terms</a></li>
              <li><a href="#">Cookies</a></li>
            </ul>
          </div>
        </div>

        <div className="bl-footer-bottom">
          <span className="bl-footer-bottom-left">
            <span className="bl-footer-accent" aria-hidden />
            <span style={{ fontVariantNumeric: 'tabular-nums' }}>© 2026 BetweenLines</span>
          </span>
          <a href="#">Back to top ↑</a>
        </div>
      </div>
    </footer>
  );
}
