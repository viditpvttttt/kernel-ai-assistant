import { motion } from "motion/react";

import { cn } from "@/lib/utils";

/**
 * Soft multi-hue aurora wash + film grain. Purely decorative ambience layer.
 * Sits behind content; never intercepts pointer events.
 */
export function Ambience({
  className,
  intensity = "soft",
}: {
  className?: string;
  intensity?: "soft" | "bold";
}) {
  const opacity = intensity === "bold" ? 0.85 : 0.55;

  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <motion.div
        className="absolute -left-[18%] top-[-24%] h-[70vh] w-[70vh] rounded-full blur-[90px]"
        style={{ background: "var(--aurora-1)", opacity }}
        animate={{ x: [0, 60, -20, 0], y: [0, 40, 10, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-[-14%] top-[6%] h-[60vh] w-[60vh] rounded-full blur-[100px]"
        style={{ background: "var(--aurora-2)", opacity }}
        animate={{ x: [0, -50, 20, 0], y: [0, 30, -20, 0] }}
        transition={{ duration: 32, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-26%] left-[28%] h-[65vh] w-[65vh] rounded-full blur-[110px]"
        style={{ background: "var(--aurora-3)", opacity }}
        animate={{ x: [0, 40, -40, 0], y: [0, -30, 20, 0] }}
        transition={{ duration: 38, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-[6%] bottom-[-20%] h-[55vh] w-[55vh] rounded-full blur-[100px]"
        style={{ background: "var(--aurora-4)", opacity }}
        animate={{ x: [0, -30, 30, 0], y: [0, 20, -30, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="film-grain absolute inset-0" />
    </div>
  );
}
