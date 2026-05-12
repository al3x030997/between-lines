# Canon Rewrite Plan

**Status:** Planned — not yet implemented
**Created:** 2026-04-16
**Trigger:** MSWL 48-profile dry-run (`data/mswl_sample/analysis_detailed.md`)
**Scope:** `canon/hard_nos.yaml` (rewrite), `canon/aliases.yaml` (expand), `canon/extensions.yaml` (add LOCAL entries)
**Out of scope:** Thema core files (`thema_subjects.yaml`, `thema_audience.yaml`, `thema_form.yaml`) — upstream, do not edit.

---

## Why

Dry-run results on 48 MSWL profiles:

| Facet    | Coverage | v1 target | Gap type              |
|----------|---------:|----------:|-----------------------|
| subject  |    51.5% |       90% | Mostly aliasing       |
| audience |    53.1% |       90% | Mostly aliasing       |
| hard_no  |     0.4% |       70% | **Vocabulary mismatch** — needs redesign |

`hard_nos.yaml` was written before the Note-Taker integration. Agents actually write
full phrases ("graphic sexual violence", "gratuitous gore on-page", "torture porn",
"sexual assault depicted") — the file contains compact tags that bear almost no
resemblance to those phrases. Patching aliases will not close a 70pp gap; the
vocabulary itself has to be redesigned around how agents phrase objections.

Subject/audience is a different problem: the concepts exist, the synonyms don't.
That is an aliasing task, not a rewrite.

---

## Step 1 — Evidence gathering (no code changes)

**Inputs:** `data/mswl_sample/notes_parsed/*.json`, `scripts/canon_dryrun.py` output.

1. Export full unmapped-term frequency tables per facet (not just top-N chart):
   - `unmapped_hard_no_full.csv` — term, count, example profile_slug, surrounding sentence
   - Same for subject, audience
2. Cluster hard_no terms by theme (violence, sexual content, animal harm, minors,
   specific tropes, political/ideological, format-based). Manual pass, ~1 hour.
3. Produce `canon/_source/hard_no_term_clusters.md` — the evidence base for the
   redesign. Check into git so the rewrite is auditable.

**Exit criterion:** Every hard_no cluster has ≥3 attested example sentences from
real profiles. No invented categories.

---

## Step 2 — Design new `hard_nos.yaml` schema

Current file: flat tags. Proposed structure:

```yaml
- id: violence.graphic_sexual
  canonical: graphic sexual violence
  aliases:
    - sexual assault on-page
    - rape depicted
    - graphic rape scenes
  cluster: violence
  severity: hard   # hard | soft (soft = "prefer not" vs "will reject")
```

Key decisions to make during design (NOT during implementation):

- **Severity axis: keep or drop?** Agents distinguish "absolute no" from "tired of
  seeing." Dry-run didn't measure this; check clusters before committing.
- **Cluster taxonomy.** Propose 6–8 top-level clusters, no deeper. Matcher needs
  buckets, not a tree.
- **Overlap policy.** One term, one canonical id. If an agent writes "on-page rape"
  it maps to `violence.graphic_sexual`, not to both violence and sexual_content.

**Exit criterion:** Written design doc `canon/_source/hard_nos_v2_design.md`
reviewed before any YAML is touched.

---

## Step 3 — Write new `hard_nos.yaml`

1. Implement schema from Step 2.
2. Seed with terms from Step 1 clusters — every canonical id must be attested in
   the MSWL sample. No speculative categories.
3. Version bump in `canon/VERSION` (breaking change — schema is different).
4. Update `canon/README.md` with the new schema.

**Exit criterion:** `scripts/canon_dryrun.py` on the cached 48 profiles yields
≥60% hard_no coverage. If not, Step 1 clustering was wrong — return to it.

---

## Step 4 — Aliases for subject/audience

Separate, parallel track. Much lower risk.

1. From the unmapped-subject leaderboard, add aliases for obvious synonyms:
   - `"upmarket commercial fiction"` → `upmarket_fiction`
   - `"feminist horror"` → alias under horror + tag feminist
   - etc.
2. Add `LOCAL:gothic_horror`, `LOCAL:psychological_horror` to `extensions.yaml`
   (both cleared the 5-profile bar in dry-run).
3. Audience aliases: `"adults"` → `adult`, `"teens"` → `young_adult`, etc. —
   mostly plural/informal forms.

**Exit criterion:** subject coverage ≥70%, audience ≥75% on cached 48 profiles.
Full 90% target waits for the 200-profile run.

---

## Step 5 — Downstream impact check

The hard_nos schema change breaks anything that reads the old flat format.

1. Grep for `hard_nos.yaml` consumers across `autoquery/`, `backend/`, `app/`.
2. Expected touch points: `ProfileExtractor`, quality gate, matcher (if wired),
   any test fixtures.
3. Write a migration note in the PR: old format is gone, not deprecated. No
   backwards-compat shim (per project convention).

**Exit criterion:** `pytest` passes, 235+ tests still green.

---

## Step 6 — Rerun dry-run, compare

1. `scripts/canon_dryrun.py` on cached notes_parsed (no re-crawl).
2. Regenerate charts into `data/mswl_sample/charts_v2/`.
3. Append a "Post-rewrite" section to `analysis_detailed.md` with before/after
   coverage numbers. Do not overwrite the original table — it's the baseline.

**Exit criterion:** Measurable lift documented. If hard_no <60% or
subject/audience regressed, rewrite did not succeed — do not proceed to the
200-profile run.

---

## Explicitly NOT in this plan

- **Do not scale the harvest to 200/500 profiles before this lands.** Running a
  broken canon over more data just bakes in the same miss rate at higher cost.
- **Do not touch Thema files.** They are upstream; extensions go in
  `extensions.yaml` per the L2 design doc.
- **Do not add runtime auto-extension.** Per `docs/features/16_l2_canonicalization.md`,
  canon is upfront-only. This rewrite respects that.
- **Do not add a backwards-compat layer for old `hard_nos.yaml`.** Clean break.

---

## Open questions (resolve before Step 2)

1. Severity axis — do we have enough signal in the 48-profile sample to design it,
   or do we need the 200-profile run first? Lean: design with soft/hard binary,
   revisit after scale-up.
2. Do we want a `context` field (e.g. "on-page" vs "referenced") or is that
   matcher logic, not canon? Lean: matcher logic — keep canon flat on that axis.
3. Should aliases live in `hard_nos.yaml` (per-entry) or `aliases.yaml` (global)?
   Lean: per-entry for hard_nos since the vocabulary is tighter and audit trails
   matter more for filter logic.

---

## Estimated effort

- Step 1: ~2h (clustering + CSV export)
- Step 2: ~2h (design doc + review)
- Step 3: ~3h (write YAML + test)
- Step 4: ~1h (aliases — mechanical)
- Step 5: ~1–2h (depends on consumer count)
- Step 6: ~30min (rerun + charts)

**Total: ~10h focused work, spread across ~2 sessions.** Step 2 review gate is
the one that matters — don't skip it.
