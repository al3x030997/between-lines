# landing-page

Marketing site. No backend, no DB. Plain Next.js + a few interactive components.

Notable components:
- `IntakeModal` + `intake/{ReaderChapters,WriterChapters,IntakeDone}` — onboarding flow that splits visitors into reader vs writer paths.
- `Bookshelf`, `ChoiceCard`, `BothLink` — content / decision UI.
- `Nav`, `TweaksPanel` — global chrome.
- `lib/palettes.ts` — color system.

Migrated from `/Users/alex/betweenlines/` into the monorepo on 2026-05-09.

## Versions

The landing page is iterated as numbered variants under `src/app/vN/`. The root route `/` is a one-line re-export from whichever variant is currently the default — promoting a new version means changing exactly that one import in `src/app/page.tsx`.

Rules:
- **Monotonic integers only.** Every new variant gets the next unused integer (`v9`, `v10`, …). Never reuse a number; never use letter suffixes (`v8b`). If a variant is abandoned, its number stays burned.
- **`src/app/page.tsx` is the source of truth** for which variant is live. The comment above the export line marks it explicitly.
- **Old variants stay routable** at `/vN` for side-by-side comparison until they're 2+ generations behind. After that, move them to `src/app/_archive/vN/` — Next.js ignores `_`-prefixed folders, so they stop being deployed as public routes but remain in git for reference.

Current default: **v8** (see `src/app/page.tsx`).
