//entry point of your entire backend
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import chatRouter from "./routes/chat.routes";
import { errorHandler } from "./middleware/errorHandler";
import { validateConfig } from "./config";
import {
  connectDB,
  getPantry,
  getPricing,
  getDietaryRules,
  updateInventoryItem,
  updatePricingRule,
  updateDietaryRulesItem,
  resetDatabase,
  getTokens,
  getToken,
  saveToken,
  updateTokenStatus,
  getTelemetryLogs,
  addTelemetryLog,
  getStats,
  incrementStats
} from "./services/db";
import { generateDish } from "./services/ai";
import {
  generateHash,
  createGenerationRoot,
  createDCT
} from "./services/security";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || "grubtogo-super-secret-key-12345";

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Helper to bundle system state
const getFullState = async () => {
  const inventory = await getPantry();
  const pricing = await getPricing();
  const dietaryRules = await getDietaryRules();
  const driftHistory = await getTelemetryLogs();
  const stats = await getStats();
  
  return {
    inventory,
    pricing,
    dietaryRules,
    driftHistory,
    stats
  };
};

// Endpoints

// Get full system state (pantry, prices, rules, logs, stats)
app.get("/api/state", async (req, res) => {
  try {
    const state = await getFullState();
    const tokens = await getTokens();
    res.json({ state, tokens });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Reset system state to default baselines
app.post("/api/state/reset", async (req, res) => {
  try {
    await resetDatabase();
    const state = await getFullState();
    res.json({ success: true, state });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update an inventory/pricing item directly from client
app.post("/api/state/update", async (req, res) => {
  const { ingredient, quantity, price, rules } = req.body;
  try {
    if (quantity !== undefined) {
      await updateInventoryItem(ingredient, quantity);
    }
    if (price !== undefined) {
      await updatePricingRule(ingredient, price);
    }
    if (rules !== undefined) {
      await updateDietaryRulesItem(ingredient, rules);
    }
    const state = await getFullState();
    res.json({ success: true, state });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Trigger a specific drift simulation scenario
app.post("/api/state/drift", async (req, res) => {
  const { driftType } = req.body;
  try {
    console.log(`Injecting drift scenario: ${driftType}`);
    switch (driftType) {
      case "stockout":
      case "remove_paneer":
        await updateInventoryItem("Paneer", 0);
        break;
      case "inflation":
      case "increase_paneer_cost":
        await updatePricingRule("Paneer", 280);
        break;
      case "allergen":
      case "change_dietary_rule":
        // Paneer is no longer vegetarian
        await updateDietaryRulesItem("Paneer", ["Jain", "Gluten Free", "Gluten-Free"]);
        break;
      case "expire_inventory":
        await updateInventoryItem("Udon Noodles", 0);
        await updateInventoryItem("Ramen Noodles", 0);
        break;
      case "inject_stale_inventory":
        await updateInventoryItem("Mushrooms", 1);
        break;
      case "inject_wrong_price":
        await updatePricingRule("Saffron", 450);
        break;
      default:
        break;
    }
    const state = await getFullState();
    res.json({ success: true, state });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Generate Dish Recipe using Gemini AI model
app.post("/api/generate-dish", async (req, res) => {
  const { budget, dietary, cuisine, spiceLevel, images } = req.body;
  try {
    const pantry = await getPantry();
    const availableIngredients = Object.keys(pantry).filter((k) => pantry[k] > 0);

    const result = await generateDish(
      cuisine || "Any",
      dietary || [],
      spiceLevel || "Medium",
      budget || 300,
      availableIngredients,
      images || []
    );

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Generate GB-DCT token for a generated dish
app.post("/api/generate-dct", async (req, res) => {
  const { dish, constraints } = req.body;
  try {
    const pantry = await getPantry();
    const pricing = await getPricing();
    const dietaryRules = await getDietaryRules();

    const ingredients: string[] = dish.ingredients;

    // Build snaps
    const invSnap = ingredients.map((ing) => ({ name: ing, qty: pantry[ing] ?? 0 }));
    const priceSnap = ingredients.map((ing) => ({ name: ing, price: pricing[ing] ?? 0 }));
    const dietarySnap = ingredients.map((ing) => ({ name: ing, rules: dietaryRules[ing] ?? [] }));

    // Generate Hashes
    const inventoryHash = generateHash(JSON.stringify(invSnap));
    const pricingHash = generateHash(JSON.stringify(priceSnap));
    const dietaryHash = generateHash(JSON.stringify(dietarySnap));
    const artifactRoot = generateHash(dish.id + JSON.stringify(ingredients) + constraints.budget);
    const generationRoot = createGenerationRoot(inventoryHash, pricingHash, dietaryHash, artifactRoot);

    const randTokenId = "GB-DCT-2026-" + Math.random().toString(36).substring(2, 6).toUpperCase();
    const expiryTime = new Date(Date.now() + 20 * 60 * 1000).toLocaleTimeString();

    // Sign the token with HMAC
    const signature = createDCT(generationRoot, "redeem_dish:" + dish.id, JWT_SECRET);

    const tokenObj = {
      id: randTokenId,
      timestamp: new Date().toLocaleTimeString(),
      expiry: expiryTime,
      status: "ACTIVE",
      dish: dish,
      constraints: constraints,
      hashes: {
        inventorySnapshotHash: inventoryHash,
        pricingSnapshotHash: pricingHash,
        dietaryHash,
        artifactRoot,
        generationRoot,
        signature
      },
      originalState: {
        inventory: pantry,
        pricing: pricing,
        dietaryRules: dietaryRules
      }
    };

    await saveToken(tokenObj);
    const state = await getFullState();
    
    res.json({ token: tokenObj, state });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Attest and redeem GB-DCT token
app.post("/api/redeem-dct", async (req, res) => {
  const { tokenId, securityMode } = req.body;
  try {
    const token = await getToken(tokenId);
    if (!token) {
      return res.status(404).json({
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

    // 1. Inventory stock checks
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

    // 2. Pricing & Budget checks
    let currentRecipeCost = 0;
    token.dish.ingredients.forEach((ing: string) => {
      const livePrice = livePricing[ing] ?? 0;
      currentRecipeCost += livePrice;
    });

    // Cost multiplier scaling similar to frontend formula
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

    // 3. Dietary rule checks
    token.constraints.dietary.forEach((pref: string) => {
      token.dish.ingredients.forEach((ing: string) => {
        const permitted = liveDietary[ing] ?? [];
        
        // Normalize checking to handle hyphen variations (e.g. "Gluten Free" vs "Gluten-Free")
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

    const state = await getFullState();

    res.json({
      success: outcome === "success",
      outcome,
      logs,
      driftsDetected,
      beforeState,
      afterState,
      state
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Validate signature of DCT (stateless cryptographic check)
app.post("/api/validate-dct", async (req, res) => {
  const { tokenId } = req.body;
  try {
    const token = await getToken(tokenId);
    if (!token) {
      return res.status(404).json({ valid: false, error: "Token not found" });
    }

    // Recompute signature to verify integrity
    const recomputedSignature = createDCT(token.hashes.generationRoot, "redeem_dish:" + token.dish.id, JWT_SECRET);
    const valid = recomputedSignature === token.hashes.signature;

    res.json({
      valid,
      details: {
        tokenId,
        generationRoot: token.hashes.generationRoot,
        expectedSignature: token.hashes.signature,
        computedSignature: recomputedSignature
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ─── AI Assistant Chat Endpoint ──────────────────────────────────────────────
// Mount the new clean-architecture chat router alongside the existing endpoints.
// This adds POST /api/chat without touching any existing routes.
// Architecture: chat.routes.ts → ChatController → ChatService → GroqProvider
app.use(chatRouter);

// ─── Global Error Handler ────────────────────────────────────────────────────
// MUST be mounted AFTER all routes. Express identifies error middleware
// by the 4-parameter signature (err, req, res, next).
app.use(errorHandler);

// Boot Database & Server
const boot = async () => {
  // Validate config at startup — warns if GROQ_API_KEY is missing
  validateConfig();

  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 GrubToGo Backend listening on port ${PORT}`);
    console.log(`🤖 AI Chat endpoint: POST http://localhost:${PORT}/api/chat`);
  });
};

boot();
