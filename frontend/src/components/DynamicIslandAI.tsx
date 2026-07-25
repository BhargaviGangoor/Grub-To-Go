"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Search, CheckCircle2, ArrowRight, X, Loader2 } from "lucide-react";
import { triggerAgentAutomation } from "@/components/AgentGhostOverlay";
import { sendChatMessage } from "@/components/AIAssistant/api";

export function DynamicIslandAI() {
  const [mode, setMode] = useState<"pill" | "expanded" | "executing" | "success">("pill");
  const [prompt, setPrompt] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const [resultMsg, setResultMsg] = useState<{ name: string; price: number } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || mode === "executing") return;

    const query = prompt.trim();
    setPrompt("");
    setMode("executing");
    setStatusMsg("Analyzing intent & searching menu...");

    try {
      const res = await sendChatMessage(query);

      if (res.dish) {
        setResultMsg({ name: res.dish.name, price: res.dish.estimatedCost });
        setMode("success");

        triggerAgentAutomation({
          steps: res.agentSteps,
          dishName: res.dish.name,
          price: res.dish.estimatedCost,
          imageUrl: res.dish.imageUrl,
          dctTokenId: res.dctTokenId,
          orderId: res.orderId,
          dietary: res.dish.dietary,
        });

        setTimeout(() => {
          setMode("pill");
          setResultMsg(null);
        }, 5000);
      } else {
        setMode("pill");
      }
    } catch (err) {
      setMode("pill");
    }
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 pointer-events-auto">
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 350, damping: 28 }}
        className="overflow-hidden rounded-full border-2 border-emerald-500/40 bg-stone-900/95 text-white shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl"
      >
        <AnimatePresence mode="wait">
          {/* STATE 1: COLLAPSED PILL */}
          {mode === "pill" && (
            <motion.button
              key="pill-mode"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={() => setMode("expanded")}
              className="flex items-center gap-2.5 px-5 py-2.5 text-xs font-mono font-bold tracking-wider text-emerald-300 hover:text-white transition cursor-pointer"
            >
              <Sparkles className="h-4 w-4 text-emerald-400 animate-pulse" />
              <span>✦ Ask Grub anything...</span>
            </motion.button>
          )}

          {/* STATE 2: EXPANDED PROMPT BOX */}
          {mode === "expanded" && (
            <motion.div
              key="expanded-mode"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-[360px] sm:w-[440px] p-4 font-sans"
            >
              <div className="flex items-center justify-between border-b border-stone-800 pb-2 mb-3">
                <div className="flex items-center gap-2 text-xs font-mono font-extrabold text-emerald-400">
                  <Sparkles className="h-4 w-4 text-emerald-400" />
                  <span>✦ GRUB AI ASSISTANT</span>
                </div>
                <button
                  onClick={() => setMode("pill")}
                  className="text-stone-400 hover:text-white p-1 rounded-full hover:bg-stone-800 transition cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <p className="text-xs text-stone-300 font-medium">What are you craving today?</p>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g. Vegetarian dinner under ₹300..."
                    autoFocus
                    className="w-full rounded-2xl border border-emerald-500/40 bg-stone-950/80 px-4 py-2.5 text-xs text-white placeholder-stone-400 focus:outline-none focus:border-emerald-400"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-500 text-stone-950 hover:bg-emerald-400 transition cursor-pointer"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* STATE 3: EXECUTING LIVE STATUS PILL */}
          {mode === "executing" && (
            <motion.div
              key="executing-mode"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center gap-3 px-5 py-2.5 text-xs font-mono font-bold text-emerald-300"
            >
              <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
              <span>✦ Searching menu · 28 dishes •••</span>
            </motion.div>
          )}

          {/* STATE 4: SUCCESS RESULT PILL */}
          {mode === "success" && resultMsg && (
            <motion.div
              key="success-mode"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center gap-3 px-5 py-2.5 text-xs font-mono font-bold text-emerald-300"
            >
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>✓ {resultMsg.name} found · ₹{resultMsg.price}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
