import { ArrowDown, Check, Copy, RotateCcw, SquarePen } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Streamdown } from "streamdown";

import type { ChatMessage } from "@/lib/agent";
import { Button } from "@/components/ui/button";
import { KernelMark } from "@/components/kernel/logo";
import { TextRoll } from "@/components/kernel/fx/text-roll";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="h-6 w-6 text-muted-foreground"
      aria-label="Copy message"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {copied ? (
          <motion.span
            key="check"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Check className="h-3.5 w-3.5" />
          </motion.span>
        ) : (
          <motion.span
            key="copy"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Copy className="h-3.5 w-3.5" />
          </motion.span>
        )}
      </AnimatePresence>
    </Button>
  );
}

const messageVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

const SUGGESTIONS = [
  { icon: "✦", label: "Brainstorm ideas for a project" },
  { icon: "✎", label: "Help me write something" },
  { icon: "⌘", label: "Explain a concept simply" },
  { icon: "⊳", label: "Write or debug some code" },
];

export function MessageList({
  messages,
  onEditUser,
  onRegenerate,
  streamingText,
  onPickSuggestion,
}: {
  messages: ChatMessage[];
  onEditUser?: (id: string, text: string) => void;
  onRegenerate?: (id: string) => void;
  streamingText?: string | undefined;
  onPickSuggestion?: (text: string) => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [atBottom, setAtBottom] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const lastAssistantId = [...messages].reverse().find((m) => m.role === "assistant")?.id;

  useEffect(() => {
    if (atBottom) bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages.length, streamingText]);

  function handleScroll() {
    const el = containerRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setAtBottom(distanceFromBottom < 80);
  }

  function jumpToBottom() {
    setAtBottom(true);
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }

  if (messages.length === 0 && streamingText === undefined) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-1 flex-col items-center justify-center gap-8 px-6 text-center"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="absolute inset-0 -z-10 blur-2xl opacity-30">
            <KernelMark className="h-10 w-20" />
          </div>
          <KernelMark className="h-10 w-20" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="font-display text-3xl font-extralight tracking-tight text-foreground">
            Ready when you are.
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Ask anything — Kernel will plan, search, and ship.
          </p>
        </motion.div>

        {onPickSuggestion && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="grid w-full max-w-lg grid-cols-1 gap-2.5 sm:grid-cols-2"
          >
            {SUGGESTIONS.map((s, i) => (
              <motion.button
                key={s.label}
                type="button"
                onClick={() => onPickSuggestion(s.label)}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.06, duration: 0.5 }}
                whileHover={{ y: -2 }}
                className="group relative flex items-center gap-3 overflow-hidden rounded-2xl border border-border bg-card/50 px-4 py-3 text-left text-sm text-muted-foreground backdrop-blur-sm transition-all duration-300 hover:border-foreground/20 hover:bg-card hover:text-foreground hover:shadow-[0_8px_30px_-12px_var(--ink)]"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted text-xs transition-colors group-hover:bg-foreground group-hover:text-background">
                  {s.icon}
                </span>
                <span className="truncate font-light">{s.label}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </motion.div>
    );
  }

  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 overflow-y-auto px-4 py-8 sm:px-6"
      >
      <AnimatePresence initial={false}>
        {messages.map((m) => {
          if (m.role === "user") {
            const editing = editingId === m.id;
            return (
              <motion.div
                key={m.id}
                layout
                variants={messageVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="group flex flex-col items-end gap-1.5"
              >
                {m.attachments && m.attachments.length > 0 && (
                  <div className="flex flex-wrap justify-end gap-2">
                    {m.attachments.map((a, ai) =>
                      a.kind === "image" ? (
                        <img
                          key={ai}
                          src={a.dataUrl}
                          alt={a.name ?? "attachment"}
                          className="h-28 w-28 rounded-xl border border-border object-cover"
                        />
                      ) : (
                        <audio key={ai} src={a.dataUrl} controls className="h-9 max-w-[220px]" />
                      ),
                    )}
                  </div>
                )}
                {m.content && !editing && (
                  <div className="max-w-[85%] rounded-3xl bg-muted px-4 py-2.5 text-[15px] leading-relaxed whitespace-pre-wrap text-foreground">
                    {m.content}
                  </div>
                )}
                {editing && (
                  <div className="w-full max-w-[85%] space-y-2">
                    <textarea
                      autoFocus
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      className="w-full resize-none rounded-2xl border border-border bg-background p-3 text-[15px] leading-relaxed focus:outline-none"
                      rows={Math.min(8, Math.max(2, draft.split("\n").length))}
                    />
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => {
                          onEditUser?.(m.id, draft);
                          setEditingId(null);
                        }}
                      >
                        Save &amp; submit
                      </Button>
                    </div>
                  </div>
                )}
                {m.content && !editing && onEditUser && (
                  <div className="flex gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-muted-foreground"
                      aria-label="Edit message"
                      onClick={() => {
                        setEditingId(m.id);
                        setDraft(m.content);
                      }}
                    >
                      <SquarePen className="h-3.5 w-3.5" />
                    </Button>
                    <CopyButton text={m.content} />
                  </div>
                )}
              </motion.div>
            );
          }

          const isLastAssistant = m.id === lastAssistantId;
          return (
            <motion.div
              key={m.id}
              layout
              variants={messageVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="group flex gap-3"
            >
              <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-card">
                <KernelMark className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1 space-y-1.5">
                {m.attachments && m.attachments.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {m.attachments.map((a, ai) =>
                      a.kind === "image" ? (
                        <motion.img
                          key={ai}
                          initial={{ opacity: 0, scale: 0.96 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                          src={a.dataUrl}
                          alt={a.name ?? "generated image"}
                          className="max-h-72 rounded-xl border border-border object-cover"
                        />
                      ) : (
                        <audio key={ai} src={a.dataUrl} controls className="h-9 max-w-[220px]" />
                      ),
                    )}
                  </div>
                )}
                <div className="max-w-none text-[15px] leading-relaxed">
                  <Streamdown className="kernel-prose">{m.content}</Streamdown>
                </div>
                <div className="flex gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                  <CopyButton text={m.content} />
                  {onRegenerate && isLastAssistant && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-muted-foreground"
                      aria-label="Regenerate response"
                      onClick={() => onRegenerate(m.id)}
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}

        {streamingText !== undefined && (
          <motion.div
            key="__streaming"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex gap-3"
          >
            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-card">
              <KernelMark className="h-4 w-4" spin />
            </div>
            <div className="min-w-0 flex-1 text-[15px] leading-relaxed">
              {streamingText ? (
                <Streamdown className="kernel-prose">{streamingText}</Streamdown>
              ) : (
                <span className="inline-flex gap-1">
                  <motion.span
                    className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: 0 }}
                  />
                  <motion.span
                    className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: 0.15 }}
                  />
                  <motion.span
                    className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: 0.3 }}
                  />
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      <AnimatePresence>
        {!atBottom && (
          <motion.button
            type="button"
            onClick={jumpToBottom}
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-foreground shadow-lg hover:bg-accent"
            aria-label="Jump to latest message"
          >
            <ArrowDown className="h-3 w-3" /> Latest
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
