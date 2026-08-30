import { motion, useMotionTemplate, useSpring } from "motion/react";
import { useRef, type ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Mouse-tracking 3D tilt container. Children can use `translate-z-*` style depth via inline transforms. */
export function Tilt3D({
  children,
  className,
  max = 12,
  glare = true,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
  glare?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const spring = { stiffness: 220, damping: 22, mass: 0.6 };
  const rx = useSpring(0, spring);
  const ry = useSpring(0, spring);
  const mx = useSpring(50, spring);
  const my = useSpring(50, spring);

  const glarePos = useMotionTemplate`radial-gradient(220px circle at ${mx}% ${my}%, color-mix(in oklab, var(--foreground) 10%, transparent), transparent 70%)`;

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * max * 2);
    rx.set(-(py - 0.5) * max * 2);
    mx.set(px * 100);
    my.set(py * 100);
  }

  function onLeave() {
    rx.set(0);
    ry.set(0);
    mx.set(50);
    my.set(50);
  }

  return (
    <div style={{ perspective: 1000 }} className={cn("relative", className)}>
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        className="relative h-full w-full"
      >
        {children}
        {glare && (
          <motion.span
            aria-hidden
            style={{ backgroundImage: glarePos }}
            className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 hover:opacity-100"
          />
        )}
      </motion.div>
    </div>
  );
}

/** Pushes a child forward on the Z axis inside a Tilt3D. */
export function Depth({
  z = 40,
  className,
  children,
}: {
  z?: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div style={{ transform: `translateZ(${z}px)`, transformStyle: "preserve-3d" }} className={className}>
      {children}
    </div>
  );
}
