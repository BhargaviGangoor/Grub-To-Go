# GrubToGo

## Agentic AI Powered Custom Dish Generation & Secure Dining Orchestration

---

# Vision

GrubToGo is an autonomous AI-driven dining platform that dynamically generates custom dishes based on:

* uploaded food inspirations
* user cravings/preferences
* restaurant inventory
* dietary restrictions
* kitchen feasibility
* budget constraints

Unlike traditional food ordering apps where users manually choose static dishes from a menu, GrubToGo uses Agentic AI workflows to autonomously synthesize entirely new dishes in real time.

After the dish is finalized, the system generates a secure Dining Commitment Token (DCT) — a cryptographically signed, expiring capability token that temporarily reserves inventory, locks pricing, and authorizes one-time kitchen preparation.

---

# Core Problem

Traditional restaurant systems are limited because:

* menus are static
* customization is minimal
* inventory utilization is inefficient
* food wastage occurs frequently
* fake/spam custom orders waste resources
* group dining coordination is chaotic

Users often want:

* personalized dishes
* cuisine fusion
* dietary-aware meals
* budget-constrained meals
* dishes inspired from social media food content

Restaurants struggle to dynamically create and securely manage such requests.

---

# Solution

GrubToGo introduces:

# Autonomous AI Dish Orchestration

Users can:

* upload food images
* choose existing dishes
* describe cravings/preferences
* specify dietary and budget constraints

The Agentic AI system then:

1. analyzes user intent
2. extracts food characteristics using multimodal AI
3. checks live inventory
4. estimates ingredient costs
5. validates kitchen feasibility
6. optimizes ingredient usage
7. generates a completely new custom dish
8. dynamically adjusts recipes if constraints fail

Once finalized, the system creates a:

# Dining Commitment Token (DCT)

The DCT securely:

* reserves ingredients
* locks pricing
* reserves kitchen preparation capacity
* prevents replay abuse
* expires automatically after a fixed duration

---

# Example Workflow

## User Prompt

> “Create a creamy vegetarian spicy noodle dish under ₹300 inspired by these uploaded ramen and pasta images.”

---

# Agent Workflow

analyze_images() →
extract_flavor_profiles() →
check_inventory() →
estimate_cost() →
generate_custom_recipe() →
validate_budget() →
optimize_quantities() →
reserve_ingredients() →
generate_DCT()

---

# Example Generated Dish

## “Spicy Creamy Paneer Chili Udon”

Generated using:

* available inventory
* budget constraints
* flavor analysis
* kitchen feasibility

Estimated Cost:

* ₹270

Estimated Prep Time:

* 18 mins

---

# Dining Commitment Token (DCT)

Example:

DCT-CUSTOM-X82A

* Dish: Spicy Creamy Paneer Chili Udon
* Reserved Ingredients Locked
* Price Locked: ₹270
* Valid: 20 mins

---

# Why DCT Exists

Without DCT:

* users could spam custom dishes
* inventory could get abused
* kitchens could waste ingredients
* pricing could fluctuate

The DCT acts like:

# A temporary AI-generated preparation contract.

---

# Core AI Concepts Used

## 1. Agentic AI

The AI does NOT generate a single response.

Instead, it autonomously executes:

* reasoning loops
* retries
* tool orchestration
* decision chains
* stateful workflows

### Concepts

* ReAct agents
* Tool calling
* Stateful orchestration
* Autonomous retries
* Constraint-based reasoning
* Multi-step planning

---

## 2. Multimodal AI

The platform uses vision-enabled models to understand uploaded food images.

Capabilities:

* flavor profile extraction
* cuisine understanding
* texture/style analysis
* ingredient estimation
* plating inspiration

---

## 3. Constraint Optimization

The AI continuously balances:

* inventory availability
* dietary restrictions
* kitchen feasibility
* budget constraints
* ingredient optimization
* food wastage reduction

---

## 4. Tool Orchestration

The AI agent autonomously calls backend tools/functions.

Example:

```python
check_inventory()
estimate_cost()
generate_recipe()
validate_feasibility()
reserve_ingredients()
generate_dct()
```

---

# Cybersecurity Architecture

## Capability-Based Security

The Dining Commitment Token (DCT) is implemented as:

# A cryptographically signed, expiring capability token.

The token grants LIMITED permissions to:

* reserve ingredients
* authorize kitchen preparation
* redeem locked pricing
* perform one-time preparation actions

This architecture is inspired by:

* cloud temporary credentials
* signed access URLs
* distributed authorization systems
* API capability security

---

## Replay Attack Prevention

Each DCT:

