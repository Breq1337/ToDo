"use client";

import { useEffect, useRef, useState, useCallback } from "react";
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

const PROFILE_UNAVAILABLE = "profile_unavailable";

/**
 * Single source of truth for portal auth + role from Supabase session and profiles (via /api/auth/me).
 */
export function useAuthRole(): AuthRoleState & { refreshRole: () => Promise<void>; retry: () => void } {
  const [user, setUser] = useState<{ email: string; displayName: string } | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [claims, setClaims] = useState<UserClaims | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tokenRefreshed, setTokenRefreshed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const currentUserId = useRef<string | null>(null);
  const claimsLoaded = useRef(false);

  // With claims already loaded a failed refresh is transient: keep the portal open with what we have.
  const reportFailure = useCallback(() => {
    if (currentUserId.current && !claimsLoaded.current) setError(PROFILE_UNAVAILABLE);
  }, []);

  const applyClaims = useCallback((c: UserClaims | null) => {
    if (!c) throw new Error(PROFILE_UNAVAILABLE);
    claimsLoaded.current = true;
    setClaims(c);
    setError(null);
  }, []);

  const refreshRole = useCallback(async () => {
    try {
      applyClaims(await getClaims());
    } catch {
      reportFailure();
    }
  }, [applyClaims, reportFailure]);

  const retry = useCallback(() => {
    setError(null);
    setLoading(true);
    setAttempt((n) => n + 1);
  }, []);

  useEffect(() => {
    const supabase = createClient();

    // Must stay synchronous: supabase-js holds its auth lock while this runs, so awaiting another
    // auth call here deadlocks signIn. Claims are loaded by the effect below.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session?.user) {
        currentUserId.current = null;
        claimsLoaded.current = false;
        setUserId(null);
        setUser(null);
        setClaims(null);
        setError(null);
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

      if (currentUserId.current !== session.user.id) {
        currentUserId.current = session.user.id;
        claimsLoaded.current = false;
        setUserId(session.user.id);
        setLoading(true);
      } else if (event === "SIGNED_IN") {
        if (!claimsLoaded.current) {
          setError(null);
          setLoading(true);
        }
        setAttempt((n) => n + 1);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;

    getClaims()
      .then((c) => {
        if (cancelled) return;
        applyClaims(c);
        setTokenRefreshed(true);
      })
      .catch(() => {
        if (!cancelled) reportFailure();
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [userId, attempt, applyClaims, reportFailure]);

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
    retry,
  };
}
