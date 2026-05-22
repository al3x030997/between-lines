'use client';

import { useEffect, useState } from 'react';

type Props = {
  label: string;
  targetIso: string;
  prefix: string;
  suffix?: string;
  when?: string;
};

function diff(targetMs: number): { d: number; h: number; m: number; s: number; over: boolean } {
  const now = Date.now();
  const delta = Math.max(0, targetMs - now);
  const over = targetMs - now <= 0;
  const total = Math.floor(delta / 1000);
  const d = Math.floor(total / 86400);
  const h = Math.floor((total % 86400) / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return { d, h, m, s, over };
}

function format(parts: { d: number; h: number; m: number; s: number }): string {
  if (parts.d > 0) return `${parts.d}d ${String(parts.h).padStart(2, '0')}h`;
  if (parts.h > 0) return `${parts.h}h ${String(parts.m).padStart(2, '0')}m`;
  return `${parts.m}m ${String(parts.s).padStart(2, '0')}s`;
}

export default function InsiderCountdown({ label, targetIso, prefix, suffix, when }: Props) {
  const targetMs = new Date(targetIso).getTime();
  const [parts, setParts] = useState(() => diff(targetMs));

  useEffect(() => {
    const tick = () => setParts(diff(targetMs));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [targetMs]);

  return (
    <div className="bl-countdown" role="status" aria-live="polite">
      <div>
        <p className="bl-countdown-label">{label}</p>
        <p className="bl-countdown-line">
          {prefix}{' '}
          <span className="bl-countdown-value">
            {parts.over ? 'now' : format(parts)}
          </span>
          {suffix ? <> {suffix}</> : null}
        </p>
      </div>
      {when ? <span className="bl-countdown-when">{when}</span> : null}
    </div>
  );
}
