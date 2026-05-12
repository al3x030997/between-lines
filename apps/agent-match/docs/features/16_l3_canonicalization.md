# Feature 16 — L3 Kanonisierung

> Lies zuerst: `PROJECT_CONTEXT.md`, Abschnitt "Daten-Pipeline-Architektur (L0–L4)" in `IMPLEMENTATION_PLAN.md` | Verwandt: `05_llm_extraction.md` (L1 Chunker), `17_l2_interpretation.md` (L2 liefert Input), `07_embedding_pipeline.md` (L4 konsumiert Output), `08_matching_algorithm.md` (Matcher konsumiert Output)

> **Taxonomie-Hinweis (2026-04-15):** Dieses Dokument wurde im Pipeline-Refactor von "Feature 16 — L2 Kanonisierung" zu "Feature 16 — L3 Kanonisierung" umbenannt. **Inline-Verweise auf "L2" in den Abschnitten unten meinen die Kanonisierung** (alte Nomenklatur), nicht die neue Interpretation-Schicht. "L3" in den Abschnitten unten meint die Embeddings (heute L4). Die Rationale, der Algorithmus und das Governance-Modell sind unverändert; nur die Layer-Namen verschieben sich um eins.

## Scope

Abbildung der interpretierten L2-Ausgabe (Agenten-Sprache mit Strength-Tags + Compound-Expression-Trees) auf ein **kontrolliertes, versioniertes Vokabular** — die Canon. Ermöglicht deterministisches Boolean-Filtern in Schritt 6 (Matching) und reduziert den Kandidatenraum von ~3000 auf ~50 in Millisekunden.

**Nicht** in diesem Feature: L1-Chunker (→ 05), L2 Interpretation (→ 17), L1-V Fact-Checker (separate Spezifikation), Embedding (→ 07), Matching-Algorithmus (→ 08).

> **Status-Hinweis (2026-04-15)**: Seit der Note-Taker-Integration (Prompt v2.0) liegt die L1-Ausgabe sektionsstrukturiert in `agents.profile_notes` (JSONB) vor — pro Sektion mit eigenen `genres`, `audience`, `wants`, `does_not_want`, `tropes_*`, `comp_titles`. Die L2-Konsumenten (Coverage-Skript, geplante Runtime-`Canonicalizer`-Klasse) lesen aktuell noch die flachen Spalten (`genres_raw`, `audience`, `hard_nos_keywords`); diese werden best-effort aus `profile_notes` projiziert. Sobald der Matcher sektionsnativ umgebaut wird, muss der L2-Consumer auf `profile_notes.preference_sections[*]` umgestellt werden — sonst geht die per-Sektion-Granularität (z.B. "Fantasy nur in YA, nicht Adult") wieder verloren.

---

## L1 / L2 — Aufgabentrennung

Wichtige Klarstellung des Architektur-Modells:

- **L1 (Note-Taker, Feature 05)** liefert die 8-Step-Notes als **strukturierte natürliche Sprache**. Jede Slot-Position (Audience, Genres, Wants, Does Not Want, Hard Nos, Submission, Comps, Themes, Confidence) trägt NL-Inhalt, **nicht** vorab kanonisierte Tokens. L1 entscheidet *welche Slots* gefüllt werden, nicht *welche Codes*.
- **L2** ist eine **per-Step-Typ-Kanonisierungs-Transformation**, kein einzelner einheitlicher YAML-Lookup. Verschiedene Step-Typen brauchen verschiedene Kanonisierungs-Verfahren:

  | L1-Step | L2-Output | Verfahren |
  |---|---|---|
  | Identity | enums (availability) + strukturierte Felder (email, portal) | Slot-zu-Slot |
  | Global Conditions | strukturierte `Condition[]` mit Strength-Tag | NL → Constraint-Expression |
  | Preference Section | `coords + filters + conditions + wants + comps + cross_refs` (siehe unten) | Hybrid: Phrase-Lookup für atomare Coords, strukturierte Extraktion für Compound-Ausdrücke |
  | Hard-Nos | `{tag, exceptions: ConstraintExpr[]}` | Phrase-Lookup + Exception-Parsing |
  | Submission | strukturierte `SubmissionRule[]` pro Kategorie | Slot-zu-Slot |
  | Comps / Taste / Themes | unverändert weitergereicht an L3 | Pass-through |
  | Confidence Flags | Trust-Metadata, gating downstream | Pass-through |

