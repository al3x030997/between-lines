"""Parse L1 Chunker plain-text output into a structured dict.

The L1 Chunker prompt (``l1_chunker_v1.txt``) produces a deterministic
8-step layout of VERBATIM excerpts — no interpretation, no strength tags,
no audience enum, no Wants/DNW split. This parser enforces SHAPE, not
MEANING: it splits on STEP headers and section labels and collects
bullets as-written.

Interpretation (strength tagging, Wants/DNW bucketing, audience enum,
compound boolean expressions) is L2's job. See
``autoquery/extractor/interpretation_parser.py`` and
``autoquery/extractor/prompts/l2_interpretation_v1.txt``.

Canon lookup (English heads → Thema / LOCAL codes) is L3's job. See
``docs/features/16_l3_canonicalization.md``.
"""
from __future__ import annotations

import re
from typing import Any

_STEP_RE = re.compile(r"^STEP\s+(\d+)\s*[:\-]\s*(.+?)\s*$", re.IGNORECASE)
_BULLET_RE = re.compile(r"^[\-\*•]\s+(.*\S)\s*$")
_FIELD_RE = re.compile(r"^([A-Za-z][A-Za-z /&'()-]*?)\s*:\s*(.*)$")
_SECTION_LABEL_RE = re.compile(r"^\[([^\]]+)\]\s*$")
_MD_HEADER_PREFIX_RE = re.compile(r"^#{1,6}\s*")
_MD_BOLD_WRAPPER_RE = re.compile(r"\*\*([^*]+?)\*\*")


def _strip_markdown(line: str) -> str:
    """Remove leading Markdown header hashes and unwrap ``**bold**`` emphasis."""
    s = _MD_HEADER_PREFIX_RE.sub("", line)
    s = _MD_BOLD_WRAPPER_RE.sub(r"\1", s)
    return s


def parse(raw: str) -> dict[str, Any]:
    """Parse L1 Chunker output text into a structured dict.

    The returned dict always has all top-level keys; absent sections
    yield empty containers, not missing keys.
    """
    sections = _split_into_steps(raw)

    return {
        "identity": _parse_identity(sections.get(1, "")),
        "global_conditions": _parse_bullets(sections.get(2, "")),
        "preference_sections": _parse_preference_sections(sections.get(3, "")),
        "hard_nos": _parse_bullets(sections.get(4, "")),
        "submission": _parse_submission(sections.get(5, "")),
        "comp_titles_high_priority": _parse_comps_high_priority(sections.get(6, "")),
        "taste_references": _parse_taste_references(sections.get(6, "")),
        "cross_cutting_themes": _parse_bullets(sections.get(7, "")),
        "confidence_flags": _parse_confidence_flags(sections.get(8, "")),
    }


def _split_into_steps(raw: str) -> dict[int, str]:
    """Split text into a dict keyed by STEP number, value = body text."""
    out: dict[int, str] = {}
    current_step: int | None = None
    current_lines: list[str] = []

    for line in raw.splitlines():
        normalized = _strip_markdown(line.strip())
        m = _STEP_RE.match(normalized)
        if m:
            if current_step is not None:
                out[current_step] = "\n".join(current_lines).strip()
            current_step = int(m.group(1))
            current_lines = []
        else:
            if current_step is not None:
                current_lines.append(_strip_markdown(line))
    if current_step is not None:
        out[current_step] = "\n".join(current_lines).strip()
    return out


def _iter_field_lines(body: str):
    """Yield (key_lower, value) pairs from `Field: value` lines."""
    for line in body.splitlines():
        s = line.strip()
        if not s or s.startswith(("-", "*", "•", "[", "===", "---")):
            continue
        m = _FIELD_RE.match(s)
        if m:
            yield m.group(1).strip().lower(), m.group(2).strip()


def _clean_value(v: str) -> str | None:
    if v is None:
        return None
    v = v.strip().strip("—–-").strip()
    if not v:
        return None
    if v.lower() in {"none", "null", "n/a", "(not listed)", "not listed"}:
        return None
    return v


def _parse_identity(body: str) -> dict[str, Any]:
    out: dict[str, Any] = {
        "name": None, "organization": None, "role": None, "pronouns": None,
        "email": None, "submission_portal": None, "availability": None,
        "availability_note": None,
    }
    for key, val in _iter_field_lines(body):
        cleaned = _clean_value(val)
        if key == "name":
            out["name"] = cleaned
        elif key == "organization":
            out["organization"] = cleaned
        elif key == "role":
            out["role"] = cleaned
        elif key == "pronouns":
            out["pronouns"] = cleaned
        elif key == "email":
            out["email"] = cleaned
        elif key == "submission portal":
            out["submission_portal"] = cleaned
        elif key == "availability":
            if cleaned:
                first = cleaned.split()[0].upper().rstrip(",.")
                out["availability"] = first if first in {"OPEN", "CLOSED", "CONDITIONAL"} else cleaned
                if " " in cleaned:
                    out["availability_note"] = cleaned.split(" ", 1)[1].strip(" ,—-")
    return out


