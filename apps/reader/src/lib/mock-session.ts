export type Tier = 'Reader' | 'Member';

export type MockSession = {
  user: string;
  initial: string;
  rc: number;
  tier: Tier;
  ts: number;
};

const KEY = 'br_mock_session';

function safeStorage(): Storage | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function notify(value: string | null) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(
    new StorageEvent('storage', { key: KEY, newValue: value, storageArea: window.localStorage })
  );
}

export function getMockSession(): MockSession | null {
  const ls = safeStorage();
  if (!ls) return null;
  try {
    const raw = ls.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    const user: string = typeof parsed.user === 'string' && parsed.user.length > 0 ? parsed.user : 'Reader';
    return {
      user,
      initial: typeof parsed.initial === 'string' && parsed.initial.length > 0 ? parsed.initial : user[0]!.toUpperCase(),
      rc: typeof parsed.rc === 'number' && Number.isFinite(parsed.rc) ? parsed.rc : 0,
      tier: parsed.tier === 'Member' ? 'Member' : 'Reader',
      ts: typeof parsed.ts === 'number' ? parsed.ts : Date.now(),
    };
  } catch {
    return null;
  }
}

export type SetSessionInput = {
  user: string;
  rc: number;
  initial?: string;
  tier?: Tier;
};

export function setMockSession(s: SetSessionInput): MockSession {
  const ls = safeStorage();
  const session: MockSession = {
    user: s.user,
    initial: s.initial ?? s.user[0]?.toUpperCase() ?? 'R',
    rc: s.rc,
    tier: s.tier ?? 'Reader',
    ts: Date.now(),
  };
  const serialized = JSON.stringify(session);
  if (ls) ls.setItem(KEY, serialized);
  notify(serialized);
  return session;
}

export function clearMockSession(): void {
  const ls = safeStorage();
  if (ls) ls.removeItem(KEY);
  notify(null);
}

export function addRC(delta: number): number {
  const cur = getMockSession();
  if (!cur) return 0;
  const next = Math.max(0, cur.rc + delta);
  setMockSession({ user: cur.user, initial: cur.initial, rc: next, tier: cur.tier });
  return next;
}

export const MOCK_SESSION_KEY = KEY;
