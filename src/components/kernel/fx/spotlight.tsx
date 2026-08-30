import { motion, useMotionTemplate, useMotionValue } from "motion/react";
import { useEffect } from "react";

import { cn } from "@/lib/utils";

/** A soft light that follows the cursor across the whole viewport. */
export function CursorSpotlight({ className }: { className?: string }) {
  const x = useMotionValue(-500);
  const y = useMotionValue(-500);
  const bg = useMotionTemplate`radial-gradient(420px circle at ${x}px ${y}px, color-mix(in oklab, var(--primary) 12%, transparent), transparent 70%)`;

  useEffect(() => {
    function move(e: MouseEvent) {
      x.set(e.clientX);
      y.set(e.clientY);
    }
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [x, y]);

  return (
    <motion.div
      aria-hidden
      style={{ backgroundImage: bg }}
      className={cn("pointer-events-none fixed inset-0 z-30 hidden md:block", className)}
    />
  );
}
