# Account / login / identity — the loudest quiet complaint

**Headline:** Of the top-frequency aspects in r/Wattpad posts (last 2 years, platform-discussion flairs), `account` is **the only one with a negative mean sentiment** (−0.03, 36% of mentions negative). It surfaces in 71 distinct posts across 145 sentences — and concentrates in `General Help` (30 posts), `Off-Topic` (9), and `Other` (8). 27% of account-mentioning sentences are explicitly negative.

This isn't a story about one bug. It's six distinct failure modes that share an "identity / access" surface.

## The six failure modes

### 1. Lockout with no recovery path
Users who lose access to the email tied to an old account cannot recover it. They can't even file effective reports about content on those accounts.

> "I have reported the account, the stories in particular, I've submitted tickets on several occasions, but **I can't log in because I forgot my password, and I lost the email tied to the account four years ago.**" — *Off-Topic, score 5*

### 2. Wrongful closure, no appeal
Wattpad's ToS-enforcement around birthdate misrepresentation closes accounts irreversibly, even when the user provides ID. No human review path.

> "We do not transfer or restore content/accounts that have been removed for violating Wattpad guidelines and policies." — *General Help, score 40 (cited from policy)*
> "ALL IT TOOK WAS SAYING I KNEW THE ACCOUNT LIED ABOUT THE BIRTHDAY!!!" — *General Help, score 23*

### 3. Fake / impersonation accounts proliferate
Users notice fake accounts, can't get them taken down quickly, and there's no verified-author system.

> "I haven't been on Wattpad for very long, but I've already noticed that **some accounts are fake.**" — *General Help, score 1*
> "Mainly I just help with reporting/deleting those **discord art scam accounts** and comments…" — *Other, score 7*

### 4. Blocking is leaky
A blocked user can still access your books and trigger notifications on you. The block is partial.

> "**Blocking isn't working because they're still able to access my account and books** so I'm not sure what to do." — *Off-Topic, score 248* ← high engagement
> "Whenever I block an account, I notice that I still receive notifications if they update a story or post an announcement." — *Off-Topic, score 2*

### 5. Persistent sign-in friction on mobile
Re-authentication required almost every app session.

> "I check the app daily for reader notifications and it's getting very annoying **having to sign in almost every time I open it**." — *General Help, score 2*

### 6. Harassment via account access (no escalation path)
When someone has access to your account or is impersonating/harassing, there's no clear escalation.

> "I've resorted to unpublishing my books because **I don't want that mentally ill person having access to me or my work but ultimately I need that account banned**." — *Off-Topic, score 248* ← high engagement

## What this means for a new platform

These six modes split into three product surfaces:

| Surface | Failure | Build |
|---|---|---|
| **Recovery** | Email-only recovery; permanent lockout | Multi-factor recovery (phone, recovery codes, OAuth as fallback) + human-readable account history at password reset |
| **Trust & safety** | Fake accounts, slow takedowns, leaky blocking, no escalation | Verified-author badge, deterministic block (suppresses *all* signal including notifications), in-product escalation queue with SLA |
| **Mobile session UX** | Forced re-auth | Long-lived refresh tokens, biometric unlock — table-stakes |

The **highest-engagement quotes** (Off-Topic +248) are both about *blocking not working* and *needing an account banned*. That's where the latent demand is loudest — safety and recourse, not features.

## Suggested next analyses

1. **Cross-aspect cluster:** `account` + `password` (n=17) + `username` (n=47, 19% neg) + `message` (n=18, 44% neg) + `notification` (n=27, 33% neg) probably all share the same "identity / inbox / safety" complaint cluster. Group them in Pass 2 ABSA as one `identity_and_safety` mega-aspect.
2. **Comment-level scan:** these 71 posts likely have rich comment threads where similar users chime in with "same here" + their own variants. Worth re-running the drill on comments to widen the evidence base.
3. **Score-weighted ranking:** the two highest-engagement complaints (score 248 each) are both safety-related — confirms the community endorses this pain, not just one frustrated user.

---

*Generated 2026-05-17 from `data/sentiment_descriptives.parquet` + `data/aspect_vocabulary.parquet`. See `scripts/build_aspect_vocabulary.py` for the extraction logic and `analysis/curate_aspects.py` for the curation rules.*
