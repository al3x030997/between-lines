const CSS = `
.bl-insider-card {
  max-width: 520px;
  text-align: left;
}
.bl-insider-eyebrow {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: #e94b36;
  margin: 0 0 14px;
}
.bl-insider-title {
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 800;
  font-size: clamp(32px, 4.4vw, 52px);
  letter-spacing: -0.03em;
  line-height: 1.04;
  margin: 0 0 18px;
  text-wrap: balance;
}
.bl-insider-pitch {
  font-family: 'Outfit', sans-serif;
  font-size: 16px;
  line-height: 1.55;
  color: rgba(242, 239, 232, 0.78);
  margin: 0;
  max-width: 44ch;
  text-wrap: pretty;
}
`;

export default function InsiderHome() {
  return (
    <article className="bl-insider-card">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <p className="bl-insider-eyebrow">Insider</p>
      <h1 className="bl-insider-title">You’re in. More soon.</h1>
      <p className="bl-insider-pitch">
        This is your private corner of Between Lines. We’ll publish the first chapters,
        early features, and behind-the-scenes notes here before they go anywhere else.
        Bookmark this page — your insider link works on any device.
      </p>
    </article>
  );
}
