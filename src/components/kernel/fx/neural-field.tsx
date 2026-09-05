import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { useEffect } from "react";

const nodes = [
  { x: 12, y: 35, label: "context" },
  { x: 28, y: 68, label: "tools" },
  { x: 48, y: 24, label: "memory" },
  { x: 67, y: 62, label: "models" },
  { x: 86, y: 30, label: "skills" },
  { x: 78, y: 84, label: "output" },
] as const;

const links = [
  { x: 12, y: 35, length: 19, rotate: 26 },
  { x: 28, y: 68, length: 23, rotate: -46 },
  { x: 48, y: 24, length: 20, rotate: 48 },
  { x: 67, y: 62, length: 22, rotate: -32 },
  { x: 48, y: 24, length: 25, rotate: 18 },
  { x: 67, y: 62, length: 17, rotate: 58 },
  { x: 78, y: 84, length: 22, rotate: -96 },
] as const;

/* A lightweight spatial network: animated links and nodes inside a pointer-reactive 3D plane. */
export function NeuralField({ className = "" }: { className?: string }) {
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const reducedMotion = useReducedMotion();
  const rotateY = useSpring(useTransform(pointerX, [-1, 1], [-8, 8]), { stiffness: 80, damping: 22 });
  const rotateX = useSpring(useTransform(pointerY, [-1, 1], [6, -6]), { stiffness: 80, damping: 22 });

  useEffect(() => {
    function onMove(event: PointerEvent) {
      pointerX.set((event.clientX / window.innerWidth - 0.5) * 2);
      pointerY.set((event.clientY / window.innerHeight - 0.5) * 2);
    }
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [pointerX, pointerY]);

  return (
    <div
      aria-hidden
      className={`relative h-[340px] w-full overflow-hidden rounded-[2rem] border border-white/10 bg-black/10 ${className}`}
      style={{ perspective: 1100 }}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="absolute inset-[-12%] [transform-style:preserve-3d]"
      >
        <div className="absolute inset-[12%] rounded-full border border-white/[0.08] [transform:rotateX(68deg)_rotateZ(-16deg)]" />
        <div className="absolute inset-[25%] rounded-full border border-white/[0.06] [transform:rotateY(65deg)_rotateZ(24deg)]" />
        {links.map((link, index) => (
          <motion.span
            key={`${link.x}-${link.y}-${index}`}
            className="absolute h-px origin-left bg-gradient-to-r from-[color:var(--spectral-b)]/10 via-[color:var(--spectral-r)]/70 to-transparent shadow-[0_0_14px_var(--spectral-r)]"
            style={{ left: link.x + "%", top: link.y + "%", width: link.length + "%", rotate: link.rotate, transform: "translateZ(-24px)" }}
            animate={reducedMotion ? undefined : { opacity: [0.18, 0.9, 0.18], scaleX: [0.84, 1.05, 0.84] }}
            transition={reducedMotion ? undefined : { duration: 3.2 + (index % 3) * 0.6, repeat: Infinity, delay: index * 0.16, ease: "easeInOut" }}
          />
        ))}
        {nodes.map((node, index) => (
          <motion.div
            key={node.label}
            className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-2"
            style={{ left: node.x + "%", top: node.y + "%", transform: "translateZ(52px)" }}
            animate={reducedMotion ? undefined : { y: [0, -8, 0] }}
            transition={reducedMotion ? undefined : { duration: 4 + (index % 3) * 0.8, repeat: Infinity, delay: index * 0.18, ease: "easeInOut" }}
          >
            <span className="relative flex h-3 w-3 items-center justify-center rounded-full border border-white/50 bg-[color:var(--spectral-r)]/35 shadow-[0_0_24px_5px_var(--spectral-r)]">
              <span className="h-1 w-1 rounded-full bg-white" />
            </span>
            <span className="font-mono text-[9px] tracking-[0.18em] text-white/45 uppercase">{node.label}</span>
          </motion.div>
        ))}
        <motion.div
          className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--spectral-b)_26%,transparent),transparent_68%)] blur-xl"
          animate={reducedMotion ? undefined : { scale: [0.9, 1.18, 0.9], opacity: [0.35, 0.65, 0.35] }}
          transition={reducedMotion ? undefined : { duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,var(--background)_92%)] opacity-60" />
      <div className="pointer-events-none absolute inset-x-8 bottom-6 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </div>
  );
}