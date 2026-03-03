"use client";

import { motion } from "framer-motion";

export function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="space-y-4">
        <div className="h-9 w-64 animate-pulse rounded-lg bg-muted" />
        <div className="h-4 max-w-xl animate-pulse rounded bg-muted" />
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 w-36 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-40 animate-pulse rounded-2xl bg-muted" />
        ))}
      </div>
      <div className="flex gap-8 rounded-2xl border border-border bg-surface2/50 p-6">
        <div className="h-24 w-24 animate-pulse rounded-full bg-muted" />
        <div className="flex-1 space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-4 animate-pulse rounded bg-muted" />
          ))}
        </div>
      </div>
      <div className="rounded-2xl border border-border bg-surface2/50 p-6">
        <div className="h-5 w-48 animate-pulse rounded bg-muted" />
        <div className="mt-4 space-y-2">
          <div className="h-12 animate-pulse rounded-xl bg-muted" />
          <div className="h-12 animate-pulse rounded-xl bg-muted" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-44 animate-pulse rounded-2xl bg-muted" />
        ))}
      </div>
    </div>
  );
}
