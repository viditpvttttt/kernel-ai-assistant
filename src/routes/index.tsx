import { createFileRoute } from "@tanstack/react-router";

import { Ambience } from "@/components/kernel/ambience";
import { DownloadGrid } from "@/components/kernel/download";
import { SiteFooter } from "@/components/kernel/footer";
import { CursorSpotlight } from "@/components/kernel/fx/spotlight";
import { ModelOrbit } from "@/components/kernel/fx/model-orbit";
import { Depth, Tilt3D } from "@/components/kernel/fx/tilt";
import { Hero } from "@/components/kernel/hero";
import { ConnectorMarquee } from "@/components/kernel/marquee";
import { BoxReveal } from "@/components/kernel/fx/box-reveal";
import { KernelCube } from "@/components/kernel/fx/kernel-cube";
import { ScrambleText } from "@/components/kernel/fx/scramble-text";
import { ScrollProgress } from "@/components/kernel/fx/scroll-progress";
import { Rise, ScrollRevealText } from "@/components/kernel/reveal";
import { SiteNav } from "@/components/kernel/site-nav";
import { SkillCarousel } from "@/components/kernel/skill-carousel";
import { StickyStack } from "@/components/kernel/sticky-stack";

const title = "Kernel by Substrate — agentic multimodal AI with the models included";
const description =
  "Kernel by Substrate is an agentic AI workspace with Claude, GPT-5.5, Gemini and Grok included — no API keys needed. Multimodal chat, a real tool harness, connectors, automations, skills and plugins.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const capabilities = [
  {
    label: "Included models",
    body: "Claude, GPT-5.5, Gemini and Grok run on Substrate's own capacity. Bring a key only if you want to.",
  },
  {
    label: "Real harness",
    body: "Plan, act, verify, remember — up to 50 tool steps per turn, every step visible and inspectable.",
  },
  {
    label: "Multimodal in and out",
    body: "Images, audio, documents and code go in. Text, charts and generated images come back inline.",
  },
  {
    label: "Connectors & MCP",
    body: "Any REST API, webhook or MCP server becomes a tool the agent can call, scoped per chat.",
  },
  {
    label: "Skills & personas",
    body: "Teach it once and it keeps the lesson — reusable skills, permissions, and switchable personas.",
  },
  {
    label: "Runs anywhere",
    body: "Same workspace in a browser tab or as a desktop build with local files and shell access.",
  },
];

