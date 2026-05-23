# Pre-unify design-token snapshot — 2026-05-23

Captured before the landing-page color/font unification (plan: `landing-page: unify color & typography across live pages`). This is the per-file inventory of hex literals and font strings as they existed pre-refactor, so we can revert any individual page cheaply without spelunking git history.

Scope was **live pages only**: `v8`, `v8/sections/*`, `faq`, `privacy`, `insider/*`. `v6` and `v7` were not refactored — their styles remain as-is.

Delete this file after ~2 weeks of stable use (same convention as the monorepo migration notes in root `CLAUDE.md`).

---

## v8/page.tsx (`V6_CSS` block, ~lines 21–96)

CSS custom properties were declared inside `.v8-root` (not `:root`), prefixed `--v6-*` and `--bl-*`.

**Default palette:**
| Property | Value |
|---|---|
| `--v6-accent` | `#e94b36` (coral) |
| `--v6-accent-soft` | `rgba(233, 75, 54, 0.06)` |
| `--v6-text` / `--v6-text-strong` | `#0e0e0c` |
| `--v6-text-muted` | `#14140f` |
| `--v6-surface` | `#ffffff` |
| `--v6-divider` | `rgba(14,14,12,0.18)` |
| `--v6-stroke` | `rgba(255,255,255,0.85)` |
| `--bl-section-bg` | `#0B1733` (navy intermission) |
| `--bl-section-fg` | `#F2EFE8` |
| `--bl-section-muted` | `#8A95B5` |
| `--bl-section-accent` | `#e94b36` |
| `--bl-section-divider` | `rgba(242,239,232,0.16)` |
| `--bl-card-shadow` | `rgba(0,0,0,0.5)` |
| `--bl-footer-bg` | `#FFC700` (yellow) |
| `--bl-footer-fg` | `#0a0a0a` |
| `--bl-footer-muted` | `rgba(10,10,10,0.62)` |
| `--bl-footer-divider` | `rgba(11,23,51,0.22)` |
| `--bl-footer-accent` | `#C5283D` (burgundy — **divergent from accent**) |

**Default font stack:** `'Bricolage Grotesque', 'Outfit', system-ui, sans-serif` (set on `.v8-root`)

**Palette variants** (override `--v6-*` + `--bl-section-*` + `--bl-footer-accent`):
- `.is-palette-forest` → accent `#0A3A23`, surface `#F5EDE0` (cream), text `#1a2a1f`, section-accent `#E5B100`
- `.is-palette-pop` → accent `#E63946`, surface `#FFE600` (yellow), text `#0a0a0a`, section-accent `#E63946`
- `.is-palette-stranger` → accent `#C5283D`, surface `#FFC700` (mustard), text `#0a0a0a`, section-accent `#C5283D`

**v8 "doors" headings** used `Fraunces` (italic, serif) — this was the one Fraunces holdout, switched to Cormorant in the refactor.

**How to revert v8/page.tsx**: replace `var(--bl-accent)` → `#e94b36`, restore `--v6-*` private vars, restore Fraunces in doors block. Or `git revert` the unify commit.

---

## v8/sections/OpenCall.tsx

All-hardcoded (lines 114–440 in the CSS template). This was the **biggest accent divergence**: burgundy accent inside an otherwise-coral v8.

| Hex | Used for |
|---|---|
| `#F6F1E3` | Section background (warm cream); CTA `color` |
| `#161410` | Title color, card title color, note `<strong>`, ghost CTA color, ghost CTA hover bg |
| `#4a463c` | Lede, card text, note text |
| `#C5283D` | Eyebrow text, title `em` color, card number color, primary CTA bg, primary CTA shadow, ghost CTA hover color, poster gradient start |
| `#921a2b` | Poster gradient end |
| `#6b6357` | Poster caption color |
| `rgba(22, 20, 16, 0.18)` | Card divider |
| `rgba(22, 20, 16, 0.22)` / `0.10` | Poster shadows |
| `rgba(197, 40, 61, 0.18)` / `0.24` | Primary CTA box-shadow |

**Fonts:**
- Title (`.bl-opencall-title`), card title (`.bl-opencall-card-title`), poster title/sub/ornament — `'Cormorant Garamond', 'Times New Roman', serif`
- Eyebrow, card number, CTA primary/ghost, poster meta/stamp/caption — `'Bricolage Grotesque', sans-serif`
- Lede, card text, note — `'Outfit', sans-serif`

**How to revert OpenCall**: replace `var(--bl-accent)` → `#C5283D`, `var(--bl-paper-bg)` → `#F6F1E3`, `var(--bl-paper-ink)` → `#161410`, `var(--bl-paper-ink-muted)` → `#4a463c`. Poster gradient back to `linear-gradient(180deg, #C5283D 0%, #921a2b 100%)`.

---

## v8/sections/FaqTeaser.tsx

Hardcoded (lines 4–206).

| Hex | Used for |
|---|---|
| `#ffffff` | Section bg, card bg |
| `#0e0e0c` | Title, card title, card-arrow text, "Read all FAQs" link |
| `#5a5a52` | Lede, card blurb |
| `#e94b36` | Eyebrow text + underline, card-index, card top-border on hover, card-arrow hover color, "Read all FAQs" hover + underline |
| `rgba(14,14,12,0.1)` / `0.2` / `0.07` | Card borders + hover shadow |

