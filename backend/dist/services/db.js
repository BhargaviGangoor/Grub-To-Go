"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.incrementStats = exports.getStats = exports.addTelemetryLog = exports.getTelemetryLogs = exports.updateTokenStatus = exports.saveToken = exports.getToken = exports.getTokens = exports.resetDatabase = exports.updateDietaryRulesItem = exports.updatePricingRule = exports.updateInventoryItem = exports.getDietaryRules = exports.getPricing = exports.getPantry = exports.connectDB = exports.defaultStats = exports.defaultDietaryRules = exports.defaultPricing = exports.defaultInventory = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/grubtogo";
// Schemas
const PantryItemSchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true },
    quantity: { type: Number, required: true, default: 0 }
});
const PricingRuleSchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true },
    price: { type: Number, required: true, default: 0 }
});
const DietaryRuleSchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true },
    rules: [{ type: String }]
});
const TokenLeaseSchema = new mongoose_1.Schema({
    id: { type: String, required: true, unique: true },
    timestamp: { type: String, required: true },
    expiry: { type: String, required: true },
    status: { type: String, enum: ["ACTIVE", "REDEEMED", "INVALIDATED"], required: true, default: "ACTIVE" },
    dish: { type: Object, required: true },
    constraints: { type: Object, required: true },
    hashes: { type: Object, required: true },
    originalState: { type: Object, required: true }
});
const TelemetryLogSchema = new mongoose_1.Schema({
    timestamp: { type: String, required: true },
    action: { type: String, required: true },
    type: { type: String, enum: ["info", "warning", "error", "success"], required: true }
});
const SystemStatSchema = new mongoose_1.Schema({
    passed: { type: Number, default: 0 },
    failed: { type: Number, default: 0 },
    amplificationEvents: { type: Number, default: 0 },
    detectedDrifts: { type: Number, default: 0 },
    missedDrifts: { type: Number, default: 0 },
    totalGenerated: { type: Number, default: 0 }
});
// Models
let PantryItemModel;
let PricingRuleModel;
let DietaryRuleModel;
let TokenLeaseModel;
let TelemetryLogModel;
let SystemStatModel;
let useFallback = false;
// In-Memory Database Fallback Store
const memoryStore = {
    pantry: {},
    pricing: {},
    dietaryRules: {},
    tokens: [],
    logs: [],
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
exports.defaultInventory = {
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
exports.defaultPricing = {
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
exports.defaultDietaryRules = {
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
exports.defaultStats = {
    passed: 32,
    failed: 14,
    amplificationEvents: 3,
    detectedDrifts: 14,
    missedDrifts: 0,
    totalGenerated: 49,
};
const seedInMemory = () => {
    memoryStore.pantry = { ...exports.defaultInventory };
    memoryStore.pricing = { ...exports.defaultPricing };
    memoryStore.dietaryRules = { ...exports.defaultDietaryRules };
    memoryStore.stats = { ...exports.defaultStats };
    memoryStore.logs = [
        {
            timestamp: new Date().toLocaleTimeString(),
            action: "System initialized with baseline World State (In-Memory).",
            type: "info"
        }
    ];
};
const connectDB = async () => {
    try {
        console.log(`Connecting to MongoDB at: ${MONGODB_URI}...`);
        // Connect with a 4s timeout to quickly fallback to in-memory mode if Mongo is not running
        await mongoose_1.default.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 4000
        });
        console.log("✓ Successfully connected to MongoDB.");
        PantryItemModel = mongoose_1.default.model("PantryItem", PantryItemSchema);
        PricingRuleModel = mongoose_1.default.model("PricingRule", PricingRuleSchema);
        DietaryRuleModel = mongoose_1.default.model("DietaryRule", DietaryRuleSchema);
        TokenLeaseModel = mongoose_1.default.model("TokenLease", TokenLeaseSchema);
        TelemetryLogModel = mongoose_1.default.model("TelemetryLog", TelemetryLogSchema);
        SystemStatModel = mongoose_1.default.model("SystemStat", SystemStatSchema);
        // Seed database if empty
        const count = await PantryItemModel.countDocuments();
        if (count === 0) {
            console.log("Seeding initial database baseline to MongoDB...");
            await (0, exports.resetDatabase)();
        }
    }
    catch (error) {
        console.warn("⚠️ MongoDB connection failed. Falling back to IN-MEMORY DATABASE mode.");
        useFallback = true;
        seedInMemory();
    }
};
exports.connectDB = connectDB;
// Database APIs
const getPantry = async () => {
    if (useFallback)
        return memoryStore.pantry;
    const items = await PantryItemModel.find();
    const pantry = {};
    items.forEach((item) => {
        pantry[item.name] = item.quantity;
    });
    return pantry;
};
exports.getPantry = getPantry;
const getPricing = async () => {
    if (useFallback)
        return memoryStore.pricing;
    const items = await PricingRuleModel.find();
    const pricing = {};
    items.forEach((item) => {
        pricing[item.name] = item.price;
    });
    return pricing;
};
exports.getPricing = getPricing;
const getDietaryRules = async () => {
    if (useFallback)
        return memoryStore.dietaryRules;
    const items = await DietaryRuleModel.find();
    const rules = {};
    items.forEach((item) => {
        rules[item.name] = item.rules;
    });
    return rules;
};
exports.getDietaryRules = getDietaryRules;
const updateInventoryItem = async (ingredient, amount) => {
    const logMsg = `Inventory modified: ${ingredient} set to ${amount} units.`;
    const type = amount === 0 ? "error" : "warning";
    if (useFallback) {
        memoryStore.pantry[ingredient] = amount;
        (0, exports.addTelemetryLog)(logMsg, type);
        return;
    }
    await PantryItemModel.findOneAndUpdate({ name: ingredient }, { quantity: amount }, { upsert: true });
    await (0, exports.addTelemetryLog)(logMsg, type);
};
exports.updateInventoryItem = updateInventoryItem;
const updatePricingRule = async (ingredient, price) => {
    const logMsg = `Pricing modified: ${ingredient} set to ₹${price}.`;
    if (useFallback) {
        memoryStore.pricing[ingredient] = price;
        (0, exports.addTelemetryLog)(logMsg, "warning");
        return;
    }
    await PricingRuleModel.findOneAndUpdate({ name: ingredient }, { price: price }, { upsert: true });
    await (0, exports.addTelemetryLog)(logMsg, "warning");
};
exports.updatePricingRule = updatePricingRule;
const updateDietaryRulesItem = async (ingredient, rules) => {
    const logMsg = `Dietary rules modified: ${ingredient} now supports: [${rules.join(", ")}]`;
    if (useFallback) {
        memoryStore.dietaryRules[ingredient] = rules;
        (0, exports.addTelemetryLog)(logMsg, "warning");
        return;
    }
    await DietaryRuleModel.findOneAndUpdate({ name: ingredient }, { rules: rules }, { upsert: true });
    await (0, exports.addTelemetryLog)(logMsg, "warning");
};
exports.updateDietaryRulesItem = updateDietaryRulesItem;
const resetDatabase = async () => {
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
    for (const [name, quantity] of Object.entries(exports.defaultInventory)) {
        await PantryItemModel.create({ name, quantity });
    }
    // Seed pricing
    for (const [name, price] of Object.entries(exports.defaultPricing)) {
        await PricingRuleModel.create({ name, price });
    }
    // Seed dietary rules
    for (const [name, rules] of Object.entries(exports.defaultDietaryRules)) {
        await DietaryRuleModel.create({ name, rules });
    }
    // Seed stats
    await SystemStatModel.create(exports.defaultStats);
    // Log event
    await (0, exports.addTelemetryLog)(logMsg, "info");
};
exports.resetDatabase = resetDatabase;
const getTokens = async () => {
    if (useFallback)
        return memoryStore.tokens;
    return await TokenLeaseModel.find().sort({ _id: -1 });
};
exports.getTokens = getTokens;
const getToken = async (id) => {
    if (useFallback) {
        return memoryStore.tokens.find((t) => t.id === id) || null;
    }
    return await TokenLeaseModel.findOne({ id });
};
exports.getToken = getToken;
const saveToken = async (token) => {
    if (useFallback) {
        memoryStore.tokens.unshift(token);
        memoryStore.stats.totalGenerated += 1;
        (0, exports.addTelemetryLog)(`New GB-DCT Generated: ${token.id} for dish: "${token.dish.name}"`, "success");
        return;
    }
    await TokenLeaseModel.create(token);
    await SystemStatModel.findOneAndUpdate({}, { $inc: { totalGenerated: 1 } });
    await (0, exports.addTelemetryLog)(`New GB-DCT Generated: ${token.id} for dish: "${token.dish.name}"`, "success");
};
exports.saveToken = saveToken;
const updateTokenStatus = async (id, status) => {
    if (useFallback) {
        const token = memoryStore.tokens.find((t) => t.id === id);
        if (token)
            token.status = status;
        return;
    }
    await TokenLeaseModel.findOneAndUpdate({ id }, { status });
};
exports.updateTokenStatus = updateTokenStatus;
const getTelemetryLogs = async () => {
    if (useFallback)
        return memoryStore.logs;
    return await TelemetryLogModel.find().sort({ _id: -1 }).limit(100);
};
exports.getTelemetryLogs = getTelemetryLogs;
const addTelemetryLog = async (action, type) => {
    const timestamp = new Date().toLocaleTimeString();
    const log = { timestamp, action, type };
    if (useFallback) {
        memoryStore.logs.unshift(log);
        return;
    }
    await TelemetryLogModel.create(log);
};
exports.addTelemetryLog = addTelemetryLog;
const getStats = async () => {
    if (useFallback)
        return memoryStore.stats;
    const stat = await SystemStatModel.findOne();
    return stat || exports.defaultStats;
};
exports.getStats = getStats;
const incrementStats = async (field) => {
    if (useFallback) {
        memoryStore.stats[field] += 1;
        return;
    }
    await SystemStatModel.findOneAndUpdate({}, { $inc: { [field]: 1 } });
};
exports.incrementStats = incrementStats;
