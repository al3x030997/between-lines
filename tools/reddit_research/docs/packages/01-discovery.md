# Package 01 — Subreddit Discovery

> Read this alongside `../REQUIREMENTS.md`. Do not consult other package files.

## Goal

Turn a curated keyword list into a ranked list of candidate subreddits, with enough metadata (size, activity, description) to decide which ones are worth crawling.

## Input

`config/keywords.yaml` — see schema in `REQUIREMENTS.md` § Cross-package contracts. The file is human-edited and may include manually pinned `seed_subreddits`.

## Output

`data/subreddits.csv` — see schema in `REQUIREMENTS.md` § Cross-package contracts.

Rows must be sorted by `relevance_score` descending, ties broken by `subscribers` descending.

## Functional requirements

1. **Discovery strategies** — combine at least two of the following to build the candidate pool. The exact mix is this package's choice:
   - Reddit's subreddit search: `GET https://www.reddit.com/subreddits/search.json?q=<keyword>&limit=25`. Iterate over all input keywords.
   - Manually pinned `seed_subreddits` from the input yaml.
   - Optional: scrape related-subreddit links from each candidate's sidebar (`/r/<name>/about.json` → `description`, plus the `Wiki`-style sidebar parse if present).

2. **Deduplication** — case-insensitive on `name`. Merge `match_keywords` across duplicates.

3. **Filtering** — drop subreddits where:
   - `over_18 == true` (out of scope for literary research), OR
   - the description suggests the sub is off-topic (e.g. a homonym — "r/writing" the technical-writing-of-essays vs. fiction writing). Off-topic detection is part of relevance scoring below.

   No minimum subscriber threshold — small niche communities are in scope for competitor research and often have the highest signal-to-noise.

4. **Relevance scoring** — every row gets a `relevance_score` in `[0.0, 1.0]`. This package decides the method. Reasonable options:
   - Keyword-overlap baseline: fraction of input keywords found in `name + title + description` (cheap, deterministic).
   - LLM scoring: send each candidate's name + description to Claude with the keyword list, ask for a 0–1 relevance estimate. Requires `ANTHROPIC_API_KEY`; document this if chosen.
   - Hybrid: use overlap as a prefilter, LLM to rank the survivors.

5. **Output metadata** — every row records `discovered_at` as a UTC ISO 8601 timestamp at the moment of fetch.

## Non-functional requirements

- Respect the shared rate limit and retry policy in `REQUIREMENTS.md`. Discovery is a one-shot run, so a few minutes of total wall time is fine.
- The discovery run is **idempotent**: re-running it with the same `keywords.yaml` overwrites `subreddits.csv` and produces the same output (modulo Reddit's own changes).

## Open questions for the implementing conversation

- **Use Claude for relevance scoring?** Trade-off: better quality but adds a dependency and cost. Default to keyword-overlap; upgrade to hybrid if results are noisy.
- **How many candidates to keep?** Suggest a cap (e.g. top 50) but make it configurable.

## Out of scope

- Fetching post or comment content from any subreddit — that's package 02.
- Storing historical discovery runs. The CSV is the latest snapshot.
- Categorizing subreddits into sub-topics. That's a problem for analysis (04) if at all.

## Verification

The package is complete when:

1. Running discovery on a `keywords.yaml` that includes `"query letter"` and `"literary agent"` produces a `subreddits.csv` that contains `PubTips` and `writing` near the top.
2. Re-running with no changes produces a byte-identical file (modulo timestamps).
3. Every column in the schema is populated for every row (nullable columns may be empty strings).
