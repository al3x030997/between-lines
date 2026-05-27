"""Classify Reddit posts about Wattpad into 5 topics using a local Ollama LLM.

Topics: platform_comparison | author_writing_experience | reader_experience |
        community_culture | unrelated

Pre-flight:
    ollama pull llama3.1:8b
    curl -s http://localhost:11434/api/tags | grep llama3.1

Usage:
    python scripts/classify_topics.py [--corpus data/corpus_wattpad_full.parquet]
        [--out data/topic_labels.parquet] [--model llama3.1:8b]
        [--host http://localhost:11434] [--max-chars 2000]
        [--limit 0] [--dry-run] [--verbose]
"""
from __future__ import annotations

import argparse
import json
import os
import sys
import time
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO_ROOT / "src"))

import httpx           # noqa: E402
import pandas as pd    # noqa: E402
import pyarrow as pa   # noqa: E402
import pyarrow.parquet as pq  # noqa: E402

from reddit_http import graceful_sigint  # noqa: E402

TOPICS = (
    "platform_comparison",
    "author_writing_experience",
    "reader_experience",
    "community_culture",
    "unrelated",
)

TOPIC_DEFS = {
    "platform_comparison":       "Wattpad compared to AO3, RoyalRoad, Inkitt, Substack, or other writing/reading platforms.",
    "author_writing_experience": "Writing on Wattpad, growing an audience, getting feedback, 'Wattpad style', monetisation for writers.",
    "reader_experience":         "App UX, paywalls, ads, content discovery, reading quality from a reader's perspective.",
    "community_culture":         "Wattpad community vibe, nostalgia, fandom, inside jokes, cultural references.",
    "unrelated":                 "Memes, image posts, non-English text, passing references with no substantive discussion.",
}

SYSTEM_PROMPT = (
    "Classify Reddit posts about Wattpad into exactly one of 5 topics. "
    'Output strict JSON {"topic": ..., "rationale": ..., "confidence": ...}. '
    "Reply with JSON only."
)

FLUSH_EVERY = 25

LABELS_SCHEMA = pa.schema([
    ("doc_id",        pa.string()),
    ("topic",         pa.string()),
    ("rationale",     pa.string()),
    ("confidence",    pa.float64()),
    ("model",         pa.string()),
    ("classified_at", pa.int64()),
])

DEFAULT_CORPUS = REPO_ROOT / "data" / "corpus_wattpad_full.parquet"
DEFAULT_OUT    = REPO_ROOT / "data" / "topic_labels.parquet"


def load_posts(corpus_path: Path) -> pd.DataFrame:
    """Load posts only, deduped by doc_id with priority: subreddit > selftext > title."""
    df = pd.read_parquet(corpus_path)
    df = df[df["kind"] == "post"].copy()
    priority = {"subreddit": 0, "selftext": 1, "title": 2}
    df["_prio"] = df["search_field"].map(lambda f: priority.get(f, 99))
    df = (
        df.sort_values("_prio")
        .drop_duplicates(subset="doc_id", keep="first")
        .drop(columns="_prio")
        .reset_index(drop=True)
    )
    df["title"] = df["title"].fillna("")
    df["body"]  = df["body"].fillna("")
    return df


def load_existing_labels(out_path: Path) -> set[str]:
    if not out_path.exists():
        return set()
    return set(pd.read_parquet(out_path)["doc_id"].tolist())


def build_prompt(title: str, body: str, max_chars: int) -> tuple[str, str]:
    topic_block = "\n".join(f"  - {name}: {defn}" for name, defn in TOPIC_DEFS.items())
    user = (
        f"Topics:\n{topic_block}\n\n"
        f"Post title: {title}\n"
        f"Post body: {body[:max_chars]}\n\n"
        "Pick exactly one topic. If non-English or no meaningful text, pick unrelated. "
        'Output JSON only: {"topic": "...", "rationale": "...", "confidence": 0.0}'
    )
    return SYSTEM_PROMPT, user


def _call_ollama(host: str, model: str, messages: list[dict], timeout: float) -> dict:
    resp = httpx.post(
        f"{host}/api/chat",
        json={
            "model": model,
            "format": "json",
            "stream": False,
            "options": {"temperature": 0.1, "num_ctx": 4096},
            "messages": messages,
        },
        timeout=timeout,
    )
    resp.raise_for_status()
    return json.loads(resp.json()["message"]["content"])


