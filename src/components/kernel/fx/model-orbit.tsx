import { motion } from "motion/react";

const RING = [
  { label: "Claude", note: "Anthropic", color: "oklch(0.72 0.15 25)" },
  { label: "GPT-5.5", note: "OpenAI", color: "oklch(0.72 0.15 200)" },
  { label: "Gemini", note: "Google", color: "oklch(0.72 0.15 250)" },
  { label: "Grok", note: "xAI", color: "oklch(0.72 0.15 300)" },
  { label: "Llama", note: "Meta", color: "oklch(0.72 0.15 160)" },
  { label: "Mistral", note: "Mistral", color: "oklch(0.72 0.15 330)" },
];

/** A 3D orbital ring of provider chips rotating around a glowing Kernel core. */
export function ModelOrbit() {
  return (
    <div
      className="relative mx-auto flex h-80 w-full max-w-xl items-center justify-center"
      style={{ perspective: 1200 }}
    >
      {/* Glow behind core */}
      <motion.div
        className="absolute h-40 w-40 rounded-full blur-3xl"
        style={{ background: "var(--aurora-1)" }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Orbit ring */}
      <motion.div
        className="absolute inset-0"
        style={{ transformStyle: "preserve-3d", rotateX: 75 }}
        animate={{ rotateZ: 360 }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      >
        {/* Faint orbit track */}
        <div
          className="absolute top-1/2 left-1/2 rounded-full border border-border/40"
          style={{
            width: 420,
            height: 420,
            transform: "translate(-50%, -50%)",
          }}
        />
        {RING.map((item, i) => {
          const angle = (i / RING.length) * 360;
          return (
            <div
              key={item.label}
              className="absolute top-1/2 left-1/2"
              style={{
                transform: `rotateZ(${angle}deg) translateX(210px) rotateZ(${-angle}deg) rotateX(-75deg)`,
                transformStyle: "preserve-3d",
              }}
            >
              <motion.div
                className="-translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-card/90 px-3.5 py-2 text-center shadow-[0_10px_30px_-18px_var(--ink)] backdrop-blur"
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.4, ease: "easeInOut" }}
              >
                <div
                  className="mx-auto mb-1 h-1 w-8 rounded-full"
                  style={{ background: item.color }}
                />
                <p className="font-display text-sm leading-none">{item.label}</p>
                <p className="mt-1 font-mono text-[9px] tracking-widest text-muted-foreground uppercase">
                  {item.note}
                </p>
              </motion.div>
            </div>
          );
        })}
      </motion.div>

      {/* Center core */}
      <motion.div
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 flex h-28 w-28 flex-col items-center justify-center rounded-full border border-border bg-background/90 shadow-[0_0_60px_-10px_var(--aurora-1)] backdrop-blur"
      >
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ background: "var(--aurora-1)", opacity: 0.15 }}
          animate={{ opacity: [0.1, 0.25, 0.1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <span className="relative font-display text-lg font-light">Kernel</span>
        <span className="relative font-mono text-[9px] tracking-widest text-muted-foreground uppercase">
          included
        </span>
      </motion.div>
    </div>
  );
}
