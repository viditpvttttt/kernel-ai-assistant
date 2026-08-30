import { motion, useScroll, useTransform } from "motion/react";

/** Infinite 3D floor grid receding to the horizon; drifts on scroll. */
export function PerspectiveGrid() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  return (
    <motion.div
      aria-hidden
      style={{ opacity, perspective: 620 }}
      className="pointer-events-none absolute inset-x-0 bottom-0 h-[46vh] overflow-hidden"
    >
      <motion.div
        className="absolute inset-x-[-40%] bottom-[-30%] top-0 origin-bottom"
        style={{
          rotateX: 74,
          backgroundImage:
            "linear-gradient(to right, var(--grid) 1px, transparent 1px), linear-gradient(to bottom, var(--grid) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "linear-gradient(to top, black, transparent 78%)",
        }}
        animate={{ backgroundPositionY: ["0px", "72px"] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "linear" }}
      />
    </motion.div>
  );
}
