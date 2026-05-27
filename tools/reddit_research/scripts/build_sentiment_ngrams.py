"""Step 2 — VADER sentiment scores + per-topic n-grams.

Reads:
  data/corpus_wattpad_full.parquet
  data/corpus_wattpad_topics.parquet  (from Step 1)
  data/features_wattpad/tokens.parquet

Outputs:
  data/corpus_wattpad_vader_v2.parquet   — doc_id, vader_*
  data/features_wattpad/ngrams_by_topic.parquet — topic, ngram, n, count, df, topic_rank

Usage:
    python scripts/build_sentiment_ngrams.py
"""
from __future__ import annotations

import sys
from collections import Counter
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO_ROOT / "src"))

import pandas as pd        # noqa: E402
import pyarrow as pa       # noqa: E402
import pyarrow.parquet as pq  # noqa: E402
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer  # noqa: E402

try:
    from sklearn.feature_extraction.text import ENGLISH_STOP_WORDS
except ImportError:
    ENGLISH_STOP_WORDS = frozenset()  # type: ignore[assignment]

CORPUS  = REPO_ROOT / "data" / "corpus_wattpad_full.parquet"
TOPICS  = REPO_ROOT / "data" / "corpus_wattpad_topics.parquet"
TOKENS  = REPO_ROOT / "data" / "features_wattpad" / "tokens.parquet"
OUT_VADER  = REPO_ROOT / "data" / "corpus_wattpad_vader_v2.parquet"
OUT_NGRAMS = REPO_ROOT / "data" / "features_wattpad" / "ngrams_by_topic.parquet"


def _make_ngrams(tokens: list[str], n: int) -> list[str]:
    if n == 1:
        return tokens
    return [" ".join(tokens[i: i + n]) for i in range(len(tokens) - n + 1)]


def compute_vader(corpus: pd.DataFrame) -> pd.DataFrame:
    print("  Running VADER on English rows…")
    sid = SentimentIntensityAnalyzer()
    # Deduplicate: one row per doc_id (corpus may contain same doc_id from multiple search passes)
    deduped = corpus.drop_duplicates(subset="doc_id").copy()
    en = deduped[deduped["lang"] == "en"].copy()
    text = (en["title"].fillna("") + " " + en["body"].fillna("")).str.strip()
    scores = text.apply(sid.polarity_scores)
    en["vader_compound"] = scores.apply(lambda s: s["compound"])
    en["vader_pos"]      = scores.apply(lambda s: s["pos"])
    en["vader_neg"]      = scores.apply(lambda s: s["neg"])
    en["vader_neu"]      = scores.apply(lambda s: s["neu"])

    result = deduped[["doc_id"]].copy()
    result = result.merge(
        en[["doc_id", "vader_compound", "vader_pos", "vader_neg", "vader_neu"]],
        on="doc_id", how="left",
    )
    n_en = len(en)
    n_total = len(deduped)
    print(f"  VADER: {n_en:,} English / {n_total:,} total  ({n_en/n_total:.1%} coverage)")
    return result


def compute_ngrams_by_topic(
    corpus: pd.DataFrame,
    topics_df: pd.DataFrame,
    tokens_df: pd.DataFrame,
    top_k: int = 1000,
) -> pd.DataFrame:
    print("  Computing per-topic n-grams…")
    # Join topic onto tokens
    merged = tokens_df.merge(
        topics_df[["doc_id", "topic"]],
        on="doc_id", how="inner",
    ).merge(
        corpus[["doc_id", "lang"]],
        on="doc_id", how="left",
    )

    records: list[dict] = []

    for topic, grp in merged.groupby("topic", sort=True):
        langs  = grp["lang"].tolist()
        tok_lists = grp["tokens"].tolist()

        for n in (1, 2):
            count: Counter = Counter()
            doc_freq: Counter = Counter()
            for lang, toks in zip(langs, tok_lists):
                if lang == "en":
                    toks = [t for t in toks if t not in ENGLISH_STOP_WORDS]
                ngrams = _make_ngrams(toks, n)
                for ng in ngrams:
                    count[ng] += 1
                for ng in set(ngrams):
                    doc_freq[ng] += 1

            top = sorted(count.items(), key=lambda x: (-x[1], x[0]))[:top_k]
            for rank, (ngram, cnt) in enumerate(top, 1):
                records.append({
                    "topic":       topic,
                    "ngram":       ngram,
                    "n":           n,
                    "count":       cnt,
                    "df":          doc_freq[ngram],
                    "topic_rank":  rank,
                })

    return pd.DataFrame(records)


def write_parquet(df: pd.DataFrame, path: Path) -> None:
    tmp = path.with_suffix(".parquet.tmp")
    df.to_parquet(str(tmp), compression="zstd", index=False)
    tmp.replace(path)
    print(f"  output → {path.relative_to(REPO_ROOT)}  ({len(df):,} rows)")


def main() -> int:
    print("Loading data…")
    corpus    = pd.read_parquet(CORPUS)
    topics_df = pd.read_parquet(TOPICS)
    tokens_df = pd.read_parquet(TOKENS)

    vader_df = compute_vader(corpus)
    write_parquet(vader_df, OUT_VADER)

    ngrams_df = compute_ngrams_by_topic(corpus, topics_df, tokens_df)
    write_parquet(ngrams_df, OUT_NGRAMS)

    print("\nVerification:")
    v = pd.read_parquet(OUT_VADER)
    print(v[["vader_compound", "vader_pos", "vader_neg", "vader_neu"]].describe().to_string())
    en_cov = v["vader_compound"].notna().mean()
    print(f"en coverage: {en_cov:.3f}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