**Fonts:**
- Section font-family: `'Bricolage Grotesque', 'Outfit', sans-serif`
- Title (`.bl-faq-title`), card title — `'Cormorant Garamond', 'Times New Roman', serif`
- Eyebrow, card-index, card-arrow, "Read all FAQs" — `'Bricolage Grotesque', sans-serif`
- Lede, card blurb — `'Outfit', sans-serif`

**How to revert FaqTeaser**: replace `var(--bl-accent)` → `#e94b36`, `var(--bl-ink)` → `#0e0e0c`, `var(--bl-ink-muted)` → `#5a5a52`, `var(--bl-surface)` → `#ffffff`, `var(--bl-font-display)` (on title) → `'Cormorant Garamond', 'Times New Roman', serif`.

---

## v8/sections/Footer.tsx, SignupOffers.tsx, EditorialSplit.tsx

(Read at refactor time. Inventory committed in this snapshot file alongside the refactor diff — see the file itself for full hex/font usage at the snapshot SHA.)

---

## faq/page.tsx

Hardcoded throughout the inline CSS block (lines 12–319).

| Hex | Used for |
|---|---|
| `#ffffff` | Page bg |
| `#0e0e0c` | Default page text, question titles, h2 section titles |
| `#5a5a52` | Updated date label, intro lede, group caption, footer note, FAQ "still have questions" sub-text |
| `#e94b36` | Eyebrow, eyebrow underline, accent links, hover states, category link arrow |
| `#2a2a25` | FAQ answer body text |
| `rgba(14,14,12,*)` | Borders, dividers |

**Fonts (pre-refactor):**
- Section title (`.bl-faq-section-title`) — `'Cormorant Garamond', 'Times New Roman', serif`
- Eyebrows, category headers, links — `'Bricolage Grotesque', sans-serif`
- Body, answers — `'Outfit', sans-serif`

**Behavioral change in refactor:** section titles switch from Cormorant Garamond → `var(--bl-font-display)` (Bricolage Grotesque) to align with sans-forward direction.

**How to revert faq**: replace `var(--bl-accent)` → `#e94b36`, `var(--bl-ink)` → `#0e0e0c`, `var(--bl-ink-muted)` → `#5a5a52`, `var(--bl-ink-soft)` → `#2a2a25`, and on `.bl-faq-section-title` replace `var(--bl-font-display)` → `'Cormorant Garamond', 'Times New Roman', serif`.

---

## privacy/page.tsx

Hardcoded throughout (lines 14–82).

| Hex | Used for |
|---|---|
| `#ffffff` | Page bg |
| `#0e0e0c` | Default text |
| `#e94b36` | Eyebrow, links |
| `#6a6a64` | Updated-date label (note: slightly different muted than faq's `#5a5a52`) |
| `#2a2a25` | Body copy |

**Fonts:** Bricolage + Outfit only (no serif).

**How to revert privacy**: replace `var(--bl-accent)` → `#e94b36`, `var(--bl-ink)` → `#0e0e0c`, `var(--bl-ink-soft)` → `#2a2a25`. Restore `#6a6a64` if you cared about its 16-unit divergence from `#5a5a52`; otherwise leave on `var(--bl-ink-muted)`.

---

## insider/insiderCss.ts

Had its own `:root` declaration (lines 1–19) — this was duplicate of what's moving to globals.css.

**Pre-refactor `:root` values:**
| Property | Value |
|---|---|
| `--bl-bg` | `#0B1733` (navy) |
| `--bl-bg-soft` | `#131F40` |
| `--bl-fg` | `#F2EFE8` |
| `--bl-fg-muted` | `rgba(242, 239, 232, 0.72)` |
| `--bl-fg-faint` | `rgba(242, 239, 232, 0.42)` |
| `--bl-accent` | `#e94b36` |
| `--bl-accent-soft` | `rgba(233, 75, 54, 0.14)` (note: more opaque than v8's `0.06`) |
| `--bl-divider` | `rgba(242, 239, 232, 0.12)` |
| `--bl-divider-strong` | `rgba(242, 239, 232, 0.22)` |
| `--bl-ease` | `cubic-bezier(.22, 1, .36, 1)` |
| `--bl-display` | `'Cormorant Garamond', 'Times New Roman', serif` |
| `--bl-serif` | `'Fraunces', 'Cormorant Garamond', serif` |
| `--bl-sans` | `'Bricolage Grotesque', system-ui, sans-serif` |
| `--bl-body` | `'Outfit', system-ui, sans-serif` |
| `--bl-mono` | `ui-monospace, 'SF Mono', Menlo, monospace` |
| `--bl-script` | `'Caveat', 'Brush Script MT', cursive` |

**Note**: Insider applied these to `:root` globally — which meant they leaked into every page, but no other page actually referenced them. In the unified token system, only globals.css owns `:root`; insider's navy surface is applied via `.bl-page { background: var(--bl-section-bg); color: var(--bl-section-fg); }`.

**How to revert insider**: re-add the `:root { --bl-* }` block at the top of `insiderCss.ts`; remove the `.bl-page` background/color overrides if added.

---

## Single-line revert (whole refactor)

`git revert <unify commit SHA>` — the refactor is a single commit so this returns every file to its pre-2026-05-23 state.
