import { motion } from "motion/react";
import { type ReactNode } from "react";
import { appleEasing, appleSpring, staggerChild, staggerContainer } from "./springs";

/* ── 25. TextReveal ───────────────────────────────────────── */
/** Text that fades and lifts into view on scroll, word by word. */
export function TextReveal({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const words = text.split(" ");
  return (
    <motion.span
      variants={staggerContainer(0.06)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      className={className}
    >
      {words.map((word, i) => (
        <motion.span key={i} variants={staggerChild} className="inline-block">
          {word}&nbsp;
        </motion.span>
      ))}
    </motion.span>
  );
}

/* ── 26. StaggerText ──────────────────────────────────────── */
/** Text with character-level stagger animation. */
export function StaggerText({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.span
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.03, delayChildren: delay } },
      }}
      className={className}
    >
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          variants={{
            hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
            visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: appleSpring },
          }}
          className="inline-block"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.span>
  );
}

/* ── 27. TypeWriter ───────────────────────────────────────── */
/** Typewriter effect that types text character by character. */
export function TypeWriter({
  text,
  speed = 50,
  className,
}: {
  text: string;
  speed?: number;
  className?: string;
}) {
  const chars = text.split("");
  return (
    <span className={className}>
      {chars.map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: (i * speed) / 1000, duration: 0.01 }}
        >
          {char}
        </motion.span>
      ))}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.7, repeat: Infinity, ease: "easeInOut" }}
        className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[0.1em] bg-current"
      />
    </span>
  );
}

/* ── 28. TextShimmer ──────────────────────────────────────── */
/** Text with a shimmering gradient sweep. */
export function TextShimmer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.span
      className={`inline-block bg-clip-text text-transparent ${className ?? ""}`}
      style={{
        backgroundImage:
          "linear-gradient(90deg, var(--muted-foreground) 0%, var(--foreground) 50%, var(--muted-foreground) 100%)",
        backgroundSize: "200% 100%",
      }}
      animate={{ backgroundPosition: ["200% 0%", "0% 0%"] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
    >
      {children}
    </motion.span>
  );
}

/* ── 29. TextBlurReveal ───────────────────────────────────── */
/** Text that un-blurs into focus on scroll. */
export function TextBlurReveal({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <motion.span
      initial={{ opacity: 0, filter: "blur(12px)" }}
      whileInView={{ opacity: 1, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.8, ease: appleEasing }}
      className={className}
    >
      {text}
    </motion.span>
  );
}

/* ── 30. TextMaskReveal ────────────────────────────────────── */
/** Text that slides up from behind a mask. */
export function TextMaskReveal({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <span className={`inline-block overflow-hidden ${className ?? ""}`}>
      <motion.span
        initial={{ y: "100%" }}
        whileInView={{ y: "0%" }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.7, ease: appleEasing }}
        className="inline-block"
      >
        {text}
      </motion.span>
    </span>
  );
}

/* ── 31. TextGradient ─────────────────────────────────────── */
/** Animated gradient text. */
export function TextGradient({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.span
      className={`inline-block bg-clip-text text-transparent ${className ?? ""}`}
      style={{
        backgroundImage:
          "linear-gradient(90deg, oklch(0.80 0.10 245), oklch(0.78 0.12 295), oklch(0.82 0.10 10), oklch(0.75 0.14 35), oklch(0.80 0.10 245))",
        backgroundSize: "200% 100%",
      }}
      animate={{ backgroundPosition: ["0% 0%", "200% 0%"] }}
      transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
    >
      {children}
    </motion.span>
  );
}

/* ── 32. CountUp ──────────────────────────────────────────── */
/** Number that counts up when scrolled into view. */
export function CountUp({
  value,
  suffix = "",
  className,
}: {
  value: number;
  suffix?: string;
  className?: string;
}) {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className={className}
    >
      <motion.span
        initial={{ y: 20 }}
        whileInView={{ y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: appleEasing }}
      >
        {value.toLocaleString()}{suffix}
      </motion.span>
    </motion.span>
  );
}
