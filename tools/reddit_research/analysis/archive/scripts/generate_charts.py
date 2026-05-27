"""Generate first-insight charts for the Wattpad corpus.

Saves PNGs to analysis/charts/.

Usage:
    python analysis/generate_charts.py
"""
from __future__ import annotations

from pathlib import Path

import matplotlib.pyplot as plt
import matplotlib.ticker as ticker
import numpy as np
import pandas as pd

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "analysis" / "charts"
OUT.mkdir(parents=True, exist_ok=True)

# ── Style ─────────────────────────────────────────────────────────────────────

plt.rcParams.update({
    "font.family": "sans-serif",
    "font.size": 11,
    "axes.spines.top": False,
    "axes.spines.right": False,
    "axes.grid": True,
    "axes.grid.axis": "x",
    "grid.alpha": 0.3,
    "grid.linestyle": "--",
})

C_AO3     = "#c0392b"   # red — AO3
C_WATTPAD = "#e67e22"   # orange — Wattpad
C_BLUE    = "#2980b9"   # neutral blue
C_GRAY    = "#95a5a6"
C_TEXT    = "#2c3e50"
C_SUB     = "#7f8c8d"

JUNK = {"s", "t", "m", "d", "r", "u", "y", "ve", "re", "ll", "nt",
        "don", "didn", "doesn", "isn", "wasn", "won", "aren", "haven", "couldn"}


def _title_block(fig, title: str, subtitle: str, x: float = 0.05) -> None:
    """Add a bold title + grey subtitle to the top of a figure."""
    fig.text(x, 0.97, title, fontsize=13, fontweight="bold", va="top", color=C_TEXT)
    fig.text(x, 0.925, subtitle, fontsize=9, va="top", color=C_SUB,
             wrap=True, linespacing=1.5)


def _save(fig: plt.Figure, name: str) -> None:
    path = OUT / name
    fig.savefig(path, dpi=150, bbox_inches="tight")
    plt.close(fig)
    print(f"  saved → {path.relative_to(ROOT)}")


# ── Load data ─────────────────────────────────────────────────────────────────

df     = pd.read_parquet(ROOT / "data" / "corpus_wattpad.parquet")
ngrams = pd.read_parquet(ROOT / "data" / "features_wattpad" / "ngrams_top.parquet")


# ═══════════════════════════════════════════════════════════════════════════════
# Chart 1 — Who is talking about Wattpad?
# ═══════════════════════════════════════════════════════════════════════════════

def chart1_subreddit_volume() -> None:
    posts_per_sub   = df[df["kind"] == "post"].groupby("subreddit").size().rename("posts")
    comments_per_sub = df[df["kind"] == "comment"].groupby("subreddit").size().rename("comments")

    sub_df = (
        pd.concat([posts_per_sub, comments_per_sub], axis=1)
        .fillna(0).astype(int)
        .assign(total=lambda x: x["posts"] + x["comments"])
        .sort_values("total", ascending=False)
        .head(15)
        .sort_values("total")           # ascending so top bar is at the top
    )

    fig, ax = plt.subplots(figsize=(11, 7))
    fig.subplots_adjust(top=0.82, left=0.22, right=0.92)

    ax.barh(sub_df.index, sub_df["comments"], color=C_BLUE,   label="Comments", height=0.65)
    ax.barh(sub_df.index, sub_df["posts"],    color=C_AO3,    label="Posts",
            left=sub_df["comments"], height=0.65, alpha=0.85)

    # Value labels
    for sub, row in sub_df.iterrows():
        ax.text(row["total"] + 15, sub, f'{row["total"]:,}',
                va="center", ha="left", fontsize=9, color=C_SUB)

    ax.set_xlabel("Documents (posts + comments)", labelpad=8)
    ax.legend(loc="lower right", framealpha=0.7)
    ax.set_xlim(0, sub_df["total"].max() * 1.15)

    # Highlight the AO3 bar
    ao3_total = sub_df.loc["AO3", "total"] if "AO3" in sub_df.index else 0
    all_total  = df.shape[0]
    ao3_pct    = ao3_total / all_total * 100

    ax.axvline(ao3_total, color=C_AO3, linewidth=0.8, linestyle=":", alpha=0.5)
    ax.text(ao3_total + 15, 13.5,
            f"r/AO3: {ao3_pct:.0f}% of\nall documents",
            fontsize=8, color=C_AO3)

    _title_block(
        fig,
        "Chart 1 — Who is talking about Wattpad on Reddit?",
        "Top 15 subreddits by total documents · r/AO3 overwhelmingly dominates, meaning this corpus\n"
        "captures outsider/competitor perception of Wattpad rather than the Wattpad community itself.",
    )
    _save(fig, "01_subreddit_volume.png")


# ═══════════════════════════════════════════════════════════════════════════════
# Chart 2 — When did viral Wattpad posts appear?
# ═══════════════════════════════════════════════════════════════════════════════

