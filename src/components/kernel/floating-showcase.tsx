import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

import { Tilt3D, Depth } from "./fx/tilt";

/**
 * A 3D floating showcase — a cluster of glass cards that tilt and float
 * with parallax scroll, giving the landing page a tactile, premium feel.
 */
const CARDS = [
  {
    label: "Plan",
    body: "Kernel breaks down your request into steps before acting.",
    accent: "from-violet-500/15 to-fuchsia-500/10",
    z: 60,
    x: -120,
    y: -40,
  },
  {
    label: "Act",
    body: "Real tools — search, browse, calculate, code, generate.",
    accent: "from-blue-500/15 to-cyan-500/10",
    z: 30,
    x: 110,
    y: -70,
  },
  {
    label: "Verify",
    body: "Every step is visible, inspectable, and replayable.",
    accent: "from-emerald-500/15 to-teal-500/10",
    z: 90,
    x: -60,
    y: 80,
  },
  {
    label: "Remember",
    body: "Skills persist across sessions. Teach it once.",
    accent: "from-amber-500/15 to-orange-500/10",
    z: 10,
    x: 80,
    y: 60,
  },
];

export function FloatingShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rotate = useTransform(scrollYProgress, [0, 1], [-8, 8]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.95]);

  return (
    <section className="rule-x relative overflow-hidden py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, oklch(0.75 0.12 280), oklch(0.78 0.10 200), transparent 70%)",
        }}
      />
      <div ref={ref} className="relative mx-auto max-w-5xl px-6">
        <div className="text-center">
          <p className="eyebrow">How it works</p>
          <h2 className="mx-auto mt-5 max-w-2xl text-[clamp(2.2rem,6vw,4rem)] leading-[1.05] font-extralight tracking-[-0.02em]">
            Plan. Act. Verify. Remember.
          </h2>
        </div>

        <motion.div
          style={{ rotate, scale }}
          className="relative mx-auto mt-20 flex h-[360px] max-w-3xl items-center justify-center"
        >
          {/* Center anchor */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="absolute left-1/2 top-1/2 z-20 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-3xl border border-border bg-card shadow-[0_20px_60px_-20px_var(--ink)]"
          >
            <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Loop</span>
          </motion.div>

          {/* Floating cards */}
          {CARDS.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, scale: 0.5, x: 0, y: 0 }}
              whileInView={{ opacity: 1, scale: 1, x: card.x, y: card.y }}
              viewport={{ once: true }}
              transition={{
                delay: 0.1 + i * 0.12,
                type: "spring",
                stiffness: 120,
                damping: 16,
                mass: 0.8,
              }}
              className="absolute left-1/2 top-1/2"
              style={{ zIndex: 10 + i }}
            >
              <Tilt3D max={14} className="w-44">
                <Depth z={card.z}>
                  <div className={`rounded-2xl border border-border bg-gradient-to-br ${card.accent} bg-card/80 p-4 backdrop-blur-md`}>
                    <div className="mb-2 flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-[9px] font-bold text-background">
                        {i + 1}
                      </span>
                      <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                        {card.label}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-foreground/80">{card.body}</p>
                  </div>
                </Depth>
              </Tilt3D>
            </motion.div>
          ))}

          {/* Connecting lines */}
          <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 600 360" fill="none">
            {CARDS.map((_, i) => {
              const cx = 300;
              const cy = 180;
              const cardX = 300 + CARDS[i].x;
              const cardY = 180 + CARDS[i].y;
              return (
                <motion.line
                  key={i}
                  x1={cx}
                  y1={cy}
                  x2={cardX}
                  y2={cardY}
                  stroke="var(--color-border)"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 0.3 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.12, duration: 0.8 }}
                />
              );
            })}
          </svg>
        </motion.div>
      </div>
    </section>
  );
}
