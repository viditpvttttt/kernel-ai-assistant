import { motion } from "motion/react";

const springSnappy = { type: "spring" as const, stiffness: 500, damping: 30, mass: 0.6 };

const SOCIAL_LINKS = [
  {
    label: "Website",
    href: "https://substrate-devs.vercel.app",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    label: "X",
    href: "https://x.com/Substratedevs",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/substratedevs",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.063 2.063 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/substrate.devs/",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    ),
  },
];

export function ChatFooter() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.6 }}
      className="flex items-center justify-center gap-4 px-4 pb-3 pt-1"
    >
      <span className="text-[10px] font-medium tracking-wide text-muted-foreground/60">
        Substrate
      </span>
      <div className="flex items-center gap-0.5">
        {SOCIAL_LINKS.map((link, i) => (
          <motion.a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Substrate on ${link.label}`}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.55 + i * 0.06, ...springSnappy }}
            whileHover={{ scale: 1.2, y: -2 }}
            whileTap={{ scale: 0.85 }}
            className="flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground/50 transition-colors hover:bg-accent hover:text-foreground"
          >
            {link.icon}
          </motion.a>
        ))}
      </div>
      <span className="text-[10px] text-muted-foreground/40">·</span>
      <a
        href="https://substrate-devs.vercel.app"
        target="_blank"
        rel="noopener noreferrer"
        className="text-[10px] text-muted-foreground/60 transition-colors hover:text-foreground"
      >
        substrate-devs.vercel.app
      </a>
    </motion.footer>
  );
}
