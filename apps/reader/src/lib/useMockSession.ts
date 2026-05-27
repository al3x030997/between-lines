'use client';

import { useEffect, useState } from 'react';
import { getMockSession, MOCK_SESSION_KEY, type MockSession } from './mock-session';

export function useMockSession() {
  const [session, setSession] = useState<MockSession | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSession(getMockSession());
    setReady(true);

    const onStorage = (e: StorageEvent) => {
      if (e.key === MOCK_SESSION_KEY || e.key === null) {
        setSession(getMockSession());
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return { session, ready };
}
