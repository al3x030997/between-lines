"""Build NLP features from data/corpus.parquet.

Usage:
    python scripts/build_features.py [--corpus PATH] [--config PATH] [--out DIR]
"""
from __future__ import annotations

import argparse
import logging
import random
import sys
from pathlib import Path

import numpy as np

REPO_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO_ROOT / "src"))

from analysis_prep import (  # noqa: E402
    compute_ngrams,
    compute_tfidf,
    load_config,
    load_filtered_corpus,
    write_tokens,
)

DEFAULT_CORPUS = REPO_ROOT / "data" / "corpus.parquet"
DEFAULT_CONFIG = REPO_ROOT / "config" / "analysis.yaml"
DEFAULT_OUT = REPO_ROOT / "data" / "features"


def main(argv: list[str] | None = None) -> int:
    logging.basicConfig(
        level=logging.INFO,
        format="%(levelname)s %(name)s: %(message)s",
        stream=sys.stderr,
    )
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--corpus", type=Path, default=DEFAULT_CORPUS, metavar="FILE")
    parser.add_argument("--config", type=Path, default=DEFAULT_CONFIG, metavar="FILE")
    parser.add_argument("--out", type=Path, default=DEFAULT_OUT, metavar="DIR")
    args = parser.parse_args(argv)

    random.seed(0)
    np.random.seed(0)

    if not args.corpus.exists():
        print(f"corpus not found: {args.corpus}", file=sys.stderr)
        return 2
    if not args.config.exists():
        print(f"config not found: {args.config}", file=sys.stderr)
        return 2

    args.out.mkdir(parents=True, exist_ok=True)
    config = load_config(args.config)
    features = config.get("features", {})

    df = load_filtered_corpus(args.corpus, config)
    tokens = write_tokens(df, args.out / "tokens.parquet")
    compute_ngrams(df, tokens, args.out / "ngrams_top.parquet")

    if features.get("tfidf", False):
        compute_tfidf(tokens, args.out / "tfidf.npz", args.out / "tfidf_vocab.json")

    if features.get("embeddings", False):
        logging.getLogger(__name__).info("embeddings toggled on — not implemented yet, skipping")

    print(f"features written to {args.out}/")
    return 0


if __name__ == "__main__":
    sys.exit(main())
