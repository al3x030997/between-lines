"""Step 5 — Render top threads per flair into a single merged markdown.

For each analytical flair, picks three lists of threads and renders each as
`post → top comments` conversation blocks. Output is one consolidated file
with a methodology preamble and a per-flair table of contents:

  1. Most-discussed threads    — by n_comments × max_comment_score × |post_vader|
  2. Confident-negative threads — pain points the community validated
  3. Threads with competitor talk — switching narratives and named alternatives

Reads:
  data/thread_descriptives.parquet
  data/comments_scored.parquet
  data/sentiment_descriptives.parquet
  data/corpus_wattpad_full.parquet  (post bodies)

Writes:
  analysis/findings/top_threads.md  — single merged document

Usage:
    python analysis/render_top_threads.py
"""
from __future__ import annotations

import math
import re
import sys
from datetime import date
from pathlib import Path

import pandas as pd

REPO_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO_ROOT / "src"))
from scope import ANALYTICAL_DROP_FLAIRS  # noqa: E402

THREADS = REPO_ROOT / "data" / "thread_descriptives.parquet"
COMMENTS = REPO_ROOT / "data" / "comments_scored.parquet"
SD = REPO_ROOT / "data" / "sentiment_descriptives.parquet"
CORPUS = REPO_ROOT / "data" / "corpus_wattpad_full.parquet"
OUT = REPO_ROOT / "analysis" / "findings" / "top_threads.md"

N_MOST_DISCUSSED = 10
N_CONFIDENT_NEG = 10
N_COMPETITOR = 8
N_TOP_COMMENTS_PER_THREAD = 5
POST_PREVIEW_CHARS = 400
COMMENT_PREVIEW_CHARS = 250

# Order flairs by pain density so the most-actionable sections come first.
FLAIR_ORDER = [
    "General Help",
    "Off-Topic",
    "Other",
    "Looking For: Feedback",
    "Looking For: Recommendations",
    "Looking For: Read for Read",
    "Looking For: R4R/V4V/C4C/F4F",
    "Services",
]


