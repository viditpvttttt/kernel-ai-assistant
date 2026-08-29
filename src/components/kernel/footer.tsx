import { KernelLogo } from "./logo";

const columns = [
  { title: "Product", items: ["Harness", "Connectors", "Skills", "Automations", "Plugins"] },
  { title: "Company", items: ["Changelog", "Security", "Pricing", "Contact"] },
];

export function SiteFooter() {
  return (
    <footer className="rule-x paper-grid mt-32">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="flex flex-col gap-12 sm:flex-row sm:justify-between">
          <div className="max-w-xs">
            <KernelLogo />
            <p className="mt-5 text-sm text-muted-foreground">
              Kernel runs on the API keys you already own. Nothing leaves your machine unless you
              point it somewhere.
            </p>
          </div>
          <div className="flex gap-16">
            {columns.map((col) => (
              <div key={col.title}>
                <p className="eyebrow">{col.title}</p>
                <ul className="mt-4 space-y-2 text-sm">
                  {col.items.map((item) => (
                    <li key={item}>
                      <a
                        href="#download"
                        className="text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-16 font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
          Kernel · bring your own keys
        </p>
      </div>
    </footer>
  );
}
