"use client";

import type { PropsWithChildren } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { brandEase } from "@/lib/motion";

type Direction = "up" | "left" | "right" | "none";

type ScrollRevealProps = PropsWithChildren<{
  className?: string;
  direction?: Direction;
  delay?: number;
  duration?: number;
  amount?: number;
  once?: boolean;
  scale?: boolean;
}>;

function getOffset(direction: Direction) {
  switch (direction) {
    case "left":
      return { x: -28, y: 0 };
    case "right":
      return { x: 28, y: 0 };
    case "none":
      return { x: 0, y: 0 };
    case "up":
    default:
      return { x: 0, y: 24 };
  }
}

export function ScrollRevealGroup({
  children,
  className,
  delay = 0,
  amount = 0.2,
  once = true,
}: ScrollRevealProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ amount, once }}
      variants={{
        hidden: {},
        show: {
          transition: prefersReducedMotion
            ? undefined
            : {
                delayChildren: delay,
                staggerChildren: 0.12,
              },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function ScrollRevealItem({
  children,
  className,
  direction = "up",
  delay = 0,
  duration = 0.72,
  amount = 0.2,
  once = true,
  scale = false,
}: ScrollRevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const offset = getOffset(direction);

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ amount, once }}
      variants={{
        hidden: {
          opacity: 0,
          x: prefersReducedMotion ? 0 : offset.x,
          y: prefersReducedMotion ? 0 : offset.y,
          scale: prefersReducedMotion ? 1 : scale ? 0.96 : 1,
        },
        show: {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          transition: {
            duration: prefersReducedMotion ? 0.01 : duration,
            delay: prefersReducedMotion ? 0 : delay,
            ease: brandEase,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}