import mongoose, { Schema, Document } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/grubtogo";

// Schemas
const PantryItemSchema = new Schema({
  name: { type: String, required: true, unique: true },
  quantity: { type: Number, required: true, default: 0 }
});

const PricingRuleSchema = new Schema({
  name: { type: String, required: true, unique: true },
  price: { type: Number, required: true, default: 0 }
});

const DietaryRuleSchema = new Schema({
  name: { type: String, required: true, unique: true },
  rules: [{ type: String }]
});

const TokenLeaseSchema = new Schema({
  id: { type: String, required: true, unique: true },
  timestamp: { type: String, required: true },
  expiry: { type: String, required: true },
  status: { type: String, enum: ["ACTIVE", "REDEEMED", "INVALIDATED"], required: true, default: "ACTIVE" },
  dish: { type: Object, required: true },
  constraints: { type: Object, required: true },
  hashes: { type: Object, required: true },
  originalState: { type: Object, required: true }
});

const TelemetryLogSchema = new Schema({
  timestamp: { type: String, required: true },
  action: { type: String, required: true },
  type: { type: String, enum: ["info", "warning", "error", "success"], required: true }
});

const SystemStatSchema = new Schema({
  passed: { type: Number, default: 0 },
  failed: { type: Number, default: 0 },
  amplificationEvents: { type: Number, default: 0 },
  detectedDrifts: { type: Number, default: 0 },
  missedDrifts: { type: Number, default: 0 },
  totalGenerated: { type: Number, default: 0 }
});

// Models
let PantryItemModel: any;
let PricingRuleModel: any;
let DietaryRuleModel: any;
let TokenLeaseModel: any;
let TelemetryLogModel: any;
let SystemStatModel: any;

let useFallback = false;

// In-Memory Database Fallback Store
const memoryStore = {
  pantry: {} as Record<string, number>,
  pricing: {} as Record<string, number>,
  dietaryRules: {} as Record<string, string[]>,
  tokens: [] as any[],
  logs: [] as any[],
  stats: {
    passed: 32,
    failed: 14,
    amplificationEvents: 3,
    detectedDrifts: 14,
    missedDrifts: 0,
    totalGenerated: 49,
  }
};

// Seed Defaults
export const defaultInventory: Record<string, number> = {
  "Flour": 50,
  "Butter": 40,
  "Yeast": 30,
  "Chocolate": 25,
  "Custard": 20,
  "Raisins": 30,
  "Eggs": 60,
  "Sugar": 45,
  "Apples": 35,
  "Baguette": 40,
  "Strawberry Jam": 25,
  "Cheese Spread": 30,
  "Herbs": 25,
  "Brie": 15,
  "Camembert": 15,
  "Cold Cuts": 20,
  "Cornichons": 25,
  "Tuna": 20,
  "Olives": 30,
  "Green Beans": 25,
  "Goat Cheese": 20,
  "Greens": 35,
  "Sourdough": 30,
  "Honey": 25,
  "Cream": 30,
  "Bacon": 20,
  "Gruyère Cheese": 25,
  "Bread": 40,
  "Ham": 25,
  "Bechamel": 20,
  "Egg": 50,
  "Onions": 40,
  "Broth": 30,
  "Seasonal Vegetables": 35,
  "Zucchini": 30,
  "Eggplant": 25,
  "Tomatoes": 40,
  "Bell Peppers": 30,
  "Pastry Crust": 25,
  "Heavy Cream": 30,
  "Egg Yolks": 40,
  "Vanilla": 20,
  "Dark Chocolate": 25,
  "Lemon Zest": 30,
  "Choux Pastry": 20,
  "Coffee": 35,
  "Espresso": 50,
  "Steamed Milk": 40,
  "Espresso Beans": 50,
  "Water": 100,
  "Milk": 50,
  "Tea Leaves": 40,
  "Hot Water": 100,
  "Fresh Oranges": 45,
  "French Wine Grapes": 30,
};

