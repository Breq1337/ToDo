import { PortalShell } from "@/components/portal/PortalShell";
import { PortalGuard } from "@/components/portal/PortalGuard";

const useSupabasePortal = !!(
  process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
);

/**
 * Phase 2 — Portal layout. Uses Supabase for auth when configured.
 */
export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (useSupabasePortal) {
    return <PortalGuard>{children}</PortalGuard>;
  }

  return <>{children}</>;
}
