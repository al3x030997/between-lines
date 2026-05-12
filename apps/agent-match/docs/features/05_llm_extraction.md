# Feature 05 — LLM-Extraktion

> Lies zuerst: `PROJECT_CONTEXT.md` | Master-Referenz: Modul B (6.1–6.4)

## Scope

LLM-basierte Profil-Extraktion aus bereinigtem Text. Zwei-Schritt-Pipeline:

- **L1 (Chunker, v3.0)** — verbatim-Chunking in 8 vordefinierte Buckets. Keine Interpretation.
- **L2 (Interpretation, v1.0)** — NL→NL Interpretation: Wants/DNW Split, Strength-Tags, Audience-Enum, Compound-Expressions. Siehe **Feature 17**.

Persistenz nach `agents.profile_notes` (L1, JSONB) und `agents.profile_interpretation` (L2, JSONB), plus Projektion in die bestehenden flachen Spalten (Quelle: L2). **Nicht** in diesem Feature: Review-Interface (→ 06), Embedding-Berechnung (→ 07), Matcher (→ 08), L3-Kanonisierung (→ 16).

## Dateien

```
extractor/
├── profile_extractor.py        # 2-Call-Pipeline (L1 → L2), DB-Upsert
├── note_parser.py              # L1 plain-text → strukturiertes dict (verbatim)
├── interpretation_parser.py    # L2 plain-text → strukturiertes dict (interpretiert)
├── prompts.py                  # Lädt alle Prompts aus prompts/ als Modul-Konstanten
└── prompts/                    # Ein Prompt pro Datei — siehe prompts/README.md
    ├── README.md
    ├── l1_chunker_v1.txt                       # Aktiv (L1)
    ├── l2_interpretation_v1.txt                # Aktiv (L2)
    ├── l1_multi_agent_roster_system_v1.txt     # Aktiv
    ├── l1_multi_agent_roster_user_v1.txt       # Aktiv
    └── l1v_chunker_fact_checker_v1.txt         # Design-Stub, nicht verdrahtet
```

## L1-Output (Chunker, v3.0)

Der Prompt erzwingt eine deterministische 8-Schritt-Sektionsstruktur. Jeder Bullet ist ein **wörtliches Substring** des Quelltexts — keine Paraphrase, keine Strength-Tags, keine Audience-Enum, kein Wants/DNW-Split.

1. **IDENTITY** — Name, Organization, Role, Pronouns, Email, Submission portal, Availability
2. **GLOBAL CONDITIONS** — flache verbatim-Bullet-Liste
3. **PREFERENCE SECTIONS** — N offene Sektionen mit `[Label]`, `Audience: <verbatim>`, `Genres: <verbatim>`, `Excerpts:` (flache Bullet-Liste)
4. **HARD NOS** — flache verbatim-Liste (kein Bucket-Split)
5. **SUBMISSION REQUIREMENTS** — pro Kategorie oder global
6. **COMP TITLES & TASTE REFERENCES** — A) High-Priority-Comps, B) Taste References
7. **CROSS-CUTTING THEMES** — verbatim-Bullets
8. **CONFIDENCE FLAGS** — INFERRED / NUANCED / MISSING

`note_parser.parse(text)` produziert daraus ein dict mit diesen Top-Level-Keys. Fehlende Sektionen → leere Container.

**Explizites Nicht-Ziel:** L1 **interpretiert nicht**. Bucketing, Strength-Tagging und Audience-Normalisierung sind Aufgabe von **L2** (Feature 17). Die Kanonisierung (Mapping auf kontrolliertes Vokabular) ist Aufgabe von **L3** (Feature 16, nicht implementiert).

## Persistenz

| Spalte | Typ | Inhalt | Migration |
|---|---|---|---|
| `profile_notes` | JSONB | L1: geparste verbatim-Notes | 005 |
| `profile_notes_raw` | TEXT | L1: Roh-LLM-Output | 005 |
| `prompt_version` | VARCHAR(16) | L1-Prompt-Version | 005 |
| `profile_interpretation` | JSONB | L2: geparste interpretierte Notes | 006 |
| `profile_interpretation_raw` | TEXT | L2: Roh-LLM-Output | 006 |
| `interpretation_prompt_version` | VARCHAR(16) | L2-Prompt-Version | 006 |

