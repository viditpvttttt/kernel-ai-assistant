import { createFileRoute } from "@tanstack/react-router";
import { ArrowUp, Code2, FileText, Globe, Search, Sparkles, Terminal, Zap } from "lucide-react";

import { Ambience } from "@/components/kernel/ambience";
import { DownloadGrid } from "@/components/kernel/download";
import { SiteFooter } from "@/components/kernel/footer";
import { AuroraBars, CursorTrail, WaveBackground } from "@/components/kernel/fx/backgrounds";
import { HoverExpandCards } from "@/components/kernel/fx/hover-expand";
import { AnimatedList, NumberFlow } from "@/components/kernel/fx/lists";
import { DockNav, ExpandableTabs } from "@/components/kernel/fx/navigation";
import { WordPreloader } from "@/components/kernel/fx/preloader";
import { CursorSpotlight } from "@/components/kernel/fx/spotlight";
import { GradientText, PerspectiveText, RollingText, ScrollProgressBar } from "@/components/kernel/fx/text-effects";
import { BlobCard, GooeyHover, MouseGlow } from "@/components/kernel/fx/hover-effects";
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
  { label: "Included models", body: "Claude, GPT-5.5, Gemini and Grok run on Substrate's own capacity. Bring a key only if you want to." },
  { label: "Real harness", body: "Plan, act, verify, remember — up to 50 tool steps per turn, every step visible and inspectable." },
  { label: "Multimodal in and out", body: "Images, audio, documents and code go in. Text, charts and generated images come back inline." },
  { label: "Connectors & MCP", body: "Any REST API, webhook or MCP server becomes a tool the agent can call, scoped per chat." },
  { label: "Skills & personas", body: "Teach it once and it keeps the lesson — reusable skills, permissions, and switchable personas." },
  { label: "Runs anywhere", body: "Same workspace in a browser tab or as a desktop build with local files and shell access." },
];

const stats = [
  { value: 50, suffix: "", label: "Tool steps per turn" },
  { value: 4, suffix: "", label: "Frontier models included" },
  { value: 0, suffix: "", label: "API keys to start" },
  { value: 100, suffix: "%", label: "Local-first by default" },
];

const dockItems = [
  { label: "Harness", icon: <Zap className="h-4 w-4" />, href: "#harness" },
  { label: "Models", icon: <Sparkles className="h-4 w-4" />, href: "#models" },
  { label: "Browse", icon: <Globe className="h-4 w-4" />, href: "#browsing" },
  { label: "Connect", icon: <Code2 className="h-4 w-4" />, href: "#connectors" },
  { label: "Skills", icon: <FileText className="h-4 w-4" />, href: "#skills" },
  { label: "Download", icon: <Terminal className="h-4 w-4" />, href: "#download" },
];

const toolTabs = [
  { label: "Search", body: "Kernel searches the web live — DuckDuckGo results, page fetches, and content extraction, all server-side. No CORS workarounds." },
  { label: "Browse", body: "Fetch any URL and get clean, readable text back. The agent reads pages, extracts key information, and cites sources inline." },
  { label: "Calculate", body: "Safe arithmetic for numeric expressions — no guessing, no estimation. The agent knows when to reach for exact math." },
  { label: "Code", body: "A real JavaScript sandbox worker runs code and returns console output. Perfect for data transformation, quick scripts, and verification." },
  { label: "Images", body: "Generate images inline using the active provider's image endpoint. Vision goes in, generated images come back." },
];

const faqItems = [
  { title: "Web browsing", body: "Kernel searches the web and fetches live pages through a server-side proxy, bypassing CORS. The agent reads content and cites sources." },
  { title: "No lock-in", body: "Threads, keys, connectors, skills and files all live in your browser's local storage. Export or wipe everything anytime." },
  { title: "MCP support", body: "Connect any Model Context Protocol server and its tools become first-class Kernel tools, callable by the agent per chat." },
  { title: "Personas", body: "Switch between concise, detailed, research-focused, or automation-focused personas. Each has its own system prompt and tool preferences." },
  { title: "Offline desktop", body: "The desktop build adds local file access, shell tools, and offline models. The web build needs nothing at all." },
];

