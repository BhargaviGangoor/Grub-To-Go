import { MenuItemModel } from "../models/MenuItem";
import { MenuItemData, OrderAuthorization } from "../types/agent.types";

/**
 * MenuTool
 *
 * Deterministic tool for querying dish data from the MongoDB MenuItem collection.
 * The LLM never invents dishes — MongoDB is the single source of truth.
 *
 * Filtering rules:
 *  1. Budget: estimatedCost <= maxBudget
 *  2. Dietary: dish.dietary must include ALL requested dietary tags
 *  3. Excluded ingredients: dish.ingredients must NOT contain any excluded ingredient
 *  4. Spice level: exact match if specified (non-Medium)
 *  5. Cuisine: case-insensitive match if specified
 *  6. Attempted dishes: excludes any dish ID in attemptedDishIds (for replanning)
 */
export class MenuTool {
  /**
   * Find candidate dishes matching the user's immutable authorization.
   */
  async findCandidates(
    auth: OrderAuthorization,
    attemptedDishIds: string[] = []
  ): Promise<MenuItemData[]> {
    console.log("[MenuTool] Searching catalog with authorization:", JSON.stringify(auth));
    if (attemptedDishIds.length > 0) {
      console.log(`[MenuTool] Excluding attempted dish IDs: [${attemptedDishIds.join(", ")}]`);
    }

    // Query all items from MongoDB
    const allItems = await MenuItemModel.find().lean();

    const candidates = allItems.filter((item) => {
      // 0. Exclude previously attempted dishes
      if (attemptedDishIds.includes(item.id)) return false;

      // 1. Budget filter
      if (auth.maxBudget !== undefined && auth.maxBudget !== null) {
        if (item.estimatedCost > auth.maxBudget) return false;
      }

      // 2. Dietary filter — all requested tags must be present in dish dietary[]
      if (auth.dietary && auth.dietary.length > 0) {
        const dishDietaryNormalized = item.dietary.map((d: string) =>
          d.toLowerCase().replace("-", " ")
        );
        const allSatisfied = auth.dietary.every((req) => {
          const reqNormalized = req.toLowerCase().replace("-", " ");
          return dishDietaryNormalized.includes(reqNormalized);
        });
        if (!allSatisfied) return false;
      }

      // 3. Excluded ingredients filter
      if (auth.excludedIngredients && auth.excludedIngredients.length > 0) {
        const itemIngredientsLower = item.ingredients.map((ing: string) => ing.toLowerCase());
        for (const excluded of auth.excludedIngredients) {
          const excludedLower = excluded.toLowerCase();
          if (itemIngredientsLower.some((ing) => ing.includes(excludedLower) || excludedLower.includes(ing))) {
            return false;
          }
        }
      }

      // 4. Spice level filter
      if (auth.spiceLevel && auth.spiceLevel !== "Medium") {
        if (item.spiceLevel !== auth.spiceLevel) return false;
      }

      // 5. Cuisine filter
      if (auth.cuisine && auth.cuisine.toLowerCase() !== "any") {
        if (item.cuisine.toLowerCase() !== auth.cuisine.toLowerCase()) {
          if (item.cuisine !== "Any") return false;
        }
      }

      // 6. Dish name keyword query filter
      if (auth.dishNameQuery) {
        const query = auth.dishNameQuery.toLowerCase().trim();
        const itemName = item.name.toLowerCase();
        const matches = itemName.includes(query) || query.includes(itemName);
        if (!matches) return false;
      }

      return true;
    });

    console.log(`[MenuTool] Found ${candidates.length} candidate(s) matching authorization`);

    return candidates.map((item) => ({
      id: item.id,
      name: item.name,
      cuisine: item.cuisine,
      spiceLevel: item.spiceLevel as "Mild" | "Medium" | "Spicy",
      dietary: item.dietary,
      estimatedCost: item.estimatedCost,
      ingredients: item.ingredients,
      description: item.description,
      imageUrl: item.imageUrl,
    }));
  }
}
