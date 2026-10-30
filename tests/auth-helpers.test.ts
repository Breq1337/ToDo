import { beforeEach, describe, expect, it, vi } from "vitest";
import { createFakeDb } from "./helpers/fakeDb";

const getUser = vi.fn();
const getSession = vi.fn();
let db = createFakeDb();

vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => ({ auth: { getUser, getSession } }),
  createServiceRoleClient: () => db,
}));

import { AuthUnavailableError, getAuthUserWithRole, getProfileWithRole } from "@/lib/supabase/auth-helpers";
import { GET as authMe } from "@/app/api/auth/me/route";

const adminUser = { id: "user-1", email: "pessoa@example.com" };
const corporateUser = { id: "user-2", email: "pessoa@todogreen.com.br" };

function sessionFor(user: { id: string; email: string }) {
  getSession.mockResolvedValue({ data: { session: { user } } });
}

beforeEach(() => {
  vi.clearAllMocks();
  db = createFakeDb();
});

describe("getAuthUserWithRole", () => {
  it("test_forged_cookie_returns_401", async () => {
    sessionFor(adminUser);
    getUser.mockResolvedValue({ data: { user: null }, error: Object.assign(new Error("invalid JWT"), { status: 403 }) });

    const res = await authMe();

    expect(res.status).toBe(401);
    expect(db.from).not.toHaveBeenCalled();
  });

  it("test_valid_session_keeps_role", async () => {
    getUser.mockResolvedValue({ data: { user: adminUser }, error: null });
    db = createFakeDb({
      allowlist: { data: { active: true, role_default: "ADMIN", hub_id: null }, error: null },
    });

    await expect(getAuthUserWithRole()).resolves.toMatchObject({ uid: "user-1", role: "ADMIN" });
  });

  it("test_blocked_corporate_account_stays_blocked", async () => {
    getUser.mockResolvedValue({ data: { user: corporateUser }, error: null });
    db = createFakeDb({
      allowlist: { data: { active: false, role_default: "EMPLOYEE", hub_id: null }, error: null },
    });

    await expect(getAuthUserWithRole()).resolves.toBeNull();
    expect(db.upserts).toEqual([]);
  });

  it("test_corporate_account_without_allowlist_enters_as_employee", async () => {
    getUser.mockResolvedValue({ data: { user: corporateUser }, error: null });

    await expect(getAuthUserWithRole()).resolves.toMatchObject({ role: "EMPLOYEE" });
    expect(db.upserts).toHaveLength(1);
  });

  it("fails closed and reports unavailability when the allowlist cannot be read", async () => {
    getUser.mockResolvedValue({ data: { user: corporateUser }, error: null });
    db = createFakeDb({ allowlist: { data: null, error: new Error("db down") } });

    await expect(getProfileWithRole(corporateUser.id, corporateUser.email)).rejects.toBeInstanceOf(AuthUnavailableError);
    expect(db.upserts).toEqual([]);
    expect((await authMe()).status).toBe(503);
  });

  it("keeps denying with null for other handlers during an outage", async () => {
    getUser.mockResolvedValue({ data: { user: corporateUser }, error: null });
    db = createFakeDb({ allowlist: { data: null, error: new Error("db down") } });
    vi.spyOn(console, "error").mockImplementation(() => {});

    await expect(getAuthUserWithRole()).resolves.toBeNull();
  });

  it.each([408, 429, 503])("treats Supabase Auth status %i as unavailable", async (status) => {
    getUser.mockResolvedValue({ data: { user: null }, error: Object.assign(new Error("busy"), { status }) });

    expect((await authMe()).status).toBe(503);
  });

  it("answers 403 for a valid session without an email", async () => {
    getUser.mockResolvedValue({ data: { user: { id: "user-3" } }, error: null });

    expect((await authMe()).status).toBe(403);
  });

  it("answers 403 for a blocked account with a valid session", async () => {
    getUser.mockResolvedValue({ data: { user: corporateUser }, error: null });
    db = createFakeDb({
      allowlist: { data: { active: false, role_default: "EMPLOYEE", hub_id: null }, error: null },
    });

    expect((await authMe()).status).toBe(403);
  });

  it("reports unavailability when Supabase Auth cannot be reached", async () => {
    getUser.mockResolvedValue({ data: { user: null }, error: Object.assign(new Error("fetch failed"), { status: 0 }) });

    expect((await authMe()).status).toBe(503);
  });

  it("treats a missing session as anonymous", async () => {
    getUser.mockResolvedValue({ data: { user: null }, error: Object.assign(new Error("no session"), { status: 400 }) });

    expect((await authMe()).status).toBe(401);
  });

  it("denies an outside account that is not on the allowlist", async () => {
    getUser.mockResolvedValue({ data: { user: adminUser }, error: null });

    await expect(getAuthUserWithRole()).resolves.toBeNull();
  });
});
