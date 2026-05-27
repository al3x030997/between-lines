"""Package 02 — Crawl.

Reads data/subreddits.csv, fetches top posts + comment trees from each sub via
Reddit's public .json endpoints, and persists one JSON file per post under
data/raw/{sub}/{post_id}.json matching the contract in REQUIREMENTS.md.

Spec: tools/reddit_research/docs/packages/02-crawl.md
"""

from __future__ import annotations

import argparse
import csv
import json
import os
import sys
import time
from datetime import datetime, timezone
from io import TextIOBase
from pathlib import Path
from typing import Any, Iterator

from .reddit_http import RateLimitedClient, graceful_sigint

LISTING_URL_TMPL = "https://www.reddit.com/r/{sub}/{sort}.json"
COMMENTS_URL_TMPL = "https://www.reddit.com/comments/{post_id}.json"
LISTING_PAGE_LIMIT = 100
COMMENTS_LIMIT = 500

REPO_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_SUBS_CSV = REPO_ROOT / "data" / "subreddits.csv"
DEFAULT_OUT_DIR = REPO_ROOT / "data" / "raw"

POST_FIELDS_FROM_LISTING = (
    "id",
    "subreddit",
    "title",
    "selftext",
    "author",
    "created_utc",
    "score",
    "num_comments",
    "url",
    "permalink",
    "link_flair_text",
    "over_18",
)


def iso_utc() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def log_event(log_f: TextIOBase, event: dict[str, Any]) -> None:
    line = f"{event['ts']}\t{event['url']}\t{event['status']}\t{event['retries']}\n"
    log_f.write(line)
    log_f.flush()


