"""Tier 1 thread-level charts (Phase 3).

Reads:
  data/thread_descriptives.parquet
  data/comments_scored.parquet

Writes to analysis/findings/:
  18_confident_negative_by_flair.png    — % of threads flagged confident-negative
  19_post_vs_top3_sentiment.png         — 2D scatter: post sentiment vs. top-3 comments
  20_sentiment_divergence_by_flair.png  — boxplot of (post_vader - mean_comment_vader)
  21_comments_per_post_by_flair.png     — boxplot of comments per thread (log x)
  22_competitor_mentions_in_comments.png — bar chart, comments mentioning each platform
"""
from __future__ import annotations

import json
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

ROOT = Path(__file__).resolve().parent.parent
TD = ROOT / "data" / "thread_descriptives.parquet"
CS = ROOT / "data" / "comments_scored.parquet"
FINDINGS = ROOT / "analysis" / "findings"
FINDINGS.mkdir(parents=True, exist_ok=True)

plt.rcParams.update({
    "font.family":       "sans-serif",
    "font.size":         11,
    "axes.spines.top":   False,
    "axes.spines.right": False,
    "axes.grid":         True,
    "grid.alpha":        0.3,
    "grid.linestyle":    "--",
})

C_TEXT = "#2c3e50"
C_SUB  = "#7f8c8d"
C_POS  = "#27ae60"
C_NEG  = "#c0392b"
C_NEU  = "#bdc3c7"
C_WARN = "#e67e22"

# Distinct color per flair, used in scatter + divergence.
FLAIR_COLORS = {
    "General Help":                 "#c0392b",
    "Off-Topic":                    "#8e44ad",
    "Other":                        "#7f8c8d",
    "Looking For: Feedback":        "#2980b9",
    "Looking For: Recommendations": "#16a085",
    "Looking For: Read for Read":   "#27ae60",
    "Looking For: R4R/V4V/C4C/F4F": "#1abc9c",
    "Services":                     "#e67e22",
}


def _title_block(fig, title, subtitle, x=0.05, y=0.965):
    fig.text(x, y, title, fontsize=16, fontweight="bold", color=C_TEXT)
    fig.text(x, y - 0.035, subtitle, fontsize=10, color=C_SUB)


# --------------------------------------------------------------------------
# Chart 18 — Confident-negative rate by flair
# --------------------------------------------------------------------------

def chart_18(td: pd.DataFrame) -> Path:
    g = (td.groupby("flair")
           .agg(n_threads=("post_id", "size"),
                n_confident=("confident_negative", "sum"),
                rate=("confident_negative", "mean"))
           .sort_values("rate", ascending=True))

    fig, ax = plt.subplots(figsize=(11, 0.55 * len(g) + 2.6))
    fig.subplots_adjust(left=0.28, right=0.94, top=0.84, bottom=0.12)

    bars = ax.barh(range(len(g)), g["rate"] * 100,
                   color=[FLAIR_COLORS.get(f, C_SUB) for f in g.index],
                   edgecolor="white")
    ax.set_yticks(range(len(g)))
    ax.set_yticklabels(g.index, color=C_TEXT)
    ax.set_xlabel("% of threads flagged confident-negative", color=C_TEXT)
    ax.tick_params(colors=C_SUB)
    ax.set_xlim(0, max(g["rate"] * 100) * 1.25 + 1)

    for i, (rate, n_conf, n_thr) in enumerate(zip(g["rate"], g["n_confident"], g["n_threads"])):
        ax.text(rate * 100 + 0.15, i,
                f"{rate*100:.1f}%  ({int(n_conf)} of {int(n_thr)})",
                va="center", fontsize=9.5, color=C_TEXT)

    _title_block(fig,
                 "Confident-negative threads by flair",
                 "Thread = post + comments. Confident-negative = post_vader < −0.2 AND mean of top-3 comments < −0.1")
    fig.text(0.05, 0.06,
             "Both the post AND the most-upvoted comments under it have to be negative. "
             "Filters out lone rants and bait-positive posts. General Help and Off-Topic carry the real pain.",
             fontsize=9, color=C_SUB, wrap=True)

    out = FINDINGS / "18_confident_negative_by_flair.png"
    fig.savefig(out, dpi=140)
    plt.close(fig)
    return out


