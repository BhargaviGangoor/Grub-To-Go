/**
 * api.ts — HTTP client for the AI Assistant
 *
 * ─── WHY A SEPARATE api.ts ──────────────────────────────────────────────────
 * Centralizes ALL communication with the backend.
 * Components never call fetch() directly — they call functions from here.
 *
 * Benefits:
 *   1. Change the backend URL in ONE place
 *   2. Add auth headers in ONE place (when auth is ready)
 *   3. Add request timeout logic in ONE place
 *   4. Add request/response logging in ONE place
 *   5. Easy to mock in tests: jest.mock('./api')
 *
 * ─── NEXT.JS CONCEPT: Environment Variables ──────────────────────────────────
 * NEXT_PUBLIC_ prefix makes env vars available in the browser bundle.
 * Without this prefix, env vars are server-side only (Next.js default).
 * The backend URL is public — it's just a URL, not a secret.
 *
 * ─── FUTURE EVOLUTION ────────────────────────────────────────────────────────
 * When streaming is added: replace fetch with EventSource or ReadableStream.
 * When auth is added: add Authorization: Bearer {token} header.
 * When multi-turn is added: pass conversation history array in request body.
 */

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

import { AgentStep } from "./types";

export interface ChatApiResponse {
  reply: string;
  agentSteps?: AgentStep[];
  dish?: any;
  dctTokenId?: string;
  orderId?: string;
}

/**
 * Send a message to the AI assistant and receive structured response.
 */
export async function sendChatMessage(message: string): Promise<ChatApiResponse> {
  const response = await fetch(`${BACKEND_URL}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    let errorMessage = `Backend error: ${response.status}`;
    try {
      const errorBody = await response.json();
      errorMessage = errorBody.error || errorMessage;
    } catch {
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();

  if (!data.reply) {
    throw new Error("Received empty reply from AI assistant.");
  }

  return {
    reply: data.reply,
    agentSteps: data.agentSteps,
    dish: data.dish,
    dctTokenId: data.dctTokenId,
    orderId: data.orderId,
  };
}
