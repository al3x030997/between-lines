"""Validate corpus.parquet against the contract.

Checks:
  1. Column names match the contract exactly.
  2. No row has author == "[deleted]".
  3. Two sequential builds from the same raw dir are byte-identical.
  4. Prints a random 20-row sample of body_clean for manual inspection.

Usage:
    python scripts/validate_corpus.py [--raw data/raw] [--corpus data/corpus.parquet]
"""
from __future__ import annotations

import argparse
import hashlib
import logging
import sys
import tempfile
from pathlib import Path

import pandas as pd

REPO_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO_ROOT / "src"))

from text_prep import SCHEMA, build_corpus

DEFAULT_RAW = REPO_ROOT / "data" / "raw"
DEFAULT_CORPUS = REPO_ROOT / "data" / "corpus.parquet"


def _sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()


def main(argv: list[str] | None = None) -> int:
    logging.basicConfig(level=logging.WARNING, stream=sys.stderr)
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--raw", type=Path, default=DEFAULT_RAW)
    parser.add_argument("--corpus", type=Path, default=DEFAULT_CORPUS)
    args = parser.parse_args(argv)

    errors: list[str] = []

    if not args.corpus.exists():
        print(f"building corpus from {args.raw} …", file=sys.stderr)
        build_corpus(args.raw, args.corpus)

    df = pd.read_parquet(args.corpus)

    # 1. Schema
    expected = list(SCHEMA.names)
    if list(df.columns) != expected:
        errors.append(f"columns mismatch\n  got:      {list(df.columns)}\n  expected: {expected}")

    # 2. No [deleted] authors
    n_deleted = (df["author"] == "[deleted]").sum()
    if n_deleted:
        errors.append(f"{n_deleted} row(s) have author='[deleted]'")

    # 3. Determinism: rebuild into a temp file and compare
    with tempfile.TemporaryDirectory() as tmpdir:
        tmp_out = Path(tmpdir) / "corpus2.parquet"
        build_corpus(args.raw, tmp_out)
        h1 = _sha256(args.corpus)
        h2 = _sha256(tmp_out)
        if h1 != h2:
            errors.append(f"determinism failure: two builds differ\n  run1={h1}\n  run2={h2}")

    # 4. Summary + sample
    print("=== kind × subreddit counts ===")
    print(df.groupby(["subreddit", "kind"]).size().to_string())
    print(f"\n=== 20 random rows (body_clean preview) ===")
    sample = df.sample(min(20, len(df)), random_state=42)
    for _, row in sample.iterrows():
        preview = (row["body_clean"] or row["title"])[:80]
        print(f"  [{row['kind']:7s}] {row['subreddit']:15s} lang={row['lang']} | {preview!r}")

    if errors:
        print(f"\n{len(errors)} validation error(s):", file=sys.stderr)
        for e in errors:
            print(f"  {e}", file=sys.stderr)
        return 1

    print(f"\nOK — {len(df)} rows in {args.corpus}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