# --------------------------------------------------------------------------
# Chart 19 — Post sentiment vs. top-3-comment sentiment scatter
# --------------------------------------------------------------------------

def chart_19(td: pd.DataFrame) -> Path:
    d = td.dropna(subset=["post_vader", "top3_mean_vader"]).copy()
    d["size"] = (np.log1p(d["n_comments"]) * 25).clip(lower=10, upper=400)

    fig, ax = plt.subplots(figsize=(11, 9))
    fig.subplots_adjust(left=0.09, right=0.94, top=0.86, bottom=0.10)

    # Quadrant shading — bottom-left = both negative (the pain zone)
    ax.axhspan(-1, -0.1, xmin=0, xmax=0.39, facecolor=C_NEG, alpha=0.06, zorder=0)
    ax.text(-0.93, -0.93, "BOTH NEGATIVE\n(community-validated pain)",
            fontsize=10, color=C_NEG, fontweight="bold", alpha=0.7, zorder=0)
    ax.text(0.55, 0.85, "BOTH POSITIVE\n(praise / celebration)",
            fontsize=10, color=C_POS, fontweight="bold", alpha=0.6, zorder=0)
    ax.text(-0.93, 0.85, "POST NEG, COMMENTS POS\n(rant met with reassurance)",
            fontsize=9, color=C_SUB, zorder=0)
    ax.text(0.30, -0.93, "POST POS, COMMENTS NEG\n(smoldering — comments amplify)",
            fontsize=9, color=C_SUB, zorder=0)

    # Diagonal reference + axis lines
    ax.plot([-1, 1], [-1, 1], "--", color="#34495e", alpha=0.4, linewidth=1)
    ax.axhline(0, color=C_SUB, alpha=0.3, linewidth=0.8)
    ax.axvline(0, color=C_SUB, alpha=0.3, linewidth=0.8)

    for flair, sub in d.groupby("flair"):
        ax.scatter(sub["post_vader"], sub["top3_mean_vader"],
                   s=sub["size"], c=FLAIR_COLORS.get(flair, C_SUB),
                   alpha=0.55, edgecolor="white", linewidth=0.5,
                   label=f"{flair}  (n={len(sub)})")

    ax.set_xlim(-1.02, 1.02)
    ax.set_ylim(-1.02, 1.02)
    ax.set_xlabel("Post sentiment (VADER compound on title+body)", color=C_TEXT)
    ax.set_ylabel("Top-3 comments mean VADER", color=C_TEXT)
    ax.tick_params(colors=C_SUB)
    ax.legend(loc="lower right", fontsize=8.5, frameon=True, framealpha=0.92,
              title="Flair (n threads)", title_fontsize=9)

    _title_block(fig,
                 "Where each thread sits — post mood vs. comment mood",
                 f"One dot = one thread (n={len(d):,}); dot size ∝ log(comment count). "
                 "Dashed = diagonal where post and comments agree.")
    fig.text(0.05, 0.04,
             "Below the diagonal = comments are more negative than the post (the issue is bigger than the OP framed it).  "
             "Above = comments soften the post (rant met with reassurance).",
             fontsize=9, color=C_SUB)

    out = FINDINGS / "19_post_vs_top3_sentiment.png"
    fig.savefig(out, dpi=140)
    plt.close(fig)
    return out


# --------------------------------------------------------------------------
# Chart 20 — Sentiment divergence distribution by flair
# --------------------------------------------------------------------------

