import { cn } from "@/lib/utils";
import { OrbitalDots } from "./fx/orbital-dots";

export function KernelMark({ className, spin = false }: { className?: string; spin?: boolean }) {
  return (
    <OrbitalDots
      className={cn("h-7 w-14 text-foreground dark:text-foreground", className)}
      spin={spin}
    />
  );
}

export function KernelLogo({ className, byline = true }: { className?: string; byline?: boolean }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <KernelMark spin />
      <span className="flex flex-col leading-none">
        <span className="font-display text-xl font-light tracking-tight">Kernel</span>
        {byline && (
          <span className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground uppercase">
            by Substrate
          </span>
        )}
      </span>
    </span>
  );
}
