'use client';

type Props = {
  text: string;
  reveal?: 'never' | 'hover';
  className?: string;
  inkClass?: 'ink' | 'paper' | 'accent';
};

export function RedactedText({ text, reveal = 'never', className, inkClass = 'ink' }: Props) {
  const tokens = text.split(/(\s+)/);
  const classes = [
    'v7-redact',
    `v7-redact-${inkClass}`,
    reveal === 'hover' ? 'v7-redact-hover' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <span className={classes} aria-label="redacted">
      <span className="v7-redact-clear" aria-hidden="true">
        {text}
      </span>
      <span className="v7-redact-mask" aria-hidden="true">
        {tokens.map((t, i) =>
          /^\s+$/.test(t) ? (
            <span key={i}>{t}</span>
          ) : (
            <span key={i} className="v7-redact-block">
              {/* preserve glyph width via invisible text */}
              <span className="v7-redact-ghost">{t}</span>
            </span>
          ),
        )}
      </span>
    </span>
  );
}
