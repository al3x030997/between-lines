"""Build data/corpus.parquet from data/raw/{subreddit}/*.json.

Can also merge multiple tagged raw dirs into one corpus with a search_field column.

Usage (single dir):
    python scripts/build_corpus.py [--raw data/raw] [--out data/corpus.parquet] [--search-field title]

Usage (merge multiple dirs):
    python scripts/build_corpus.py \\
        --raw data/raw_search/wattpad --search-field title \\
        --raw data/raw_search/wattpad_selftext --search-field selftext \\
        --out data/corpus_wattpad_search.parquet
"""
from __future__ import annotations

import argparse
import logging
import sys
from pathlib import Path

import pyarrow as pa
import pyarrow.parquet as pq

REPO_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO_ROOT / "src"))

from text_prep import CorpusStats, build_corpus  # noqa: E402

DEFAULT_RAW = REPO_ROOT / "data" / "raw"
DEFAULT_OUT = REPO_ROOT / "data" / "corpus.parquet"


class _RawAction(argparse.Action):
    """Accumulate (raw_dir, search_field) pairs from interleaved --raw / --search-field flags."""

    def __call__(self, parser, namespace, values, option_string=None):
        items = getattr(namespace, self.dest, None) or []
        items.append(values)
        setattr(namespace, self.dest, items)


def main(argv: list[str] | None = None) -> int:
    logging.basicConfig(
        level=logging.INFO,
        format="%(levelname)s %(name)s: %(message)s",
        stream=sys.stderr,
    )
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--raw", type=Path, action=_RawAction, dest="raws", metavar="DIR",
                        help="Raw dir to include (repeatable)")
    parser.add_argument("--search-field", action="append", dest="fields", default=[],
                        metavar="FIELD", help="Tag for the preceding --raw dir (repeatable)")
    parser.add_argument("--out", type=Path, default=DEFAULT_OUT, metavar="FILE")
    args = parser.parse_args(argv)

    raws: list[Path] = args.raws or [DEFAULT_RAW]
    fields: list[str] = args.fields

    # Pad fields list so it matches raws length (empty string = no tag)
    while len(fields) < len(raws):
        fields.append("")

    for raw_dir in raws:
        if not raw_dir.exists():
            print(f"raw dir not found: {raw_dir}", file=sys.stderr)
            return 2

    if len(raws) == 1:
        stats = build_corpus(raws[0], args.out, fields[0])
        _print_stats(stats, args.out)
        return 0 if stats.total_rows > 0 else 1

    # Multi-dir: build each into a temp parquet, then concat
    from text_prep import SCHEMA  # noqa: E402

    args.out.parent.mkdir(parents=True, exist_ok=True)
    total = CorpusStats()

    with pq.ParquetWriter(str(args.out), schema=SCHEMA, compression="zstd") as writer:
        for raw_dir, field in zip(raws, fields):
            tmp = args.out.with_suffix(f".{field or 'part'}.tmp.parquet")
            try:
                stats = build_corpus(raw_dir, tmp, field)
                if stats.total_rows == 0:
                    print(f"WARNING: zero rows from {raw_dir}", file=sys.stderr)
                    continue
                tbl = pq.read_table(str(tmp))
                writer.write_table(tbl)
                total.posts += stats.posts
                total.comments += stats.comments
                print(f"  [{field or '?':10s}] {stats.posts} posts  {stats.comments} comments  ← {raw_dir}")
            finally:
                if tmp.exists():
                    tmp.unlink()

    _print_stats(total, args.out)
    return 0 if total.total_rows > 0 else 1


def _print_stats(stats: CorpusStats, out: Path) -> None:
    if stats.total_rows == 0:
        print("WARNING: zero rows written", file=sys.stderr)
    else:
        print(f"corpus: {stats.posts} posts  {stats.comments} comments  total={stats.total_rows}  → {out}")


if __name__ == "__main__":
    sys.exit(main())
