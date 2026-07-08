"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FloatingButton } from "./FloatingButton";
import { ChatWindow } from "./ChatWindow";
import { useChat } from "./useChat";

/**
 * AIAssistant.tsx
 *
 * The root orchestrator for the floating AI copilot.
 * This is the ONLY component that needs to be mounted in the root layout.
 *
 * ─── WHAT THIS COMPONENT DOES ────────────────────────────────────────────────
 * 1. Manages `isOpen` state (open/close the chat panel)
 * 2. Calls `useChat()` to get messages, loading state, and sendMessage
 * 3. Passes state down to FloatingButton and ChatWindow as props
 * 4. Handles "click outside to close" via a backdrop overlay
 * 5. Animates the panel open/close with Framer Motion
 *
 * ─── REACT CONCEPTS: STATE LIFTING ───────────────────────────────────────────
 * `isOpen` lives here (not in FloatingButton or ChatWindow).
 * Why? Both FloatingButton AND ChatWindow need to read it.
 * Both need to change it. The closest common ancestor is this component.
 * This is "lifting state up" — the canonical React pattern for shared state.
 *
 * ─── FRAMER MOTION CONCEPTS ──────────────────────────────────────────────────
 * AnimatePresence: Required wrapper for exit animations.
 *   Without it, components are removed from the DOM instantly — no exit animation.
 *   With it, Framer Motion waits for the exit animation to complete before unmounting.
 *
 * motion.div: A regular div that can be animated.
 *   `initial`: the starting state when the component first appears
 *   `animate`: the state it animates TO
 *   `exit`: the state it animates TO before being removed
 *   `transition`: spring physics for natural-feeling motion
 *
 * ─── CLICK OUTSIDE TO CLOSE ──────────────────────────────────────────────────
 * We use a semi-transparent overlay backdrop that covers the whole screen.
 * Clicking the backdrop sets isOpen=false.
 * The z-index hierarchy: backdrop (40) < panel (50) < button (60).
 * Clicking inside the panel doesn't hit the backdrop because the panel is on top.
 *
 * ─── ACCESSIBILITY ───────────────────────────────────────────────────────────
 * Escape key closes the panel — standard modal/dialog UX convention.
 * useEffect adds a keydown listener and removes it on cleanup.
 */
export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, isLoading, sendMessage } = useChat();

  const toggleOpen = useCallback(() => setIsOpen((prev) => !prev), []);
  const close = useCallback(() => setIsOpen(false), []);

  // Escape key closes the panel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        close();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    // Cleanup: remove listener when component unmounts or isOpen changes
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, close]);

  return (
    <>
      {/* ── Backdrop (click outside to close) ─────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={close}
            className="fixed inset-0 z-40"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* ── Fixed container — bottom-right corner ─────────────────────── */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">

        {/* ── Chat Panel ─────────────────────────────────────────────── */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="chat-panel"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 30,
                mass: 0.8,
              }}
              style={{ transformOrigin: "bottom right" }}
            >
              <ChatWindow
                messages={messages}
                isLoading={isLoading}
                onSend={sendMessage}
                onClose={close}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Floating Button ─────────────────────────────────────────── */}
        <FloatingButton
          isOpen={isOpen}
          onClick={toggleOpen}
          hasMessages={messages.length > 0}
        />
      </div>
    </>
  );
}
