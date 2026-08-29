import { createFileRoute } from "@tanstack/react-router";

/**
 * Tells the client which of Kernel's built-in (server-held) provider keys
 * are actually configured on this deployment, without ever exposing the
 * keys themselves — just booleans.
 */
export const Route = createFileRoute("/api/chat/status")({
  server: {
    handlers: {
      GET: async () => {
        return Response.json({
          openai: Boolean(process.env["OPENAI_API_KEY"]),
          anthropic: Boolean(process.env["ANTHROPIC_API_KEY"]),
          google: Boolean(process.env["GOOGLE_API_KEY"]),
          grok: Boolean(process.env["XAI_API_KEY"]),
        });
      },
    },
  },
});
