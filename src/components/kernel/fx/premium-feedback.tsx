import { motion } from "motion/react";
import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { appleSpring, appleSpringSnappy, appleEasing } from "./springs";

/* ── 41. PulsingDot ───────────────────────────────────────── */
/** Status indicator dot with a pulsing ring. */
export function PulsingDot({
  color = "oklch(0.72 0.17 145)",
  className,
}: {
  color?: string;
  className?: string;
}) {
  return (
    <span className={cn("relative flex h-2 w-2", className)}>
      <motion.span
        className="absolute inset-0 rounded-full"
        style={{ background: color }}
        animate={{ scale: [1, 2.5], opacity: [0.6, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
      />
      <span className="relative h-2 w-2 rounded-full" style={{ background: color }} />
    </span>
  );
}

/* ── 42. ShimmerSkeleton ─────────────────────────────────── */
/** Skeleton placeholder with a shimmer sweep. */
export function ShimmerSkeleton({
  className,
}: {
  className?: string;
}) {
  return (
    <div className={cn("relative overflow-hidden rounded-md bg-muted", className)}>
      <motion.div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(90deg, transparent, color-mix(in oklab, var(--foreground) 5%, transparent), transparent)",
          backgroundSize: "200% 100%",
        }}
        animate={{ backgroundPosition: ["200% 0%", "0% 0%"] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

/* ── 43. ProgressRing ────────────────────────────────────── */
/** Circular progress indicator. */
export function ProgressRing({
  progress,
  size = 40,
  strokeWidth = 4,
  className,
}: {
  progress: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;
  return (
    <svg width={size} height={size} className={className}>
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--border)" strokeWidth={strokeWidth} />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--foreground)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        style={{ strokeDasharray: circumference }}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={appleSpring}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  );
}

/* ── 44. LoadingDots ──────────────────────────────────────── */
/** Three bouncing dots loading indicator. */
export function LoadingDots({
  className,
}: {
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
          animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
        />
      ))}
    </span>
  );
}

/* ── 45. BadgePulse ──────────────────────────────────────── */
/** Badge with a pulsing dot indicator. */
export function BadgePulse({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-xs text-foreground", className)}>
      <PulsingDot />
      {children}
    </span>
  );
}

/* ── 46. Spinner ──────────────────────────────────────────── */
/** Minimal spinner with spring physics. */
export function Spinner({
  className,
}: {
  className?: string;
}) {
  return (
    <motion.svg
      className={cn("h-5 w-5 text-muted-foreground", className)}
      fill="none"
      viewBox="0 0 24 24"
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.2" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </motion.svg>
  );
}

/* ── 47. ProgressBar ──────────────────────────────────────── */
/** Horizontal progress bar with spring fill. */
export function ProgressBar({
  progress,
  className,
}: {
  progress: number;
  className?: string;
}) {
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-muted", className)}>
      <motion.div
        className="h-full rounded-full bg-foreground"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={appleSpring}
      />
    </div>
  );
}

/* ── 48. FadeIn ───────────────────────────────────────────── */
/** Wrapper that fades content in on scroll. */
export function FadeIn({
  children,
  delay = 0,
  y = 20,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease: appleEasing, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── 49. ScaleIn ──────────────────────────────────────────── */
/** Wrapper that scales content in on scroll. */
export function ScaleIn({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ ...appleSpring, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── 50. StaggerGroup ─────────────────────────────────────── */
/** Container that staggers its children on scroll. */
export function StaggerGroup({
  children,
  stagger = 0.06,
  className,
}: {
  children: ReactNode;
  stagger?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── 51. StaggerItem ──────────────────────────────────────── */
/** Child item for StaggerGroup. */
export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 16, scale: 0.96 },
        visible: { opacity: 1, y: 0, scale: 1, transition: appleSpring },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── 52. Tooltip ──────────────────────────────────────────── */
/** Simple tooltip that fades in on hover. */
export function Tooltip({
  children,
  label,
  className,
}: {
  children: ReactNode;
  label: string;
  className?: string;
}) {
  return (
    <span className={cn("group relative inline-flex", className)}>
      {children}
      <motion.span
        initial={{ opacity: 0, y: 4 }}
        whileHover={{ opacity: 1, y: 0 }}
        transition={appleSpringSnappy}
        className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-xs text-background opacity-0"
      >
        {label}
      </motion.span>
    </span>
  );
}
