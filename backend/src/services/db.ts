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
  "Paneer": 15,
  "Udon Noodles": 25,
  "Chicken": 10,
  "Ramen Noodles": 20,
  "Mushrooms": 25,
  "Sage": 10,
  "Heavy Cream": 12,
  "Saffron": 8,
  "Basmati Rice": 30,
};

export const defaultPricing: Record<string, number> = {
  "Paneer": 90,
  "Udon Noodles": 45,
  "Chicken": 120,
  "Ramen Noodles": 35,
  "Mushrooms": 60,
  "Sage": 20,
  "Heavy Cream": 30,
  "Saffron": 150,
  "Basmati Rice": 25,
};

export const defaultDietaryRules: Record<string, string[]> = {
  "Paneer": ["Vegetarian", "Jain", "Gluten Free", "Gluten-Free"],
  "Udon Noodles": ["Vegetarian", "Vegan"],
  "Chicken": [],
  "Ramen Noodles": ["Vegetarian", "Vegan"],
  "Mushrooms": ["Vegetarian", "Vegan", "Gluten Free", "Gluten-Free"],
  "Sage": ["Vegetarian", "Vegan", "Jain", "Gluten Free", "Gluten-Free"],
  "Heavy Cream": ["Vegetarian", "Gluten Free", "Gluten-Free"],
  "Saffron": ["Vegetarian", "Vegan", "Jain", "Gluten Free", "Gluten-Free"],
  "Basmati Rice": ["Vegetarian", "Vegan", "Jain", "Gluten Free", "Gluten-Free"],
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
      console.log("Seeding initial database baseline to MongoDB...");
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

  // Seed inventory
  for (const [name, quantity] of Object.entries(defaultInventory)) {
    await PantryItemModel.create({ name, quantity });
  }
  // Seed pricing
  for (const [name, price] of Object.entries(defaultPricing)) {
    await PricingRuleModel.create({ name, price });
  }
  // Seed dietary rules
  for (const [name, rules] of Object.entries(defaultDietaryRules)) {
    await DietaryRuleModel.create({ name, rules });
  }
  // Seed stats
  await SystemStatModel.create(defaultStats);
  // Log event
  await addTelemetryLog(logMsg, "info");
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
