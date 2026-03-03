"use client";

import { RoleGate } from "@/components/auth/RoleGate";

/**
 * Layout-level protection: only ADMIN can access /portal/admin.
 * Non-ADMIN sees RoleGate deny UI with "Voltar" to /portal.
 */
export default function PortalAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RoleGate>{children}</RoleGate>;
}
