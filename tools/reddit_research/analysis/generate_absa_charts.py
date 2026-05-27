"""ABSA aspect-level visualizations (Phase 2 — Pass 2).

Reads:
  data/aspect_sentiment.parquet         (4,677 ABSA rows)
  data/aspect_vocabulary.parquet        (Pass 1 results, for comparison)
  analysis/tables/aspects_curated_keep.csv  (categories)

Writes to analysis/findings/:
  12_absa_top_pain.png            — aspects ranked by ABSA pain score (n × %neg)
  13_absa_top_praised.png         — aspects ranked by ABSA praise score (n × %pos)
  14_absa_sentiment_mix.png       — stacked pos/neu/neg per top-20 aspect
  15_absa_category_breakdown.png  — sentiment by aspect category
  16_absa_vs_pass1.png            — comparison: Pass 1 (VADER-context) vs Pass 2 (ABSA) pain scores

Plus tables in analysis/tables/:
  absa_aspect_summary.csv         — full per-aspect rollup
"""
from __future__ import annotations

from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

ROOT = Path(__file__).resolve().parent.parent
ABSA = ROOT / "data" / "aspect_sentiment.parquet"
PASS1 = ROOT / "data" / "aspect_vocabulary.parquet"
CURATED = ROOT / "analysis" / "tables" / "aspects_curated_keep.csv"
FINDINGS = ROOT / "analysis" / "findings"
TABLES = ROOT / "analysis" / "tables"
FINDINGS.mkdir(parents=True, exist_ok=True)
TABLES.mkdir(parents=True, exist_ok=True)

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

CAT_COLORS = {
    "platform_feature": "#2980b9",
    "discovery":        "#e67e22",
    "monetization":     "#16a085",
    "community":        "#8e44ad",
    "service":          "#27ae60",
    "competitor":       "#c0392b",
}


def _title_block(fig, title, subtitle, x=0.05, y=0.965):
    fig.text(x, y, title, fontsize=16, fontweight="bold", color=C_TEXT)
    fig.text(x, y - 0.035, subtitle, fontsize=10, color=C_SUB)


def build_summary() -> pd.DataFrame:
    df = pd.read_parquet(ABSA)
    cur = pd.read_csv(CURATED)
    cat_map = dict(zip(cur["aspect"], cur["category"]))

    g = df.groupby("aspect").agg(
        n=("doc_id", "size"),
        n_posts=("doc_id", "nunique"),
        pct_pos=("label", lambda s: (s == "positive").mean()),
        pct_neg=("label", lambda s: (s == "negative").mean()),
        pct_neu=("label", lambda s: (s == "neutral").mean()),
        mean_score=("score_signed", "mean"),
        median_score=("score_signed", "median"),
    ).reset_index()
    g["category"] = g["aspect"].map(cat_map).fillna("generic")
    g["pain_score"] = g["n"] * g["pct_neg"]
    g["praise_score"] = g["n"] * g["pct_pos"]
    g = g.sort_values("n", ascending=False).reset_index(drop=True)
    g.to_csv(TABLES / "absa_aspect_summary.csv", index=False)
    return g


def chart_12_pain(summary: pd.DataFrame) -> Path:
    big = summary[summary["n"] >= 15].copy()
    top = big.sort_values("pain_score", ascending=True).tail(20)
    fig, ax = plt.subplots(figsize=(11, 0.45 * len(top) + 2.6))
    fig.subplots_adjust(left=0.22, right=0.95, top=0.85, bottom=0.10)
    y = list(range(len(top)))
    colors = [CAT_COLORS.get(c, C_SUB) for c in top["category"]]
    ax.barh(y, top["pain_score"], color=colors, edgecolor="white")
    ax.set_yticks(y); ax.set_yticklabels(top["aspect"], color=C_TEXT)
    ax.set_xlabel("ABSA pain score  =  mentions × share-negative", color=C_TEXT)
    ax.tick_params(colors=C_SUB)
    for yi, (n, pct, ps) in enumerate(zip(top["n"], top["pct_neg"], top["pain_score"])):
        ax.text(ps + max(top["pain_score"]) * 0.01, yi,
                f"n={int(n)}  •  {pct:.0%} neg",
                va="center", fontsize=9, color=C_TEXT)

    handles = [plt.Rectangle((0, 0), 1, 1, color=c) for c in CAT_COLORS.values()]
    fig.legend(handles, list(CAT_COLORS), loc="lower center", ncol=6,
               frameon=False, fontsize=9, bbox_to_anchor=(0.5, 0.01))

    _title_block(fig,
        "Top aspect-level pain points (ABSA, Pass 2)",
        f"{int(summary['n'].sum()):,} aspect-mentioning sentences across 71 curated aspects; shown: n≥15")
    out = FINDINGS / "12_absa_top_pain.png"
    fig.savefig(out, dpi=140); plt.close(fig); return out


