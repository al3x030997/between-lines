"""Comprehensive findings report — all 22 charts + top threads per flair.

Builds analysis/findings/findings_report_final.md, the canonical end-to-end
document for the r/Wattpad NLP analysis. Reuses the thread-rendering helpers
from analysis/render_top_threads.py.

Sections:
  A. Corpus and flair landscape          (charts 01-04)
  B. Post-level sentiment                (charts 05-09)
  C. Aspect-level pain — Pass 1          (charts 10-11)
  D. Aspect-level pain — Pass 2 (ABSA)   (charts 12-16)
  E. Competitor mentions in posts        (chart 17)
  F. Thread-level analysis               (charts 18-22)
  G. How threads were selected           (methodology)
  H. Top threads per flair               (8 sections, 3 lists each)

Reads:
  data/thread_descriptives.parquet
  data/comments_scored.parquet
  data/sentiment_descriptives.parquet
  data/corpus_wattpad_full.parquet

Writes:
  analysis/findings/findings_report_final.md

Usage:
    python analysis/render_findings_report.py
"""
from __future__ import annotations

import sys
from datetime import date
from pathlib import Path

import pandas as pd

REPO_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(REPO_ROOT / "analysis"))
sys.path.insert(0, str(REPO_ROOT / "src"))
from render_top_threads import (  # noqa: E402
    FLAIR_ORDER, render_flair_section, slug,
    N_MOST_DISCUSSED, N_CONFIDENT_NEG, N_COMPETITOR,
    N_TOP_COMMENTS_PER_THREAD, POST_PREVIEW_CHARS, COMMENT_PREVIEW_CHARS,
)
from scope import ANALYTICAL_DROP_FLAIRS  # noqa: E402

THREADS = REPO_ROOT / "data" / "thread_descriptives.parquet"
COMMENTS = REPO_ROOT / "data" / "comments_scored.parquet"
CORPUS = REPO_ROOT / "data" / "corpus_wattpad_full.parquet"
OUT = REPO_ROOT / "analysis" / "findings" / "findings_report_final.md"


def img(filename: str, alt: str, width: int = 760) -> str:
    # Standard markdown image syntax is the most universally supported across
    # viewers (GitHub, VS Code, Typora, Obsidian, MacDown, WebSumo, etc).
    # HTML <img> tags with relative paths fail in some viewers' sandboxes.
    return (f'![{alt}]({filename})\n\n'
            f'*[Chart: `analysis/findings/{filename}`]*\n')


# ----------------------------------------------------------------------------
# Chart catalogue — what each chart shows and what we learned from it
# ----------------------------------------------------------------------------

