import { Plus, Search, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";

import type { Thread } from "@/lib/kernel-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export function ThreadSidebar({
  threads,
  activeId,
  onSelect,
  onNew,
  onDelete,
}: {
  threads: Thread[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const sorted = [...threads].sort((a, b) => b.createdAt - a.createdAt);
    if (!query.trim()) return sorted;
    const q = query.toLowerCase();
    return sorted.filter(
      (t) => t.title.toLowerCase().includes(q) || t.messages.some((m) => m.content.toLowerCase().includes(q)),
    );
  }, [threads, query]);

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-background/40 md:flex">
      <div className="space-y-2 p-3">
        <Button variant="outline" className="w-full justify-start gap-2 rounded-xl" onClick={onNew}>
          <Plus className="h-4 w-4" /> New chat
        </Button>
        <div className="relative">
          <Search className="absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search chats"
            className="h-8 rounded-xl pl-8 text-xs"
          />
        </div>
      </div>
      <ScrollArea className="flex-1 px-2">
        <div className="flex flex-col gap-0.5 pb-4">
          <AnimatePresence initial={false}>
            {filtered.map((t) => (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8, height: 0 }}
                transition={{ duration: 0.18 }}
                className={cn(
                  "group relative flex items-center gap-2 rounded-xl px-2.5 py-2 text-sm transition-colors",
                  t.id === activeId ? "text-foreground" : "text-muted-foreground hover:bg-accent/50",
                )}
              >
                {t.id === activeId && (
                  <motion.div
                    layoutId="active-thread-pill"
                    className="absolute inset-0 rounded-xl bg-accent"
                    transition={{ type: "spring", stiffness: 500, damping: 40 }}
                  />
                )}
                <button
                  type="button"
                  onClick={() => onSelect(t.id)}
                  className="relative z-10 flex-1 truncate text-left"
                >
                  <span className="block truncate">{t.title}</span>
                  <span className="block text-[11px] text-muted-foreground">
                    {formatDistanceToNow(t.createdAt, { addSuffix: true })}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(t.id)}
                  className="relative z-10 opacity-0 transition-opacity group-hover:opacity-100"
                  aria-label="Delete session"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
          {filtered.length === 0 && (
            <p className="px-2.5 py-2 text-xs text-muted-foreground">
              {query ? "No matches." : "No sessions yet."}
            </p>
          )}
        </div>
      </ScrollArea>
    </aside>
  );
}

