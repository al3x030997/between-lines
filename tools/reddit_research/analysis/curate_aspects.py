"""Pre-fill aspect curation: rule-based + manual triage for the top 200 aspects.

Reads:
  analysis/tables/aspects_top200_for_review.csv  (empty keep/category from Pass 1)

Writes:
  analysis/tables/aspects_top200_curated.csv  (filled keep + category + notes)
  analysis/tables/aspects_curated_keep.csv     (just the keepers, ready for Pass 2 ABSA)

Categories:
  platform_feature  — concrete platform functionality (comment, vote, cover, profile, app, …)
  discovery         — algorithm/ranking/visibility/attention/audience
  monetization      — money, scam, ad, premium, tip, paywall, paid
  community         — feedback, support, reader/writer relations, beta reader, criticism
  service           — paid services / production help: cover designer, editor, beta-reader gig
  competitor        — explicit named platforms (ao3, royal road, reddit) when used comparatively
  content_topic     — story content: romance, war, death, mmc/fmc, mafia, smut, angst, …
  generic           — too generic to act on: story, book, chapter, word, idea, life, …
  noise             — artifacts, story titles, opaque tokens (amp, shadow slayer, adam)

Edit the dicts below freely — re-run to regenerate.
"""
from __future__ import annotations

from pathlib import Path

import pandas as pd

ROOT = Path(__file__).resolve().parent.parent
TBL = ROOT / "analysis" / "tables"
IN = TBL / "aspects_top200_for_review.csv"
OUT = TBL / "aspects_top200_curated.csv"
KEEP_OUT = TBL / "aspects_curated_keep.csv"

# Explicit category assignments. Anything not listed → "generic" by default
# (loud signal in the data: most top-N is generic platform vocabulary).
CATEGORIES: dict[str, str] = {
    # --- platform_feature: concrete platform mechanics ---
    "comment": "platform_feature",
    "vote": "platform_feature",
    "link": "platform_feature",
    "tag": "platform_feature",
    "title": "platform_feature",
    "cover": "platform_feature",
    "blurb": "platform_feature",
    "username": "platform_feature",
    "account": "platform_feature",
    "password": "platform_feature",
    "profile": "platform_feature",
    "app": "platform_feature",
    "notification": "platform_feature",
    "email": "platform_feature",
    "message": "platform_feature",
    "page": "platform_feature",
    "update": "platform_feature",
    "edit": "platform_feature",
    "draft": "platform_feature",
    "reading list": "platform_feature",
    "new chapter": "platform_feature",
    "story link": "platform_feature",
    "wattpad story": "platform_feature",
    "description": "platform_feature",  # story description / synopsis box
    "site": "platform_feature",
    "website": "platform_feature",
    "user": "platform_feature",
    "rule": "platform_feature",        # subreddit / platform rules
    "bot": "platform_feature",
    "language": "platform_feature",    # platform language support
    "english": "platform_feature",

    # --- discovery ---
    "algorithm": "discovery",
    "ranking": "discovery",
    "view": "discovery",
    "audience": "discovery",
    "attention": "discovery",
    "follower": "discovery",
    "engagement": "discovery",
    "visibility": "discovery",
    "reach": "discovery",
    "recommendation": "discovery",
    "suggestion": "discovery",
    "rec": "discovery",

    # --- monetization ---
    "money": "monetization",
    "scam": "monetization",
    "tip": "monetization",
    "deal": "monetization",
    "bonus": "monetization",
    "exchange": "community",      # r4r is a quasi-monetization barter, but it's social

    # --- community ---
    "feedback": "community",
    "honest feedback": "community",
    "criticism": "community",
    "advice": "community",
    "opinion": "community",
    "support": "community",
    "review": "community",
    "community": "community",
    "subreddit": "community",
    "sub": "community",
    "reader": "community",
    "writer": "community",
    "author": "community",
    "new writer": "community",
    "friend": "community",
    "lover": "community",          # often "wattpad lovers" community
    "fanfic": "community",
    "fanfiction": "community",
    "fic": "community",
    "fan fiction": "community",
    "fandom": "community",
    "fanfic reader": "community",

    # --- service (paid help / production) ---
    "beta reader": "service",
    "artist": "service",

    # --- competitor ---
    "reddit": "competitor",

    # --- content_topic (fiction content / genre) ---
    "romance": "content_topic",
    "fantasy": "content_topic",
    "horror": "content_topic",
    "mystery": "content_topic",
    "thriller": "content_topic",
    "smut": "content_topic",
    "angst": "content_topic",
    "slow burn": "content_topic",
    "dark romance": "content_topic",
    "mafia": "content_topic",
    "mafia romance": "content_topic",
    "vampire": "content_topic",
    "drama": "content_topic",
    "trope": "content_topic",
    "plot": "content_topic",
    "scene": "content_topic",
    "main character": "content_topic",
    "character": "content_topic",
    "protagonist": "content_topic",
    "mmc": "content_topic",
    "fmc": "content_topic",
    "war": "content_topic",
    "death": "content_topic",
    "magic": "content_topic",
    "enemy": "content_topic",
    "king": "content_topic",
    "kingdom": "content_topic",
    "fear": "content_topic",
    "hell": "content_topic",
    "family": "content_topic",
    "man": "content_topic",
    "woman": "content_topic",
    "boy": "content_topic",
    "girl": "content_topic",
    "child": "content_topic",
    "couple": "content_topic",
    "poetry": "content_topic",
    "short story": "content_topic",
    "fan fiction": "content_topic",

    # --- noise / artifacts ---
    "amp": "noise",                # html entity leftover
    "adam": "noise",               # single-author artifact (n=1 post)
    "shadow slayer": "noise",      # specific book title
    "idk": "noise",
}

