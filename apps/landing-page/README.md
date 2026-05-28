# landing-page

Marketing site for the Between Lines product family.

Migrated from `/Users/alex/betweenlines/` into the monorepo. Reader/writer intake flow,
bookshelf component, palette system. Standalone Next.js app — no backend.

## Run

```bash
pnpm --filter @between-reads/landing-page dev
# → http://localhost:3000
```

## Vercel

The sign-in button hands off to the separate reader app. Set this environment
variable on the landing-page Vercel project:

```bash
NEXT_PUBLIC_READER_URL=https://your-reader-app.vercel.app
```

Deploy the reader app as its own Vercel project with `apps/reader` as the root
directory. Its `/auth/handoff` route creates the mock session and redirects to
`/read`.
