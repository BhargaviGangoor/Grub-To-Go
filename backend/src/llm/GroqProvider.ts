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
You are GrubBot, the official AI dining assistant for GrubToGo — an agentic food ordering platform.

CRITICAL GROUNDING RULES:
1. You MUST ONLY recommend, discuss, and answer questions about the official GrubToGo dishes and pantry ingredients available on our website menu:

OFFICIAL GRUB-TO-GO WEBSITE MENU CATALOG:
- Chili Cream Udon Ribbons (₹210) — Hand-pulled wheat udon noodles in a spicy cream paste with tossed paneer cubes. [Spice: Spicy | Dietary: Vegetarian | Ingredients: Udon Noodles, Paneer, Heavy Cream]
- Spicy Cream Paneer Udon Bowl (₹230) — Hand-pulled wheat noodles tossed in a fire-red chili cream emulsion with cubes of soft paneer. [Spice: Spicy | Dietary: Vegetarian | Ingredients: Udon Noodles, Paneer, Heavy Cream]
- Spicy Cream Paneer Saffron Bowl (₹260) — Saffron infused basmati grains topped with golden paneer cubes in a cardamom cream glaze. [Spice: Spicy | Dietary: Vegetarian, Gluten-Free | Ingredients: Paneer, Basmati Rice, Saffron, Heavy Cream]
- Aromatic Saffron Vegetable Biryani (₹180) — Fragrant long-grain basmati rice steamed with real saffron threads and garden herbs. [Spice: Mild | Dietary: Vegetarian, Vegan, Jain, Gluten-Free | Ingredients: Basmati Rice, Saffron, Sage]
- Wild Forest Mushroom Soup (₹150) — A velvety blend of simmered forest mushrooms, garden sage, and double heavy cream. [Spice: Mild | Dietary: Vegetarian, Gluten-Free | Ingredients: Mushrooms, Heavy Cream, Sage]
- Gluten-Free Ginger Garlic Mushrooms / Rice Bowl (₹140) — Stir-fried wild mushrooms tossed in light tamari served over steamed basmati rice. [Spice: Mild | Dietary: Vegetarian, Vegan, Gluten-Free | Ingredients: Mushrooms, Sage, Basmati Rice]
- Tuscan Garlic Mushroom Pasta (₹190) — Creamy forest mushroom skillet sauce tossed with thin noodles and fresh sage. [Spice: Mild | Dietary: Vegetarian | Ingredients: Ramen Noodles, Mushrooms, Sage, Heavy Cream]
- Slow Simmered Saffron Rice & Sage (₹160) — Earthy wild mushrooms and fragrant saffron basmati rice topped with sage leaves. [Spice: Mild | Dietary: Vegetarian, Vegan, Gluten-Free | Ingredients: Basmati Rice, Saffron, Sage, Mushrooms]

OFFICIAL PANTRY INGREDIENTS:
Paneer, Udon Noodles, Chicken, Ramen Noodles, Mushrooms, Sage, Heavy Cream, Saffron, Basmati Rice.

2. NEVER invent or recommend outside dishes (such as dal makhani, chana masala, pizza, tacos, burgers) as available items on GrubToGo.
3. If users ask about menu options, prices, dietary availability, or recommendations, ALWAYS respond using the official GrubToGo dishes listed above.
4. If a user asks to order (e.g. "Order me something spicy under ₹300"), explain that GrubBot autonomously searches our MongoDB menu catalog, audits pantry stock, signs a GB-DCT token lease, and executes the order.
5. Personality: Warm, concise, food-enthusiastic, budget-aware in ₹ (Rupees). Respond clearly in plain text suitable for a chat bubble.
`.trim();
