"""VADER sentiment spot-check on 30 stratified posts.

Two modes:
  python analysis/validate_vader.py            # write unlabeled CSV
  python analysis/validate_vader.py --score    # score after user labels gold_class

Stratified sample: 10 posts each from pos / neu / neg bands of vader_compound.
User hand-labels gold_class as `pos`/`neu`/`neg`. Re-run with --score to compute
accuracy, per-class precision/recall, Cohen's κ, confusion matrix, and write
analysis/findings/vader_validation.md.

Sample is deterministic (seed=42) so re-running --score after edits is safe.
"""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

import numpy as np
import pandas as pd

REPO_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO_ROOT / "src"))
from scope import ANALYTICAL_DROP_FLAIRS  # noqa: E402
SRC = REPO_ROOT / "data" / "sentiment_descriptives.parquet"
TBL = REPO_ROOT / "analysis" / "tables"
FINDINGS = REPO_ROOT / "analysis" / "findings"
UNLABELED = TBL / "vader_spot_check_unlabeled.csv"
SCORED = TBL / "vader_spot_check_scored.csv"
REPORT = FINDINGS / "vader_validation.md"

POS_THRESH, NEG_THRESH = 0.05, -0.05
N_PER_BAND = 10
SEED = 42
LABELS = ("pos", "neu", "neg")


def label_band(c: float) -> str:
    if c > POS_THRESH:
        return "pos"
    if c < NEG_THRESH:
        return "neg"
    return "neu"


def write_unlabeled() -> Path:
    df = pd.read_parquet(SRC).dropna(subset=["vader_compound"]).copy()
    n_before = len(df)
    df = df[~df["flair"].isin(ANALYTICAL_DROP_FLAIRS)].copy()
    if n_before != len(df):
        print(f"  dropped {n_before - len(df)} posts in ANALYTICAL_DROP_FLAIRS before sampling")
    df["vader_compound"] = df["vader_compound"].astype(float)
    df["vader_class"] = df["vader_compound"].apply(label_band)

    pos = df[df["vader_compound"] > 0.3].sample(n=N_PER_BAND, random_state=SEED)
    neu = df[df["vader_compound"].between(-0.05, 0.05)].sample(n=N_PER_BAND, random_state=SEED)
    neg = df[df["vader_compound"] < -0.3].sample(n=N_PER_BAND, random_state=SEED)
    sample = pd.concat([pos, neu, neg], ignore_index=True)

    body_map = dict(zip(
        pd.read_parquet(REPO_ROOT / "data" / "corpus_wattpad_full.parquet",
                        columns=["doc_id", "body"])["doc_id"],
        pd.read_parquet(REPO_ROOT / "data" / "corpus_wattpad_full.parquet",
                        columns=["doc_id", "body"])["body"].fillna(""),
    ))
    sample["body_first_300"] = sample["doc_id"].map(body_map).fillna("").str[:300]
    sample["gold_class"] = ""
    sample["notes"] = ""
    cols = ["doc_id", "flair", "title", "body_first_300",
            "vader_compound", "vader_class", "gold_class", "notes"]
    TBL.mkdir(parents=True, exist_ok=True)
    sample[cols].to_csv(UNLABELED, index=False)
    return UNLABELED


