"""Step 5 — Generate insight charts 20–24.

Reads:
  data/corpus_wattpad_topics.parquet
  data/corpus_wattpad_vader_v2.parquet
  data/post_opinions.parquet
  data/themes.parquet

Outputs: analysis/charts/20–24_*.png

Usage:
    python analysis/generate_insight_charts.py
"""
from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "src"))

import matplotlib.pyplot as plt  # noqa: E402
import numpy as np               # noqa: E402
import pandas as pd              # noqa: E402

OUT = ROOT / "analysis" / "charts"
OUT.mkdir(parents=True, exist_ok=True)

# ── Style (mirrors generate_topic_charts.py) ──────────────────────────────────
plt.rcParams.update({
    "font.family":       "sans-serif",
    "font.size":         11,
    "axes.spines.top":   False,
    "axes.spines.right": False,
    "axes.grid":         True,
    "axes.grid.axis":    "x",
    "grid.alpha":        0.3,
    "grid.linestyle":    "--",
})

C_TEXT = "#2c3e50"
C_SUB  = "#7f8c8d"

SUBSTANTIVE_TOPICS = [
    "platform_comparison",
    "author_writing_experience",
    "reader_experience",
    "community_culture",
]

TOPIC_LABELS = {
    "platform_comparison":       "Platform comparison",
    "author_writing_experience": "Author experience",
    "reader_experience":         "Reader experience",
    "community_culture":         "Community & culture",
    "unrelated":                 "Unrelated",
}

TOPIC_COLORS = {
    "platform_comparison":       "#2980b9",
    "author_writing_experience": "#27ae60",
    "reader_experience":         "#e67e22",
    "community_culture":         "#8e44ad",
    "unrelated":                 "#95a5a6",
}

CATEGORY_COLORS = {
    "praise":    "#27ae60",
    "criticism": "#e74c3c",
    "gap":       "#e67e22",
}


def _title_block(fig, title: str, subtitle: str, x: float = 0.05) -> None:
    fig.text(x, 0.97, title, fontsize=13, fontweight="bold", va="top", color=C_TEXT)
    fig.text(x, 0.925, subtitle, fontsize=9, va="top", color=C_SUB, wrap=True, linespacing=1.5)


def _save(fig: plt.Figure, name: str) -> None:
    path = OUT / name
    fig.savefig(path, dpi=150, bbox_inches="tight")
    plt.close(fig)
    print(f"  saved → {path.relative_to(ROOT)}")


# ═══════════════════════════════════════════════════════════════════════════════
# Chart 20 — Sentiment by topic (violin)
# ═══════════════════════════════════════════════════════════════════════════════

def chart_sentiment_by_topic(corpus_topics: pd.DataFrame, vader: pd.DataFrame) -> None:
    merged = corpus_topics.merge(vader[["doc_id", "vader_compound"]], on="doc_id", how="inner")
    merged = merged[merged["vader_compound"].notna() & merged["topic"].isin(SUBSTANTIVE_TOPICS)]
    n_en = len(merged)

    fig, ax = plt.subplots(figsize=(11, 5))
    fig.subplots_adjust(top=0.82, left=0.28, right=0.92)

    data    = [merged[merged["topic"] == t]["vader_compound"].values for t in SUBSTANTIVE_TOPICS]
    labels  = [TOPIC_LABELS[t] for t in SUBSTANTIVE_TOPICS]
    colors  = [TOPIC_COLORS[t] for t in SUBSTANTIVE_TOPICS]

    parts = ax.violinplot(data, vert=False, showmedians=True, showextrema=False)
    for i, pc in enumerate(parts["bodies"]):
        pc.set_facecolor(colors[i])
        pc.set_alpha(0.6)
    parts["cmedians"].set_colors(colors)
    parts["cmedians"].set_linewidth(2)

    ax.axvline(0, color="#bdc3c7", linewidth=1, linestyle="--", zorder=0)
    ax.set_yticks(range(1, len(labels) + 1))
    ax.set_yticklabels(labels)
    ax.set_xlabel("VADER compound score (−1 = most negative, +1 = most positive)")

    _title_block(
        fig,
        "Chart 20 — Sentiment by topic",
        f"VADER compound score distribution. English-language posts & comments only (N={n_en:,}).",
    )
    _save(fig, "20_sentiment_by_topic.png")


