"""Metadata-only flair distribution scan over a time window.

Pages /r/{sub}/new.json backward in time, collecting (id, created_utc,
link_flair_text) only — no bodies, no comments. When /new pagination
dries up (Reddit caps at ~1000 results), supplements with per-flair
search.json queries to reach the requested cutoff.

Output: parquet of (post_id, created_utc, flair) at data/flair_scan_{sub}.parquet.
Also prints a per-flair frequency table.

Usage:
    python scripts/scan_flair_distribution.py --sub Wattpad --years 2
    python scripts/scan_flair_distribution.py --sub Wattpad --cutoff 2024-05-16
"""
from __future__ import annotations

import argparse
import sys
from datetime import datetime, timezone, timedelta
from pathlib import Path
from typing import Any, Iterator

import pandas as pd

REPO_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO_ROOT))
sys.path.insert(0, str(REPO_ROOT / "src"))

from reddit_http import RateLimitedClient, graceful_sigint  # noqa: E402

NEW_URL_TMPL = "https://www.reddit.com/r/{sub}/new.json"
TOP_URL_TMPL = "https://www.reddit.com/r/{sub}/top.json"
SEARCH_URL_TMPL = "https://www.reddit.com/r/{sub}/search.json"
PAGE_LIMIT = 100

# Discovery uses /new + /top/{all,year,month} to assemble the known flair vocab
# before we walk each flair via search to backfill below /new's pagination cap.
DISCOVERY_SORTS = (
    (NEW_URL_TMPL, {}),
    (TOP_URL_TMPL, {"t": "all"}),
    (TOP_URL_TMPL, {"t": "year"}),
    (TOP_URL_TMPL, {"t": "month"}),
)
DISCOVERY_PAGES = 10  # up to 1000 per sort


def iter_listing(
    client: RateLimitedClient,
    url: str,
    base_params: dict[str, Any],
    cutoff_utc: float,
    stop_flag: dict[str, bool],
    max_pages: int = 50,
) -> Iterator[dict[str, Any]]:
    """Yield post 'data' dicts from a Reddit listing endpoint, stopping at cutoff."""
    after: str | None = None
    pages = 0
    while pages < max_pages and not stop_flag["stopped"]:
        params = {"limit": PAGE_LIMIT, **base_params}
        if after:
            params["after"] = after
        body = client.get_json(url, params=params)
        if not body:
            return
        data = body.get("data") or {}
        children = data.get("children") or []
        if not children:
            return
        all_too_old = True
        for child in children:
            p = child.get("data") or {}
            ts = p.get("created_utc") or 0
            if ts >= cutoff_utc:
                all_too_old = False
                yield p
        # If every post on this page is older than the cutoff, stop.
        if all_too_old:
            return
        after = data.get("after")
        if not after:
            return
        pages += 1


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--sub", default="Wattpad")
    parser.add_argument("--years", type=float, default=2.0,
                        help="Time window in years from now (used unless --cutoff is set)")
    parser.add_argument("--cutoff", default=None,
                        help="Absolute cutoff date YYYY-MM-DD (overrides --years)")
    parser.add_argument("--out", type=Path, default=None,
                        help="Output parquet path (default: data/flair_scan_{sub}.parquet)")
    args = parser.parse_args(argv)

    if args.cutoff:
        cutoff_dt = datetime.strptime(args.cutoff, "%Y-%m-%d").replace(tzinfo=timezone.utc)
    else:
        cutoff_dt = datetime.now(timezone.utc) - timedelta(days=int(args.years * 365.25))
    cutoff_utc = cutoff_dt.timestamp()
    print(f"window: posts created_utc >= {cutoff_dt.isoformat()}  (epoch {int(cutoff_utc)})")

    out_path = args.out or REPO_ROOT / "data" / f"flair_scan_{args.sub.lower()}.parquet"
    out_path.parent.mkdir(parents=True, exist_ok=True)

    seen: dict[str, dict[str, Any]] = {}

    def record(p: dict[str, Any]) -> None:
        pid = p.get("id")
        if not pid or pid in seen:
            return
        seen[pid] = {
            "post_id":     pid,
            "created_utc": int(p.get("created_utc") or 0),
            "flair":       p.get("link_flair_text") or "",
        }

    with graceful_sigint() as flag, RateLimitedClient() as client:
        # Phase 1: /new + /top/{all,year,month} for broad recent + viral coverage
        for url, base in DISCOVERY_SORTS:
            label = url.split("/")[-1].replace(".json", "") + (f"/{base['t']}" if base.get("t") else "")
            before = len(seen)
            try:
                for p in iter_listing(client, url.format(sub=args.sub), base,
                                      cutoff_utc, flag, max_pages=DISCOVERY_PAGES):
                    record(p)
            except Exception as exc:
                print(f"  {label}: error after {len(seen)-before} new posts: {exc!r}", flush=True)
                continue
            print(f"  {label}: +{len(seen)-before} new (total seen={len(seen)})", flush=True)
            if flag["stopped"]:
                break

        if not flag["stopped"]:
            # Phase 2: enumerate flair vocabulary observed so far, then walk each
            # flair via search.json — the only way to reach posts older than /new
            # pagination depth.
            flair_vocab = {row["flair"] for row in seen.values() if row["flair"]}
            print(f"\nphase 2: search-by-flair backfill for {len(flair_vocab)} flairs")
            for flair in sorted(flair_vocab):
                if flag["stopped"]:
                    break
                before = len(seen)
                params = {"q": f'flair:"{flair}"', "restrict_sr": "on", "sort": "new"}
                try:
                    for p in iter_listing(
                        client, SEARCH_URL_TMPL.format(sub=args.sub),
                        params, cutoff_utc, flag, max_pages=20,
                    ):
                        # Reddit's flair-search query is word-based, so it may
                        # return posts whose actual flair differs. Filter strictly.
                        if (p.get("link_flair_text") or "") == flair:
                            record(p)
                except Exception as exc:
                    print(f"  flair {flair!r}: error after {len(seen)-before} new: {exc!r}", flush=True)
                    continue
                print(f"  flair {flair!r}: +{len(seen)-before} new (total seen={len(seen)})", flush=True)

    if not seen:
        print("no posts captured", file=sys.stderr)
        return 1

    df = pd.DataFrame(seen.values()).sort_values("created_utc", ascending=False)
    df.to_parquet(out_path, index=False)
    print(f"\nwrote {out_path}  rows={len(df)}")

    # Summary
    in_window = df[df["created_utc"] >= cutoff_utc]
    print(f"\nposts in window: {len(in_window)} (of {len(df)} total captured)")
    print(f"date range: {datetime.fromtimestamp(in_window['created_utc'].min(), tz=timezone.utc).date()}"
          f" → {datetime.fromtimestamp(in_window['created_utc'].max(), tz=timezone.utc).date()}")
    print("\nflair frequency:")
    counts = in_window["flair"].replace("", "<none>").value_counts()
    for flair, n in counts.items():
        print(f"  {n:5d}  {flair}")

    return 0


if __name__ == "__main__":
    sys.exit(main())
