# Worked Example — Aashna Avachat through the L0 → L1 → L2 → L3 Pipeline

> This is a **worked example**, not a spec. Authoritative specs: [Feature 05 — LLM-Extraktion (L1 Chunker)](../features/05_llm_extraction.md), [Feature 17 — L2 Interpretation](../features/17_l2_interpretation.md), [Feature 16 — L3 Kanonisierung](../features/16_l3_canonicalization.md), and the "Daten-Pipeline-Architektur (L0–L4)" section of [IMPLEMENTATION_PLAN.md](../IMPLEMENTATION_PLAN.md).

## Purpose

Show, on a single real profile, what each pipeline stage consumes and produces, and **why the pipeline is split into four separate passes instead of one big LLM call**. Aashna Avachat's MSWL exercises almost every edge case the split is designed to handle: nested conditions, hard-nos with exceptions, cross-section references, demographic requirements, multiple audiences, and many terms that are unmapped against `canon/ v0.1`.

## Files in this directory

| File | Stage | What it is |
|---|---|---|
| `aashna_avachat_L0.6_cleaned.txt` | L0.6 | Cleaned plain text out of the capture pipeline — the input to L1 |
| `aashna_avachat_L1.txt` | L1 | Chunker output: 8-step verbatim notes (no interpretation) |
| `aashna_avachat_L2.txt` | L2 | Interpretation output: same 8 steps with strength tags, audience enum, Wants/DNW split, compound expressions |
| `aashna_avachat_L3.yaml` | L3 | Same structure, English heads replaced with `canon/ v0.1` codes; unresolvable heads logged |
| `aashna_avachat_pipeline_walkthrough.md` | — | This doc (rich Markdown) |
| `aashna_avachat_pipeline_walkthrough.txt` | — | Plain-text version of this doc |

---

## Stage 0 — Input: the L0.6 cleaned text

**Produced by:** `autoquery/simulation/page_capture.py` (L0/L0.3) and `autoquery/simulation/text_cleaner.py` (L0.6).
**Stored at:** `test_capture_output/cleaned/{agent}.txt`. Mirrored here as `aashna_avachat_L0.6_cleaned.txt` so the walkthrough has a stable input.

Cleaning removes nav/footer/sidebar chrome by regex; the body text is still raw prose in the agent's own phrasing.

---

## Stage 1 — L0.6 → L1 (Chunker, verbatim only)

### Engine

| Component | Where |
|---|---|
| Prompt | `autoquery/extractor/prompts/l1_chunker_v1.txt` |
| Prompt version | `PROMPT_VERSION = "3.0"` (pinned in `autoquery/extractor/prompts.py`) |
| LLM caller | `autoquery/extractor/profile_extractor.py` |
| Parser | `autoquery/extractor/note_parser.py` |

One LLM call per profile. Output is **plain text** (not JSON), then the regex parser turns it into a dict stored in `agents.profile_notes` (JSONB). Raw LLM output is also kept in `agents.profile_notes_raw` as audit trail.

### Rules the prompt hard-wires

1. **Verbatim only.** Every bullet is a substring of the source — no paraphrase, no normalization.
2. **No interpretation.** No strength tags, no audience enum, no Wants/DNW split, no Tropes-Wanted/Excluded split. That's L2's job.
3. **Deterministic 8-step layout.** IDENTITY / GLOBAL CONDITIONS / PREFERENCE SECTIONS / HARD NOS / SUBMISSION / COMPS / CROSS-CUTTING / CONFIDENCE.
4. **Preference section shape:** `[Label]`, `Audience: <verbatim>`, `Genres: <verbatim>`, `Excerpts:` (flat bullet list).
5. **Hard NOS:** flat verbatim list, no Content/Format/Trope/Category split.
6. **Ignore auto-generated platform tag blocks.**

### Quality gate

After parsing: `name` must be present, ≥1 genre excerpt, ≥3 keyword-worthy excerpts. Fail → `extraction_failed`, not promoted to review.

### L1-V (Fact-Checker)

An independent second LLM call substring-checks every L1 bullet against `cleaned/{agent}.txt`. *Status: designed (`l1v_chunker_fact_checker_v1.txt`), not yet wired.*

### Output for Aashna

See [`aashna_avachat_L1.txt`](./aashna_avachat_L1.txt). Compound conditions like `"palace intrigue, not magical, not dystopian, royalty-based"` live as **single verbatim bullets** — the boolean shape is implicit and L2 makes it explicit.

---

## Stage 2 — L1 → L2 (Interpretation, NL→NL)

### Engine

| Component | Where |
|---|---|
| Prompt | `autoquery/extractor/prompts/l2_interpretation_v1.txt` |
| Prompt version | `L2_PROMPT_VERSION = "1.0"` |
| Parser | `autoquery/extractor/interpretation_parser.py` |
| Persistence | `agents.profile_interpretation` (JSONB) + `profile_interpretation_raw` (TEXT) + `interpretation_prompt_version` (VARCHAR) — migration `006` |

Second LLM call per profile. Same 8-STEP plain-text layout as L1, with interpretation layered on top.

### What L2 adds

1. **Strength tags** on global conditions and section conditions: `[REQUIRED]`, `[STRONGLY_PREFERRED]`, `[PREFERRED]`.
2. **Audience normalization** to a closed enum (`picture_books, chapter_book, middle_grade, young_adult, new_adult, adult, all_ages, crossover`), with the verbatim original preserved as `Audience (verbatim):`.
3. **Bucketing** of preference-section excerpts into `Wants / Does Not Want / Conditions / Tropes Wanted / Tropes Excluded / Compound`.
4. **Hard NOS classification** into `Content / Format / Trope / Category`.
5. **Compound boolean expressions** as an indented `→` line beneath the bullet they refine. Operators: `AND`, `OR`, `NOT`, `WHERE`, `IN`, `exceptions:`, `SectionRef([...])`.