**Kompatibilitäts-Projektion in flache Spalten** (`genres_raw`, `audience`, `hard_nos_keywords`, `keywords`, `wishlist_raw`, …) bleibt aktiv — Quelle ist jetzt **L2** (`_project_to_columns` in `profile_extractor.py`). Diese Projektion ist temporär; sie verschwindet, sobald Matcher, Embeddings-Pipeline und Review-UI sektionsnativ umgebaut sind. Neuer Code darf sich nicht auf die flachen Spalten verlassen.

---

## Strategie: Store More, Show Less

| Datentyp | Speichern? | Im Frontend? | Begründung |
|---|---|---|---|
| Genres, Audience, Submission-Anforderungen | ✅ | ✅ | Fakten, nicht schützbar |
| Maschinell extrahierte Keywords | ✅ | ✅ | Eigene maschinelle Schöpfung |
| Embedding-Vektor | ✅ | — | §44b UrhG — Text and Data Mining |
| Wunschliste als Fließtext | ✅ | ❌ (MVP) | Intern für Embedding-Qualität + Review |
| Bio als Fließtext | ✅ | ❌ (MVP) | Intern für Embedding-Qualität + Review |
| Hard-Nos als Fließtext | ✅ | ❌ (MVP) | Intern für Embedding-Qualität + Review |

Originaltexte werden intern gespeichert, im MVP nicht veröffentlicht. Frontend-Anzeige kann später ohne Architektur-Änderung aktiviert werden (reine UI-Entscheidung, idealerweise nach Rechtsberatung).

---

## Verarbeitungsreihenfolge

1. Bereinigter Text liegt im RAM (aus Feature 04)
2. LLM extrahiert strukturierte Felder (Fakten, Keywords)
3. LLM extrahiert Originaltext-Segmente (Wishlist, Bio, Hard-Nos) als separate Felder
4. Embedding wird aus dem Volltext berechnet (Feature 07)
5. Alles wird persistent gespeichert

---

## Zu extrahierende Felder

**Strukturierte Felder (öffentlich):**
- `name` — Vollständiger Name
- `agency` — Name der Agentur
- `email` — Submission-E-Mail (intern, nie öffentlich)
- `country` — Land
- `genres` — Liste der vertretenen Genres
- `audience` — Liste: Adult / YA / Middle Grade / Children's
- `keywords` — Maschinell extrahierte Keywords aus Wunschliste (kompakte Begriffe)
- `hard_nos_keywords` — Keywords aus Ablehnungen (kompakte Begriffe)
- `submission_req` — JSONB: query_letter (bool), synopsis (bool), pages (int|null), full_manuscript (bool), bio (bool), additional_notes (kurze faktische Notiz)
- `is_open` — Submissions-Status
- `response_time` — Faktische Angabe

**Originaltext-Felder (intern, nie im Frontend):**
- `wishlist_raw` — Wunschliste als Fließtext
- `bio_raw` — Bio/Über-mich als Fließtext
- `hard_nos_raw` — Ablehnungen als Fließtext

---

## Qualitätsprüfung nach Extraktion

- `name` muss vorhanden sein
- `genres` muss min. 1 Eintrag enthalten
- `keywords` sollte min. 3 Einträge enthalten

Schlägt die Prüfung fehl → Status `extraction_failed`, geloggt, nicht ins Review.

---

## Prompt-Anforderungen

- Alle Prompts zentral in `prompts.py`
- `format: "json"` im Ollama-Aufruf erzwingen
- Jeder Prompt versioniert — Änderungen = neue Versionsnummer
- Keywords-Prompt: keine Sätze, nur prägnante Begriffe (Keywords dienen als kompakte Repräsentation für FTS + Frontend)
- Separater Prompt-Abschnitt für Originaltext-Extraktion: Wishlist, Bio, Hard-Nos als zusammenhängende Textblöcke extrahieren
- Input: max. 4000 Wörter (Rest abschneiden)
