import { LLMProvider } from "../llm/LLMProvider.interface";
import { MenuTool } from "../tools/MenuTool";
import { InventoryTool } from "../tools/InventoryTool";
import { DCTTool } from "../tools/DCTTool";
import { OrderTool } from "../tools/OrderTool";
import {
  UserIntent,
  OrderConstraints,
  MenuItemData,
  PlannerResult,
} from "../types/agent.types";

/**
 * PlannerAgent
 *
 * Orchestrates the autonomous food-ordering pipeline.
 * Receives an LLMProvider via dependency injection — is NOT itself an LLMProvider.
 *
 * For ORDER_FOOD intent:
 *   extractIntent → findCandidates → checkInventory → generateDCT
 *   → validateDCT → createOrder → return natural-language reply
 *
 * For all other intents:
 *   Falls back to this.llm.chat() — preserving existing general chat behavior.
 *
 * Max retry attempts: 3 (bounded loop, no infinite retries).
 */

const MAX_ATTEMPTS = 3;

export class PlannerAgent {
  constructor(
    private readonly llm: LLMProvider,
    private readonly menuTool: MenuTool,
    private readonly inventoryTool: InventoryTool,
    private readonly dctTool: DCTTool,
    private readonly orderTool: OrderTool
  ) {}

  // ─── Main Entry Point ────────────────────────────────────────────────────────

  async process(userMessage: string): Promise<string> {
    // 1. Extract intent from natural language
    const intent = await this.extractIntent(userMessage);
    console.log(`[Planner] Intent: ${intent.intent}`);

    if (intent.intent === "ORDER_FOOD") {
      console.log(`[Planner] Constraints: ${JSON.stringify(intent.constraints)}`);
      const result = await this.executeOrder(intent);
      return result.message;
    }

    // All non-ORDER_FOOD intents fall back to general LLM chat
    console.log(`[Planner] Non-order intent detected. Routing to general chat.`);
    return await this.llm.chat(userMessage);
  }

  // ─── Intent Extraction ───────────────────────────────────────────────────────

  /**
   * Uses the LLM to extract structured intent from the user's message.
   * Validates and safely parses the JSON output.
   * Falls back to GENERAL_CHAT if extraction fails or JSON is malformed.
   */
  private async extractIntent(userMessage: string): Promise<UserIntent> {
    const prompt = `You are an intent classification assistant for a food ordering app.

Analyze the user's message and return a JSON object with this exact structure:
{
  "intent": "ORDER_FOOD" | "RECIPE_REQUEST" | "GENERAL_CHAT" | "UNKNOWN",
  "constraints": {
    "maxBudget": <number in INR or null>,
    "dietary": <array of dietary restrictions e.g. ["vegetarian"] or []>,
    "spiceLevel": "Mild" | "Medium" | "Spicy" | null,
    "cuisine": <string e.g. "Indian" or null>
  }
}

Rules:
- Use "ORDER_FOOD" when the user explicitly wants to order, buy, or get food delivered.
- Use "RECIPE_REQUEST" when they want a recipe idea or meal suggestion without ordering.
- Use "GENERAL_CHAT" for all other food questions.
- dietary should normalize: "veg" → "vegetarian", "vegan", "gluten free" → "Gluten-Free"
- spiceLevel: "spicy" → "Spicy", "mild" → "Mild", "medium" → "Medium"
- Return ONLY the JSON object. No markdown. No explanation.

User message: "${userMessage.replace(/"/g, "'")}"`;

    try {
      const raw = await this.llm.chat(prompt);

      // Strip possible markdown code fences
      const cleaned = raw
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      const parsed = JSON.parse(cleaned);

      // Validate required fields
      if (!parsed.intent || !["ORDER_FOOD", "RECIPE_REQUEST", "GENERAL_CHAT", "UNKNOWN"].includes(parsed.intent)) {
        throw new Error("Invalid intent value");
      }

      const constraints: OrderConstraints = {
        maxBudget: typeof parsed.constraints?.maxBudget === "number"
          ? parsed.constraints.maxBudget
          : undefined,
        dietary: Array.isArray(parsed.constraints?.dietary)
          ? parsed.constraints.dietary
          : [],
        spiceLevel: ["Mild", "Medium", "Spicy"].includes(parsed.constraints?.spiceLevel)
          ? parsed.constraints.spiceLevel
          : undefined,
        cuisine: typeof parsed.constraints?.cuisine === "string" && parsed.constraints.cuisine
          ? parsed.constraints.cuisine
          : undefined,
      };

      return { intent: parsed.intent, constraints, rawMessage: userMessage };
    } catch (err) {
      console.warn("[Planner] Intent extraction failed, defaulting to GENERAL_CHAT:", err);
      return {
        intent: "GENERAL_CHAT",
        constraints: {},
        rawMessage: userMessage,
      };
    }
  }

  // ─── Order Execution Pipeline ─────────────────────────────────────────────

