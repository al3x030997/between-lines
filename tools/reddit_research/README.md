# Reddit Research

File-based research pipeline that turns keywords into a Reddit corpus and
descriptive analysis. Full spec in [`docs/REQUIREMENTS.md`](docs/REQUIREMENTS.md).

## Setup

```bash
cd tools/reddit_research
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # optional; only needed for later packages
```

## Run discovery (package 01)

```bash
python -m src.discovery
```

Reads `config/keywords.yaml`, writes `data/subreddits.csv`. Override paths with
`--config` / `--out`.

## Run crawl (package 02)

```bash
python -m src.crawl                          # full run: all subs, top/year, cap 1000
python -m src.crawl --limit-subs 5 --cap-per-sub 50   # 5-sub smoke test
python scripts/validate_raw.py               # verify on-disk schema
```

Reads `data/subreddits.csv`, writes `data/raw/{sub}/{post_id}.json` (one file
per post) plus an append-only HTTP log at `data/raw/_run.log`. Restart-safe:
existing post files are skipped, and posts saved without comments get their
comments filled on re-run. SIGINT (Ctrl-C) finishes the in-flight request and
exits cleanly.

Useful flags: `--sort {hot,new,top}` (default `top`), `--time {hour,day,week,
month,year,all}` (default `year`, only for `top`), `--cap-per-sub`, `--max-depth`,
`--skip-comments`.

## Packages

| # | Name          | Input                     | Output                              |
| - | ------------- | ------------------------- | ----------------------------------- |
| 01 | discovery    | `config/keywords.yaml`    | `data/subreddits.csv`               |
| 02 | crawl        | `data/subreddits.csv`     | `data/raw/{sub}/{post_id}.json`     |
| 03 | text-prep    | `data/raw/`               | `data/corpus.parquet`               |
| 04 | analysis-prep| `data/corpus.parquet`     | `notebooks/descriptive.ipynb`, `data/features/` |

Packages 03–04 are not yet implemented.
