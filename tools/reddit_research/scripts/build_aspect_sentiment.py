"""Aspect-based sentiment scoring on 1,787 r/Wattpad posts × 71 curated aspects.

Pipeline:
  1. Load in-scope doc_ids from data/sentiment_descriptives.parquet
  2. Load sentence cache from data/sentences_wattpad.parquet
  3. Load curated aspect keep-list from analysis/tables/aspects_curated_keep.csv
  4. For each (sentence, aspect): if aspect appears (raw or synonym), score with DeBERTa-ABSA
  5. Append parquet per FLUSH_EVERY=50 posts, atomic writes, resume by doc_id

Output: data/aspect_sentiment.parquet  (see SCHEMA below)

Mirrors scripts/extract_opinions.py for the resume/checkpoint pattern.

Usage:
    python scripts/build_aspect_sentiment.py --dry-run        # confirm work-list size
    python scripts/build_aspect_sentiment.py                  # full run (~60 min MPS)
    python scripts/build_aspect_sentiment.py --limit 50       # debug on small slice
    python scripts/build_aspect_sentiment.py --device cpu     # CPU fallback
"""
from __future__ import annotations

import argparse
import os

# Must precede torch import — DeBERTa-v3 has unsupported MPS ops that need fallback.
os.environ.setdefault("PYTORCH_ENABLE_MPS_FALLBACK", "1")

import sys
import time
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO_ROOT / "src"))

import pandas as pd        # noqa: E402
import pyarrow as pa       # noqa: E402
import pyarrow.parquet as pq  # noqa: E402

from reddit_http import graceful_sigint  # noqa: E402
from absa import find_aspect_spans       # noqa: E402
from scope import ANALYTICAL_DROP_FLAIRS  # noqa: E402

SCOPE = REPO_ROOT / "data" / "sentiment_descriptives.parquet"
SENTS = REPO_ROOT / "data" / "sentences_wattpad.parquet"
ASPECTS = REPO_ROOT / "analysis" / "tables" / "aspects_curated_keep.csv"
DEFAULT_OUT = REPO_ROOT / "data" / "aspect_sentiment.parquet"

MODEL_NAME = "yangheng/deberta-v3-base-absa-v1.1"
FLUSH_EVERY = 50

SCHEMA = pa.schema([
    ("doc_id",           pa.string()),
    ("sent_idx",         pa.int32()),
    ("aspect",           pa.string()),
    ("aspect_category",  pa.string()),
    ("sentence_text",    pa.string()),
    ("match_span_start", pa.int32()),
    ("match_span_end",   pa.int32()),
    ("label",            pa.string()),
    ("score_signed",     pa.float32()),
    ("prob_pos",         pa.float32()),
    ("prob_neg",         pa.float32()),
    ("prob_neu",         pa.float32()),
    ("model",            pa.string()),
    ("scored_at",        pa.int64()),
])


def load_existing(out_path: Path) -> set[str]:
    if not out_path.exists():
        return set()
    df = pq.read_table(str(out_path), columns=["doc_id"]).to_pandas()
    return set(df["doc_id"].unique().tolist())


def append_batch(out_path: Path, rows: list[dict]) -> None:
    if not rows:
        return
    table = pa.table(
        {col: [r[col] for r in rows] for col in SCHEMA.names},
        schema=SCHEMA,
    )
    if out_path.exists():
        combined = pa.concat_tables([pq.read_table(str(out_path)), table])
    else:
        combined = table
    tmp = out_path.with_suffix(".parquet.tmp")
    pq.write_table(combined, str(tmp), compression="zstd")
    os.replace(tmp, out_path)


def build_work_list(sents_df: pd.DataFrame, aspects: list[tuple[str, str]],
                    doc_ids: list[str]) -> pd.DataFrame:
    """For each (doc_id, sent_idx, aspect): emit a row if aspect appears in the sentence."""
    sents_for_docs = sents_df[sents_df["doc_id"].isin(doc_ids)]
    work_rows = []
    for sr in sents_for_docs.itertuples():
        for aspect, category in aspects:
            spans = find_aspect_spans(sr.sentence_text, aspect)
            if not spans:
                continue
            start, end = spans[0]  # take first match
            work_rows.append({
                "doc_id": sr.doc_id,
                "sent_idx": sr.sent_idx,
                "aspect": aspect,
                "aspect_category": category,
                "sentence_text": sr.sentence_text,
                "match_span_start": start,
                "match_span_end": end,
            })
    return pd.DataFrame(work_rows)


def parse_args(argv=None) -> argparse.Namespace:
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--out", type=Path, default=DEFAULT_OUT)
    p.add_argument("--device", choices=["mps", "cpu", "cuda"], default="mps")
    p.add_argument("--batch-size", type=int, default=16)
    p.add_argument("--limit", type=int, default=0,
                   help="Limit to first N posts (0 = all)")
    p.add_argument("--aspects-only", default="",
                   help="Comma-separated aspect names; default = all kept")
    p.add_argument("--dry-run", action="store_true")
    return p.parse_args(argv)


