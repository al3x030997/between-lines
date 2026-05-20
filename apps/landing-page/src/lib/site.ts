export function siteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL;
  if (!url) {
    throw new Error('NEXT_PUBLIC_SITE_URL is not set');
  }
  return url.replace(/\/$/, '');
}

export function buildInsiderUrl(token: string): string {
  return `${siteUrl()}/api/insider/unlock?t=${encodeURIComponent(token)}`;
}

export function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return true;
  try {
    const a = new URL(origin);
    const b = new URL(siteUrl());
    return a.origin === b.origin;
  } catch {
    return false;
  }
}
