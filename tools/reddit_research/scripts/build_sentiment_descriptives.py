"""Initial descriptive sentiment dataset: r/Wattpad posts, last 2 years, keep-flair set.

Reads:
  data/corpus_wattpad_full.parquet

Outputs:
  data/sentiment_descriptives.parquet  — per-post: ids, time, flair, vader_*, body_is_empty

Scope (kept narrow for the first analysis):
  - kind == "post"
  - subreddit == "Wattpad"
  - created_utc >= today - 2 years
  - link_flair_text in KEEP (platform-discussion flairs only; see
    tools/reddit_research/scripts/crawl_wattpad_by_flair.py::DEFAULT_SKIP for the
    inverse list and analysis/generate_flair_charts.py::PLATFORM_FLAIRS)

Usage:
    python scripts/build_sentiment_descriptives.py
"""
from __future__ import annotations

import sys
from datetime import timedelta
from pathlib import Path

import pandas as pd
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

REPO_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO_ROOT / "src"))
from scope import KEEP_FLAIRS  # noqa: E402

CORPUS = REPO_ROOT / "data" / "corpus_wattpad_full.parquet"
OUT = REPO_ROOT / "data" / "sentiment_descriptives.parquet"
LOOKBACK_YEARS = 2


def main() -> int:
    df = pd.read_parquet(CORPUS)
    cutoff = pd.Timestamp.utcnow().normalize() - timedelta(days=365 * LOOKBACK_YEARS)
    df["ts"] = pd.to_datetime(df["created_utc"], unit="s", utc=True)

    posts = df[
        (df["kind"] == "post")
        & (df["subreddit"].str.lower() == "wattpad")
        & (df["ts"] >= cutoff)
        & (df["link_flair_text"].isin(KEEP_FLAIRS))
    ].drop_duplicates(subset="doc_id").copy()
    print(f"filtered posts: {len(posts):,}  (cutoff {cutoff.date()}, {len(KEEP_FLAIRS)} kept flairs)")

    body = posts["body"].fillna("").str.strip()
    title = posts["title"].fillna("").str.strip()
    posts["body_is_empty"] = body.eq("")
    posts["body_chars"] = body.str.len()
    posts["title_chars"] = title.str.len()
    posts["month"] = posts["ts"].dt.to_period("M").astype(str)

    sid = SentimentIntensityAnalyzer()
    text = (title + " " + body).str.strip()
    en_mask = posts["lang"].fillna("en").eq("en")
    print(f"  english rows: {en_mask.sum():,} / {len(posts):,}")

    scores = text.where(en_mask).apply(lambda t: sid.polarity_scores(t) if isinstance(t, str) else None)
    posts["vader_compound"] = scores.apply(lambda s: s["compound"] if s else pd.NA)
    posts["vader_pos"] = scores.apply(lambda s: s["pos"] if s else pd.NA)
    posts["vader_neg"] = scores.apply(lambda s: s["neg"] if s else pd.NA)
    posts["vader_neu"] = scores.apply(lambda s: s["neu"] if s else pd.NA)

    keep_cols = [
        "doc_id", "ts", "month", "author", "subreddit",
        "link_flair_text", "score",
        "title", "body_chars", "title_chars", "body_is_empty",
        "vader_compound", "vader_pos", "vader_neg", "vader_neu",
        "url",
    ]
    out = posts[keep_cols].rename(columns={"link_flair_text": "flair"}).reset_index(drop=True)
    out.to_parquet(OUT, index=False)
    print(f"wrote {OUT.relative_to(REPO_ROOT)}  shape={out.shape}")
    print(f"  vader coverage:   {out.vader_compound.notna().mean():.1%}")
    print(f"  body_is_empty:    {out.body_is_empty.mean():.1%}")
    print(f"  distinct authors: {out.author.nunique():,}")
    print(f"  date range:       {out.ts.min().date()} → {out.ts.max().date()}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
