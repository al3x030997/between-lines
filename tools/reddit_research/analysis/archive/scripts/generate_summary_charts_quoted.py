"""Charts 25–30 with verbatim quotes and author attribution.

Quotes are extracted directly from source post bodies via quote_extractor.py.
Every quote is stored in data/quotes_registry.json for anti-hallucination tests.

Usage:
    python analysis/generate_summary_charts_quoted.py
"""
from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "src"))

import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import numpy as np
import pandas as pd

from quote_extractor import (
    find_quote_for_theme,
    find_quote_by_platform,
    find_quote_for_topic_sentiment,
    find_quote,
    register,
    load_registry,
    save_registry,
    fmt,
    Quote,
)

OUT = ROOT / "analysis" / "charts"
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

C_TEXT   = "#2c3e50"
C_SUB    = "#7f8c8d"
C_QUOTE  = "#4a4a6a"
C_QBG    = "#f7f7fb"

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
    fig.text(x, 0.98, title, fontsize=13, fontweight="bold", va="top", color=C_TEXT)
    fig.text(x, 0.945, subtitle, fontsize=9, va="top", color=C_SUB, wrap=True, linespacing=1.5)


def _save(fig, name: str) -> None:
    path = OUT / name
    fig.savefig(path, dpi=150, bbox_inches="tight")
    plt.close(fig)
    print(f"  saved → {path.relative_to(ROOT)}")


def _add_quote_strip(
    fig: plt.Figure,
    quotes: list[Quote | None],
    labels: list[str],
    y_bottom: float = 0.01,
    strip_height: float = 0.20,
) -> None:
    """Draw a row of quote boxes along the bottom of the figure."""
    n = len(quotes)
    if n == 0:
        return
    col_w = 0.92 / n
    x0 = 0.04

    for i, (q, label) in enumerate(zip(quotes, labels)):
        xl = x0 + i * col_w
        ax_q = fig.add_axes([xl, y_bottom, col_w - 0.01, strip_height])
        ax_q.set_xlim(0, 1)
        ax_q.set_ylim(0, 1)
        ax_q.axis("off")

        # Background box
        ax_q.add_patch(mpatches.FancyBboxPatch(
            (0.02, 0.04), 0.96, 0.92,
            boxstyle="round,pad=0.02",
            facecolor=C_QBG, edgecolor="#d0d0e0", linewidth=0.8,
        ))

        # Label (theme name)
        ax_q.text(0.5, 0.92, label, ha="center", va="top",
                  fontsize=7.5, fontweight="bold", color=C_TEXT,
                  transform=ax_q.transAxes)

        if q is None:
            ax_q.text(0.5, 0.55, "(no quote found)", ha="center", va="center",
                      fontsize=7, color=C_SUB, style="italic",
                      transform=ax_q.transAxes)
            continue

        text = q["text"]
        if len(text) > 130:
            text = text[:129] + "…"

        ax_q.text(0.5, 0.68, f'"{text}"',
                  ha="center", va="top",
                  fontsize=7, color=C_QUOTE, style="italic",
                  wrap=True, transform=ax_q.transAxes,
                  multialignment="center",
                  bbox=dict(boxstyle="square,pad=0", fc="none", ec="none"))

        ax_q.text(0.5, 0.08, f"— u/{q['author']}",
                  ha="center", va="bottom",
                  fontsize=6.5, color=C_SUB,
                  transform=ax_q.transAxes)


# ═══════════════════════════════════════════════════════════════════════════════
# Chart 25 — Top gaps and criticisms
# ═══════════════════════════════════════════════════════════════════════════════

