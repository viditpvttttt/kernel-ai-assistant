import { createFileRoute } from "@tanstack/react-router";

/**
 * Proxies to Anthropic's native /v1/messages using a server-only key
 * (ANTHROPIC_API_KEY). As a bonus of going through a real backend, this
 * sidesteps the browser CORS restriction Anthropic enforces on direct
 * client-side calls — no anthropic-dangerous-direct-browser-access header
 * needed, because the request now genuinely comes from a server.
 */
export const Route = createFileRoute("/api/chat/anthropic")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env["ANTHROPIC_API_KEY"];
        if (!apiKey) {
          return Response.json(
            {
              error:
                "Kernel's included Anthropic key isn't configured on this deployment. Set ANTHROPIC_API_KEY " +
                "in the hosting provider's environment variables, or use Settings → API keys to bring your own.",
            },
            { status: 501 },
          );
        }

        const body = await request.text();
        const upstream = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "x-api-key": apiKey,
            "anthropic-version": "2023-06-01",
          },
          body,
        });

        return new Response(upstream.body, {
          status: upstream.status,
          headers: { "content-type": upstream.headers.get("content-type") ?? "application/json" },
        });
      },
    },
  },
});
