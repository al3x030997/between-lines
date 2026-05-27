"""Step 2 — Extract competitor-platform mentions from r/Wattpad posts.

For each post in data/sentiment_descriptives.parquet (1,787 platform-discussion
posts), scan title + cleaned body for mentions of 11 named platforms, extract
the mentioning sentence, classify the mention, and score it with VADER.

Writes:
  data/competitor_mentions.parquet              # per-mention rows
  analysis/tables/competitor_mention_counts.csv # platform × mention_type matrix
  analysis/tables/competitor_sentiment.csv      # mean sentence-sentiment per platform (single-mention only)
  analysis/findings/17_competitor_mentions.png  # bar chart, colored by sentiment

Usage:
    python scripts/extract_competitor_mentions.py
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

import matplotlib.pyplot as plt
import pandas as pd
import spacy
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

REPO_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO_ROOT / "src"))
from text_prep import clean_body  # noqa: E402
from scope import ANALYTICAL_DROP_FLAIRS  # noqa: E402

SRC = REPO_ROOT / "data" / "sentiment_descriptives.parquet"
CORPUS = REPO_ROOT / "data" / "corpus_wattpad_full.parquet"
OUT_PARQUET = REPO_ROOT / "data" / "competitor_mentions.parquet"
TBL = REPO_ROOT / "analysis" / "tables"
FINDINGS = REPO_ROOT / "analysis" / "findings"

# Canonical name → list of regex patterns (case-insensitive, applied to cleaned text).
PLATFORMS: dict[str, list[str]] = {
    "ao3":            [r"\bao3\b", r"archive\s+of\s+our\s+own", r"archiveofourown"],
    "royal_road":     [r"royal\s*road\b", r"\brroad\b", r"\brryl\b"],
    "inkitt":         [r"\binkitt\b"],
    "substack":       [r"\bsubstack\b"],
    "patreon":        [r"\bpatreon\b"],
    "tapas":          [r"\btapas(?:\.io)?\b"],
    "webnovel":       [r"\bwebnovel\b"],
    "radish":         [r"\bradish\b"],
    "kindle_vella":   [r"kindle\s*vella"],
    "fanfiction_net": [r"fanfiction\.net", r"\bff\.net\b", r"\bffn\b"],
    "wattpad":        [r"\bwattpad\b"],
}
PLATFORM_RE = {p: re.compile("|".join(pats), re.IGNORECASE) for p, pats in PLATFORMS.items()}

# Switching-verb pattern — sentence is a switching announcement.
SWITCH_RE = re.compile(
    r"\b(?:moved|moving|left|leaving|switched|switching|jumped|migrated|"
    r"migrating|going|went|gone|deleted|abandoning|abandoned|"
    r"giving up on|quit|quitting)\b\s+(?:to|from|on)?",
    re.IGNORECASE,
)
# Recommendation-context flairs (mentioning an alternative is itself the point).
REC_FLAIRS = {"Looking For: Recommendations"}


def classify_mention(sentence: str, platforms_in_sentence: set[str], flair: str) -> str:
    if len(platforms_in_sentence) >= 2:
        return "comparative"
    if SWITCH_RE.search(sentence):
        return "switching"
    if flair in REC_FLAIRS:
        return "named_alternative"
    return "mention_only"


def detect_platforms(text: str) -> dict[str, list[tuple[int, int]]]:
    hits: dict[str, list[tuple[int, int]]] = {}
    for plat, regex in PLATFORM_RE.items():
        spans = [(m.start(), m.end()) for m in regex.finditer(text)]
        if spans:
            hits[plat] = spans
    return hits


def main() -> int:
    sd = pd.read_parquet(SRC)
    n_before = len(sd)
    sd = sd[~sd["flair"].isin(ANALYTICAL_DROP_FLAIRS)].copy()
    if n_before != len(sd):
        print(f"  scope: {len(sd):,}/{n_before:,} posts after ANALYTICAL_DROP_FLAIRS filter")
    corpus = pd.read_parquet(CORPUS, columns=["doc_id", "body"])
    body_map = dict(zip(corpus["doc_id"], corpus["body"].fillna("")))

    nlp = spacy.load("en_core_web_sm", disable=["ner", "tagger", "lemmatizer", "attribute_ruler"])
    nlp.add_pipe("sentencizer", first=True) if "sentencizer" not in nlp.pipe_names else None
    sid = SentimentIntensityAnalyzer()

    rows: list[dict] = []
    n_posts_with_hits = 0

    for r in sd.itertuples():
        title = (r.title or "").strip()
        body = clean_body(body_map.get(r.doc_id, ""))
        text = (title + ". " + body).strip()
        if not text:
            continue
        # Cheap pre-filter: any platform mentioned at all in the post?
        any_hit = any(rx.search(text) for rx in PLATFORM_RE.values())
        if not any_hit:
            continue
        n_posts_with_hits += 1

        doc = nlp(text)
        for sent_idx, sent in enumerate(doc.sents):
            stext = sent.text.strip()
            if len(stext) < 5:
                continue
            sent_hits = detect_platforms(stext)
            if not sent_hits:
                continue
            vader = sid.polarity_scores(stext)["compound"]
            plats_in_sent = set(sent_hits.keys())
            mtype = classify_mention(stext, plats_in_sent, r.flair)
            for plat in plats_in_sent:
                co = sorted(plats_in_sent - {plat})
                rows.append({
                    "doc_id": r.doc_id,
                    "sent_idx": sent_idx,
                    "platform": plat,
                    "mention_type": mtype,
                    "sentence_text": stext[:500],
                    "sentence_sent": float(vader),
                    "flair": r.flair,
                    "post_score": int(r.score),
                    "created_utc": int(r.ts.timestamp()),
                    "co_mentioned": json.dumps(co),
                })

    out = pd.DataFrame(rows)
    OUT_PARQUET.parent.mkdir(parents=True, exist_ok=True)
    out.to_parquet(OUT_PARQUET, index=False, compression="zstd")
    print(f"wrote {OUT_PARQUET.relative_to(REPO_ROOT)}  shape={out.shape}")
    print(f"  posts with ≥1 platform mention: {n_posts_with_hits}/{len(sd)}")
    print(f"  total mention rows: {len(out)}")
    print()

    # Derived tables
    TBL.mkdir(parents=True, exist_ok=True)
    counts = out.pivot_table(index="platform", columns="mention_type",
                             values="doc_id", aggfunc="count", fill_value=0)
    for col in ("comparative", "switching", "named_alternative", "mention_only"):
        if col not in counts.columns:
            counts[col] = 0
    counts["total"] = counts.sum(axis=1)
    counts = counts.sort_values("total", ascending=False)
    counts.to_csv(TBL / "competitor_mention_counts.csv")
    print("--- mention counts (platform × mention_type) ---")
    print(counts.to_string())
    print()

    single = out[out["co_mentioned"] == "[]"].copy()
    sentiment = (single.groupby("platform")
                       .agg(n_single=("doc_id", "size"),
                            mean_sent=("sentence_sent", "mean"),
                            median_sent=("sentence_sent", "median"))
                       .sort_values("n_single", ascending=False))
    sentiment.to_csv(TBL / "competitor_sentiment.csv")
    print("--- sentence sentiment per platform (single-mention sentences only) ---")
    print(sentiment.round(3).to_string())

    # Chart
    chart = render_chart(counts, sentiment)
    print(f"\nwrote {chart.relative_to(REPO_ROOT)}")
    return 0


def render_chart(counts: pd.DataFrame, sentiment: pd.DataFrame) -> Path:
    plt.rcParams.update({
        "font.family": "sans-serif", "font.size": 11,
        "axes.spines.top": False, "axes.spines.right": False,
        "axes.grid": True, "axes.grid.axis": "x",
        "grid.alpha": 0.3, "grid.linestyle": "--",
    })
    C_TEXT, C_SUB = "#2c3e50", "#7f8c8d"
    merged = counts.join(sentiment, how="left").fillna({"mean_sent": 0.0, "n_single": 0})
    merged = merged.sort_values("total", ascending=True)

    def color(s):
        if s >= 0.20:
            return "#27ae60"
        if s >= 0.00:
            return "#95a5a6"
        if s >= -0.20:
            return "#e67e22"
        return "#c0392b"

    fig, ax = plt.subplots(figsize=(10, 0.55 * len(merged) + 2.8))
    fig.subplots_adjust(left=0.22, right=0.92, top=0.84, bottom=0.16)
    y = list(range(len(merged)))
    colors = [color(s) for s in merged["mean_sent"]]
    ax.barh(y, merged["total"], color=colors, edgecolor="white")
    ax.set_yticks(y); ax.set_yticklabels(merged.index, color=C_TEXT)
    ax.set_xlabel("Total mentions across posts", color=C_TEXT)
    ax.tick_params(colors=C_SUB)
    for yi, (tot, mean_s, n_s) in enumerate(zip(merged["total"], merged["mean_sent"], merged["n_single"])):
        ax.text(tot + max(merged["total"]) * 0.01, yi,
                f"n={int(tot)}  •  mean sent {mean_s:+.2f} (single-mention n={int(n_s)})",
                va="center", fontsize=9, color=C_TEXT)

    handles = [plt.Rectangle((0, 0), 1, 1, color=c) for c in ("#27ae60", "#95a5a6", "#e67e22", "#c0392b")]
    labels = ["≥ +0.20 (positive)", "0 to +0.20", "−0.20 to 0", "< −0.20 (negative)"]
    fig.legend(handles, labels, loc="lower center", ncol=4, frameon=False,
               fontsize=9, bbox_to_anchor=(0.5, 0.02))

    fig.text(0.05, 0.965, "Competitor platform mentions in r/Wattpad posts",
             fontsize=16, fontweight="bold", color=C_TEXT)
    fig.text(0.05, 0.930, "Last 2 years, platform-discussion flairs; bar = total mentions, color = sentence sentiment (single-mention only)",
             fontsize=10, color=C_SUB)

    out = FINDINGS / "17_competitor_mentions.png"
    FINDINGS.mkdir(parents=True, exist_ok=True)
    fig.savefig(out, dpi=140); plt.close(fig)
    return out


if __name__ == "__main__":
    raise SystemExit(main())