def chart_top_gaps_criticisms(themes: pd.DataFrame, corpus: pd.DataFrame,
                               registry: dict) -> None:
    df = themes[themes["category"].isin(["gap", "criticism"])].copy()
    df = df.sort_values("size", ascending=False).head(11)
    df = df.sort_values("size", ascending=True)

    def row_label(row):
        short = {"community_culture": "community", "author_writing_experience": "author",
                 "platform_comparison": "platform", "reader_experience": "reader"}
        return f"{row['label']}  [{short.get(row['topic'], row['topic'])}]"

    labels = df.apply(row_label, axis=1).tolist()
    sizes  = df["size"].tolist()
    colors = [CAT_COLORS[c] for c in df["category"]]

    # Collect quotes for top 4 themes
    top4 = df.tail(4).iloc[::-1]  # largest 4, in descending order
    quote_list: list[Quote | None] = []
    quote_labels: list[str] = []
    for _, row in top4.iterrows():
        q = find_quote_for_theme(row, corpus)
        key = f"{row['topic']}__{row['label']}"
        if q:
            register(registry, "chart_25", key, q)
        quote_list.append(q)
        quote_labels.append(row["label"][:35])

    fig = plt.figure(figsize=(13, 9))
    fig.subplots_adjust(top=0.88, left=0.42, right=0.92, bottom=0.28)
    ax = fig.add_subplot(111)

    bars = ax.barh(labels, sizes, color=colors, height=0.65)
    for bar, n in zip(bars, sizes):
        ax.text(bar.get_width() + 0.15, bar.get_y() + bar.get_height() / 2,
                str(n), va="center", fontsize=9, color=C_SUB)
    ax.set_xlabel("Phrases in cluster")
    ax.set_xlim(0, max(sizes) * 1.18)

    legend = [
        mpatches.Patch(color=CAT_COLORS["gap"],       label="Gap (unmet need)"),
        mpatches.Patch(color=CAT_COLORS["criticism"], label="Criticism (dislike)"),
    ]
    ax.legend(handles=legend, fontsize=9, loc="lower right")

    _title_block(fig,
        "Chart 25 — What Wattpad users complain about most",
        "Top clustered gaps and criticisms by phrase count. "
        "Organic discovery and ad overload dominate across both author and community topics.")

    # Quote strip at bottom
    _add_quote_strip(fig, quote_list, quote_labels, y_bottom=0.02, strip_height=0.22)
    _save(fig, "25q_top_gaps_criticisms.png")


# ═══════════════════════════════════════════════════════════════════════════════
# Chart 26 — Praise deficit
# ═══════════════════════════════════════════════════════════════════════════════

def chart_praise_deficit(opinions: pd.DataFrame, themes: pd.DataFrame,
                          corpus: pd.DataFrame, registry: dict) -> None:
    records = []
    for _, row in opinions[opinions["topic"].isin(SUBSTANTIVE_TOPICS)].iterrows():
        for _ in row["praises"]:    records.append({"topic": row["topic"], "category": "praise"})
        for _ in row["criticisms"]: records.append({"topic": row["topic"], "category": "criticism"})
        for _ in row["gaps"]:       records.append({"topic": row["topic"], "category": "gap"})

    pivot = (
        pd.DataFrame(records).groupby(["topic", "category"]).size()
        .unstack(fill_value=0)
        .reindex(columns=["praise", "criticism", "gap"], fill_value=0)
        .reindex(SUBSTANTIVE_TOPICS, fill_value=0)
    )

    # Find one real praise quote (generic-sounding) and one sharp criticism
    praise_theme = themes[(themes["category"] == "praise") & (themes["topic"] == "author_writing_experience")].nlargest(1, "size").iloc[0]
    crit_theme   = themes[(themes["category"] == "criticism") & (themes["topic"] == "community_culture")].nlargest(1, "size").iloc[0]

    q_praise = find_quote_for_theme(praise_theme, corpus, extra_keywords=["love", "great", "good", "helpful"])
    q_crit   = find_quote_for_theme(crit_theme,   corpus, extra_keywords=["money", "paid", "algorithm", "ads"])

    if q_praise: register(registry, "chart_26", "top_praise", q_praise)
    if q_crit:   register(registry, "chart_26", "top_criticism", q_crit)

    fig = plt.figure(figsize=(12, 9))
    fig.subplots_adjust(top=0.88, left=0.12, right=0.92, bottom=0.28)
    ax = fig.add_subplot(111)

    x      = np.arange(len(SUBSTANTIVE_TOPICS))
    width  = 0.24
    offset = np.array([-1, 0, 1]) * width

    for i, cat in enumerate(["praise", "criticism", "gap"]):
        vals = pivot[cat].values if cat in pivot.columns else np.zeros(len(SUBSTANTIVE_TOPICS))
        bars = ax.bar(x + offset[i], vals, width=width * 0.9,
                      color=CAT_COLORS[cat], label=cat.capitalize())
        for bar, v in zip(bars, vals):
            if v > 0:
                ax.text(bar.get_x() + bar.get_width() / 2, bar.get_height() + 1,
                        str(v), ha="center", va="bottom", fontsize=8, color=C_SUB)

    ax.set_xticks(x)
    ax.set_xticklabels([TOPIC_LABELS[t].replace("\n", " ") for t in SUBSTANTIVE_TOPICS])
    ax.set_ylabel("Total phrases extracted")
    ax.legend(fontsize=9)
    ax.grid(axis="x", visible=False)
    ax.grid(axis="y", alpha=0.3, linestyle="--")

    _title_block(fig,
        "Chart 26 — Praise vs. criticism vs. gaps per topic",
        "Raw phrase counts from LLM extraction. Praise (green) is consistently thin "
        "relative to criticism and unmet needs across all topics.")

    _add_quote_strip(fig,
        [q_praise, q_crit],
        ["What passes for praise", "What criticism looks like"],
        y_bottom=0.02, strip_height=0.22)
    _save(fig, "26q_praise_deficit.png")


