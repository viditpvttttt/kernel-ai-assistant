import { motion } from "motion/react";

const RING = [
  { label: "Claude", note: "Anthropic" },
  { label: "GPT-5.5", note: "OpenAI" },
  { label: "Gemini", note: "Google" },
  { label: "Grok", note: "xAI" },
  { label: "Llama", note: "Meta" },
  { label: "Mistral", note: "Mistral" },
];

/** A 3D ring of provider chips rotating around the Kernel core — no keys required. */
export function ModelOrbit() {
  return (
    <div className="relative mx-auto flex h-72 w-full max-w-xl items-center justify-center" style={{ perspective: 900 }}>
      <motion.div
        className="absolute inset-0"
        style={{ transformStyle: "preserve-3d", rotateX: 68 }}
        animate={{ rotateZ: 360 }}
        transition={{ duration: 34, repeat: Infinity, ease: "linear" }}
      >
        {RING.map((item, i) => {
          const angle = (i / RING.length) * 360;
          return (
            <div
              key={item.label}
              className="absolute top-1/2 left-1/2"
              style={{
                transform: `rotateZ(${angle}deg) translateX(210px) rotateZ(${-angle}deg) rotateX(-68deg)`,
                transformStyle: "preserve-3d",
              }}
            >
              <div className="-translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-card/90 px-3 py-2 text-center shadow-[0_10px_30px_-18px_var(--ink)] backdrop-blur">
                <p className="font-display text-sm leading-none">{item.label}</p>
                <p className="mt-1 font-mono text-[9px] tracking-widest text-muted-foreground uppercase">
                  {item.note}
                </p>
              </div>
            </div>
          );
        })}
      </motion.div>

      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 flex h-28 w-28 flex-col items-center justify-center rounded-full border border-border bg-background/80 backdrop-blur"
      >
        <span className="font-display text-lg font-light">Kernel</span>
        <span className="font-mono text-[9px] tracking-widest text-muted-foreground uppercase">
          included
        </span>
      </motion.div>
    </div>
  );
}
