import { AlertCircle, Check, ChevronDown, Loader2, Wrench } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

import type { AgentStep } from "@/lib/agent";
import { cn } from "@/lib/utils";

/** Groups raw step events into per-tool-call rows (call + its result), plus thinking/final markers. */
function groupSteps(steps: AgentStep[]) {
  type Row =
    | { kind: "thinking" }
    | { kind: "tool"; tool: string; args: Record<string, unknown>; result?: string; ok?: boolean; done: boolean }
    | { kind: "final"; text: string }
    | { kind: "error"; message: string };

  const rows: Row[] = [];
  const byId = new Map<string, number>();

  for (const step of steps) {
    if (step.kind === "thinking") rows.push({ kind: "thinking" });
    else if (step.kind === "tool_call") {
      byId.set(step.id, rows.length);
      rows.push({ kind: "tool", tool: step.tool, args: step.args, done: false });
    } else if (step.kind === "tool_result") {
      const idx = byId.get(step.id);
      const row = idx !== undefined ? rows[idx] : undefined;
      if (row && row.kind === "tool") {
        row.result = step.result;
        row.ok = step.ok;
        row.done = true;
      }
    } else if (step.kind === "final") rows.push({ kind: "final", text: step.text });
    else if (step.kind === "error") rows.push({ kind: "error", message: step.message });
  }

  return rows;
}

export function StepTrace({ steps }: { steps: AgentStep[] }) {
  const rows = groupSteps(steps);
  if (rows.length === 0) return null;

  return (
    <div className="mx-4 mb-2 rounded-xl border border-border bg-card/60 p-2 sm:mx-6">
      <p className="px-2 pt-1 pb-2 text-[11px] tracking-widest text-muted-foreground uppercase">
        Agent trace
      </p>
      <div className="flex flex-col gap-1">
        <AnimatePresence initial={false}>
          {rows.map((row, i) => {
            if (row.kind === "thinking") {
              return (
                <motion.div
                  key={`think-${i}`}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 px-2 py-1 text-xs text-muted-foreground"
                >
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Planning next step…
                </motion.div>
              );
            }
            if (row.kind === "final") {
              return (
                <motion.div
                  key={`final-${i}`}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 px-2 py-1 text-xs text-emerald-600 dark:text-emerald-400"
                >
                  <Check className="h-3.5 w-3.5" /> Done
                </motion.div>
              );
            }
            if (row.kind === "error") {
              return (
                <motion.div
                  key={`err-${i}`}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 px-2 py-1 text-xs text-red-500"
                >
                  <AlertCircle className="h-3.5 w-3.5" /> {row.message}
                </motion.div>
              );
            }
            return <ToolRow key={`tool-${i}`} row={row} />;
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ToolRow({
  row,
}: {
  row: { tool: string; args: Record<string, unknown>; result?: string; ok?: boolean; done: boolean };
}) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg border border-border/70 bg-background/60"
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2 px-2 py-1.5 text-left text-xs"
      >
        {row.done ? (
          row.ok ? (
            <Check className="h-3.5 w-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <AlertCircle className="h-3.5 w-3.5 shrink-0 text-red-500" />
          )
        ) : (
          <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-muted-foreground" />
        )}
        <Wrench className="h-3 w-3 shrink-0 text-muted-foreground" />
        <span className="flex-1 truncate font-mono">{row.tool}</span>
        <ChevronDown className={cn("h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="space-y-1.5 border-t border-border/70 px-2 py-2 text-[11px]">
              <div>
                <span className="text-muted-foreground">args</span>
                <pre className="mt-0.5 overflow-x-auto rounded bg-muted p-1.5 font-mono">
                  {JSON.stringify(row.args, null, 2)}
                </pre>
              </div>
              {row.result !== undefined && (
                <div>
                  <span className="text-muted-foreground">result</span>
                  <pre className="mt-0.5 max-h-32 overflow-auto rounded bg-muted p-1.5 font-mono whitespace-pre-wrap">
                    {row.result}
                  </pre>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
