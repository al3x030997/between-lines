# agent-match

Helps book authors find matching English-language literary agents.

- **backend/** — FastAPI + Postgres/pgvector + Celery + Ollama. Crawls agency sites,
  extracts profiles via LLM, scores against manuscript profiles.
- **frontend/** — Next.js 14, conversational chat flow, ranked results.
- **docs/** — feature specs, walkthroughs, plans.

## Run (full stack)

```bash
cd apps/agent-match
docker compose up
# api: http://localhost:8000  frontend: http://localhost:3000  review: http://localhost:8501
```

Shared infra (postgres, redis, ollama) is included from `../../infra/docker-compose.yml`.

## Run (local dev)

```bash
# backend
cd apps/agent-match/backend
uv sync
uv run uvicorn autoquery.api.main:app --reload

# frontend
cd apps/agent-match/frontend
pnpm dev
```

## Tests

```bash
cd apps/agent-match/backend
uv run pytest
```
