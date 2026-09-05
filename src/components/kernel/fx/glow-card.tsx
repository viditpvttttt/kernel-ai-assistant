import { motion, useMotionTemplate, useMotionValue } from "motion/react";
import type { PointerEvent, ReactNode } from "react";

/* Card whose border/light follows the cursor (Unlumen-style glow card). */
export function GlowCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const background = useMotionTemplate`radial-gradient(240px circle at ${x}px ${y}px, color-mix(in oklab, var(--spectral-r) 22%, transparent), transparent 72%)`;

  function onMove(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left);
    y.set(event.clientY - rect.top);
  }

  function onLeave() {
    x.set(-200);
    y.set(-200);
  }

  return (
    <div
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`group relative overflow-hidden rounded-2xl ${className}`}
    >
      <motion.div
        aria-hidden
        style={{ background }}
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      <div className="relative">{children}</div>
    </div>
  );
}
