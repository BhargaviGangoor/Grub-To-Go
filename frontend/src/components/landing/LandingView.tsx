"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  SaigonCathedralDrawing,
  BotanicalSprigDrawing,
  PaddlingBoatDrawing,
  FlyingBirdsSketch,
} from "@/components/BackgroundDrawings";
import { revealUp, staggerContainer } from "@/lib/motion";

interface LandingViewProps {
  onNavigate: (view: string) => void;
}

export default function LandingView({ onNavigate }: LandingViewProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="relative">
      {/* ═══════════════════════════════════════════════════════════
          SECTION 1 — HERO (full-viewport, background image)
         ═══════════════════════════════════════════════════════════ */}
      <section className="relative flex min-h-[92vh] items-center justify-center overflow-hidden">
        {/* Background image */}
        <Image
          src="/verandah.jpg"
          alt="Warm dining atmosphere"
          fill
          priority
          className="object-cover animate-bg-zoom-pan"
        />
        {/* Dark gradient overlay */}
        <div className="hero-overlay absolute inset-0 z-[1]" />

        {/* Hero content */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="relative z-10 mx-auto max-w-4xl px-6 text-center"
        >
          <motion.h1
            variants={revealUp}
            className="font-heading text-5xl font-bold leading-[1.15] text-white drop-shadow-lg sm:text-6xl md:text-8xl"
          >
            Family Flavours
            <br />
            <span className="font-script text-[#e59b27] drop-shadow-md">
              from{" "}
            </span>
            Paris
          </motion.h1>

          <motion.p
            variants={revealUp}
            className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg"
          >
            A family-run kitchen bringing you the warmth of home-cooked
            flavours, fresh herbs, and the crunch of golden spring rolls — all
            served with heart.
          </motion.p>

          <motion.div
            variants={revealUp}
            className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <motion.button
              onClick={() => onNavigate("menu")}
              whileHover={
                shouldReduceMotion ? undefined : { y: -2, scale: 1.02 }
              }
              whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
              className="stamp-btn bg-[#1d3a2b] px-7 py-3 text-[13px] font-bold uppercase tracking-[0.1em] text-[#f4f1ea] transition-all hover:bg-[#14281e]"
            >
              Explore Our Menu
            </motion.button>
            <motion.button
              onClick={() => onNavigate("assistant")}
              whileHover={
                shouldReduceMotion ? undefined : { y: -2, scale: 1.02 }
              }
              whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
              className="stamp-btn bg-[#e59b27] px-7 py-3 text-[13px] font-bold uppercase tracking-[0.1em] text-[#1d3a2b] transition-all hover:bg-[#d9911f]"
            >
              Order Now
            </motion.button>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 2 — WELCOME ("Authentic Parisian Flavours!")
         ═══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#f4f1ea] py-20 lg:py-28">
        {/* Faint cathedral drawing on right side */}
        <SaigonCathedralDrawing className="!left-auto !right-4 !bottom-auto !top-0 stroke-[#1d3a2b] !opacity-[0.06] !w-[500px] !h-[800px]" />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="relative z-10 mx-auto max-w-7xl px-6"
        >
          <div className="max-w-xl">
            <motion.p
              variants={revealUp}
              className="text-xs font-bold uppercase tracking-[0.2em] text-[#1d3a2b]/50"
            >
              Welcome Home to
            </motion.p>

            <motion.h2
              variants={revealUp}
              className="mt-3 font-heading text-4xl font-bold leading-tight text-[#1d3a2b] sm:text-5xl lg:text-6xl"
            >
              Authentic
              <br />
              <span className="font-script text-[#e59b27]">Parisian </span>
              Flavours!
            </motion.h2>

            <motion.p
              variants={revealUp}
              className="mt-6 text-sm leading-relaxed text-[#1d3a2b]/70 sm:text-base"
            >
              We&apos;re a family from the vibrant streets of Paris, sharing
              the beloved flavours of our childhood. At our table, you&apos;ll
              find the warmth of mom&apos;s cooking, the brightness of fresh
              herbs, and the satisfying crunch of golden spring rolls — all
              served with the spirit of home. From our kitchen to your family&apos;s
              table, every dish carries a piece of our story.
            </motion.p>

            <motion.button
              variants={revealUp}
              onClick={() => onNavigate("menu")}
              whileHover={
                shouldReduceMotion ? undefined : { y: -2, scale: 1.02 }
              }
              whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
              className="stamp-btn mt-8 bg-[#1d3a2b] px-7 py-3 text-[13px] font-bold uppercase tracking-[0.1em] text-[#f4f1ea] transition-all hover:bg-[#14281e]"
            >
              Learn More
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 3 — PHOTO COLLAGE + "Made Fresh Daily"
         ═══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#f4f1ea] pb-20 pt-8 lg:pb-28">
        {/* Botanical sprig decoration */}
        <BotanicalSprigDrawing className="absolute left-[5%] top-[10%] w-20 h-20 rotate-12 !opacity-[0.15]" />

        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left: Stamp-framed photo collage */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative flex items-center justify-center py-8"
            >
              {/* Photo 1 — large, tilted left */}
              <div className="stamp-frame relative z-10 -rotate-3 transition-transform duration-500 hover:rotate-0 hover:scale-105">
                <Image
                  src="/download.jpg"
                  alt="Fresh cuisine"
                  width={320}
                  height={240}
                  className="h-52 w-72 rounded-sm object-cover sm:h-64 sm:w-80"
                />
              </div>
              {/* Photo 2 — overlapping, tilted right */}
              <div className="stamp-frame relative -ml-16 z-20 rotate-[5deg] transition-transform duration-500 hover:rotate-0 hover:scale-105">
                <Image
                  src="/download4.jpg"
                  alt="Golden spring rolls"
                  width={260}
                  height={200}
                  className="h-44 w-60 rounded-sm object-cover sm:h-56 sm:w-72"
                />
              </div>
              {/* Photo 3 — small accent, top-right */}
              <div className="stamp-frame absolute -right-2 top-0 z-30 rotate-[8deg] transition-transform duration-500 hover:rotate-0 hover:scale-105 hidden sm:block">
                <Image
                  src="/cute.jpg"
                  alt="Dessert plate"
                  width={180}
                  height={130}
                  className="h-28 w-40 rounded-sm object-cover"
                />
              </div>

              {/* Decorative sprig near photos */}
              <BotanicalSprigDrawing className="absolute -bottom-4 left-4 w-16 h-16 -rotate-45 !opacity-[0.20]" />
            </motion.div>

            {/* Right: "Made Fresh Daily" text block */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              className="relative"
            >
              {/* Flying birds accent */}
              <FlyingBirdsSketch className="!absolute !right-0 !-top-12 !w-32 !h-24 !opacity-[0.12]" />

              <motion.h2
                variants={revealUp}
                className="font-heading text-4xl font-bold leading-tight text-[#1d3a2b] sm:text-5xl"
              >
                Cuisine
                <br />
                <span className="font-script text-[#e59b27]">Made </span>
                Fresh{" "}
                <span className="font-script text-[#e59b27]">Daily</span>
              </motion.h2>

              <motion.p
                variants={revealUp}
                className="mt-5 text-sm leading-relaxed text-[#1d3a2b]/70 sm:text-base"
              >
                Every dish is crafted from the freshest seasonal ingredients.
                Taste the authentic flavours of hand-pulled noodles,
                slow-simmered broths, and vibrant salads — all prepared with
                love and served right to your table.
              </motion.p>

              <motion.div
                variants={revealUp}
                className="mt-8 flex flex-wrap gap-4"
              >
                <button
                  onClick={() => onNavigate("menu")}
                  className="stamp-btn bg-[#1d3a2b] px-6 py-2.5 text-[12px] font-bold uppercase tracking-[0.1em] text-[#f4f1ea] transition-all hover:bg-[#14281e]"
                >
                  Explore Our Menu
                </button>
                <button
                  onClick={() => onNavigate("assistant")}
                  className="stamp-btn bg-[#e59b27] px-6 py-2.5 text-[12px] font-bold uppercase tracking-[0.1em] text-[#1d3a2b] transition-all hover:bg-[#d9911f]"
                >
                  Order Now
                </button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 4 — "Gather 'round, it's family time!"
         ═══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#f4f1ea] py-20 lg:py-28">
        {/* Cathedral drawing centered behind */}
        <svg
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[800px] pointer-events-none opacity-[0.05] select-none z-0"
          viewBox="0 0 500 850"
          fill="none"
          stroke="#1d3a2b"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M 175 220 L 175 70" />
          <path d="M 140 220 L 175 70 L 210 220" />
          <path d="M 355 220 L 355 70" />
          <path d="M 320 220 L 355 70 L 390 220" />
          <path d="M 140 220 L 140 720 L 210 720 L 210 220 Z" />
          <path d="M 320 220 L 320 720 L 390 720 L 390 220 Z" />
          <path d="M 210 310 L 320 310" />
          <path d="M 210 430 L 320 430" />
          <path d="M 210 630 L 320 630" />
          <path d="M 210 720 L 320 720" />
          <path d="M 210 310 L 265 250 L 320 310" />
          <circle cx="265" cy="370" r="32" />
          <circle cx="265" cy="370" r="7" />
          <path d="M 265 338 L 265 402" />
          <path d="M 233 370 L 297 370" />
          <path d="M 235 720 C 235 640, 295 640, 295 720" />
          <path d="M 20 720 L 480 720" />
        </svg>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="relative z-10 mx-auto max-w-7xl px-6"
        >
          <motion.div variants={revealUp} className="text-center">
            <BotanicalSprigDrawing className="mx-auto w-10 h-10 !opacity-[0.3] mb-2 !relative" />
            <h2 className="font-heading text-4xl font-bold text-[#1d3a2b] sm:text-5xl">
              Gather &apos;round,
              <br />
              it&apos;s{" "}
              <span className="font-script text-[#e59b27]">family</span>{" "}
              time!
            </h2>
            <motion.button
              onClick={() => onNavigate("assistant")}
              whileHover={
                shouldReduceMotion ? undefined : { y: -2, scale: 1.02 }
              }
              whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
              className="stamp-btn mt-6 bg-[#1d3a2b] px-7 py-3 text-[13px] font-bold uppercase tracking-[0.1em] text-[#f4f1ea] transition-all hover:bg-[#14281e]"
            >
              Order Now
            </motion.button>
          </motion.div>

          {/* Food image spread */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            <div className="overflow-hidden rounded-2xl shadow-lg transition-transform duration-500 hover:scale-[1.03]">
              <Image
                src="/download2.jpg"
                alt="Ginger garlic rice bowl"
                width={500}
                height={350}
                className="h-64 w-full object-cover sm:h-72"
              />
            </div>
            <div className="overflow-hidden rounded-2xl shadow-lg transition-transform duration-500 hover:scale-[1.03]">
              <Image
                src="/download3.jpg"
                alt="Wild mushroom bowl"
                width={500}
                height={350}
                className="h-64 w-full object-cover sm:h-72"
              />
            </div>
            <div className="overflow-hidden rounded-2xl shadow-lg transition-transform duration-500 hover:scale-[1.03] sm:col-span-2 lg:col-span-1">
              <Image
                src="/baby.jpg"
                alt="Family dining"
                width={500}
                height={350}
                className="h-64 w-full object-cover sm:h-72"
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          BOAT DIVIDER + FOOTER
         ═══════════════════════════════════════════════════════════ */}

      {/* Boat illustration divider */}
      <div className="relative bg-[#f4f1ea] pb-4 pt-8">
        <div className="mx-auto flex max-w-sm justify-center">
          <PaddlingBoatDrawing className="!relative !block !w-[320px] !h-[140px] !opacity-[0.18]" />
        </div>
      </div>

      {/* Gold accent line */}
      <div className="h-1.5 bg-[#e59b27]" />

      {/* Footer */}
      <footer className="bg-[#1d3a2b] text-[#f4f1ea]">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-8 px-6 py-12 md:flex-row md:justify-between">
          {/* Logo */}
          <div className="text-center md:text-left">
            <div className="font-heading text-2xl font-bold">GrubToGo</div>
            <div className="mt-1 text-[11px] uppercase tracking-[0.15em] text-[#f4f1ea]/50">
              Family-Style Dining
            </div>
          </div>

          {/* Nav links */}
          <nav className="flex flex-wrap justify-center gap-6 text-[13px] font-semibold uppercase tracking-[0.1em]">
            {["home", "assistant", "menu", "dashboard", "research"].map(
              (item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => onNavigate(item)}
                  className="text-[#f4f1ea]/70 transition-colors hover:text-[#e59b27]"
                >
                  {item === "assistant" ? "FOOD" : item.toUpperCase()}
                </button>
              )
            )}
          </nav>

          {/* Social icon */}
          <div className="flex items-center gap-3">
            <a
              href="#"
              className="flex h-9 w-9 items-center justify-center rounded-md border border-[#e59b27]/40 text-[#e59b27] transition-colors hover:bg-[#e59b27]/10"
              aria-label="Instagram"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="5" />
                <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
              </svg>
            </a>
          </div>
        </div>

        {/* Copyright bar */}
        <div className="border-t border-white/10 bg-[#14281e] py-3 text-center text-[11px] text-[#f4f1ea]/40">
          © {new Date().getFullYear()} GrubToGo. All rights reserved. Designed
          with ♥ for good food.
        </div>
      </footer>
    </div>
  );
}
