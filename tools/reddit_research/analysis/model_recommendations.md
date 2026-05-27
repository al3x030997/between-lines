# Reddit corpus pipeline — model recommendations (May 2026)

Corpus: 561 posts + 52,218 comments about Wattpad. Stack: Python/pandas/parquet, Mac M-series, Ollama. Below is one decisive recommendation per stage.

---

## Stage 1 — Topic classification (561 posts)

**Recommendation: `MoritzLaurer/deberta-v3-large-zeroshot-v2.0` via HuggingFace `pipeline("zero-shot-classification", multi_label=True)`. Run Llama 3.1 in parallel only as a tie-breaker.**

Why this and not the others:
- DeBERTa-v3-NLI cross-encoders dominate the BTZSC zero-shot benchmark in the 300M-parameter class, beating BART-MNLI by a wide margin and beating Claude/ChatGPT in zero-shot mode on non-standard taxonomies — which describes your custom 10-label set.
- It returns **real calibrated probabilities per label** out of the box (NLI entailment scores), which directly fixes your "98% have confidence=1.0" problem. With `multi_label=True` each label gets an independent 0–1 score; you can threshold at e.g. 0.5 for primary and 0.3 for secondary topic.
- 561 posts × ~1500 tokens runs in ~5–10 min on M-series CPU; on MPS, faster. No API cost, no leakage risk.
- SetFit is faster but needs ~20 labeled examples per class — you don't have a labeled set, and zero-shot v2 already roughly matches few-shot SetFit at this scale. Skip it unless you decide to hand-label later.
- Claude Haiku 4.5 / GPT-4o-mini would give marginally better edge-case handling but cost real money (~$1–3 for 561 posts at Haiku's $1/$5 per M tokens) without solving the "made-up taxonomy" problem — only Stage 2 does that.

Install:
```bash
pip install "transformers>=4.46" "torch>=2.4" "accelerate>=1.0"
# Model: MoritzLaurer/deberta-v3-large-zeroshot-v2.0  (~870MB, downloaded on first use)
```

Failure modes:
- **Long posts get truncated to 512 tokens** — pre-chunk and max-pool probabilities, or use the title + first 400 tokens.
- DeBERTa-v3 on Mac MPS sometimes silently falls back to CPU for some ops; benchmark `device="mps"` vs `device="cpu"` once. M-series can hit `float16` precision bugs — use `float32`.
- 53% of "community_culture" posts have empty bodies: this is data, not model — NLI on title-only is fine but lower the confidence threshold and route title-only posts through Stage 2 too.

---

## Stage 2 — Topic discovery (53K documents, bottom-up)

**Recommendation: BERTopic with `Alibaba-NLP/gte-modernbert-base` as embedder, plus a Claude Haiku 4.5 representation pass to label clusters.**

> **Updated 2026-05-15:** Swapped from `nomic-embed-text-v1.5` → `Alibaba-NLP/gte-modernbert-base`. The ModernBERT-based GTE embedder beats nomic-v1.5 by **+2.10 MTEB average** and **+2.54 MTEB clustering** at the same 149M params and same 8192-token context. Clustering quality is the direct lever for topic-discovery usefulness. Caveat: ModernBERT's headline speed gains rely on Flash Attention 2 + unpadding, neither of which is available on Mac MPS — so on M-series you keep the quality win, not the speed win. Wall-clock will be comparable to nomic.

Configuration (this is the winner for 53K Reddit docs on M-series, no GPU):
```python
from bertopic import BERTopic
from bertopic.representation import KeyBERTInspired, MaximalMarginalRelevance
from sentence_transformers import SentenceTransformer
from umap import UMAP
from hdbscan import HDBSCAN

embedder = SentenceTransformer(
    "Alibaba-NLP/gte-modernbert-base",
    trust_remote_code=True,
    model_kwargs={"attn_implementation": "sdpa", "torch_dtype": "bfloat16"},
)
# precompute embeddings once, persist to .npy
embeddings = embedder.encode(docs, batch_size=16, show_progress_bar=True)  # 768d, 8192 ctx

umap_model = UMAP(n_neighbors=15, n_components=5, min_dist=0.0,
                  metric="cosine", random_state=42, low_memory=True)
hdbscan_model = HDBSCAN(min_cluster_size=80, metric="euclidean",
                        cluster_selection_method="eom", prediction_data=True)

representation = [KeyBERTInspired(), MaximalMarginalRelevance(diversity=0.3)]
topic_model = BERTopic(embedding_model=embedder, umap_model=umap_model,
                       hdbscan_model=hdbscan_model,
                       representation_model=representation,
                       min_topic_size=80, calculate_probabilities=False)
topics, _ = topic_model.fit_transform(docs, embeddings)
```
Then a one-shot Claude Haiku 4.5 call per topic to name it (50–200 calls × <500 tokens ≈ $0.10).

Why gte-modernbert-base over the alternatives (MTEB English, 149M-param class):

| Model | Avg MTEB | Clustering | Context |
|---|---|---|---|
| **gte-modernbert-base** ✅ | **64.38** | **46.47** | 8192 |
| nomic-modernbert-embed-base | 62.62 | 44.98 | 8192 |
| nomic-embed-text-v1.5 | 62.28 | 43.93 | 8192 |
| all-MiniLM-L6-v2 (current) | ~56 | ~40 | 256 |

- **all-MiniLM-L6-v2 (current): too weak for nuance.** 384d, 2022-era; you'll get blob clusters like "writing things" instead of "AO3 ad-free experience".
- **gte-modernbert-base: winner.** Built on ModernBERT (Dec 2024), 8192 ctx, +2.54 clustering over nomic-v1.5, Apache 2.0.
- **nomic-embed-text-v1.5: previous recommendation.** Still solid, but ModernBERT-family embedders now beat it consistently on MTEB clustering.
- **nomic-embed-text-v2-moe (Feb 2025): NOT an upgrade here** — multilingual MoE optimized for retrieval/MIRACL, context dropped back to 512.
- **mxbai-embed-modernbert-base: comparable to gte-modernbert** but no clean MTEB clustering edge.
- **bge-large-en-v1.5: only 512 tokens** — truncates your longer posts.
- **Qwen3-Embedding-8B (MTEB #1 multilingual at 70.58): overkill at 8B params for M-series CPU/MPS.**
- **Voyage-3 / text-embedding-3-large / Cohere embed-v4: paid; quality bump over gte-modernbert is modest** (1–2 MTEB points); not worth API dependency at 53K docs.
- **TopicGPT (Pham et al. 2024)** outperforms BERTopic on harmonic purity (0.74 vs 0.58 on Wiki) but is "computationally costly on large datasets" and prompt-sensitive. At 53K docs it would cost ~$15–40 in Claude calls. Use BERTopic for discovery, TopicGPT only if BERTopic's representation labels look unusable.

Install/pin:
```
bertopic==0.17.* sentence-transformers==3.* umap-learn hdbscan
einops  # nomic-embed needs it
```

Failure modes:
- **HDBSCAN dumps ~20–40% of docs into the -1 outlier topic.** Plan for it: re-assign with `transform()` or set `min_samples=5` to be less greedy.
- **min_cluster_size=80 will give you ~60–150 topics on 53K docs.** If that's too many, raise to 150. Don't go below 50 — Reddit noise becomes signal.
- **Mac MPS + gte-modernbert: Flash Attention 2 unavailable on MPS** — must pass `attn_implementation="sdpa"` (or "eager"). Use bf16, not fp16 (precision regressions on MPS). Pin `transformers>=4.48`. Expect wall-clock comparable to nomic-v1.5, not the 2× speedup ModernBERT advertises.
- **Comments (52K) dwarf posts (561).** Run topic modeling on comments alone first, then assign posts using `transform()` — otherwise post themes drown.

---

## Stage 3 — Opinion extraction (333 substantive posts)

**Recommendation: Claude Haiku 4.5 via Anthropic API with Instructor + Pydantic schema, zero-shot (no few-shot examples).**

Cost: 333 posts × ~1500 input tokens + ~400 output tokens = 500K input + 133K output tokens ≈ **$0.50 input + $0.67 output = ~$1.20**. With Batch API (50% off): **~$0.60**. This is not a budget decision — it's a rounding error.

Why this and not local models:
- Your concrete bug is **prompt leakage from few-shot examples** ("fair organic content promotion" appearing on Dramione posts). Llama 3.1 8B is too small to resist this — even at temp=0.1, 8B models pattern-match few-shot text. The fix isn't "remove examples from Llama 3.1"; it's "use a model that doesn't need them." Haiku 4.5 hits target accuracy zero-shot.
- Anthropic Haiku 4.5 is explicitly tuned for "classification, routing, extraction" at $1/$5 per M tokens.
- Instructor + Pydantic gives you guaranteed JSON-schema-valid output with automatic retry on validation failure — eliminates the manual `_coerce_list` / role-whitelist boilerplate in your current script.
- Verbatim-quote grounding (`key_quote`) is where small local models lie most. Haiku 4.5 reliably emits quotes that exist in the source; Llama 3.1 8B paraphrases.
- Qwen 2.5 7B/14B via Ollama is the best local alternative — it beats Llama 3.3 at structured extraction (94% vs 87% on contract-field extraction). Use `qwen2.5:14b-instruct` if you absolutely want local. Expect roughly 70–80% of Haiku 4.5's quote-grounding fidelity.

Install:
```bash
pip install "instructor>=1.7" "anthropic>=0.40" pydantic
```

Skeleton:
```python
import instructor, anthropic
from pydantic import BaseModel, Field
from typing import Literal

class Opinion(BaseModel):
    user_role: Literal["author","reader","observer","mixed","unknown"]
    praises: list[str] = Field(max_length=8)
    criticisms: list[str] = Field(max_length=8)
    gaps: list[str] = Field(max_length=8)
    mentioned_platforms: list[str]
    key_quote: str = Field(max_length=200,
        description="A verbatim sentence copied from the post; must appear character-for-character")

client = instructor.from_anthropic(anthropic.Anthropic())
op = client.messages.create(
    model="claude-haiku-4-5",
    max_tokens=1024,
    response_model=Opinion,
    messages=[{"role":"user","content": f"{title}\n\n{body}"}],
)
```

Failure modes:
- **`key_quote` will occasionally be paraphrased**, not verbatim. Post-validate with `assert quote in body` and retry once with a stricter prompt; fall back to empty string.
- **Schema overfit to lists**: Haiku will sometimes invent a third bullet to fill a `praises` list. Mitigate by adding `description="Only include items explicitly stated; leave empty if none"` to each field.
- **Rate limits**: at 333 posts you won't hit them, but if you batch comments later, switch to the Batch API for 50% off and 24h SLA.
- **API dependency**: if you need local-only for any reason, fall back to `qwen2.5:14b-instruct` via Ollama with the same Instructor schema (Instructor supports Ollama natively).

---

## If you only do ONE thing differently

**Replace the few-shot example in `extract_opinions.py` with a zero-shot Claude Haiku 4.5 + Instructor/Pydantic call.** That single swap costs you ~$1.20 total, eliminates the prompt-leakage bug that already contaminated your top theme clusters ("fair organic content promotion"), removes your `_coerce_list` and role-whitelist hacks, and gives you schema-valid JSON with verbatim quotes you can trust. Stage 1 and Stage 2 improvements are real but incremental; Stage 3 is where you have a known correctness bug, and the fix is half a day's work and one dollar.
