import { ArrowUp, Image as ImageIcon, Mic, Paperclip } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

import { Ambience } from "./ambience";

const WORD = "Kernel".split("");

const modes = ["text", "vision", "audio", "video", "code", "files"];

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);

  return (
    <section ref={ref} className="paper-grid relative overflow-hidden">
      <Ambience intensity="bold" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" />
      <motion.div
        style={{ y, opacity, scale }}
        className="relative mx-auto flex min-h-[100svh] max-w-5xl flex-col items-center justify-center px-6 pt-28 pb-20 text-center"
      >
        <motion.span
          className="eyebrow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          Agentic · Multimodal · Yours
        </motion.span>

        <h1 className="mt-8 flex text-[clamp(4rem,17vw,13rem)] leading-[0.85] font-extralight tracking-[-0.03em]">
          {WORD.map((letter, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 60, filter: "blur(12px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.1 + i * 0.07, duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="inline-block"
            >
              {letter}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.9 }}
          className="mt-8 max-w-xl text-base text-muted-foreground sm:text-lg"
        >
          One quiet surface for every model you already pay for. Bring your own API keys, give it
          tools, and let it run the work end to end.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 w-full max-w-2xl"
        >
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-left shadow-[0_1px_0_var(--grid)]">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Paperclip className="h-4 w-4" />
              <ImageIcon className="h-4 w-4" />
              <Mic className="h-4 w-4" />
            </div>
            <TypingLine />
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <ArrowUp className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {modes.map((m, i) => (
              <motion.span
                key={m}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.15 + i * 0.06, duration: 0.5 }}
                className="rounded-full border border-border px-3 py-1 font-mono text-[11px] tracking-widest text-muted-foreground uppercase"
              >
                {m}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

function TypingLine() {
  const text = "Read this contract, cross-check the invoices, then draft the reply.";
  return (
    <span className="flex-1 truncate text-sm text-foreground/70">
      {text.split("").map((c, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 + i * 0.018, duration: 0.01 }}
        >
          {c}
        </motion.span>
      ))}
      <motion.span
        aria-hidden
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="ml-0.5 inline-block h-4 w-[1px] translate-y-0.5 bg-foreground/70"
      />
    </span>
  );
}
