"""Initial descriptive sentiment analysis on r/Wattpad posts (last 2y, keep-flairs).

Reads:
  data/sentiment_descriptives.parquet  (built by scripts/build_sentiment_descriptives.py)

Writes:
  analysis/tables/sentiment_by_flair.csv
  analysis/tables/sentiment_by_month.csv
  analysis/tables/sentiment_by_flair_month.csv
  analysis/findings/05_sentiment_by_flair.png
  analysis/findings/06_sentiment_distribution_by_flair.png
  analysis/findings/07_sentiment_class_mix_by_flair.png
  analysis/findings/08_sentiment_weighted_vs_unweighted.png
  analysis/findings/09_sentiment_vs_score.png

The monthly-trend chart was archived: post counts go from ~10/month in 2024 to
600+/month in 2026 due to crawl coverage, not real community shifts — see
analysis/archive/charts/34_sentiment_monthly_trend.png.

VADER threshold convention: pos > 0.05, neg < -0.05, else neu (the package author's
recommended bands). 95% CIs are bootstrap (1,000 resamples, seed=42).
"""
from __future__ import annotations

import sys
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "src"))
from scope import ANALYTICAL_DROP_FLAIRS  # noqa: E402

SRC = ROOT / "data" / "sentiment_descriptives.parquet"
TBL = ROOT / "analysis" / "tables"
OUT = ROOT / "analysis" / "findings"
TBL.mkdir(parents=True, exist_ok=True)
OUT.mkdir(parents=True, exist_ok=True)

POS_THRESH, NEG_THRESH = 0.05, -0.05
BOOT_N = 1000
RNG = np.random.default_rng(42)

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
C_BAR  = "#2980b9"
C_ACC  = "#e67e22"

# Group flairs by purpose for consistent coloring across charts.
FLAIR_GROUP = {
    "General Help": "help", "Help": "help",
    "Looking For: Feedback": "looking_for",
    "Looking For: Recommendations": "looking_for",
    "Looking For: R4R/V4V/C4C/F4F": "looking_for",
    "Looking For: Read for Read": "looking_for",
    "Milestone": "social",
    "Off-Topic": "social",
    "Other": "social",
    "Services": "marketplace",
    "Announcement": "meta",
    "Monthly Discussion": "meta",
    "Weekly Promotion": "meta",
    "Media": "social",
}
GROUP_COLOR = {
    "help":         "#c0392b",
    "looking_for":  "#2980b9",
    "social":       "#8e44ad",
    "marketplace":  "#27ae60",
    "meta":         "#7f8c8d",
}


def _title_block(fig, title: str, subtitle: str, x: float = 0.05, y: float = 0.965) -> None:
    fig.text(x, y, title, fontsize=16, fontweight="bold", color=C_TEXT)
    fig.text(x, y - 0.035, subtitle, fontsize=10, color=C_SUB)


def _bootstrap_ci(values: np.ndarray, fn=np.mean, n_boot: int = BOOT_N, alpha: float = 0.05):
    if len(values) < 2:
        return (np.nan, np.nan)
    idx = RNG.integers(0, len(values), size=(n_boot, len(values)))
    stats = fn(values[idx], axis=1)
    return (np.quantile(stats, alpha / 2), np.quantile(stats, 1 - alpha / 2))


def _label_sentiment(c: float) -> str:
    if c > POS_THRESH:
        return "pos"
    if c < NEG_THRESH:
        return "neg"
    return "neu"


def load_scored() -> pd.DataFrame:
    df = pd.read_parquet(SRC)
    n_before = len(df)
    df = df[~df["flair"].isin(ANALYTICAL_DROP_FLAIRS)].copy()
    if n_before != len(df):
        print(f"  dropped {n_before - len(df)} posts in ANALYTICAL_DROP_FLAIRS")
    df = df.dropna(subset=["vader_compound"]).copy()
    df["vader_compound"] = df["vader_compound"].astype(float)
    df["sent_class"] = df["vader_compound"].apply(_label_sentiment)
    df["score_w"] = np.log1p(df["score"].clip(lower=0))
    return df


