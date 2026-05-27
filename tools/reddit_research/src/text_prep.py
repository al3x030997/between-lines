"""Flatten data/raw/{sub}/{post_id}.json into data/corpus.parquet.

Language detection: langdetect==1.0.9 (pure-Python, seeded for determinism).
"""
from __future__ import annotations

import json
import logging
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Iterator

import pyarrow as pa
import pyarrow.parquet as pq
from langdetect import DetectorFactory, LangDetectException, detect

DetectorFactory.seed = 0

log = logging.getLogger(__name__)

SCHEMA = pa.schema([
    ("doc_id",        pa.string()),
    ("subreddit",     pa.string()),
    ("kind",          pa.string()),
    ("parent_id",     pa.string()),
    ("author",        pa.string()),
    ("created_utc",   pa.int64()),
    ("score",         pa.int64()),
    ("title",         pa.string()),
    ("body",          pa.string()),
    ("body_clean",    pa.string()),
    ("url",           pa.string()),
    ("lang",          pa.string()),
    ("link_flair_text", pa.string()),  # post flair (e.g. "General Help"); "" for comments / unflaired
    ("search_field",  pa.string()),  # "title" | "selftext" | ""
])

# Fenced code blocks (``` or ~~~) — emphasis stripping is skipped inside these
_FENCE_RE = re.compile(r"(`{3,}.*?`{3,}|~{3,}.*?~{3,})", re.DOTALL)

_MD_LINK_RE = re.compile(r"\[([^\]]*)\]\([^)]*\)")
_URL_RE = re.compile(r"https?://\S+")
_BOLD_RE = re.compile(r"\*\*(.+?)\*\*", re.DOTALL)
_ITALIC_STAR_RE = re.compile(r"\*(.+?)\*", re.DOTALL)
_STRIKE_RE = re.compile(r"~~(.+?)~~", re.DOTALL)
# Guard with word-boundary lookbehind/lookahead so snake_case survives
_ITALIC_UNDER_RE = re.compile(r"(?<!\w)_(.+?)_(?!\w)", re.DOTALL)
_WS_RE = re.compile(r"\s+")


def _clean_prose(text: str) -> str:
    lines = [l for l in text.split("\n") if not l.lstrip().startswith(">")]
    text = "\n".join(lines)
    text = _MD_LINK_RE.sub(r"\1", text)
    text = _URL_RE.sub("", text)
    text = _BOLD_RE.sub(r"\1", text)
    text = _ITALIC_STAR_RE.sub(r"\1", text)
    text = _STRIKE_RE.sub(r"\1", text)
    text = _ITALIC_UNDER_RE.sub(r"\1", text)
    return text


def clean_body(text: str) -> str:
    """Return body_clean: Markdown noise removed, whitespace collapsed."""
    if not text:
        return ""
    parts = _FENCE_RE.split(text)
    cleaned = [part if i % 2 == 1 else _clean_prose(part) for i, part in enumerate(parts)]
    return _WS_RE.sub(" ", "".join(cleaned)).strip()


def detect_lang(body_clean: str) -> str:
    """Return ISO 639-1 code, or 'und' for short/undetectable text."""
    if len(body_clean) < 20:
        return "und"
    try:
        return detect(body_clean)
    except LangDetectException:
        return "und"


def _to_int(value) -> int:
    return int(value) if value is not None else 0


def should_keep(kind: str, author: str, body: str, body_clean: str, title: str) -> bool:
    if author == "[deleted]":
        return False
    if body in ("[deleted]", "[removed]"):
        if kind == "comment" or not title.strip():
            return False
    if not body_clean and not title.strip():
        return False
    return True


