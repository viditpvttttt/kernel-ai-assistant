import { motion } from "motion/react";
import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { appleSpringSnappy, appleEasing } from "./springs";

/* ── 1. ShimmerButton ─────────────────────────────────────── */
/** Button with a light shimmer that sweeps across on hover. */
export function ShimmerButton({
  children,
  className,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={appleSpringSnappy}
      onClick={onClick}
      className={cn(
        "relative overflow-hidden rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground",
        className,
      )}
    >
      <span
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 hover:translate-x-full"
      />
      {children}
    </motion.button>
  );
}

/* ── 2. GlowButton ────────────────────────────────────────── */
/** Button with a soft glow that intensifies on hover. */
export function GlowButton({
  children,
  className,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      transition={appleSpringSnappy}
      onClick={onClick}
      className={cn(
        "relative rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-[0_0_0_0_oklch(0.62_0.19_255/0)] transition-shadow duration-500 hover:shadow-[0_0_30px_-5px_oklch(0.62_0.19_255/0.5)]",
        className,
      )}
    >
      {children}
    </motion.button>
  );
}

/* ── 3. GradientBorderButton ─────────────────────────────── */
/** Button with an animated gradient border. */
export function GradientBorderButton({
  children,
  className,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={appleSpringSnappy}
      onClick={onClick}
      className={cn("group relative overflow-hidden rounded-full p-[1.5px]", className)}
    >
      <motion.span
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "linear-gradient(90deg, oklch(0.80 0.10 245), oklch(0.78 0.12 295), oklch(0.82 0.10 10), oklch(0.80 0.10 245))",
          backgroundSize: "200% 100%",
        }}
        animate={{ backgroundPosition: ["0% 0%", "200% 0%"] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />
      <span className="relative block rounded-full bg-background px-6 py-2.5 text-sm font-medium text-foreground">
        {children}
      </span>
    </motion.button>
  );
}

/* ── 4. PulseButton ───────────────────────────────────────── */
/** Button with a pulsing ring, ideal for primary CTAs. */
export function PulseButton({
  children,
  className,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      transition={appleSpringSnappy}
      onClick={onClick}
      className={cn(
        "relative rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground",
        className,
      )}
    >
      <motion.span
        className="absolute inset-0 rounded-full bg-primary"
        animate={{ scale: [1, 1.4], opacity: [0.5, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
      />
      <span className="relative">{children}</span>
    </motion.button>
  );
}

/* ── 5. LiquidButton ──────────────────────────────────────── */
/** Button with a liquid fill that rises on hover. */
export function LiquidButton({
  children,
  className,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={appleSpringSnappy}
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground",
        className,
      )}
    >
      <motion.span
        className="absolute inset-0 bg-foreground"
        initial={{ y: "100%" }}
        whileHover={{ y: "0%" }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
      />
      <span className="relative transition-colors duration-300 group-hover:text-background">
        {children}
      </span>
    </motion.button>
  );
}

/* ── 6. AppleButton ───────────────────────────────────────── */
/** Refined Apple-style button with subtle depth shadow. */
export function AppleButton({
  children,
  variant = "primary",
  className,
  onClick,
}: {
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
  onClick?: () => void;
}) {
  const base =
    "relative rounded-full px-6 py-2.5 text-sm font-medium transition-colors";
  const styles =
    variant === "primary"
      ? "bg-foreground text-background hover:bg-foreground/90"
      : "bg-background/60 text-foreground border border-border backdrop-blur-xl hover:bg-background/80";

  return (
    <motion.button
      whileHover={{ scale: 1.03, y: -1 }}
      whileTap={{ scale: 0.97, y: 0 }}
      transition={appleSpringSnappy}
      onClick={onClick}
      className={cn(base, styles, className)}
    >
      {children}
    </motion.button>
  );
}

/* ── 7. IconButton ────────────────────────────────────────── */
/** Circular icon button with spring hover. */
export function IconButton({
  children,
  className,
  onClick,
  label,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  label: string;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={appleSpringSnappy}
      onClick={onClick}
      aria-label={label}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
        className,
      )}
    >
      {children}
    </motion.button>
  );
}

/* ── 8. AppleLink ─────────────────────────────────────────── */
/** Animated link with underline grow. */
export function AppleLink({
  children,
  href,
  className,
}: {
  children: ReactNode;
  href: string;
  className?: string;
}) {
  return (
    <a href={href} className={cn("group relative inline-block text-sm text-muted-foreground hover:text-foreground transition-colors", className)}>
      {children}
      <motion.span
        className="absolute -bottom-0.5 left-0 h-px bg-foreground"
        initial={{ width: 0 }}
        whileHover={{ width: "100%" }}
        transition={{ duration: 0.3, ease: appleEasing }}
      />
    </a>
  );
}
