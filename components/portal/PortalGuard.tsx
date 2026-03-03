"use client";

import { useRouter, usePathname } from "next/navigation";
import { PortalShell } from "./PortalShell";
import { PortalAuthSkeleton } from "./PortalAuthSkeleton";
import { AuthRoleContext } from "./AuthRoleContext";
import { PortalFirstLoginsTutorial } from "./PortalFirstLoginsTutorial";
import { useAuthRole } from "@/hooks/useAuthRole";

export function PortalGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, role, hubId, loading, error, refreshRole } = useAuthRole();

  const isLoginPage = pathname === "/portal/login";

  if (loading && !isLoginPage) {
    return <PortalAuthSkeleton />;
  }

  if (error && !isLoginPage) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4 text-center text-sm text-muted-foreground">
        {error}
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
