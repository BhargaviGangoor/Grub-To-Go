# 🍜 GrubToGo

## Agentic AI-Powered Custom Dish Generation & Secure Dining Orchestration

## https://grub-to-i8k5csnfl-bhargavi-gangoors-projects.vercel.app/

GrubToGo is an AI-powered platform that generates personalized dishes from user preferences, budgets, dietary constraints, and food images while ensuring that recommendations remain secure, explainable, and valid when redeemed in the real world.

The project serves two purposes:

1. **A Full-Stack Agentic AI Application**
2. **A Security Research Testbed for Agentic Systems**

---

# 🎯 Research Motivation

Modern AI agents are increasingly making decisions that affect real-world resources.

Examples include:

* Food ordering
* Resource reservations
* Inventory allocation
* Financial transactions
* Autonomous workflows

These systems typically:

1. Gather information
2. Validate constraints
3. Generate decisions
4. Commit actions

The problem is that AI systems are probabilistic and may operate on:

* Stale inventory
* Outdated pricing
* Incorrect retrieval results
* Incomplete information
* Hallucinated assumptions

Once a cryptographic commitment is created, the mistake becomes significantly harder to reverse.

---

# 🧠 Core Research Idea

## Commitment Amplification

**Commitment Amplification** is the process by which cryptographic commitments transform uncertain AI validation results into irreversible real-world actions.

```text
AI Validation
     ↓
Cryptographic Commitment
     ↓
Resource Reservation
     ↓
Financial / Physical Consequence
```

A small AI mistake can become a hard commitment once signed and redeemed.

---

# ⏳ The Temporal Gap

The key attack surface is the interval between generation and redemption.

```text
Generation Time
       ↓
  Temporal Gap
       ↓
Redemption Time
```

Example:

### Generation

* Paneer available
* Price = ₹270
* Dietary constraints satisfied

AI generates a recipe.

A commitment token is issued.

### Redemption

* Paneer out of stock
* Price increased
* Ingredient source changed

The commitment still exists even though the world state has changed.

---

# 🔐 Generation-Bound Dynamic Commitment Tokens (GB-DCT)

Traditional systems sign only the final action.

```text
Order Paneer Noodles
```

GrubToGo binds the commitment to:

### 1. World State

* Inventory snapshot
* Pricing snapshot
* Dietary constraints
* Generation timestamp

### 2. AI Decision Artifact

The structured artifact that produced the recommendation.

Examples:

* Recipe Graph
* Decision Graph
* Planning Graph
* Constraint Validation Graph

### 3. Final Action

The action being committed.

---

# 🏗 Generation Root

At generation time:

```text
GenerationRoot =
H(
    InventorySnapshotHash ||
    PricingSnapshotHash ||
    DietaryHash ||
    AIArtifactRoot ||
    Timestamp
)
```

The Generation Root captures the exact state under which the recommendation was created.

---

# 🎫 Dynamic Commitment Token (DCT)

```text
DCT =
HMAC(
    GenerationRoot ||
    Action,
    SecretKey
)
```

The resulting token is bound to:

* What the AI decided
* Why the AI decided it
* What the world looked like
* When the decision was generated

---

# 🤖 AI Artifact Binding

Most systems commit only to the final output.

```text
Action
```

GrubToGo commits to:

```text
Action
+
World State
+
AI Decision Artifact
```

This ensures that:

* Different reasoning paths generate different tokens
* Different inventory conditions generate different tokens
* Different constraints generate different tokens

Even if the final dish appears identical.

---

# ❓ Research Questions

### RQ1

How often do AI agents incorrectly validate constraints?

### RQ2

How often do those failures become irreversible commitments?

### RQ3

How frequently does world state drift between generation and redemption?

### RQ4

Can Generation-Bound DCT reduce harmful commitments caused by state drift?

### RQ5

Does AI Artifact Binding improve traceability and accountability?

---

# 🏛 System Architecture

