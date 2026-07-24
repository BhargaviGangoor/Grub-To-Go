import { MenuItemModel } from "../models/MenuItem";
import { MenuItemData, OrderConstraints } from "../types/agent.types";

/**
 * MenuTool
 *
 * Queries REAL dish data from the MongoDB MenuItem collection.
 * The LLM never invents dishes — this is the single source of truth.
 *
 * Filtering is deterministic:
 *  1. Budget: estimatedCost <= maxBudget
 *  2. Dietary: dish.dietary must include ALL requested dietary tags
 *  3. Spice level: exact match if specified
 *  4. Cuisine: case-insensitive match if specified ("Any" matches all)
 */
export class MenuTool {
  /**
   * Find menu candidates matching the given constraints.
   * Returns all matching dishes — caller (PlannerAgent) handles ranking.
   */
  async findCandidates(constraints: OrderConstraints): Promise<MenuItemData[]> {
    console.log("[MenuTool] Searching menu catalog with constraints:", JSON.stringify(constraints));

    // Start with all menu items
    const allItems = await MenuItemModel.find().lean();

    const candidates = allItems.filter((item) => {
      // 1. Budget filter
      if (constraints.maxBudget !== undefined) {
        if (item.estimatedCost > constraints.maxBudget) return false;
      }

      // 2. Dietary filter — all requested tags must be present in dish dietary[]
      if (constraints.dietary && constraints.dietary.length > 0) {
        const dishDietaryNormalized = item.dietary.map((d: string) =>
          d.toLowerCase().replace("-", " ")
        );
        const allSatisfied = constraints.dietary.every((req) => {
          const reqNormalized = req.toLowerCase().replace("-", " ");
          return dishDietaryNormalized.includes(reqNormalized);
        });
        if (!allSatisfied) return false;
      }

      // 3. Spice level filter (exact match if specified)
      if (constraints.spiceLevel && constraints.spiceLevel !== "Medium") {
        if (item.spiceLevel !== constraints.spiceLevel) return false;
      }

      // 4. Cuisine filter (skip if "Any")
      if (constraints.cuisine && constraints.cuisine.toLowerCase() !== "any") {
        if (item.cuisine.toLowerCase() !== constraints.cuisine.toLowerCase()) {
          // Also allow "Any" cuisine dishes to match all cuisine requests
          if (item.cuisine !== "Any") return false;
        }
      }

      return true;
    });

    console.log(`[MenuTool] Found ${candidates.length} matching candidate(s)`);

    // Return mapped to MenuItemData shape
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
