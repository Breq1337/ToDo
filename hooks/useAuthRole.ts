"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { getClaims, type PortalRole, type UserClaims } from "@/lib/authClient";

export interface AuthRoleState {
  user: { email: string; displayName: string } | null;
  role: PortalRole;
  hubId: string | null;
  loading: boolean;
  error: string | null;
  tokenRefreshed: boolean;
}

/**
 * Single source of truth for portal auth + role from Supabase session and profiles (via /api/auth/me).
 */
export function useAuthRole(): AuthRoleState & { refreshRole: () => Promise<void> } {
  const [user, setUser] = useState<{ email: string; displayName: string } | null>(null);
  const [claims, setClaims] = useState<UserClaims | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tokenRefreshed, setTokenRefreshed] = useState(false);

  const fetchClaims = useCallback(async (): Promise<UserClaims | null> => {
    const c = await getClaims();
    return c;
  }, []);

  const refreshRole = useCallback(async () => {
    try {
      const c = await fetchClaims();
      setClaims(c);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }, [fetchClaims]);

  useEffect(() => {
    const supabase = createClient();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setError(null);
      if (!session?.user) {
        setUser(null);
        setClaims(null);
        setTokenRefreshed(false);
        setLoading(false);
        return;
      }

      const email = session.user.email || "";
      const localPart = email ? email.split("@")[0] || "" : "";
      const displayName =
        session.user.user_metadata?.full_name?.trim() ||
        (localPart ? localPart.charAt(0).toUpperCase() + localPart.slice(1).toLowerCase() : "Colaborador");
      setUser({ email, displayName });

      try {
        const c = await fetchClaims();
        setClaims(c);
        setTokenRefreshed(true);
      } catch (e) {
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchClaims]);

  const role = claims?.role ?? "EMPLOYEE";
  const hubId = claims?.hubId ?? null;

  return {
    user,
    role,
    hubId,
    loading,
    error,
    tokenRefreshed,
    refreshRole,
  };
}
