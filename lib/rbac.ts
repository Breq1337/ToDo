/**
 * Centralized RBAC for portal. Role comes from Supabase profiles (and allowlist).
 * Use canAccess(role, routeGroup) for client and server checks.
 */

import type { PortalRole } from "@/lib/authClient";

export type RouteGroup = "admin" | "manager" | "app";

const ROLE_ACCESS: Record<PortalRole, RouteGroup[]> = {
  ADMIN: ["admin", "manager", "app"],
  MANAGER: ["manager", "app"],
  EMPLOYEE: ["app"],
  DRIVER: ["app"],
  HUB_OPS: ["app"],
};

/**
 * Returns true if the given role can access the route group.
 * - admin: only ADMIN
 * - manager: ADMIN or MANAGER
 * - app: any authenticated role
 */
export function canAccess(role: PortalRole, routeGroup: RouteGroup): boolean {
  const allowed = ROLE_ACCESS[role];
  if (!allowed) return false;
  return allowed.includes(routeGroup);
}

/**
 * Map pathname to route group for protection checks.
 */
export function getRouteGroup(pathname: string | null): RouteGroup | null {
  if (!pathname) return null;
  if (pathname === "/portal/admin" || pathname.startsWith("/portal/admin/")) return "admin";
  if (pathname === "/portal/manager" || pathname.startsWith("/portal/manager/")) return "manager";
  return "app";
}
