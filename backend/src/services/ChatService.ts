import { PlannerAgent } from "../agents/PlannerAgent";

/**
 * ChatService.ts
 *
 * The Business Logic Layer for the AI chat feature.
 *
 * ─── PHASE 2 UPDATE ──────────────────────────────────────────────────────────
 * ChatService now routes ALL messages through PlannerAgent.
 * PlannerAgent handles intent detection internally:
 *   - ORDER_FOOD intent  → full autonomous ordering pipeline
 *   - everything else   → falls back to GroqProvider.chat() (existing behavior)
 *
 * The controller and frontend are completely unchanged.
 * The /api/chat request and response contracts are unchanged.
 *
 * ─── DEPENDENCY INJECTION ────────────────────────────────────────────────────
 * PlannerAgent is injected via the constructor (assembled in chat.routes.ts).
 * ChatService has no knowledge of Groq, tools, or DB internals.
 */
export class ChatService {
  private planner: PlannerAgent;

  constructor(planner: PlannerAgent) {
    this.planner = planner;
  }

  /**
   * Process a user's chat message and return the AI's reply.
   *
   * Routes through PlannerAgent which decides:
   *  - Is this an order? → run autonomous pipeline
   *  - Otherwise?       → general LLM food chat
   *
   * @param userMessage - The raw text from the user
   * @returns The AI assistant's reply string
   */
  async processMessage(userMessage: string): Promise<string> {
    const cleanedMessage = userMessage.trim();

    if (!cleanedMessage) {
      return "I didn't quite catch that. Could you tell me what you're craving? 🍽️";
    }

    return await this.planner.process(cleanedMessage);
  }
}
