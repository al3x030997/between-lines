"""Build a deterministic sentence cache for the 1,787 in-scope r/Wattpad posts.

Idempotent: re-running overwrites the parquet. Splitting out this step from the
ABSA runner lets us re-tune the aspect list and re-score without re-parsing bodies.

Reads:
  data/sentiment_descriptives.parquet      (in-scope doc_ids)
  data/corpus_wattpad_full.parquet         (body texts)

Writes:
  data/sentences_wattpad.parquet
    doc_id          string
    sent_idx        int32   # 0 = title, 1..N = body sentences
    sentence_text   string
    char_start      int32   # offset into title + ". " + body_clean
    char_end        int32

Hard-splits sentences > 500 chars on the first ;,. comma/semicolon — Wattpad rant
posts often have no periods and one sentence consumes the whole body.

Usage:
    python scripts/build_sentence_cache.py
"""
from __future__ import annotations

import sys
from pathlib import Path

import pandas as pd
import pyarrow as pa
import pyarrow.parquet as pq
import spacy

REPO_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO_ROOT / "src"))
from text_prep import clean_body  # noqa: E402

SRC = REPO_ROOT / "data" / "sentiment_descriptives.parquet"
CORPUS = REPO_ROOT / "data" / "corpus_wattpad_full.parquet"
OUT = REPO_ROOT / "data" / "sentences_wattpad.parquet"

SCHEMA = pa.schema([
    ("doc_id",        pa.string()),
    ("sent_idx",      pa.int32()),
    ("sentence_text", pa.string()),
    ("char_start",    pa.int32()),
    ("char_end",      pa.int32()),
])

HARD_SPLIT_LEN = 500
SPLIT_CHARS = (";", ",")


def hard_split(text: str, start: int) -> list[tuple[str, int, int]]:
    """If text > HARD_SPLIT_LEN, split on the nearest comma/semicolon to the midpoint.
    Returns list of (sentence, char_start, char_end) tuples."""
    if len(text) <= HARD_SPLIT_LEN:
        return [(text, start, start + len(text))]
    # find a split char nearest the midpoint
    mid = len(text) // 2
    best_idx = -1
    best_dist = float("inf")
    for i, ch in enumerate(text):
        if ch in SPLIT_CHARS and 50 < i < len(text) - 50:
            d = abs(i - mid)
            if d < best_dist:
                best_dist = d
                best_idx = i
    if best_idx == -1:
        # No split char available — return as-is
        return [(text, start, start + len(text))]
    left = text[: best_idx + 1].strip()
    right = text[best_idx + 1:].strip()
    return (
        hard_split(left, start)
        + hard_split(right, start + best_idx + 1 + (len(text[best_idx + 1:]) - len(right)))
    )


def main() -> int:
    sd = pd.read_parquet(SRC, columns=["doc_id", "title"])
    in_scope = set(sd["doc_id"].tolist())
    title_map = dict(zip(sd["doc_id"], sd["title"].fillna("")))
    print(f"in-scope posts: {len(in_scope):,}")

    corpus = pd.read_parquet(CORPUS, columns=["doc_id", "body"])
    corpus = corpus[corpus["doc_id"].isin(in_scope)].drop_duplicates(subset="doc_id")
    body_map = dict(zip(corpus["doc_id"], corpus["body"].fillna("")))

    nlp = spacy.load("en_core_web_sm", disable=["ner", "tagger", "lemmatizer", "attribute_ruler"])
    if "sentencizer" not in nlp.pipe_names:
        nlp.add_pipe("sentencizer", first=True)

    rows: list[dict] = []
    n_splits = 0
    for doc_id in in_scope:
        title = (title_map.get(doc_id, "") or "").strip()
        body_clean = clean_body(body_map.get(doc_id, ""))
        full = title + (". " if title and body_clean else "") + body_clean
        if not full:
            continue

        # sent_idx 0 = title (if any)
        sent_idx = 0
        if title:
            rows.append({
                "doc_id": doc_id, "sent_idx": sent_idx,
                "sentence_text": title, "char_start": 0, "char_end": len(title),
            })
            sent_idx += 1

        if body_clean:
            body_offset = len(title) + (2 if title else 0)  # ". "
            doc = nlp(body_clean)
            for sent in doc.sents:
                stext = sent.text.strip()
                if len(stext) < 3:
                    continue
                # char positions of sent.text inside body_clean
                sstart = sent.start_char
                send = sent.end_char
                parts = hard_split(stext, body_offset + sstart)
                if len(parts) > 1:
                    n_splits += len(parts) - 1
                for ptext, ps, pe in parts:
                    if len(ptext) < 3:
                        continue
                    rows.append({
                        "doc_id": doc_id, "sent_idx": sent_idx,
                        "sentence_text": ptext, "char_start": ps, "char_end": pe,
                    })
                    sent_idx += 1

    table = pa.table(
        {col: [r[col] for r in rows] for col in SCHEMA.names},
        schema=SCHEMA,
    )
    OUT.parent.mkdir(parents=True, exist_ok=True)
    pq.write_table(table, str(OUT), compression="zstd")
    print(f"wrote {OUT.relative_to(REPO_ROOT)}  shape={(len(rows), len(SCHEMA))}")
    print(f"  posts with sentences: {len({r['doc_id'] for r in rows}):,}")
    print(f"  hard-splits applied:  {n_splits}")
    print(f"  median sents/post:    {pd.Series([r['doc_id'] for r in rows]).value_counts().median():.0f}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
