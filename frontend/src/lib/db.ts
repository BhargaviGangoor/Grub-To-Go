import mongoose, { Schema } from "mongoose";

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

// Avoid duplicate model definition issues in Next.js hot-reloading
export const getModels = () => {
  const PantryItemModel = mongoose.models.PantryItem || mongoose.model("PantryItem", PantryItemSchema);
  const PricingRuleModel = mongoose.models.PricingRule || mongoose.model("PricingRule", PricingRuleSchema);
  const DietaryRuleModel = mongoose.models.DietaryRule || mongoose.model("DietaryRule", DietaryRuleSchema);
  const TokenLeaseModel = mongoose.models.TokenLease || mongoose.model("TokenLease", TokenLeaseSchema);
  const TelemetryLogModel = mongoose.models.TelemetryLog || mongoose.model("TelemetryLog", TelemetryLogSchema);
  const SystemStatModel = mongoose.models.SystemStat || mongoose.model("SystemStat", SystemStatSchema);

  return {
    PantryItemModel,
    PricingRuleModel,
    DietaryRuleModel,
    TokenLeaseModel,
    TelemetryLogModel,
    SystemStatModel
  };
};

// Global container to store fallback/connection state across API requests in server environment
const globalRef = global as any;
if (!globalRef.memoryStore) {
  globalRef.memoryStore = {
    pantry: {
      "Paneer": 15,
      "Udon Noodles": 25,
      "Chicken": 10,
      "Ramen Noodles": 20,
      "Mushrooms": 25,
      "Sage": 10,
      "Heavy Cream": 12,
      "Saffron": 8,
      "Basmati Rice": 30,
    } as Record<string, number>,
    pricing: {
      "Paneer": 90,
      "Udon Noodles": 45,
      "Chicken": 120,
      "Ramen Noodles": 35,
      "Mushrooms": 60,
      "Sage": 20,
      "Heavy Cream": 30,
      "Saffron": 150,
      "Basmati Rice": 25,
    } as Record<string, number>,
    dietaryRules: {
      "Paneer": ["Vegetarian", "Jain", "Gluten Free", "Gluten-Free"],
      "Udon Noodles": ["Vegetarian", "Vegan"],
      "Chicken": [],
      "Ramen Noodles": ["Vegetarian", "Vegan"],
      "Mushrooms": ["Vegetarian", "Vegan", "Gluten Free", "Gluten-Free"],
      "Sage": ["Vegetarian", "Vegan", "Jain", "Gluten Free", "Gluten-Free"],
      "Heavy Cream": ["Vegetarian", "Gluten Free", "Gluten-Free"],
      "Saffron": ["Vegetarian", "Vegan", "Jain", "Gluten Free", "Gluten-Free"],
      "Basmati Rice": ["Vegetarian", "Vegan", "Jain", "Gluten Free", "Gluten-Free"],
    } as Record<string, string[]>,
    tokens: [] as any[],
    logs: [
      {
        timestamp: new Date().toLocaleTimeString(),
        action: "System initialized with baseline World State.",
        type: "info"
      }
    ] as any[],
    stats: {
      passed: 32,
      failed: 14,
      amplificationEvents: 3,
      detectedDrifts: 14,
      missedDrifts: 0,
      totalGenerated: 49,
    },
    useFallback: false,
    initialized: false
  };
}

const memoryStore = globalRef.memoryStore;