def chart_13_praised(summary: pd.DataFrame) -> Path:
    big = summary[summary["n"] >= 15].copy()
    top = big.sort_values("praise_score", ascending=True).tail(20)
    fig, ax = plt.subplots(figsize=(11, 0.45 * len(top) + 2.6))
    fig.subplots_adjust(left=0.22, right=0.95, top=0.85, bottom=0.10)
    y = list(range(len(top)))
    colors = [CAT_COLORS.get(c, C_SUB) for c in top["category"]]
    ax.barh(y, top["praise_score"], color=colors, edgecolor="white")
    ax.set_yticks(y); ax.set_yticklabels(top["aspect"], color=C_TEXT)
    ax.set_xlabel("ABSA praise score  =  mentions × share-positive", color=C_TEXT)
    ax.tick_params(colors=C_SUB)
    for yi, (n, pct, ps) in enumerate(zip(top["n"], top["pct_pos"], top["praise_score"])):
        ax.text(ps + max(top["praise_score"]) * 0.01, yi,
                f"n={int(n)}  •  {pct:.0%} pos",
                va="center", fontsize=9, color=C_TEXT)

    handles = [plt.Rectangle((0, 0), 1, 1, color=c) for c in CAT_COLORS.values()]
    fig.legend(handles, list(CAT_COLORS), loc="lower center", ncol=6,
               frameon=False, fontsize=9, bbox_to_anchor=(0.5, 0.01))

    _title_block(fig,
        "Top aspect-level praises (ABSA, Pass 2)",
        "Community / support / advice are the strongest positive aspects — the counterweight to platform pain")
    out = FINDINGS / "13_absa_top_praised.png"
    fig.savefig(out, dpi=140); plt.close(fig); return out


def chart_14_mix(summary: pd.DataFrame) -> Path:
    big = summary[summary["n"] >= 25].copy()
    top = big.sort_values("pct_neg", ascending=True).tail(20)
    fig, ax = plt.subplots(figsize=(11, 0.45 * len(top) + 2.6))
    fig.subplots_adjust(left=0.22, right=0.93, top=0.85, bottom=0.10)
    y = list(range(len(top)))
    pos = top["pct_pos"].values
    neu = top["pct_neu"].values
    neg = top["pct_neg"].values
    ax.barh(y, pos, color=C_POS, edgecolor="white", label="positive")
    ax.barh(y, neu, left=pos, color=C_NEU, edgecolor="white", label="neutral")
    ax.barh(y, neg, left=pos + neu, color=C_NEG, edgecolor="white", label="negative")
    ax.set_yticks(y); ax.set_yticklabels(top["aspect"], color=C_TEXT)
    ax.set_xlabel("Share of ABSA-scored sentences", color=C_TEXT)
    ax.set_xlim(0, 1); ax.tick_params(colors=C_SUB)
    for yi, n in enumerate(top["n"]):
        ax.text(1.005, yi, f"n={int(n)}", va="center", fontsize=9, color=C_TEXT)
    ax.legend(loc="lower center", bbox_to_anchor=(0.5, -0.15), ncol=3,
              frameon=False, fontsize=10)

    _title_block(fig,
        "Aspect sentiment mix (ABSA, top 20 by negativity)",
        f"Top aspects with n≥25 mentions, sorted ascending by share-negative")
    out = FINDINGS / "14_absa_sentiment_mix.png"
    fig.savefig(out, dpi=140); plt.close(fig); return out


