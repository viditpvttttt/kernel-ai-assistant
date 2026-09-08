import { motion, type Variants } from "motion/react";

import { cn } from "@/lib/utils";

/**
 * Skiper.UI TextRoll (skiper58) — text rolls up on hover, revealing a
 * fresh copy from below. Each letter staggers for a cascading effect.
 */
const topVariants: Variants = {
  rest: { y: "0%" },
  hover: { y: "-100%" },
};

const bottomVariants: Variants = {
  rest: { y: "100%" },
  hover: { y: "0%" },
};

export function TextRoll({
  children,
  className,
  stagger = 0.02,
}: {
  children: string;
  className?: string;
  stagger?: number;
}) {
  const chars = children.split("");
  return (
    <motion.span
      className={cn("relative inline-block overflow-hidden", className)}
      initial="rest"
      whileHover="hover"
    >
      <span className="inline-block">
        {chars.map((char, i) => (
          <motion.span
            key={i}
            variants={topVariants}
            className="inline-block"
            transition={{ duration: 0.3, delay: i * stagger, ease: [0.22, 1, 0.36, 1] }}
          >
            {char}
          </motion.span>
        ))}
      </span>
      <span className="absolute inset-0">
        {chars.map((char, i) => (
          <motion.span
            key={i}
            variants={bottomVariants}
            className="inline-block"
            transition={{ duration: 0.3, delay: i * stagger, ease: [0.22, 1, 0.36, 1] }}
          >
            {char}
          </motion.span>
        ))}
      </span>
    </motion.span>
  );
}
