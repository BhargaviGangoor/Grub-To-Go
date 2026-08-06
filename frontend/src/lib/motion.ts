import type { Transition, Variants } from "framer-motion";

export const brandEase = [0.22, 1, 0.36, 1] as const;
export const brandBackEase = [0.34, 1.56, 0.64, 1] as const;

export const navSpring: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 30,
};

export const pageTransition: Transition = {
  duration: 0.3,
  ease: brandEase,
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
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

export const revealUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.68,
      ease: brandEase,
    },
  },
};

export const heroWordReveal: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.62,
      ease: brandEase,
    },
  },
};

export const heroAccentReveal: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.74,
      ease: brandBackEase,
    },
  },
};

export const heroCtaReveal: Variants = {
  hidden: { opacity: 0, y: 14, scale: 0.9 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.55,
      ease: brandEase,
    },
  },
};

export const cardReveal: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.72,
      ease: brandEase,
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
