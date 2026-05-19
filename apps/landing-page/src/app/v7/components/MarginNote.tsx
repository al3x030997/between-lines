'use client';

import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  rotate?: number;
  arrow?: 'none' | 'left' | 'right' | 'down';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
};

export function MarginNote({
  children,
  rotate = -1.5,
  arrow = 'none',
  className,
  size = 'md',
}: Props) {
  const classes = [
    'v7-margin',
    `v7-margin-${size}`,
    arrow !== 'none' ? `v7-margin-arrow-${arrow}` : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <span className={classes} style={{ ['--v7-margin-rotate' as string]: `${rotate}deg` }}>
      <span className="v7-margin-body">{children}</span>
      {arrow === 'left' && (
        <svg className="v7-margin-arrow-svg" viewBox="0 0 60 24" aria-hidden="true">
          <path
            d="M 56 6 Q 38 4 22 10 T 4 18 M 4 18 L 10 13 M 4 18 L 11 21"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
      {arrow === 'right' && (
        <svg className="v7-margin-arrow-svg" viewBox="0 0 60 24" aria-hidden="true">
          <path
            d="M 4 6 Q 22 4 38 10 T 56 18 M 56 18 L 50 13 M 56 18 L 49 21"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
      {arrow === 'down' && (
        <svg className="v7-margin-arrow-svg v7-margin-arrow-down" viewBox="0 0 24 60" aria-hidden="true">
          <path
            d="M 6 4 Q 4 22 10 38 T 18 56 M 18 56 L 13 50 M 18 56 L 21 49"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </span>
  );
}