def _parse_preference_sections(body: str) -> list[dict[str, Any]]:
    """Walk STEP 3 body, splitting on `[SECTION LABEL]` markers.

    Each section emits ``{label, audience_raw, genres_raw, excerpts[]}``.
    L1 is verbatim-only — no audience enum, no Wants/DNW split.
    """
    sections: list[dict[str, Any]] = []
    current: dict[str, Any] | None = None
    in_excerpts = False

    for line in body.splitlines():
        s_strip = line.strip()
        if not s_strip:
            in_excerpts = False
            continue

        m_label = _SECTION_LABEL_RE.match(s_strip)
        if m_label:
            if current is not None:
                sections.append(current)
            current = {
                "label": m_label.group(1).strip(),
                "audience_raw": None,
                "genres_raw": None,
                "excerpts": [],
            }
            in_excerpts = False
            continue

        if current is None:
            continue

        m_field = _FIELD_RE.match(s_strip)
        if m_field:
            key_lower = m_field.group(1).strip().lower()
            rest = m_field.group(2).strip()
            if key_lower == "audience":
                current["audience_raw"] = _clean_value(rest)
                in_excerpts = False
                continue
            if key_lower == "genres":
                current["genres_raw"] = _clean_value(rest)
                in_excerpts = False
                continue
            if key_lower == "excerpts":
                in_excerpts = True
                if rest:
                    current["excerpts"].append(rest)
                continue

        m_bullet = _BULLET_RE.match(s_strip)
        if m_bullet and in_excerpts:
            current["excerpts"].append(m_bullet.group(1))

    if current is not None:
        sections.append(current)
    return sections


def _parse_submission(body: str) -> list[dict[str, Any]]:
    """STEP 5: per-category or [All Submissions] groupings, verbatim bullets."""
    blocks: list[dict[str, Any]] = []
    current: dict[str, Any] | None = None

    for line in body.splitlines():
        s = line.strip()
        if not s:
            continue
        m_label = _SECTION_LABEL_RE.match(s)
        if m_label:
            if current is not None:
                blocks.append(current)
            current = {"category": m_label.group(1).strip(), "bullets": []}
            continue
        m_bullet = _BULLET_RE.match(s)
        if m_bullet:
            if current is None:
                current = {"category": None, "bullets": []}
            current["bullets"].append(m_bullet.group(1))

    if current is not None:
        blocks.append(current)
    return blocks


def _parse_comps_high_priority(body: str) -> list[str]:
    """Section 6A — verbatim bullets (no parsing of title/author/note in L1)."""
    out: list[str] = []
    in_section = False
    for line in body.splitlines():
        s = line.strip()
        if not s:
            continue
        if re.match(r"^A\)\s*HIGH[- ]PRIORITY", s, re.IGNORECASE):
            in_section = True
            continue
        if re.match(r"^B\)\s*TASTE", s, re.IGNORECASE):
            in_section = False
            continue
        if in_section:
            m = _BULLET_RE.match(s)
            if m:
                out.append(m.group(1))
    return out


def _parse_taste_references(body: str) -> list[str]:
    """Section 6B — verbatim bullets (no Books/Film-TV/Music split in L1)."""
    out: list[str] = []
    in_b_section = False
    for line in body.splitlines():
        s = line.strip()
        if not s:
            continue
        if re.match(r"^B\)\s*TASTE", s, re.IGNORECASE):
            in_b_section = True
            continue
        if not in_b_section:
            continue
        m = _BULLET_RE.match(s)
        if m:
            out.append(m.group(1))
    return out


def _parse_bullets(body: str) -> list[str]:
    out: list[str] = []
    for line in body.splitlines():
        m = _BULLET_RE.match(line.strip())
        if m:
            out.append(m.group(1))
    return out


def _parse_confidence_flags(body: str) -> dict[str, list[str]]:
    out = {"inferred": [], "missing": []}
    current: str | None = None
    keymap = {"inferred": "inferred", "missing": "missing"}

    for line in body.splitlines():
        s = line.strip()
        if not s:
            continue
        first = s.split()[0].upper().rstrip(":-—")
        if first.lower() in keymap:
            current = keymap[first.lower()]
            rest = s.split(None, 1)[1] if " " in s else ""
            rest = rest.strip(" —-:")
            if rest:
                out[current].append(rest)
            continue
        m_bullet = _BULLET_RE.match(s)
        if m_bullet and current:
            out[current].append(m_bullet.group(1))
    return out
