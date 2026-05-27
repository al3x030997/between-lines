"""Crawl r/Wattpad posts grouped by link flair, skipping meme-like flairs.

Uses Reddit's public search endpoint with `q=flair:"<text>"&restrict_sr=on`
to walk every post bearing a given flair, then fetches the full comment tree
for each via /comments/{id}.json. Output files match the contract used by
src.crawl: data/raw_subreddit/wattpad/{post_id}.json with shape
    { "post": {...with link_flair_text}, "comments": [...] }

Idempotent: skips posts already on disk; backfills missing comments.

Usage:
    python scripts/crawl_wattpad_by_flair.py
    python scripts/crawl_wattpad_by_flair.py --include "General Help" --include "Looking For: Feedback"
    python scripts/crawl_wattpad_by_flair.py --discover-only        # just print flair list
"""
from __future__ import annotations

import argparse
import json
import sys
import time
from pathlib import Path
from typing import Any, Iterable, Iterator

REPO_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO_ROOT))
sys.path.insert(0, str(REPO_ROOT / "src"))

from src.crawl import (  # noqa: E402
    atomic_write_json,
    fetch_comments,
    iso_utc,
    log_event,
    post_record,
)
from reddit_http import RateLimitedClient, graceful_sigint  # noqa: E402

SEARCH_URL_TMPL = "https://www.reddit.com/r/{sub}/search.json"
LISTING_URL_TMPL = "https://www.reddit.com/r/{sub}/{sort}.json"
PAGE_LIMIT = 100

DEFAULT_SUB = "Wattpad"
DEFAULT_OUT = REPO_ROOT / "data" / "raw_subreddit"
# Skip meme-like flairs AND genre flairs (content tags, not platform discussion).
# Platform-analysis-relevant flairs survive: General Help, Help, Looking For: *,
# Milestone, Off-Topic, Other, Services, Announcement, Media.
DEFAULT_SKIP = (
    # meme-like
    "Meme", "Image/Video", "Humor",
    # genres (story-content tags)
    "Romance", "Fantasy", "Fantasy / Paranormal", "Fan Fiction", "Fiction",
    "Non-Fiction", "Horror", "Science Fiction", "Werewolf / Vampires",
    "Mystery / Thriller", "Other Genre", "Short Story / Poetry", "Excerpt",
    "Action / Adventure", "Drama", "ChickLit", "LGBT+",
    # search/discovery-only — not platform discussion
    "Looking For: Lost Books",
)
DISCOVERY_SORTS = (("new", None), ("top", "all"), ("top", "year"))
DISCOVERY_PAGES = 5  # 500 posts per sort


def discover_flairs(client: RateLimitedClient, sub: str) -> dict[str, int]:
    """Page /new and /top/{all,year} until exhausted; tally distinct flairs."""
    counts: dict[str, int] = {}
    seen: set[str] = set()
    for sort, t in DISCOVERY_SORTS:
        after: str | None = None
        for _ in range(DISCOVERY_PAGES):
            params: dict[str, Any] = {"limit": PAGE_LIMIT}
            if after:
                params["after"] = after
            if t:
                params["t"] = t
            body = client.get_json(LISTING_URL_TMPL.format(sub=sub, sort=sort), params=params)
            if not body:
                break
            data = body.get("data") or {}
            children = data.get("children") or []
            if not children:
                break
            for child in children:
                p = child.get("data") or {}
                pid = p.get("id")
                if not pid or pid in seen:
                    continue
                seen.add(pid)
                flair = p.get("link_flair_text") or "<none>"
                counts[flair] = counts.get(flair, 0) + 1
            after = data.get("after")
            if not after:
                break
    return counts


def iter_search_by_flair(
    client: RateLimitedClient,
    sub: str,
    flair: str,
    cap: int,
    stop_flag: dict[str, bool],
) -> Iterator[dict[str, Any]]:
    """Yield post 'data' dicts from r/{sub}/search.json?q=flair:"<flair>"."""
    after: str | None = None
    yielded = 0
    while yielded < cap and not stop_flag["stopped"]:
        params: dict[str, Any] = {
            "q": f'flair:"{flair}"',
            "restrict_sr": "on",
            "sort": "new",
            "limit": PAGE_LIMIT,
        }
        if after:
            params["after"] = after
        body = client.get_json(SEARCH_URL_TMPL.format(sub=sub), params=params)
        if not body:
            return
        data = body.get("data") or {}
        children = data.get("children") or []
        if not children:
            return
        for child in children:
            p = child.get("data") or {}
            if not p.get("id"):
                continue
            yield p
            yielded += 1
            if yielded >= cap or stop_flag["stopped"]:
                return
        after = data.get("after")
        if not after:
            return


