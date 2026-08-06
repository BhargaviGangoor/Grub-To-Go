"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Utensils } from "lucide-react";
import { triggerDecisionToast } from "@/components/OrderSuccessToast";
import { AgentUIEvent } from "@/types/AgentUIEvent";
import { useAgentEventStream } from "@/hooks/useAgentEventStream";
import { resolveDishId } from "@/lib/dishIds";

export interface AutomationPayload {
  runId?: string;
  steps?: any[];
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

const TARGETS = {
  chatInput: '[data-agent-target="chat-input"]',
  chatMessages: '[data-agent-target="chat-messages"]',
  menuGrid: '[data-agent-target="menu-grid"]',
  menuHeader: '[data-agent-target="menu-header"]',
  budgetControl: '[data-agent-target="budget-control"]',
  researchHeader: '[data-agent-target="research-header"]',
  researchLeases: '[data-agent-target="research-leases"]',
  researchValidation: '[data-agent-target="research-validation"]',
  researchDrifts: '[data-agent-target="research-drifts"]',
  navAssistant: '[data-nav-screen="assistant"]',
  navMenu: '[data-nav-screen="menu"]',
  navResearch: '[data-nav-screen="research"]',
  menuAllTab: '[data-menu-category="all"]',
};

export function AgentGhostOverlay({
  onNavigateScreen,
}: {
  onNavigateScreen?: (screen: string) => void;
}) {
  const [activeRunId, setActiveRunId] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 800, y: 700 });
  const [clickRipple, setClickRipple] = useState<{ x: number; y: number; id: number } | null>(null);
  const [statusText, setStatusText] = useState("");
  const [currentStepTitle, setCurrentStepTitle] = useState("");
  const [currentStepDetail, setCurrentStepDetail] = useState("");
  const [stepCounter, setStepCounter] = useState(0);

  const { eventQueueRef } = useAgentEventStream(activeRunId);
  const processedEventIndexRef = useRef(0);
  const isProcessingRef = useRef(false);
  const onNavigateRef = useRef(onNavigateScreen);
  onNavigateRef.current = onNavigateScreen;

  useEffect(() => {
    const handleStart = (e: Event) => {
      const customEvent = e as CustomEvent<AutomationPayload>;
      const detail = customEvent.detail || {};
      if (detail.runId) {
        setActiveRunId(detail.runId);
        setIsActive(true);
        processedEventIndexRef.current = 0;
        setStepCounter(0);
        setStatusText("Connecting to live agent stream...");
        setCurrentStepTitle("");
        setCurrentStepDetail("");
      }
    };

    window.addEventListener("start-agent-automation", handleStart);
    return () => window.removeEventListener("start-agent-automation", handleStart);
  }, []);

  useEffect(() => {
    if (!isActive) return;

    const drainQueue = async () => {
      if (isProcessingRef.current) return;
      isProcessingRef.current = true;

      try {
        while (processedEventIndexRef.current < eventQueueRef.current.length) {
          const nextEvent = eventQueueRef.current[processedEventIndexRef.current];
          processedEventIndexRef.current += 1;
          await processLiveEvent(nextEvent);
        }
      } finally {
        isProcessingRef.current = false;
        if (processedEventIndexRef.current < eventQueueRef.current.length) {
          drainQueue();
        }
      }
    };

    drainQueue();
  }, [isActive, activeRunId, eventQueueRef.current.length]);

  // Poll for new SSE events while the overlay is active
  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      if (
        !isProcessingRef.current &&
        processedEventIndexRef.current < eventQueueRef.current.length
      ) {
        const drainQueue = async () => {
          if (isProcessingRef.current) return;
          isProcessingRef.current = true;
          try {
            while (processedEventIndexRef.current < eventQueueRef.current.length) {
              const nextEvent = eventQueueRef.current[processedEventIndexRef.current];
              processedEventIndexRef.current += 1;
              await processLiveEvent(nextEvent);
            }
          } finally {
            isProcessingRef.current = false;
          }
        };
        drainQueue();
      }
    }, 200);
    return () => clearInterval(interval);
  }, [isActive]);

  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

  const waitForElement = async (selector: string, maxAttempts = 12): Promise<Element | null> => {
    for (let i = 0; i < maxAttempts; i++) {
      const el = document.querySelector(selector);
      if (el) return el;
      await delay(120);
    }
    return null;
  };

  const getElementCenter = (el: Element) => {
    const rect = el.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
  };

  const navigateAndWait = async (screen: string) => {
    onNavigateRef.current?.(screen);
    await delay(280);
    await waitForElement(`[data-screen-active="${screen}"]`, 15);
  };

  const showAllMenuDishes = () => {
    window.dispatchEvent(new CustomEvent("agent-menu-show-all"));
  };

  const moveAndClick = async (x: number, y: number, pauseMs = 500) => {
    setCursorPos({ x, y });
    await delay(380);
    setClickRipple({ x, y, id: Date.now() });
    await delay(pauseMs);
  };

  const targetSelector = async (selector: string, pauseMs = 500) => {
    const el = await waitForElement(selector);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      await delay(220);
      const { x, y } = getElementCenter(el);
      await moveAndClick(x, y, pauseMs);
      return el;
    }
    return null;
  };

  const highlightElement = (el: Element | null) => {
    if (!el) return;
    el.classList.add("ring-4", "ring-emerald-400", "shadow-[0_0_30px_rgba(16,185,129,0.8)]");
    setTimeout(() => {
      el.classList.remove("ring-4", "ring-emerald-400", "shadow-[0_0_30px_rgba(16,185,129,0.8)]");
    }, 2200);
  };

  const highlightAndTargetElement = async (selector: string, fallbackSelector?: string) => {
    showAllMenuDishes();
    await delay(180);

    let el = await waitForElement(selector);
    if (!el && fallbackSelector) {
      el = await waitForElement(fallbackSelector);
    }

    highlightElement(el);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      await delay(220);
      const { x, y } = getElementCenter(el);
      await moveAndClick(x, y, 650);
      return;
    }

    const fallback = await targetSelector(TARGETS.menuGrid, 400);
    if (!fallback) {
      await moveAndClick(window.innerWidth * 0.5, window.innerHeight * 0.45, 500);
    }
  };

  const bumpStep = (title: string, detail: string, status?: string) => {
    setStepCounter((prev) => prev + 1);
    setCurrentStepTitle(title);
    setCurrentStepDetail(detail);
    if (status) setStatusText(status);
  };

  const processLiveEvent = async (event: AgentUIEvent) => {
    switch (event.type) {
      case "AGENT_STARTED": {
        bumpStep(
          "🎯 Step 1: Goal Analysis",
          `Analyzing user goal: "${event.goal || "Order Request"}"`,
          "PlannerAgent initialized"
        );
        await navigateAndWait("assistant");
        await targetSelector(TARGETS.chatInput, 550);
        break;
      }

      case "SEARCH_MENU": {
        bumpStep(
          "🔍 Step 2: Menu Search",
          "Searching 28-dish authentic Parisian menu catalog",
          "Navigating to menu..."
        );
        await targetSelector(TARGETS.navMenu, 350);
        await navigateAndWait("menu");
        showAllMenuDishes();
        await delay(150);
        await targetSelector(TARGETS.menuHeader, 500);
        break;
      }

      case "MENU_RESULTS": {
        bumpStep(
          "📊 Candidate Pool",
          `Identified ${event.count ?? 0} semantically eligible candidates`,
          `Found ${event.count ?? 0} candidates`
        );
        showAllMenuDishes();
        await targetSelector(TARGETS.menuGrid, 450);
        break;
      }

      case "SELECT_DISH": {
        const dishName = event.dishName || "Selected Dish";
        const dishId = resolveDishId(dishName, event.dishId);
        bumpStep(
          `🍽️ Target Candidate: ${dishName}`,
          `Selected candidate: ${dishName}${event.price ? ` (₹${event.price})` : ""}`,
          `Targeting ${dishName}...`
        );
        await navigateAndWait("menu");
        showAllMenuDishes();
        await delay(200);

        const selector = dishId
          ? `[data-dish-id="${dishId}"]`
          : `[data-dish-name="${dishName}"]`;
        await highlightAndTargetElement(selector);
        break;
      }

      case "CHECK_INVENTORY": {
        const dishName = event.dishName || "Dish";
        bumpStep(
          "📦 Live Pantry Audit",
          `Verifying pantry stock & dietary rules for ${dishName}`,
          `Auditing pantry for ${dishName}...`
        );
        const dishId = resolveDishId(dishName, event.dishId);
        const dishSelector = dishId
          ? `[data-dish-id="${dishId}"]`
          : `[data-dish-name="${dishName}"]`;
        const dishEl = await waitForElement(dishSelector);
        if (dishEl) {
          highlightElement(dishEl);
          const { x, y } = getElementCenter(dishEl);
          await moveAndClick(x, y, 500);
        } else {
          await navigateAndWait("assistant");
          await targetSelector(TARGETS.budgetControl, 550);
        }
        break;
      }

      case "INVENTORY_RESULT": {
        const dishName = event.dishName || "Dish";
        if (event.available) {
          bumpStep(
            "✓ Stock Confirmed",
            `All ingredients for ${dishName} available in kitchen`,
            `Stock verified for ${dishName}`
          );
        } else {
          bumpStep(
            "✗ Stockout Detected",
            `${dishName} unavailable (${event.reasonCode || "Out of stock"}). Triggering replan...`,
            `Unavailable: ${event.reasonCode || "Out of stock"}`
          );
        }
        const dishId = resolveDishId(dishName, event.dishId);
        const selector = dishId
          ? `[data-dish-id="${dishId}"]`
          : `[data-dish-name="${dishName}"]`;
        await targetSelector(selector, 450);
        break;
      }

      case "REPLAN": {
        bumpStep(
          "↻ Autonomous Replanning",
          `Candidate rejected (${event.reasonCode || "Drift"}). Selecting alternative...`,
          "Replanning..."
        );
        await navigateAndWait("menu");
        showAllMenuDishes();
        await targetSelector(TARGETS.menuAllTab, 600);
        break;
      }

      case "GENERATE_DCT": {
        bumpStep(
          "🎟️ GB-DCT Generation",
          "Navigating to Research Lab to issue state-bound commitment token",
          "Attesting GB-DCT lease..."
        );
        await targetSelector(TARGETS.navResearch, 350);
        await navigateAndWait("research");
        await targetSelector(TARGETS.researchHeader, 600);
        break;
      }

      case "DCT_GENERATED": {
        bumpStep(
          "✓ GB-DCT Generated",
          `Cryptographic token issued: ${event.dctTokenId || "pending"}`,
          `Token: ${event.dctTokenId || "..."}`
        );
        await targetSelector(TARGETS.researchLeases, 550);
        break;
      }

      case "VALIDATE_DCT": {
        bumpStep(
          "🛡️ World State Attestation",
          `Validating token ${event.dctTokenId || ""} against zero-drift policy`,
          "Attesting world state..."
        );
        await targetSelector(TARGETS.researchValidation, 550);
        break;
      }

      case "DCT_VALID": {
        bumpStep(
          "✓ State Validated",
          "State verified: 0 price, stock, or dietary drift detected",
          "State Attest: 0 Drift"
        );
        await targetSelector(TARGETS.researchDrifts, 550);
        break;
      }

      case "CREATE_ORDER": {
        bumpStep(
          "🛒 Order Execution",
          "Creating order ticket in database",
          "Persisting order ticket..."
        );
        await navigateAndWait("assistant");
        await targetSelector(TARGETS.chatMessages, 600);
        break;
      }

      case "ORDER_CREATED": {
        bumpStep(
          "🎉 Order Confirmed",
          `Persisted order #${event.orderId || ""} to MongoDB`,
          `Order #${event.orderId?.slice(-6) || ""} Confirmed`
        );
        await targetSelector(TARGETS.chatMessages, 650);
        break;
      }

      case "AGENT_COMPLETED": {
        bumpStep(
          "🎉 Order Complete",
          `Autonomous pipeline succeeded for ${event.dishName || "your order"}`,
          "Goal Accomplished!"
        );
        await navigateAndWait("assistant");
        await targetSelector(TARGETS.chatMessages, 700);

        setIsActive(false);
        if (event.dishName && event.price) {
          triggerDecisionToast({
            dishName: event.dishName,
            price: event.price,
            imageUrl: event.imageUrl,
            dctTokenId: event.dctTokenId,
            orderId: event.orderId,
            dietary: event.dietary,
          });
        }
        break;
      }

      case "AGENT_FAILED": {
        bumpStep(
          "🛑 Execution Stopped",
          `No authorized candidate could fulfill constraints (${event.reasonCode || "Exhausted"})`,
          `Agent Failed: ${event.reasonCode || "Exhausted"}`
        );
        await navigateAndWait("assistant");
        await targetSelector(TARGETS.chatInput, 800);
        await delay(1200);
        setIsActive(false);
        break;
      }
    }
  };

  if (!isActive) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-emerald-950/40 backdrop-blur-[1.5px]"
      />

      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute top-4 left-1/2 -translate-x-1/2 bg-stone-900/95 text-white border-2 border-emerald-500/60 px-6 py-3 rounded-full shadow-[0_10px_35px_rgba(0,0,0,0.5)] flex items-center gap-3.5 backdrop-blur-xl z-50 text-xs font-mono"
      >
        <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
        <Sparkles className="w-4 h-4 text-emerald-400" />
        <span className="font-extrabold text-emerald-300">Live PlannerAgent</span>
        <span className="text-stone-500">|</span>
        <span className="text-stone-200 font-semibold">{statusText}</span>
      </motion.div>

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

        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-stone-900 via-emerald-950 to-stone-900 text-white border-2 border-emerald-500/70 rounded-2xl px-4 py-3 shadow-[0_15px_40px_rgba(0,0,0,0.6)] max-w-sm text-xs font-sans backdrop-blur-xl"
        >
          <div className="flex items-center justify-between gap-2 border-b border-emerald-800/60 pb-1.5 font-bold text-emerald-400 text-[11px] uppercase tracking-wider">
            <span className="flex items-center gap-1">
              <Utensils className="w-3.5 h-3.5 text-emerald-400" />
              Live Autonomous Action #{stepCounter || 1}
            </span>
          </div>
          <div className="font-black text-stone-100 text-sm mt-1.5">
            {currentStepTitle}
          </div>
          <div className="text-[11px] text-stone-300 font-mono mt-1 leading-snug">
            {currentStepDetail}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