def main(argv=None) -> int:
    args = parse_args(argv)

    scope = pd.read_parquet(SCOPE, columns=["doc_id", "flair"])
    n_before = len(scope)
    scope = scope[~scope["flair"].isin(ANALYTICAL_DROP_FLAIRS)].drop(columns=["flair"])
    if n_before != len(scope):
        print(f"  scope: {len(scope):,}/{n_before:,} posts after ANALYTICAL_DROP_FLAIRS filter")
    sents = pd.read_parquet(SENTS)
    aspects_df = pd.read_csv(ASPECTS)
    aspects_df = aspects_df[aspects_df["keep"] == "y"]
    if args.aspects_only:
        wanted = {a.strip() for a in args.aspects_only.split(",")}
        aspects_df = aspects_df[aspects_df["aspect"].isin(wanted)]
        print(f"  --aspects-only filter: {len(aspects_df)} aspects matched")

    aspects: list[tuple[str, str]] = list(zip(aspects_df["aspect"], aspects_df["category"]))
    print(f"in scope: {len(scope):,} posts  |  {len(sents):,} sentences  |  {len(aspects)} aspects")

    done = load_existing(args.out)
    todo_doc_ids = [d for d in scope["doc_id"].tolist() if d not in done]
    if args.limit > 0:
        todo_doc_ids = todo_doc_ids[: args.limit]
    print(f"already done: {len(done):,}  |  to process: {len(todo_doc_ids):,}")

    if not todo_doc_ids:
        print("nothing to do")
        return 0

    work = build_work_list(sents, aspects, todo_doc_ids)
    print(f"work-list (after aspect-presence filter): {len(work):,} (sentence, aspect) pairs")
    if len(work) == 0:
        print("no pairs to score; check aspect list or sentence cache")
        return 0

    if args.dry_run:
        print("\n--- dry-run: top 10 work-list rows ---")
        print(work.head(10).to_string())
        print(f"\nestimated inferences: {len(work):,}")
        return 0

    # Lazy import — saves ~10 s startup when running --dry-run or --help
    from absa import load_absa_pipeline, score_batch

    print(f"loading model {MODEL_NAME} on device={args.device}, dtype=float32 …")
    started_model = time.monotonic()
    pipe = load_absa_pipeline(device=args.device)
    import torch
    actual_device = next(pipe.model.parameters()).device
    print(f"  model loaded in {time.monotonic() - started_model:.1f}s, on device {actual_device}")

    # Group work-list by doc_id so we can flush per-post (atomic resume granularity).
    work = work.sort_values("doc_id").reset_index(drop=True)
    by_doc = work.groupby("doc_id", sort=False)

    batch: list[dict] = []
    n_pairs_done = 0
    n_posts_done = 0
    started = time.monotonic()
    scored_at = int(time.time())

    with graceful_sigint() as flag:
        for doc_id, group in by_doc:
            if flag["stopped"]:
                break
            pairs = list(zip(group["sentence_text"], group["aspect"]))
            try:
                results = score_batch(pipe, pairs, batch_size=args.batch_size)
            except Exception as exc:
                print(f"  error doc_id={doc_id}: {exc!r}", flush=True)
                continue

            for (_, row), res in zip(group.iterrows(), results):
                batch.append({
                    "doc_id":           row["doc_id"],
                    "sent_idx":         int(row["sent_idx"]),
                    "aspect":           row["aspect"],
                    "aspect_category":  row["aspect_category"],
                    "sentence_text":    row["sentence_text"],
                    "match_span_start": int(row["match_span_start"]),
                    "match_span_end":   int(row["match_span_end"]),
                    "label":            res["label"],
                    "score_signed":     float(res["score_signed"]),
                    "prob_pos":         float(res["prob_pos"]),
                    "prob_neg":         float(res["prob_neg"]),
                    "prob_neu":         float(res["prob_neu"]),
                    "model":            MODEL_NAME,
                    "scored_at":        scored_at,
                })
                n_pairs_done += 1
            n_posts_done += 1

            if n_posts_done % FLUSH_EVERY == 0:
                append_batch(args.out, batch)
                batch = []
                elapsed = int(time.monotonic() - started)
                mm, ss = divmod(elapsed, 60)
                rate_post = n_posts_done / max(elapsed, 1) * 60
                rate_pair = n_pairs_done / max(elapsed, 1)
                print(f"  flushed at {n_posts_done} posts  ({n_pairs_done:,} pairs)  "
                      f"elapsed={mm:02d}:{ss:02d}  {rate_post:.1f} posts/min  {rate_pair:.1f} pairs/s",
                      flush=True)

    if batch:
        append_batch(args.out, batch)
        print(f"  flushed {len(batch)} rows (final)", flush=True)

    elapsed = int(time.monotonic() - started)
    mm, ss = divmod(elapsed, 60)
    print(f"\ndone: posts={n_posts_done}  pairs={n_pairs_done}  elapsed={mm:02d}:{ss:02d}")
    print(f"output → {args.out}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
