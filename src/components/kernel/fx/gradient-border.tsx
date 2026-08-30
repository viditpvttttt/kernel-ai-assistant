import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Animated conic border ring. The child sits on the card surface inside the ring. */
export function GradientBorder({
  children,
  className,
  active = true,
  radius = "rounded-2xl",
}: {
  children: ReactNode;
  className?: string;
  active?: boolean;
  radius?: string;
}) {
  return (
    <div className={cn("relative isolate p-[1px]", radius, className)}>
      {active && (
        <span
          aria-hidden
          className={cn(
            "conic-spin absolute inset-0 -z-10 opacity-70",
            radius,
          )}
        />
      )}
      <div className={cn("relative h-full w-full bg-card", radius)}>{children}</div>
    </div>
  );
}
