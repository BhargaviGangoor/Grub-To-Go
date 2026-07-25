"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Utensils } from "lucide-react";
import { triggerDecisionToast } from "@/components/OrderSuccessToast";

export interface AgentStepPayload {
  stepIndex?: number;
  action?: string;
  thought?: string;
  tool?: string;
  result?: string;
  title?: string;
  detail?: string;
}

export interface AutomationPayload {
  steps?: AgentStepPayload[];
  dishName?: string;
  price?: number;
  imageUrl?: string;
  dctTokenId?: string;
  orderId?: string;
  dietary?: string[];
}

export interface DisplayStep {
  title: string;
  detail: string;
  targetScreen?: string;
  targetQuery?: string;    // DOM query selector e.g. [data-dish-name="Ratatouille"]
  fallbackX: number;
  fallbackY: number;
  actionLabel: string;
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
  const [cursorPos, setCursorPos] = useState({ x: 800, y: 700 });
  const [clickRipple, setClickRipple] = useState<{ x: number; y: number; id: number } | null>(null);
  const [statusText, setStatusText] = useState("");
  const [activeSteps, setActiveSteps] = useState<DisplayStep[]>([]);

  useEffect(() => {
    const handleStart = (e: Event) => {
      const customEvent = e as CustomEvent<AutomationPayload>;
      const detail = customEvent.detail || {};

      const dishName = detail.dishName || "Selected Bistro Dish";
      const price = detail.price ? `₹${detail.price}` : "";

      // Construct dynamic interactive steps targeting real DOM elements
      const stepsToRun: DisplayStep[] = [
        {
          title: "🎯 Step 1: Intent & Constraint Extraction",
          detail: "Parsed user input: ORDER_FOOD (Budget & Dietary constraints frozen)",
          targetScreen: "assistant",
          fallbackX: 78,
          fallbackY: 80,
          actionLabel: "Analyzing natural language intent...",
        },
        {
          title: `🔍 Step 2: Menu Catalog Search`,
          detail: `Searching 28-dish catalog for top match: ${dishName}`,
          targetScreen: "menu",
          fallbackX: 46,
          fallbackY: 6,
          actionLabel: "Navigating to MENU catalog...",
        },
        {
          title: `🍽️ Step 3: Target & Select Dish (${dishName})`,
          detail: `Targeted candidate card: ${dishName} (${price})`,
          targetScreen: "menu",
          targetQuery: `[data-dish-name="${dishName}"]`,
          fallbackX: 35,
          fallbackY: 45,
          actionLabel: `Selecting dish: ${dishName}...`,
        },
        {
          title: `📦 Step 4: Live Inventory & Pantry Audit`,
          detail: `Verifying pantry stock & dietary rules for ${dishName}`,
          targetScreen: "menu",
          targetQuery: `[data-dish-name="${dishName}"]`,
          fallbackX: 62,
          fallbackY: 48,
          actionLabel: `Auditing stock for ${dishName}...`,
        },
        {
          title: `🛡️ Step 5: GB-DCT Token Attestation`,
          detail: detail.dctTokenId ? `Generated Token Hash: ${detail.dctTokenId}` : "Attesting GB-DCT token lease",
          targetScreen: "research",
          fallbackX: 50,
          fallbackY: 55,
          actionLabel: "Navigating to RESEARCH & signing GB-DCT token...",
        },
        {
          title: `🛒 Step 6: Order Execution & Confirmation`,
          detail: detail.orderId ? `Persisted Order #${detail.orderId.slice(-6)} to MongoDB` : "Order created",
          targetScreen: "menu",
          fallbackX: 50,
          fallbackY: 50,
          actionLabel: "Persisting order ticket to database...",
        },
      ];

      setActiveSteps(stepsToRun);
      setIsActive(true);
      setCurrentStep(0);

      // Execute sequence
      runStepSequence(stepsToRun, 0, detail);
    };

    window.addEventListener("start-agent-automation", handleStart);
    return () => window.removeEventListener("start-agent-automation", handleStart);
  }, [onNavigateScreen]);

