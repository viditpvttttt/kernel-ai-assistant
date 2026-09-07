/**
 * Kernel's agent harness.
 *
 * Talks to either an OpenAI-compatible `/chat/completions` endpoint (OpenAI,
 * Google, Groq, OpenRouter, local runtimes…) or Anthropic's native
 * `/v1/messages` endpoint, streams the reply token-by-token, hands the model
 * a set of callable tools, executes whichever ones it asks for, and keeps
 * going until the model returns a final answer (or a step budget is hit).
 * Every step is reported through `onStep` so the UI can render a live,
 * interactive trace.
 */

export type ChatAttachment = {
  kind: "image" | "audio";
  dataUrl: string;
  name?: string;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  attachments?: ChatAttachment[];
  createdAt: number;
};

export type ToolResult = { text: string; attachments?: ChatAttachment[] };

export type ToolDefinition = {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
  execute: (args: Record<string, unknown>) => Promise<ToolResult>;
};

export type AgentStep =
  | { kind: "thinking"; id: string }
  | { kind: "tool_call"; id: string; tool: string; args: Record<string, unknown> }
  | { kind: "tool_result"; id: string; tool: string; result: string; ok: boolean; attachments?: ChatAttachment[] }
  | { kind: "final"; id: string; text: string }
  | { kind: "error"; id: string; message: string };

export type ProviderKind = "openai" | "anthropic";
export type ProviderConfig = { baseUrl: string; apiKey: string; kind: ProviderKind; builtin?: boolean };

const MAX_STEPS = 6;

function stepId() {
  return Math.random().toString(36).slice(2, 10);
}

function text(t: string): ToolResult {
  return { text: t };
}

// ---------------------------------------------------------------------------
// Built-in tools
// ---------------------------------------------------------------------------

/** Built-in tool: safe arithmetic, no network required. */
export const calculatorTool: ToolDefinition = {
  name: "calculate",
  description: "Evaluate a numeric expression, e.g. (1234 * 88) / 7. Digits and + - * / ( ) . only.",
  parameters: {
    type: "object",
    properties: { expression: { type: "string" } },
    required: ["expression"],
  },
  async execute(args) {
    const expr = String(args["expression"] ?? "");
    if (!/^[\d+\-*/().\s]+$/.test(expr)) throw new Error("Unsafe expression");
    // eslint-disable-next-line no-new-func
    const value = Function(`"use strict"; return (${expr});`)();
    return text(String(value));
  },
};

/** Built-in tool: fetch a URL and return trimmed text. Subject to CORS like any client-side fetch. */
export const fetchUrlTool: ToolDefinition = {
  name: "fetch_url",
  description: "Fetch a public URL and return up to 2000 characters of its text content.",
  parameters: {
    type: "object",
    properties: { url: { type: "string" } },
    required: ["url"],
  },
  async execute(args) {
    const url = String(args["url"] ?? "");
    const res = await fetch(url);
    const body = await res.text();
    return text(body.slice(0, 2000));
  },
};

/** Built-in tool: search the web and browse pages via the server-side proxy. */
export const webBrowseTool: ToolDefinition = {
  name: "web_browse",
  description:
    "Search the web for a query and return top results with titles, URLs, and snippets. " +
    "Alternatively, fetch a specific URL and return its readable text content. " +
    "Use this to pull live information from the internet when answering questions.",
  parameters: {
    type: "object",
    properties: {
      query: { type: "string", description: "Search query to look up on the web" },
      url: { type: "string", description: "Specific URL to fetch and read" },
    },
  },
  async execute(args) {
    const body: Record<string, string> = {};
    if (typeof args["query"] === "string") body.query = args["query"];
    if (typeof args["url"] === "string") body.url = args["url"];
    if (!body.query && !body.url) return text("Provide a search query or a URL.");

    const res = await fetch("/api/web-browse", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return text(`Web browse error: ${(err as { error?: string }).error ?? res.statusText}`);
    }
    const data = await res.json();

    if (data.results) {
      const formatted = data.results
        .map((r: { title: string; url: string; snippet: string }, i: number) =>
          `${i + 1}. ${r.title}\n   ${r.url}\n   ${r.snippet}`,
        )
        .join("\n\n");
      return text(`Search results for "${body.query}":\n\n${formatted}`);
    }
    if (data.text) {
      return text(`Content from ${data.url}:\n\n${data.text}`);
    }
    return text("No results found.");
  },
};

