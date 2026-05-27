"""Pass 1 aspect-vocabulary visualizations + curation table.

Reads:
  data/aspect_vocabulary.parquet

Writes:
  analysis/findings/10_top_aspects_frequency_pass1.png
  analysis/findings/11_top_aspects_pain_pass1.png
  analysis/tables/aspects_top200_for_review.csv

The top-N is dominated by generic platform nouns (story, book, chapter) and
fiction-content nouns (mmc, fmc, war, death). Pass 2 (ABSA) wants a curated
~50 real platform aspects, so we also emit a CSV ready for human triage:
mark each row keep/drop/category.
"""
from __future__ import annotations

from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "data" / "aspect_vocabulary.parquet"
TBL = ROOT / "analysis" / "tables"
OUT = ROOT / "analysis" / "findings"
TBL.mkdir(parents=True, exist_ok=True)
OUT.mkdir(parents=True, exist_ok=True)

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


def _title_block(fig, title: str, subtitle: str, x: float = 0.05, y: float = 0.965) -> None:
    fig.text(x, y, title, fontsize=16, fontweight="bold", color=C_TEXT)
    fig.text(x, y - 0.035, subtitle, fontsize=10, color=C_SUB)


def _bar_color(share_neg: float) -> str:
    # Green → grey → red, mapping share_negative 0..1
    if share_neg <= 0.20:
        return "#27ae60"
    if share_neg <= 0.40:
        return "#7f8c8d"
    if share_neg <= 0.60:
        return "#e67e22"
    return "#c0392b"


def chart_pain(df: pd.DataFrame) -> Path:
    big = df[df["n_mentions"] >= 10].copy()
    big["pain_score"] = big["n_mentions"] * big["share_negative"]
    top = big.sort_values("pain_score", ascending=True).tail(30)

    fig, ax = plt.subplots(figsize=(11, 0.42 * len(top) + 2.6))
    fig.subplots_adjust(left=0.22, right=0.96, top=0.86, bottom=0.10)
    y = list(range(len(top)))
    colors = [_bar_color(s) for s in top["share_negative"]]
    ax.barh(y, top["pain_score"], color=colors, edgecolor="white")
    ax.set_yticks(y); ax.set_yticklabels(top["aspect"], color=C_TEXT)
    ax.set_xlabel("Pain score  =  mentions × share-negative", color=C_TEXT)
    ax.tick_params(colors=C_SUB)
    for yi, (asp, n, sn, ps) in enumerate(zip(top["aspect"], top["n_mentions"],
                                              top["share_negative"], top["pain_score"])):
        ax.text(ps + max(top["pain_score"]) * 0.01, yi,
                f"n={int(n)}  •  {sn:.0%} neg",
                va="center", fontsize=9, color=C_TEXT)

    # legend for color bands
    legend_specs = [
        ("≤20% negative", "#27ae60"),
        ("20–40%",        "#7f8c8d"),
        ("40–60%",        "#e67e22"),
        (">60% negative", "#c0392b"),
    ]
    handles = [plt.Rectangle((0, 0), 1, 1, color=c) for _, c in legend_specs]
    labels = [lbl for lbl, _ in legend_specs]
    fig.legend(handles, labels, loc="lower center", ncol=4,
               frameon=False, fontsize=9, bbox_to_anchor=(0.5, 0.01))

    _title_block(fig,
        "r/Wattpad — top 30 aspects by 'pain score' (Pass 1, raw)",
        f"{len(df):,} distinct aspects (n≥3); shown: n≥10. Generic nouns NOT yet filtered.")
    out = OUT / "11_top_aspects_pain_pass1.png"
    fig.savefig(out, dpi=140); plt.close(fig); return out


def chart_frequency(df: pd.DataFrame) -> Path:
    top = df.sort_values("n_mentions", ascending=True).tail(30)
    fig, ax = plt.subplots(figsize=(11, 0.42 * len(top) + 2.6))
    fig.subplots_adjust(left=0.22, right=0.96, top=0.86, bottom=0.10)
    y = list(range(len(top)))
    colors = [_bar_color(s) for s in top["share_negative"]]
    ax.barh(y, top["n_mentions"], color=colors, edgecolor="white")
    ax.set_yticks(y); ax.set_yticklabels(top["aspect"], color=C_TEXT)
    ax.set_xlabel("Mentions across all posts", color=C_TEXT)
    ax.tick_params(colors=C_SUB)
    for yi, (n, sn, ms) in enumerate(zip(top["n_mentions"], top["share_negative"],
                                         top["mean_sent"])):
        ax.text(n + max(top["n_mentions"]) * 0.01, yi,
                f"{sn:.0%} neg  •  mean {ms:+.2f}",
                va="center", fontsize=9, color=C_TEXT)

    legend_specs = [
        ("≤20% negative", "#27ae60"),
        ("20–40%",        "#7f8c8d"),
        ("40–60%",        "#e67e22"),
        (">60% negative", "#c0392b"),
    ]
    handles = [plt.Rectangle((0, 0), 1, 1, color=c) for _, c in legend_specs]
    labels = [lbl for lbl, _ in legend_specs]
    fig.legend(handles, labels, loc="lower center", ncol=4,
               frameon=False, fontsize=9, bbox_to_anchor=(0.5, 0.01))

    _title_block(fig,
        "r/Wattpad — top 30 aspects by frequency (Pass 1, raw)",
        f"{len(df):,} distinct aspects (n≥3). Mostly generic platform nouns — Pass 2 needs curation.")
    out = OUT / "10_top_aspects_frequency_pass1.png"
    fig.savefig(out, dpi=140); plt.close(fig); return out


def write_curation_csv(df: pd.DataFrame) -> Path:
    """Top 200 aspects with sample sentence, ready for human keep/drop/category triage."""
    top = df.sort_values("n_mentions", ascending=False).head(200).copy()
    top["keep"] = ""        # human fills: y / n
    top["category"] = ""    # human fills: platform_feature / content_topic / community / ...
    top["notes"] = ""
    cols = ["aspect", "n_mentions", "n_posts", "share_negative", "mean_sent",
            "keep", "category", "notes", "sample_sentence", "sample_doc_id"]
    out = TBL / "aspects_top200_for_review.csv"
    top[cols].to_csv(out, index=False)
    return out


def main() -> int:
    df = pd.read_parquet(SRC)
    print(f"loaded {len(df):,} aspects")
    # write_curation_csv was a one-shot helper; the curated output lives at
    # analysis/tables/aspects_curated_keep.csv now (see analysis/curate_aspects.py).
    for fn in (lambda: chart_pain(df),
               lambda: chart_frequency(df)):
        out = fn()
        print(f"wrote {out.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
