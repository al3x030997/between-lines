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

export const ACCOUNT_PROFILES: AccountProfile[] = [
  {
    id: 'sarah',
    user: 'Sarah M.',
    handle: 'sarah-m',
    initial: 'S',
    rc: 142,
    sc: 75,
    tier: 'Reader',
    roles: ['reader', 'writer'],
    followers: 412,
    following: 38,
    avatarBg: 'linear-gradient(160deg, #95d6ad 0%, #6fbf90 100%)',
    avatarInk: '#10241a',
  },
  {
    id: 'alex',
    user: 'Alex K.',
    handle: 'alex-k',
    initial: 'A',
    rc: 87,
    sc: 14,
    tier: 'Member',
    roles: ['reader'],
    followers: 120,
    following: 64,
    avatarBg: 'linear-gradient(160deg, #f0c75d 0%, #d8a93b 100%)',
    avatarInk: '#2a1f06',
  },
  {
    id: 'mira',
    user: 'Mira O.',
    handle: 'mira-o',
    initial: 'M',
    rc: 31,
    sc: 0,
    tier: 'Reader',
    roles: ['reader'],
    followers: 22,
    following: 41,
    avatarBg: 'linear-gradient(160deg, #c8a8e0 0%, #9a7fc4 100%)',
    avatarInk: '#1e1426',
  },
  {
    id: 'kids',
    user: 'Kids',
    handle: 'kids',
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
  };
}
