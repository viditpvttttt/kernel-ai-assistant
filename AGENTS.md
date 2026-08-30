<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

<!-- BASE44:BEGIN -->
## Base44 dev environment

**Stack:** TanStack Start (Vite SSR + nitro) + React 19 + Tailwind v4. Package manager is **bun** (bunfig.toml / bun.lock).

**Run:** `docker compose -f docker-compose.base44.yml up -d` — the `oven/bun:1` service bind-mounts the repo, runs `bun install` then `bun run dev --host 0.0.0.0 --port 3000`. Live reload is on (Vite HMR + SSR). Web entry on host port 3000.

**Host/origin:** The Base44 preview serves through a proxy hostname that changes each environment recreation, so `vite.config.ts` sets `server.host: true` + `server.allowedHosts: true`. Do NOT pin a host. The `@lovable.dev/vite-tanstack-config` `defineConfig` takes a `vite` key for this — only add `server` config there, never duplicate the plugins it already wires.

**LLM provider keys (optional):** `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GOOGLE_API_KEY`, `XAI_API_KEY` are server-only env vars read by the proxy routes in `src/routes/api/chat/*.ts`. None are required to boot — without a key a provider shows "Not set up" and chat falls back to demo mode. Check which are live at `GET /api/chat/status`.

**Verify it works:** `curl -sf -H "Host: 3000-${BASE44_PUBLIC_HOST_SUFFIX}" http://localhost:3000/` must return the HTML (not a 403). A plain localhost curl passes even when the preview origin is blocked.
<!-- BASE44:END -->