def score() -> Path:
    if not UNLABELED.exists():
        sys.exit(f"missing {UNLABELED} — run without --score first")
    df = pd.read_csv(UNLABELED)
    df["gold_class"] = df["gold_class"].astype(str).str.strip().str.lower()
    labeled = df[df["gold_class"].isin(LABELS)].copy()
    if len(labeled) < len(df):
        print(f"  warning: {len(df) - len(labeled)} rows unlabeled; scoring {len(labeled)}",
              file=sys.stderr)
    if len(labeled) == 0:
        sys.exit("no labeled rows; fill gold_class first")

    labeled["correct"] = labeled["gold_class"] == labeled["vader_class"]
    acc = labeled["correct"].mean()

    # confusion matrix
    conf = pd.crosstab(labeled["gold_class"], labeled["vader_class"],
                       rownames=["gold"], colnames=["vader"], dropna=False)
    conf = conf.reindex(index=LABELS, columns=LABELS, fill_value=0)

    # per-class P/R
    rows = []
    for lbl in LABELS:
        tp = conf.loc[lbl, lbl]
        fp = conf[lbl].sum() - tp
        fn = conf.loc[lbl].sum() - tp
        precision = tp / (tp + fp) if (tp + fp) else float("nan")
        recall    = tp / (tp + fn) if (tp + fn) else float("nan")
        rows.append({"class": lbl, "n_gold": int(conf.loc[lbl].sum()),
                     "n_pred": int(conf[lbl].sum()),
                     "precision": precision, "recall": recall})
    per_class = pd.DataFrame(rows)

    # Cohen's κ
    po = acc
    p_gold = np.array([conf.loc[c].sum() for c in LABELS]) / labeled.shape[0]
    p_pred = np.array([conf[c].sum()     for c in LABELS]) / labeled.shape[0]
    pe = float((p_gold * p_pred).sum())
    kappa = (po - pe) / (1 - pe) if pe < 1 else float("nan")

    labeled.to_csv(SCORED, index=False)
    FINDINGS.mkdir(parents=True, exist_ok=True)
    with REPORT.open("w") as f:
        f.write(_render_markdown(labeled, acc, kappa, conf, per_class))
    return REPORT


def _render_markdown(labeled: pd.DataFrame, acc: float, kappa: float,
                     conf: pd.DataFrame, per_class: pd.DataFrame) -> str:
    errors = labeled[~labeled["correct"]]
    n = len(labeled)
    rows = []
    for r in errors.itertuples():
        rows.append(f"| `{r.doc_id}` | {r.flair} | {r.vader_class} | {r.gold_class} | "
                    f"{r.vader_compound:+.2f} | {(r.title or '')[:80].replace('|', '/')} |")
    err_table = "\n".join(rows) if rows else "_(no errors)_"

    return f"""# VADER spot-check — accuracy on r/Wattpad posts

**Sample:** {n} posts, stratified 10/10/10 across VADER bands (>0.3 / ±0.05 / <−0.3), seed={SEED}.

## Headline
- **Accuracy:** {acc:.1%}
- **Cohen's κ:** {kappa:.2f}  *(0.21–0.40 fair, 0.41–0.60 moderate, 0.61–0.80 substantial)*

## Confusion matrix
Rows = hand-labeled gold; columns = VADER prediction.

|        | pred pos | pred neu | pred neg |
|--------|---------:|---------:|---------:|
| **pos** | {conf.loc['pos','pos']} | {conf.loc['pos','neu']} | {conf.loc['pos','neg']} |
| **neu** | {conf.loc['neu','pos']} | {conf.loc['neu','neu']} | {conf.loc['neu','neg']} |
| **neg** | {conf.loc['neg','pos']} | {conf.loc['neg','neu']} | {conf.loc['neg','neg']} |

## Per-class precision / recall

| class | n gold | n pred | precision | recall |
|---|---:|---:|---:|---:|
{chr(10).join(f"| {r['class']} | {r['n_gold']} | {r['n_pred']} | {r['precision']:.0%} | {r['recall']:.0%} |" for _, r in per_class.iterrows())}

## Errors ({len(errors)} / {n})

| doc_id | flair | VADER pred | gold | compound | title |
|---|---|---|---|---:|---|
{err_table}

## Implication
- If accuracy ≥ 65% and κ ≥ 0.40: VADER is fit for **relative comparisons across categories** but not for absolute claims.
- If accuracy < 65% or κ < 0.30: re-examine flair-level findings in charts 31-36 — large categories may be systematically mis-labeled.
- ABSA Pass 2 inherits this error rate on the training data it was fine-tuned on (SemEval), but the *aspect-presence* filter mitigates the long-tail noise that hurts VADER most.

*Generated by `analysis/validate_vader.py --score`.*
"""


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--score", action="store_true",
                    help="Compute metrics on a labeled CSV (default: write unlabeled CSV)")
    args = ap.parse_args()
    if args.score:
        out = score()
        print(f"wrote {out.relative_to(REPO_ROOT)} and {SCORED.relative_to(REPO_ROOT)}")
    else:
        out = write_unlabeled()
        print(f"wrote {out.relative_to(REPO_ROOT)}")
        print(f"  fill the gold_class column ('pos'/'neu'/'neg'), then run with --score")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
