// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { push, refresh, getClaims, logout, loginWithEmailPassword } = vi.hoisted(() => ({
  push: vi.fn(),
  refresh: vi.fn(),
  getClaims: vi.fn(),
  logout: vi.fn(async () => {}),
  loginWithEmailPassword: vi.fn(async () => ({ user: { id: "u1" } })),
}));

vi.mock("next/navigation", () => ({ useRouter: () => ({ push, refresh }) }));
vi.mock("@/components/providers/LocaleProvider", () => ({ useLocale: () => ({ locale: "pt-BR" }) }));
vi.mock("@/lib/supabase/client", () => ({ isSupabaseConfigured: () => true }));
vi.mock("@/lib/authClient", () => ({
  getClaims,
  logout,
  loginWithEmailPassword,
  loginWithGoogle: vi.fn(),
  getAuthErrorMessage: (err: Error) => err.message,
}));

import { LoginCard } from "@/components/auth/LoginCard";
import { getPortalContent } from "@/content/i18n";

const t = getPortalContent("pt-BR").login;

function submitLogin() {
  render(<LoginCard />);
  fireEvent.change(screen.getByLabelText(t.email), { target: { value: "ana@example.com" } });
  fireEvent.change(screen.getByLabelText(t.password), { target: { value: "segredo" } });
  fireEvent.click(screen.getByRole("button", { name: t.signInWithEmail }));
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubGlobal("fetch", vi.fn(async () => { throw new Error("login must use getClaims only"); }));
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("LoginCard", () => {
  it("redirects by role using a single claims lookup", async () => {
    getClaims.mockResolvedValue({ role: "ADMIN", hubId: null });

    submitLogin();

    await waitFor(() => expect(push).toHaveBeenCalledWith("/portal/admin"));
    expect(getClaims).toHaveBeenCalledOnce();
    expect(logout).not.toHaveBeenCalled();
  });

  it("ends the session when the account is denied", async () => {
    getClaims.mockResolvedValue(null);

    submitLogin();

    await waitFor(() => expect(screen.getByRole("alert").textContent).toContain(t.notAuthorized));
    expect(logout).toHaveBeenCalledOnce();
    expect(push).not.toHaveBeenCalled();
  });

  it("shows a readable message when the claims lookup fails", async () => {
    getClaims.mockRejectedValue(new Error("signal is aborted without reason"));

    submitLogin();

    await waitFor(() => expect(screen.getByRole("alert").textContent).toContain(t.profileLoadError));
    expect(logout).not.toHaveBeenCalled();
  });
});
