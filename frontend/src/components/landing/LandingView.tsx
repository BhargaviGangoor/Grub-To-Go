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
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              className="max-w-xl relative z-20"
            >
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
            </motion.div>
            
            {/* The cathedral is placed behind the text, to the left, as per screenshot */}
            <SaigonCathedralDrawing className="!left-auto !right-0 !top-0 stroke-[#1d3a2b] !opacity-[0.06] !w-[600px] !h-[900px] pointer-events-none -z-10" />

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative flex justify-center lg:justify-end mix-blend-multiply"
            >
              <Image
                src="/frenchme.jpg"
                alt="Authentic Parisian"
                width={500}
                height={500}
                className="w-full max-w-[450px] object-contain transition-transform duration-500 hover:scale-[1.02]"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 3 — "Cuisine Made Fresh Daily"
         ═══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#f4f1ea] pb-10 lg:pb-16 pt-8">
        {/* Botanical sprig decoration */}
        <BotanicalSprigDrawing className="absolute left-[5%] top-[10%] w-20 h-20 rotate-12 !opacity-[0.15]" />

        <div className="relative mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2 flex-col-reverse flex lg:grid">
            {/* Left: Illustration of Good Food */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative flex items-center justify-center py-8 mix-blend-multiply"
            >
              <Image
                src="/good-food.jpg"
                alt="Fresh cuisine"
                width={600}
                height={600}
                className="w-full max-w-[500px] object-contain transition-transform duration-500 hover:scale-[1.02]"
              />
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
          SECTION 3.5 — PARIS VIEW SPAN (ilparis.jpg)
         ═══════════════════════════════════════════════════════════ */}
      <section className="relative w-full bg-[#f4f1ea] py-10 flex justify-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-6xl px-6 flex justify-center mix-blend-multiply"
        >
          <Image
            src="/ilparis.jpg"
            alt="Paris view"
            width={1200}
            height={600}
            className="w-full h-auto object-contain transition-transform duration-700 hover:scale-[1.02]"
          />
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 4 — "Gather 'round, it's family time!"
         ═══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#f4f1ea] py-16 lg:py-24">
        {/* Subtle cathedral drawing behind text */}
        <SaigonCathedralDrawing className="!left-1/2 !top-0 !-translate-x-1/2 stroke-[#1d3a2b] !opacity-[0.04] !w-[600px] !h-[800px] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-6">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center"
          >
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

          {/* Food/Sketches spread (using mix-blend-multiply for a painted feel) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            className="mt-16 grid gap-8 sm:grid-cols-3 items-end mix-blend-multiply"
          >
            <div className="flex justify-center transition-transform duration-500 hover:scale-[1.05]">
              <Image
                src="/download2.jpg"
                alt="Shop exterior sketch"
                width={400}
                height={400}
                className="w-full max-w-[320px] object-contain"
              />
            </div>
            <div className="flex justify-center transition-transform duration-500 hover:scale-[1.05] pb-4">
              <Image
                src="/download3.jpg"
                alt="Macaron box sketch"
                width={400}
                height={400}
                className="w-full max-w-[340px] object-contain"
              />
            </div>
            <div className="flex justify-center transition-transform duration-500 hover:scale-[1.05]">
              <Image
                src="/baby.jpg"
                alt="Girl sketch"
                width={400}
                height={400}
                className="w-full max-w-[300px] object-contain"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 4.5 — MACARONS SPAN
         ═══════════════════════════════════════════════════════════ */}
      <section className="relative w-full bg-[#f4f1ea] py-12 flex justify-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-7xl px-6 flex justify-center mix-blend-multiply"
        >
          <Image
            src="/macarons.jpg"
            alt="Macarons span"
            width={1400}
            height={600}
            className="w-full h-auto object-contain transition-transform duration-700 hover:scale-[1.02]"
          />
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          BOAT DIVIDER + FOOTER
         ═══════════════════════════════════════════════════════════ */}

      {/* Boat illustration divider */}
      <div className="relative bg-[#f4f1ea] pb-6 pt-4">
        <div className="mx-auto flex max-w-sm justify-center">
          <PaddlingBoatDrawing className="!relative !block !w-[320px] !h-[140px] !opacity-[0.20]" />
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
