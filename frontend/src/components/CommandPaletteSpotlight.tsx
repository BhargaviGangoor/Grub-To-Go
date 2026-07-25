"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Command, ArrowRight, CheckCircle2, Loader2, X } from "lucide-react";
import { triggerAgentAutomation } from "@/components/AgentGhostOverlay";
import { sendChatMessage } from "@/components/AIAssistant/api";

export function CommandPaletteSpotlight() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ name: string; price: number; reply: string } | null>(null);

  // Global hotkey listener (⌘ K / Ctrl K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isProcessing) return;

    const userQuery = query.trim();
    setIsProcessing(true);
    setResult(null);

    try {
      const res = await sendChatMessage(userQuery);

      if (res.dish) {
        setResult({
          name: res.dish.name,
          price: res.dish.estimatedCost,
          reply: res.reply,
        });

        triggerAgentAutomation({
          steps: res.agentSteps,
          dishName: res.dish.name,
          price: res.dish.estimatedCost,
          imageUrl: res.dish.imageUrl,
          dctTokenId: res.dctTokenId,
          orderId: res.orderId,
          dietary: res.dish.dietary,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/80 backdrop-blur-md pointer-events-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="relative w-full max-w-2xl overflow-hidden rounded-3xl border-2 border-emerald-500/50 bg-stone-900/95 text-white shadow-[0_30px_90px_rgba(0,0,0,0.9)] backdrop-blur-2xl"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-stone-800 px-6 py-4">
            <div className="flex items-center gap-2.5 font-mono text-xs font-bold text-emerald-400">
              <Sparkles className="h-4 w-4 text-emerald-400" />
              <span>SPOTLIGHT COMMAND PALETTE</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="hidden sm:inline-flex items-center gap-1 rounded bg-stone-800 px-2 py-0.5 text-[10px] font-mono text-stone-400 border border-stone-700">
                <Command className="h-3 w-3" /> K
              </kbd>
              <button
                onClick={() => setIsOpen(false)}
                className="text-stone-400 hover:text-white p-1 rounded-full hover:bg-stone-800 transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Form Input */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="relative flex items-center">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="What do you want to eat? (e.g. Vegetarian dinner under ₹300)..."
                autoFocus
                className="w-full rounded-2xl border-2 border-emerald-500/40 bg-stone-950/90 px-5 py-4 text-sm text-white placeholder-stone-400 focus:outline-none focus:border-emerald-400 font-sans shadow-inner"
              />
              <button
                type="submit"
                disabled={isProcessing}
                className="absolute right-3 flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-stone-950 hover:bg-emerald-400 transition cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <Loader2 className="h-4 w-4 animate-spin text-stone-950" />
                ) : (
                  <ArrowRight className="h-5 w-5" />
                )}
              </button>
            </div>
          </form>

          {/* Results Display */}
          {result && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="border-t border-stone-800 bg-emerald-950/30 p-6"
            >
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>DECISION CONFIRMED BY PLANNERAGENT</span>
              </div>
              <h3 className="mt-2 text-2xl font-black text-white">
                {result.name} — <span className="text-emerald-400">₹{result.price}</span>
              </h3>
              <p className="mt-2 text-xs text-stone-300 font-sans leading-relaxed">
                {result.reply}
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