/** Wraps a user connector (API or webhook) as a callable tool. */
export function connectorTool(connector: {
  id: string;
  name: string;
  kind: "api" | "webhook";
  baseUrl: string;
  headerName: string;
  credential: string;
}): ToolDefinition {
  return {
    name: `call_connector_${connector.id}`,
    description: `Call the "${connector.name}" ${connector.kind} at ${connector.baseUrl}. Pass a JSON "body" and optional "path" appended to the base URL.`,
    parameters: {
      type: "object",
      properties: {
        path: { type: "string", description: "Path appended to the connector base URL" },
        body: { type: "object", description: "JSON body to send" },
      },
    },
    async execute(args) {
      const path = typeof args["path"] === "string" ? (args["path"] as string) : "";
      const headers: Record<string, string> = { "content-type": "application/json" };
      if (connector.headerName && connector.credential) {
        headers[connector.headerName] = connector.credential;
      }
      const init: RequestInit = {
        method: connector.kind === "webhook" ? "POST" : "GET",
        headers,
      };
      if (args["body"]) init.body = JSON.stringify(args["body"]);
      const res = await fetch(connector.baseUrl.replace(/\/$/, "") + path, init);
      const body = await res.text();
      return text(`${res.status} ${res.statusText}: ${body.slice(0, 800)}`);
    },
  };
}

/** Wraps a single tool discovered on a remote MCP server as a Kernel tool, calling `tools/call` on invocation. */
export function mcpConnectorTool(
  connector: { id: string; baseUrl: string; headerName: string; credential: string },
  info: { name: string; description: string; inputSchema: Record<string, unknown> },
): ToolDefinition {
  return {
    name: `mcp_${connector.id}_${info.name}`,
    description: `[MCP] ${info.description || info.name}`,
    parameters: info.inputSchema,
    async execute(args) {
      const { mcpCallTool } = await import("./mcp");
      const server = {
        url: connector.baseUrl,
        ...(connector.headerName ? { headerName: connector.headerName } : {}),
        ...(connector.credential ? { credential: connector.credential } : {}),
      };
      const result = await mcpCallTool(server, info.name, args);
      if (result.isError) throw new Error(result.text);
      return text(result.text);
    },
  };
}

// ---------------------------------------------------------------------------
// Code interpreter — real, isolated JS execution in a dedicated Web Worker
// ---------------------------------------------------------------------------

const SANDBOX_WORKER_SRC = `
self.onmessage = async (e) => {
  const logs = [];
  const push = (...args) => logs.push(args.map((a) => {
    try { return typeof a === "string" ? a : JSON.stringify(a); } catch { return String(a); }
  }).join(" "));
  self.console = { log: push, info: push, warn: push, error: push };
  try {
    const runner = new Function('"use strict"; return (async () => {\\n' + e.data.code + '\\n})()');
    const result = await runner();
    self.postMessage({ ok: true, logs, result: result === undefined ? undefined : JSON.stringify(result) });
  } catch (err) {
    self.postMessage({ ok: false, logs, error: (err && err.message) ? err.message : String(err) });
  }
};
`;

type SandboxResult = { ok: boolean; logs: string[]; result?: string; error?: string };

function runInSandbox(code: string, timeoutMs = 5000): Promise<SandboxResult> {
  return new Promise((resolve) => {
    const blob = new Blob([SANDBOX_WORKER_SRC], { type: "application/javascript" });
    const url = URL.createObjectURL(blob);
    const worker = new Worker(url);
    let settled = false;

    const finish = (r: SandboxResult) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      worker.terminate();
      URL.revokeObjectURL(url);
      resolve(r);
    };

    const timer = setTimeout(() => finish({ ok: false, logs: [], error: `Timed out after ${timeoutMs}ms` }), timeoutMs);

    worker.onmessage = (e) => finish(e.data as SandboxResult);
    worker.onerror = (e) => finish({ ok: false, logs: [], error: e.message || "Worker error" });
    worker.postMessage({ code });
  });
}

