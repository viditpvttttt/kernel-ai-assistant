import { motion, AnimatePresence } from "motion/react";
import { Check, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";
import { appleSpring, appleSpringSnappy, appleEasing } from "../fx/springs";

const FREE_FEATURES = [
  "Claude, GPT-5.5, Gemini & Grok — all included",
  "Up to 50 tool steps per turn",
  "Web browsing, code sandbox & image generation",
  "Switch models mid-conversation, on us",
  "Local-first — your data stays in your browser",
];

const MODELS = [
  { name: "Claude", by: "Anthropic", color: "oklch(0.68 0.15 30)" },
  { name: "GPT-5.5", by: "OpenAI", color: "oklch(0.72 0.12 145)" },
  { name: "Gemini", by: "Google", color: "oklch(0.70 0.13 250)" },
  { name: "Grok", by: "xAI", color: "oklch(0.65 0.14 295)" },
];

const STORAGE_KEY = "kernel:free-modal-seen";

export function FreeModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const seen = localStorage.getItem(STORAGE_KEY);
      if (!seen) {
        const t = setTimeout(() => setOpen(true), 600);
        return () => clearTimeout(t);
      }
    } catch {
      /* localStorage unavailable */
    }
  }, []);

  function dismiss() {
    setOpen(false);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={dismiss}
            className="fixed inset-0 z-[70] bg-background/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={appleSpring}
            className="fixed left-1/2 top-1/2 z-[71] w-full max-w-md -translate-x-1/2 -translate-y-1/2"
          >
            <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-[0_40px_80px_-20px_var(--ink)]">
              {/* Aurora glow */}
              <motion.div
                className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full opacity-20 blur-3xl"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.80 0.10 245), oklch(0.78 0.12 295), oklch(0.82 0.10 10))",
                }}
                animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />

              <button
                onClick={dismiss}
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="relative">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1, ...appleSpringSnappy }}
                  className="flex h-12 w-12 items-center justify-center rounded-2xl bg-foreground text-background"
                >
                  <Sparkles className="h-5 w-5" />
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.6, ease: appleEasing }}
                  className="mt-5 font-display text-2xl font-extralight tracking-tight"
                >
                  Start free. No keys, no card.
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.22, duration: 0.6, ease: appleEasing }}
                  className="mt-2 text-sm text-muted-foreground"
                >
                  Four frontier models are already wired in. Just open a chat and go.
                </motion.p>

                {/* Model chips */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6, ease: appleEasing }}
                  className="mt-5 flex flex-wrap gap-2"
                >
                  {MODELS.map((m) => (
                    <div
                      key={m.name}
                      className="flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs"
                    >
                      <span className="h-2 w-2 rounded-full" style={{ background: m.color }} />
                      <span className="font-medium text-foreground">{m.name}</span>
                      <span className="text-muted-foreground">{m.by}</span>
                    </div>
                  ))}
                </motion.div>

                {/* Feature list */}
                <motion.ul
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.06, delayChildren: 0.4 } },
                  }}
                  className="mt-6 space-y-2.5"
                >
                  {FREE_FEATURES.map((f) => (
                    <motion.li
                      key={f}
                      variants={{
                        hidden: { opacity: 0, x: -12 },
                        visible: { opacity: 1, x: 0, transition: appleSpring },
                      }}
                      className="flex items-center gap-2.5 text-sm text-foreground"
                    >
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-foreground">
                        <Check className="h-2.5 w-2.5 text-background" strokeWidth={3} />
                      </span>
                      {f}
                    </motion.li>
                  ))}
                </motion.ul>

                {/* CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.6, ease: appleEasing }}
                  className="mt-8"
                >
                  <motion.button
                    onClick={dismiss}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    transition={appleSpringSnappy}
                    className="w-full rounded-full bg-foreground py-3 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
                  >
                    Start chatting free
                  </motion.button>
                  <p className="mt-3 text-center text-[11px] text-muted-foreground">
                    No sign-up required · Switch to your own keys anytime
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
