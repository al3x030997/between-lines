'use client';

import { useState } from 'react';
import BetweenCharacters from './sections/BetweenCharacters';
import IntakeDialog from '@/components/IntakeDialog';
import { SiteNav } from '@/components/SiteNav';

export default function V13PreviewPage() {
  const [intake, setIntake] = useState<{ mode: 'reader' | 'writer' } | null>(null);
  return (
    <main style={{ background: '#FFF9F0', minHeight: '100vh' }}>
      <SiteNav onJoin={() => setIntake({ mode: 'reader' })} />
      <BetweenCharacters onAddQuote={() => setIntake({ mode: 'reader' })} />
      {intake && <IntakeDialog mode={intake.mode} onClose={() => setIntake(null)} />}
    </main>
  );
}
