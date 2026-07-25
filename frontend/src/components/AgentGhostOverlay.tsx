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
  xPercent: number;
  yPercent: number;
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
  const [cursorPos, setCursorPos] = useState({ x: 500, y: 500 });
  const [clickRipple, setClickRipple] = useState<{ x: number; y: number; id: number } | null>(null);
  const [statusText, setStatusText] = useState("");
  const [activeSteps, setActiveSteps] = useState<DisplayStep[]>([]);

  useEffect(() => {
    const handleStart = (e: Event) => {
      const customEvent = e as CustomEvent<AutomationPayload>;
      const detail = customEvent.detail || {};

      const dishName = detail.dishName || "Selected Bistro Dish";
      const price = detail.price ? `₹${detail.price}` : "";
      const rawAgentSteps = detail.steps || [];

      let displaySteps: DisplayStep[] = [];

      if (rawAgentSteps.length > 0) {
        // Map actual PlannerAgent trajectory steps to screen actions!
        displaySteps = rawAgentSteps.map((step, idx) => {
          const actionName = step.action || step.tool || "REASONING";
          const desc = step.thought || step.detail || step.result || "Processing step...";

          if (actionName.includes("SEARCH_MENU") || actionName.includes("MENU")) {
            return {
              title: `🔍 Step ${idx + 1}: ${step.title || "SEARCH_MENU"}`,
              detail: `Filtering catalog & ranking candidate: ${dishName} ${price}`,
              targetScreen: "menu",
              xPercent: 45,
              yPercent: 40,
              actionLabel: `Navigating to MENU catalog & highlighting ${dishName}...`,
            };
          }

          if (actionName.includes("CHECK_INVENTORY") || actionName.includes("INVENTORY")) {
            return {
              title: `📦 Step ${idx + 1}: ${step.title || "CHECK_INVENTORY"}`,
              detail: `Auditing stock & ingredient safety for ${dishName}`,
              targetScreen: "menu",
              xPercent: 48,
              yPercent: 48,
              actionLabel: `Auditing live Pantry stock for ${dishName}...`,
            };
          }

          if (actionName.includes("GENERATE_DCT") || actionName.includes("VALIDATE_DCT")) {
            return {
              title: `🛡️ Step ${idx + 1}: ${step.title || "GB-DCT TOKEN"}`,
              detail: detail.dctTokenId
                ? `Signed commitment token: ${detail.dctTokenId}`
                : "Attesting dynamic commitment token...",
              targetScreen: "menu",
              xPercent: 52,
              yPercent: 52,
              actionLabel: `Attesting GB-DCT cryptographic lease...`,
            };
          }

          if (actionName.includes("CREATE_ORDER") || actionName.includes("ORDER")) {
            return {
              title: `🛒 Step ${idx + 1}: ${step.title || "CREATE_ORDER"}`,
              detail: detail.orderId
                ? `Persisted order #${detail.orderId.slice(-6)} to MongoDB`
                : "Finalizing simulated order execution...",
              targetScreen: "menu",
              xPercent: 50,
              yPercent: 50,
              actionLabel: `Persisting order ticket to database...`,
            };
          }

          return {
            title: `🎯 Step ${idx + 1}: ${step.title || actionName}`,
            detail: desc.slice(0, 70),
            xPercent: 75,
            yPercent: 75,
            actionLabel: `Executing ${actionName}...`,
          };
        });
      } else {
        // Fallback step sequence if no agentSteps provided
        displaySteps = [
          {
            title: "🎯 Step 1: Intent & Constraint Extraction",
            detail: "Parsed user input: ORDER_FOOD",
            xPercent: 75,
            yPercent: 80,
            actionLabel: "Analyzing natural language intent...",
          },
          {
            title: `🔍 Step 2: Menu Selection (${dishName})`,
            detail: `Selected candidate dish: ${dishName} ${price}`,
            targetScreen: "menu",
            xPercent: 45,
            yPercent: 40,
            actionLabel: `Navigating to MENU & targeting: ${dishName}...`,
          },
          {
            title: `📦 Step 3: Live Inventory Audit`,
            detail: `Auditing ingredients for ${dishName}`,
            targetScreen: "menu",
            xPercent: 48,
            yPercent: 48,
            actionLabel: `Verifying live stock for ${dishName}...`,
          },
          {
            title: `🛡️ Step 4: GB-DCT Token Signing`,
            detail: detail.dctTokenId ? `Token: ${detail.dctTokenId}` : "Attesting GB-DCT lease",
            targetScreen: "menu",
            xPercent: 52,
            yPercent: 52,
            actionLabel: `Signing cryptographic token...`,
          },
          {
            title: `🛒 Step 5: Order Ticket Creation`,
            detail: detail.orderId ? `Order #${detail.orderId.slice(-6)} saved` : "Order created",
            targetScreen: "menu",
            xPercent: 50,
            yPercent: 50,
            actionLabel: `Persisting order to MongoDB...`,
          },
        ];
      }

      setActiveSteps(displaySteps);
      setIsActive(true);
      setCurrentStep(0);

      // Start sequence
      runStepSequence(displaySteps, 0, detail);
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
      }, 500);
      return;
    }

    const step = steps[stepIndex];
    setCurrentStep(stepIndex);
    setStatusText(step.actionLabel);

    // Navigate tab if specified
    if (step.targetScreen && onNavigateScreen) {
      onNavigateScreen(step.targetScreen);
    }

    // Calculate window pixel positions
    const targetX = (window.innerWidth * step.xPercent) / 100;
    const targetY = (window.innerHeight * step.yPercent) / 100;

    // Move cursor to target
    setCursorPos({ x: targetX, y: targetY });

    // Trigger click ripple after movement
    setTimeout(() => {
      setClickRipple({ x: targetX, y: targetY, id: Date.now() });

      // Proceed to next step after brief pause
      setTimeout(() => {
        runStepSequence(steps, stepIndex + 1, detail);
      }, 900);
    }, 600);
  };

  if (!isActive) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-emerald-950/40 backdrop-blur-[1px]"
      />

      {/* Top Banner */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute top-4 left-1/2 -translate-x-1/2 bg-stone-900/95 text-white border border-emerald-500/50 px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-3 backdrop-blur-md z-50 text-xs font-mono"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
        <Sparkles className="w-4 h-4 text-emerald-400" />
        <span className="font-bold text-emerald-300">PlannerAgent Operating</span>
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
            transition={{ duration: 0.5, ease: "easeOut" }}
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
