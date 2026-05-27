# Reddit Research — Requirements

This is the **index** for the Reddit research pipeline. It defines the project goal, glossary, the data contract between packages, and shared non-functional requirements. Each package under `packages/` is a self-contained requirement spec for one implementation step, designed to be loaded into a fresh Claude conversation alongside this index — and nothing else.

## Project goal

Build a small, file-based pipeline that:

1. Takes a curated list of **search keywords** related to the literary / agent-match domain (authors querying literary agents, traditional and self publishing, writing craft, querying experiences).
2. Discovers **relevant subreddits** for those keywords.
3. **Crawls** posts and comments from those subreddits via Reddit's public `.json` endpoints (no OAuth).
4. Reduces the raw output to a clean **text corpus**.
5. Prepares that corpus for **NLP** (tokenization, optional embeddings, n-grams) and **descriptive analysis** (volume by sub, score distributions, length distributions, top contributors, time trends).

The pipeline is a research tool, not a product. It runs locally, persists everything to flat files, and is restartable.

## Glossary

- **Subreddit** — a community on reddit.com, addressed as `r/<name>`.
- **Post** (a.k.a. *submission*) — a top-level item in a subreddit. Has a title; may have selftext (text body) or be a link.
- **Comment** — a reply attached to a post or another comment.
- **Document** — for analysis, one row in the corpus. A document is either one post (title + selftext concatenated) or one comment.
- **Flair** — a short tag attached to a post or author by the subreddit (e.g. "Query Critique").
- **Score** — Reddit's upvotes minus downvotes for a post or comment.
- **Corpus** — the cleaned, flattened parquet file produced by package 03 and consumed by package 04.

## Data flow

```
config/keywords.yaml
        │
        ▼
┌─────────────────────┐
│ 01 discovery        │
└─────────────────────┘
        │
        ▼
data/subreddits.csv
        │
        ▼
┌─────────────────────┐
│ 02 crawl            │
└─────────────────────┘
        │
        ▼
data/raw/{subreddit}/{post_id}.json
        │
        ▼
┌─────────────────────┐
│ 03 text-prep        │
└─────────────────────┘
        │
        ▼
data/corpus.parquet
        │
        ▼
┌─────────────────────┐
│ 04 analysis-prep    │
└─────────────────────┘
        │
        ▼
notebooks/descriptive.ipynb
data/features/
```

Each arrow is a **file contract**. Packages talk to each other only through these files. The schemas below are the single source of truth — package files must reference these and not redefine them.

## Cross-package contracts (schemas)

### `config/keywords.yaml` — input to 01

```yaml
keywords:
  - text: "query letter"
    weight: 1.0           # optional, default 1.0
  - text: "literary agent"
  - text: "PubTips"
seed_subreddits:          # optional manual additions, bypass discovery scoring
  - PubTips
  - writing
```

### `data/subreddits.csv` — output of 01, input to 02

Columns (all strings unless noted):

| Column            | Type   | Notes                                                                 |
| ----------------- | ------ | --------------------------------------------------------------------- |
| `name`            | string | Subreddit name without `r/` prefix. Primary key.                      |
| `subscribers`     | int    | Member count at discovery time.                                       |
| `active_users`    | int    | Reddit's reported "online now" at discovery time (nullable).          |
| `description`     | string | Public description / sidebar summary.                                 |
| `match_keywords`  | string | Comma-joined list of keywords that surfaced this sub.                 |
| `relevance_score` | float  | 0.0–1.0. Computed by 01; method is 01's choice and documented there.  |
| `discovered_at`   | string | ISO 8601 UTC timestamp.                                               |

### `data/raw/{subreddit}/{post_id}.json` — output of 02, input to 03

One file per post. Schema:

