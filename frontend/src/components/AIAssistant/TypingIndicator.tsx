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
import { useState, useEffect } from "react";

const AGENT_STEPS = [
  "🎯 Extracting intent & constraints...",
  "🔍 Searching MongoDB menu catalog...",
  "📦 Auditing live pantry inventory & dietary rules...",
  "🎟️ Generating & attesting GB-DCT commitment lease...",
  "🛒 Finalizing autonomous order execution..."
];

export function TypingIndicator() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev + 1) % AGENT_STEPS.length);
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-start gap-2 px-1 my-1">
      {/* AI Avatar */}
      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-emerald-700 to-emerald-900 flex items-center justify-center shadow-sm relative">
        <span className="text-xs">🤖</span>
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
      </div>

      {/* Execution status bubble */}
      <div className="bg-gradient-to-br from-stone-900 to-emerald-950 text-white rounded-2xl rounded-tl-sm px-3.5 py-2.5 shadow-md border border-emerald-800/40 max-w-[85%]">
        <div className="flex items-center gap-2 mb-1">
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
          <span className="text-[11px] font-semibold tracking-wide uppercase text-emerald-400">
            PlannerAgent Executing
          </span>
        </div>

        <div className="text-xs text-stone-200 font-mono transition-all duration-300">
          {AGENT_STEPS[currentStepIndex]}
        </div>
      </div>
    </div>
  );
}
