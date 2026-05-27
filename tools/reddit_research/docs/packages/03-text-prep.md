# Package 03 — Text Preparation

> Read this alongside `../REQUIREMENTS.md`. Do not consult other package files.

## Goal

Flatten the per-post JSON files produced by the crawl into a single tidy text corpus suitable for descriptive analysis and NLP feature extraction.

## Input

`data/raw/{subreddit}/{post_id}.json` — see schema in `REQUIREMENTS.md` § Cross-package contracts. Treat this directory as read-only.

## Output

`data/corpus.parquet` — see schema in `REQUIREMENTS.md` § Cross-package contracts.

One row per **document**, where a document is either:
- a post: `kind="post"`, `title` filled, `body` = `selftext`, `doc_id = "t3_" + post.id`
- a comment: `kind="comment"`, `title` empty, `body` = comment body, `doc_id = "t1_" + comment.id`

## Functional requirements

1. **Iteration** — walk `data/raw/**/*.json`. Skip files that fail to parse and log them; do not abort the whole run.

2. **Field mapping** — straightforward copy from raw JSON to corpus columns. `created_utc` is the integer seconds; `score` is the integer score at fetch time.

3. **Filtering** — drop rows where any of the following hold:
   - `author == "[deleted]"`, OR
   - `body` ∈ {`"[deleted]"`, `"[removed]"`} **and** (`kind == "comment"` or `title` is empty).
     A post whose body is `[removed]` but has a meaningful title is kept (the title is still data).
   - `body_clean` is empty after cleanup, and there is no title.

4. **Cleanup → `body_clean`** — keep the original `body` untouched; produce `body_clean` by:
   - Strip Reddit markdown emphasis (`**`, `*`, `_`, `~~`).
   - Strip block quotes (lines starting with `>`).
   - Replace URLs (`http(s)://...`) with the empty string.
   - Replace Markdown links `[text](url)` with `text`.
   - Collapse runs of whitespace to a single space; trim.
   - Leave punctuation, capitalization, emoji, and code blocks intact.

5. **Language detection** — populate `lang` with an ISO 639-1 code. Use a lightweight detector (e.g. `langdetect`, `fastText lid.176`, or `lingua`). Bodies under 20 characters get `lang = "und"`.

6. **Near-duplicate detection** — within the same subreddit, drop comments whose `body_clean` is a byte-for-byte duplicate of one already kept (keeps the earliest by `created_utc`). Cross-subreddit duplicates are kept — they're informative.

7. **Determinism** — given the same `data/raw/`, the resulting parquet must be byte-identical across runs. Sort rows by `(subreddit, created_utc, doc_id)` before writing.

## Non-functional requirements

- Single pass over disk where possible. The full corpus may be tens of GB of raw JSON; do not load it all into memory.
- Write parquet with `pyarrow`; default compression is `zstd`.
- The script must be re-runnable safely — overwriting `corpus.parquet` is fine, no merging required.

## Open questions for the implementing conversation

- **Stemming / lemmatization** — defer to package 04. Keep `body_clean` linguistically faithful here.
- **Code blocks** — left intact by default. If exploratory analysis shows they dominate certain subs, revisit.
- **Whether to keep `[removed]` posts whose title is the data** — default yes (as specified above). Tightening to "drop everything `[removed]`" is fine if it simplifies downstream analysis; document the choice.
- **Language detector choice** — `langdetect` is fast and pure-Python; `fastText` is more accurate but adds a binary dep. Pick one and pin it.

## Out of scope

- Tokenization, n-gram extraction, TF-IDF, embeddings — package 04.
- Joining post + comment trees into threaded conversation strings — 04 can do that on demand from `parent_id`.
- Removing stop words. `body_clean` stays human-readable.

## Verification

The package is complete when:

1. Running on a fixed `data/raw/` snapshot twice produces byte-identical `data/corpus.parquet`.
2. `pd.read_parquet("data/corpus.parquet").columns` exactly matches the contract.
3. A spot check on 20 random rows shows `body_clean` is free of Markdown noise and URLs.
4. No row has `author == "[deleted]"`.
