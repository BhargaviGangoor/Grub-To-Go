"use client";

import { useEffect, useRef } from "react";
import { Message } from "./types";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";
import { SuggestionChips } from "./SuggestionChips";

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  onSuggestionSelect: (prompt: string) => void;
}

/**
 * ChatMessages.tsx
 *
 * The scrollable list of messages + auto-scroll + empty state.
 *
 * ─── REACT CONCEPTS USED ─────────────────────────────────────────────────────
 *
 * useRef + scrollIntoView (Auto-scroll):
 *   We place an invisible `<div ref={messagesEndRef}` at the bottom of the list.
 *   Every time `messages` changes, useEffect fires and calls:
 *   `messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })`
 *   This smoothly scrolls to the bottom whenever a new message arrives.
 *
 * useEffect([messages, isLoading]):
 *   The dependency array `[messages, isLoading]` means:
 *   "Run this effect whenever messages OR isLoading changes."
 *   Without the dependency array, the effect would run on EVERY render (wasteful).
 *   With an empty array [], it would only run once on mount (too infrequent).
 *
 * ─── UX: Empty State ─────────────────────────────────────────────────────────
 * When messages.length === 0: show SuggestionChips (onboarding experience).
 * When messages.length > 0: show the message list (conversation mode).
 * These are two distinct UX modes.
 *
 * ─── ACCESSIBILITY ───────────────────────────────────────────────────────────
 * role="log" + aria-live="polite": screen readers announce new messages.
 * aria-label: describes the chat log to assistive technology.
 */
export function ChatMessages({
  messages,
  isLoading,
  onSuggestionSelect,
}: ChatMessagesProps) {
  // useRef: points to the invisible div at the bottom of the message list
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom whenever messages change or loading starts/stops
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const isEmpty = messages.length === 0;

  return (
    <div
      className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4"
      role="log"
      aria-label="Chat messages"
      aria-live="polite"
    >
      {isEmpty ? (
        // ── Empty State: Show suggestion chips ──
        <div className="flex-1 flex flex-col justify-center">
          <SuggestionChips onSelect={onSuggestionSelect} />
        </div>
      ) : (
        // ── Conversation Mode: Show messages ──
        <>
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}

          {/* Typing indicator while AI is generating */}
          {isLoading && <TypingIndicator />}

          {/* Invisible scroll anchor */}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
}