function Index() {
  return (
    <>
      <ScrollProgress />
      <CursorSpotlight />
      <SiteNav />
      <main>
        <Hero />

        <section className="void-surface relative mx-auto max-w-3xl px-6 py-32">
          <ScrollRevealText
            className="text-[clamp(1.6rem,4vw,2.6rem)] leading-[1.25] font-light tracking-tight"
            text="Most chat apps stop at the answer. Kernel keeps going — planning, calling tools, checking its own work, and returning something you can actually ship."
          />
        </section>

        <section id="models" className="void-surface rule-x relative overflow-hidden py-24">
          <Ambience intensity="soft" />
          <div className="relative mx-auto max-w-5xl px-6 text-center">
            <Rise>
              <p className="eyebrow">
                <ScrambleText text="No keys required" />
              </p>
              <BoxReveal>
                <h2 className="mx-auto mt-5 max-w-2xl text-[clamp(2.2rem,6vw,4rem)] leading-[1.05]">
                Every frontier model, already switched on.
              </h2>
              </BoxReveal>
              <p className="mx-auto mt-6 max-w-lg text-muted-foreground">
                Substrate supplies the capacity. Open Kernel and start a chat — swap between Claude,
                GPT-5.5, Gemini and Grok mid-conversation, on us. Add your own key later if you
                prefer to route through your own account.
              </p>
            </Rise>
            <div className="mt-12">
              <ModelOrbit />
            </div>
          </div>
        </section>

        <section id="harness" className="rule-x">
          <div className="mx-auto max-w-5xl px-6 pt-24">
            <Rise>
              <p className="eyebrow">
                <ScrambleText text="The harness" />
              </p>
              <BoxReveal>
                <h2 className="mt-5 max-w-2xl text-[clamp(2.2rem,6vw,4rem)] leading-[1.05]">
                A loop, not a reply box.
              </h2>
              </BoxReveal>
            </Rise>
          </div>
          <StickyStack />
        </section>

        <section id="capabilities" className="void-surface rule-x py-24">
          <div className="mx-auto max-w-5xl px-6">
            <Rise>
              <p className="eyebrow">
                <ScrambleText text="Loaded in" />
              </p>
              <BoxReveal>
                <h2 className="mt-5 max-w-2xl text-[clamp(2.2rem,6vw,4rem)] leading-[1.05]">
                Everything the other assistants ship, in one surface.
              </h2>
              </BoxReveal>
            </Rise>
            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {capabilities.map((c, i) => (
                <Rise key={c.label} delay={i * 0.05}>
                  <Tilt3D max={10} className="h-full">
                    <Depth z={24} className="h-full">
                      <div className="h-full rounded-2xl border border-border bg-card p-6 shadow-[0_24px_50px_-42px_var(--ink)]">
                        <p className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                          {String(i + 1).padStart(2, "0")}
                        </p>
                        <h3 className="mt-4 font-display text-xl font-light">{c.label}</h3>
                        <p className="mt-3 text-sm text-muted-foreground">{c.body}</p>
                      </div>
                    </Depth>
                  </Tilt3D>
                </Rise>
              ))}
            </div>
          </div>
        </section>

        <section id="connectors" className="void-surface rule-x relative overflow-hidden py-24">
          <Ambience intensity="soft" />
          <div className="relative mx-auto max-w-5xl px-6">
            <Rise>
              <p className="eyebrow">
                <ScrambleText text="Connectors" />
              </p>
              <BoxReveal>
                <h2 className="mt-5 max-w-2xl text-[clamp(2.2rem,6vw,4rem)] leading-[1.05]">
                Every model. Every tool you already use.
              </h2>
              </BoxReveal>
              <p className="mt-6 max-w-lg text-muted-foreground">
                Authorise once and every connector becomes a tool the agent can call — REST, webhooks
                or a full MCP server, scoped per chat.
              </p>
            </Rise>
          </div>
          <div className="mt-14">
            <ConnectorMarquee />
          </div>
        </section>

        <section id="skills" className="void-surface rule-x py-24">
          <div className="mx-auto max-w-5xl px-6">
            <Rise>
              <p className="eyebrow">
                <ScrambleText text="Skills · Automations · Plugins" />
              </p>
              <BoxReveal>
                <h2 className="mt-5 max-w-2xl text-[clamp(2.2rem,6vw,4rem)] leading-[1.05]">
                Teach it once. It keeps the lesson.
              </h2>
              </BoxReveal>
            </Rise>
            <div className="mt-14">
              <SkillCarousel />
            </div>
          </div>
        </section>

        <section id="download" className="void-surface rule-x paper-grid grain-veil py-28">
          <div className="mx-auto max-w-5xl px-6">
            <Rise>
              <p className="eyebrow">
                <ScrambleText text="Get Kernel" />
              </p>
              <BoxReveal>
                <h2 className="mt-5 max-w-2xl text-[clamp(2.2rem,6vw,4rem)] leading-[1.05]">
                Run it in a tab, or run it on your desk.
              </h2>
              </BoxReveal>
              <p className="mt-6 max-w-lg text-muted-foreground">
                The desktop build adds local file access, shell tools, and offline models. The web
                build needs nothing at all — the models are included.
              </p>
            </Rise>
            <div className="mt-12 grid items-center gap-10 lg:grid-cols-[1fr_auto]">
              <DownloadGrid />
              <KernelCube />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
