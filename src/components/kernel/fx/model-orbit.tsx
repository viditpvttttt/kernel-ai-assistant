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
    <div className="relative mx-auto flex h-80 w-full max-w-xl items-center justify-center" style={{ perspective: 900 }}>
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
              <div className="-translate-x-1/2 -translate-y-1/2 rounded-xl border border-white/10 bg-white/[0.045] px-3 py-2 text-center shadow-[0_18px_46px_-28px_var(--spectral-b)] backdrop-blur-xl transition-colors hover:border-white/25">
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
        aria-hidden
        className="absolute h-52 w-52 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--spectral-b)_22%,transparent),transparent_68%)] blur-2xl"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 flex h-32 w-32 flex-col items-center justify-center rounded-full border border-white/15 bg-background/75 shadow-[0_0_80px_-26px_var(--spectral-r)] backdrop-blur-xl"
      >
        <span className="font-display text-lg font-light">Kernel</span>
        <span className="font-mono text-[9px] tracking-widest text-muted-foreground uppercase">
          included
        </span>
      </motion.div>
    </div>
  );
}