- **Folgerung:** `aliases.yaml` Phrase-Lookup ist **eine** L2-Transformation (für atomare Coord-Tokens), nicht *die* L2-Transformation. Compound-Ausdrücke wie `"Cozy fantasy (light only)"`, `"RomCom WHERE both leads are POC"` oder `"Fantasy (exceptions: very light elements only)"` benötigen ein strukturiertes Verfahren, vermutlich LLM-gestützt.
- **Status (2026-04-15):** Der aktuelle `note_parser.py` normalisiert Audience-Tokens vorzeitig (`_AUDIENCE_TOKENS`-Enum, Z. 36) — das ist L2-Arbeit, die in L1 leakt. Folge-Refactor verlagert das nach L2; nicht Teil der jetzigen Feature-Spec.

---

## Dateien

```
canon/                         # Authoritative — Single Source of Truth
├── VERSION
├── README.md
├── thema_subjects.yaml        # Generiert aus Thema v1.6 (F*/Y*/D*)
├── thema_audience.yaml        # Generiert (5A*)
├── thema_form.yaml            # Generiert (X*)
├── extensions.yaml            # Lokale Ergänzungen (LOCAL:*)
├── hard_nos.yaml              # Hard-No-Tags (nicht Teil von Thema)
├── aliases.yaml               # Rohphrase → Canonical Code
├── coverage_report.md         # Letzter Dry-Run
└── _source/                   # Thema-Quelle + Filter-Skript (Audit-Trail)

scripts/
└── canon_coverage.py          # Dry-Run Validator

autoquery/canon/                # Laufzeit-Code (geplant, nicht in dieser Spezifikation)
└── canonicalizer.py           # Konsumiert canon/aliases.yaml
```

---

## Design-Entscheidung: Upfront-Canon, keine Laufzeit-Erweiterung

**Entschieden:** Die Canon wird **vorab definiert**, **versioniert** und **nur im Review-Zyklus erweitert** — niemals zur Laufzeit durch den Extractor.

**Begründung** (gegen Laufzeit-Auto-Erweiterung):

1. **Rückwirkende Blindheit.** Erfindet L2 auf Profil #147 "romantasy", sind die Profile #1–146 ohne dieses Tag. Ein romantasy-Manuskript verpasst 50 frühere Agenten, die tatsächlich romantasy repräsentieren — getaggt als "fantasy + romance".
2. **Stumme Duplikation.** LLM auf #147 schlägt "romantasy" vor, auf #180 "romance_fantasy", auf #203 "fantasy-romance". Drei nahezu identische Kategorien, Filter-Logik zersplittert. Automatische Deduplikation funktioniert nie zuverlässig.
3. **Keine Reproduzierbarkeit.** Die Matching-Ergebnisse von gestern können nicht reproduziert werden, weil das Vokabular sich bewegt hat.
4. **Matcher-Gewichte driften.** Schritt 6 setzt stabile Vokabular-Verteilung voraus. Neue Kategorien verschieben die Score-Verteilung.
5. **Qualität kollabiert.** Der Grund, Thema zu wählen, ist die Kuratierung. Auto-Erweiterung ist das Gegenteil von Kuratierung.

**Alternative gewählt:** Fester Canon + `unmapped_terms`-Log + periodischer Review-Zyklus (Details unten).

---

## Canon-Struktur

Die Canon zerfällt in **fünf unabhängige Facetten**. Jede Facette hat eigene Codes und eigenen Lookup.

