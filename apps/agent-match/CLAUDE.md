# agent-match

Direct-to-source crawler + LLM extractor + matching engine for literary agents. Two stages:

1. **Agent DB** — crawl agency sites → classify pages → extract structured profiles via Ollama/Claude → manual review → Postgres+pgvector.
2. **Matching** — author runs a conversational flow → embedding → 4-signal scoring (genre + FTS + semantic + audience) → MMR diversification → ranked results.

## Backend (apps/agent-match/backend/)

- Python package is named `autoquery` (legacy, kept to avoid rewriting imports).
- Async httpx for Ollama calls (`page_classifier.py`, `profile_extractor.py`).
- DB sessions via `SessionLocal()` from `autoquery/database/db.py` — manual open/close.
- Tests use SQLite in-memory with TypeDecorator adapters for PG types (ARRAY→JSON, JSONB→JSON, Vector→Text). See `tests/conftest.py`.
- Alembic config (`alembic.ini`) is CWD-relative — run alembic from `backend/`.
- Celery workers + Redis broker for crawl tasks, monthly recrawl scheduler.
- Quality gate produces score (0-1) + action (extract / extract_with_warning / discard).

## Frontend (apps/agent-match/frontend/)

- Next.js 14 App Router + TypeScript + Tailwind.
- Dark theme: stone-900 bg, magenta accent (`#d6336c`), Crimson Pro headings, DM Sans body.
- State: FlowContext (useReducer) + AuthContext, SessionStorage persistence.
- framer-motion for chat bubble & card animations.
- JWT in localStorage, refresh on mount.
- API client: `src/lib/api.ts` with typed fetch wrappers.

## Hard constraints

1. **Direct-to-source only** — aggregators (MSWL, QueryTracker, PublishersMarketplace) are blacklisted.
2. **Store more, show less** — original wishlist/bio/hard-no texts stored internally for embedding quality and review, but NOT exposed in the public API.
3. **English only** in MVP.

## See also

- `docs/MASTER.md` (root) — authoritative spec.
- `docs/features/` — per-feature specs (00–17).
- `docs/examples/aashna_avachat_*.{txt,yaml,md}` — full L0→L3 pipeline walkthrough.
