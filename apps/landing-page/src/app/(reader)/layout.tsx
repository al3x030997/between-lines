import type { ReactNode } from 'react';
import { KidsSkinController } from '@/components/KidsSkinController';
import { ReaderNav } from '@/components/ReaderNav';
import { SessionGate } from '@/components/SessionGate';
import { CartProvider } from '@/lib/cart';
import { SearchProvider } from '@/lib/discover-search';

export default function ReaderLayout({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <SessionGate>
        <KidsSkinController />
        <SearchProvider>
          <ReaderNav />
          {children}
        </SearchProvider>
      </SessionGate>
    </CartProvider>
  );
}
