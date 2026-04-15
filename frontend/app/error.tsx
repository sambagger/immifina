"use client";

import { useEffect } from "react";

export default function GlobalError({ error }: { error: Error }) {
  useEffect(() => {
    const msg = error?.message ?? "";
    if (msg.includes("ChunkLoadError") || msg.includes("Loading chunk")) {
      window.location.reload();
    }
  }, [error]);

  // For non-chunk errors, show nothing visible — just reload anyway
  // since in dev this is almost always a stale chunk
  if (
    error?.message?.includes("ChunkLoadError") ||
    error?.message?.includes("Loading chunk")
  ) {
    return null;
  }

  return (
    <html>
      <body className="flex min-h-screen items-center justify-center bg-[#02060f] text-white">
        <div className="text-center">
          <p className="text-sm text-zinc-400">Something went wrong.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-full bg-teal-700 px-6 py-2 text-sm font-semibold text-white"
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}
