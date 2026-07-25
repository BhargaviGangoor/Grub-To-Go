import { LLMProvider } from "../llm/LLMProvider.interface";
import { MenuTool } from "../tools/MenuTool";
import { InventoryTool } from "../tools/InventoryTool";
import { DCTTool } from "../tools/DCTTool";
import { OrderTool } from "../tools/OrderTool";
import { AgentPolicyGate } from "./AgentPolicyGate";
import {
  UserIntent,
  OrderAuthorization,
  SemanticPreferences,
  MenuItemData,
  PlannerResult,
  AgentStep,
  AgentState,
  AgentAction,
  AgentObservation,
  ItemType,
  MealType,
  PreferredCategory,
} from "../types/agent.types";

/**
 * PlannerAgent.ts
 *
 * Autonomous Reasoning & Orchestration Layer.
 *
 * Implements a bounded Reason → Act → Observe → Update State → Replan → Execute loop.
 *
 * Key Architectural Guarantees:
 *   1. Hard Constraints vs Semantic Preferences Separation:
 *      - Hard Constraints (maxBudget, dietary, excludedIngredients) are frozen in OrderAuthorization.
 *        Violations = Hard Policy Block (AUTHORIZATION_DRIFT).
 *      - Semantic Preferences (itemType, mealType, preferredCategory, desiredAttributes) drive Semantic Goal Ranking.
 *        Does NOT silently relax hard constraints; ensures "something vegetarian under ₹300" picks a food meal, not Espresso!
 *   2. Single Reasoning Agent: Uses multiple deterministic tools (MenuTool, InventoryTool, DCTTool, OrderTool).
 *   3. GB-DCT Commitment Gate: OrderTool can ONLY be invoked after explicit cryptographic GB-DCT state attestation.
 *   4. Zero Hallucination: All dish facts originate deterministically from MongoDB. LLM candidate reranking is strictly checked against real candidate IDs.
 *   5. Loop Safety: Enforces MAX_STEPS = 10 and MAX_REPLANS = 3 bounds.
 */

const MAX_STEPS = 10;
const MAX_REPLANS = 3;

const BEVERAGE_IDS = [
  "fr-023", // Café au Lait
  "fr-024", // Espresso
  "fr-025", // Chocolat Chaud
  "fr-026", // Thé
  "fr-027", // Jus d’Orange Pressé
  "fr-028", // Vin Maison
];

import { agentStreamManager } from "../services/AgentStreamManager";
import { AgentUIEvent } from "../types/AgentUIEvent";

export class PlannerAgent {
  constructor(
    private readonly llm: LLMProvider,
    private readonly menuTool: MenuTool,
    private readonly inventoryTool: InventoryTool,
    private readonly dctTool: DCTTool,
    private readonly orderTool: OrderTool
  ) {}

  private emitUIEvent(event: AgentUIEvent) {
    if (event.runId) {
      agentStreamManager.emitEvent(event);
    }
  }

  // ─── Main Entry Point ────────────────────────────────────────────────────────