def summarise(df: pd.DataFrame, group_col: str) -> pd.DataFrame:
    rows = []
    for key, g in df.groupby(group_col):
        v = g["vader_compound"].to_numpy()
        w = g["score_w"].to_numpy()
        ci_lo, ci_hi = _bootstrap_ci(v)
        wm = np.average(v, weights=w) if w.sum() > 0 else np.nan
        rows.append({
            group_col: key,
            "n": len(g),
            "unique_authors": g["author"].nunique(),
            "mean": v.mean(),
            "median": np.median(v),
            "std": v.std(ddof=1) if len(v) > 1 else 0.0,
            "ci_lo": ci_lo,
            "ci_hi": ci_hi,
            "pct_pos": (g["sent_class"] == "pos").mean(),
            "pct_neu": (g["sent_class"] == "neu").mean(),
            "pct_neg": (g["sent_class"] == "neg").mean(),
            "weighted_mean": wm,
            "median_score": g["score"].median(),
            "median_body_chars": g["body_chars"].median(),
            "pct_empty_body": g["body_is_empty"].mean(),
        })
    return pd.DataFrame(rows).sort_values("n", ascending=False).reset_index(drop=True)


# ---------- charts ----------

def chart_sentiment_by_flair(df: pd.DataFrame, summary: pd.DataFrame) -> Path:
    s = summary.sort_values("mean")
    fig, ax = plt.subplots(figsize=(10, 0.45 * len(s) + 2.2))
    fig.subplots_adjust(left=0.32, right=0.92, top=0.86, bottom=0.10)
    y = list(range(len(s)))
    colors = [GROUP_COLOR.get(FLAIR_GROUP.get(f, "social"), C_BAR) for f in s["flair"]]
    ax.barh(y, s["mean"], color=colors, edgecolor="white")
    err_lo = s["mean"] - s["ci_lo"]
    err_hi = s["ci_hi"] - s["mean"]
    ax.errorbar(s["mean"], y, xerr=[err_lo, err_hi], fmt="none",
                ecolor=C_TEXT, elinewidth=1, capsize=3, alpha=0.7)
    ax.axvline(0, color=C_SUB, linewidth=0.8)
    ax.set_yticks(y)
    ax.set_yticklabels(s["flair"], color=C_TEXT)
    ax.set_xlabel("Mean VADER compound (negative ← → positive)", color=C_TEXT)
    ax.tick_params(colors=C_SUB)
    for yi, (m, n) in enumerate(zip(s["mean"], s["n"])):
        x = m + (0.02 if m >= 0 else -0.02)
        ha = "left" if m >= 0 else "right"
        ax.text(x, yi, f"{m:+.2f}  (n={int(n)})", va="center", ha=ha,
                fontsize=9, color=C_TEXT)
    span = max(abs(s["ci_lo"].min()), abs(s["ci_hi"].max())) * 1.4
    ax.set_xlim(-span, span)
    _title_block(fig,
        "r/Wattpad — mean sentiment per flair (last 2 years)",
        f"{len(df):,} posts, VADER compound score, error bars = 95% bootstrap CI")
    out = OUT / "05_sentiment_by_flair.png"
    fig.savefig(out, dpi=140); plt.close(fig); return out


def chart_distribution_by_flair(df: pd.DataFrame) -> Path:
    order = (df.groupby("flair")["vader_compound"].median()
             .sort_values().index.tolist())
    fig, ax = plt.subplots(figsize=(10, 0.45 * len(order) + 2.2))
    fig.subplots_adjust(left=0.32, right=0.96, top=0.86, bottom=0.10)
    data = [df.loc[df.flair == f, "vader_compound"].to_numpy() for f in order]
    bp = ax.boxplot(data, vert=False, patch_artist=True, widths=0.6,
                    medianprops=dict(color=C_TEXT, linewidth=1.4),
                    flierprops=dict(marker=".", markersize=3, markerfacecolor=C_SUB,
                                    markeredgecolor=C_SUB, alpha=0.4))
    for patch, flair in zip(bp["boxes"], order):
        patch.set_facecolor(GROUP_COLOR.get(FLAIR_GROUP.get(flair, "social"), C_BAR))
        patch.set_alpha(0.55)
        patch.set_edgecolor(C_TEXT)
    ax.axvline(0, color=C_SUB, linewidth=0.8)
    ax.set_yticklabels(order, color=C_TEXT)
    ax.set_xlabel("VADER compound", color=C_TEXT)
    ax.tick_params(colors=C_SUB)
    _title_block(fig,
        "r/Wattpad — sentiment distribution per flair",
        f"{len(df):,} posts, box = IQR / median / whiskers 1.5×IQR")
    out = OUT / "06_sentiment_distribution_by_flair.png"
    fig.savefig(out, dpi=140); plt.close(fig); return out