def chart_20(td: pd.DataFrame) -> Path:
    d = td.dropna(subset=["sentiment_divergence"]).copy()
    order = (d.groupby("flair")["sentiment_divergence"]
               .median().sort_values(ascending=True).index.tolist())

    fig, ax = plt.subplots(figsize=(11, 0.7 * len(order) + 2.6))
    fig.subplots_adjust(left=0.28, right=0.94, top=0.84, bottom=0.14)

    box_data = [d.loc[d["flair"] == f, "sentiment_divergence"].values for f in order]
    bp = ax.boxplot(box_data, vert=False, patch_artist=True,
                    widths=0.6, showfliers=False, whis=[10, 90])
    for patch, flair in zip(bp["boxes"], order):
        patch.set_facecolor(FLAIR_COLORS.get(flair, C_SUB))
        patch.set_alpha(0.55)
        patch.set_edgecolor(FLAIR_COLORS.get(flair, C_TEXT))
    for med in bp["medians"]:
        med.set_color("#2c3e50")
        med.set_linewidth(1.5)

    ax.axvline(0, color=C_SUB, linewidth=1, linestyle="--", alpha=0.6)
    ax.set_yticklabels(order, color=C_TEXT)
    ax.set_xlabel("Sentiment divergence = post_vader − mean_comment_vader", color=C_TEXT)
    ax.tick_params(colors=C_SUB)
    ax.set_xlim(-1.6, 1.6)

    # Annotation labels for the directional reading
    ax.text(-1.4, len(order) + 0.6,
            "← post angrier than comments\n  (isolated rant)",
            fontsize=9, color=C_SUB, ha="left", va="bottom")
    ax.text(1.4, len(order) + 0.6,
            "post calmer than comments →\n     (smoldering issue)",
            fontsize=9, color=C_SUB, ha="right", va="bottom")

    _title_block(fig,
                 "Sentiment divergence by flair",
                 "Box = median ± IQR, whiskers = 10/90th. Wider spread = more disagreement between OP and commenters.")
    fig.text(0.05, 0.06,
             "Where the box straddles zero, post and comments are in lockstep. "
             "Wide negative-side tails flag flairs full of one-off rants that the community doesn't echo.",
             fontsize=9, color=C_SUB)

    out = FINDINGS / "20_sentiment_divergence_by_flair.png"
    fig.savefig(out, dpi=140)
    plt.close(fig)
    return out


# --------------------------------------------------------------------------
# Chart 21 — Comments per post distribution by flair
# --------------------------------------------------------------------------

def chart_21(td: pd.DataFrame) -> Path:
    d = td[td["n_comments"] > 0].copy()
    order = (d.groupby("flair")["n_comments"]
               .median().sort_values(ascending=True).index.tolist())

    fig, ax = plt.subplots(figsize=(11, 0.7 * len(order) + 2.6))
    fig.subplots_adjust(left=0.28, right=0.94, top=0.84, bottom=0.14)

    box_data = [d.loc[d["flair"] == f, "n_comments"].values for f in order]
    bp = ax.boxplot(box_data, vert=False, patch_artist=True,
                    widths=0.6, showfliers=False, whis=[10, 90])
    for patch, flair in zip(bp["boxes"], order):
        patch.set_facecolor(FLAIR_COLORS.get(flair, C_SUB))
        patch.set_alpha(0.55)
        patch.set_edgecolor(FLAIR_COLORS.get(flair, C_TEXT))
    for med in bp["medians"]:
        med.set_color("#2c3e50")
        med.set_linewidth(1.5)

    ax.set_xscale("log")
    ax.set_xlim(0.8, 400)
    ax.set_yticklabels(order, color=C_TEXT)
    ax.set_xlabel("Comments per thread (log scale)", color=C_TEXT)
    ax.tick_params(colors=C_SUB)

    # Annotate median + n
    medians = d.groupby("flair")["n_comments"].median()
    counts = d.groupby("flair").size()
    for i, flair in enumerate(order):
        ax.text(360, i + 1,
                f"median {int(medians[flair])}  ·  n={int(counts[flair])} threads",
                va="center", ha="right", fontsize=9, color=C_TEXT)

    _title_block(fig,
                 "Comments per thread by flair",
                 f"Threads with ≥1 comment (n={len(d):,}). Box = median ± IQR, whiskers = 10/90th percentile.")
    fig.text(0.05, 0.06,
             "Off-Topic and R4R run the longest conversations; Feedback and Services are quieter. "
             "Sets the baseline for what 'engagement' means in each flair.",
             fontsize=9, color=C_SUB)

    out = FINDINGS / "21_comments_per_post_by_flair.png"
    fig.savefig(out, dpi=140)
    plt.close(fig)
    return out


