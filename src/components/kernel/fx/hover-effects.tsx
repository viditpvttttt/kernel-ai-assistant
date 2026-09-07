import { motion, useMotionTemplate, useMotionValue } from "motion/react";
import { useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Mouse-following radial glow — a soft light that trails the cursor within a container. */
export function MouseGlow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(50);
  const my = useMotionValue(50);
  const bg = useMotionTemplate`radial-gradient(300px circle at ${mx}% ${my}%, color-mix(in oklab, var(--foreground) 8%, transparent), transparent 70%)`;

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width) * 100);
    my.set(((e.clientY - r.top) / r.height) * 100);
  }

  return (
    <div ref={ref} onMouseMove={onMove} className={cn("group relative overflow-hidden", className)}>
      <motion.div aria-hidden style={{ backgroundImage: bg }} className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      {children}
    </div>
  );
}

/** Gooey hover card — uses an SVG gooey filter to merge a blob into the card on hover. */
export function GooeyHover({
  title,
  body,
  tag,
  className,
}: {
  title: string;
  body: string;
  tag?: string;
  className?: string;
}) {
  const [hovered, setHovered] = useState(false);
  const filterId = `gooey-${title.replace(/\s/g, "")}`;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn("relative overflow-hidden rounded-2xl border border-border bg-card p-6", className)}
    >
      <svg className="absolute h-0 w-0">
        <defs>
          <filter id={filterId}>
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10"
              result="gooey"
            />
            <feBlend in="SourceGraphic" in2="gooey" />
          </filter>
        </defs>
      </svg>
      <motion.div
        className="absolute -right-8 -top-8 h-24 w-24 rounded-full"
        style={{ background: "var(--aurora-2)", filter: `url(#${filterId})` }}
        animate={{ scale: hovered ? 2.5 : 1, x: hovered ? -20 : 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      />
      <div className="relative">
        {tag && <span className="eyebrow">{tag}</span>}
        <h3 className="mt-2 font-display text-xl font-light">{title}</h3>
        <p className="mt-3 text-sm text-muted-foreground">{body}</p>
      </div>
    </div>
  );
}

/** Animated blob card — a morphing blob shape that drifts behind card content. */
export function BlobCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative overflow-hidden rounded-2xl border border-border bg-card p-6", className)}>
      <motion.div
        className="absolute -left-10 -top-10 h-32 w-32 rounded-full opacity-20 blur-2xl"
        style={{ background: "var(--aurora-1)" }}
        animate={{
          borderRadius: ["50%", "40% 60% 70% 30%", "60% 40% 30% 70%", "50%"],
          x: [0, 30, -10, 0],
          y: [0, 10, 20, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-10 -right-10 h-28 w-28 rounded-full opacity-20 blur-2xl"
        style={{ background: "var(--aurora-3)" }}
        animate={{
          borderRadius: ["50%", "60% 40% 30% 70%", "40% 60% 70% 30%", "50%"],
          x: [0, -20, 10, 0],
          y: [0, -10, -20, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
