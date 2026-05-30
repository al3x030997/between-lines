'use client';

type Props = {
  open: boolean;
  onClose: () => void;
  mode: 'desktop' | 'mobile';
  onModeChange: (m: 'desktop' | 'mobile') => void;
  eyebrow: string;
  title: string;
  bodyHtml: string;
};

export function PreviewOverlay({ open, onClose, mode, onModeChange, eyebrow, title, bodyHtml }: Props) {
  return (
    <div className={`br-write-preview ${open ? 'is-open' : ''}`} aria-hidden={!open}>
      <div className="br-write-preview-bar">
        <span className="br-write-preview-eyebrow" style={{ marginBottom: 0 }}>Preview</span>
        <div className="br-write-preview-modetab">
          <button
            type="button"
            className={`br-write-preview-modebtn ${mode === 'desktop' ? 'is-on' : ''}`}
            onClick={() => onModeChange('desktop')}
          >
            Desktop
          </button>
          <button
            type="button"
            className={`br-write-preview-modebtn ${mode === 'mobile' ? 'is-on' : ''}`}
            onClick={() => onModeChange('mobile')}
          >
            Mobile
          </button>
        </div>
        <button type="button" className="br-write-btn-sm" onClick={onClose}>← Back to editor</button>
      </div>
      <div className="br-write-preview-scroll">
        <div className={`br-write-preview-inner ${mode === 'mobile' ? 'is-mobile' : ''}`}>
          <div className="br-write-preview-frame">
            <div className="br-write-preview-eyebrow">{eyebrow}</div>
            <h1 className="br-write-preview-title">{title}</h1>
            <div
              className="br-write-preview-body"
              dangerouslySetInnerHTML={{
                __html:
                  bodyHtml && bodyHtml.trim().length > 0
                    ? bodyHtml
                    : '<p style="color:rgba(255,255,255,0.50);font-style:italic">Nothing written yet.</p>',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
