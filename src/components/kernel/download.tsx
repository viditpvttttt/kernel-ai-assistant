import { Apple, Globe, Monitor, Terminal } from "lucide-react";
import { motion } from "motion/react";
import { useRef, type ReactNode } from "react";

const platforms = [
  { name: "macOS", meta: "Universal · 48 MB", icon: Apple },
  { name: "Windows", meta: "x64 · 52 MB", icon: Monitor },
  { name: "Linux", meta: "AppImage · deb", icon: Terminal },
  { name: "Web", meta: "No install", icon: Globe },
];

export function DownloadGrid() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {platforms.map((p) => (
        <Magnetic key={p.name}>
          <a
            href="#download"
            className="flex items-center justify-between rounded-2xl border border-border bg-card px-6 py-5 transition-colors hover:bg-accent"
          >
            <span className="flex items-center gap-4">
              <p.icon className="h-5 w-5" />
              <span>
                <span className="block text-lg">{p.name}</span>
                <span className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
                  {p.meta}
                </span>
              </span>
            </span>
            <span className="font-mono text-xs text-muted-foreground">↓</span>
          </a>
        </Magnetic>
      ))}
    </div>
  );
}

function Magnetic({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={ref}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.transform = `translate(${(e.clientX - (r.left + r.width / 2)) * 0.05}px, ${
          (e.clientY - (r.top + r.height / 2)) * 0.12
        }px)`;
      }}
      onMouseLeave={() => {
        if (ref.current) ref.current.style.transform = "translate(0px, 0px)";
      }}
      className="transition-transform duration-300 ease-out"
    >
      {children}
    </motion.div>
  );
}
