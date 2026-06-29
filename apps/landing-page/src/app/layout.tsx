import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';
import { ThemeBoundary } from '@/components/ThemeBoundary';
import './globals.css';

// Landing pages are locked to light; reader pages (paths under the
// (reader) route group) default to dark and respect the stored preference.
// Mirrored in lib/theme.ts — keep the two in sync.
const THEME_INIT_SCRIPT = `
(function () {
  try {
    var key = 'betweenreads.theme';
    var path = window.location.pathname;
    var readerPrefixes = ['/gallery','/write','/account','/profile','/reader','/writer','/store','/library'];
    var isNestedRead = path.indexOf('/read/') === 0;
    var isReader = readerPrefixes.some(function (p) {
      return path === p || path.indexOf(p + '/') === 0 || path.indexOf(p + '?') === 0;
    }) || isNestedRead;
    var isGallery = path === '/gallery' || path.indexOf('/gallery/') === 0 || path.indexOf('/gallery?') === 0;
    var root = document.documentElement;
    if (!isReader) {
      root.dataset.theme = 'light';
      root.dataset.themePreference = 'light';
      root.style.colorScheme = 'light';
      return;
    }
    var stored = window.localStorage.getItem(key);
    var setting = isGallery ? 'dark' : (stored === 'light' || stored === 'dark' ? stored : 'dark');
    root.dataset.theme = setting;
    root.dataset.themePreference = setting;
    root.style.colorScheme = setting;
  } catch (_) {
    document.documentElement.dataset.theme = 'light';
    document.documentElement.dataset.themePreference = 'light';
  }
})();
`;

export const metadata: Metadata = {
  title: 'BetweenReads — a platform for serious readers and serious writers',
  description: 'Discover emerging authors before they’re published. Join a community of serious readers and serious writers.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>
        <ThemeBoundary />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
