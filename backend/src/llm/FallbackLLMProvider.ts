import { LLMProvider } from "./LLMProvider.interface";

/**
 * FallbackLLMProvider.ts
 *
 * Multi-Provider Failover & Load Balancing Wrapper.
 *
 * Implements the Composite / Chain of Responsibility pattern for LLMProviders:
 *   Primary Provider (e.g. Groq Key 1)
 *     ↳ Failover #1 (e.g. Groq Key 2 / Secondary Model)
 *       ↳ Failover #2 (e.g. Gemini / OpenAI / Alternative API)
 *         ↳ Deterministic Heuristic Fallback
 *
 * WHY THIS IS CRITICAL:
 * Free-tier LLM APIs (like Groq) enforce strict 12,000 TPM and 100,000 TPD limits.
 * When a provider hits a 429 RateLimitError or quota exhaustion, FallbackLLMProvider
 * automatically catches the error, logs the failover, and tries the next configured provider
 * without crashing the agent loop or interrupting the user's experience.
 */
export class FallbackLLMProvider implements LLMProvider {
  private providers: LLMProvider[];

  constructor(providers: LLMProvider[]) {
    this.providers = providers.filter(Boolean);
    if (this.providers.length === 0) {
      throw new Error("FallbackLLMProvider requires at least one valid provider.");
    }
  }

  async chat(userMessage: string): Promise<string> {
    const errors: string[] = [];

    for (let i = 0; i < this.providers.length; i++) {
      const provider = this.providers[i];
      const providerName = provider.constructor.name || `Provider#${i + 1}`;

      try {
        const response = await provider.chat(userMessage);
        if (response) {
          if (i > 0) {
            console.log(`[FallbackLLMProvider] ✅ Failover to ${providerName} succeeded!`);
          }
          return response;
        }
      } catch (err: any) {
        const isRateLimit = err?.status === 429 || (err?.message && err.message.toLowerCase().includes("rate limit"));
        const errType = isRateLimit ? "429 Rate Limit Exceeded" : err?.message || "Unknown error";
        
        console.warn(`[FallbackLLMProvider] ⚠️ Provider #${i + 1} (${providerName}) failed: ${errType}`);
        errors.push(`${providerName}: ${errType}`);

        // If there are more providers, continue to the next provider
        if (i < this.providers.length - 1) {
          console.log(`[FallbackLLMProvider] 🔄 Failing over to Provider #${i + 2}...`);
        }
      }
    }

    throw new Error(`All configured LLM providers failed. Errors: ${errors.join(" | ")}`);
  }
}