// Baseline configuration seeds
export const defaultInventory = {
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

export const defaultPricing = {
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

export const defaultDietaryRules = {
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
  if (memoryStore.initialized && memoryStore.useFallback) {
    return;
  }

  if (memoryStore.initialized && !memoryStore.useFallback && mongoose.connection.readyState === 1) {
    return;
  }

  try {
    if (mongoose.connection.readyState === 0) {
      console.log(`Connecting to MongoDB: ${MONGODB_URI}...`);
      await mongoose.connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 2000
      });
      console.log("✓ Next.js backend connected to MongoDB successfully.");
    }
    memoryStore.useFallback = false;
    memoryStore.initialized = true;

    // Seed MongoDB database if empty
    const { PantryItemModel } = getModels();
    const count = await PantryItemModel.countDocuments();
    if (count === 0) {
      console.log("Seeding MongoDB with defaults...");
      await resetDatabase();
    }
  } catch (error: any) {
    console.warn("⚠️ MongoDB connection failed:", error.message);
    console.warn("Next.js backend falling back to IN-MEMORY database.");
    memoryStore.useFallback = true;
    if (!memoryStore.initialized) {
      seedInMemory();
      memoryStore.initialized = true;
    }
  }
};

// Database queries & mutations
export const getPantry = async (): Promise<Record<string, number>> => {
  await connectDB();
  if (memoryStore.useFallback) return memoryStore.pantry;
  const { PantryItemModel } = getModels();
  const items = await PantryItemModel.find();
  const pantry: Record<string, number> = {};
  items.forEach((item: any) => {
    pantry[item.name] = item.quantity;
  });
  return pantry;
};

export const getPricing = async (): Promise<Record<string, number>> => {
  await connectDB();
  if (memoryStore.useFallback) return memoryStore.pricing;
  const { PricingRuleModel } = getModels();
  const items = await PricingRuleModel.find();
  const pricing: Record<string, number> = {};
  items.forEach((item: any) => {
    pricing[item.name] = item.price;
  });
  return pricing;
};

export const getDietaryRules = async (): Promise<Record<string, string[]>> => {
  await connectDB();
  if (memoryStore.useFallback) return memoryStore.dietaryRules;
  const { DietaryRuleModel } = getModels();
  const items = await DietaryRuleModel.find();
  const rules: Record<string, string[]> = {};
  items.forEach((item: any) => {
    rules[item.name] = item.rules;
  });
  return rules;
};

export const updateInventoryItem = async (ingredient: string, amount: number) => {
  await connectDB();
  const logMsg = `Inventory modified: ${ingredient} set to ${amount} units.`;
  const type = amount === 0 ? "error" : "warning";
  
  if (memoryStore.useFallback) {
    memoryStore.pantry[ingredient] = amount;
    await addTelemetryLog(logMsg, type);
    return;
  }
  const { PantryItemModel } = getModels();
  await PantryItemModel.findOneAndUpdate(
    { name: ingredient },
    { quantity: amount },
    { upsert: true }
  );
  await addTelemetryLog(logMsg, type);
};

export const updatePricingRule = async (ingredient: string, price: number) => {
  await connectDB();
  const logMsg = `Pricing modified: ${ingredient} set to ₹${price}.`;
  
  if (memoryStore.useFallback) {
    memoryStore.pricing[ingredient] = price;
    await addTelemetryLog(logMsg, "warning");
    return;
  }
  const { PricingRuleModel } = getModels();
  await PricingRuleModel.findOneAndUpdate(
    { name: ingredient },
    { price: price },
    { upsert: true }
  );
  await addTelemetryLog(logMsg, "warning");
};

export const updateDietaryRulesItem = async (ingredient: string, rules: string[]) => {
  await connectDB();
  const logMsg = `Dietary rules modified: ${ingredient} now supports: [${rules.join(", ")}]`;
  
  if (memoryStore.useFallback) {
    memoryStore.dietaryRules[ingredient] = rules;
    await addTelemetryLog(logMsg, "warning");
    return;
  }
  const { DietaryRuleModel } = getModels();
  await DietaryRuleModel.findOneAndUpdate(
    { name: ingredient },
    { rules: rules },
    { upsert: true }
  );
  await addTelemetryLog(logMsg, "warning");
};

