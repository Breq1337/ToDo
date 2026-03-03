/**
 * Root middleware: session refresh and /portal route protection.
 * Uses Supabase session (updateSession) for auth.
 */

import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const PORTAL_PREFIX = "/portal";
const PORTAL_PUBLIC_PATHS = ["/portal/login", "/portal/auth/callback"];

function isPortalPublic(pathname: string) {
  return PORTAL_PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const res = await updateSession(request);
  if (pathname.startsWith(PORTAL_PREFIX) && !isPortalPublic(pathname)) {
    return res;
  }
  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images|api/contact).*)",
  ],
};