def chart_15_category(summary: pd.DataFrame) -> Path:
    g = summary.groupby("category").agg(
        n=("n", "sum"),
        mean_score=("mean_score", lambda s: float(np.average(s, weights=summary.loc[s.index, "n"]))),
        pct_pos=("pct_pos", lambda s: float(np.average(s, weights=summary.loc[s.index, "n"]))),
        pct_neg=("pct_neg", lambda s: float(np.average(s, weights=summary.loc[s.index, "n"]))),
    ).reset_index()
    g = g.sort_values("mean_score", ascending=True)

    fig, ax = plt.subplots(figsize=(11, 0.7 * len(g) + 2.5))
    fig.subplots_adjust(left=0.22, right=0.93, top=0.85, bottom=0.12)
    y = list(range(len(g)))
    colors = [CAT_COLORS.get(c, C_SUB) for c in g["category"]]
    ax.barh(y, g["mean_score"], color=colors, edgecolor="white")
    ax.axvline(0, color=C_SUB, linewidth=0.8)
    ax.set_yticks(y); ax.set_yticklabels(g["category"], color=C_TEXT)
    ax.set_xlabel("Weighted-mean ABSA score (negative ← → positive)", color=C_TEXT)
    ax.tick_params(colors=C_SUB)
    for yi, (cat, n, ms, pn) in enumerate(zip(g["category"], g["n"], g["mean_score"], g["pct_neg"])):
        x = ms + (0.01 if ms >= 0 else -0.01)
        ha = "left" if ms >= 0 else "right"
        ax.text(x, yi, f"{ms:+.2f}  •  n={int(n):,}  •  {pn:.0%} neg",
                va="center", ha=ha, fontsize=10, color=C_TEXT)
    span = max(abs(g["mean_score"].min()), abs(g["mean_score"].max())) * 1.6
    ax.set_xlim(-span, span)
    _title_block(fig,
        "ABSA sentiment by aspect category",
        "Community/service categories are praised; platform features and monetization carry the pain")
    out = FINDINGS / "15_absa_category_breakdown.png"
    fig.savefig(out, dpi=140); plt.close(fig); return out


def chart_16_comparison(summary: pd.DataFrame) -> Path:
    p1 = pd.read_parquet(PASS1)[["aspect", "n_mentions", "share_negative"]]
    p1 = p1.rename(columns={"n_mentions": "p1_n", "share_negative": "p1_neg"})
    merged = summary[["aspect", "n", "pct_neg"]].merge(p1, on="aspect", how="inner")
    merged["p1_pain"] = merged["p1_n"] * merged["p1_neg"]
    merged["p2_pain"] = merged["n"] * merged["pct_neg"]
    merged = merged[merged["n"] >= 15].copy()

    fig, ax = plt.subplots(figsize=(10, 9))
    fig.subplots_adjust(left=0.10, right=0.95, top=0.88, bottom=0.10)

    # log-log scatter
    x = merged["p1_pain"].clip(lower=0.5)
    y = merged["p2_pain"].clip(lower=0.5)
    ax.scatter(x, y, s=80, c="#2980b9", alpha=0.6, edgecolors="white", linewidths=0.8)
    for r in merged.itertuples():
        # Annotate top points to show interesting shifts
        if r.p2_pain > 10 or abs(r.p2_pain - r.p1_pain * 0.3) > 8:
            ax.annotate(r.aspect, (max(r.p1_pain, 0.5), max(r.p2_pain, 0.5)),
                        fontsize=9, color=C_TEXT, xytext=(4, 4),
                        textcoords="offset points")

    # Reference line: x=y would mean Pass 2 perfectly reproduced Pass 1
    lim = max(merged["p1_pain"].max(), merged["p2_pain"].max()) * 1.2
    ax.plot([0.5, lim], [0.5, lim], color=C_SUB, linewidth=1, linestyle="--", alpha=0.6,
            label="x = y  (Pass 2 == Pass 1)")
    ax.set_xscale("log"); ax.set_yscale("log")
    ax.set_xlabel("Pass 1 pain score (raw noun-chunk + sentence VADER)", color=C_TEXT)
    ax.set_ylabel("Pass 2 pain score (DeBERTa-ABSA, aspect-targeted)", color=C_TEXT)
    ax.tick_params(colors=C_SUB)
    ax.legend(frameon=False, loc="upper left")

    _title_block(fig,
        "Pass 1 vs Pass 2 — why ABSA matters",
        "Aspects below the dashed line: Pass 1 over-counted noise. Above: Pass 2 found pain Pass 1 missed.")
    out = FINDINGS / "16_absa_vs_pass1.png"
    fig.savefig(out, dpi=140); plt.close(fig); return out


def main() -> int:
    summary = build_summary()
    print(f"summary: {len(summary)} aspects rolled up")
    for fn in (chart_12_pain, chart_13_praised, chart_14_mix, chart_15_category, chart_16_comparison):
        out = fn(summary)
        print(f"wrote {out.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
