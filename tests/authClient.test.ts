import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { signOut } = vi.hoisted(() => ({ signOut: vi.fn() }));

vi.mock("@/lib/supabase/client", () => ({ createClient: () => ({ auth: { signOut } }) }));

import { getClaims, logout, SessionExpiredError } from "@/lib/authClient";

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("logout", () => {
  it("signs out normally", async () => {
    signOut.mockResolvedValue({ error: null });

    await logout();

    expect(signOut).toHaveBeenCalledOnce();
  });

  it("passes the requested scope", async () => {
    signOut.mockResolvedValue({ error: null });

    await logout("local");

    expect(signOut).toHaveBeenCalledWith({ scope: "local" });
  });

  it.each([
    ["reports an error", () => signOut.mockResolvedValue({ error: new Error("503") })],
    ["rejects", () => signOut.mockRejectedValue(new Error("lock timeout"))],
  ])("clears the cookies and reloads at the login when signOut %s", async (_name, arrange) => {
    arrange();
    const assign = vi.fn();
    vi.stubGlobal("window", { location: { assign } });
    const written: string[] = [];
    vi.stubGlobal("document", {
      get cookie() {
        return "sb-ref-auth-token.0=a; sb-ref-auth-token.1=b; outro=c";
      },
      set cookie(value: string) {
        written.push(value);
      },
    });

    await logout();

    expect(written).toEqual([
      "sb-ref-auth-token.0=; Max-Age=0; path=/",
      "sb-ref-auth-token.1=; Max-Age=0; path=/",
    ]);
    expect(assign).toHaveBeenCalledWith("/portal/login");
  });
});

describe("getClaims", () => {
  it("returns claims for an allowed user", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => ({ ok: true, status: 200, json: async () => ({ role: "ADMIN", hubId: null }) })));

    await expect(getClaims()).resolves.toEqual({ role: "ADMIN", hubId: null });
  });

  it("returns null when access is denied", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => ({ ok: false, status: 403 })));

    await expect(getClaims()).resolves.toBeNull();
  });

  it("reports an expired session separately from a denial", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => ({ ok: false, status: 401 })));

    await expect(getClaims()).rejects.toBeInstanceOf(SessionExpiredError);
  });

  it("throws when the server is unavailable", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => ({ ok: false, status: 503 })));

    await expect(getClaims()).rejects.toThrow();
  });
});
