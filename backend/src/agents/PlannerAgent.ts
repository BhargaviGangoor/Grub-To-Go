import { LLMProvider } from "../llm/LLMProvider.interface";
import { MenuTool } from "../tools/MenuTool";
import { InventoryTool } from "../tools/InventoryTool";
import { DCTTool } from "../tools/DCTTool";
import { OrderTool } from "../tools/OrderTool";
import { AgentPolicyGate } from "./AgentPolicyGate";
import {
  UserIntent,
  OrderAuthorization,
  MenuItemData,
  PlannerResult,
  AgentStep,
  AgentState,
  AgentAction,
  AgentObservation,
} from "../types/agent.types";

/**
 * PlannerAgent.ts
 *
 * Autonomous Reasoning & Orchestration Layer.
 *
 * Implements a bounded Reason → Act → Observe → Update State → Replan → Execute loop.
 *
 * Key Architectural Guarantees:
 *   1. Single Reasoning Agent: Uses multiple deterministic tools (MenuTool, InventoryTool, DCTTool, OrderTool).
 *   2. Immutable Authorization Gate: User's original hard constraints (maxBudget, dietary, excludedIngredients)
 *      are frozen at task start. Replanning NEVER relaxes hard constraints.
 *   3. GB-DCT Commitment Gate: OrderTool can ONLY be invoked after explicit cryptographic GB-DCT state attestation.
 *   4. Zero Hallucination: All dish facts, prices, and stock levels originate deterministically from MongoDB.
 *   5. Loop Safety: Enforces MAX_STEPS = 10 and MAX_REPLANS = 3 bounds.
 */

const MAX_STEPS = 10;
const MAX_REPLANS = 3;

export class PlannerAgent {
  constructor(
    private readonly llm: LLMProvider,
    private readonly menuTool: MenuTool,
    private readonly inventoryTool: InventoryTool,
    private readonly dctTool: DCTTool,
    private readonly orderTool: OrderTool
  ) {}

  // ─── Main Entry Point ────────────────────────────────────────────────────────

