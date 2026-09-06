import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

/**
 * Soft pastel corner wash on paper — sky blue top-left, orchid right,
 * coral bottom. Decorative only; never intercepts pointer events.
 */
export function PastelWash({ className }: { className?: string }) {
  const reduced = useReducedMotion();
  const float = (x: number[], y: number[], duration: number) =>
    reduced
      ? {}
      : {
          animate: { x, y },
          transition: { duration, repeat: Infinity, ease: "easeInOut" as const },
        };

  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <motion.div
        className="absolute -top-[26%] -left-[18%] h-[70vh] w-[70vw] rounded-full blur-[110px]"
        style={{ background: "radial-gradient(circle at 50% 50%, oklch(0.86 0.07 245 / 75%), transparent 70%)" }}
        {...float([0, 50, -20, 0], [0, 30, 12, 0], 30)}
      />
      <motion.div
        className="absolute top-[4%] -right-[16%] h-[75vh] w-[62vw] rounded-full blur-[120px]"
        style={{ background: "radial-gradient(circle at 50% 50%, oklch(0.87 0.08 330 / 78%), transparent 70%)" }}
        {...float([0, -45, 18, 0], [0, 34, -18, 0], 36)}
      />
      <motion.div
        className="absolute -bottom-[30%] left-[22%] h-[70vh] w-[70vw] rounded-full blur-[120px]"
        style={{ background: "radial-gradient(circle at 50% 50%, oklch(0.87 0.09 45 / 72%), transparent 70%)" }}
        {...float([0, 40, -34, 0], [0, -26, 18, 0], 34)}
      />
      <motion.div
        className="absolute -bottom-[22%] -right-[10%] h-[55vh] w-[45vw] rounded-full blur-[110px]"
        style={{ background: "radial-gradient(circle at 50% 50%, oklch(0.85 0.1 25 / 65%), transparent 70%)" }}
        {...float([0, -30, 26, 0], [0, 22, -24, 0], 28)}
      />
      <div className="film-grain absolute inset-0 opacity-60" />
    </div>
  );
}
