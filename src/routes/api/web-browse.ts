import { createFileRoute } from "@tanstack/react-router";

/**
 * Server-side web browsing route. Fetches a URL and returns cleaned text,
 * bypassing browser CORS. Also supports search via DuckDuckGo HTML scrape.
 */
export const Route = createFileRoute("/api/web-browse")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { url, query } = await request.json();

          // Mode 1: Web search via DuckDuckGo HTML
          if (query) {
            const searchUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
            const res = await fetch(searchUrl, {
              headers: { "user-agent": "Mozilla/5.0 (compatible; KernelBot/1.0)" },
            });
            const html = await res.text();
            const results = extractSearchResults(html);
            return Response.json({ results });
          }

          // Mode 2: Fetch a URL and extract readable text
          if (url) {
            const res = await fetch(url, {
              headers: { "user-agent": "Mozilla/5.0 (compatible; KernelBot/1.0)" },
              signal: AbortSignal.timeout(10000),
            });
            const html = await res.text();
            const text = extractReadableText(html, url);
            return Response.json({ url, text });
          }

          return Response.json({ error: "Provide 'url' or 'query'." }, { status: 400 });
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Unknown error";
          return Response.json({ error: msg }, { status: 500 });
        }
      },
    },
  },
});

function extractSearchResults(html: string) {
  const results: { title: string; url: string; snippet: string }[] = [];
  const blockRe = /<div class="result[^"]*">([\s\S]*?)<\/div>\s*<\/div>/g;
  const titleRe = /<a[^>]*class="result__a"[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/;
  const snippetRe = /<a[^>]*class="result__snippet"[^>]*>([\s\S]*?)<\/a>/;

  let match;
  while ((match = blockRe.exec(html)) && results.length < 8) {
    const block = match[1];
    const titleMatch = block.match(titleRe);
    const snippetMatch = block.match(snippetRe);
    if (titleMatch) {
      const rawUrl = titleMatch[1];
      const url = rawUrl.replace(/^\/\/duckduckgo\.com\/l\/\?uddg=/, "").replace(/&rut=[^"]*/, "");
      try {
        const decoded = decodeURIComponent(url);
        results.push({
          title: stripTags(titleMatch[2]).trim(),
          url: decoded.startsWith("http") ? decoded : `https://${decoded}`,
          snippet: snippetMatch ? stripTags(snippetMatch[1]).trim() : "",
        });
      } catch {
        // skip unparseable URLs
      }
    }
  }
  return results;
}

function extractReadableText(html: string, baseUrl: string) {
  // Remove scripts, styles, and nav elements
  let cleaned = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<nav[\s\S]*?<\/nav>/gi, "")
    .replace(/<footer[\s\S]*?<\/footer>/gi, "")
    .replace(/<header[\s\S]*?<\/header>/gi, "")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, "");

  // Try to find main content
  const mainMatch = cleaned.match(/<main[\s\S]*?<\/main>/i) || cleaned.match(/<article[\s\S]*?<\/article>/i);
  if (mainMatch) cleaned = mainMatch[0];

  // Convert to text
  const text = stripTags(cleaned)
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]+/g, " ")
    .trim();

  return text.slice(0, 4000);
}

function stripTags(html: string) {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}