# ═══════════════════════════════════════════════════════════════════════════════
# Chart 21 — Top themes grid (2×2, one panel per substantive topic)
# ═══════════════════════════════════════════════════════════════════════════════

def chart_top_themes_grid(themes: pd.DataFrame) -> None:
    fig, axes = plt.subplots(2, 2, figsize=(16, 10))
    fig.subplots_adjust(top=0.88, hspace=0.5, wspace=0.4)

    for ax, topic in zip(axes.flat, SUBSTANTIVE_TOPICS):
        grp = themes[themes["topic"] == topic].copy()
        if grp.empty:
            ax.set_visible(False)
            continue

        top = grp.nlargest(10, "size")
        top = top.sort_values("size", ascending=True)
        bar_colors = [CATEGORY_COLORS.get(c, "#95a5a6") for c in top["category"]]

        ax.barh(top["label"].str[:45], top["size"], color=bar_colors, height=0.6)
        ax.set_title(TOPIC_LABELS[topic], fontsize=11, fontweight="bold", color=C_TEXT, pad=6)
        ax.set_xlabel("Phrase count")

        from matplotlib.patches import Patch
        legend_elements = [
            Patch(facecolor=CATEGORY_COLORS["praise"],    label="Praise"),
            Patch(facecolor=CATEGORY_COLORS["criticism"], label="Criticism"),
            Patch(facecolor=CATEGORY_COLORS["gap"],       label="Gap"),
        ]
        ax.legend(handles=legend_elements, fontsize=8, loc="lower right")

    _title_block(
        fig,
        "Chart 21 — Top themes per topic",
        "Top-10 clustered phrases per topic. Green=praise, red=criticism, orange=gap.",
    )
    _save(fig, "21_top_themes_grid.png")


# ═══════════════════════════════════════════════════════════════════════════════
# Chart 22 — Competitor platform mentions
# ═══════════════════════════════════════════════════════════════════════════════

def chart_competitor_mentions(opinions: pd.DataFrame) -> None:
    exploded = opinions.explode("mentioned_platforms")
    exploded = exploded[exploded["mentioned_platforms"].notna() & (exploded["mentioned_platforms"] != "")]
    counts = exploded["mentioned_platforms"].str.lower().value_counts().head(15)
    if counts.empty:
        print("  chart 22: no platform mentions found, skipping")
        return

    fig, ax = plt.subplots(figsize=(11, 5))
    fig.subplots_adjust(top=0.82, left=0.22, right=0.92)

    colors = ["#e74c3c" if p == "wattpad" else "#3498db" for p in counts.index]
    bars = ax.barh(counts.index[::-1], counts.values[::-1], color=colors[::-1], height=0.6)
    for bar, n in zip(bars, counts.values[::-1]):
        ax.text(bar.get_width() + 0.5, bar.get_y() + bar.get_height() / 2,
                str(n), va="center", fontsize=9, color=C_SUB)

    ax.set_xlabel("Mention count (posts)")
    _title_block(
        fig,
        "Chart 22 — Competitor platform mentions",
        f"Platforms named in {len(opinions):,} extracted posts. Wattpad self-references in red.",
    )
    _save(fig, "22_competitor_mentions.png")


# ═══════════════════════════════════════════════════════════════════════════════
# Chart 23 — User role split per topic
# ═══════════════════════════════════════════════════════════════════════════════

