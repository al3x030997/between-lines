# between-lines monorepo

Three apps, shared domain (literary agents / authors / queries).

## Layout

```
apps/
├── agent-match/          # find literary agents (FastAPI + Next.js)
│   ├── backend/          # Python — package name stays `autoquery` (legacy, DO NOT rename)
│   ├── frontend/         # Next.js 14
│   └── docs/             # app-specific specs (features/, examples/)
├── agent-list/           # query-letter management (frontend stub for now)
└── landing-page/         # marketing site (was /Users/alex/betweenlines/)

packages/
├── canon/                # shared Thema vocabulary (yaml/ + python/ + ts/ loaders)
├── types/                # TS types from FastAPI OpenAPI
└── tsconfig/             # shared tsconfig presets

infra/                    # shared docker-compose (postgres, redis, ollama)
docs/                     # cross-cutting (MASTER.md, IMPLEMENTATION_PLAN.md, ADRs)
```

## Conventions

- **Naming**: kebab-case for directories and JS package names. Python packages stay snake_case.
- **One shared backend**: agent-match's FastAPI serves both apps. agent-list endpoints go under `apps/agent-match/backend/autoquery/api/routes/list/`. Don't spin up a second backend without a strong reason.
- **Canon is shared**: never duplicate the YAMLs. Import from `betweenlines_canon` (Python) or `@between-lines/canon` (TS).
- **No secrets in git**: per-app `.env` files (gitignored), root `.env.example` documents shared vars.

## Commands

```bash
pnpm install              # JS deps for all workspaces
uv sync                   # Python deps for all workspaces
pnpm dev                  # turbo: dev all
pnpm build                # turbo: build all
pnpm test                 # turbo: test all JS workspaces
uv run pytest -C apps/agent-match/backend   # Python tests
```

App-specific:
```bash
pnpm --filter @between-lines/agent-match-web dev      # agent-match frontend
pnpm --filter @between-lines/agent-list-web dev       # agent-list (port 3001)
pnpm --filter @between-lines/landing-page dev         # landing page
```

Backend specifics:
```bash
cd apps/agent-match/backend
uv run uvicorn autoquery.api.main:app --reload
uv run alembic upgrade head     # alembic.ini is CWD-relative, must run from here
uv run celery -A autoquery.tasks.celery_app worker --loglevel=info
```

Full stack:
```bash
cd apps/agent-match && docker compose up
```

## Migration notes (kept for context — remove after a few weeks of stable use)

- Original autoquery repo lives at `/Users/alex/autoquery/` (untouched, for rollback).
- Python package was kept as `autoquery` to avoid rewriting ~50 import sites.
- Postgres + Ollama volume names preserved (`autoquery_implementation_*`) so existing data continues to work.
- Old Node.js `backend/` and loose marketing HTML at the autoquery root were intentionally NOT migrated.

## Adding a new app

1. Create `apps/<new-app>/` with at minimum a `package.json` (kebab-case name `@between-lines/<new-app>`) and a CLAUDE.md.
2. If it needs Python: add to `[tool.uv.workspace] members` in root `pyproject.toml`.
3. If it has its own services: create `apps/<new-app>/docker-compose.yml` and `include:` the shared infra.
4. Update root README.md and this file.
