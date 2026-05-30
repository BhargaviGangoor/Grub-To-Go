# GrubToGo 🍜
### Agentic AI Powered Custom Dish Generation & Secure Dining Orchestration

> **This is both a working platform AND a research project.**
> Every time you open this repo, read this section first.

---

## 🧠 The Research Idea (Read This First, Every Time)

### What You Are Studying

**Commitment Amplification** — a newly named security threat where:

1. An LLM validates constraints (budget ✓, inventory ✓, dietary ✓)
2. The LLM is probabilistic — it can be wrong, hallucinate, or work on stale data
3. A cryptographic signature converts that uncertain output into a **hard, irreversible commitment** (DCT)
4. Physical resources get locked — ingredients reserved, kitchen fired, customer charged
5. The signing step **amplified** a soft probabilistic failure into an irreversible physical harm

**The core insight:** cryptographic signing, designed for security, becomes a harm propagation mechanism when placed downstream of a flawed LLM validator.

---

### The Temporal Gap (Your Unique Contribution)

```
[GENERATION TIME]                        [REDEMPTION TIME]
─────────────────                        ───────────────────
AI checks: paneer = in stock      →      paneer = OUT of stock
AI checks: cost = ₹270            →      cost = ₹380
AI checks: dietary = veg ✓        →      supplier changed ingredient
DCT gets signed with this state   →      DCT gets honored by kitchen
                    ↑
         THE GAP NOBODY SECURES
```

**Every prior paper secures either generation time OR redemption time. Nobody secures the interval between them. That interval is yours.**

---

### Your Solution: Generation-Bound DCT (GB-DCT)

The token is not just signed — it is **cryptographically derived** from the exact multimodal parameters that generated the dish:

```
GB-DCT = HMAC(
  hash(image_embeddings),
  hash(inventory_snapshot_at_T),
  hash(budget_constraint),
  hash(dietary_rules),
  timestamp_T
)
```

At redemption time, the system recomputes this hash from **live world state**. If anything drifted, the token **cannot be regenerated** — it self-invalidates. Not via an external check. Via its own derivation.

---

### How You Beat The Three Closest Papers

| Paper | What They Do | Why You're Different |
|---|---|---|
| **TOPLOC** | Hash inference activations to verify computation | They verify *computational* fidelity. You verify *constraint* fidelity. A model can compute perfectly on stale inputs. |
| **HDP** | Cryptographically chain who authorized what | They bind *identity* provenance. You bind *world-state* provenance. Knowing who approved doesn't matter if the state they approved no longer holds. |
| **Derived Permissions Patent** | Derive access permissions from input context | Access control at one moment. You secure validity *across* the gap between two moments. |

**One sentence that kills all three:**
> *Prior work secures either the generation moment or the redemption moment. We secure the interval between them.*

---

### Confirmed Novelty (3 Independent Sources)

- ✅ Claude search: no paper covers all 4 points together
- ✅ Perplexity deep search: "genuinely greenfield territory"
- ✅ Elicit: "unexplored research direction in current literature"

**Closest competitor to read:** Tianxiao Li et al. (2026) — *Constraint State Governance in Multi-Agent Systems*. Their solution is governance-based. Yours is cryptographic. Cite and differentiate.

---

## 📄 Research Paper Outline

### Title
**"Commitment Amplification: How Cryptographic Signing Transforms LLM Constraint Validation Failures into Irreversible Physical Harm in Agentic Pipelines"**

### Sections

**Section 1 — Introduction**
- Define Commitment Amplification
- The temporal gap as the attack surface
- GrubToGo as the empirical testbed

**Section 2 — Background**
- Agentic pipelines and capability tokens
- LLM constraint validation failures
- Cryptographic commitment schemes
- Cite: TOPLOC, HDP, DART, SAVER, Constraint State Governance

**Section 3 — Threat Model**
```
A  = LLM constraint check result (binary, possibly wrong)
C  = cryptographic commitment (DCT signing)
H(C) = harm surface after commitment

Claim: H(C | A = false positive) >> H(A = false positive alone)
```
The signing step is the amplifier, not the LLM alone.

**Section 4 — System: GrubToGo**
- Architecture overview
- The DCT pipeline
- Where Commitment Amplification occurs

**Section 5 — Generation-Bound DCT (GB-DCT)**
- Token derivation from multimodal generation parameters
- Self-invalidation mechanism
- How it closes the temporal gap

