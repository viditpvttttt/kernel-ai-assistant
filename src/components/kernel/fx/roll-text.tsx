import { cn } from "@/lib/utils";

/**
 * Per-letter roll-up hover text. The parent element must carry `group`
 * so the two stacked letter rows swap on hover.
 */
export function RollText({ text, className }: { text: string; className?: string }) {
  const letters = text.split("");

  return (
    <span className={cn("relative inline-block overflow-hidden align-bottom", className)}>
      <span className="flex">
        {letters.map((c, i) => (
          <span
            key={`top-${i}`}
            className="inline-block transition-transform duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full"
            style={{ transitionDelay: `${i * 18}ms` }}
          >
            {c === " " ? "\u00A0" : c}
          </span>
        ))}
      </span>
      <span className="absolute inset-0 flex" aria-hidden>
        {letters.map((c, i) => (
          <span
            key={`bottom-${i}`}
            className="inline-block translate-y-full transition-transform duration-300 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-0"
            style={{ transitionDelay: `${i * 18}ms` }}
          >
            {c === " " ? "\u00A0" : c}
          </span>
        ))}
      </span>
    </span>
  );
}
