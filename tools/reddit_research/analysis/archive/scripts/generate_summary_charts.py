"""Charts 25–30: supporting the Wattpad findings summary.

Each chart is tied to one specific claim in the written analysis.

Usage:
    python analysis/generate_summary_charts.py
"""
from __future__ import annotations

from pathlib import Path

import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import numpy as np
import pandas as pd

ROOT = Path(__file__).resolve().parent.parent
OUT  = ROOT / "analysis" / "charts"
OUT.mkdir(parents=True, exist_ok=True)

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
    "platform_comparison":       "Platform\ncomparison",
    "author_writing_experience": "Author\nexperience",
    "reader_experience":         "Reader\nexperience",
    "community_culture":         "Community\n& culture",
}
TOPIC_COLORS = {
    "platform_comparison":       "#2980b9",
    "author_writing_experience": "#27ae60",
    "reader_experience":         "#e67e22",
    "community_culture":         "#8e44ad",
}
CAT_COLORS = {
    "praise":    "#27ae60",
    "criticism": "#e74c3c",
    "gap":       "#e67e22",
}


def _title_block(fig, title: str, subtitle: str, x: float = 0.05) -> None:
    fig.text(x, 0.97, title, fontsize=13, fontweight="bold", va="top", color=C_TEXT)
    fig.text(x, 0.925, subtitle, fontsize=9, va="top", color=C_SUB, wrap=True, linespacing=1.5)


def _save(fig, name: str) -> None:
    path = OUT / name
    fig.savefig(path, dpi=150, bbox_inches="tight")
    plt.close(fig)
    print(f"  saved → {path.relative_to(ROOT)}")


# ═══════════════════════════════════════════════════════════════════════════════
# Chart 25 — Top gaps and criticisms by cluster size
# Claim: "The dominant complaint is monetization, not features"
# ═══════════════════════════════════════════════════════════════════════════════

def chart_top_gaps_criticisms(themes: pd.DataFrame) -> None:
    df = themes[themes["category"].isin(["gap", "criticism"])].copy()
    df = df.sort_values("size", ascending=False).head(14)
    df = df.sort_values("size", ascending=True)  # ascending for horizontal bar

    # Clean up label + annotate topic
    def row_label(row):
        topic_short = {
            "community_culture":         "community",
            "author_writing_experience": "author",
            "platform_comparison":       "platform",
            "reader_experience":         "reader",
        }.get(row["topic"], row["topic"])
        return f"{row['label']}  [{topic_short}]"

    labels = df.apply(row_label, axis=1).tolist()
    sizes  = df["size"].tolist()
    colors = [CAT_COLORS[c] for c in df["category"]]

    fig, ax = plt.subplots(figsize=(12, 6))
    fig.subplots_adjust(top=0.82, left=0.42, right=0.92)

    bars = ax.barh(labels, sizes, color=colors, height=0.65)
    for bar, n in zip(bars, sizes):
        ax.text(bar.get_width() + 0.2, bar.get_y() + bar.get_height() / 2,
                str(n), va="center", fontsize=9, color=C_SUB)

    ax.set_xlabel("Phrases in cluster")
    ax.set_xlim(0, max(sizes) * 1.18)

    legend = [
        mpatches.Patch(color=CAT_COLORS["gap"],       label="Gap (unmet need)"),
        mpatches.Patch(color=CAT_COLORS["criticism"], label="Criticism (dislike)"),
    ]
    ax.legend(handles=legend, fontsize=9, loc="lower right")

    _title_block(
        fig,
        "Chart 25 — What Wattpad users complain about most",
        "Top clustered gaps and criticisms ranked by phrase count. "
        "Organic discovery and ad overload dominate at every topic level.",
    )
    _save(fig, "25_top_gaps_criticisms.png")


# ═══════════════════════════════════════════════════════════════════════════════
# Chart 26 — Praise vs criticism+gap balance per topic
# Claim: "The praise signal is weak and generic"
# ═══════════════════════════════════════════════════════════════════════════════

