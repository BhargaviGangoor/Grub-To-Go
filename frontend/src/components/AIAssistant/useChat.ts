"use client";

import { useState, useCallback } from "react";
import { Message, ChatState } from "./types";
import { sendChatMessage } from "./api";
import { triggerAgentAutomation } from "@/components/AgentGhostOverlay";

/**
 * useChat.ts — Custom React Hook for AI Chat State
 *
 * ─── WHY A CUSTOM HOOK ───────────────────────────────────────────────────────
 * React hooks let you "hook into" React's state and lifecycle from functions.
 * A custom hook extracts stateful logic so components stay "dumb" (presentational).
 *
 * Without useChat: ChatWindow would contain useState, useCallback, fetch logic,
 * error handling — it would be 200+ lines of mixed concerns.
 *
 * With useChat: ChatWindow receives messages, isLoading, sendMessage as props.
 * It's purely about rendering. 50 lines. Easy to understand, easy to test.
 *
 * ─── REACT CONCEPTS USED ─────────────────────────────────────────────────────
 *
 * useState<T>(initialValue): Returns [state, setState].
 *   React re-renders the component when setState is called.
 *   TypeScript generic <T> means `messages` is typed as Message[], not any[].
 *
 * useCallback(fn, deps): Memoizes a function reference.
 *   Without it: sendMessage would be a NEW function object every render.
 *   Components receiving it as a prop would re-render unnecessarily.
 *   With it: the function reference is stable as long as dependencies don't change.
 *
 * "use client": Next.js directive. Marks this as a Client Component.
 *   Hooks (useState, useEffect) only work in client components.
 *   Server Components run on the server — they have no browser state.
 *
 * ─── FUTURE EVOLUTION ────────────────────────────────────────────────────────
 * When streaming is added:
 *   - Replace sendChatMessage with a streaming reader
 *   - Use setState to update the AI message character-by-character
 *
 * When multi-turn memory is added:
 *   - Pass `messages` history to the API call
 *   - Backend will include history in the LLM context window
 *
 * When sessions are added:
 *   - useRef to maintain sessionId across renders
 *   - Include sessionId in every API call
 */

/**
 * Generates a unique ID for each message.
 * Uses crypto.randomUUID() if available (modern browsers), falls back to timestamp+random.
 */
function generateId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export interface UseChatReturn extends ChatState {
  sendMessage: (content: string) => Promise<void>;
  clearError: () => void;
}

export function useChat(): UseChatReturn {
  // useState with TypeScript generics — the array is always Message[], never any[]
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Send a message and receive an AI reply.
   *
   * useCallback: Memoizes this function so its reference is stable across renders.
   * The empty dependency array [] means: create this function once, never recreate.
   * (setMessages and setIsLoading from useState are guaranteed stable by React.)
   */
  const sendMessage = useCallback(async (content: string): Promise<void> => {
    if (!content.trim() || isLoading) return;

    // Clear any previous error
    setError(null);

    // 1. Add the user's message to the chat immediately (optimistic UI)
    //    Users see their message appear before the server responds.
    const userMessage: Message = {
      id: generateId(),
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Trigger visual agent screen automation cursor movement
    triggerAgentAutomation();

    try {
      // 2. Call the backend
      const res = await sendChatMessage(content.trim());

      // 3. Add AI reply to the chat
      const assistantMessage: Message = {
        id: generateId(),
        role: "assistant",
        content: res.reply,
        timestamp: new Date(),
        agentSteps: res.agentSteps,
        dish: res.dish,
        dctTokenId: res.dctTokenId,
        orderId: res.orderId,
      };

      setMessages((prev) => [...prev, assistantMessage]);

    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Something went wrong. Please try again.";

      setError(errorMessage);

      // Add error message as an AI message bubble so the user sees it in context
      const errorBubble: Message = {
        id: generateId(),
        role: "assistant",
        content: `Sorry, I ran into an issue: ${errorMessage} Please try again. 🙏`,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorBubble]);

    } finally {
      // 4. Always clear loading state, whether success or error
      setIsLoading(false);
    }
  }, [isLoading]);

  const clearError = useCallback(() => setError(null), []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearError,
  };
}
