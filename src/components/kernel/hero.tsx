import { Link } from "@tanstack/react-router";
import { ArrowUp, Image as ImageIcon, Mic, Paperclip, Sparkle } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

import { Ambience } from "./ambience";
import { ScrambleText } from "./fx/scramble-text";
import { Magnetic } from "./fx/magnetic";
import { PerspectiveGrid } from "./fx/perspective-grid";
import { Depth, Tilt3D } from "./fx/tilt";

const WORD = "Kernel".split("");

const modes = ["text", "vision", "audio", "video", "code", "files"];

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);

  return (
    <section ref={ref} className="paper-grid grain-veil relative overflow-hidden">
      <Ambience intensity="bold" />
      <PerspectiveGrid />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" />
      <motion.div
        style={{ y, opacity, scale }}
        className="relative mx-auto flex min-h-[100svh] max-w-5xl flex-col items-center justify-center px-6 pt-28 pb-20 text-center"
      >
        <motion.span
          className="eyebrow flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          <Sparkle className="h-3 w-3" />
          <ScrambleText text="Kernel by Substrate · models included" />
        </motion.span>

        <h1 className="mt-8 flex text-[clamp(4rem,17vw,13rem)] leading-[0.85] font-extralight tracking-[-0.03em]">
          {WORD.map((letter, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 60, rotateX: -60, filter: "blur(12px)" }}
              animate={{ opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.1 + i * 0.07, duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="inline-block [transform-style:preserve-3d]"
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
          Claude, GPT‑5.5, Gemini and Grok are already wired in — no keys, no card, no setup. One
          quiet agentic surface that plans, calls tools, and finishes the work.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 w-full max-w-2xl"
        >
          <Tilt3D max={8} className="w-full">
            <Depth z={30}>
              <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-left shadow-[0_30px_60px_-40px_var(--ink)]">
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
            </Depth>
          </Tilt3D>
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

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-3"
          >
            <Magnetic>
              <Link
                to="/chat"
                className="rounded-full bg-primary px-6 py-3 text-sm text-primary-foreground transition-transform hover:scale-[1.03]"
              >
                Start chatting free
              </Link>
            </Magnetic>
            <Magnetic>
              <a
                href="#download"
                className="rounded-full border border-border px-6 py-3 text-sm transition-colors hover:bg-accent"
              >
                Download for desktop
              </a>
            </Magnetic>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
        >
          <span className="eyebrow">Scroll</span>
          <motion.span
            aria-hidden
            animate={{ height: [8, 26, 8], opacity: [0.25, 0.8, 0.25] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            className="w-px bg-foreground"
          />
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
