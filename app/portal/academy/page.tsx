import { redirect } from "next/navigation";
import { AcademyContent } from "@/components/portal/AcademyContent";

const useSupabasePortal = !!(
  process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
);

export default async function AcademyPage() {
  if (!useSupabasePortal) redirect("/portal/login");
  return <AcademyContent />;
}