# --------------------------------------------------------------------------
# Chart 22 — Competitor mentions in comments
# --------------------------------------------------------------------------

def chart_22(cs: pd.DataFrame) -> Path:
    # Parse competitors json column, explode
    cs = cs[cs["has_competitor"]].copy()
    cs["plats"] = cs["competitors"].apply(json.loads)
    rows = []
    for _, r in cs.iterrows():
        for p in r["plats"]:
            rows.append({"platform": p, "vader": r["vader_compound"],
                         "is_single": len(r["plats"]) == 1})
    expanded = pd.DataFrame(rows)
    if expanded.empty:
        raise RuntimeError("no competitor mentions found")

    counts = expanded["platform"].value_counts()
    single = expanded[expanded["is_single"] & expanded["vader"].notna()]
    sent = single.groupby("platform")["vader"].agg(["mean", "size"]).rename(
        columns={"mean": "mean_vader", "size": "n_single"})
    df = pd.DataFrame({"total": counts}).join(sent, how="left").fillna(
        {"mean_vader": 0.0, "n_single": 0})
    df = df.sort_values("total", ascending=True)

    def color(v):
        if v >= 0.20:
            return C_POS
        if v >= 0:
            return "#95a5a6"
        if v >= -0.20:
            return C_WARN
        return C_NEG

    colors = [color(v) for v in df["mean_vader"]]
    fig, ax = plt.subplots(figsize=(11, 0.55 * len(df) + 2.8))
    fig.subplots_adjust(left=0.20, right=0.94, top=0.84, bottom=0.16)

    ax.barh(range(len(df)), df["total"], color=colors, edgecolor="white")
    ax.set_yticks(range(len(df)))
    ax.set_yticklabels(df.index, color=C_TEXT)
    ax.set_xlabel("Total comments mentioning the platform", color=C_TEXT)
    ax.tick_params(colors=C_SUB)
    for i, (tot, mv, ns) in enumerate(zip(df["total"], df["mean_vader"], df["n_single"])):
        ax.text(tot + max(df["total"]) * 0.01, i,
                f"n={int(tot)}  ·  mean sent {mv:+.2f} (single-mention n={int(ns)})",
                va="center", fontsize=9, color=C_TEXT)

    handles = [plt.Rectangle((0, 0), 1, 1, color=c) for c in (C_POS, "#95a5a6", C_WARN, C_NEG)]
    labels = ["≥ +0.20 (positive)", "0 to +0.20", "−0.20 to 0", "< −0.20 (negative)"]
    fig.legend(handles, labels, loc="lower center", ncol=4, frameon=False,
               fontsize=9, bbox_to_anchor=(0.5, 0.02))

    _title_block(fig,
                 "Competitor platforms named in r/Wattpad comments",
                 "Bars = mention count across comments; color = mean VADER on comments where only this platform is named.")
    fig.text(0.05, 0.07,
             "Companion to chart 17 (posts). Comments name competitors 2× more often than posts — "
             "switching narratives and concrete recommendations cluster in replies.",
             fontsize=9, color=C_SUB)

    out = FINDINGS / "22_competitor_mentions_in_comments.png"
    fig.savefig(out, dpi=140)
    plt.close(fig)
    return out


def main() -> int:
    td = pd.read_parquet(TD)
    cs = pd.read_parquet(CS)
    print(f"loaded {len(td):,} threads · {len(cs):,} comments")

    for fn, args in [(chart_18, (td,)), (chart_19, (td,)), (chart_20, (td,)),
                     (chart_21, (td,)), (chart_22, (cs,))]:
        out = fn(*args)
        print(f"  wrote {out.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
