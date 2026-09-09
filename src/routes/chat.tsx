import { createFileRoute, Link } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Ambience } from "@/components/kernel/ambience";
import { KernelLogo } from "@/components/kernel/logo";
import { ThemeToggle } from "@/components/kernel/theme-toggle";
import { CommandPalette } from "@/components/kernel/chat/command-palette";
import { Composer } from "@/components/kernel/chat/composer";
import { MessageList } from "@/components/kernel/chat/message-list";
import { ModelPicker } from "@/components/kernel/chat/model-picker";
import { PersonaPicker } from "@/components/kernel/chat/persona-picker";
import { SettingsPanel, type SettingsSection } from "@/components/kernel/chat/settings-panel";
import { ThreadSidebar } from "@/components/kernel/chat/sidebar";
import { StepTrace } from "@/components/kernel/chat/step-trace";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  calculatorTool,
  codeInterpreterTool,
  connectorTool,
  fetchUrlTool,
  fileSearchTool,
  imageGenerationTool,
  mcpConnectorTool,
  runAgent,
  webBrowseTool,
  type AgentStep,
  type ChatAttachment,
  type ChatMessage,
} from "@/lib/agent";
import {
  MODEL_PRESETS,
  newThread,
  useApiKeys,
  useBuiltinStatus,
  useConnectors,
  useFiles,
  usePersona,
  usePlugins,
  useSkills,
  useThreads,
  type Skill,
  type Thread,
} from "@/lib/kernel-store";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [{ title: "Kernel — chat" }],
  }),
  component: ChatPage,
});

function buildSystemPrompt(personaPrompt: string, skills: Skill[]) {
  const active = skills.filter((s) => s.active);
  if (active.length === 0) return personaPrompt;
  return personaPrompt + "\n\nActive skills:\n" + active.map((s) => `- ${s.name}: ${s.instructions}`).join("\n");
}

function newId() {
  return Math.random().toString(36).slice(2, 10);
}

