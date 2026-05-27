"""Extract and verify verbatim quotes from source Reddit posts.

All quotes are pulled directly from post body/title text — never LLM-generated.
Every quote is registered with its exact char offset so tests can verify it.
"""
from __future__ import annotations

import json
import re
from pathlib import Path
from typing import TypedDict

import pandas as pd

REPO_ROOT = Path(__file__).resolve().parent.parent
REGISTRY_PATH = REPO_ROOT / "data" / "quotes_registry.json"

_SENT_RE = re.compile(r'(?<=[.!?])\s+')


class Quote(TypedDict):
    text: str
    doc_id: str
    author: str
    source_field: str   # 'body' or 'title'
    char_start: int
    char_end: int


def _sentences(text: str) -> list[tuple[str, int]]:
    """Return list of (sentence, char_start) from a text block."""
    parts: list[tuple[str, int]] = []
    offset = 0
    for sent in _SENT_RE.split(text):
        sent = sent.strip()
        if sent:
            idx = text.find(sent, offset)
            if idx >= 0:
                parts.append((sent, idx))
                offset = idx + len(sent)
    return parts


def _score(sentence: str, keywords: list[str]) -> float:
    low = sentence.lower()
    kw_hits = sum(1 for kw in keywords if kw in low)
    length_ok = 25 <= len(sentence) <= 200
    not_url = "http" not in low
    not_pure_emoji = bool(re.search(r'[a-z]', low))
    return kw_hits * 2 + (1 if length_ok else 0) + (1 if not_url else 0) + (1 if not_pure_emoji else 0)


def find_quote(
    doc_ids: list[str],
    keywords: list[str],
    corpus: pd.DataFrame,
    min_score: float = 1.0,
    prefer_body: bool = True,
) -> Quote | None:
    """Find the best verbatim quote from a list of post doc_ids.

    Searches body first, then title. Returns None if nothing scores above min_score.
    """
    posts = corpus[corpus["doc_id"].isin(doc_ids)].drop_duplicates("doc_id")

    best: Quote | None = None
    best_score = min_score - 1

    for _, row in posts.iterrows():
        for field in (["body", "title"] if prefer_body else ["title", "body"]):
            text = (row.get(field) or "").strip()
            if not text:
                continue
            for sent, start in _sentences(text):
                s = _score(sent, keywords)
                if s > best_score:
                    best_score = s
                    best = Quote(
                        text=sent,
                        doc_id=str(row["doc_id"]),
                        author=str(row.get("author", "unknown")),
                        source_field=field,
                        char_start=start,
                        char_end=start + len(sent),
                    )

    # Verify the quote is actually a substring of the source (sanity)
    if best is not None:
        posts_row = posts[posts["doc_id"] == best["doc_id"]]
        if not posts_row.empty:
            source_text = (posts_row.iloc[0].get(best["source_field"]) or "")
            if best["text"] not in source_text:
                return None  # something went wrong — refuse to return unverified quote

    return best


def find_quote_by_platform(
    platform: str,
    opinions: pd.DataFrame,
    corpus: pd.DataFrame,
) -> Quote | None:
    """Find a quote from a post that mentions a specific rival platform."""
    exploded = opinions.explode("mentioned_platforms")
    doc_ids = exploded[
        exploded["mentioned_platforms"].str.lower() == platform.lower()
    ]["doc_id"].tolist()
    keywords = [platform.lower(), "instead", "moved", "migrated", "prefer", "better", "versus", "vs"]
    return find_quote(doc_ids, keywords, corpus, min_score=1.0)


def find_quote_for_theme(
    theme_row: pd.Series,
    corpus: pd.DataFrame,
    extra_keywords: list[str] | None = None,
) -> Quote | None:
    """Find a verbatim quote for a theme cluster."""
    label_words = re.findall(r'\w+', theme_row["label"].lower())
    keywords = label_words + (extra_keywords or [])
    return find_quote(list(theme_row["doc_ids"]), keywords, corpus)


def find_quote_for_topic_sentiment(
    topic: str,
    corpus_topics: pd.DataFrame,
    vader: pd.DataFrame,
    corpus: pd.DataFrame,
    low: bool = True,
) -> Quote | None:
    """Find a quote from the most extreme-sentiment post in a topic."""
    merged = (
        corpus_topics[corpus_topics["topic"] == topic]
        .merge(vader[["doc_id", "vader_compound"]], on="doc_id", how="inner")
        .dropna(subset=["vader_compound"])
    )
    if merged.empty:
        return None
    if low:
        candidates = merged.nsmallest(20, "vader_compound")
    else:
        candidates = merged.nlargest(20, "vader_compound")
    doc_ids = candidates["doc_id"].tolist()
    keywords = ["wattpad", "community", "platform", "feel", "love", "hate", "lost", "miss"]
    return find_quote(doc_ids, keywords, corpus)


# ── Registry ──────────────────────────────────────────────────────────────────

def load_registry() -> dict:
    if REGISTRY_PATH.exists():
        return json.loads(REGISTRY_PATH.read_text())
    return {}


def save_registry(registry: dict) -> None:
    REGISTRY_PATH.write_text(json.dumps(registry, indent=2, ensure_ascii=False))


def register(registry: dict, chart: str, key: str, quote: Quote) -> Quote:
    """Add a quote to the registry and return it."""
    if chart not in registry:
        registry[chart] = {}
    registry[chart][key] = {
        "text":         quote["text"],
        "doc_id":       quote["doc_id"],
        "author":       quote["author"],
        "source_field": quote["source_field"],
        "char_start":   quote["char_start"],
        "char_end":     quote["char_end"],
    }
    return quote


