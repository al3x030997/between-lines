"""Validate data/raw/{sub}/{post_id}.json files against the contract.

Walks data/raw/ and checks every JSON file matches the schema in
docs/REQUIREMENTS.md § Cross-package contracts.

Usage:
    python scripts/validate_raw.py [--raw-dir data/raw]
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
DEFAULT_RAW = REPO_ROOT / "data" / "raw"

POST_FIELDS = {
    "id": str,
    "subreddit": str,
    "title": str,
    "selftext": (str, type(None)),
    "author": str,
    "created_utc": (int, float),
    "score": int,
    "num_comments": int,
    "url": (str, type(None)),
    "permalink": str,
    "link_flair_text": (str, type(None)),
    "over_18": bool,
    "fetched_at": str,
}

COMMENT_FIELDS = {
    "id": str,
    "parent_id": str,
    "author": str,
    "body": str,
    "score": int,
    "created_utc": (int, float),
    "depth": int,
}


def check_field(obj: dict, key: str, expected, where: str, errors: list[str]) -> None:
    if key not in obj:
        errors.append(f"{where}: missing field {key!r}")
        return
    value = obj[key]
    if not isinstance(value, expected):
        errors.append(
            f"{where}: field {key!r} has type {type(value).__name__}, expected {expected}"
        )


def validate_file(path: Path, sub_folder: str, errors: list[str]) -> tuple[int, int]:
    where = str(path.relative_to(path.parent.parent.parent))
    try:
        with path.open("r", encoding="utf-8") as f:
            payload = json.load(f)
    except (OSError, json.JSONDecodeError) as exc:
        errors.append(f"{where}: cannot load JSON ({exc!r})")
        return 0, 0

    if not isinstance(payload, dict) or "post" not in payload or "comments" not in payload:
        errors.append(f"{where}: top-level must be {{post, comments}}")
        return 0, 0

    post = payload["post"]
    comments = payload["comments"]

    if not isinstance(post, dict):
        errors.append(f"{where}: 'post' must be an object")
    else:
        for key, expected in POST_FIELDS.items():
            check_field(post, key, expected, f"{where}:post", errors)
        if isinstance(post.get("subreddit"), str):
            if post["subreddit"].lower() != sub_folder:
                errors.append(
                    f"{where}: post.subreddit={post['subreddit']!r} "
                    f"does not match folder {sub_folder!r}"
                )
        if isinstance(post.get("id"), str):
            if post["id"] != path.stem:
                errors.append(
                    f"{where}: post.id={post['id']!r} does not match filename {path.stem!r}"
                )

    if not isinstance(comments, list):
        errors.append(f"{where}: 'comments' must be a list")
        comments = []

    for i, c in enumerate(comments):
        if not isinstance(c, dict):
            errors.append(f"{where}:comments[{i}] not an object")
            continue
        for key, expected in COMMENT_FIELDS.items():
            check_field(c, key, expected, f"{where}:comments[{i}]", errors)

    return 1, len(comments)


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--raw-dir", type=Path, default=DEFAULT_RAW)
    args = parser.parse_args(argv)

    if not args.raw_dir.exists():
        print(f"no such dir: {args.raw_dir}", file=sys.stderr)
        return 2

    errors: list[str] = []
    files = 0
    posts_with_comments = 0
    posts_with_flair = 0
    total_comments = 0
    subs_seen: set[str] = set()

    for sub_dir in sorted(p for p in args.raw_dir.iterdir() if p.is_dir()):
        sub_folder = sub_dir.name
        subs_seen.add(sub_folder)
        for path in sorted(sub_dir.glob("*.json")):
            files += 1
            _, n_comments = validate_file(path, sub_folder, errors)
            total_comments += n_comments
            if n_comments > 0:
                posts_with_comments += 1
            # Cheap re-open avoided; re-read minimal fields:
            try:
                with path.open("r", encoding="utf-8") as f:
                    payload = json.load(f)
                if (payload.get("post") or {}).get("link_flair_text"):
                    posts_with_flair += 1
            except (OSError, json.JSONDecodeError):
                pass

    print(f"files={files} subs={len(subs_seen)} total_comments={total_comments}")
    print(f"posts_with_comments={posts_with_comments} posts_with_flair={posts_with_flair}")

    if errors:
        print(f"\n{len(errors)} schema violation(s):", file=sys.stderr)
        for e in errors[:50]:
            print(f"  {e}", file=sys.stderr)
        if len(errors) > 50:
            print(f"  ... and {len(errors) - 50} more", file=sys.stderr)
        return 1

    print("OK")
    return 0


if __name__ == "__main__":
    sys.exit(main())
