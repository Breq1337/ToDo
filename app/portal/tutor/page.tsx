import { redirect } from "next/navigation";
import { TutorChat } from "@/components/portal/TutorChat";

const useSupabasePortal = !!(
  process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
);

export default async function TutorPage() {
  if (!useSupabasePortal) redirect("/portal/login");
  return <TutorChat />;
}
