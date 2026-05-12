"""Versioned extraction prompts.

Every prompt lives in its own file under ``./prompts/`` so each can be versioned
and improved independently. This module loads them and exposes stable Python
names. See ``./prompts/README.md`` for the index.

Active prompts (loaded and callable):
    L1 Chunker              — raw L0.6 text → 8-step verbatim excerpts
    L2 Interpretation       — L1 excerpts → bucketed/strength-tagged notes
    L1 Multi-Agent Roster   — agency pages listing many agents

Designed but not yet wired (stub files only):
    L1-V Fact-Checker                (l1v_chunker_fact_checker_v1.txt)
"""
from pathlib import Path

PROMPT_VERSION = "3.0"            # L1 chunker v1
L2_PROMPT_VERSION = "1.0"         # L2 interpretation v1

_PROMPTS_DIR = Path(__file__).parent / "prompts"


def _load(name: str) -> str:
    return (_PROMPTS_DIR / name).read_text()


CHUNKER_SYSTEM_PROMPT = _load("l1_chunker_v1.txt")
INTERPRETATION_SYSTEM_PROMPT = _load("l2_interpretation_v1.txt")
MULTI_AGENT_ROSTER_SYSTEM_PROMPT = _load("l1_multi_agent_roster_system_v1.txt")
MULTI_AGENT_ROSTER_USER_PROMPT = _load("l1_multi_agent_roster_user_v1.txt")
