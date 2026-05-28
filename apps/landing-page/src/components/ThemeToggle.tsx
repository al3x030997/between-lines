'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  THEME_STORAGE_KEY,
  applyTheme,
  isThemeSetting,
  type ResolvedTheme,
  type ThemeSetting,
} from '@/lib/theme';

const NEXT_THEME: Record<ThemeSetting, ThemeSetting> = {
  dark: 'light',
  light: 'system',
  system: 'dark',
};

const THEME_ICON: Record<ThemeSetting, string> = {
  system: '◐',
  dark: '☾',
  light: '☀',
};

const THEME_LABEL: Record<ThemeSetting, string> = {
  system: 'System theme',
  dark: 'Dark theme',
  light: 'Light theme',
};

type Props = {
  className?: string;
};

export function ThemeToggle({ className = '' }: Props) {
  const [setting, setSetting] = useState<ThemeSetting>('dark');
  const [resolved, setResolved] = useState<ResolvedTheme>('dark');

  useEffect(() => {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    const initial = isThemeSetting(stored) ? stored : 'dark';
    setSetting(initial);
    setResolved(applyTheme(initial));
  }, []);

  useEffect(() => {
    if (setting !== 'system') return;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onSystemChange = () => setResolved(applyTheme('system'));

    media.addEventListener('change', onSystemChange);
    return () => media.removeEventListener('change', onSystemChange);
  }, [setting]);

  const next = NEXT_THEME[setting];
  const label = useMemo(
    () => `${THEME_LABEL[setting]} active. Switch to ${THEME_LABEL[next].toLowerCase()}.`,
    [next, setting],
  );

  const handleClick = () => {
    const target = NEXT_THEME[setting];
    window.localStorage.setItem(THEME_STORAGE_KEY, target);
    setSetting(target);
    setResolved(applyTheme(target));
  };

  return (
    <button
      type="button"
      className={`br-theme-toggle ${className}`.trim()}
      onClick={handleClick}
      aria-label={label}
      title={label}
      data-theme-setting={setting}
      data-resolved-theme={resolved}
    >
      <span aria-hidden="true">{THEME_ICON[setting]}</span>
    </button>
  );
}