export const defaultPricing: Record<string, number> = {
  "Flour": 15,
  "Butter": 40,
  "Yeast": 10,
  "Chocolate": 50,
  "Custard": 30,
  "Raisins": 25,
  "Eggs": 20,
  "Sugar": 15,
  "Apples": 35,
  "Baguette": 30,
  "Strawberry Jam": 25,
  "Cheese Spread": 40,
  "Herbs": 15,
  "Brie": 90,
  "Camembert": 85,
  "Cold Cuts": 100,
  "Cornichons": 30,
  "Tuna": 80,
  "Olives": 35,
  "Green Beans": 25,
  "Goat Cheese": 85,
  "Greens": 30,
  "Sourdough": 35,
  "Honey": 30,
  "Cream": 35,
  "Bacon": 75,
  "Gruyère Cheese": 90,
  "Bread": 25,
  "Ham": 70,
  "Bechamel": 30,
  "Egg": 15,
  "Onions": 20,
  "Broth": 25,
  "Seasonal Vegetables": 35,
  "Zucchini": 25,
  "Eggplant": 30,
  "Tomatoes": 20,
  "Bell Peppers": 25,
  "Pastry Crust": 35,
  "Heavy Cream": 40,
  "Egg Yolks": 20,
  "Vanilla": 45,
  "Dark Chocolate": 60,
  "Lemon Zest": 15,
  "Choux Pastry": 35,
  "Coffee": 30,
  "Espresso": 35,
  "Steamed Milk": 25,
  "Espresso Beans": 40,
  "Water": 5,
  "Milk": 20,
  "Tea Leaves": 25,
  "Hot Water": 5,
  "Fresh Oranges": 35,
  "French Wine Grapes": 120,
};

export const defaultDietaryRules: Record<string, string[]> = {
  "Flour": ["Vegetarian", "Vegan"],
  "Butter": ["Vegetarian"],
  "Yeast": ["Vegetarian", "Vegan"],
  "Chocolate": ["Vegetarian"],
  "Custard": ["Vegetarian"],
  "Raisins": ["Vegetarian", "Vegan"],
  "Eggs": ["Non-Vegetarian"],
  "Sugar": ["Vegetarian", "Vegan"],
  "Apples": ["Vegetarian", "Vegan"],
  "Baguette": ["Vegetarian", "Vegan"],
  "Strawberry Jam": ["Vegetarian", "Vegan"],
  "Cheese Spread": ["Vegetarian"],
  "Herbs": ["Vegetarian", "Vegan"],
  "Brie": ["Vegetarian", "Gluten Free", "Gluten-Free"],
  "Camembert": ["Vegetarian", "Gluten Free", "Gluten-Free"],
  "Cold Cuts": ["Non-Vegetarian"],
  "Cornichons": ["Vegetarian", "Vegan", "Gluten Free", "Gluten-Free"],
  "Tuna": ["Non-Vegetarian", "Gluten Free", "Gluten-Free"],
  "Olives": ["Vegetarian", "Vegan", "Gluten Free", "Gluten-Free"],
  "Green Beans": ["Vegetarian", "Vegan", "Gluten Free", "Gluten-Free"],
  "Goat Cheese": ["Vegetarian", "Gluten Free", "Gluten-Free"],
  "Greens": ["Vegetarian", "Vegan", "Gluten Free", "Gluten-Free"],
  "Sourdough": ["Vegetarian", "Vegan"],
  "Honey": ["Vegetarian", "Gluten Free", "Gluten-Free"],
  "Cream": ["Vegetarian", "Gluten Free", "Gluten-Free"],
  "Bacon": ["Non-Vegetarian"],
  "Gruyère Cheese": ["Vegetarian", "Gluten Free", "Gluten-Free"],
  "Bread": ["Vegetarian", "Vegan"],
  "Ham": ["Non-Vegetarian"],
  "Bechamel": ["Vegetarian"],
  "Egg": ["Non-Vegetarian"],
  "Onions": ["Vegetarian", "Vegan", "Gluten Free", "Gluten-Free"],
  "Broth": ["Vegetarian", "Vegan", "Gluten Free", "Gluten-Free"],
  "Seasonal Vegetables": ["Vegetarian", "Vegan", "Gluten Free", "Gluten-Free"],
  "Zucchini": ["Vegetarian", "Vegan", "Gluten Free", "Gluten-Free"],
  "Eggplant": ["Vegetarian", "Vegan", "Gluten Free", "Gluten-Free"],
  "Tomatoes": ["Vegetarian", "Vegan", "Gluten Free", "Gluten-Free"],
  "Bell Peppers": ["Vegetarian", "Vegan", "Gluten Free", "Gluten-Free"],
  "Pastry Crust": ["Vegetarian"],
  "Heavy Cream": ["Vegetarian", "Gluten Free", "Gluten-Free"],
  "Egg Yolks": ["Non-Vegetarian", "Gluten Free", "Gluten-Free"],
  "Vanilla": ["Vegetarian", "Vegan", "Gluten Free", "Gluten-Free"],
  "Dark Chocolate": ["Vegetarian", "Vegan", "Gluten Free", "Gluten-Free"],
  "Lemon Zest": ["Vegetarian", "Vegan", "Gluten Free", "Gluten-Free"],
  "Choux Pastry": ["Vegetarian"],
  "Coffee": ["Vegetarian", "Vegan", "Gluten Free", "Gluten-Free"],
  "Espresso": ["Vegetarian", "Vegan", "Gluten Free", "Gluten-Free"],
  "Steamed Milk": ["Vegetarian", "Gluten Free", "Gluten-Free"],
  "Espresso Beans": ["Vegetarian", "Vegan", "Gluten Free", "Gluten-Free"],
  "Water": ["Vegetarian", "Vegan", "Gluten Free", "Gluten-Free"],
  "Milk": ["Vegetarian", "Gluten Free", "Gluten-Free"],
  "Tea Leaves": ["Vegetarian", "Vegan", "Gluten Free", "Gluten-Free"],
  "Hot Water": ["Vegetarian", "Vegan", "Gluten Free", "Gluten-Free"],
  "Fresh Oranges": ["Vegetarian", "Vegan", "Gluten Free", "Gluten-Free"],
  "French Wine Grapes": ["Vegetarian", "Vegan", "Gluten Free", "Gluten-Free"],
};

