"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ShieldCheck, Sparkles, Utensils, X, Receipt } from "lucide-react";

export interface DecisionToastData {
  id: string;
  dishName: string;
  price: number;
  imageUrl?: string;
  dctTokenId?: string;
  orderId?: string;
  dietary?: string[];
  message?: string;
}

export function triggerDecisionToast(data: Omit<DecisionToastData, "id">) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("show-decision-toast", {
        detail: { ...data, id: Date.now().toString() },
      })
    );
  }
}

export function OrderSuccessToast() {
  const [toast, setToast] = useState<DecisionToastData | null>(null);

  useEffect(() => {
    const handleToast = (e: Event) => {
      const customEvent = e as CustomEvent<DecisionToastData>;
      setToast(customEvent.detail);

      // Auto dismiss after 4 seconds (as requested by user)
      const timer = setTimeout(() => {
        setToast((prev) => (prev?.id === customEvent.detail.id ? null : prev));
      }, 4000);

      return () => clearTimeout(timer);
    };

    window.addEventListener("show-decision-toast", handleToast);
    return () => window.removeEventListener("show-decision-toast", handleToast);
  }, []);

  if (!toast) return null;

  return (
    <AnimatePresence>
      {/* Dimmed backdrop to draw focus to center success message */}
      <motion.div
        key="toast-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setToast(null)}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 pointer-events-auto"
      >
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 10 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md overflow-hidden rounded-3xl border-2 border-emerald-500/50 bg-stone-900/95 text-white p-6 shadow-[0_25px_60px_rgba(0,0,0,0.7)] backdrop-blur-2xl"
        >
          {/* Ambient Glow */}
          <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-emerald-500/25 blur-3xl pointer-events-none" />
          <div className="absolute -left-12 -bottom-12 h-40 w-40 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={() => setToast(null)}
            className="absolute top-4 right-4 text-stone-400 hover:text-white p-1.5 rounded-full bg-stone-800/60 hover:bg-stone-800 transition cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Header Badge */}
          <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-emerald-400 uppercase">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
            <Sparkles className="h-4 w-4 text-emerald-400" />
            <span>Autonomous Decision Confirmed</span>
          </div>

          {/* Body content */}
          <div className="mt-4 flex items-start gap-4">
            {toast.imageUrl ? (
              <img
                src={toast.imageUrl}
                alt={toast.dishName}
                className="h-20 w-20 rounded-2xl object-cover border-2 border-emerald-500/40 shadow-lg shrink-0"
              />
            ) : (
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-emerald-950 border-2 border-emerald-500/40 text-emerald-400">
                <Utensils className="h-8 w-8" />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-black text-white leading-snug truncate">
                {toast.dishName}
              </h3>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className="text-emerald-400 font-black text-lg">
                  ₹{toast.price}
                </span>
                {toast.dietary && toast.dietary.length > 0 && (
                  <span className="text-[10px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-700/50 px-2.5 py-0.5 rounded-full">
                    {toast.dietary.join(", ")}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Token & Order Metadata */}
          <div className="mt-4 space-y-2 border-t border-stone-800/80 pt-3.5 text-xs font-mono">
            {toast.dctTokenId && (
              <div className="flex items-center justify-between text-stone-300">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <ShieldCheck className="h-4 w-4" />
                  <span>GB-DCT Token:</span>
                </span>
                <span className="font-bold text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded-md border border-emerald-700/50">
                  {toast.dctTokenId}
                </span>
              </div>
            )}

            {toast.orderId && (
              <div className="flex items-center justify-between text-stone-300">
                <span className="flex items-center gap-1.5 text-amber-400">
                  <Receipt className="h-4 w-4" />
                  <span>Order Ticket:</span>
                </span>
                <span className="font-bold text-amber-300 bg-amber-950/60 px-2.5 py-0.5 rounded-md border border-amber-700/50">
                  #{toast.orderId.slice(-8)}
                </span>
              </div>
            )}
          </div>

          {/* Success Banner Footer */}
          <div className="mt-4 flex items-center gap-2 text-xs font-bold text-emerald-300 bg-emerald-950/80 p-2.5 rounded-xl border border-emerald-700/50 justify-center text-center">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
            <span>Simulated order created & persisted to MongoDB!</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