/** Real code-execution plugin: runs JS in an isolated worker (no DOM access) and returns console output + result. */
export const codeInterpreterTool: ToolDefinition = {
  name: "code_interpreter",
  description:
    "Execute JavaScript in an isolated sandbox (a dedicated Web Worker with no DOM access) and return console " +
    "output plus the returned value. Use this for real calculations, data transforms, parsing, or verifying logic " +
    "instead of reasoning through it in text. Use `return` to produce a result and console.log for intermediate output.",
  parameters: {
    type: "object",
    properties: { code: { type: "string", description: "JavaScript source to run." } },
    required: ["code"],
  },
  async execute(args) {
    const code = String(args["code"] ?? "");
    const result = await runInSandbox(code);
    const parts = [
      result.logs.length ? `console output:\n${result.logs.join("\n")}` : "",
      result.ok ? `result: ${result.result ?? "(no return value)"}` : `error: ${result.error}`,
    ].filter(Boolean);
    return text(parts.join("\n\n") || "(no output)");
  },
};

// ---------------------------------------------------------------------------
// Image generation — real call to the active provider's image endpoint
// ---------------------------------------------------------------------------

/** Real image-generation plugin: calls the active OpenAI-compatible provider's /images/generations endpoint. */
export function imageGenerationTool(provider: ProviderConfig): ToolDefinition {
  return {
    name: "generate_image",
    description: "Generate an image from a text prompt using the active provider's image endpoint.",
    parameters: {
      type: "object",
      properties: {
        prompt: { type: "string" },
        size: { type: "string", description: 'e.g. "1024x1024". Defaults to 1024x1024.' },
      },
      required: ["prompt"],
    },
    async execute(args) {
      const prompt = String(args["prompt"] ?? "");
      const size = typeof args["size"] === "string" ? (args["size"] as string) : "1024x1024";

      if (!provider.apiKey && !provider.builtin) {
        throw new Error("No API key configured — add one in Settings → API keys.");
      }
      if (provider.builtin) {
        throw new Error(
          "Kernel's included keys don't cover image generation yet — switch to a bring-your-own-key " +
            "OpenAI-compatible provider in Settings → API keys to use this tool.",
        );
      }
      if (provider.kind === "anthropic") {
        throw new Error(
          "Anthropic's API doesn't expose image generation. Switch the active API key to an OpenAI-compatible " +
            "provider with an image endpoint (OpenAI, or Google's Gemini image model) to use this tool.",
        );
      }

      const isOpenAi = /api\.openai\.com/.test(provider.baseUrl);
      const model = typeof args["model"] === "string" ? (args["model"] as string) : isOpenAi ? "gpt-image-2" : undefined;

      const res = await fetch(provider.baseUrl.replace(/\/$/, "") + "/images/generations", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${provider.apiKey}`,
        },
        body: JSON.stringify({ ...(model ? { model } : {}), prompt, size, response_format: "b64_json" }),
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => res.statusText);
        throw new Error(`Image generation failed (${res.status}): ${errText.slice(0, 300)}`);
      }

      const data = (await res.json()) as { data?: Array<{ b64_json?: string; url?: string }> };
      const first = data.data?.[0];
      const dataUrl = first?.b64_json ? `data:image/png;base64,${first.b64_json}` : first?.url;
      if (!dataUrl) throw new Error("Provider returned no image data.");

      return {
        text: `Generated an image for: "${prompt}"`,
        attachments: [{ kind: "image", dataUrl, name: "generated.png" }],
      };
    },
  };
}

// ---------------------------------------------------------------------------
// File search — real keyword search over locally uploaded files
// ---------------------------------------------------------------------------

export type SearchableFile = { name: string; content: string };

/** Real file-search plugin: keyword-scored search over files uploaded in Settings → Files. */
export function fileSearchTool(files: SearchableFile[]): ToolDefinition {
  return {
    name: "file_search",
    description: "Keyword-search the files uploaded in Settings → Files and return the most relevant snippets.",
    parameters: {
      type: "object",
      properties: { query: { type: "string" } },
      required: ["query"],
    },
    async execute(args) {
      const query = String(args["query"] ?? "")
        .toLowerCase()
        .trim();
      if (!query) return text("No query provided.");
      if (files.length === 0) return text("No files have been uploaded yet (Settings → Files).");

      const terms = query.split(/\s+/).filter(Boolean);
      const scored = files
        .map((f) => {
          const lower = f.content.toLowerCase();
          const score = terms.reduce((acc, t) => acc + (t ? lower.split(t).length - 1 : 0), 0);
          return { f, score, lower };
        })
        .filter((x) => x.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);

      if (scored.length === 0) return text(`No matches for "${query}" across ${files.length} file(s).`);

      const snippets = scored.map(({ f, lower }) => {
        const firstTerm = terms.find((t) => lower.includes(t)) ?? terms[0] ?? "";
        const idx = Math.max(0, lower.indexOf(firstTerm));
        const start = Math.max(0, idx - 200);
        const snippet = f.content.slice(start, start + 500).trim();
        return `--- ${f.name} ---\n${snippet}`;
      });

      return text(snippets.join("\n\n"));
    },
  };
}

// ---------------------------------------------------------------------------
// OpenAI-compatible wire format
// ---------------------------------------------------------------------------

function toOpenAiTools(tools: ToolDefinition[]) {
  return tools.map((t) => ({
    type: "function" as const,
    function: { name: t.name, description: t.description, parameters: t.parameters },
  }));
}

function toOpenAiMessages(messages: ChatMessage[], system: string) {
  const out: Array<Record<string, unknown>> = [{ role: "system", content: system }];
  for (const m of messages) {
    const images = (m.attachments ?? []).filter((a) => a.kind === "image");
    if (images.length && m.role === "user") {
      out.push({
        role: "user",
        content: [
          { type: "text", text: m.content },
          ...images.map((img) => ({ type: "image_url", image_url: { url: img.dataUrl } })),
        ],
      });
    } else if (m.content) {
      // Skip empty-content messages (e.g. aborted assistant turns) — they're
      // invalid in the OpenAI wire format and cause provider 400s.
      out.push({ role: m.role, content: m.content });
    }
  }
  return out;
}

type StreamedToolCall = { id: string; function: { name: string; arguments: string } };

/** Reads an OpenAI-compatible SSE stream, forwarding content tokens and reconstructing tool calls. */
async function streamOpenAiCompletion(
  body: ReadableStream<Uint8Array>,
  onToken?: (textSoFar: string) => void,
): Promise<{ content: string; toolCalls: StreamedToolCall[] }> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let content = "";
  const toolCallsByIndex = new Map<number, StreamedToolCall>();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;
      const payload = trimmed.slice(5).trim();
      if (payload === "[DONE]") continue;

      try {
        const parsed = JSON.parse(payload) as {
          choices?: Array<{
            delta?: {
              content?: string | null;
              tool_calls?: Array<{
                index: number;
                id?: string;
                function?: { name?: string; arguments?: string };
              }>;
            };
          }>;
        };
        const delta = parsed.choices?.[0]?.delta;
        if (delta?.content) {
          content += delta.content;
          onToken?.(content);
        }
        for (const tc of delta?.tool_calls ?? []) {
          const existing = toolCallsByIndex.get(tc.index) ?? {
            id: tc.id ?? stepId(),
            function: { name: "", arguments: "" },
          };
          if (tc.id) existing.id = tc.id;
          if (tc.function?.name) existing.function.name += tc.function.name;
          if (tc.function?.arguments) existing.function.arguments += tc.function.arguments;
          toolCallsByIndex.set(tc.index, existing);
        }
      } catch {
        /* ignore malformed SSE chunk */
      }
    }
  }

  return { content, toolCalls: [...toolCallsByIndex.values()] };
}

async function runOpenAiLoop(opts: RunOpts): Promise<{ text: string; attachments: ChatAttachment[] }> {
  const { messages, model, system, provider, tools, onStep, onToken, signal } = opts;
  const conversation = toOpenAiMessages(messages, system);
  const allAttachments: ChatAttachment[] = [];
  let lastText = "";

  for (let step = 0; step < MAX_STEPS; step++) {
    onStep({ kind: "thinking", id: stepId() });

    const headers: Record<string, string> = { "content-type": "application/json" };
    if (!provider.builtin) headers["authorization"] = `Bearer ${provider.apiKey}`;

    const requestInit: RequestInit = {
      method: "POST",
      headers,
      body: JSON.stringify({
        model,
        messages: conversation,
        stream: true,
        ...(tools.length ? { tools: toOpenAiTools(tools), tool_choice: "auto" } : {}),
      }),
    };
    if (signal) requestInit.signal = signal;

    const endpoint = provider.builtin
      ? provider.baseUrl
      : provider.baseUrl.replace(/\/$/, "") + "/chat/completions";
    const res = await fetch(endpoint, requestInit);

    if (!res.ok) {
      if (res.status === 501 && provider.builtin) {
        return runDemoAgent(messages, tools, onStep, onToken, true);
      }
      const errBody = await res.text().catch(() => res.statusText);
      onStep({ kind: "error", id: stepId(), message: `${res.status}: ${errBody.slice(0, 300)}` });
      // Retry once without tools if the provider rejected the tool definitions.
      if (res.status === 400 && tools.length > 0) {
        return runOpenAiLoop({ ...opts, tools: [] });
      }
      throw new Error(`Provider error ${res.status}: ${errBody.slice(0, 200)}`);
    }
    if (!res.body) throw new Error("No response stream from provider.");

    const { content, toolCalls } = await streamOpenAiCompletion(res.body, onToken);

    if (toolCalls.length === 0) {
      lastText = content;
      onStep({ kind: "final", id: stepId(), text: lastText });
      return { text: lastText, attachments: allAttachments };
    }

    conversation.push({ role: "assistant", content: content || null, tool_calls: toolCalls });

    for (const call of toolCalls) {
      let args: Record<string, unknown> = {};
      try {
        args = JSON.parse(call.function.arguments || "{}");
      } catch {
        /* malformed args, execute with empty */
      }
      const callId = stepId();
      onStep({ kind: "tool_call", id: callId, tool: call.function.name, args });

      const { resultText, ok, attachments } = await runTool(tools, call.function.name, args);
      if (attachments?.length) allAttachments.push(...attachments);
      onStep({
        kind: "tool_result",
        id: callId,
        tool: call.function.name,
        result: resultText,
        ok,
        ...(attachments ? { attachments } : {}),
      });
      conversation.push({ role: "tool", tool_call_id: call.id, content: resultText });
    }
  }

  onStep({ kind: "final", id: stepId(), text: lastText });
  return { text: lastText || "Reached the step limit before finishing — try narrowing the request.", attachments: allAttachments };
}

// ---------------------------------------------------------------------------
// Anthropic native wire format (/v1/messages)
// ---------------------------------------------------------------------------

function toAnthropicTools(tools: ToolDefinition[]) {
  return tools.map((t) => ({ name: t.name, description: t.description, input_schema: t.parameters }));
}

function toAnthropicMessages(messages: ChatMessage[]) {
  return messages.map((m) => {
    const images = (m.attachments ?? []).filter((a) => a.kind === "image");
    if (images.length && m.role === "user") {
      return {
        role: "user" as const,
        content: [
          ...images.map((img) => {
            const match = /^data:(.*?);base64,(.*)$/.exec(img.dataUrl);
            return {
              type: "image" as const,
              source: {
                type: "base64" as const,
                media_type: match?.[1] ?? "image/png",
                data: match?.[2] ?? "",
              },
            };
          }),
          { type: "text" as const, text: m.content || " " },
        ],
      };
    }
    return { role: (m.role === "assistant" ? "assistant" : "user") as "user" | "assistant", content: m.content };
  });
}

type AnthropicToolCall = { id: string; name: string; input: Record<string, unknown> };

/** Reads Anthropic's native SSE stream, forwarding text tokens and reconstructing tool_use blocks. */
async function streamAnthropicMessage(
  body: ReadableStream<Uint8Array>,
  onToken?: (textSoFar: string) => void,
): Promise<{ content: string; toolCalls: AnthropicToolCall[] }> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let content = "";
  let currentEvent = "";
  const blocks = new Map<number, { type: string; toolId?: string; toolName?: string; jsonBuf: string }>();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (line.startsWith("event:")) {
        currentEvent = line.slice(6).trim();
        continue;
      }
      if (!line.startsWith("data:")) continue;
      const payload = line.slice(5).trim();
      if (!payload) continue;

      let data: {
        index?: number;
        content_block?: { type: string; id?: string; name?: string };
        delta?: { type: string; text?: string; partial_json?: string };
      };
      try {
        data = JSON.parse(payload);
      } catch {
        continue;
      }

      if (currentEvent === "content_block_start" && typeof data.index === "number" && data.content_block) {
        const block = data.content_block;
        if (block.type === "tool_use") {
          blocks.set(data.index, {
            type: "tool_use",
            ...(block.id ? { toolId: block.id } : {}),
            ...(block.name ? { toolName: block.name } : {}),
            jsonBuf: "",
          });
        } else {
          blocks.set(data.index, { type: "text", jsonBuf: "" });
        }
      } else if (currentEvent === "content_block_delta" && typeof data.index === "number" && data.delta) {
        const b = blocks.get(data.index);
        if (!b) continue;
        if (data.delta.type === "text_delta" && data.delta.text) {
          content += data.delta.text;
          onToken?.(content);
        } else if (data.delta.type === "input_json_delta" && data.delta.partial_json) {
          b.jsonBuf += data.delta.partial_json;
        }
      }
    }
  }

  const toolCalls: AnthropicToolCall[] = [];
  for (const b of blocks.values()) {
    if (b.type === "tool_use" && b.toolId && b.toolName) {
      let input: Record<string, unknown> = {};
      try {
        input = JSON.parse(b.jsonBuf || "{}");
      } catch {
        /* malformed args */
      }
      toolCalls.push({ id: b.toolId, name: b.toolName, input });
    }
  }

  return { content, toolCalls };
}

async function runAnthropicLoop(opts: RunOpts): Promise<{ text: string; attachments: ChatAttachment[] }> {
  const { messages, model, system, provider, tools, onStep, onToken, signal } = opts;
  const conversation: unknown[] = toAnthropicMessages(messages);
  const allAttachments: ChatAttachment[] = [];
  let lastText = "";

  for (let step = 0; step < MAX_STEPS; step++) {
    onStep({ kind: "thinking", id: stepId() });

    const headers: Record<string, string> = { "content-type": "application/json" };
    if (provider.builtin) {
      // Same-origin server route — no browser-CORS workaround or client-held key needed.
    } else {
      headers["x-api-key"] = provider.apiKey;
      headers["anthropic-version"] = "2023-06-01";
      headers["anthropic-dangerous-direct-browser-access"] = "true";
    }

    const requestInit: RequestInit = {
      method: "POST",
      headers,
      body: JSON.stringify({
        model,
        max_tokens: 4096,
        system,
        messages: conversation,
        stream: true,
        ...(tools.length ? { tools: toAnthropicTools(tools) } : {}),
      }),
    };
    if (signal) requestInit.signal = signal;

    const endpoint = provider.builtin
      ? provider.baseUrl
      : provider.baseUrl.replace(/\/$/, "") + "/v1/messages";
    const res = await fetch(endpoint, requestInit);

    if (!res.ok) {
      if (res.status === 501 && provider.builtin) {
        return runDemoAgent(messages, tools, onStep, onToken, true);
      }
      const errBody = await res.text().catch(() => res.statusText);
      onStep({ kind: "error", id: stepId(), message: `${res.status}: ${errBody.slice(0, 300)}` });
      throw new Error(`Provider error ${res.status}`);
    }
    if (!res.body) throw new Error("No response stream from Anthropic.");

    const { content, toolCalls } = await streamAnthropicMessage(res.body, onToken);

    if (toolCalls.length === 0) {
      lastText = content;
      onStep({ kind: "final", id: stepId(), text: lastText });
      return { text: lastText, attachments: allAttachments };
    }

    const assistantContent: unknown[] = [];
    if (content) assistantContent.push({ type: "text", text: content });
    for (const tc of toolCalls) assistantContent.push({ type: "tool_use", id: tc.id, name: tc.name, input: tc.input });
    conversation.push({ role: "assistant", content: assistantContent });

    const toolResultBlocks: unknown[] = [];
    for (const tc of toolCalls) {
      const callId = stepId();
      onStep({ kind: "tool_call", id: callId, tool: tc.name, args: tc.input });

      const { resultText, ok, attachments } = await runTool(tools, tc.name, tc.input);
      if (attachments?.length) allAttachments.push(...attachments);
      onStep({
        kind: "tool_result",
        id: callId,
        tool: tc.name,
        result: resultText,
        ok,
        ...(attachments ? { attachments } : {}),
      });
      toolResultBlocks.push({
        type: "tool_result",
        tool_use_id: tc.id,
        content: resultText,
        ...(ok ? {} : { is_error: true }),
      });
    }
    conversation.push({ role: "user", content: toolResultBlocks });
  }

  onStep({ kind: "final", id: stepId(), text: lastText });
  return { text: lastText || "Reached the step limit before finishing — try narrowing the request.", attachments: allAttachments };
}

// ---------------------------------------------------------------------------
// Shared helpers + public entry point
// ---------------------------------------------------------------------------

async function runTool(
  tools: ToolDefinition[],
  name: string,
  args: Record<string, unknown>,
): Promise<{ resultText: string; ok: boolean; attachments?: ChatAttachment[] }> {
  const tool = tools.find((t) => t.name === name);
  try {
    if (!tool) throw new Error(`Unknown tool: ${name}`);
    const r = await tool.execute(args);
    return { resultText: r.text, ok: true, ...(r.attachments ? { attachments: r.attachments } : {}) };
  } catch (err) {
    return { resultText: err instanceof Error ? err.message : String(err), ok: false };
  }
}

type RunOpts = {
  messages: ChatMessage[];
  model: string;
  system: string;
  provider: ProviderConfig;
  tools: ToolDefinition[];
  onStep: (step: AgentStep) => void;
  onToken?: (textSoFar: string) => void;
  signal?: AbortSignal;
};

/**
 * Runs the agentic loop against whichever wire format the active provider
 * uses. Emits AgentStep events via onStep, streams the final answer
 * token-by-token through onToken, and resolves with the full text plus any
 * attachments tools produced (e.g. a generated image).
 */
export async function runAgent(
  opts: RunOpts,
): Promise<{ text: string; attachments: ChatAttachment[] }> {
  if (!opts.provider.apiKey && !opts.provider.builtin) {
    return runDemoAgent(opts.messages, opts.tools, opts.onStep, opts.onToken);
  }
  return opts.provider.kind === "anthropic" ? runAnthropicLoop(opts) : runOpenAiLoop(opts);
}

/**
 * No API key configured yet: still show a real, live-timed multi-step trace
 * so the harness UI is demonstrable, clearly labeled as a local demo run.
 */
async function runDemoAgent(
  messages: ChatMessage[],
  tools: ToolDefinition[],
  onStep: (step: AgentStep) => void,
  onToken?: (textSoFar: string) => void,
  builtinNotConfigured?: boolean,
): Promise<{ text: string; attachments: ChatAttachment[] }> {
  const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
  const last = messages[messages.length - 1]?.content ?? "";

  onStep({ kind: "thinking", id: stepId() });
  await wait(500);

  const calc = tools.find((t) => t.name === "calculate");
  if (calc) {
    const callId = stepId();
    onStep({ kind: "tool_call", id: callId, tool: "calculate", args: { expression: "12 * 4" } });
    await wait(450);
    const result = await calc.execute({ expression: "12 * 4" }).catch(() => text("48"));
    onStep({ kind: "tool_result", id: callId, tool: "calculate", result: result.text, ok: true });
    await wait(350);
  }

  const summary = builtinNotConfigured
    ? `Demo mode — Kernel's included key for this provider isn't set up on this deployment yet, so ` +
      `this is a scripted trace, not a real model call. An admin needs to set the matching env var, ` +
      `or you can switch to a bring-your-own-key provider in Settings → API keys. Your message was: ` +
      `"${last.slice(0, 120)}".`
    : `Demo mode — no API key is configured yet, so this is a scripted trace, not a real model call. ` +
      `Add a provider in Settings → API keys to run this on a real model against: "${last.slice(0, 120)}".`;

  if (onToken) {
    let acc = "";
    for (const word of summary.split(" ")) {
      acc += (acc ? " " : "") + word;
      onToken(acc);
      await wait(18);
    }
  }

  onStep({ kind: "final", id: stepId(), text: summary });
  return { text: summary, attachments: [] };
}
