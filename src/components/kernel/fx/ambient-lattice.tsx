import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { useEffect } from "react";

const nodes = [
  [12, 24], [28, 12], [50, 18], [72, 10], [88, 28],
  [18, 54], [38, 42], [62, 48], [82, 58],
  [8, 82], [32, 78], [56, 88], [78, 80], [94, 74],
] as const;

/* Cursor-reactive wireframe field; spatial depth without a WebGL dependency. */
export function AmbientLattice() {
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const reducedMotion = useReducedMotion();
  const rotateY = useSpring(useTransform(pointerX, [-1, 1], [-9, 9]), { stiffness: 90, damping: 20 });
  const rotateX = useSpring(useTransform(pointerY, [-1, 1], [8, -8]), { stiffness: 90, damping: 20 });

  useEffect(() => {
    function onMove(event: PointerEvent) {
      pointerX.set((event.clientX / window.innerWidth - 0.5) * 2);
      pointerY.set((event.clientY / window.innerHeight - 0.5) * 2);
    }
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [pointerX, pointerY]);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="absolute left-1/2 top-[48%] h-[min(78vw,720px)] w-[min(78vw,720px)] -translate-x-1/2 -translate-y-1/2 [transform-style:preserve-3d]"
      >
        <motion.div
          className="absolute inset-[10%] rounded-full border border-white/10 shadow-[0_0_120px_-50px_var(--spectral-b)]"
          style={{ transform: "rotateX(68deg) rotateZ(-12deg)" }}
          {...(reducedMotion
            ? {}
            : {
                animate: { rotateZ: [-12, 348] },
                transition: { duration: 42, repeat: Infinity, ease: "linear" as const },
              })}
        />
        <motion.div
          className="absolute inset-[18%] rounded-full border border-white/10"
          style={{ transform: "rotateY(68deg) rotateZ(18deg)" }}
          {...(reducedMotion
            ? {}
            : {
                animate: { rotateZ: [18, -342] },
                transition: { duration: 34, repeat: Infinity, ease: "linear" as const },
              })}
        />
        <div className="absolute inset-[26%] rounded-full border border-white/10" />
        <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_35%_30%,white,color-mix(in_oklab,var(--spectral-r)_60%,transparent)_24%,transparent_68%)] opacity-35 blur-[2px]" />
        {nodes.map(([left, top], index) => (
          <motion.span
            key={left + "-" + top}
            className="absolute h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_18px_3px_var(--spectral-r)]"
            style={{ left: left + "%", top: top + "%", transform: "translateZ(34px)" }}
            {...(reducedMotion
              ? {}
              : {
                  animate: { opacity: [0.18, 0.9, 0.18], scale: [0.7, 1.3, 0.7] },
                  transition: {
                    duration: 2.8 + (index % 4) * 0.55,
                    repeat: Infinity,
                    delay: index * 0.12,
                    ease: "easeInOut" as const,
                  },
                })}
          />
        ))}
      </motion.div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,var(--background)_92%)] opacity-70" />
    </div>
  );
}