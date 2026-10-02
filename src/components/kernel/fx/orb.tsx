import { motion } from "motion/react";

import { cn } from "@/lib/utils";

/**
 * Premium animated orb — layered gradient spheres with pulsing glow, slow rotation,
 * and an inner shimmer. Inspired by skiper.ui / 21st.dev orb effects.
 *
 * Purely decorative; never intercepts pointer events.
 */
export function Orb({
  size = 120,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <motion.div
      aria-hidden
      className={cn("pointer-events-none relative", className)}
      style={{ width: size, height: size }}
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Outer pulsing glow */}
      <motion.div
        className="absolute inset-0 rounded-full blur-2xl"
        style={{
          background:
            "conic-gradient(from 0deg, oklch(0.7 0.15 250), oklch(0.68 0.18 300), oklch(0.75 0.14 10), oklch(0.7 0.15 250))",
        }}
        animate={{ opacity: [0.3, 0.55, 0.3], scale: [1, 1.12, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Rotating gradient ring */}
      <motion.div
        className="absolute inset-[8%] rounded-full blur-md"
        style={{
          background:
            "conic-gradient(from 0deg, transparent, oklch(0.75 0.16 260 / 60%), transparent, oklch(0.72 0.18 300 / 50%), transparent)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      />

      {/* Core sphere with subtle sheen */}
      <motion.div
        className="absolute inset-[18%] rounded-full"
        style={{
          background:
            "radial-gradient(circle at 35% 30%, oklch(0.85 0.08 250 / 90%), oklch(0.3 0.05 260 / 95%) 70%)",
          boxShadow:
            "inset 0 -8px 24px oklch(0.2 0.02 260 / 40%), inset 0 8px 20px oklch(0.9 0.06 250 / 25%)",
        }}
        animate={{ scale: [1, 1.03, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Highlight reflection */}
        <motion.div
          className="absolute left-[20%] top-[15%] h-[30%] w-[40%] rounded-full bg-white/30 blur-sm"
          animate={{ opacity: [0.4, 0.65, 0.4] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Orbiting particle */}
      <motion.div
        className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/70 blur-[1px]"
        animate={{
          x: [0, size * 0.42, 0, -size * 0.42, 0],
          y: [0, 0, -size * 0.42, 0, 0],
          scale: [0.8, 1.2, 0.8, 1.2, 0.8],
          opacity: [0.5, 0.9, 0.5, 0.9, 0.5],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
}
