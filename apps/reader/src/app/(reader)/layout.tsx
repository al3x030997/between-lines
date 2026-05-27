import type { ReactNode } from 'react';
import { Nav } from '@/components/Nav';
import { SessionGate } from '@/components/SessionGate';

export default function ReaderLayout({ children }: { children: ReactNode }) {
  return (
    <SessionGate>
      <Nav />
      {children}
    </SessionGate>
  );
}
