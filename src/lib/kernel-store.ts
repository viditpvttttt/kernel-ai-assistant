import { useCallback, useEffect, useState } from "react";

import type { ChatMessage } from "./agent";

/** Local-first persistence for threads, API keys, connectors, automations, skills and plugins. */

export type Thread = {
  id: string;
  title: string;
  createdAt: number;
  messages: ChatMessage[];
  model: string;
};

/** "openai" = OpenAI-compatible /chat/completions wire format (OpenAI, Google, Grok, Groq, OpenRouter, local…).
 *  "anthropic" = Anthropic's native /v1/messages wire format. */
export type ProviderKind = "openai" | "anthropic";

/** Which curated model list + label to show — distinct from `kind` since several presets share the OpenAI wire format. */
export type ProviderPreset = "kernel" | "openai" | "anthropic" | "google" | "grok" | "custom";

export type ApiKeyProfile = {
  id: string;
  name: string;
  kind: ProviderKind;
  preset: ProviderPreset;
  baseUrl: string;
  apiKey: string;
  /** True for Kernel's own included-key profiles — requests go through Kernel's server proxy
   *  (/api/chat/…) instead of straight to the provider, and the user never enters a key. */
  builtin?: boolean;
};

export type Connector = {
  id: string;
  name: string;
  kind: "api" | "webhook" | "mcp";
  baseUrl: string;
  headerName: string;
  credential: string;
  enabled: boolean;
  /** Populated after a successful MCP "tools/list" discovery call; undefined for non-MCP connectors. */
  mcpToolCount?: number;
};

export type Automation = {
  id: string;
  name: string;
  trigger: string;
  connectorId: string;
  action: string;
  enabled: boolean;
};

export type Skill = {
  id: string;
  name: string;
  description: string;
  instructions: string;
  permissions: string[];
  active: boolean;
};

export type Plugin = {
  id: string;
  tool: "calculate" | "fetch_url" | "code_interpreter" | "generate_image" | "file_search";
  name: string;
  description: string;
  enabled: boolean;
};

export type StoredFile = {
  id: string;
  name: string;
  type: string;
  size: number;
  content: string;
  addedAt: number;
};

export type Persona = {
  id: string;
  name: string;
  tagline: string;
  systemPrompt: string;
};

export const PERSONAS: Persona[] = [
  {
    id: "kernel",
    name: "Kernel",
    tagline: "Direct, precise, no filler",
    systemPrompt:
      "You are Kernel, a helpful agentic assistant. Use the available tools when they help you " +
      "answer accurately; otherwise answer directly. Be concise.",
  },
  {
    id: "bolt",
    name: "Bolt",
    tagline: "Witty, blunt, real-time — a Grok-style personality",
    systemPrompt:
      "You are Bolt, an AI assistant with a witty, irreverent, maximally-candid personality — think " +
      "sharp humor and a willingness to say the blunt thing, similar in spirit to xAI's Grok persona. " +
      "Stay genuinely helpful and accurate underneath the tone: crack jokes and don't pull punches, " +
      "but never sacrifice correctness for a laugh, and drop the bit entirely for serious or sensitive " +
      "requests. Use tools when they get a better answer than guessing would.",
  },
  {
    id: "scholar",
    name: "Scholar",
    tagline: "Thorough, cites sources, hedges appropriately",
    systemPrompt:
      "You are Scholar, a meticulous research assistant. Prefer verified information over recall — use " +
      "fetch_url and file_search when a claim can be checked. Note uncertainty explicitly instead of " +
      "guessing confidently. Structure longer answers with clear headers.",
  },
  {
    id: "operator",
    name: "Operator",
    tagline: "Terse, tool-first, gets it done",
    systemPrompt:
      "You are Operator. Bias heavily toward action: reach for the calculator, code interpreter, file " +
      "search, connectors, or MCP tools instead of reasoning something out in prose. Keep responses " +
      "short — state what you did and the result, skip the preamble.",
  },
];

const KEYS = {
  threads: "kernel.threads",
  apiKeys: "kernel.apiKeys",
  activeApiKey: "kernel.activeApiKey",
  connectors: "kernel.connectors",
  automations: "kernel.automations",
  skills: "kernel.skills",
  plugins: "kernel.plugins",
  files: "kernel.files",
  persona: "kernel.persona",
} as const;

