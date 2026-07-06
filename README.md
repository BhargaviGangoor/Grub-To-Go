# 🍜 GrubToGo

# AI-Powered Agentic Restaurant Ordering Platform

## Project Vision

GrubToGo is an **Agentic AI-powered restaurant ordering platform** that acts like a personal dining assistant.

Unlike traditional food-ordering applications where users manually browse menus, GrubToGo allows users to simply describe what they want.

Examples:

* "I want a spicy vegetarian dinner under ₹300."
* "Suggest something high in protein."
* "I loved this dish." *(upload an image)*
* "I'm allergic to peanuts."
* "Order dinner for four."

The AI understands preferences, reasons over restaurant inventory, validates constraints, and autonomously recommends or places orders.

The primary focus of this project is building a **production-style full-stack Agentic AI application** using modern technologies.

A secondary goal is to evolve the project into a research platform for secure AI systems through cryptographic commitment mechanisms.

---

# Primary Goal (Version 1)

Build a complete AI-powered restaurant ordering system that demonstrates:

* Modern React frontend
* Backend API architecture
* Agentic AI workflows
* LLM integration
* Database integration
* Authentication
* Real-world deployment
* Production-ready software engineering

The project should feel like a startup-quality application rather than a tutorial project.

---

# Core Features

## User Authentication

* JWT Authentication
* Register
* Login
* Logout
* Protected Routes
* User Profiles

---

## AI Restaurant Assistant

Users should be able to interact naturally.

Example:

> I want a spicy South Indian dinner under ₹250.

The AI should understand:

* cuisine
* budget
* dietary restrictions
* allergies
* preferences
* meal type
* number of people

---

## Image-Based Recommendations

Users can upload:

* food photos
* restaurant dishes
* screenshots

The AI analyzes:

* cuisine
* ingredients
* visual similarity
* flavor profile

and recommends similar dishes.

---

## Personalized Recommendations

The AI should consider:

* budget
* allergies
* vegetarian/non-vegetarian
* cuisine
* spice level
* nutritional preferences
* calorie limits

---

## Inventory Awareness

The system should validate whether ingredients or menu items are currently available.

If unavailable:

* regenerate recommendations
* explain why

---

## Explainable AI

Instead of only returning results, the AI should explain:

* why a dish was selected
* why another dish was rejected
* which constraints were considered

---

## Autonomous Ordering

Eventually the AI should be capable of:

* selecting dishes
* confirming choices
* generating an order
* preparing it for checkout

---

# Agentic AI Architecture

The application should use **LangGraph** for orchestration.

Suggested workflow:

User

↓

Planner Agent

↓

Intent Detection

↓

Image Analysis Agent (optional)

↓

Menu Retrieval Agent

↓

Inventory Agent

↓

Pricing Agent

↓

Constraint Validation Agent

↓

Recommendation Agent

↓

Response Generator

Each agent should have a clear responsibility.

Avoid placing all logic inside one prompt.

---

# Technology Stack

## Frontend

* React
* Next.js
* TypeScript
* Tailwind CSS
* shadcn/ui
* Zustand

---

## Backend

* Node.js
* Express.js
* TypeScript

---

## Database

* PostgreSQL

ORM

* Prisma

Caching

* Redis

---

## AI

* Gemini API
* Gemini Vision
* LangGraph

Future

* Embeddings
* Vector Search

---

## Authentication

* JWT
* bcrypt

---

## Deployment

Frontend

* Vercel

Backend

* Railway or Render

Database

* Neon PostgreSQL

Caching

* Redis Cloud

---

# Folder Structure

grubtogo/

frontend/

backend/

agents/

database/

auth/

inventory/

ai/

utils/

docs/

research/

---

# Development Roadmap

## Phase 1

Frontend

Build:

* Landing Page
* Login
* Register
* Chat Interface
* Menu Page
* User Dashboard

Deliverable:

Working frontend.

---

## Phase 2

Backend

Build:

* Express server
* Authentication
* User APIs
* Menu APIs
* Order APIs

Deliverable:

Frontend connected to backend.

---

## Phase 3

Database

Implement:

* PostgreSQL
* Prisma
* Users
* Restaurants
* Menu
* Orders

Deliverable:

Persistent data storage.

---

## Phase 4

Gemini Integration

Implement:

* Chatbot
* Dish recommendation
* Budget handling
* Dietary constraints

Deliverable:

Working AI assistant.

---

## Phase 5

Agentic Workflow

Create specialized agents:

* Planner Agent
* Image Agent
* Inventory Agent
* Pricing Agent
* Recommendation Agent

Deliverable:

End-to-end LangGraph workflow.

---

## Phase 6

Inventory Validation

Before recommendations:

* verify availability
* regenerate if necessary

Deliverable:

Inventory-aware recommendations.

---

## Phase 7

Image Understanding

Allow users to upload food images.

Gemini Vision should identify:

* cuisine
* ingredients
* style

Deliverable:

Multimodal recommendations.

---

## Phase 8

Deployment

Deploy:

* frontend
* backend
* database

Configure:

* environment variables
* logging
* error handling

Deliverable:

Public production deployment.

---

# Version 2 (Security Research)

The security research should **NOT** dominate Version 1.

Instead, create a separate module called **Research Lab**.

This module will later include:

* Generation-Bound Dynamic Commitment Tokens (GB-DCT)
* Commitment Amplification
* Temporal Gap Analysis
* AI Artifact Binding
* Drift Validation
* Cryptographic Commitments

The rest of the application should remain independent of this research module.

---

# Code Quality Requirements

Use:

* Clean Architecture
* SOLID Principles
* Modular components
* Reusable hooks
* TypeScript everywhere
* Environment variables
* API validation
* Error handling
* Loading states
* Proper folder organization

Avoid writing everything inside a few large files.

---

# Git Strategy

Make small, meaningful commits.

Examples:

* feat(auth): add JWT login
* feat(chat): integrate Gemini API
* feat(agent): add inventory agent
* feat(ui): create chat interface
* fix(api): improve error handling
* refactor(menu): modularize menu service

---

# Long-Term Vision

GrubToGo should eventually become both:

1. A production-quality AI-powered restaurant ordering platform.

2. A research platform for studying secure Agentic AI systems and trustworthy AI decision making through cryptographic commitment mechanisms.

The immediate focus, however, should be on building an excellent AI application first. The security research layer will be added incrementally after the core product is complete.
