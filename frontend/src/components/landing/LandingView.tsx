"use client";// This directive indicates that the code is intended to run on the client side, enabling features like interactivity and state management in a React application.

import { motion, useReducedMotion } from "framer-motion"; // Importing motion and useReducedMotion from framer-motion for animations and motion preferences
import { ArrowRight, Shield } from "lucide-react"; // Importing icons from lucide-react for use in the UI
import { SaigonCathedralDrawing } from "@/components/BackgroundDrawings"; // Importing a custom background drawing component for visual enhancement
import { revealUp, staggerContainer } from "@/lib/motion"; // Importing animation variants for motion effects

interface LandingViewProps {// Defining the props interface for the LandingView component This is a TypeScript interface defining the "shape" of the props (properties) that our LandingView component expects to receive.
  onNavigate: (view: string) => void;// A function prop that handles navigation to different views based on the provided string
}

export default function LandingView({ onNavigate }: LandingViewProps) {// Defining the LandingView functional component that takes onNavigate as a prop
  const shouldReduceMotion = useReducedMotion();// Using the useReducedMotion hook to determine if the user prefers reduced motion for accessibility reasons

  return ({/* The component returns a JSX structure that represents the landing view of the application. It includes a background drawing, a hero section with a title, subtitle, description, and a button to start ordering. The button triggers the onNavigate function when clicked. */}
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
          <span>Your Personal AI Dining Assistant</span>
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
          Order Exactly What You Crave, Effortlessly.
          </motion.h2>

          <motion.p
          variants={revealUp}
          className="text-[#1d3a2b]/70 max-w-2xl mx-auto text-sm md:text-base leading-relaxed"
          >
          Tell our AI what you desire – from "a spicy vegetarian dinner under ₹300" to "something high in protein" – 
          and let it handle the rest. No more endless browsing, just perfect meals tailored for you.
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
              <span>Start Ordering</span>
              <ArrowRight className="w-4 h-4 text-[#e59b27]" />
            </motion.button>
          </motion.div>
        </div>
      </motion.div>


  );
}

