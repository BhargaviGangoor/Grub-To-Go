//entry point of your entire backend
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import chatRouter from "./routes/chat.routes";
import { errorHandler } from "./middleware/errorHandler";
import { validateConfig } from "./config";
import { DCTService } from "./services/DCTService";
import { seedMenuItems } from "./models/MenuItem";
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
  getTelemetryLogs,
  getStats,
} from "./services/db";
import { generateDish } from "./services/ai";

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
    const dctService = new DCTService(JWT_SECRET);
    const { token } = await dctService.generateToken(dish, constraints);
    const state = await getFullState();
    res.json({ token, state });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Attest and redeem GB-DCT token
app.post("/api/redeem-dct", async (req, res) => {
  const { tokenId, securityMode } = req.body;
  try {
    const dctService = new DCTService(JWT_SECRET);
    const result = await dctService.redeemToken(tokenId, securityMode);
    if (!result) {
      return res.status(404).json({
        success: false,
        outcome: "blocked",
        logs: ["Token ID search failed.", "Redemption aborted."],
        driftsDetected: ["Token not found"],
        beforeState: {},
        afterState: {}
      });
    }
    const state = await getFullState();
    res.json({ ...result, state });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Validate signature of DCT (stateless cryptographic check)
app.post("/api/validate-dct", async (req, res) => {
  const { tokenId } = req.body;
  try {
    const dctService = new DCTService(JWT_SECRET);
    const result = await dctService.validateSignature(tokenId);
    if (!result) {
      return res.status(404).json({ valid: false, error: "Token not found" });
    }
    res.json(result);
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

  // Seed menu catalog (idempotent — only runs if collection is empty)
  await seedMenuItems();

  app.listen(PORT, () => {
    console.log(`🚀 GrubToGo Backend listening on port ${PORT}`);
    console.log(`🤖 AI Chat endpoint: POST http://localhost:${PORT}/api/chat`);
  });
};

boot();
