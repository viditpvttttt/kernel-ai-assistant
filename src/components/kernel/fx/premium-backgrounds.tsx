import { motion } from "motion/react";
import { cn } from "@/lib/utils";

/* ── 59. MeshGradient ──────────────────────────────────────── */
/** Animated mesh gradient background with soft color blobs. */
export function MeshGradient({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <motion.div
        className="absolute h-72 w-72 rounded-full opacity-30 blur-3xl"
        style={{ background: "oklch(0.80 0.10 245)" }}
        animate={{ x: [0, 100, 0], y: [0, 80, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-0 top-20 h-64 w-64 rounded-full opacity-25 blur-3xl"
        style={{ background: "oklch(0.78 0.12 295)" }}
        animate={{ x: [0, -80, 0], y: [0, 60, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 left-1/3 h-56 w-56 rounded-full opacity-20 blur-3xl"
        style={{ background: "oklch(0.82 0.10 10)" }}
        animate={{ x: [0, 60, 0], y: [0, -40, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

/* ── 60. DotGrid ──────────────────────────────────────────── */
/** Subtle dot grid background. */
export function DotGrid({ className }: { className?: string }) {
  return (
    <div
      className={cn("pointer-events-none absolute inset-0", className)}
      style={{
        backgroundImage: "radial-gradient(circle, var(--border) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
      }}
    />
  );
}

/* ── 61. NoiseTexture ──────────────────────────────────────── */
/** SVG noise texture overlay for a film-grain effect. */
export function NoiseTexture({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 opacity-[0.03]", className)}>
      <svg className="h-full w-full">
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>
    </div>
  );
}

/* ── 62. GradientMesh ──────────────────────────────────────── */
/** Animated conic gradient mesh background. */
export function GradientMesh({ className }: { className?: string }) {
  return (
    <motion.div
      className={cn("pointer-events-none absolute inset-0 opacity-20", className)}
      style={{
        background:
          "conic-gradient(from 0deg at 50% 50%, oklch(0.80 0.10 245), oklch(0.78 0.12 295), oklch(0.82 0.10 10), oklch(0.75 0.14 35), oklch(0.80 0.10 245))",
      }}
      animate={{ rotate: 360 }}
      transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
    />
  );
}

/* ── 63. AuroraBackground ──────────────────────────────────── */
/** Full-section aurora gradient that drifts slowly. */
export function AuroraBackground({ className }: { className?: string }) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <motion.div
        className="absolute -inset-4"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.80 0.10 245 / 0.15), oklch(0.78 0.12 295 / 0.1), oklch(0.82 0.10 10 / 0.12))",
          backgroundSize: "200% 200%",
        }}
        animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
