"""Structural invariants on data/aspect_sentiment.parquet — no model required.

Mirrors the spirit of test_quotes_not_hallucinated.py: enforces that ABSA output
is internally consistent and traces back to the sentence cache + curated aspect list.

Critical invariant: when match_span_start >= 0, the substring at that slice of
sentence_text must equal the aspect (case-insensitively). This is the anti-
hallucination guard — if we ever start emitting aspect labels that don't appear
in the sentence, this fails loudly.
"""
from __future__ import annotations

import sys
from pathlib import Path

import pandas as pd
import pytest

REPO_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO_ROOT / "src"))

ABSA_PATH = REPO_ROOT / "data" / "aspect_sentiment.parquet"
SENTS_PATH = REPO_ROOT / "data" / "sentences_wattpad.parquet"
ASPECTS_PATH = REPO_ROOT / "analysis" / "tables" / "aspects_curated_keep.csv"

VALID_LABELS = {"positive", "negative", "neutral"}
EXPECTED_COLS = {
    "doc_id", "sent_idx", "aspect", "aspect_category",
    "sentence_text", "match_span_start", "match_span_end",
    "label", "score_signed", "prob_pos", "prob_neg", "prob_neu",
    "model", "scored_at",
}


@pytest.fixture(scope="module")
def absa() -> pd.DataFrame:
    assert ABSA_PATH.exists(), f"missing {ABSA_PATH} — run scripts/build_aspect_sentiment.py"
    df = pd.read_parquet(ABSA_PATH)
    assert len(df) > 0, "aspect_sentiment.parquet is empty"
    return df


@pytest.fixture(scope="module")
def sentences() -> pd.DataFrame:
    df = pd.read_parquet(SENTS_PATH)
    return df.set_index(["doc_id", "sent_idx"])


@pytest.fixture(scope="module")
def aspects() -> set[str]:
    df = pd.read_csv(ASPECTS_PATH)
    return set(df[df["keep"] == "y"]["aspect"].tolist())


def test_schema_columns_present(absa):
    missing = EXPECTED_COLS - set(absa.columns)
    extra = set(absa.columns) - EXPECTED_COLS
    assert not missing, f"missing columns: {missing}"
    assert not extra, f"unexpected columns: {extra}"


def test_label_values_valid(absa):
    bad = set(absa["label"].unique()) - VALID_LABELS
    assert not bad, f"unexpected labels: {bad}"


def test_probabilities_sum_to_one(absa):
    sums = absa["prob_pos"] + absa["prob_neg"] + absa["prob_neu"]
    bad = absa[(sums < 0.999) | (sums > 1.001)]
    assert bad.empty, f"{len(bad)} rows where prob sum is not ~1.0 (first 3:\n{bad.head(3)})"


def test_score_signed_matches_probs(absa):
    expected = absa["prob_pos"] - absa["prob_neg"]
    diff = (absa["score_signed"] - expected).abs()
    bad = absa[diff > 1e-4]
    assert bad.empty, f"{len(bad)} rows where score_signed != prob_pos - prob_neg"


def test_doc_id_sent_idx_in_sentence_cache(absa, sentences):
    keys = pd.MultiIndex.from_frame(absa[["doc_id", "sent_idx"]])
    missing = ~keys.isin(sentences.index)
    n_missing = int(missing.sum())
    assert n_missing == 0, f"{n_missing} rows reference (doc_id, sent_idx) not in sentence cache"


def test_aspect_in_curated_keep(absa, aspects):
    seen = set(absa["aspect"].unique())
    extra = seen - aspects
    assert not extra, f"aspects in output not in curated keep list: {extra}"


def test_anti_hallucination_span_matches_aspect(absa):
    """The crown jewel: when we recorded a span, the sentence at that slice IS the aspect."""
    has_span = absa[absa["match_span_start"] >= 0]
    failures = []
    for r in has_span.itertuples():
        slice_text = r.sentence_text[r.match_span_start: r.match_span_end].lower()
        # Allow synonym matches: the slice need not equal aspect, but must be one of the
        # aspect's known surface forms. Easiest check: slice should appear in the
        # synonyms list of aspect, or be the aspect itself.
        from absa import SYNONYMS  # noqa
        valid_forms = {r.aspect.lower()}
        valid_forms.update(s.lower() for s in SYNONYMS.get(r.aspect, []))
        if slice_text not in valid_forms:
            failures.append(
                f"  doc={r.doc_id} sent={r.sent_idx} aspect={r.aspect!r}: "
                f"slice={slice_text!r} not in {valid_forms}"
            )
            if len(failures) >= 5:
                break
    assert not failures, "anti-hallucination invariant violated:\n" + "\n".join(failures)


def test_probabilities_in_unit_interval(absa):
    for col in ("prob_pos", "prob_neg", "prob_neu"):
        assert (absa[col] >= 0).all() and (absa[col] <= 1).all(), f"{col} out of [0, 1]"


def test_score_signed_in_signed_unit_interval(absa):
    assert (absa["score_signed"] >= -1).all() and (absa["score_signed"] <= 1).all()