```json
{
  "post": {
    "id": "abc123",
    "subreddit": "PubTips",
    "title": "...",
    "selftext": "...",
    "author": "username_or_[deleted]",
    "created_utc": 1715000000,
    "score": 42,
    "num_comments": 7,
    "url": "https://...",
    "permalink": "/r/PubTips/comments/abc123/...",
    "link_flair_text": "Query Critique",
    "over_18": false,
    "fetched_at": "2026-05-12T20:00:00Z"
  },
  "comments": [
    {
      "id": "def456",
      "parent_id": "t3_abc123",
      "author": "...",
      "body": "...",
      "score": 5,
      "created_utc": 1715000100,
      "depth": 0
    }
  ]
}
```

`parent_id` follows Reddit's prefix convention: `t3_` for posts, `t1_` for comments.

### `data/corpus.parquet` — output of 03, input to 04

| Column         | Type    | Notes                                                            |
| -------------- | ------- | ---------------------------------------------------------------- |
| `doc_id`       | string  | `t3_<id>` for posts, `t1_<id>` for comments. Primary key.        |
| `subreddit`    | string  |                                                                  |
| `kind`         | string  | `"post"` or `"comment"`.                                         |
| `parent_id`    | string  | Empty for posts.                                                 |
| `author`       | string  | `[deleted]` rows are dropped, so this is always a real handle.   |
| `created_utc`  | int64   | Unix seconds.                                                    |
| `score`        | int     |                                                                  |
| `title`        | string  | Post title; empty for comments.                                  |
| `body`         | string  | Raw markdown body (selftext for posts).                          |
| `body_clean`   | string  | Cleanup defined by 03 (markdown/URL/quote stripping).            |
| `url`          | string  | Post URL; empty for comments.                                    |
| `lang`         | string  | ISO 639-1 code from language detection.                          |

## Shared non-functional requirements

- **Politeness** — default to ≤ 1 request per second against `reddit.com` and `oauth.reddit.com` is not used. Sleep with jitter.
- **User-Agent** — every HTTP request sets a descriptive UA string, e.g. `between-reads-research/0.1 (by /u/<owner>)`.
- **Retries** — retry on HTTP 429, 500, 502, 503, 504 with exponential backoff (1 s → 2 s → 4 s → 8 s → 16 s, max 5 attempts). Treat 403/404 as permanent.
- **Resumability** — every stage must be restartable without redoing finished work. Use file existence on disk as the resume marker; don't keep state in memory only.
- **Secrets** — none expected. Public endpoints only. If a future package needs Anthropic, the API key lives in `tools/reddit_research/.env` (gitignored).
- **Determinism** — given the same inputs, 03 and 04 produce identical outputs. Pin random seeds.
- **Data retention** — raw JSON is kept indefinitely under `data/raw/`. The corpus is rebuildable from raw.
- **Storage** — flat files only (yaml, csv, json, parquet, ipynb). No database in this project.

## Package map

| Package                                         | Goal                                                  |
| ----------------------------------------------- | ----------------------------------------------------- |
| [01 discovery](packages/01-discovery.md)        | Keywords → ranked subreddit list                      |
| [02 crawl](packages/02-crawl.md)                | Subreddit list → raw posts and comments               |
| [03 text-prep](packages/03-text-prep.md)        | Raw JSON → cleaned, flattened text corpus             |
| [04 analysis-prep](packages/04-analysis-prep.md)| Corpus → descriptive notebook + NLP feature artifacts |

## Out of scope (project-wide)

- OAuth, PRAW, or any authenticated Reddit access.
- Real-time streaming or webhook-driven ingestion.
- Any UI, dashboard, or web service.
- A database (Postgres, SQLite, etc.).
- Cross-platform data (Twitter/X, Discord, forums). Reddit only.
- Modeling, classification, prediction. Only descriptive analysis and feature prep belong in package 04.

## Working with this document

When implementing a package, open **only** `REQUIREMENTS.md` (this file) and the one `packages/NN-*.md` you're working on. If you find you need information from another package's file, the contract above is incomplete — fix the contract here rather than reading sideways.
