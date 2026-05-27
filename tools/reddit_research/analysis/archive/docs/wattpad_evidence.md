# Wattpad Reddit Analysis — Claims & Evidence

Verbatim quotes from source Reddit posts, each linked to the original.
All quotes are verified as exact substrings of source post bodies
(see `tests/test_quotes_not_hallucinated.py`).

---

## About the corpus

This analysis is based on a Reddit corpus collected specifically to understand how
Wattpad is discussed across the platform — not only within Wattpad's own subreddit,
but anywhere it is mentioned or compared.

| Dimension | Detail |
|-----------|--------|
| **Unique posts** | 561 |
| **Unique comments** | 52,218 |
| **Comments per post (mean)** | 93 |
| **Post score range** | 214 – 29,000 (median 802) |
| **Date range** | July 2012 – May 2026 |
| **Subreddits covered** | 210 unique subreddits |
| **Top subreddits** | r/Wattpad (169 posts), r/AO3 (58), r/FanFiction (12), r/TheOwlHouse (9), r/HobbyDrama (8) |
| **Language** | 84% English, 12% undetermined, 4% other |

**How posts were collected.** Three crawl strategies were combined: posts from r/Wattpad
directly (162 posts); Reddit-wide keyword search on post titles mentioning "wattpad" (210
posts); and Reddit-wide search on post bodies (189 posts). Duplicates across strategies
were deduplicated, keeping the highest-priority source. All associated comment threads
were fetched, giving 52,218 comments across the 561 posts.

**Classification.** All 561 posts were classified by a local Llama 3.1 8B model into five
topics. 228 posts (41%) were marked unrelated — memes, image-only posts, non-English text,
or passing references with no substantive discussion. The remaining **333 posts** are the
basis for all analysis below.

| Topic | Posts | Share of substantive |
|-------|------:|---------------------:|
| Community & culture | 141 | 42% |
| Author writing experience | 100 | 30% |
| Reader experience | 48 | 14% |
| Platform comparison | 44 | 13% |

**Opinion extraction.** Each of the 333 substantive posts was passed to Llama 3.1 8B a
second time to extract structured opinions: user role (author / reader / observer / mixed),
praises, criticisms, feature gaps, rival platforms mentioned, and a key quote. Of the 333
authors, 110 identified as authors writing on Wattpad, 96 as readers, and 124 as outside
observers discussing the platform.

**Sentiment.** VADER compound scores were computed for all 45,158 English-language rows
(posts + comments). Overall median: +0.25 (slightly positive), driven upward by supportive
comment threads. Post-level sentiment is more mixed.

---

## Claims at a glance

1. **The dominant complaint is monetization, not features**
2. **AO3 is the primary escape hatch, driven by values not features**
3. **Praise is weak, generic, and outnumbered**
4. **Community & Culture posts have the lowest sentiment of any topic**
5. **Author experience contains the platform's most emotionally resonant posts**
6. **Reader experience complaints are too fragmented to cluster**

---

## Claim 1: The dominant complaint is monetization, not features

The two largest gap clusters — 'fair organic content promotion' (16 phrases) and 'non-intrusive ad experience' (15 phrases) — appear independently in both the author and community topics, making them the most consistently stated unmet needs across the entire corpus. The top criticisms ('heavy monetization focus', 'algorithm buries content without payment') reinforce the same underlying grievance: Wattpad has built a system where visibility requires payment.

### Supporting quotes

