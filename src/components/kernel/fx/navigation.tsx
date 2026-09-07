import { motion } from "motion/react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Dock-style floating navigation — icons that scale up on hover, like macOS dock. */
export function DockNav({
  items,
}: {
  items: { label: string; icon: ReactNode; href: string }[];
}) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="flex items-end gap-2 rounded-2xl border border-border bg-card/80 px-3 py-2 backdrop-blur-xl">
      {items.map((item, i) => (
        <a
          key={item.label}
          href={item.href}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(null)}
          className="flex flex-col items-center gap-1"
        >
          <motion.div
            animate={{
              scale: hovered === i ? 1.4 : hovered !== null && Math.abs(hovered - i) === 1 ? 1.15 : 1,
              y: hovered === i ? -8 : 0,
            }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background text-foreground"
          >
            {item.icon}
          </motion.div>
          <motion.span
            animate={{ opacity: hovered === i ? 1 : 0 }}
            className="text-[10px] font-mono text-muted-foreground"
          >
            {item.label}
          </motion.span>
        </a>
      ))}
    </div>
  );
}

/** Expandable tabs — tabs that expand to reveal content on click. */
export function ExpandableTabs({
  tabs,
}: {
  tabs: { label: string; body: ReactNode }[];
}) {
  const [active, setActive] = useState(0);

  return (
    <div className="flex gap-2">
      {tabs.map((tab, i) => (
        <motion.div
          key={tab.label}
          onClick={() => setActive(i)}
          animate={{ flex: active === i ? 3 : 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 26 }}
          className={cn(
            "cursor-pointer overflow-hidden rounded-2xl border border-border bg-card p-5",
            active === i ? "min-h-[200px]" : "min-h-[200px]",
          )}
        >
          <div className="flex h-full flex-col justify-between">
            <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
              0{i + 1}
            </span>
            <h4 className="mt-2 font-display text-lg font-light">{tab.label}</h4>
            {active === i && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 text-sm text-muted-foreground"
              >
                {tab.body}
              </motion.div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
