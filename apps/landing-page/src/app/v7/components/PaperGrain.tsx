'use client';

type Props = {
  opacity?: number;
  baseFrequency?: number;
  seed?: number;
  className?: string;
};

export function PaperGrain({
  opacity = 0.07,
  baseFrequency = 0.85,
  seed = 7,
  className,
}: Props) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='320' height='320'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='${baseFrequency}' numOctaves='2' seed='${seed}' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>`;
  return (
    <div
      className={`v7-grain ${className ?? ''}`}
      aria-hidden="true"
      style={{
        opacity,
        backgroundImage: `url("data:image/svg+xml;utf8,${svg}")`,
      }}
    />
  );
}