def build_post_row(post: dict, search_field: str = "") -> dict | None:
    author = post.get("author", "[deleted]")
    selftext = post.get("selftext") or ""
    title = post.get("title") or ""
    body_clean = clean_body(selftext)
    if not should_keep("post", author, selftext, body_clean, title):
        return None
    lang_input = body_clean if len(body_clean) >= 20 else clean_body(title)
    return {
        "doc_id":        "t3_" + post["id"],
        "subreddit":     post.get("subreddit") or "",
        "kind":          "post",
        "parent_id":     "",
        "author":        author,
        "created_utc":   _to_int(post.get("created_utc")),
        "score":         int(post.get("score", 0)),
        "title":         title,
        "body":          selftext,
        "body_clean":    body_clean,
        "url":           post.get("url") or "",
        "lang":          detect_lang(lang_input),
        "link_flair_text": post.get("link_flair_text") or "",
        "search_field":  search_field,
    }


def build_comment_row(comment: dict, search_field: str = "") -> dict | None:
    author = comment.get("author", "[deleted]")
    body = comment.get("body") or ""
    body_clean = clean_body(body)
    if not should_keep("comment", author, body, body_clean, ""):
        return None
    return {
        "doc_id":        "t1_" + comment["id"],
        "subreddit":     "",  # filled by process_subreddit
        "kind":          "comment",
        "parent_id":     comment.get("parent_id", ""),
        "author":        author,
        "created_utc":   _to_int(comment.get("created_utc")),
        "score":         int(comment.get("score", 0)),
        "title":         "",
        "body":          body,
        "body_clean":    body_clean,
        "url":           "",
        "lang":          detect_lang(body_clean),
        "link_flair_text": "",
        "search_field":  search_field,
    }


def iter_subreddit_groups(raw_dir: Path) -> Iterator[tuple[str, list[Path]]]:
    """Yield (dir_name, sorted json paths) for each sub-directory, in sorted order."""
    for sub_dir in sorted(p for p in raw_dir.iterdir() if p.is_dir()):
        files = sorted(sub_dir.glob("*.json"))
        if files:
            yield sub_dir.name, files


def process_subreddit(sub_folder: str, files: list[Path], search_field: str = "") -> list[dict]:
    """Build, sort, and deduplicate corpus rows for one subreddit."""
    rows: list[dict] = []

    for path in files:
        try:
            with path.open("r", encoding="utf-8") as f:
                payload = json.load(f)
        except (OSError, json.JSONDecodeError) as exc:
            log.warning("skip %s: %s", path, exc)
            continue

        post = payload.get("post", {})
        sub = post.get("subreddit") or sub_folder

        post_row = build_post_row(post, search_field)
        if post_row is not None:
            if not post_row["subreddit"]:
                post_row["subreddit"] = sub_folder
            rows.append(post_row)

        for comment in payload.get("comments", []):
            row = build_comment_row(comment, search_field)
            if row is not None:
                row["subreddit"] = sub
                rows.append(row)

    # Sort earliest-first so dedup keeps the earliest duplicate
    rows.sort(key=lambda r: (r["created_utc"], r["doc_id"]))

    # Deduplicate comments within this sub by body_clean
    seen: set[str] = set()
    deduped: list[dict] = []
    for row in rows:
        if row["kind"] == "comment" and row["body_clean"]:
            if row["body_clean"] in seen:
                continue
            seen.add(row["body_clean"])
        deduped.append(row)

    return deduped


@dataclass
class CorpusStats:
    posts: int = 0
    comments: int = 0

    @property
    def total_rows(self) -> int:
        return self.posts + self.comments


def build_corpus(raw_dir: Path, out_path: Path, search_field: str = "") -> CorpusStats:
    """Walk raw_dir and write corpus.parquet. Overwrites any existing file."""
    stats = CorpusStats()
    out_path.parent.mkdir(parents=True, exist_ok=True)

    with pq.ParquetWriter(str(out_path), schema=SCHEMA, compression="zstd") as writer:
        for sub_folder, files in iter_subreddit_groups(raw_dir):
            rows = process_subreddit(sub_folder, files, search_field)
            if not rows:
                continue
            table = pa.table(
                {col: [r[col] for r in rows] for col in SCHEMA.names},
                schema=SCHEMA,
            )
            writer.write_table(table)
            for r in rows:
                if r["kind"] == "post":
                    stats.posts += 1
                else:
                    stats.comments += 1

    log.info("corpus: %d posts  %d comments → %s", stats.posts, stats.comments, out_path)
    return stats
