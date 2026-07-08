"use client";

import { Message } from "./types";
import { ChatHeader } from "./ChatHeader";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
  onSend: (message: string) => void;
  onClose: () => void;
}

/**
 * ChatWindow.tsx
 *
 * The main chat panel — composes Header + Messages + Input into one panel.
 *
 * ─── REACT CONCEPT: Composition ──────────────────────────────────────────────
 * ChatWindow is a "container" component — it doesn't know how to render messages
 * or handle input. It delegates to specialized children.
 * This is React's "composition over inheritance" philosophy.
 *
 * ─── DESIGN: Panel Dimensions & Layout ───────────────────────────────────────
 * Fixed height (500px): prevents the panel from growing to fill the screen.
 * flex + flex-col: stacks Header, Messages (flex-1), Input vertically.
 * Messages gets `flex-1` which means it takes all remaining vertical space.
 * backdrop-blur + border: glassmorphism effect — panel feels elevated.
 *
 * ─── WHY ChatWindow DOESN'T CONTAIN STATE ────────────────────────────────────
 * All state (messages, isLoading) lives in useChat, called from AIAssistant.
 * ChatWindow receives them as props — it's purely presentational.
 * This means: if you want to embed the chat inside a page (not floating),
 * you just render <ChatWindow> without <AIAssistant> — no logic changes.
 */
export function ChatWindow({
  messages,
  isLoading,
  onSend,
  onClose,
}: ChatWindowProps) {
  return (
    <div
      className="
        flex flex-col
        w-[380px] h-[520px]
        bg-[#faf8f3] rounded-2xl
        shadow-2xl shadow-emerald-900/20
        border border-stone-200
        overflow-hidden
      "
      role="dialog"
      aria-label="GrubBot AI Assistant"
      aria-modal="false"
    >
      {/* Header */}
      <ChatHeader onClose={onClose} />

      {/* Message list — takes remaining height */}
      <ChatMessages
        messages={messages}
        isLoading={isLoading}
        onSuggestionSelect={onSend}
      />

      {/* Input area */}
      <ChatInput onSend={onSend} isLoading={isLoading} />
    </div>
  );
}
