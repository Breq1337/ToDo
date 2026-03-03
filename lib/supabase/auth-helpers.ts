/**
 * Server-side auth helpers: get session, get profile with role/hubId from allowlist + profiles.
 * Use in Route Handlers and Server Components.
 */

import { createClient, createServiceRoleClient } from "./server";

export type PortalRole = "ADMIN" | "MANAGER" | "EMPLOYEE" | "DRIVER" | "HUB_OPS";

export interface ProfileWithRole {
  id: string;
  email: string;
  role: PortalRole;
  hubId: string | null;
  displayName: string | null;
}

const CORP_DOMAIN = "todogreen.com.br";

/**
 * Get current session (from cookies). Returns null if not authenticated or Supabase not configured.
 */
export async function getSession() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

/**
 * Get current user's profile with role and hubId.
 * Resolves role from allowlist (by email) or corp domain; upserts profiles row and returns it.
 * Use with createServiceRoleClient so allowlist/profiles are readable.
 */
export async function getProfileWithRole(userId: string, email: string): Promise<ProfileWithRole | null> {
  const db = createServiceRoleClient();
  if (!db) return null;

  const emailLower = email.toLowerCase().trim();

  const { data: allowlistData } = await db
    .from("allowlist")
    .select("active, role_default, hub_id")
    .eq("email", emailLower)
    .single();

  const allowlistRow = allowlistData as { active?: boolean; role_default?: string; hub_id?: string | null } | null;
  let role: PortalRole = "EMPLOYEE";
  let hubId: string | null = null;
  let allowed = false;

  if (allowlistRow?.active === true) {
    allowed = true;
    role = (allowlistRow.role_default as PortalRole) || "DRIVER";
    hubId = allowlistRow.hub_id ?? null;
  } else if (emailLower.endsWith(`@${CORP_DOMAIN}`)) {
    allowed = true;
    role = "EMPLOYEE";
  }

  if (!allowed) return null;

  const { data: profileData } = await db
    .from("profiles")
    .select("id, email, role, hub_id, display_name")
    .eq("id", userId)
    .single();

  const profile = profileData as { display_name?: string | null } | null;

  await (db.from("profiles") as any).upsert(
    {
      id: userId,
      email: emailLower,
      role,
      hub_id: hubId,
      status: "active",
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" }
  );

  return {
    id: userId,
    email: emailLower,
    role,
    hubId,
    displayName: profile?.display_name ?? null,
  };
}

/**
 * Get uid + role for API routes. Reads session from cookie then profile.
 * Returns null if not authenticated or not allowed (not in allowlist / corp domain).
 */
export async function getAuthUserWithRole(): Promise<{ uid: string; email: string; role: PortalRole; hubId: string | null } | null> {
  const session = await getSession();
  if (!session?.user?.id || !session.user.email) return null;

  const profile = await getProfileWithRole(session.user.id, session.user.email);
  if (!profile) return null;

  return {
    uid: profile.id,
    email: profile.email,
    role: profile.role,
    hubId: profile.hubId,
  };
}