CHARTS = [
    # ---- Section A — Corpus and flair landscape ----
    {
        "id": "01", "section": "A",
        "title": "Flair distribution (in scope, last 2 years)",
        "filename": "01_flair_distribution_scope.png",
        "what_it_shows": (
            "Bar chart of post counts per flair across the 12 platform-discussion flairs in scope, "
            "filtered to the last 24 months. Genre tags, memes, and the *Looking For: Lost Books* flair "
            "are excluded — they don't carry product signal."
        ),
        "what_we_learned": (
            "Looking-For flairs (Feedback, Recommendations, Read-for-Read, R4R) plus General Help and "
            "Off-Topic dominate the in-scope corpus. These are the eight analytical flairs we'll spend the "
            "rest of the report on. **Read-for-Read and R4R/V4V/C4C/F4F are essentially the same activity** "
            "(story-trade marketplace) split across two flair conventions — worth noting if you compare them."
        ),
    },
    {
        "id": "02", "section": "A",
        "title": "Flair distribution (all time)",
        "filename": "02_flair_distribution_alltime.png",
        "what_it_shows": (
            "Same chart as #01 but without the 2-year filter — every post in the corpus regardless of when "
            "it was made. Sanity-check that the 2-year window didn't introduce a structural shift."
        ),
        "what_we_learned": (
            "The ordering and rough proportions match the 2-year view. The 2-year window is not introducing "
            "selection bias — the in-scope dataset is representative. Also surfaces a few deprecated flairs "
            "with stale historical posts (e.g. *Help*, *Media*) that the sub no longer uses, which is why "
            "they were dropped from `KEEP_FLAIRS` on 2026-05-18."
        ),
    },
    {
        "id": "03", "section": "A",
        "title": "Median upvotes per flair",
        "filename": "03_flair_median_upvotes.png",
        "what_it_shows": (
            "Median upvote score per post within each flair. Median (not mean) so a single viral post "
            "doesn't distort the comparison."
        ),
        "what_we_learned": (
            "General Help and Off-Topic posts carry the highest median upvotes — they generate posts that "
            "the community endorses. R4R-style flairs have the lowest medians (transactional, low resonance). "
            "**Practical implication:** the flairs where the community actually votes are also where strategic "
            "product signal concentrates."
        ),
    },
    {
        "id": "04", "section": "A",
        "title": "Median comments per flair",
        "filename": "04_flair_median_comments.png",
        "what_it_shows": "Median comment count per post for each flair.",
        "what_we_learned": (
            "Off-Topic and Read-for-Read top the comment-count chart — they're conversational flairs. "
            "Looking-For: Feedback is much quieter (people drop work, fewer reply with substance). "
            "This early signal shaped the choice to deepdive into General Help and Off-Topic later "
            "in the thread-level analysis."
        ),
    },

    # ---- Section B — Post-level sentiment ----
    {
        "id": "05", "section": "B",
        "title": "Mean sentiment per flair (VADER)",
        "filename": "05_sentiment_by_flair.png",
        "what_it_shows": (
            "Mean VADER compound score per flair, computed on post title + body. VADER range is "
            "−1 (very negative) to +1 (very positive); standard thresholds are >0.05 positive, "
            "<−0.05 negative."
        ),
        "what_we_learned": (
            "**Every flair scores net positive at the post level.** This is the chart that exposed why "
            "post-level sentiment alone is inadequate: it averages across multiple aspects within a post "
            "(\"I love covers but the algorithm is broken\" → near-neutral) and across structurally-positive "
            "drive-by posts (Read-for-Read self-promotions). Motivated the move to aspect-level (ABSA) and "
            "thread-level (top-3 comments) signals."
        ),
    },
    {
        "id": "06", "section": "B",
        "title": "Sentiment distribution per flair (boxplot)",
        "filename": "06_sentiment_distribution_by_flair.png",
        "what_it_shows": (
            "Full distribution of post-level VADER compound scores within each flair. Box = inter-quartile "
            "range, line = median, whiskers = 10/90th percentile."
        ),
        "what_we_learned": (
            "The medians are all positive; the lower tails extend into negative territory but only modestly. "
            "Even the lower whisker for General Help (the most pain-rich flair) is around −0.4, not −0.9. "
            "Confirms that post-only VADER systematically *under-counts* pain because the post-author is "
            "still trying to be measured in their framing."
        ),
    },
    {
        "id": "07", "section": "B",
        "title": "Sentiment class mix per flair",
        "filename": "07_sentiment_class_mix_by_flair.png",
        "what_it_shows": (
            "Stacked bar showing the fraction of posts in each VADER class (positive / neutral / negative) "
            "per flair, using the standard ±0.05 thresholds."
        ),
        "what_we_learned": (
            "Even General Help — which the thread-level analysis later reveals is the most pain-heavy flair — "
            "looks ~63% positive at the post level. **This is the single most important chart for understanding "
            "why post-only sentiment is misleading.** It justifies the entire downstream investment in ABSA "
            "and thread-level analysis."
        ),
    },
    {
        "id": "08", "section": "B",
        "title": "Sentiment weighted by upvote vs. unweighted",
        "filename": "08_sentiment_weighted_vs_unweighted.png",
        "what_it_shows": (
            "Comparison of mean VADER per flair using post score as a weight vs. equal weight per post. "
            "Tests whether the high-engagement posts skew the corpus average."
        ),
        "what_we_learned": (
            "Score-weighting barely shifts the picture. High-upvote posts have roughly the same sentiment "
            "distribution as the corpus average. **The post-averaging problem cannot be fixed by re-weighting** "
            "— a structurally different signal layer (aspect-level, thread-level) was the only way forward."
        ),
    },
    {
        "id": "09", "section": "B",
        "title": "Sentiment vs. post score (scatter)",
        "filename": "09_sentiment_vs_score.png",
        "what_it_shows": (
            "Every post as one dot, x = VADER compound, y = upvote score. Tests whether sentiment "
            "predicts engagement."
        ),
        "what_we_learned": (
            "Effectively no correlation. High-upvote posts span the full sentiment range. **Reddit upvotes "
            "reward resonance, not positivity.** A furious-but-true rant about a real problem accumulates "
            "upvotes at the same rate as a heartfelt celebration. This means upvote count is a useful "
            "consensus signal but *not* a sentiment signal — they're independent dimensions."
        ),
    },

    # ---- Section C — Aspect-level pain — Pass 1 ----
    {
        "id": "10", "section": "C",
        "title": "Top aspects by frequency (Pass 1, noun chunks)",
        "filename": "10_top_aspects_frequency_pass1.png",
        "what_it_shows": (
            "First-pass aspect extraction: spaCy noun-chunk parsing + lemmatization + frequency counting "
            "across all in-scope posts. Top 30 aspects shown. No sentiment yet — pure occurrence count."
        ),
        "what_we_learned": (
            "The raw top aspects skew generic — \"book\", \"story\", \"person\", \"thing\" lead the list. "
            "Noun-chunk frequency alone is **not enough** to surface product-relevant pain. Drove the human "
            "curation step that filtered 1,233 raw aspects down to 71 keepers in `aspects_curated_keep.csv`."
        ),
    },
    {
        "id": "11", "section": "C",
        "title": "Top aspects by pain (Pass 1)",
        "filename": "11_top_aspects_pain_pass1.png",
        "what_it_shows": (
            "Pass 1 aspects re-ranked by a pain score = frequency × negative-context fraction. Negative "
            "context is approximated by VADER on a ±5-token window around each aspect mention."
        ),
        "what_we_learned": (
            "First clue that **account / email / notification / message form a single identity-pain cluster**. "
            "Crude method (post-level VADER on a small window misses real opinion structure) but pointed us "
            "toward which aspects to re-score with the proper ABSA model in Pass 2. The cheap method earned "
            "its keep as a screening pass."
        ),
    },

    # ---- Section D — Aspect-level pain — Pass 2 (ABSA) ----
    {
        "id": "12", "section": "D",
        "title": "ABSA top pain aspects",
        "filename": "12_absa_top_pain.png",
        "what_it_shows": (
            "Aspect-level negative-share ranking from DeBERTa-v3-base-absa-v1.1 fine-tuned on SemEval. "
            "Scored at the (sentence, aspect) pair level on every sentence containing the aspect (or a synonym). "
            "Pain score = n × pct_neg. 3,678 ABSA rows × 71 aspects × 1,011 posts."
        ),
        "what_we_learned": (
            "**The loudest negative aspects:** `scam` (96% neg), `email` (65% neg), `notification` (62% neg), "
            "`algorithm` (54% neg), `account` (46% neg), `tag` (41% neg), `app` (38% neg). "
            "The identity/inbox cluster (account + email + notification + message) is the loudest *quiet* pain — "
            "none of these aspects make headlines but they're systematically negative wherever discussed. "
            "Algorithm is the loudest *loud* pain — both high-frequency and high-negativity."
        ),
    },
    {
        "id": "13", "section": "D",
        "title": "ABSA top praised aspects",
        "filename": "13_absa_top_praised.png",
        "what_it_shows": "Same model, ranked by praise score = n × pct_pos.",
        "what_we_learned": (
            "Praise clusters around community and creative aspects: `cover`, `story`, `character`, "
            "`feedback`, `beta reader`, `chapter`. **The platform itself rarely shows up in top-praise; the "
            "*community on the platform* does.** Useful framing for competitor strategy: users love what "
            "they bring to the platform, not what the platform brings to them."
        ),
    },
    {
        "id": "14", "section": "D",
        "title": "ABSA sentiment mix per aspect (stacked)",
        "filename": "14_absa_sentiment_mix.png",
        "what_it_shows": (
            "For the top 20 aspects by frequency, a stacked horizontal bar showing the fraction of "
            "positive / neutral / negative ABSA labels."
        ),
        "what_we_learned": (
            "Visualizes the spread: most aspects sit in a 30–60% positive band, but the pain aspects "
            "(`scam`, `notification`, `email`, `algorithm`) stand out as ≥50% negative. Single chart that "
            "makes pain magnitude comparable across aspects without losing visibility into volume."
        ),
    },
    {
        "id": "15", "section": "D",
        "title": "ABSA breakdown by aspect category",
        "filename": "15_absa_category_breakdown.png",
        "what_it_shows": (
            "Aggregated sentiment by aspect category, where each of the 71 aspects was hand-labeled in the "
            "curation step as one of: `platform_feature`, `discovery`, `monetization`, `community`, `service`, "
            "`competitor`, or `generic`."
        ),
        "what_we_learned": (
            "**Platform_feature and discovery are the most negative categories** on average; community and "
            "service the most positive. The competitive narrative writes itself: *the product (platform itself) "
            "loses; the social ecosystem built on top of it wins.* A competitor platform that solves the "
            "platform-side pain while preserving community dynamics has a clear value proposition."
        ),
    },
    {
        "id": "16", "section": "D",
        "title": "ABSA vs. Pass 1 noun-chunk pain",
        "filename": "16_absa_vs_pass1.png",
        "what_it_shows": (
            "Log-log scatter comparing Pass 1 noun-chunk pain rank against Pass 2 ABSA pain rank, one dot per "
            "aspect. Diagonal = perfect agreement between the two methods."
        ),
        "what_we_learned": (
            "Strong overall correlation — the cheap and expensive methods broadly agree on which aspects are "
            "painful. **ABSA shifts magnitudes**, though: a few aspects that Pass 1 ranked high (because they "
            "appear in negative-context posts often) drop when scored at the (sentence × aspect) level. "
            "Validates ABSA as the more accurate approach without invalidating Pass 1 as a cheap screening tool — "
            "future work can use Pass 1 to short-list and ABSA to finalize."
        ),
    },

    # ---- Section E — Competitor mentions in posts ----
    {
        "id": "17", "section": "E",
        "title": "Competitor mentions in posts",
        "filename": "17_competitor_mentions.png",
        "what_it_shows": (
            "Counts of mentions for 11 tracked platforms in post titles + bodies, ranked by total count, "
            "colored by the mean VADER score of sentences where only that platform is named. Detection by "
            "regex over canonical names and aliases."
        ),
        "what_we_learned": (
            "AO3 leads (~83 mentions), then Royal Road, fanfiction.net, Inkitt, and Substack. **The sentiment "
            "colors are mostly neutral to mildly positive** — at the post level, competitors are referenced "
            "more as factual alternatives than as praise or criticism. Switching narratives don't surface "
            "here at the volume one would expect. **Chart 22 shows where they actually live.**"
        ),
    },

    # ---- Section F — Thread-level analysis ----
    {
        "id": "18", "section": "F",
        "title": "Confident-negative threads by flair",
        "filename": "18_confident_negative_by_flair.png",
        "what_it_shows": (
            "Percentage of threads in each flair flagged as confident-negative — meaning post VADER < −0.2 "
            "**and** mean VADER of the top-3 highest-scored comments < −0.1. Two-signal agreement. "
            "Filters out lone rants where comments push back."
        ),
        "what_we_learned": (
            "**Pain is concentrated, not diffuse.** Two of eight flairs carry essentially all of the "
            "community-validated pain: General Help (5.7%) and Off-Topic (5.7%). R4R has zero confident-negative "
            "threads. This is the chart that tells a product team where to focus reading time. The other six "
            "flairs are either positive (Services, Looking-For: Read for Read) or transactional (R4R)."
        ),
    },
    {
        "id": "19", "section": "F",
        "title": "Post sentiment vs. top-3 comment sentiment scatter",
        "filename": "19_post_vs_top3_sentiment.png",
        "what_it_shows": (
            "Every thread (n=1,133 with ≥1 comment) plotted as one dot. X = post VADER, Y = mean VADER of "
            "top-3 most-upvoted comments. Diagonal reference shows perfect agreement. Dot size ∝ log(comment count). "
            "Four quadrants are annotated."
        ),
        "what_we_learned": (
            "Most threads cluster near the diagonal — post and comments largely agree. **Off-diagonal points are "
            "the interesting ones:** below-diagonal = comments more negative than post (a smoldering issue the "
            "OP under-stated); above-diagonal = comments soften the post (rant met with reassurance). The "
            "lower-left quadrant (both negative) is the **community-validated pain zone** that the confident-negative "
            "filter selects."
        ),
    },
    {
        "id": "20", "section": "F",
        "title": "Sentiment divergence by flair (boxplot)",
        "filename": "20_sentiment_divergence_by_flair.png",
        "what_it_shows": (
            "Distribution of `(post_vader − mean_comment_vader)` per flair. Negative values mean the post was "
            "angrier than the comments (isolated rant); positive values mean the post was calmer than the "
            "comments (smoldering issue where the community amplifies the OP)."
        ),
        "what_we_learned": (
            "**General Help has the widest divergence spread** — many threads where the OP under-states what "
            "the community thinks. These are the highest-value reads for product strategy because the *real* "
            "issue is bigger than the framing suggests. Looking-For flairs (Read-for-Read, R4R) are tightly "
            "around zero — transactional posts where everyone is on the same page about the activity."
        ),
    },
    {
        "id": "21", "section": "F",
        "title": "Comments per post by flair (boxplot, log scale)",
        "filename": "21_comments_per_post_by_flair.png",
        "what_it_shows": (
            "Distribution of comment count per thread by flair, on a log x-scale. Box = IQR, whiskers = 10/90th. "
            "Only threads with ≥1 comment included."
        ),
        "what_we_learned": (
            "**Off-Topic and R4R run long conversations** (median 10-11 comments); Looking-For: Feedback and "
            "Services are broadcasts (median 4). Sets the right baseline for what \"engagement\" means in each "
            "flair section: a 10-comment thread in Services is unusual and worth attention; in Off-Topic it's "
            "ordinary. Without this baseline you'd misread the absolute comment counts in the top-threads section."
        ),
    },
    {
        "id": "22", "section": "F",
        "title": "Competitor mentions in comments",
        "filename": "22_competitor_mentions_in_comments.png",
        "what_it_shows": (
            "Same form as chart 17 but on comments instead of posts. 11 platforms, ranked by mention count, "
            "colored by mean VADER on single-mention comments."
        ),
        "what_we_learned": (
            "**Comments mention competitors at 2× the rate of posts** (1,644 vs. 801). AO3 dominates by a wide "
            "margin; Royal Road, Inkitt, and fanfiction.net follow. **Confirms the hypothesis that switching "
            "narratives live in replies, not OPs** — the post asks \"should I leave?\" and the comments answer "
            "\"I left for AO3 six months ago, here's how it went.\" If we'd analyzed only posts, this signal "
            "would have been missed entirely."
        ),
    },
]

