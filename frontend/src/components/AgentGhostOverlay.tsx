"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Utensils } from "lucide-react";
import { triggerDecisionToast } from "@/components/OrderSuccessToast";
import { AgentUIEvent } from "@/types/AgentUIEvent";
import { useAgentEventStream } from "@/hooks/useAgentEventStream";

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
  const [stepCounter, setStepCounter] = useState(1);

  const { events } = useAgentEventStream(activeRunId);
  const processedEventIndexRef = useRef(0);
  const isProcessingRef = useRef(false);

  useEffect(() => {
    const handleStart = (e: Event) => {
      const customEvent = e as CustomEvent<AutomationPayload>;
      const detail = customEvent.detail || {};
      if (detail.runId) {
        setActiveRunId(detail.runId);
        setIsActive(true);
        processedEventIndexRef.current = 0;
        setStepCounter(1);
        setStatusText("Connecting to live agent stream...");
      }
    };

    window.addEventListener("start-agent-automation", handleStart);
    return () => window.removeEventListener("start-agent-automation", handleStart);
  }, []);

  useEffect(() => {
    if (!isActive || events.length === 0) return;

    const drainQueue = async () => {
      if (isProcessingRef.current) return;
      isProcessingRef.current = true;

      while (processedEventIndexRef.current < events.length) {
        const nextEvent = events[processedEventIndexRef.current];
        processedEventIndexRef.current += 1;
        await processLiveEvent(nextEvent);
      }

      isProcessingRef.current = false;
    };

    drainQueue();
  }, [events, isActive]);

  const processLiveEvent = async (event: AgentUIEvent) => {
    setStepCounter((prev) => prev + 1);

    switch (event.type) {
      case "AGENT_STARTED": {
        setStatusText("PlannerAgent initialized");
        setCurrentStepTitle("🎯 Step 1: Goal Analysis");
        setCurrentStepDetail(`Analyzing user goal: "${event.goal || 'Order Request'}"`);
        if (onNavigateScreen) onNavigateScreen("assistant");
        await moveAndClick(window.innerWidth * 0.75, window.innerHeight * 0.8, 600);
        break;
      }

      case "SEARCH_MENU": {
        setStatusText("Navigating catalog...");
        setCurrentStepTitle("🔍 Step 2: Menu Search");
        setCurrentStepDetail("Searching 28-dish authentic Parisian menu catalog");
        if (onNavigateScreen) onNavigateScreen("menu");
        await moveAndClick(window.innerWidth * 0.45, window.innerHeight * 0.2, 700);
        break;
      }

      case "MENU_RESULTS": {
        setStatusText(`Found ${event.count} candidates`);
        setCurrentStepTitle("📊 Candidate Pool");
        setCurrentStepDetail(`Identified ${event.count} semantically eligible candidates`);
        await delay(500);
        break;
      }

      case "SELECT_DISH": {
        const dishName = event.dishName || "Selected Dish";
        setStatusText(`Targeting ${dishName}...`);
        setCurrentStepTitle(`🍽️ Target Candidate: ${dishName}`);
        setCurrentStepDetail(`Selected candidate: ${dishName} (${event.price ? `₹${event.price}` : ''})`);
        if (onNavigateScreen) onNavigateScreen("menu");

        const selector = event.dishId ? `[data-dish-id="${event.dishId}"]` : `[data-dish-name="${dishName}"]`;
        await highlightAndTargetElement(selector, window.innerWidth * 0.35, window.innerHeight * 0.45);
        break;
      }

      case "CHECK_INVENTORY": {
        const dishName = event.dishName || "Dish";
        setStatusText(`Auditing pantry for ${dishName}...`);
        setCurrentStepTitle("📦 Live Pantry Audit");
        setCurrentStepDetail(`Verifying pantry stock & dietary rules for ${dishName}`);
        await delay(600);
        break;
      }

      case "INVENTORY_RESULT": {
        const dishName = event.dishName || "Dish";
        if (event.available) {
          setStatusText(`Stock verified for ${dishName}`);
          setCurrentStepTitle("✓ Stock Confirmed");
          setCurrentStepDetail(`All ingredients for ${dishName} available in kitchen`);
        } else {
          setStatusText(`Unavailable: ${event.reasonCode || 'Out of stock'}`);
          setCurrentStepTitle("✗ Stockout Detected");
          setCurrentStepDetail(`${dishName} unavailable (${event.reasonCode}). Triggering replan...`);
        }
        await delay(600);
        break;
      }

      case "REPLAN": {
        setStatusText("Replanning...");
        setCurrentStepTitle("↻ Autonomous Replanning");
        setCurrentStepDetail(`Candidate rejected (${event.reasonCode || 'Drift'}). Selecting alternative candidate...`);
        await delay(800);
        break;
      }

      case "GENERATE_DCT": {
        setStatusText("Attesting GB-DCT lease...");
        setCurrentStepTitle("🎟️ GB-DCT Generation");
        setCurrentStepDetail("Navigating to RESEARCH & generating state-bound commitment token");
        if (onNavigateScreen) onNavigateScreen("research");
        await moveAndClick(window.innerWidth * 0.5, window.innerHeight * 0.55, 700);
        break;
      }

      case "DCT_GENERATED": {
        setStatusText(`Token Hash: ${event.dctTokenId}`);
        setCurrentStepTitle("✓ GB-DCT Generated");
        setCurrentStepDetail(`Cryptographic token issued: ${event.dctTokenId}`);
        await delay(600);
        break;
      }

      case "VALIDATE_DCT": {
        setStatusText("Attesting world state...");
        setCurrentStepTitle("🛡️ World State Attestation");
        setCurrentStepDetail(`Validating token ${event.dctTokenId} against zero-drift policy`);
        await delay(600);
        break;
      }

      case "DCT_VALID": {
        setStatusText("State Attest: 0 Drift");
        setCurrentStepTitle("✓ State Validated");
        setCurrentStepDetail("State verified: 0 price, stock, or dietary drift detected");
        await delay(600);
        break;
      }

      case "CREATE_ORDER": {
        setStatusText("Persisting order ticket...");
        setCurrentStepTitle("🛒 Order Execution");
        setCurrentStepDetail("Creating order ticket in database");
        await delay(600);
        break;
      }

      case "ORDER_CREATED": {
        setStatusText(`Order #${event.orderId?.slice(-6) || ''} Confirmed`);
        setCurrentStepTitle("🎉 Order Confirmed");
        setCurrentStepDetail(`Persisted order #${event.orderId} to MongoDB`);
        await delay(700);
        break;
      }

      case "AGENT_COMPLETED": {
        setStatusText("Goal Accomplished!");
        setCurrentStepTitle("🎉 Order Complete");
        setCurrentStepDetail(`Autonomous pipeline succeeded for ${event.dishName}`);
        await delay(800);

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
        setStatusText(`Agent Failed: ${event.reasonCode || 'Exhausted'}`);
        setCurrentStepTitle("🛑 Execution Stopped");
        setCurrentStepDetail(`No authorized candidate could fulfill constraints (${event.reasonCode})`);
        await delay(2000);
        setIsActive(false);
        break;
      }
    }
  };

  const highlightAndTargetElement = async (selector: string, fallbackX: number, fallbackY: number) => {
    let targetX = fallbackX;
    let targetY = fallbackY;

    let el = document.querySelector(selector);
    if (!el) {
      // Poll briefly for element rendering after tab navigation
      for (let i = 0; i < 5; i++) {
        await delay(150);
        el = document.querySelector(selector);
        if (el) break;
      }
    }

    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      await delay(200);
      const rect = el.getBoundingClientRect();
      targetX = rect.left + rect.width / 2;
      targetY = rect.top + rect.height / 2;

      el.classList.add("ring-4", "ring-emerald-400", "shadow-[0_0_30px_rgba(16,185,129,0.8)]");
      setTimeout(() => {
        el?.classList.remove("ring-4", "ring-emerald-400", "shadow-[0_0_30px_rgba(16,185,129,0.8)]");
      }, 2000);
    }

    await moveAndClick(targetX, targetY, 700);
  };

  const moveAndClick = async (x: number, y: number, pauseMs: number) => {
    setCursorPos({ x, y });
    await delay(350);
    setClickRipple({ x, y, id: Date.now() });
    await delay(pauseMs);
  };

  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

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
        <span className="font-extrabold text-emerald-300">Live PlannerAgent</span>
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
              Live Autonomous Action #{stepCounter}
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
