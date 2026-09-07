import { motion } from "motion/react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "Plan",
    body: "Kernel decomposes the request into a task graph, picks the cheapest model that can hold the context, and shows you the plan before it spends a token.",
    tag: "task graph · model routing · budget guard",
  },
  {
    title: "Act",
    body: "The harness runs tools in a sandbox: shell, browser, file system, SQL, HTTP. Every call is logged, replayable, and reversible.",
    tag: "sandboxed tools · replay · rollback",
  },
  {
    title: "Check",
    body: "A second pass verifies output against your acceptance criteria. Failures loop back into the plan instead of landing in your inbox.",
    tag: "critic pass · retries · citations",
  },
  {
    title: "Remember",
    body: "Outcomes become durable memory and reusable skills, so the next run starts where the last one finished.",
    tag: "memory · skills · evals",
  },
];

/** Horizontal expand-on-hover cards inspired by unlumen's Hover Expand. */
export function HoverExpandCards() {
  const [active, setActive] = useState(0);

  return (
    <div className="flex h-[440px] gap-3">
      {features.map((f, i) => (
        <motion.div
          key={f.title}
          onMouseEnter={() => setActive(i)}
          animate={{ flex: active === i ? 2.5 : 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 28 }}
          className={cn(
            "relative cursor-pointer overflow-hidden rounded-2xl border border-border bg-card p-6",
            active === i ? "shadow-[0_24px_60px_-40px_var(--ink)]" : "",
          )}
        >
          <div className="flex h-full flex-col justify-between">
            <div>
              <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                0{i + 1}
              </span>
              <h3 className="mt-3 font-display text-2xl font-light">{f.title}</h3>
              {active === i && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="mt-4 text-sm text-muted-foreground"
                >
                  {f.body}
                </motion.p>
              )}
            </div>
            <span className="eyebrow">{f.tag}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
