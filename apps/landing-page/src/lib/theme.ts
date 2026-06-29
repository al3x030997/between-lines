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
  '/gallery',
  '/write',
  '/account',
  '/profile',
  '/reader',
  '/writer',
  '/store',
  '/library',
];
// Note: /write (the writer Studio) is covered above and is the public,
// sign-up-nudged guest route (see SessionGate PUBLIC_EXACT) — guests get the
// bright guest-play skin over it. The logged-out /read page is a standalone
// top-level marketing page, locked to light like the rest of the marketing
// site, so it's intentionally not listed here.

export function isReaderPath(path: string): boolean {
  if (path.startsWith('/read/')) return true;
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
 * Toggle the bright, kid-friendly reader skin. Kept separate from `data-theme`
 * so the two concerns don't tangle: kids mode locks to light and overrides the
 * reader tokens via `html[data-kids='on']` in globals.css. When turning the
 * skin on we also force the resolved theme to light (the toggle is hidden for
 * kids, so the stored preference is irrelevant while it's on).
 */
export function applyKidsSkin(on: boolean): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (on) {
    root.dataset.kids = 'on';
    root.dataset.theme = 'light';
    root.style.colorScheme = 'light';
  } else {
    delete root.dataset.kids;
  }
}

/**
 * Light, landing-matching gallery skin for logged-out visitors. The gallery is
 * still public, so guests should see it in the bright paper/ink/yellow landing
 * aesthetic rather than the dark cinematic gallery that logged-in readers get.
 * Toggled via `html[data-gallery-guest='on']` so the override stays isolated from
 * `data-theme`/`data-kids`. Mounted only on /gallery and cleared on unmount.
 */
export function applyGalleryGuestSkin(on: boolean): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (on) {
    root.dataset.galleryGuest = 'on';
    root.dataset.theme = 'light';
    root.style.colorScheme = 'light';
  } else {
    delete root.dataset.galleryGuest;
  }
}

/**
 * Light, landing-matching skin for the logged-out /write playground.
 * It reuses the real Studio screen, but a guest should meet it
 * in the bright paper/ink/yellow landing aesthetic (not the dark reader theme)
 * and with sign-up affordances visible. Toggled via `html[data-guest-play='on']`
 * so the override stays isolated from `data-theme`/`data-kids`/`data-gallery-guest`.
 * Mounted only on the guest playgrounds and cleared on unmount.
 */
export function applyGuestPlaygroundSkin(on: boolean): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (on) {
    root.dataset.guestPlay = 'on';
    root.dataset.theme = 'light';
    root.style.colorScheme = 'light';
  } else {
    delete root.dataset.guestPlay;
  }
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
