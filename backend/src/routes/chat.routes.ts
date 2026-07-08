import { Router } from "express";
import { ChatController } from "../controllers/ChatController";
import { ChatService } from "../services/ChatService";
import { GroqProvider } from "../llm/GroqProvider";

/**
 * chat.routes.ts
 *
 * URL → Controller mapping for the /api/chat endpoint.
 *
 * ─── WHAT A ROUTER IS ────────────────────────────────────────────────────────
 * Express Router is a mini-application that can handle routes independently.
 * It gets mounted at a path in the main app: app.use(chatRouter)
 *
 * ─── WHY SEPARATE ROUTES FROM CONTROLLERS ───────────────────────────────────
 * The router decides: "Which handler responds to POST /api/chat?"
 * The controller decides: "How does the handler process this request?"
 *
 * Separation means you can:
 *   - Add route-level middleware here (auth, rate limiting) without changing controllers
 *   - Version routes (/api/v1/chat, /api/v2/chat) from one place
 *   - Group related routes into logical files (chat.routes, order.routes, etc.)
 *
 * ─── DEPENDENCY ASSEMBLY (Composition Root) ──────────────────────────────────
 * This is where the dependency chain is assembled:
 *   GroqProvider → ChatService → ChatController → Route
 *
 * This is the "Composition Root" pattern — all dependencies are wired together
 * at the outermost layer (routes/index.ts or app startup).
 * This makes the chain explicit and easy to trace.
 *
 * TO SWAP PROVIDERS: Change `new GroqProvider()` to `new CerebrasProvider()`
 * That single line is the only change needed to switch the entire LLM.
 *
 * ─── FUTURE ADDITIONS ────────────────────────────────────────────────────────
 * // Add auth middleware:
 * router.post("/api/chat", authMiddleware, rateLimitMiddleware, controller.handle);
 *
 * // Add streaming endpoint:
 * router.post("/api/chat/stream", controller.handleStream);
 *
 * // Add conversation history endpoint:
 * router.get("/api/chat/history/:sessionId", controller.getHistory);
 */

const router = Router();

// Assemble the dependency chain
const groqProvider = new GroqProvider();
const chatService = new ChatService(groqProvider);
const chatController = new ChatController(chatService);

// Route registration
router.post("/api/chat", chatController.handle);

export default router;
