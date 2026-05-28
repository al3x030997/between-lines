import type { ReactNode } from 'react';
import { ReaderNav } from '@/components/ReaderNav';
import { SessionGate } from '@/components/SessionGate';
import { CartProvider } from '@/lib/cart';

export default function ReaderLayout({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <SessionGate>
        <ReaderNav />
        {children}
      </SessionGate>
    </CartProvider>
  );
}
