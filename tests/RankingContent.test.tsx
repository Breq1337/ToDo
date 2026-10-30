// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/components/providers/LocaleProvider", () => ({ useLocale: () => ({ locale: "pt-BR" }) }));

import { RankingContent } from "@/components/portal/RankingContent";
import { getPortalContent } from "@/content/i18n";

const t = getPortalContent("pt-BR").rankingPage;

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("RankingContent", () => {
  it("shows an error instead of an empty ranking when the request is refused", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => ({ ok: false, json: async () => ({}) })));

    render(<RankingContent />);

    expect((await screen.findByRole("alert")).textContent).toContain(t.loadError);
    expect(screen.queryByText(t.empty)).toBeNull();
  });

  it("leaves the loading state when the network fails", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => { throw new Error("offline"); }));

    render(<RankingContent />);

    expect((await screen.findByRole("alert")).textContent).toContain(t.loadError);
  });

  it("lists the ranking", async () => {
    const ranking = [{ position: 1, uid: "u1", displayName: "Ana", points: 7 }];
    vi.stubGlobal("fetch", vi.fn(async () => ({ ok: true, json: async () => ({ ranking }) })));

    render(<RankingContent />);

    expect(await screen.findByText("Ana")).toBeTruthy();
  });
});
