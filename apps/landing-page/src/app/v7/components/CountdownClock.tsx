'use client';

import { useEffect, useState } from 'react';

type Props = {
  target: string | Date;
  className?: string;
  prefix?: string;
};

export function CountdownClock({ target, className, prefix }: Props) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const targetDate = typeof target === 'string' ? new Date(target) : target;

  if (!now) {
    return (
      <span className={className} suppressHydrationWarning>
        {prefix ? `${prefix} ` : ''}— d — h — m
      </span>
    );
  }

  const ms = Math.max(0, targetDate.getTime() - now.getTime());
  const d = Math.floor(ms / 86_400_000);
  const h = Math.floor((ms % 86_400_000) / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  const s = Math.floor((ms % 60_000) / 1_000);

  return (
    <span className={className} suppressHydrationWarning>
      {prefix ? `${prefix} ` : ''}
      <span className="v7-clock-num">{String(d).padStart(2, '0')}</span>d{' '}
      <span className="v7-clock-num">{String(h).padStart(2, '0')}</span>h{' '}
      <span className="v7-clock-num">{String(m).padStart(2, '0')}</span>m{' '}
      <span className="v7-clock-num v7-clock-sec">{String(s).padStart(2, '0')}</span>s
    </span>
  );
}
