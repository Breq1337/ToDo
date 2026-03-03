"use client";

import { createContext, useContext } from "react";
import type { PortalRole } from "@/lib/authClient";

export interface AuthRoleContextValue {
  user: { email: string; displayName: string } | null;
  role: PortalRole;
  hubId: string | null;
  loading: boolean;
  refreshRole: () => Promise<void>;
}

const AuthRoleContext = createContext<AuthRoleContextValue | null>(null);

export function useAuthRoleContext(): AuthRoleContextValue | null {
  return useContext(AuthRoleContext);
}

export { AuthRoleContext };
