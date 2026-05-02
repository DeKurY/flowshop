"use client";

import { HTMLMotionProps, motion } from "framer-motion";
import { forwardRef } from "react";
import clsx from "clsx";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "outline" | "ghost";
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { children, variant = "primary", fullWidth = false, className, ...props },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center px-7 py-3.5 rounded-pill font-sans text-xs uppercase tracking-[0.05em] font-semibold cursor-pointer transition-all duration-300 border-none outline-none";
    
    const variants = {
      primary: "bg-accent text-white hover:bg-accent-hover",
      outline: "bg-transparent border border-border text-text-main hover:border-text-main",
      ghost: "bg-surface text-text-main hover:bg-surface-hover",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.98 }}
        className={clsx(
          baseStyles,
          variants[variant],
          fullWidth && "w-full",
          className
        )}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export default Button;
