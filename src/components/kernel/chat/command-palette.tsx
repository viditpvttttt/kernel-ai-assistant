import { FileText, KeyRound, MessageSquarePlus, Plug, Puzzle, Sparkles, Zap } from "lucide-react";
import { useEffect, useState } from "react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { MODEL_PRESETS, type Thread } from "@/lib/kernel-store";

export function CommandPalette({
  threads,
  onSelectThread,
  onNewChat,
  onOpenSettings,
  onSelectModel,
}: {
  threads: Thread[];
  onSelectThread: (id: string) => void;
  onNewChat: () => void;
  onOpenSettings: (section: "keys" | "connectors" | "automations" | "plugins" | "skills" | "files") => void;
  onSelectModel: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const allModels = [...MODEL_PRESETS.openai, ...MODEL_PRESETS.anthropic, ...MODEL_PRESETS.google];

  function run(fn: () => void) {
    setOpen(false);
    fn();
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search chats, switch model, jump to settings…" />
      <CommandList>
        <CommandEmpty>No matches.</CommandEmpty>

        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => run(onNewChat)}>
            <MessageSquarePlus className="h-4 w-4" /> New chat
          </CommandItem>
          <CommandItem onSelect={() => run(() => onOpenSettings("keys"))}>
            <KeyRound className="h-4 w-4" /> API keys
          </CommandItem>
          <CommandItem onSelect={() => run(() => onOpenSettings("connectors"))}>
            <Plug className="h-4 w-4" /> Connectors
          </CommandItem>
          <CommandItem onSelect={() => run(() => onOpenSettings("automations"))}>
            <Zap className="h-4 w-4" /> Automations
          </CommandItem>
          <CommandItem onSelect={() => run(() => onOpenSettings("plugins"))}>
            <Puzzle className="h-4 w-4" /> Plugins
          </CommandItem>
          <CommandItem onSelect={() => run(() => onOpenSettings("skills"))}>
            <Sparkles className="h-4 w-4" /> Skills
          </CommandItem>
          <CommandItem onSelect={() => run(() => onOpenSettings("files"))}>
            <FileText className="h-4 w-4" /> Files
          </CommandItem>
        </CommandGroup>

        <CommandGroup heading="Models">
          {allModels.map((m) => (
            <CommandItem key={m.id} onSelect={() => run(() => onSelectModel(m.id))}>
              <span>{m.label}</span>
              <span className="ml-auto text-xs text-muted-foreground">{m.note}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        {threads.length > 0 && (
          <CommandGroup heading="Recent chats">
            {threads.slice(0, 8).map((t) => (
              <CommandItem key={t.id} onSelect={() => run(() => onSelectThread(t.id))}>
                {t.title}
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
