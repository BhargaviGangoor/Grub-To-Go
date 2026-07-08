import { Request, Response, NextFunction } from "express";
import { ChatService } from "../services/ChatService";
import { ChatRequest, ChatResponse } from "../types/chat.types";

/**
 * ChatController.ts
 *
 * The HTTP Adapter Layer.
 *
 * ─── WHAT A CONTROLLER IS ────────────────────────────────────────────────────
 * A controller knows about HTTP. It reads req.body, calls a service,
 * and writes res.json(). That's ALL it does.
 *
 * A controller does NOT:
 *   ✗ contain business logic (that's the service's job)
 *   ✗ talk to a database directly (that's the service's job)
 *   ✗ know which LLM is being used (that's the provider's job)
 *
 * ─── WHY SEPARATE CONTROLLER AND SERVICE ─────────────────────────────────────
 * Imagine you want to add WebSocket support for real-time streaming.
 * You create a NEW controller: WebSocketChatController.
 * It calls the SAME ChatService.processMessage().
 * No duplication. No coupling.
 *
 * Imagine you want to add a CLI tool for testing.
 * Same ChatService, new "controller" that reads from stdin.
 *
 * ─── EXPRESS CONCEPTS USED ───────────────────────────────────────────────────
 * Request<Params, ResBody, ReqBody, Query>: typed Express request
 * Response: Express response with json(), status() etc.
 * NextFunction: used to forward errors to Express error handler middleware
 *
 * ─── TYPESCRIPT CONCEPT: Class-based controller ──────────────────────────────
 * Using a class (rather than a plain function) means:
 *   - The ChatService is injected once in the constructor
 *   - `handle` can be a bound arrow function (solves `this` binding issues)
 *   - Easy to extend in future (add rate limiting, add auth checks)
 */
export class ChatController {
  private chatService: ChatService;

  constructor(chatService: ChatService) {
    this.chatService = chatService;
  }

  /**
   * Handle POST /api/chat
   *
   * Arrow function (not method) so `this` is always bound correctly
   * when Express calls it as a callback: router.post('/api/chat', controller.handle)
   *
   * Flow:
   *   1. Validate request body
   *   2. Call ChatService
   *   3. Return structured response
   *   4. Forward unexpected errors to Express errorHandler middleware
   */
  handle = async (
    req: Request<{}, ChatResponse, ChatRequest>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // ── 1. Input Validation ──────────────────────────────────────────────
      // TypeScript gives us the type, but HTTP data is always "unknown" at runtime.
      // We validate manually to give clear error messages.
      const { message } = req.body;

      if (!message) {
        res.status(400).json({
          error: "message is required",
          status: 400,
        });
        return;
      }

      if (typeof message !== "string") {
        res.status(400).json({
          error: "message must be a string",
          status: 400,
        });
        return;
      }

      if (message.trim().length === 0) {
        res.status(400).json({
          error: "message cannot be empty",
          status: 400,
        });
        return;
      }

      if (message.length > 2000) {
        res.status(400).json({
          error: "message too long (max 2000 characters)",
          status: 400,
        });
        return;
      }

      // ── 2. Call Service ──────────────────────────────────────────────────
      // The controller has NO idea how processMessage works internally.
      // It just knows: give it a string, get back a string.
      const reply = await this.chatService.processMessage(message);

      // ── 3. Return Response ───────────────────────────────────────────────
      const response: ChatResponse = { reply };
      res.status(200).json(response);

    } catch (error) {
      // ── 4. Forward to Error Handler ──────────────────────────────────────
      // `next(error)` triggers Express's error handler middleware.
      // We don't format errors here — that's the middleware's job.
      next(error);
    }
  };
}
