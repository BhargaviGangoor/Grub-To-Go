import { LLMProvider } from "./LLMProvider.interface";

/**
 * HuggingFaceLLMProvider.ts
 *
 * Concrete implementation of LLMProvider using the Hugging Face Inference API.
 * Uses HuggingFace free text-generation models (e.g. Qwen/Qwen2.5-72B-Instruct, Mistral-7B, or Llama-3)
 * as a backup failover provider when Groq and Gemini hit rate limits.
 */
export class HuggingFaceLLMProvider implements LLMProvider {
  private apiKey: string;
  private model: string;

  constructor(apiKey?: string, model: string = "Qwen/Qwen2.5-72B-Instruct") {
    this.apiKey = apiKey || process.env.HF_TOKEN || process.env.HUGGINGFACE_API_KEY || "";
    this.model = process.env.HF_TEXT_MODEL || model;
  }

  async chat(userMessage: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error("HUGGINGFACE_API_KEY / HF_TOKEN is not configured.");
    }

    try {
      const response = await fetch(
        `https://api-inference.huggingface.co/models/${this.model}`,
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            inputs: userMessage,
            parameters: {
              max_new_tokens: 256,
              temperature: 0.7,
              return_full_text: false,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HF Inference API error (${response.status}): ${response.statusText}`);
      }

      const data: any = await response.json();
      let replyText = "";

      if (Array.isArray(data) && data[0]?.generated_text) {
        replyText = data[0].generated_text;
      } else if (data && typeof data === "object" && "generated_text" in data) {
        replyText = (data as any).generated_text;
      } else {
        throw new Error("Unexpected payload shape from Hugging Face Inference API");
      }

      return replyText.trim();
    } catch (err: any) {
      console.warn(`[HuggingFaceLLMProvider] Error calling model ${this.model}:`, err.message);
      throw err;
    }
  }
}
