"""Step 3 — Extract structured opinions from Wattpad posts using a local LLM.

Runs only on 333 substantive posts (topic != 'unrelated').
Mirrors classify_topics.py for resume / FLUSH_EVERY / graceful_sigint / atomic writes.

Pre-flight:
    ollama pull llama3.1:8b
    curl -s http://localhost:11434/api/tags | grep llama3.1

Usage:
    python scripts/extract_opinions.py [--limit N] [--dry-run] [--verbose]
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

FLUSH_EVERY = 25

OPINIONS_SCHEMA = pa.schema([
    ("doc_id",               pa.string()),
    ("topic",                pa.string()),
    ("user_role",            pa.string()),
    ("praises",              pa.list_(pa.string())),
    ("criticisms",           pa.list_(pa.string())),
    ("gaps",                 pa.list_(pa.string())),
    ("mentioned_platforms",  pa.list_(pa.string())),
    ("key_quote",            pa.string()),
    ("model",                pa.string()),
    ("extracted_at",         pa.int64()),
])

SYSTEM_PROMPT = """You analyze Reddit posts about Wattpad to extract user opinions.
Output strict JSON only. Fields:
  user_role: 'author' (writes on Wattpad), 'reader' (reads on Wattpad),
             'observer' (talks about it without using it), 'mixed', or 'unknown'.
  praises:   short phrases (≤8 words) of things the user likes about Wattpad.
  criticisms: short phrases of things the user dislikes.
  gaps:      missing features or unmet needs the user mentions.
  mentioned_platforms: lowercase names of any rival platforms (ao3, royalroad,
             inkitt, substack, fanfiction.net, kindle, wattpad, etc.).
  key_quote: one verbatim sentence ≤200 chars summarizing the user's stance.
Use [] for empty lists, "" for empty quote, "unknown" for unclear role.
Never invent details not in the text."""

FEW_SHOT_EXAMPLE = """Example post title: Leaving Wattpad for AO3 — the ads broke me
Example post body: After 3 years of writing on Wattpad I've finally had enough. The ads are unbearable, especially the video ads mid-chapter. The algorithm also buried my work unless I paid for promotion. Moving everything to AO3 where the community actually cares about writing and not monetization.