  async process(userMessage: string): Promise<PlannerResult> {
    const steps: AgentStep[] = [];

    // 1. Extract intent from natural language
    const intent = await this.extractIntent(userMessage);
    console.log(`[PlannerAgent] Extracted Intent: ${intent.intent}`);

    steps.push({
      title: "🎯 Intent & Constraint Analysis",
      detail: `Intent: ${intent.intent}${
        intent.intent === "ORDER_FOOD"
          ? ` | Budget: ₹${intent.constraints.maxBudget ?? "Unlimited"}, Diet: [${
              intent.constraints.dietary?.join(", ") || "Any"
            }], Excluded: [${intent.constraints.excludedIngredients?.join(", ") || "None"}]`
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

    const state: AgentState = {
      originalRequest: userMessage,
      intent: intent.intent,
      authorization: frozenAuthorization,
      candidates: [],
      attemptedDishIds: [],
      observations: [],
      replanCount: 0,
      stepCount: 0,
      status: "PLANNING",
    };

    console.log(`[PlannerAgent] Initialized task state. Immutable Authorization:`, JSON.stringify(frozenAuthorization));

    // 3. Execute Autonomous Reasoning Loop
    return await this.runAutonomousLoop(state, steps);
  }

  // ─── Intent Extraction ───────────────────────────────────────────────────────

  private async extractIntent(userMessage: string): Promise<UserIntent> {
    const prompt = `You are an intent classification assistant for an autonomous French Bistro food ordering app.

Analyze the user's message and return a JSON object with this exact structure:
{
  "intent": "ORDER_FOOD" | "RECIPE_REQUEST" | "GENERAL_CHAT" | "RECOMMENDATION" | "UNKNOWN",
  "constraints": {
    "maxBudget": <number in INR or null>,
    "dietary": <array of dietary restrictions e.g. ["Vegetarian", "Gluten-Free"] or []>,
    "excludedIngredients": <array of ingredients user wants to avoid e.g. ["peanuts"] or []>,
    "spiceLevel": "Mild" | "Medium" | "Spicy" | null,
    "cuisine": <string e.g. "French" or null>,
    "dishNameQuery": <string e.g. "croissant" or "ratatouille" or null>,
    "softPreferences": <array of descriptive preferences e.g. ["warm", "sweet"] or []>
  }
}

Rules:
- Use "ORDER_FOOD" when the user asks to order, buy, get food, or find a meal under a budget/diet.
- Use "RECIPE_REQUEST" when they explicitly ask how to cook a dish.
- Use "GENERAL_CHAT" for general food questions.
- Normalize dietary: "veg" → "Vegetarian", "vegan" → "Vegan", "gluten free" → "Gluten-Free".
- Return ONLY valid JSON. No markdown fences.

User message: "${userMessage.replace(/"/g, "'")}"`;

    try {
      const raw = await this.llm.chat(prompt);
      const cleaned = raw.replace(/```json/gi, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleaned);

      if (!parsed.intent || !["ORDER_FOOD", "RECIPE_REQUEST", "GENERAL_CHAT", "RECOMMENDATION", "UNKNOWN"].includes(parsed.intent)) {
        throw new Error("Invalid intent type returned");
      }

      return {
        intent: parsed.intent,
        constraints: {
          maxBudget: typeof parsed.constraints?.maxBudget === "number" ? parsed.constraints.maxBudget : undefined,
          dietary: Array.isArray(parsed.constraints?.dietary) ? parsed.constraints.dietary : [],
          excludedIngredients: Array.isArray(parsed.constraints?.excludedIngredients) ? parsed.constraints.excludedIngredients : [],
          spiceLevel: ["Mild", "Medium", "Spicy"].includes(parsed.constraints?.spiceLevel) ? parsed.constraints.spiceLevel : undefined,
          cuisine: typeof parsed.constraints?.cuisine === "string" ? parsed.constraints.cuisine : undefined,
          dishNameQuery: typeof parsed.constraints?.dishNameQuery === "string" ? parsed.constraints.dishNameQuery : undefined,
          softPreferences: Array.isArray(parsed.constraints?.softPreferences) ? parsed.constraints.softPreferences : [],
        },
        rawMessage: userMessage,
      };
    } catch (err) {
      console.warn("[PlannerAgent] Intent extraction fallback to GENERAL_CHAT:", err);
      return {
        intent: "GENERAL_CHAT",
        constraints: {},
        rawMessage: userMessage,
      };
    }
  }

  // ─── Autonomous Bounded Loop ─────────────────────────────────────────────────

  private async runAutonomousLoop(state: AgentState, steps: AgentStep[]): Promise<PlannerResult> {
    let completed = false;
    const rejectedSummaries: string[] = [];

    while (!completed && state.stepCount < MAX_STEPS && state.replanCount < MAX_REPLANS) {
      state.stepCount++;
      const action = this.decideNextAction(state);

      console.log(`\n[PlannerAgent] Step ${state.stepCount} (Replan ${state.replanCount}/${MAX_REPLANS}) → Action: ${action.type}`);

      switch (action.type) {
        case "SEARCH_MENU": {
          state.status = "SEARCHING";
          const candidates = await this.menuTool.findCandidates(state.authorization, state.attemptedDishIds);
          state.candidates = candidates;

          steps.push({
            title: "🔍 Menu Catalog Search",
            detail: `Queried MongoDB catalog: found ${candidates.length} candidate dish(es) matching authorization`,
            status: candidates.length > 0 ? "success" : "warning",
          });

          this.recordObservation(state, "SEARCH_MENU", candidates.length > 0, `Found ${candidates.length} candidate(s)`, { candidatesCount: candidates.length });

          if (candidates.length === 0) {
            console.log("[PlannerAgent] No candidates found matching authorization.");
            state.status = "FAILED";
            completed = true;
          }
          break;
        }

        case "SELECT_DISH": {
          state.status = "SELECTING";
          // Pick top unattempted candidate (cheapest first)
          const unattempted = state.candidates
            .filter((c) => !state.attemptedDishIds.includes(c.id))
            .sort((a, b) => a.estimatedCost - b.estimatedCost);

          if (unattempted.length === 0) {
            console.log("[PlannerAgent] All menu candidates exhausted.");
            this.recordObservation(state, "SELECT_DISH", false, "All candidates exhausted");
            state.status = "FAILED";
            completed = true;
            break;
          }

          const selected = unattempted[0];
          console.log(`[PlannerAgent] Selected candidate: ${selected.name} (₹${selected.estimatedCost})`);

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

          const inventoryCheck = await this.inventoryTool.checkAvailability(state.selectedDish, state.authorization);

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

          try {
            const dctResult = await this.dctTool.generate(
              state.selectedDish,
              state.authorization,
              state.replanCount,
              state.previousTokenHash
            );

            state.dctTokenId = dctResult.tokenId;

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
            break;
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
            detail: `Replan attempt ${state.replanCount}/${MAX_REPLANS}: searching next valid candidate`,
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
      message: this.buildExhaustedMessage(rejectedSummaries, state.authorization),
      agentSteps: steps,
    };
  }

  // ─── Deterministic State-Based Decision Logic ────────────────────────────────

  private decideNextAction(state: AgentState): AgentAction {
    if (state.candidates.length === 0 && state.status === "PLANNING") {
      return { type: "SEARCH_MENU" };
    }

    if (state.status === "REPLANNING") {
      // Re-search menu excluding attempted IDs
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
      msg += `My initial choice (${firstRejected}) was unavailable, so I autonomously replanned. `;
    }

    msg += `I selected **${dish.name}** for ₹${dish.estimatedCost}. `;
    msg += `It satisfies your ${dish.dietary.join(", ") || "dietary"} requirements. `;
    msg += `Inventory was verified, the GB-DCT token (${tokenId}) was attested against live world state, `;
    msg += `and your simulated order has been created. Enjoy your meal! 🍽️`;

    return msg;
  }

  private buildExhaustedMessage(rejected: string[], auth: OrderAuthorization): string {
    let msg = "I evaluated menu candidates but could not complete the order under your authorization. ";

    if (auth.maxBudget) msg += `(Budget: ₹${auth.maxBudget}) `;
    if (auth.dietary?.length) msg += `(Dietary: ${auth.dietary.join(", ")}) `;

    if (rejected.length > 0) {
      msg += `Encountered issues: ${rejected.slice(0, 2).join("; ")}. `;
    }

    msg += "Please try adjusting your budget or preferences!";
    return msg;
  }
}
