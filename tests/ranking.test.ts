import { beforeEach, describe, expect, it, vi } from "vitest";
import { createFakeDb } from "./helpers/fakeDb";

const { getAuthUserWithRole } = vi.hoisted(() => ({ getAuthUserWithRole: vi.fn() }));
let db = createFakeDb();

vi.mock("@/lib/supabase/auth-helpers", () => ({ getAuthUserWithRole }));
vi.mock("@/lib/supabase/server", () => ({ createServiceRoleClient: () => db }));

import * as route from "@/app/api/ranking/route";

beforeEach(() => {
  vi.clearAllMocks();
  db = createFakeDb({
    ranking: {
      data: [{ user_id: "u1", display_name: "Ana", email: "ana@example.com", points: 7 }],
      error: null,
    },
  });
});

describe("/api/ranking", () => {
  it("test_ranking_without_session_401", async () => {
    getAuthUserWithRole.mockResolvedValue(null);

    const res = await route.GET();

    expect(res.status).toBe(401);
    expect(db.from).not.toHaveBeenCalled();
  });

  it("test_ranking_response_has_no_email", async () => {
    getAuthUserWithRole.mockResolvedValue({ uid: "u1", role: "EMPLOYEE" });

    const res = await route.GET();
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.ranking).toEqual([{ position: 1, uid: "u1", displayName: "Ana", points: 7 }]);
    expect(db.selects[0].columns).not.toContain("email");
  });

  it("reports a database failure instead of an empty ranking", async () => {
    getAuthUserWithRole.mockResolvedValue({ uid: "u1", role: "EMPLOYEE" });
    db = createFakeDb({ ranking: { data: null, error: new Error("db down") } });
    vi.spyOn(console, "error").mockImplementation(() => {});

    const res = await route.GET();

    expect(res.status).toBe(500);
  });

  it("test_ranking_post_ignores_client_points", () => {
    expect("POST" in route).toBe(false);
  });
});
