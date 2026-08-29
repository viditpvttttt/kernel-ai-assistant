# Setting up Kernel's included API keys

Kernel ships with four server-side proxy routes so people can chat without
bringing their own key: `/api/chat/openai`, `/api/chat/anthropic`,
`/api/chat/google`, `/api/chat/grok`. Each one only works once its matching
environment variable is set on the actual deployment — nothing in the code
needs to change.

## Environment variables

| Provider  | Env var             | Where to get a key                          |
|-----------|----------------------|----------------------------------------------|
| OpenAI    | `OPENAI_API_KEY`     | platform.openai.com → API keys               |
| Anthropic | `ANTHROPIC_API_KEY`  | console.anthropic.com → API keys             |
| Google    | `GOOGLE_API_KEY`     | aistudio.google.com → Get API key            |
| xAI/Grok  | `XAI_API_KEY`        | console.x.ai → API keys                      |

Set whichever ones you want to offer — you don't need all four. Providers
without a key configured show as "Not set up on this deployment" in Settings
and fall back to demo mode instead of erroring.

## On Vercel

Project → Settings → Environment Variables → add each key for the
Production (and Preview, if you want it there too) environment, then
redeploy.

## On Lovable

Project → Settings → Secrets (or wherever Lovable's current env-var UI
lives — check their docs, this moves around) → add the same variables, then
redeploy.

## Checking it worked

Visit `/api/chat/status` on the deployed site — it returns
`{"openai": true/false, "anthropic": ..., "google": ..., "grok": ...}` for
whichever keys are actually visible to the server. The same endpoint powers
the "Ready" / "Not set up" badges in Settings → API keys, so there's nothing
extra to wire up once the env vars are in place.

## Cost note

Included keys are shared across everyone who uses the deployed site — every
message sent through an "included" provider bills to whichever key you set,
not to the visitor. There's no per-user quota built in yet; if this matters,
add rate limiting at the proxy routes (`src/routes/api/chat/*.ts`) before
opening this up publicly.