def chart_user_role_split(opinions: pd.DataFrame) -> None:
    role_order   = ["author", "mixed", "reader", "observer", "unknown"]
    role_colors  = {
        "author":   "#27ae60",
        "mixed":    "#2980b9",
        "reader":   "#e67e22",
        "observer": "#8e44ad",
        "unknown":  "#95a5a6",
    }

    pivot = (
        opinions[opinions["topic"].isin(SUBSTANTIVE_TOPICS)]
        .groupby(["topic", "user_role"])
        .size()
        .unstack(fill_value=0)
        .reindex(columns=role_order, fill_value=0)
    )
    pivot_norm = pivot.div(pivot.sum(axis=1), axis=0)
    pivot_norm = pivot_norm.reindex(SUBSTANTIVE_TOPICS, fill_value=0)

    fig, ax = plt.subplots(figsize=(11, 5))
    fig.subplots_adjust(top=0.82, left=0.28, right=0.92)

    left = np.zeros(len(pivot_norm))
    for role in role_order:
        vals = pivot_norm[role].values if role in pivot_norm.columns else np.zeros(len(pivot_norm))
        ax.barh([TOPIC_LABELS[t] for t in SUBSTANTIVE_TOPICS], vals, left=left,
                color=role_colors[role], label=role.capitalize(), height=0.6)
        left += vals

    ax.xaxis.set_major_formatter(plt.FuncFormatter(lambda v, _: f"{v:.0%}"))
    ax.set_xlabel("Share of posts")
    ax.set_xlim(0, 1.0)
    ax.legend(loc="lower right", fontsize=9, framealpha=0.7)

    _title_block(
        fig,
        "Chart 23 — User role split per topic",
        "Stacked share of author / reader / observer / mixed / unknown per topic.",
    )
    _save(fig, "23_user_role_split.png")


# ═══════════════════════════════════════════════════════════════════════════════
# Chart 24 — VADER sentiment vs. post score (scatter)
# ═══════════════════════════════════════════════════════════════════════════════

def chart_sentiment_vs_score(corpus_topics: pd.DataFrame, vader: pd.DataFrame,
                              corpus: pd.DataFrame) -> None:
    posts = corpus[corpus["kind"] == "post"][["doc_id", "score"]].copy()
    posts = posts.drop_duplicates("doc_id")
    merged = (
        posts
        .merge(corpus_topics[["doc_id", "topic"]], on="doc_id", how="inner")
        .merge(vader[["doc_id", "vader_compound"]], on="doc_id", how="inner")
    )
    merged = merged[
        merged["vader_compound"].notna() &
        merged["topic"].isin(SUBSTANTIVE_TOPICS) &
        (merged["score"] > 0)
    ]

    fig, ax = plt.subplots(figsize=(11, 7))
    fig.subplots_adjust(top=0.82, left=0.10, right=0.92)

    for topic in SUBSTANTIVE_TOPICS:
        sub = merged[merged["topic"] == topic]
        ax.scatter(
            sub["vader_compound"],
            np.log1p(sub["score"]),
            color=TOPIC_COLORS[topic],
            alpha=0.5,
            s=25,
            label=TOPIC_LABELS[topic],
        )

    ax.set_xlabel("VADER compound score")
    ax.set_ylabel("log(1 + post score)")
    ax.legend(fontsize=9)
    ax.axvline(0, color="#bdc3c7", linewidth=1, linestyle="--", zorder=0)

    _title_block(
        fig,
        "Chart 24 — Sentiment vs. post score",
        f"Each point is one post (N={len(merged):,}). X = VADER compound, Y = log(1+score).",
    )
    _save(fig, "24_sentiment_vs_score.png")


# ── Run ───────────────────────────────────────────────────────────────────────

def main() -> None:
    print("Loading data…")
    corpus_topics = pd.read_parquet(ROOT / "data" / "corpus_wattpad_topics.parquet")
    vader         = pd.read_parquet(ROOT / "data" / "corpus_wattpad_vader_v2.parquet")
    opinions      = pd.read_parquet(ROOT / "data" / "post_opinions.parquet")
    themes        = pd.read_parquet(ROOT / "data" / "themes.parquet")
    corpus        = pd.read_parquet(ROOT / "data" / "corpus_wattpad_full.parquet")

    print("Generating charts 20–24…")
    chart_sentiment_by_topic(corpus_topics, vader)
    chart_top_themes_grid(themes)
    chart_competitor_mentions(opinions)
    chart_user_role_split(opinions)
    chart_sentiment_vs_score(corpus_topics, vader, corpus)

    print(f"\nDone. Charts saved to {OUT.relative_to(ROOT)}/")


if __name__ == "__main__":
    main()
