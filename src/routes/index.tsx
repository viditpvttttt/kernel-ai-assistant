import { createFileRoute } from "@tanstack/react-router";

import { Ambience } from "@/components/kernel/ambience";
import { DownloadGrid } from "@/components/kernel/download";
import { SiteFooter } from "@/components/kernel/footer";
import { Hero } from "@/components/kernel/hero";
import { ConnectorMarquee } from "@/components/kernel/marquee";
import { Rise, ScrollRevealText } from "@/components/kernel/reveal";
import { SiteNav } from "@/components/kernel/site-nav";
import { SkillCarousel } from "@/components/kernel/skill-carousel";
import { StickyStack } from "@/components/kernel/sticky-stack";

const title = "Kernel — the agentic multimodal chat you run on your own API keys";
const description =
  "Kernel is a minimal, agentic AI workspace: multimodal chat, a sandboxed tool harness, connectors, automations, skills and plugins. Use it in the browser or download it.";

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

function Index() {
  return (
    <>
      <SiteNav />
      <main>
        <Hero />

        <section className="mx-auto max-w-3xl px-6 py-32">
          <ScrollRevealText
            className="text-[clamp(1.6rem,4vw,2.6rem)] leading-[1.25] font-light tracking-tight"
            text="Most chat apps stop at the answer. Kernel keeps going — planning, calling tools, checking its own work, and returning something you can actually ship."
          />
        </section>

        <section id="harness" className="rule-x">
          <div className="mx-auto max-w-5xl px-6 pt-24">
            <Rise>
              <p className="eyebrow">The harness</p>
              <h2 className="mt-5 max-w-2xl text-[clamp(2.2rem,6vw,4rem)] leading-[1.05]">
                A loop, not a reply box.
              </h2>
            </Rise>
          </div>
          <StickyStack />
        </section>

        <section id="connectors" className="rule-x relative overflow-hidden py-24">
          <Ambience intensity="soft" />
          <div className="relative mx-auto max-w-5xl px-6">
            <Rise>
              <p className="eyebrow">Connectors</p>
              <h2 className="mt-5 max-w-2xl text-[clamp(2.2rem,6vw,4rem)] leading-[1.05]">
                Every model. Every tool you already use.
              </h2>
              <p className="mt-6 max-w-lg text-muted-foreground">
                Paste a key or authorise once. Kernel routes each request to whichever provider is
                cheapest for the job, and every connector becomes a tool the agent can call.
              </p>
            </Rise>
          </div>
          <div className="mt-14">
            <ConnectorMarquee />
          </div>
        </section>

        <section id="skills" className="rule-x py-24">
          <div className="mx-auto max-w-5xl px-6">
            <Rise>
              <p className="eyebrow">Skills · Automations · Plugins</p>
              <h2 className="mt-5 max-w-2xl text-[clamp(2.2rem,6vw,4rem)] leading-[1.05]">
                Teach it once. It keeps the lesson.
              </h2>
            </Rise>
            <div className="mt-14">
              <SkillCarousel />
            </div>
          </div>
        </section>

        <section id="download" className="rule-x paper-grid py-28">
          <div className="mx-auto max-w-5xl px-6">
            <Rise>
              <p className="eyebrow">Get Kernel</p>
              <h2 className="mt-5 max-w-2xl text-[clamp(2.2rem,6vw,4rem)] leading-[1.05]">
                Run it in a tab, or run it on your desk.
              </h2>
              <p className="mt-6 max-w-lg text-muted-foreground">
                The desktop build adds local file access, shell tools, and offline models. The web
                build needs nothing but a key.
              </p>
            </Rise>
            <div className="mt-12">
              <DownloadGrid />
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
