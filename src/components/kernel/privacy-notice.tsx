import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { X } from "lucide-react";

const DISMISS_KEY = "kernel.privacyNoticeDismissed";

/**
 * Kernel doesn't set tracking cookies — everything it persists (threads, API
 * keys, connectors) lives in your browser's localStorage instead. This
 * banner discloses that plainly rather than pretending to be a generic
 * cookie-consent widget for cookies the app doesn't actually use.
 */
export function PrivacyNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!window.localStorage.getItem(DISMISS_KEY)) setVisible(true);
    } catch {
      /* localStorage unavailable — skip the banner rather than error */
    }
  }, []);

  function dismiss() {
    setVisible(false);
    try {
      window.localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* best effort */
    }
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-4">
      <div className="flex w-full max-w-2xl items-start gap-3 rounded-2xl border border-border bg-card/95 p-4 shadow-lg backdrop-blur-xl">
        <p className="flex-1 text-xs leading-relaxed text-muted-foreground">
          Kernel doesn't use tracking cookies. Your threads and settings are stored only in this
          browser's local storage. Messages sent through an "included" provider are proxied through
          Kernel's server; bring-your-own-key providers go straight from your browser to the model.
          See{" "}
          <Link to="/privacy" className="underline underline-offset-2 hover:text-foreground">
            how your data is handled
          </Link>
          .
        </p>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss"
          className="shrink-0 rounded-full p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
