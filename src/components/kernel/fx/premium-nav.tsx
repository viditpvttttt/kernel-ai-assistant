import { motion, AnimatePresence } from "motion/react";
import { type ReactNode, useState } from "react";
import { cn } from "@/lib/utils";
import { appleSpring, appleSpringSnappy, appleEasing } from "./springs";

/* ── 53. PillNav ──────────────────────────────────────────── */
/** Navigation with a sliding pill indicator. */
export function PillNav({
  items,
  active,
  onChange,
  className,
}: {
  items: string[];
  active: number;
  onChange: (i: number) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex gap-1 rounded-full border border-border bg-card/60 p-1 backdrop-blur-sm", className)}>
      {items.map((item, i) => (
        <button
          key={item}
          onClick={() => onChange(i)}
          className="relative rounded-full px-4 py-1.5 text-sm transition-colors"
        >
          {active === i && (
            <motion.span
              layoutId="pillNav"
              transition={appleSpring}
              className="absolute inset-0 rounded-full bg-foreground"
            />
          )}
          <span className={cn("relative", active === i ? "text-background" : "text-muted-foreground hover:text-foreground")}>
            {item}
          </span>
        </button>
      ))}
    </div>
  );
}

/* ── 54. AnimatedTabs ──────────────────────────────────────── */
/** Tab bar with animated underline indicator. */
export function AnimatedTabs({
  tabs,
  active,
  onChange,
  className,
}: {
  tabs: string[];
  active: number;
  onChange: (i: number) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex gap-6 border-b border-border", className)}>
      {tabs.map((tab, i) => (
        <button
          key={tab}
          onClick={() => onChange(i)}
          className="relative pb-3 text-sm transition-colors"
        >
          <span className={cn(active === i ? "text-foreground" : "text-muted-foreground hover:text-foreground")}>
            {tab}
          </span>
          {active === i && (
            <motion.span
              layoutId="tabUnderline"
              transition={appleSpring}
              className="absolute -bottom-px left-0 right-0 h-px bg-foreground"
            />
          )}
        </button>
      ))}
    </div>
  );
}

/* ── 55. AnimatedBreadcrumbs ──────────────────────────────── */
/** Breadcrumb trail with animated separators. */
export function AnimatedBreadcrumbs({
  items,
  className,
}: {
  items: { label: string; href?: string }[];
  className?: string;
}) {
  return (
    <nav className={cn("flex items-center gap-2 text-sm", className)}>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          {i > 0 && (
            <motion.svg
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1, ...appleSpringSnappy }}
              className="h-3 w-3 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </motion.svg>
          )}
          <motion.a
            href={item.href}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, ...appleSpringSnappy }}
            className={cn(
              i === items.length - 1 ? "text-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {item.label}
          </motion.a>
        </span>
      ))}
    </nav>
  );
}

/* ── 56. SegmentedControl ─────────────────────────────────── */
/** iOS-style segmented control. */
export function SegmentedControl({
  segments,
  active,
  onChange,
  className,
}: {
  segments: string[];
  active: number;
  onChange: (i: number) => void;
  className?: string;
}) {
  return (
    <div className={cn("relative inline-flex gap-1 rounded-lg bg-muted p-1", className)}>
      {segments.map((seg, i) => (
        <button
          key={seg}
          onClick={() => onChange(i)}
          className="relative rounded-md px-3 py-1 text-xs font-medium"
        >
          {active === i && (
            <motion.span
              layoutId="segmentedControl"
              transition={appleSpring}
              className="absolute inset-0 rounded-md bg-card shadow-sm"
            />
          )}
          <span className={cn("relative", active === i ? "text-foreground" : "text-muted-foreground")}>
            {seg}
          </span>
        </button>
      ))}
    </div>
  );
}

/* ── 57. DropdownMenu ──────────────────────────────────────── */
/** Simple animated dropdown menu. */
export function DropdownMenu({
  trigger,
  children,
  className,
}: {
  trigger: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} onBlur={() => setTimeout(() => setOpen(false), 150)}>
        {trigger}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.96 }}
            transition={appleSpringSnappy}
            className={cn("absolute right-0 z-50 mt-2 min-w-[12rem] rounded-xl border border-border bg-popover p-1 shadow-lg", className)}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── 58. Sheet ────────────────────────────────────────────── */
/** Slide-in panel from the side. */
export function Sheet({
  open,
  onClose,
  children,
  side = "right",
  className,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  side?: "left" | "right" | "bottom";
  className?: string;
}) {
  const variants = {
    left: { x: "-100%" },
    right: { x: "100%" },
    bottom: { y: "100%" },
  };
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-background/40 backdrop-blur-sm"
          />
          <motion.div
            initial={variants[side]}
            animate={{ x: 0, y: 0 }}
            exit={variants[side]}
            transition={appleSpring}
            className={cn(
              "fixed z-50 bg-card shadow-xl",
              side === "bottom" ? "inset-x-0 bottom-0 rounded-t-2xl border-t border-border" : "top-0 bottom-0 w-80 border-border",
              side === "left" && "left-0 border-r",
              side === "right" && "right-0 border-l",
              className,
            )}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
