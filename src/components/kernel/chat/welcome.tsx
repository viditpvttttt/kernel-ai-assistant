import { Braces, Compass, FlaskConical, Image as ImageIcon } from "lucide-react";
import { motion } from "motion/react";

import { KernelMark } from "@/components/kernel/logo";
import { Depth, Tilt3D } from "@/components/kernel/fx/tilt";

const suggestions = [
  {
    icon: Compass,
    label: "Research with sources",
    prompt: "Research the current state of on-device LLM inference and cite your sources.",
  },
  {
    icon: FlaskConical,
    label: "Multi-step analysis",
    prompt:
      "Take this quarter's numbers, compute growth rates, and tell me which line item is dragging.",
  },
  {
    icon: Braces,
    label: "Write and run code",
    prompt: "Write a JavaScript function that parses a CSV, then run it on sample input.",
  },
  {
    icon: ImageIcon,
    label: "Generate an image",
    prompt: "Generate a minimal poster of a paper grid with a single glowing seed in the centre.",
  },
];

const greeting = "What should Kernel run for you?";

/** Empty-thread hero: animated greeting plus 3D suggestion cards. */
export function ChatWelcome({ onPick }: { onPick: (prompt: string) => void }) {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-6 text-center sm:px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="flex justify-center"
      >
        <KernelMark spin className="h-10 w-10" />
      </motion.div>

      <h1 className="mt-6 flex flex-wrap justify-center gap-x-2 font-display text-[clamp(1.6rem,5vw,2.4rem)] leading-tight font-light tracking-tight">
        {greeting.split(" ").map((word, i) => (
          <motion.span
            key={`${word}-${i}`}
            initial={{ opacity: 0, y: 14, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.15 + i * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {word}
          </motion.span>
        ))}
      </h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="mt-3 text-sm text-muted-foreground"
      >
        Claude, GPT‑5.5, Gemini and Grok are included — pick a model in the header and go.
      </motion.p>

      <div className="mt-10 grid gap-3 sm:grid-cols-2">
        {suggestions.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 + i * 0.07, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <Tilt3D max={9}>
              <Depth z={18}>
                <button
                  type="button"
                  onClick={() => onPick(s.prompt)}
                  className="group flex w-full items-start gap-3 rounded-2xl border border-border bg-card p-4 text-left transition-colors hover:bg-accent"
                >
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors group-hover:text-foreground">
                    <s.icon className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-sm font-medium">{s.label}</span>
                    <span className="mt-1 block text-xs text-muted-foreground">{s.prompt}</span>
                  </span>
                </button>
              </Depth>
            </Tilt3D>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