```text
User
 │
 ▼
Image Upload
 │
 ▼
AI Analysis
 │
 ▼
Recipe Generation
 │
 ▼
Constraint Validation
 │
 ├── Inventory Check
 ├── Pricing Check
 └── Dietary Check
 │
 ▼
AI Artifact Creation
 │
 ▼
Generation Root Creation
 │
 ▼
GB-DCT Generation
 │
 ▼
Redemption
 │
 ▼
Drift Validation
```

---

# ⚙️ Technology Stack

## Frontend

### Framework

* Next.js 15
* React
* TypeScript

### UI

* Tailwind CSS
* shadcn/ui

### State Management

* Zustand

---

## Backend

### API Layer

* Node.js
* Express.js
* TypeScript

### Database

* PostgreSQL

### ORM

* Prisma

### Caching

* Redis

---

## AI Layer

### LLM

* Gemini 2.5 Pro

### Vision

* Gemini Vision

### Agent Framework

* LangGraph

### Embeddings

* Gemini Embeddings

---

## Security Layer

### Hashing

* SHA-256

### Signing

* HMAC-SHA256

### Token Validation

* Custom GB-DCT Validator

---

# 🚀 Development Roadmap

## Phase 1 — Frontend Development

Build:

* Homepage
* Image Upload
* Prompt Input
* Dish Cards
* Token Display

### Deliverable

Working frontend prototype.

---

## Phase 2 — Backend APIs

Build:

```http
GET  /menu
GET  /inventory
POST /generate-dish
POST /generate-dct
POST /redeem-dct
POST /validate-dct
```

### Deliverable

Frontend connected to backend.

---

## Phase 3 — AI Dish Generation

Input:

```text
Spicy vegetarian noodles under ₹300
```

Output:

* Recipe
* Ingredients
* Cost estimate

### Deliverable

Basic AI generation working.

---

## Phase 4 — Inventory Awareness

Integrate:

* PostgreSQL inventory database
* Live inventory checks

Workflow:

```text
Generate
 ↓
Validate
 ↓
Regenerate if invalid
```

### Deliverable

Inventory-aware dish generation.

---

## Phase 5 — Multimodal AI

User uploads food images.

Extract:

* Cuisine style
* Flavor profile
* Ingredient inspiration

### Deliverable

Multimodal recommendation engine.

---

## Phase 6 — Agentic Workflow

LangGraph pipeline:

```text
Analyze Image
      ↓
Generate Recipe
      ↓
Check Inventory
      ↓
Estimate Cost
      ↓
Validate Constraints
      ↓
Create AI Artifact
      ↓
Generate DCT
```

### Deliverable

End-to-end agent workflow.

---

## Phase 7 — AI Artifact Binding

Create structured decision artifacts:

* Recipe Graph
* Planning Graph
* Constraint Graph

Compute:

```text
AIArtifactRoot
```

Store alongside generation metadata.

### Deliverable

Artifact-bound commitments.

---

## Phase 8 — Generation-Bound DCT

Generate:

```text
GenerationRoot
```

Create:

```text
DCT = HMAC(...)
```

Validate during redemption.

### Deliverable

Working GB-DCT security layer.

---

## Phase 9 — Research Experiments

### Experiment 1

Constraint validation accuracy.

### Experiment 2

Commitment amplification rate.

### Experiment 3

World-state drift simulation.

### Experiment 4

GB-DCT effectiveness.

### Deliverable

Research datasets, figures, and paper results.

---

# 📊 Expected Outputs

## Platform

* Personalized dish generation
* Inventory-aware recommendations
* Secure redemption tokens
* Explainable AI reasoning

## Research

* Formalization of Commitment Amplification
* Temporal Gap analysis
* Generation-Bound DCT evaluation
* AI Artifact Binding evaluation

---

# 📝 One-Line Summary

**GrubToGo studies how AI-generated decisions become irreversible real-world commitments and introduces Generation-Bound Dynamic Commitment Tokens (GB-DCTs) that bind actions to both world state and AI decision artifacts to reduce commitment amplification risks in agentic AI systems.**
