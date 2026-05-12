"""Parse L2 Interpretation plain-text output into a structured dict.

L2 consumes L1's verbatim 8-step output and emits an interpreted version
of the same structure:

  - STEP 2 global_conditions — bullets prefixed with ``[REQUIRED]`` /
    ``[STRONGLY_PREFERRED]`` / ``[PREFERRED]``.
  - STEP 3 preference_sections — ``Audience`` (enum), ``Audience (verbatim)``
    (raw), and buckets ``Wants`` / ``Does Not Want`` / ``Conditions`` /
    ``Tropes Wanted`` / ``Tropes Excluded`` / ``Compound``. Each bullet
    may be followed by an indented ``→ <compound_expr>`` line.
  - STEP 4 hard_nos — classified into ``Content`` / ``Format`` / ``Trope``
    / ``Category`` buckets, with optional compound lines.
  - STEPs 1, 5, 6, 7, 8 pass through and share the L1 parser's grammar.

Vocabulary is still English. Canon-code lookup is L3's job.
"""
from __future__ import annotations

import re
from typing import Any

from autoquery.extractor import note_parser

_STRENGTH_PREFIX_RE = re.compile(
    r"^\[(REQUIRED|STRONGLY_PREFERRED|PREFERRED)\]\s*(.+)$"
)
_COMPOUND_LINE_RE = re.compile(r"^[→>]\s*(.+)$")
_AUDIENCE_ENUM = {
    "picture_books", "chapter_book", "middle_grade", "young_adult",
    "new_adult", "adult", "all_ages", "crossover",
}
_HARD_NO_BUCKETS = {
    "content": "content", "format": "format",
    "trope": "trope", "category": "category",
}


def parse(raw: str) -> dict[str, Any]:
    """Parse L2 Interpretation output text into a structured dict."""
    sections = note_parser._split_into_steps(raw)

    return {
        "identity": note_parser._parse_identity(sections.get(1, "")),
        "global_conditions": _parse_strength_bullets(sections.get(2, "")),
        "preference_sections": _parse_preference_sections(sections.get(3, "")),
        "hard_nos": _parse_hard_nos(sections.get(4, "")),
        "submission": note_parser._parse_submission(sections.get(5, "")),
        "comp_titles_high_priority": note_parser._parse_comps_high_priority(sections.get(6, "")),
        "taste_references": note_parser._parse_taste_references(sections.get(6, "")),
        "cross_cutting_themes": note_parser._parse_bullets(sections.get(7, "")),
        "confidence_flags": note_parser._parse_confidence_flags(sections.get(8, "")),
    }


def _parse_strength_bullets(body: str) -> list[dict[str, Any]]:
    """Parse bullets of the form ``- [STRENGTH] text``.

    Untagged bullets are kept with ``strength=None`` so the downstream
    reviewer can see which ones L2 failed to classify.
    """
    out: list[dict[str, Any]] = []
    pending: dict[str, Any] | None = None

    for raw_line in body.splitlines():
        s = raw_line.strip()
        if not s:
            continue
        m_bullet = note_parser._BULLET_RE.match(s)
        if m_bullet:
            if pending is not None:
                out.append(pending)
            text = m_bullet.group(1)
            m_str = _STRENGTH_PREFIX_RE.match(text)
            if m_str:
                pending = {"strength": m_str.group(1), "text": m_str.group(2).strip(), "compound": None}
            else:
                pending = {"strength": None, "text": text, "compound": None}
            continue
        m_comp = _COMPOUND_LINE_RE.match(s)
        if m_comp and pending is not None:
            pending["compound"] = m_comp.group(1).strip()
    if pending is not None:
        out.append(pending)
    return out


_PREF_BUCKETS = {
    "wants": "wants",
    "does not want": "does_not_want",
    "conditions": "conditions",
    "tropes wanted": "tropes_wanted",
    "tropes excluded": "tropes_excluded",
    "compound": "compound",
}