def crawl_flair(
    client: RateLimitedClient,
    sub: str,
    flair: str,
    out_dir: Path,
    cap: int,
    max_depth: int,
    stop_flag: dict[str, bool],
) -> tuple[int, int]:
    """Returns (posts_new, comments_filled)."""
    sub_dir = out_dir / sub.lower()
    sub_dir.mkdir(parents=True, exist_ok=True)
    existing_ids = {p.stem for p in sub_dir.glob("*.json")}

    posts_new = 0
    comments_filled = 0

    for post_data in iter_search_by_flair(client, sub, flair, cap, stop_flag):
        if stop_flag["stopped"]:
            break
        post_id = post_data["id"]
        target = sub_dir / f"{post_id}.json"

        if post_id in existing_ids:
            try:
                with target.open("r", encoding="utf-8") as f:
                    existing = json.load(f)
            except (OSError, json.JSONDecodeError):
                existing = None
            has_comments = bool(existing and existing.get("comments"))
            if has_comments:
                continue
            comments = fetch_comments(client, post_id, max_depth)
            if comments is None:
                continue
            existing["comments"] = comments
            atomic_write_json(target, existing)
            comments_filled += 1
            continue

        record = {
            "post": post_record(post_data, fetched_at=iso_utc()),
            "comments": [],
        }
        comments = fetch_comments(client, post_id, max_depth)
        if comments is not None:
            record["comments"] = comments
        atomic_write_json(target, record)
        existing_ids.add(post_id)
        posts_new += 1

    return posts_new, comments_filled


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--sub", default=DEFAULT_SUB)
    p.add_argument("--out-dir", type=Path, default=DEFAULT_OUT)
    p.add_argument("--include", action="append", default=None,
                   metavar="FLAIR", help="Only crawl these flairs (repeatable). Skips discovery.")
    p.add_argument("--skip", action="append", default=list(DEFAULT_SKIP),
                   metavar="FLAIR", help=f"Flairs to skip (repeatable). Default: {list(DEFAULT_SKIP)}")
    p.add_argument("--cap-per-flair", type=int, default=1000,
                   help="Max posts per flair (Reddit search caps at ~1000 anyway)")
    p.add_argument("--max-depth", type=int, default=10)
    p.add_argument("--discover-only", action="store_true",
                   help="Print the flair vocabulary and exit")
    return p.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv)
    out_dir: Path = args.out_dir
    out_dir.mkdir(parents=True, exist_ok=True)
    log_path = out_dir / "_run.log"

    with log_path.open("a", encoding="utf-8") as log_f, \
            graceful_sigint() as flag, \
            RateLimitedClient(on_event=lambda e: log_event(log_f, e)) as client:

        if args.include:
            flairs: list[str] = list(args.include)
            print(f"flairs (user-specified): {flairs}", flush=True)
        else:
            print(f"discovering flairs on r/{args.sub} ...", flush=True)
            counts = discover_flairs(client, args.sub)
            skip_set = {s.lower() for s in args.skip}
            keep: list[tuple[str, int]] = []
            skipped: list[tuple[str, int]] = []
            for flair, n in sorted(counts.items(), key=lambda kv: -kv[1]):
                if flair == "<none>":
                    skipped.append((flair, n))
                elif flair.lower() in skip_set:
                    skipped.append((flair, n))
                else:
                    keep.append((flair, n))
            print(f"discovered {len(counts)} flairs across {sum(counts.values())} posts")
            print(f"  skipping {len(skipped)}: " +
                  ", ".join(f"{f}({n})" for f, n in skipped))
            print(f"  crawling {len(keep)}:")
            for f, n in keep:
                print(f"    {n:4d}  {f}")
            flairs = [f for f, _ in keep]

        if args.discover_only:
            return 0

        started = time.monotonic()
        total_new = 0
        total_filled = 0

        for i, flair in enumerate(flairs, start=1):
            if flag["stopped"]:
                break
            print(f"\n[{i}/{len(flairs)}] flair={flair!r}", flush=True)
            try:
                new, filled = crawl_flair(
                    client, args.sub, flair, out_dir,
                    cap=args.cap_per_flair, max_depth=args.max_depth,
                    stop_flag=flag,
                )
            except Exception as exc:
                print(f"  error on flair {flair!r}: {exc!r}", flush=True)
                continue
            total_new += new
            total_filled += filled
            print(f"  posts_new={new}  comments_filled={filled}", flush=True)

        elapsed = int(time.monotonic() - started)
        mm, ss = divmod(elapsed, 60)
        print(
            f"\nflairs={len(flairs)} posts_new={total_new} "
            f"comments_filled={total_filled} elapsed={mm:02d}:{ss:02d}"
        )
    return 0


if __name__ == "__main__":
    sys.exit(main())