* has a unique identifier
* can only be redeemed once
* expires automatically

This prevents:

* duplicate redemption
* replay attacks
* reservation abuse
* inventory exhaustion

---

## Cryptographic Signing

DCTs are cryptographically signed.

This prevents:

* token tampering
* forged reservations
* modified pricing
* unauthorized dish manipulation

---

## Distributed Resource Locking

Temporary inventory locking ensures:

* synchronized ingredient reservation
* prevention of overbooking
* real-time kitchen coordination

Redis-based distributed locks manage temporary state consistency.

---

# Complete User Flow

## Step 1

User:

* uploads food images
  OR
* selects dishes
  OR
* describes cravings

---

## Step 2

AI analyzes:

* flavors
* cuisine style
* texture
* budget
* dietary constraints

---

## Step 3

Agentic orchestration begins:

plan() →
check_inventory() →
generate_recipe() →
calculate_cost() →
validate_constraints() →
optimize_recipe() →
if invalid → regenerate()

---

## Step 4

AI finalizes custom dish.

---

## Step 5

DCT generated.

---

## Step 6

Inventory temporarily locked.

---

## Step 7

Kitchen validates DCT and prepares dish.

---

# Tech Stack

# Frontend

* Next.js
* React
* TypeScript
* TailwindCSS

Purpose:

* image uploads
* live AI generation
* dynamic UI
* DCT countdown timers
* responsive modern interface

---

# Backend

* Node.js
* Express.js
* TypeScript
* WebSockets

Purpose:

* API orchestration
* inventory management
* DCT validation
* real-time updates
* frontend/backend communication

---

# AI Microservice

* Python
* LangGraph
* Gemini API

Purpose:

* multimodal reasoning
* agentic orchestration
* stateful workflows
* retries and tool calling
* autonomous recipe generation

---

# Database

* PostgreSQL

Stores:

* inventory
* recipes
* users
* DCTs
* reservations

---

# Real-Time Systems

* Redis

Used for:

* temporary inventory locks
* DCT expiry management
* active kitchen queues
* distributed state synchronization

---

# Cybersecurity Stack

* JWT
* PyJWT
* HMAC signing
* Redis distributed locks
* Replay prevention
* Capability-based security

---

# System Architecture

# Layer 1 — Frontend

User interaction.

---

# Layer 2 — Backend Layer

Node.js + Express APIs.

---

# Layer 3 — Agent Orchestrator

Python LangGraph autonomous workflows.

---

# Layer 4 — Tool Layer

Inventory APIs.
Cost estimation.
Recipe generation.
Kitchen feasibility.

---

# Layer 5 — Security Layer

DCT generation and validation.

---

# Layer 6 — Database Layer

Persistent storage and inventory state.

---

# MVP (Minimum Viable Product)

DO NOT build everything initially.

The MVP should ONLY include:

## MUST HAVE

* image upload
* AI dish generation
* inventory-aware recipe validation
* budget validation
* dietary filtering
* DCT generation
* token expiration
* simple frontend UI

That alone is enough for a strong demo.

---

# Recommended Build Order

| Priority | Build                           |
| -------- | ------------------------------- |
| 1        | Next.js frontend UI             |
| 2        | Node.js + Express backend       |
| 3        | PostgreSQL inventory system     |
| 4        | Simple Gemini recipe generation |
| 5        | Inventory-aware regeneration    |
| 6        | Image upload + Gemini Vision    |
| 7        | LangGraph orchestration         |
| 8        | DCT security layer              |
| 9        | Frontend polish                 |
| 10       | Optional advanced features      |

---

# Recommended Folder Structure

```text
frontend/      → Next.js frontend
backend/       → Node.js + Express APIs
ai-service/    → Python LangGraph orchestration
```

This keeps:

* frontend modular
* backend scalable
* AI workflows isolated
* debugging easier

---

# Detailed Project Building Roadmap

# Phase 1 — Frontend Foundation

## Goal

Build the user interface FIRST.

### Build:

* homepage
* image upload section
* prompt input
* dietary filters
* budget input
* generated dish cards
* DCT display section

### Stack

* Next.js
* React
* TailwindCSS

---

# Phase 2 — Backend Foundation

## Goal

Build APIs and inventory system BEFORE advanced AI orchestration.

### Build:

* Express backend
* PostgreSQL setup
* Inventory APIs
* Menu APIs
* DCT APIs

### APIs Needed

```python
GET /menu
POST /menu
GET /inventory
UPDATE /inventory
POST /generate-dish
POST /generate-dct
POST /redeem-dct
```

---

# Phase 3 — Basic AI Generation

## Goal

