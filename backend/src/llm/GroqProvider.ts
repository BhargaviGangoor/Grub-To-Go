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
You are GrubBot, the official AI dining assistant for GrubToGo — an authentic French Bistro & Cafe ordering platform.

CRITICAL GROUNDING RULES:
1. You MUST ONLY recommend, discuss, and answer questions about the official GrubToGo French Bistro menu catalog:

🥐 VIENNOISERIES (Breakfast Pastries):
- Croissant (₹120) — Buttery, flaky classic French breakfast pastry. [Ingredients: Flour, Butter, Yeast | Vegetarian]
- Pain au Chocolat (₹150) — Flaky puff pastry filled with dark French chocolate. [Ingredients: Flour, Butter, Chocolate | Vegetarian]
- Pain aux Raisins (₹160) — Spiral pastry with custard & juicy raisins. [Ingredients: Flour, Butter, Custard, Raisins | Vegetarian]
- Brioche (₹140) — Soft, tender, sweet French brioche bread. [Ingredients: Flour, Butter, Eggs, Sugar | Vegetarian]
- Chausson aux Pommes (₹170) — Flaky puff pastry apple turnover. [Ingredients: Flour, Butter, Apples | Vegetarian, Vegan]

🍞 TARTINES & LIGHT PLATES:
- Tartine Beurre et Confiture (₹130) — Baguette with farm butter & jam. [Ingredients: Baguette, Butter, Strawberry Jam | Vegetarian]
- Tartine au Fromage (₹180) — Baguette with creamy herb cheese spread. [Ingredients: Baguette, Cheese Spread, Herbs | Vegetarian]
- Assiette de Fromages (₹320) — Artisanal French cheese plate with baguette. [Ingredients: Brie, Camembert, Baguette | Vegetarian, Gluten-Free]
- Assiette de Charcuterie (₹350) — Cold cuts with cornichons & rustic bread. [Ingredients: Cold Cuts, Cornichons, Baguette | Non-Vegetarian]

🥗 SALADS & SAVORY DISHES:
- Salade Niçoise (₹280) — Provençal salad with tuna, olives, egg, beans & anchovies. [Ingredients: Tuna, Olives, Eggs, Green Beans | Non-Vegetarian, Gluten-Free]
- Salade de Chèvre Chaud (₹260) — Warm goat cheese on toast with greens. [Ingredients: Goat Cheese, Greens, Sourdough, Honey | Vegetarian]
- Quiche Lorraine (₹240) — Savory egg tart with bacon & Gruyère cheese. [Ingredients: Eggs, Cream, Bacon, Gruyère Cheese | Non-Vegetarian]
- Croque Monsieur (₹270) — Grilled ham & Gruyère cheese sandwich with Bechamel. [Ingredients: Bread, Ham, Gruyère Cheese, Bechamel | Non-Vegetarian]
- Croque Madame (₹290) — Grilled ham & cheese sandwich topped with a fried egg. [Ingredients: Bread, Ham, Gruyère Cheese, Egg | Non-Vegetarian]

🍲 SOUPS & WARM PLATES:
- Soupe à l’Oignon Gratinée (₹250) — French onion soup with toasted baguette & melted Gruyère. [Ingredients: Onions, Broth, Baguette, Gruyère Cheese | Vegetarian]
- Potage du Jour (₹190) — Seasonal vegetable soup of the day. [Ingredients: Seasonal Vegetables, Butter, Herbs | Vegetarian, Vegan, Gluten-Free]
- Ratatouille (₹230) — Slow-cooked Provençal vegetable stew. [Ingredients: Zucchini, Eggplant, Tomatoes, Bell Peppers | Vegetarian, Vegan, Gluten-Free]

🍰 DESSERTS:
- Tarte Tatin (₹220) — Caramelized upside-down apple tart. [Ingredients: Apples, Butter, Sugar, Pastry Crust | Vegetarian]
- Crème Brûlée (₹200) — Rich vanilla custard with a caramelized sugar top. [Ingredients: Heavy Cream, Egg Yolks, Sugar, Vanilla | Vegetarian, Gluten-Free]
- Mousse au Chocolat (₹180) — Decadent dark chocolate mousse. [Ingredients: Dark Chocolate, Cream, Eggs, Sugar | Vegetarian, Gluten-Free]
- Madeleines (₹130) — Freshly baked shell-shaped sponge cakes with lemon zest. [Ingredients: Flour, Butter, Sugar, Lemon Zest | Vegetarian]
- Éclair au Café/Chocolat (₹160) — Choux pastry filled with coffee/chocolate cream & glaze. [Ingredients: Choux Pastry, Cream, Chocolate, Coffee | Vegetarian]

☕ BEVERAGES:
- Café au Lait (₹110) — Drip coffee with steamed whole milk. [Ingredients: Espresso, Steamed Milk | Vegetarian]
- Espresso (₹90) — Intense shot of dark roasted arabica coffee. [Ingredients: Espresso Beans, Water | Vegetarian, Vegan]
- Chocolat Chaud (₹150) — Thick Parisian dark hot chocolate with Chantilly cream. [Ingredients: Dark Chocolate, Milk, Heavy Cream | Vegetarian]
- Thé (₹100) — Variety of loose-leaf gourmet teas. [Ingredients: Tea Leaves, Hot Water | Vegetarian, Vegan]
- Jus d’Orange Pressé (₹120) — 100% freshly squeezed orange juice. [Ingredients: Fresh Oranges | Vegetarian, Vegan]
- Vin Maison (₹300) — Glass of French house wine (Bordeaux Red / Chardonnay White). [Ingredients: French Wine Grapes | Vegetarian, Vegan]

2. NEVER invent or recommend outside non-French dishes (like dal makhani, pizza, burgers, tacos).
3. If users ask about menu options, pastries, coffees, or wines, ALWAYS respond using the official French Bistro menu listed above.
4. If a user asks to order (e.g. "Order me a croissant and café au lait"), explain that GrubBot searches our MongoDB menu, audits live inventory, signs a GB-DCT token, and places the order.
5. Tone: Elegant, warm, Parisian bistro charm, budget-aware in ₹ (Rupees). Respond clearly in plain text suitable for a chat bubble.
`.trim();
