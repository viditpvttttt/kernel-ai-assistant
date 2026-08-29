import { createFileRoute } from "@tanstack/react-router";

/**
 * Proxies chat completions to OpenAI using a key that lives only in this
 * deployment's server environment (OPENAI_API_KEY). The browser sends the
 * same request body agent.ts already builds for the OpenAI wire format;
 * this route just attaches the real key and streams the response straight
 * through, so the key is never present in any client-side code, bundle, or
 * network request the browser can see.
 */
export const Route = createFileRoute("/api/chat/openai")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env["OPENAI_API_KEY"];
        if (!apiKey) {
          return Response.json(
            {
              error:
                "Kernel's included OpenAI key isn't configured on this deployment. Set OPENAI_API_KEY " +
                "in the hosting provider's environment variables, or use Settings → API keys to bring your own.",
            },
            { status: 501 },
          );
        }

        const body = await request.text();
        const upstream = await fetch("https://api.openai.com/v1/chat/completions", {
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
