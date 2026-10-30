import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";

const { createServiceRoleClient, getAuthUserWithRole } = vi.hoisted(() => ({
  createServiceRoleClient: vi.fn(() => null),
  getAuthUserWithRole: vi.fn(async () => null),
}));

vi.mock("@/lib/supabase/server", () => ({ createServiceRoleClient }));
vi.mock("@/lib/supabase/auth-helpers", () => ({ getAuthUserWithRole }));

import { POST as seed } from "@/app/api/admin/seed/route";
import { POST as seedDemoAccounts } from "@/app/api/admin/seed-demo-accounts/route";
import { POST as seedTestUsers } from "@/app/api/admin/seed-test-users/route";
import { POST as bootstrapDemoAllowlist } from "@/app/api/admin/bootstrap-demo-allowlist/route";
import { POST as bootstrap } from "@/app/api/admin/bootstrap/route";

const request = () =>
  new Request("http://localhost/api/admin", { method: "POST", body: JSON.stringify({ secret: "x" }) });

const gatedRoutes = { seed, seedDemoAccounts, seedTestUsers, bootstrapDemoAllowlist };

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubEnv("SEED_SECRET", "x");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("demo tools", () => {
  it.each(Object.entries(gatedRoutes))("test_seed_routes_disabled_without_flag: %s", async (_name, post) => {
    vi.stubEnv("ENABLE_DEMO_TOOLS", "");

    const res = await post(request());

    expect(res.status).toBe(404);
    expect(createServiceRoleClient).not.toHaveBeenCalled();
    expect(getAuthUserWithRole).not.toHaveBeenCalled();
  });

  it.each(Object.entries(gatedRoutes))("runs normally with the flag: %s", async (_name, post) => {
    vi.stubEnv("ENABLE_DEMO_TOOLS", "true");

    const res = await post(request());

    expect(res.status).not.toBe(404);
  });

  it("keeps the first-admin bootstrap available without the flag", async () => {
    vi.stubEnv("ENABLE_DEMO_TOOLS", "");

    const res = await bootstrap(request());

    expect(res.status).not.toBe(404);
  });

  it("test_login_has_no_demo_credentials", () => {
    const files = [
      "app/portal/login/LoginSection.tsx",
      "components/auth/LoginCard.tsx",
      "components/portal/AdminContent.tsx",
      "lib/authClient.ts",
      "content/portalI18n.pt.ts",
      "content/portalI18n.en.ts",
    ];

    for (const file of files) {
      const source = readFileSync(path.resolve(__dirname, "..", file), "utf8");
      expect(source, file).not.toMatch(/todogreen\.demo|123456/);
    }
  });
});
