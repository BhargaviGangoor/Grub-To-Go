"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, CheckCircle2, ShieldCheck, Utensils } from "lucide-react";
import { triggerDecisionToast } from "@/components/OrderSuccessToast";

export interface AutomationStep {
  title: string;
  detail: string;
  targetScreen?: string;   // Screen to navigate to (home, menu, dashboard, research, etc.)
  xPercent: number;        // Screen X % (0 to 100)
  yPercent: number;        // Screen Y % (0 to 100)
  actionLabel: string;
}

export interface AutomationPayload {
  steps?: Partial<AutomationStep>[];
  dishName?: string;
  price?: number;
  imageUrl?: string;
  dctTokenId?: string;
  orderId?: string;
  dietary?: string[];
}

export function triggerAgentAutomation(payload?: AutomationPayload) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("start-agent-automation", { detail: payload || {} })
    );
  }
}

export function AgentGhostOverlay({
  onNavigateScreen,
}: {
  onNavigateScreen?: (screen: string) => void;
}) {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [cursorPos, setCursorPos] = useState({ x: 500, y: 500 });
  const [clickRipple, setClickRipple] = useState<{ x: number; y: number; id: number } | null>(null);
  const [statusText, setStatusText] = useState("");
  const [highlightDish, setHighlightDish] = useState<string | null>(null);
  const [activeSteps, setActiveSteps] = useState<AutomationStep[]>([]);

  useEffect(() => {
    const handleStart = (e: Event) => {
      const customEvent = e as CustomEvent<AutomationPayload>;
      const detail = customEvent.detail || {};

      const dishName = detail.dishName || "Selected Menu Item";
      const price = detail.price ? `₹${detail.price}` : "";

      // Construct dynamic interactive steps targeting dish & menu
      const interactiveSteps: AutomationStep[] = [
        {
          title: "🎯 Intent & Constraint Analysis",
          detail: `Parsed user request: ORDER_FOOD constraint rules`,
          xPercent: 75,
          yPercent: 80,
          actionLabel: "Extracting goal & freezing authorization...",
        },
        {
          title: `🔍 Menu Search & Selection: ${dishName}`,
          detail: `Filtered catalog & selected top candidate: ${dishName} ${price}`,
          targetScreen: "menu",
          xPercent: 45,
          yPercent: 45,
          actionLabel: `Navigating to MENU & targeting candidate: ${dishName}...`,
        },
        {
          title: `📦 Inventory & Dietary Audit`,
          detail: `Audited pantry stock & verified rules for: ${dishName}`,
          targetScreen: "menu",
          xPercent: 48,
          yPercent: 50,
          actionLabel: `Verifying live stock & dietary rules for ${dishName}...`,
        },
        {
          title: `🛡️ GB-DCT Token Signing`,
          detail: detail.dctTokenId
            ? `Generated commitment token: ${detail.dctTokenId}`
            : "Attesting dynamic commitment token...",
          targetScreen: "menu",
          xPercent: 52,
          yPercent: 52,
          actionLabel: `Signing cryptographic GB-DCT token...`,
        },
        {
          title: `🛒 Order Ticket Persistence`,
          detail: detail.orderId
            ? `Order #${detail.orderId.slice(-6)} created & persisted to MongoDB`
            : "Persisting order to MongoDB...",
          targetScreen: "menu",
          xPercent: 50,
          yPercent: 50,
          actionLabel: `Finalizing simulated order execution...`,
        },
      ];

      setActiveSteps(interactiveSteps);
      setHighlightDish(detail.dishName || null);
      setIsActive(true);
      setCurrentStep(0);

      // Start sequence
      runStepSequence(interactiveSteps, 0, detail);
    };

    window.addEventListener("start-agent-automation", handleStart);
    return () => window.removeEventListener("start-agent-automation", handleStart);
  }, [onNavigateScreen]);

  const runStepSequence = (steps: AutomationStep[], stepIndex: number, detail: AutomationPayload) => {
    if (stepIndex >= steps.length) {
      // Completed sequence
      setTimeout(() => {
        setIsActive(false);

        // Trigger beautiful success toast pop-up if order/dish detail is present!
        if (detail.dishName && detail.price) {
          triggerDecisionToast({
            dishName: detail.dishName,
            price: detail.price,
            imageUrl: detail.imageUrl,
            dctTokenId: detail.dctTokenId,
            orderId: detail.orderId,
            dietary: detail.dietary,
          });
        }
      }, 600);
      return;
    }

    const step = steps[stepIndex];
    setCurrentStep(stepIndex);
    setStatusText(step.actionLabel);

    // Navigate screen tab if specified
    if (step.targetScreen && onNavigateScreen) {
      onNavigateScreen(step.targetScreen);
    }

    // Calculate window pixel positions
    const targetX = (window.innerWidth * step.xPercent) / 100;
    const targetY = (window.innerHeight * step.yPercent) / 100;

    // Move cursor to target
    setCursorPos({ x: targetX, y: targetY });

    // Trigger click & action after arrival animation delay
    setTimeout(() => {
      setClickRipple({ x: targetX, y: targetY, id: Date.now() });

      // Proceed to next step
      setTimeout(() => {
        runStepSequence(steps, stepIndex + 1, detail);
      }, 1000);
    }, 700);
  };

  if (!isActive) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {/* Dimmed backdrop overlay highlighting agent activity */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-emerald-950/40 backdrop-blur-[1px]"
      />

      {/* Top Banner indicating Agent Mode */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute top-4 left-1/2 -translate-x-1/2 bg-stone-900/95 text-white border border-emerald-500/50 px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-3 backdrop-blur-md z-50 text-xs font-mono"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
        <Sparkles className="w-4 h-4 text-emerald-400" />
        <span className="font-bold text-emerald-300">PlannerAgent Active</span>
        <span className="text-stone-500">|</span>
        <span className="text-stone-200">{statusText}</span>
      </motion.div>

      {/* Click Ripple Effect */}
      <AnimatePresence>
        {clickRipple && (
          <motion.div
            key={clickRipple.id}
            initial={{ scale: 0.2, opacity: 0.9 }}
            animate={{ scale: 2.5, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{ left: clickRipple.x - 24, top: clickRipple.y - 24 }}
            className="absolute w-12 h-12 rounded-full border-2 border-emerald-400 bg-emerald-500/20 shadow-[0_0_20px_rgba(52,211,153,0.8)]"
          />
        )}
      </AnimatePresence>

      {/* Moving Agent Ghost Cursor Pointer */}
      <motion.div
        animate={{ x: cursorPos.x, y: cursorPos.y }}
        transition={{
          type: "spring",
          stiffness: 140,
          damping: 18,
          mass: 0.7,
        }}
        className="absolute top-0 left-0 flex items-start gap-2 -ml-2 -mt-2 drop-shadow-[0_10px_25px_rgba(0,0,0,0.5)] z-50"
      >
        {/* Custom SVG Bot Cursor Pointer */}
        <div className="relative">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            className="text-emerald-400 transform -rotate-12 filter drop-shadow-md"
          >
            <path
              d="M3 3l7 18 3-7 7-3L3 3z"
              fill="currentColor"
              stroke="#064e3b"
              strokeWidth="1.5"
            />
          </svg>
          <span className="absolute -top-1 -right-1 text-base animate-bounce">🤖</span>
        </div>

        {/* Floating Tooltip attached to Cursor */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-stone-900 via-emerald-950 to-stone-900 text-white border border-emerald-500/60 rounded-2xl px-3.5 py-2.5 shadow-2xl max-w-xs text-xs font-sans backdrop-blur-md"
        >
          <div className="flex items-center gap-1.5 font-bold text-emerald-400 text-[11px] uppercase tracking-wider">
            <Utensils className="w-3.5 h-3.5" />
            <span>Step {currentStep + 1} of {activeSteps.length}</span>
          </div>
          <div className="font-bold text-stone-100 text-xs mt-0.5">
            {activeSteps[currentStep]?.title}
          </div>
          <div className="text-[10px] text-stone-300 font-mono mt-1 border-t border-emerald-800/40 pt-1">
            {activeSteps[currentStep]?.detail}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
