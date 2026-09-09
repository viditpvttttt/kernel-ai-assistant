import { motion, AnimatePresence } from "motion/react";
import { type ReactNode, useState } from "react";
import { cn } from "@/lib/utils";
import { appleSpring, appleSpringSnappy, appleEasing } from "./springs";
import { TextReveal } from "./premium-text";

/* ── 33. CTABanner ────────────────────────────────────────── */
/** Premium call-to-action banner with gradient background. */
export function CTABanner({
  title,
  subtitle,
  action,
  className,
}: {
  title: string;
  subtitle: string;
  action: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ ...appleSpring }}
      className={cn(
        "relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card to-muted/40 p-10 text-center",
        className,
      )}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.80 0.10 245), oklch(0.78 0.12 295), oklch(0.82 0.10 10))",
          backgroundSize: "200% 200%",
        }}
        animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="relative">
        <TextReveal
          text={title}
          className="text-[clamp(1.8rem,4vw,3rem)] leading-[1.1] font-extralight tracking-tight"
        />
        <p className="mx-auto mt-4 max-w-md text-sm text-muted-foreground">{subtitle}</p>
        <div className="mt-8 flex justify-center">{action}</div>
      </div>
    </motion.div>
  );
}

/* ── 34. FeatureGrid ──────────────────────────────────────── */
/** Grid of feature cards with staggered reveal. */
export function FeatureGrid({
  features,
  className,
}: {
  features: { icon: ReactNode; title: string; body: string }[];
  className?: string;
}) {
  return (
    <div className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {features.map((f, i) => (
        <motion.div
          key={f.title}
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ ...appleSpring, delay: i * 0.06 }}
          whileHover={{ y: -4 }}
          className="rounded-2xl border border-border bg-card p-6 transition-shadow duration-300 hover:shadow-[0_12px_40px_-16px_var(--ink)]"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-foreground">
            {f.icon}
          </div>
          <h3 className="mt-4 font-display text-base font-light">{f.title}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
        </motion.div>
      ))}
    </div>
  );
}

/* ── 35. TestimonialCard ──────────────────────────────────── */
/** Testimonial card with quote, avatar, and name. */
export function TestimonialCard({
  quote,
  name,
  role,
  avatar,
  className,
}: {
  quote: string;
  name: string;
  role: string;
  avatar?: string;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={appleSpring}
      whileHover={{ y: -3 }}
      className={cn("rounded-2xl border border-border bg-card p-6", className)}
    >
      <svg className="h-6 w-6 text-muted-foreground/40" fill="currentColor" viewBox="0 0 24 24">
        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z" />
      </svg>
      <p className="mt-4 text-[15px] leading-relaxed text-foreground">{quote}</p>
      <div className="mt-5 flex items-center gap-3">
        {avatar ? (
          <img src={avatar} alt={name} className="h-9 w-9 rounded-full object-cover" />
        ) : (
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-sm font-medium text-foreground">
            {name[0]}
          </div>
        )}
        <div>
          <p className="text-sm font-medium text-foreground">{name}</p>
          <p className="text-xs text-muted-foreground">{role}</p>
        </div>
      </div>
    </motion.div>
  );
}

/* ── 36. PricingTeaser ────────────────────────────────────── */
/** Pricing card with feature list and CTA. */
export function PricingTeaser({
  name,
  price,
  period,
  features,
  highlighted = false,
  action,
  className,
}: {
  name: string;
  price: string;
  period?: string;
  features: string[];
  highlighted?: boolean;
  action: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={appleSpring}
      whileHover={{ y: -4 }}
      className={cn(
        "relative rounded-2xl border p-6 transition-shadow duration-300",
        highlighted
          ? "border-foreground/20 bg-card shadow-[0_16px_48px_-16px_var(--ink)]"
          : "border-border bg-card",
        className,
      )}
    >
      {highlighted && (
        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-foreground px-3 py-0.5 text-[10px] font-medium text-background">
          Most popular
        </span>
      )}
      <h3 className="font-display text-lg font-light">{name}</h3>
      <div className="mt-3 flex items-baseline gap-1">
        <span className="text-3xl font-extralight tracking-tight">{price}</span>
        {period && <span className="text-sm text-muted-foreground">{period}</span>}
      </div>
      <ul className="mt-5 space-y-2.5">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
            <svg className="h-4 w-4 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {f}
          </li>
        ))}
      </ul>
      <div className="mt-6">{action}</div>
    </motion.div>
  );
}

/* ── 37. StatsSection ─────────────────────────────────────── */
/** Row of animated statistics. */
export function StatsSection({
  stats,
  className,
}: {
  stats: { value: string; label: string }[];
  className?: string;
}) {
  return (
    <div className={cn("grid grid-cols-2 gap-px sm:grid-cols-4", className)}>
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ ...appleSpring, delay: i * 0.08 }}
          className="text-center"
        >
          <p className="font-display text-4xl font-extralight tracking-tight">{s.value}</p>
          <p className="mt-2 text-xs text-muted-foreground">{s.label}</p>
        </motion.div>
      ))}
    </div>
  );
}

/* ── 38. FAQAccordion ─────────────────────────────────────── */
/** Animated FAQ accordion with smooth expand/collapse. */
export function FAQAccordion({
  items,
  className,
}: {
  items: { q: string; a: string }[];
  className?: string;
}) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className={cn("space-y-2", className)}>
      {items.map((item, i) => (
        <div key={i} className="overflow-hidden rounded-xl border border-border bg-card">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium text-foreground"
          >
            {item.q}
            <motion.svg
              animate={{ rotate: open === i ? 180 : 0 }}
              transition={appleSpringSnappy}
              className="h-4 w-4 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </motion.svg>
          </button>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: appleEasing }}
              >
                <p className="px-5 pb-4 text-sm text-muted-foreground">{item.a}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

/* ── 39. LogoMarquee ──────────────────────────────────────── */
/** Horizontal scrolling marquee of logos/names. */
export function LogoMarquee({
  items,
  className,
}: {
  items: string[];
  className?: string;
}) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="flex gap-12 whitespace-nowrap"
      >
        {[...items, ...items].map((item, i) => (
          <span key={i} className="font-mono text-sm tracking-wide text-muted-foreground">
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ── 40. StepIndicator ────────────────────────────────────── */
/** Horizontal step indicator with animated progress. */
export function StepIndicator({
  steps,
  current,
  className,
}: {
  steps: string[];
  current: number;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {steps.map((step, i) => (
        <div key={i} className="flex flex-1 items-center gap-2">
          <motion.div
            animate={{
              backgroundColor: i <= current ? "var(--foreground)" : "var(--border)",
              scale: i === current ? 1.1 : 1,
            }}
            transition={appleSpring}
            className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium"
          >
            <span style={{ color: i <= current ? "var(--background)" : "var(--muted-foreground)" }}>
              {i + 1}
            </span>
          </motion.div>
          {i < steps.length - 1 && (
            <div className="relative h-px flex-1 bg-border">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: i < current ? "100%" : "0%" }}
                transition={{ duration: 0.4, ease: appleEasing }}
                className="absolute inset-0 bg-foreground"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
