"""Flair distribution + engagement charts for r/Wattpad.

Writes (in analysis-flow order):
    analysis/findings/01_flair_distribution_scope.png    — last 2y, color-coded keep/drop
    analysis/findings/02_flair_distribution_alltime.png  — all-time r/Wattpad post flairs
    analysis/findings/03_flair_median_upvotes.png        — engagement per flair
    analysis/findings/04_flair_median_comments.png       — engagement per flair

Posts only (flair is a post-level attribute; comments inherit no flair).

Archived charts (no longer generated): non-Wattpad cross-sub flair facets,
flair upvote-vs-comment scatter. See analysis/archive/charts/.

Usage:
    python analysis/generate_flair_charts.py
"""
from __future__ import annotations

from pathlib import Path

import matplotlib.pyplot as plt
import pandas as pd

ROOT = Path(__file__).resolve().parent.parent
OUT  = ROOT / "analysis" / "findings"
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

C_TEXT  = "#2c3e50"
C_SUB   = "#7f8c8d"
C_BAR   = "#2980b9"
C_NONE  = "#bdc3c7"
NONE_LABEL = "(no flair)"

SUB_COLORS = {
    "FanFiction":  "#8e44ad",
    "selfpublish": "#27ae60",
    "writing":     "#e67e22",
    "books":       "#2980b9",
    "Wattpad":     "#c0392b",
}


def _title_block(fig, title: str, subtitle: str, x: float = 0.05, y: float = 0.965) -> None:
    fig.text(x, y, title, fontsize=16, fontweight="bold", color=C_TEXT)
    fig.text(x, y - 0.035, subtitle, fontsize=10, color=C_SUB)


def _flair_series(posts: pd.DataFrame) -> pd.Series:
    s = posts["link_flair_text"].fillna("").replace("", NONE_LABEL)
    return s.value_counts()


def chart_wattpad() -> Path:
    df = pd.read_parquet(ROOT / "data" / "corpus_wattpad_full.parquet")
    posts = df[(df["kind"] == "post") & (df["subreddit"].str.lower() == "wattpad")]
    counts = _flair_series(posts)

    fig, ax = plt.subplots(figsize=(9, 0.45 * len(counts) + 2.2))
    fig.subplots_adjust(left=0.32, right=0.96, top=0.86, bottom=0.10)

    y = range(len(counts))[::-1]
    colors = [C_NONE if lbl == NONE_LABEL else C_BAR for lbl in counts.index]
    bars = ax.barh(list(y), counts.values, color=colors, edgecolor="white")
    ax.set_yticks(list(y))
    ax.set_yticklabels(counts.index, color=C_TEXT)
    ax.set_xlabel("Posts", color=C_TEXT)
    ax.tick_params(colors=C_SUB)
    for rect, n in zip(bars, counts.values):
        ax.text(
            rect.get_width() + max(counts.values) * 0.01,
            rect.get_y() + rect.get_height() / 2,
            f"{int(n)}",
            va="center",
            fontsize=10,
            color=C_TEXT,
        )

    _title_block(
        fig,
        "r/Wattpad — post flairs",
        f"{len(posts)} posts in corpus_wattpad_full.parquet (subreddit=Wattpad, kind=post)",
    )

    out = OUT / "02_flair_distribution_alltime.png"
    fig.savefig(out, dpi=140)
    plt.close(fig)
    return out


