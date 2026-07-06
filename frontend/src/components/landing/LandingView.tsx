"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Shield } from "lucide-react";
import { SaigonCathedralDrawing } from "@/components/BackgroundDrawings";
import { revealUp, staggerContainer } from "@/lib/motion";

interface LandingViewProps {
  onNavigate: (view: string) => void;
}

export default function LandingView({ onNavigate }: LandingViewProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="relative overflow-hidden space-y-20 pb-20">
      <SaigonCathedralDrawing className="stroke-[#1d3a2b] opacity-[0.08]" />

      <motion.section
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="relative overflow-hidden border-b border-[#e9e5da] py-16 lg:py-24"
      >
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(229,155,39,0.06),transparent)]" />
        <div className="cyber-grid absolute inset-0 pointer-events-none opacity-40" />

        <div className="relative z-10 mx-auto max-w-4xl space-y-6 px-4 text-center">
          <motion.div
            variants={revealUp}
            className="inline-flex items-center gap-2 rounded-full border border-[#e59b27]/30 bg-[#e59b27]/5 px-3.5 py-1 text-xs font-mono font-bold text-[#e59b27]"
          >
            <Shield className="h-3.5 w-3.5" />
            <span>Your Personal AI Dining Assistant</span>
          </motion.div>

          <motion.h1
            variants={revealUp}
            className="outlined-text text-6xl font-extrabold tracking-tight md:text-8xl"
          >
            GrubToGo
          </motion.h1>

          <motion.h2
            variants={revealUp}
            className="mx-auto max-w-2xl text-lg font-bold leading-relaxed text-[#1d3a2b] md:text-2xl"
          >
            Order Exactly What You Crave, Effortlessly.
          </motion.h2>

          <motion.p
            variants={revealUp}
            className="mx-auto max-w-2xl text-sm leading-relaxed text-[#1d3a2b]/70 md:text-base"
          >
            Tell our AI what you desire from a spicy vegetarian dinner under
            ₹300 to something high in protein, and let it handle the rest. No
            more endless browsing, just perfect meals tailored for you.
          </motion.p>

          <motion.div
            variants={revealUp}
            className="flex flex-col justify-center gap-4 pt-4 sm:flex-row"
          >
            <motion.button
              onClick={() => onNavigate("assistant")}
              whileHover={
                shouldReduceMotion ? undefined : { y: -1.5, scale: 1.01 }
              }
              whileTap={shouldReduceMotion ? undefined : { scale: 0.99 }}
              className="flex items-center justify-center gap-2 rounded-lg bg-[#1d3a2b] px-8 py-3 font-bold text-[#f4f1ea] shadow-md transition-all duration-200 hover:bg-[#14281e] hover:shadow-lg"
            >
              <span>Start Ordering</span>
              <ArrowRight className="h-4 w-4 text-[#e59b27]" />
            </motion.button>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
