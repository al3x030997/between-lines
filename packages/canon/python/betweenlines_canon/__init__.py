"""Shared Thema-based literary vocabulary loader.

YAML source-of-truth lives at ``packages/canon/yaml/`` and is resolved
relative to this package. Internal monorepo package — always installed
editable via uv workspace, so a relative-path resolution is stable.
"""
from __future__ import annotations

from pathlib import Path
from typing import Any

import yaml

CANON_DIR: Path = Path(__file__).resolve().parent.parent.parent / "yaml"


def load(name: str) -> Any:
    """Load a canon YAML file by stem (e.g. ``aliases``, ``hard_nos``,
    ``thema_subjects``, ``thema_audience``, ``thema_form``,
    ``extensions``).
    """
    path = CANON_DIR / f"{name}.yaml"
    with path.open("r", encoding="utf-8") as f:
        return yaml.safe_load(f)


def version() -> str:
    """Return the canon vocabulary version (from yaml/VERSION)."""
    return (CANON_DIR / "VERSION").read_text(encoding="utf-8").strip()


__all__ = ["CANON_DIR", "load", "version"]
