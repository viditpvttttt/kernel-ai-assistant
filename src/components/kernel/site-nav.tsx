import { Link } from "@tanstack/react-router";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";

import { KernelLogo } from "./logo";
import { TextRoll } from "./fx/text-roll";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/lib/utils";

const links = [
  { label: "Harness", href: "#harness" },
  { label: "Connectors", href: "#connectors" },
  { label: "Skills", href: "#skills" },
  { label: "Download", href: "#download" },
];

export function SiteNav() {
  const [condensed, setCondensed] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (v) => setCondensed(v > 40));

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4"
    >
      <nav
        className={cn(
          "flex w-full max-w-5xl items-center justify-between rounded-full px-4 py-2 transition-all duration-500",
          condensed
            ? "border border-border bg-background/80 backdrop-blur-xl"
            : "border border-transparent",
        )}
      >
        <Link to="/" aria-label="Kernel home">
          <KernelLogo />
        </Link>
        <div className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="relative text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <TextRoll>{l.label}</TextRoll>
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            to="/chat"
            className="overflow-hidden rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground transition-transform hover:scale-[1.03]"
          >
            <TextRoll>Open Kernel</TextRoll>
          </Link>
        </div>
      </nav>
    </motion.header>
  );
}