def slug(flair: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", flair.lower()).strip("-")


def discussion_score(row: pd.Series) -> float:
    return (math.log1p(row["n_comments"]) *
            math.log1p(max(row["max_comment_score"], 1)) *
            (0.5 + abs(row.get("post_vader") or 0)))


def render_comment(c: pd.Series) -> str:
    body = (c.get("body") or "").strip().replace("\n\n", "\n").replace("\n", "\n  ")
    if len(body) > COMMENT_PREVIEW_CHARS:
        body = body[:COMMENT_PREVIEW_CHARS].rstrip() + "…"
    sent = c.get("vader_compound")
    sent_tag = ""
    if pd.notna(sent):
        if sent > 0.05:
            sent_tag = " 🟢"
        elif sent < -0.05:
            sent_tag = " 🔴"
        else:
            sent_tag = " ⚪"
    author = c.get("author") or "[deleted]"
    score = int(c.get("comment_score") or 0)
    return f"- **↑ {score}** · *{author}*{sent_tag}\n  > {body}"


def render_thread(post: pd.Series, comments: pd.DataFrame, body_map: dict[str, str]) -> str:
    title = (post.get("post_title") or "(no title)").strip()
    post_body = body_map.get(post["post_id"], "").strip()
    if len(post_body) > POST_PREVIEW_CHARS:
        post_body = post_body[:POST_PREVIEW_CHARS].rstrip() + "…"
    elif not post_body:
        post_body = "_(no body)_"

    pv = post.get("post_vader")
    pv_str = f"{pv:+.2f}" if pd.notna(pv) else "n/a"
    t3 = post.get("top3_mean_vader")
    t3_str = f"{t3:+.2f}" if pd.notna(t3) else "n/a"
    cneg = post.get("consensus_neg")
    cneg_str = f"{cneg:.0%}" if pd.notna(cneg) else "n/a"

    header = f"#### {title}"
    meta = (f"`{post['post_id']}` · post ↑ {int(post['post_score'] or 0)} · "
            f"{int(post['n_comments'])} comments · "
            f"post sentiment {pv_str} · top-3 comments {t3_str} · "
            f"% negative comments {cneg_str}")
    flags = []
    if post.get("confident_negative"):
        flags.append("🔴 **confident negative**")
    if int(post.get("n_competitor_mentions") or 0) > 0:
        flags.append(f"🔁 {int(post['n_competitor_mentions'])} competitor mentions")
    if int(post.get("n_switching") or 0) > 0:
        flags.append(f"🚪 {int(post['n_switching'])} switching-language")
    flag_line = " · ".join(flags)

    post_block = f"> {post_body.replace(chr(10) + chr(10), chr(10)).replace(chr(10), chr(10) + '> ')}"

    if comments.empty:
        comments_block = "_(no comments)_"
    else:
        top = comments.nlargest(N_TOP_COMMENTS_PER_THREAD, "comment_score")
        lines = [render_comment(r) for _, r in top.iterrows()]
        comments_block = "\n".join(lines)

    parts = [header, meta]
    if flag_line:
        parts.append(flag_line)
    parts.extend(["", post_block, "", f"**Top {N_TOP_COMMENTS_PER_THREAD} comments:**", "", comments_block])
    return "\n".join(parts)


def render_flair_section(flair: str, td: pd.DataFrame, cs: pd.DataFrame, body_map: dict[str, str]) -> str:
    sub = td[td["flair"] == flair].copy()
    sub_with_comments = sub[sub["n_comments"] > 0]
    n_threads = len(sub)
    n_with = len(sub_with_comments)
    n_confident = int(sub["confident_negative"].sum())
    n_competitor = int((sub["n_competitor_mentions"] > 0).sum())

    lines = []
    lines.append(f"## {flair}")
    lines.append("")
    lines.append(f"_{n_threads} posts in scope · {n_with} have at least one comment · "
                 f"{n_confident} flagged confident-negative · "
                 f"{n_competitor} mention a competitor platform._")
    lines.append("")

    md = sub_with_comments.copy()
    md["_discussion_score"] = md.apply(discussion_score, axis=1)
    md = md.nlargest(N_MOST_DISCUSSED, "_discussion_score")
    lines.append(f"### {flair} — 1. Most-discussed threads (top {len(md)})")
    lines.append("")
    for _, p in md.iterrows():
        cs_thread = cs[cs["post_id"] == p["post_id"]]
        lines.append(render_thread(p, cs_thread, body_map))
        lines.append("\n---\n")

    cn = sub[sub["confident_negative"]].copy()
    cn = cn.sort_values(["consensus_neg", "n_comments"], ascending=[False, False]).head(N_CONFIDENT_NEG)
    lines.append(f"### {flair} — 2. Confident-negative threads ({len(cn)} found)")
    lines.append("")
    if cn.empty:
        lines.append("_No threads in this flair crossed the confident-negative bar._")
        lines.append("")
    else:
        for _, p in cn.iterrows():
            cs_thread = cs[cs["post_id"] == p["post_id"]]
            lines.append(render_thread(p, cs_thread, body_map))
            lines.append("\n---\n")

    comp = sub[sub["n_competitor_mentions"] > 0].copy()
    comp = comp.sort_values(["n_competitor_mentions", "n_comments"], ascending=False).head(N_COMPETITOR)
    lines.append(f"### {flair} — 3. Threads with competitor talk (top {len(comp)} of {n_competitor})")
    lines.append("")
    if comp.empty:
        lines.append("_No threads in this flair mention named competitors._")
        lines.append("")
    else:
        for _, p in comp.iterrows():
            cs_thread = cs[cs["post_id"] == p["post_id"]]
            lines.append(render_thread(p, cs_thread, body_map))
            lines.append("\n---\n")

    return "\n".join(lines)


def _img(filename: str, alt: str, width: int = 760) -> str:
    """Standard markdown image embed. Path is relative to top_threads.md.
    Markdown syntax is more universally supported than HTML <img> tags."""
    return (f'![{alt}]({filename})\n\n'
            f'*[Chart: `analysis/findings/{filename}`]*\n')


def render_preamble(td: pd.DataFrame) -> str:
    n_threads = len(td)
    n_with = int((td["n_comments"] > 0).sum())
    n_confident = int(td["confident_negative"].sum())
    n_competitor = int((td["n_competitor_mentions"] > 0).sum())

    return f"""# Top threads — r/Wattpad analysis

_Generated {date.today().isoformat()} from `data/thread_descriptives.parquet`._

_Corpus: {n_threads:,} platform-discussion threads (post + every comment beneath, parent-chain resolved) from r/Wattpad over the last 2 years, after dropping 4 structurally-positive flairs (Weekly Promotion, Monthly Discussion, Announcement, Milestone)._

_{n_with:,} threads have at least one comment · {n_confident:,} are confident-negative · {n_competitor:,} have a competitor mention in the comments._

### Where the pain lives

{_img("18_confident_negative_by_flair.png", "Confident-negative threads by flair")}

Pain concentrates in two flairs: **General Help** and **Off-Topic** both flag ~5.7% of their threads as confident-negative. The other six flairs are essentially clean (≤1.4%). Read those two flair sections first.

### How conversational each flair is

{_img("21_comments_per_post_by_flair.png", "Comments per post by flair")}

Off-Topic, Read-for-Read, and R4R run the longest conversations (median 10-11 comments). Feedback and Services are quieter (median 4). Sets the right baseline for what "engagement" means in each flair section below.

---

## How threads were selected

For each of the 8 analytical flairs, three lists are surfaced. Each answers a different product question.

### 1. Most-discussed threads (top {N_MOST_DISCUSSED} per flair)

**Goal:** "Where did the community actually show up?"

**Quality score:**

```
quality = log(1 + n_comments) × log(1 + max_comment_score) × (|post_vader| + 0.5)
```

Three factors multiplied:

- **`log(1 + n_comments)`** — conversation volume. Logged so a 200-comment thread isn't 100× a 2-comment thread; the difference compresses.
- **`log(1 + max_comment_score)`** — peak endorsement. The strongest single comment matters more than total volume (a thread with one 100-upvote comment beats one with twenty 5-upvote ones).
- **`|post_vader| + 0.5`** — opinion strength. Calm threads get the floor; opinionated threads (positive or negative) rise. A thread where the OP has a strong view tends to attract a real conversation.

### 2. Confident-negative threads (top {N_CONFIDENT_NEG} per flair)

**Goal:** "Where do we have community-validated pain?"

**Filter (two signals must agree):**

```
post_vader < −0.2          # OP is clearly negative on title + body
AND
top3_mean_vader < −0.1     # mean VADER of the top-3 highest-scored comments is also negative
```

Both signals are required. This filters out:

- **Lone rants** — negative post but comments push back ("you're overreacting"). Not a community problem.
- **Sarcastic-positive bait** — positive-sounding post that's actually upset. Edge case but exists.
- **Mild venting** — only post is negative, comments are neutral chit-chat.

Within the filtered set, threads are sorted by `consensus_neg` (the fraction of all comments with VADER < −0.05), then by comment count. Threads near the top are the ones where both the OP and the community agreed something is wrong.

{_img("19_post_vs_top3_sentiment.png", "Post sentiment vs. top-3 comment sentiment scatter")}

Every dot is one thread. The dashed diagonal is where post and comments agree. **Below the diagonal = comments are more negative than the post** (a smoldering issue the OP under-stated). The lower-left quadrant is the confident-negative zone — what this filter surfaces.

### 3. Threads with competitor talk (top {N_COMPETITOR} per flair)

**Goal:** "Where are users actually naming alternatives?"

**Filter:** at least one comment in the thread mentions one of 11 tracked platforms via regex on canonical names and aliases (case-insensitive): AO3 (incl. `archiveofourown`), Royal Road, Inkitt, Substack, Patreon, Tapas, Webnovel, Radish, Kindle Vella, fanfiction.net (incl. `ffn`, `ff.net`), Wattpad (self-references).

Ranked by total competitor-mention count in the thread, then by comment count. Comments mention competitors at 2× the rate posts do — switching narratives concentrate here.

{_img("22_competitor_mentions_in_comments.png", "Competitor mentions in comments by platform")}

AO3 dominates by a wide margin; Royal Road, Inkitt, and fanfiction.net follow. Bar color = mean VADER on comments where only that platform is named (single-mention sentences only, to avoid co-mention contamination).

### What each thread shows

For every selected thread:

- **Header line:** `post_id` · post ↑ score · n comments · post sentiment · top-3 comment sentiment · % negative comments
- **Flag line** (when applicable): 🔴 confident-negative, 🔁 N competitor mentions, 🚪 N switching-language comments (verbs like *moved*, *switching*, *quitting* + direction)
- **Post body:** up to {POST_PREVIEW_CHARS} characters
- **Top {N_TOP_COMMENTS_PER_THREAD} comments by score:** each with score, author, sentiment marker (🟢 positive · ⚪ neutral · 🔴 negative), up to {COMMENT_PREVIEW_CHARS} characters of body

### Notes on the underlying signals

- **VADER** is a lexicon-based sentiment scorer (range −1 to +1). Standard thresholds: > 0.05 positive, < −0.05 negative. Used here for *ranking and filtering*, not as ground truth on individual comments — see `analysis/findings/vader_validation.md` for spot-check results once labels are in.
- **consensus_neg** = fraction of English comments in the thread with VADER < −0.05. A blunt "how loud is the negative chorus" measure.
- **top3_mean_vader** uses the three highest-scored English comments. Captures the *endorsed* sentiment, not the loudest single voice.
- **Comments per thread are parent-chain resolved** — depth-N replies count as part of their root post's thread. Comments whose chain was broken by deleted ancestors are excluded.
- **Flair-drop reasoning:** Weekly Promotion / Monthly Discussion / Announcement / Milestone are excluded from sentiment analyses because they're structurally positive by design (mod megathreads, celebration posts).
"""


def render_toc(flairs: list[str], counts: dict[str, dict]) -> str:
    lines = ["## Table of contents", ""]
    lines.append("| Flair | Threads | With comments | Confident-neg | With competitor |")
    lines.append("|---|---:|---:|---:|---:|")
    for f in flairs:
        c = counts[f]
        anchor = slug(f)
        lines.append(f"| [{f}](#{anchor}) | {c['n_threads']} | "
                     f"{c['n_with_comments']} | {c['n_confident_negative']} | "
                     f"{c['n_with_competitor']} |")
    lines.append("")
    return "\n".join(lines)


def main() -> int:
    td = pd.read_parquet(THREADS)
    cs = pd.read_parquet(COMMENTS)
    print(f"loaded {len(td):,} threads, {len(cs):,} comments")

    body_map = (
        pd.read_parquet(CORPUS, columns=["doc_id", "kind", "body_clean"])
          .query('kind == "post"')
          .drop_duplicates(subset="doc_id", keep="last")
          .set_index("doc_id")["body_clean"]
          .fillna("")
          .to_dict()
    )

    flairs_in_data = set(td["flair"].dropna().unique())
    flairs = [f for f in FLAIR_ORDER if f in flairs_in_data and f not in ANALYTICAL_DROP_FLAIRS]
    # If any new flair shows up that's not in FLAIR_ORDER, append it to the end.
    for f in sorted(flairs_in_data):
        if f not in flairs and f not in ANALYTICAL_DROP_FLAIRS:
            flairs.append(f)

    counts = {}
    for f in flairs:
        sub = td[td["flair"] == f]
        counts[f] = {
            "n_threads":            len(sub),
            "n_with_comments":      int((sub["n_comments"] > 0).sum()),
            "n_confident_negative": int(sub["confident_negative"].sum()),
            "n_with_competitor":    int((sub["n_competitor_mentions"] > 0).sum()),
        }

    parts = [render_preamble(td), "", render_toc(flairs, counts), "---", ""]
    for f in flairs:
        parts.append(render_flair_section(f, td, cs, body_map))
        parts.append("\n")

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text("\n".join(parts))
    print(f"wrote {OUT.relative_to(REPO_ROOT)}")
    print(f"  flairs rendered: {len(flairs)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
