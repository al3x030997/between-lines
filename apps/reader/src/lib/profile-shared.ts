/**
 * Types shared between writer and reader profiles.
 * Keeps the two mock modules small and the section components portable.
 */

export type BadgeTone = 'reader' | 'writer' | 'member' | 'beta' | 'longlist' | 'neutral';
export type ProfileBadge = { label: string; tone: BadgeTone };

export type SignatureQuote = {
  label: string;
  text: string;
  attribution: string;
};

export type LinkRef =
  | { kind: 'book'; slug: string; title: string; subtitle?: string }
  | { kind: 'writer'; handle: string; title: string; subtitle?: string }
  | { kind: 'reader'; handle: string; title: string; subtitle?: string }
  | { kind: 'external'; href: string; title: string; subtitle?: string }
  | { kind: 'plain'; title: string; subtitle?: string };

export type NowCard = {
  variant: 'gold' | 'neutral' | 'writer' | 'sage' | 'beta';
  label: string;
  /** Single primary value. Use `values` for multi-link rows like TBR. */
  link?: LinkRef;
  values?: LinkRef[];
  subtitle?: string;
};

export type MemorableCard = {
  kind: 'Character' | 'Quote' | 'Writer';
  /** Character/writer card: name + source */
  link?: LinkRef;
  source?: string;
  note?: string;
  /** Quote card */
  quote?: string;
  attribution?: string;
};

export type WishCard = {
  label: string;
  link: LinkRef;
  source?: string;
  body: string;
  /** Tall left card or right column */
  tall?: boolean;
  /** Optional "9 other readers would also enter Wonderland" trailing line */
  echo?: string;
  /** Color variant */
  variant: 'mint' | 'amber' | 'rose' | 'writer';
};

export type BookEntry = LinkRef & { author?: string };

export type ClubEntry = {
  icon: string;
  iconBg: string;
  link: LinkRef;
  meta: string;
};

export type PodEntry = {
  icon: string;
  name: string;
  type: 'Reader Pod' | 'Writer Pod';
  description: string;
  members: string;
};

export type ExternalLink = {
  icon: string;
  link: LinkRef;
  subtitle?: string;
};

export type Toggle = {
  label: string;
  subtitle?: string;
  on: boolean;
};

export type CreditStat = { icon: string; num: string; label: string };

export type ProfileHeroData = {
  avatarEmoji: string;
  displayName: string;
  badges: ProfileBadge[];
  bio: string;
  quote: SignatureQuote;
};

export type Tag = { label: string; href?: string };