export const MODEL_PRESETS: Record<ProviderPreset, Array<{ id: string; label: string; note: string }>> = {
  // Kernel's free tier — routed through Kernel's server, no key required.
  kernel: [
    { id: "google/gemini-3.7-flash", label: "Gemini 3.7 Flash", note: "free · fast · vision" },
    { id: "google/gemini-3.1-pro-preview", label: "Gemini 3.1 Pro", note: "free · deep reasoning" },
    { id: "openai/gpt-5.6-terra", label: "GPT-5.6 Terra", note: "free · balanced" },
    { id: "openai/gpt-5.6-luna", label: "GPT-5.6 Luna", note: "free · fastest" },
    { id: "openai/gpt-5.5", label: "GPT-5.5", note: "free · frontier" },
    { id: "google/gemini-3.1-flash-lite", label: "Gemini 3.1 Flash Lite", note: "free · high volume" },
    { id: "google/gemini-2.5-flash-image", label: "Nano Banana", note: "free · image generation" },
  ],
  google: [
    { id: "google/gemini-3.7-flash", label: "Gemini 3.7 Flash", note: "fast · vision · audio" },
    { id: "google/gemini-3.7-pro", label: "Gemini 3.7 Pro", note: "deep reasoning" },
    { id: "google/gemini-2.5-flash-image", label: "Nano Banana", note: "image generation" },
  ],
  openai: [
    { id: "gpt-5.5", label: "GPT-5.5", note: "flagship, agentic" },
    { id: "gpt-5.4", label: "GPT-5.4", note: "workhorse" },
    { id: "gpt-5.4-mini", label: "GPT-5.4 mini", note: "fast, cheap" },
    { id: "o3", label: "o3", note: "deep reasoning" },
    { id: "gpt-image-2", label: "GPT Image 2", note: "image generation" },
  ],
  anthropic: [
    { id: "claude-opus-5", label: "Claude Opus 5", note: "most capable" },
    { id: "claude-sonnet-5", label: "Claude Sonnet 5", note: "balanced, agentic" },
    { id: "claude-haiku-4-5-20251001", label: "Claude Haiku 4.5", note: "fast, cheap" },
    { id: "claude-fable-5", label: "Claude Fable 5", note: "frontier, Mythos-class" },
  ],
  grok: [
    { id: "grok-4.6", label: "Grok 4.6", note: "frontier, agentic, 500K ctx" },
    { id: "grok-4.3", label: "Grok 4.3", note: "workhorse" },
    { id: "grok-code-fast-1", label: "Grok Code Fast", note: "fast coding" },
  ],
  custom: [],
};

/** Flat list kept for back-compat call sites; prefer MODEL_PRESETS[preset] for a given profile. */
export const MODELS = [
  ...MODEL_PRESETS.kernel,
  ...MODEL_PRESETS.google,
  ...MODEL_PRESETS.openai,
  ...MODEL_PRESETS.anthropic,
  ...MODEL_PRESETS.grok,
] as const;

export const DEFAULT_SKILLS: Skill[] = [
  {
    id: "researcher",
    name: "Researcher",
    description: "Fetches sources, cross-checks claims and cites every answer.",
    instructions: "Always fetch primary sources with the fetch_url tool and cite links inline.",
    permissions: ["network.read"],
    active: true,
  },
  {
    id: "analyst",
    name: "Analyst",
    description: "Runs numeric work step by step with the calculator tool.",
    instructions: "Use the calculate tool for any arithmetic instead of guessing.",
    permissions: ["compute"],
    active: true,
  },
  {
    id: "operator",
    name: "Operator",
    description: "Calls your connectors and triggers automations.",
    instructions: "Prefer call_connector for anything touching the user's own systems.",
    permissions: ["network.write", "credentials.use"],
    active: false,
  },
];

export const DEFAULT_PLUGINS: Plugin[] = [
  {
    id: "calculate",
    tool: "calculate",
    name: "Calculator",
    description: "Evaluate arithmetic expressions exactly instead of estimating.",
    enabled: true,
  },
  {
    id: "fetch_url",
    tool: "fetch_url",
    name: "Web fetch",
    description: "Fetch a public URL and read back its text content.",
    enabled: true,
  },
  {
    id: "code_interpreter",
    tool: "code_interpreter",
    name: "Code interpreter",
    description: "Runs real JavaScript in an isolated sandbox worker and returns console output + result.",
    enabled: true,
  },
  {
    id: "generate_image",
    tool: "generate_image",
    name: "Image generation",
    description: "Calls the active provider's image endpoint and returns a generated image inline.",
    enabled: true,
  },
  {
    id: "file_search",
    tool: "file_search",
    name: "File search",
    description: "Keyword search over files you've uploaded in Settings → Files.",
    enabled: true,
  },
];

