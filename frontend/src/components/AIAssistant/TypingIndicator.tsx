"use client";

/**
 * TypingIndicator.tsx
 *
 * The animated "AI is thinking" indicator — 3 bouncing dots.
 *
 * ─── CSS CONCEPT: Keyframe Animation ────────────────────────────────────────
 * We use Tailwind's `animate-bounce` but with staggered delays.
 * Each dot has a different animation-delay, creating a ripple wave effect.
 *
 * ─── REACT CONCEPT: Pure Presentational Component ────────────────────────────
 * This component has NO state, NO side effects.
 * It just renders based on props (none, in this case).
 * These are the easiest components to test and reason about.
 */
export function TypingIndicator() {
  return (
    <div className="flex items-start gap-2 px-1">
      {/* AI Avatar */}
      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-emerald-700 to-emerald-900 flex items-center justify-center shadow-sm">
        <span className="text-xs">🤖</span>
      </div>

      {/* Bubble with bouncing dots */}
      <div className="bg-white border border-stone-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1.5">
          <span
            className="w-2 h-2 rounded-full bg-emerald-600 inline-block animate-bounce"
            style={{ animationDelay: "0ms" }}
          />
          <span
            className="w-2 h-2 rounded-full bg-emerald-600 inline-block animate-bounce"
            style={{ animationDelay: "150ms" }}
          />
          <span
            className="w-2 h-2 rounded-full bg-emerald-600 inline-block animate-bounce"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>
    </div>
  );
}
