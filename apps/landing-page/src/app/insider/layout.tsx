const CSS = `
.bl-insider-root {
  min-height: 100vh;
  background:
    radial-gradient(120% 80% at 50% -10%, rgba(233, 75, 54, 0.08), transparent 55%),
    radial-gradient(80% 60% at 100% 110%, rgba(80, 100, 180, 0.08), transparent 60%),
    #0B1733;
  color: #F2EFE8;
  font-family: 'Outfit', system-ui, sans-serif;
  display: flex;
  flex-direction: column;
}
.bl-insider-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px clamp(20px, 5vw, 48px);
  border-bottom: 1px solid rgba(242, 239, 232, 0.1);
  position: sticky;
  top: 0;
  z-index: 30;
  background: rgba(11, 23, 51, 0.82);
  backdrop-filter: saturate(140%) blur(10px);
  -webkit-backdrop-filter: saturate(140%) blur(10px);
}
.bl-insider-brand {
  display: inline-flex;
  align-items: baseline;
  gap: 8px;
  text-decoration: none;
  color: inherit;
  font-family: 'Cormorant Garamond', 'Times New Roman', serif;
  font-weight: 500;
  letter-spacing: 0.02em;
  font-size: 22px;
  line-height: 1;
}
.bl-insider-brand-mark {
  font-family: 'Fraunces', serif;
  font-style: italic;
  font-weight: 400;
  color: #e94b36;
  font-size: 22px;
}
.bl-insider-brand-tag {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 600;
  font-size: 10px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: rgba(242, 239, 232, 0.45);
  margin-left: 6px;
  padding-left: 12px;
  border-left: 1px solid rgba(242, 239, 232, 0.18);
  line-height: 1;
  transform: translateY(-1px);
}
.bl-insider-signout {
  background: transparent;
  color: inherit;
  border: 1px solid rgba(242, 239, 232, 0.24);
  border-radius: 999px;
  padding: 8px 16px;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 600;
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  cursor: pointer;
  transition: border-color 160ms ease, background 160ms ease, color 160ms ease;
}
.bl-insider-signout:hover {
  border-color: #F2EFE8;
  background: rgba(242, 239, 232, 0.06);
}
.bl-insider-main {
  flex: 1 1 auto;
  display: block;
  width: 100%;
  padding: 0;
}

@media (max-width: 480px) {
  .bl-insider-brand-tag { display: none; }
}
`;

export default function InsiderLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bl-insider-root">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <header className="bl-insider-header">
        <a className="bl-insider-brand" href="/insider">
          <span>Between</span>
          <span className="bl-insider-brand-mark">·</span>
          <span>Lines</span>
          <span className="bl-insider-brand-tag">The Insider</span>
        </a>
        <form action="/api/insider/logout" method="post">
          <button type="submit" className="bl-insider-signout">
            Sign out
          </button>
        </form>
      </header>
      <main className="bl-insider-main">{children}</main>
    </div>
  );
}
