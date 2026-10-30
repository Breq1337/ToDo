import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

type CookieAdapter = {
  setAll: (cookies: { name: string; value: string; options?: Record<string, unknown> }[]) => void;
};

const { createServerClient } = vi.hoisted(() => ({
  createServerClient: vi.fn((_url: string, _key: string, { cookies }: { cookies: CookieAdapter }) => ({
    auth: {
      getUser: async () => {
        cookies.setAll([{ name: "sb-token", value: "refreshed", options: { httpOnly: true, maxAge: 60 } }]);
      },
    },
  })),
}));

vi.mock("@supabase/ssr", () => ({ createServerClient }));

import { updateSession } from "@/lib/supabase/middleware";

beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "anon");
});

describe("updateSession", () => {
  it("test_middleware_forwards_cookie_options", async () => {
    const request = new NextRequest("http://localhost/portal");

    const response = await updateSession(request);

    expect(response.cookies.get("sb-token")).toMatchObject({
      value: "refreshed",
      httpOnly: true,
      maxAge: 60,
    });
    expect(request.cookies.get("sb-token")?.value).toBe("refreshed");
  });
});
