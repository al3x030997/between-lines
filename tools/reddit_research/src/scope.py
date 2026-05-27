"""Shared scope constants for r/Wattpad analysis.

`KEEP_FLAIRS` is the broad scope used by the corpus build — captures everything
that's platform discussion (not memes, not genre tags). It powers
flair-distribution charts that document the full discussion landscape.

`ANALYTICAL_DROP_FLAIRS` is a stricter cut applied to *sentiment-bearing*
analyses: it drops categories whose sentiment is structurally positive
(megathreads anchored by 2–3 authors, mod announcements, celebration posts).
Use it whenever the question is "where is the pain" — leave it off when the
question is "what's the discussion mix on the sub."

Rationale per flair:
- "Weekly Promotion" — mod megathread, 3 unique authors, 100% positive by design
- "Monthly Discussion" — mod megathread, 2 unique authors
- "Announcement"      — platform announcements, 6 authors, 90% positive by design
- "Milestone"         — celebration posts ("I got 1,000 reads"), structurally positive
"""

# Note: "Help" (1 stale post in the corpus, likely a typo of "General Help") and
# "Media" (no posts in the last 2 years) were dropped from the keep-set on
# 2026-05-18 since they have no analytical signal. If r/Wattpad re-introduces
# either flair later, re-add here.
KEEP_FLAIRS: frozenset[str] = frozenset({
    "General Help", "Looking For: Feedback", "Looking For: Recommendations",
    "Looking For: R4R/V4V/C4C/F4F", "Looking For: Read for Read", "Milestone",
    "Off-Topic", "Other", "Services", "Announcement",
    "Monthly Discussion", "Weekly Promotion",
})

ANALYTICAL_DROP_FLAIRS: frozenset[str] = frozenset({
    "Weekly Promotion",
    "Monthly Discussion",
    "Announcement",
    "Milestone",
})

ANALYTICAL_KEEP_FLAIRS: frozenset[str] = KEEP_FLAIRS - ANALYTICAL_DROP_FLAIRS
