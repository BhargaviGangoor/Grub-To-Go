"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, AlertTriangle, CheckCircle2, Utensils, ShieldCheck } from "lucide-react";

export interface ReplanningEventData {
  id: string;
  failedDishName: string;
  failedReason: string;
  replacementDishName: string;
  replacementPrice: number;
  replacementImage?: string;
  replanCount: number;
}

export function triggerReplanningAnimation(data: Omit<ReplanningEventData, "id">) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("start-replanning-swap", {
        detail: { ...data, id: Date.now().toString() },
      })
    );
  }
}

export function ReplanningCardSwap() {
  const [eventData, setEventData] = useState<ReplanningEventData | null>(null);
  const [stage, setStage] = useState<"OUT_OF_STOCK" | "REPLANNING" | "AVAILABLE" | "DONE">("OUT_OF_STOCK");

  useEffect(() => {
    const handleSwap = (e: Event) => {
      const customEvent = e as CustomEvent<ReplanningEventData>;
      setEventData(customEvent.detail);
      setStage("OUT_OF_STOCK");

      // Timeline sequence
      const t1 = setTimeout(() => setStage("REPLANNING"), 1200);
      const t2 = setTimeout(() => setStage("AVAILABLE"), 2600);
      const t3 = setTimeout(() => {
        setStage("DONE");
        setEventData(null);
      }, 7000);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    };

    window.addEventListener("start-replanning-swap", handleSwap);
    return () => window.removeEventListener("start-replanning-swap", handleSwap);
  }, []);

  if (!eventData || stage === "DONE") return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md pointer-events-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative w-full max-w-lg overflow-hidden rounded-3xl border-2 border-amber-500/50 bg-stone-900/95 text-white p-6 shadow-[0_30px_70px_rgba(0,0,0,0.8)] backdrop-blur-2xl"
        >
          {/* Header Banner */}
          <div className="flex items-center justify-between border-b border-stone-800 pb-3">
            <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-amber-400">
              <RefreshCw className="h-4 w-4 animate-spin text-amber-400" />
              <span>Autonomous Replanning Adaptor (Attempt #{eventData.replanCount})</span>
            </div>
            <span className="text-[10px] font-mono bg-amber-950/80 text-amber-300 border border-amber-700/50 px-2 py-0.5 rounded-full">
              LIVE AGENT ADAPTATION
            </span>
          </div>

          <div className="relative mt-6 h-52 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {/* STAGE 1: FAILED DISH OUT OF STOCK */}
              {(stage === "OUT_OF_STOCK" || stage === "REPLANNING") && (
                <motion.div
                  key="failed-card"
                  initial={{ x: 0, opacity: 1 }}
                  animate={
                    stage === "REPLANNING"
                      ? { x: -280, opacity: 0, scale: 0.8, rotate: -10 }
                      : { x: 0, opacity: 1 }
                  }
                  transition={{ duration: 0.7, ease: "easeInOut" }}
                  className="absolute inset-x-0 mx-auto w-full max-w-md rounded-2xl border-2 border-red-500/60 bg-red-950/40 p-4 shadow-xl text-center backdrop-blur-md"
                >
                  <div className="flex items-center justify-center gap-2 text-red-400 font-extrabold text-sm uppercase font-mono">
                    <AlertTriangle className="h-5 w-5 text-red-400 animate-bounce" />
                    <span>OUT OF STOCK / CONSTRAINT VIOLATION</span>
                  </div>
                  <h4 className="mt-2 text-xl font-black text-white">
                    {eventData.failedDishName}
                  </h4>
                  <p className="mt-1 text-xs text-red-300 font-mono">
                    {eventData.failedReason || "Stockout detected by InventoryTool"}
                  </p>
                  <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-red-400 bg-red-900/60 px-3 py-1 rounded-full border border-red-700/50">
                    <span>✗ Rejected by AgentPolicyGate</span>
                  </div>
                </motion.div>
              )}

              {/* REPLANNING BADGE */}
              {stage === "REPLANNING" && (
                <motion.div
                  key="replanning-indicator"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1.1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="z-10 flex flex-col items-center gap-2 text-amber-400 font-mono font-bold"
                >
                  <RefreshCw className="h-10 w-10 animate-spin text-amber-400" />
                  <span className="text-sm tracking-wider uppercase">↻ Re-evaluating menu candidates...</span>
                </motion.div>
              )}

              {/* STAGE 2: REPLACEMENT DISH AVAILABLE */}
              {stage === "AVAILABLE" && (
                <motion.div
                  key="replacement-card"
                  initial={{ x: 280, opacity: 0, scale: 0.8, rotate: 10 }}
                  animate={{ x: 0, opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  className="absolute inset-x-0 mx-auto w-full max-w-md rounded-2xl border-2 border-emerald-500/60 bg-emerald-950/50 p-4 shadow-2xl text-center backdrop-blur-md"
                >
                  <div className="flex items-center justify-center gap-2 text-emerald-400 font-extrabold text-sm uppercase font-mono">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    <span>REPLACEMENT CANDIDATE VERIFIED</span>
                  </div>
                  <h4 className="mt-2 text-2xl font-black text-white">
                    {eventData.replacementDishName}
                  </h4>
                  <p className="mt-0.5 text-lg font-black text-emerald-400">
                    ₹{eventData.replacementPrice}
                  </p>
                  <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300 bg-emerald-900/60 px-3 py-1 rounded-full border border-emerald-700/50">
                    <span>✓ AVAILABLE & Hard Constraints Passed</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer Summary */}
          <div className="mt-4 border-t border-stone-800 pt-3 text-center text-xs text-stone-400 font-mono">
            <span>PlannerAgent seamlessly adapted without breaching user budget or dietary rules!</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
