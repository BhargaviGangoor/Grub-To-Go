import { MenuItemData, OrderAuthorization } from "../types/agent.types";

/**
 * AgentPolicyGate.ts
 *
 * Deterministic Policy Enforcement Layer.
 *
 * Ensures that any candidate dish proposed during autonomous planning or replanning
 * STRICTLY satisfies the user's original immutable OrderAuthorization before:
 *   1. Inventory checking
 *   2. GB-DCT commitment token generation
 *   3. Order creation
 *
 * If a candidate violates hard constraints (e.g. price > maxBudget, or dietary tag missing),
 * the policy gate rejects the candidate with AUTHORIZATION_DRIFT and blocks execution.
 */

export interface PolicyValidationResult {
  valid: boolean;
  violations: string[];
}

export class AgentPolicyGate {
  /**
   * Validates a candidate dish against the user's immutable authorization.
   */
  static validate(dish: MenuItemData, auth: OrderAuthorization): PolicyValidationResult {
    const violations: string[] = [];

    // 1. Budget Authorization Gate
    if (auth.maxBudget !== undefined && auth.maxBudget !== null) {
      if (dish.estimatedCost > auth.maxBudget) {
        violations.push(
          `AUTHORIZATION_DRIFT: Dish cost ₹${dish.estimatedCost} exceeds max budget ₹${auth.maxBudget}`
        );
      }
    }

    // 2. Dietary Authorization Gate
    if (auth.dietary && auth.dietary.length > 0) {
      const dishDietaryNormalized = dish.dietary.map((d) =>
        d.toLowerCase().replace("-", " ")
      );

      for (const req of auth.dietary) {
        const reqNormalized = req.toLowerCase().replace("-", " ");
        if (!dishDietaryNormalized.includes(reqNormalized)) {
          violations.push(
            `AUTHORIZATION_DRIFT: Dish does not satisfy dietary requirement "${req}"`
          );
        }
      }
    }

    // 3. Excluded Ingredients Authorization Gate
    if (auth.excludedIngredients && auth.excludedIngredients.length > 0) {
      const dishIngredientsLower = dish.ingredients.map((i) => i.toLowerCase());
      for (const excluded of auth.excludedIngredients) {
        const excludedLower = excluded.toLowerCase();
        if (
          dishIngredientsLower.some(
            (ing) => ing.includes(excludedLower) || excludedLower.includes(ing)
          )
        ) {
          violations.push(
            `AUTHORIZATION_DRIFT: Dish contains excluded ingredient "${excluded}"`
          );
        }
      }
    }

    // 4. Spice Level Gate (if hard restriction specified)
    if (auth.spiceLevel && auth.spiceLevel !== "Medium") {
      if (dish.spiceLevel !== auth.spiceLevel) {
        violations.push(
          `AUTHORIZATION_DRIFT: Dish spice level "${dish.spiceLevel}" does not match authorized "${auth.spiceLevel}"`
        );
      }
    }

    return {
      valid: violations.length === 0,
      violations,
    };
  }
}