SECTION_TITLES = {
    "A": "A. Corpus and flair landscape",
    "B": "B. Post-level sentiment",
    "C": "C. Aspect-level pain — Pass 1 (noun chunks)",
    "D": "D. Aspect-level pain — Pass 2 (DeBERTa-ABSA)",
    "E": "E. Competitor mentions in posts",
    "F": "F. Thread-level analysis",
}

SECTION_INTROS = {
    "A": (
        "What's in the corpus and how the eight analytical flairs compare on size, "
        "upvotes, and comment volume. Sets the table for everything downstream."
    ),
    "B": (
        "Lexicon-based VADER scored on each post (title + body). Treats the post as one signal — "
        "useful as a coarse first pass, but conflates multiple aspects per post and systematically "
        "under-counts pain. The next two sections are how we got past that."
    ),
    "C": (
        "First-pass aspect extraction using spaCy noun chunks. Cheap and fast — runs in seconds. "
        "Used to short-list 71 aspects worth scoring properly with ABSA."
    ),
    "D": (
        "Pass 2 — DeBERTa-v3-base-absa-v1.1 scored on every (sentence, aspect) pair where the aspect "
        "appears in the sentence (or matches a curated synonym). 3,678 ABSA rows × 71 aspects × 1,011 posts. "
        "This is where the real aspect-level pain landscape comes from."
    ),
    "E": (
        "Regex extraction of 11 tracked competitor platforms from post titles and bodies. Sentence-level "
        "VADER on single-mention sentences gives a clean (uncontaminated) read on each platform's sentiment."
    ),
    "F": (
        "Treating each post + its comments as one **thread** unit. This is where the analysis stopped looking "
        "at posts in isolation and started measuring conversations — post-vs-comment sentiment agreement, "
        "consensus negativity, comment-level competitor talk. The five charts below are the heart of the "
        "competitor research findings."
    ),
}