def classify_one(host: str, model: str, system: str, user: str, timeout: float = 120.0) -> dict:
    messages = [{"role": "system", "content": system}, {"role": "user", "content": user}]
    result = _call_ollama(host, model, messages, timeout)

    if result.get("topic") not in TOPICS:
        retry_user = (
            user + f"\n\nIMPORTANT: topic MUST be exactly one of: {', '.join(TOPICS)}. No other values."
        )
        messages[1] = {"role": "user", "content": retry_user}
        result = _call_ollama(host, model, messages, timeout)
        if result.get("topic") not in TOPICS:
            result["topic"] = "unrelated"

    try:
        confidence = float(result.get("confidence", 0.0))
    except (TypeError, ValueError):
        confidence = 0.0

    return {
        "topic":      result.get("topic", "unrelated"),
        "rationale":  str(result.get("rationale", "")),
        "confidence": confidence,
    }


def append_batch_to_parquet(out_path: Path, rows: list[dict]) -> None:
    if not rows:
        return
    table = pa.table(
        {col: [r[col] for r in rows] for col in LABELS_SCHEMA.names},
        schema=LABELS_SCHEMA,
    )
    if out_path.exists():
        combined = pa.concat_tables([pq.read_table(str(out_path)), table])
    else:
        combined = table
    tmp = out_path.with_suffix(".parquet.tmp")
    pq.write_table(combined, str(tmp), compression="zstd")
    os.replace(tmp, out_path)


def parse_args(argv=None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--corpus", type=Path, default=DEFAULT_CORPUS)
    parser.add_argument("--out", type=Path, default=DEFAULT_OUT)
    parser.add_argument("--model", default="llama3.1:8b")
    parser.add_argument("--host", default="http://localhost:11434")
    parser.add_argument("--max-chars", type=int, default=2000)
    parser.add_argument("--limit", type=int, default=0, help="0 = classify all")
    parser.add_argument("--dry-run", action="store_true", help="Print prompt for first post, no API call")
    parser.add_argument("--verbose", action="store_true")
    return parser.parse_args(argv)


def main(argv=None) -> int:
    args = parse_args(argv)

    df = load_posts(args.corpus)
    done_ids = load_existing_labels(args.out)
    todo = df[~df["doc_id"].isin(done_ids)]
    if args.limit > 0:
        todo = todo.head(args.limit)

    print(f"corpus posts: {len(df)}  already done: {len(done_ids)}  to classify: {len(todo)}")

    if args.dry_run:
        row = todo.iloc[0]
        system, user = build_prompt(row["title"], row["body"], args.max_chars)
        print("=== SYSTEM ===")
        print(system)
        print("=== USER ===")
        print(user)
        return 0

    if todo.empty:
        print("nothing to do")
        return 0

    batch: list[dict] = []
    n_done = 0
    n_errors = 0
    started = time.monotonic()

    with graceful_sigint() as flag:
        for _, row in todo.iterrows():
            if flag["stopped"]:
                break
            system, user = build_prompt(row["title"], row["body"], args.max_chars)
            try:
                result = classify_one(args.host, args.model, system, user)
            except Exception as exc:
                print(f"  error {row['doc_id']}: {exc!r}", flush=True)
                n_errors += 1
                continue

            batch.append({
                "doc_id":        row["doc_id"],
                "topic":         result["topic"],
                "rationale":     result["rationale"],
                "confidence":    result["confidence"],
                "model":         args.model,
                "classified_at": int(time.time()),
            })
            n_done += 1

            if args.verbose:
                snippet = result["rationale"][:60]
                print(f"  [{n_done:4d}] {row['doc_id']}  {result['topic']:<28}  {snippet}", flush=True)

            if len(batch) >= FLUSH_EVERY:
                append_batch_to_parquet(args.out, batch)
                batch = []
                elapsed = int(time.monotonic() - started)
                mm, ss = divmod(elapsed, 60)
                rate = n_done / max(elapsed, 1) * 60
                print(f"  flushed {n_done} rows  elapsed={mm:02d}:{ss:02d}  {rate:.0f} posts/min", flush=True)

    if batch:
        append_batch_to_parquet(args.out, batch)
        print(f"  flushed {len(batch)} rows (final)", flush=True)

    elapsed = int(time.monotonic() - started)
    mm, ss = divmod(elapsed, 60)
    print(f"\ndone: classified={n_done}  errors={n_errors}  elapsed={mm:02d}:{ss:02d}")
    print(f"output → {args.out}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
