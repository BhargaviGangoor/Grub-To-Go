"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, CheckCircle2, Search, PackageCheck, ShieldCheck, ShoppingCart } from "lucide-react";

export interface AutomationStep {
  title: string;
  detail: string;
  targetSelector?: string; // CSS selector or coordinates descriptor
  targetScreen?: string;   // Screen to navigate to (home, menu, dashboard, research, etc.)
  xPercent: number;        // Screen X % (0 to 100)
  yPercent: number;        // Screen Y % (0 to 100)
  actionLabel: string;
}

export function triggerAgentAutomation(steps?: Partial<AutomationStep>[]) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("start-agent-automation", { detail: { steps } })
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

  const defaultSteps: AutomationStep[] = [
    {
      title: "🎯 Intent & Constraint Extraction",
      detail: "Parsed user input: ORDER_FOOD (Budget: ₹300, Vegetarian, Spicy)",
      xPercent: 75,
      yPercent: 85,
      actionLabel: "Analyzing natural language intent...",
    },
    {
      title: "🔍 Menu Catalog Query",
      detail: "Searching MongoDB menu items matching constraints...",
      targetScreen: "menu",
      xPercent: 42,
      yPercent: 3,
      actionLabel: "Navigating to MENU catalog...",
    },
    {
      title: "📦 Live Inventory & Dietary Audit",
      detail: "Verifying pantry stock & dietary rules for candidate dish...",
      targetScreen: "dashboard",
      xPercent: 52,
      yPercent: 3,
      actionLabel: "Inspecting live Pantry State & telemetry...",
    },
    {
      title: "🎟️ GB-DCT Token Lease Generation",
      detail: "Creating Generation-Bound Dynamic Commitment Token...",
      targetScreen: "research",
      xPercent: 62,
      yPercent: 3,
      actionLabel: "Attesting GB-DCT cryptographic lease...",
    },
    {
      title: "🛒 Finalizing Order & Ticket",
      detail: "Persisting simulated order to database...",
      targetScreen: "home",
      xPercent: 92,
      yPercent: 92,
      actionLabel: "Executing order & returning response!",
    },
  ];

  useEffect(() => {
    const handleStart = (e: Event) => {
      const customEvent = e as CustomEvent;
      const customSteps = customEvent.detail?.steps || defaultSteps;

      setIsActive(true);
      setCurrentStep(0);

      // Start sequence
      runStepSequence(customSteps, 0);
    };

    window.addEventListener("start-agent-automation", handleStart);
    return () => window.removeEventListener("start-agent-automation", handleStart);
  }, [onNavigateScreen]);

  const runStepSequence = (steps: AutomationStep[], stepIndex: number) => {
    if (stepIndex >= steps.length) {
      // Completed sequence
      setTimeout(() => {
        setIsActive(false);
      }, 1000);
      return;
    }

    const step = steps[stepIndex];
    setCurrentStep(stepIndex);
    setStatusText(step.actionLabel);

    // Calculate window pixel positions
    const targetX = (window.innerWidth * step.xPercent) / 100;
    const targetY = (window.innerHeight * step.yPercent) / 100;

    // 1. Move cursor to target
    setCursorPos({ x: targetX, y: targetY });

    // 2. Trigger click & navigation after arrival animation delay
    setTimeout(() => {
      // Click ripple
      setClickRipple({ x: targetX, y: targetY, id: Date.now() });

      // Navigate tab if specified
      if (step.targetScreen && onNavigateScreen) {
        onNavigateScreen(step.targetScreen);
      }

      // Proceed to next step after pause
      setTimeout(() => {
        runStepSequence(steps, stepIndex + 1);
      }, 1400);
    }, 900);
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
        className="absolute top-3 left-1/2 -translate-x-1/2 bg-stone-900/90 text-white border border-emerald-500/40 px-4 py-2 rounded-full shadow-2xl flex items-center gap-2.5 backdrop-blur-md z-50 text-xs font-mono"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
        <Sparkles className="w-4 h-4 text-emerald-400" />
        <span className="font-semibold text-emerald-300">PlannerAgent Operating</span>
        <span className="text-stone-400">|</span>
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
          stiffness: 120,
          damping: 18,
          mass: 0.8,
        }}
        className="absolute top-0 left-0 flex items-start gap-2 -ml-2 -mt-2 drop-shadow-[0_10px_25px_rgba(0,0,0,0.5)] z-50"
      >
        {/* Custom SVG Bot Cursor Pointer */}
        <div className="relative">
          <svg
            width="28"
            height="28"
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
          <span className="absolute -top-1 -right-1 text-sm animate-bounce">🤖</span>
        </div>

        {/* Floating Tooltip attached to Cursor */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-stone-900 via-emerald-950 to-stone-900 text-white border border-emerald-500/50 rounded-xl px-3 py-2 shadow-2xl max-w-xs text-xs font-sans backdrop-blur-md"
        >
          <div className="flex items-center gap-1.5 font-bold text-emerald-400 text-[11px] uppercase tracking-wider">
            <span>Step {currentStep + 1} of {defaultSteps.length}</span>
          </div>
          <div className="font-medium text-stone-100 text-xs mt-0.5">
            {defaultSteps[currentStep]?.title}
          </div>
          <div className="text-[10px] text-stone-300 font-mono mt-1 border-t border-emerald-800/40 pt-1">
            {defaultSteps[currentStep]?.detail}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
