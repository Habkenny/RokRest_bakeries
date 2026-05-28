"use client";

import dynamic from "next/dynamic";

/**
 * Leaflet touches `window` at import time. Keep every import behind `ssr: false`
 * inside a Client Component so `/locations` can prerender.
 */
export const SheffieldMapLazy = dynamic(
  () => import("./sheffield-map").then((mod) => ({ default: mod.SheffieldMap })),
  {
    ssr: false,
    loading: () => (
      <div
        className="flex aspect-[16/10] w-full items-center justify-center rounded-xl border border-dashed border-border bg-muted text-sm text-muted-foreground"
        aria-hidden
      >
        Loading map…
      </div>
    ),
  }
);