def chart2_timeline() -> None:
    posts = df[df["kind"] == "post"].copy()
    posts["month"] = pd.to_datetime(posts["created_utc"], unit="s").dt.to_period("M")
    monthly = posts.groupby("month").size().rename("posts")

    x = monthly.index.to_timestamp()
    y = monthly.values

    fig, ax = plt.subplots(figsize=(13, 5))
    fig.subplots_adjust(top=0.80, bottom=0.15)

    ax.fill_between(x, y, alpha=0.15, color=C_BLUE)
    ax.plot(x, y, color=C_BLUE, linewidth=2, marker="o", ms=5, zorder=3)

    # Annotate the top-3 spikes
    top_idx = np.argsort(y)[::-1][:3]
    for rank, i in enumerate(top_idx):
        offset = (20, 12) if rank == 0 else (-20, 12) if rank == 1 else (20, -18)
        ax.annotate(
            f"{y[i]} posts\n{monthly.index[i]}",
            xy=(x[i], y[i]),
            xytext=offset, textcoords="offset points",
            fontsize=8, color=C_TEXT,
            arrowprops=dict(arrowstyle="->", color=C_GRAY, lw=0.8),
            bbox=dict(boxstyle="round,pad=0.3", fc="white", ec=C_GRAY, lw=0.6),
        )

    ax.set_xlabel("Month", labelpad=8)
    ax.set_ylabel("Posts", labelpad=8)
    ax.set_ylim(0)
    ax.tick_params(axis="x", rotation=30)

    _title_block(
        fig,
        "Chart 2 — When did viral Wattpad posts appear?",
        "Monthly count of top-scoring posts with 'wattpad' in the title across all subreddits (2019–2026).\n"
        "Spikes mark moments when Wattpad entered mainstream Reddit discourse.",
        x=0.07,
    )
    _save(fig, "02_posts_timeline.png")


# ═══════════════════════════════════════════════════════════════════════════════
# Chart 3 — AO3 community vs Wattpad community: top vocabulary
# ═══════════════════════════════════════════════════════════════════════════════

def chart3_vocabulary_comparison() -> None:
    def top_unigrams(sub: str, n: int = 20) -> pd.Series:
        mask = (
            (ngrams["subreddit"] == sub)
            & (ngrams["n"] == 1)
            & (~ngrams["ngram"].isin(JUNK))
            & (ngrams["ngram"].str.len() > 1)
        )
        return (
            ngrams[mask]
            .nlargest(n, "count")
            .set_index("ngram")["count"]
            .sort_values()
        )

    ao3_terms = top_unigrams("AO3")
    wp_terms  = top_unigrams("Wattpad")

    ao3_docs = df[df["subreddit"] == "AO3"].shape[0]
    wp_docs  = df[df["subreddit"] == "Wattpad"].shape[0]

    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 7))
    fig.subplots_adjust(top=0.82, wspace=0.55, left=0.12, right=0.92)

    # Left: AO3
    bars = ax1.barh(ao3_terms.index, ao3_terms.values, color=C_AO3, height=0.7)
    ax1.set_title(f"r/AO3  ·  {ao3_docs:,} docs", fontsize=11, color=C_AO3, pad=10)
    ax1.set_xlabel("Frequency (occurrences)")
    ax1.xaxis.set_major_locator(ticker.MaxNLocator(integer=True, nbins=5))

    # Right: Wattpad
    ax2.barh(wp_terms.index, wp_terms.values, color=C_WATTPAD, height=0.7)
    ax2.set_title(f"r/Wattpad  ·  {wp_docs:,} docs", fontsize=11, color=C_WATTPAD, pad=10)
    ax2.set_xlabel("Frequency (occurrences)")
    ax2.xaxis.set_major_locator(ticker.MaxNLocator(integer=True, nbins=5))

    _title_block(
        fig,
        "Chart 3 — AO3 community vs Wattpad community: top vocabulary",
        "Top 20 unigrams per subreddit after stop-word removal (English) and contraction-fragment filtering.\n"
        "AO3 vocabulary skews toward platform comparison and community norms; Wattpad toward personal creative experience.",
    )
    _save(fig, "03_ao3_vs_wattpad_vocabulary.png")


# ═══════════════════════════════════════════════════════════════════════════════
# Chart 5 — How is "wattpad" used in phrases?
# ═══════════════════════════════════════════════════════════════════════════════

def chart5_wattpad_phrases() -> None:
    # Aggregate bigrams containing "wattpad" across all subreddits, filter junk
    def _is_clean(bigram: str) -> bool:
        parts = bigram.split()
        if len(parts) != 2:
            return False
        other = parts[0] if parts[1].lower() == "wattpad" else parts[1]
        return len(other) > 1 and other not in JUNK

    bi = (
        ngrams[
            (ngrams["n"] == 2)
            & ngrams["ngram"].str.contains("wattpad", case=False)
        ]
        .groupby("ngram")["count"].sum()
        .reset_index()
    )
    bi = bi[bi["ngram"].apply(_is_clean)]
    bi = bi.sort_values("count", ascending=False).head(20).sort_values("count")

    # Color: phrases where wattpad is the subject vs. object
    colors = [C_AO3 if row["ngram"].lower().startswith("wattpad") else C_BLUE
              for _, row in bi.iterrows()]

    fig, ax = plt.subplots(figsize=(11, 7))
    fig.subplots_adjust(top=0.82, left=0.28, right=0.92)

    ax.barh(bi["ngram"], bi["count"], color=colors, height=0.7)
    ax.set_xlabel("Total occurrences across all 78 subreddits", labelpad=8)

    # Legend
    import matplotlib.patches as mpatches
    ax.legend(
        handles=[
            mpatches.Patch(color=C_AO3,  label='"wattpad ___"  (Wattpad as subject)'),
            mpatches.Patch(color=C_BLUE, label='"___ wattpad"  (Wattpad as object)'),
        ],
        loc="lower right", framealpha=0.7, fontsize=9,
    )

    _title_block(
        fig,
        'Chart 5 — How is "wattpad" used in phrases?',
        'Top 20 bigrams containing "wattpad" aggregated across all 78 subreddits · contraction fragments removed.\n'
        '"wattpad users" is the single dominant phrase — communities talk about Wattpad as a demographic, not just a platform.',
    )
    _save(fig, "05_wattpad_phrases.png")


# ── Run ───────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    print("Generating charts...")
    chart1_subreddit_volume()
    chart2_timeline()
    chart3_vocabulary_comparison()
    chart5_wattpad_phrases()
    print(f"\nDone. Charts saved to {OUT.relative_to(ROOT)}/")
