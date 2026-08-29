import { motion } from "motion/react";

import markAsset from "@/assets/kernel-mark.png";
import { cn } from "@/lib/utils";

export function KernelMark({ className, spin = false }: { className?: string; spin?: boolean }) {
  return (
    <motion.img
      src={markAsset}
      alt=""
      aria-hidden
      width={816}
      height={816}
      className={cn("h-7 w-7 select-none dark:invert", className)}
      animate={spin ? { rotate: 360 } : { rotate: 0 }}
      transition={{ duration: 40, repeat: spin ? Infinity : 0, ease: "linear" }}
    />
  );
}

export function KernelLogo({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <KernelMark spin />
      <span className="font-display text-xl font-light tracking-tight">Kernel</span>
    </span>
  );
}
