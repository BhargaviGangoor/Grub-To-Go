import { DCTService } from "../services/DCTService";
import { MenuItemData, OrderConstraints, DCTGenerateResult, DCTValidateResult } from "../types/agent.types";

/**
 * DCTTool
 *
 * Thin wrapper over DCTService for use by PlannerAgent.
 * Converts MenuItemData + OrderConstraints into the DCTService input shape.
 */
export class DCTTool {
  private dctService: DCTService;

  constructor(dctService: DCTService) {
    this.dctService = dctService;
  }

  /**
   * Generate a GB-DCT token for the selected dish, binding it to current world state.
   */
  async generate(
    dish: MenuItemData,
    constraints: OrderConstraints
  ): Promise<DCTGenerateResult> {
    console.log(`[DCTTool] Generating GB-DCT token for: ${dish.name}`);

    const result = await this.dctService.generateToken(
      {
        id: dish.id,
        name: dish.name,
        estimatedCost: dish.estimatedCost,
        ingredients: dish.ingredients,
        dietary: dish.dietary,
        spiceLevel: dish.spiceLevel,
        cuisine: dish.cuisine,
        description: dish.description,
        imageUrl: dish.imageUrl,
      },
      {
        budget: constraints.maxBudget ?? dish.estimatedCost,
        dietary: constraints.dietary ?? [],
      }
    );

    console.log(`[DCTTool] Token generated: ${result.token.id}`);
    return { tokenId: result.token.id, tokenObj: result.token };
  }

  /**
   * Validate/redeem a GB-DCT token against current live world state.
   * Uses gb-dct mode (block on drift) — appropriate for autonomous ordering.
   */
  async validate(tokenId: string): Promise<DCTValidateResult> {
    console.log(`[DCTTool] Validating token: ${tokenId}`);

    const result = await this.dctService.redeemToken(tokenId, "gb-dct");
    if (!result) {
      return {
        success: false,
        outcome: "blocked",
        driftsDetected: ["Token not found"],
        logs: ["Token lookup failed"],
      };
    }

    console.log(`[DCTTool] Validation outcome: ${result.outcome}`);
    if (result.driftsDetected.length > 0) {
      console.log(`[DCTTool] Drifts: ${result.driftsDetected.join("; ")}`);
    }

    return {
      success: result.success,
      outcome: result.outcome,
      driftsDetected: result.driftsDetected,
      logs: result.logs,
    };
  }
}
