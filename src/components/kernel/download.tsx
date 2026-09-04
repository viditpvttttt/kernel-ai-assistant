import { useNavigate } from "@tanstack/react-router";
import { Apple, Check, Globe, Monitor, Terminal } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

type Platform = "mac" | "windows" | "linux" | "web";

const platforms: { id: Platform; name: string; meta: string; icon: typeof Apple }[] = [
  { id: "mac", name: "macOS", meta: "Install app · Universal", icon: Apple },
  { id: "windows", name: "Windows", meta: "Install app · x64", icon: Monitor },
  { id: "linux", name: "Linux", meta: "Install app · any distro", icon: Terminal },
  { id: "web", name: "Web", meta: "No install", icon: Globe },
];

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

/** Download / install grid: installs Kernel as a desktop app via the browser, or opens the web build. */
export function DownloadGrid() {
  const navigate = useNavigate();
  const [installEvent, setInstallEvent] = useState<InstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [hint, setHint] = useState<string | null>(null);

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setInstallEvent(e as InstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setInstallEvent(null);
      setHint("Kernel is installed — launch it from your apps.");
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    if (window.matchMedia("(display-mode: standalone)").matches) setInstalled(true);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const manualHint = (id: Platform) => {
    if (id === "mac")
      return "In Safari choose File → Add to Dock, or in Chrome use the install icon in the address bar.";
    if (id === "windows")
      return "In Chrome or Edge, click the install icon in the address bar (or ⋯ → Install Kernel).";
    return "In Chrome, open the menu → Cast, save and share → Install page as app.";
  };

  const handle = async (id: Platform) => {
    if (id === "web") {
      navigate({ to: "/chat" });
      return;
    }
    if (installEvent) {
      await installEvent.prompt();
      const choice = await installEvent.userChoice;
      setInstallEvent(null);
      setHint(
        choice.outcome === "accepted"
          ? "Installing Kernel — it'll appear with your other apps."
          : manualHint(id),
      );
      return;
    }
    setHint(installed ? "Kernel is already installed on this device." : manualHint(id));
  };

  return (
    <div>
      <div className="grid gap-3 sm:grid-cols-2">
        {platforms.map((p) => (
          <Magnetic key={p.name}>
            <button
              type="button"
              onClick={() => handle(p.id)}
              className="flex w-full items-center justify-between rounded-2xl border border-border bg-card px-6 py-5 text-left transition-colors hover:bg-accent"
            >
              <span className="flex items-center gap-4">
                <p.icon className="h-5 w-5" />
                <span>
                  <span className="block text-lg">{p.name}</span>
                  <span className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
                    {p.id === "web" ? p.meta : installed ? "Installed" : p.meta}
                  </span>
                </span>
              </span>
              <span className="font-mono text-xs text-muted-foreground">
                {p.id === "web" ? "→" : installed ? <Check className="h-4 w-4" /> : "↓"}
              </span>
            </button>
          </Magnetic>
        ))}
      </div>
      {hint && (
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-5 text-sm text-muted-foreground"
          role="status"
        >
          {hint}
        </motion.p>
      )}
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