# Default category when not in the map above.
DEFAULT_CATEGORY = "generic"

# Which categories to KEEP for Pass 2 ABSA.
KEEP_CATEGORIES = {"platform_feature", "discovery", "monetization", "community",
                   "service", "competitor"}

NOTES: dict[str, str] = {
    "account": "highest-pain top-frequency aspect (36% neg, mean -0.03) — own deep-dive",
    "algorithm": "discoverability core complaint — pair with 'ranking', 'view', 'engagement'",
    "scam": "87% neg — investigate cover/edit/promo scam patterns",
    "notification": "33% neg — likely push/email noise or missed mentions",
    "message": "44% neg — DM spam? unwanted advances?",
    "follower": "31% neg — bot-follower problem? unfollow churn?",
    "vote": "25% neg — vote-trading frustration",
    "comment": "19% neg + n=299 — comment toxicity / spam / dead-comment-section",
    "tag": "24% neg — tag system limitations",
    "cover": "12% neg but cover scams + cover-tool gaps both live here",
    "money": "37% neg — refused-to-pay or premium-feature complaints",
    "ranking": "33% neg — Wattpad's per-tag ranking algorithm is contentious",
    "page": "40% neg — likely reader app page-turn issues OR low-page-view complaint",
    "lover": "ambiguous: 'fanfic lover', 'romance lover' (community) vs 'wattpad lover' (platform)",
    "exchange": "R4R/V4V trade economy — strong competitor research signal",
}


def main() -> int:
    df = pd.read_csv(IN)
    df["category"] = df["aspect"].map(CATEGORIES).fillna(DEFAULT_CATEGORY)
    df["keep"] = df["category"].apply(lambda c: "y" if c in KEEP_CATEGORIES else "n")
    df["notes"] = df["aspect"].map(NOTES).fillna("")

    df.to_csv(OUT, index=False)
    print(f"wrote {OUT.relative_to(ROOT)}  shape={df.shape}")
    cat_counts = df["category"].value_counts()
    print("\ncategory distribution (top 200):")
    print(cat_counts.to_string())
    print(f"\nkeep=y: {(df['keep']=='y').sum()}  •  keep=n: {(df['keep']=='n').sum()}")

    keep_df = df[df["keep"] == "y"].copy()
    keep_df.to_csv(KEEP_OUT, index=False)
    print(f"\nwrote {KEEP_OUT.relative_to(ROOT)}  shape={keep_df.shape}")
    print("\nkept aspects, by category, top 5 per:")
    for cat in sorted(keep_df["category"].unique()):
        sub = keep_df[keep_df["category"] == cat].nlargest(5, "n_mentions")
        print(f"\n  [{cat}]")
        for r in sub.itertuples():
            print(f"    {r.aspect:25s}  n={r.n_mentions:4d}  neg={r.share_negative:.0%}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
