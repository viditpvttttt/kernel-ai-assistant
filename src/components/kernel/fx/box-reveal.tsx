import { motion } from "motion/react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Mask reveal: content slides up from behind a clipped edge while a thin
 * spectral shutter wipes across it. Used for section headings.
 */
export function BoxReveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <span className={cn("relative block overflow-hidden", className)}>
      <motion.span
        className="block"
        initial={{ y: "110%", opacity: 0 }}
        whileInView={{ y: "0%", opacity: 1 }}
        viewport={{ once: true, margin: "-70px" }}
        transition={{ duration: 0.85, delay, ease: [0.76, 0, 0.24, 1] }}
      >
        {children}
      </motion.span>
      <motion.span
        aria-hidden
        className="spectral-bar absolute inset-0 origin-left"
        initial={{ scaleX: 0, opacity: 0.75 }}
        whileInView={{ scaleX: [0, 1, 1], opacity: [0.75, 0.5, 0] }}
        viewport={{ once: true, margin: "-70px" }}
        transition={{ duration: 0.9, delay, ease: [0.76, 0, 0.24, 1] }}
        style={{ transformOrigin: "left" }}
      />
    </span>
  );
}
