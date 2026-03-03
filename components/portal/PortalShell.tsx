"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  GraduationCap,
  MessageCircle,
  Trophy,
  User,
  LogOut,
  ChevronRight,
  Shield,
  Sun,
  Moon,
  Languages,
  Bell,
  ClipboardList,
  Users,
} from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import { getPortalContent } from "@/content/i18n";
import { createClient } from "@/lib/supabase/client";
import { canAccess, type RouteGroup } from "@/lib/rbac";
import type { PortalRole } from "@/lib/authClient";
import { cn } from "@/lib/utils";

const navItems: { href: string; icon: typeof LayoutDashboard; key: "dashboard" | "academy" | "tutor" | "ranking" | "profile" | "messages" | "quadroAvisos" | "rhPanel" | "manager" | "admin"; routeGroup?: RouteGroup }[] = [
  { href: "/portal", icon: LayoutDashboard, key: "dashboard" },
  { href: "/portal/academy", icon: GraduationCap, key: "academy" },
  { href: "/portal/tutor", icon: MessageCircle, key: "tutor" },
  { href: "/portal/ranking", icon: Trophy, key: "ranking" },
  { href: "/portal/profile", icon: User, key: "profile" },
  { href: "/portal/messages", icon: Bell, key: "messages" },
  { href: "/portal/quadro-avisos", icon: ClipboardList, key: "quadroAvisos" },
  { href: "/portal/rh", icon: Users, key: "rhPanel", routeGroup: "manager" },
  { href: "/portal/manager", icon: Shield, key: "manager", routeGroup: "manager" },
  { href: "/portal/admin", icon: Shield, key: "admin", routeGroup: "admin" },
];

export type PortalShellUser = { email: string; displayName?: string } | import("@supabase/supabase-js").User | null;

export function PortalShell({
  user,
  role = "EMPLOYEE",
  children,
}: {
  user: PortalShellUser;
  role?: PortalRole;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { locale, setLocale } = useLocale();
  const { theme, setTheme } = useTheme();
  const t = getPortalContent(locale).nav;
  const roleLabels = getPortalContent(locale).roleLabels as Record<PortalRole, string>;
  const email = user && "email" in user ? user.email : null;
  const displayName =
    user && "displayName" in user && user.displayName
      ? user.displayName
      : email
        ? email.split("@")[0]
            ? email.split("@")[0]!.charAt(0).toUpperCase() + email.split("@")[0]!.slice(1).toLowerCase()
            : email
        : "";
  const roleLabel = roleLabels[role] ?? role;

  const visibleNavItems = navItems.filter((item) => {
    if (!item.routeGroup) return true;
    return canAccess(role, item.routeGroup);
  });

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/portal/login");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/portal"
            className="font-display text-lg font-semibold text-foreground"
          >
            To Do Green · Portal
          </Link>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 truncate max-w-[200px] sm:max-w-[260px]">
              <span className="text-sm font-medium text-foreground truncate" title={email ?? undefined}>
                {displayName || email}
              </span>
              <span className="shrink-0 inline-flex items-center rounded-md border border-border/80 bg-muted/60 px-2 py-0.5 text-xs font-medium text-muted-foreground">
                {roleLabel}
              </span>
            </div>
            <Link
              href="/portal/messages"
              className="rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-surface2 transition-colors"
              aria-label={t.messages}
            >
              <Bell className="h-4 w-4" />
            </Link>
            <button
              type="button"
              onClick={() => setLocale(locale === "pt-BR" ? "en" : "pt-BR")}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-surface2 transition-colors"
              aria-label={locale === "pt-BR" ? "Mudar para inglês" : "Switch to Portuguese"}
            >
              <Languages className="h-4 w-4" />
              <span className="hidden sm:inline">{locale === "pt-BR" ? "EN" : "PT"}</span>
            </button>
            <button
              type="button"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-surface2 transition-colors"
              aria-label={theme === "light" ? "Modo escuro" : "Modo claro"}
            >
              {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg p-2 text-muted-foreground hover:text-foreground hover:bg-surface2 transition-colors"
              aria-label={t.logout}
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
        <nav className="mx-auto max-w-6xl px-4 border-t border-border" aria-label="Portal">
          <div className="flex flex-wrap gap-1 py-2">
            {visibleNavItems.map(({ href, icon: Icon, key }) => {
              const isActive = pathname === href || (href !== "/portal" && pathname?.startsWith(href));
              const isTutor = key === "tutor";
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isTutor && "border border-amber-400/40 bg-gradient-to-r from-amber-500/10 to-violet-500/10",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : isTutor
                        ? "text-foreground hover:from-amber-500/20 hover:to-violet-500/20"
                        : "text-muted-foreground hover:text-foreground hover:bg-surface2"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {t[key]}
                  {isTutor && (
                    <span className="inline-flex items-center rounded-md bg-amber-500/20 px-1.5 py-0.5 text-xs font-semibold text-amber-700 dark:text-amber-300">
                      {t.tutorBadge}
                    </span>
                  )}
                  <ChevronRight className="h-3.5 w-3 opacity-50" />
                </Link>
              );
            })}
          </div>
        </nav>
      </header>
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="flex-1 p-4 sm:p-6 lg:p-8"
      >
        {children}
      </motion.main>
    </div>
  );
}