| Facette | Quelle | Wird verwendet von |
|---|---|---|
| `subject` | `thema_subjects.yaml` + `LOCAL:*` aus `extensions.yaml` | Genre-Match (Primary + Sub-Tag-Overlap) in Schritt 6 |
| `audience` | `thema_audience.yaml` + `LOCAL:adult` | Audience-Proximity-Score (Altersordnung) in Schritt 6 |
| `form` | `thema_form.yaml` + `LOCAL:*` | Form-Match (Roman vs. Novella vs. Graphic Novel) |
| `hard_no` | `hard_nos.yaml` | Deterministischer Ausschluss-Filter |
| `condition` | *(nicht in diesem Verzeichnis — strukturiertes Schema im Extractor)* | Ort / Wortanzahl / Protagonist-Constraints |

**Thema als Backbone:** Thema (EDItEUR) trennt Subject / Audience / Form in unabhängige Qualifier, was exakt der benötigten L2-Struktur entspricht. BISAC würde Audience und Genre verschmelzen (`YOUNG ADULT FICTION / Fantasy`), was die Matcher-Signale kollidieren ließe.

**LOCAL:-Extensions** haben eine hohe Einstiegshürde (siehe unten), damit die Canon nicht verwässert.

**Hinweis zu "unabhängigen Facetten":** "Unabhängig" meint *orthogonale Codebooks* (Subject-Codes und Audience-Codes leben in disjunkten Räumen). Es bedeutet **nicht**, dass Profile oder Sektionen voneinander unabhängig sind — Cross-Refs zwischen Sektionen existieren (siehe unten) und werden in L2 aufgelöst.

---

## Preference-Section: kanonische Form

Eine Preference-Section ist mehr als `(audience, genre)`. Die kanonische Form pro Sektion:

```
CanonicalPreferenceSection {
  label             : string                              // verbatim aus L1
  coords {
    subject         : CanonCode[]                         // Thema F*/Y*/D* + LOCAL:* (multi-valued)
    audience        : CanonCode[]                         // Thema 5A* + LOCAL:adult (multi-valued, geordnet)
    form            : CanonCode[]                         // Thema X* + LOCAL:novel/webtoon
  }
  filters {
    local_hard_nos  : HardNoTag[]                         // section-scoped — gleiches Vokabular wie global, kleinerer Scope
    does_not_want   : ExclusionClause[]                   // jedes Item ggf. mit `exceptions`
  }
  conditions        : Condition[]                         // strukturiert, sektion-lokal
  wants             : ConstraintExpr[]                    // strukturierte Constraints, nicht freie Strings
  local_comps       : CompTitle[]                         // section-scoped (≠ profile-globale Ultra-Specific Wishlist)
  cross_refs        : SectionRef[]                        // z.B. "anything listed in other sections"
  raw               : <verbatim L1-Block>                 // für Re-Kanonisierung bei Canon-Bump
  unmapped_terms    : { facet, raw_term }[]               // nicht aufgelöst, an Review-Log
  canon_version     : string
}
```

**Invarianten:**
1. Sektion ist die Einheit der Präferenz. Profil = `PreferenceSection[]` + Profil-Globals (Identity, globale Hard-Nos, globale Conditions, globale Comps, Taste). **Niemals über Sektionen hinweg flachklopfen.**
2. `coords` werden **gescored** (Similarity), `filters` **gaten** (Reject vor Score). Verschiedene Rollen, nie vermischen.
3. `raw` bleibt unverändert. Canon-Bump → L2 erneut auf `raw`, neue `coords`/`filters`/`canon_version`.
4. `unmapped_terms` ist nicht-fatal — eine Sektion mit leeren `coords.subject` läuft trotzdem durch (matched dann schlecht, Term landet im Review-Queue).
5. Coords sind Mengen, keine Skalare: `subject: [FM, FMR]` (Fantasy + Romantasy) ist normal.

