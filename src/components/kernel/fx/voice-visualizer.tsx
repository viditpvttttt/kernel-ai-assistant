import { motion } from "motion/react";

import { cn } from "@/lib/utils";

/**
 * Animated voice visualizer — a row of bars that animate with varying heights
 * to simulate audio waveform activity while listening.
 *
 * Inspired by skiper.ui / 21st.dev voice input effects.
 */
export function VoiceVisualizer({
  active = true,
  bars = 5,
  className,
}: {
  active?: boolean;
  bars?: number;
  className?: string;
}) {
  const barCount = Math.max(3, bars);

  return (
    <div className={cn("flex items-center justify-center gap-[3px]", className)} aria-hidden>
      {Array.from({ length: barCount }).map((_, i) => {
        const baseDelay = (i / barCount) * 0.3;
        const isMiddle = i === Math.floor(barCount / 2);
        const maxHeight = isMiddle ? 18 : 14;
        const minHeight = 3;

        return (
          <motion.span
            key={i}
            className="w-[3px] rounded-full bg-current"
            animate={
              active
                ? {
                    height: [minHeight, maxHeight, minHeight],
                    opacity: [0.5, 1, 0.5],
                  }
                : { height: minHeight, opacity: 0.4 }
            }
            transition={{
              duration: 0.6 + (i % 3) * 0.15,
              repeat: Infinity,
              ease: "easeInOut",
              delay: baseDelay,
            }}
          />
        );
      })}
    </div>
  );
}