**Section 6 — Experiments**
- How often does the LLM fail constraint checks? (accuracy)
- What is the harm surface before vs. after DCT signing? (reversibility)
- Drift simulation: how often does world state change between generation and redemption?
- Can existing defenses (SAVER, DART) catch this? (comparison)

**Section 7 — Mitigations**
- GB-DCT as primary defense
- Pre-signing verification layer
- Human-in-the-loop gate for high-irreversibility tokens

**Section 8 — Generalization**
- Medical supply ordering (same architecture, higher stakes)
- Autonomous drone dispatch
- Smart grid energy commitment
- GrubToGo is the microcosm

---

## 🏗️ Build Order (Platform + Research Together)

### Phase 1 — Frontend (Week 1)
Build the UI. This is also your demo for the paper.
- Homepage, image upload, prompt input
- Dietary filters, budget input
- Generated dish cards
- DCT display with countdown timer
- **Research instrument:** add visible constraint checking status

**Stack:** Next.js, React, TailwindCSS

---

### Phase 2 — Backend Foundation (Week 1-2)
Build APIs before AI.

```
GET  /menu
GET  /inventory
POST /generate-dish
POST /generate-dct
POST /redeem-dct
POST /validate-dct        ← research endpoint: checks GB-DCT validity
GET  /constraint-log      ← research endpoint: logs every constraint check
```

**Stack:** Node.js, Express, TypeScript, PostgreSQL

**Research instrument:** log every constraint check with:
- what LLM validated
- actual ground truth at that moment
- match or mismatch

---

### Phase 3 — Basic AI Generation (Week 2)
Prove recipe generation works with Gemini API.

Input: `"Creamy vegetarian spicy noodle dish under ₹300"`
Output: recipe, ingredients, quantities, estimated cost

---

### Phase 4 — Inventory Awareness (Week 2-3)
First real agentic loop. **Also your first research experiment.**

```python
while not inventory_valid:
    regenerate_recipe()
```

**Research instrument here:** inject deliberate constraint failures:
- Tell AI paneer is available when it isn't
- Tell AI cost is ₹270 when it's ₹380
- Measure: does the LLM catch it? How often?

This gives you **Table 1** of your paper: LLM constraint validation accuracy.

---

### Phase 5 — Multimodal AI (Week 3)
Image upload + Gemini Vision analysis.

- Flavor profile extraction from uploaded food photos
- Cuisine style understanding
- Ingredient inspiration

**Research instrument:** record image embedding vectors — these become inputs to GB-DCT later.

---

### Phase 6 — Full Agentic Orchestration (Week 3-4)
LangGraph implementation.

```
Analyze User Input
      ↓
Analyze Food Images → extract embeddings → SNAPSHOT_T
      ↓
Generate Recipe
      ↓
Check Inventory → SNAPSHOT_T
      ↓
Estimate Cost → SNAPSHOT_T
      ↓
Validate Constraints → LOG RESULT
      ↓
Generate DCT
```

**All snapshots at time T get saved. This is your GB-DCT input.**

---

### Phase 7 — GB-DCT Security Layer (Week 4) ← Core Research
This is your main contribution. Implement it carefully.

**Standard DCT (what exists):**
```json
{
  "dish_id": "dish_91",
  "locked_inventory": ["paneer", "udon"],
  "price": 270,
  "expiry": "2026-05-17T18:00",
  "redeem_once": true,
  "signature": "HMAC(payload, secret)"
}
```

**GB-DCT (your contribution):**
```json
{
  "dish_id": "dish_91",
  "locked_inventory": ["paneer", "udon"],
  "price": 270,
  "expiry": "2026-05-17T18:00",
  "redeem_once": true,
  "generation_root": {
    "image_hash": "sha256(raw_image_bytes)",
    "inventory_snapshot_hash": "sha256(inventory_at_T)",
    "budget_hash": "sha256(300)",
    "dietary_hash": "sha256([vegetarian])",
    "timestamp_T": "2026-05-17T17:40:00"
  },
  "signature": "HMAC(payload + generation_root, secret)"
}
```

At redemption:
```python
def validate_gb_dct(token, live_inventory, live_price):
    expected_root = compute_generation_root(
        live_inventory,
        live_price,
        token.dietary_rules,
        token.timestamp_T
    )
    if expected_root != token.generation_root:
        raise CommitmentAmplificationRisk("World state drifted. Token invalid.")
    return redeem(token)
```