def fmt(quote: Quote, max_chars: int = 90) -> str:
    """Format a quote for chart annotation: truncated text + author."""
    text = quote["text"]
    if len(text) > max_chars:
        text = text[:max_chars - 1] + "…"
    return f'"{text}"\n— u/{quote["author"]}'


# ── Opinion-bearing sentence selection ────────────────────────────────────────

# Words that mark a sentence as expressing the author's own stance
OPINION_TOKENS = {
    "i", "im", "ive", "id", "my", "me",
    "we", "us", "our",
    "feel", "felt", "think", "thought", "believe",
    "hate", "love", "wish", "want", "need", "miss",
    "honestly", "frankly", "imo", "actually",
    "should", "would", "could", "wouldnt", "shouldnt", "couldnt",
    "but", "however", "though", "instead",
    "annoying", "frustrating", "broken", "garbage", "crappy",
    "amazing", "great", "terrible", "awful",
}

# Heuristic markers that a sentence is QUOTED CONTENT (fic, dialogue, examples)
# rather than the user's own voice.
QUOTED_OPENERS  = ('"', "'", "“", "‘", "*", "_", ">")
QUOTED_CLOSERS  = ('"', "'", "”", "’", "*", "_")


def _looks_quoted(sent: str, context_before: str = "") -> bool:
    """True if the sentence appears to be quoted content rather than the user's own words."""
    s = sent.strip()
    if not s:
        return True
    # Starts and ends with matching quote/emphasis markers → quoted
    if s[0] in QUOTED_OPENERS and s[-1] in QUOTED_CLOSERS:
        return True
    # Block-quoted (Markdown >)
    if s.startswith(">"):
        return True
    # Inside an unmatched pair of quotes in context (rough heuristic)
    open_q = context_before.count('"') + context_before.count('“')
    close_q = context_before.count('”')
    if open_q - close_q >= 1 and '"' not in s and "”" not in s:
        return True
    return False


def _opinion_score(sent: str, theme_keywords: list[str]) -> float:
    """Higher = better candidate for an opinion-bearing quote."""
    low = sent.lower()
    words = re.findall(r"[a-z']+", low)
    if not words:
        return 0.0

    # Hard requirements
    if len(sent) < 30 or len(sent) > 220:
        return 0.0
    if not re.search(r"[a-z]", low):
        return 0.0
    if "http" in low:
        return 0.0

    # Must mention at least one theme keyword
    kw_hits = sum(1 for kw in theme_keywords if kw in low)
    if kw_hits == 0:
        return 0.0

    # Opinion tokens
    opinion_hits = sum(1 for w in words if w.replace("'", "") in OPINION_TOKENS)

    # Penalty signals — looks like quoted/fic content
    if re.search(r'"[^"]{20,}"', sent):  # contains a long internal quoted block
        return 0.0
    if low.count("said") + low.count("says") + low.count("replied") >= 1:
        return 0.0  # likely narrative dialogue
    if re.search(r"(eth|'st|wast|thee|thou|thy|hath|doth)\b", low):
        return 0.0  # Shakespearean / pastiche fic
    if low.startswith(("if you ", "click ", "for more", "edit:", "tldr", "tl;dr")):
        return 0.0

    return kw_hits * 3.0 + opinion_hits * 1.5 + min(len(sent), 120) * 0.005


import re  # noqa: E402  (used by helpers above)


def find_opinion_sentence(
    doc_id: str,
    theme_keywords: list[str],
    corpus_indexed: pd.DataFrame,
) -> Quote | None:
    """Find the best opinion-bearing sentence in a single post's body or title.

    `corpus_indexed` should be the posts dataframe with doc_id as the index.
    Returns None if no sentence scores above the threshold.
    """
    if doc_id not in corpus_indexed.index:
        return None
    row = corpus_indexed.loc[doc_id]

    best: Quote | None = None
    best_score = 0.5  # threshold

    for field in ("body", "title"):
        raw = (row.get(field) or "")
        if not raw.strip():
            continue
        # Sentence-split using punctuation; iterate with absolute char positions
        search_from = 0
        for sent in _SENT_RE.split(raw):
            sent_clean = sent.strip()
            if not sent_clean:
                continue
            idx = raw.find(sent_clean, search_from)
            if idx < 0:
                continue
            context_before = raw[:idx]
            if _looks_quoted(sent_clean, context_before):
                search_from = idx + len(sent_clean)
                continue
            score = _opinion_score(sent_clean, theme_keywords)
            if score > best_score:
                best_score = score
                best = Quote(
                    text=sent_clean,
                    doc_id=str(row.name) if hasattr(row, "name") else doc_id,
                    author=str(row.get("author", "unknown")),
                    source_field=field,
                    char_start=idx,
                    char_end=idx + len(sent_clean),
                )
            search_from = idx + len(sent_clean)

    return best


def find_key_quote_verbatim(
    doc_id: str,
    opinions: pd.DataFrame,
    corpus_indexed: pd.DataFrame,
) -> Quote | None:
    """Use the LLM-extracted key_quote if it's a verbatim substring of body or title."""
    if doc_id not in corpus_indexed.index:
        return None
    opn = opinions[opinions["doc_id"] == doc_id]
    if opn.empty:
        return None
    kq = (opn.iloc[0]["key_quote"] or "").strip()
    if len(kq) < 20:
        return None

    row = corpus_indexed.loc[doc_id]
    for field in ("body", "title"):
        text = (row.get(field) or "")
        if kq in text:
            idx = text.find(kq)
            return Quote(
                text=kq,
                doc_id=doc_id,
                author=str(row.get("author", "unknown")),
                source_field=field,
                char_start=idx,
                char_end=idx + len(kq),
            )
    return None
