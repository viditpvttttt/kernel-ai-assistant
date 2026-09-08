import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

/**
 * Text scramble — characters randomize then resolve into the target text
 * when scrolled into view.
 */
export function TextScramble({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  function scramble(el: HTMLElement, target: string) {
    if (started.current) return;
    started.current = true;
    const duration = 1200;
    const startTime = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1);
      const revealCount = Math.floor(t * target.length);
      const display = target
        .split("")
        .map((c, i) => {
          if (i < revealCount) return c;
          if (c === " ") return " ";
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join("");
      el.textContent = display;
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = target;
    };
    requestAnimationFrame(tick);
  }

  return (
    <motion.span
      ref={ref}
      onViewportEnter={() => {
        if (ref.current) scramble(ref.current, text);
      }}
      viewport={{ once: true }}
      className={className}
    >
      {text}
    </motion.span>
  );
}

/**
 * 3D flip card — rotates on Y axis when hovered, revealing back content.
 */
export function FlipCard({
  front,
  back,
  className,
}: {
  front: React.ReactNode;
  back: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`group [perspective:1000px] ${className ?? ""}`}
    >
      <div className="relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
        <div className="absolute inset-0 [backface-visibility:hidden]">
          {front}
        </div>
        <div className="absolute inset-0 [transform:rotateY(180deg)] [backface-visibility:hidden]">
          {back}
        </div>
      </div>
    </div>
  );
}

/**
 * Parallax layers — background layers move at different speeds on scroll.
 */
export function ParallaxLayers({
  children,
  speed = 50,
}: {
  children: React.ReactNode;
  speed?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [-speed, speed]);

  return (
    <div ref={ref} className="relative overflow-hidden">
      <motion.div style={{ y }} className="relative">
        {children}
      </motion.div>
    </div>
  );
}

/**
 * Magnetic text — text that subtly follows the cursor within its container.
 */
export function MagneticText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  function onMove(e: React.MouseEvent<HTMLSpanElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * 0.15;
    const y = (e.clientY - (r.top + r.height / 2)) * 0.15;
    el.style.transform = `translate(${x}px, ${y}px)`;
  }

  function onLeave() {
    const el = ref.current;
    if (el) el.style.transform = "translate(0, 0)";
  }

  return (
    <span
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`inline-block transition-transform duration-300 ease-out ${className ?? ""}`}
    >
      {text}
    </span>
  );
}

/**
 * Animated grid — a subtle grid background that pulses and drifts.
 */
export function AnimatedGrid({ className }: { className?: string }) {
  return (
    <motion.div
      className={`pointer-events-none absolute inset-0 ${className ?? ""}`}
      style={{
        backgroundImage:
          "linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }}
      animate={{ backgroundPosition: ["0px 0px", "40px 40px"] }}
      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
    />
  );
}

/**
 * Single card in the 3D stack — extracted so hooks run at the top level.
 */
function StackCard({
  item,
  index,
  total,
  scrollYProgress,
}: {
  item: { title: string; body: string };
  index: number;
  total: number;
  scrollYProgress: import("motion/react").MotionValue<number>;
}) {
  const start = index / total;
  const end = (index + 1) / total;
  const scale = useTransform(scrollYProgress, [start, end], [1, 0.9]);
  const y = useTransform(scrollYProgress, [start, end], [0, -30]);
  const opacity = useTransform(scrollYProgress, [start, end], [1, 0.5]);

  return (
    <motion.div
      style={{ scale, y, opacity, zIndex: total - index }}
      className="sticky top-1/2 mx-auto max-w-2xl rounded-2xl border border-border bg-card p-8 shadow-[0_20px_60px_-30px_var(--ink)]"
    >
      <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
        0{index + 1}
      </span>
      <h3 className="mt-3 font-display text-2xl font-light">{item.title}</h3>
      <p className="mt-3 text-sm text-muted-foreground">{item.body}</p>
    </motion.div>
  );
}

/**
 * 3D card stack — cards stacked in 3D that fan out on scroll.
 */
export function CardStack3D({
  items,
}: {
  items: { title: string; body: string }[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start center", "end center"] });

  return (
    <div ref={ref} className="relative" style={{ height: `${items.length * 200}px` }}>
      {items.map((item, i) => (
        <StackCard
          key={item.title}
          item={item}
          index={i}
          total={items.length}
          scrollYProgress={scrollYProgress}
        />
      ))}
    </div>
  );
}
