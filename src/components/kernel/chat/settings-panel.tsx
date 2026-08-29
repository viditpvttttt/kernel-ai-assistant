import { Check, FileText, KeyRound, Plug, Plus, Puzzle, Settings, Sparkles, Trash2, Upload, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PROVIDER_PRESETS,
  clearAllLocalData,
  useApiKeys,
  useAutomations,
  useBuiltinStatus,
  useConnectors,
  useFiles,
  usePlugins,
  useSkills,
  type ApiKeyProfile,
  type Automation,
  type BuiltinStatus,
  type Connector,
  type Plugin,
  type ProviderKind,
  type ProviderPreset,
  type Skill,
  type StoredFile,
} from "@/lib/kernel-store";
import { cn } from "@/lib/utils";

type Section = "keys" | "connectors" | "automations" | "plugins" | "skills" | "files";
export type { Section as SettingsSection };

const SECTIONS: Array<{ id: Section; label: string; icon: typeof KeyRound }> = [
  { id: "keys", label: "API keys", icon: KeyRound },
  { id: "connectors", label: "Connectors", icon: Plug },
  { id: "automations", label: "Automations", icon: Zap },
  { id: "plugins", label: "Plugins", icon: Puzzle },
  { id: "skills", label: "Skills", icon: Sparkles },
  { id: "files", label: "Files", icon: FileText },
];

