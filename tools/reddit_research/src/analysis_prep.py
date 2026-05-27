"""NLP feature extraction for the Reddit research pipeline (package 04).

Produces:
    data/features/tokens.parquet      — doc_id, tokens (list[str])
    data/features/ngrams_top.parquet  — subreddit, ngram, n, count, df, subreddit_count
    data/features/tfidf.npz           — scipy sparse (if features.tfidf=true)
    data/features/tfidf_vocab.json    — index → term (if features.tfidf=true)
"""
from __future__ import annotations

import json
import logging
import re
from collections import Counter
from pathlib import Path

import pandas as pd
import pyarrow as pa
import pyarrow.parquet as pq
import yaml

try:
    from sklearn.feature_extraction.text import ENGLISH_STOP_WORDS
except ImportError:  # before deps are installed
    ENGLISH_STOP_WORDS = frozenset()  # type: ignore[assignment]

log = logging.getLogger(__name__)

_TOKEN_RE = re.compile(r"\b\w+\b")


# ── Config ────────────────────────────────────────────────────────────────────

def load_config(path: Path) -> dict:
    with path.open() as f:
        return yaml.safe_load(f)


# ── Corpus ────────────────────────────────────────────────────────────────────

def load_filtered_corpus(corpus_path: Path, config: dict) -> pd.DataFrame:
    """Load corpus.parquet, apply score + language filters, add 'text' column."""
    df = pd.read_parquet(corpus_path)
    filters = config.get("filters", {})

    min_score = filters.get("min_score", -10)
    df = df[df["score"] >= min_score]

    langs = filters.get("langs", [])
    if langs:
        df = df[df["lang"].isin(langs)]

    # Deterministic order: tokens list must align with df row order
    df = df.sort_values("doc_id").reset_index(drop=True)

    # Posts get title prepended; comments get body_clean only
    df["text"] = (
        df["title"].fillna("") + "\n" + df["body_clean"].fillna("")
    ).str.strip()

    log.info(
        "corpus after filter: %d rows (%d post, %d comment)",
        len(df),
        (df["kind"] == "post").sum(),
        (df["kind"] == "comment").sum(),
    )
    return df


# ── Tokenisation ──────────────────────────────────────────────────────────────

def tokenize(text: str) -> list[str]:
    """Lowercase regex word tokeniser. No stemming, no stop-word removal."""
    return _TOKEN_RE.findall(text.lower())


def write_tokens(df: pd.DataFrame, out_path: Path) -> list[list[str]]:
    """Tokenise every row, write tokens.parquet, return the parallel tokens list."""
    tokens: list[list[str]] = [tokenize(t) for t in df["text"]]
    table = pa.table(
        {"doc_id": df["doc_id"].tolist(), "tokens": tokens},
        schema=pa.schema([("doc_id", pa.string()), ("tokens", pa.list_(pa.string()))]),
    )
    pq.write_table(table, str(out_path), compression="zstd")
    log.info("tokens: %d docs → %s", len(tokens), out_path)
    return tokens


# ── N-grams ────────────────────────────────────────────────────────────────────

def _make_ngrams(tokens: list[str], n: int) -> list[str]:
    if n == 1:
        return tokens
    return [" ".join(tokens[i : i + n]) for i in range(len(tokens) - n + 1)]


def compute_ngrams(
    df: pd.DataFrame,
    tokens: list[list[str]],
    out_path: Path,
    top_k: int = 1000,
) -> None:
    """Compute per-subreddit unigrams and bigrams.

    Stop-word filtering (ENGLISH_STOP_WORDS) applied only to lang=='en' rows.
    Top top_k ngrams per (subreddit, n) kept, ranked by count then alpha for ties.
    """
    lang_series = df["lang"].tolist()
    records: list[dict] = []

    for sub, grp in df.groupby("subreddit", sort=True):
        row_idx = grp.index.tolist()
        sub_langs = grp["lang"].tolist()
        sub_tokens = [tokens[i] for i in row_idx]

        for n in (1, 2):
            count: Counter = Counter()
            doc_freq: Counter = Counter()

            for lang, toks in zip(sub_langs, sub_tokens):
                if lang == "en":
                    toks = [t for t in toks if t not in ENGLISH_STOP_WORDS]
                ngrams = _make_ngrams(toks, n)
                for ng in ngrams:
                    count[ng] += 1
                for ng in set(ngrams):
                    doc_freq[ng] += 1

            top = sorted(count.items(), key=lambda x: (-x[1], x[0]))[:top_k]
            for rank, (ngram, cnt) in enumerate(top, 1):
                records.append(
                    {
                        "subreddit": sub,
                        "ngram": ngram,
                        "n": n,
                        "count": cnt,
                        "df": doc_freq[ngram],
                        "subreddit_count": rank,
                    }
                )

    schema = pa.schema(
        [
            ("subreddit", pa.string()),
            ("ngram", pa.string()),
            ("n", pa.int32()),
            ("count", pa.int32()),
            ("df", pa.int32()),
            ("subreddit_count", pa.int32()),
        ]
    )
    table = pa.table({col: [r[col] for r in records] for col in schema.names}, schema=schema)
    pq.write_table(table, str(out_path), compression="zstd")
    log.info("ngrams: %d rows → %s", len(records), out_path)


# ── TF-IDF ────────────────────────────────────────────────────────────────────

def compute_tfidf(tokens: list[list[str]], npz_path: Path, vocab_path: Path) -> None:
    """Fit TfidfVectorizer on pre-tokenised corpus and save sparse matrix + vocab."""
    import scipy.sparse
    from sklearn.feature_extraction.text import TfidfVectorizer

    corpus_strings = [" ".join(toks) for toks in tokens]

    vec = TfidfVectorizer(
        min_df=5,
        max_df=0.6,
        ngram_range=(1, 2),
        lowercase=False,
        tokenizer=str.split,
        token_pattern=None,
    )
    matrix = vec.fit_transform(corpus_strings)
    scipy.sparse.save_npz(str(npz_path), matrix)

    # {index: term} sorted by index so file is deterministic
    vocab = {str(idx): term for term, idx in sorted(vec.vocabulary_.items(), key=lambda x: x[1])}
    with vocab_path.open("w", encoding="utf-8") as f:
        json.dump(vocab, f, ensure_ascii=False)

    log.info("tfidf: %s sparse → %s", matrix.shape, npz_path)