  async process(userMessage: string, runId?: string): Promise<PlannerResult> {
    const activeRunId = runId || `run_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const steps: AgentStep[] = [];

    this.emitUIEvent({
      runId: activeRunId,
      type: "AGENT_STARTED",
      timestamp: Date.now(),
      goal: userMessage,
    });

    // 1. Extract intent & semantic preferences from natural language
    const intent = await this.extractIntent(userMessage);
    console.log(`[PlannerAgent] Extracted Intent: ${intent.intent}`);

    steps.push({
      title: "🎯 Intent & Semantic Analysis",
      detail: `Intent: ${intent.intent}${
        intent.intent === "ORDER_FOOD"
          ? ` | Goal: ${intent.preferences.itemType || "FOOD"} (${intent.preferences.mealType || "ANY"}), Budget: ₹${
              intent.constraints.maxBudget ?? "Unlimited"
            }, Diet: [${intent.constraints.dietary?.join(", ") || "Any"}]`
          : " | General conversational query"
      }`,
      status: "success",
    });

    // Route non-ORDER_FOOD queries to LLM chat
    if (intent.intent !== "ORDER_FOOD") {
      console.log(`[PlannerAgent] Non-ordering intent detected (${intent.intent}). Routing to general chat.`);
      const reply = await this.llm.chat(userMessage);

      steps.push({
        title: "💬 LLM Knowledge Response",
        detail: "Answered user query using Groq LLM general food knowledge",
        status: "info",
      });

      return {
        success: true,
        message: reply,
        agentSteps: steps,
      };
    }

    // 2. Initialize explicit Autonomous Agent State
    const frozenAuthorization: OrderAuthorization = Object.freeze({
      maxBudget: intent.constraints.maxBudget,
      dietary: intent.constraints.dietary ? [...intent.constraints.dietary] : [],
      excludedIngredients: intent.constraints.excludedIngredients
        ? [...intent.constraints.excludedIngredients]
        : [],
      spiceLevel: intent.constraints.spiceLevel,
      cuisine: intent.constraints.cuisine,
      dishNameQuery: intent.constraints.dishNameQuery,
      softPreferences: intent.constraints.softPreferences
        ? [...intent.constraints.softPreferences]
        : [],
    });

    const frozenPreferences: SemanticPreferences = Object.freeze({
      itemType: intent.preferences.itemType || "FOOD",
      mealType: intent.preferences.mealType || "ANY",
      preferredCategory: intent.preferences.preferredCategory || "ANY",
      desiredAttributes: intent.preferences.desiredAttributes
        ? [...intent.preferences.desiredAttributes]
        : [],
      preferCheapest: intent.preferences.preferCheapest ?? false,
    });

    const state: AgentState = {
      originalRequest: userMessage,
      intent: intent.intent,
      authorization: frozenAuthorization,
      preferences: frozenPreferences,
      candidates: [],
      attemptedDishIds: [],
      observations: [],
      replanCount: 0,
      stepCount: 0,
      status: "PLANNING",
    };

    console.log(`[PlannerAgent] Immutable Authorization:`, JSON.stringify(frozenAuthorization));
    console.log(`[PlannerAgent] Semantic Preferences:`, JSON.stringify(frozenPreferences));

    // 3. Execute Autonomous Reasoning Loop
    return await this.runAutonomousLoop(state, steps, activeRunId);
  }

  // In-memory LRU cache to prevent duplicate LLM calls and conserve tokens
  private static intentCache = new Map<string, UserIntent>();

  // ─── Intent Extraction ───────────────────────────────────────────────────────

  private async extractIntent(userMessage: string): Promise<UserIntent> {
    const cacheKey = userMessage.trim().toLowerCase();
    if (PlannerAgent.intentCache.has(cacheKey)) {
      console.log(`[PlannerAgent] ⚡ Intent cache hit for: "${userMessage}" (0 tokens consumed)`);
      return PlannerAgent.intentCache.get(cacheKey)!;
    }

    // ⚡ Fast Deterministic Parser (Zero Token Consumption)
    const fastParsed = this.tryFastLocalParse(userMessage);
    if (fastParsed) {
      console.log(`[PlannerAgent] ⚡ Fast local parser resolved intent for: "${userMessage}" (0 tokens consumed)`);
      PlannerAgent.intentCache.set(cacheKey, fastParsed);
      return fastParsed;
    }

    // Compact Token-Minimized LLM Prompt
    const prompt = `Analyze user food order message: "${userMessage.replace(/"/g, "'")}"
