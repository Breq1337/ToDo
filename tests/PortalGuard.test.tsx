// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { replace, retry, logout } = vi.hoisted(() => ({
  replace: vi.fn(),
  retry: vi.fn(),
  logout: vi.fn(async () => {}),
}));
let authState: Record<string, unknown>;

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace }),
  usePathname: () => "/portal",
}));
vi.mock("@/hooks/useAuthRole", () => ({ useAuthRole: () => authState }));
vi.mock("@/lib/authClient", () => ({ logout }));
vi.mock("@/components/providers/LocaleProvider", () => ({ useLocale: () => ({ locale: "pt-BR" }) }));
vi.mock("@/components/portal/PortalShell", () => ({
  PortalShell: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
vi.mock("@/components/portal/PortalAuthSkeleton", () => ({ PortalAuthSkeleton: () => <div>skeleton</div> }));
vi.mock("@/components/portal/PortalFirstLoginsTutorial", () => ({ PortalFirstLoginsTutorial: () => null }));

import { PortalGuard } from "@/components/portal/PortalGuard";

const baseState = {
  user: { email: "ana@example.com", displayName: "Ana" },
  role: "EMPLOYEE",
  hubId: null,
  loading: false,
  error: null,
  refreshRole: vi.fn(),
  retry,
};

beforeEach(() => {
  vi.clearAllMocks();
  authState = { ...baseState };
});

afterEach(cleanup);

describe("PortalGuard", () => {
  it("test_profile_failure_shows_recoverable_error", () => {
    authState = { ...baseState, error: "profile_unavailable" };

    render(<PortalGuard>conteúdo</PortalGuard>);

    expect(screen.getByRole("alert")).toBeTruthy();
    expect(screen.queryByText("conteúdo")).toBeNull();
    expect(screen.queryByText("skeleton")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Tentar novamente" }));
    expect(retry).toHaveBeenCalledOnce();

    fireEvent.click(screen.getByRole("button", { name: "Sair" }));
    expect(logout).toHaveBeenCalledOnce();
  });

  it("renders the portal for a loaded session", () => {
    render(<PortalGuard>conteúdo</PortalGuard>);

    expect(screen.getByText("conteúdo")).toBeTruthy();
  });

  it("sends a visitor without a session to the login page", () => {
    authState = { ...baseState, user: null };

    render(<PortalGuard>conteúdo</PortalGuard>);

    expect(replace).toHaveBeenCalledWith("/portal/login");
  });
});