Prove recipe generation works.

### Use:

* Gemini API

### Input Example

"Creamy vegetarian spicy noodle dish under ₹300"

### Output

* recipe
* ingredients
* quantities
* estimated cost

---

# Phase 4 — Inventory Awareness

## Goal

Make AI validate real inventory.

### Flow

1. AI generates dish
2. Backend checks inventory
3. If ingredients unavailable:
   regenerate recipe

### Example Loop

```python
while not inventory_valid:
    regenerate_recipe()
```

This becomes your FIRST real agentic workflow.

---

# Phase 5 — Multimodal AI

## Goal

Enable image-based inspiration.

### Features

* image upload
* Gemini Vision analysis
* flavor extraction
* cuisine style understanding

The AI should infer:

* textures
* flavors
* cuisine types
* ingredient inspirations

---

# Phase 6 — Full Agentic Orchestration

## Goal

Implement real autonomous workflows.

### Use:

* LangGraph

### LangGraph Nodes

Analyze User Input
↓
Analyze Food Images
↓
Generate Recipe
↓
Check Inventory
↓
Estimate Cost
↓
Validate Constraints
↓
Generate DCT

---

# Phase 7 — DCT Security System

## Goal

Implement secure capability tokens.

### DCT Payload Example

```json
{
  "dish_id": "dish_91",
  "locked_inventory": ["paneer", "udon"],
  "price": 270,
  "expiry": "2026-05-17T18:00",
  "redeem_once": true
}
```

### Features

* signed tokens
* expiry validation
* replay prevention
* Redis inventory locking

---

# Phase 8 — Frontend Intelligence & UX

## Features

* image uploads
* live AI generation
* generated dish cards
* DCT countdown timers
* live agent reasoning status

### Example Live Status

Checking inventory...
Optimizing recipe...
Generating custom dish...
Validating budget...
Generating DCT...

This makes the AI visibly “think”.

---

# Phase 9 — Demo Polish

## Judges care about visible intelligence.

The system should visibly:

* retry
* regenerate
* optimize
* validate constraints
* dynamically adapt

That makes the project feel truly agentic.

---

# Optional Advanced Features

## AI Token Negotiation

Ingredient unavailable?
AI proposes alternatives.

---

## Kitchen Queue Optimization

AI balances prep load.

---

## AI Wastage Reduction

Predicts excess food generation.

---

## Group Collaborative Ordering

Multiple users modify meal live.

---

# Biggest Advice

DO NOT overbuild.

Your innovation is NOT:

* perfect food generation
* chef-level AI
* blockchain gimmicks

Your REAL innovation is:

# autonomous AI orchestration + secure capability-based dining workflows.

---

# Questions To Ask Claude / Perplexity

## Novelty Validation Prompt

"Does there exist any startup or research system where multimodal agentic AI generates entirely new restaurant dishes dynamically from user-uploaded food inspirations while considering inventory, budget, and kitchen feasibility, followed by cryptographically secured temporary preparation tokens?"

---

## Competitor Comparison Prompt

"Compare my GrubToGo idea against existing AI recipe generators and restaurant AI systems. Is autonomous inventory-aware custom dish synthesis with secure Dining Commitment Tokens novel?"

---

## Technical Validation Prompt

"Is the combination of ReAct-style autonomous meal generation agents, multimodal food understanding, distributed inventory locking, and capability-based Dining Commitment Tokens a commercially existing architecture?"

---

# Final Project Positioning

GrubToGo is not a traditional food ordering platform.

Its primary innovation is:

# autonomous AI-driven custom dish synthesis combined with secure capability-token-based dining orchestration.

The platform transforms restaurant ordering into a real-time intelligent orchestration system capable of dynamically generating feasible custom meals while securely coordinating inventory, pricing, and preparation workflows.



