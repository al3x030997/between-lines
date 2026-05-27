"""Step 4 — Embed and cluster opinion phrases into named themes.

Reads data/post_opinions.parquet (from Step 3).
For each (topic, category) group, embeds phrases with all-MiniLM-L6-v2,
clusters with AgglomerativeClustering, labels each cluster by the nearest-centroid phrase.

Outputs:
  data/themes.parquet
  data/themes_emb.npy   (embeddings, for re-clustering without re-embedding)

Usage:
    python scripts/cluster_themes.py [--threshold 0.35] [--min-cluster 3]
"""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO_ROOT / "src"))

import numpy as np         # noqa: E402
import pandas as pd        # noqa: E402
import pyarrow as pa       # noqa: E402
import pyarrow.parquet as pq  # noqa: E402
from sentence_transformers import SentenceTransformer  # noqa: E402
from sklearn.cluster import AgglomerativeClustering    # noqa: E402

OPINIONS = REPO_ROOT / "data" / "post_opinions.parquet"
OUT_THEMES = REPO_ROOT / "data" / "themes.parquet"
OUT_EMB    = REPO_ROOT / "data" / "themes_emb.npy"

SUBSTANTIVE_TOPICS = [
    "platform_comparison",
    "author_writing_experience",
    "reader_experience",
    "community_culture",
]

THEMES_SCHEMA = pa.schema([
    ("theme_id",      pa.int32()),
    ("topic",         pa.string()),
    ("category",      pa.string()),
    ("label",         pa.string()),
    ("size",          pa.int32()),
    ("phrases",       pa.list_(pa.string())),
    ("doc_ids",       pa.list_(pa.string())),
    ("avg_sentiment", pa.float64()),
])

VADER_PATH = REPO_ROOT / "data" / "corpus_wattpad_vader_v2.parquet"


def explode_opinions(opinions: pd.DataFrame) -> pd.DataFrame:
    """Long-form: one row per (doc_id, topic, category, phrase)."""
    records: list[dict] = []
    for _, row in opinions.iterrows():
        for phrase in row["praises"]:
            if phrase:
                records.append({"doc_id": row["doc_id"], "topic": row["topic"], "category": "praise", "phrase": phrase})
        for phrase in row["criticisms"]:
            if phrase:
                records.append({"doc_id": row["doc_id"], "topic": row["topic"], "category": "criticism", "phrase": phrase})
        for phrase in row["gaps"]:
            if phrase:
                records.append({"doc_id": row["doc_id"], "topic": row["topic"], "category": "gap", "phrase": phrase})
    return pd.DataFrame(records)


def nearest_centroid(embeddings: np.ndarray, labels: np.ndarray) -> dict[int, str]:
    """Return {cluster_id: index_of_nearest_phrase_to_centroid}."""
    phrase_ids: dict[int, int] = {}
    for cluster_id in np.unique(labels):
        mask = labels == cluster_id
        subset = embeddings[mask]
        centroid = subset.mean(axis=0)
        dists = np.linalg.norm(subset - centroid, axis=1)
        local_idx = int(np.argmin(dists))
        # Map back to global index
        global_indices = np.where(mask)[0]
        phrase_ids[cluster_id] = global_indices[local_idx]
    return phrase_ids


def main(argv=None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--threshold",   type=float, default=0.35, help="AgglomerativeClustering distance_threshold")
    parser.add_argument("--min-cluster", type=int,   default=3,    help="Min phrases per cluster; smaller → long_tail")
    args = parser.parse_args(argv)

    print("Loading opinions…")
    opinions = pd.read_parquet(OPINIONS)
    print(f"  {len(opinions):,} extracted posts")

    # Load VADER for avg_sentiment per cluster
    sentiment: dict[str, float] = {}
    if VADER_PATH.exists():
        vader = pd.read_parquet(VADER_PATH)
        sentiment = dict(zip(vader["doc_id"], vader["vader_compound"].fillna(0.0)))

    print("Exploding opinion phrases to long form…")
    long_df = explode_opinions(opinions)
    print(f"  {len(long_df):,} phrases across {long_df['doc_id'].nunique():,} posts")

    print(f"Loading sentence-transformers model (all-MiniLM-L6-v2) — first run downloads ~90MB…")
    model = SentenceTransformer("all-MiniLM-L6-v2")

    theme_rows: list[dict] = []
    all_embeddings: list[np.ndarray] = []
    theme_id_counter = 0

    groups = long_df.groupby(["topic", "category"], sort=True)
    for (topic, category), grp in groups:
        if topic not in SUBSTANTIVE_TOPICS:
            continue
        phrases = grp["phrase"].tolist()
        doc_ids = grp["doc_id"].tolist()
        if len(phrases) < 2:
            continue

        print(f"  [{topic}/{category}]  {len(phrases)} phrases…", flush=True)
        embeddings = model.encode(phrases, show_progress_bar=False, normalize_embeddings=True)
        all_embeddings.append(embeddings)

        if len(phrases) == 1:
            labels_arr = np.array([0])
        else:
            clust = AgglomerativeClustering(
                n_clusters=None,
                distance_threshold=args.threshold,
                metric="cosine",
                linkage="average",
            )
            labels_arr = clust.fit_predict(embeddings)

        nearest = nearest_centroid(embeddings, labels_arr)

        for cluster_id in np.unique(labels_arr):
            mask = labels_arr == cluster_id
            cluster_phrases = [p for p, m in zip(phrases, mask) if m]
            cluster_docs    = [d for d, m in zip(doc_ids, mask) if m]

            if len(cluster_phrases) < args.min_cluster:
                continue  # → long_tail, excluded from charts

            label_idx = nearest[cluster_id]
            label = phrases[label_idx]

            sentiments = [sentiment.get(d, 0.0) for d in cluster_docs]
            avg_sent = float(np.mean(sentiments)) if sentiments else 0.0

            theme_rows.append({
                "theme_id":      theme_id_counter,
                "topic":         topic,
                "category":      category,
                "label":         label,
                "size":          len(cluster_phrases),
                "phrases":       cluster_phrases,
                "doc_ids":       list(set(cluster_docs)),
                "avg_sentiment": avg_sent,
            })
            theme_id_counter += 1

    print(f"\n{theme_id_counter} themes retained (min_cluster={args.min_cluster})")

    if all_embeddings:
        np.save(str(OUT_EMB), np.vstack(all_embeddings))
        print(f"embeddings → {OUT_EMB.relative_to(REPO_ROOT)}")

    table = pa.table(
        {col: [r[col] for r in theme_rows] for col in THEMES_SCHEMA.names},
        schema=THEMES_SCHEMA,
    )
    tmp = OUT_THEMES.with_suffix(".parquet.tmp")
    pq.write_table(table, str(tmp), compression="zstd")
    tmp.replace(OUT_THEMES)
    print(f"themes → {OUT_THEMES.relative_to(REPO_ROOT)}")

    # Cluster size summary
    sizes = [r["size"] for r in theme_rows]
    if sizes:
        print(f"\nCluster size summary:  median={np.median(sizes):.0f}  max={max(sizes)}  total themes={len(sizes)}")
        singleton_share = sum(1 for s in sizes if s < args.min_cluster) / max(len(sizes), 1)
        print(f"Singleton-dominated share (excluded): {singleton_share:.1%}")

    return 0


if __name__ == "__main__":
    sys.exit(main())
