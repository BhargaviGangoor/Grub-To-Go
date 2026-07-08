import { LLMProvider } from "../llm/LLMProvider.interface";

/**
 * ChatService.ts
 *
 * The Business Logic Layer for the AI chat feature.
 *
 * ─── WHAT GOES IN A SERVICE ──────────────────────────────────────────────────
 * Business logic. NOT HTTP concerns (no req/res here).
 * NOT LLM implementation details (no Groq-specific code here).
 *
 * The service asks: "Given this user message, what should happen?"
 * The answer today: forward to LLM, return reply.
 * The answer in Phase 2: run through a multi-agent pipeline.
 *
 * ─── WHY DEPENDENCY INJECTION ────────────────────────────────────────────────
 * The LLMProvider is passed into the constructor — not instantiated inside.
 * This is "Dependency Injection" (DI), a core pattern in SOLID architecture.
 *
 * Benefits:
 *   1. Testability: pass MockProvider in tests, no real API calls needed
 *   2. Flexibility: pass GroqProvider today, PlannerAgent tomorrow
 *   3. Single Responsibility: the service doesn't decide which LLM to use
 *
 * ─── HOW THIS EVOLVES INTO MULTI-AGENT ──────────────────────────────────────
 *
 * Today:
 *   processMessage(msg) → this.llm.chat(msg) → string
 *
 * Phase 2 (just change what's passed as `llm`):
 *   processMessage(msg)
 *     → detectIntent(msg)           ← IntentAgent
 *     → fetchRestaurants(intent)     ← RestaurantAgent
 *     → filterMenu(restaurants)      ← MenuAgent + InventoryAgent
 *     → buildRecommendation()        ← RecommendationAgent
 *     → return formatted response
 *
 * Phase 3 (LangGraph):
 *   processMessage(msg) → graph.invoke({ message: msg }) → AgentState
 *
 * THE CONTROLLER AND FRONTEND NEVER CHANGE.
 */
export class ChatService {
  private llm: LLMProvider;

  /**
   * TypeScript concept: Constructor injection.
   * `private llm: LLMProvider` both declares the property AND assigns it.
   * The type is the INTERFACE, not the concrete class — crucial.
   */
  constructor(llm: LLMProvider) {
    this.llm = llm;
  }

  /**
   * Process a user's chat message and return the AI's reply.
   *
   * This is the single method that will evolve into the multi-agent
   * orchestration layer. Today it's one line. That's intentional.
   * Clean architecture starts simple and grows in the right direction.
   *
   * @param userMessage - The raw text from the user
   * @returns The AI assistant's reply string
   */
  async processMessage(userMessage: string): Promise<string> {
    // Sanitize: trim whitespace
    const cleanedMessage = userMessage.trim();

    if (!cleanedMessage) {
      return "I didn't quite catch that. Could you tell me what you're craving? 🍽️";
    }

    // TODAY: Direct LLM call through the interface.
    // FUTURE: This single line becomes the multi-agent orchestration call.
    const reply = await this.llm.chat(cleanedMessage);

    return reply;
  }
}