![GitHub license](https://img.shields.io/github/license/BhargaviGangoor/Grub-To-Go)
![GitHub stars](https://img.shields.io/github/stars/BhargaviGangoor/Grub-To-Go?style=social)

---

## Table of Contents
- [Overview](#overview)
- [Core Problem](#core-problem)
- [Solution](#solution)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Overview

GrubToGo is an autonomous AI-driven dining platform that dynamically generates custom dishes based on user preferences, uploaded food inspirations, restaurant inventory, dietary constraints, and budget limitations.

Unlike traditional food ordering systems where users manually choose from static menus, GrubToGo uses Agentic AI workflows to autonomously reason through multiple constraints and synthesize entirely new dishes in real time.

After a custom dish is finalized, the system generates a secure Dining Commitment Token (DCT) — a cryptographically signed, expiring capability token that temporarily reserves ingredients, locks dynamic pricing, and authorizes one-time kitchen preparation.

The project combines:

* Agentic AI
* Multimodal AI
* Secure capability-based architecture
* Distributed inventory locking
* Real-time orchestration
* Cybersecurity concepts used in industry systems

---

# Core Problem

Traditional restaurant systems are static:

* limited menu flexibility
* manual customization
* inefficient inventory utilization
* food wastage
* reservation abuse
* fake or spam custom orders

Customers often want:

* personalized dishes
* cuisine fusion
* dietary-aware meals
* budget-constrained combinations
* dishes inspired from online food content

But restaurants struggle to dynamically create and safely manage such requests in real time.

---

# Solution

GrubToGo introduces:

## Autonomous AI Dish Orchestration

Users can:

* upload food images
* select existing menu items
* describe cravings/preferences
* specify dietary and budget constraints

The Agentic AI system then:

1. analyzes user intent
2. extracts food characteristics using multimodal AI
3. checks live inventory
4. estimates ingredient costs
5. validates kitchen feasibility
6. optimizes ingredient usage
7. generates a completely new custom dish
8. dynamically adjusts recipes if constraints fail

Once finalized, the system creates a:

# Dining Commitment Token (DCT)

The DCT securely:

* reserves ingredients
* locks pricing
* reserves kitchen preparation capacity
* prevents replay abuse
* expires automatically after a fixed duration

---

# Example Workflow

User Prompt:

> “Create a creamy vegetarian spicy noodle dish under ₹300 inspired by these uploaded ramen and pasta images.”

Agent Workflow:
analyze_images() →
extract_flavor_profiles() →
check_inventory() →
estimate_cost() →
generate_custom_recipe() →
validate_budget() →
optimize_quantities() →
reserve_ingredients() →
generate_DCT()

Generated Dish:

> “Spicy Creamy Paneer Chili Udon”

Generated DCT:

* valid for 20 minutes
* locks inventory
* authorizes one-time preparation
* cryptographically signed

---

# AI Concepts Used

## Agentic AI

The AI does not generate a single response.
Instead, it autonomously executes multi-step reasoning loops and tool orchestration workflows.

Concepts:

* ReAct agents
* Tool calling
* Stateful orchestration
* Autonomous retries
* Constraint-based reasoning
* Multi-step planning

---

## Multimodal AI

The platform uses vision-enabled models to understand uploaded food images.

Capabilities:

* flavor profile extraction
* cuisine understanding
* texture/style analysis
* ingredient estimation
* plating inspiration

---

## Constraint Optimization

The AI continuously balances:

* inventory availability
* dietary restrictions
* kitchen feasibility
* budget constraints
* ingredient optimization
* food wastage reduction

---

# Cybersecurity Architecture

## Capability-Based Security

The Dining Commitment Token (DCT) is implemented as a cryptographically signed capability token.

The token grants limited permissions to:

* reserve ingredients
* authorize kitchen preparation
* redeem locked pricing
* perform one-time preparation actions

This architecture is inspired by industry systems used in:

* cloud temporary credentials
* signed access URLs
* distributed authorization systems

---

## Replay Attack Prevention

Each DCT:

* has a unique identifier
* can only be redeemed once
* expires automatically

This prevents:

* duplicate redemption
* reservation replay attacks
* inventory abuse

---

## Cryptographic Signing

DCTs are cryptographically signed using secure token signing mechanisms.

This prevents:

* token tampering
* forged reservations
* modified pricing
* unauthorized dish manipulation

---

## Distributed Resource Locking

Temporary inventory locking ensures:

* synchronized ingredient reservation
* prevention of overbooking
* real-time kitchen coordination

Redis-based distributed locks manage temporary state consistency.

---

# Tech Stack

## Frontend

* Next.js
* React
* TailwindCSS

---

## Backend

* FastAPI
* WebSockets

---

## AI & Orchestration

* Gemini API / OpenAI API
* LangGraph
* Tool orchestration pipelines

---

## Database

* PostgreSQL

---

## Real-Time Systems

* Redis
* Distributed locking
* Token expiry management

---

## Cybersecurity

* JWT / signed tokens
* PyJWT
* HMAC / cryptographic signing
* Replay protection mechanisms

---

# Key Innovation

GrubToGo is not a traditional food ordering platform.

Its primary innovation is:

## autonomous AI-driven custom dish synthesis combined with secure dining capability tokens.

The platform transforms restaurant ordering into a real-time intelligent orchestration system capable of dynamically generating feasible custom meals while securely coordinating inventory, pricing, and preparation workflows.