def chart_non_wattpad() -> Path:
    df = pd.read_parquet(ROOT / "data" / "corpus.parquet")
    posts = df[(df["kind"] == "post") & (df["subreddit"].str.lower() != "wattpad")]
    posts = posts.copy()
    posts["flair"] = posts["link_flair_text"].fillna("").replace("", NONE_LABEL)

    cross = (
        posts.groupby(["subreddit", "flair"]).size()
        .reset_index(name="count")
        .sort_values(["subreddit", "count"], ascending=[True, False])
    )

    subs = sorted(posts["subreddit"].unique(), key=lambda s: -posts[posts.subreddit == s].shape[0])
    n_subs = len(subs)
    fig, axes = plt.subplots(n_subs, 1, figsize=(9, 2.0 * n_subs + 2.2), squeeze=False)
    axes = axes[:, 0]
    fig.subplots_adjust(left=0.30, right=0.96, top=0.86, bottom=0.05, hspace=0.85)

    for ax, sub in zip(axes, subs):
        sub_df = cross[cross["subreddit"] == sub].sort_values("count", ascending=True)
        labels = sub_df["flair"].tolist()
        values = sub_df["count"].tolist()
        color = SUB_COLORS.get(sub, C_BAR)
        colors = [C_NONE if lbl == NONE_LABEL else color for lbl in labels]
        bars = ax.barh(range(len(labels)), values, color=colors, edgecolor="white")
        ax.set_yticks(range(len(labels)))
        ax.set_yticklabels(labels, color=C_TEXT, fontsize=10)
        total = sum(values)
        ax.set_title(f"r/{sub} ({total} posts)", loc="left", fontsize=11, fontweight="bold", color=C_TEXT, pad=4)
        ax.tick_params(colors=C_SUB)
        for rect, n in zip(bars, values):
            ax.text(
                rect.get_width() + max(values) * 0.02,
                rect.get_y() + rect.get_height() / 2,
                f"{int(n)}",
                va="center",
                fontsize=9,
                color=C_TEXT,
            )
        ax.set_xlim(0, max(values) * 1.18)

    _title_block(
        fig,
        "Non-Wattpad subs — post flairs",
        f"{len(posts)} posts in corpus.parquet, faceted by subreddit",
        y=0.955,
    )

    out = OUT / "11_flair_non_wattpad.png"
    fig.savefig(out, dpi=140)
    plt.close(fig)
    return out


# Classification used by chart_wattpad_2yr: matches the keep/drop list in
# tools/reddit_research/scripts/crawl_wattpad_by_flair.py::DEFAULT_SKIP
PLATFORM_FLAIRS = {
    "General Help", "Help", "Looking For: Feedback", "Looking For: Recommendations",
    "Looking For: R4R/V4V/C4C/F4F", "Looking For: Read for Read", "Milestone",
    "Off-Topic", "Other", "Services", "Announcement", "Media",
    "Monthly Discussion", "Weekly Promotion",
}
MEME_FLAIRS = {"Meme", "Image/Video", "Humor"}
DISCOVERY_FLAIRS = {"Looking For: Lost Books"}  # platform pain but not discussion

CAT_PLATFORM = "#27ae60"   # green: keep
CAT_MEME = "#e74c3c"       # red: meme/entertainment
CAT_GENRE = "#95a5a6"      # grey: story-content tags
CAT_DISCOVERY = "#f39c12"  # orange: search/discovery

CAT_LEGEND = [
    (CAT_PLATFORM, "Platform discussion (kept for analysis)"),
    (CAT_DISCOVERY, "Search/discovery (Looking For: Lost Books)"),
    (CAT_MEME, "Meme / entertainment (dropped)"),
    (CAT_GENRE, "Genre tags (dropped)"),
]


def _flair_category(flair: str) -> str:
    if flair in PLATFORM_FLAIRS:
        return CAT_PLATFORM
    if flair in MEME_FLAIRS:
        return CAT_MEME
    if flair in DISCOVERY_FLAIRS:
        return CAT_DISCOVERY
    return CAT_GENRE


