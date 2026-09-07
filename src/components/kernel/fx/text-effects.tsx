import { motion, useScroll, useSpring } from "motion/react";

/** 3D scroll progress bar — a thin gradient line at the top that fills as you scroll. */
export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-[oklch(0.80_0.10_245)] via-[oklch(0.78_0.12_295)] to-[oklch(0.75_0.14_35)]"
    />
  );
}

/** 3D perspective text that rotates and tilts based on scroll position. */
export function PerspectiveText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const words = text.split(" ");

  return (
    <div style={{ perspective: 800 }} className={className}>
      <div className="flex flex-wrap" style={{ transformStyle: "preserve-3d" }}>
        {words.map((word, i) => (
          <motion.span
            key={`${word}-${i}`}
            initial={{ opacity: 0, rotateX: -90, y: 40 }}
            whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: i * 0.06, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mr-[0.28em] inline-block [transform-style:preserve-3d]"
          >
            {word}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

/** Animated gradient text that shifts colors continuously. */
export function GradientText({
  children,
  className,
}: {
  children: React.ReactNode;
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

/** Rolling/rotating text that cycles through words vertically. */
export function RollingText({
  words,
  className,
}: {
  words: string[];
  className?: string;
}) {
  return (
    <span className={`relative inline-flex h-[1.2em] overflow-hidden align-bottom ${className ?? ""}`}>
      <motion.span
        animate={{ y: ["0%", `-${words.length * 100}%`] }}
        transition={{ duration: words.length * 1.4, repeat: Infinity, ease: "linear" }}
        className="flex flex-col"
      >
        {[...words, ...words].map((w, i) => (
          <span key={i} className="block h-[1.2em] leading-[1.2em]">
            {w}
          </span>
        ))}
      </motion.span>
    </span>
  );
}