---

### ⚠️ The Image Embedding Stability Problem (And How You Solve It)

**The problem:**

```
User uploads ramen image
         ↓
Gemini generates embedding: [0.7823, 0.2341, 0.9012, ...]
         ↓
You hash this → abc123 → DCT signed with abc123

--- 20 mins later at redemption ---

Recompute embedding of same image → [0.7824, 0.2341, 0.9011, ...]
                                              ↑ slightly different float
Hash → xyz789  ≠  abc123
         ↓
TOKEN ALWAYS INVALID (false alarm — world didn't actually drift)
```

LLM embedding models are non-deterministic. Same image → slightly different floats every run. Naively hashing embeddings breaks your token every time, for the wrong reason.

**Three options — pick one:**

| Option | How | Pros | Cons |
|---|---|---|---|
| **✅ Option 1 (Recommended)** | Hash raw image bytes once at generation. Never re-embed at redemption. | Simple, deterministic, always stable | Image semantics not re-verified — but image doesn't change after upload anyway |
| Option 2 | Perceptual hash (pHash) the image directly | Stable across compression/format differences | Doesn't capture semantic meaning |
| Option 3 | Quantize embedding floats before hashing | Semantically meaningful | Need to tune decimal places carefully |

**Use Option 1. Here's why it's also the correct research choice:**

> The image is immutable once uploaded — the user uploads it once at generation time and it doesn't change. Re-embedding at redemption adds cryptographic instability without security benefit. Drift detection only needs to apply to the **mutable world state components** — inventory, pricing, and dietary constraints — which are the variables that actually change between generation and redemption time.

**Implementation:**

```python
def compute_generation_root(image_bytes, inventory, budget, dietary, timestamp):
    return {
        # image: hash raw bytes once — stable, never re-embed
        "image_hash": sha256(image_bytes).hexdigest(),

        # these three are your actual drift detectors
        # recomputed at redemption against live state
        "inventory_hash": sha256(
            json.dumps(inventory, sort_keys=True).encode()
        ).hexdigest(),
        "budget_hash": sha256(str(budget).encode()).hexdigest(),
        "dietary_hash": sha256(
            json.dumps(sorted(dietary)).encode()
        ).hexdigest(),

        "timestamp_T": timestamp
    }
```

**At generation:** compute all four hashes, store `image_hash` in DB alongside DCT.

**At redemption:** recompute only the bottom three against live state. Verify `image_hash` matches the stored value (tamper check, not drift check).

**One sentence for your paper:**
> *"The image embedding is captured once at generation time and its hash embedded in the GB-DCT; drift detection applies exclusively to the mutable world state components — inventory, pricing, and dietary constraints — which are the variables that actually change between generation and redemption time."*

---

### Phase 8 — Research Experiments (Week 4-5)

Run these scenarios and record results:

**Experiment 1: Constraint Failure Rate**
- Inject N false inventory states
- Measure: how often does LLM fail to catch it?
- Output: Table 1 — LLM constraint validation accuracy

**Experiment 2: Amplification Measurement**
- Standard DCT: how often does a constraint failure become a committed harm?
- GB-DCT: same test — does self-invalidation catch it?
- Output: Table 2 — harm surface reduction

**Experiment 3: World State Drift**
- Simulate realistic inventory changes between generation and redemption
- Measure: how often does GB-DCT self-invalidate correctly?
- Output: Table 3 — drift detection accuracy

**Experiment 4: Comparison Against Baselines**
- SAVER-style pre-commitment verification: catch rate?
- DART-style rollback: catch rate?
- GB-DCT: catch rate?
- Output: Table 4 — comparative defense evaluation

---

### Phase 9 — Frontend Polish + Demo (Week 5)

Make the research **visible** in the UI:

```
[AGENT STATUS]
✓ Analyzing uploaded ramen image...
✓ Extracting flavor profile: spicy, creamy, umami
✓ Checking inventory snapshot... [SNAPSHOT LOCKED]
✓ Budget validated: ₹270 < ₹300
✓ Generating GB-DCT with generation root hash...
⚠ World state drift detected at redemption — token invalidated
```

Judges and reviewers both need to **see** the system thinking.

---

