"""ABSA spot-check: 50 stratified samples for hand-labeling.

Two modes (mirrors analysis/validate_vader.py):
  python analysis/validate_aspect_sentiment.py            # write unlabeled CSV
  python analysis/validate_aspect_sentiment.py --score    # compute metrics

Sample composition (50 rows, seed=42, deterministic):
  - 15 predicted positive
  - 15 predicted neutral
  - 15 predicted negative
  -  5 from ambiguous-notes aspects (lover, message, etc.) to stress the edges

User fills gold_label as `positive` / `negative` / `neutral`.
"""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

import numpy as np
import pandas as pd

REPO_ROOT = Path(__file__).resolve().parent.parent
SRC = REPO_ROOT / "data" / "aspect_sentiment.parquet"
CURATED = REPO_ROOT / "analysis" / "tables" / "aspects_curated_keep.csv"
TBL = REPO_ROOT / "analysis" / "tables"
FINDINGS = REPO_ROOT / "analysis" / "findings"
UNLABELED = TBL / "absa_spot_check_unlabeled.csv"
SCORED = TBL / "absa_spot_check_scored.csv"
REPORT = FINDINGS / "absa_validation.md"

LABELS = ("positive", "neutral", "negative")
N_PER_BAND = 15
N_AMBIGUOUS = 5
SEED = 42


def write_unlabeled() -> Path:
    df = pd.read_parquet(SRC)
    curated = pd.read_csv(CURATED)
    notes_map = dict(zip(curated["aspect"], curated["notes"].fillna("")))
    df["notes"] = df["aspect"].map(notes_map).fillna("")

    rng = np.random.default_rng(SEED)

    def sample(mask, n):
        sub = df[mask]
        return sub.sample(n=min(n, len(sub)), random_state=rng.integers(1 << 31))

    parts = [
        sample(df["label"] == "positive", N_PER_BAND),
        sample(df["label"] == "neutral", N_PER_BAND),
        sample(df["label"] == "negative", N_PER_BAND),
        sample(df["notes"].astype(bool), N_AMBIGUOUS),  # stress edges
    ]
    sample_df = pd.concat(parts, ignore_index=True).drop_duplicates(
        subset=["doc_id", "sent_idx", "aspect"]
    )
    sample_df["gold_label"] = ""
    sample_df["disagree_reason"] = ""
    cols = ["doc_id", "sent_idx", "aspect", "aspect_category",
            "sentence_text", "label", "prob_pos", "prob_neg", "prob_neu",
            "gold_label", "disagree_reason", "notes"]
    TBL.mkdir(parents=True, exist_ok=True)
    sample_df[cols].to_csv(UNLABELED, index=False)
    return UNLABELED


def score() -> Path:
    if not UNLABELED.exists():
        sys.exit(f"missing {UNLABELED} — run without --score first")
    df = pd.read_csv(UNLABELED)
    df["gold_label"] = df["gold_label"].astype(str).str.strip().str.lower()
    labeled = df[df["gold_label"].isin(LABELS)].copy()
    if len(labeled) < len(df):
        print(f"  warning: {len(df) - len(labeled)} rows unlabeled; scoring {len(labeled)}",
              file=sys.stderr)
    if len(labeled) == 0:
        sys.exit("no labeled rows; fill gold_label first")

    labeled["correct"] = labeled["gold_label"] == labeled["label"]
    acc = labeled["correct"].mean()

    conf = pd.crosstab(labeled["gold_label"], labeled["label"],
                       rownames=["gold"], colnames=["pred"], dropna=False)
    conf = conf.reindex(index=LABELS, columns=LABELS, fill_value=0)

    rows = []
    for lbl in LABELS:
        tp = int(conf.loc[lbl, lbl])
        fp = int(conf[lbl].sum() - tp)
        fn = int(conf.loc[lbl].sum() - tp)
        precision = tp / (tp + fp) if (tp + fp) else float("nan")
        recall    = tp / (tp + fn) if (tp + fn) else float("nan")
        rows.append({"class": lbl, "n_gold": int(conf.loc[lbl].sum()),
                     "n_pred": int(conf[lbl].sum()),
                     "precision": precision, "recall": recall})
    per_class = pd.DataFrame(rows)

    # Cohen's κ
    po = acc
    p_gold = np.array([conf.loc[c].sum() for c in LABELS]) / labeled.shape[0]
    p_pred = np.array([conf[c].sum() for c in LABELS]) / labeled.shape[0]
    pe = float((p_gold * p_pred).sum())
    kappa = (po - pe) / (1 - pe) if pe < 1 else float("nan")

    # Per-aspect breakdown for top 10 most-scored aspects
    full = pd.read_parquet(SRC)
    top_aspects = full["aspect"].value_counts().head(10).index.tolist()
    aspect_perf = labeled[labeled["aspect"].isin(top_aspects)].groupby("aspect").agg(
        n=("correct", "size"),
        acc=("correct", "mean"),
    ).round(2)

    labeled.to_csv(SCORED, index=False)
    FINDINGS.mkdir(parents=True, exist_ok=True)
    with REPORT.open("w") as f:
        f.write(_render_markdown(labeled, acc, kappa, conf, per_class, aspect_perf))
    return REPORT