def render_chart_block(c: dict) -> str:
    return (f"### Chart {c['id']} — {c['title']}\n\n"
            f"{img(c['filename'], c['title'])}\n"
            f"**What this shows.** {c['what_it_shows']}\n\n"
            f"**What we learned.** {c['what_we_learned']}\n")


def render_section(letter: str) -> str:
    title = SECTION_TITLES[letter]
    intro = SECTION_INTROS[letter]
    lines = [f"## {title}", "", f"_{intro}_", ""]
    for c in CHARTS:
        if c["section"] == letter:
            lines.append(render_chart_block(c))
            lines.append("")
    return "\n".join(lines)


def render_methodology() -> str:
    return f"""## G. How threads were selected (methodology for section H)

For each of the 8 analytical flairs, three lists are surfaced. Each answers a different product question.

### 1. Most-discussed threads (top {N_MOST_DISCUSSED} per flair)

**Goal:** *"Where did the community actually show up?"*

**Quality score:**

```
quality = log(1 + n_comments) × log(1 + max_comment_score) × (|post_vader| + 0.5)
```

Three factors multiplied:

- **`log(1 + n_comments)`** — conversation volume, logged so a 200-comment thread isn't 100× a 2-comment thread.
- **`log(1 + max_comment_score)`** — peak endorsement. One 100-upvote comment beats twenty 5-upvote ones.
- **`|post_vader| + 0.5`** — opinion strength. Calm threads get the floor; opinionated ones rise.

### 2. Confident-negative threads (top {N_CONFIDENT_NEG} per flair)

**Goal:** *"Where do we have community-validated pain?"*

**Filter (two signals must agree):**

```
post_vader < −0.2          # OP is clearly negative on title + body
AND
top3_mean_vader < −0.1     # mean VADER of the top-3 highest-scored comments is also negative
```

Filters out lone rants, sarcastic-positive bait, and mild venting. Within the filtered set, threads are sorted by `consensus_neg` (fraction of all comments with VADER < −0.05), then by comment count.

### 3. Threads with competitor talk (top {N_COMPETITOR} per flair)

**Goal:** *"Where are users actually naming alternatives?"*

**Filter:** at least one comment mentions one of 11 tracked platforms via regex on canonical names and aliases (case-insensitive): AO3 (incl. `archiveofourown`), Royal Road, Inkitt, Substack, Patreon, Tapas, Webnovel, Radish, Kindle Vella, fanfiction.net (incl. `ffn`, `ff.net`), Wattpad (self-references). Ranked by total competitor-mention count, then comment count.

### What each thread shows

- **Header line:** `post_id` · post ↑ score · n comments · post sentiment · top-3 comment sentiment · % negative comments
- **Flag line** (when applicable): 🔴 confident-negative, 🔁 N competitor mentions, 🚪 N switching-language comments
- **Post body:** up to {POST_PREVIEW_CHARS} characters
- **Top {N_TOP_COMMENTS_PER_THREAD} comments by score:** each with score, author, sentiment marker (🟢 positive · ⚪ neutral · 🔴 negative), up to {COMMENT_PREVIEW_CHARS} characters of body
"""


