import { LLMProvider } from "./LLMProvider.interface";
import { config } from "../config";

/**
 * OpenRouterProvider.ts
 *
 * LLMProvider implementation using OpenRouter's OpenAI-compatible API endpoint.
 * Serves as a high-capacity, low-latency failover provider when primary Groq keys hit rate limits.
 *
 * API Endpoint: https://openrouter.ai/api/v1/chat/completions
 * Supports top models like meta-llama/llama-3.3-70b-instruct, deepseek/deepseek-chat, google/gemini-2.0-flash-001.
 */
export class OpenRouterProvider implements LLMProvider {
  private apiKey: string;
  private model: string;

  constructor(apiKey?: string, model?: string) {
    this.apiKey = apiKey || config.openrouterApiKey || process.env.OPENROUTER_API_KEY || "";
    this.model = model || config.openrouterModel || "meta-llama/llama-3.3-70b-instruct";
  }

  async chat(userMessage: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error("OPENROUTER_API_KEY is not configured.");
    }

    let retries = 3;
    let delay = 2000;

    while (retries > 0) {
      try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${this.apiKey}`,
            "HTTP-Referer": "https://grub-to-go.app",
            "X-Title": "GrubToGo Bistro AI Assistant",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: this.model,
            messages: [
              {
                role: "user",
                content: userMessage,
              },
            ],
            temperature: 0.7,
            max_tokens: 512,
          }),
        });

        if (!response.ok) {
          const errText = await response.text();
          if (response.status === 429 && retries > 1) {
            console.warn(`[OpenRouterProvider] ⏳ 429 Rate limit hit. Retrying in ${delay / 1000}s...`);
            await new Promise((r) => setTimeout(r, delay));
            delay *= 2;
            retries--;
            continue;
          }
          throw new Error(`OpenRouter API error (${response.status}): ${errText}`);
        }

        const data: any = await response.json();
        const reply = data.choices?.[0]?.message?.content;

        if (!reply) {
          throw new Error("OpenRouter returned an empty response.");
        }

        return reply.trim();
      } catch (err: any) {
        if (err?.message?.includes("429") && retries > 1) {
          await new Promise((r) => setTimeout(r, delay));
          delay *= 2;
          retries--;
        } else {
          console.warn(`[OpenRouterProvider] Request failed for model ${this.model}:`, err.message);
          throw err;
        }
      }
    }

    throw new Error("OpenRouter API failed after max retries.");
  }
}
