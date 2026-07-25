import { DCTService } from "../services/DCTService";
import { MenuItemData, OrderAuthorization, DCTGenerateResult, DCTValidateResult } from "../types/agent.types";

/**
 * DCTTool
 *
 * Wraps DCTService for use by PlannerAgent during the autonomous ordering pipeline.
 * Binds dish decisions and immutable OrderAuthorization to cryptographic GB-DCT tokens,
 * supporting replan lineage tracking (generation count & previous token hash).
 */
export class DCTTool {
  private dctService: DCTService;

  constructor(dctService: DCTService) {
    this.dctService = dctService;
  }

  /**
   * Generate a GB-DCT commitment token for the selected dish, binding it to world state.
   */
  async generate(
    dish: MenuItemData,
    auth: OrderAuthorization,
    replanCount: number = 0,
    previousTokenHash?: string
  ): Promise<DCTGenerateResult> {
    console.log(
      `[DCTTool] Generating GB-DCT commitment (generation: ${replanCount}) for: ${dish.name}`
    );

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
        replanGeneration: replanCount,
        previousTokenHash: previousTokenHash || null,
      },
      {
        budget: auth.maxBudget ?? dish.estimatedCost,
        dietary: auth.dietary ?? [],
        excludedIngredients: auth.excludedIngredients ?? [],
      }
    );

    console.log(`[DCTTool] Token generated: ${result.token.id}`);

    return {
      tokenId: result.token.id,
      tokenObj: result.token,
      generationLineage: {
        generation: replanCount,
        previousTokenHash,
      },
    };
  }

  /**
   * Validate/redeem a GB-DCT token against live world state.
   */
  async validate(tokenId: string): Promise<DCTValidateResult> {
    console.log(`[DCTTool] Validating commitment token: ${tokenId}`);

    const result = await this.dctService.redeemToken(tokenId, "gb-dct");
    if (!result) {
      return {
        success: false,
        outcome: "blocked",
        driftsDetected: ["Token not found in database"],
        logs: ["Token lookup failed"],
      };
    }

    console.log(`[DCTTool] Validation outcome for ${tokenId}: ${result.outcome}`);
    if (result.driftsDetected.length > 0) {
      console.log(`[DCTTool] Drifts detected: ${result.driftsDetected.join("; ")}`);
    }

    return {
      success: result.success,
      outcome: result.outcome,
      driftsDetected: result.driftsDetected,
      logs: result.logs,
    };
  }
}
