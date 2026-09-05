import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

const steps = [
  {
    index: "01",
    title: "Plan",
    body: "Kernel decomposes the request into a task graph, picks the cheapest model that can hold the context, and shows you the plan before it spends a token.",
    detail: "task graph · model routing · budget guard",
  },
  {
    index: "02",
    title: "Act",
    body: "The harness runs tools in a sandbox: shell, browser, file system, SQL, HTTP. Every call is logged, replayable, and reversible.",
    detail: "sandboxed tools · replay · rollback",
  },
  {
    index: "03",
    title: "Check",
    body: "A second pass verifies output against your acceptance criteria. Failures loop back into the plan instead of landing in your inbox.",
    detail: "critic pass · retries · citations",
  },
  {
    index: "04",
    title: "Remember",
    body: "Outcomes become durable memory and reusable skills, so the next run starts where the last one finished.",
    detail: "memory · skills · evals",
  },
];

export function StickyStack() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  return (
    <div ref={ref} className="relative" style={{ height: `${steps.length * 90}vh` }}>
      <div className="sticky top-0 flex h-screen items-center justify-center px-6">
        <div className="relative h-[440px] w-full max-w-3xl">
          {steps.map((step, i) => (
            <Card
              key={step.index}
              step={step}
              i={i}
              total={steps.length}
              progress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Card({
  step,
  i,
  total,
  progress,
}: {
  step: (typeof steps)[number];
  i: number;
  total: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const start = i / total;
  const end = (i + 0.85) / total;
  const y = useTransform(progress, [start, end], [i === 0 ? 0 : 560, 0]);
  const opacity = useTransform(progress, [start, start + 0.04], i === 0 ? [1, 1] : [0, 1]);
  // Cards already parked at the top shrink slightly so the deck reads as depth.
  const scale = useTransform(progress, [end, Math.min(end + 1 / total, 1)], [1, 0.955]);
  const rotateX = useTransform(progress, [start, end], [i === 0 ? 0 : 8, 0]);
  const brightness = useTransform(
    progress,
    [end, Math.min(end + 1 / total, 1)],
    ["brightness(1)", "brightness(0.97)"],
  );

  return (
    <motion.article
      style={{ y, opacity, scale, rotateX, filter: brightness, zIndex: i, top: `${i * 16}px`, transformPerspective: 1000 }}
      className="glass-panel absolute inset-x-0 flex h-[400px] origin-top flex-col justify-between overflow-hidden rounded-3xl p-8 shadow-[0_28px_90px_-58px_var(--spectral-b)] sm:p-12"
    >
      <div className="flex items-start justify-between">
        <span className="font-mono text-xs tracking-widest text-muted-foreground">{step.index}</span>
        <span className="eyebrow">{step.detail}</span>
      </div>
      <div>
        <h3 className="text-5xl sm:text-6xl">{step.title}</h3>
        <p className="mt-5 max-w-xl text-muted-foreground">{step.body}</p>
      </div>
    </motion.article>
  );
}