**Was *nicht* in eine Sektion gehört:** Identity, Submission-Portal, profilglobale Hard-Nos, Taste-Referenzen, Cross-Cutting-Themes, Confidence-Flags. Diese reiten auf Profil-Ebene.

---

## Hard-Nos: Tag + optionale Exceptions

Hard-Nos sind **nicht strikt binär**. Beispiel aus der MSWL-Stichprobe (Aashna Avachat):

> Hard-No: `Fantasy (exceptions: very light elements only, as noted above)`

Kanonische Form:

```
CanonicalHardNo {
  tag          : HardNoTag                  // z.B. "FM" (für Fantasy als Subject-Hard-No) oder "onpage_sex"
  severity     : "strict" | "soft"          // unverändert aus hard_nos.yaml
  exceptions   : ConstraintExpr[]           // optional — wenn erfüllt, Hard-No greift NICHT
  scope        : "profile_global" | "section_local"
  raw          : string                     // verbatim L1-Phrase
}
```

**Auswertung im Matcher:**

```
reject(manuscript, hardno) :=
   manuscript_tags ∋ hardno.tag
   AND NOT any(exception_matches(manuscript, e) for e in hardno.exceptions)
```

Ohne Exceptions degeneriert das zur klassischen Set-Membership-Prüfung. Mit Exceptions wird Hard-No ein **bedingter Filter**.

---

## Section-lokale vs. profil-globale Hard-Nos

Beide existieren und sind beide notwendig. Der L1-Note-Taker trennt sie bereits:

- **Section-lokal** — `preference_sections[*].does_not_want`, `tropes_excluded`. Beispiel: "in meiner Adult-Fantasy-Sektion kein on-page sex" — gilt **nicht** für die YA-Romance-Sektion derselben Agentin.
- **Profil-global** — `hard_nos.{content,format,trope,category}`. Beispiel: "in meiner gesamten Liste keine AI-generierten Manuskripte" — gilt für **jede** Sektion, auch zukünftig hinzugefügte.

Gleiches Vokabular (alle resolven gegen `hard_nos.yaml`-Tags), unterschiedlicher Scope. Der Matcher unioniert beide pro Sektion vor der Auswertung:

```
effective_excludes(section) := section.local_hard_nos ∪ profile.global_hard_nos
```

Speicherkosten: null. Auswertungskosten: eine Mengenvereinigung pro Match-Versuch. Informationsverlust: keiner — Stille einer Sektion bedeutet *nicht* Ausschluss.

---

## Cross-Refs zwischen Sektionen

Reale Profile referenzieren Sektionen aufeinander. Beispiel (Aashna [3] Graphic Novels):

> `Genres: anything listed in other sections`

Das ist ein **Section-Graph**, kein flacher Container. L2-Verfahren:

1. Cross-Ref bei der Kanonisierung erkennen (`SectionRef`-Typ, z.B. `{kind: "all_other_sections"}` oder `{kind: "named", labels: [...]}`).
2. **Expansion**: in die Vereinigung der `coords` aller referenzierten Sektionen auflösen.
3. **Beides speichern** — die expandierte Coord-Menge (für den Matcher) und die Original-Referenz (für Re-Kanonisierung, wenn andere Sektionen sich ändern).

Ohne Schritt 3 driftet die Expansion bei Profil-Edits oder Canon-Bumps stumm.

---

## L2-Kosten und Determinismus

Mit obigen Erweiterungen ist L2 **mehr als ein YAML-Lookup**. Compound-Ausdrücke, Exceptions, Constraint-Expressions und Cross-Refs erfordern strukturierte Extraktion — pro Profil potentiell ein zusätzlicher LLM-Call.

**Determinismus-Stempel** an jedem L2-Output: `(canon_version, l2_prompt_version, model_id, run_id)`. Damit lässt sich L2-Drift unabhängig von Canon-Drift erkennen, und Re-Kanonisierung bleibt reproduzierbar (modulo LLM-Sampling-Varianz, die durch Stempel sichtbar wird).