def chart_praise_deficit(opinions: pd.DataFrame) -> None:
    records = []
    for _, row in opinions[opinions["topic"].isin(SUBSTANTIVE_TOPICS)].iterrows():
        for _ in row["praises"]:
            records.append({"topic": row["topic"], "category": "praise"})
        for _ in row["criticisms"]:
            records.append({"topic": row["topic"], "category": "criticism"})
        for _ in row["gaps"]:
            records.append({"topic": row["topic"], "category": "gap"})

    df = pd.DataFrame(records)
    pivot = (
        df.groupby(["topic", "category"]).size()
        .unstack(fill_value=0)
        .reindex(columns=["praise", "criticism", "gap"], fill_value=0)
        .reindex(SUBSTANTIVE_TOPICS, fill_value=0)
    )

    fig, ax = plt.subplots(figsize=(11, 5))
    fig.subplots_adjust(top=0.82, left=0.24, right=0.92)

    x      = np.arange(len(SUBSTANTIVE_TOPICS))
    width  = 0.24
    cats   = ["praise", "criticism", "gap"]
    offset = np.array([-1, 0, 1]) * width

    for i, cat in enumerate(cats):
        vals = pivot[cat].values if cat in pivot.columns else np.zeros(len(SUBSTANTIVE_TOPICS))
        bars = ax.bar(x + offset[i], vals, width=width * 0.9,
                      color=CAT_COLORS[cat], label=cat.capitalize())
        for bar, v in zip(bars, vals):
            if v > 0:
                ax.text(bar.get_x() + bar.get_width() / 2, bar.get_height() + 1,
                        str(v), ha="center", va="bottom", fontsize=8, color=C_SUB)

    ax.set_xticks(x)
    ax.set_xticklabels([TOPIC_LABELS[t] for t in SUBSTANTIVE_TOPICS])
    ax.set_ylabel("Total phrases extracted")
    ax.legend(fontsize=9)
    ax.grid(axis="x", visible=False)
    ax.grid(axis="y", alpha=0.3, linestyle="--")

    _title_block(
        fig,
        "Chart 26 — Praise vs. criticism vs. gaps per topic",
        "Raw phrase counts from LLM extraction. Praise (green) is consistently thin "
        "relative to criticism and unmet needs across all topics.",
    )
    _save(fig, "26_praise_deficit.png")


# ═══════════════════════════════════════════════════════════════════════════════
# Chart 27 — Rival platform mentions (excluding Wattpad self-references)
# Claim: "AO3 is the primary escape hatch"
# ═══════════════════════════════════════════════════════════════════════════════

def chart_rival_platforms(opinions: pd.DataFrame) -> None:
    exploded = opinions.explode("mentioned_platforms")
    exploded = exploded[
        exploded["mentioned_platforms"].notna() &
        (exploded["mentioned_platforms"].str.lower() != "wattpad") &
        (exploded["mentioned_platforms"] != "")
    ]
    counts = exploded["mentioned_platforms"].str.lower().value_counts().head(12)
    if counts.empty:
        print("  chart 27: no rival mentions, skipping")
        return

    fig, ax = plt.subplots(figsize=(11, 5))
    fig.subplots_adjust(top=0.82, left=0.22, right=0.92)

    colors = ["#e74c3c" if p == "ao3" else "#95a5a6" for p in counts.index]
    bars = ax.barh(counts.index[::-1], counts.values[::-1],
                   color=colors[::-1], height=0.6)
    for bar, n in zip(bars, counts.values[::-1]):
        ax.text(bar.get_width() + 0.3, bar.get_y() + bar.get_height() / 2,
                str(n), va="center", fontsize=9, color=C_SUB)

    ax.set_xlabel("Posts mentioning platform")
    ax.set_xlim(0, counts.max() * 1.18)

    # Annotate AO3 gap
    ao3_val = counts.get("ao3", 0)
    second_val = counts.iloc[1] if len(counts) > 1 else 0
    ax.annotate(
        f"AO3 is mentioned {ao3_val / max(second_val, 1):.1f}× more than #2",
        xy=(ao3_val, len(counts) - 1),
        xytext=(ao3_val * 0.55, len(counts) - 2.2),
        fontsize=8.5, color="#e74c3c",
        arrowprops=dict(arrowstyle="->", color="#e74c3c", lw=1.2),
    )

    _title_block(
        fig,
        "Chart 27 — Where Wattpad users go: rival platform mentions",
        "Self-references to Wattpad excluded. AO3 overwhelmingly dominates as the named alternative.",
    )
    _save(fig, "27_rival_platforms.png")


# ═══════════════════════════════════════════════════════════════════════════════
# Chart 28 — Median VADER sentiment by topic
# Claim: "Community & Culture has the lowest sentiment"
# ═══════════════════════════════════════════════════════════════════════════════

