import { createFileRoute } from "@tanstack/react-router";

/** Proxies to Google's OpenAI-compatible Gemini endpoint using a server-only key (GOOGLE_API_KEY). */
export const Route = createFileRoute("/api/chat/google")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env["GOOGLE_API_KEY"];
        if (!apiKey) {
          return Response.json(
            {
              error:
                "Kernel's included Google key isn't configured on this deployment. Set GOOGLE_API_KEY " +
                "in the hosting provider's environment variables, or use Settings → API keys to bring your own.",
            },
            { status: 501 },
          );
        }

        const body = await request.text();
        const upstream = await fetch(
          "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
          {
            method: "POST",
            headers: { "content-type": "application/json", authorization: `Bearer ${apiKey}` },
            body,
          },
        );

        return new Response(upstream.body, {
          status: upstream.status,
          headers: { "content-type": upstream.headers.get("content-type") ?? "application/json" },
        });
      },
    },
  },
});
