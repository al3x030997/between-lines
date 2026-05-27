"""Step 1 — Build a topic-tagged corpus by inheriting post topics down comment chains.

Reads corpus_wattpad_full.parquet + topic_labels.parquet, walks each comment's
parent_id chain to find its root post, then inherits that post's topic.

Output: data/corpus_wattpad_topics.parquet
  doc_id, root_post_id, topic, topic_confidence  (additive over full corpus)

Usage:
    python scripts/build_topic_corpus.py
"""
from __future__ import annotations

import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO_ROOT / "src"))

import pandas as pd        # noqa: E402
import pyarrow as pa       # noqa: E402
import pyarrow.parquet as pq  # noqa: E402

CORPUS   = REPO_ROOT / "data" / "corpus_wattpad_full.parquet"
LABELS   = REPO_ROOT / "data" / "topic_labels.parquet"
OUT      = REPO_ROOT / "data" / "corpus_wattpad_topics.parquet"

MAX_HOPS = 50

SCHEMA = pa.schema([
    ("doc_id",            pa.string()),
    ("root_post_id",      pa.string()),
    ("topic",             pa.string()),
    ("topic_confidence",  pa.float64()),
])


def main() -> int:
    print("Loading corpus and topic labels…")
    corpus = pd.read_parquet(CORPUS)
    labels = pd.read_parquet(LABELS)

    # Build fast parent lookup: doc_id → parent_id
    parent_of: dict[str, str] = dict(zip(corpus["doc_id"], corpus["parent_id"].fillna("")))

    # Build topic lookup from labels (posts only)
    topic_of: dict[str, str]   = dict(zip(labels["doc_id"], labels["topic"]))
    conf_of:  dict[str, float] = dict(zip(labels["doc_id"], labels["confidence"]))

    def find_root(doc_id: str) -> str | None:
        """Walk parent chain until we reach a t3_ (post) or exhaust hops."""
        current = doc_id
        for _ in range(MAX_HOPS):
            if current.startswith("t3_"):
                return current
            parent = parent_of.get(current, "")
            if not parent:
                return None
            current = parent
        return None

    rows: list[dict] = []
    n_orphan = 0
    n_no_topic = 0

    for doc_id in corpus["doc_id"]:
        root = find_root(doc_id)
        if root is None:
            n_orphan += 1
            continue
        topic = topic_of.get(root)
        if topic is None:
            n_no_topic += 1
            continue
        rows.append({
            "doc_id":           doc_id,
            "root_post_id":     root,
            "topic":            topic,
            "topic_confidence": conf_of.get(root, 0.0),
        })

    print(f"  total rows: {len(corpus):,}")
    print(f"  resolved:   {len(rows):,}")
    print(f"  orphans:    {n_orphan:,}  (no resolvable root)")
    print(f"  no topic:   {n_no_topic:,}  (root post not in topic_labels)")

    # Assertion: all comments with a resolvable root have non-null topic
    assert all(r["topic"] for r in rows), "Found null topic in resolved rows"

    table = pa.table(
        {col: [r[col] for r in rows] for col in SCHEMA.names},
        schema=SCHEMA,
    )
    tmp = OUT.with_suffix(".parquet.tmp")
    pq.write_table(table, str(tmp), compression="zstd")
    tmp.replace(OUT)
    print(f"output → {OUT.relative_to(REPO_ROOT)}")

    # Sanity: break down by kind × topic
    df_out = pd.read_parquet(OUT)
    df_out = df_out.merge(corpus[["doc_id", "kind"]], on="doc_id", how="left")
    print("\nkind × topic breakdown:")
    print(df_out.groupby(["kind", "topic"]).size().to_string())
    return 0


if __name__ == "__main__":
    sys.exit(main())
