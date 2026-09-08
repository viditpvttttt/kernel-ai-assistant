import { createFileRoute } from "@tanstack/react-router";

/**
 * Server-side web browsing route. Fetches a URL and returns cleaned text,
 * bypassing browser CORS. Also supports search via DuckDuckGo Lite.
 */
export const Route = createFileRoute("/api/web-browse")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { url, query } = await request.json();

          // Mode 1: Web search via DuckDuckGo Lite
          if (query) {
            const searchUrl = `https://lite.duckduckgo.com/lite/?q=${encodeURIComponent(query)}`;
            const res = await fetch(searchUrl, {
              headers: {
                "user-agent":
                  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
              },
            });
            const html = await res.text();
            const results = extractSearchResults(html);
            return Response.json({ results });
          }

          // Mode 2: Fetch a URL and extract readable text
          if (url) {
            const res = await fetch(url, {
              headers: {
                "user-agent":
                  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
              },
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

/**
 * Extracts search results from DuckDuckGo Lite HTML.
 * Lite uses `<a rel="nofollow" href="//duckduckgo.com/l/?uddg=ENCODED_URL">Title</a>`.
 */
function extractSearchResults(html: string) {
  const results: { title: string; url: string; snippet: string }[] = [];
  const linkRe = /<a rel="nofollow"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g;

  let match;
  while ((match = linkRe.exec(html)) && results.length < 8) {
    const rawUrl = match[1];
    const title = stripTags(match[2]).trim();
    if (!title) continue;

    // Decode the DuckDuckGo redirect URL
    const uddgMatch = rawUrl.match(/uddg=([^&]+)/);
    let decodedUrl = rawUrl;
    if (uddgMatch) {
      try {
        decodedUrl = decodeURIComponent(uddgMatch[1]);
      } catch {
        decodedUrl = rawUrl;
      }
    }
    if (!decodedUrl.startsWith("http")) {
      decodedUrl = `https://${decodedUrl}`;
    }

    // Extract snippet — the text in the <td> after the link
    const afterLink = html.slice(match.index + match[0].length, match.index + match[0].length + 500);
    const snippetMatch = afterLink.match(/<\/a>\s*<\/td>\s*<td[^>]*>([\s\S]*?)<\/td>/);
    const snippet = snippetMatch ? stripTags(snippetMatch[1]).trim() : "";

    results.push({ title, url: decodedUrl, snippet });
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
