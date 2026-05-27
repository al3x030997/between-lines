# reader

Logged-in surface for readers & writers. Hosts the Reader Mode (Discover · Book · Read screens with Quiet overlay and feedback panel) and the Storefront (7 tabs: Ebooks · Illustrations · BetweenLines · Volume · ReadCredits · Merch · Gift).

## Run

```bash
pnpm --filter @between-reads/reader dev   # port 3002
```

## Auth

**Mock session** — there is no real auth yet. The landing-page Sign-In button navigates to `/auth/handoff?u=…&rc=…` here, which writes `localStorage['br_mock_session']` and redirects to `/read`. The single helper module at `src/lib/mock-session.ts` is the swap-point when real auth lands.

`SessionGate` (inside `(reader)/layout.tsx`) redirects to the landing page if the session flag is missing — so unauthenticated visitors don't see chrome.

## Styling

No Tailwind. Color tokens live in `src/app/globals.css`, ported from the landing-page v11 palette (`--v11-yellow`, `--v11-divider`, `--v11-ink`, `--v11-accent`) plus reader-specific semantic accents (`--br-rc-gold`, `--br-free-bg`, `--br-beta-bg`, `--br-premium*`).

Premium-tier purple is a translation of the source mockup's `#9575cd` / `#3c3489` — picked by `/frontend-design:frontend-design` to harmonise with v11's emerald accent.
