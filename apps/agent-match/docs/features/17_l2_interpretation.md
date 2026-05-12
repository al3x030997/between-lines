# Feature 17: L2 Interpretation Pass

## Purpose

L2 takes the verbatim, chunked output of L1 (Chunker) and applies a single, focused interpretation pass: NL → NL, no canonicalization, no codes. It exists to keep two distinct failure modes separate:

- **L1 failure** = content hallucination ("the model made up an excerpt").
- **L2 failure** = misreading of intent ("the model bucketed a Want as a DNW", "the model tagged a soft preference as REQUIRED").

Splitting these lets the L1-V fact-checker do a pure substring check against the source text and lets L2 be evaluated against a well-defined interpretive rubric.

## Position in the pipeline

```
L0  capture
L0.6 cleaning
L1  chunker          → 8-step verbatim notes        (profile_notes JSONB)
L2  interpretation   → 8-step interpreted notes     (profile_interpretation JSONB)   ← this feature
L3  canonicalization → English heads → canon codes  (design-only, not implemented)
L4  embeddings       → per-section embeddings       (not implemented at runtime)
```

## Inputs / outputs

- **Input**: raw L1 prompt output (plain text, 8 STEPs, verbatim bullets).
- **Output**: plain text in the same 8-STEP layout, parsed by `autoquery/extractor/interpretation_parser.py` into structured JSON stored in `agents.profile_interpretation`.

## What L2 adds

1. **Strength tags** on global conditions and section-level conditions:
   `[REQUIRED]`, `[STRONGLY_PREFERRED]`, `[PREFERRED]` prefix on each bullet.

2. **Audience normalization** to a closed enum, with the verbatim original preserved:
   ```
   Audience: young_adult, new_adult
   Audience (verbatim): YA and new adult
   ```
   Enum values: `picture_books`, `chapter_book`, `middle_grade`, `young_adult`, `new_adult`, `adult`, `all_ages`, `crossover`. If no value maps, emit `(unmapped)` and rely on `Audience (verbatim)` downstream.

3. **Wants / Does Not Want / Conditions / Tropes Wanted / Tropes Excluded / Compound** buckets inside each preference section. L1's flat `Excerpts:` list becomes one of these buckets per bullet.

4. **Hard NOS classification** into `Content / Format / Trope / Category` buckets.

5. **Compound boolean expressions** as an indented `→` line beneath the bullet they refine. Operators: `AND`, `OR`, `NOT`, `WHERE`, `IN`, `exceptions:`, `SectionRef([...])`. See Feature 16 (now Feature 16 = L3 canon) for how these heads will eventually map to canon codes.

## Persistence

- `agents.profile_interpretation` (JSONB) — parsed structure
- `agents.profile_interpretation_raw` (TEXT) — raw LLM output (for re-parsing if the parser changes)
- `agents.interpretation_prompt_version` (VARCHAR(16)) — pinned to `L2_PROMPT_VERSION`

Flat back-compat columns (`audience`, `genres_raw`, `hard_nos_keywords`, `keywords`, `wishlist_raw`) are projected from L2 output, not L1, so the matcher and review UI keep working unchanged.

## Files

- Prompt: `autoquery/extractor/prompts/l2_interpretation_v1.txt`
- Parser: `autoquery/extractor/interpretation_parser.py`
- Tests: `tests/test_interpretation_parser.py`, `tests/fixtures/interpretation_sample.txt`
- Worked example: `docs/examples/aashna_avachat_L2.txt`

## Why a second LLM call (vs. one combined prompt)

The original L1 (`l1_note_taker_v1.txt`, retired) did chunking and interpretation in one call. That conflated failure modes (a wrong strength tag was indistinguishable from a hallucinated excerpt at the parser level), made the fact-checker design awkward (couldn't substring-check interpretive bullets), and produced silent leaks like the audience-enum mapping landing in the L1 parser. Splitting costs one extra LLM call per profile and buys clean separation, easier evals, and a much simpler L1-V.
