# Package 04 — Analysis Preparation

> Read this alongside `../REQUIREMENTS.md`. Do not consult other package files.

## Goal

Produce two artifacts from the corpus:
1. A **descriptive baseline notebook** — the first thing you'd look at to understand what the corpus contains.
2. A **features directory** — precomputed NLP features (tokens, n-grams, optional TF-IDF, optional embeddings) so downstream analysis doesn't redo the heavy lifting.

This package stops at description and feature extraction. Modeling, classification, and topic modeling are explicitly excluded.

## Input

`data/corpus.parquet` — see schema in `REQUIREMENTS.md` § Cross-package contracts. Treat this file as read-only.

## Output

```
notebooks/descriptive.ipynb        # the baseline notebook (committed, with cleared outputs)
data/features/
├── tokens.parquet                 # doc_id, tokens (list[string])
├── ngrams_top.parquet             # ngram, n, count, df, subreddit_count
├── tfidf.npz                      # optional; scipy sparse, aligned to tokens.parquet row order
├── tfidf_vocab.json               # optional; index → term
└── embeddings.parquet             # optional; doc_id, vector (list[float32])
```

`tokens.parquet` is mandatory. `tfidf.*` and `embeddings.parquet` are produced only if their feature toggle is enabled (see below). Missing optional outputs are not an error.

## Functional requirements — notebook

The notebook is a single linear flow with at minimum these sections, each producing one or more figures or tables:

1. **Volume**
   - Documents per subreddit (bar).
   - Documents per month, faceted by subreddit (line).
   - Posts vs. comments split per subreddit (stacked bar).

2. **Engagement**
   - Score distribution per subreddit (boxplot, log y).
   - `num_comments` distribution per subreddit (boxplot, log y; posts only).

3. **Authors**
   - Top 20 authors by document count, overall and per subreddit.
   - Author concentration: share of documents from top 10% of authors per subreddit.

4. **Length**
   - Character-length and word-count distributions of `body_clean`, faceted by subreddit and `kind`.

5. **Language**
   - Language mix per subreddit (stacked bar of `lang` shares).

6. **Lexical**
   - Top 30 unigrams and top 30 bigrams per subreddit, after stop-word removal (read from `data/features/ngrams_top.parquet`).

The notebook must:
- Load all data from `data/corpus.parquet` and `data/features/*`.
- Be committed with **cleared outputs** to keep diffs sane.
- Use deterministic seeds where any randomness exists (sampling for figure speed, etc.).

## Functional requirements — features

1. **Tokenization** — lowercase, regex word tokenizer (`\b\w+\b`), no stemming by default. Stop-word list is the standard English list from `sklearn.feature_extraction.text.ENGLISH_STOP_WORDS`; rows with `lang != "en"` are tokenized but excluded from English stop-word filtering.

2. **N-grams** — compute unigrams and bigrams. `ngrams_top.parquet` stores the top 1000 per subreddit by count, with these columns:

   | Column            | Type    |
   | ----------------- | ------- |
   | `subreddit`       | string  |
   | `ngram`           | string  |
   | `n`               | int     |
   | `count`           | int     |
   | `df`              | int     | (document frequency within subreddit)
   | `subreddit_count` | int     | (rank within subreddit)

3. **TF-IDF** (optional, toggle `features.tfidf = true`) — sklearn `TfidfVectorizer` with `min_df=5`, `max_df=0.6`, bigrams enabled. Save as scipy sparse `.npz` aligned by row to `tokens.parquet`.

4. **Embeddings** (optional, toggle `features.embeddings = "sentence-transformers" | "anthropic" | false`) — produce one vector per `doc_id`. If `"sentence-transformers"`, use `all-MiniLM-L6-v2` (384 dims) on CPU. If `"anthropic"`, document the model and cost in the implementing conversation. Default: `false`.

5. **Determinism** — pinned seeds, pinned library versions, sorted inputs. Same corpus → same feature files.

## Configuration

A single `config/analysis.yaml` controls toggles:

```yaml
features:
  tokens: true            # always true
  ngrams: true            # always true
  tfidf: true
  embeddings: false       # or "sentence-transformers" / "anthropic"
filters:
  min_score: -10          # drop docs scored below this (Reddit brigading noise)
  langs: ["en"]           # restrict to these languages; empty list = keep all
```

## Non-functional requirements

- Feature generation is a script (not in the notebook). The notebook only **reads** features. This keeps the notebook fast and re-runnable.
- Feature script is idempotent and overwrites outputs cleanly.
- Embedding computation, if enabled, must be checkpointable (resume by `doc_id`).

## Open questions for the implementing conversation

- **Embedding backend** — defaults to `false`. Turning on `sentence-transformers` adds a ~100 MB model download but no API cost. Anthropic adds API cost but no local deps.
- **Stop-word handling for non-English rows** — current default is "include them in tokens but not in English stop-word filtering". Revisit if non-English share is >10% in any subreddit.
- **Whether the notebook should sample for speed** — at >100k documents, some figures will be slow. Sample to a deterministic 50k slice for figures only, but compute aggregates on the full corpus.

## Out of scope

- Topic modeling (LDA, BERTopic), clustering, classification — all explicitly excluded from this package.
- Sentiment, toxicity, or stance detection.
- Time-series forecasting or anomaly detection on volume/engagement.
- Any export to BI tools, dashboards, or web UIs.

## Verification

The package is complete when:

1. Running the feature script on `data/corpus.parquet` produces `data/features/tokens.parquet` and `data/features/ngrams_top.parquet` and (if toggled) `tfidf.*` / `embeddings.parquet`.
2. Re-running with no changes overwrites those files byte-identically.
3. Opening `notebooks/descriptive.ipynb` and running all cells succeeds end-to-end without manual intervention.
4. The notebook produces every figure listed in § Functional requirements — notebook.
