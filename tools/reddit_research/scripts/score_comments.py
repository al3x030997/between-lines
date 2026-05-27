"""Step 3 — Score every comment in threads.parquet with cheap deterministic signals.

Adds VADER sentiment, body length, language, competitor-mention detection, and
switching-language detection. No neural models — just lexicon + regex.

Reads:
  data/threads.parquet
  data/corpus_wattpad_full.parquet  (for the `lang` column on comments)

Writes:
  data/comments_scored.parquet — threads.parquet + scoring columns:
    lang                 string
    body_chars           int32
    body_words           int32
    vader_compound       float32
    vader_pos            float32
    vader_neg            float32
    vader_neu            float32
    competitors          string   # json list, e.g. '["ao3","royal_road"]'
    has_competitor       bool
    has_switching        bool

VADER is computed only for `lang == "en"`; non-English rows get NaN.

Usage:
    python scripts/score_comments.py
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

import numpy as np
import pandas as pd
import pyarrow as pa
import pyarrow.parquet as pq
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

REPO_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO_ROOT / "src"))

SRC = REPO_ROOT / "data" / "threads.parquet"
CORPUS = REPO_ROOT / "data" / "corpus_wattpad_full.parquet"
OUT = REPO_ROOT / "data" / "comments_scored.parquet"

# Mirror the platform set from scripts/extract_competitor_mentions.py
PLATFORMS: dict[str, list[str]] = {
    "ao3":            [r"\bao3\b", r"archive\s+of\s+our\s+own", r"archiveofourown"],
    "royal_road":     [r"royal\s*road\b", r"\brroad\b", r"\brryl\b"],
    "inkitt":         [r"\binkitt\b"],
    "substack":       [r"\bsubstack\b"],
    "patreon":        [r"\bpatreon\b"],
    "tapas":          [r"\btapas(?:\.io)?\b"],
    "webnovel":       [r"\bwebnovel\b"],
    "radish":         [r"\bradish\b"],
    "kindle_vella":   [r"kindle\s*vella"],
    "fanfiction_net": [r"fanfiction\.net", r"\bff\.net\b", r"\bffn\b"],
    "wattpad":        [r"\bwattpad\b"],
}
PLATFORM_RE = {p: re.compile("|".join(pats), re.IGNORECASE) for p, pats in PLATFORMS.items()}

SWITCH_RE = re.compile(
    r"\b(?:moved|moving|left|leaving|switched|switching|jumped|migrated|"
    r"migrating|going|went|gone|deleted|abandoning|abandoned|"
    r"giving up on|quit|quitting)\b\s+(?:to|from|on)?",
    re.IGNORECASE,
)


def detect_platforms(text: str) -> list[str]:
    return sorted([p for p, rx in PLATFORM_RE.items() if rx.search(text)])


def main() -> int:
    threads = pd.read_parquet(SRC)
    print(f"loaded {len(threads):,} comments from {SRC.name}")

    # Pull lang from corpus by comment_id (dedupe — overlapping crawls produce dups)
    lang_map = (
        pd.read_parquet(CORPUS, columns=["doc_id", "kind", "lang"])
          .query('kind == "comment"')
          .drop_duplicates(subset="doc_id", keep="last")
          .set_index("doc_id")["lang"]
    )
    threads["lang"] = threads["comment_id"].map(lang_map).fillna("und").astype("string")

    body = threads["body_clean"].fillna("").astype(str)
    threads["body_chars"] = body.str.len().astype("int32")
    threads["body_words"] = body.str.split().apply(len).astype("int32")

    sid = SentimentIntensityAnalyzer()
    en_mask = threads["lang"] == "en"
    print(f"  english comments: {en_mask.sum():,} / {len(threads):,}")

    compound = np.full(len(threads), np.nan, dtype="float32")
    pos = np.full(len(threads), np.nan, dtype="float32")
    neg = np.full(len(threads), np.nan, dtype="float32")
    neu = np.full(len(threads), np.nan, dtype="float32")
    en_indices = np.where(en_mask.to_numpy())[0]
    for i in en_indices:
        s = sid.polarity_scores(body.iat[i])
        compound[i] = s["compound"]
        pos[i] = s["pos"]
        neg[i] = s["neg"]
        neu[i] = s["neu"]
    threads["vader_compound"] = compound
    threads["vader_pos"] = pos
    threads["vader_neg"] = neg
    threads["vader_neu"] = neu

    platforms_found = body.apply(detect_platforms)
    threads["competitors"] = platforms_found.apply(json.dumps).astype("string")
    threads["has_competitor"] = platforms_found.apply(lambda lst: len(lst) > 0)
    threads["has_switching"] = body.apply(lambda t: bool(SWITCH_RE.search(t)))

    OUT.parent.mkdir(parents=True, exist_ok=True)
    table = pa.Table.from_pandas(threads, preserve_index=False)
    pq.write_table(table, OUT, compression="zstd")
    print(f"wrote {OUT.relative_to(REPO_ROOT)}  shape={threads.shape}")

    print()
    print("--- length distribution ---")
    print(f"  median chars: {threads['body_chars'].median():.0f}")
    print(f"  p90 chars:    {threads['body_chars'].quantile(0.9):.0f}")
    print(f"  median words: {threads['body_words'].median():.0f}")
    print(f"  p90 words:    {threads['body_words'].quantile(0.9):.0f}")
    print()
    print("--- vader bands (english only) ---")
    en = threads[en_mask].copy()
    en["band"] = pd.cut(en["vader_compound"], bins=[-1.01, -0.05, 0.05, 1.01],
                        labels=["neg", "neu", "pos"])
    print(en["band"].value_counts(normalize=True).round(3).to_string())
    print()
    print("--- competitor mentions ---")
    print(f"  comments mentioning ≥1 competitor: {threads['has_competitor'].sum():,}")
    print(f"  switching-language comments:       {threads['has_switching'].sum():,}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
