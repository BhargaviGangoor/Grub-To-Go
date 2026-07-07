"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  SaigonCathedralDrawing,
  BotanicalSprigDrawing,
  PaddlingBoatDrawing,
  FlyingBirdsSketch,
  EiffelTowerDrawing,
  CroissantDrawing,
  StreetLampDrawing,
  WineGlassDrawing,
  ArcDeTriompheDrawing,
  RoseBouquetDrawing,
  RibbonDrawing,
  HeelsDrawing,
  CoffeeCupDrawing,
  ParisNotreDameDrawing,
  VintageVespaDrawing,
  BistroSetDrawing,
  BaguetteBasketDrawing,
  FlowerPotSketch,
  BirdOnBranchSketch,
} from "@/components/BackgroundDrawings";
import { revealUp, staggerContainer } from "@/lib/motion";

interface LandingViewProps {
  onNavigate: (view: string) => void;
}

export default function LandingView({ onNavigate }: LandingViewProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  useEffect(() => {
    setIsMounted(true);
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  // Parallax hooks
  const { scrollY } = useScroll();
  const yBgSlow = useTransform(scrollY, [0, 4000], [0, 300]);
  const yBgFast = useTransform(scrollY, [0, 4000], [0, -400]);
  const rotateBg = useTransform(scrollY, [0, 4000], [0, 120]);
  const yTextParallax = useTransform(scrollY, [0, 4000], [0, -150]);
  const xBoat = useTransform(scrollY, [0, 4000], [0, 300]);

  const stackBase = useTransform(scrollY, [0, 4000], [0, 100]);
  const stackL1 = useTransform(scrollY, [0, 4000], [0, -50]);
  const stackL2 = useTransform(scrollY, [0, 4000], [0, -150]);
  const stackL3 = useTransform(scrollY, [0, 4000], [0, -250]);
  const stackL4 = useTransform(scrollY, [0, 4000], [0, -350]);

  return (
    <div className="relative">
      {/* ═══════════════════════════════════════════════════════════
          SECTION 1 — HERO (full-viewport, background image)
         ═══════════════════════════════════════════════════════════ */}
      <section className="relative flex min-h-[92vh] items-center justify-center overflow-hidden bg-[#1d3a2b]">
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
          whileInView="show"
          viewport={{ once: true }}
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
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="stamp-btn bg-[#1d3a2b] px-7 py-3 text-[13px] font-bold uppercase tracking-[0.1em] text-[#f4f1ea] transition-all hover:bg-[#14281e]"
            >
              Explore Our Menu
            </motion.button>
            <motion.button
              onClick={() => onNavigate("assistant")}
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
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
        {/* Parallax Background Drawings */}
        <motion.div style={isMounted ? { y: yBgFast } : {}} className="absolute right-0 top-0 pointer-events-none opacity-[0.06] z-0">
          <SaigonCathedralDrawing className="stroke-[#1d3a2b] w-[600px] h-[900px]" />
        </motion.div>
        <motion.div style={isMounted ? { y: yBgFast, x: "10%" } : { x: "10%" }} className="absolute left-[40%] top-0 pointer-events-none opacity-[0.05] z-0 hidden lg:block">
          <ParisNotreDameDrawing className="stroke-[#1d3a2b] w-[500px] h-[600px]" />
        </motion.div>
        <motion.div style={isMounted ? { x: xBoat } : {}} className="absolute -left-10 bottom-0 pointer-events-none opacity-[0.10] z-0 hidden md:block">
          <PaddlingBoatDrawing className="w-[400px] h-[200px]" />
        </motion.div>

        {/* Scattered SVG Sketches */}
        <motion.div style={isMounted ? { y: yBgFast, rotate: -15 } : { rotate: -15 }} className="absolute -left-5 top-10 pointer-events-none opacity-[0.25] z-0">
          <EiffelTowerDrawing className="w-[200px] h-[400px] stroke-[#1d3a2b]" />
        </motion.div>
        <motion.div style={isMounted ? { y: yBgSlow, rotate: 10 } : { rotate: 10 }} className="absolute -right-5 bottom-20 pointer-events-none opacity-[0.25] z-0">
          <CroissantDrawing className="w-[150px] h-[150px] stroke-[#1d3a2b]" />
        </motion.div>
        <motion.div style={isMounted ? { y: yBgFast, rotate: 20 } : { rotate: 20 }} className="absolute left-[30%] top-1/4 pointer-events-none opacity-[0.20] z-0 hidden lg:block">
          <RoseBouquetDrawing className="w-[180px] h-[220px] stroke-[#1d3a2b]" />
        </motion.div>
        <motion.div style={isMounted ? { y: yBgSlow, rotate: -5 } : { rotate: -5 }} className="absolute right-[22%] top-10 pointer-events-none opacity-[0.15] z-0 hidden lg:block">
          <VintageVespaDrawing className="w-[200px] h-[150px] stroke-[#1d3a2b]" />
        </motion.div>
        <motion.div style={isMounted ? { y: yBgFast, rotate: 12 } : { rotate: 12 }} className="absolute left-[15%] bottom-[5%] pointer-events-none opacity-[0.15] z-0 hidden lg:block">
          <BistroSetDrawing className="w-[220px] h-[220px] stroke-[#1d3a2b]" />
        </motion.div>
        <motion.div style={isMounted ? { y: yBgSlow, rotate: -8 } : { rotate: -8 }} className="absolute right-[25%] bottom-[10%] pointer-events-none opacity-[0.18] z-0 hidden lg:block">
          <BaguetteBasketDrawing className="w-[160px] h-[200px] stroke-[#1d3a2b]" />
        </motion.div>

        <div className="relative mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
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
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="stamp-btn mt-8 bg-[#1d3a2b] px-7 py-3 text-[13px] font-bold uppercase tracking-[0.1em] text-[#f4f1ea] transition-all hover:bg-[#14281e]"
              >
                Learn More
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
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
        {/* Parallax Botanical sprig decoration */}
        <motion.div style={isMounted ? { y: yBgSlow, rotate: rotateBg } : {}} className="absolute left-[5%] top-[10%] pointer-events-none opacity-[0.15] z-0">
          <BotanicalSprigDrawing className="w-24 h-24" />
        </motion.div>

        {/* Scattered SVG Sketches */}
        <motion.div style={isMounted ? { y: yBgFast, rotate: -5 } : { rotate: -5 }} className="absolute -left-10 top-40 pointer-events-none opacity-[0.25] z-0">
          <WineGlassDrawing className="w-[120px] h-[180px] stroke-[#1d3a2b]" />
        </motion.div>
        <motion.div style={isMounted ? { y: yBgSlow, rotate: 8 } : { rotate: 8 }} className="absolute right-5 bottom-10 pointer-events-none opacity-[0.25] z-0">
          <ArcDeTriompheDrawing className="w-[250px] h-[250px] stroke-[#1d3a2b]" />
        </motion.div>
        <motion.div style={isMounted ? { y: yBgFast, rotate: -10 } : { rotate: -10 }} className="absolute left-[40%] top-10 pointer-events-none opacity-[0.25] z-0 hidden lg:block">
          <CoffeeCupDrawing className="w-[160px] h-[160px] stroke-[#1d3a2b]" />
        </motion.div>
        <motion.div style={isMounted ? { y: yBgSlow, rotate: 15 } : { rotate: 15 }} className="absolute left-[20%] bottom-[12%] pointer-events-none opacity-[0.20] z-0 hidden lg:block">
          <BaguetteBasketDrawing className="w-[150px] h-[180px] stroke-[#1d3a2b]" />
        </motion.div>
        <motion.div style={isMounted ? { y: yBgFast, rotate: -12 } : { rotate: -12 }} className="absolute right-[40%] bottom-[15%] pointer-events-none opacity-[0.18] z-0 hidden lg:block">
          <VintageVespaDrawing className="w-[180px] h-[140px] stroke-[#1d3a2b]" />
        </motion.div>
        <motion.div style={isMounted ? { y: yBgSlow, rotate: 6 } : { rotate: 6 }} className="absolute left-[5%] bottom-[35%] pointer-events-none opacity-[0.18] z-0 hidden lg:block">
          <RibbonDrawing className="w-[160px] h-[120px] stroke-[#1d3a2b]" />
        </motion.div>

        <div className="relative mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2 flex-col-reverse flex lg:grid">
            {/* Left: Illustration of Good Food */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
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
              viewport={{ once: true }}
              className="relative"
            >
              {/* Flying birds parallax accent */}
              <motion.div style={isMounted ? { y: yBgFast, x: yBgFast } : {}} className="absolute right-0 -top-16 opacity-[0.12] pointer-events-none">
                <FlyingBirdsSketch className="w-40 h-32" />
              </motion.div>

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
          SECTION 3.1 — SEE WHAT'S COOKING! (PARISIAN STACK)
         ═══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#f4f1ea] pt-8 pb-16 lg:pt-12 lg:pb-24">
        {/* Background Sketch (Eiffel Tower) */}
        <motion.div style={isMounted ? { y: yBgFast, x: "-10%" } : { x: "-10%" }} className="absolute left-[5%] top-10 pointer-events-none opacity-[0.07] z-0">
          <EiffelTowerDrawing className="w-[500px] h-[900px] stroke-[#1d3a2b]" />
        </motion.div>
        <motion.div style={isMounted ? { y: yBgSlow, x: "10%" } : { x: "10%" }} className="absolute right-[5%] top-12 pointer-events-none opacity-[0.06] z-0 hidden lg:block">
          <ParisNotreDameDrawing className="w-[450px] h-[550px] stroke-[#1d3a2b]" />
        </motion.div>
        <motion.div style={isMounted ? { y: yBgFast, rotate: 15 } : { rotate: 15 }} className="absolute left-[15%] bottom-[12%] pointer-events-none opacity-[0.16] z-0 hidden lg:block">
          <BistroSetDrawing className="w-[200px] h-[200px] stroke-[#1d3a2b]" />
        </motion.div>
        <motion.div style={isMounted ? { y: yBgSlow, rotate: -10 } : { rotate: -10 }} className="absolute right-[18%] top-[25%] pointer-events-none opacity-[0.16] z-0 hidden lg:block">
          <BirdOnBranchSketch className="w-[180px] h-[180px] stroke-[#1d3a2b]" />
        </motion.div>

        <div className="relative mx-auto max-w-7xl px-6">
          {/* Header */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mb-20 relative z-10"
          >
        <motion.h2 variants={revealUp} className="font-heading text-4xl font-bold text-[#1d3a2b] sm:text-5xl lg:text-6xl">
              See <span className="font-script text-[#e59b27] text-5xl sm:text-6xl lg:text-7xl">what's</span> cooking!
            </motion.h2>
            <motion.p variants={revealUp} className="mt-6 max-w-sm text-sm sm:text-base leading-relaxed text-[#1d3a2b]/70">
              From fresh baked pastries to rich savory soups, take a peek behind the scenes and discover what's freshly prepared in our Parisian kitchen.
            </motion.p>
          </motion.div>

          {/* Central Stack Collage Area */}
          <div className="relative h-[500px] sm:h-[700px] w-full flex justify-center mt-6">

            {/* The Wood Board Base */}
            <motion.div
              style={isMounted ? { y: stackBase } : {}}
              className="absolute bottom-[5%] w-full max-w-[300px] sm:max-w-[500px] mix-blend-multiply z-[1]"
            >
              <Image src="/wood_board.png" alt="Wood board" width={600} height={400} className="w-full object-contain" />
            </motion.div>

            {/* Coffee - Bottom Right */}
            <motion.div
              style={isMounted ? { y: stackL1 } : {}}
              initial={{ opacity: 0, scale: 0.8, x: 40 }}
              whileInView={{ opacity: 1, scale: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
              whileHover={{ scale: 1.08, rotate: 2, zIndex: 20 }}
              className="absolute bottom-[10%] right-[5%] sm:right-[15%] lg:right-[30%] w-[120px] sm:w-[180px] mix-blend-multiply z-[5] cursor-pointer"
            >
              <Image src="/paris_coffee.png" alt="Espresso" width={300} height={300} className="w-full object-contain" />
              {/* Label */}
              <div className="hidden sm:flex absolute top-[60%] sm:top-[100%] right-[-140px] w-[180px] items-center gap-3">
                <div className="w-12 border-b border-[#1d3a2b]/40"></div>
                <div className="flex gap-3 items-center">
                  <div className="w-10 h-10 rounded-full bg-[#1d3a2b] flex items-center justify-center shrink-0">
                    <CoffeeCupDrawing className="w-5 h-5 stroke-[#f4f1ea] text-[#f4f1ea]" />
                  </div>
                  <div>
                    <span className="font-bold text-[#1d3a2b] block text-sm">Espresso</span>
                    <span className="text-[10px] text-[#1d3a2b]/70 leading-tight block">Slow-dripped to satisfaction</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Croissant - Bottom Left */}
            <motion.div
              style={isMounted ? { y: stackL1 } : {}}
              initial={{ opacity: 0, scale: 0.8, x: -40 }}
              whileInView={{ opacity: 1, scale: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
              whileHover={{ scale: 1.08, rotate: -2, zIndex: 20 }}
              className="absolute bottom-[15%] left-[5%] sm:left-[15%] lg:left-[30%] w-[150px] sm:w-[220px] mix-blend-multiply z-[4] cursor-pointer"
            >
              <Image src="/paris_croissant.png" alt="Croissant" width={400} height={300} className="w-full object-contain" />
              {/* Label */}
              <div className="hidden sm:flex absolute top-[80%] left-[-160px] w-[190px] items-center gap-3 flex-row-reverse">
                <div className="w-12 border-b border-[#1d3a2b]/40"></div>
                <div className="flex gap-3 items-center flex-row-reverse text-right">
                  <div className="w-10 h-10 rounded-full bg-[#1d3a2b] flex items-center justify-center shrink-0">
                    <CroissantDrawing className="w-5 h-5 stroke-[#f4f1ea] text-[#f4f1ea]" />
                  </div>
                  <div>
                    <span className="font-bold text-[#1d3a2b] block text-sm">Croissant</span>
                    <span className="text-[10px] text-[#1d3a2b]/70 leading-tight block">Crunchy & tender in every bite</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Crepes - Middle Left */}
            <motion.div
              style={isMounted ? { y: stackL2 } : {}}
              initial={{ opacity: 0, scale: 0.8, x: -40 }}
              whileInView={{ opacity: 1, scale: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
              whileHover={{ scale: 1.08, rotate: -1, zIndex: 20 }}
              className="absolute bottom-[35%] left-[10%] sm:left-[20%] lg:left-[32%] w-[180px] sm:w-[280px] mix-blend-multiply z-[3] cursor-pointer"
            >
              <Image src="/paris_crepes.png" alt="Crepes" width={500} height={400} className="w-full object-contain" />
              {/* Label */}
              <div className="hidden sm:flex absolute top-[50%] left-[-180px] w-[210px] items-center gap-3 flex-row-reverse">
                <div className="w-12 border-b border-[#1d3a2b]/40"></div>
                <div className="flex gap-3 items-center flex-row-reverse text-right">
                  <div className="w-10 h-10 rounded-full bg-[#1d3a2b] flex items-center justify-center shrink-0">
                    <BotanicalSprigDrawing className="w-5 h-5 stroke-[#f4f1ea] text-[#f4f1ea]" />
                  </div>
                  <div>
                    <span className="font-bold text-[#1d3a2b] block text-sm">Crêpes</span>
                    <span className="text-[10px] text-[#1d3a2b]/70 leading-tight block">Freshly folded, generously served</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Soup - Middle Right */}
            <motion.div
              style={isMounted ? { y: stackL3 } : {}}
              initial={{ opacity: 0, scale: 0.8, x: 40 }}
              whileInView={{ opacity: 1, scale: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
              whileHover={{ scale: 1.08, rotate: 1, zIndex: 20 }}
              className="absolute bottom-[50%] right-[10%] sm:right-[15%] lg:right-[28%] w-[180px] sm:w-[260px] mix-blend-multiply z-[2] cursor-pointer"
            >
              <Image src="/french_soup.png" alt="French Onion Soup" width={500} height={400} className="w-full object-contain" />
              {/* Label */}
              <div className="hidden sm:flex absolute top-[50%] right-[-200px] w-[230px] items-center gap-3">
                <div className="w-12 border-b border-[#1d3a2b]/40"></div>
                <div className="flex gap-3 items-center">
                  <div className="w-10 h-10 rounded-full bg-[#1d3a2b] flex items-center justify-center shrink-0">
                    <WineGlassDrawing className="w-4 h-4 stroke-[#f4f1ea] text-[#f4f1ea]" />
                  </div>
                  <div>
                    <span className="font-bold text-[#1d3a2b] block text-sm">Soupe à l'Oignon</span>
                    <span className="text-[10px] text-[#1d3a2b]/70 leading-tight block">Legacy flavours that bring you home</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Macarons - Top Center */}
            <motion.div
              style={isMounted ? { y: stackL4 } : {}}
              initial={{ opacity: 0, scale: 0.8, y: -40 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
              whileHover={{ scale: 1.08, rotate: 3, zIndex: 20 }}
              className="absolute bottom-[70%] left-[50%] -translate-x-1/2 w-[140px] sm:w-[220px] mix-blend-multiply z-[6] cursor-pointer"
            >
              <Image src="/paris_macarons.png" alt="Macarons" width={400} height={300} className="w-full object-contain" />
              {/* Label */}
              <div className="hidden sm:flex absolute top-[30%] right-[-180px] w-[200px] items-center gap-3">
                <div className="w-12 border-b border-[#1d3a2b]/40"></div>
                <div className="flex gap-3 items-center">
                  <div className="w-10 h-10 rounded-full bg-[#1d3a2b] flex items-center justify-center shrink-0">
                    <ArcDeTriompheDrawing className="w-5 h-5 stroke-[#f4f1ea] text-[#f4f1ea]" />
                  </div>
                  <div>
                    <span className="font-bold text-[#1d3a2b] block text-sm">Macarons</span>
                    <span className="text-[10px] text-[#1d3a2b]/70 leading-tight block">A different flavour for every craving</span>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 3.5 — PARIS VIEW SPAN (ilparis.jpg)
         ═══════════════════════════════════════════════════════════ */}
      <section className="relative w-full bg-[#f4f1ea] py-12 lg:py-16 flex flex-col items-center overflow-hidden">
        {/* Giant faintly parallaxing cathedral */}
        <motion.div style={isMounted ? { y: yBgSlow, x: "-10%" } : { x: "-10%" }} className="absolute left-0 top-0 pointer-events-none opacity-[0.03] z-0 hidden lg:block">
          <SaigonCathedralDrawing className="w-[1000px] h-[1000px] stroke-[#1d3a2b]" />
        </motion.div>
        <motion.div style={isMounted ? { y: yBgFast, x: "10%" } : { x: "10%" }} className="absolute right-0 top-0 pointer-events-none opacity-[0.03] z-0 hidden lg:block">
          <ParisNotreDameDrawing className="w-[900px] h-[900px] stroke-[#1d3a2b]" />
        </motion.div>
        <motion.div style={isMounted ? { y: yBgFast, rotate: 10 } : { rotate: 10 }} className="absolute left-8 bottom-6 pointer-events-none opacity-[0.22] z-0 hidden lg:block">
          <StreetLampDrawing className="w-[140px] h-[280px] stroke-[#1d3a2b]" />
        </motion.div>
        <motion.div style={isMounted ? { y: yBgSlow, rotate: -8 } : { rotate: -8 }} className="absolute right-10 bottom-6 pointer-events-none opacity-[0.22] z-0 hidden lg:block">
          <FlowerPotSketch className="w-[160px] h-[220px] stroke-[#1d3a2b]" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
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

        <motion.div
          variants={revealUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="relative z-20 mt-8"
        >
          <motion.button
            onClick={() => onNavigate("assistant")}
            whileHover={{ y: -2, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="stamp-btn bg-[#e59b27] px-8 py-4 text-[14px] font-bold uppercase tracking-[0.1em] text-[#1d3a2b] shadow-sm transition-all hover:bg-[#d9911f]"
          >
            Order Now
          </motion.button>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 4 — "Gather 'round, it's family time!"
         ═══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#f4f1ea] pt-16 pb-20 lg:pt-20 lg:pb-28">
        {/* Parallax Subtle cathedral drawing behind text */}
        <motion.div style={isMounted ? { y: yBgFast, x: "-50%" } : { x: "-50%" }} className="absolute left-1/2 top-0 pointer-events-none opacity-[0.04] z-0">
          <SaigonCathedralDrawing className="w-[700px] h-[900px] stroke-[#1d3a2b]" />
        </motion.div>

        {/* Scattered SVG Sketches */}
        <motion.div style={isMounted ? { y: yBgFast, rotate: -12 } : { rotate: -12 }} className="absolute -left-5 top-10 pointer-events-none opacity-[0.25] z-0">
          <StreetLampDrawing className="w-[150px] h-[300px] stroke-[#1d3a2b]" />
        </motion.div>
        <motion.div style={isMounted ? { y: yBgSlow, rotate: 15 } : { rotate: 15 }} className="absolute -right-5 top-1/3 pointer-events-none opacity-[0.25] z-0">
          <HeelsDrawing className="w-[160px] h-[160px] stroke-[#1d3a2b]" />
        </motion.div>
        <motion.div style={isMounted ? { y: yBgFast, rotate: -8 } : { rotate: -8 }} className="absolute -left-5 -bottom-10 pointer-events-none opacity-[0.25] z-0">
          <RibbonDrawing className="w-[200px] h-[150px] stroke-[#1d3a2b]" />
        </motion.div>
        <motion.div style={isMounted ? { y: yBgSlow, rotate: 8 } : { rotate: 8 }} className="absolute right-12 top-6 pointer-events-none opacity-[0.20] z-0 hidden lg:block">
          <BirdOnBranchSketch className="w-[160px] h-[160px] stroke-[#1d3a2b]" />
        </motion.div>
        <motion.div style={isMounted ? { y: yBgFast, rotate: -10 } : { rotate: -10 }} className="absolute left-8 bottom-12 pointer-events-none opacity-[0.15] z-0 hidden lg:block">
          <BistroSetDrawing className="w-[200px] h-[200px] stroke-[#1d3a2b]" />
        </motion.div>
        <motion.div style={isMounted ? { y: yBgSlow, rotate: 12 } : { rotate: 12 }} className="absolute right-10 bottom-6 pointer-events-none opacity-[0.15] z-0 hidden lg:block">
          <VintageVespaDrawing className="w-[180px] h-[140px] stroke-[#1d3a2b]" />
        </motion.div>

        <div className="relative mx-auto max-w-7xl px-6">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-center"
          >
            <BotanicalSprigDrawing className="mx-auto w-10 h-10 !opacity-[0.3] mb-2 !relative" />
            <motion.h2 variants={revealUp} className="font-heading text-4xl font-bold text-[#1d3a2b] sm:text-5xl">
              Gather &apos;round,
              <br />
              it&apos;s{" "}
              <span className="font-script text-[#e59b27]">family</span>{" "}
              time!
            </motion.h2>
            <motion.button
              variants={revealUp}
              onClick={() => onNavigate("assistant")}
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="bg-[#1d3a2b] px-7 py-3 text-[13px] font-bold uppercase tracking-[0.1em] text-[#f4f1ea] border-2 border-dashed border-[#e59b27]/40 rounded-sm transition-all hover:bg-[#14281e] active:scale-[0.97] mt-6"
            >
              Order Now
            </motion.button>
          </motion.div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════════════════
          SECTION 4.2 — CONTACT FORM ("Meal's Done. Always here, Always home")
         ═══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#f4f1ea] py-16 lg:py-20 border-t border-[#e9e5da]/40">
        {/* Scattered SVG Sketches */}
        <motion.div style={isMounted ? { y: yBgSlow, rotate: -8 } : { rotate: -8 }} className="absolute right-6 top-10 pointer-events-none opacity-[0.12] z-0 hidden lg:block">
          <BistroSetDrawing className="w-[190px] h-[190px] stroke-[#1d3a2b]" />
        </motion.div>
        <motion.div style={isMounted ? { y: yBgFast, rotate: 14 } : { rotate: 14 }} className="absolute left-6 bottom-10 pointer-events-none opacity-[0.12] z-0 hidden lg:block">
          <VintageVespaDrawing className="w-[180px] h-[140px] stroke-[#1d3a2b]" />
        </motion.div>
        <motion.div style={isMounted ? { y: yBgSlow, rotate: -5 } : { rotate: -5 }} className="absolute right-12 bottom-12 pointer-events-none opacity-[0.12] z-0 hidden lg:block">
          <BaguetteBasketDrawing className="w-[150px] h-[180px] stroke-[#1d3a2b]" />
        </motion.div>

        <div className="relative mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="font-heading text-4xl font-bold text-[#1d3a2b] sm:text-5xl">
              Meal&apos;s Done.
              <br />
              <span className="font-script text-[#e59b27] text-5xl sm:text-6xl">Always here</span> , Always home
            </h2>
          </div>

          <div className="grid gap-12 lg:grid-cols-2 items-start">
            {/* Left Column */}
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-[#1d3a2b]">
                We&apos;d Love to Hear from You.
              </h3>
              <p className="text-sm leading-relaxed text-[#1d3a2b]/70">
                As a valued patron, you are our extended family. Whether you have
                questions, catering requests, or simply want to connect, we&apos;re here
                to make you feel at home!
              </p>
              <div>
                <button
                  onClick={() => onNavigate("menu")}
                  className="bg-[#1d3a2b] px-6 py-2.5 text-[12px] font-bold uppercase tracking-[0.1em] text-[#f4f1ea] border-2 border-dashed border-[#e59b27]/40 rounded-sm transition-all hover:bg-[#14281e]"
                >
                  VISIT US IN STORE
                </button>
              </div>
              <div className="pt-4 opacity-85 max-w-[400px]">
                <PaddlingBoatDrawing className="w-full h-auto stroke-[#1d3a2b]" />
              </div>
            </div>

            {/* Right Column (Form) */}
            <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block space-y-2 text-xs font-bold uppercase tracking-wider text-[#1d3a2b]/70">
                  YOUR NAME
                  <input
                    type="text"
                    required
                    className="w-full mt-1.5 rounded-sm border border-[#e9e5da] bg-[#fffdf9]/50 px-4 py-2.5 text-sm text-[#1d3a2b] outline-none transition focus:border-[#1d3a2b]"
                  />
                </label>
                <label className="block space-y-2 text-xs font-bold uppercase tracking-wider text-[#1d3a2b]/70">
                  EMAIL ADDRESS
                  <input
                    type="email"
                    required
                    className="w-full mt-1.5 rounded-sm border border-[#e9e5da] bg-[#fffdf9]/50 px-4 py-2.5 text-sm text-[#1d3a2b] outline-none transition focus:border-[#1d3a2b]"
                  />
                </label>
              </div>
              <label className="block space-y-2 text-xs font-bold uppercase tracking-wider text-[#1d3a2b]/70">
                YOUR MESSAGE
                <textarea
                  rows={5}
                  required
                  className="w-full mt-1.5 rounded-sm border border-[#e9e5da] bg-[#fffdf9]/50 px-4 py-2.5 text-sm text-[#1d3a2b] outline-none transition focus:border-[#1d3a2b] resize-none"
                />
              </label>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-[#e59b27] px-6 py-2.5 text-[12px] font-bold uppercase tracking-[0.1em] text-[#1d3a2b] border-2 border-dashed border-[#1d3a2b]/40 rounded-sm transition-all hover:bg-[#d9911f]"
                >
                  SUBMIT
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 4.5 — MACARONS SPAN
         ═══════════════════════════════════════════════════════════ */}
      <section className="relative w-full bg-[#f4f1ea] py-12 lg:py-16 flex flex-col items-center overflow-hidden">
        {/* Parallax Background Drawings */}
        <motion.div style={isMounted ? { y: yBgFast, x: "-10%" } : { x: "-10%" }} className="absolute left-0 top-0 pointer-events-none opacity-[0.15] z-0 hidden lg:block">
          <ParisNotreDameDrawing className="w-[900px] h-[900px] stroke-[#1d3a2b]" />
        </motion.div>
        <motion.div style={isMounted ? { y: yBgSlow, x: "10%" } : { x: "10%" }} className="absolute right-0 top-0 pointer-events-none opacity-[0.15] z-0 hidden lg:block">
          <EiffelTowerDrawing className="w-[900px] h-[900px] stroke-[#1d3a2b]" />
        </motion.div>
        
        <motion.div style={isMounted ? { y: yBgFast, rotate: 12 } : { rotate: 12 }} className="absolute left-[25%] bottom-10 pointer-events-none opacity-[0.35] z-0 hidden lg:block">
          <StreetLampDrawing className="w-[140px] h-[280px] stroke-[#1d3a2b]" />
        </motion.div>
        <motion.div style={isMounted ? { y: yBgSlow, rotate: -10 } : { rotate: -10 }} className="absolute right-[25%] bottom-12 pointer-events-none opacity-[0.35] z-0 hidden lg:block">
          <CoffeeCupDrawing className="w-[150px] h-[150px] stroke-[#1d3a2b]" />
        </motion.div>

        {/* Extra Paris Background Drawings added */}
        <motion.div style={isMounted ? { y: stackL1, rotate: 5 } : { rotate: 5 }} className="absolute left-[15%] top-[10%] pointer-events-none opacity-[0.30] z-0 hidden lg:block">
          <ArcDeTriompheDrawing className="w-[200px] h-[200px] stroke-[#1d3a2b]" />
        </motion.div>
        <motion.div style={isMounted ? { y: stackL2, rotate: -15 } : { rotate: -15 }} className="absolute right-[20%] top-[20%] pointer-events-none opacity-[0.35] z-0 hidden lg:block">
          <CroissantDrawing className="w-[120px] h-[90px] stroke-[#1d3a2b]" />
        </motion.div>
        <motion.div style={isMounted ? { y: stackL3, rotate: -8 } : { rotate: -8 }} className="absolute left-[40%] bottom-[20%] pointer-events-none opacity-[0.30] z-0 hidden lg:block">
          <RoseBouquetDrawing className="w-[160px] h-[220px] stroke-[#1d3a2b]" />
        </motion.div>

        {/* EVEN MORE Drawings near Macarons */}
        <motion.div style={isMounted ? { y: yBgSlow, rotate: 10 } : { rotate: 10 }} className="absolute right-[12%] top-[30%] pointer-events-none opacity-[0.25] z-0 hidden lg:block">
          <RibbonDrawing className="w-[180px] h-[120px] stroke-[#1d3a2b]" />
        </motion.div>
        <motion.div style={isMounted ? { y: yBgFast, rotate: -5 } : { rotate: -5 }} className="absolute left-[8%] bottom-[30%] pointer-events-none opacity-[0.30] z-0 hidden lg:block">
          <FlowerPotSketch className="w-[140px] h-[180px] stroke-[#1d3a2b]" />
        </motion.div>
        <motion.div style={isMounted ? { y: stackBase, rotate: 15 } : { rotate: 15 }} className="absolute right-[35%] top-[5%] pointer-events-none opacity-[0.35] z-0 hidden lg:block">
          <FlyingBirdsSketch className="w-[120px] h-[100px] stroke-[#1d3a2b]" />
        </motion.div>
        <motion.div style={isMounted ? { y: stackL4, rotate: -20 } : { rotate: -20 }} className="absolute left-[30%] top-[15%] pointer-events-none opacity-[0.30] z-0 hidden lg:block">
          <BaguetteBasketDrawing className="w-[140px] h-[160px] stroke-[#1d3a2b]" />
        </motion.div>

        {/* Parallax Sprigs */}
        <motion.div style={isMounted ? { y: yBgFast, rotate: rotateBg } : {}} className="absolute left-[10%] top-[20%] pointer-events-none opacity-[0.35] z-0 hidden sm:block">
          <BotanicalSprigDrawing className="w-32 h-32" />
        </motion.div>
        <motion.div style={isMounted ? { y: yBgSlow, rotate: rotateBg } : {}} className="absolute right-[5%] bottom-[10%] pointer-events-none opacity-[0.35] z-0">
          <BotanicalSprigDrawing className="w-48 h-48 scale-x-[-1]" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
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
          SECTION 4.6 — VIET CUISINE ORDER SECTION (TORN PAPER)
         ═══════════════════════════════════════════════════════════ */}
      <section className="relative w-full bg-[#f4f1ea] py-20 lg:py-28 flex flex-col items-center overflow-hidden">
        {/* Scattered Background Drawings */}
        <div className="absolute right-[5%] top-[15%] pointer-events-none opacity-[0.40] z-0 hidden lg:block rotate-12 scale-125">
          <WineGlassDrawing className="w-24 h-24 stroke-[#1d3a2b]" />
        </div>
        <div className="absolute left-[3%] bottom-[15%] pointer-events-none opacity-[0.40] z-0 hidden lg:block -rotate-6 scale-110">
          <HeelsDrawing className="w-32 h-32 stroke-[#1d3a2b]" />
        </div>
        <div className="absolute right-[15%] bottom-[10%] pointer-events-none opacity-[0.40] z-0 hidden lg:block -rotate-12 scale-150">
          <BotanicalSprigDrawing className="w-28 h-28 stroke-[#1d3a2b]" />
        </div>
        <div className="absolute left-[40%] top-[8%] pointer-events-none opacity-[0.40] z-0 hidden lg:block rotate-45 scale-110">
          <BotanicalSprigDrawing className="w-20 h-20 stroke-[#1d3a2b]" />
        </div>
        <div className="absolute left-[30%] bottom-[8%] pointer-events-none opacity-[0.40] z-0 hidden lg:block -rotate-12 scale-90">
          <WineGlassDrawing className="w-20 h-20 stroke-[#1d3a2b]" />
        </div>
        <div className="absolute right-[40%] top-[35%] pointer-events-none opacity-[0.40] z-0 hidden lg:block -rotate-45 scale-100">
          <HeelsDrawing className="w-24 h-24 stroke-[#1d3a2b]" />
        </div>

        {/* Torn Paper Top Border */}
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-10 translate-y-[-1px]">
          <svg
            viewBox="0 0 1200 40"
            className="relative block w-full h-10 text-white fill-current filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.06)]"
            preserveAspectRatio="none"
          >
            <path
              d="M 0 0 L 1200 0 L 1200 25 L 1200.0 24.3 L 1185.0 23.8 L 1170.0 26.4 L 1155.0 30.8 L 1140.0 31.4 L 1125.0 27.5 L 1110.0 24.5 L 1095.0 24.3 L 1080.0 22.7 L 1065.0 19.0 L 1050.0 17.9 L 1035.0 22.0 L 1020.0 26.4 L 1005.0 27.2 L 990.0 27.2 L 975.0 29.6 L 960.0 30.9 L 945.0 27.4 L 930.0 22.6 L 915.0 21.8 L 900.0 23.5 L 885.0 23.1 L 870.0 21.9 L 855.0 24.1 L 840.0 28.4 L 825.0 29.0 L 810.0 25.7 L 795.0 23.8 L 780.0 24.6 L 765.0 23.9 L 750.0 20.9 L 735.0 20.6 L 720.0 24.9 L 705.0 28.8 L 690.0 28.6 L 675.0 27.8 L 660.0 29.2 L 645.0 29.3 L 630.0 24.9 L 615.0 19.9 L 600.0 19.3 L 585.0 21.4 L 570.0 21.7 L 555.0 21.5 L 540.0 25.0 L 525.0 30.1 L 510.0 31.1 L 495.0 28.1 L 480.0 26.3 L 465.0 26.7 L 450.0 25.0 L 435.0 21.0 L 420.0 19.9 L 405.0 23.5 L 390.0 26.5 L 375.0 25.9 L 360.0 25.4 L 345.0 27.4 L 330.0 28.2 L 315.0 24.5 L 300.0 20.7 L 285.0 21.3 L 270.0 23.9 L 255.0 24.2 L 240.0 24.0 L 225.0 27.1 L 210.0 31.3 L 195.0 30.9 L 180.0 26.8 L 165.0 24.4 L 150.0 24.2 L 135.0 22.2 L 120.0 18.4 L 105.0 18.3 L 90.0 22.9 L 75.0 26.8 L 60.0 27.1 L 45.0 27.5 L 30.0 30.1 L 15.0 30.6 L 0.0 26.5 Z"
              className="text-white fill-current"
            />
          </svg>
          
          {/* Sketchy leaf drawing elements in the top border */}
          <div className="absolute left-[12%] top-0 pointer-events-none opacity-[0.25] z-20">
            <BotanicalSprigDrawing className="w-16 h-16 stroke-[#1d3a2b]" />
          </div>
          <div className="absolute right-[12%] top-0 pointer-events-none opacity-[0.25] z-20 scale-x-[-1]">
            <BotanicalSprigDrawing className="w-16 h-16 stroke-[#1d3a2b]" />
          </div>
        </div>

        {/* Content container */}
        <div className="relative w-full max-w-7xl px-6 py-8 flex flex-col lg:flex-row items-center justify-between gap-12 z-20">
          
          {/* Left Column: Mascot Girl Sticker */}
          <div className="relative w-full lg:w-1/2 flex items-center justify-center min-h-[360px]">
            
            {/* Chef Girl Mascot Sticker */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
              whileInView={{ opacity: 1, scale: 1, rotate: -2 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="relative z-30 w-[240px] sm:w-[320px] drop-shadow-[0_8px_16px_rgba(0,0,0,0.12)] cursor-pointer"
              whileHover={{ scale: 1.05, rotate: -4 }}
            >
              <Image
                src="/viet_chef_girl.png"
                alt="Chef mascot"
                width={250}
                height={250}
                className="w-full h-auto object-contain"
              />
            </motion.div>
          </div>

          {/* Right Column: Title, Description, and Buttons */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="w-full lg:w-1/2 flex flex-col justify-center text-left"
          >
            <motion.h2
              variants={revealUp}
              className="font-heading leading-[0.9] text-[#1d3a2b] flex flex-col"
            >
              <span className="text-5xl sm:text-7xl font-bold uppercase tracking-wider">Viet</span>
              <span className="font-script text-[#e59b27] text-6xl sm:text-8xl lowercase mt-2 -mb-2">cuisine</span>
              <span className="text-5xl sm:text-7xl font-bold uppercase tracking-wider mt-2">Made</span>
              <div className="flex flex-wrap items-baseline gap-4 mt-2">
                <span className="font-script text-[#e59b27] text-6xl sm:text-8xl lowercase">fresh</span>
                <span className="text-5xl sm:text-7xl font-bold uppercase tracking-wider">Daily</span>
              </div>
            </motion.h2>

            <motion.p
              variants={revealUp}
              className="mt-6 max-w-lg text-sm sm:text-base leading-relaxed text-[#1d3a2b]/80 font-sans"
            >
              For Mr. Spring & Mrs. Fresh, every meal is a shared memory. Taste the authentic dishes we
              grew up loving — prepared daily with fresh ingredients and care, using recipes honoured
              through generations.
            </motion.p>

            <motion.div
              variants={revealUp}
              className="mt-8 flex flex-wrap gap-4"
            >
              <button
                onClick={() => onNavigate("menu")}
                className="bg-[#1d3a2b] text-[#f4f1ea] border-2 border-dashed border-[#e59b27]/40 rounded-sm px-6 py-3 font-bold uppercase text-[12px] tracking-[0.1em] transition-all hover:bg-[#14281e] active:scale-[0.97]"
              >
                Explore Our Menu
              </button>
              <button
                onClick={() => onNavigate("assistant")}
                className="bg-[#e59b27] text-[#1d3a2b] border-2 border-dashed border-[#1d3a2b]/40 rounded-sm px-6 py-3 font-bold uppercase text-[12px] tracking-[0.1em] transition-all hover:bg-[#d9911f] active:scale-[0.97]"
              >
                Order Now
              </button>
            </motion.div>
          </motion.div>
        </div>

        {/* Torn Paper Bottom Border */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10 translate-y-[1px]">
          <svg
            viewBox="0 0 1200 40"
            className="relative block w-full h-10 text-white fill-current filter drop-shadow-[0_-4px_6px_rgba(0,0,0,0.06)]"
            preserveAspectRatio="none"
          >
            <path
              d="M 0 40 L 1200 40 L 1200 15 L 1200.0 11.3 L 1185.0 12.5 L 1170.0 13.2 L 1155.0 13.3 L 1140.0 15.3 L 1125.0 19.4 L 1110.0 22.0 L 1095.0 19.7 L 1080.0 14.1 L 1065.0 10.1 L 1050.0 10.0 L 1035.0 11.8 L 1020.0 12.7 L 1005.0 13.6 L 990.0 16.5 L 975.0 20.3 L 960.0 21.2 L 945.0 17.4 L 930.0 12.4 L 915.0 10.7 L 900.0 12.6 L 885.0 14.6 L 870.0 14.8 L 855.0 14.8 L 840.0 16.5 L 825.0 18.2 L 810.0 16.7 L 795.0 12.6 L 780.0 10.1 L 765.0 12.1 L 750.0 16.4 L 735.0 18.8 L 720.0 18.1 L 705.0 16.9 L 690.0 16.8 L 675.0 15.9 L 660.0 12.4 L 645.0 8.6 L 630.0 8.7 L 615.0 13.4 L 600.0 18.7 L 585.0 20.3 L 570.0 18.9 L 555.0 17.5 L 540.0 16.9 L 525.0 15.0 L 510.0 11.1 L 495.0 8.6 L 480.0 10.6 L 465.0 15.7 L 450.0 19.1 L 435.0 18.4 L 420.0 16.0 L 405.0 15.1 L 390.0 15.3 L 375.0 14.4 L 360.0 12.3 L 345.0 12.2 L 330.0 15.6 L 315.0 19.3 L 300.0 19.2 L 285.0 15.3 L 270.0 11.8 L 255.0 11.4 L 240.0 12.7 L 225.0 13.2 L 210.0 13.5 L 195.0 15.9 L 180.0 20.1 L 165.0 22.0 L 150.0 18.9 L 135.0 13.2 L 120.0 9.8 L 105.0 10.3 L 90.0 12.0 L 75.0 12.8 L 60.0 13.9 L 45.0 17.2 L 30.0 20.8 L 15.0 20.8 L 0.0 16.5 Z"
              className="text-white fill-current"
            />
          </svg>
        </div>
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
          © 2026 GrubToGo. All rights reserved. Designed
          with ♥ for good food.
        </div>
      </footer>

      {/* Floating Scroll to Top button */}
      {showScrollTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-8 right-8 z-50 flex h-10 w-10 items-center justify-center bg-[#e59b27] text-[#1d3a2b] border-2 border-dashed border-[#1d3a2b]/30 rounded-sm shadow-md transition-all hover:bg-[#d9911f] active:scale-[1.10] cursor-pointer"
          title="Back to Top"
        >
          <svg
            className="w-5 h-5 stroke-current"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </motion.button>
      )}
    </div>
  );
}
