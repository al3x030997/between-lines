"""Build data/explore.db — a SQLite database for Datasette browsing.

Combines posts, comments, and LLM extractions into one explorable database with
full-text search on titles, bodies, and rationales.

Usage:
    python scripts/build_explore_db.py
    datasette serve data/explore.db -o
"""
from __future__ import annotations

import sqlite3
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent

import pandas as pd            # noqa: E402
import sqlite_utils            # noqa: E402

DB_PATH = REPO_ROOT / "data" / "explore.db"


def _reddit_link(doc_id: str) -> str:
    """A clickable URL for a post or comment."""
    return f"https://www.reddit.com/comments/{doc_id[3:]}/"


def main() -> int:
    print("Loading parquet files…")
    corpus        = pd.read_parquet(REPO_ROOT / "data" / "corpus_wattpad_full.parquet")
    labels        = pd.read_parquet(REPO_ROOT / "data" / "topic_labels.parquet")
    opinions      = pd.read_parquet(REPO_ROOT / "data" / "post_opinions.parquet")
    corpus_topics = pd.read_parquet(REPO_ROOT / "data" / "corpus_wattpad_topics.parquet")

    # ── POSTS TABLE ───────────────────────────────────────────────────────────
    posts = corpus[corpus["kind"] == "post"].drop_duplicates("doc_id").copy()
    posts = (
        posts
        .merge(labels[["doc_id", "topic", "confidence", "rationale"]], on="doc_id", how="left")
        .merge(
            opinions[["doc_id", "user_role", "key_quote", "praises", "criticisms", "gaps", "mentioned_platforms"]],
            on="doc_id", how="left",
        )
    )
    posts["body_len"] = posts["body"].fillna("").str.len()
    posts["link"]     = posts["doc_id"].apply(_reddit_link)
    # Convert list columns to comma-joined strings (SQLite can't store lists natively)
    for col in ("praises", "criticisms", "gaps", "mentioned_platforms"):
        posts[col] = posts[col].apply(
            lambda v: " | ".join(v) if isinstance(v, list) and len(v) else None
        )
    posts["date"] = pd.to_datetime(posts["created_utc"], unit="s").dt.strftime("%Y-%m-%d")

    posts_out = posts[[
        "doc_id", "date", "subreddit", "author", "score",
        "topic", "confidence", "user_role", "rationale",
        "body_len", "title", "body",
        "praises", "criticisms", "gaps", "mentioned_platforms",
        "key_quote", "lang", "search_field", "link",
    ]].copy()

    # ── COMMENTS TABLE ────────────────────────────────────────────────────────
    comments = corpus[corpus["kind"] == "comment"].drop_duplicates("doc_id").copy()
    comments = comments.merge(
        corpus_topics[["doc_id", "root_post_id", "topic"]].drop_duplicates("doc_id"),
        on="doc_id", how="left",
    )
    # Attach the root post's classification metadata for context
    comments = comments.merge(
        labels[["doc_id", "rationale"]].rename(columns={"doc_id": "root_post_id", "rationale": "root_rationale"}),
        on="root_post_id", how="left",
    )
    comments["date"] = pd.to_datetime(comments["created_utc"], unit="s").dt.strftime("%Y-%m-%d")
    comments["body_len"] = comments["body"].fillna("").str.len()
    comments["link"] = comments["root_post_id"].fillna(comments["doc_id"]).apply(_reddit_link)

    comments_out = comments[[
        "doc_id", "date", "subreddit", "author", "score",
        "topic", "root_post_id", "parent_id",
        "body_len", "body", "root_rationale",
        "lang", "link",
    ]].copy()

    # ── WRITE TO SQLITE ───────────────────────────────────────────────────────
    if DB_PATH.exists():
        DB_PATH.unlink()
    print(f"Writing to {DB_PATH.relative_to(REPO_ROOT)}…")
    db = sqlite_utils.Database(str(DB_PATH))
    db["posts"].insert_all(posts_out.to_dict("records"), pk="doc_id")
    db["comments"].insert_all(comments_out.to_dict("records"), pk="doc_id")

    # ── INDEXES ──────────────────────────────────────────────────────────────
    db["posts"].create_index(["topic"])
    db["posts"].create_index(["subreddit"])
    db["posts"].create_index(["score"])
    db["comments"].create_index(["root_post_id"])
    db["comments"].create_index(["parent_id"])
    db["comments"].create_index(["topic"])
    db["comments"].create_index(["subreddit"])

    # ── FULL-TEXT SEARCH ──────────────────────────────────────────────────────
    print("Enabling full-text search on posts (title + body + rationale)…")
    db["posts"].enable_fts(["title", "body", "rationale"], create_triggers=True)
    print("Enabling full-text search on comments (body)…")
    db["comments"].enable_fts(["body"], create_triggers=True)

    # ── VACUUM ────────────────────────────────────────────────────────────────
    db.vacuum()

    print()
    print(f"  posts:    {len(posts_out):,} rows")
    print(f"  comments: {len(comments_out):,} rows")
    print(f"  db size:  {DB_PATH.stat().st_size / 1024 / 1024:.1f} MB")
    print()
    print("Start Datasette with:")
    print("  .venv/bin/datasette serve data/explore.db -o \\")
    print("    --setting truncate_cells_html 300 \\")
    print("    --setting facet_time_limit_ms 5000")
    return 0


if __name__ == "__main__":
    sys.exit(main())
