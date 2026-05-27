"""Step 2 — Build a thread-level dataset for r/Wattpad in-scope post threads.

Joins each in-scope post (after ANALYTICAL_DROP_FLAIRS filter) with every comment
beneath it, walking the parent_id chain so deep replies attribute to their root
post (Reddit's parent_id points to the immediate parent only).

Reads:
  data/sentiment_descriptives.parquet   (in-scope post ids, flair, title, score)
  data/corpus_wattpad_full.parquet      (comments: doc_id, parent_id, body, score, ...)

Writes:
  data/threads.parquet — one row per comment with thread context:
    post_id            string   # root post doc_id (t3_*)
    comment_id         string   # comment doc_id (t1_*)
    parent_id          string   # immediate parent (t3_* or t1_*)
    depth              int32    # 1 = top-level, 2 = reply, ...
    author             string
    created_utc        int64
    comment_score      int32
    body               string
    body_clean         string
    flair              string   # from post
    post_title         string   # from post
    post_score         int32
    post_created_utc   int64

Comments whose ancestor chain is broken (deleted intermediate parent) are dropped.

Usage:
    python scripts/build_threads.py
"""
from __future__ import annotations

import sys
from pathlib import Path

import pandas as pd
import pyarrow as pa
import pyarrow.parquet as pq

REPO_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO_ROOT / "src"))
from scope import ANALYTICAL_DROP_FLAIRS  # noqa: E402

SD = REPO_ROOT / "data" / "sentiment_descriptives.parquet"
CORPUS = REPO_ROOT / "data" / "corpus_wattpad_full.parquet"
OUT = REPO_ROOT / "data" / "threads.parquet"

MAX_DEPTH = 50  # safety cap for parent-chain walk

SCHEMA = pa.schema([
    ("post_id",          pa.string()),
    ("comment_id",       pa.string()),
    ("parent_id",        pa.string()),
    ("depth",            pa.int32()),
    ("author",           pa.string()),
    ("created_utc",      pa.int64()),
    ("comment_score",    pa.int32()),
    ("body",             pa.string()),
    ("body_clean",       pa.string()),
    ("flair",            pa.string()),
    ("post_title",       pa.string()),
    ("post_score",       pa.int32()),
    ("post_created_utc", pa.int64()),
])


def resolve_roots(parent_map: dict[str, str]) -> tuple[dict[str, str], dict[str, int]]:
    """For every comment id, walk parent_id chain to the root post (t3_*).

    Returns (comment_id → root post_id, comment_id → depth). Comments whose chain
    breaks (parent not in map and not a t3_*) get no entry — caller drops them.
    """
    root: dict[str, str] = {}
    depth: dict[str, int] = {}

    def walk(cid: str) -> tuple[str | None, int]:
        if cid in root:
            return root[cid], depth[cid]
        cur = parent_map.get(cid)
        d = 1
        while cur is not None and d <= MAX_DEPTH:
            if cur.startswith("t3_"):
                return cur, d
            if cur in root:  # memoised hit
                return root[cur], depth[cur] + d
            cur = parent_map.get(cur)
            d += 1
        return None, -1

    for cid in parent_map:
        r, d = walk(cid)
        if r is not None:
            root[cid] = r
            depth[cid] = d
    return root, depth


def main() -> int:
    sd = pd.read_parquet(SD)
    sd_in = sd[~sd["flair"].isin(ANALYTICAL_DROP_FLAIRS)].copy()
    print(f"in-scope posts: {len(sd_in):,} / {len(sd):,}  (after ANALYTICAL_DROP_FLAIRS)")
    in_scope = set(sd_in["doc_id"])

    corpus = pd.read_parquet(CORPUS)
    comments = corpus[corpus["kind"] == "comment"].copy()
    print(f"total comments in corpus: {len(comments):,}")

    parent_map = dict(zip(comments["doc_id"], comments["parent_id"]))
    root_map, depth_map = resolve_roots(parent_map)
    print(f"comments with resolvable root: {len(root_map):,} / {len(comments):,}")

    comments["post_id"] = comments["doc_id"].map(root_map)
    comments["depth"] = comments["doc_id"].map(depth_map).fillna(-1).astype("int32")
    in_scope_comments = comments[comments["post_id"].isin(in_scope)].copy()
    print(f"comments under in-scope post threads: {len(in_scope_comments):,}")

    post_info = sd_in.set_index("doc_id")[["flair", "title", "score", "ts"]]
    post_info = post_info.rename(columns={
        "title": "post_title",
        "score": "post_score",
    })
    post_info["post_created_utc"] = post_info["ts"].astype("int64") // 10**9

    out = pd.DataFrame({
        "post_id":          in_scope_comments["post_id"].astype("string"),
        "comment_id":       in_scope_comments["doc_id"].astype("string"),
        "parent_id":        in_scope_comments["parent_id"].astype("string"),
        "depth":            in_scope_comments["depth"].astype("int32"),
        "author":           in_scope_comments["author"].astype("string"),
        "created_utc":      in_scope_comments["created_utc"].astype("int64"),
        "comment_score":    in_scope_comments["score"].fillna(0).astype("int32"),
        "body":             in_scope_comments["body"].fillna("").astype("string"),
        "body_clean":       in_scope_comments["body_clean"].fillna("").astype("string"),
    })
    out = out.merge(
        post_info[["flair", "post_title", "post_score", "post_created_utc"]],
        left_on="post_id", right_index=True, how="left",
    )
    out["flair"] = out["flair"].astype("string")
    out["post_title"] = out["post_title"].fillna("").astype("string")
    out["post_score"] = out["post_score"].fillna(0).astype("int32")
    out["post_created_utc"] = out["post_created_utc"].fillna(0).astype("int64")

    table = pa.Table.from_pandas(out, schema=SCHEMA, preserve_index=False)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    pq.write_table(table, OUT, compression="zstd")
    print(f"wrote {OUT.relative_to(REPO_ROOT)}  shape={out.shape}")

    # quick descriptives
    print()
    print("--- depth distribution ---")
    print(out["depth"].value_counts().sort_index().head(10).to_string())
    print()
    print("--- comments per post ---")
    per_post = out.groupby("post_id").size()
    print(f"  posts with ≥1 comment: {len(per_post):,} / {len(in_scope):,}")
    print(f"  median: {per_post.median():.0f}   p90: {per_post.quantile(0.9):.0f}   max: {per_post.max():,}")
    print()
    print("--- comments per flair (top 12) ---")
    print(out.groupby("flair").size().sort_values(ascending=False).head(12).to_string())
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
