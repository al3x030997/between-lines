# agent-list

Replaces ad-hoc agent files / spreadsheets that authors use to track query letters.

Empty stub. When endpoints land, they go under `apps/agent-match/backend/autoquery/api/routes/list/` — agent-list shares the agent-match backend (one DB, one auth, one Postgres). Don't spin up a separate FastAPI service.

Shared with agent-match:
- Same users / accounts.
- Same agent records (one canonical Agent table).
- Same canon vocabulary via `@between-lines/canon`.

agent-list-only:
- Query letter drafts, submission tracking, response tracking.
- These are net-new tables — add Alembic migrations under `apps/agent-match/backend/autoquery/database/migrations/`.

Run on port 3001 to coexist with agent-match's frontend on 3000.
