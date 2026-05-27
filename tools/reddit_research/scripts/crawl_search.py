"""Search Reddit for posts whose title or body contains a keyword and crawl their comments.

Results are stored under data/raw_search/{keyword}_{field}/{subreddit}/{post_id}.json,
following the same file contract as data/raw/ so build_corpus.py can consume it.

Usage:
    python scripts/crawl_search.py --query wattpad [--field title|selftext|all] [--cap 500] [--sort top] [--time all]

--field title     → title:wattpad  (default, original behaviour)
--field selftext  → selftext:wattpad
--field all       → wattpad  (title + body)
"""
from __future__ import annotations

import argparse
import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Iterator

REPO_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO_ROOT / "src"))

from reddit_http import RateLimitedClient, graceful_sigint  # noqa: E402

SEARCH_URL = "https://www.reddit.com/search.json"
COMMENTS_URL = "https://www.reddit.com/comments/{post_id}.json"
DEFAULT_OUT = REPO_ROOT / "data" / "raw_search"
DEFAULT_CAP = 500
DEFAULT_MAX_DEPTH = 10

_POST_FIELDS = (
    "id", "subreddit", "title", "selftext", "author", "created_utc",
    "score", "num_comments", "url", "permalink", "link_flair_text", "over_18",
)


# ── Helpers (mirrors crawl.py, kept inline to avoid relative-import chain) ───

def _iso_utc() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def _atomic_write(path: Path, payload: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix(".json.tmp")
    with tmp.open("w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False)
    os.replace(tmp, path)


def _walk_comment(node: dict, depth: int, max_depth: int, out: list) -> None:
    if node.get("kind") != "t1":
        return
    data = node.get("data") or {}
    out.append({
        "id": data.get("id"),
        "parent_id": data.get("parent_id"),
        "author": data.get("author"),
        "body": data.get("body"),
        "score": data.get("score"),
        "created_utc": data.get("created_utc"),
        "depth": depth,
    })
    if depth >= max_depth:
        return
    replies = data.get("replies")
    if not isinstance(replies, dict):
        return
    for reply in ((replies.get("data") or {}).get("children") or []):
        _walk_comment(reply, depth + 1, max_depth, out)


def _fetch_comments(client: RateLimitedClient, post_id: str, max_depth: int) -> list | None:
    body = client.get_json(
        COMMENTS_URL.format(post_id=post_id),
        params={"limit": 500, "depth": max_depth},
    )
    if body is None:
        return None
    if not isinstance(body, list) or len(body) < 2:
        return []
    out: list = []
    for child in ((body[1].get("data") or {}).get("children") or []):
        _walk_comment(child, 0, max_depth, out)
    return out


# ── Search pagination ─────────────────────────────────────────────────────────

def _build_q(query: str, field: str) -> str:
    if field == "title":
        return f"title:{query}"
    if field == "selftext":
        return f"selftext:{query}"
    return query  # field == "all"


def _iter_search(
    client: RateLimitedClient,
    query: str,
    field: str,
    sort: str,
    time_window: str,
    cap: int,
    stop_flag: dict,
) -> Iterator[dict]:
    after: str | None = None
    yielded = 0
    while yielded < cap and not stop_flag["stopped"]:
        params: dict[str, Any] = {
            "q": _build_q(query, field),
            "sort": sort,
            "t": time_window,
            "limit": 100,
            "type": "link",
        }
        if after:
            params["after"] = after
        body = client.get_json(SEARCH_URL, params=params)
        if body is None:
            break
        data = body.get("data") or {}
        children = data.get("children") or []
        if not children:
            break
        for child in children:
            child_data = child.get("data") or {}
            if not child_data.get("id"):
                continue
            yield child_data
            yielded += 1
            if yielded >= cap or stop_flag["stopped"]:
                return
        after = data.get("after")
        if not after:
            break


# ── Main ──────────────────────────────────────────────────────────────────────

def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--query", required=True, help="Keyword to search")
    parser.add_argument(
        "--field", choices=("title", "selftext", "all"), default="title",
        help="Which field to search: title (default), selftext, or all (both)",
    )
    parser.add_argument("--cap", type=int, default=DEFAULT_CAP, help="Max posts to fetch (default 500)")
    parser.add_argument("--sort", choices=("relevance", "top", "new"), default="top")
    parser.add_argument(
        "--time", dest="time_window",
        choices=("hour", "day", "week", "month", "year", "all"), default="all",
    )
    parser.add_argument("--max-depth", type=int, default=DEFAULT_MAX_DEPTH)
    parser.add_argument("--out", type=Path, default=DEFAULT_OUT)
    parser.add_argument("--skip-comments", action="store_true")
    args = parser.parse_args(argv)

    slug = args.query.lower().replace(" ", "_")
    dir_name = slug if args.field == "title" else f"{slug}_{args.field}"
    keyword_dir = args.out / dir_name
    keyword_dir.mkdir(parents=True, exist_ok=True)

    total_new = total_seen = total_skipped = 0

    with graceful_sigint() as flag, RateLimitedClient() as client:
        for child_data in _iter_search(
            client, args.query, args.field, args.sort, args.time_window, args.cap, flag
        ):
            if flag["stopped"]:
                print("\ninterrupted — partial results saved, re-run to resume")
                break

            total_seen += 1
            post_id = child_data["id"]
            sub = (child_data.get("subreddit") or "unknown").lower()
            target = keyword_dir / sub / f"{post_id}.json"

            if target.exists():
                total_skipped += 1
                continue

            record: dict[str, Any] = {
                "post": {f: child_data.get(f) for f in _POST_FIELDS} | {"fetched_at": _iso_utc()},
                "comments": [],
            }
            if not args.skip_comments:
                try:
                    comments = _fetch_comments(client, post_id, args.max_depth)
                except Exception as exc:
                    print(f"  warn: comments failed for {post_id}: {exc!r}", flush=True)
                    comments = []
                if comments is not None:
                    record["comments"] = comments

            _atomic_write(target, record)
            total_new += 1
            title_preview = (child_data.get("title") or "")[:70]
            nc = len(record["comments"])
            print(f"  [{sub:20s}] {nc:4d} comments  {title_preview}", flush=True)

    print(
        f"\nseen={total_seen}  new={total_new}  skipped={total_skipped}"
        f"\nfield={args.field}  q={_build_q(args.query, args.field)}"
        f"\noutput → {keyword_dir}/"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