export const defaultStats = {
  passed: 32,
  failed: 14,
  amplificationEvents: 3,
  detectedDrifts: 14,
  missedDrifts: 0,
  totalGenerated: 49,
};

const seedInMemory = () => {
  memoryStore.pantry = { ...defaultInventory };
  memoryStore.pricing = { ...defaultPricing };
  memoryStore.dietaryRules = { ...defaultDietaryRules };
  memoryStore.stats = { ...defaultStats };
  memoryStore.logs = [
    {
      timestamp: new Date().toLocaleTimeString(),
      action: "System initialized with baseline World State (In-Memory).",
      type: "info"
    }
  ];
};

export const connectDB = async () => {
  try {
    console.log(`Connecting to MongoDB at: ${MONGODB_URI}...`);
    // Connect with a 4s timeout to quickly fallback to in-memory mode if Mongo is not running
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 4000
    });
    console.log("✓ Successfully connected to MongoDB.");
    
    PantryItemModel = mongoose.model("PantryItem", PantryItemSchema);
    PricingRuleModel = mongoose.model("PricingRule", PricingRuleSchema);
    DietaryRuleModel = mongoose.model("DietaryRule", DietaryRuleSchema);
    TokenLeaseModel = mongoose.model("TokenLease", TokenLeaseSchema);
    TelemetryLogModel = mongoose.model("TelemetryLog", TelemetryLogSchema);
    SystemStatModel = mongoose.model("SystemStat", SystemStatSchema);

    // Seed database if empty
    const count = await PantryItemModel.countDocuments();
    if (count === 0) {
      console.log("Seeding French Bistro database baseline to MongoDB...");
      await resetDatabase();
    }
  } catch (error: any) {
    console.warn("⚠️ MongoDB connection failed. Falling back to IN-MEMORY DATABASE mode.");
    useFallback = true;
    seedInMemory();
  }
};

// Database APIs
export const getPantry = async (): Promise<Record<string, number>> => {
  if (useFallback) return memoryStore.pantry;
  const items = await PantryItemModel.find();
  const pantry: Record<string, number> = {};
  items.forEach((item: any) => {
    pantry[item.name] = item.quantity;
  });
  return pantry;
};

export const getPricing = async (): Promise<Record<string, number>> => {
  if (useFallback) return memoryStore.pricing;
  const items = await PricingRuleModel.find();
  const pricing: Record<string, number> = {};
  items.forEach((item: any) => {
    pricing[item.name] = item.price;
  });
  return pricing;
};

export const getDietaryRules = async (): Promise<Record<string, string[]>> => {
  if (useFallback) return memoryStore.dietaryRules;
  const items = await DietaryRuleModel.find();
  const rules: Record<string, string[]> = {};
  items.forEach((item: any) => {
    rules[item.name] = item.rules;
  });
  return rules;
};

export const updateInventoryItem = async (ingredient: string, amount: number) => {
  const logMsg = `Inventory modified: ${ingredient} set to ${amount} units.`;
  const type = amount === 0 ? "error" : "warning";
  
  if (useFallback) {
    memoryStore.pantry[ingredient] = amount;
    addTelemetryLog(logMsg, type);
    return;
  }
  await PantryItemModel.findOneAndUpdate(
    { name: ingredient },
    { quantity: amount },
    { upsert: true }
  );
  await addTelemetryLog(logMsg, type);
};

