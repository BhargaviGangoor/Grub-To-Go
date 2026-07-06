"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles, Shield, Star } from "lucide-react";
import { SaigonCathedralDrawing } from "@/components/BackgroundDrawings";
import { revealUp, staggerContainer } from "@/lib/motion";

interface LandingViewProps {
  onNavigate: (view: string) => void;
}

export default function LandingView({ onNavigate }: LandingViewProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="relative overflow-hidden pb-20 pt-8">
      <SaigonCathedralDrawing className="stroke-[#1d3a2b] opacity-[0.06]" />

      <motion.section
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="relative overflow-hidden border-b border-white/55 py-14 lg:py-20"
      >
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(229,155,39,0.14),transparent)]" />
        <div className="cyber-grid absolute inset-0 pointer-events-none opacity-25" />

        <div className="relative z-10 mx-auto grid max-w-7xl gap-8 px-4 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-8 text-center lg:text-left">
            <motion.div
              variants={revealUp}
              className="inline-flex items-center gap-2 rounded-full border border-[#e59b27]/30 bg-white/70 px-4 py-2 text-xs font-mono font-bold text-[#e59b27] shadow-sm backdrop-blur"
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
              className="mx-auto max-w-2xl text-lg font-bold leading-relaxed text-[#1d3a2b] lg:mx-0 md:text-2xl"
            >
              Order exactly what you crave with a calmer, smarter dining flow.
            </motion.h2>

            <motion.p
              variants={revealUp}
              className="mx-auto max-w-2xl text-sm leading-relaxed text-[#1d3a2b]/75 lg:mx-0 md:text-base"
            >
              Describe the meal, upload inspiration, set a budget, and let the
              assistant narrow down the best option. The interface now leans on
              the existing image assets so the brand feels warmer and more
              premium.
            </motion.p>

            <motion.div
              variants={revealUp}
              className="flex flex-col justify-center gap-4 pt-2 sm:flex-row lg:justify-start"
            >
              <motion.button
                onClick={() => onNavigate("assistant")}
                whileHover={
                  shouldReduceMotion ? undefined : { y: -1.5, scale: 1.01 }
                }
                whileTap={shouldReduceMotion ? undefined : { scale: 0.99 }}
                className="flex items-center justify-center gap-2 rounded-full bg-[#1d3a2b] px-8 py-3.5 font-bold text-[#f4f1ea] shadow-[0_12px_40px_rgba(29,58,43,0.18)] transition-all duration-200 hover:bg-[#14281e] hover:shadow-[0_18px_45px_rgba(29,58,43,0.22)]"
              >
                <span>Start Ordering</span>
                <ArrowRight className="h-4 w-4 text-[#e59b27]" />
              </motion.button>
              <div className="flex items-center justify-center gap-2 rounded-full border border-[#e9e5da] bg-white/70 px-5 py-3 text-sm font-semibold text-[#1d3a2b] shadow-sm backdrop-blur lg:justify-start">
                <Sparkles className="h-4 w-4 text-[#e59b27]" />
                <span>Menu aware, budget aware, image aware</span>
              </div>
            </motion.div>
          </div>

          <motion.div variants={revealUp} className="relative">
            <div className="absolute inset-0 -translate-x-5 translate-y-5 rounded-[2rem] bg-[#1d3a2b]/10 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/70 p-4 shadow-[0_24px_80px_rgba(29,58,43,0.18)] backdrop-blur">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="overflow-hidden rounded-[1.4rem] border border-white/80 bg-[#fffdf9]">
                  <Image
                    src="/bg-romance.jpg"
                    alt="Warm dining scene"
                    width={800}
                    height={520}
                    className="h-full w-full object-cover"
                    priority
                  />
                </div>
                <div className="space-y-3">
                  <div className="overflow-hidden rounded-[1.4rem] border border-white/80 bg-[#fffdf9]">
                    <Image
                      src="/verandah.jpg"
                      alt="Open verandah restaurant"
                      width={600}
                      height={260}
                      className="h-44 w-full object-cover"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="overflow-hidden rounded-[1.2rem] border border-white/80 bg-[#fffdf9]">
                      <Image
                        src="/download4.jpg"
                        alt="Feature dish"
                        width={300}
                        height={200}
                        className="h-32 w-full object-cover"
                      />
                    </div>
                    <div className="overflow-hidden rounded-[1.2rem] border border-white/80 bg-[#fffdf9]">
                      <Image
                        src="/download3.jpg"
                        alt="Feature dish 2"
                        width={300}
                        height={200}
                        className="h-32 w-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-[#e9e5da] bg-white/85 p-4 shadow-sm">
                  <div className="text-xs font-mono uppercase tracking-wider text-[#1d3a2b]/50">
                    Budget Logic
                  </div>
                  <div className="mt-2 text-sm font-semibold text-[#1d3a2b]">
                    Tune every dish to a spending cap.
                  </div>
                </div>
                <div className="rounded-2xl border border-[#e9e5da] bg-white/85 p-4 shadow-sm">
                  <div className="text-xs font-mono uppercase tracking-wider text-[#1d3a2b]/50">
                    Image Input
                  </div>
                  <div className="mt-2 text-sm font-semibold text-[#1d3a2b]">
                    Upload food photos and screenshots.
                  </div>
                </div>
                <div className="rounded-2xl border border-[#e9e5da] bg-white/85 p-4 shadow-sm">
                  <div className="text-xs font-mono uppercase tracking-wider text-[#1d3a2b]/50">
                    Explainable Picks
                  </div>
                  <div className="mt-2 text-sm font-semibold text-[#1d3a2b]">
                    See why the assistant made the choice.
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
