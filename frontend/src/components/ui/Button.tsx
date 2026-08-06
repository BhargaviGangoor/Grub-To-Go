import React from 'react';
import { motion, useReducedMotion, type HTMLMotionProps } from 'framer-motion';
import { sweepFill } from "@/lib/variants";

type ButtonProps = Omit<HTMLMotionProps<'button'>, 'ref'> & {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const prefersReducedMotion = useReducedMotion();
    const baseClasses =
      'gtg-button relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full border font-semibold uppercase tracking-[0.14em] transition-[color,transform,border-color,box-shadow,background-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] focus:outline-none focus:ring-2 focus:ring-[#e59b27]/35 focus:ring-offset-2 focus:ring-offset-[#f3eedf] disabled:pointer-events-none disabled:opacity-50';

    const variantClasses = {
      primary: 'gtg-button--primary border-transparent bg-[#1d3a2b] text-[#f8f3e6] shadow-[0_18px_40px_rgba(29,58,43,0.18)]',
      secondary:
        'gtg-button--secondary border-[#1d3a2b]/20 bg-[rgba(255,255,255,0.42)] text-[#1d3a2b] shadow-[0_10px_24px_rgba(29,58,43,0.08)]',
    };

    const sizeClasses = {
      sm: 'px-4 py-2 text-[11px]',
      md: 'px-6 py-3 text-[12px]',
      lg: 'px-8 py-4 text-[13px]',
    };

    const classes = [
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      className,
    ]
      .join(' ')
      .trim();

    return (
      <motion.button
        ref={ref}
        data-variant={variant}
        className={classes}
        initial="rest"
        animate="rest"
        whileHover={prefersReducedMotion ? undefined : { scale: 1.02, y: -1 }}
        whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
        {...props}
      >
        {!prefersReducedMotion ? (
          <motion.span
            aria-hidden="true"
            variants={sweepFill}
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundColor: variant === 'primary' ? '#e59b27' : 'rgba(29, 58, 43, 0.08)',
            }}
          />
        ) : null}
        {children as React.ReactNode}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