# ═══════════════════════════════════════════════════════════════════════════════
# Chart 27 — Rival platform mentions
# ═══════════════════════════════════════════════════════════════════════════════

def chart_rival_platforms(opinions: pd.DataFrame, corpus: pd.DataFrame,
                           registry: dict) -> None:
    exploded = opinions.explode("mentioned_platforms")
    exploded = exploded[
        exploded["mentioned_platforms"].notna() &
        (exploded["mentioned_platforms"].str.lower() != "wattpad") &
        (exploded["mentioned_platforms"] != "")
    ]
    counts = exploded["mentioned_platforms"].str.lower().value_counts().head(12)

    q_ao3 = find_quote_by_platform("ao3", opinions, corpus)
    q_ffn = find_quote_by_platform("fanfiction.net", opinions, corpus)
    q_tumblr = find_quote_by_platform("tumblr", opinions, corpus)

    if q_ao3:    register(registry, "chart_27", "ao3",           q_ao3)
    if q_ffn:    register(registry, "chart_27", "fanfiction.net", q_ffn)
    if q_tumblr: register(registry, "chart_27", "tumblr",        q_tumblr)

    fig = plt.figure(figsize=(12, 9))
    fig.subplots_adjust(top=0.88, left=0.22, right=0.92, bottom=0.28)
    ax = fig.add_subplot(111)

    colors = ["#e74c3c" if p == "ao3" else "#95a5a6" for p in counts.index]
    bars = ax.barh(counts.index[::-1], counts.values[::-1],
                   color=colors[::-1], height=0.6)
    for bar, n in zip(bars, counts.values[::-1]):
        ax.text(bar.get_width() + 0.3, bar.get_y() + bar.get_height() / 2,
                str(n), va="center", fontsize=9, color=C_SUB)
    ax.set_xlabel("Posts mentioning platform")
    ax.set_xlim(0, counts.max() * 1.18)

    ao3_val    = counts.get("ao3", 0)
    second_val = counts.iloc[1] if len(counts) > 1 else 1
    ax.annotate(f"AO3 is {ao3_val / max(second_val, 1):.1f}× more than #2",
                xy=(ao3_val, len(counts) - 1),
                xytext=(ao3_val * 0.5, len(counts) - 2.4),
                fontsize=8.5, color="#e74c3c",
                arrowprops=dict(arrowstyle="->", color="#e74c3c", lw=1.2))

    _title_block(fig,
        "Chart 27 — Where Wattpad users go: rival platform mentions",
        "Wattpad self-references excluded. AO3 dominates as the named alternative.")

    _add_quote_strip(fig,
        [q_ao3, q_ffn, q_tumblr],
        ["On AO3", "On fanfiction.net", "On Tumblr"],
        y_bottom=0.02, strip_height=0.22)
    _save(fig, "27q_rival_platforms.png")


