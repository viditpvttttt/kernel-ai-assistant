import { createFileRoute } from "@tanstack/react-router";

/**
 * Kernel's free included models — proxies to the Lovable AI Gateway with a server-held key
 * (LOVABLE_API_KEY), so users get working chat with no key of their own.
 */
export const Route = createFileRoute("/api/chat/kernel")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env["LOVABLE_API_KEY"];
        if (!apiKey) {
          return Response.json(
            {
              error:
                "Kernel's free models aren't configured on this deployment (LOVABLE_API_KEY is " +
                "missing). Add your own provider key in Settings → API keys instead.",
            },
            { status: 501 },
          );
        }

        const body = await request.text();
        const upstream = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: { "content-type": "application/json", "Lovable-API-Key": apiKey },
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
