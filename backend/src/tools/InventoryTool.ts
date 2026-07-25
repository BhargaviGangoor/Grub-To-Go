import { getPantry, getDietaryRules } from "../services/db";
import { InventoryCheckResult, MenuItemData, OrderAuthorization } from "../types/agent.types";

/**
 * InventoryTool
 *
 * Checks physical inventory stock levels (pantry) and verifies
 * live dietary rules against the user's immutable OrderAuthorization.
 */
export class InventoryTool {
  /**
   * Check if all ingredients of a dish are available in pantry (qty > 0)
   * and live dietary rules permit the dish for the given authorization.
   */
  async checkAvailability(
    dish: MenuItemData,
    auth: OrderAuthorization
  ): Promise<InventoryCheckResult> {
    console.log(`[InventoryTool] Auditing live inventory & dietary state for: ${dish.name}`);

    const pantry = await getPantry();
    const dietaryRules = await getDietaryRules();

    const outOfStock: string[] = [];

    // 1. Check physical ingredient inventory stock
    for (const ingredient of dish.ingredients) {
      const qty = pantry[ingredient] ?? 0;
      if (qty <= 0) {
        outOfStock.push(`${ingredient} (stock: ${qty})`);
        console.log(`[InventoryTool] Stockout detected: ${ingredient} (qty: ${qty})`);
      }
    }

    // 2. Check live dietary rules drift against authorization
    if (auth.dietary && auth.dietary.length > 0) {
      for (const ingredient of dish.ingredients) {
        const liveRules = dietaryRules[ingredient] ?? [];
        const liveNormalized = liveRules.map((r: string) =>
          r.toLowerCase().replace("-", " ")
        );

        for (const req of auth.dietary) {
          const reqNormalized = req.toLowerCase().replace("-", " ");
          if (!liveNormalized.includes(reqNormalized)) {
            const violation = `${ingredient} (live rules no longer permit ${req})`;
            if (!outOfStock.includes(violation)) {
              outOfStock.push(violation);
              console.log(`[InventoryTool] Dietary drift detected: ${violation}`);
            }
          }
        }
      }
    }

    const available = outOfStock.length === 0;
    console.log(
      `[InventoryTool] ${dish.name}: ${
        available ? "✓ Available" : `✗ Unavailable (${outOfStock.join("; ")})`
      }`
    );

    return { available, outOfStock };
  }
}