def render_preamble_and_summary(td: pd.DataFrame) -> str:
    n_threads = len(td)
    n_with = int((td["n_comments"] > 0).sum())
    n_confident = int(td["confident_negative"].sum())
    n_competitor = int((td["n_competitor_mentions"] > 0).sum())

    return f"""# r/Wattpad findings report

_Generated {date.today().isoformat()}. End-to-end NLP analysis of r/Wattpad posts and comments over the last 2 years (8 platform-discussion flairs)._

**Corpus:** {n_threads:,} in-scope post threads = 1 post + every comment beneath, parent-chain resolved through Reddit's reply structure. 15,865 comments under 1,133 threads. Excludes 4 structurally-positive flairs (Weekly Promotion, Monthly Discussion, Announcement, Milestone) from sentiment analyses.

**{n_with:,} threads have at least one comment · {n_confident:,} are confident-negative · {n_competitor:,} have a competitor mention in the comments.**

---

## Executive summary

1. **Pain is concentrated, not diffuse.** Two of eight flairs — General Help and Off-Topic — carry essentially all of the community-validated pain (5.7% confident-negative each). The other six flairs are either positive or transactional. *See chart 18.*

2. **Post-only sentiment is misleading.** Every flair scores net positive at the post level, even General Help. Post-level VADER averages across multiple aspects within a post and across structurally-positive drive-by posts. ABSA and thread-level signals were needed to surface real pain. *See charts 5–7.*

3. **The loudest pain aspects are identity/inbox, not algorithm.** `scam` (96% neg), `email` (65%), `notification` (62%), `algorithm` (54%), `account` (46%). The identity & inbox cluster is the loudest *quiet* pain — none of these aspects make headlines but they're systematically negative. *See chart 12.*

4. **The platform loses, the community on top of it wins.** ABSA category breakdown: platform-feature and discovery categories are the most negative; community and service are the most positive. Users love what they bring to the platform, not what the platform brings to them. *See chart 15.*

5. **Switching narratives live in comments, not posts.** Comments mention competitors at 2× the rate of posts (1,644 vs. 801). The post asks "should I leave?" — the comments answer "I left for AO3 six months ago, here's how it went." AO3 dominates competitor mentions, then Royal Road, Inkitt, fanfiction.net. *See chart 22.*
"""


