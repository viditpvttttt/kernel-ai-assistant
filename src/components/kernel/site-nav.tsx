import { Link } from "@tanstack/react-router";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";

import { useAccount } from "@/lib/cloud-sync";


import { RollText } from "./fx/roll-text";
import { KernelLogo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/lib/utils";

const links = [
  { label: "Models", href: "#models" },
  { label: "Harness", href: "#harness" },
  { label: "Connectors", href: "#connectors" },
  { label: "Skills", href: "#skills" },
  { label: "Download", href: "#download" },
];

export function SiteNav() {
  const [condensed, setCondensed] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (v) => setCondensed(v > 40));
  const { account, signOut } = useAccount();

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4"
    >
      <nav
        className={cn(
          "relative flex w-full max-w-5xl items-center justify-between rounded-full px-4 py-2 transition-all duration-500",
          condensed
            ? "border border-border bg-background/80 backdrop-blur-xl"
            : "border border-transparent",
        )}
      >
        {condensed && (
          <span
            aria-hidden
            className="spectral-hairline pointer-events-none absolute inset-x-6 top-0 h-px"
          />
        )}
        <Link to="/" aria-label="Kernel by Substrate home">
          <KernelLogo />
        </Link>
        <div className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="group relative text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <RollText text={l.label} />
              <span
                aria-hidden
                className="absolute -bottom-1 left-0 h-px w-0 bg-foreground transition-all duration-300 group-hover:w-full"
              />
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {account ? (
            <>
              <button
                type="button"
                onClick={signOut}
                className="hidden rounded-full border border-border px-3 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground sm:block"
              >
                Sign out
              </button>
              <Link
                to="/chat"
                className="rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground shadow-[0_12px_30px_-18px_var(--spectral-r)] transition-transform hover:scale-[1.04]"
              >
                Open Kernel
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/auth"
                className="hidden rounded-full border border-border px-3 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground sm:block"
              >
                Sign in
              </Link>
              <Link
                to="/chat"
                className="rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground shadow-[0_12px_30px_-18px_var(--spectral-r)] transition-transform hover:scale-[1.04]"
              >
                Start free
              </Link>
            </>
          )}
        </div>
      </nav>
    </motion.header>
  );
}
