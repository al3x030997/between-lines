"""Pass 1 — aspect vocabulary from r/Wattpad posts.

For each post (last 2y, keep-flair set, megathreads dropped):
  - sentence-split with spaCy
  - score each sentence with VADER
  - extract noun chunks
  - lemmatize + normalize → aspect string
  - aggregate per aspect: frequency, share-negative, sample sentence, sample doc_ids

Output: data/aspect_vocabulary.parquet
  columns: aspect, n_mentions, n_posts, share_negative, mean_sent, sample_sentence, sample_doc_id

The goal is a corpus-grounded list of *things users talk about*, ranked so
the next pass (DeBERTa ABSA over the top ~50) is targeted, not exhaustive.

Usage:
    python scripts/build_aspect_vocabulary.py
"""
from __future__ import annotations

import re
from collections import defaultdict
from pathlib import Path

import pandas as pd
import spacy
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

REPO_ROOT = Path(__file__).resolve().parent.parent
import sys  # noqa: E402
sys.path.insert(0, str(REPO_ROOT / "src"))
from scope import ANALYTICAL_DROP_FLAIRS  # noqa: E402

SRC = REPO_ROOT / "data" / "sentiment_descriptives.parquet"
OUT = REPO_ROOT / "data" / "aspect_vocabulary.parquet"

NEG_THRESH = -0.05
POS_THRESH = 0.05

# Generic / closed-class heads that aren't real aspects.
STOP_HEADS = {
    "thing", "things", "stuff", "way", "ways", "time", "times", "lot", "lots",
    "people", "person", "guy", "guys", "someone", "anyone", "everyone", "nobody",
    "one", "kind", "sort", "type", "bit", "part", "parts", "side", "place",
    "anything", "everything", "something", "nothing",
    "today", "yesterday", "tomorrow", "year", "years", "day", "days", "week", "weeks",
    "month", "months", "hour", "hours", "minute", "minutes",
    "i", "me", "my", "you", "your", "we", "us", "they", "them", "he", "she", "it",
    "this", "that", "these", "those", "here", "there",
    "wattpad",  # the universal subject — useful in some contexts but drowns the list
}
# Drop chunks shorter than this many alphabetic characters after normalization.
MIN_LEN = 3
# Reject chunks containing URLs, code blocks, raw markdown noise.
JUNK_RE = re.compile(r"https?://|\bhttp\b|www\.|<[^>]+>|\[[^\]]+\]\([^)]+\)")


def normalize_chunk(chunk) -> str | None:
    """Lemmatize content tokens of a noun chunk → 'cover tool' style aspect."""
    tokens = []
    for tok in chunk:
        if tok.is_stop or tok.is_punct or tok.like_num or tok.is_space:
            continue
        if tok.pos_ not in {"NOUN", "PROPN", "ADJ"}:
            continue
        lemma = tok.lemma_.lower().strip()
        if not lemma or not lemma.isalpha():
            continue
        tokens.append(lemma)
    if not tokens:
        return None
    aspect = " ".join(tokens)
    head = tokens[-1]
    if head in STOP_HEADS:
        return None
    if len(aspect) < MIN_LEN:
        return None
    return aspect


def main() -> int:
    df = pd.read_parquet(SRC)
    before = len(df)
    df = df[~df["flair"].isin(ANALYTICAL_DROP_FLAIRS)].copy()
    df = df[df["vader_compound"].notna()].copy()
    print(f"loaded {len(df):,}/{before:,} posts after dropping ANALYTICAL_DROP_FLAIRS={set(ANALYTICAL_DROP_FLAIRS)}")

    nlp = spacy.load("en_core_web_sm", disable=["ner"])
    sid = SentimentIntensityAnalyzer()

    agg: dict[str, dict] = defaultdict(lambda: {
        "n_mentions": 0,
        "post_ids": set(),
        "sent_sum": 0.0,
        "neg_count": 0,
        "best_sample": None,
        "best_sample_doc": None,
        "best_sample_sent": 0.0,
    })

    # body is not in sentiment_descriptives.parquet (we kept body_chars). Reload it.
    corpus = pd.read_parquet(REPO_ROOT / "data" / "corpus_wattpad_full.parquet",
                             columns=["doc_id", "body"])
    body_map = dict(zip(corpus["doc_id"], corpus["body"].fillna("")))

    pairs = []
    for row in df.itertuples():
        title = (row.title or "").strip()
        body = body_map.get(row.doc_id, "").strip()
        text = (title + ". " + body).strip()
        if text:
            pairs.append((row.doc_id, text))

    print(f"running spaCy on {len(pairs):,} posts…")
    docs = nlp.pipe([t for _, t in pairs], batch_size=64)
    for (doc_id, _), doc in zip(pairs, docs):
        for sent in doc.sents:
            stext = sent.text.strip()
            if len(stext) < 12 or JUNK_RE.search(stext):
                continue
            scores = sid.polarity_scores(stext)
            compound = scores["compound"]
            for chunk in sent.noun_chunks:
                aspect = normalize_chunk(chunk)
                if aspect is None:
                    continue
                bucket = agg[aspect]
                bucket["n_mentions"] += 1
                bucket["post_ids"].add(doc_id)
                bucket["sent_sum"] += compound
                if compound < NEG_THRESH:
                    bucket["neg_count"] += 1
                # Track the most-negative sample so we have a "why this aspect hurts" line.
                if bucket["best_sample"] is None or compound < bucket["best_sample_sent"]:
                    bucket["best_sample"] = stext[:240]
                    bucket["best_sample_doc"] = doc_id
                    bucket["best_sample_sent"] = compound

    rows = []
    for aspect, b in agg.items():
        n = b["n_mentions"]
        rows.append({
            "aspect": aspect,
            "n_mentions": n,
            "n_posts": len(b["post_ids"]),
            "mean_sent": b["sent_sum"] / n,
            "share_negative": b["neg_count"] / n,
            "sample_sentence": b["best_sample"],
            "sample_doc_id": b["best_sample_doc"],
            "sample_sentence_sent": b["best_sample_sent"],
        })
    out = pd.DataFrame(rows)
    out = out[out["n_mentions"] >= 3].copy()  # drop hapaxes — noise
    out = out.sort_values("n_mentions", ascending=False).reset_index(drop=True)
    out.to_parquet(OUT, index=False)
    print(f"wrote {OUT.relative_to(REPO_ROOT)}  shape={out.shape}")
    print(f"  distinct aspects (n≥3): {len(out):,}")
    print(f"  mean share_negative:    {out['share_negative'].mean():.2%}")
    print()
    print("--- top 30 by frequency ---")
    print(out.head(30)[["aspect", "n_mentions", "n_posts", "mean_sent", "share_negative"]].to_string(index=False))
    print()
    print("--- top 30 by frequency × negativity (min n=10) ---")
    big = out[out["n_mentions"] >= 10].copy()
    big["pain_score"] = big["n_mentions"] * big["share_negative"]
    print(big.sort_values("pain_score", ascending=False)
          .head(30)[["aspect", "n_mentions", "share_negative", "mean_sent", "pain_score"]]
          .round(3).to_string(index=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
