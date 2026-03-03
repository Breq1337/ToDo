import { ManagerContent } from "@/components/portal/ManagerContent";

/**
 * Manager area — protected by RoleGate at layout level (MANAGER or ADMIN).
 */
export default function PortalManagerPage() {
  return <ManagerContent />;
}
