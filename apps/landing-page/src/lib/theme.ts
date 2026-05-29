export const THEME_STORAGE_KEY = 'betweenreads.theme';

export const THEME_SETTINGS = ['light', 'dark'] as const;

export type ThemeSetting = (typeof THEME_SETTINGS)[number];
export type ResolvedTheme = 'light' | 'dark';

/**
 * Path prefixes that belong to the reader app (the (reader) route group).
 * The landing/marketing site is locked to light theme; reader pages default
 * to dark and respect the stored preference.
 */
export const READER_PATH_PREFIXES = [
  '/read',
  '/gallery',
  '/write',
  '/account',
  '/profile',
  '/reader',
  '/writer',
  '/store',
];

export function isReaderPath(path: string): boolean {
  return READER_PATH_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`) || path.startsWith(`${p}?`));
}

export function isThemeSetting(value: unknown): value is ThemeSetting {
  return typeof value === 'string' && (THEME_SETTINGS as readonly string[]).includes(value);
}

export function resolveTheme(setting: ThemeSetting): ResolvedTheme {
  return setting;
}

export function applyTheme(setting: ThemeSetting): ResolvedTheme {
  const resolved = resolveTheme(setting);

  if (typeof document !== 'undefined') {
    const root = document.documentElement;
    root.dataset.theme = resolved;
    root.dataset.themePreference = setting;
    root.style.colorScheme = resolved;
  }

  return resolved;
}

/**
 * Force light theme regardless of stored preference — used on landing pages.
 * Returns 'light' so callers can sync their local state.
 */
export function applyLightTheme(): ResolvedTheme {
  if (typeof document !== 'undefined') {
    const root = document.documentElement;
    root.dataset.theme = 'light';
    root.dataset.themePreference = 'light';
    root.style.colorScheme = 'light';
  }
  return 'light';
}

/**
 * Resolve the initial setting for a reader page: use the stored preference if
 * one exists, otherwise default to dark.
 */
export function readerDefaultSetting(): ThemeSetting {
  if (typeof window === 'undefined') return 'dark';
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  return isThemeSetting(stored) ? stored : 'dark';
}