def chart_class_mix_by_flair(df: pd.DataFrame, summary: pd.DataFrame) -> Path:
    s = summary.sort_values("pct_neg", ascending=True)
    fig, ax = plt.subplots(figsize=(10, 0.45 * len(s) + 2.2))
    fig.subplots_adjust(left=0.32, right=0.96, top=0.86, bottom=0.10)
    y = list(range(len(s)))
    pos = s["pct_pos"].values
    neu = s["pct_neu"].values
    neg = s["pct_neg"].values
    ax.barh(y, pos, color=C_POS, edgecolor="white", label="positive (>0.05)")
    ax.barh(y, neu, left=pos, color=C_NEU, edgecolor="white", label="neutral")
    ax.barh(y, neg, left=pos + neu, color=C_NEG, edgecolor="white", label="negative (<−0.05)")
    ax.set_yticks(y); ax.set_yticklabels(s["flair"], color=C_TEXT)
    ax.set_xlabel("Share of posts", color=C_TEXT)
    ax.set_xlim(0, 1); ax.tick_params(colors=C_SUB)
    for yi, (p, ne, ng, n) in enumerate(zip(pos, neu, neg, s["n"])):
        ax.text(1.01, yi, f"n={int(n)}", va="center", fontsize=9, color=C_TEXT)
    ax.legend(loc="lower center", bbox_to_anchor=(0.5, -0.15),
              ncol=3, frameon=False, fontsize=10)
    _title_block(fig,
        "r/Wattpad — positive / neutral / negative mix per flair",
        f"{len(df):,} posts, VADER thresholds ±0.05")
    out = OUT / "07_sentiment_class_mix_by_flair.png"
    fig.savefig(out, dpi=140); plt.close(fig); return out


def chart_monthly_trend(df: pd.DataFrame) -> Path:
    monthly = (df.groupby("month")
               .agg(mean=("vader_compound", "mean"),
                    n=("vader_compound", "size"),
                    pct_neg=("sent_class", lambda s: (s == "neg").mean()))
               .reset_index().sort_values("month"))
    fig, ax = plt.subplots(figsize=(11, 5))
    fig.subplots_adjust(left=0.08, right=0.92, top=0.85, bottom=0.18)
    x = pd.PeriodIndex(monthly["month"], freq="M").to_timestamp()
    ax.plot(x, monthly["mean"], color=C_BAR, linewidth=1.6, marker="o",
            markersize=4, label="Mean sentiment")
    if len(monthly) >= 3:
        rolling = monthly["mean"].rolling(3, center=True, min_periods=1).mean()
        ax.plot(x, rolling, color=C_ACC, linewidth=2.2, alpha=0.8,
                label="3-month rolling mean")
    ax.axhline(0, color=C_SUB, linewidth=0.8)
    ax.set_ylabel("Mean VADER compound", color=C_TEXT)
    ax.set_xlabel("")
    ax.tick_params(colors=C_SUB); ax.legend(frameon=False)
    ax2 = ax.twinx()
    ax2.bar(x, monthly["n"], width=20, color=C_NEU, alpha=0.35,
            label="Post count")
    ax2.set_ylabel("Posts per month", color=C_SUB)
    ax2.spines["top"].set_visible(False)
    ax2.grid(False); ax2.tick_params(colors=C_SUB)
    _title_block(fig,
        "r/Wattpad — sentiment over time",
        f"{len(df):,} posts, monthly mean + 3-month rolling; bars = volume")
    out = OUT / "34_sentiment_monthly_trend.png"
    fig.savefig(out, dpi=140); plt.close(fig); return out