# ═══════════════════════════════════════════════════════════════════════════════
# Chart 28 — Sentiment by topic (bar)
# ═══════════════════════════════════════════════════════════════════════════════

def chart_sentiment_bar(corpus_topics: pd.DataFrame, vader: pd.DataFrame,
                         corpus: pd.DataFrame, registry: dict) -> None:
    merged = (
        corpus_topics[corpus_topics["topic"].isin(SUBSTANTIVE_TOPICS)]
        .merge(vader[["doc_id", "vader_compound"]], on="doc_id", how="inner")
        .dropna(subset=["vader_compound"])
    )
    medians = merged.groupby("topic")["vader_compound"].median().reindex(SUBSTANTIVE_TOPICS).sort_values()

    q_low  = find_quote_for_topic_sentiment("community_culture",       corpus_topics, vader, corpus, low=True)
    q_high = find_quote_for_topic_sentiment("author_writing_experience", corpus_topics, vader, corpus, low=False)

    if q_low:  register(registry, "chart_28", "lowest_sentiment_community", q_low)
    if q_high: register(registry, "chart_28", "highest_sentiment_author",   q_high)

    fig = plt.figure(figsize=(10, 8))
    fig.subplots_adjust(top=0.88, left=0.26, right=0.88, bottom=0.28)
    ax = fig.add_subplot(111)

    colors = [TOPIC_COLORS[t] for t in medians.index]
    bars = ax.barh([TOPIC_LABELS[t] for t in medians.index],
                   medians.values, color=colors, height=0.55)
    ax.axvline(0, color="#bdc3c7", lw=1.2, linestyle="--", zorder=0)
    for bar, v in zip(bars, medians.values):
        xpos = bar.get_width() + 0.005 if v >= 0 else bar.get_width() - 0.005
        ha   = "left" if v >= 0 else "right"
        ax.text(xpos, bar.get_y() + bar.get_height() / 2,
                f"{v:+.2f}", va="center", ha=ha, fontsize=9, color=C_SUB)
    ax.set_xlabel("Median VADER compound score")
    ax.set_xlim(-0.1, 0.6)

    _title_block(fig,
        "Chart 28 — Sentiment by topic (median VADER)",
        "Community & culture is the most negative — platform-level disillusionment, "
        "not specific feature complaints.")

    _add_quote_strip(fig,
        [q_low, q_high],
        ["Community & culture (most negative)", "Author experience (most positive)"],
        y_bottom=0.02, strip_height=0.22)
    _save(fig, "28q_sentiment_by_topic.png")


# ═══════════════════════════════════════════════════════════════════════════════
# Chart 29 — Post scores by topic
# ═══════════════════════════════════════════════════════════════════════════════

