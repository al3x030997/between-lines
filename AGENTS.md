# Repository Guidelines

## Project Structure & Module Organization

This is a pnpm/turbo and uv monorepo. App code lives under `apps/`: `agent-match` contains the FastAPI backend and Next.js frontend, `agent-list` is the query-letter app, `landing-page` is the marketing site, and `reader` is a newer reader app. Shared packages live under `packages/`, including `canon` vocabulary loaders and shared TypeScript config. Cross-cutting docs are in `docs/`, infrastructure is in `infra/`, and scripts/utilities are in `tools/`. Python tests are primarily in `apps/agent-match/backend/tests`; static web assets for the landing page live in `apps/landing-page/public`.

## Build, Test, and Development Commands

Use pnpm from the repo root for JavaScript workspaces:

```bash
pnpm install
pnpm dev
pnpm build
pnpm test
pnpm typecheck
pnpm --filter @between-reads/landing-page dev
```

`pnpm dev/build/test/typecheck` delegate through Turbo. Use filters for app-specific work, for example `@between-reads/agent-match-web` or `@between-reads/agent-list-web`. For Python, run `uv sync`, then `uv run pytest -C apps/agent-match/backend`. Backend commands that depend on relative config, such as Alembic, should be run from `apps/agent-match/backend`.

## Coding Style & Naming Conventions

Use TypeScript for frontends and Python 3.11+ for backend code. Keep directory and package names kebab-case for JavaScript workspaces, and snake_case for Python modules. The legacy FastAPI package name remains `autoquery`; do not rename it. Shared canon imports should come from `betweenreads_canon` in Python or `@between-reads/canon` in TypeScript. Python follows Ruff settings in `pyproject.toml` with a 100-character line length.

## Testing Guidelines

Python tests use pytest and are named `test_*.py`. Place backend tests in `apps/agent-match/backend/tests`. Prefer focused unit tests for parsers, scoring, and API behavior, and add integration coverage when changing matching, crawling, auth, or upload flows. JavaScript workspaces should expose `test`, `typecheck`, and `build` scripts when applicable so root Turbo commands can validate them.

## Commit & Pull Request Guidelines

Recent commits use scoped, imperative subjects such as `landing-page/v11: drop CTA boxes` or `landing-page/faq: align split headers`. Follow that pattern: `<area>: <concise change>`. Pull requests should include a short description, validation commands run, linked issues when relevant, and screenshots or screen recordings for visual landing-page/frontend changes. Call out migrations, environment changes, and any intentionally skipped tests.

## Security & Configuration Tips

Do not commit secrets. Use per-app `.env` files and update `.env.example` when adding required variables. The landing page currently has its own waitlist/insider configuration; shared service configuration belongs in root docs or app-specific README files.
