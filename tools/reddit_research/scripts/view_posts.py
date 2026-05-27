"""Print the 561-post table to the terminal.

Usage:
    .venv/bin/python scripts/view_posts.py [--topic TOPIC] [--subreddit SUB] [--min-score N]
    .venv/bin/python scripts/view_posts.py | less -S       # horizontal scroll
    .venv/bin/python scripts/view_posts.py --topic reader_experience
"""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

import pandas as pd

REPO_ROOT = Path(__file__).resolve().parent.parent


def main(argv=None) -> int:
    p = argparse.ArgumentParser()
    p.add_argument("--topic",      help="Filter to one topic")
    p.add_argument("--subreddit",  help="Filter to one subreddit")
    p.add_argument("--min-score",  type=int, default=0)
    p.add_argument("--title-width", type=int, default=80,
                   help="Truncate title to N chars (default 80)")
    p.add_argument("--limit",      type=int, default=0, help="0 = all")
    args = p.parse_args(argv)

    corpus = pd.read_parquet(REPO_ROOT / "data" / "corpus_wattpad_full.parquet")
    labels = pd.read_parquet(REPO_ROOT / "data" / "topic_labels.parquet")
    opinions = pd.read_parquet(REPO_ROOT / "data" / "post_opinions.parquet")

    posts = corpus[corpus["kind"] == "post"].drop_duplicates("doc_id")
    df = (
        posts.merge(labels[["doc_id", "topic", "confidence"]], on="doc_id", how="left")
             .merge(opinions[["doc_id", "user_role"]], on="doc_id", how="left")
    )

    if args.topic:
        df = df[df["topic"] == args.topic]
    if args.subreddit:
        df = df[df["subreddit"] == args.subreddit]
    df = df[df["score"] >= args.min_score]

    df = df.sort_values(["topic", "score"], ascending=[True, False])
    if args.limit > 0:
        df = df.head(args.limit)

    # Explicit truncation (max_colwidth doesn't truncate reliably in to_string)
    w = args.title_width
    df = df.assign(
        title=df["title"].fillna("").str[:w],
        topic=df["topic"].fillna("?").str[:14],
        user_role=df["user_role"].fillna("-").str[:8],
        body_len=df["body"].fillna("").str.len(),
    )

    out = df[["doc_id", "subreddit", "score", "topic", "user_role", "body_len", "title"]]
    out = out.rename(columns={
        "doc_id":    "id",
        "subreddit": "sub",
        "user_role": "role",
        "body_len":  "blen",
    })

    print(f"# {len(out):,} posts")
    print(out.to_string(index=False, max_colwidth=w + 5))
    return 0


if __name__ == "__main__":
    sys.exit(main())
