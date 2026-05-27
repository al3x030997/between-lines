"""Package 01 — Subreddit Discovery.

Reads config/keywords.yaml, queries Reddit's subreddit search + per-sub about
endpoints, scores candidates by keyword overlap, and writes data/subreddits.csv.

Spec: tools/reddit_research/docs/packages/01-discovery.md
"""

from __future__ import annotations

import argparse
import csv
import os
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import yaml

from .reddit_http import RateLimitedClient

SEARCH_URL = "https://www.reddit.com/subreddits/search.json"
ABOUT_URL_TMPL = "https://www.reddit.com/r/{name}/about.json"
SEARCH_LIMIT = 25

REPO_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_CONFIG = REPO_ROOT / "config" / "keywords.yaml"
DEFAULT_OUT = REPO_ROOT / "data" / "subreddits.csv"

CSV_COLUMNS = [
    "name",
    "subscribers",
    "active_users",
    "description",
    "match_keywords",
    "relevance_score",
    "discovered_at",
]


def load_config(path: Path) -> dict[str, Any]:
    with path.open("r", encoding="utf-8") as f:
        cfg = yaml.safe_load(f) or {}

    raw_keywords = cfg.get("keywords")
    if not raw_keywords or not isinstance(raw_keywords, list):
        raise ValueError(f"{path}: 'keywords' must be a non-empty list")

    keywords: list[dict[str, Any]] = []
    for entry in raw_keywords:
        if isinstance(entry, str):
            keywords.append({"text": entry, "weight": 1.0})
        elif isinstance(entry, dict) and "text" in entry:
            keywords.append(
                {"text": str(entry["text"]), "weight": float(entry.get("weight", 1.0))}
            )
        else:
            raise ValueError(f"Invalid keyword entry in {path}: {entry!r}")

    seeds = [str(s) for s in (cfg.get("seed_subreddits") or [])]
    max_results = int(cfg.get("max_results", 50))
    return {"keywords": keywords, "seeds": seeds, "max_results": max_results}


def _normalize_candidate(raw: dict[str, Any]) -> dict[str, Any] | None:
    name = raw.get("display_name") or raw.get("name")
    if not name:
        return None
    return {
        "name": str(name),
        "subscribers": int(raw.get("subscribers") or 0),
        "active_users": raw.get("accounts_active"),
        "description": (raw.get("public_description") or raw.get("description") or "").strip(),
        "title": (raw.get("title") or "").strip(),
        "over_18": bool(raw.get("over_18")),
        "is_seed": False,
        "match_keywords": [],
    }


def search_keyword(client: RateLimitedClient, text: str) -> list[dict[str, Any]]:
    data = client.get_json(SEARCH_URL, params={"q": text, "limit": SEARCH_LIMIT})
    if not data:
        return []
    children = (data.get("data") or {}).get("children") or []
    out: list[dict[str, Any]] = []
    for child in children:
        cand = _normalize_candidate(child.get("data") or {})
        if cand is not None:
            cand["match_keywords"] = [text]
            out.append(cand)
    return out


def fetch_seed(client: RateLimitedClient, name: str) -> dict[str, Any] | None:
    data = client.get_json(ABOUT_URL_TMPL.format(name=name))
    if not data:
        return None
    cand = _normalize_candidate(data.get("data") or {})
    if cand is None:
        return None
    cand["is_seed"] = True
    cand["match_keywords"] = ["__seed__"]
    return cand


def dedupe(candidates: list[dict[str, Any]]) -> dict[str, dict[str, Any]]:
    merged: dict[str, dict[str, Any]] = {}
    for cand in candidates:
        key = cand["name"].lower()
        if key not in merged:
            merged[key] = cand
            continue
        existing = merged[key]
        for kw in cand["match_keywords"]:
            if kw not in existing["match_keywords"]:
                existing["match_keywords"].append(kw)
        existing["is_seed"] = existing["is_seed"] or cand["is_seed"]
    return merged


def filter_candidates(merged: dict[str, dict[str, Any]]) -> list[dict[str, Any]]:
    return [cand for cand in merged.values() if not cand["over_18"]]


def score(cand: dict[str, Any], keywords: list[dict[str, Any]]) -> float:
    haystack = f"{cand['name']} {cand['title']} {cand['description']}".lower()
    total_weight = sum(kw["weight"] for kw in keywords)
    if total_weight <= 0:
        return 0.0
    matched = sum(kw["weight"] for kw in keywords if kw["text"].lower() in haystack)
    base = matched / total_weight
    if cand["is_seed"]:
        return max(base, 1.0)
    return base


def write_csv(rows: list[dict[str, Any]], out: Path, discovered_at: str) -> None:
    out.parent.mkdir(parents=True, exist_ok=True)
    tmp = out.with_suffix(out.suffix + ".tmp")
    with tmp.open("w", encoding="utf-8", newline="") as f:
        writer = csv.writer(f, quoting=csv.QUOTE_MINIMAL)
        writer.writerow(CSV_COLUMNS)
        for r in rows:
            writer.writerow(
                [
                    r["name"],
                    r["subscribers"],
                    "" if r["active_users"] is None else int(r["active_users"]),
                    r["description"],
                    ",".join(r["match_keywords"]),
                    f"{r['relevance_score']:.4f}",
                    discovered_at,
                ]
            )
    os.replace(tmp, out)


def run(config_path: Path, out_path: Path) -> None:
    cfg = load_config(config_path)
    discovered_at = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

    candidates: list[dict[str, Any]] = []
    with RateLimitedClient() as client:
        for kw in cfg["keywords"]:
            print(f"  search {kw['text']!r}", flush=True)
            candidates.extend(search_keyword(client, kw["text"]))
        for seed in cfg["seeds"]:
            print(f"  seed r/{seed}", flush=True)
            cand = fetch_seed(client, seed)
            if cand is not None:
                candidates.append(cand)
            else:
                print(f"    (skipped: {seed} returned 403/404)", flush=True)

    merged = dedupe(candidates)
    kept = filter_candidates(merged)
    for cand in kept:
        cand["relevance_score"] = score(cand, cfg["keywords"])

    kept.sort(
        key=lambda c: (-c["relevance_score"], -c["subscribers"], c["name"].lower())
    )
    for cand in kept:
        cand["match_keywords"].sort()
    top = kept[: cfg["max_results"]]
    write_csv(top, out_path, discovered_at)
    print(f"wrote {len(top)} rows to {out_path}")


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Discover subreddits for a keyword list.")
    parser.add_argument("--config", type=Path, default=DEFAULT_CONFIG)
    parser.add_argument("--out", type=Path, default=DEFAULT_OUT)
    args = parser.parse_args(argv)
    run(args.config, args.out)
    return 0


if __name__ == "__main__":
    sys.exit(main())
