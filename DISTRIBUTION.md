# Distribution: web + desktop from one build

Kernel's chat app (`/chat`) is built to run unmodified inside a native desktop
shell, so there is exactly one frontend and one session/store layer for both
targets.

## Why this works without a separate backend

- All session state — threads, messages, connectors, automations, skills, and
  the provider key — lives in `localStorage` via `src/lib/kernel-store.ts`.
  Both a browser tab and a desktop webview (Tauri/Electron both embed a real
  browser engine) support `localStorage` identically, so a user's threads and
  settings carry over if they use both.
- The agent harness (`src/lib/agent.ts`) talks directly to the model
  provider's OpenAI-compatible endpoint from the client with the user's own
  key (BYOK). There is no Kernel-run backend in the loop, so there's nothing
  server-side to duplicate or keep in sync between web and desktop.

## Turning this into a downloadable desktop build

The web build (`npm run build`) already produces a static-servable client
bundle plus an SSR server entry. To wrap it for desktop distribution:

1. **Tauri (recommended, smallest binary):**
   - `npm create tauri-app` is not needed — add the `@tauri-apps/cli` dev
     dependency to this project instead, then point `tauri.conf.json`'s
     `build.devUrl` / `frontendDist` at this app's dev server / `dist`
     output.
   - Because the app has no server-side secrets (BYOK is entered locally),
     you can ship it as a fully static export (`vite build --ssr false`
     equivalent, or prerender `/chat` and `/`) and skip running the Nitro
     server inside the desktop shell entirely.
2. **Electron (if you need Node/file-system access from tools later):**
   - Point `BrowserWindow.loadURL` at the built `index.html` for local
     bundling, or at the hosted URL for an "app that's really a pinned tab"
     approach.
3. Either way, add local file access / shell tools as new entries in
   `src/lib/agent.ts`'s tool list, gated behind a `window.__KERNEL_DESKTOP__`
   check so the same tool UI (step trace, permissions) works for both, but
   the extra capabilities only register when actually running in the
   desktop shell.

## What's already true today

- Web: works now at `/chat`, no build changes needed.
- Desktop: needs the wrapper step above (roughly a day of packaging work) —
  no changes to the chat app itself.
