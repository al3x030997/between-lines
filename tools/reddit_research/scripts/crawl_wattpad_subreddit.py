"""Crawl r/Wattpad (or any subreddit) with two passes: top/all then new/all.

Reuses crawl_subreddit() from src/crawl.py so both passes share one
rate-limited client. Pass 2 auto-dedupes against pass 1 via existing_ids on
disk (built into crawl_subreddit).

Output: data/raw_subreddit/wattpad/{post_id}.json

Usage:
    python scripts/crawl_wattpad_subreddit.py [--sub Wattpad] [--top-cap 1000] [--new-cap 500]
"""
from __future__ import annotations

import argparse
import sys
import time
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO_ROOT))        # for src.crawl (package import)
sys.path.insert(0, str(REPO_ROOT / "src")) # for reddit_http (flat import)

from src.crawl import crawl_subreddit          # noqa: E402
from reddit_http import RateLimitedClient, graceful_sigint  # noqa: E402

DEFAULT_OUT = REPO_ROOT / "data" / "raw_subreddit"


def _log_event(log_f, event: dict) -> None:
    log_f.write(f"{event['ts']}\t{event['url']}\t{event['status']}\t{event['retries']}\n")
    log_f.flush()


def parse_args(argv=None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--sub", default="Wattpad", help="Subreddit name (default: Wattpad)")
    parser.add_argument("--out-dir", type=Path, default=DEFAULT_OUT)
    parser.add_argument("--top-cap", type=int, default=1000, help="Max posts for top/all pass")
    parser.add_argument("--new-cap", type=int, default=500, help="Max posts for new/all pass")
    parser.add_argument("--max-depth", type=int, default=10)
    parser.add_argument("--skip-comments", action="store_true")
    return parser.parse_args(argv)


def main(argv=None) -> int:
    args = parse_args(argv)
    out_dir: Path = args.out_dir
    out_dir.mkdir(parents=True, exist_ok=True)
    log_path = out_dir / "_run.log"

    started = time.monotonic()
    new1 = new2 = filled1 = filled2 = 0

    with log_path.open("a", encoding="utf-8") as log_f, \
            graceful_sigint() as flag, \
            RateLimitedClient(on_event=lambda e: _log_event(log_f, e)) as client:

        print(f"Pass 1: top/all  cap={args.top_cap}  r/{args.sub}", flush=True)
        try:
            new1, filled1 = crawl_subreddit(
                client, args.sub, out_dir,
                sort="top", time_window="all",
                cap=args.top_cap, max_depth=args.max_depth,
                skip_comments=args.skip_comments,
                stop_flag=flag,
            )
        except Exception as exc:
            print(f"  pass 1 stopped early: {exc!r}", flush=True)
        print(f"  posts_new={new1}  comments_filled={filled1}", flush=True)

        if not flag["stopped"]:
            print(f"Pass 2: new/all  cap={args.new_cap}  r/{args.sub}", flush=True)
            try:
                new2, filled2 = crawl_subreddit(
                    client, args.sub, out_dir,
                    sort="new", time_window="all",
                    cap=args.new_cap, max_depth=args.max_depth,
                    skip_comments=args.skip_comments,
                    stop_flag=flag,
                )
            except Exception as exc:
                print(f"  pass 2 stopped early: {exc!r}", flush=True)
            print(f"  posts_new={new2}  comments_filled={filled2}", flush=True)
        else:
            print("interrupted after pass 1", flush=True)

    elapsed = int(time.monotonic() - started)
    mm, ss = divmod(elapsed, 60)
    print(f"\ntotal posts_new={new1 + new2}  elapsed={mm:02d}:{ss:02d}")
    print(f"output → {out_dir / args.sub.lower()}/")
    return 0


if __name__ == "__main__":
    sys.exit(main())
