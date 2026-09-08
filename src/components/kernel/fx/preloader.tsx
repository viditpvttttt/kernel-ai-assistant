import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const WORDS = ["Hello", "Bonjour", "स्वागत हे", "Ciao", "Olá", "おい", "Hallå", "Guten tag", "Hallo"];

/**
 * Skiper.UI-style word preloader — greeting words in different languages,
 * inspired by dennissnellenberg.com. Cycles through with a mask reveal
 * animation, then fades out to reveal the page.
 */
export function WordPreloader() {
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i++;
      if (i >= WORDS.length) {
        clearInterval(interval);
        setTimeout(() => setDone(true), 500);
      } else {
        setIndex(i);
      }
    }, 320);
    return () => clearInterval(interval);
  }, []);

  if (done) return null;

  return (
    <motion.div
      exit={{ opacity: 0, transition: { duration: 0.7, ease: "easeInOut" } }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
    >
      <div className="relative flex h-14 items-center overflow-hidden">
        <motion.span
          key={index}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-3xl font-light tracking-tight"
        >
          {WORDS[index]}
        </motion.span>
      </div>
      <motion.div
        className="absolute bottom-[34%] h-px bg-foreground/20"
        initial={{ width: 0 }}
        animate={{ width: `${((index + 1) / WORDS.length) * 160}px` }}
        transition={{ duration: 0.35 }}
      />
    </motion.div>
  );
}
