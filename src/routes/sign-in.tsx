import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

import { Ambience } from "@/components/kernel/ambience";
import { KernelLogo } from "@/components/kernel/logo";
import { ScrollProgressBar } from "@/components/kernel/fx/text-effects";
import { Tilt3D } from "@/components/kernel/fx/tilt";
import { Depth } from "@/components/kernel/fx/tilt";

export const Route = createFileRoute("/sign-in")({
  head: () => ({
    meta: [{ title: "Kernel — Sign in" }],
  }),
  component: SignInPage,
});

function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative flex min-h-svh items-center justify-center overflow-hidden bg-background">
      <ScrollProgressBar />
      <Ambience intensity="bold" />
      <div className="film-grain pointer-events-none absolute inset-0 opacity-40" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md px-6"
      >
        <Link to="/" className="mb-10 flex justify-center">
          <KernelLogo />
        </Link>

        <Tilt3D max={6} className="w-full">
          <Depth z={20}>
            <div className="rounded-2xl border border-border bg-card/80 p-8 backdrop-blur-xl shadow-[0_30px_80px_-40px_var(--ink)]">
              <div className="mb-8 text-center">
                <h1 className="font-display text-2xl font-light tracking-tight">
                  Welcome back
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Sign in to continue to Kernel
                </p>
              </div>

              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="mb-2 block font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-foreground/40"
                  />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                      Password
                    </label>
                    <a href="#" className="text-xs text-muted-foreground hover:text-foreground">
                      Forgot?
                    </a>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 pr-11 text-sm outline-none transition-colors focus:border-foreground/40"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-foreground py-3 text-sm text-background transition-transform hover:scale-[1.02]"
                >
                  Sign in
                  <ArrowRight className="h-4 w-4" />
                </motion.button>
              </form>

              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-border" />
                <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                  or
                </span>
                <div className="h-px flex-1 bg-border" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button className="rounded-xl border border-border py-2.5 text-sm transition-colors hover:bg-accent">
                  Google
                </button>
                <button className="rounded-xl border border-border py-2.5 text-sm transition-colors hover:bg-accent">
                  GitHub
                </button>
              </div>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                New here?{" "}
                <Link to="/chat" className="font-medium text-foreground hover:underline">
                  Start free
                </Link>
              </p>
            </div>
          </Depth>
        </Tilt3D>
      </motion.div>
    </div>
  );
}
