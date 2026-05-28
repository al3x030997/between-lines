# landing-page

The single web app for BetweenReads — both the marketing site **and** the
logged-in reader/writer surface live here. One Next.js app, one Vercel project,
one domain.

## Routes

**Marketing** — `/`, `/faq`, `/pricing`, `/about`, `/insider`, `/readers`,
`/creators`, `/betweenlines`, `/privacy`, plus version variants `/v6`–`/v11`.

**Logged-in reader/writer surface** (gated client-side by a mock session
written into `localStorage`):
- `/read` — Discover (filter sidebar, tabs, product grid)
- `/read/[book]` — Book page
- `/read/[book]/[chapter]` — Reading screen with Quiet mode + feedback panel
- `/store` — 7-tab Storefront
- `/account` — Account home
- `/profile` — Your reader profile
- `/reader/[handle]` — Public reader profile
- `/writer/[handle]` — Writer profile
- `/write` — Writer upload workspace
- `/auth/handoff` — Sign-in handoff (writes the mock session)

## Run

```bash
pnpm --filter @between-reads/landing-page dev
# → http://localhost:3000
```
