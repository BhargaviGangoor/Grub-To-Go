/**
 * LLMProvider.interface.ts
 *
 * THE KEY ABSTRACTION in GrubToGo's AI architecture.
 *
 * ─── WHY THIS EXISTS ─────────────────────────────────────────────────────────
 *
 * ChatService does NOT import GroqProvider directly.
 * ChatService only knows about this interface.
 *
 * This is the Dependency Inversion Principle (SOLID):
 *   "Depend on abstractions, not concretions."
 *
 * ─── HOW THIS ENABLES FUTURE EVOLUTION ──────────────────────────────────────
 *
 * TODAY:
 *   ChatService → GroqProvider → Groq API → llama-3.3-70b
 *
 * PHASE 2 (swap one line in ChatService):
 *   ChatService → PlannerAgent.run() → [IntentAgent, RestaurantAgent, ...]
 *
 * PHASE 3 (swap one line in ChatService):
 *   ChatService → LangGraph.invoke() → full multi-agent graph
 *
 * The frontend NEVER changes. The controller NEVER changes.
 * Only what gets passed as the `LLMProvider` to ChatService changes.
 *
 * ─── ALTERNATIVE PROVIDERS ───────────────────────────────────────────────────
 *   class CerebrasProvider implements LLMProvider { ... }
 *   class HuggingFaceProvider implements LLMProvider { ... }
 *   class MockProvider implements LLMProvider { ... }  ← for tests
 *   class PlannerAgent implements LLMProvider { ... }  ← for multi-agent
 */
export interface LLMProvider {
  /**
   * Send a user message to the underlying LLM (or agent graph).
   * Returns the assistant's reply as a plain string.
   *
   * Future extension: return `AsyncIterableIterator<string>` for streaming.
   */
  chat(userMessage: string): Promise<string>;
}