  /**
   * Full autonomous ordering pipeline.
   * Attempts up to MAX_ATTEMPTS candidates before giving up.
   */
  private async executeOrder(intent: UserIntent): Promise<PlannerResult> {
    const { constraints } = intent;

    // Step 1: Find candidates from real MongoDB data
    const candidates = await this.menuTool.findCandidates(constraints);
    console.log(`[MenuTool] Found ${candidates.length} candidate(s)`);

    if (candidates.length === 0) {
      return {
        success: false,
        message: this.buildNoMatchMessage(constraints),
      };
    }

    // Rank candidates: cheapest first among those satisfying constraints
    const ranked = this.rankCandidates(candidates, constraints);

    // Step 2: Attempt candidates with bounded retries
    const rejectedNames: string[] = [];
    let replanned = false;

    for (let attempt = 0; attempt < Math.min(MAX_ATTEMPTS, ranked.length); attempt++) {
      const candidate = ranked[attempt];

      if (attempt > 0) {
        replanned = true;
        console.log(`[Planner] Replanning — attempt ${attempt + 1} with: ${candidate.name}`);
      } else {
        console.log(`[Planner] Selected candidate: ${candidate.name} (₹${candidate.estimatedCost})`);
      }

      // Step 3: Check live inventory
      const inventoryCheck = await this.inventoryTool.checkAvailability(candidate, constraints);
      if (!inventoryCheck.available) {
        console.log(`[InventoryTool] ${candidate.name} unavailable: ${inventoryCheck.outOfStock.join(", ")}`);
        rejectedNames.push(`${candidate.name} (inventory/dietary issue: ${inventoryCheck.outOfStock.join(", ")})`);
        continue;
      }

      // Step 4: Generate GB-DCT token
      let dctResult;
      try {
        dctResult = await this.dctTool.generate(candidate, constraints);
        console.log(`[DCTTool] Token generated: ${dctResult.tokenId}`);
      } catch (err) {
        console.error(`[DCTTool] Token generation failed:`, err);
        rejectedNames.push(`${candidate.name} (DCT generation error)`);
        continue;
      }

      // Step 5: Validate DCT against live world state
      const validation = await this.dctTool.validate(dctResult.tokenId);
      console.log(`[DCTTool] Validation outcome: ${validation.outcome}`);

      if (!validation.success) {
        console.log(`[DCTTool] Drift detected — replanning`);
        rejectedNames.push(
          `${candidate.name} (drift: ${validation.driftsDetected.slice(0, 2).join("; ")})`
        );
        continue;
      }

      // Step 6: Create simulated order in MongoDB
      let order;
      try {
        order = await this.orderTool.createOrder(candidate, dctResult.tokenId, constraints, replanned);
        console.log(`[OrderTool] Order created: ${order._id}`);
      } catch (err) {
        console.error(`[OrderTool] Order creation failed:`, err);
        rejectedNames.push(`${candidate.name} (order persistence error)`);
        continue;
      }

      // Step 7: Return success message
      return {
        success: true,
        dishName: candidate.name,
        price: candidate.estimatedCost,
        orderId: order._id?.toString(),
        dctTokenId: dctResult.tokenId,
        replanned,
        rejectedCandidates: rejectedNames,
        message: this.buildSuccessMessage(candidate, dctResult.tokenId, replanned, rejectedNames),
      };
    }

    // All candidates exhausted
    return {
      success: false,
      rejectedCandidates: rejectedNames,
      message: this.buildExhaustedMessage(rejectedNames, constraints),
    };
  }

  // ─── Candidate Ranking ────────────────────────────────────────────────────

  /**
   * Simple deterministic ranking: sort by price ascending.
   * Cheapest valid dish is selected first, giving the user the best value.
   */
  private rankCandidates(
    candidates: MenuItemData[],
    _constraints: OrderConstraints
  ): MenuItemData[] {
    return [...candidates].sort((a, b) => a.estimatedCost - b.estimatedCost);
  }

  // ─── Natural Language Response Builders ──────────────────────────────────

  private buildSuccessMessage(
    dish: MenuItemData,
    tokenId: string,
    replanned: boolean,
    rejected: string[]
  ): string {
    let msg = "";

    if (replanned && rejected.length > 0) {
      const firstRejected = rejected[0].split(" (")[0];
      msg += `My first choice (${firstRejected}) became unavailable during validation, so I replanned. `;
    }

    msg += `I selected **${dish.name}** for ₹${dish.estimatedCost}. `;
    msg += `It matches your ${dish.dietary.filter(d => !d.includes("Gluten")).join(", ")} and ${dish.spiceLevel.toLowerCase()} requirements. `;
    msg += `Inventory was verified, the GB-DCT commitment token (${tokenId}) was validated against the live world state, `;
    msg += `and your simulated order has been created. `;
    msg += `Enjoy your meal! 🍽️`;

    return msg;
  }

  private buildNoMatchMessage(constraints: OrderConstraints): string {
    const parts: string[] = [];
    if (constraints.dietary?.length) parts.push(constraints.dietary.join(", "));
    if (constraints.spiceLevel) parts.push(constraints.spiceLevel.toLowerCase());
    if (constraints.maxBudget) parts.push(`under ₹${constraints.maxBudget}`);

    return `I couldn't find any dishes matching your requirements${parts.length ? ` (${parts.join(", ")})` : ""}. Try adjusting your budget or dietary preferences, and I'll try again!`;
  }

  private buildExhaustedMessage(rejected: string[], constraints: OrderConstraints): string {
    let msg = "I found some matching dishes but couldn't complete the order. ";

    if (rejected.length > 0) {
      const reasons = rejected.map((r) => {
        const match = r.match(/\((.+)\)/);
        return match ? match[1] : r;
      });
      msg += `Issues encountered: ${reasons.slice(0, 2).join("; ")}. `;
    }

    msg += "This could be due to inventory changes or pricing drift. Please try again shortly.";
    return msg;
  }
}
