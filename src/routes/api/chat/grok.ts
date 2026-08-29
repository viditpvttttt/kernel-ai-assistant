import { createFileRoute } from "@tanstack/react-router";

/** Proxies to xAI's Grok endpoint using a server-only key (XAI_API_KEY). */
export const Route = createFileRoute("/api/chat/grok")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env["XAI_API_KEY"];
        if (!apiKey) {
          return Response.json(
            {
              error:
                "Kernel's included Grok key isn't configured on this deployment. Set XAI_API_KEY " +
                "in the hosting provider's environment variables, or use Settings → API keys to bring your own.",
            },
            { status: 501 },
          );
        }

        const body = await request.text();
        const upstream = await fetch("https://api.x.ai/v1/chat/completions", {
          method: "POST",
          headers: { "content-type": "application/json", authorization: `Bearer ${apiKey}` },
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