---

## Alias-Resolution-Algorithmus (Laufzeit)

**Anwendungsbereich:** atomare Coord-Tokens (einfache Subject-/Audience-/Form-/Hard-No-Bezeichner). Das ist *eine* der L2-Transformationen — nicht die einzige (siehe "L1 / L2 — Aufgabentrennung" oben). Compound-Ausdrücke laufen durch das strukturierte L2-Verfahren.

Für jeden atomaren Rohbegriff `t` aus L1:

1. **Normalisieren:** `lowercase`, Satzzeichen entfernen (außer `-`), Whitespace kollabieren.
2. **Exakter Lookup** in `aliases.yaml[facet]`.
3. **Treffer** → Canonical-Code zurückgeben.
4. **Miss** → Eintrag in `unmapped_terms`-Tabelle: `{facet, raw_term, normalized_term, profile_id, canon_version, first_seen}`. Kein Code zurückgeben.

Explizit **nicht vorgesehen** für diesen Lookup:

- Fuzzy-Matching, Edit-Distance-Fallbacks
- Embedding-basierte Ähnlichkeitssuche
- LLM-basiertes "Rettungs"-Mapping (für *atomare* Tokens — der strukturierte L2-Pfad nutzt LLM für Compound-Ausdrücke, das ist eine andere Schicht)
- Automatische Erzeugung neuer Codes

**Compound-Ausdrücke** (`"Cozy fantasy (light only)"`, `"RomCom WHERE both leads are POC"`, `"Fantasy except very light"`): zerlegen in `{coord, qualifier|exception|constraint}`, dann Coord-Teil über Phrase-Lookup, Qualifier-Teil als `Condition`/`ExclusionClause.exceptions`/`ConstraintExpr` strukturiert speichern. Der `unmapped_terms`-Log fängt Fälle, in denen weder Coord noch Qualifier sauber extrahiert werden können.

Ambiguität jenseits dieser Verfahren wird an den Review-Zyklus delegiert.

---

## Versionierung und Review-Zyklus

**Schema:** semver-artig.

| Version | Bedeutung |
|---|---|
| `v0.x` | Vor Schritt 4. Seed aus Thema + Domänenwissen, nur gegen 7 Benchmark-Profile validiert. **Instabil.** |
| `v1.0` | Nach Schritt 4. Validiert gegen ≥200 reale Profile, Coverage + κ berichtet. **Stabil.** |
| `v1.x` | Kontrollierte Ergänzungen (neue Aliase, neue `LOCAL:*` nach Regel). |
| `v2.0` | Thema-Upstream-Bump oder strukturelle Änderung. |

**Bump-Regeln:**

- Nur neue Aliase → Patch (`v1.0.1`).
- Neue `LOCAL:*`-Extension → Minor (`v1.1.0`).
- Thema-Upstream-Update oder Facetten-Änderung → Major (`v2.0.0`).

**Jedes getaggte Profil** speichert die Canon-Version, mit der es getaggt wurde. Ein Canon-Bump löst kontrollierbares Re-Tagging aus (nicht automatisch).

**Extension-Regel (ab v1):** Eine neue `LOCAL:*`-Kategorie darf nur hinzugefügt werden, wenn

- sie in **≥5 verschiedenen Profilen** im `unmapped_terms`-Log erscheint, **UND**
- sie nicht als Kombination bestehender Codes ausgedrückt werden kann, **UND**
- sie breite Marktanerkennung hat (nicht einzelagenten-Eigenheit).

Jede LOCAL-Extension trägt `justification` und `added_in_version`-Felder. Promotion nach Thema proper (wenn EDItEUR den Code später aufnimmt) erfolgt durch Aliases-Umzug + Entfernung aus `extensions.yaml`.

---

## `unmapped_terms`-Log (geplant, nicht in dieser Spezifikation implementiert)

