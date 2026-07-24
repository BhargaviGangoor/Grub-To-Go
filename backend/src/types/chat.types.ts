/**
 * chat.types.ts
 *
 * TypeScript contracts for the Chat API.
 *
 * WHY TYPES MATTER HERE:
 * These interfaces define the "contract" between:
 *   - Frontend ↔ Backend  (ChatRequest / ChatResponse are the HTTP shapes)
 *   - Controller ↔ Service (both speak the same types)
 *
 * In future, when we add multi-turn conversation history, streaming,
 * agent metadata, or DCT tokens to responses — we extend these types.
 * The compiler then tells us every call site that needs updating.
 */

/**
 * Shape of the incoming POST /api/chat request body.
 * Simple today. Could grow to include:
 *   - history: Message[]  (for multi-turn memory)
 *   - userId: string      (for personalization)
 *   - sessionId: string   (for agent state continuity)
 */
export interface ChatRequest {
  message: string;
}

import { AgentStep } from "./agent.types";

/**
 * Shape of the success response from POST /api/chat.
 */
export interface ChatResponse {
  reply: string;
  agentSteps?: AgentStep[];
  dish?: any;
  dctTokenId?: string;
  orderId?: string;
}

/**
 * Shape of error responses (used by errorHandler middleware).
 */
export interface ErrorResponse {
  error: string;
  status: number;
}

/**
 * Internal type passed from Controller → Service.
 * Identical to ChatRequest today, but keeping them separate means
 * the Service can evolve its own input shape without coupling to HTTP.
 */
export interface ChatMessage {
  content: string;
}
