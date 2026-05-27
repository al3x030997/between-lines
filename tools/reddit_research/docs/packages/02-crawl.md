# Package 02 — Crawl

> Read this alongside `../REQUIREMENTS.md`. Do not consult other package files.

## Goal

For every subreddit in `data/subreddits.csv`, fetch posts and their comments via Reddit's public `.json` endpoints and persist one JSON file per post on disk.

**Scope note — subreddit-first, not post-search.** The crawl is community-scoped: it fetches every top post inside each sub from package 01's list, with no keyword filter at the post level. A post mentioning a competitor (e.g. "wattpad") in a subreddit that did **not** make it into `subreddits.csv` is *not* captured by this package. The trade-off is intentional — focused community crawls give higher signal-to-noise than Reddit's site-wide search (which is capped, ranked-by-relevance, and lossy). Cross-community coverage, if it turns out to matter, is a separate sibling package (see Out of scope).

## Input

`data/subreddits.csv` — see schema in `REQUIREMENTS.md` § Cross-package contracts. The crawl reads the `name` column and ignores `relevance_score` (filtering happened in 01).

## Output

`data/raw/{subreddit}/{post_id}.json` — one file per post, schema in `REQUIREMENTS.md` § Cross-package contracts. Subreddit names in paths are lowercased.

A run log goes to `data/raw/_run.log` (append-only) with one line per HTTP request: timestamp, URL, status, retries. The log is operational, not consumed downstream.

## Functional requirements

1. **Endpoints** — use only:
   - `GET https://www.reddit.com/r/{sub}/{sort}.json?limit=100&after=<cursor>&t=<time>`
     - `sort` ∈ `{hot, new, top}`; default `top`.
     - `t` ∈ `{hour, day, week, month, year, all}`; only meaningful for `top`. Default `year`.
   - `GET https://www.reddit.com/comments/{post_id}.json?limit=500&depth=<max_depth>`

2. **Pagination** — follow the `after` cursor returned in each listing response until it's null or the configured per-sub cap is reached (default cap: 1000 posts per subreddit, configurable).

3. **Comments** — for every post fetched, request its comment tree separately. Flatten the nested tree into the array shape defined in the contract. Each comment carries its own `depth` (0 = top-level reply to the post).

4. **Resumability** — before issuing the listing call, list `data/raw/{subreddit}/` and skip post IDs that already have a JSON file. Before fetching comments, skip if the existing JSON has a non-empty `comments` array (allows re-running to fill in comments for older crawls).

5. **Rate limit + retries** — follow `REQUIREMENTS.md` § Shared non-functional requirements. Sleep ≥ 1 s between requests, with ±200 ms jitter.

6. **User-Agent** — every request sets the UA described in `REQUIREMENTS.md`.

7. **Atomic writes** — write each JSON to `{post_id}.json.tmp` then rename to `{post_id}.json`. Prevents half-written files if the process is killed.

## Non-functional requirements

- The crawl must be able to run unattended overnight. A SIGINT (Ctrl-C) should finish the in-flight request, flush the log, and exit cleanly.
- Memory footprint is bounded — never accumulate all posts in memory; stream and write as you go.
- HTTP client: `httpx` (already in `requirements.txt`).

## Open questions for the implementing conversation

- **Comment depth limit** — default to `depth=10`. Reddit's `more` continuation tokens are ignored by default; document if you change that.
- **Handling `[deleted]` / `[removed]` content** — keep the record (preserves thread structure and metadata) but leave `body` as the literal `"[deleted]"` / `"[removed]"`. Drop in 03.
- **Per-subreddit caps** — should they vary by subscriber count? Default flat cap of 1000; revisit only if storage becomes a problem.
- **Time window** — start with `sort=top&t=year`. Add `sort=new` runs later if more breadth is needed.

## Out of scope

- Text cleaning, deduplication, language detection — all of that is 03.
- Re-fetching to update scores for already-stored posts. Scores are a snapshot at `fetched_at`.
- Crawling user pages, multireddits, or modlogs.
- **Site-wide keyword search** (`https://www.reddit.com/search.json?q=<keyword>`) to find posts in subs not in `data/subreddits.csv`. If cross-community coverage turns out to matter after looking at the corpus, add it as a sibling package (call it `02b-keyword-search` or similar) that writes into the same `data/raw/{sub}/{post_id}.json` layout. Package 03 walks the raw directory regardless of how files got there, so the contract holds. Defer this decision until 02's output is in hand.

## Verification

The package is complete when:

1. Running the crawler on a 5-subreddit slice of `subreddits.csv` creates `data/raw/{sub}/*.json` files whose schema matches the contract (validate with a small script).
2. Killing the process mid-run and restarting it does not re-fetch any post whose file already exists.
3. The `_run.log` shows no unhandled 5xx or 429 entries — only successful retries.