def chart_sentiment_by_topic_bar(corpus_topics: pd.DataFrame, vader: pd.DataFrame) -> None:
    merged = (
        corpus_topics[corpus_topics["topic"].isin(SUBSTANTIVE_TOPICS)]
        .merge(vader[["doc_id", "vader_compound"]], on="doc_id", how="inner")
        .dropna(subset=["vader_compound"])
    )
    medians = (
        merged.groupby("topic")["vader_compound"]
        .median()
        .reindex(SUBSTANTIVE_TOPICS)
    )
    # Sort ascending so worst is at bottom
    medians = medians.sort_values()

    fig, ax = plt.subplots(figsize=(9, 4.5))
    fig.subplots_adjust(top=0.82, left=0.26, right=0.88)

    colors = [TOPIC_COLORS[t] for t in medians.index]
    bars = ax.barh(
        [TOPIC_LABELS[t] for t in medians.index],
        medians.values,
        color=colors, height=0.55,
    )
    ax.axvline(0, color="#bdc3c7", linewidth=1.2, linestyle="--", zorder=0)
    for bar, v in zip(bars, medians.values):
        xpos = bar.get_width() + 0.005 if v >= 0 else bar.get_width() - 0.005
        ha = "left" if v >= 0 else "right"
        ax.text(xpos, bar.get_y() + bar.get_height() / 2,
                f"{v:+.2f}", va="center", ha=ha, fontsize=9, color=C_SUB)

    ax.set_xlabel("Median VADER compound score")
    ax.set_xlim(-0.1, 0.6)

    _title_block(
        fig,
        "Chart 28 — Sentiment by topic (median VADER score)",
        "Community & culture discussions are the most negative on balance, "
        "consistent with platform-level disillusionment rather than specific feature complaints.",
    )
    _save(fig, "28_sentiment_by_topic_bar.png")


# ═══════════════════════════════════════════════════════════════════════════════
# Chart 29 — Top post scores per topic (dot chart)
# Claim: "Author experience contains the platform's most-upvoted posts"
# ═══════════════════════════════════════════════════════════════════════════════

def chart_post_scores(corpus: pd.DataFrame, labels: pd.DataFrame) -> None:
    posts = corpus[corpus["kind"] == "post"].drop_duplicates("doc_id")
    posts = posts.merge(labels[["doc_id", "topic"]], on="doc_id", how="inner")
    posts = posts[posts["topic"].isin(SUBSTANTIVE_TOPICS)]

    fig, ax = plt.subplots(figsize=(11, 5))
    fig.subplots_adjust(top=0.82, left=0.26, right=0.92, bottom=0.12)

    y_positions = {t: i for i, t in enumerate(SUBSTANTIVE_TOPICS)}

    for topic in SUBSTANTIVE_TOPICS:
        sub = posts[posts["topic"] == topic]["score"]
        y   = y_positions[topic]
        color = TOPIC_COLORS[topic]

        # All posts as faint dots
        ax.scatter(sub, np.full(len(sub), y), color=color, alpha=0.25, s=18, zorder=2)

        # Median as vertical tick
        med = sub.median()
        ax.plot([med, med], [y - 0.25, y + 0.25], color=color, lw=2.5, zorder=3)
        ax.text(med, y + 0.32, f"med {med:.0f}", ha="center", va="bottom", fontsize=8, color=color)

        # Top 3 as larger dots
        top3 = sub.nlargest(3)
        ax.scatter(top3, np.full(len(top3), y), color=color, s=60, zorder=4, edgecolors="white", lw=0.8)

        # Label #1 post
        top1 = sub.max()
        ax.text(top1 + 200, y, f"{top1:,}", va="center", fontsize=8.5,
                color=color, fontweight="bold")

    ax.set_yticks(list(y_positions.values()))
    ax.set_yticklabels([TOPIC_LABELS[t].replace("\n", " ") for t in SUBSTANTIVE_TOPICS])
    ax.set_xlabel("Post score (upvotes)")

    _title_block(
        fig,
        "Chart 29 — Post score distribution by topic",
        "Each dot is one post. Vertical tick = median. Largest dots = top 3 posts. "
        "Author experience has the highest-scoring post (28k+) by a wide margin.",
    )
    _save(fig, "29_post_scores_by_topic.png")


# ═══════════════════════════════════════════════════════════════════════════════
# Chart 30 — Phrase clustering rate by topic × category
# Claim: "Reader experience complaints are too fragmented to cluster"
# ═══════════════════════════════════════════════════════════════════════════════

