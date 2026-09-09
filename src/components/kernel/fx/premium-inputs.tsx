import { motion } from "motion/react";
import { forwardRef, useState, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { appleSpring, appleSpringSnappy } from "./springs";

/* ── 19. FloatingInput ───────────────────────────────────── */
/** Input with a floating label that animates on focus/fill. */
export const FloatingInput = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement> & { label: string }
>(({ label, className, value, defaultValue, ...props }, ref) => {
  const hasValue = Boolean(value ?? defaultValue);
  return (
    <div className="relative">
      <input
        ref={ref}
        value={value}
        defaultValue={defaultValue}
        placeholder=" "
        className={cn(
          "peer h-12 w-full rounded-xl border border-border bg-card px-4 pt-3 text-[15px] text-foreground transition-colors focus:border-foreground/30 focus:outline-none",
          className,
        )}
        {...props}
      />
      <motion.label
        animate={{
          y: hasValue || undefined ? -10 : 0,
          scale: hasValue || undefined ? 0.8 : 1,
          color: hasValue || undefined ? "var(--muted-foreground)" : "var(--muted-foreground)",
        }}
        transition={appleSpringSnappy}
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[15px] text-muted-foreground origin-left peer-focus:-translate-y-[10px] peer-focus:scale-80 peer-focus:text-muted-foreground"
      >
        {label}
      </motion.label>
    </div>
  );
});
FloatingInput.displayName = "FloatingInput";

/* ── 20. GlowInput ───────────────────────────────────────── */
/** Input with a glow ring that appears on focus. */
export const GlowInput = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "h-11 w-full rounded-xl border border-border bg-card px-4 text-[15px] text-foreground transition-all duration-300 focus:border-foreground/20 focus:shadow-[0_0_0_4px_oklch(0.78_0.12_295/0.12)] focus:outline-none",
      className,
    )}
    {...props}
  />
));
GlowInput.displayName = "GlowInput";

/* ── 21. AnimatedSearch ───────────────────────────────────── */
/** Search input with animated expand and search icon. */
export function AnimatedSearch({
  className,
  placeholder = "Search…",
  value,
  onChange,
}: {
  className?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <motion.div
      animate={{ width: focused ? 280 : 200 }}
      transition={appleSpring}
      className={cn(
        "relative flex items-center rounded-full border border-border bg-card/80 backdrop-blur-sm",
        className,
      )}
    >
      <svg className="ml-3 h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
      </svg>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        className="ml-2 h-9 w-full bg-transparent pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
      />
    </motion.div>
  );
}

/* ── 22. GlowTextarea ────────────────────────────────────── */
/** Textarea with a glow on focus. */
export const GlowTextarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "w-full resize-none rounded-xl border border-border bg-card px-4 py-3 text-[15px] text-foreground transition-all duration-300 focus:border-foreground/20 focus:shadow-[0_0_0_4px_oklch(0.78_0.12_295/0.12)] focus:outline-none",
      className,
    )}
    {...props}
  />
));
GlowTextarea.displayName = "GlowTextarea";

/* ── 23. TagInput ─────────────────────────────────────────── */
/** Input that collects tags/chips. */
export function TagInput({
  tags,
  onAdd,
  onRemove,
  placeholder = "Add tag…",
  className,
}: {
  tags: string[];
  onAdd: (tag: string) => void;
  onRemove: (tag: string) => void;
  placeholder?: string;
  className?: string;
}) {
  const [input, setInput] = useState("");
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && input.trim()) {
      e.preventDefault();
      onAdd(input.trim());
      setInput("");
    }
  }
  return (
    <div className={cn("flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card p-2", className)}>
      {tags.map((tag) => (
        <motion.span
          key={tag}
          layout
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={appleSpringSnappy}
          className="flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs text-foreground"
        >
          {tag}
          <button onClick={() => onRemove(tag)} className="text-muted-foreground hover:text-foreground" aria-label={`Remove ${tag}`}>
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </motion.span>
      ))}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="flex-1 bg-transparent py-1 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
      />
    </div>
  );
}

/* ── 24. OTPInput ─────────────────────────────────────────── */
/** One-time password input with individual character boxes. */
export function OTPInput({
  length = 6,
  onComplete,
  className,
}: {
  length?: number;
  onComplete?: (code: string) => void;
  className?: string;
}) {
  const [values, setValues] = useState<string[]>(Array(length).fill(""));

  function handleChange(i: number, v: string) {
    if (!/^\d?$/.test(v)) return;
    const next = [...values];
    next[i] = v;
    setValues(next);
    if (v && i < length - 1) {
      const el = document.getElementById(`otp-${i + 1}`);
      el?.focus();
    }
    if (next.every((c) => c) && onComplete) onComplete(next.join(""));
  }

  return (
    <div className={cn("flex gap-2", className)}>
      {values.map((v, i) => (
        <motion.input
          key={i}
          id={`otp-${i}`}
          value={v}
          onChange={(e) => handleChange(i, e.target.value)}
          maxLength={1}
          whileFocus={{ scale: 1.05 }}
          transition={appleSpringSnappy}
          className="h-12 w-10 rounded-xl border border-border bg-card text-center text-lg font-medium text-foreground transition-colors focus:border-foreground/30 focus:outline-none"
        />
      ))}
    </div>
  );
}
