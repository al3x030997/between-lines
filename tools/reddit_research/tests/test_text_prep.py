"""Tests for src/text_prep.py"""
from __future__ import annotations

import hashlib
import json
import shutil
import sys
from pathlib import Path

import pyarrow.parquet as pq
import pytest

SRC = Path(__file__).resolve().parent.parent / "src"
sys.path.insert(0, str(SRC))

from text_prep import (
    SCHEMA,
    CorpusStats,
    build_corpus,
    clean_body,
    detect_lang,
    process_subreddit,
    should_keep,
)

FIXTURES = Path(__file__).resolve().parent / "fixtures" / "raw"


# ── clean_body ───────────────────────────────────────────────────────────────

def test_clean_body_strips_bold():
    assert clean_body("hello **world**") == "hello world"

def test_clean_body_strips_italic_star():
    assert clean_body("hello *world*") == "hello world"

def test_clean_body_strips_italic_underscore():
    assert clean_body("hello _world_") == "hello world"

def test_clean_body_strips_strikethrough():
    assert clean_body("hello ~~world~~") == "hello world"

def test_clean_body_strips_blockquote():
    result = clean_body("before\n> quoted line\nafter")
    assert result == "before after"
    assert "quoted" not in result

def test_clean_body_replaces_md_link():
    assert clean_body("click [here](https://example.com) for info") == "click here for info"

def test_clean_body_strips_bare_url():
    result = clean_body("visit https://example.com for more")
    assert "https" not in result
    assert result == "visit for more"

def test_clean_body_collapses_whitespace():
    assert clean_body("a   b\n\nc") == "a b c"

def test_clean_body_preserves_code_block_content():
    result = clean_body("before\n```\nmy_var = **bold**\n```\nafter")
    assert "my_var" in result
    assert "**bold**" in result  # emphasis NOT stripped inside fenced block

def test_clean_body_preserves_underscore_in_identifier():
    # Underscore mid-word should survive (word-boundary guard on _ITALIC_UNDER_RE)
    assert "snake_case" in clean_body("use snake_case here")

def test_clean_body_empty_string():
    assert clean_body("") == ""

def test_clean_body_none():
    assert clean_body(None) == ""  # type: ignore[arg-type]

def test_clean_body_combined():
    raw = "**Important**: visit [this link](https://x.com) or https://y.com\n> quote\nEnd."
    result = clean_body(raw)
    assert "Important" in result
    assert "this link" in result
    assert "https" not in result
    assert "quote" not in result
    assert "End." in result


# ── detect_lang ──────────────────────────────────────────────────────────────

def test_detect_lang_short_text():
    assert detect_lang("hi") == "und"

def test_detect_lang_empty():
    assert detect_lang("") == "und"

def test_detect_lang_exactly_19_chars():
    assert detect_lang("a" * 19) == "und"

def test_detect_lang_english():
    long_en = "The quick brown fox jumps over the lazy dog and runs away quickly."
    assert detect_lang(long_en) == "en"


# ── should_keep ──────────────────────────────────────────────────────────────

def test_keep_normal_comment():
    assert should_keep("comment", "alice", "Hello there", "Hello there", "")

def test_drop_deleted_author():
    assert not should_keep("comment", "[deleted]", "Hello", "Hello", "")

def test_drop_removed_comment():
    assert not should_keep("comment", "alice", "[removed]", "", "")

def test_drop_deleted_body_comment():
    assert not should_keep("comment", "alice", "[deleted]", "", "")

def test_drop_removed_post_no_title():
    assert not should_keep("post", "alice", "[removed]", "", "")

def test_keep_removed_post_with_title():
    assert should_keep("post", "alice", "[removed]", "", "A real title")

def test_drop_empty_body_and_empty_title():
    assert not should_keep("post", "alice", "", "", "")

def test_keep_post_with_only_title():
    assert should_keep("post", "alice", "", "", "My title")


# ── dedup + sort (process_subreddit) ─────────────────────────────────────────

def test_dedup_drops_later_duplicate_comment():
    rows = process_subreddit("testsub1", sorted((FIXTURES / "testsub1").glob("*.json")))
    comment_bodies = [r["body_clean"] for r in rows if r["kind"] == "comment"]
    # Within the sub, each body_clean should appear at most once
    assert len(comment_bodies) == len(set(comment_bodies))

