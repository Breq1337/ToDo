"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { getClaims, logout, SessionExpiredError, type PortalRole, type UserClaims } from "@/lib/authClient";

export interface AuthRoleState {
  user: { email: string; displayName: string } | null;
  role: PortalRole;
  hubId: string | null;
  loading: boolean;
  error: AuthRoleError | null;
  tokenRefreshed: boolean;
}

export type AuthRoleError = "denied" | "unavailable" | "expired";

/**
 * Single source of truth for portal auth + role from Supabase session and profiles (via /api/auth/me).
 */
export function useAuthRole(): AuthRoleState & { refreshRole: () => Promise<void>; retry: () => void } {
  const [user, setUser] = useState<{ email: string; displayName: string } | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [claims, setClaims] = useState<UserClaims | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthRoleError | null>(null);
  const [tokenRefreshed, setTokenRefreshed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const currentUserId = useRef<string | null>(null);
  const claimsLoaded = useRef(false);
  const latestRequest = useRef(0);

  // Only the latest request may change state, so a late response cannot undo a newer one.
  const refreshRole = useCallback(async () => {
    const request = ++latestRequest.current;
    try {
      const c = await getClaims();
      if (request !== latestRequest.current) return;
      claimsLoaded.current = c !== null;
      setClaims(c);
      setError(c ? null : "denied");
      setTokenRefreshed(c !== null);
    } catch (e) {
      if (request !== latestRequest.current) return;
      if (e instanceof SessionExpiredError) {
        setError("expired");
        await logout("local");
      } else if (!claimsLoaded.current) {
        // With claims already loaded an outage is transient: keep the portal open.
        setError("unavailable");
      }
    }
  }, []);

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
        latestRequest.current += 1;
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

    void refreshRole().finally(() => {
      if (!cancelled) setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [userId, attempt, refreshRole]);

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
