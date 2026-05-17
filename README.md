# GrubToGo — Agentic AI Powered Custom Dish Generation & Secure Dining Orchestration

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