def _parse_preference_sections(body: str) -> list[dict[str, Any]]:
    """Walk STEP 3, splitting on ``[SECTION LABEL]`` and bucketing excerpts."""
    sections: list[dict[str, Any]] = []
    current: dict[str, Any] | None = None
    current_bucket: str | None = None

    for raw_line in body.splitlines():
        s = raw_line.strip()
        if not s:
            current_bucket = None
            continue

        m_label = note_parser._SECTION_LABEL_RE.match(s)
        if m_label:
            if current is not None:
                sections.append(current)
            current = {
                "label": m_label.group(1).strip(),
                "audience": [],
                "audience_raw": None,
                "genres_raw": None,
                "wants": [],
                "does_not_want": [],
                "conditions": [],
                "tropes_wanted": [],
                "tropes_excluded": [],
                "compound": [],
            }
            current_bucket = None
            continue

        if current is None:
            continue

        m_field = note_parser._FIELD_RE.match(s)
        if m_field:
            key_lower = m_field.group(1).strip().lower()
            rest = m_field.group(2).strip()
            if key_lower == "audience":
                current["audience"] = _parse_audience_enum(rest)
                current_bucket = None
                continue
            if key_lower in ("audience (verbatim)", "audience verbatim"):
                current["audience_raw"] = note_parser._clean_value(rest)
                current_bucket = None
                continue
            if key_lower == "genres":
                current["genres_raw"] = note_parser._clean_value(rest)
                current_bucket = None
                continue
            if key_lower in _PREF_BUCKETS:
                current_bucket = _PREF_BUCKETS[key_lower]
                if rest:
                    _append_bucket_entry(current, current_bucket, rest)
                continue

        m_bullet = note_parser._BULLET_RE.match(s)
        if m_bullet and current_bucket:
            _append_bucket_entry(current, current_bucket, m_bullet.group(1))
            continue

        m_comp = _COMPOUND_LINE_RE.match(s)
        if m_comp and current_bucket and current[current_bucket]:
            current[current_bucket][-1]["compound"] = m_comp.group(1).strip()
            continue

    if current is not None:
        sections.append(current)
    return sections


def _append_bucket_entry(section: dict[str, Any], bucket: str, text: str) -> None:
    """Append ``{text, strength?, compound}`` to the bucket.

    Conditions carry a strength prefix; other buckets don't.
    """
    entry: dict[str, Any] = {"text": text.strip(), "compound": None}
    if bucket == "conditions":
        m_str = _STRENGTH_PREFIX_RE.match(entry["text"])
        if m_str:
            entry["strength"] = m_str.group(1)
            entry["text"] = m_str.group(2).strip()
        else:
            entry["strength"] = None
    section[bucket].append(entry)


def _parse_audience_enum(value: str) -> list[str]:
    """Split comma-separated enum tokens; tolerate ``(unmapped)`` sentinel."""
    value = (value or "").strip()
    if not value or value.lower() == "(unmapped)":
        return []
    tokens: list[str] = []
    for tok in re.split(r"[,;|/]+", value):
        t = tok.strip().lower().replace(" ", "_").replace("-", "_")
        if t in _AUDIENCE_ENUM:
            tokens.append(t)
    return tokens


def _parse_hard_nos(body: str) -> dict[str, list[dict[str, Any]]]:
    """Parse classified hard-nos into content / format / trope / category buckets."""
    out: dict[str, list[dict[str, Any]]] = {
        "content": [], "format": [], "trope": [], "category": []
    }
    current_bucket: str | None = None

    for raw_line in body.splitlines():
        s = raw_line.strip()
        if not s:
            continue

        m_field = note_parser._FIELD_RE.match(s)
        if m_field:
            key_lower = m_field.group(1).strip().lower()
            if key_lower in _HARD_NO_BUCKETS:
                current_bucket = _HARD_NO_BUCKETS[key_lower]
                rest = m_field.group(2).strip()
                if rest:
                    out[current_bucket].append({"text": rest, "compound": None})
                continue

        m_bullet = note_parser._BULLET_RE.match(s)
        if m_bullet and current_bucket:
            out[current_bucket].append({"text": m_bullet.group(1), "compound": None})
            continue

        m_comp = _COMPOUND_LINE_RE.match(s)
        if m_comp and current_bucket and out[current_bucket]:
            out[current_bucket][-1]["compound"] = m_comp.group(1).strip()

    return out
