"""Generate notebooks/descriptive.ipynb.

Usage:
    python scripts/create_notebook.py
"""
from __future__ import annotations

import sys
from pathlib import Path

try:
    import nbformat as nbf
except ImportError:
    sys.exit("nbformat not installed; activate the venv and try again")

REPO_ROOT = Path(__file__).resolve().parent.parent
OUT = REPO_ROOT / "notebooks" / "descriptive.ipynb"

cells: list = []


def md(src: str) -> None:
    cells.append(nbf.v4.new_markdown_cell(src))


def code(src: str) -> None:
    cells.append(nbf.v4.new_code_cell(src))


# ── Title ─────────────────────────────────────────────────────────────────────

md("""\
# Reddit Research — Descriptive Baseline

Package 04 output. Run `python scripts/build_features.py` before executing this notebook.\
""")

# ── Setup ─────────────────────────────────────────────────────────────────────

code("""\
from pathlib import Path

import matplotlib.pyplot as plt
import matplotlib.ticker as ticker
import numpy as np
import pandas as pd

np.random.seed(0)


def _find_root(start: Path) -> Path:
    \"\"\"Walk up until we find the project root (contains config/keywords.yaml).\"\"\"
    for p in [start, *start.parents]:
        if (p / "config" / "keywords.yaml").exists():
            return p
    return start


ROOT = _find_root(Path.cwd())
FEATURES = ROOT / "data" / "features"

df = pd.read_parquet(ROOT / "data" / "corpus.parquet")
ngrams_df = pd.read_parquet(FEATURES / "ngrams_top.parquet")

df["month"] = pd.to_datetime(df["created_utc"], unit="s").dt.to_period("M")
df["body_len"] = df["body_clean"].str.len().fillna(0).astype(int)
df["word_count"] = df["body_clean"].str.split().str.len().fillna(0).astype(int)

SUBS = sorted(df["subreddit"].unique())
print(f"Corpus: {len(df):,} docs across {len(SUBS)} subreddits: {SUBS}")\
""")

# ── 1. Volume ─────────────────────────────────────────────────────────────────

md("## 1. Volume")

code("""\
fig, ax = plt.subplots(figsize=(8, 4))
df.groupby("subreddit").size().sort_values().plot.barh(ax=ax)
ax.set_xlabel("Document count")
ax.set_title("Documents per subreddit")
plt.tight_layout()
plt.show()\
""")

code("""\
fig, axes = plt.subplots(2, 3, figsize=(15, 7), sharey=False)
axes_flat = axes.flatten()
for i, sub in enumerate(SUBS):
    ax = axes_flat[i]
    monthly = df[df["subreddit"] == sub].groupby("month").size()
    ax.plot(monthly.index.to_timestamp(), monthly.values, marker="o", ms=3)
    ax.set_title(f"r/{sub}")
    ax.tick_params(axis="x", rotation=45)
for j in range(len(SUBS), len(axes_flat)):
    axes_flat[j].set_visible(False)
fig.suptitle("Documents per month per subreddit")
plt.tight_layout()
plt.show()\
""")

code("""\
fig, ax = plt.subplots(figsize=(9, 4))
df.groupby(["subreddit", "kind"]).size().unstack(fill_value=0).plot.bar(stacked=True, ax=ax)
ax.set_ylabel("Document count")
ax.set_title("Posts vs comments per subreddit")
ax.tick_params(axis="x", rotation=30)
plt.tight_layout()
plt.show()\
""")

# ── 2. Engagement ─────────────────────────────────────────────────────────────

md("## 2. Engagement")

code("""\
fig, ax = plt.subplots(figsize=(10, 5))
data = [df[df["subreddit"] == s]["score"].values for s in SUBS]
ax.boxplot(data, labels=SUBS, patch_artist=True)
ax.set_yscale("symlog", linthresh=1)
ax.set_ylabel("Score (symlog)")
ax.set_title("Score distribution per subreddit")
plt.tight_layout()
plt.show()\
""")

md("""\
> **`num_comments` note:** this column is absent from the corpus schema, so the figure
> below uses *observed* direct-reply count: the number of comments in the corpus whose
> `parent_id` equals the post's `doc_id`. This underestimates Reddit's reported
> `num_comments` when the crawl was incomplete or when a post has deeply nested threads.\
""")

code("""\
obs_nc = df[df["kind"] == "comment"].groupby("parent_id").size().rename("nc_obs")
posts = df[df["kind"] == "post"].copy()
posts = posts.join(obs_nc, on="doc_id")
posts["nc_obs"] = posts["nc_obs"].fillna(0).astype(int)

fig, ax = plt.subplots(figsize=(10, 5))
data_nc = [posts[posts["subreddit"] == s]["nc_obs"].values for s in SUBS]
ax.boxplot(data_nc, labels=SUBS, patch_artist=True)
ax.set_yscale("symlog", linthresh=1)
ax.set_ylabel("Observed direct-reply count (symlog)")
ax.set_title("Observed comment count per post per subreddit")
plt.tight_layout()
plt.show()\
""")

# ── 3. Authors ────────────────────────────────────────────────────────────────

md("## 3. Authors")

code("""\
top20 = df.groupby("author").size().nlargest(20).sort_values()
fig, ax = plt.subplots(figsize=(10, 5))
top20.plot.barh(ax=ax)
ax.set_xlabel("Document count")
ax.set_title("Top 20 authors by document count (all subreddits)")
plt.tight_layout()
plt.show()\
""")

