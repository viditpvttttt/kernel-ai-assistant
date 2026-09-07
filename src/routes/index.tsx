import { createFileRoute } from "@tanstack/react-router";

import { Ambience } from "@/components/kernel/ambience";
import { DownloadGrid } from "@/components/kernel/download";
import { SiteFooter } from "@/components/kernel/footer";
import { CursorSpotlight } from "@/components/kernel/fx/spotlight";
import { ModelOrbit } from "@/components/kernel/fx/model-orbit";
import { AnimatedCounter } from "@/components/kernel/fx/animated-counter";
import { HoverExpandCards } from "@/components/kernel/fx/hover-expand";
import { FaqAccordion } from "@/components/kernel/fx/faq-accordion";
import { VerticalMarquee } from "@/components/kernel/fx/vertical-marquee";
import { Depth, Tilt3D } from "@/components/kernel/fx/tilt";
import { Hero } from "@/components/kernel/hero";
import { ConnectorMarquee } from "@/components/kernel/marquee";
import { Rise, ScrollRevealText } from "@/components/kernel/reveal";
import { SiteNav } from "@/components/kernel/site-nav";
import { SkillCarousel } from "@/components/kernel/skill-carousel";


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

const stats = [
  { value: 50, suffix: "", label: "Tool steps per turn" },
  { value: 4, suffix: "", label: "Frontier models included" },
  { value: 0, suffix: "", label: "API keys to start" },
  { value: 100, suffix: "%", label: "Local-first by default" },
];

function Index() {
  return (
    <>
      <CursorSpotlight />
      <SiteNav />
      <main>
        <Hero />

        <section className="mx-auto max-w-3xl px-6 py-20">
          <ScrollRevealText
            className="text-[clamp(1.6rem,4vw,2.6rem)] leading-[1.25] font-light tracking-tight"
            text="Most chat apps stop at the answer. Kernel keeps going — planning, calling tools, checking its own work, and returning something you can actually ship."
          />
        </section>

        {/* Stats bar */}
        <section className="rule-x border-b border-border bg-card/30">
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-px px-6 py-12 sm:grid-cols-4">
            {stats.map((s, i) => (
              <Rise key={s.label} delay={i * 0.08}>
                <div className="text-center">
                  <p className="font-display text-4xl font-light text-foreground">
                    <AnimatedCounter value={s.value} suffix={s.suffix} />
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">{s.label}</p>
                </div>
              </Rise>
            ))}
          </div>
        </section>

        <section id="models" className="rule-x relative overflow-hidden py-20">
          <Ambience intensity="soft" />
          <div className="relative mx-auto max-w-5xl px-6 text-center">
            <Rise>
              <p className="eyebrow">No keys required</p>
              <h2 className="mx-auto mt-5 max-w-2xl text-[clamp(2.2rem,6vw,4rem)] leading-[1.05]">
                Every frontier model, already switched on.
              </h2>
              <p className="mx-auto mt-6 max-w-lg text-muted-foreground">
                Substrate supplies the capacity. Open Kernel and start a chat — swap between Claude,
                GPT-5.5, Gemini and Grok mid-conversation, on us. Add your own key later if you
                prefer to route through your own account.
              </p>
            </Rise>
            <div className="mt-10">
              <ModelOrbit />
            </div>
          </div>
        </section>

        <section id="harness" className="rule-x">
          <div className="mx-auto max-w-5xl px-6 pt-20">
            <Rise>
              <p className="eyebrow">The harness</p>
              <h2 className="mt-5 max-w-2xl text-[clamp(2.2rem,6vw,4rem)] leading-[1.05]">
                A loop, not a reply box.
              </h2>
            </Rise>
          </div>
          <div className="mt-10">
            <HoverExpandCards />
          </div>
        </section>

        <section id="capabilities" className="rule-x py-20">
          <div className="mx-auto max-w-5xl px-6">
            <Rise>
              <p className="eyebrow">Loaded in</p>
              <h2 className="mt-5 max-w-2xl text-[clamp(2.2rem,6vw,4rem)] leading-[1.05]">
                Everything the other assistants ship, in one surface.
              </h2>
            </Rise>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {capabilities.map((c, i) => (
                <Rise key={c.label} delay={i * 0.05}>
                  <Tilt3D max={8} className="h-full">
                    <Depth z={20} className="h-full">
                      <div className="h-full rounded-2xl border border-border bg-card p-5 shadow-[0_20px_40px_-36px_var(--ink)] transition-colors hover:border-foreground/20">
                        <p className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                          {String(i + 1).padStart(2, "0")}
                        </p>
                        <h3 className="mt-3 font-display text-lg font-light">{c.label}</h3>
                        <p className="mt-2 text-sm text-muted-foreground">{c.body}</p>
                      </div>
                    </Depth>
                  </Tilt3D>
                </Rise>
              ))}
            </div>
          </div>
        </section>

        <section id="connectors" className="rule-x relative overflow-hidden py-20">
          <Ambience intensity="soft" />
          <div className="relative mx-auto max-w-5xl px-6">
            <Rise>
              <p className="eyebrow">Connectors</p>
              <h2 className="mt-5 max-w-2xl text-[clamp(2.2rem,6vw,4rem)] leading-[1.05]">
                Every model. Every tool you already use.
              </h2>
              <p className="mt-6 max-w-lg text-muted-foreground">
                Authorise once and every connector becomes a tool the agent can call — REST, webhooks
                or a full MCP server, scoped per chat.
              </p>
            </Rise>
          </div>
          <div className="mt-12">
            <ConnectorMarquee />
          </div>
          <div className="mx-auto mt-12 max-w-5xl px-6">
            <VerticalMarquee />
          </div>
        </section>

        <section id="skills" className="rule-x py-20">
          <div className="mx-auto max-w-5xl px-6">
            <Rise>
              <p className="eyebrow">Skills · Automations · Plugins</p>
              <h2 className="mt-5 max-w-2xl text-[clamp(2.2rem,6vw,4rem)] leading-[1.05]">
                Teach it once. It keeps the lesson.
              </h2>
            </Rise>
            <div className="mt-12">
              <SkillCarousel />
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="rule-x py-20">
          <div className="mx-auto max-w-5xl px-6">
            <Rise>
              <p className="eyebrow">FAQ</p>
              <h2 className="mt-5 max-w-2xl text-[clamp(2.2rem,6vw,4rem)] leading-[1.05]">
                Questions, answered.
              </h2>
            </Rise>
            <div className="mt-10">
              <FaqAccordion />
            </div>
          </div>
        </section>

        <section id="download" className="rule-x paper-grid py-24">
          <div className="mx-auto max-w-5xl px-6">
            <Rise>
              <p className="eyebrow">Get Kernel</p>
              <h2 className="mt-5 max-w-2xl text-[clamp(2.2rem,6vw,4rem)] leading-[1.05]">
                Run it in a tab, or run it on your desk.
              </h2>
              <p className="mt-6 max-w-lg text-muted-foreground">
                The desktop build adds local file access, shell tools, and offline models. The web
                build needs nothing at all — the models are included.
              </p>
            </Rise>
            <div className="mt-10">
              <DownloadGrid />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
