import { GoogleGenAI } from "@google/genai";
import { LLMProvider } from "./LLMProvider.interface";
import { config } from "../config";

/**
 * GeminiProvider.ts
 *
 * LLMProvider implementation using Google's official @google/genai SDK.
 * Serves as a primary or failover provider when Groq APIs experience rate limiting.
 */
export class GeminiProvider implements LLMProvider {
  private ai?: GoogleGenAI;
  private model: string;

  constructor(apiKey?: string, model: string = "gemini-2.5-flash") {
    const key = apiKey || config.geminiApiKey || process.env.GEMINI_API_KEY;
    this.model = model;

    if (key && key.trim().length > 0) {
      this.ai = new GoogleGenAI({ apiKey: key });
    }
  }

  async chat(userMessage: string): Promise<string> {
    if (!this.ai) {
      throw new Error("GEMINI_API_KEY is not configured.");
    }

    const response = await this.ai.models.generateContent({
      model: this.model,
      contents: [userMessage],
    });

    const reply = response.text;
    if (!reply) {
      throw new Error("Gemini returned an empty response.");
    }

    return reply.trim();
  }
}