Vorgesehenes Tabellenschema (in der folgenden Runtime-Spezifikation):

```sql
CREATE TABLE unmapped_terms (
  id           SERIAL PRIMARY KEY,
  facet        TEXT NOT NULL,        -- subject | audience | form | hard_no
  raw_term     TEXT NOT NULL,        -- Originalphrase aus L1
  normalized   TEXT NOT NULL,        -- nach Normalisierung
  profile_id   INT  REFERENCES agents(id),
  canon_version TEXT NOT NULL,
  first_seen   TIMESTAMP NOT NULL DEFAULT now(),
  reviewed     BOOL NOT NULL DEFAULT false,
  resolution   TEXT                 -- 'alias'|'extension'|'dismiss'|NULL
);
CREATE INDEX idx_unmapped_normalized ON unmapped_terms(normalized);
```

Review-UI (vermutlich im Streamlit-Review-Interface, Feature 06) zeigt Unmapped-Terms gruppiert nach `normalized`, mit Profilzahl und Beispielkontexten.

---

## Qualitäts-Gates

> **Status (2026-04-15)**: `scripts/canon_coverage.py` ist gegen das neue Note-Taker-Schema veraltet (liest die entfernten Flat-Spalten `genres` / `audience` / `hard_nos_keywords`). Aktiver Validator für die pre-Step-4-Stichprobe ist `scripts/canon_dryrun.py` — liest `data/mswl_sample/notes_parsed/*.json` und walkt `profile_notes.preference_sections[*]` + `hard_nos.*`. Rewrite des alten Skripts ist separat.

Bei jedem Canon-Bump berichten:

1. **Coverage** — Anteil der Rohbegriffe pro Facette, die auf einen Canonical-Code abgebildet wurden. Ziel v1: ≥90% (subject, audience, form), ≥70% (hard_no — Langschwanz-verdächtig).
2. **Inter-Annotator-Agreement (κ)** — Manuelle Re-Taggung von 20 Profilen durch zwei Reviewer, Cohen's κ pro Facette. Ziel v1: κ ≥ 0,7. Niedriger κ → Kategorien sind unterspezifiziert → Definitionen präzisieren.
3. **Discriminability-Test** — Profile mit bekannt disjunktem Fokus (z. B. Cozy-Fantasy-Agent vs. Horror-Agent) müssen disjunkte Primary-Subject-Sets erzeugen. Andernfalls zu grobe Aliase.
4. **Stabilität** — Rerun mit anderen Seed-Profilen verändert keine Canonical-Codes. (Prüft nur Canon, nicht den Extractor-Output.)

**Validierungs-Inputs**:
- v0-Dry-Run läuft gegen 7 Benchmark-Profile (`batch_capture_output/cleaned/*.txt`) + 50 MSWL-Stichprobe (`data/mswl_sample/notes_parsed/*.json`).
- 50 MSWL ist **erste Stichprobe, kein v1-Lock** — die LOCAL-Extensions-Regel (≥5 Profile) greift bei 50 nur für sehr häufige Begriffe. v1-Lock benötigt weiterhin ≥200 Profile via Schritt 4 (direct-to-source Produktionsdaten).

## Decision-Flow: Was tun mit unmapped Terms?

Für jeden häufigen unmapped Term aus dem Dry-Run-Leaderboard:

| Outcome | Kriterium | Aktion |
|---|---|---|
| **Alias-Kandidat** | Term ist Synonym/Variante eines existierenden Canonical Codes (z. B. `"contemporary fantasy"` → `FMH`) | `aliases.yaml`-Edit. Risikoarm, Patch-Bump (`v1.0.x`). |
| **LOCAL-Extension-Kandidat** | Term erscheint in **≥5 verschiedenen Profilen** UND lässt sich nicht als Kombination existierender Codes ausdrücken UND hat breite Marktanerkennung | Neue `LOCAL:*`-Zeile in `extensions.yaml` mit `justification` + `added_in_version`. Minor-Bump (`v1.x.0`). |
| **Dismiss** | Term kommt in <5 Profilen vor, zu vage, oder einzelagenten-Eigenheit | Loggen, ignorieren, keine Canon-Änderung. |

