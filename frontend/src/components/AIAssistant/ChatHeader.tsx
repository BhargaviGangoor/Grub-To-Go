"use client";

import { X, Sparkles } from "lucide-react";

interface ChatHeaderProps {
  onClose: () => void;
}

/**
 * ChatHeader.tsx
 *
 * The top bar of the chat panel — branding + close button.
 *
 * ─── DESIGN DECISIONS ────────────────────────────────────────────────────────
 * Emerald gradient header: signals this is the "AI zone" of the app.
 * Sparkles icon: universally recognized as "AI/magic" in modern UI.
 * Pulsing green dot: shows the AI is "live" and connected.
 * Close button: X icon, top-right — standard chat UI convention.
 *
 * ─── REACT: Props Interface ───────────────────────────────────────────────────
 * `onClose: () => void` — the parent passes a callback function.
 * ChatHeader doesn't know HOW closing works — just that it should call onClose.
 * This is "lifting state up" — the open/closed state lives in the parent.
 */
export function ChatHeader({ onClose }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-emerald-900 to-emerald-700 rounded-t-2xl">
      {/* Left: Branding */}
      <div className="flex items-center gap-2.5">
        {/* AI Icon */}
        <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur flex items-center justify-center">
          <Sparkles size={16} className="text-amber-300" />
        </div>

        {/* Title + Status */}
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-white font-semibold text-sm font-heading">GrubBot</span>
            {/* Live status dot */}
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
          </div>
          <p className="text-emerald-200 text-[10px] font-body">
            AI Dining Assistant · Powered by Groq
          </p>
        </div>
      </div>

      {/* Right: Close button */}
      <button
        onClick={onClose}
        aria-label="Close AI assistant"
        className="
          w-7 h-7 rounded-lg
          flex items-center justify-center
          text-white/70 hover:text-white
          hover:bg-white/15
          transition-all duration-150
          active:scale-90
        "
      >
        <X size={16} />
      </button>
    </div>
  );
}
