"use client";

import { Message } from "./types";

interface MessageBubbleProps {
  message: Message;
}

/**
 * MessageBubble.tsx
 *
 * Renders a single chat message — styled differently for user vs. AI.
 *
 * ─── REACT CONCEPT: Conditional Rendering ────────────────────────────────────
 * `isUser ? "right styles" : "left styles"` — React renders different JSX
 * based on boolean conditions. This is how one component handles two visual states.
 *
 * ─── DESIGN DECISIONS ────────────────────────────────────────────────────────
 * User messages: right-aligned, emerald-900 dark background, white text.
 *   - Visually distinct → "this is what I said"
 *   - Rounded bottom-right corner omitted → speech bubble pointing right
 *
 * AI messages: left-aligned, warm white background, dark text.
 *   - Soft border → "this came from somewhere else"
 *   - Has an avatar (🤖) → personality and identity
 *   - Rounded top-left corner omitted → speech bubble pointing left
 *
 * Timestamps: small, muted, below bubble.
 *   - Gives context for long conversations
 *   - Doesn't distract from the message content
 *
 * ─── TYPESCRIPT CONCEPT: Destructuring with Type ─────────────────────────────
 * `{ message }: MessageBubbleProps` — we destructure the props object
 * and TypeScript ensures `message` matches the Message interface.
 */
export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  const formatTime = (date: Date): string => {
    return new Intl.DateTimeFormat("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };

  return (
    <div className={`flex items-start gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar — only shown for AI messages */}
      {!isUser && (
        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-emerald-700 to-emerald-900 flex items-center justify-center shadow-sm mt-0.5">
          <span className="text-xs">🤖</span>
        </div>
      )}

      <div className={`flex flex-col gap-1 max-w-[80%] ${isUser ? "items-end" : "items-start"}`}>
        {/* Message bubble */}
        <div
          className={`
            px-4 py-2.5 text-sm leading-relaxed shadow-sm
            ${isUser
              ? "bg-gradient-to-br from-emerald-800 to-emerald-900 text-white rounded-2xl rounded-br-sm"
              : "bg-white text-stone-800 rounded-2xl rounded-tl-sm border border-stone-200"
            }
          `}
          style={{ wordBreak: "break-word" }}
        >
          {message.content}
        </div>

        {/* Timestamp */}
        <span className="text-[10px] text-stone-400 px-1">
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}
