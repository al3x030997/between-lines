# agent-list

Query-letter management tool for authors. Replaces ad-hoc agent files / spreadsheets.

Same domain as `agent-match` — they share users, agent data, and the canon vocabulary.
For now there's only a frontend stub; agent-list calls the agent-match FastAPI backend
when API endpoints land (planned routers under `apps/agent-match/backend/autoquery/api/routes/list/`).

## Run

```bash
pnpm --filter @between-reads/agent-list-web dev
# → http://localhost:3001
```
