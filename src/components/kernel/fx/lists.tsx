import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

/** Animated list — items that slide in with a stagger when scrolled into view. */
export function AnimatedList({
  items,
}: {
  items: { title: string; body: string }[];
}) {
  return (
    <div className="space-y-px">
      {items.map((item, i) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ delay: i * 0.08, duration: 0.5 }}
          className="flex items-start gap-4 border-b border-border py-4"
        >
          <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
            {String(i + 1).padStart(2, "0")}
          </span>
          <div className="flex-1">
            <h4 className="font-display text-base font-light">{item.title}</h4>
            <p className="mt-1 text-sm text-muted-foreground">{item.body}</p>
          </div>
          <motion.span
            initial={{ width: 0 }}
            whileInView={{ width: "2rem" }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 + 0.3, duration: 0.4 }}
            className="mt-2 h-px bg-foreground/20"
          />
        </motion.div>
      ))}
    </div>
  );
}

/** Number flow — digits that roll/flip when the value changes or when scrolled into view. */
export function NumberFlow({
  value,
  suffix = "",
  className,
}: {
  value: number;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState("0");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!ref.current || started) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          const duration = 1500;
          const startTime = performance.now();
          const tick = (now: number) => {
            const t = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - t, 3);
            const current = Math.round(value * eased);
            setDisplay(current.toLocaleString());
            if (t < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 },
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [value, started]);

  return (
    <span ref={ref} className={className}>
      {display}
      {suffix}
    </span>
  );
}
