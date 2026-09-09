import { KernelLogo } from "./logo";
import { TextRoll } from "./fx/text-roll";

const columns = [
  { title: "Product", items: ["Harness", "Connectors", "Skills", "Automations", "Plugins"] },
  { title: "Company", items: ["Changelog", "Security", "Pricing", "Contact"] },
];

export function SiteFooter() {
  return (
    <footer className="rule-x relative mt-32 overflow-hidden">
      {/* Brand ambience gradient — blue → lavender → pink → coral */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          background:
            "linear-gradient(90deg, oklch(0.80 0.10 245), oklch(0.78 0.12 295), oklch(0.82 0.10 10), oklch(0.75 0.14 35))",
        }}
      />
      <div className="film-grain absolute inset-0 opacity-30" />
      <div className="relative mx-auto max-w-5xl px-6 py-20">
        <div className="flex flex-col gap-16 sm:flex-row sm:justify-between">
          <div className="max-w-xs">
            <KernelLogo />
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              Kernel runs on the API keys you already own. Nothing leaves your machine unless you
              point it somewhere.
            </p>
          </div>
          <div className="flex gap-16">
            {columns.map((col) => (
              <div key={col.title}>
                <p className="eyebrow">{col.title}</p>
                <ul className="mt-5 space-y-3 text-sm">
                  {col.items.map((item) => (
                    <li key={item}>
                      <a
                        href="#download"
                        className="inline-block text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <TextRoll>{item}</TextRoll>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-20 flex items-center justify-between">
          <p className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
            Kernel · bring your own keys
          </p>
          <p className="font-mono text-[11px] tracking-widest text-muted-foreground/60 uppercase">
            © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}
