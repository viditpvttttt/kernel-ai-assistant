/**
 * Apple-inspired spring physics presets.
 *
 * These mirror the feel of iOS/macOS animations: snappy, never bouncy,
 * with just enough settle to feel organic.
 */

export const appleSpring = {
  type: "spring" as const,
  stiffness: 260,
  damping: 30,
  mass: 0.8,
};

export const appleSpringSnappy = {
  type: "spring" as const,
  stiffness: 500,
  damping: 30,
  mass: 0.6,
};

export const appleSpringGentle = {
  type: "spring" as const,
  stiffness: 120,
  damping: 22,
  mass: 1,
};

export const appleSpringBouncy = {
  type: "spring" as const,
  stiffness: 400,
  damping: 14,
  mass: 0.7,
};

/** The signature Apple ease-out cubic bezier. */
export const appleEasing = [0.22, 1, 0.36, 1] as const;

/** Staggered children container config. */
export const staggerContainer = (stagger: number = 0.05) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: stagger, delayChildren: 0.1 },
  },
});

/** Standard child variant for staggered containers. */
export const staggerChild = {
  hidden: { opacity: 0, y: 16, scale: 0.96, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: appleSpring,
  },
};
