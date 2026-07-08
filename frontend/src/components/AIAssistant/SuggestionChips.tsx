"use client";

import { DEFAULT_SUGGESTIONS, SuggestionChip } from "./types";

interface SuggestionChipsProps {
  onSelect: (prompt: string) => void;
}

/**
 * SuggestionChips.tsx
 *
 * Quick-start prompt pills shown when the chat is empty.
 *
 * ─── UX PURPOSE ──────────────────────────────────────────────────────────────
 * An empty chat is intimidating — what do you say? How do you start?
 * Suggestion chips solve "the blank page problem" for AI interfaces.
 * They also educate users on what the AI can do (capability discovery).
 *
 * ─── REACT CONCEPT: Array Rendering with .map() ──────────────────────────────
 * React renders lists using `.map()` — transforming a data array into JSX elements.
 * The `key` prop is REQUIRED — React uses it to efficiently update the DOM.
 * Without keys, React re-renders ALL items when one changes (performance issue).
 *
 * ─── DESIGN DECISIONS ────────────────────────────────────────────────────────
 * Warm amber tint (`amber-50` background, `amber-700` text) distinguishes chips
 * from message bubbles (emerald). Different color = different affordance.
 * Hover state adds a lift effect (translateY) + shadow — communicates clickability.
 */
export function SuggestionChips({ onSelect }: SuggestionChipsProps) {
  return (
    <div className="flex flex-col gap-3 px-1">
      {/* Header text */}
      <p className="text-xs text-stone-500 font-medium text-center">
        ✨ What can I help you with today?
      </p>

      {/* Chip grid — 2 columns on wider panels */}
      <div className="grid grid-cols-2 gap-2">
        {DEFAULT_SUGGESTIONS.map((chip: SuggestionChip) => (
          <button
            key={chip.id}
            onClick={() => onSelect(chip.prompt)}
            className="
              flex flex-col items-start gap-1 p-3
              bg-amber-50 hover:bg-amber-100
              border border-amber-200 hover:border-amber-300
              rounded-xl text-left
              transition-all duration-200
              hover:-translate-y-0.5 hover:shadow-md
              active:scale-95
              group
            "
          >
            <span className="text-lg">{chip.icon}</span>
            <span className="text-xs text-amber-800 font-medium leading-tight">
              {chip.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
