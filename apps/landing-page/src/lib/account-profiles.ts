import type { Role, SetSessionInput, Tier } from './mock-session';

export type AccountProfile = {
  id: string;
  user: string;
  handle: string;
  initial: string;
  rc: number;
  sc: number;
  tier: Tier;
  roles: Role[];
  followers: number;
  following: number;
  avatarBg: string;
  avatarInk: string;
  badge?: 'kids';
};

// Preview accounts — one per user segment. The display name IS the segment label
// so the account picker doubles as a "view the app as…" switcher for demos.
// "First time login" = a freshly-created account (zero activity, no followers);
// "Frequent" = an established account with accumulated credits and a social graph.
export const ACCOUNT_PROFILES: AccountProfile[] = [
  {
    id: 'writer-new',
    user: 'Writer - First Time Login',
    handle: 'writer-first-time',
    initial: 'W',
    rc: 0,
    sc: 0,
    tier: 'Reader',
    roles: ['writer'],
    followers: 0,
    following: 0,
    avatarBg: 'linear-gradient(160deg, #b7e3c6 0%, #8fcfa6 100%)',
    avatarInk: '#10241a',
  },
  {
    id: 'reader-new',
    user: 'Reader - First Time Login',
    handle: 'reader-first-time',
    initial: 'R',
    rc: 0,
    sc: 0,
    tier: 'Reader',
    roles: ['reader'],
    followers: 0,
    following: 0,
    avatarBg: 'linear-gradient(160deg, #cdb7ec 0%, #a98fd6 100%)',
    avatarInk: '#1e1426',
  },
  {
    id: 'writer-frequent',
    user: 'Frequent Writer',
    handle: 'frequent-writer',
    initial: 'W',
    rc: 168,
    sc: 240,
    tier: 'Member',
    roles: ['reader', 'writer'],
    followers: 1280,
    following: 96,
    avatarBg: 'linear-gradient(160deg, #95d6ad 0%, #6fbf90 100%)',
    avatarInk: '#10241a',
  },
  {
    id: 'reader-frequent',
    user: 'Frequent Reader',
    handle: 'frequent-reader',
    initial: 'R',
    rc: 523,
    sc: 0,
    tier: 'Member',
    roles: ['reader'],
    followers: 86,
    following: 214,
    avatarBg: 'linear-gradient(160deg, #f0c75d 0%, #d8a93b 100%)',
    avatarInk: '#2a1f06',
  },
  {
    id: 'kid',
    user: 'Kid',
    handle: 'kid',
    initial: 'K',
    rc: 0,
    sc: 0,
    tier: 'Reader',
    roles: ['reader'],
    followers: 0,
    following: 0,
    avatarBg: 'linear-gradient(160deg, #ffd28a 0%, #ec9a6a 100%)',
    avatarInk: '#2a1a08',
    badge: 'kids',
  },
];

export function sessionForAccountProfile(profile: AccountProfile): SetSessionInput {
  return {
    user: profile.user,
    initial: profile.initial,
    handle: profile.handle,
    rc: profile.rc,
    sc: profile.sc,
    tier: profile.tier,
    roles: profile.roles,
    followers: profile.followers,
    following: profile.following,
    isKid: profile.badge === 'kids',
  };
}
