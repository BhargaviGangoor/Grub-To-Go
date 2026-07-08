"use client";

import { Sparkles, X } from "lucide-react";

interface FloatingButtonProps {
  isOpen: boolean;
  onClick: () => void;
  hasMessages: boolean;
}

/**
 * FloatingButton.tsx
 *
 * The circular AI copilot button fixed to the bottom-right corner.
 *
 * ─── DESIGN: The "Fixed Floating" Pattern ────────────────────────────────────
 * `position: fixed` removes the element from document flow entirely.
 * It's positioned relative to the viewport — not its parent container.
 * This is WHY the button stays in the corner as you scroll.
 *
 * In Tailwind: `fixed bottom-6 right-6` = position:fixed; bottom:1.5rem; right:1.5rem
 *
 * ─── VISUAL STATES ───────────────────────────────────────────────────────────
 * Closed: Emerald gradient circle with Sparkles icon + pulsing ring.
 *   The pulse ring uses `animate-ping` — a CSS keyframe that scales and fades.
 *   This subtle animation draws the eye without being disruptive.
 *
 * Open: Darker background + X icon (to signal "click to close").
 *   Removing the pulse ring when open reduces visual noise.
 *
 * Notification dot: appears when there are unread messages (hasMessages).
 *   Small amber circle in the top-right corner of the button.
 *
 * ─── ACCESSIBILITY ───────────────────────────────────────────────────────────
 * aria-label changes based on state ("Open/Close AI assistant")
 * aria-expanded signals open/closed state to screen readers.
 */
export function FloatingButton({ isOpen, onClick, hasMessages }: FloatingButtonProps) {
  return (
    <div className="relative">
      {/* Pulse ring — only when closed, to attract attention */}
      {!isOpen && (
        <span className="absolute inset-0 rounded-full bg-emerald-500 opacity-30 animate-ping pointer-events-none" />
      )}

      {/* The button itself */}
      <button
        onClick={onClick}
        aria-label={isOpen ? "Close AI assistant" : "Open AI assistant"}
        aria-expanded={isOpen}
        className={`
          relative
          w-14 h-14 rounded-full
          flex items-center justify-center
          shadow-xl shadow-emerald-900/30
          transition-all duration-300
          hover:scale-110 hover:shadow-2xl hover:shadow-emerald-800/40
          active:scale-95
          ${isOpen
            ? "bg-gradient-to-br from-emerald-900 to-emerald-700 rotate-0"
            : "bg-gradient-to-br from-emerald-700 to-emerald-900"
          }
        `}
        style={{
          // Smooth rotation when toggling between states
          transform: isOpen ? "scale(1) rotate(0deg)" : undefined,
        }}
      >
        {/* Icon: Sparkles when closed, X when open */}
        <div
          className="text-white transition-all duration-300"
          style={{ transform: isOpen ? "rotate(90deg)" : "rotate(0deg)" }}
        >
          {isOpen ? (
            <X size={22} strokeWidth={2.5} />
          ) : (
            <Sparkles size={22} strokeWidth={2} />
          )}
        </div>

        {/* Notification dot — amber, top-right corner */}
        {hasMessages && !isOpen && (
          <span className="absolute top-1 right-1 w-3 h-3 bg-amber-400 rounded-full border-2 border-white" />
        )}
      </button>
    </div>
  );
}