function ChatPage() {
  const { threads, upsert, remove, hydrated } = useThreads();
  const [activeId, setActiveId] = useState<string | null>(null);
  const apiKeys = useApiKeys();
  const provider = apiKeys.active;
  const { status: builtinStatus } = useBuiltinStatus();
  const [connectors] = useConnectors();
  const [plugins] = usePlugins();
  const [skills] = useSkills();
  const { persona, personaId, setPersonaId } = usePersona();
  const [files] = useFiles();
  const [steps, setSteps] = useState<AgentStep[]>([]);
  const [streamingText, setStreamingText] = useState<string | undefined>(undefined);
  const [running, setRunning] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsSection, setSettingsSection] = useState<SettingsSection>("keys");
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!hydrated) return;
    if (threads.length === 0) {
      const t = newThread(MODEL_PRESETS[provider.preset][0]?.id);
      upsert(t);
      setActiveId(t.id);
    } else if (!activeId && threads[0]) {
      setActiveId(threads[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, threads.length]);

  const active = threads.find((t) => t.id === activeId) ?? null;

  // Keep the selected model in sync with the active provider's preset when the user switches keys.
  useEffect(() => {
    if (!active) return;
    const validModels = MODEL_PRESETS[provider.preset];
    if (!validModels.some((m) => m.id === active.model) && validModels[0]) {
      upsert({ ...active, model: validModels[0].id });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider.preset, active?.id]);

  // Model validity + step trace visibility are still owned here; message scrolling is handled inside MessageList.

  function handleNew() {
    const t = newThread(active?.model ?? MODEL_PRESETS[provider.preset][0]?.id);
    upsert(t);
    setActiveId(t.id);
    setSteps([]);
    setStreamingText(undefined);
  }

  function handleDelete(id: string) {
    remove(id);
    if (id === activeId) setActiveId(null);
  }

  function handleModelChange(model: string) {
    if (!active) return;
    upsert({ ...active, model });
  }

  function handleStop() {
    abortRef.current?.abort();
  }

  /** Runs the agent against `history` (already includes the latest user turn) and appends the result. */
  async function runAndAppend(thread: Thread, history: ChatMessage[], title: string) {
    setSteps([]);
    setStreamingText("");
    setRunning(true);

    const controller = new AbortController();
    abortRef.current = controller;

    const isPluginOn = (id: string) => plugins.find((p) => p.id === id)?.enabled ?? false;
    const enabledConnectors = connectors.filter((c) => c.enabled);
    const apiConnectors = enabledConnectors.filter(
      (c): c is typeof c & { kind: "api" | "webhook" } => c.kind !== "mcp",
    );
    const mcpConnectors = enabledConnectors.filter((c) => c.kind === "mcp");

    // MCP tools are discovered live at send-time (tools/list) rather than cached, so a server's
    // tool set changing doesn't require re-saving the connector.
    const mcpTools = (
      await Promise.all(
        mcpConnectors.map(async (c) => {
          try {
            const { mcpListTools } = await import("@/lib/mcp");
            const infos = await mcpListTools({
              url: c.baseUrl,
              ...(c.headerName ? { headerName: c.headerName } : {}),
              ...(c.credential ? { credential: c.credential } : {}),
            });
            return infos.map((info) => mcpConnectorTool(c, info));
          } catch {
            return [];
          }
        }),
      )
    ).flat();

    const tools = [
      ...(isPluginOn("calculate") ? [calculatorTool] : []),
      ...(isPluginOn("fetch_url") ? [fetchUrlTool] : []),
      ...(isPluginOn("code_interpreter") ? [codeInterpreterTool] : []),
      ...(isPluginOn("generate_image") ? [imageGenerationTool(provider)] : []),
      ...(isPluginOn("file_search") ? [fileSearchTool(files)] : []),
      ...(isPluginOn("web_browse") ? [webBrowseTool] : []),
      ...apiConnectors.map(connectorTool),
      ...mcpTools,
    ];

    try {
      const { text: answerText, attachments } = await runAgent({
        messages: history,
        model: thread.model,
        system: buildSystemPrompt(persona.systemPrompt, skills),
        provider,
        tools,
        signal: controller.signal,
        onStep: (step) => setSteps((prev) => [...prev, step]),
        onToken: (textSoFar) => setStreamingText(textSoFar),
      });

      const assistantMsg: ChatMessage = {
        id: newId(),
        role: "assistant",
        content: answerText,
        createdAt: Date.now(),
        ...(attachments.length ? { attachments } : {}),
      };
      upsert({ ...thread, messages: [...history, assistantMsg], title });
    } catch (err) {
      const aborted = err instanceof DOMException && err.name === "AbortError";
      const assistantMsg: ChatMessage = {
        id: newId(),
        role: "assistant",
        content: aborted
          ? "Generation stopped."
          : `Something went wrong calling the model: ${err instanceof Error ? err.message : String(err)}`,
        createdAt: Date.now(),
      };
      upsert({ ...thread, messages: [...history, assistantMsg], title });
    } finally {
      setRunning(false);
      setStreamingText(undefined);
      abortRef.current = null;
    }
  }

  async function handleSend(text: string, attachments: ChatAttachment[]) {
    if (!active) return;
    const userMsg: ChatMessage = {
      id: newId(),
      role: "user",
      content: text,
      attachments,
      createdAt: Date.now(),
    };
    const history = [...active.messages, userMsg];
    const title = active.messages.length === 0 && text ? text.slice(0, 48) : active.title;
    upsert({ ...active, messages: history, title });
    await runAndAppend(active, history, title);
  }

  /** Edits a user message in place and re-runs the agent from that point, dropping everything after it. */
  async function handleEditUser(id: string, newText: string) {
    if (!active) return;
    const idx = active.messages.findIndex((m) => m.id === id);
    if (idx === -1) return;
    const original = active.messages[idx];
    if (!original) return;
    const edited: ChatMessage = { ...original, content: newText };
    const history = [...active.messages.slice(0, idx), edited];
    const title = idx === 0 && newText ? newText.slice(0, 48) : active.title;
    upsert({ ...active, messages: history, title });
    await runAndAppend(active, history, title);
  }

  /** Regenerates the response for the last assistant message: drops it and re-runs on the same history. */
  async function handleRegenerate(assistantId: string) {
    if (!active) return;
    const idx = active.messages.findIndex((m) => m.id === assistantId);
    if (idx === -1) return;
    const history = active.messages.slice(0, idx);
    upsert({ ...active, messages: history });
    await runAndAppend(active, history, active.title);
  }

  const isEmpty = (active?.messages.length ?? 0) === 0 && streamingText === undefined;

  return (
    <div className="relative flex h-svh flex-col overflow-hidden bg-background">
      <Ambience intensity="soft" className="opacity-50" />
      <header className="relative z-10 flex items-center justify-between border-b border-border/60 bg-background/60 px-4 py-2.5 backdrop-blur-2xl">
        <Link to="/" aria-label="Kernel home">
          <KernelLogo byline={false} />
        </Link>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => {
              if (!active) return;
              const md = active.messages
                .map((m) => `## ${m.role === "user" ? "You" : "Kernel"}\n\n${m.content}`)
                .join("\n\n---\n\n");
              const blob = new Blob([`# ${active.title}\n\n${md}`], { type: "text/markdown" });
              const a = document.createElement("a");
              a.href = URL.createObjectURL(blob);
              a.download = `${active.title.slice(0, 40) || "kernel-chat"}.md`;
              a.click();
            }}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            aria-label="Export chat"
            title="Export as Markdown"
          >
            <Download className="h-4 w-4" />
          </button>
          <Link
            to="/sign-in"
            className="hidden items-center rounded-full border border-border px-4 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground sm:flex"
          >
            Sign in
          </Link>
          <PersonaPicker value={personaId} onChange={setPersonaId} />
          {apiKeys.keys.length > 1 && (
            <Select value={apiKeys.activeId} onValueChange={apiKeys.setActiveId}>
              <SelectTrigger className="h-8 w-auto gap-1.5 border-none bg-transparent px-2 text-xs text-muted-foreground shadow-none focus:ring-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {apiKeys.keys.map((k) => (
                  <SelectItem key={k.id} value={k.id}>
                    {k.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <ThemeToggle />
        </div>
      </header>

      <div className="hidden">
        <SettingsPanel open={settingsOpen} onOpenChange={setSettingsOpen} jumpToSection={settingsSection} />
      </div>

      <CommandPalette
        threads={threads}
        onSelectThread={(id) => {
          setActiveId(id);
          setSteps([]);
          setStreamingText(undefined);
        }}
        onNewChat={handleNew}
        onSelectModel={handleModelChange}
        onOpenSettings={(section) => {
          setSettingsSection(section);
          setSettingsOpen(true);
        }}
      />

      <div className="relative z-10 flex flex-1 overflow-hidden">
        <ThreadSidebar
          threads={threads}
          activeId={activeId}
          onSelect={(id) => {
            setActiveId(id);
            setSteps([]);
            setStreamingText(undefined);
          }}
          onNew={handleNew}
          onDelete={handleDelete}
          onOpenSettings={(section) => {
            if (section) setSettingsSection(section as SettingsSection);
            setSettingsOpen(true);
          }}
        />

        <div className="flex flex-1 flex-col overflow-hidden">
          {(() => {
            if (provider.builtin) {
              const ready = builtinStatus?.[provider.preset as keyof typeof builtinStatus];
              if (ready === false) {
                return (
                  <div className="border-b border-border bg-amber-500/10 px-4 py-1.5 text-center text-xs text-amber-700 dark:text-amber-400">
                    "{provider.name}" isn't set up on this deployment yet — chats run in demo mode
                    until its env var is configured, or switch to a bring-your-own-key provider in
                    Settings → API keys.
                  </div>
                );
              }
              return null;
            }
            if (!provider.apiKey) {
              return (
                <div className="border-b border-border bg-amber-500/10 px-4 py-1.5 text-center text-xs text-amber-700 dark:text-amber-400">
                  No key set for "{provider.name}" — chats run in demo mode. Add one in Settings → API
                  keys, or switch to an included provider.
                </div>
              );
            }
            return null;
          })()}

          <div className={isEmpty ? "flex flex-1 flex-col justify-center" : "flex flex-1 flex-col overflow-hidden"}>
            <MessageList
              messages={active?.messages ?? []}
              onEditUser={handleEditUser}
              onRegenerate={handleRegenerate}
              streamingText={streamingText}
              onPickSuggestion={(text) => handleSend(text, [])}
            />

            {running && steps.length > 0 && <StepTrace steps={steps} />}

            <div className={isEmpty ? "mx-auto w-full max-w-3xl px-4 pb-8 sm:px-6" : "px-4 pb-6 sm:px-6"}>
              <Composer
                disabled={!active}
                streaming={running}
                onSend={handleSend}
                onStop={handleStop}
                model={active?.model ?? MODEL_PRESETS[provider.preset][0]?.id ?? ""}
                modelPreset={provider.preset}
                onModelChange={handleModelChange}
              />
              <p className="mt-2 text-center text-[11px] text-muted-foreground">
                Kernel can make mistakes. Verify important information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
