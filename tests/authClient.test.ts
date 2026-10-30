import { beforeEach, describe, expect, it, vi } from "vitest";

const { signOut } = vi.hoisted(() => ({ signOut: vi.fn() }));

vi.mock("@/lib/supabase/client", () => ({ createClient: () => ({ auth: { signOut } }) }));

import { logout } from "@/lib/authClient";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("logout", () => {
  it("signs out normally", async () => {
    signOut.mockResolvedValue({ error: null });

    await logout();

    expect(signOut).toHaveBeenCalledOnce();
  });

  it("falls back to a local sign out when the server call fails", async () => {
    signOut.mockResolvedValueOnce({ error: new Error("503") }).mockResolvedValue({ error: null });

    await logout();

    expect(signOut).toHaveBeenLastCalledWith({ scope: "local" });
  });
});
