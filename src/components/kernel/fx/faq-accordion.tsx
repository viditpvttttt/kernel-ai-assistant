import { motion, AnimatePresence } from "motion/react";
import { Plus } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    q: "Do I need an API key?",
    a: "No. Kernel ships with Claude, GPT-5.5, Gemini and Grok already wired in on Substrate's capacity. You can start chatting immediately. Add your own key later if you prefer routing through your own account.",
  },
  {
    q: "What tools can the agent call?",
    a: "Calculator, web fetch, a real JavaScript sandbox, image generation, and file search — all built in. Plus any REST API, webhook, or MCP server you connect becomes a first-class tool the agent can reach for.",
  },
  {
    q: "Is my data stored on a server?",
    a: "No server. Threads, keys, connectors, skills and files all live in your browser's local storage. If you use an included provider, that single call passes through Substrate's proxy — everything else stays on your machine.",
  },
  {
    q: "Can I run it as a desktop app?",
    a: "Yes. The desktop build adds local file access, shell tools, and offline models. The web build needs nothing at all — the models are included.",
  },
  {
    q: "How many tool steps per turn?",
    a: "Up to 50 tool steps per turn, each visible and inspectable in the step trace. The agent plans, calls tools, checks its own work, and loops back on failures.",
  },
];

/** Animated FAQ accordion inspired by unlumen's Motion FAQs Accordion. */
export function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-2xl space-y-2">
      {faqs.map((faq, i) => (
        <div key={i} className="overflow-hidden rounded-xl border border-border bg-card">
          <button
            type="button"
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
          >
            <span className="text-sm font-medium text-foreground">{faq.q}</span>
            <motion.span
              animate={{ rotate: open === i ? 45 : 0 }}
              transition={{ duration: 0.2 }}
              className="shrink-0 text-muted-foreground"
            >
              <Plus className="h-4 w-4" />
            </motion.span>
          </button>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="px-5 pb-4 text-sm text-muted-foreground">{faq.a}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
