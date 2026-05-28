export type Tier = 'Reader' | 'Member';
export type Role = 'reader' | 'writer';

export type MockSession = {
  user: string;
  initial: string;
  handle: string;
  rc: number;
  sc: number;
  tier: Tier;
  roles: Role[];
  followers: number;
  following: number;
  ts: number;
};

const DEFAULT_FOLLOWERS = 412;
const DEFAULT_FOLLOWING = 38;

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

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function parseRoles(input: unknown): Role[] {
  if (!Array.isArray(input)) return ['reader'];
  const out: Role[] = [];
  for (const r of input) {
    if (r === 'reader' || r === 'writer') {
      if (!out.includes(r)) out.push(r);
    }
  }
  return out.length > 0 ? out : ['reader'];
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
    const handle: string = typeof parsed.handle === 'string' && parsed.handle.length > 0 ? parsed.handle : slugify(user);
    return {
      user,
      initial: typeof parsed.initial === 'string' && parsed.initial.length > 0 ? parsed.initial : user[0]!.toUpperCase(),
      handle,
      rc: typeof parsed.rc === 'number' && Number.isFinite(parsed.rc) ? parsed.rc : 0,
      sc: typeof parsed.sc === 'number' && Number.isFinite(parsed.sc) ? parsed.sc : 0,
      tier: parsed.tier === 'Member' ? 'Member' : 'Reader',
      roles: parseRoles(parsed.roles),
      followers: typeof parsed.followers === 'number' && Number.isFinite(parsed.followers) ? parsed.followers : DEFAULT_FOLLOWERS,
      following: typeof parsed.following === 'number' && Number.isFinite(parsed.following) ? parsed.following : DEFAULT_FOLLOWING,
      ts: typeof parsed.ts === 'number' ? parsed.ts : Date.now(),
    };
  } catch {
    return null;
  }
}

export type SetSessionInput = {
  user: string;
  rc: number;
  sc?: number;
  initial?: string;
  handle?: string;
  tier?: Tier;
  roles?: Role[];
  followers?: number;
  following?: number;
};

export function setMockSession(s: SetSessionInput): MockSession {
  const ls = safeStorage();
  const session: MockSession = {
    user: s.user,
    initial: s.initial ?? s.user[0]?.toUpperCase() ?? 'R',
    handle: s.handle ?? slugify(s.user),
    rc: s.rc,
    sc: s.sc ?? 0,
    tier: s.tier ?? 'Reader',
    roles: s.roles && s.roles.length > 0 ? s.roles : ['reader'],
    followers: s.followers ?? DEFAULT_FOLLOWERS,
    following: s.following ?? DEFAULT_FOLLOWING,
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
  setMockSession({
    user: cur.user,
    initial: cur.initial,
    handle: cur.handle,
    rc: next,
    sc: cur.sc,
    tier: cur.tier,
    roles: cur.roles,
    followers: cur.followers,
    following: cur.following,
  });
  return next;
}

export function addSC(delta: number): number {
  const cur = getMockSession();
  if (!cur) return 0;
  const next = Math.max(0, cur.sc + delta);
  setMockSession({
    user: cur.user,
    initial: cur.initial,
    handle: cur.handle,
    rc: cur.rc,
    sc: next,
    tier: cur.tier,
    roles: cur.roles,
    followers: cur.followers,
    following: cur.following,
  });
  return next;
}

export const MOCK_SESSION_KEY = KEY;
