import type { CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Animated border beam — a traveling light streak that sweeps around the
 * perimeter of its container. Inspired by magicui / 21st.dev BorderBeam.
 *
 * Renders as a wrapper div with `overflow: hidden` + `position: relative`.
 * The beam is a pseudo-element animated along the border via CSS offset-path.
 */
export function BorderBeam({
  children,
  className,
  beamClassName,
  duration = 6,
  delay = 0,
  size = 200,
  color = "oklch(0.72 0.16 260)",
  radius = "rounded-3xl",
}: {
  children: ReactNode;
  className?: string;
  beamClassName?: string;
  duration?: number;
  delay?: number;
  size?: number;
  color?: string;
  radius?: string;
}) {
  const beamStyle: CSSProperties = {
    // CSS offset-path walks the rectangular border perimeter.
    offsetPath: `path("M 0 0 H ${size} V ${size} H 0 Z")`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
    background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
    boxShadow: `0 0 8px 1px ${color}`,
  };

  return (
    <div className={cn("relative isolate overflow-hidden p-[1px]", radius, className)}>
      {/* The traveling beam — absolutely positioned, animated via offset-distance */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute -inset-px z-10 h-[2px] w-[2px] rounded-full",
          beamClassName,
        )}
        style={{
          ...beamStyle,
          animation: `border-beam-travel ${duration}s linear ${delay}s infinite`,
        }}
      />
      <div className={cn("relative z-0 h-full w-full", radius)}>{children}</div>
    </div>
  );
}