def chart_post_scores(corpus: pd.DataFrame, labels_df: pd.DataFrame,
                       registry: dict) -> None:
    posts = corpus[corpus["kind"] == "post"].drop_duplicates("doc_id")
    posts = posts.merge(labels_df[["doc_id", "topic"]], on="doc_id", how="inner")
    posts = posts[posts["topic"].isin(SUBSTANTIVE_TOPICS)]

    # Quote from the top post in each of 2 most interesting topics
    top_author = posts[posts["topic"] == "author_writing_experience"].nlargest(1, "score").iloc[0]
    top_platform = posts[posts["topic"] == "platform_comparison"].nlargest(1, "score").iloc[0]

    q_author = find_quote(
        [top_author["doc_id"]],
        ["wattpad", "write", "story", "reader", "chapter"],
        corpus, min_score=0,
    )
    q_platform = find_quote(
        [top_platform["doc_id"]],
        ["wattpad", "ao3", "tried", "platform", "community"],
        corpus, min_score=0,
    )

    if q_author:   register(registry, "chart_29", "top_author_post",   q_author)
    if q_platform: register(registry, "chart_29", "top_platform_post", q_platform)

    fig = plt.figure(figsize=(12, 8.5))
    fig.subplots_adjust(top=0.88, left=0.24, right=0.88, bottom=0.28)
    ax = fig.add_subplot(111)

    y_positions = {t: i for i, t in enumerate(SUBSTANTIVE_TOPICS)}
    for topic in SUBSTANTIVE_TOPICS:
        sub   = posts[posts["topic"] == topic]["score"]
        y     = y_positions[topic]
        color = TOPIC_COLORS[topic]

        ax.scatter(sub, np.full(len(sub), y), color=color, alpha=0.25, s=18, zorder=2)
        med = sub.median()
        ax.plot([med, med], [y - 0.25, y + 0.25], color=color, lw=2.5, zorder=3)
        ax.text(med, y + 0.32, f"med {med:.0f}", ha="center", va="bottom", fontsize=8, color=color)
        top3 = sub.nlargest(3)
        ax.scatter(top3, np.full(len(top3), y), color=color, s=60, zorder=4,
                   edgecolors="white", lw=0.8)
        ax.text(sub.max() + 200, y, f"{sub.max():,}", va="center", fontsize=8.5,
                color=color, fontweight="bold")

    ax.set_yticks(list(y_positions.values()))
    ax.set_yticklabels([TOPIC_LABELS[t].replace("\n", " ") for t in SUBSTANTIVE_TOPICS])
    ax.set_xlabel("Post score (upvotes)")

    _title_block(fig,
        "Chart 29 — Post score distribution by topic",
        "Each dot is one post. Tick = median. Author experience's 28k+ post dwarfs every other topic.")

    _add_quote_strip(fig,
        [q_author, q_platform],
        [f"Top author post ({top_author['score']:,} pts)",
         f"Top platform post ({top_platform['score']:,} pts)"],
        y_bottom=0.02, strip_height=0.22)
    _save(fig, "29q_post_scores.png")


# ═══════════════════════════════════════════════════════════════════════════════
# Chart 30 — Clustering rate
# ═══════════════════════════════════════════════════════════════════════════════

