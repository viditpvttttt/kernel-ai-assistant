import { Plus, Search, Settings, Trash2, SquarePen, Plug, Sparkles, FileText, MessageSquare } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";

import type { Thread } from "@/lib/kernel-store";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

/** Groups threads by relative date bucket for easy history navigation. */
function dateBucket(ts: number): string {
  const now = new Date();
  const d = new Date(ts);
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfYesterday = startOfToday - 86_400_000;
  const startOfWeek = startOfToday - 7 * 86_400_000;

  if (ts >= startOfToday) return "Today";
  if (ts >= startOfYesterday) return "Yesterday";
  if (ts >= startOfWeek) return "Previous 7 days";
  return "Older";
}

function formatTime(ts: number): string {
  const d = new Date(ts);
  const now = new Date();
  const diffMs = now.getTime() - ts;
  const diffMin = Math.floor(diffMs / 60_000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function ThreadSidebar({
  threads,
  activeId,
  onSelect,
  onNew,
  onDelete,
  onOpenSettings,
}: {
  threads: Thread[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  onOpenSettings?: (section?: string) => void;
}) {
  const [query, setQuery] = useState("");

  const { grouped, totalCount } = useMemo(() => {
    const sorted = [...threads].sort((a, b) => b.createdAt - a.createdAt);
    if (!query.trim()) {
      const groups: Record<string, Thread[]> = {};
      for (const t of sorted) {
        const bucket = dateBucket(t.createdAt);
        (groups[bucket] ??= []).push(t);
      }
      return { grouped: groups, totalCount: sorted.length };
    }
    const q = query.toLowerCase();
    const filtered = sorted.filter(
      (t) => t.title.toLowerCase().includes(q) || t.messages.some((m) => m.content.toLowerCase().includes(q)),
    );
    return { grouped: { Results: filtered }, totalCount: filtered.length };
  }, [threads, query]);

  const bucketOrder = ["Today", "Yesterday", "Previous 7 days", "Older", "Results"];

  return (
    <aside className="hidden w-64 shrink-0 flex-col bg-sidebar md:flex">
      {/* Header */}
      <div className="flex items-center justify-between px-3 pt-3 pb-1">
        <span className="font-display text-base font-semibold text-sidebar-foreground">Kernel</span>
        <button
          type="button"
          onClick={onNew}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-sidebar-foreground transition-colors hover:bg-sidebar-accent"
          aria-label="New chat"
        >
          <SquarePen className="h-4 w-4" />
        </button>
      </div>

      {/* Search */}
      <div className="px-3 pb-2">
        <div className="relative">
          <Search className="absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search chats"
            className="h-8 rounded-lg bg-sidebar-accent/50 pl-8 text-xs text-sidebar-foreground placeholder:text-muted-foreground border-none focus-visible:ring-0"
          />
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex flex-col gap-0.5 px-2 pb-2">
        <button
          type="button"
          onClick={onNew}
          className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent"
        >
          <Plus className="h-4 w-4" /> New chat
        </button>
        {onOpenSettings && (
          <>
            <button
              type="button"
              onClick={() => onOpenSettings("connectors")}
              className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent"
            >
              <Plug className="h-4 w-4" /> Connectors &amp; MCP
            </button>
            <button
              type="button"
              onClick={() => onOpenSettings("skills")}
              className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent"
            >
              <Sparkles className="h-4 w-4" /> Skills
            </button>
            <button
              type="button"
              onClick={() => onOpenSettings("plugins")}
              className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent"
            >
              <FileText className="h-4 w-4" /> Plugins &amp; Tools
            </button>
          </>
        )}
      </div>

      {/* Thread list — grouped by date bucket */}
      <ScrollArea className="flex-1 px-2">
        <div className="flex flex-col gap-0.5 pb-2">
          {totalCount === 0 && (
            <div className="flex flex-col items-center gap-2 px-3 py-8 text-center">
              <MessageSquare className="h-8 w-8 text-muted-foreground/40" />
              <p className="text-xs text-muted-foreground">
                {query ? "No matches found." : "No conversations yet."}
              </p>
            </div>
          )}

          {bucketOrder
            .filter((bucket) => grouped[bucket]?.length)
            .map((bucket) => (
              <div key={bucket}>
                <p className="px-2.5 pb-1 pt-3 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                  {bucket}
                </p>
                <AnimatePresence initial={false}>
                  {grouped[bucket].map((t) => (
                    <motion.div
                      key={t.id}
                      layout
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8, height: 0 }}
                      transition={{ duration: 0.18 }}
                      className={cn(
                        "group relative flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm transition-colors",
                        t.id === activeId
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent/60",
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => onSelect(t.id)}
                        className="relative z-10 flex-1 truncate text-left"
                      >
                        <span className="block truncate">{t.title}</span>
                        <span className="mt-0.5 block text-[10px] text-muted-foreground">
                          {formatTime(t.createdAt)} · {t.messages.length} {t.messages.length === 1 ? "msg" : "msgs"}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(t.id)}
                        className="relative z-10 opacity-0 transition-opacity group-hover:opacity-100"
                        aria-label="Delete session"
                      >
                        <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-2">
        {onOpenSettings && (
          <button
            type="button"
            onClick={() => onOpenSettings("keys")}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent"
          >
            <Settings className="h-4 w-4" /> Settings
          </button>
        )}
      </div>
    </aside>
  );
}