def _render_markdown(labeled, acc, kappa, conf, per_class, aspect_perf) -> str:
    errors = labeled[~labeled["correct"]]
    n = len(labeled)
    err_rows = []
    for r in errors.itertuples():
        reason = (r.disagree_reason or "")[:80].replace("|", "/")
        err_rows.append(
            f"| `{r.aspect}` | {r.label} | {r.gold_label} | {r.prob_pos:.2f}/{r.prob_neg:.2f}/{r.prob_neu:.2f} | "
            f"{(r.sentence_text or '')[:80].replace('|', '/')} | {reason} |"
        )
    err_table = "\n".join(err_rows) if err_rows else "_(no errors)_"

    aspect_block = "\n".join(
        f"| {idx} | {row.n} | {row.acc:.0%} |" for idx, row in aspect_perf.iterrows()
    ) if not aspect_perf.empty else "_(none of the top-10 aspects were in the spot-check)_"

    return f"""# ABSA spot-check — yangheng/deberta-v3-base-absa-v1.1 on r/Wattpad

**Sample:** {n} (aspect, sentence) pairs, stratified ~15/15/15 across predicted labels
plus 5 from notes-ambiguous aspects. Seed={SEED}.

## Headline
- **Accuracy:** {acc:.1%}
- **Cohen's κ:** {kappa:.2f}  *(0.21–0.40 fair, 0.41–0.60 moderate, 0.61–0.80 substantial)*

## Confusion matrix
Rows = hand-labeled gold; columns = ABSA prediction.

|        | pred pos | pred neu | pred neg |
|--------|---------:|---------:|---------:|
| **pos** | {conf.loc['positive','positive']} | {conf.loc['positive','neutral']} | {conf.loc['positive','negative']} |
| **neu** | {conf.loc['neutral','positive']} | {conf.loc['neutral','neutral']} | {conf.loc['neutral','negative']} |
| **neg** | {conf.loc['negative','positive']} | {conf.loc['negative','neutral']} | {conf.loc['negative','negative']} |

## Per-class precision / recall

| class | n gold | n pred | precision | recall |
|---|---:|---:|---:|---:|
{chr(10).join(f"| {r['class']} | {r['n_gold']} | {r['n_pred']} | {r['precision']:.0%} | {r['recall']:.0%} |" for _, r in per_class.iterrows())}

## Per-aspect accuracy (top-10 aspects appearing in the sample)

| aspect | n in sample | accuracy |
|---|---:|---:|
{aspect_block}

## Errors ({len(errors)} / {n})

| aspect | ABSA pred | gold | probs (pos/neg/neu) | sentence (first 80 chars) | reason |
|---|---|---|---|---|---|
{err_table}

## Implication
- **Accuracy ≥ 75%** → trust the aspect rankings (e.g. `scam` 98% negative, `algorithm` 50% negative) for prioritization.
- **65–75%** → relative ranking is still useful but absolute numbers warrant skepticism. Spot-check ambiguous aspects before deepdive use.
- **< 65%** → revisit the SYNONYMS map in src/absa.py — false-positive matches (e.g. `lover` matching "fanfic lover" as platform feature) are the likely cause.

*Generated by `analysis/validate_aspect_sentiment.py --score`.*
"""


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--score", action="store_true",
                    help="Compute metrics on a labeled CSV")
    args = ap.parse_args()
    if args.score:
        out = score()
        print(f"wrote {out.relative_to(REPO_ROOT)} and {SCORED.relative_to(REPO_ROOT)}")
    else:
        out = write_unlabeled()
        print(f"wrote {out.relative_to(REPO_ROOT)}")
        print(f"  fill the gold_label column ('positive'/'negative'/'neutral'), then run with --score")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