def chart_weighted_vs_unweighted(summary: pd.DataFrame) -> Path:
    s = summary.sort_values("mean")
    fig, ax = plt.subplots(figsize=(10, 0.45 * len(s) + 2.2))
    fig.subplots_adjust(left=0.32, right=0.95, top=0.86, bottom=0.10)
    y = list(range(len(s)))
    ax.scatter(s["mean"], y, color=C_BAR, s=70, label="Unweighted mean", zorder=3)
    ax.scatter(s["weighted_mean"], y, color=C_ACC, s=70, marker="D",
               label="Score-weighted (log1p)", zorder=3)
    for yi, (m, w) in enumerate(zip(s["mean"], s["weighted_mean"])):
        ax.plot([m, w], [yi, yi], color=C_SUB, linewidth=1, alpha=0.6, zorder=1)
    ax.axvline(0, color=C_SUB, linewidth=0.8)
    ax.set_yticks(y); ax.set_yticklabels(s["flair"], color=C_TEXT)
    ax.set_xlabel("VADER compound", color=C_TEXT)
    ax.tick_params(colors=C_SUB)
    ax.legend(frameon=False, loc="lower right")
    _title_block(fig,
        "r/Wattpad — unweighted vs. upvote-weighted sentiment",
        "Divergence = community amplified posts differently than their raw mean suggests")
    out = OUT / "08_sentiment_weighted_vs_unweighted.png"
    fig.savefig(out, dpi=140); plt.close(fig); return out


def chart_sentiment_vs_score(df: pd.DataFrame) -> Path:
    fig, ax = plt.subplots(figsize=(10, 6))
    fig.subplots_adjust(left=0.08, right=0.78, top=0.88, bottom=0.12)
    groups = sorted(df["flair"].map(FLAIR_GROUP).fillna("social").unique())
    for grp in groups:
        sub = df[df["flair"].map(FLAIR_GROUP).fillna("social") == grp]
        ax.scatter(sub["score"].clip(lower=0) + 1, sub["vader_compound"],
                   color=GROUP_COLOR.get(grp, C_BAR), alpha=0.5, s=22,
                   edgecolors="white", linewidths=0.4, label=grp)
    ax.set_xscale("log")
    ax.axhline(0, color=C_SUB, linewidth=0.8)
    ax.set_xlabel("Upvotes (log, +1)", color=C_TEXT)
    ax.set_ylabel("VADER compound", color=C_TEXT)
    ax.tick_params(colors=C_SUB)
    ax.legend(title="Flair group", frameon=False, loc="center left",
              bbox_to_anchor=(1.02, 0.5))
    _title_block(fig,
        "r/Wattpad — sentiment vs upvotes per post",
        f"{len(df):,} posts; checks if community amplifies positive or negative posts")
    out = OUT / "09_sentiment_vs_score.png"
    fig.savefig(out, dpi=140); plt.close(fig); return out


def main() -> int:
    df = load_scored()
    print(f"loaded {len(df):,} scored posts ({df.author.nunique():,} authors)")

    flair_summary = summarise(df, "flair")
    flair_summary.to_csv(TBL / "sentiment_by_flair.csv", index=False)
    print("wrote tables/sentiment_by_flair.csv")

    # chart_monthly_trend was archived: pre-2026 months have <20 posts each due
    # to crawl coverage, so the time series is mostly a crawl artifact, not a
    # community signal. See analysis/archive/charts/34_sentiment_monthly_trend.png.
    for fn in (
        lambda: chart_sentiment_by_flair(df, flair_summary),
        lambda: chart_distribution_by_flair(df),
        lambda: chart_class_mix_by_flair(df, flair_summary),
        lambda: chart_weighted_vs_unweighted(flair_summary),
        lambda: chart_sentiment_vs_score(df),
    ):
        out = fn()
        print(f"wrote {out.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
