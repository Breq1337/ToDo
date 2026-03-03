"use client";

import { useLocale } from "@/components/providers/LocaleProvider";
import { getPortalContent } from "@/content/i18n";
import type { PortalRole } from "@/lib/authClient";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export type AcademyFilterType = "all" | "mandatory" | "general" | "completed" | "in_progress";

interface AcademyFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filter: AcademyFilterType;
  onFilterChange: (value: AcademyFilterType) => void;
  role: PortalRole;
  rolePreview: PortalRole | null;
  onRolePreviewChange: (role: PortalRole | null) => void;
  reducedMotion?: boolean;
}

const ROLES: PortalRole[] = ["ADMIN", "MANAGER", "EMPLOYEE", "DRIVER", "HUB_OPS"];

export function AcademyFilters({
  searchQuery,
  onSearchChange,
  filter,
  onFilterChange,
  role,
  rolePreview,
  onRolePreviewChange,
}: AcademyFiltersProps) {
  const { locale } = useLocale();
  const t = getPortalContent(locale).academy;
  const roleLabels = getPortalContent(locale).roleLabels as Record<PortalRole, string>;
  const isAdmin = role === "ADMIN";

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label={t.searchPlaceholder}
          />
        </div>
        {isAdmin && (
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-muted-foreground">
              {t.rolePreview}:
            </label>
            <select
              value={rolePreview ?? ""}
              onChange={(e) =>
                onRolePreviewChange(
                  (e.target.value as PortalRole) || null
                )
              }
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">{roleLabels[role]}</option>
              {ROLES.filter((r) => r !== role).map((r) => (
                <option key={r} value={r}>
                  {roleLabels[r]}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {(
          [
            { key: "all" as const, label: t.filterAll },
            { key: "mandatory" as const, label: t.filterMandatory },
            { key: "general" as const, label: t.filterGeneral },
            { key: "completed" as const, label: t.filterCompleted },
            { key: "in_progress" as const, label: t.filterInProgress },
          ] as const
        ).map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => onFilterChange(key)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring",
              filter === key
                ? "bg-primary text-primary-foreground"
                : "bg-muted/60 text-foreground hover:bg-muted"
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
