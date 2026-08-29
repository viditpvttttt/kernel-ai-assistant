const rows = [
  ["OpenAI", "Anthropic", "Gemini", "Mistral", "Llama", "Groq", "xAI", "DeepSeek"],
  ["Slack", "Notion", "Linear", "GitHub", "Gmail", "Drive", "Postgres", "Stripe", "Figma", "Jira"],
];

export function ConnectorMarquee() {
  return (
    <div className="space-y-3 overflow-hidden">
      {rows.map((row, i) => (
        <div key={i} className="relative flex overflow-hidden">
          <div
            className="marquee-track flex w-max gap-3"
            style={{ animationDirection: i % 2 ? "reverse" : "normal" }}
          >
            {[...row, ...row, ...row, ...row].map((item, j) => (
              <span
                key={`${item}-${j}`}
                className="rounded-full border border-border bg-card px-5 py-2.5 font-mono text-xs tracking-widest whitespace-nowrap uppercase"
              >
                {item}
              </span>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
        </div>
      ))}
    </div>
  );
}
