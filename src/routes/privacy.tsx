import { createFileRoute, Link } from "@tanstack/react-router";

import { Ambience } from "@/components/kernel/ambience";
import { KernelLogo } from "@/components/kernel/logo";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [{ title: "Kernel — data & security" }] }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <Ambience intensity="soft" className="opacity-40" />
      <div className="relative z-10 mx-auto max-w-2xl px-6 py-16">
        <Link to="/">
          <KernelLogo />
        </Link>
        <h1 className="mt-10 text-3xl font-medium">How Kernel handles your data</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Plainly, not legally — this is what actually happens, technically.
        </p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-base font-medium text-foreground">No tracking cookies</h2>
            <p className="mt-2">
              Kernel doesn't set analytics or advertising cookies. Everything it remembers — chat
              threads, API key profiles, connectors, skills, uploaded files for search — is written
              to your browser's <code>localStorage</code>, scoped to this site's origin. It never
              leaves your device unless a request you triggered sends it somewhere (see below).
            </p>
          </section>

          <section>
            <h2 className="text-base font-medium text-foreground">Two ways Kernel talks to a model</h2>
            <p className="mt-2">
              <strong>Included providers</strong> ("OpenAI (included)", "Anthropic (included)", etc.)
              use a key Kernel's own server holds as an environment variable. Your message goes to
              Kernel's server first, which attaches that key and forwards the request on — so Kernel's
              server does see the content of those conversations, the same way any hosted AI product's
              backend does. The upside: nothing to paste, and it works out of the box.
            </p>
            <p className="mt-2">
              <strong>Bring-your-own-key providers</strong> skip Kernel's server entirely: your browser
              attaches your own key and sends the request straight to OpenAI, Anthropic, Google, or
              xAI's API. Kernel's server never sees your key or that conversation's content — but the
              key has to sit in your browser's memory and storage at the moment it's used, since that's
              the only way for your browser to make the request itself.
            </p>
            <p className="mt-2">
              You can switch between the two per API-key profile in Settings, and mix them across
              chats.
            </p>
          </section>

          <section>
            <h2 className="text-base font-medium text-foreground">
              On "unhackable" — what's actually true
            </h2>
            <p className="mt-2">
              For a bring-your-own-key profile, there's a hard limit on what "hiding" a key can mean:
              the app itself has to hold and use the plaintext key in the browser to make the request,
              so anything that can run JavaScript on the page — a malicious extension, an XSS bug — can
              read it the same way Kernel does. Obfuscating it in storage stops a casual look at
              devtools, not a determined attacker with script execution. No client-side app can honestly
              claim otherwise.
            </p>
            <p className="mt-2">
              For an included provider, your browser never holds that key at all — it's on Kernel's
              server, which is the actual fix for that specific problem. The trade-off moves elsewhere:
              you're now trusting Kernel's server (and whoever operates it) with your conversation
              content for those calls, the same trust you'd extend to any hosted AI product.
            </p>
          </section>

          <section>
            <h2 className="text-base font-medium text-foreground">What Kernel does either way</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Key fields are always masked (<code>type="password"</code>) in the UI.</li>
              <li>Bring-your-own keys are lightly obfuscated at rest in local storage, not plain text.</li>
              <li>Keys are never included in error messages, thread exports, or logs.</li>
              <li>
                Included-provider requests are only ever proxied to that provider's real API — Kernel's
                server doesn't log or store the conversation beyond what's needed to forward the request.
              </li>
              <li>
                Settings → API keys has a "Clear all local data" action that wipes everything Kernel
                has stored locally, immediately and irreversibly.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-medium text-foreground">MCP connectors</h2>
            <p className="mt-2">
              MCP connectors always work the bring-your-own-key way: Kernel calls the server URL you
              provide directly from your browser. Only add MCP servers and credentials you trust — a
              malicious MCP server can see whatever arguments the model sends it.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