### Why a separate pass (not bundled with L1, not bundled with L3)

**Not bundled with L1:**
1. Different failure modes. L1 fails by hallucinating content. L2 fails by misreading intent. Separating them lets the L1-V fact-checker do a clean substring check.
2. L1 stays the durable verbatim record. Re-running L2 against stored L1 is cheap.

**Not bundled with L3:**
1. Logic shape is canon-independent. `NOT police_focused` is a structural fact regardless of canon coverage.
2. L3 is YAML-lookup-fast; bundling means every canon update runs an LLM pass.

### Output for Aashna

See [`aashna_avachat_L2.txt`](./aashna_avachat_L2.txt). Look in particular at:

- `palace_intrigue WHERE (NOT magical) AND (NOT dystopian) AND royalty_based=true`
- `mystery WHERE NOT (police_focused OR organized_crime_focused)`
- The fantasy hard-no carries `exceptions: { WHERE fantasy_elements=very_light AND SectionRef([Young Adult, Adult]) }`.
- `Audience: young_adult, new_adult` with `Audience (verbatim): YA and new adult`.

The vocabulary is still English throughout.

### Flat-column projection

`_project_to_columns` reads from L2 (not L1) and fills `genres_raw`, `audience`, `hard_nos_keywords`, `keywords`, `wishlist_raw` for back-compat with the matcher and review UI. This projection is temporary and goes away once those consumers are sektionsnativ.

---

## Stage 3 — L2 → L3 (canon lookup, against `canon/ v0.1`)

> **Status: designed in Feature 16 (`16_l3_canonicalization.md`), not yet implemented.** The design is below; the code is not.

### Engine

| Component | Where |
|---|---|
| Alias table | `canon/aliases.yaml` (phrase → code) |
| Thema codes | `canon/thema_subjects.yaml`, `thema_audience.yaml`, `thema_form.yaml` |
| Local extensions | `canon/extensions.yaml` (`LOCAL:*`) |
| Hard-no tags | `canon/hard_nos.yaml` |
| Version pin | `canon/VERSION` (currently `v0.1`) |
| Runtime (planned) | `autoquery/canon/canonicalizer.py` |

### What happens

1. **Atomic phrase lookup.** For each leaf head in the L2 expression, normalize and look up `canon/aliases.yaml`. Hit → replace with canon code. Miss → write phrase + context into `unmapped_terms_log`.
2. **Structural rewrite.** The L2 expression-tree shape (AND/OR/NOT/WHERE/exceptions/SectionRef) is preserved verbatim. Only the leaves change.

### Design rule: upfront canon, no runtime extension

Feature 16 enforces that the canon is **versioned and only extended in review cycles**, never at runtime. The `unmapped_terms_log` flows unknowns to the next review cycle — promotion to `LOCAL:*` requires ≥5-profile evidence post-v1.

### Output for Aashna

See [`aashna_avachat_L3.yaml`](./aashna_avachat_L3.yaml). Highlights:

- `romantic comedies` → `FRB`, `cozy fantasy` → `FMJ`, `mystery` → `FF`, `dark academia` → `LOCAL:dark_academia`, `adult` audience → `LOCAL:adult`.
- Format hard-nos (poetry, short stories, board books, epistolary) lack tags in v0 `hard_nos.yaml`, so they become subject-code exclusions — flagged for v1.
- The fantasy hard-no retains its exception structure.
- Unmapped in v0: demographic markers (`own_voices`, `POC`, `queer_rep`, `disability_rep`), most attribute qualifiers, a number of hard-no targets, all cross-cutting themes.

The `unmapped_terms_log` at the bottom of `aashna_avachat_L3.yaml` is the deliverable for v0 → v1 canon review.

---

## Why four passes, not one

| Pass | Engine | Job | Changes when |
|---|---|---|---|
| L1 | LLM + regex parser | Sort the agent's own sentences into the right buckets, verbatim | Rarely — only if the source format changes |
| L2 | LLM + regex parser | Tag strength, normalize audience, split Wants/DNW, make boolean shape explicit | When the interpretive rubric grows |
| L3 | YAML lookup + structural rewrite | Swap English heads for canon codes; log misses | Every canon version bump (cheap, deterministic) |
| L4 | Embedding model | Per-section embeddings for similarity matching | Embedding model swap |

**L1 + L2 are the durable records.** If v0.2 adds a `faeries` hard-no tag, re-running L3 on stored L2 is minutes of work and free of LLM cost.

---

## How to find these files

```
docs/examples/
├── aashna_avachat_L0.6_cleaned.txt
├── aashna_avachat_L1.txt
├── aashna_avachat_L2.txt
├── aashna_avachat_L3.yaml
├── aashna_avachat_pipeline_walkthrough.md   ← this doc (rich Markdown)
└── aashna_avachat_pipeline_walkthrough.txt  ← plain-text version
```

Referenced specs:

- `docs/features/05_llm_extraction.md` — L1 Chunker
- `docs/features/17_l2_interpretation.md` — L2 Interpretation
- `docs/features/16_l3_canonicalization.md` — L3 design, canon rules
- `docs/IMPLEMENTATION_PLAN.md` — L0–L4 architecture overview
- `canon/` — authoritative vocabulary