Return ONLY JSON:
{
  "intent": "ORDER_FOOD" | "RECIPE_REQUEST" | "GENERAL_CHAT",
  "constraints": { "maxBudget": number|null, "dietary": string[], "excludedIngredients": string[] },
  "preferences": { "itemType": "FOOD"|"BEVERAGE"|"ANY", "mealType": "DINNER"|"DESSERT"|"BREAKFAST"|"ANY", "preferCheapest": boolean }
}`;

    try {
      const raw = await this.llm.chat(prompt);
      const cleaned = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleaned);

      const preferCheapest = Boolean(parsed.preferences?.preferCheapest);

      const result: UserIntent = {
        intent: parsed.intent || "ORDER_FOOD",
        constraints: {
          maxBudget: typeof parsed.constraints?.maxBudget === "number" ? parsed.constraints.maxBudget : undefined,
          dietary: Array.isArray(parsed.constraints?.dietary) ? parsed.constraints.dietary : [],
          excludedIngredients: Array.isArray(parsed.constraints?.excludedIngredients) ? parsed.constraints.excludedIngredients : [],
        },
        preferences: {
          itemType: ["FOOD", "BEVERAGE", "ANY"].includes(parsed.preferences?.itemType) ? parsed.preferences.itemType : "FOOD",
          mealType: ["BREAKFAST", "LUNCH", "DINNER", "SNACK", "DESSERT", "ANY"].includes(parsed.preferences?.mealType) ? parsed.preferences.mealType : "ANY",
          preferredCategory: "ANY",
          desiredAttributes: [],
          preferCheapest,
        },
        rawMessage: userMessage,
      };

      PlannerAgent.intentCache.set(cacheKey, result);
      return result;
    } catch (err) {
      console.warn("[PlannerAgent] LLM intent extraction error, using local fallback parser:", err);
      const fallback = this.heuristicFallbackParse(userMessage);
      PlannerAgent.intentCache.set(cacheKey, fallback);
      return fallback;
    }
  }

  /**
   * Fast Local Rule Parser — handles standard queries locally with 0 API token cost.
   */
  private tryFastLocalParse(userMessage: string): UserIntent | null {
    const msg = userMessage.toLowerCase().trim();

    // Direct match patterns
    const isOrder = ["order", "get me", "cheapest", "under", "want", "buy", "have", "something", "dessert", "dinner", "drink", "coffee"].some(k => msg.includes(k));
    if (!isOrder) return null;

    let maxBudget: number | undefined = undefined;
    const bMatch = msg.match(/(?:under|below|max|budget|₹|\$)\s*(\d+)/i) || msg.match(/(\d+)\s*(?:rupees|rs|inr)/i);
    if (bMatch) maxBudget = parseInt(bMatch[1], 10);

    const dietary: string[] = [];
    if (msg.includes("vegetarian") || msg.includes("veg")) dietary.push("Vegetarian");
    if (msg.includes("vegan")) dietary.push("Vegan");
    if (msg.includes("gluten")) dietary.push("Gluten-Free");

    let itemType: ItemType = "FOOD";
    if (["drink", "coffee", "tea", "beverage", "juice", "wine", "espresso"].some(k => msg.includes(k))) {
      itemType = "BEVERAGE";
    }

    let mealType: MealType = "ANY";
    if (msg.includes("dinner") || msg.includes("lunch") || msg.includes("meal") || msg.includes("savory") || msg.includes("main")) mealType = "DINNER";
    if (msg.includes("dessert") || msg.includes("sweet") || msg.includes("cake") || msg.includes("tart")) mealType = "DESSERT";
    if (msg.includes("breakfast") || msg.includes("pastry") || msg.includes("morning") || msg.includes("croissant")) mealType = "BREAKFAST";

    const preferCheapest = msg.includes("cheapest");

    return {
      intent: "ORDER_FOOD",
      constraints: { maxBudget, dietary, excludedIngredients: [] },
      preferences: { itemType, mealType, preferredCategory: "ANY", desiredAttributes: [], preferCheapest },
      rawMessage: userMessage,
    };
  }

  private heuristicFallbackParse(userMessage: string): UserIntent {
    const parsed = this.tryFastLocalParse(userMessage);
    if (parsed) return parsed;

    return {
      intent: "GENERAL_CHAT",
      constraints: {},
      preferences: { itemType: "FOOD", mealType: "ANY", preferredCategory: "ANY" },
      rawMessage: userMessage,
    };
  }

  // ─── Semantic Candidate Ranking Engine ───────────────────────────────────────

  /**
   * Ranks eligible candidates (which have already passed Hard Authorization filtering)
   * based on Semantic Goal alignment, meal type, category match, and Groq semantic reranking.
   *
   * NEVER overrides hard budget or dietary constraints.
   */
  private async rankCandidatesSemantically(
    candidates: MenuItemData[],
    userMessage: string,
    prefs: SemanticPreferences
  ): Promise<MenuItemData[]> {
    if (candidates.length <= 1) return candidates;

    console.log(`[SemanticRanker] Ranking ${candidates.length} candidate(s) for user goal: "${userMessage}"`);

    // 1. Calculate deterministic semantic score for each candidate
    const scored = candidates.map((dish) => {
      const isBeverage = BEVERAGE_IDS.includes(dish.id) || dish.name.toLowerCase().includes("coffee") || dish.name.toLowerCase().includes("tea") || dish.name.toLowerCase().includes("vin") || dish.name.toLowerCase().includes("jus");
      let score = 0;

      // Rule A: Item Type Alignment (Food vs Beverage)
      if (prefs.itemType === "FOOD") {
        if (!isBeverage) score += 100;
        else score -= 200; // Strong penalty for beverage when user asked for food
      } else if (prefs.itemType === "BEVERAGE") {
        if (isBeverage) score += 100;
        else score -= 200; // Strong penalty for food when user asked for beverage
      }

      // Rule B: Meal Type Alignment
      if (prefs.mealType === "DINNER" || prefs.mealType === "LUNCH") {
        const isSavoryMeal = ["Salade", "Quiche", "Croque", "Soupe", "Potage", "Ratatouille", "Assiette"].some(k => dish.name.includes(k));
        if (isSavoryMeal) score += 80;
        if (isBeverage) score -= 50;
      } else if (prefs.mealType === "DESSERT") {
        const isDessert = ["Tarte", "Crème", "Mousse", "Madeleines", "Éclair"].some(k => dish.name.includes(k));
        if (isDessert) score += 80;
      } else if (prefs.mealType === "BREAKFAST") {
        const isBreakfast = ["Croissant", "Pain", "Brioche", "Tartine", "Chausson"].some(k => dish.name.includes(k));
        if (isBreakfast) score += 80;
      }

      // Rule C: Category Alignment
      if (prefs.preferredCategory && prefs.preferredCategory !== "ANY") {
        const cat = prefs.preferredCategory.toLowerCase();
        if (cat.includes("coffee") && (dish.name.includes("Café") || dish.name.includes("Espresso"))) score += 60;
        if (cat.includes("dessert") && ["Tarte", "Crème", "Mousse", "Madeleines", "Éclair"].some(k => dish.name.includes(k))) score += 60;
        if (cat.includes("soup") && (dish.name.includes("Soupe") || dish.name.includes("Potage"))) score += 60;
      }

      // Rule D: Attribute Matching (e.g. warm, sweet, savory)
      if (prefs.desiredAttributes && prefs.desiredAttributes.length > 0) {
        const descLower = (dish.description + " " + dish.name).toLowerCase();
        for (const attr of prefs.desiredAttributes) {
          if (descLower.includes(attr.toLowerCase())) score += 20;
        }
      }

      // Rule E: Direct Keyword / Dish Name Match
      const userWords = userMessage.toLowerCase().split(/\s+/).filter(w => w.length > 2);
      const dishNameLower = dish.name.toLowerCase();
      const dishDescLower = (dish.description + " " + dish.ingredients.join(" ")).toLowerCase();

      for (const word of userWords) {
        if (["order", "want", "please", "food", "something", "with", "have", "under", "below", "rupees", "budget", "dish", "best", "good", "like"].includes(word)) continue;
        if (dishNameLower.includes(word)) {
          score += 300; // Direct dish name match bonus
        } else if (dishDescLower.includes(word)) {
          score += 60;  // Ingredient or description keyword match
        }
      }

      return { dish, score };
    });

    // Sort by deterministic score descending, then prompt-hash tie breaker
    scored.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      // If user explicitly asked for cheapest, sort by price
      if (prefs.preferCheapest) return a.dish.estimatedCost - b.dish.estimatedCost;

      // Hash tie-breaker based on userMessage string + dish.id so different prompts produce different tied orderings
      const hashA = (userMessage + a.dish.id).split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
      const hashB = (userMessage + b.dish.id).split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
      return (hashB % 100) - (hashA % 100);
    });

    // Filter out items with severe negative score if better semantic options exist
    const topScored = scored.filter(s => s.score > -50).map(s => s.dish);
    const pool = topScored.length > 0 ? topScored : candidates;

    // 2. Groq LLM Semantic Reranking among REAL eligible candidates
    if (pool.length > 1 && !prefs.preferCheapest) {
      try {
        const candidateSummaries = pool.slice(0, 5).map(c => ({
          id: c.id,
          name: c.name,
          cost: c.estimatedCost,
          description: c.description,
          dietary: c.dietary,
        }));

        const rerankPrompt = `You are a French Bistro dining assistant.