function Index() {
  return (
    <>
      <WordPreloader />
      <ScrollProgressBar />
      <CursorSpotlight />
      <CursorTrail />
      <SiteNav />
      <main>
        <Hero />

        {/* Scrolling intro */}
        <section className="mx-auto max-w-3xl px-6 py-20">
          <ScrollRevealText
            className="text-[clamp(1.6rem,4vw,2.6rem)] leading-[1.25] font-light tracking-tight"
            text="Most chat apps stop at the answer. Kernel keeps going — planning, calling tools, checking its own work, and returning something you can actually ship."
          />
        </section>

        {/* Stats bar with NumberFlow */}
        <section className="rule-x border-b border-border bg-card/30">
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-px px-6 py-12 sm:grid-cols-4">
            {stats.map((s, i) => (
              <Rise key={s.label} delay={i * 0.08}>
                <div className="text-center">
                  <p className="font-display text-4xl font-light text-foreground">
                    <NumberFlow value={s.value} suffix={s.suffix} />
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">{s.label}</p>
                </div>
              </Rise>
            ))}
          </div>
        </section>

        {/* Models section — no more ModelOrbit, replaced with RollingText + AuroraBars */}
        <section id="models" className="rule-x relative overflow-hidden py-20">
          <Ambience intensity="soft" />
          <div className="relative mx-auto max-w-5xl px-6 text-center">
            <Rise>
              <p className="eyebrow">No keys required</p>
              <h2 className="mx-auto mt-5 max-w-2xl text-[clamp(2.2rem,6vw,4rem)] leading-[1.05]">
                Every frontier model, <GradientText>already switched on.</GradientText>
              </h2>
              <p className="mx-auto mt-6 max-w-lg text-muted-foreground">
                Substrate supplies the capacity. Open Kernel and start a chat — swap between{" "}
                <RollingText words={["Claude", "GPT-5.5", "Gemini", "Grok"]} className="font-medium text-foreground" />{" "}
                mid-conversation, on us.
              </p>
            </Rise>
            <div className="mt-10 flex justify-center">
              <AuroraBars className="w-48" />
            </div>
          </div>
        </section>

        {/* Harness — HoverExpandCards */}
        <section id="harness" className="rule-x">
          <div className="mx-auto max-w-5xl px-6 pt-20">
            <Rise>
              <p className="eyebrow">The harness</p>
              <PerspectiveText
                text="A loop, not a reply box."
                className="mt-5 max-w-2xl text-[clamp(2.2rem,6vw,4rem)] leading-[1.05] font-extralight tracking-[-0.02em]"
              />
            </Rise>
          </div>
          <div className="mt-10 px-6">
            <div className="mx-auto max-w-5xl">
              <HoverExpandCards />
            </div>
          </div>
        </section>

        {/* Web browsing — ExpandableTabs + BlobCard */}
        <section id="browsing" className="rule-x relative overflow-hidden py-20">
          <WaveBackground />
          <div className="relative mx-auto max-w-5xl px-6">
            <Rise>
              <p className="eyebrow">Web browsing</p>
              <h2 className="mt-5 max-w-2xl text-[clamp(2.2rem,6vw,4rem)] leading-[1.05]">
                Live information, <GradientText>on demand.</GradientText>
              </h2>
              <p className="mt-6 max-w-lg text-muted-foreground">
                Kernel doesn't just guess. It searches the web, reads pages, and cites what it finds —
                all through a server-side proxy that bypasses CORS.
              </p>
            </Rise>
            <div className="mt-10">
              <ExpandableTabs tabs={toolTabs} />
            </div>
          </div>
        </section>

        {/* Capabilities — GooeyHover cards */}
        <section id="capabilities" className="rule-x py-20">
          <div className="mx-auto max-w-5xl px-6">
            <Rise>
              <p className="eyebrow">Loaded in</p>
              <PerspectiveText
                text="Everything the other assistants ship, in one surface."
                className="mt-5 max-w-2xl text-[clamp(2.2rem,6vw,4rem)] leading-[1.05] font-extralight tracking-[-0.02em]"
              />
            </Rise>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {capabilities.map((c, i) => (
                <Rise key={c.label} delay={i * 0.05}>
                  <GooeyHover title={c.label} body={c.body} tag={String(i + 1).padStart(2, "0")} className="h-full" />
                </Rise>
              ))}
            </div>
          </div>
        </section>

        {/* Connectors — marquee + VerticalMarquee */}
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
        </section>

        {/* Skills carousel */}
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

        {/* Feature list — AnimatedList inside BlobCard */}
        <section className="rule-x py-20">
          <div className="mx-auto max-w-3xl px-6">
            <Rise>
              <p className="eyebrow">Why Kernel</p>
              <PerspectiveText
                text="Built for people who ship."
                className="mt-5 text-[clamp(2.2rem,6vw,4rem)] leading-[1.05] font-extralight tracking-[-0.02em]"
              />
            </Rise>
            <div className="mt-10">
              <BlobCard>
                <AnimatedList items={faqItems} />
              </BlobCard>
            </div>
          </div>
        </section>

        {/* Dock navigation */}
        <section className="rule-x py-20">
          <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 px-6">
            <Rise>
              <p className="eyebrow">Navigate</p>
              <h2 className="mt-5 text-center text-[clamp(1.6rem,4vw,2.4rem)] leading-[1.1]">
                Jump to any section
              </h2>
            </Rise>
            <MouseGlow className="rounded-2xl">
              <DockNav items={dockItems} />
            </MouseGlow>
          </div>
        </section>

        {/* Download */}
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
