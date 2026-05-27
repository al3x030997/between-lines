"""Generate analysis/wattpad_evidence.md — claims with verbatim supporting quotes.

All quotes are extracted directly from source post bodies via quote_extractor.py
and registered in data/quotes_registry.json for anti-hallucination tests.

Usage:
    python scripts/write_evidence_report.py
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO_ROOT / "src"))

import pandas as pd
from quote_extractor import (
    find_quote,
    find_quote_for_theme,
    find_quote_by_platform,
    find_quote_for_topic_sentiment,
    register,
    load_registry,
    save_registry,
    Quote,
)

OUT = REPO_ROOT / "analysis" / "wattpad_evidence.md"

CLAIMS = [
    ("claim_1_monetization",
     "The dominant complaint is monetization, not features",
     "The two largest gap clusters — 'fair organic content promotion' (16 phrases) and "
     "'non-intrusive ad experience' (15 phrases) — appear independently in both the author "
     "and community topics, making them the most consistently stated unmet needs across "
     "the entire corpus. The top criticisms ('heavy monetization focus', 'algorithm buries "
     "content without payment') reinforce the same underlying grievance: Wattpad has built "
     "a system where visibility requires payment."),

    ("claim_2_ao3",
     "AO3 is the primary escape hatch, driven by values not features",
     "AO3 appears in 83 posts — 4.2× more than the next rival (fanfiction.net, 20). "
     "The migration framing is almost always about values: AO3 is community-first and "
     "non-commercial; Wattpad is perceived as having sold out. The platform comparison "
     "topic's highest-scoring posts are external fandom drama about Wattpad migrants "
     "arriving on AO3 with 'wrong' norms, not Wattpad users defending their home."),

    ("claim_3_praise",
     "Praise is weak, generic, and outnumbered",
     "Across all four topics, praise phrases are consistently the shortest bar. The "
     "clusters that formed (≥3 phrases) are: 'encourages writing', 'supportive community', "
     "'large readership', 'entertaining content' — all describing Wattpad circa 2016, "
     "not the current product. Author experience generates the most praise volume (65 "
     "phrases) but those same posts generate 125 criticisms and 97 gaps, a 2:1 negative "
     "ratio. Reader experience produced zero clusters from 20 praise phrases."),

    ("claim_4_sentiment",
     "Community & Culture posts have the lowest sentiment of any topic",
     "Median VADER compound score: community & culture = +0.15, vs author experience "
     "= +0.40 — the widest gap between any two topics. Community posts with the highest "
     "volume (141 posts) are also the most negative. High-scoring posts in this topic "
     "are memes and comment-section screenshots — people laughing *at* the platform, "
     "not engaging with it."),

    ("claim_5_author_scores",
     "Author experience contains the platform's most emotionally resonant posts",
     "The top author experience post scored 28,376 — nearly 3× the top community post "
     "(15,369) and 3× the top platform comparison post (9,804). These aren't complaint "
     "posts; they are writers sharing milestone moments (finishing a long fic, reaching a "
     "readership milestone). The emotional attachment to writing-as-identity is real and "
     "deep, which is exactly what Wattpad is losing."),

    ("claim_6_fragmentation",
     "Reader experience complaints are too fragmented to cluster",
     "Reader experience produced 0% clustering across all three categories (criticism, "
     "gap, praise) — the only topic where nothing coalesced. 63 criticism phrases, "
     "0 clustered. 20 praise phrases, 0 clustered. 12 gap phrases, 0 clustered. "
     "This means reader frustrations are personal and varied rather than convergent "
     "on a single fixable problem, unlike the author/community topics where organic "
     "promotion and ads formed dominant clusters immediately."),
]


def _reddit_link(doc_id: str) -> str:
    return f"https://www.reddit.com/comments/{doc_id[3:]}/"


def _find_many(
    doc_ids: list[str],
    keywords: list[str],
    corpus: pd.DataFrame,
    n: int = 4,
) -> list[Quote]:
    """Find up to n distinct quotes from different posts."""
    posts = corpus[corpus["doc_id"].isin(doc_ids)].drop_duplicates("doc_id")
    results: list[Quote] = []
    used_doc_ids: set[str] = set()

    # Score every sentence across all candidate posts
    candidates: list[tuple[float, Quote]] = []
    for _, row in posts.iterrows():
        if row["doc_id"] in used_doc_ids:
            continue
        for field in ("body", "title"):
            # Use raw text for position computation so char offsets match what the test reads
            raw_text = (row.get(field) or "")
            if not raw_text.strip():
                continue
            parts = re.split(r'(?<=[.!?])\s+', raw_text)
            search_from = 0
            for sent in parts:
                sent = sent.strip()
                if not sent:
                    continue
                # Find in raw text from current search position
                idx = raw_text.find(sent, search_from)
                if idx >= 0:
                    search_from = idx + len(sent)

                low = sent.lower()
                kw_hits = sum(1 for kw in keywords if kw in low)
                length_ok = 30 <= len(sent) <= 200
                not_url = "http" not in low
                has_alpha = bool(re.search(r'[a-z]', low))
                score = kw_hits * 2 + (1 if length_ok else 0) + (1 if not_url else 0) + (1 if has_alpha else 0)
                if score >= 1 and idx >= 0 and sent in raw_text:
                    q: Quote = {
                        "text":         sent,
                        "doc_id":       str(row["doc_id"]),
                        "author":       str(row.get("author", "unknown")),
                        "source_field": field,
                        "char_start":   idx,
                        "char_end":     idx + len(sent),
                    }
                    candidates.append((score, q))

    # Pick top-n from distinct posts
    candidates.sort(key=lambda x: -x[0])
    for score, q in candidates:
        if q["doc_id"] not in used_doc_ids and len(results) < n:
            results.append(q)
            used_doc_ids.add(q["doc_id"])

    return results


def fmt_quote_block(q: Quote) -> str:
    link = _reddit_link(q["doc_id"])
    return f'> "{q["text"]}"\n> — u/{q["author"]} ([source]({link}))\n'


def main() -> int:
    print("Loading data…")
    corpus        = pd.read_parquet(REPO_ROOT / "data" / "corpus_wattpad_full.parquet")
    themes        = pd.read_parquet(REPO_ROOT / "data" / "themes.parquet")
    opinions      = pd.read_parquet(REPO_ROOT / "data" / "post_opinions.parquet")
    corpus_topics = pd.read_parquet(REPO_ROOT / "data" / "corpus_wattpad_topics.parquet")
    vader         = pd.read_parquet(REPO_ROOT / "data" / "corpus_wattpad_vader_v2.parquet")
    labels_df     = pd.read_parquet(REPO_ROOT / "data" / "topic_labels.parquet")

    posts = corpus[corpus["kind"] == "post"].drop_duplicates("doc_id")
    registry = load_registry()

    # ── Collect quotes per claim ──────────────────────────────────────────────

    claim_quotes: dict[str, list[Quote]] = {}

    # Claim 1: monetization
    top_gap_ids = []
    for label in ("fair organic content promotion", "non-intrusive ad experience",
                  "heavy monetization focus", "algorithm buries content without payment"):
        match = themes[themes["label"].str.lower().str.contains(label.split()[0].lower())]
        for _, row in match.iterrows():
            top_gap_ids.extend(list(row["doc_ids"]))
    claim_quotes["claim_1_monetization"] = _find_many(
        list(set(top_gap_ids)),
        ["promotion", "organic", "ads", "algorithm", "pay", "paid", "money", "monetiz", "visibility"],
        posts, n=4,
    )

    # Claim 2: AO3
    exploded = opinions.explode("mentioned_platforms")
    ao3_ids = exploded[exploded["mentioned_platforms"].str.lower() == "ao3"]["doc_id"].tolist()
    claim_quotes["claim_2_ao3"] = _find_many(
        ao3_ids,
        ["ao3", "moved", "migrated", "left", "instead", "archive", "prefer", "better", "community"],
        posts, n=4,
    )

    # Claim 3: praise is weak
    praise_ids = []
    for _, row in themes[themes["category"] == "praise"].iterrows():
        praise_ids.extend(list(row["doc_ids"]))
    crit_ids = []
    for _, row in themes[themes["category"] == "criticism"].iterrows():
        crit_ids.extend(list(row["doc_ids"]))
    # Mix: thin praise quotes + sharp criticism quotes
    q_praise = _find_many(list(set(praise_ids)),
                          ["love", "great", "good", "enjoy", "community", "helpful"], posts, n=2)
    q_crit   = _find_many(list(set(crit_ids)),
                          ["ads", "algorithm", "money", "paid", "censorship", "restrict", "gone"], posts, n=2)
    claim_quotes["claim_3_praise"] = q_praise + q_crit

    # Claim 4: community sentiment
    comm_ids = corpus_topics[corpus_topics["topic"] == "community_culture"]["doc_id"].tolist()
    merged_sent = (
        corpus_topics[corpus_topics["topic"] == "community_culture"]
        .merge(vader[["doc_id", "vader_compound"]], on="doc_id", how="inner")
        .dropna(subset=["vader_compound"])
        .nsmallest(40, "vader_compound")
    )
    low_ids = merged_sent["doc_id"].tolist()
    claim_quotes["claim_4_sentiment"] = _find_many(
        low_ids,
        ["wattpad", "lost", "miss", "used to", "changed", "worse", "anymore", "community", "toxic"],
        posts, n=4,
    )

    # Claim 5: author milestones / high scores
    author_posts = posts.merge(labels_df[["doc_id", "topic"]], on="doc_id", how="inner")
    author_posts = author_posts[author_posts["topic"] == "author_writing_experience"]
    top_author_ids = author_posts.nlargest(20, "score")["doc_id"].tolist()
    claim_quotes["claim_5_author_scores"] = _find_many(
        top_author_ids,
        ["wattpad", "story", "write", "chapter", "reader", "finish", "complete", "thank"],
        posts, n=4,
    )

    # Claim 6: fragmented reader complaints
    reader_ids = corpus_topics[corpus_topics["topic"] == "reader_experience"]["doc_id"].tolist()
    claim_quotes["claim_6_fragmentation"] = _find_many(
        reader_ids,
        ["wattpad", "read", "book", "app", "comment", "ad", "story", "quality", "writing"],
        posts, n=4,
    )

    # ── Register all quotes ───────────────────────────────────────────────────
    for claim_key, quotes in claim_quotes.items():
        for i, q in enumerate(quotes):
            register(registry, "evidence_report", f"{claim_key}__{i}", q)

    save_registry(registry)
    total = sum(len(v) for v in registry.values())
    print(f"Registry updated: {total} total quotes")

    # ── Write markdown ────────────────────────────────────────────────────────
    lines: list[str] = [
        "# Wattpad Reddit Analysis — Claims & Evidence\n",
        "Verbatim quotes from source Reddit posts, each linked to the original.\n",
        "All quotes are verified as exact substrings of source post bodies ",
        "(see `tests/test_quotes_not_hallucinated.py`).\n",
        "\n---\n",
        "## Claims at a glance\n",
    ]

    for i, (key, title, _) in enumerate(CLAIMS, 1):
        lines.append(f"{i}. **{title}**")

    lines.append("\n---\n")

    for i, (key, title, summary) in enumerate(CLAIMS, 1):
        lines.append(f"## Claim {i}: {title}\n")
        lines.append(f"{summary}\n")
        lines.append("### Supporting quotes\n")
        quotes = claim_quotes.get(key, [])
        if not quotes:
            lines.append("_No quotes found._\n")
        else:
            for q in quotes:
                lines.append(fmt_quote_block(q))
        lines.append("")

    OUT.write_text("\n".join(lines), encoding="utf-8")
    print(f"Report → {OUT.relative_to(REPO_ROOT)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