Example JSON output:
{
  "user_role": "author",
  "praises": [],
  "criticisms": ["unbearable video ads mid-chapter", "algorithm buries content without payment", "heavy monetization focus"],
  "gaps": ["fair organic content promotion", "non-intrusive ad experience"],
  "mentioned_platforms": ["ao3"],
  "key_quote": "After 3 years of writing on Wattpad I've finally had enough."
}"""

DEFAULT_LABELS = REPO_ROOT / "data" / "topic_labels.parquet"
DEFAULT_CORPUS = REPO_ROOT / "data" / "corpus_wattpad_full.parquet"
DEFAULT_OUT    = REPO_ROOT / "data" / "post_opinions.parquet"


def load_posts(corpus_path: Path, labels_path: Path) -> pd.DataFrame:
    """Load posts with topic labels, exclude unrelated."""
    corpus = pd.read_parquet(corpus_path)
    posts  = corpus[corpus["kind"] == "post"].copy()
    priority = {"subreddit": 0, "selftext": 1, "title": 2}
    posts["_prio"] = posts["search_field"].map(lambda f: priority.get(f, 99))
    posts = (
        posts.sort_values("_prio")
        .drop_duplicates(subset="doc_id", keep="first")
        .drop(columns="_prio")
        .reset_index(drop=True)
    )
    labels = pd.read_parquet(labels_path)
    merged = posts.merge(labels[["doc_id", "topic", "confidence"]], on="doc_id", how="inner")
    substantive = merged[merged["topic"] != "unrelated"].copy()
    substantive["title"] = substantive["title"].fillna("")
    substantive["body"]  = substantive["body"].fillna("")
    return substantive.reset_index(drop=True)


def load_existing(out_path: Path) -> set[str]:
    if not out_path.exists():
        return set()
    return set(pd.read_parquet(out_path)["doc_id"].tolist())


def _coerce_list(val) -> list[str]:
    if isinstance(val, str):
        return [val] if val else []
    if isinstance(val, list):
        return [str(v) for v in val]
    return []


def _call_ollama(host: str, model: str, messages: list[dict], timeout: float) -> dict:
    resp = httpx.post(
        f"{host}/api/chat",
        json={
            "model":  model,
            "format": "json",
            "stream": False,
            "options": {"temperature": 0.1, "num_ctx": 8192},
            "messages": messages,
        },
        timeout=timeout,
    )
    resp.raise_for_status()
    return json.loads(resp.json()["message"]["content"])


def extract_one(host: str, model: str, title: str, body: str, max_chars: int,
                timeout: float = 180.0) -> dict:
    user = (
        f"{FEW_SHOT_EXAMPLE}\n\n"
        f"Now analyze this post:\n"
        f"Post title: {title}\n"
        f"Post body: {body[:max_chars]}"
    )
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user",   "content": user},
    ]
    raw = _call_ollama(host, model, messages, timeout)

    valid_roles = {"author", "reader", "observer", "mixed", "unknown"}
    role = str(raw.get("user_role", "unknown"))
    if role not in valid_roles:
        role = "unknown"

    key_quote = str(raw.get("key_quote", ""))[:200]

    return {
        "user_role":           role,
        "praises":             _coerce_list(raw.get("praises", [])),
        "criticisms":          _coerce_list(raw.get("criticisms", [])),
        "gaps":                _coerce_list(raw.get("gaps", [])),
        "mentioned_platforms": _coerce_list(raw.get("mentioned_platforms", [])),
        "key_quote":           key_quote,
    }


def append_batch(out_path: Path, rows: list[dict]) -> None:
    if not rows:
        return
    table = pa.table(
        {col: [r[col] for r in rows] for col in OPINIONS_SCHEMA.names},
        schema=OPINIONS_SCHEMA,
    )
    if out_path.exists():
        combined = pa.concat_tables([pq.read_table(str(out_path)), table])
    else:
        combined = table
    tmp = out_path.with_suffix(".parquet.tmp")
    pq.write_table(combined, str(tmp), compression="zstd")
    os.replace(tmp, out_path)


def parse_args(argv=None) -> argparse.Namespace:
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--corpus",    type=Path, default=DEFAULT_CORPUS)
    p.add_argument("--labels",    type=Path, default=DEFAULT_LABELS)
    p.add_argument("--out",       type=Path, default=DEFAULT_OUT)
    p.add_argument("--model",     default="llama3.1:8b")
    p.add_argument("--host",      default="http://localhost:11434")
    p.add_argument("--max-chars", type=int, default=3000)
    p.add_argument("--limit",     type=int, default=0, help="0 = all substantive posts")
    p.add_argument("--dry-run",   action="store_true")
    p.add_argument("--verbose",   action="store_true")
    return p.parse_args(argv)


def main(argv=None) -> int:
    args = parse_args(argv)

    posts    = load_posts(args.corpus, args.labels)
    done_ids = load_existing(args.out)
    todo     = posts[~posts["doc_id"].isin(done_ids)]
    if args.limit > 0:
        todo = todo.head(args.limit)

    print(f"substantive posts: {len(posts)}  already done: {len(done_ids)}  to extract: {len(todo)}")

    if args.dry_run:
        row = todo.iloc[0]
        user = (
            f"{FEW_SHOT_EXAMPLE}\n\n"
            f"Now analyze this post:\n"
            f"Post title: {row['title']}\n"
            f"Post body: {row['body'][:args.max_chars]}"
        )
        print("=== SYSTEM ===")
        print(SYSTEM_PROMPT)
        print("=== USER ===")
        print(user)
        return 0

    if todo.empty:
        print("nothing to do")
        return 0

    batch: list[dict] = []
    n_done = n_errors = 0
    started = time.monotonic()

    with graceful_sigint() as flag:
        for _, row in todo.iterrows():
            if flag["stopped"]:
                break
            try:
                result = extract_one(
                    args.host, args.model,
                    row["title"], row["body"], args.max_chars,
                )
            except Exception as exc:
                print(f"  error {row['doc_id']}: {exc!r}", flush=True)
                n_errors += 1
                continue

            batch.append({
                "doc_id":               row["doc_id"],
                "topic":                row["topic"],
                "user_role":            result["user_role"],
                "praises":              result["praises"],
                "criticisms":           result["criticisms"],
                "gaps":                 result["gaps"],
                "mentioned_platforms":  result["mentioned_platforms"],
                "key_quote":            result["key_quote"],
                "model":                args.model,
                "extracted_at":         int(time.time()),
            })
            n_done += 1

            if args.verbose:
                print(
                    f"  [{n_done:4d}] {row['doc_id']}  role={result['user_role']:<10}"
                    f"  praises={len(result['praises'])}  crits={len(result['criticisms'])}"
                    f"  gaps={len(result['gaps'])}",
                    flush=True,
                )

            if len(batch) >= FLUSH_EVERY:
                append_batch(args.out, batch)
                batch = []
                elapsed = int(time.monotonic() - started)
                mm, ss = divmod(elapsed, 60)
                rate = n_done / max(elapsed, 1) * 60
                print(f"  flushed {n_done} rows  elapsed={mm:02d}:{ss:02d}  {rate:.1f} posts/min", flush=True)

    if batch:
        append_batch(args.out, batch)
        print(f"  flushed {len(batch)} rows (final)", flush=True)

    elapsed = int(time.monotonic() - started)
    mm, ss = divmod(elapsed, 60)
    print(f"\ndone: extracted={n_done}  errors={n_errors}  elapsed={mm:02d}:{ss:02d}")
    print(f"output → {args.out}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