def chart_clustering_rate(opinions: pd.DataFrame, themes: pd.DataFrame) -> None:
    records = []
    for _, row in opinions[opinions["topic"].isin(SUBSTANTIVE_TOPICS)].iterrows():
        for p in row["praises"]:
            if p: records.append({"topic": row["topic"], "category": "praise"})
        for p in row["criticisms"]:
            if p: records.append({"topic": row["topic"], "category": "criticism"})
        for p in row["gaps"]:
            if p: records.append({"topic": row["topic"], "category": "gap"})

    long_df  = pd.DataFrame(records)
    total    = long_df.groupby(["topic", "category"]).size().rename("total")
    clustered = themes.groupby(["topic", "category"])["size"].sum().rename("clustered")
    frag = pd.concat([total, clustered], axis=1).fillna(0)
    frag["pct"] = (frag["clustered"] / frag["total"] * 100).round(1)
    frag = frag.reset_index()

    cats   = ["criticism", "gap", "praise"]
    topics = SUBSTANTIVE_TOPICS
    x      = np.arange(len(topics))
    width  = 0.24
    offsets = np.array([-1, 0, 1]) * width

    fig, ax = plt.subplots(figsize=(12, 5.5))
    fig.subplots_adjust(top=0.82, left=0.10, right=0.92, bottom=0.14)

    for i, cat in enumerate(cats):
        sub = frag[frag["category"] == cat].set_index("topic").reindex(topics)
        total_vals    = sub["total"].fillna(0).values
        clustered_vals = sub["clustered"].fillna(0).values
        unclustered   = total_vals - clustered_vals

        # Stacked: clustered (solid) + unclustered (hatched/faint)
        bars_c = ax.bar(x + offsets[i], clustered_vals, width=width * 0.88,
                        color=CAT_COLORS[cat], label=f"{cat.capitalize()} (clustered)", zorder=3)
        ax.bar(x + offsets[i], unclustered, width=width * 0.88,
               bottom=clustered_vals, color=CAT_COLORS[cat], alpha=0.18,
               hatch="///", label=f"_{cat} long-tail", zorder=2)

        # Percentage label at the top of each bar
        for j, (c_val, t_val) in enumerate(zip(clustered_vals, total_vals)):
            if t_val > 0:
                pct = c_val / t_val * 100
                ax.text(x[j] + offsets[i], t_val + 1, f"{pct:.0f}%",
                        ha="center", va="bottom", fontsize=7.5, color=C_SUB)

    ax.set_xticks(x)
    ax.set_xticklabels([TOPIC_LABELS[t].replace("\n", " ") for t in topics])
    ax.set_ylabel("Phrase count")

    # Manual legend (skip _cat entries)
    legend_handles = [
        mpatches.Patch(color=CAT_COLORS["criticism"], label="Criticism"),
        mpatches.Patch(color=CAT_COLORS["gap"],       label="Gap"),
        mpatches.Patch(color=CAT_COLORS["praise"],    label="Praise"),
        mpatches.Patch(color="#aaaaaa", alpha=0.3, hatch="///", label="Long-tail (not clustered)"),
    ]
    ax.legend(handles=legend_handles, fontsize=9, loc="upper right")

    _title_block(
        fig,
        "Chart 30 — Phrase clustering rate by topic and category",
        "Solid = phrases that formed a theme cluster (≥3). Hatched = long-tail (too diverse to cluster). "
        "Reader experience: 0% across all categories — no shared pattern strong enough to cluster.",
    )
    _save(fig, "30_clustering_rate.png")


# ── Run ───────────────────────────────────────────────────────────────────────

def main() -> None:
    print("Loading data…")
    themes        = pd.read_parquet(ROOT / "data" / "themes.parquet")
    opinions      = pd.read_parquet(ROOT / "data" / "post_opinions.parquet")
    corpus_topics = pd.read_parquet(ROOT / "data" / "corpus_wattpad_topics.parquet")
    vader         = pd.read_parquet(ROOT / "data" / "corpus_wattpad_vader_v2.parquet")
    corpus        = pd.read_parquet(ROOT / "data" / "corpus_wattpad_full.parquet")
    labels        = pd.read_parquet(ROOT / "data" / "topic_labels.parquet")

    print("Generating summary charts 25–30…")
    chart_top_gaps_criticisms(themes)
    chart_praise_deficit(opinions)
    chart_rival_platforms(opinions)
    chart_sentiment_by_topic_bar(corpus_topics, vader)
    chart_post_scores(corpus, labels)
    chart_clustering_rate(opinions, themes)

    print(f"\nDone. Charts saved to {OUT.relative_to(ROOT)}/")


if __name__ == "__main__":
    main()
