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

      // Auto dismiss after 8 seconds
      const timer = setTimeout(() => {
        setToast((prev) => (prev?.id === customEvent.detail.id ? null : prev));
      }, 8000);

      return () => clearTimeout(timer);
    };

    window.addEventListener("show-decision-toast", handleToast);
    return () => window.removeEventListener("show-decision-toast", handleToast);
  }, []);

  if (!toast) return null;

  return (
    <AnimatePresence>
      <motion.div
        key={toast.id}
        initial={{ opacity: 0, y: -60, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -40, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="fixed top-6 right-6 z-50 w-full max-w-md pointer-events-auto"
      >
        <div className="relative overflow-hidden rounded-2xl border-2 border-emerald-500/40 bg-stone-900/95 text-white p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl">
          {/* Ambient Glow */}
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-500/20 blur-2xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={() => setToast(null)}
            className="absolute top-3.5 right-3.5 text-stone-400 hover:text-white p-1 rounded-full hover:bg-stone-800 transition"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Header Badge */}
          <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-emerald-400 uppercase">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <Sparkles className="h-4 w-4 text-emerald-400" />
            <span>Autonomous Decision Confirmed</span>
          </div>

          {/* Body content */}
          <div className="mt-3 flex items-start gap-4">
            {toast.imageUrl ? (
              <img
                src={toast.imageUrl}
                alt={toast.dishName}
                className="h-16 w-16 rounded-xl object-cover border border-emerald-500/30 shadow-md shrink-0"
              />
            ) : (
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-emerald-950 border border-emerald-500/30 text-emerald-400">
                <Utensils className="h-7 w-7" />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-extrabold text-white truncate">
                {toast.dishName}
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-emerald-400 font-extrabold text-base">
                  ₹{toast.price}
                </span>
                {toast.dietary && toast.dietary.length > 0 && (
                  <span className="text-[10px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-700/50 px-2 py-0.5 rounded-full">
                    {toast.dietary.join(", ")}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Token & Order Metadata */}
          <div className="mt-4 space-y-2 border-t border-stone-800 pt-3 text-xs font-mono">
            {toast.dctTokenId && (
              <div className="flex items-center justify-between text-stone-300">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>GB-DCT Token:</span>
                </span>
                <span className="font-bold text-emerald-300 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-800/40">
                  {toast.dctTokenId}
                </span>
              </div>
            )}

            {toast.orderId && (
              <div className="flex items-center justify-between text-stone-300">
                <span className="flex items-center gap-1.5 text-amber-400">
                  <Receipt className="h-3.5 w-3.5" />
                  <span>Order Ticket:</span>
                </span>
                <span className="font-bold text-amber-300 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/40">
                  #{toast.orderId.slice(-8)}
                </span>
              </div>
            )}
          </div>

          {/* Success Banner Footer */}
          <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/60 p-2 rounded-xl border border-emerald-800/40">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>Simulated order created & persisted to MongoDB!</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
