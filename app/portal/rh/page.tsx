import { redirect } from "next/navigation";
import { RHPanelContent } from "@/components/portal/RHPanelContent";

const useSupabasePortal = !!(
  process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
);

export default function PortalRHPage() {
  if (!useSupabasePortal) redirect("/portal/login");
  return <RHPanelContent />;
}
