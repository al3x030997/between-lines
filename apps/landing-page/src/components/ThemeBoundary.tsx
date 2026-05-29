'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { applyLightTheme, applyTheme, isReaderPath, readerDefaultSetting } from '@/lib/theme';

/**
 * Re-applies the theme on every client-side navigation. Landing pages are
 * forced to light; reader pages use the stored preference (defaulting to
 * dark). Pairs with the inline THEME_INIT_SCRIPT in app/layout.tsx which
 * handles first-paint to avoid FOUC.
 */
export function ThemeBoundary() {
  const pathname = usePathname() ?? '';

  useEffect(() => {
    if (pathname === '/gallery' || pathname.startsWith('/gallery/')) {
      applyTheme('dark');
    } else if (isReaderPath(pathname)) {
      applyTheme(readerDefaultSetting());
    } else {
      applyLightTheme();
    }
  }, [pathname]);

  return null;
}
