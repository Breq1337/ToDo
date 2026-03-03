"use client";

import { RoleGate } from "@/components/auth/RoleGate";

/**
 * Layout-level protection: only MANAGER and ADMIN can access /portal/manager.
 * Others see RoleGate deny UI with "Voltar" to /portal.
 */
export default function PortalManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RoleGate>{children}</RoleGate>;
}
