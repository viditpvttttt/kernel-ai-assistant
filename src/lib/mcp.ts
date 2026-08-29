/**
 * A real MCP (Model Context Protocol) client for remote servers that speak
 * the Streamable HTTP transport — the same transport Claude.ai and other MCP
 * hosts use for remote connectors. This talks JSON-RPC 2.0 over a single
 * POST endpoint, handles the `Mcp-Session-Id` handshake, and accepts either
 * a plain JSON response or a `text/event-stream` response (both are valid
 * per spec).
 *
 * Browser CORS is the real-world constraint here: an MCP server has to opt
 * in to being called from a page origin. Public servers built for ChatGPT/
 * Claude/agent hosts generally do; a lot of self-hosted ones don't, and that
 * shows up as a network error rather than a protocol error.
 */

export type McpServerConfig = {
  url: string;
  headerName?: string;
  credential?: string;
};

export type McpToolInfo = {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
};

let rpcCounter = 0;
function nextRpcId() {
  rpcCounter += 1;
  return rpcCounter;
}

async function mcpRequest(
  server: McpServerConfig,
  method: string,
  params: Record<string, unknown>,
  sessionId?: string,
): Promise<{ result?: unknown; error?: { message: string }; sessionId?: string }> {
  const headers: Record<string, string> = {
    "content-type": "application/json",
    accept: "application/json, text/event-stream",
  };
  if (server.headerName && server.credential) headers[server.headerName] = server.credential;
  if (sessionId) headers["mcp-session-id"] = sessionId;

  const res = await fetch(server.url, {
    method: "POST",
    headers,
    body: JSON.stringify({ jsonrpc: "2.0", id: nextRpcId(), method, params }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => res.statusText);
    throw new Error(`MCP server returned ${res.status}: ${body.slice(0, 300)}`);
  }

  const newSessionId = res.headers.get("mcp-session-id") ?? sessionId;
  const contentType = res.headers.get("content-type") ?? "";

  let payload: { result?: unknown; error?: { message: string } };
  if (contentType.includes("text/event-stream")) {
    const raw = await res.text();
    const dataLines = raw
      .split("\n")
      .filter((l) => l.startsWith("data:"))
      .map((l) => l.slice(5).trim())
      .filter(Boolean);
    const last = dataLines[dataLines.length - 1];
    payload = last ? (JSON.parse(last) as typeof payload) : {};
  } else {
    payload = (await res.json()) as typeof payload;
  }

  return { ...payload, ...(newSessionId ? { sessionId: newSessionId } : {}) };
}

/** Performs the MCP initialize handshake and returns a session id to reuse for subsequent calls. */
async function mcpInitialize(server: McpServerConfig): Promise<string | undefined> {
  const res = await mcpRequest(server, "initialize", {
    protocolVersion: "2025-06-18",
    capabilities: {},
    clientInfo: { name: "Kernel", version: "1.0.0" },
  });
  if (res.error) throw new Error(res.error.message);
  return res.sessionId;
}

/** Discovers the tools a remote MCP server exposes. Real network call, not a mock. */
export async function mcpListTools(server: McpServerConfig): Promise<McpToolInfo[]> {
  const sessionId = await mcpInitialize(server);
  const res = await mcpRequest(server, "tools/list", {}, sessionId);
  if (res.error) throw new Error(res.error.message);
  const result = res.result as { tools?: Array<{ name: string; description?: string; inputSchema?: unknown }> };
  return (result?.tools ?? []).map((t) => ({
    name: t.name,
    description: t.description ?? "",
    inputSchema: (t.inputSchema as Record<string, unknown>) ?? { type: "object", properties: {} },
  }));
}

/** Calls a single tool on a remote MCP server and returns its text content. */
export async function mcpCallTool(
  server: McpServerConfig,
  name: string,
  args: Record<string, unknown>,
): Promise<{ text: string; isError: boolean }> {
  const sessionId = await mcpInitialize(server);
  const res = await mcpRequest(server, "tools/call", { name, arguments: args }, sessionId);
  if (res.error) return { text: res.error.message, isError: true };

  const result = res.result as { content?: Array<{ type: string; text?: string }>; isError?: boolean };
  const text = (result?.content ?? [])
    .filter((c) => c.type === "text" && c.text)
    .map((c) => c.text)
    .join("\n");
  return { text: text || "(empty result)", isError: Boolean(result?.isError) };
}