User Goal: "${userMessage}"

Select the single best candidate dish from this list of REAL menu items that best fulfills the user's semantic goal:
${JSON.stringify(candidateSummaries, null, 2)}

Respond ONLY with a JSON object:
{ "recommendedId": "<exact id from candidate list>" }`;

        const raw = await this.llm.chat(rerankPrompt);
        const cleaned = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(cleaned);

        if (parsed.recommendedId) {
          // 🛡️ STRICT GROUNDING CHECK: Ensure recommendedId is in real candidate pool
          const matchIndex = pool.findIndex(c => c.id === parsed.recommendedId);
          if (matchIndex > -1) {
            console.log(`[SemanticRanker] Groq semantic reranker selected: ${pool[matchIndex].name} (${pool[matchIndex].id})`);
            const matched = pool.splice(matchIndex, 1)[0];
            return [matched, ...pool];
          }
        }
      } catch (err) {
        console.warn("[SemanticRanker] Groq reranking fallback to deterministic score ranking:", err);
      }
    }

    console.log(`[SemanticRanker] Ranked top candidate: ${pool[0].name} (Score: ${scored[0]?.score})`);
    return pool;
  }

  // ─── Autonomous Bounded Loop ─────────────────────────────────────────────────

  private async runAutonomousLoop(state: AgentState, steps: AgentStep[], runId?: string): Promise<PlannerResult> {
    let completed = false;
    const rejectedSummaries: string[] = [];

    while (!completed && state.stepCount < MAX_STEPS && state.replanCount < MAX_REPLANS) {
      state.stepCount++;
      const action = this.decideNextAction(state);

      console.log(`\n[PlannerAgent] Step ${state.stepCount} (Replan ${state.replanCount}/${MAX_REPLANS}) → Action: ${action.type}`);

      switch (action.type) {
        case "SEARCH_MENU": {
          state.status = "SEARCHING";
          if (runId) {
            this.emitUIEvent({ runId, type: "SEARCH_MENU", timestamp: Date.now() });
          }
          const candidates = await this.menuTool.findCandidates(state.authorization, state.attemptedDishIds);
          
          // 🧠 Apply Semantic Goal Candidate Ranking
          const semanticallyRanked = await this.rankCandidatesSemantically(candidates, state.originalRequest, state.preferences);
          state.candidates = semanticallyRanked;

          if (runId) {
            this.emitUIEvent({ runId, type: "MENU_RESULTS", count: semanticallyRanked.length, timestamp: Date.now() });
          }

          steps.push({
            title: "🔍 Menu Catalog Search & Semantic Ranking",
            detail: `Queried catalog & ranked ${semanticallyRanked.length} eligible candidate(s) for goal "${state.originalRequest}"`,
            status: semanticallyRanked.length > 0 ? "success" : "warning",
          });

          this.recordObservation(state, "SEARCH_MENU", semanticallyRanked.length > 0, `Found ${semanticallyRanked.length} semantically ranked candidate(s)`, { candidatesCount: semanticallyRanked.length });

          if (semanticallyRanked.length === 0) {
            console.log("[PlannerAgent] No candidates found matching authorization & semantic goal.");
            state.status = "FAILED";
            completed = true;
            if (runId) {
              this.emitUIEvent({ runId, type: "AGENT_FAILED", reasonCode: "NO_VALID_OPTION", timestamp: Date.now() });
            }
          }
          break;
        }

        case "SELECT_DISH": {
          state.status = "SELECTING";
          // Pick top unattempted candidate
          const unattempted = state.candidates.filter((c) => !state.attemptedDishIds.includes(c.id));

          if (unattempted.length === 0) {
            console.log("[PlannerAgent] All candidates exhausted.");
            this.recordObservation(state, "SELECT_DISH", false, "All candidates exhausted");
            state.status = "FAILED";
            completed = true;
            if (runId) {
              this.emitUIEvent({ runId, type: "AGENT_FAILED", reasonCode: "EXHAUSTED_CANDIDATES", timestamp: Date.now() });
            }
            break;
          }

          const selected = unattempted[0];
          console.log(`[PlannerAgent] Selected candidate: ${selected.name} (₹${selected.estimatedCost})`);

          if (runId) {
            this.emitUIEvent({
              runId,
              type: "SELECT_DISH",
              dishId: selected.id,
              dishName: selected.name,
              price: selected.estimatedCost,
              imageUrl: selected.imageUrl,
              dietary: selected.dietary,
              timestamp: Date.now(),
            });
          }

          // 🛡️ Deterministic Policy Gate Verification (Immutable Authorization Gate)
          const policyCheck = AgentPolicyGate.validate(selected, state.authorization);
          if (!policyCheck.valid) {
            console.log(`[AgentPolicyGate] 🛑 Rejected candidate ${selected.name}: ${policyCheck.violations.join("; ")}`);
            state.attemptedDishIds.push(selected.id);
            rejectedSummaries.push(`${selected.name} (${policyCheck.violations[0]})`);

            steps.push({
              title: "🛡️ Authorization Policy Gate",
              detail: `Blocked "${selected.name}": ${policyCheck.violations.join("; ")}`,
              status: "error",
            });

            this.recordObservation(state, "SELECT_DISH", false, policyCheck.violations.join("; "));
            state.replanCount++;
            state.status = "REPLANNING";

            if (runId) {
              this.emitUIEvent({ runId, type: "REPLAN", reasonCode: policyCheck.violations[0], timestamp: Date.now() });
            }
            break;
          }

          state.selectedDish = selected;
          this.recordObservation(state, "SELECT_DISH", true, `Selected ${selected.name} (₹${selected.estimatedCost})`, { dish: selected.name });
          break;
        }

        case "CHECK_INVENTORY": {
          state.status = "AUDITING_INVENTORY";
          if (!state.selectedDish) {
            state.status = "FAILED";
            completed = true;
            break;
          }

          if (runId) {
            this.emitUIEvent({
              runId,
              type: "CHECK_INVENTORY",
              dishId: state.selectedDish.id,
              dishName: state.selectedDish.name,
              timestamp: Date.now(),
            });
          }

          const inventoryCheck = await this.inventoryTool.checkAvailability(state.selectedDish, state.authorization);

          if (runId) {
            this.emitUIEvent({
              runId,
              type: "INVENTORY_RESULT",
              dishId: state.selectedDish.id,
              dishName: state.selectedDish.name,
              available: inventoryCheck.available,
              reasonCode: inventoryCheck.available ? undefined : inventoryCheck.outOfStock.join(", "),
              timestamp: Date.now(),
            });
          }

          if (!inventoryCheck.available) {
            console.log(`[InventoryTool] Dish ${state.selectedDish.name} unavailable: ${inventoryCheck.outOfStock.join("; ")}`);
            state.attemptedDishIds.push(state.selectedDish.id);
            rejectedSummaries.push(`${state.selectedDish.name} (Out of stock: ${inventoryCheck.outOfStock.join(", ")})`);

            steps.push({
              title: "📦 Live Inventory Audit",
              detail: `"${state.selectedDish.name}": ✗ Unavailable (${inventoryCheck.outOfStock.join("; ")})`,
              status: "warning",
            });

            this.recordObservation(state, "CHECK_INVENTORY", false, `Unavailable: ${inventoryCheck.outOfStock.join("; ")}`);
            state.selectedDish = undefined;
            state.replanCount++;
            state.status = "REPLANNING";

            if (runId) {
              this.emitUIEvent({ runId, type: "REPLAN", reasonCode: "STOCKOUT", timestamp: Date.now() });
            }
            break;
          }

          steps.push({
            title: "📦 Live Inventory Audit",
            detail: `"${state.selectedDish.name}": ✓ All ingredients in stock`,
            status: "success",
          });

          this.recordObservation(state, "CHECK_INVENTORY", true, `Available: ${state.selectedDish.name}`);
          break;
        }

        case "GENERATE_DCT": {
          state.status = "AUTHORIZING_DCT";
          if (!state.selectedDish) {
            state.status = "FAILED";
            completed = true;
            break;
          }

          if (runId) {
            this.emitUIEvent({ runId, type: "GENERATE_DCT", timestamp: Date.now() });
          }

          try {
            const dctResult = await this.dctTool.generate(
              state.selectedDish,
              state.authorization,
              state.replanCount,
              state.previousTokenHash
            );

            state.dctTokenId = dctResult.tokenId;

            if (runId) {
              this.emitUIEvent({ runId, type: "DCT_GENERATED", dctTokenId: dctResult.tokenId, timestamp: Date.now() });
            }

            steps.push({
              title: "🎟️ GB-DCT Commitment Generation",
              detail: `Generated dynamic commitment token: ${dctResult.tokenId} (lineage gen ${state.replanCount})`,
              status: "success",
            });

            this.recordObservation(state, "GENERATE_DCT", true, `Generated token ${dctResult.tokenId}`);
          } catch (err: any) {
            console.error(`[DCTTool] Token generation failed:`, err);
            state.attemptedDishIds.push(state.selectedDish.id);
            rejectedSummaries.push(`${state.selectedDish.name} (DCT error)`);
            state.selectedDish = undefined;
            state.replanCount++;
            state.status = "REPLANNING";

            if (runId) {
              this.emitUIEvent({ runId, type: "REPLAN", reasonCode: "DCT_ERROR", timestamp: Date.now() });
            }
          }
          break;
        }

        case "VALIDATE_DCT": {
          state.status = "VALIDATING_DCT";
          if (!state.dctTokenId || !state.selectedDish) {
            state.status = "FAILED";
            completed = true;
            break;
          }

          if (runId) {
            this.emitUIEvent({ runId, type: "VALIDATE_DCT", dctTokenId: state.dctTokenId, timestamp: Date.now() });
          }

          const validation = await this.dctTool.validate(state.dctTokenId);

          if (!validation.success) {
            console.log(`[DCTTool] GB-DCT Validation drift detected for ${state.dctTokenId}`);
            state.attemptedDishIds.push(state.selectedDish.id);
            state.previousTokenHash = state.dctTokenId;
            rejectedSummaries.push(`${state.selectedDish.name} (Drift: ${validation.driftsDetected.join("; ")})`);

            steps.push({
              title: "🛡️ World State Attestation",
              detail: `State drift detected on ${state.dctTokenId}: ${validation.driftsDetected.join("; ")}`,
              status: "error",
            });

            this.recordObservation(state, "VALIDATE_DCT", false, `Drift: ${validation.driftsDetected.join("; ")}`);
            state.dctTokenId = undefined;
            state.selectedDish = undefined;
            state.replanCount++;
            state.status = "REPLANNING";

            if (runId) {
              this.emitUIEvent({ runId, type: "REPLAN", reasonCode: "DRIFT_DETECTED", timestamp: Date.now() });
            }
            break;
          }

          if (runId) {
            this.emitUIEvent({ runId, type: "DCT_VALID", dctTokenId: state.dctTokenId, timestamp: Date.now() });
          }

          steps.push({
            title: "🛡️ World State Attestation",
            detail: `Verified token ${state.dctTokenId} against live world state: 0 drift detected`,
            status: "success",
          });

          this.recordObservation(state, "VALIDATE_DCT", true, `Valid: ${state.dctTokenId}`);
          break;
        }

        case "CREATE_ORDER": {
          state.status = "EXECUTING_ORDER";
          if (!state.selectedDish || !state.dctTokenId) {
            state.status = "FAILED";
            completed = true;
            break;
          }

          if (runId) {
            this.emitUIEvent({ runId, type: "CREATE_ORDER", timestamp: Date.now() });
          }

          try {
            const order = await this.orderTool.createOrder(
              state.selectedDish,
              state.dctTokenId,
              state.authorization,
              state.replanCount
            );

            state.orderId = order._id?.toString();
            state.status = "COMPLETED";
            completed = true;

            if (runId) {
              this.emitUIEvent({
                runId,
                type: "ORDER_CREATED",
                orderId: state.orderId,
                dishId: state.selectedDish.id,
                dishName: state.selectedDish.name,
                price: state.selectedDish.estimatedCost,
                imageUrl: state.selectedDish.imageUrl,
                dctTokenId: state.dctTokenId,
                timestamp: Date.now(),
              });

              this.emitUIEvent({
                runId,
                type: "AGENT_COMPLETED",
                dishName: state.selectedDish.name,
                price: state.selectedDish.estimatedCost,
                orderId: state.orderId,
                dctTokenId: state.dctTokenId,
                imageUrl: state.selectedDish.imageUrl,
                dietary: state.selectedDish.dietary,
                timestamp: Date.now(),
              });
            }

            steps.push({
              title: "🛒 Order Execution",
              detail: `Simulated order #${order._id} persisted to database`,
              status: "success",
            });

            this.recordObservation(state, "CREATE_ORDER", true, `Order created: #${order._id}`);
          } catch (err: any) {
            console.error(`[OrderTool] Persistence error:`, err);
            state.status = "FAILED";
            completed = true;
          }
          break;
        }

        case "REPLAN": {
          state.status = "REPLANNING";
          steps.push({
            title: "🔄 Autonomous Replanning",
            detail: `Replan attempt ${state.replanCount}/${MAX_REPLANS}: searching next valid candidate matching semantic goal`,
            status: "info",
          });
          break;
        }

        case "FINISH": {
          completed = true;
          break;
        }
      }
    }

    // 4. Return final structured result
    if (state.status === "COMPLETED" && state.selectedDish && state.orderId && state.dctTokenId) {
      return {
        success: true,
        dishName: state.selectedDish.name,
        price: state.selectedDish.estimatedCost,
        orderId: state.orderId,
        dctTokenId: state.dctTokenId,
        replanned: state.replanCount > 0,
        rejectedCandidates: rejectedSummaries,
        message: this.buildSuccessMessage(state.selectedDish, state.dctTokenId, state.replanCount > 0, rejectedSummaries),
        agentSteps: steps,
        dish: state.selectedDish,
      };
    }

    return {
      success: false,
      rejectedCandidates: rejectedSummaries,
      message: this.buildExhaustedMessage(rejectedSummaries, state.authorization, state.preferences),
      agentSteps: steps,
    };
  }

  // ─── Deterministic State-Based Decision Logic ────────────────────────────────

  private decideNextAction(state: AgentState): AgentAction {
    if (state.candidates.length === 0 && state.status === "PLANNING") {
      return { type: "SEARCH_MENU" };
    }

    if (state.status === "REPLANNING") {
      return { type: "SEARCH_MENU" };
    }

    if (!state.selectedDish) {
      return { type: "SELECT_DISH", dishId: "" };
    }

    const lastObs = state.observations[state.observations.length - 1];

    if (lastObs?.action === "SELECT_DISH" && lastObs.success) {
      return { type: "CHECK_INVENTORY", dishId: state.selectedDish.id };
    }

    if (lastObs?.action === "CHECK_INVENTORY" && lastObs.success) {
      return { type: "GENERATE_DCT", dishId: state.selectedDish.id };
    }

    if (lastObs?.action === "GENERATE_DCT" && lastObs.success && state.dctTokenId) {
      return { type: "VALIDATE_DCT", tokenId: state.dctTokenId };
    }

    if (lastObs?.action === "VALIDATE_DCT" && lastObs.success && state.dctTokenId) {
      return { type: "CREATE_ORDER", dishId: state.selectedDish.id, tokenId: state.dctTokenId };
    }

    return { type: "FINISH", reason: "Workflow state reached terminal condition" };
  }

  private recordObservation(
    state: AgentState,
    action: AgentAction["type"],
    success: boolean,
    message: string,
    data?: any
  ) {
    state.observations.push({
      action,
      timestamp: new Date().toISOString(),
      success,
      message,
      data,
    });
  }

  // ─── Response Builders ───────────────────────────────────────────────────────

  private buildSuccessMessage(
    dish: MenuItemData,
    tokenId: string,
    replanned: boolean,
    rejected: string[]
  ): string {
    let msg = "";

    if (replanned && rejected.length > 0) {
      const firstRejected = rejected[0].split(" (")[0];
      msg += `My initial selection (${firstRejected}) became unavailable during state auditing, so I autonomously replanned. `;
    }

    msg += `I selected **${dish.name}** for ₹${dish.estimatedCost}. `;
    msg += `It satisfies your ${dish.dietary.join(", ") || "dietary"} requirements. `;
    msg += `Inventory was verified, the GB-DCT token (${tokenId}) was attested against live world state, `;
    msg += `and your simulated order has been created. Enjoy your meal! 🍽️`;

    return msg;
  }

  private buildExhaustedMessage(
    rejected: string[],
    auth: OrderAuthorization,
    prefs: SemanticPreferences
  ): string {
    let msg = "I evaluated menu candidates but could not find a suitable option matching your goal. ";

    const goalType = prefs.mealType && prefs.mealType !== "ANY" ? prefs.mealType.toLowerCase() : prefs.itemType === "BEVERAGE" ? "drink" : "option";
    msg = `No suitable ${auth.dietary?.join(" ") || ""} ${goalType} is currently available `;
    if (auth.maxBudget) msg += `under ₹${auth.maxBudget}. `;

    if (rejected.length > 0) {
      msg += `Issues encountered: ${rejected.slice(0, 2).join("; ")}. `;
    }

    msg += "Please try adjusting your budget or preferences!";
    return msg;
  }
}
