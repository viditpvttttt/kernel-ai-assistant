import { useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/\\<>*·";

/** Mono label that scrambles into place when it scrolls into view. */
export function ScrambleText({
  text,
  className,
  speed = 34,
}: {
  text: string;
  className?: string;
  speed?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [out, setOut] = useState(text);

  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOut(text);
      return;
    }
    let frame = 0;
    const id = window.setInterval(() => {
      frame += 1;
      const revealed = Math.floor(frame / 2);
      setOut(
        text
          .split("")
          .map((c, i) => {
            if (i < revealed || c === " " || c === "·") return c;
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join(""),
      );
      if (revealed > text.length) window.clearInterval(id);
    }, speed);
    return () => window.clearInterval(id);
  }, [inView, text, speed]);

  return (
    <span ref={ref} className={cn("inline-block", className)}>
      {out}
    </span>
  );
}
