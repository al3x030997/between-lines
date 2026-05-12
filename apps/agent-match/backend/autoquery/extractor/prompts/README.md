# Extraction Prompts

Every system/user prompt used by the extraction pipeline lives in its own file here, so each can be versioned and improved independently. Loaded by `../prompts.py`.

## Naming convention

```
<layer>_<role>_v<N>.txt
```

- `layer`  — pipeline stage: `l1`, `l1v`, `l2`, …
- `role`   — what the prompt does: `chunker`, `interpretation`, `chunker_fact_checker`, `multi_agent_roster_system`, `multi_agent_roster_user`
- `v<N>`   — major version. Bump on any content change that affects extraction behavior. The Python constants `PROMPT_VERSION` (L1) and `L2_PROMPT_VERSION` in `../prompts.py` are pinned to the production set.

## Index

| File | Layer | Role | Status | Loaded as |
|---|---|---|---|---|
| `l1_chunker_v1.txt` | L1 | Raw L0.6 text → 8-step verbatim notes (no interpretation) | **Active** | `CHUNKER_SYSTEM_PROMPT` |
| `l2_interpretation_v1.txt` | L2 | L1 notes → interpreted notes (Wants/DNW split, strength tags, audience enum, compound exprs) | **Active** | `INTERPRETATION_SYSTEM_PROMPT` |
| `l1_multi_agent_roster_system_v1.txt` | L1 | System prompt for agency pages listing many agents | **Active** | `MULTI_AGENT_ROSTER_SYSTEM_PROMPT` |
| `l1_multi_agent_roster_user_v1.txt` | L1 | User-prompt template (takes `{clean_text}`) paired with the above | **Active** | `MULTI_AGENT_ROSTER_USER_PROMPT` |
| `l1v_chunker_fact_checker_v1.txt` | L1-V | Verify L1 chunker output is a substring of source text | **Design-only stub** — not wired | — |

## How the active prompts are wired

`../prompts.py` loads each active file at import time:

```python
CHUNKER_SYSTEM_PROMPT            = _load("l1_chunker_v1.txt")
INTERPRETATION_SYSTEM_PROMPT     = _load("l2_interpretation_v1.txt")
MULTI_AGENT_ROSTER_SYSTEM_PROMPT = _load("l1_multi_agent_roster_system_v1.txt")
MULTI_AGENT_ROSTER_USER_PROMPT   = _load("l1_multi_agent_roster_user_v1.txt")
```

The user-prompt template uses Python `str.format` placeholders (`{clean_text}`) and escaped braces (`{{ … }}`) for embedded structure. Don't edit those escapes casually — removing them breaks `.format()`.

## Rules for editing

1. **One prompt per file.** No inlining new prompts back into `prompts.py`.
2. **Content == what gets sent to the LLM.** The entire file body is the prompt. No separate header block — if you want metadata, put it here in the README or in a sibling `*_notes.md` file.
3. **Every behavior-affecting change bumps the version.** Old file stays (e.g. `l1_chunker_v1.txt` → add `l1_chunker_v2.txt`), loader swaps. Rationale: reproducibility of past extractions.
4. **Design-only stubs** (`l1v_*`) are allowed to contain headers, TODOs, and example I/O blocks. They are NOT loaded, so they can't corrupt extraction. Before wiring, split the actual prompt body out of the stub into a clean file of its own.

## Related documentation

- `../../../docs/features/05_llm_extraction.md` — L1 Chunker spec
- `../../../docs/features/17_l2_interpretation.md` — L2 Interpretation spec
- `../../../docs/features/16_l3_canonicalization.md` — L3 canonicalization design (not yet implemented)
- `../../../docs/IMPLEMENTATION_PLAN.md` — L0–L4 architecture overview
- `../../../docs/examples/aashna_avachat_pipeline_walkthrough.md` — worked example
