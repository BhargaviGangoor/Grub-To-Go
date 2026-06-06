import type { Transition, Variants } from "framer-motion";

export const navSpring: Transition = {
  type: "spring",
  stiffness: 320,
  damping: 28,
};

export const pageTransition: Transition = {
  duration: 0.25,
  ease: "easeOut",
};

export const pageVariants: Variants = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -15 },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

export const revealUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: "easeOut",
    },
  },
};

export const cardReveal: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

export const overlayFade: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 0.4 },
  exit: { opacity: 0 },
};

export const drawerSlide: Variants = {
  initial: { x: "-100%" },
  animate: { x: 0 },
  exit: { x: "-100%" },
};

export const bgFadeScale: Variants = {
  initial: { opacity: 0, scale: 1 },
  animate: { opacity: 0.26, scale: 1.03 },
  exit: { opacity: 0 },
};
