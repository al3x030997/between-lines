"""Verify every quote displayed in the summary charts exists verbatim in the source corpus.

Each entry in data/quotes_registry.json maps:
    chart → key → {text, doc_id, author, source_field, char_start, char_end}

Tests:
1. Registry exists and is non-empty.
2. Every doc_id exists in the corpus.
3. Every quote text is an exact substring of the source post's body or title.
4. char_start/char_end offsets are consistent with the text.
5. author matches the corpus record.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

import pandas as pd
import pytest

REPO_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO_ROOT / "src"))

REGISTRY_PATH = REPO_ROOT / "data" / "quotes_registry.json"
CORPUS_PATH   = REPO_ROOT / "data" / "corpus_wattpad_full.parquet"


@pytest.fixture(scope="module")
def registry() -> dict:
    assert REGISTRY_PATH.exists(), f"quotes_registry.json not found at {REGISTRY_PATH}"
    data = json.loads(REGISTRY_PATH.read_text())
    assert data, "quotes_registry.json is empty"
    return data


@pytest.fixture(scope="module")
def corpus() -> pd.DataFrame:
    df = pd.read_parquet(CORPUS_PATH)
    return df[df["kind"] == "post"].drop_duplicates("doc_id").set_index("doc_id")


def all_quotes(registry: dict):
    """Yield (chart, key, entry) for every quote in the registry."""
    for chart, keys in registry.items():
        for key, entry in keys.items():
            yield chart, key, entry


def test_registry_not_empty(registry):
    total = sum(len(v) for v in registry.values())
    assert total > 0, "Registry has no quotes"
    print(f"\n  Registry: {len(registry)} charts, {total} total quotes")


def test_all_doc_ids_exist_in_corpus(registry, corpus):
    missing = []
    for chart, key, entry in all_quotes(registry):
        if entry["doc_id"] not in corpus.index:
            missing.append(f"{chart}/{key}: doc_id={entry['doc_id']}")
    assert not missing, "Quotes reference doc_ids not in corpus:\n" + "\n".join(missing)


def test_quotes_are_verbatim_substrings(registry, corpus):
    """Core anti-hallucination test: every quote must be an exact substring of its source."""
    failures = []
    for chart, key, entry in all_quotes(registry):
        doc_id = entry["doc_id"]
        if doc_id not in corpus.index:
            continue  # caught by test_all_doc_ids_exist_in_corpus
        row = corpus.loc[doc_id]
        source_text = (row.get(entry["source_field"]) or "")
        if entry["text"] not in source_text:
            # Provide context for debugging
            failures.append(
                f"\n  Chart={chart!r} key={key!r}\n"
                f"  Quote   : {entry['text']!r}\n"
                f"  Source  : {source_text[:300]!r}"
            )
    assert not failures, "Quotes not found verbatim in source:\n" + "\n".join(failures)


def test_char_offsets_consistent(registry, corpus):
    """char_start:char_end should recover the exact quote text from the source field."""
    failures = []
    for chart, key, entry in all_quotes(registry):
        doc_id = entry["doc_id"]
        if doc_id not in corpus.index:
            continue
        row = corpus.loc[doc_id]
        source_text = (row.get(entry["source_field"]) or "")
        start, end = entry["char_start"], entry["char_end"]
        extracted = source_text[start:end]
        if extracted != entry["text"]:
            failures.append(
                f"\n  Chart={chart!r} key={key!r}\n"
                f"  Expected : {entry['text']!r}\n"
                f"  At [{start}:{end}]: {extracted!r}"
            )
    assert not failures, "Char offsets do not recover quote text:\n" + "\n".join(failures)


def test_author_matches_corpus(registry, corpus):
    mismatches = []
    for chart, key, entry in all_quotes(registry):
        doc_id = entry["doc_id"]
        if doc_id not in corpus.index:
            continue
        actual_author = str(corpus.loc[doc_id].get("author", ""))
        if entry["author"] != actual_author:
            mismatches.append(
                f"  Chart={chart!r} key={key!r}: "
                f"registry author={entry['author']!r}, corpus author={actual_author!r}"
            )
    assert not mismatches, "Author mismatches:\n" + "\n".join(mismatches)
