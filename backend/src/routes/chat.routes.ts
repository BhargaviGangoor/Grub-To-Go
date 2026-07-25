import { Router } from "express";
import { ChatController } from "../controllers/ChatController";
import { ChatService } from "../services/ChatService";
import { GroqProvider } from "../llm/GroqProvider";
import { GeminiProvider } from "../llm/GeminiProvider";
import { FallbackLLMProvider } from "../llm/FallbackLLMProvider";
import { LLMProvider } from "../llm/LLMProvider.interface";
import { PlannerAgent } from "../agents/PlannerAgent";
import { MenuTool } from "../tools/MenuTool";
import { InventoryTool } from "../tools/InventoryTool";
import { DCTTool } from "../tools/DCTTool";
import { OrderTool } from "../tools/OrderTool";
import { DCTService } from "../services/DCTService";
import { config } from "../config";

/**
 * chat.routes.ts — Multi-Provider Composition Root
 *
 * Assembles the multi-API failover chain:
 *   FallbackLLMProvider
 *     ├── Primary Groq API Key (GROQ_API_KEY)
 *     ├── Secondary Groq API Key (GROQ_API_KEY_2 / GROQ_API_KEY_FALLBACK)
 *     └── Google Gemini API Key (GEMINI_API_KEY)
 *       ↓
 *   PlannerAgent ← MenuTool, InventoryTool, DCTTool, OrderTool
 *       ↓
 *   ChatService
 *       ↓
 *   ChatController
 *       ↓
 *   POST /api/chat
 */

const router = Router();

// ─── Build Multi-API Fallback Chain ──────────────────────────────────────────

const providers: LLMProvider[] = [];

// 1. Primary Groq Key
if (config.groqApiKey) {
  providers.push(new GroqProvider(config.groqApiKey));
}

// 2. Secondary Groq Key (if configured in environment)
const secondaryGroqKey = process.env.GROQ_API_KEY_SECONDARY || process.env.GROQ_API_KEY_FALLBACK;
if (secondaryGroqKey) {
  providers.push(new GroqProvider(secondaryGroqKey));
}

// 3. Google Gemini Key (if configured in environment)
if (config.geminiApiKey || process.env.GEMINI_API_KEY) {
  providers.push(new GeminiProvider(config.geminiApiKey || process.env.GEMINI_API_KEY));
}

// Fallback to primary Groq if no array populated
if (providers.length === 0) {
  providers.push(new GroqProvider());
}

const multiLLMProvider = new FallbackLLMProvider(providers);

// Services shared across tools
const dctService = new DCTService();

// Deterministic Tool Layer
const menuTool      = new MenuTool();
const inventoryTool = new InventoryTool();
const dctTool       = new DCTTool(dctService);
const orderTool     = new OrderTool();

// Autonomous Orchestration Layer — injected with multi-API provider + tools
const plannerAgent = new PlannerAgent(
  multiLLMProvider,
  menuTool,
  inventoryTool,
  dctTool,
  orderTool
);

// Business logic layer
const chatService = new ChatService(plannerAgent);

// HTTP adapter
const chatController = new ChatController(chatService);

// ─── Route registration ───────────────────────────────────────────────────────
router.post("/api/chat", chatController.handle);

export default router;
