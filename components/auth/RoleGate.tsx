"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getClaims, type PortalRole } from "@/lib/authClient";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getPortalContent } from "@/content/i18n";
import { canAccess, getRouteGroup } from "@/lib/rbac";
import { useAuthRoleContext } from "@/components/portal/AuthRoleContext";
import { AlertCircle } from "lucide-react";

export function RoleGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { locale } = useLocale();
  const t = getPortalContent(locale).roleGate;
  const tCommon = getPortalContent(locale).common;
  const authContext = useAuthRoleContext();

  const [state, setState] = useState<"loading" | "denied" | "allowed">("loading");
  const [fallbackRole, setFallbackRole] = useState<PortalRole | null>(null);

  useEffect(() => {
    const roleFromContext = authContext?.role;
    if (roleFromContext !== undefined && roleFromContext !== null) {
      const routeGroup = getRouteGroup(pathname ?? null);
      const allowed = routeGroup ? canAccess(roleFromContext, routeGroup) : true;
      setState(allowed ? "allowed" : "denied");
      return;
    }
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session?.user) {
        router.replace("/portal/login");
        return;
      }
      const c = await getClaims();
      if (!c) {
        setState("allowed");
        return;
      }
      setFallbackRole(c.role);
      const routeGroup = getRouteGroup(pathname ?? null);
      const allowed = routeGroup ? canAccess(c.role, routeGroup) : true;
      setState(allowed ? "allowed" : "denied");
    });
    return () => subscription.unsubscribe();
  }, [pathname, router, authContext?.role]);

  const role = authContext?.role ?? fallbackRole ?? "EMPLOYEE";

  if (state === "loading") {
    return (
      <div className="flex min-h-[200px] items-center justify-center text-muted-foreground">
        {tCommon.loading}
      </div>
    );
  }

  if (state === "denied") {
    return (
      <div
        role="alert"
        className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-border bg-surface2/50 p-8 text-center"
      >
        <AlertCircle className="h-12 w-12 text-amber-500" />
        <h2 className="font-display text-lg font-semibold text-foreground">{t.noPermission}</h2>
        <p className="text-sm text-muted-foreground">{t.noPermissionMessage}</p>
        <button
          type="button"
          onClick={() => router.push("/portal")}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover"
        >
          {tCommon.back}
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
