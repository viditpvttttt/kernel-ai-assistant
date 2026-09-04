import { motion, useScroll, useSpring } from "motion/react";

/** Thin spectral progress hairline pinned to the top of the page. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 26, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="spectral-bar pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] origin-left"
    />
  );
}
