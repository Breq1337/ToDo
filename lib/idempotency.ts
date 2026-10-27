/**
 * In-memory idempotency store for public form endpoints.
 * A retry with the same Idempotency-Key replays the first response instead of
 * processing the submission again. Scope: a single Node process (Hostinger
 * standalone server). Multiple instances would need a shared store.
 */

const TTL_MS = 10 * 60 * 1000;
const MAX_ENTRIES = 500;
const KEY_PATTERN = /^[A-Za-z0-9-]{16,64}$/;

type Entry =
  | { state: "pending"; expiresAt: number }
  | { state: "done"; expiresAt: number; status: number; body: unknown };

const store = new Map<string, Entry>();

function prune(now: number) {
  store.forEach((entry, key) => {
    if (entry.expiresAt <= now) store.delete(key);
  });
  while (store.size >= MAX_ENTRIES) {
    const oldest = store.keys().next().value;
    if (oldest === undefined) break;
    store.delete(oldest);
  }
}

export function readIdempotencyKey(request: Request): string | null {
  const key = request.headers.get("Idempotency-Key");
  return key && KEY_PATTERN.test(key) ? key : null;
}

/** Returns the stored entry for a key, or null after reserving it for this request. */
export function beginIdempotent(key: string): Entry | null {
  const now = Date.now();
  prune(now);
  const existing = store.get(key);
  if (existing && existing.expiresAt > now) return existing;
  store.set(key, { state: "pending", expiresAt: now + TTL_MS });
  return null;
}

export function finishIdempotent(key: string, status: number, body: unknown) {
  store.set(key, { state: "done", expiresAt: Date.now() + TTL_MS, status, body });
}

/** Frees a key whose request failed unexpectedly, so the client can retry. */
export function releaseIdempotent(key: string) {
  store.delete(key);
}