def test_dedup_keeps_earlier_comment():
    rows = process_subreddit("testsub1", sorted((FIXTURES / "testsub1").glob("*.json")))
    # cmt002 (created_utc=1700000200) should be kept, not cmt003 (1700001100)
    ids = {r["doc_id"] for r in rows}
    assert "t1_cmt002" in ids
    assert "t1_cmt003" not in ids

def test_cross_sub_duplicates_both_kept():
    sub1 = process_subreddit("testsub1", sorted((FIXTURES / "testsub1").glob("*.json")))
    sub2 = process_subreddit("testsub2", sorted((FIXTURES / "testsub2").glob("*.json")))
    sub1_bodies = {r["body_clean"] for r in sub1 if r["kind"] == "comment"}
    sub2_bodies = {r["body_clean"] for r in sub2 if r["kind"] == "comment"}
    # Same body exists in both subs — cross-sub dedup does NOT apply
    assert sub1_bodies & sub2_bodies

def test_deleted_author_dropped():
    rows = process_subreddit("testsub1", sorted((FIXTURES / "testsub1").glob("*.json")))
    assert all(r["author"] != "[deleted]" for r in rows)

def test_removed_post_with_title_kept():
    rows = process_subreddit("testsub1", sorted((FIXTURES / "testsub1").glob("*.json")))
    ids = {r["doc_id"] for r in rows}
    assert "t3_bbb001" in ids

def test_rows_sorted_by_created_utc():
    rows = process_subreddit("testsub1", sorted((FIXTURES / "testsub1").glob("*.json")))
    times = [r["created_utc"] for r in rows]
    assert times == sorted(times)

def test_parse_error_is_skipped(tmp_path):
    raw = tmp_path / "raw"
    shutil.copytree(FIXTURES, raw)
    (raw / "testsub1" / "corrupt.json").write_text("not valid json{{{")
    rows = process_subreddit("testsub1", sorted((raw / "testsub1").glob("*.json")))
    # Corrupt file skipped; valid rows still present
    assert len(rows) > 0


# ── build_corpus (integration) ───────────────────────────────────────────────

def test_schema_matches_contract(tmp_path):
    out = tmp_path / "corpus.parquet"
    build_corpus(FIXTURES, out)
    table = pq.read_table(str(out))
    assert list(table.schema.names) == list(SCHEMA.names)

def test_no_deleted_authors_in_output(tmp_path):
    import pandas as pd
    out = tmp_path / "corpus.parquet"
    build_corpus(FIXTURES, out)
    df = pd.read_parquet(out)
    assert (df["author"] == "[deleted]").sum() == 0

def test_corpus_global_sort_order(tmp_path):
    import pandas as pd
    out = tmp_path / "corpus.parquet"
    build_corpus(FIXTURES, out)
    df = pd.read_parquet(out)
    # Rows should be in (subreddit, created_utc, doc_id) order
    expected = df.sort_values(["subreddit", "created_utc", "doc_id"]).reset_index(drop=True)
    actual = df.reset_index(drop=True)
    assert list(actual["doc_id"]) == list(expected["doc_id"])

def test_byte_stable(tmp_path):
    out1 = tmp_path / "c1.parquet"
    out2 = tmp_path / "c2.parquet"
    build_corpus(FIXTURES, out1)
    build_corpus(FIXTURES, out2)
    h1 = hashlib.sha256(out1.read_bytes()).hexdigest()
    h2 = hashlib.sha256(out2.read_bytes()).hexdigest()
    assert h1 == h2, "Two builds produced different parquet files"

def test_stats_counts(tmp_path):
    out = tmp_path / "corpus.parquet"
    stats = build_corpus(FIXTURES, out)
    # testsub1: 2 posts (aaa001, bbb001) + 1 comment (cmt002, cmt003 deduped)
    # testsub2: 1 post (ccc001) + 1 comment (cmt004)
    assert stats.posts == 3
    assert stats.comments == 2
    assert stats.total_rows == 5

def test_parse_error_in_build_corpus(tmp_path):
    raw = tmp_path / "raw"
    shutil.copytree(FIXTURES, raw)
    (raw / "testsub1" / "bad.json").write_text("not json")
    out = tmp_path / "corpus.parquet"
    stats = build_corpus(raw, out)
    assert stats.total_rows > 0  # bad file skipped, others processed