def chart_wattpad_2yr() -> Path:
    scan_path = ROOT / "data" / "flair_scan_wattpad.parquet"
    if not scan_path.exists():
        print(f"skip: {scan_path.name} not found (run scripts/scan_flair_distribution.py)")
        return scan_path
    df = pd.read_parquet(scan_path)
    df["flair"] = df["flair"].fillna("").replace("", NONE_LABEL)
    counts = df["flair"].value_counts()

    fig, ax = plt.subplots(figsize=(10, 0.38 * len(counts) + 3.0))
    fig.subplots_adjust(left=0.34, right=0.96, top=0.88, bottom=0.13)

    y = list(range(len(counts)))[::-1]
    colors = [_flair_category(f) for f in counts.index]
    bars = ax.barh(y, counts.values, color=colors, edgecolor="white")
    ax.set_yticks(y)
    ax.set_yticklabels(counts.index, color=C_TEXT, fontsize=10)
    ax.set_xlabel("Posts", color=C_TEXT)
    ax.tick_params(colors=C_SUB)
    for rect, n in zip(bars, counts.values):
        ax.text(
            rect.get_width() + max(counts.values) * 0.01,
            rect.get_y() + rect.get_height() / 2,
            f"{int(n)}",
            va="center", fontsize=9, color=C_TEXT,
        )

    handles = [plt.Rectangle((0, 0), 1, 1, color=c) for c, _ in CAT_LEGEND]
    labels = [lbl for _, lbl in CAT_LEGEND]
    fig.legend(
        handles, labels,
        loc="lower center", ncol=2, frameon=False, fontsize=9,
        bbox_to_anchor=(0.5, 0.01),
    )

    total = int(counts.sum())
    date_min = pd.to_datetime(df["created_utc"].min(), unit="s", utc=True).date()
    date_max = pd.to_datetime(df["created_utc"].max(), unit="s", utc=True).date()
    _title_block(
        fig,
        "r/Wattpad — flair distribution, last 2 years",
        f"{total} posts, {date_min} → {date_max}  •  metadata-only scan (no body fetches)",
    )

    out = OUT / "01_flair_distribution_scope.png"
    fig.savefig(out, dpi=140)
    plt.close(fig)
    return out


def _wattpad_engagement_df() -> pd.DataFrame:
    """Per-post DataFrame with score and on-disk comment count, joined to flair."""
    df = pd.read_parquet(ROOT / "data" / "corpus_wattpad_full.parquet")
    posts = df[(df["kind"] == "post") & (df["subreddit"].str.lower() == "wattpad")].copy()
    posts["flair"] = posts["link_flair_text"].fillna("").replace("", NONE_LABEL)

    # Count comments on disk per post. A comment is attributed to a post if it
    # appears in the same subreddit-section of the corpus, ancestry chasing via
    # parent_id back to a t3_ root. Simpler approximation: descendants share the
    # post's subreddit; we count by walking parent_id back per row.
    # For Wattpad's depth-10 trees, a fast & exact method is:
    #   - build map doc_id -> parent_id for ALL rows
    #   - for each comment, walk up until a t3_ id is found
    parent_of: dict[str, str] = dict(zip(df["doc_id"], df["parent_id"]))
    def root_post(doc_id: str) -> str | None:
        cur = doc_id
        for _ in range(64):
            parent = parent_of.get(cur, "")
            if not parent:
                return None
            if parent.startswith("t3_"):
                return parent
            cur = parent.split("_", 1)[-1] if "_" in parent else parent
            cur = parent if not parent.startswith(("t1_", "t3_")) else parent[3:]
        return None

    comments = df[df["kind"] == "comment"]
    counts: dict[str, int] = {}
    for cid, pid in zip(comments["doc_id"], comments["parent_id"]):
        if pid.startswith("t3_"):
            counts[pid] = counts.get(pid, 0) + 1
        else:
            root = root_post(cid)
            if root:
                counts[root] = counts.get(root, 0) + 1

    posts["comment_count"] = posts["doc_id"].map(counts).fillna(0).astype(int)
    return posts


