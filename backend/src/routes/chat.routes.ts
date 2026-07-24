import { Router } from "express";
import { ChatController } from "../controllers/ChatController";
import { ChatService } from "../services/ChatService";
import { GroqProvider } from "../llm/GroqProvider";
import { PlannerAgent } from "../agents/PlannerAgent";
import { MenuTool } from "../tools/MenuTool";
import { InventoryTool } from "../tools/InventoryTool";
import { DCTTool } from "../tools/DCTTool";
import { OrderTool } from "../tools/OrderTool";
import { DCTService } from "../services/DCTService";

/**
 * chat.routes.ts — Composition Root (Phase 2)
 *
 * Assembles the full Phase 2 dependency chain:
 *
 *   GroqProvider
 *       ↓
 *   PlannerAgent ← MenuTool, InventoryTool, DCTTool, OrderTool
 *       ↓
 *   ChatService
 *       ↓
 *   ChatController
 *       ↓
 *   POST /api/chat
 *
 * To swap the LLM: change `new GroqProvider()` to any LLMProvider implementation.
 * To swap the planner: replace PlannerAgent with any orchestrator class.
 * The controller and frontend never change.
 */

const router = Router();

// ─── Assemble dependency chain ────────────────────────────────────────────────

// LLM inference layer
const groqProvider = new GroqProvider();

// Services shared across tools
const dctService = new DCTService();

// Tool layer (each tool is a focused, single-responsibility unit)
const menuTool      = new MenuTool();
const inventoryTool = new InventoryTool();
const dctTool       = new DCTTool(dctService);
const orderTool     = new OrderTool();

// Orchestration layer — receives LLMProvider + tools via injection
const plannerAgent = new PlannerAgent(
  groqProvider,
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
