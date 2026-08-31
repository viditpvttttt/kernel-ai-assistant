import { ArrowUp, ChevronDown, Mic, Paperclip, Plus, Square, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import type { ChatAttachment } from "@/lib/agent";
import { MODEL_PRESETS, type ProviderPreset } from "@/lib/kernel-store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function Composer({
  disabled,
  streaming,
  onSend,
  onStop,
  model,
  modelPreset,
  onModelChange,
}: {
  disabled?: boolean;
  streaming?: boolean;
  onSend: (text: string, attachments: ChatAttachment[]) => void;
  onStop?: () => void;
  model: string;
  modelPreset: ProviderPreset;
  onModelChange: (id: string) => void;
}) {
  const [text, setText] = useState("");
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  const [recording, setRecording] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  const models = MODEL_PRESETS[modelPreset] ?? [];
  const currentModel = models.find((m) => m.id === model) ?? models[0];

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 208)}px`;
  }, [text]);

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    const next: ChatAttachment[] = [];
    for (const file of Array.from(files)) {
      const dataUrl = await fileToDataUrl(file);
      next.push({ kind: "image", dataUrl, name: file.name });
    }
    setAttachments((prev) => [...prev, ...next]);
  }

  async function toggleRecording() {
    if (recording) {
      recorderRef.current?.stop();
      setRecording(false);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      recorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const dataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        });
        setAttachments((prev) => [...prev, { kind: "audio", dataUrl, name: "voice-note.webm" }]);
        stream.getTracks().forEach((t) => t.stop());
      };
      recorder.start();
      recorderRef.current = recorder;
      setRecording(true);
    } catch {
      // mic denied or unavailable
    }
  }

  function removeAttachment(index: number) {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSend() {
    if (disabled) return;
    if (!text.trim() && attachments.length === 0) return;
    onSend(text.trim(), attachments);
    setText("");
    setAttachments([]);
  }

  return (
    <div className="rounded-3xl border border-border bg-card p-2.5 shadow-sm transition-shadow focus-within:shadow-md">
      <AnimatePresence>
        {attachments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-2 flex flex-wrap gap-2 overflow-hidden"
          >
            {attachments.map((a, i) => (
              <motion.div
                key={i}
                layout
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                className="group relative flex items-center gap-2 rounded-lg border border-border bg-background px-2 py-1.5"
              >
                {a.kind === "image" ? (
                  <img src={a.dataUrl} alt={a.name} className="h-8 w-8 rounded object-cover" />
                ) : (
                  <Mic className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="max-w-[9rem] truncate text-xs text-muted-foreground">{a.name}</span>
                <button
                  type="button"
                  onClick={() => removeAttachment(i)}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label="Remove attachment"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <Textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
        placeholder="Message Kernel…"
        rows={1}
        className="max-h-52 min-h-6 w-full resize-none border-0 bg-transparent px-1 py-1 text-[15px] shadow-none focus-visible:ring-0"
      />

      <div className="mt-1 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(e) => handleFiles(e.target.files)}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full text-muted-foreground"
            onClick={() => fileInputRef.current?.click()}
            aria-label="Attach image"
          >
            <Plus className="h-4 w-4" />
          </Button>
          {attachments.length === 0 && (
            <span className="hidden items-center gap-1 pl-1 text-[11px] text-muted-foreground sm:flex">
              <Paperclip className="h-3 w-3" /> Shift+Enter for a new line
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {/* Model picker */}
          {currentModel && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  {currentModel.label}
                  <ChevronDown className="h-3 w-3" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {models.map((m) => (
                  <DropdownMenuItem
                    key={m.id}
                    onClick={() => onModelChange(m.id)}
                    className={cn("flex flex-col items-start", m.id === model && "font-medium")}
                  >
                    <span>{m.label}</span>
                    <span className="text-xs text-muted-foreground">{m.note}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn("h-8 w-8 rounded-full text-muted-foreground", recording && "text-red-500")}
            onClick={toggleRecording}
            aria-label={recording ? "Stop recording" : "Record audio"}
          >
            {recording ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>

          <motion.div layout transition={{ duration: 0.15 }}>
            {streaming ? (
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <Button
                  type="button"
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8 shrink-0 rounded-full"
                  onClick={onStop}
                  aria-label="Stop generating"
                >
                  <motion.span
                    className="flex h-full w-full items-center justify-center"
                    animate={{ scale: [1, 0.85, 1] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Square className="h-3.5 w-3.5 fill-current" />
                  </motion.span>
                </Button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileTap={{ scale: 0.88 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <Button
                  type="button"
                  size="icon"
                  className="h-8 w-8 shrink-0 rounded-full"
                  disabled={disabled || (!text.trim() && attachments.length === 0)}
                  onClick={handleSend}
                  aria-label="Send"
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
