import { NextResponse } from "next/server";
import { getToken, getPantry, getPricing, getDietaryRules, updateTokenStatus, incrementStats, addTelemetryLog, getTelemetryLogs, getStats } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { tokenId, securityMode } = await request.json();

    const token = await getToken(tokenId);
    if (!token) {
      return NextResponse.json({
        success: false,
        outcome: "blocked",
        logs: ["Token ID search failed.", "Redemption aborted."],
        driftsDetected: ["Token not found"],
        beforeState: {},
        afterState: {}
      });
    }

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
      dietary: [...token.dish.dietary]
    };

    const afterState = {
      cost: 0,
      inventory: {} as Record<string, string>,
      dietary: [] as string[]
    };

    token.dish.ingredients.forEach((ing: string) => {
      const origQty = token.originalState.inventory[ing] ?? 0;
      const liveQty = livePantry[ing] ?? 0;
      beforeState.inventory[ing] = `Available (${origQty} units)`;
      afterState.inventory[ing] = `Available (${liveQty} units)`;

      if (liveQty <= 0) {
        success = false;
        driftsDetected.push(`Inventory Shortage: ${ing} is out of stock (Available: ${liveQty})`);
        logs.push(`⚠️ DRIFT DETECTED: [Pantry] ${ing} quantity is 0 (Token signature required positive balance)`);
      }
    });

    let currentRecipeCost = 0;
    token.dish.ingredients.forEach((ing: string) => {
      const livePrice = livePricing[ing] ?? 0;
      currentRecipeCost += livePrice;
    });

    const basePricingSum = Object.keys(token.originalState.pricing).reduce(
      (acc, k) => acc + (token.originalState.pricing[k] ?? 0),
      0
    );
    const costMultiplier = basePricingSum > 0 ? currentRecipeCost / basePricingSum : 1;
    const scaledLiveCost = Math.round(token.dish.estimatedCost * costMultiplier);

    beforeState.cost = token.dish.estimatedCost;
    afterState.cost = scaledLiveCost;

    if (scaledLiveCost > token.constraints.budget) {
      success = false;
      driftsDetected.push(`Budget Violations: Estimated cost ₹${scaledLiveCost} exceeds budget ₹${token.constraints.budget}`);
      logs.push(`⚠️ DRIFT DETECTED: [Pricing] Real-time cost ₹${scaledLiveCost} exceeds signed constraint budget ₹${token.constraints.budget}`);
    } else if (scaledLiveCost !== token.dish.estimatedCost) {
      logs.push(`ℹ️ STATE DRIFT: [Pricing] Raw costs fluctuated. Original: ₹${token.dish.estimatedCost}, Current: ₹${scaledLiveCost}`);
    }

    token.constraints.dietary.forEach((pref: string) => {
      token.dish.ingredients.forEach((ing: string) => {
        const permitted = liveDietary[ing] ?? [];
        
        const normalizedPref = pref.toLowerCase().replace("-", " ");
        const isPermitted = permitted.some((p) => p.toLowerCase().replace("-", " ") === normalizedPref);
        
        if (!isPermitted) {
          success = false;
          driftsDetected.push(`Dietary Violation: ${ing} is not allowed for diet ${pref}`);
          logs.push(`⚠️ DRIFT DETECTED: [Dietary] ${ing} fails constraint "${pref}" in current rules`);
        }
      });
    });

    let outcome: "success" | "blocked" | "amplified" = "success";

    if (!success) {
      if (securityMode === "gb-dct") {
        outcome = "blocked";
        logs.push(`🛑 GB-DCT SECURITY BLOCK: Token invalidated due to world state drift.`);
        logs.push(`Redemption failed. Kitchen operations halted. System protected.`);
        await updateTokenStatus(tokenId, "INVALIDATED");
        await incrementStats("failed");
        await incrementStats("detectedDrifts");
        await addTelemetryLog(`GB-DCT Blocked Stale Redemption: ${tokenId} (Drift detected)`, "error");
      } else {
        outcome = "amplified";
        logs.push(`⚠️ STANDARD BYPASS: State drift ignored. Cryptographic payload is structurally sound.`);
        logs.push(`🚨 COMMITMENT AMPLIFIED: Token executed on stale state. Fired kitchen resources!`);
        await updateTokenStatus(tokenId, "REDEEMED");
        await incrementStats("passed");
        await incrementStats("amplificationEvents");
        await addTelemetryLog(`Commitment Amplified: ${tokenId} executed with outdated state parameters!`, "error");
      }
    } else {
      outcome = "success";
      logs.push(`✓ ATTESTATION PASSED: Live state matches all commitments.`);
      logs.push(`🎟️ Token lease redeemed. Kitchen slot locked and ingredients fired.`);
      await updateTokenStatus(tokenId, "REDEEMED");
      await incrementStats("passed");
      await addTelemetryLog(`Token Redeemed Successfully: ${tokenId}`, "success");
    }

    const inventory = await getPantry();
    const pricing = await getPricing();
    const dietaryRules = await getDietaryRules();
    const driftHistory = await getTelemetryLogs();
    const stats = await getStats();

    return NextResponse.json({
      success: outcome === "success",
      outcome,
      logs,
      driftsDetected,
      beforeState,
      afterState,
      state: {
        inventory,
        pricing,
        dietaryRules,
        driftHistory,
        stats
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
export const dynamic = 'force-dynamic';
