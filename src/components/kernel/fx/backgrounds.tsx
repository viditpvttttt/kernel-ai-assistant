import { motion } from "motion/react";

/** Aurora bars — thin animated gradient bars that pulse and drift. */
export function AuroraBars({ className }: { className?: string }) {
  const bars = Array.from({ length: 5 });
  const colors = ["var(--aurora-1)", "var(--aurora-2)", "var(--aurora-3)", "var(--aurora-4)", "var(--aurora-1)"];

  return (
    <div className={`flex items-end gap-2 ${className ?? ""}`}>
      {bars.map((_, i) => (
        <motion.div
          key={i}
          className="flex-1 rounded-full"
          style={{ background: colors[i], height: 4 }}
          animate={{ height: [4, 40 + i * 12, 4], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2.5 + i * 0.3, repeat: Infinity, ease: "easeInOut", delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}

/** Wave background — animated SVG wave that undulates slowly. */
export function WaveBackground({ className }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-x-0 bottom-0 h-40 overflow-hidden ${className ?? ""}`}>
      <svg viewBox="0 0 1200 200" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
        <motion.path
          d="M0,100 C200,40 400,160 600,100 C800,40 1000,160 1200,100 L1200,200 L0,200 Z"
          fill="var(--color-border)"
          opacity={0.3}
          animate={{
            d: [
              "M0,100 C200,40 400,160 600,100 C800,40 1000,160 1200,100 L1200,200 L0,200 Z",
              "M0,120 C200,160 400,40 600,120 C800,160 1000,40 1200,120 L1200,200 L0,200 Z",
              "M0,100 C200,40 400,160 600,100 C800,40 1000,160 1200,100 L1200,200 L0,200 Z",
            ],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
}

/** Cursor trail — small dots that follow the cursor and fade out. */
export function CursorTrail() {
  const trails = Array.from({ length: 6 });
  return (
    <div className="pointer-events-none fixed inset-0 z-40 hidden md:block">
      {trails.map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-2 w-2 rounded-full"
          style={{
            background: "var(--color-primary)",
            opacity: 0.3 - i * 0.04,
          }}
          animate={{
            x: [0, 20 * (i % 2 ? 1 : -1), 0],
            y: [0, 15, 0],
          }}
          transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
        />
      ))}
    </div>
  );
}