def _flair_engagement_bars(posts: pd.DataFrame, metric: str, title: str, subtitle: str,
                           xlabel: str, out_name: str) -> Path:
    agg = (
        posts.groupby("flair")[metric]
        .agg(["median", "count"])
        .sort_values("median", ascending=False)
    )
    # Drop flairs with fewer than 3 posts — medians are unstable below that
    agg = agg[agg["count"] >= 3]

    fig, ax = plt.subplots(figsize=(9, 0.42 * len(agg) + 2.2))
    fig.subplots_adjust(left=0.34, right=0.92, top=0.86, bottom=0.10)

    y = list(range(len(agg)))[::-1]
    colors = [_flair_category(f) for f in agg.index]
    bars = ax.barh(y, agg["median"].values, color=colors, edgecolor="white")
    ax.set_yticks(y)
    ax.set_yticklabels(agg.index, color=C_TEXT, fontsize=10)
    ax.set_xlabel(xlabel, color=C_TEXT)
    ax.tick_params(colors=C_SUB)
    for rect, n, count in zip(bars, agg["median"].values, agg["count"].values):
        ax.text(
            rect.get_width() + max(agg["median"].values) * 0.015,
            rect.get_y() + rect.get_height() / 2,
            f"{n:.0f}  (n={count})",
            va="center", fontsize=9, color=C_TEXT,
        )

    _title_block(fig, title, subtitle)
    out = OUT / out_name
    fig.savefig(out, dpi=140)
    plt.close(fig)
    return out


def chart_wattpad_median_upvotes() -> Path:
    posts = _wattpad_engagement_df()
    return _flair_engagement_bars(
        posts, metric="score",
        title="r/Wattpad — median upvotes per flair",
        subtitle=f"{len(posts)} posts in corpus_wattpad_full.parquet; flairs with <3 posts hidden",
        xlabel="Median upvotes",
        out_name="03_flair_median_upvotes.png",
    )


def chart_wattpad_median_comments() -> Path:
    posts = _wattpad_engagement_df()
    return _flair_engagement_bars(
        posts, metric="comment_count",
        title="r/Wattpad — median comments per flair",
        subtitle=f"{len(posts)} posts; comment count derived from rows on disk",
        xlabel="Median comments",
        out_name="04_flair_median_comments.png",
    )


def chart_wattpad_score_vs_comments() -> Path:
    posts = _wattpad_engagement_df()
    # Drop zero rows for log scale; one-shift to keep them
    x = posts["score"].clip(lower=0) + 1
    y = posts["comment_count"] + 1
    colors = [_flair_category(f) for f in posts["flair"]]

    fig, ax = plt.subplots(figsize=(10, 7))
    fig.subplots_adjust(left=0.10, right=0.96, top=0.88, bottom=0.20)

    ax.scatter(x, y, c=colors, alpha=0.55, s=24, edgecolors="white", linewidths=0.4)
    ax.set_xscale("log")
    ax.set_yscale("log")
    ax.set_xlabel("Upvotes (log, +1)", color=C_TEXT)
    ax.set_ylabel("Comments on post (log, +1)", color=C_TEXT)
    ax.tick_params(colors=C_SUB)
    ax.grid(True, which="both", alpha=0.2, linestyle="--")

    handles = [plt.Line2D([], [], marker="o", linestyle="", color=c, label=lbl, markersize=8)
               for c, lbl in CAT_LEGEND]
    fig.legend(
        handles=handles,
        loc="lower center", ncol=2, frameon=False, fontsize=9,
        bbox_to_anchor=(0.5, 0.02),
    )

    _title_block(
        fig,
        "r/Wattpad — upvotes vs. comments per post",
        f"{len(posts)} posts, colored by flair category (log-log)",
    )

    out = OUT / "15_flair_wattpad_scatter.png"
    fig.savefig(out, dpi=140)
    plt.close(fig)
    return out


def main() -> int:
    # chart_non_wattpad and chart_wattpad_score_vs_comments were archived;
    # functions kept above for reference but not generated as part of the
    # current analysis output.
    for fn in (chart_wattpad_2yr, chart_wattpad,
               chart_wattpad_median_upvotes, chart_wattpad_median_comments):
        out = fn()
        if out.exists() and out.suffix == ".png":
            print(f"wrote {out.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