export function SettingsPanel({
  open: openProp,
  onOpenChange,
  jumpToSection,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  jumpToSection?: Section;
} = {}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [section, setSection] = useState<Section>("keys");
  const apiKeys = useApiKeys();
  const [connectors, setConnectors] = useConnectors();
  const [automations, setAutomations] = useAutomations();
  const [plugins, setPlugins] = usePlugins();
  const [skills, setSkills] = useSkills();
  const [files, setFiles] = useFiles();

  const open = openProp ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  useEffect(() => {
    if (jumpToSection) setSection(jumpToSection);
  }, [jumpToSection]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Settings">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="flex h-[32rem] max-w-3xl flex-col gap-0 overflow-hidden p-0 sm:rounded-2xl">
        <DialogHeader className="border-b border-border px-5 py-4">
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Bring your own keys. Everything here is stored locally in your browser, not on a server.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-1 overflow-hidden">
          <nav className="w-44 shrink-0 border-r border-border bg-muted/30 p-2">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSection(s.id)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition-colors",
                  section === s.id
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground hover:bg-accent/50",
                )}
              >
                <s.icon className="h-3.5 w-3.5 shrink-0" />
                {s.label}
              </button>
            ))}
          </nav>

          <div className="flex-1 overflow-y-auto p-5">
            {section === "keys" && <ApiKeysSection api={apiKeys} />}
            {section === "connectors" && (
              <ConnectorsSection connectors={connectors} setConnectors={setConnectors} />
            )}
            {section === "automations" && (
              <AutomationsSection
                automations={automations}
                setAutomations={setAutomations}
                connectors={connectors}
              />
            )}
            {section === "plugins" && <PluginsSection plugins={plugins} setPlugins={setPlugins} />}
            {section === "skills" && <SkillsSection skills={skills} setSkills={setSkills} />}
            {section === "files" && <FilesSection files={files} setFiles={setFiles} />}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ApiKeysSection({ api }: { api: ReturnType<typeof useApiKeys> }) {
  const { status: builtinStatus, loading: builtinLoading } = useBuiltinStatus();
  const [draft, setDraft] = useState<{ name: string; kind: ProviderKind; preset: ProviderPreset; baseUrl: string; apiKey: string }>({
    name: "",
    kind: "openai",
    preset: "custom",
    baseUrl: "",
    apiKey: "",
  });

  function add() {
    if (!draft.name || !draft.baseUrl) return;
    api.add(draft);
    setDraft({ name: "", kind: "openai", preset: "custom", baseUrl: "", apiKey: "" });
  }

  function applyPreset(preset: (typeof PROVIDER_PRESETS)[number]) {
    setDraft((d) => ({ ...d, name: preset.name, kind: preset.kind, preset: preset.preset, baseUrl: preset.baseUrl }));
  }

  function builtinConfigured(k: ApiKeyProfile): boolean | null {
    if (!k.builtin || !builtinStatus) return null;
    return builtinStatus[k.preset as keyof BuiltinStatus] ?? false;
  }

  const builtinKeys = api.keys.filter((k) => k.builtin);
  const byokKeys = api.keys.filter((k) => !k.builtin);

  return (
    <div className="space-y-5">
      <p className="text-xs text-muted-foreground">
        <strong>Included</strong> providers use keys Kernel's server holds — you don't paste anything,
        requests go through Kernel's own <code>/api/chat/…</code> route, which means Kernel's server
        does see that conversation's content for those calls. <strong>Bring your own key</strong>{" "}
        providers call the API directly from your browser with your key instead — Kernel's server
        never sees those. Switch freely between the two per chat.
      </p>

      <div>
        <p className="mb-1.5 text-xs font-medium text-foreground">Included with Kernel</p>
        <div className="flex flex-col gap-2">
          {builtinKeys.map((k) => {
            const configured = builtinConfigured(k);
            return (
              <div
                key={k.id}
                className={cn(
                  "flex items-center justify-between gap-3 rounded-xl border p-3",
                  k.id === api.activeId ? "border-primary/60 bg-accent/40" : "border-border",
                )}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-medium">{k.name}</span>
                    {k.id === api.activeId && (
                      <Badge variant="secondary" className="gap-1 text-[10px]">
                        <Check className="h-3 w-3" /> Active
                      </Badge>
                    )}
                    {!builtinLoading && configured === true && (
                      <Badge variant="outline" className="gap-1 text-[10px] text-emerald-600 dark:text-emerald-400">
                        <Check className="h-3 w-3" /> Ready
                      </Badge>
                    )}
                    {!builtinLoading && configured === false && (
                      <Badge variant="outline" className="text-[10px] text-amber-600 dark:text-amber-400">
                        Not set up on this deployment
                      </Badge>
                    )}
                  </div>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">{k.baseUrl} (proxied)</p>
                </div>
                {k.id !== api.activeId && (
                  <Button size="sm" variant="outline" className="shrink-0" onClick={() => api.setActiveId(k.id)}>
                    Use
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <p className="mb-1.5 text-xs font-medium text-foreground">Bring your own key</p>
        <div className="flex flex-col gap-2">
          {byokKeys.map((k) => (
            <div
              key={k.id}
              className={cn(
                "flex items-center justify-between gap-3 rounded-xl border p-3",
                k.id === api.activeId ? "border-primary/60 bg-accent/40" : "border-border",
              )}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm font-medium">{k.name}</span>
                  <Badge variant="outline" className="text-[10px] uppercase">
                    {k.kind}
                  </Badge>
                  {k.id === api.activeId && (
                    <Badge variant="secondary" className="gap-1 text-[10px]">
                      <Check className="h-3 w-3" /> Active
                    </Badge>
                  )}
                  {!k.apiKey && (
                    <Badge variant="outline" className="text-[10px] text-amber-600 dark:text-amber-400">
                      No key
                    </Badge>
                  )}
                </div>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">{k.baseUrl}</p>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                {k.id !== api.activeId && (
                  <Button size="sm" variant="outline" onClick={() => api.setActiveId(k.id)}>
                    Use
                  </Button>
                )}
                <button
                  type="button"
                  onClick={() => api.remove(k.id)}
                  aria-label="Delete key"
                  className="text-muted-foreground disabled:opacity-30"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
          {byokKeys.length === 0 && (
            <p className="text-xs text-muted-foreground">None added — use a preset below.</p>
          )}
        </div>
      </div>

      {/* Inline key editor for the active profile, only relevant when it's a bring-your-own-key one */}
      {!api.active.builtin && (
        <div className="space-y-1.5 rounded-xl border border-border p-3">
          <label className="text-xs text-muted-foreground">Key for "{api.active.name}"</label>
          <Input
            type="password"
            value={api.active.apiKey}
            onChange={(e) => api.update(api.active.id, { apiKey: e.target.value })}
            placeholder="sk-…"
          />
        </div>
      )}

      <div className="space-y-2 rounded-xl border border-dashed border-border p-3">
        <p className="text-xs font-medium">Add a provider</p>
        <div className="flex flex-wrap gap-1.5">
          {PROVIDER_PRESETS.map((p) => (
            <Button key={p.name} type="button" size="sm" variant="secondary" onClick={() => applyPreset(p)}>
              {p.name}
            </Button>
          ))}
        </div>
        <div className="grid grid-cols-[1fr_auto] gap-2">
          <Input
            placeholder="Name (e.g. OpenAI, OpenRouter, local Ollama)"
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
          />
          <Select value={draft.kind} onValueChange={(v: ProviderKind) => setDraft({ ...draft, kind: v })}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="openai">OpenAI-style</SelectItem>
              <SelectItem value="anthropic">Anthropic</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Input
          placeholder="Base URL, e.g. https://api.openai.com/v1"
          value={draft.baseUrl}
          onChange={(e) => setDraft({ ...draft, baseUrl: e.target.value })}
        />
        <Input
          type="password"
          placeholder="API key (optional here — you can paste it above after adding)"
          value={draft.apiKey}
          onChange={(e) => setDraft({ ...draft, apiKey: e.target.value })}
        />
        <Button size="sm" variant="outline" className="w-full gap-1.5" onClick={add}>
          <Plus className="h-3.5 w-3.5" /> Add provider
        </Button>
      </div>

      <div className="space-y-2 rounded-xl border border-destructive/30 bg-destructive/5 p-3">
        <p className="text-xs font-medium text-destructive">Danger zone</p>
        <p className="text-[11px] text-muted-foreground">
          Wipes every thread, key, connector, automation, skill and file Kernel has stored in this
          browser. Immediate, irreversible, and doesn't touch anything on a server since there isn't
          one.
        </p>
        <Button
          size="sm"
          variant="destructive"
          className="w-full"
          onClick={() => {
            if (window.confirm("Clear all local Kernel data? This can't be undone.")) {
              clearAllLocalData();
              window.location.reload();
            }
          }}
        >
          Clear all local data
        </Button>
      </div>
    </div>
  );
}

function ConnectorsSection({
  connectors,
  setConnectors,
}: {
  connectors: Connector[];
  setConnectors: (fn: (prev: Connector[]) => Connector[]) => void;
}) {
  const [draft, setDraft] = useState<Omit<Connector, "id" | "enabled">>({
    name: "",
    kind: "api",
    baseUrl: "",
    headerName: "authorization",
    credential: "",
  });
  const [discovering, setDiscovering] = useState<string | null>(null);
  const [discoverError, setDiscoverError] = useState<Record<string, string>>({});

  function add() {
    if (!draft.name || !draft.baseUrl) return;
    setConnectors((prev) => [
      ...prev,
      { ...draft, id: Math.random().toString(36).slice(2, 9), enabled: true },
    ]);
    setDraft({ name: "", kind: "api", baseUrl: "", headerName: "authorization", credential: "" });
  }

  async function discover(c: Connector) {
    setDiscovering(c.id);
    setDiscoverError((prev) => ({ ...prev, [c.id]: "" }));
    try {
      const { mcpListTools } = await import("@/lib/mcp");
      const tools = await mcpListTools({
        url: c.baseUrl,
        ...(c.headerName ? { headerName: c.headerName } : {}),
        ...(c.credential ? { credential: c.credential } : {}),
      });
      setConnectors((prev) => prev.map((x) => (x.id === c.id ? { ...x, mcpToolCount: tools.length } : x)));
    } catch (err) {
      setDiscoverError((prev) => ({
        ...prev,
        [c.id]: err instanceof Error ? err.message : String(err),
      }));
    } finally {
      setDiscovering(null);
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">
        Connectors become tools the agent can call. <strong>API/Webhook</strong> connectors expose one
        generic tool. <strong>MCP</strong> connectors speak the real Model Context Protocol
        (Streamable HTTP) — "Discover tools" runs a live <code>tools/list</code> call against the
        server and registers every tool it returns individually. CORS is up to the server: some
        remote MCP servers allow browser calls, some don't.
      </p>
      <div className="flex flex-col gap-2">
        {connectors.map((c) => (
          <div key={c.id} className="rounded-xl border border-border p-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Plug className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-sm font-medium">{c.name}</span>
                <Badge variant="secondary" className="text-[10px] uppercase">
                  {c.kind}
                </Badge>
                {c.kind === "mcp" && typeof c.mcpToolCount === "number" && (
                  <Badge variant="outline" className="gap-1 text-[10px] text-emerald-600 dark:text-emerald-400">
                    <Check className="h-3 w-3" /> {c.mcpToolCount} tools
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={c.enabled}
                  onCheckedChange={(v) =>
                    setConnectors((prev) => prev.map((x) => (x.id === c.id ? { ...x, enabled: v } : x)))
                  }
                />
                <button
                  type="button"
                  onClick={() => setConnectors((prev) => prev.filter((x) => x.id !== c.id))}
                  aria-label="Delete connector"
                >
                  <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              </div>
            </div>
            <p className="mt-1 truncate text-xs text-muted-foreground">{c.baseUrl}</p>
            {c.kind === "mcp" && (
              <div className="mt-2 flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs"
                  onClick={() => discover(c)}
                  disabled={discovering === c.id}
                >
                  {discovering === c.id ? "Discovering…" : "Discover tools"}
                </Button>
                {discoverError[c.id] && (
                  <span className="truncate text-[11px] text-red-500">{discoverError[c.id]}</span>
                )}
              </div>
            )}
          </div>
        ))}
        {connectors.length === 0 && (
          <p className="text-xs text-muted-foreground">No connectors yet — add one below.</p>
        )}
      </div>

      <div className="space-y-2 rounded-xl border border-dashed border-border p-3">
        <div className="grid grid-cols-2 gap-2">
          <Input
            placeholder="Name"
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
          />
          <Select
            value={draft.kind}
            onValueChange={(v: "api" | "webhook" | "mcp") => setDraft({ ...draft, kind: v })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="api">API</SelectItem>
              <SelectItem value="webhook">Webhook</SelectItem>
              <SelectItem value="mcp">MCP server</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Input
          placeholder={draft.kind === "mcp" ? "MCP server URL (Streamable HTTP endpoint)" : "Base URL"}
          value={draft.baseUrl}
          onChange={(e) => setDraft({ ...draft, baseUrl: e.target.value })}
        />
        <div className="grid grid-cols-2 gap-2">
          <Input
            placeholder="Header name"
            value={draft.headerName}
            onChange={(e) => setDraft({ ...draft, headerName: e.target.value })}
          />
          <Input
            placeholder="Credential"
            type="password"
            value={draft.credential}
            onChange={(e) => setDraft({ ...draft, credential: e.target.value })}
          />
        </div>
        <Button size="sm" variant="outline" className="w-full gap-1.5" onClick={add}>
          <Plus className="h-3.5 w-3.5" /> Add connector
        </Button>
      </div>
    </div>
  );
}

function AutomationsSection({
  automations,
  setAutomations,
  connectors,
}: {
  automations: Automation[];
  setAutomations: (fn: (prev: Automation[]) => Automation[]) => void;
  connectors: Connector[];
}) {
  const [draft, setDraft] = useState<Omit<Automation, "id" | "enabled">>({
    name: "",
    trigger: "on_message",
    connectorId: connectors[0]?.id ?? "",
    action: "",
  });

  function add() {
    if (!draft.name || !draft.connectorId) return;
    setAutomations((prev) => [
      ...prev,
      { ...draft, id: Math.random().toString(36).slice(2, 9), enabled: true },
    ]);
    setDraft({ name: "", trigger: "on_message", connectorId: connectors[0]?.id ?? "", action: "" });
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">
        Automations pair a trigger with a connector so recurring actions don't need to be typed out
        every time.
      </p>
      <div className="flex flex-col gap-2">
        {automations.map((a) => (
          <div key={a.id} className="rounded-xl border border-border p-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Zap className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-sm font-medium">{a.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={a.enabled}
                  onCheckedChange={(v) =>
                    setAutomations((prev) => prev.map((x) => (x.id === a.id ? { ...x, enabled: v } : x)))
                  }
                />
                <button
                  type="button"
                  onClick={() => setAutomations((prev) => prev.filter((x) => x.id !== a.id))}
                  aria-label="Delete automation"
                >
                  <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              </div>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {a.trigger} → {connectors.find((c) => c.id === a.connectorId)?.name ?? "connector"}:{" "}
              {a.action || "run"}
            </p>
          </div>
        ))}
        {automations.length === 0 && (
          <p className="text-xs text-muted-foreground">No automations yet — add one below.</p>
        )}
      </div>

      <div className="space-y-2 rounded-xl border border-dashed border-border p-3">
        <Input
          placeholder="Name"
          value={draft.name}
          onChange={(e) => setDraft({ ...draft, name: e.target.value })}
        />
        <div className="grid grid-cols-2 gap-2">
          <Select value={draft.trigger} onValueChange={(v) => setDraft({ ...draft, trigger: v })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="on_message">On new message</SelectItem>
              <SelectItem value="on_tool_result">On tool result</SelectItem>
              <SelectItem value="on_session_start">On session start</SelectItem>
            </SelectContent>
          </Select>
          <Select value={draft.connectorId} onValueChange={(v) => setDraft({ ...draft, connectorId: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Connector" />
            </SelectTrigger>
            <SelectContent>
              {connectors.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Input
          placeholder="Action (path or note)"
          value={draft.action}
          onChange={(e) => setDraft({ ...draft, action: e.target.value })}
        />
        <Button size="sm" variant="outline" className="w-full gap-1.5" onClick={add} disabled={!connectors.length}>
          <Plus className="h-3.5 w-3.5" /> Add automation
        </Button>
        {!connectors.length && (
          <p className="text-[11px] text-muted-foreground">Add a connector first.</p>
        )}
      </div>
    </div>
  );
}

function PluginsSection({
  plugins,
  setPlugins,
}: {
  plugins: Plugin[];
  setPlugins: (fn: (prev: Plugin[]) => Plugin[]) => void;
}) {
  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">
        Built-in tool plugins the agent can reach for on its own. Turn one off to keep it out of the
        harness entirely, even if a skill asks for it.
      </p>
      <div className="flex flex-col gap-2">
        {plugins.map((p) => (
          <div key={p.id} className="flex items-center justify-between gap-3 rounded-xl border border-border p-3">
            <div className="flex items-center gap-2.5">
              <Puzzle className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.description}</p>
              </div>
            </div>
            <Switch
              checked={p.enabled}
              onCheckedChange={(v) =>
                setPlugins((prev) => prev.map((x) => (x.id === p.id ? { ...x, enabled: v } : x)))
              }
            />
          </div>
        ))}
      </div>
      <p className="text-[11px] text-muted-foreground">
        Connector-based tools are managed on the Connectors tab.
      </p>
    </div>
  );
}

function SkillsSection({
  skills,
  setSkills,
}: {
  skills: Skill[];
  setSkills: (fn: (prev: Skill[]) => Skill[]) => void;
}) {
  const [draft, setDraft] = useState({ name: "", description: "", instructions: "" });

  function add() {
    if (!draft.name || !draft.instructions) return;
    setSkills((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).slice(2, 9),
        name: draft.name,
        description: draft.description,
        instructions: draft.instructions,
        permissions: [],
        active: true,
      },
    ]);
    setDraft({ name: "", description: "", instructions: "" });
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">
        Skills are instructions injected into the system prompt when active — a lightweight way to
        specialize the agent per session.
      </p>
      <ScrollArea className="max-h-64">
        <div className="flex flex-col gap-2 pr-2">
          {skills.map((s) => (
            <div key={s.id} className="rounded-xl border border-border p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium">{s.name}</span>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={s.active}
                    onCheckedChange={(v) =>
                      setSkills((prev) => prev.map((x) => (x.id === s.id ? { ...x, active: v } : x)))
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setSkills((prev) => prev.filter((x) => x.id !== s.id))}
                    aria-label="Delete skill"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                </div>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{s.description}</p>
              {s.permissions.length > 0 && (
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {s.permissions.map((p) => (
                    <Badge key={p} variant="outline" className="text-[10px]">
                      {p}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="space-y-2 rounded-xl border border-dashed border-border p-3">
        <Input
          placeholder="Skill name"
          value={draft.name}
          onChange={(e) => setDraft({ ...draft, name: e.target.value })}
        />
        <Input
          placeholder="Short description"
          value={draft.description}
          onChange={(e) => setDraft({ ...draft, description: e.target.value })}
        />
        <Textarea
          placeholder="Instructions injected into the system prompt when active"
          value={draft.instructions}
          onChange={(e) => setDraft({ ...draft, instructions: e.target.value })}
          className="min-h-16"
        />
        <Button size="sm" variant="outline" className="w-full gap-1.5" onClick={add}>
          <Plus className="h-3.5 w-3.5" /> Add skill
        </Button>
      </div>
    </div>
  );
}

function FilesSection({
  files,
  setFiles,
}: {
  files: StoredFile[];
  setFiles: (fn: (prev: StoredFile[]) => StoredFile[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(list: FileList | null) {
    if (!list?.length) return;
    for (const file of Array.from(list)) {
      const content = await file.text().catch(() => "");
      setFiles((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).slice(2, 9),
          name: file.name,
          type: file.type || "text/plain",
          size: file.size,
          content,
          addedAt: Date.now(),
        },
      ]);
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">
        Upload text-based files (.txt, .md, .csv, .json, code) here. The{" "}
        <code>file_search</code> plugin does a real keyword search over their contents when the
        agent needs them — everything stays in your browser's local storage.
      </p>

      <input
        ref={inputRef}
        type="file"
        multiple
        hidden
        accept=".txt,.md,.csv,.json,.log,.js,.ts,.py,.html,.css,text/*"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <Button variant="outline" size="sm" className="gap-1.5" onClick={() => inputRef.current?.click()}>
        <Upload className="h-3.5 w-3.5" /> Upload files
      </Button>

      <ScrollArea className="max-h-72">
        <div className="flex flex-col gap-2 pr-2">
          {files.map((f) => (
            <div key={f.id} className="flex items-center justify-between gap-3 rounded-xl border border-border p-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <FileText className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <span className="truncate text-sm font-medium">{f.name}</span>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {(f.size / 1024).toFixed(1)} KB · {f.content.length.toLocaleString()} chars
                </p>
              </div>
              <button
                type="button"
                onClick={() => setFiles((prev) => prev.filter((x) => x.id !== f.id))}
                aria-label="Remove file"
                className="shrink-0 text-muted-foreground"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          {files.length === 0 && <p className="text-xs text-muted-foreground">No files uploaded yet.</p>}
        </div>
      </ScrollArea>
    </div>
  );
}
