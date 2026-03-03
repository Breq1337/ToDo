"use client";

/**
 * Skeleton shown while auth/role is loading. Avoids flicker and "no permission" before role is ready.
 */
export function PortalAuthSkeleton() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="h-6 w-32 animate-pulse rounded bg-muted" />
          <div className="flex items-center gap-2">
            <div className="h-8 w-24 animate-pulse rounded bg-muted" />
            <div className="h-9 w-9 animate-pulse rounded bg-muted" />
            <div className="h-9 w-9 animate-pulse rounded bg-muted" />
          </div>
        </div>
        <nav className="mx-auto max-w-6xl px-4 border-t border-border">
          <div className="flex gap-2 py-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-9 w-20 animate-pulse rounded bg-muted" />
            ))}
          </div>
        </nav>
      </header>
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="h-8 w-48 animate-pulse rounded bg-muted" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
