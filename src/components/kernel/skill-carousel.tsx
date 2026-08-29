import { motion } from "motion/react";
import { useState } from "react";

const skills = [
  {
    name: "Research",
    body: "Browses, reads PDFs, and returns cited briefs instead of vibes.",
    tag: "skill",
  },
  { name: "Inbox triage", body: "Sorts, drafts, and escalates on a schedule you set.", tag: "automation" },
  { name: "Data room", body: "Query your Postgres and warehouse in plain language.", tag: "connector" },
  { name: "Screen reader", body: "Point it at a screenshot or video and it acts on what it sees.", tag: "multimodal" },
  { name: "Voice desk", body: "Talk to Kernel, it talks back, it keeps working after you hang up.", tag: "multimodal" },
  { name: "Plugin SDK", body: "Fifty lines of TypeScript becomes a first-class tool.", tag: "plugin" },
];

export function SkillCarousel() {
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap gap-2">
        {skills.map((s, i) => (
          <button
            key={s.name}
            type="button"
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onClick={() => setActive(i)}
            className={`rounded-full border px-4 py-2 font-mono text-[11px] tracking-widest uppercase transition-colors ${
              active === i
                ? "border-transparent bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      <div className="relative h-[260px]">
        {skills.map((s, i) => {
          const offset = i - active;
          const visible = Math.abs(offset) <= 2;
          return (
            <motion.div
              key={s.name}
              animate={{
                x: offset * 40,
                y: Math.abs(offset) * 14,
                rotate: offset * 2.5,
                scale: 1 - Math.abs(offset) * 0.06,
                opacity: visible ? 1 - Math.abs(offset) * 0.28 : 0,
                zIndex: 10 - Math.abs(offset),
              }}
              transition={{ type: "spring", stiffness: 180, damping: 22 }}
              className="absolute inset-x-0 mx-auto flex h-[230px] max-w-md flex-col justify-between rounded-2xl border border-border bg-card p-7"
            >
              <span className="eyebrow">{s.tag}</span>
              <div>
                <h4 className="text-3xl">{s.name}</h4>
                <p className="mt-3 text-sm text-muted-foreground">{s.body}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