export const updatePricingRule = async (ingredient: string, price: number) => {
  const logMsg = `Pricing modified: ${ingredient} set to ₹${price}.`;
  
  if (useFallback) {
    memoryStore.pricing[ingredient] = price;
    addTelemetryLog(logMsg, "warning");
    return;
  }
  await PricingRuleModel.findOneAndUpdate(
    { name: ingredient },
    { price: price },
    { upsert: true }
  );
  await addTelemetryLog(logMsg, "warning");
};

export const updateDietaryRulesItem = async (ingredient: string, rules: string[]) => {
  const logMsg = `Dietary rules modified: ${ingredient} now supports: [${rules.join(", ")}]`;
  
  if (useFallback) {
    memoryStore.dietaryRules[ingredient] = rules;
    addTelemetryLog(logMsg, "warning");
    return;
  }
  await DietaryRuleModel.findOneAndUpdate(
    { name: ingredient },
    { rules: rules },
    { upsert: true }
  );
  await addTelemetryLog(logMsg, "warning");
};

export const resetDatabase = async () => {
  const logMsg = "World State restored to original baselines.";
  
  if (useFallback) {
    seedInMemory();
    return;
  }

  await PantryItemModel.deleteMany({});
  await PricingRuleModel.deleteMany({});
  await DietaryRuleModel.deleteMany({});
  await TokenLeaseModel.deleteMany({});
  await TelemetryLogModel.deleteMany({});
  await SystemStatModel.deleteMany({});

  // Bulk seed inventory, pricing, dietary rules in parallel
  const pantryDocs = Object.entries(defaultInventory).map(([name, quantity]) => ({ name, quantity }));
  const pricingDocs = Object.entries(defaultPricing).map(([name, price]) => ({ name, price }));
  const dietaryDocs = Object.entries(defaultDietaryRules).map(([name, rules]) => ({ name, rules }));

  await Promise.all([
    PantryItemModel.insertMany(pantryDocs),
    PricingRuleModel.insertMany(pricingDocs),
    DietaryRuleModel.insertMany(dietaryDocs),
    SystemStatModel.create(defaultStats),
  ]);

  await addTelemetryLog(logMsg, "info");
  console.log("✓ French Bistro database baseline seeded successfully.");
};

export const getTokens = async () => {
  if (useFallback) return memoryStore.tokens;
  return await TokenLeaseModel.find().sort({ _id: -1 });
};

export const getToken = async (id: string) => {
  if (useFallback) {
    return memoryStore.tokens.find((t) => t.id === id) || null;
  }
  return await TokenLeaseModel.findOne({ id });
};

export const saveToken = async (token: any) => {
  if (useFallback) {
    memoryStore.tokens.unshift(token);
    memoryStore.stats.totalGenerated += 1;
    addTelemetryLog(`New GB-DCT Generated: ${token.id} for dish: "${token.dish.name}"`, "success");
    return;
  }
  await TokenLeaseModel.create(token);
  await SystemStatModel.findOneAndUpdate({}, { $inc: { totalGenerated: 1 } });
  await addTelemetryLog(`New GB-DCT Generated: ${token.id} for dish: "${token.dish.name}"`, "success");
};

export const updateTokenStatus = async (id: string, status: "ACTIVE" | "REDEEMED" | "INVALIDATED") => {
  if (useFallback) {
    const token = memoryStore.tokens.find((t) => t.id === id);
    if (token) token.status = status;
    return;
  }
  await TokenLeaseModel.findOneAndUpdate({ id }, { status });
};

export const getTelemetryLogs = async () => {
  if (useFallback) return memoryStore.logs;
  return await TelemetryLogModel.find().sort({ _id: -1 }).limit(100);
};

export const addTelemetryLog = async (action: string, type: "info" | "warning" | "error" | "success") => {
  const timestamp = new Date().toLocaleTimeString();
  const log = { timestamp, action, type };
  
  if (useFallback) {
    memoryStore.logs.unshift(log);
    return;
  }
  await TelemetryLogModel.create(log);
};

export const getStats = async () => {
  if (useFallback) return memoryStore.stats;
  const stat = await SystemStatModel.findOne();
  return stat || defaultStats;
};

export const incrementStats = async (field: "passed" | "failed" | "amplificationEvents" | "detectedDrifts" | "missedDrifts") => {
  if (useFallback) {
    memoryStore.stats[field] += 1;
    return;
  }
  await SystemStatModel.findOneAndUpdate({}, { $inc: { [field]: 1 } });
};
