"use client";

import { useRouter, usePathname } from "next/navigation";
import { PortalShell } from "./PortalShell";
import { PortalAuthSkeleton } from "./PortalAuthSkeleton";
import { AuthRoleContext } from "./AuthRoleContext";
import { PortalFirstLoginsTutorial } from "./PortalFirstLoginsTutorial";
import { useAuthRole } from "@/hooks/useAuthRole";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getPortalContent } from "@/content/i18n";
import { logout } from "@/lib/authClient";

export function PortalGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { locale } = useLocale();
  const { user, role, hubId, loading, error, refreshRole, retry } = useAuthRole();

  const isLoginPage = pathname === "/portal/login";

  if (loading && !isLoginPage) {
    return <PortalAuthSkeleton />;
  }

  if (error && !isLoginPage) {
    const portal = getPortalContent(locale);
    const denied = error === "denied";
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div role="alert" className="w-full max-w-md rounded-2xl border border-border bg-surface2/50 p-6">
          <p className="text-sm text-foreground">
            {denied ? portal.login.notAuthorized : portal.login.profileLoadError}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {!denied && (
              <button
                type="button"
                onClick={retry}
                className="rounded-lg border border-primary bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {portal.login.tryAgain}
              </button>
            )}
            <button
              type="button"
              onClick={async () => {
                await logout();
                router.replace("/portal/login");
              }}
              className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface2 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {portal.nav.logout}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!user && !isLoginPage) {
    router.replace("/portal/login");
    return null;
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <AuthRoleContext.Provider value={{ user, role, hubId, loading: false, refreshRole }}>
      <PortalShell user={user} role={role}>
        {children}
      </PortalShell>
      <PortalFirstLoginsTutorial />
    </AuthRoleContext.Provider>
  );
}
