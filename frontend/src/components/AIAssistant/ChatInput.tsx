"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { SendHorizonal } from "lucide-react";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

/**
 * ChatInput.tsx
 *
 * The text input area + send button at the bottom of the chat panel.
 *
 * ─── REACT CONCEPTS USED ─────────────────────────────────────────────────────
 *
 * Controlled Input:
 *   React controls the input value via `value={inputValue}`.
 *   Every keystroke triggers onChange → setState → re-render with new value.
 *   This is "controlled" because React is the single source of truth for the value.
 *   Alternative: uncontrolled inputs use refs — avoided here for simplicity.
 *
 * useRef:
 *   `textareaRef` holds a reference to the DOM element.
 *   We call `textareaRef.current.focus()` after sending — to keep focus in the input.
 *   useRef does NOT cause re-renders when changed (unlike useState).
 *
 * KeyboardEvent handling:
 *   Enter submits. Shift+Enter inserts a newline (standard chat convention).
 *   `event.preventDefault()` stops the browser's default Enter behavior (form submit / newline).
 *
 * ─── UX DECISIONS ────────────────────────────────────────────────────────────
 * Auto-resize textarea: height adjusts as user types more text.
 * Disabled state: input is disabled while AI is generating → prevents double-sends.
 * Send button: disabled when empty or loading → prevents accidental empty submissions.
 * Emoji in placeholder → friendly tone matching GrubToGo's warm brand.
 */
export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [inputValue, setInputValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = inputValue.trim();
    if (!trimmed || isLoading) return;

    onSend(trimmed);
    setInputValue("");

    // Refocus input after sending
    setTimeout(() => textareaRef.current?.focus(), 10);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter sends. Shift+Enter creates a newline.
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isEmpty = inputValue.trim().length === 0;

  return (
    <div className="flex items-end gap-2 p-3 bg-white border-t border-stone-100 rounded-b-2xl">
      {/* Textarea — grows with content */}
      <textarea
        ref={textareaRef}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask me anything about food... 🍽️"
        disabled={isLoading}
        rows={1}
        className="
          flex-1 resize-none
          text-sm text-stone-800 placeholder:text-stone-400
          bg-stone-50 border border-stone-200
          rounded-xl px-3 py-2.5
          focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all duration-200
          max-h-32 overflow-y-auto
        "
        style={{
          // Auto-resize: grow with content up to max-h-32
          height: "auto",
          minHeight: "40px",
        }}
        onInput={(e) => {
          // Auto-resize textarea height
          const target = e.target as HTMLTextAreaElement;
          target.style.height = "auto";
          target.style.height = Math.min(target.scrollHeight, 128) + "px";
        }}
      />

      {/* Send button */}
      <button
        onClick={handleSend}
        disabled={isEmpty || isLoading}
        aria-label="Send message"
        className="
          flex-shrink-0
          w-10 h-10
          flex items-center justify-center
          bg-gradient-to-br from-emerald-700 to-emerald-900
          text-white rounded-xl
          transition-all duration-200
          hover:from-emerald-600 hover:to-emerald-800 hover:scale-105 hover:shadow-lg
          disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none
          active:scale-95
        "
      >
        <SendHorizonal size={16} />
      </button>
    </div>
  );
}
