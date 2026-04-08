"use client";

import { useEffect } from "react";

function isChunkError(msg: string) {
  return (
    msg.includes("ChunkLoadError") ||
    msg.includes("Loading chunk") ||
    msg.includes("Failed to fetch dynamically imported module") ||
    msg.includes("Importing a module script failed")
  );
}

/**
 * Silently reloads the page on stale chunk errors (happens when the dev
 * server recompiles while the user has the page open). Intercepts the
 * error before Next.js can show its red overlay.
 */
export function ChunkErrorRecovery() {
  useEffect(() => {
    function handleError(e: ErrorEvent) {
      if (isChunkError(e.message ?? "")) {
        e.preventDefault();
        e.stopImmediatePropagation();
        window.location.reload();
      }
    }

    function handleUnhandledRejection(e: PromiseRejectionEvent) {
      const msg = String(e.reason?.message ?? e.reason ?? "");
      if (isChunkError(msg)) {
        e.preventDefault();
        window.location.reload();
      }
    }

    // useCapture: true so we intercept before Next.js error overlay
    window.addEventListener("error", handleError, true);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener("error", handleError, true);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, []);

  return null;
}
