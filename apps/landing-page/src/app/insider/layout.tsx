const CSS = `
.bl-insider-root {
  min-height: 100vh;
  background: #0B1733;
  color: #F2EFE8;
  font-family: 'Bricolage Grotesque', 'Outfit', system-ui, sans-serif;
  display: flex;
  flex-direction: column;
}
.bl-insider-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 22px clamp(20px, 5vw, 48px);
  border-bottom: 1px solid rgba(242, 239, 232, 0.12);
}
.bl-insider-brand {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 800;
  letter-spacing: -0.02em;
  font-size: 18px;
}
.bl-insider-brand-dot {
  color: #e94b36;
  margin: 0 4px;
}
.bl-insider-signout {
  background: transparent;
  color: inherit;
  border: 1px solid rgba(242, 239, 232, 0.3);
  border-radius: 999px;
  padding: 8px 16px;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 600;
  font-size: 13px;
  letter-spacing: 0.02em;
  cursor: pointer;
  transition: border-color 160ms ease, background 160ms ease;
}
.bl-insider-signout:hover {
  border-color: #F2EFE8;
  background: rgba(242, 239, 232, 0.06);
}
.bl-insider-main {
  flex: 1 1 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(40px, 8vh, 96px) clamp(20px, 5vw, 48px);
}
`;

export default function InsiderLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bl-insider-root">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <header className="bl-insider-header">
        <a className="bl-insider-brand" href="/insider">
          <span>between</span>
          <span className="bl-insider-brand-dot">·</span>
          <span>lines</span>
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