`canon_dryrun.py` taggt jeden unmapped Term automatisch mit einem der drei Labels — die eigentliche Edit-Entscheidung bleibt manuell.

---

## Interaktion mit L1, L1-V, L3

**L1 (Note-Taker, Feature 05)** liefert pro Profil ein 8-Step-Notes-Objekt in `agents.profile_notes` (JSONB). Pro Preference-Section: `audience`, `genres`, `wants`, `does_not_want`, `tropes_*`, `comp_titles` — alles als NL-Slots. Profil-global: `identity`, `global_conditions`, `hard_nos.{content,format,trope,category}`, `submission`, `comp_titles_high_priority`, `taste_references`, `cross_cutting_themes`, `confidence_flags`.

L2 konsumiert **ausschließlich `profile_notes`** — niemals `wishlist_raw` direkt. Die alten flachen Spalten (`genres_raw`, `audience`, `hard_nos_keywords`) sind eine temporäre Projektion (siehe Status-Hinweis oben) und werden mit dem Matcher-Rewrite wegfallen.

Wenn L1 eine Phrase nicht erkennt, ist das L1's Problem, nicht L2's. Wenn L2 sie erkennt aber nicht kanonisieren kann, landet sie in `unmapped_terms`.

**L1-V (Fact-Checker, separate Spezifikation)** läuft zwischen L1 und L2. Ist L1-V noch nicht implementiert, läuft L2 direkt auf L1-Output — Fehler propagieren.

**L3 (Per-Section Embeddings, Feature 07)** erhält von L2:
- Die Canonical-Subject-Codes pro Preference-Section (für Metadaten-Filter)
- Den unveränderten natürlich-sprachlichen Section-Text (Embedding-Input)

L3 **braucht L2 nicht** für die Embedding-Berechnung selbst; L2 liefert nur Metadaten-Filter vor der Embedding-Ähnlichkeitssuche.

**Matcher (Feature 08)** konsumiert:
- L2-Subject-Overlap → Genre-Match-Score
- L2-Audience-Distanz (numerische Ordnung der 5A*-Codes) → Proximity-Score
- L2-Hard-No-Intersection → Deterministischer Ausschluss (0% Hard-No-Violation gefordert)
- L3-Section-Cosine → Semantic-Score

---

## Out of Scope (v0)

- **Runtime-Canonicalizer-Klasse** (`autoquery/canon/canonicalizer.py`) — Folge-Spezifikation.
- **Alembic-Migration** für Spalten `thema_subjects`, `thema_audience`, `thema_form`, `canon_version` auf `agents`.
- **`unmapped_terms`-Tabelle** — Schema oben skizziert, Migration separat.
- **Hook in `crawl_url_task`** (`autoquery/crawler/tasks.py`).
- **L1-V-Fact-Checker** — separate Spezifikation.
- **v1-Canon-Lock** — gated auf Abschluss von Schritt 4 (≥200 Profile).
- **Auto-Erweiterung** — explizit verboten, siehe Design-Entscheidung oben.

---

## Referenzen

- **Thema-Spezifikation:** <https://www.editeur.org/151/Thema/> (EDItEUR)
- **Interaktiver Thema-Browser:** <https://ns.editeur.org/thema>
- **Verwandte Features:**
  - `05_llm_extraction.md` — Liefert L1-Input
  - `06_review_interface.md` — Zukünftiger Ort für `unmapped_terms`-Review
  - `07_embedding_pipeline.md` — L3, konsumiert Canonical-Codes als Metadaten
  - `08_matching_algorithm.md` — Hauptkonsument aller L2-Signale
- **Alte Canonicalization:** `config/genre_aliases.yaml` (flach, wird migriert nach `canon/aliases.yaml`)