## 📁 Folder Structure

```
grubtogo/
├── frontend/              → Next.js UI
│   └── components/
│       ├── ImageUpload
│       ├── DishCard
│       ├── DCTCountdown
│       └── AgentStatus    ← shows live constraint checking
│
├── backend/               → Node.js + Express
│   ├── routes/
│   │   ├── inventory.ts
│   │   ├── dct.ts
│   │   └── research/      ← research-only endpoints
│   │       ├── constraint-log.ts
│   │       └── drift-simulation.ts
│   └── lib/
│       └── gb-dct.ts      ← GB-DCT generation and validation
│
├── ai-service/            → Python LangGraph
│   ├── agents/
│   │   ├── image_analyzer.py
│   │   ├── recipe_generator.py
│   │   ├── constraint_validator.py  ← log everything here
│   │   └── dct_generator.py        ← GB-DCT root computation
│   └── tools/
│       ├── check_inventory.py
│       ├── estimate_cost.py
│       └── snapshot.py    ← world state snapshot at T
│
├── research/              ← paper artifacts
│   ├── experiments/
│   │   ├── constraint_failure_rate.py
│   │   ├── amplification_measurement.py
│   │   ├── drift_simulation.py
│   │   └── baseline_comparison.py
│   ├── data/              ← experimental results (CSV)
│   ├── figures/           ← plots for paper
│   └── paper/             ← LaTeX source
│
└── README.md              ← this file
```

---

## 🔑 Key Definitions (Keep These Sharp)

| Term | Definition |
|---|---|
| **Commitment Amplification** | The process by which cryptographic signing converts a soft probabilistic LLM constraint failure into a hard irreversible physical resource commitment |
| **Temporal Gap** | The interval between generation time (when constraints were checked) and redemption time (when physical resources are committed) |
| **Generation-Bound DCT (GB-DCT)** | A DCT whose signature is cryptographically derived from the multimodal generation parameters, making it self-invalidating if world state has drifted |
| **World State Drift** | A change in inventory, pricing, or constraint values between generation time and redemption time |
| **Generation Root** | The hash tuple of image embeddings, inventory snapshot, budget, and dietary rules at generation time T |

---

## 📚 Papers To Read (In Order)

1. **Tianxiao Li et al. (2026)** — Constraint State Governance ← closest competitor, read first
2. **TOPLOC (2025)** — arxiv 2501.16007 ← differentiate on purpose
3. **HDP (2026)** — arxiv 2604.04522 ← differentiate on identity vs state
4. **SAVER (2026)** — arxiv 2604.08401 ← pre-commitment verification baseline
5. **DART** — from autonomous agents survey ← rollback baseline
6. **Check Yourself Before You Wreck Yourself** — arxiv 2510.16492 ← agentic quitting
7. **When Refusals Fail** — arxiv 2512.02445 ← long context safety failures
8. **Constraint Violation Benchmark** — arxiv 2512.20798 ← formal constraint framing
9. **Attesting LLM Pipelines** — arxiv 2603.28988 ← cryptographic attestation context

---

## ⚡ Quick Status Checklist

Use this every time you sit down to work:

**Platform**
- [ ] Frontend UI running
- [ ] Backend APIs working
- [ ] PostgreSQL inventory seeded
- [ ] Basic Gemini recipe generation working
- [ ] Inventory-aware regeneration loop working
- [ ] Image upload + Gemini Vision working
- [ ] LangGraph orchestration working
- [ ] Standard DCT implemented
- [ ] GB-DCT implemented
- [ ] Research endpoints logging

**Research**
- [ ] Constraint failure rate experiment designed
- [ ] Deliberate failure injection working
- [ ] Drift simulation implemented
- [ ] Baseline comparisons coded
- [ ] Data collected
- [ ] Figures generated
- [ ] Paper draft started

---

## 🎯 One Paragraph To Remember Why This Matters

Traditional DCTs sign the *output* of an agentic pipeline. GB-DCTs sign the *world state that justified the output*. This distinction matters because LLMs are probabilistic — they can validate constraints correctly given what they knew, but what they knew may already be wrong or may become wrong before the physical world honors the commitment. By deriving the token from the generation parameters themselves, we make constraint staleness a cryptographic property rather than a business logic check — the token cannot survive a world it was not born into.

---

*GrubToGo — where the dining token knows the world it came from.*