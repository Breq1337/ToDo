import { AdminContent } from "@/components/portal/AdminContent";

/**
 * Admin area — protected by RoleGate at layout level (ADMIN only).
 */
export default function PortalAdminPage() {
  return <AdminContent />;
}
