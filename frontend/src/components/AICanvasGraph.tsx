"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Utensils, ShieldCheck, CheckCircle2, X } from "lucide-react";

export interface GraphNodeData {
  userQuery: string;
  matchedCount: number;
  candidates: Array<{ name: string; price: number; status: "SELECTED" | "REJECTED" | "ELIGIBLE" }>;
  finalDish: string;
  finalPrice: number;
  dctTokenId?: string;
}

export function triggerDecisionCanvasGraph(data: GraphNodeData) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("show-decision-canvas-graph", { detail: data })
    );
  }
}

export function AICanvasGraph() {
  const [data, setData] = useState<GraphNodeData | null>(null);

  useEffect(() => {
    const handleGraph = (e: Event) => {
      const customEvent = e as CustomEvent<GraphNodeData>;
      setData(customEvent.detail);
    };

    window.addEventListener("show-decision-canvas-graph", handleGraph);
    return () => window.removeEventListener("show-decision-canvas-graph", handleGraph);
  }, []);

  if (!data) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-lg pointer-events-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative w-full max-w-2xl overflow-hidden rounded-3xl border-2 border-emerald-500/60 bg-stone-900/95 text-white p-6 shadow-[0_30px_90px_rgba(0,0,0,0.9)] backdrop-blur-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-stone-800 pb-3 mb-6">
            <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-emerald-400">
              <Sparkles className="h-4 w-4 text-emerald-400" />
              <span>AI DECISION TREE CANVAS WORKSPACE</span>
            </div>
            <button
              onClick={() => setData(null)}
              className="text-stone-400 hover:text-white p-1 rounded-full hover:bg-stone-800 transition cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Node Graph Flow */}
          <div className="flex flex-col items-center gap-4 text-center font-mono">
            {/* NODE 1: User Request */}
            <div className="rounded-2xl border-2 border-emerald-500/50 bg-emerald-950/40 px-6 py-3 text-xs font-extrabold text-emerald-300 shadow-md">
              "{data.userQuery}"
            </div>

            <div className="h-6 w-0.5 bg-emerald-500/60" />

            {/* NODE 2: Matched Catalog Items */}
            <div className="rounded-xl border border-stone-700 bg-stone-800 px-4 py-2 text-xs font-bold text-stone-200">
              ┌───────────────────────┐<br />
              │ {data.matchedCount} Menu Matches Found │<br />
              └───────────────────────┘
            </div>

            <div className="h-6 w-0.5 bg-emerald-500/60" />

            {/* NODE 3: Candidate Dish Branching */}
            <div className="flex flex-wrap items-center justify-center gap-4 w-full">
              {data.candidates.map((c, idx) => (
                <div
                  key={idx}
                  className={`rounded-2xl border-2 p-3 text-xs font-bold w-44 shadow-lg ${
                    c.status === "SELECTED"
                      ? "border-emerald-400 bg-emerald-950/80 text-white"
                      : "border-stone-700 bg-stone-900/60 text-stone-400 opacity-60"
                  }`}
                >
                  <div className="truncate font-extrabold">{c.name}</div>
                  <div className="text-emerald-400 mt-0.5">₹{c.price}</div>
                  {c.status === "SELECTED" && (
                    <div className="mt-2 text-[10px] text-emerald-300 font-bold bg-emerald-900/80 px-2 py-0.5 rounded-full border border-emerald-600/50">
                      ✓ SELECTED
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="h-6 w-0.5 bg-emerald-500/60" />

            {/* NODE 4: Final Attested Decision */}
            <div className="rounded-2xl border-2 border-emerald-400 bg-emerald-950/90 px-8 py-3 text-sm font-black text-white shadow-xl flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              <span>Final Decision: {data.finalDish} (₹{data.finalPrice})</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