/** Light, reversible obfuscation for values written to localStorage — not encryption, just not plaintext-on-disk. */
const OBF_SALT = "kernel-local-v1";

function obfuscate(plain: string): string {
  if (!plain) return plain;
  try {
    const xored = Array.from(plain)
      .map((ch, i) => String.fromCharCode(ch.charCodeAt(0) ^ OBF_SALT.charCodeAt(i % OBF_SALT.length)))
      .join("");
    return "obf:" + btoa(unescape(encodeURIComponent(xored)));
  } catch {
    return plain;
  }
}

function deobfuscate(stored: string): string {
  if (!stored || !stored.startsWith("obf:")) return stored;
  try {
    const xored = decodeURIComponent(escape(atob(stored.slice(4))));
    return Array.from(xored)
      .map((ch, i) => String.fromCharCode(ch.charCodeAt(0) ^ OBF_SALT.charCodeAt(i % OBF_SALT.length)))
      .join("");
  } catch {
    return stored;
  }
}

function transformSensitiveFields<T>(value: T, fields: readonly string[], fn: (s: string) => string): T {
  if (!Array.isArray(value)) return value;
  return value.map((item) => {
    if (!item || typeof item !== "object") return item;
    const copy = { ...(item as Record<string, unknown>) };
    for (const field of fields) {
      if (typeof copy[field] === "string") copy[field] = fn(copy[field] as string);
    }
    return copy;
  }) as T;
}

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function useLocal<T>(key: string, initial: T, sensitiveFields?: readonly string[]) {
  const [value, setValue] = useState<T>(initial);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const raw = read<T>(key, initial);
    setValue(sensitiveFields ? transformSensitiveFields(raw, sensitiveFields, deobfuscate) : raw);
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      const toStore = sensitiveFields ? transformSensitiveFields(value, sensitiveFields, obfuscate) : value;
      window.localStorage.setItem(key, JSON.stringify(toStore));
    } catch {
      /* quota */
    }
  }, [key, value, hydrated, sensitiveFields]);

  return [value, setValue, hydrated] as const;
}

export function newThread(model: string = MODELS[0]?.id ?? "gpt-5.4"): Thread {
  return {
    id: Math.random().toString(36).slice(2, 10),
    title: "New session",
    createdAt: Date.now(),
    messages: [],
    model,
  };
}

/** Wipes every piece of Kernel's local state — threads, keys, connectors, everything. Irreversible. */
export function clearAllLocalData() {
  if (typeof window === "undefined") return;
  for (const key of Object.values(KEYS)) window.localStorage.removeItem(key);
}

export function useThreads() {
  const [threads, setThreads, hydrated] = useLocal<Thread[]>(KEYS.threads, []);

  const upsert = useCallback(
    (thread: Thread) =>
      setThreads((prev) => {
        const next = prev.some((t) => t.id === thread.id)
          ? prev.map((t) => (t.id === thread.id ? thread : t))
          : [thread, ...prev];
        return next.slice(0, 50);
      }),
    [setThreads],
  );

  const remove = useCallback(
    (id: string) => setThreads((prev) => prev.filter((t) => t.id !== id)),
    [setThreads],
  );

  return { threads, upsert, remove, hydrated };
}

export function useConnectors() {
  return useLocal<Connector[]>(KEYS.connectors, [], ["credential"]);
}

export function useAutomations() {
  return useLocal<Automation[]>(KEYS.automations, []);
}

export function useSkills() {
  return useLocal<Skill[]>(KEYS.skills, DEFAULT_SKILLS);
}

export function usePlugins() {
  return useLocal<Plugin[]>(KEYS.plugins, DEFAULT_PLUGINS);
}

export type BuiltinStatus = { openai: boolean; anthropic: boolean; google: boolean; grok: boolean };

