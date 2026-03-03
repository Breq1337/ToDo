"use client";

import { useLocale } from "@/components/providers/LocaleProvider";
import { getPortalContent } from "@/content/i18n";
import { ACADEMY_CATEGORIES } from "@/content/demoAcademyData";
import type { CategoryId } from "@/content/demoAcademyData";
import { cn } from "@/lib/utils";

interface CategorySidebarProps {
  selectedCategoryId: CategoryId | null;
  onSelectCategory: (id: CategoryId | null) => void;
}

export function CategorySidebar({
  selectedCategoryId,
  onSelectCategory,
}: CategorySidebarProps) {
  const { locale } = useLocale();
  const t = getPortalContent(locale).academy;
  const isEn = locale === "en";

  return (
    <aside className="space-y-2">
      <h3 className="px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {t.categoryLabel}
      </h3>
      <nav className="space-y-0.5">
        <button
          type="button"
          onClick={() => onSelectCategory(null)}
          className={cn(
            "w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring",
            selectedCategoryId === null
              ? "bg-primary/15 text-primary"
              : "text-muted-foreground hover:bg-surface2 hover:text-foreground"
          )}
        >
          {t.filterAll}
        </button>
        {ACADEMY_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelectCategory(cat.id)}
            className={cn(
              "w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring",
              selectedCategoryId === cat.id
                ? "bg-primary/15 text-primary"
                : "text-muted-foreground hover:bg-surface2 hover:text-foreground"
            )}
          >
            {isEn ? cat.name_en : cat.name_pt}
          </button>
        ))}
      </nav>
    </aside>
  );
}