  const runStepSequence = (steps: DisplayStep[], stepIndex: number, detail: AutomationPayload) => {
    if (stepIndex >= steps.length) {
      // Completed sequence — trigger centered success toast!
      setTimeout(() => {
        setIsActive(false);

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
      }, 400);
      return;
    }

    const step = steps[stepIndex];
    setCurrentStep(stepIndex);
    setStatusText(step.actionLabel);

    // 1. Switch Screen Tab if required by step
    if (step.targetScreen && onNavigateScreen) {
      onNavigateScreen(step.targetScreen);
    }

    // 2. Query actual DOM element or fallback to percentage position
    setTimeout(() => {
      let targetX = (window.innerWidth * step.fallbackX) / 100;
      let targetY = (window.innerHeight * step.fallbackY) / 100;

      if (step.targetQuery) {
        const el = document.querySelector(step.targetQuery);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          const rect = el.getBoundingClientRect();
          targetX = rect.left + rect.width / 2;
          targetY = rect.top + rect.height / 2;

          // Highlight target DOM card with glowing ring
          el.classList.add("ring-4", "ring-emerald-400", "shadow-[0_0_30px_rgba(16,185,129,0.8)]");
          setTimeout(() => {
            el.classList.remove("ring-4", "ring-emerald-400", "shadow-[0_0_30px_rgba(16,185,129,0.8)]");
          }, 2000);
        }
      }

      // 3. Move cursor to calculated pixel coordinates
      setCursorPos({ x: targetX, y: targetY });

      // 4. Trigger Click & Pause for high visibility
      setTimeout(() => {
        setClickRipple({ x: targetX, y: targetY, id: Date.now() });

        setTimeout(() => {
          runStepSequence(steps, stepIndex + 1, detail);
        }, 1200);
      }, 700);
    }, 300);
  };

  if (!isActive) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-emerald-950/40 backdrop-blur-[1.5px]"
      />

      {/* Top Banner */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute top-4 left-1/2 -translate-x-1/2 bg-stone-900/95 text-white border-2 border-emerald-500/60 px-6 py-3 rounded-full shadow-[0_10px_35px_rgba(0,0,0,0.5)] flex items-center gap-3.5 backdrop-blur-xl z-50 text-xs font-mono"
      >
        <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
        <Sparkles className="w-4 h-4 text-emerald-400" />
        <span className="font-extrabold text-emerald-300">PlannerAgent Active</span>
        <span className="text-stone-500">|</span>
        <span className="text-stone-200 font-semibold">{statusText}</span>
      </motion.div>

      {/* Click Ripple Effect */}
      <AnimatePresence>
        {clickRipple && (
          <motion.div
            key={clickRipple.id}
            initial={{ scale: 0.2, opacity: 0.95 }}
            animate={{ scale: 3, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{ left: clickRipple.x - 24, top: clickRipple.y - 24 }}
            className="absolute w-12 h-12 rounded-full border-2 border-emerald-400 bg-emerald-400/30 shadow-[0_0_30px_rgba(52,211,153,0.9)] z-40"
          />
        )}
      </AnimatePresence>

      {/* Moving Agent Ghost Cursor Pointer */}
      <motion.div
        animate={{ x: cursorPos.x, y: cursorPos.y }}
        transition={{
          type: "spring",
          stiffness: 90,
          damping: 15,
          mass: 0.9,
        }}
        className="absolute top-0 left-0 flex items-start gap-3 -ml-3 -mt-3 drop-shadow-[0_15px_30px_rgba(0,0,0,0.7)] z-50"
      >
        {/* Custom SVG Bot Cursor Pointer */}
        <div className="relative">
          <svg
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            className="text-emerald-400 transform -rotate-12 filter drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]"
          >
            <path
              d="M3 3l7 18 3-7 7-3L3 3z"
              fill="currentColor"
              stroke="#064e3b"
              strokeWidth="1.8"
            />
          </svg>
          <span className="absolute -top-2 -right-2 text-lg animate-bounce">🤖</span>
        </div>

        {/* Floating Tooltip attached to Cursor */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-stone-900 via-emerald-950 to-stone-900 text-white border-2 border-emerald-500/70 rounded-2xl px-4 py-3 shadow-[0_15px_40px_rgba(0,0,0,0.6)] max-w-sm text-xs font-sans backdrop-blur-xl"
        >
          <div className="flex items-center justify-between gap-2 border-b border-emerald-800/60 pb-1.5 font-bold text-emerald-400 text-[11px] uppercase tracking-wider">
            <span className="flex items-center gap-1">
              <Utensils className="w-3.5 h-3.5 text-emerald-400" />
              Autonomous Action Step {currentStep + 1} of {activeSteps.length}
            </span>
          </div>
          <div className="font-black text-stone-100 text-sm mt-1.5">
            {activeSteps[currentStep]?.title}
          </div>
          <div className="text-[11px] text-stone-300 font-mono mt-1 leading-snug">
            {activeSteps[currentStep]?.detail}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
