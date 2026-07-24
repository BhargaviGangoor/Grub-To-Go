import { getPantry, getDietaryRules } from "../services/db";
import { InventoryCheckResult, MenuItemData, OrderConstraints } from "../types/agent.types";

/**
 * InventoryTool
 *
 * Checks whether a dish's required ingredients are currently in stock,
 * and whether the live dietary rules still permit the dish for the given
 * dietary constraints.
 *
 * Reuses existing getPantry() and getDietaryRules() from services/db.ts.
 * No duplication of state logic.
 */
export class InventoryTool {
  /**
   * Check if all ingredients of a dish are available (qty > 0).
   * Also cross-checks live dietary rules against requested constraints.
   */
  async checkAvailability(
    dish: MenuItemData,
    constraints: OrderConstraints
  ): Promise<InventoryCheckResult> {
    console.log(`[InventoryTool] Checking availability for: ${dish.name}`);

    const pantry = await getPantry();
    const dietaryRules = await getDietaryRules();

    const outOfStock: string[] = [];

    // 1. Check inventory quantity
    for (const ingredient of dish.ingredients) {
      const qty = pantry[ingredient] ?? 0;
      if (qty <= 0) {
        outOfStock.push(ingredient);
        console.log(`[InventoryTool] Out of stock: ${ingredient} (qty: ${qty})`);
      }
    }

    // 2. Check live dietary rules (world-state may have drifted since menu was seeded)
    if (constraints.dietary && constraints.dietary.length > 0) {
      for (const ingredient of dish.ingredients) {
        const liveRules = dietaryRules[ingredient] ?? [];
        const liveNormalized = liveRules.map((r: string) =>
          r.toLowerCase().replace("-", " ")
        );

        for (const req of constraints.dietary) {
          const reqNormalized = req.toLowerCase().replace("-", " ");
          if (!liveNormalized.includes(reqNormalized)) {
            const violation = `${ingredient} (live rules no longer allow ${req})`;
            if (!outOfStock.includes(violation)) {
              outOfStock.push(violation);
              console.log(`[InventoryTool] Dietary drift: ${violation}`);
            }
          }
        }
      }
    }

    const available = outOfStock.length === 0;
    console.log(`[InventoryTool] ${dish.name}: ${available ? "✓ Available" : `✗ Unavailable (${outOfStock.join(", ")})`}`);

    return { available, outOfStock };
  }
}
