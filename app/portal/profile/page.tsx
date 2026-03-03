import { redirect } from "next/navigation";
import { ProfileContent } from "@/components/portal/ProfileContent";

const useSupabasePortal = !!(
  process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
);

export default async function ProfilePage() {
  if (!useSupabasePortal) redirect("/portal/login");
  return <ProfileContent />;
}
