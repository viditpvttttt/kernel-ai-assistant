import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const WORDS = ["Thinking", "Connecting", "Routing", "Loading", "Ready"];

/**
 * Skiper.UI-style word preloader. Cycles through words with a mask reveal
 * animation, then fades out to reveal the page.
 */
export function WordPreloader() {
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) return;
    const interval = setInterval(() => {
      setIndex((prev) => {
        if (prev >= WORDS.length - 1) {
          clearInterval(interval);
          setTimeout(() => setDone(true), 400);
          return prev;
        }
        return prev + 1;
      });
    }, 420);
    return () => clearInterval(interval);
  }, [done]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
        >
          <div className="relative flex h-12 items-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.span
                key={index}
                initial={{ y: "100%" }}
                animate={{ y: "0%" }}
                exit={{ y: "-100%" }}
                transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
                className="font-display text-2xl font-light tracking-tight"
              >
                {WORDS[index]}
              </motion.span>
            </AnimatePresence>
          </div>
          <motion.div
            className="absolute bottom-[35%] h-px bg-foreground/20"
            initial={{ width: 0 }}
            animate={{ width: `${((index + 1) / WORDS.length) * 120 }px` }}
            transition={{ duration: 0.4 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
