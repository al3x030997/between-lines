# between-lines

Monorepo for the Between Lines product family.

## Apps

- **agent-match** (`apps/agent-match/`) — helps authors find literary agents. FastAPI backend + Next.js frontend.
- **agent-list** (`apps/agent-list/`) — query-letter management tool. Frontend stub for now; uses agent-match backend.
- **landing-page** (`apps/landing-page/`) — marketing site.

## Shared

- **packages/canon** — Thema-based literary vocabulary (YAML source + Python and TS loaders).
- **packages/types** — TypeScript types generated from the FastAPI OpenAPI schema.
- **infra/** — shared docker-compose for postgres, redis, ollama.

## Toolchain

- pnpm workspaces + Turborepo for JS.
- uv workspaces for Python.
- Node >=20, Python >=3.11.

## Common commands

```bash
pnpm install              # install JS deps across all workspaces
uv sync                   # install Python deps across all workspaces
pnpm dev                  # turbo: run all dev scripts
pnpm build                # turbo: build all
pnpm test                 # turbo: test all JS workspaces
uv run pytest             # run Python tests
```

See per-app READMEs for app-specific instructions.
