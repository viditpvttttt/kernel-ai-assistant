import { motion, useMotionTemplate, useMotionValue } from "motion/react";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { appleSpring, appleEasing } from "./springs";

/* ── 9. GlassCard ────────────────────────────────────────── */
/** Frosted glass card with backdrop blur and subtle border. */
export function GlassCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl",
        className,
      )}
    >
      {children}
    </div>
  );
}

/* ── 10. SpotlightCard ────────────────────────────────────── */
/** Card with a cursor-following spotlight glow. */
export function SpotlightCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const bg = useMotionTemplate`radial-gradient(250px circle at ${mx}% ${my}%, color-mix(in oklab, var(--foreground) 6%, transparent), transparent 70%)`;

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width) * 100);
    my.set(((e.clientY - r.top) / r.height) * 100);
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      className={cn("group relative overflow-hidden rounded-2xl border border-border bg-card", className)}
    >
      <motion.div
        aria-hidden
        style={{ backgroundImage: bg }}
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      <div className="relative">{children}</div>
    </div>
  );
}

/* ── 11. BorderBeamCard ───────────────────────────────────── */
/** Card with an animated beam of light traveling along the border. */
export function BorderBeamCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border bg-card p-6",
        className,
      )}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          background:
            "conic-gradient(from 0deg, transparent 0deg, transparent 270deg, oklch(0.80 0.10 245 / 0.5) 320deg, oklch(0.78 0.12 295 / 0.5) 340deg, transparent 360deg)",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      />
      <div className="relative m-[1px] rounded-2xl bg-card p-6">{children}</div>
    </div>
  );
}

/* ── 12. AuroraCard ───────────────────────────────────────── */
/** Card with a soft aurora gradient that drifts behind content. */
export function AuroraCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border bg-card p-6",
        className,
      )}
    >
      <motion.div
        className="pointer-events-none absolute -inset-4 opacity-20 blur-2xl"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.80 0.10 245), oklch(0.78 0.12 295), oklch(0.82 0.10 10))",
          backgroundSize: "200% 200%",
        }}
        animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}

/* ── 13. RevealCard ──────────────────────────────────────── */
/** Card that fades and lifts into view on scroll. */
export function RevealCard({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.97, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ ...appleSpring, delay }}
      className={cn("rounded-2xl border border-border bg-card p-6", className)}
    >
      {children}
    </motion.div>
  );
}

/* ── 14. MorphCard ────────────────────────────────────────── */
/** Card with a morphing blob background. */
export function MorphCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border bg-card p-6",
        className,
      )}
    >
      <motion.div
        className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-15 blur-xl"
        style={{ background: "oklch(0.78 0.12 295)" }}
        animate={{
          borderRadius: ["50%", "40% 60% 70% 30%", "60% 40% 30% 70%", "50%"],
          x: [0, 20, -10, 0],
          y: [0, 10, 15, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}

/* ── 15. GradientCard ─────────────────────────────────────── */
/** Card with a subtle gradient background that shifts on hover. */
export function GradientCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={appleSpring}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-card to-muted/50 p-6 transition-shadow duration-300 hover:shadow-[0_16px_48px_-16px_var(--ink)]",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}

/* ── 16. TiltCard ─────────────────────────────────────────── */
/** Card that tilts in 3D toward the cursor. */
export function TiltCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    rx.set((py - 0.5) * -12);
    ry.set((px - 0.5) * 12);
  }

  function onLeave() {
    rx.set(0);
    ry.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 800 }}
      transition={appleSpring}
      className={cn("rounded-2xl border border-border bg-card p-6 [transform-style:preserve-3d]", className)}
    >
      {children}
    </motion.div>
  );
}

/* ── 17. GlowCard ─────────────────────────────────────────── */
/** Card with an outer glow that appears on hover. */
export function GlowCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={appleSpring}
      className={cn(
        "rounded-2xl border border-border bg-card p-6 transition-shadow duration-500 hover:shadow-[0_0_40px_-10px_oklch(0.78_0.12_295/0.3)]",
        className,
      )}
    >
      {children}
    </motion.div>
  );
}

/* ── 18. FadeInCard ──────────────────────────────────────── */
/** Simple card that fades in with a gentle lift. */
export function FadeInCard({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: appleEasing, delay }}
      className={cn("rounded-2xl border border-border bg-card p-6", className)}
    >
      {children}
    </motion.div>
  );
}
