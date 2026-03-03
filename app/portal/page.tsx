import { redirect } from "next/navigation";
import { DashboardContent } from "@/components/portal/DashboardContent";

const useSupabasePortal = !!(
  process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
);

/**
 * Portal dashboard. With Supabase, auth is handled by PortalGuard.
 */
export default async function PortalDashboardPage() {
  if (!useSupabasePortal) redirect("/portal/login");
  return <DashboardContent />;
}