def load_subreddits(path: Path, limit: int) -> list[str]:
    with path.open("r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        names = [row["name"].strip() for row in reader if row.get("name", "").strip()]
    if limit > 0:
        names = names[:limit]
    return names


def post_record(child_data: dict[str, Any], fetched_at: str) -> dict[str, Any]:
    out: dict[str, Any] = {}
    for field in POST_FIELDS_FROM_LISTING:
        out[field] = child_data.get(field)
    out["fetched_at"] = fetched_at
    return out


def flatten_comments(top_listing: dict[str, Any], max_depth: int) -> list[dict[str, Any]]:
    """Walk Reddit's nested comments tree and return the flat contract shape.

    `top_listing` is the second element of the /comments/{id}.json response,
    i.e. {"kind": "Listing", "data": {"children": [...]}}.
    """

    out: list[dict[str, Any]] = []
    children = ((top_listing or {}).get("data") or {}).get("children") or []
    for child in children:
        _walk_comment(child, depth=0, max_depth=max_depth, out=out)
    return out


def _walk_comment(
    node: dict[str, Any],
    depth: int,
    max_depth: int,
    out: list[dict[str, Any]],
) -> None:
    if node.get("kind") != "t1":
        return  # skip "more" continuation tokens
    data = node.get("data") or {}
    out.append(
        {
            "id": data.get("id"),
            "parent_id": data.get("parent_id"),
            "author": data.get("author"),
            "body": data.get("body"),
            "score": data.get("score"),
            "created_utc": data.get("created_utc"),
            "depth": depth,
        }
    )
    if depth >= max_depth:
        return
    replies = data.get("replies")
    if not isinstance(replies, dict):
        return  # Reddit returns "" when no replies
    reply_children = ((replies.get("data") or {}).get("children")) or []
    for reply in reply_children:
        _walk_comment(reply, depth + 1, max_depth, out)


def atomic_write_json(path: Path, payload: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    tmp = path.with_suffix(".json.tmp")
    with tmp.open("w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False)
    os.replace(tmp, path)


def fetch_comments(
    client: RateLimitedClient, post_id: str, max_depth: int
) -> list[dict[str, Any]] | None:
    body = client.get_json(
        COMMENTS_URL_TMPL.format(post_id=post_id),
        params={"limit": COMMENTS_LIMIT, "depth": max_depth},
    )
    if body is None:
        return None
    # Reddit returns [post_listing, comments_listing]
    if not isinstance(body, list) or len(body) < 2:
        return []
    return flatten_comments(body[1], max_depth)


def iter_listing_pages(
    client: RateLimitedClient,
    sub: str,
    sort: str,
    time_window: str,
    cap: int,
    stop_flag: dict[str, bool],
) -> Iterator[dict[str, Any]]:
    after: str | None = None
    yielded = 0
    while yielded < cap and not stop_flag["stopped"]:
        params: dict[str, Any] = {"limit": LISTING_PAGE_LIMIT}
        if after:
            params["after"] = after
        if sort == "top":
            params["t"] = time_window
        body = client.get_json(LISTING_URL_TMPL.format(sub=sub, sort=sort), params=params)
        if body is None:
            return  # 403/404 — private/banned/gone
        data = body.get("data") or {}
        children = data.get("children") or []
        if not children:
            return
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
            return


def crawl_subreddit(
    client: RateLimitedClient,
    sub: str,
    out_dir: Path,
    sort: str,
    time_window: str,
    cap: int,
    max_depth: int,
    skip_comments: bool,
    stop_flag: dict[str, bool],
) -> tuple[int, int]:
    """Returns (posts_new, comments_filled)."""

    sub_lower = sub.lower()
    sub_dir = out_dir / sub_lower
    sub_dir.mkdir(parents=True, exist_ok=True)
    existing_ids = {p.stem for p in sub_dir.glob("*.json")}

    posts_new = 0
    comments_filled = 0

    for child_data in iter_listing_pages(client, sub, sort, time_window, cap, stop_flag):
        if stop_flag["stopped"]:
            break
        post_id = child_data["id"]
        target = sub_dir / f"{post_id}.json"

        if post_id in existing_ids:
            # Check whether comments are already populated.
            try:
                with target.open("r", encoding="utf-8") as f:
                    existing = json.load(f)
            except (OSError, json.JSONDecodeError):
                existing = None
            has_comments = bool(existing and existing.get("comments"))
            if has_comments or skip_comments:
                continue
            comments = fetch_comments(client, post_id, max_depth)
            if comments is None:
                continue
            existing["comments"] = comments
            atomic_write_json(target, existing)
            comments_filled += 1
            continue

        # New post.
        record: dict[str, Any] = {
            "post": post_record(child_data, fetched_at=iso_utc()),
            "comments": [],
        }
        if not skip_comments:
            comments = fetch_comments(client, post_id, max_depth)
            if comments is not None:
                record["comments"] = comments
        atomic_write_json(target, record)
        existing_ids.add(post_id)
        posts_new += 1

    return posts_new, comments_filled


def parse_args(argv: list[str] | None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Crawl Reddit subs into data/raw/.")
    parser.add_argument("--subs-csv", type=Path, default=DEFAULT_SUBS_CSV)
    parser.add_argument("--out-dir", type=Path, default=DEFAULT_OUT_DIR)
    parser.add_argument("--sort", choices=("hot", "new", "top"), default="top")
    parser.add_argument(
        "--time",
        dest="time_window",
        choices=("hour", "day", "week", "month", "year", "all"),
        default="year",
    )
    parser.add_argument("--cap-per-sub", type=int, default=1000)
    parser.add_argument("--max-depth", type=int, default=10)
    parser.add_argument("--limit-subs", type=int, default=0)
    parser.add_argument("--skip-comments", action="store_true")
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv)
    out_dir: Path = args.out_dir
    out_dir.mkdir(parents=True, exist_ok=True)
    log_path = out_dir / "_run.log"

    subs = load_subreddits(args.subs_csv, args.limit_subs)
    if not subs:
        print(f"no subreddits in {args.subs_csv}", file=sys.stderr)
        return 1

    started = time.monotonic()
    total_new = 0
    total_filled = 0
    subs_done = 0

    with log_path.open("a", encoding="utf-8") as log_f, \
            graceful_sigint() as flag, \
            RateLimitedClient(on_event=lambda e: log_event(log_f, e)) as client:
        for sub in subs:
            if flag["stopped"]:
                break
            print(f"  r/{sub}", flush=True)
            try:
                new, filled = crawl_subreddit(
                    client,
                    sub,
                    out_dir,
                    sort=args.sort,
                    time_window=args.time_window,
                    cap=args.cap_per_sub,
                    max_depth=args.max_depth,
                    skip_comments=args.skip_comments,
                    stop_flag=flag,
                )
            except Exception as exc:  # one bad sub shouldn't kill an overnight run
                print(f"    error on r/{sub}: {exc!r}", flush=True)
                continue
            total_new += new
            total_filled += filled
            subs_done += 1
            print(f"    posts_new={new} comments_filled={filled}", flush=True)

    elapsed = int(time.monotonic() - started)
    mm, ss = divmod(elapsed, 60)
    print(
        f"subs={subs_done}/{len(subs)} posts_new={total_new} "
        f"comments_filled={total_filled} elapsed={mm:02d}:{ss:02d}"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
