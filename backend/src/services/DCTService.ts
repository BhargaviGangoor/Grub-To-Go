import {
  getPantry,
  getPricing,
  getDietaryRules,
  getToken,
  saveToken,
  updateTokenStatus,
  incrementStats,
  addTelemetryLog,
  getTelemetryLogs,
  getStats,
} from "./db";
import { generateHash, createGenerationRoot, createDCT } from "./security";
import { config } from "../config";

/**
 * DCTService
 *
 * Extracts the GB-DCT business logic from src/index.ts into a reusable service.
 * Used by:
 *   - Existing HTTP endpoints (/api/generate-dct, /api/redeem-dct, /api/validate-dct)
 *   - DCTTool (used by PlannerAgent in the autonomous ordering pipeline)
 *
 * Preserves all existing behavior exactly — response shapes are unchanged.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DCTDish {
  id: string;
  name: string;
  estimatedCost: number;
  ingredients: string[];
  dietary: string[];
  [key: string]: any;  // Allow additional fields from existing dish objects
}

export interface DCTConstraints {
  budget: number;
  dietary: string[];
  [key: string]: any;
}

export interface GenerateTokenResult {
  token: any;          // Full token object saved to DB
}

export interface RedeemTokenResult {
  success: boolean;
  outcome: "success" | "blocked" | "amplified";
  logs: string[];
  driftsDetected: string[];
  beforeState: {
    cost: number;
    inventory: Record<string, string>;
    dietary: string[];
  };
  afterState: {
    cost: number;
    inventory: Record<string, string>;
    dietary: string[];
  };
}

// ─── DCTService ───────────────────────────────────────────────────────────────

export class DCTService {
  private readonly secret: string;

  constructor(secret: string = config.jwtSecret) {
    this.secret = secret;
  }

  /**
   * Generate a GB-DCT token for a dish, binding it to the current world state.
   * Extracted from the POST /api/generate-dct route handler in index.ts.
   */
  async generateToken(
    dish: DCTDish,
    constraints: DCTConstraints
  ): Promise<GenerateTokenResult> {
    const pantry = await getPantry();
    const pricing = await getPricing();
    const dietaryRules = await getDietaryRules();

    const ingredients: string[] = dish.ingredients;

    // Build per-ingredient snapshots
    const invSnap = ingredients.map((ing) => ({ name: ing, qty: pantry[ing] ?? 0 }));
    const priceSnap = ingredients.map((ing) => ({ name: ing, price: pricing[ing] ?? 0 }));
    const dietarySnap = ingredients.map((ing) => ({ name: ing, rules: dietaryRules[ing] ?? [] }));

    // Generate hashes
    const inventoryHash = generateHash(JSON.stringify(invSnap));
    const pricingHash = generateHash(JSON.stringify(priceSnap));
    const dietaryHash = generateHash(JSON.stringify(dietarySnap));
    const artifactRoot = generateHash(dish.id + JSON.stringify(ingredients) + constraints.budget);
    const generationRoot = createGenerationRoot(inventoryHash, pricingHash, dietaryHash, artifactRoot);

    const randTokenId =
      "GB-DCT-2026-" + Math.random().toString(36).substring(2, 6).toUpperCase();
    const expiryTime = new Date(Date.now() + 20 * 60 * 1000).toLocaleTimeString();

    // Sign with HMAC
    const signature = createDCT(generationRoot, "redeem_dish:" + dish.id, this.secret);

    const tokenObj = {
      id: randTokenId,
      timestamp: new Date().toLocaleTimeString(),
      expiry: expiryTime,
      status: "ACTIVE",
      dish,
      constraints,
      hashes: {
        inventorySnapshotHash: inventoryHash,
        pricingSnapshotHash: pricingHash,
        dietaryHash,
        artifactRoot,
        generationRoot,
        signature,
      },
      originalState: {
        inventory: pantry,
        pricing: pricing,
        dietaryRules: dietaryRules,
      },
    };

    await saveToken(tokenObj);

    return { token: tokenObj };
  }

  /**
   * Redeem/validate a GB-DCT token against the current live world state.
   * Detects drift and either blocks (gb-dct mode) or amplifies (standard mode).
   * Extracted from the POST /api/redeem-dct route handler in index.ts.
   */
  async redeemToken(
    tokenId: string,
    securityMode: string = "gb-dct"
  ): Promise<RedeemTokenResult | null> {
    const token = await getToken(tokenId);
    if (!token) return null;

    const livePantry = await getPantry();
    const livePricing = await getPricing();
    const liveDietary = await getDietaryRules();

    const logs: string[] = [];
    const driftsDetected: string[] = [];
    let success = true;

    logs.push(`Initiating cryptographical attestation for lease: ${tokenId}`);
    logs.push(`Comparing token Generation state against live World State...`);

    const beforeState = {
      cost: token.dish.estimatedCost,
      inventory: {} as Record<string, string>,
      dietary: [...token.dish.dietary],
    };

    const afterState = {
      cost: 0,
      inventory: {} as Record<string, string>,
      dietary: [] as string[],
    };

    // 1. Inventory stock checks
    token.dish.ingredients.forEach((ing: string) => {
      const origQty = token.originalState.inventory[ing] ?? 0;
      const liveQty = livePantry[ing] ?? 0;
      beforeState.inventory[ing] = `Available (${origQty} units)`;
      afterState.inventory[ing] = `Available (${liveQty} units)`;

      if (liveQty <= 0) {
        success = false;
        driftsDetected.push(`Inventory Shortage: ${ing} is out of stock (Available: ${liveQty})`);
        logs.push(
          `⚠️ DRIFT DETECTED: [Pantry] ${ing} quantity is 0 (Token signature required positive balance)`
        );
      }
    });

    // 2. Pricing & Budget checks
    let currentRecipeCost = 0;
    token.dish.ingredients.forEach((ing: string) => {
      const livePrice = livePricing[ing] ?? 0;
      currentRecipeCost += livePrice;
    });

    const basePricingSum = Object.keys(token.originalState.pricing).reduce(
      (acc: number, k: string) => acc + (token.originalState.pricing[k] ?? 0),
      0
    );
    const costMultiplier = basePricingSum > 0 ? currentRecipeCost / basePricingSum : 1;
    const scaledLiveCost = Math.round(token.dish.estimatedCost * costMultiplier);

    beforeState.cost = token.dish.estimatedCost;
    afterState.cost = scaledLiveCost;

    if (scaledLiveCost > token.constraints.budget) {
      success = false;
      driftsDetected.push(
        `Budget Violation: Estimated cost ₹${scaledLiveCost} exceeds budget ₹${token.constraints.budget}`
      );
      logs.push(
        `⚠️ DRIFT DETECTED: [Pricing] Real-time cost ₹${scaledLiveCost} exceeds signed constraint budget ₹${token.constraints.budget}`
      );
    } else if (scaledLiveCost !== token.dish.estimatedCost) {
      logs.push(
        `ℹ️ STATE DRIFT: [Pricing] Raw costs fluctuated. Original: ₹${token.dish.estimatedCost}, Current: ₹${scaledLiveCost}`
      );
    }

    // 3. Dietary rule checks
    token.constraints.dietary.forEach((pref: string) => {
      token.dish.ingredients.forEach((ing: string) => {
        const permitted = liveDietary[ing] ?? [];
        const normalizedPref = pref.toLowerCase().replace("-", " ");
        const isPermitted = permitted.some(
          (p: string) => p.toLowerCase().replace("-", " ") === normalizedPref
        );

        if (!isPermitted) {
          success = false;
          driftsDetected.push(`Dietary Violation: ${ing} is not allowed for diet ${pref}`);
          logs.push(
            `⚠️ DRIFT DETECTED: [Dietary] ${ing} fails constraint "${pref}" in current rules`
          );
        }
      });
    });

    // 4. Determine outcome and persist
    let outcome: "success" | "blocked" | "amplified" = "success";

    if (!success) {
      if (securityMode === "gb-dct") {
        outcome = "blocked";
        logs.push(`🛑 GB-DCT SECURITY BLOCK: Token invalidated due to world state drift.`);
        logs.push(`Redemption failed. Kitchen operations halted. System protected.`);
        await updateTokenStatus(tokenId, "INVALIDATED");
        await incrementStats("failed");
        await incrementStats("detectedDrifts");
        await addTelemetryLog(
          `GB-DCT Blocked Stale Redemption: ${tokenId} (Drift detected)`,
          "error"
        );
      } else {
        outcome = "amplified";
        logs.push(`⚠️ STANDARD BYPASS: State drift ignored. Cryptographic payload is structurally sound.`);
        logs.push(`🚨 COMMITMENT AMPLIFIED: Token executed on stale state. Fired kitchen resources!`);
        await updateTokenStatus(tokenId, "REDEEMED");
        await incrementStats("passed");
        await incrementStats("amplificationEvents");
        await addTelemetryLog(
          `Commitment Amplified: ${tokenId} executed with outdated state parameters!`,
          "error"
        );
      }
    } else {
      outcome = "success";
      logs.push(`✓ ATTESTATION PASSED: Live state matches all commitments.`);
      logs.push(`🎟️ Token lease redeemed. Kitchen slot locked and ingredients fired.`);
      await updateTokenStatus(tokenId, "REDEEMED");
      await incrementStats("passed");
      await addTelemetryLog(`Token Redeemed Successfully: ${tokenId}`, "success");
    }

    return { success: outcome === "success", outcome, logs, driftsDetected, beforeState, afterState };
  }

  /**
   * Stateless cryptographic signature verification.
   * Extracted from the POST /api/validate-dct route handler in index.ts.
   */
  async validateSignature(tokenId: string): Promise<{
    valid: boolean;
    details: {
      tokenId: string;
      generationRoot: string;
      expectedSignature: string;
      computedSignature: string;
    };
  } | null> {
    const token = await getToken(tokenId);
    if (!token) return null;

    const recomputedSignature = createDCT(
      token.hashes.generationRoot,
      "redeem_dish:" + token.dish.id,
      this.secret
    );
    const valid = recomputedSignature === token.hashes.signature;

    return {
      valid,
      details: {
        tokenId,
        generationRoot: token.hashes.generationRoot,
        expectedSignature: token.hashes.signature,
        computedSignature: recomputedSignature,
      },
    };
  }
}