export const resetDatabase = async () => {
  await connectDB();
  const logMsg = "World State restored to original baselines.";
  
  if (memoryStore.useFallback) {
    seedInMemory();
    return;
  }

  const { PantryItemModel, PricingRuleModel, DietaryRuleModel, TokenLeaseModel, TelemetryLogModel, SystemStatModel } = getModels();
  await PantryItemModel.deleteMany({});
  await PricingRuleModel.deleteMany({});
  await DietaryRuleModel.deleteMany({});
  await TokenLeaseModel.deleteMany({});
  await TelemetryLogModel.deleteMany({});
  await SystemStatModel.deleteMany({});

  // Seeds
  for (const [name, quantity] of Object.entries(defaultInventory)) {
    await PantryItemModel.create({ name, quantity });
  }
  for (const [name, price] of Object.entries(defaultPricing)) {
    await PricingRuleModel.create({ name, price });
  }
  for (const [name, rules] of Object.entries(defaultDietaryRules)) {
    await DietaryRuleModel.create({ name, rules });
  }
  await SystemStatModel.create(defaultStats);
  await addTelemetryLog(logMsg, "info");
};

export const getTokens = async () => {
  await connectDB();
  if (memoryStore.useFallback) return memoryStore.tokens;
  const { TokenLeaseModel } = getModels();
  return await TokenLeaseModel.find().sort({ _id: -1 });
};

export const getToken = async (id: string) => {
  await connectDB();
  if (memoryStore.useFallback) {
    return memoryStore.tokens.find((t: any) => t.id === id) || null;
  }
  const { TokenLeaseModel } = getModels();
  return await TokenLeaseModel.findOne({ id });
};

export const saveToken = async (token: any) => {
  await connectDB();
  if (memoryStore.useFallback) {
    memoryStore.tokens.unshift(token);
    memoryStore.stats.totalGenerated += 1;
    await addTelemetryLog(`New GB-DCT Generated: ${token.id} for dish: "${token.dish.name}"`, "success");
    return;
  }
  const { TokenLeaseModel, SystemStatModel } = getModels();
  await TokenLeaseModel.create(token);
  await SystemStatModel.findOneAndUpdate({}, { $inc: { totalGenerated: 1 } });
  await addTelemetryLog(`New GB-DCT Generated: ${token.id} for dish: "${token.dish.name}"`, "success");
};

export const updateTokenStatus = async (id: string, status: "ACTIVE" | "REDEEMED" | "INVALIDATED") => {
  await connectDB();
  if (memoryStore.useFallback) {
    const token = memoryStore.tokens.find((t: any) => t.id === id);
    if (token) token.status = status;
    return;
  }
  const { TokenLeaseModel } = getModels();
  await TokenLeaseModel.findOneAndUpdate({ id }, { status });
};

export const getTelemetryLogs = async () => {
  await connectDB();
  if (memoryStore.useFallback) return memoryStore.logs;
  const { TelemetryLogModel } = getModels();
  return await TelemetryLogModel.find().sort({ _id: -1 }).limit(100);
};

export const addTelemetryLog = async (action: string, type: "info" | "warning" | "error" | "success") => {
  const timestamp = new Date().toLocaleTimeString();
  const log = { timestamp, action, type };
  
  if (memoryStore.useFallback) {
    memoryStore.logs.unshift(log);
    return;
  }
  const { TelemetryLogModel } = getModels();
  await TelemetryLogModel.create(log);
};

export const getStats = async () => {
  await connectDB();
  if (memoryStore.useFallback) return memoryStore.stats;
  const { SystemStatModel } = getModels();
  const stat = await SystemStatModel.findOne();
  return stat || defaultStats;
};

export const incrementStats = async (field: "passed" | "failed" | "amplificationEvents" | "detectedDrifts" | "missedDrifts") => {
  await connectDB();
  if (memoryStore.useFallback) {
    memoryStore.stats[field] += 1;
    return;
  }
  const { SystemStatModel } = getModels();
  await SystemStatModel.findOneAndUpdate({}, { $inc: { [field]: 1 } });
};
