import Groq from "groq-sdk";
import { LLMProvider } from "./LLMProvider.interface";
import { config } from "../config";

/**
 * GroqProvider.ts
 *
 * Concrete implementation of LLMProvider using the Groq SDK.
 *
 * ─── WHY GROQ ────────────────────────────────────────────────────────────────
 * Groq's LPU (Language Processing Unit) delivers 500-800 tokens/second.
 * For an agentic ordering assistant, response latency is critical UX.
 * A slow AI copilot feels broken. A fast one feels magical.
 *
 * ─── WHY THIS CLASS IS ISOLATED ─────────────────────────────────────────────
 * ChatService has ZERO knowledge of Groq. It only calls LLMProvider.chat().
 * All Groq-specific SDK usage, model names, and API shapes live here.
 * This is the "concrete" in Dependency Inversion.
 *
 * ─── SYSTEM PROMPT DESIGN ────────────────────────────────────────────────────
 * The system prompt defines the AI's identity and constraints.
 * It tells the model it is a dining assistant, not a general chatbot.
 * This prevents off-topic responses and shapes the personality.
 *
 * In future: the system prompt will be dynamically assembled with:
 *   - current restaurant menu context
 *   - user dietary preferences
 *   - budget constraints
 *   - live inventory status
 */
export class GroqProvider implements LLMProvider {
  private client: Groq;
  private model: string;

  constructor() {
    this.client = new Groq({
      apiKey: config.groqApiKey,
    });
    this.model = config.groqModel;
  }

  /**
   * Send a message to Groq and return the assistant reply.
   *
   * TypeScript concept: async/await over Promises.
   * `await` pauses execution until the Promise resolves,
   * but does NOT block the Node.js event loop (non-blocking I/O).
   */
  async chat(userMessage: string): Promise<string> {
    if (!config.groqApiKey) {
      throw new Error(
        "GROQ_API_KEY is not configured. " +
        "Add GROQ_API_KEY=gsk_... to backend/.env. " +
        "Get a free key at https://console.groq.com"
      );
    }

    const completion = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        {
          role: "system",
          content: GRUB_TO_GO_SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
      temperature: 0.7,    // Balanced: creative but not hallucinating
      max_tokens: 512,     // Concise responses for a chat copilot
      top_p: 1,
    });

    const reply = completion.choices[0]?.message?.content;

    if (!reply) {
      throw new Error("Groq returned an empty response.");
    }

    return reply.trim();
  }
}

/**
 * The system prompt that defines GrubToGo's AI dining assistant identity.
 *
 * DESIGN DECISIONS:
 * 1. Persona first: clear role definition prevents off-topic drift.
 * 2. Constraints: keeps responses focused on food/ordering domain.
 * 3. Tone: warm and helpful — matches GrubToGo's cozy restaurant brand.
 * 4. Future hooks: mentions agents, so users understand it's agentic.
 *
 * When LangGraph agents are added, this prompt will be assembled dynamically
 * with live context: menu items, inventory, user preferences.
 */
const GRUB_TO_GO_SYSTEM_PROMPT = `
You are GrubBot, the AI dining assistant for GrubToGo — an agentic restaurant ordering platform.

Your role is to help users:
- Find and order food that matches their preferences, budget, and dietary needs
- Generate personalized recipes and meal ideas
- Recommend dishes based on nutrition goals (high-protein, low-carb, etc.)
- Discover new cuisines and restaurants
- Navigate the ordering process naturally through conversation

Your personality:
- Warm, helpful, and enthusiastic about food
- Concise — chat responses, not essays (2-4 sentences usually)
- Knowledgeable about Indian cuisine, nutrition, and global food
- Budget-aware: always respect ₹ (Indian Rupee) budgets when mentioned

Capabilities you will gain in future updates:
- Real-time restaurant and menu search
- Inventory-aware recommendations
- Automatic order placement via secure GB-DCT tokens
- Multi-restaurant comparison

For now, provide thoughtful, personalized food recommendations based on the user's request.
If the user asks about something unrelated to food, dining, or nutrition, gently steer them back.

Always respond in plain text. No markdown formatting — this displays in a chat bubble.
`.trim();