> "We have, in addition, inspirational quote posters.Their famous quotes include
"Bts cameth from a bawbling company, those gents did start with nothing"
"Jin who is't wast cast'd just because of his looks"
"Suga who is't hath left his family and gambl'd his education just to doth what that gent very much did want to beest"
"Namjoon who is't wast nev'r has't been supp'rt'd by his parents"
"Jimin who is't bethought himself as like a toad, ugly and venemous and bacon-fed"
"Taehyung whose at each moment been parteth of bts but wast nev'r shown in any promotions- not until those gents debut"
"Hoseok who is't hath seemed to at each moment chuckle but nev'r hath felt as an accomplishment to his fath'r"
"Jungkook who is't wast v'ry dainty and has't did save his parents at a young age by auditioning to companies"
"Rememb'r the days at which hour those gents w're struggling?"
"Those gents coequal has't to sacrifice and w'rk hard just so those gents couldst consume?" 
"Those gents w're squeezing themselves into one bawbling apartment and has't to taketh responsibilities- the reasoneth wherefore those gents wroteth the song 'move'"
"Those times at which hour jimin hast to starve himself just because people calleth that gent bacon-fed and like a toad, ugly and venemous"
"Yond one int'rview wh're yoongi hath said yond; t wast nice yond people harks to their music because taehyung and jungkook art valorous looking"
"And that gent bethought yond t wast at least enow"
"Doth thee rememb'r at which hour hoseok wast did suppose to beest the vocalist and taehyung is the rapp'r, but that gent hath chosen to rap instead and learneth t because taehyung wanteth to beest a vocalist"
"Twast taehyung's dreameth and hoseok loves his dongsaeng yond much that gent wouldst sacrifice"
"Oth'r fan base w're accusing those folk f'r plagiarism just because those gents hadst the smallest detaileth whose the same with oth'r big k-pop group which is actually just a coincidence."
" Th're wast a timeth at which hour yoongi pack'd 300 gifts and lett'rs just to giveth to their 300 fans who is't shall attendeth at their mini fan meetings."
"So wherefore doth people judgeth those folk so apace?" 

