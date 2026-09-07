import { motion } from "motion/react";

const logos = [
  "OpenAI", "Anthropic", "Gemini", "Mistral", "Llama", "Groq", "xAI", "DeepSeek",
  "Slack", "Notion", "Linear", "GitHub", "Gmail", "Drive", "Postgres", "Stripe",
  "Figma", "Jira", "Vercel", "Supabase",
];

/** Dual vertical marquees scrolling in opposite directions — inspired by unlumen's Vertical Marquee. */
export function VerticalMarquee() {
  const half = Math.ceil(logos.length / 2);
  const colA = logos.slice(0, half);
  const colB = logos.slice(half);

  return (
    <div className="flex gap-3 overflow-hidden">
      {[colA, colB].map((col, ci) => (
        <div key={ci} className="relative flex-1 overflow-hidden">
          <motion.div
            className="flex flex-col gap-3"
            animate={{ y: ci === 0 ? ["-50%", "0%"] : ["0%", "-50%"] }}
            transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
          >
            {[...col, ...col].map((logo, j) => (
              <div
                key={`${logo}-${j}`}
                className="flex items-center justify-center rounded-xl border border-border bg-card px-6 py-4"
              >
                <span className="font-mono text-xs tracking-widest whitespace-nowrap uppercase text-muted-foreground">
                  {logo}
                </span>
              </div>
            ))}
          </motion.div>
          <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-background to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background to-transparent" />
        </div>
      ))}
    </div>
  );
}