def chart_clustering_rate(opinions: pd.DataFrame, themes: pd.DataFrame,
                           corpus: pd.DataFrame, registry: dict) -> None:
    records = []
    for _, row in opinions[opinions["topic"].isin(SUBSTANTIVE_TOPICS)].iterrows():
        for p in row["praises"]:    records.append({"topic": row["topic"], "category": "praise",    "doc_id": row["doc_id"]})
        for p in row["criticisms"]: records.append({"topic": row["topic"], "category": "criticism", "doc_id": row["doc_id"]})
        for p in row["gaps"]:       records.append({"topic": row["topic"], "category": "gap",       "doc_id": row["doc_id"]})

    long_df   = pd.DataFrame(records)
    total     = long_df.groupby(["topic", "category"]).size().rename("total")
    clustered = themes.groupby(["topic", "category"])["size"].sum().rename("clustered")
    frag = pd.concat([total, clustered], axis=1).fillna(0)
    frag["pct"] = (frag["clustered"] / frag["total"] * 100).round(1)
    frag = frag.reset_index()

    # Quotes: one from reader_experience (fragmented) and one from community_culture/gap (convergent)
    reader_doc_ids = long_df[long_df["topic"] == "reader_experience"]["doc_id"].unique().tolist()
    q_reader = find_quote(reader_doc_ids,
                          ["wattpad", "read", "book", "story", "comment", "ad", "app"],
                          corpus, min_score=1.0)
    comm_gap_theme = themes[(themes["topic"] == "community_culture") & (themes["category"] == "gap")].nlargest(1, "size").iloc[0]
    q_comm = find_quote_for_theme(comm_gap_theme, corpus)

    if q_reader: register(registry, "chart_30", "reader_experience_fragmented", q_reader)
    if q_comm:   register(registry, "chart_30", "community_gap_convergent",     q_comm)

    cats   = ["criticism", "gap", "praise"]
    topics = SUBSTANTIVE_TOPICS
    x      = np.arange(len(topics))
    width  = 0.24

    fig = plt.figure(figsize=(13, 9))
    fig.subplots_adjust(top=0.88, left=0.10, right=0.92, bottom=0.28)
    ax = fig.add_subplot(111)

    offsets = np.array([-1, 0, 1]) * width
    for i, cat in enumerate(cats):
        sub = frag[frag["category"] == cat].set_index("topic").reindex(topics)
        total_vals     = sub["total"].fillna(0).values
        clustered_vals = sub["clustered"].fillna(0).values
        unclustered    = total_vals - clustered_vals

        ax.bar(x + offsets[i], clustered_vals, width=width * 0.88,
               color=CAT_COLORS[cat], zorder=3)
        ax.bar(x + offsets[i], unclustered, width=width * 0.88,
               bottom=clustered_vals, color=CAT_COLORS[cat], alpha=0.18,
               hatch="///", zorder=2)

        for j, (c_val, t_val) in enumerate(zip(clustered_vals, total_vals)):
            if t_val > 0:
                pct = c_val / t_val * 100
                ax.text(x[j] + offsets[i], t_val + 1, f"{pct:.0f}%",
                        ha="center", va="bottom", fontsize=7.5, color=C_SUB)

    ax.set_xticks(x)
    ax.set_xticklabels([TOPIC_LABELS[t].replace("\n", " ") for t in topics])
    ax.set_ylabel("Phrase count")

    legend_handles = [
        mpatches.Patch(color=CAT_COLORS["criticism"], label="Criticism"),
        mpatches.Patch(color=CAT_COLORS["gap"],       label="Gap"),
        mpatches.Patch(color=CAT_COLORS["praise"],    label="Praise"),
        mpatches.Patch(color="#aaaaaa", alpha=0.3, hatch="///", label="Long-tail (not clustered)"),
    ]
    ax.legend(handles=legend_handles, fontsize=9, loc="upper right")

    _title_block(fig,
        "Chart 30 — Phrase clustering rate by topic and category",
        "Solid = clustered (≥3 phrases). Hatched = long-tail. "
        "Reader experience: 0% across all categories — complaints are too personal to converge.")

    _add_quote_strip(fig,
        [q_reader, q_comm],
        ["A reader complaint (unique, won't cluster)", "A community gap (one of 16 saying the same thing)"],
        y_bottom=0.02, strip_height=0.22)
    _save(fig, "30q_clustering_rate.png")


# ── Main ──────────────────────────────────────────────────────────────────────

def main() -> None:
    print("Loading data…")
    themes        = pd.read_parquet(ROOT / "data" / "themes.parquet")
    opinions      = pd.read_parquet(ROOT / "data" / "post_opinions.parquet")
    corpus_topics = pd.read_parquet(ROOT / "data" / "corpus_wattpad_topics.parquet")
    vader         = pd.read_parquet(ROOT / "data" / "corpus_wattpad_vader_v2.parquet")
    corpus        = pd.read_parquet(ROOT / "data" / "corpus_wattpad_full.parquet")
    labels_df     = pd.read_parquet(ROOT / "data" / "topic_labels.parquet")

    # Deduplicate corpus for quote lookup (keep one row per doc_id)
    corpus_posts  = corpus[corpus["kind"] == "post"].drop_duplicates("doc_id")

    registry = load_registry()

    print("Generating quoted charts 25–30…")
    chart_top_gaps_criticisms(themes, corpus_posts, registry)
    chart_praise_deficit(opinions, themes, corpus_posts, registry)
    chart_rival_platforms(opinions, corpus_posts, registry)
    chart_sentiment_bar(corpus_topics, vader, corpus_posts, registry)
    chart_post_scores(corpus_posts, labels_df, registry)
    chart_clustering_rate(opinions, themes, corpus_posts, registry)

    save_registry(registry)
    total = sum(len(v) for v in registry.values())
    print(f"\nRegistry: {total} quotes saved → data/quotes_registry.json")
    print(f"Done. Charts saved to {OUT.relative_to(ROOT)}/")


if __name__ == "__main__":
    main()