def github_anchor(heading: str) -> str:
    """Match GitHub's heading-to-anchor slugification: lowercase, drop
    punctuation, spaces → hyphens, do NOT collapse consecutive hyphens."""
    s = heading.lower()
    s = "".join(ch if ch.isalnum() or ch in " -" else "" for ch in s)
    s = s.replace(" ", "-")
    return s.strip("-")


def render_toc(flairs: list[str], counts: dict) -> str:
    lines = ["## Table of contents", ""]
    lines.append("**Findings & charts**")
    lines.append("")
    for letter in "ABCDEF":
        title = SECTION_TITLES[letter]
        anchor = github_anchor(title)
        chart_ids = [c["id"] for c in CHARTS if c["section"] == letter]
        lines.append(f"- [{title}](#{anchor}) — charts {', '.join(chart_ids)}")
    methodology_title = "G. How threads were selected (methodology for section H)"
    lines.append(f"- [{methodology_title}](#{github_anchor(methodology_title)})")
    lines.append("- [H. Top threads per flair](#h-top-threads-per-flair)")
    lines.append("")
    lines.append("**Top threads per flair**")
    lines.append("")
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

    parts = [render_preamble_and_summary(td), "", render_toc(flairs, counts), "---", ""]
    for letter in "ABCDEF":
        parts.append(render_section(letter))
        parts.append("---\n")
    parts.append(render_methodology())
    parts.append("---\n")
    parts.append("## H. Top threads per flair\n")
    parts.append("_Each flair section below has three lists: most-discussed, confident-negative, "
                 "competitor-talk. See methodology section G above for how each list is built._\n")

    for f in flairs:
        parts.append(render_flair_section(f, td, cs, body_map))
        parts.append("\n")

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text("\n".join(parts))
    print(f"wrote {OUT.relative_to(REPO_ROOT)}")
    print(f"  charts embedded: {len(CHARTS)}")
    print(f"  flairs rendered: {len(flairs)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
