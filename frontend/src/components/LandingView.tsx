"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Shield, Clock, Cpu, Award, Zap, FileText } from "lucide-react";
import { SaigonCathedralDrawing } from "@/components/BackgroundDrawings";
import { cardReveal, revealUp, staggerContainer } from "@/lib/motion";

interface LandingViewProps {
  onNavigate: (view: string) => void;
}

export default function LandingView({ onNavigate }: LandingViewProps) {
  const shouldReduceMotion = useReducedMotion();
  const limitedLoopCount = 6;
  // SVG pipeline animations
  const steps = [
    { label: "Upload Image", icon: "📸" },
    { label: "AI Analysis", icon: "🧠" },
    { label: "Constraint Validation", icon: "🛡️" },
    { label: "AI Artifact", icon: "📄" },
    { label: "GB-DCT Generation", icon: "🔑" },
    { label: "Redemption", icon: "🍽️" }
  ];

  return (
    <div className="space-y-20 pb-20 relative overflow-hidden">
      {/* Background Drawing */}
      <SaigonCathedralDrawing className="opacity-[0.08] stroke-[#1d3a2b]" />

      {/* Hero Section */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="relative overflow-hidden py-16 lg:py-24 border-b border-[#e9e5da]"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(229,155,39,0.06),transparent)] pointer-events-none" />
        <div className="cyber-grid absolute inset-0 opacity-40 pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center px-4 space-y-6 relative z-10">
          <motion.div
            variants={revealUp}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#e59b27]/30 bg-[#e59b27]/5 text-[#e59b27] text-xs font-mono font-bold"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Cybersecurity × Agentic AI Research Prototype</span>
          </motion.div>

          <motion.h1
            variants={revealUp}
            className="text-6xl md:text-8xl font-extrabold tracking-tight outlined-text"
          >
            GrubToGo
          </motion.h1>

          <motion.h2
            variants={revealUp}
            className="text-lg md:text-2xl font-bold text-[#1d3a2b] max-w-2xl mx-auto leading-relaxed"
          >
            Agentic AI Powered Custom Dish Generation & Secure Dining Orchestration
          </motion.h2>

          <motion.p
            variants={revealUp}
            className="text-[#1d3a2b]/70 max-w-2xl mx-auto text-sm md:text-base leading-relaxed"
          >
            Generate personalized dishes from images and preferences while securing AI decisions with 
            <span className="text-[#1d3a2b] font-bold font-mono"> Generation-Bound Dynamic Commitment Tokens (GB-DCT)</span> to prevent real-world action drift.
          </motion.p>

          <motion.div
            variants={revealUp}
            className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
          >
            <motion.button
              onClick={() => onNavigate("generate")}
              whileHover={shouldReduceMotion ? undefined : { y: -1.5, scale: 1.01 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.99 }}
              className="px-8 py-3 rounded-lg bg-[#1d3a2b] hover:bg-[#14281e] text-[#f4f1ea] font-bold transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              <span>Generate Dish</span>
              <ArrowRight className="w-4 h-4 text-[#e59b27]" />
            </motion.button>
            <motion.button
              onClick={() => onNavigate("research")}
              whileHover={shouldReduceMotion ? undefined : { y: -1.5, scale: 1.01 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.99 }}
              className="px-8 py-3 rounded-lg border border-[#e9e5da] bg-white hover:bg-[#fffdf9] text-[#1d3a2b] font-bold transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
            >
              <FileText className="w-4 h-4 text-[#e59b27]" />
              <span>View Research Demo</span>
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* Animated Architecture Illustration */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className="max-w-5xl mx-auto px-4"
      >
        <div className="text-center mb-10">
          <h3 className="text-xs font-mono uppercase tracking-wider text-[#e59b27] font-bold">Security Flow Pipeline</h3>
          <h4 className="text-2xl font-bold text-[#1d3a2b] mt-2">End-to-End Cryptographic Dining Lease Pipeline</h4>
        </div>

        <div className="bg-white border border-[#e9e5da] rounded-2xl p-8 relative overflow-hidden shadow-sm">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(229,155,39,0.02),transparent)] pointer-events-none" />
          
          <div className="grid grid-cols-2 md:grid-cols-6 gap-6 relative z-10">
            {steps.map((step, idx) => (
              <motion.div key={idx} variants={cardReveal} className="relative flex flex-col items-center group">
                {/* Connecting arrow for desktop */}
                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute top-7 left-[60%] w-[80%] h-0.5 border-t border-dashed border-[#e9e5da] z-0">
                    <motion.div
                      className="h-full bg-[#e59b27] w-4 rounded-full"
                      animate={shouldReduceMotion ? undefined : { x: ["0%", "450%"] }}
                      transition={{
                        duration: 3,
                        repeat: shouldReduceMotion ? 0 : limitedLoopCount,
                        ease: "linear",
                        delay: idx * 0.5
                      }}
                    />
                  </div>
                )}

                <motion.div
                  whileHover={shouldReduceMotion ? undefined : { y: -2 }}
                  transition={{ duration: 0.2 }}
                  className="w-14 h-14 rounded-xl bg-[#f4f1ea] border border-[#e9e5da] flex items-center justify-center text-2xl relative z-10 shadow-sm group-hover:border-[#e59b27]/40 transition-all duration-300"
                >
                  <motion.div
                    className="absolute inset-0 rounded-xl bg-[#e59b27]/5 opacity-0 group-hover:opacity-100 transition-opacity"
                    animate={shouldReduceMotion ? undefined : { scale: [1, 1.12, 1] }}
                    transition={{ duration: 2.2, repeat: shouldReduceMotion ? 0 : limitedLoopCount }}
                  />
                  <span>{step.icon}</span>
                </motion.div>
                
                <span className="text-xs font-mono font-bold text-[#1d3a2b]/80 mt-3 text-center px-1">
                  {step.label}
                </span>

                <div className="text-[10px] font-mono text-[#1d3a2b]/40 mt-1">
                  0{idx + 1}.0
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Research Section */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="max-w-5xl mx-auto px-4 space-y-12"
      >
        <motion.div variants={revealUp} className="text-center space-y-2">
          <h3 className="text-xs font-mono uppercase tracking-wider text-[#e59b27] font-bold">Academic Underpinnings</h3>
          <h4 className="text-3xl font-bold text-[#1d3a2b]">The Core Threat Model: Commitment Amplification</h4>
          <p className="text-[#1d3a2b]/70 max-w-xl mx-auto text-sm">
            Evaluating critical security vulnerabilities that arise when soft AI decisions bind into irreversible physical actions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <motion.div
            variants={cardReveal}
            whileHover={shouldReduceMotion ? undefined : { y: -4 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.997 }}
            className="p-6 rounded-xl border border-[#e9e5da] bg-white hover:border-[#e59b27]/40 transition-all duration-300 space-y-4 shadow-sm"
          >
            <div className="w-10 h-10 rounded-lg bg-[#1d3a2b]/5 flex items-center justify-center text-[#1d3a2b]">
              <Cpu className="w-5 h-5 text-[#e59b27]" />
            </div>
            <h5 className="text-base font-bold text-[#1d3a2b]">Commitment Amplification</h5>
            <p className="text-xs text-[#1d3a2b]/80 leading-relaxed">
              When an agentic system acts on behalf of a user, it verifies soft parameters (budget, dietary bans, pantry stock). 
              If the agent commits to an action (e.g. charging a payment, firing a kitchen order) before confirming the final transaction, any underlying AI hallucination or error is locked in as a real-world loss.
            </p>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            variants={cardReveal}
            whileHover={shouldReduceMotion ? undefined : { y: -4 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.997 }}
            className="p-6 rounded-xl border border-[#e9e5da] bg-white hover:border-[#e59b27]/40 transition-all duration-300 space-y-4 shadow-sm"
          >
            <div className="w-10 h-10 rounded-lg bg-[#e59b27]/5 flex items-center justify-center text-[#e59b27]">
              <Clock className="w-5 h-5 text-[#e59b27]" />
            </div>
            <h5 className="text-base font-bold text-[#1d3a2b]">The Temporal Gap</h5>
            <p className="text-xs text-[#1d3a2b]/80 leading-relaxed">
              The time elapsed between when the AI analyzes the state and when the physical transaction takes place. 
              In the real world, database records drift, inventory depletes, prices change, and dietary regulations shift, rendering the original commitment invalid.
            </p>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            variants={cardReveal}
            whileHover={shouldReduceMotion ? undefined : { y: -4 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.997 }}
            className="p-6 rounded-xl border border-[#e9e5da] bg-white hover:border-[#e59b27]/40 transition-all duration-300 space-y-4 shadow-sm"
          >
            <div className="w-10 h-10 rounded-lg bg-[#1d3a2b]/5 flex items-center justify-center text-[#1d3a2b]">
              <Award className="w-5 h-5 text-[#e59b27]" />
            </div>
            <h5 className="text-base font-bold text-[#1d3a2b]">Generation-Bound DCT</h5>
            <p className="text-xs text-[#1d3a2b]/80 leading-relaxed">
              Our proposed countermeasure: cryptographic tokens bound to the specific snapshot of the world state at generation. 
              Upon redemption, the validation engine compares the live world state against the token's cryptographic root hash, self-invalidating if any drift occurs.
            </p>
          </motion.div>
        </div>

        {/* Real-time system monitor block */}
        <motion.div
          variants={revealUp}
          className="border border-[#e9e5da] rounded-xl bg-white p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm"
        >
          <div className="space-y-1">
            <h6 className="text-sm font-bold text-[#1d3a2b]">Ready to test the vulnerability model?</h6>
            <p className="text-xs text-[#1d3a2b]/60">Navigate to the Sandbox to simulate ingredient outages and pricing inflation in real time.</p>
          </div>
          <motion.button
            onClick={() => onNavigate("generate")}
            whileHover={shouldReduceMotion ? undefined : { y: -1.5 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.99 }}
            className="px-5 py-2.5 rounded-lg bg-[#1d3a2b] hover:bg-[#14281e] text-[#f4f1ea] font-bold transition-all text-xs flex items-center gap-1.5 whitespace-nowrap self-stretch md:self-auto justify-center"
          >
            <span>Launch Generation Sandbox</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#e59b27]" />
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
