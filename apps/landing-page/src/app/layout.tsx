import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';
import './globals.css';

const THEME_INIT_SCRIPT = `
(function () {
  try {
    var key = 'betweenreads.theme';
    var stored = window.localStorage.getItem(key);
    var setting = stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system';
    var systemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    var resolved = setting === 'system' ? (systemDark ? 'dark' : 'light') : setting;
    var root = document.documentElement;
    root.dataset.theme = resolved;
    root.dataset.themePreference = setting;
    root.style.colorScheme = resolved;
  } catch (_) {
    document.documentElement.dataset.theme = 'light';
    document.documentElement.dataset.themePreference = 'system';
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
        {children}
        <Analytics />
      </body>
    </html>
  );
}