/** Asks the server which built-in provider keys are actually configured on this deployment. */
export function useBuiltinStatus() {
  const [status, setStatus] = useState<BuiltinStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/chat/status")
      .then((r) => r.json())
      .then((data: BuiltinStatus) => {
        if (!cancelled) setStatus(data);
      })
      .catch(() => {
        if (!cancelled) setStatus(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { status, loading };
}

export function useFiles() {
  return useLocal<StoredFile[]>(KEYS.files, []);
}

export function usePersona() {
  const [id, setId, hydrated] = useLocal<string>(KEYS.persona, "kernel");
  const persona = PERSONAS.find((p) => p.id === id) ?? PERSONAS.find((p) => p.id === "kernel") ?? PERSONAS[0]!;
  return { persona, personaId: id, setPersonaId: setId, hydrated };
}

function defaultApiKeyProfile(): ApiKeyProfile {
  return {
    id: "default",
    name: "Google (Gemini, OpenAI-compatible)",
    kind: "openai",
    preset: "google",
    baseUrl: "https://generativelanguage.googleapis.com/v1beta/openai",
    apiKey: "",
  };
}

/** Kernel's own included-key profiles — no key to paste, requests go through Kernel's server proxy.
 *  Each only actually works once the matching env var is set on the deployment (see /api/chat/status). */
export const BUILTIN_PROFILES: ApiKeyProfile[] = [
  {
    id: "builtin-kernel",
    name: "Kernel free models",
    kind: "openai",
    preset: "kernel",
    baseUrl: "/api/chat/kernel",
    apiKey: "",
    builtin: true,
  },
  {
    id: "builtin-openai",
    name: "OpenAI (included)",
    kind: "openai",
    preset: "openai",
    baseUrl: "/api/chat/openai",
    apiKey: "",
    builtin: true,
  },
  {
    id: "builtin-anthropic",
    name: "Anthropic (included)",
    kind: "anthropic",
    preset: "anthropic",
    baseUrl: "/api/chat/anthropic",
    apiKey: "",
    builtin: true,
  },
  {
    id: "builtin-google",
    name: "Google (included)",
    kind: "openai",
    preset: "google",
    baseUrl: "/api/chat/google",
    apiKey: "",
    builtin: true,
  },
  {
    id: "builtin-grok",
    name: "Grok (included)",
    kind: "openai",
    preset: "grok",
    baseUrl: "/api/chat/grok",
    apiKey: "",
    builtin: true,
  },
];

function defaultApiKeys(): ApiKeyProfile[] {
  return [...BUILTIN_PROFILES, defaultApiKeyProfile()];
}

/** One-click presets shown in the "Add a provider" form. */
export const PROVIDER_PRESETS: Array<Omit<ApiKeyProfile, "id" | "apiKey">> = [
  { name: "OpenAI", kind: "openai", preset: "openai", baseUrl: "https://api.openai.com/v1" },
  { name: "Anthropic", kind: "anthropic", preset: "anthropic", baseUrl: "https://api.anthropic.com" },
  {
    name: "Google (Gemini, OpenAI-compatible)",
    kind: "openai",
    preset: "google",
    baseUrl: "https://generativelanguage.googleapis.com/v1beta/openai",
  },
  { name: "Grok (xAI)", kind: "openai", preset: "grok", baseUrl: "https://api.x.ai/v1" },
];

/** Named, switchable API key profiles (multiple providers, BYOK, plus Kernel's own included keys). */
export function useApiKeys() {
  const [keys, setKeys, hydratedKeys] = useLocal<ApiKeyProfile[]>(KEYS.apiKeys, defaultApiKeys(), ["apiKey"]);
  const [activeId, setActiveId, hydratedActive] = useLocal<string>(KEYS.activeApiKey, "builtin-kernel");

  // One-time migration for browsers that already had keys saved before built-in profiles existed.
  useEffect(() => {
    if (!hydratedKeys) return;
    const missing = BUILTIN_PROFILES.filter((b) => !keys.some((k) => k.id === b.id));
    if (missing.length > 0) setKeys((prev) => [...missing, ...prev]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydratedKeys]);

  const active = keys.find((k) => k.id === activeId) ?? keys[0] ?? defaultApiKeyProfile();

  const add = useCallback(
    (profile: Omit<ApiKeyProfile, "id">) => {
      const id = Math.random().toString(36).slice(2, 9);
      setKeys((prev) => [...prev, { ...profile, id }]);
      setActiveId(id);
    },
    [setKeys, setActiveId],
  );

  const update = useCallback(
    (id: string, patch: Partial<Omit<ApiKeyProfile, "id">>) =>
      setKeys((prev) => prev.map((k) => (k.id === id ? { ...k, ...patch } : k))),
    [setKeys],
  );

  const remove = useCallback(
    (id: string) => {
      setKeys((prev) => prev.filter((k) => k.id !== id));
      setActiveId((prev) => (prev === id ? "default" : prev));
    },
    [setKeys, setActiveId],
  );

  return {
    keys,
    active,
    activeId,
    setActiveId,
    add,
    update,
    remove,
    hydrated: hydratedKeys && hydratedActive,
  };
}
