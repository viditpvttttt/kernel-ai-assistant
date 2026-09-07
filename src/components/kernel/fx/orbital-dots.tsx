import { motion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * New Kernel mark — 12 black circles arranged in an elliptical ring,
 * like a loading spinner viewed at an angle. Replaces the old PNG mark.
 */
export function OrbitalDots({
  className,
  spin = false,
}: {
  className?: string;
  spin?: boolean;
}) {
  const dots = Array.from({ length: 12 });
  const rx = 22;
  const ry = 10;

  return (
    <motion.svg
      viewBox="0 0 56 28"
      className={cn("select-none", className)}
      animate={spin ? { rotate: 360 } : { rotate: 0 }}
      transition={{ duration: 12, repeat: spin ? Infinity : 0, ease: "linear" }}
    >
      {dots.map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const cx = 28 + rx * Math.cos(angle);
        const cy = 14 + ry * Math.sin(angle);
        // Dots at the "front" (bottom) are larger, dots at "back" (top) are smaller
        const depth = (Math.sin(angle) + 1) / 2; // 0 at back, 1 at front
        const r = 1.8 + depth * 1.6;
        const opacity = 0.35 + depth * 0.65;
        return (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={r}
            fill="currentColor"
            opacity={opacity}
          />
        );
      })}
    </motion.svg>
  );
}
