"""Aspect-based sentiment thin wrapper around yangheng/deberta-v3-base-absa-v1.1.

Two halves:
  1. find_aspect_spans + SYNONYMS — pure-Python text search, no torch required.
     Importable by tests that only validate output structure.
  2. load_absa_pipeline + score_batch — model wrappers, torch required.
     Wrapped in a delayed import so test code can `from absa import find_aspect_spans`
     without loading 1 GB of weights.
"""
from __future__ import annotations

import re

# Aspect → list of alternate surface forms users actually write.
# Keep small and conservative; expand only if spot-check shows missed mentions.
SYNONYMS: dict[str, list[str]] = {
    "account":     ["accounts", "acct"],
    "algorithm":   ["algorithms", "algo", "algos"],
    "comment":     ["comments", "cmnt", "cmnts"],
    "vote":        ["votes", "upvote", "upvotes"],
    "view":        ["views", "viewer", "viewers"],
    "follower":    ["followers", "follow"],
    "beta reader": ["beta readers", "beta", "betas"],
    "feedback":    ["feedbacks", "crit", "critique", "critiques"],
    "scam":        ["scams", "scammer", "scammers"],
    "money":       ["payment", "payments", "paid"],
    "tip":         ["tips", "tipping"],
    "ranking":     ["rankings", "ranks"],
    "notification": ["notifications", "notif", "notifs"],
    "email":       ["emails", "e-mail", "emailing"],
    "message":     ["messages", "dm", "dms", "pm", "pms"],
    "tag":         ["tags", "tagging"],
    "engagement":  ["engagements"],
    "cover":       ["covers"],
    "blurb":       ["blurbs", "synopsis"],
    "draft":       ["drafts"],
    "edit":        ["edits", "editing"],
    "title":       ["titles"],
    "username":    ["usernames", "handle", "handles"],
    "password":    ["passwords"],
    "app":         ["apps", "application"],
    "ranking":     ["rankings", "ranks", "ranked"],
}

# Pre-compile regex for each (aspect, surface_form) so the runner doesn't pay
# the cost per sentence.
def _build_patterns() -> dict[str, list[re.Pattern]]:
    out: dict[str, list[re.Pattern]] = {}
    for aspect, syns in SYNONYMS.items():
        forms = [aspect] + syns
        out[aspect] = [re.compile(r"\b" + re.escape(f) + r"\b", re.IGNORECASE) for f in forms]
    return out


_PATTERN_CACHE: dict[str, list[re.Pattern]] = {}


def find_aspect_spans(sentence: str, aspect: str) -> list[tuple[int, int]]:
    """Return non-overlapping (start, end) char spans where `aspect` (or a synonym) appears.

    Lazy regex compilation: first call for a new aspect builds the patterns.
    """
    if aspect not in _PATTERN_CACHE:
        if aspect in SYNONYMS:
            forms = [aspect] + SYNONYMS[aspect]
        else:
            forms = [aspect]
        _PATTERN_CACHE[aspect] = [
            re.compile(r"\b" + re.escape(f) + r"\b", re.IGNORECASE) for f in forms
        ]

    spans: list[tuple[int, int]] = []
    for pat in _PATTERN_CACHE[aspect]:
        for m in pat.finditer(sentence):
            spans.append((m.start(), m.end()))
    # Sort and merge overlapping spans (e.g. "comment" + "comments" both matching)
    if not spans:
        return spans
    spans.sort()
    merged: list[tuple[int, int]] = [spans[0]]
    for s, e in spans[1:]:
        ms, me = merged[-1]
        if s <= me:
            merged[-1] = (ms, max(me, e))
        else:
            merged.append((s, e))
    return merged


# ---------- Model side: imports torch lazily ----------

def load_absa_pipeline(device: str = "mps", dtype: str = "float32"):
    """Load yangheng/deberta-v3-base-absa-v1.1 as a text-classification pipeline.

    device: "mps" | "cpu" | "cuda"
    dtype:  "float32" only — fp16 has documented precision corruption on MPS for
            DeBERTa-v3 (see analysis/model_recommendations.md).
    """
    if dtype != "float32":
        raise ValueError(
            f"dtype={dtype!r} not supported. Use float32 — fp16 silently corrupts on "
            "Apple MPS for DeBERTa-v3 per analysis/model_recommendations.md."
        )
    import torch
    from transformers import pipeline

    if device == "mps" and not torch.backends.mps.is_available():
        print("  warning: MPS requested but not available, falling back to CPU")
        device = "cpu"

    pipe = pipeline(
        task="text-classification",
        model="yangheng/deberta-v3-base-absa-v1.1",
        device=device,
        dtype=torch.float32,
        top_k=None,  # return all 3 class probabilities
    )
    return pipe


def score_batch(pipe, pairs: list[tuple[str, str]], batch_size: int = 16) -> list[dict]:
    """Score a batch of (sentence, aspect) pairs.

    Returns one dict per pair with keys: label, prob_pos, prob_neg, prob_neu, score_signed.
    The HF model returns class names "Positive", "Negative", "Neutral".
    """
    if not pairs:
        return []
    # HF text-classification pipeline accepts a list of {"text", "text_pair"} dicts
    # for paired-input classification. With top_k=None each prediction is the full
    # list of class scores.
    inputs = [{"text": s, "text_pair": a} for s, a in pairs]
    raw = pipe(inputs, batch_size=batch_size, truncation=True, max_length=192)
    # If only one input, some transformers versions return a single dict-list instead
    # of a list-of-dict-lists. Normalize.
    if raw and isinstance(raw[0], dict):
        raw = [raw]
    out: list[dict] = []
    for item in raw:
        probs = {d["label"].lower(): float(d["score"]) for d in item}
        prob_pos = probs.get("positive", 0.0)
        prob_neg = probs.get("negative", 0.0)
        prob_neu = probs.get("neutral", 0.0)
        best = max(probs, key=probs.get)
        out.append({
            "label": best,           # "positive" | "negative" | "neutral"
            "prob_pos": prob_pos,
            "prob_neg": prob_neg,
            "prob_neu": prob_neu,
            "score_signed": prob_pos - prob_neg,
        })
    return out
