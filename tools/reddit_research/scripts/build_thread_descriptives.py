"""Step 4 — Compute thread-level descriptives.

For each in-scope post, summarise the conversation beneath it: how loud, how
many distinct voices, how the comments compare to the post in sentiment, and
whether the thread crosses the bar for "confident negative" (= negative post
AND negative top-3 comments, both signals agreeing).

Reads:
  data/comments_scored.parquet
  data/sentiment_descriptives.parquet

Writes:
  data/thread_descriptives.parquet            — one row per post (1,452)
  analysis/tables/thread_descriptives_by_flair.csv — per-flair aggregate

Key columns:
  n_comments                 total comments in thread
  n_unique_authors           distinct commenters
  engagement_ratio           n_comments / (post_score + 1) — controversy detector
  mean_comment_vader         mean VADER compound across english comments
  top3_mean_vader            mean VADER across top-3 comments (by score)
  sentiment_divergence       post_vader - mean_comment_vader (positive = post calmer than comments)
  consensus_neg              fraction of english comments with vader < -0.05
  confident_negative         post_vader < -0.2 AND top3_mean_vader < -0.1
  n_competitor_mentions      comments mentioning a named competitor
  n_switching                comments with switching language

Usage:
    python scripts/build_thread_descriptives.py
"""
from __future__ import annotations

import sys
from pathlib import Path

import numpy as np
import pandas as pd

REPO_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO_ROOT / "src"))
from scope import ANALYTICAL_DROP_FLAIRS  # noqa: E402

COMMENTS = REPO_ROOT / "data" / "comments_scored.parquet"
SD = REPO_ROOT / "data" / "sentiment_descriptives.parquet"
OUT = REPO_ROOT / "data" / "thread_descriptives.parquet"
TBL = REPO_ROOT / "analysis" / "tables"

POST_NEG_THRESH = -0.2
TOP3_NEG_THRESH = -0.1
NEG_BAND = -0.05  # consistent with VADER's standard


def main() -> int:
    c = pd.read_parquet(COMMENTS)
    sd = pd.read_parquet(SD)
    sd_in = sd[~sd["flair"].isin(ANALYTICAL_DROP_FLAIRS)].copy()
    print(f"in-scope posts: {len(sd_in):,}  |  comments: {len(c):,}")

    # Per-thread aggregates over all comments
    grouped = c.groupby("post_id", sort=False)
    agg = grouped.agg(
        n_comments=("comment_id", "size"),
        n_unique_authors=("author", "nunique"),
        max_comment_score=("comment_score", "max"),
        n_competitor_mentions=("has_competitor", "sum"),
        n_switching=("has_switching", "sum"),
        max_depth=("depth", "max"),
    )

    # English-only sentiment aggregates
    en = c[c["lang"] == "en"].copy()
    en_grp = en.groupby("post_id", sort=False)
    agg["mean_comment_vader"] = en_grp["vader_compound"].mean()
    agg["median_comment_vader"] = en_grp["vader_compound"].median()
    agg["n_comments_neg"] = (en.assign(neg=en["vader_compound"] < NEG_BAND)
                               .groupby("post_id")["neg"].sum())
    agg["n_comments_en"] = en_grp["comment_id"].size()
    agg["consensus_neg"] = (agg["n_comments_neg"] / agg["n_comments_en"].replace(0, np.nan)).astype("float32")

    # Top-3 comments by score
    def top3_mean(df: pd.DataFrame) -> float:
        top = df.nlargest(3, "comment_score")
        v = top["vader_compound"].dropna()
        return float(v.mean()) if len(v) else float("nan")

    top3 = en.groupby("post_id").apply(top3_mean)
    top3.name = "top3_mean_vader"
    agg = agg.join(top3)

    # Join post-side info
    post_info = sd_in.set_index("doc_id")[["flair", "score", "vader_compound", "title"]]
    post_info = post_info.rename(columns={"score": "post_score",
                                          "vader_compound": "post_vader",
                                          "title": "post_title"})
    agg = post_info.join(agg, how="left")

    # Posts with no comments — keep them but zero out volume
    zero_cols = ["n_comments", "n_unique_authors", "max_comment_score",
                 "n_competitor_mentions", "n_switching", "max_depth",
                 "n_comments_neg", "n_comments_en"]
    for col in zero_cols:
        agg[col] = agg[col].fillna(0).astype("int32")

    agg["engagement_ratio"] = (agg["n_comments"] / (agg["post_score"].fillna(0).astype(float) + 1)).astype("float32")
    agg["sentiment_divergence"] = (agg["post_vader"].astype(float) - agg["mean_comment_vader"].astype(float)).astype("float32")

    agg["confident_negative"] = (
        (agg["post_vader"].astype(float) < POST_NEG_THRESH)
        & (agg["top3_mean_vader"].astype(float) < TOP3_NEG_THRESH)
    )

    # Order columns
    cols = ["flair", "post_title", "post_score", "post_vader",
            "n_comments", "n_comments_en", "n_unique_authors",
            "max_depth", "max_comment_score", "engagement_ratio",
            "mean_comment_vader", "median_comment_vader", "top3_mean_vader",
            "consensus_neg", "sentiment_divergence", "confident_negative",
            "n_competitor_mentions", "n_switching"]
    out = agg[cols].reset_index()
    out = out.rename(columns={out.columns[0]: "post_id"})
    OUT.parent.mkdir(parents=True, exist_ok=True)
    out.to_parquet(OUT, index=False, compression="zstd")
    print(f"wrote {OUT.relative_to(REPO_ROOT)}  shape={out.shape}")

    # Per-flair summary
    TBL.mkdir(parents=True, exist_ok=True)
    with_comments = out[out["n_comments"] > 0]
    by_flair = with_comments.groupby("flair").agg(
        n_threads=("post_id", "size"),
        n_total_comments=("n_comments", "sum"),
        median_comments_per_thread=("n_comments", "median"),
        p90_comments_per_thread=("n_comments", lambda s: s.quantile(0.9)),
        mean_engagement_ratio=("engagement_ratio", "mean"),
        mean_post_vader=("post_vader", "mean"),
        mean_top3_vader=("top3_mean_vader", "mean"),
        mean_consensus_neg=("consensus_neg", "mean"),
        pct_confident_negative=("confident_negative", "mean"),
        total_competitor_mentions=("n_competitor_mentions", "sum"),
        total_switching=("n_switching", "sum"),
    ).sort_values("n_threads", ascending=False).round(3)
    flair_csv = TBL / "thread_descriptives_by_flair.csv"
    by_flair.to_csv(flair_csv)
    print(f"wrote {flair_csv.relative_to(REPO_ROOT)}")
    print()
    print("--- per-flair thread descriptives ---")
    print(by_flair.to_string())

    print()
    print("--- headline figures ---")
    print(f"  threads with ≥1 comment:       {len(with_comments):,} / {len(out):,}")
    print(f"  threads flagged confident-neg: {out['confident_negative'].sum():,}  ({out['confident_negative'].mean():.1%})")
    print(f"  threads w/ competitor mention: {(out['n_competitor_mentions'] > 0).sum():,}")
    print(f"  threads w/ switching language: {(out['n_switching'] > 0).sum():,}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
