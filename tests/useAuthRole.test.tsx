// @vitest-environment jsdom
import { act, cleanup, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

type Listener = (event: string, session: unknown) => unknown;

let listener: Listener;
let releaseLock: () => void;
let lock: Promise<void>;

const session = { access_token: "token", user: { id: "u1", email: "ana@example.com", user_metadata: {} } };

const auth = {
  // Mirrors supabase-js: getSession waits for the auth lock held while listeners run.
  getSession: vi.fn(async () => {
    await lock;
    return { data: { session } };
  }),
  signOut: vi.fn(async () => ({ error: null })),
  onAuthStateChange: vi.fn((callback: Listener) => {
    listener = callback;
    return { data: { subscription: { unsubscribe: vi.fn() } } };
  }),
};

vi.mock("@/lib/supabase/client", () => ({ createClient: () => ({ auth }) }));

import { useAuthRole } from "@/hooks/useAuthRole";

async function emitHoldingLock(event: string) {
  const emitted = (async () => {
    await listener(event, session);
    releaseLock();
  })();
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("auth listener held the lock")), 200)
  );
  await Promise.race([emitted, timeout]);
}

function mockMe(ok: boolean, status = ok ? 200 : 503) {
  const fetchMock = vi.fn(async () => ({ ok, status, json: async () => ({ role: "ADMIN", hubId: null }) }));
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

beforeEach(() => {
  vi.clearAllMocks();
  lock = new Promise((resolve) => {
    releaseLock = resolve;
  });
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("useAuthRole", () => {
  it("test_auth_state_listener_does_not_await_inside_callback", async () => {
    mockMe(true);
    const { result } = renderHook(() => useAuthRole());

    await act(async () => {
      await emitHoldingLock("SIGNED_IN");
    });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.role).toBe("ADMIN");
    expect(result.current.error).toBeNull();
  });

  it("test_profile_failure_shows_recoverable_error", async () => {
    mockMe(false);
    const { result } = renderHook(() => useAuthRole());

    await act(async () => {
      await emitHoldingLock("SIGNED_IN");
    });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe("unavailable");

    mockMe(true);
    await act(async () => {
      result.current.retry();
    });

    await waitFor(() => expect(result.current.error).toBeNull());
    expect(result.current.role).toBe("ADMIN");
  });

  it("ends loading with an error when the network fails", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => { throw new Error("offline"); }));
    const { result } = renderHook(() => useAuthRole());

    await act(async () => {
      await emitHoldingLock("SIGNED_IN");
    });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBeTruthy();
  });

  it("does not refetch the profile on a token refresh", async () => {
    const fetchMock = mockMe(true);
    const { result } = renderHook(() => useAuthRole());

    await act(async () => {
      await emitHoldingLock("SIGNED_IN");
    });
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await listener("TOKEN_REFRESHED", session);
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("recovers when the same user signs in again after a failed load", async () => {
    mockMe(false);
    const { result } = renderHook(() => useAuthRole());

    await act(async () => {
      await emitHoldingLock("SIGNED_IN");
    });
    await waitFor(() => expect(result.current.error).toBeTruthy());

    mockMe(true);
    await act(async () => {
      await listener("SIGNED_IN", session);
    });

    await waitFor(() => expect(result.current.error).toBeNull());
    expect(result.current.role).toBe("ADMIN");
  });

  it("keeps the portal open when a background refresh fails", async () => {
    mockMe(true);
    const { result } = renderHook(() => useAuthRole());

    await act(async () => {
      await emitHoldingLock("SIGNED_IN");
    });
    await waitFor(() => expect(result.current.role).toBe("ADMIN"));

    mockMe(false);
    await act(async () => {
      await result.current.refreshRole();
    });
    await act(async () => {
      await listener("SIGNED_IN", session);
    });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBeNull();
    expect(result.current.role).toBe("ADMIN");
  });

  it("ignores a refresh that fails after sign out", async () => {
    mockMe(true);
    const { result } = renderHook(() => useAuthRole());

    await act(async () => {
      await emitHoldingLock("SIGNED_IN");
    });
    await waitFor(() => expect(result.current.user).not.toBeNull());

    let finishRefresh: (value: unknown) => void = () => {};
    vi.stubGlobal("fetch", vi.fn(() => new Promise((resolve) => { finishRefresh = resolve; })));
    let pending: Promise<void> = Promise.resolve();
    await act(async () => {
      pending = result.current.refreshRole();
    });
    await act(async () => {
      await listener("SIGNED_OUT", null);
    });
    await act(async () => {
      finishRefresh({ ok: false });
      await pending;
    });

    expect(result.current.error).toBeNull();
  });

  it("reports a denied account", async () => {
    mockMe(false, 403);
    const { result } = renderHook(() => useAuthRole());

    await act(async () => {
      await emitHoldingLock("SIGNED_IN");
    });

    await waitFor(() => expect(result.current.error).toBe("denied"));
    expect(result.current.loading).toBe(false);
  });

  it("closes the portal when access is revoked after loading", async () => {
    mockMe(true);
    const { result } = renderHook(() => useAuthRole());

    await act(async () => {
      await emitHoldingLock("SIGNED_IN");
    });
    await waitFor(() => expect(result.current.role).toBe("ADMIN"));

    mockMe(false, 403);
    await act(async () => {
      await result.current.refreshRole();
    });

    expect(result.current.error).toBe("denied");
    expect(result.current.role).toBe("EMPLOYEE");
  });

  it("signs out instead of showing a denial when the session expired", async () => {
    mockMe(false, 401);
    const { result } = renderHook(() => useAuthRole());

    await act(async () => {
      await emitHoldingLock("SIGNED_IN");
    });

    await waitFor(() => expect(auth.signOut).toHaveBeenCalledWith({ scope: "local" }));
    await waitFor(() => expect(result.current.error).toBe("expired"));
  });

  it("does not apply the previous user's response to the next user", async () => {
    mockMe(true);
    const { result } = renderHook(() => useAuthRole());

    await act(async () => {
      await emitHoldingLock("SIGNED_IN");
    });
    await waitFor(() => expect(result.current.role).toBe("ADMIN"));

    let finishOlder: (value: unknown) => void = () => {};
    vi.stubGlobal("fetch", vi.fn(() => new Promise((resolve) => { finishOlder = resolve; })));
    let older: Promise<void> = Promise.resolve();
    await act(async () => {
      older = result.current.refreshRole();
    });

    mockMe(false);
    const nextSession = { ...session, user: { ...session.user, id: "u2" } };
    await act(async () => {
      await listener("SIGNED_IN", nextSession);
      finishOlder({ ok: true, status: 200, json: async () => ({ role: "ADMIN", hubId: null }) });
      await older;
    });

    await waitFor(() => expect(result.current.error).toBe("unavailable"));
  });

  it("ignores an older response that arrives after a newer one", async () => {
    mockMe(true);
    const { result } = renderHook(() => useAuthRole());

    await act(async () => {
      await emitHoldingLock("SIGNED_IN");
    });
    await waitFor(() => expect(result.current.role).toBe("ADMIN"));

    let finishOlder: (value: unknown) => void = () => {};
    vi.stubGlobal("fetch", vi.fn(() => new Promise((resolve) => { finishOlder = resolve; })));
    let older: Promise<void> = Promise.resolve();
    await act(async () => {
      older = result.current.refreshRole();
    });

    mockMe(true);
    await act(async () => {
      await result.current.refreshRole();
    });
    await act(async () => {
      finishOlder({ ok: false, status: 403 });
      await older;
    });

    expect(result.current.error).toBeNull();
    expect(result.current.role).toBe("ADMIN");
  });

  it("ignores a stale denial that arrives after another user signed in", async () => {
    mockMe(true);
    const { result } = renderHook(() => useAuthRole());

    await act(async () => {
      await emitHoldingLock("SIGNED_IN");
    });
    await waitFor(() => expect(result.current.role).toBe("ADMIN"));

    let finishRefresh: (value: unknown) => void = () => {};
    vi.stubGlobal("fetch", vi.fn(() => new Promise((resolve) => { finishRefresh = resolve; })));
    let pending: Promise<void> = Promise.resolve();
    await act(async () => {
      pending = result.current.refreshRole();
    });

    mockMe(true);
    const nextSession = { ...session, user: { ...session.user, id: "u2" } };
    await act(async () => {
      await listener("SIGNED_OUT", null);
      await listener("SIGNED_IN", nextSession);
    });
    await waitFor(() => expect(result.current.role).toBe("ADMIN"));

    await act(async () => {
      finishRefresh({ ok: false, status: 403 });
      await pending;
    });

    expect(result.current.error).toBeNull();
  });

  it("clears the user on sign out", async () => {
    mockMe(true);
    const { result } = renderHook(() => useAuthRole());

    await act(async () => {
      await emitHoldingLock("SIGNED_IN");
    });
    await waitFor(() => expect(result.current.user).not.toBeNull());

    await act(async () => {
      await listener("SIGNED_OUT", null);
    });

    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(false);
  });
});