Among many others."
> — u/iamconfused14 ([source](https://www.reddit.com/comments/t1xtyl/))

> "There are no rules, no algorithms, and no judgment here."
> — u/CreatorReality ([source](https://www.reddit.com/comments/1hfnxol/))

> "Once you go post-scarcity post-money economy you never go back."
> — u/FermisFolly ([source](https://www.reddit.com/comments/qryu7f/))

> "And afterwards they used threads and staples to hold their work back together once they were done."
> — u/maximusaemilius ([source](https://www.reddit.com/comments/zv6w2u/))


## Claim 2: AO3 is the primary escape hatch, driven by values not features

AO3 appears in 83 posts — 4.2× more than the next rival (fanfiction.net, 20). The migration framing is almost always about values: AO3 is community-first and non-commercial; Wattpad is perceived as having sold out. The platform comparison topic's highest-scoring posts are external fandom drama about Wattpad migrants arriving on AO3 with 'wrong' norms, not Wattpad users defending their home.

### Supporting quotes

> "so i moved into my dorms yesterday, and since i was overall super busy, i hadn't logged into ao3 at all

i logged in this morning and saw that it was blocked by the network 💔💔

i figured it might be, but i'm still sad about it :((

i have all my work saved on a google doc, but i like checking the format in ao3 as i'm working on my fic :/

i still go home on the weekends, so ill live, its just sad :(

edit: i was told about an alt site with .gay instead of .org and it worked!"
> — u/therealfrankiej_ ([source](https://www.reddit.com/comments/1qha3fr/))

> "(And whatever site I could see it fit on) However, I do often find myself feeling bad, for what if I'm not well enough versed in the "ao3 community" to post there?"
> — u/PossumCreatives ([source](https://www.reddit.com/comments/1id4hu6/))

> "This is not to throw shade to wattpad - I prefer ao3 for many reasons but its kinda funny how people compare."
> — u/noelleeenerd ([source](https://www.reddit.com/comments/1m29qd8/))

> "Like fuck I read fanfictions on ao3 and tumblr where the writing was 10 times better than the stories I found on here which is kinda ridiculous."
> — u/MissPhantoms ([source](https://www.reddit.com/comments/10y6vph/))


## Claim 3: Praise is weak, generic, and outnumbered

Across all four topics, praise phrases are consistently the shortest bar. The clusters that formed (≥3 phrases) are: 'encourages writing', 'supportive community', 'large readership', 'entertaining content' — all describing Wattpad circa 2016, not the current product. Author experience generates the most praise volume (65 phrases) but those same posts generate 125 criticisms and 97 gaps, a 2:1 negative ratio. Reader experience produced zero clusters from 20 praise phrases.

### Supporting quotes

> "I *love* reading them and it’s a good way to get some constructive criticism as well as help push me to write more!"
> — u/NorthernGyrfalcon ([source](https://www.reddit.com/comments/oq18lq/))

> "Fan fiction is a good place to start, for many kids, as a lot of their first passions can be an artist they love or a show they watch."
> — u/SeaBeeDecodesLife ([source](https://www.reddit.com/comments/bum97j/))

> "Like okay enjoy your crappy Wattpad with the ads, the costs, the restrictions and censorship while me and millions others will read/write what we want for free, with no ads, no censorship, no algorithm just plain old fan works."
> — u/Super_Hyena_4278 ([source](https://www.reddit.com/comments/1caj80p/))

> "Simply, the site can't make money off of fics for legal reasons, so the algorithm promotes them less and less."
> — u/screamingracoon ([source](https://www.reddit.com/comments/13js6lu/))


## Claim 4: Community & Culture posts have the lowest sentiment of any topic

Median VADER compound score: community & culture = +0.15, vs author experience = +0.40 — the widest gap between any two topics. Community posts with the highest volume (141 posts) are also the most negative. High-scoring posts in this topic are memes and comment-section screenshots — people laughing *at* the platform, not engaging with it.

### Supporting quotes

> "Most seemed to come from wattpad or tiktok judging by the way they tag and talk, and ive seen multiple fics w smth along the lines of ‘a 13yr old wrote this btw!!’

Anyways, because of the whole purity culture and this thing w/ having a sense of higher moral ground amongst teens, it’s annoying when someone posts an explicit or problematic fic and the comments are always flooded w/ angry ppl screeching about how ‘wrong’ and ‘disgusting’ it is."
> — u/Accurate_Leg_2100 ([source](https://www.reddit.com/comments/1bk28ih/))

> "📝 For more detailed **AU lore**, click [here](https://www.wattpad.com/story/405736717-villain-sonic-au)!"
> — u/huyu_sth ([source](https://www.reddit.com/comments/1ps9dtj/))


## Claim 5: Author experience contains the platform's most emotionally resonant posts

The top author experience post scored 28,376 — nearly 3× the top community post (15,369) and 3× the top platform comparison post (9,804). These aren't complaint posts; they are writers sharing milestone moments (finishing a long fic, reaching a readership milestone). The emotional attachment to writing-as-identity is real and deep, which is exactly what Wattpad is losing.

### Supporting quotes

> "So I recently found a ddlg story with 30 chapters and the whole thing sounded like something you might have found on wattpad in 2015, so I got a bit sentimental and decided to read it."
> — u/Main_Support_pik ([source](https://www.reddit.com/comments/1mnjlb3/))

> "I can’t tell you how many times I had people messaging me when I wrote fan fiction on Wattpad, asking or even telling me to write a plot or story about this or that."
> — u/SeaBeeDecodesLife ([source](https://www.reddit.com/comments/bum97j/))

> "You don't get reported and a few bookmarks/kudos and I get a peek into what the actual story will be like, it's a win-win

Thank you for coming to my Ted Talk

Edit- Peek*"
> — u/Alarmed-Bus-9662 ([source](https://www.reddit.com/comments/1fgyndr/))

> "As darkness took over her vision, her last thought was ‘my author would have done well to read something other than wattpad smut before deciding to write a book, huh.’ “"
> — u/spiderfightersupreme ([source](https://www.reddit.com/comments/1calc2m/))


## Claim 6: Reader experience complaints are too fragmented to cluster

Reader experience produced 0% clustering across all three categories (criticism, gap, praise) — the only topic where nothing coalesced. 63 criticism phrases, 0 clustered. 20 praise phrases, 0 clustered. 12 gap phrases, 0 clustered. This means reader frustrations are personal and varied rather than convergent on a single fixable problem, unlike the author/community topics where organic promotion and ads formed dominant clusters immediately.

### Supporting quotes

> "I genuinely don’t understand how people are enjoying books that feel lower quality than the Wattpad stories teenagers were writing 10 years ago."
> — u/Murky_Ladder5343 ([source](https://www.reddit.com/comments/1sg1ue3/))

> "I’m not sure what happened to this wattpad story but it was Wenclair one shots it had Over 40 chapters and this picture as the Cover I forgot my old wattpad logins and have a new account I only had it in my library not my reading list and now I can’t find it lol maybe it’s been deleted idk does anyone have it?"
> — u/terminator2kill007 ([source](https://www.reddit.com/comments/1mv96pe/))

> "When I get a wattpad notification, I'm just filled with dread because who knows what they have commented?"
> — u/Lenore8264 ([source](https://www.reddit.com/comments/n8eyyd/))

> "I have read a lot of the books recommended on here and I find many of them remind of books I read on Wattpad back when I was 13."
> — u/MissPhantoms ([source](https://www.reddit.com/comments/10y6vph/))