code("""\
fig, axes = plt.subplots(2, 3, figsize=(18, 10))
axes_flat = axes.flatten()
for i, sub in enumerate(SUBS):
    ax = axes_flat[i]
    top = df[df["subreddit"] == sub].groupby("author").size().nlargest(20).sort_values()
    top.plot.barh(ax=ax)
    ax.set_title(f"r/{sub} — top 20 authors")
    ax.set_xlabel("Docs")
for j in range(len(SUBS), len(axes_flat)):
    axes_flat[j].set_visible(False)
plt.tight_layout()
plt.show()\
""")

code("""\
conc = []
for sub in SUBS:
    sub_counts = df[df["subreddit"] == sub].groupby("author").size().sort_values(ascending=False)
    top10pct_n = max(1, int(len(sub_counts) * 0.1))
    share = sub_counts.iloc[:top10pct_n].sum() / sub_counts.sum()
    conc.append({"subreddit": sub, "share": share})
conc_df = pd.DataFrame(conc)

fig, ax = plt.subplots(figsize=(8, 3))
ax.barh(conc_df["subreddit"], conc_df["share"])
ax.xaxis.set_major_formatter(ticker.PercentFormatter(xmax=1))
ax.set_xlabel("Share of docs from top 10 % of authors")
ax.set_title("Author concentration per subreddit")
plt.tight_layout()
plt.show()\
""")

# ── 4. Length ─────────────────────────────────────────────────────────────────

md("## 4. Length")

code("""\
pairs = [(s, k) for s in SUBS for k in ("post", "comment")]
labels = [f"{s}\\n{k}" for s, k in pairs]
data_len = [df[(df["subreddit"] == s) & (df["kind"] == k)]["body_len"].values for s, k in pairs]

fig, ax = plt.subplots(figsize=(14, 5))
ax.boxplot(data_len, labels=labels, patch_artist=True)
ax.set_yscale("symlog", linthresh=1)
ax.tick_params(axis="x", rotation=45)
ax.set_ylabel("Character length (symlog)")
ax.set_title("body_clean character length by subreddit and kind")
plt.tight_layout()
plt.show()\
""")

code("""\
data_wc = [df[(df["subreddit"] == s) & (df["kind"] == k)]["word_count"].values for s, k in pairs]

fig, ax = plt.subplots(figsize=(14, 5))
ax.boxplot(data_wc, labels=labels, patch_artist=True)
ax.set_yscale("symlog", linthresh=1)
ax.tick_params(axis="x", rotation=45)
ax.set_ylabel("Word count (symlog)")
ax.set_title("body_clean word count by subreddit and kind")
plt.tight_layout()
plt.show()\
""")

# ── 5. Language ───────────────────────────────────────────────────────────────

md("""\
## 5. Language

Uses the **full corpus** (no language filter) to show the non-English tail.\
""")

code("""\
df_all = pd.read_parquet(ROOT / "data" / "corpus.parquet")
lang_shares = (
    df_all.groupby(["subreddit", "lang"]).size()
    .unstack(fill_value=0)
    .pipe(lambda x: x.div(x.sum(axis=1), axis=0))
)
lang_shares.plot.bar(stacked=True, figsize=(10, 5))
plt.ylabel("Share")
plt.title("Language mix per subreddit (full corpus)")
plt.legend(bbox_to_anchor=(1.01, 1), loc="upper left", title="lang")
plt.xticks(rotation=30)
plt.tight_layout()
plt.show()\
""")

# ── 6. Lexical ────────────────────────────────────────────────────────────────

md("""\
## 6. Lexical

Top 30 unigrams and bigrams per subreddit after English stop-word removal.
Loaded from `data/features/ngrams_top.parquet`.\
""")

code("""\
fig, axes = plt.subplots(2, 3, figsize=(18, 10))
axes_flat = axes.flatten()
for i, sub in enumerate(SUBS):
    ax = axes_flat[i]
    top30 = (
        ngrams_df[
            (ngrams_df["subreddit"] == sub)
            & (ngrams_df["n"] == 1)
            & (ngrams_df["subreddit_count"] <= 30)
        ]
        .sort_values("subreddit_count", ascending=False)
    )
    ax.barh(top30["ngram"], top30["count"])
    ax.set_title(f"r/{sub} — top 30 unigrams")
    ax.set_xlabel("Count")
for j in range(len(SUBS), len(axes_flat)):
    axes_flat[j].set_visible(False)
plt.suptitle("Top 30 unigrams per subreddit (EN, stop-words removed)")
plt.tight_layout()
plt.show()\
""")

code("""\
fig, axes = plt.subplots(2, 3, figsize=(18, 10))
axes_flat = axes.flatten()
for i, sub in enumerate(SUBS):
    ax = axes_flat[i]
    top30 = (
        ngrams_df[
            (ngrams_df["subreddit"] == sub)
            & (ngrams_df["n"] == 2)
            & (ngrams_df["subreddit_count"] <= 30)
        ]
        .sort_values("subreddit_count", ascending=False)
    )
    ax.barh(top30["ngram"], top30["count"])
    ax.set_title(f"r/{sub} — top 30 bigrams")
    ax.set_xlabel("Count")
for j in range(len(SUBS), len(axes_flat)):
    axes_flat[j].set_visible(False)
plt.suptitle("Top 30 bigrams per subreddit (EN, stop-words removed)")
plt.tight_layout()
plt.show()\
""")

# ── Write notebook ────────────────────────────────────────────────────────────

nb = nbf.v4.new_notebook()
nb["cells"] = cells
nb["metadata"]["kernelspec"] = {
    "display_name": "Python 3",
    "language": "python",
    "name": "python3",
}

OUT.parent.mkdir(parents=True, exist_ok=True)
with OUT.open("w", encoding="utf-8") as f:
    nbf.write(nb, f)

print(f"Wrote {len(cells)} cells → {OUT}")
