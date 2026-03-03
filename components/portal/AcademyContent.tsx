"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useAuthRoleContext } from "@/components/portal/AuthRoleContext";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getPortalContent } from "@/content/i18n";
import {
  AcademyFilters,
  CategorySidebar,
  CourseList,
} from "@/components/portal/academy";
import type { AcademyFilterType } from "@/components/portal/academy";
import {
  getCoursesForRole,
  getMandatoryForRole,
} from "@/content/demoAcademyData";
import type { CategoryId } from "@/content/demoAcademyData";
import type { PortalRole } from "@/lib/authClient";
import { fadeInUp } from "@/components/motion/variants";

export function AcademyContent() {
  const auth = useAuthRoleContext();
  const searchParams = useSearchParams();
  const reducedMotion = useReducedMotion();
  const { locale } = useLocale();
  const t = getPortalContent(locale).academy;
  const role = auth?.role ?? "EMPLOYEE";

  const initialFilter = (searchParams.get("filter") === "obrigatorios"
    ? "mandatory"
    : undefined) as AcademyFilterType | undefined;
  const [filter, setFilter] = useState<AcademyFilterType>(initialFilter ?? "all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<CategoryId | null>(null);
  const [rolePreview, setRolePreview] = useState<PortalRole | null>(null);

  const effectiveRole: PortalRole = rolePreview ?? role;
  const mandatoryIds = useMemo(
    () => new Set(getMandatoryForRole(effectiveRole).map((c) => c.id)),
    [effectiveRole]
  );

  const courses = useMemo(() => {
    let list = getCoursesForRole(effectiveRole);
    if (filter === "mandatory") {
      list = list.filter((c) => mandatoryIds.has(c.id));
    } else if (filter === "general") {
      list = list.filter((c) => !mandatoryIds.has(c.id));
    } else if (filter === "completed") {
      list = list.filter((c) => c.progressDemo === "completed");
    } else if (filter === "in_progress") {
      list = list.filter((c) => c.progressDemo === "in_progress");
    }
    if (selectedCategoryId) {
      list = list.filter((c) => c.category === selectedCategoryId);
    }
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (c) =>
          c.title_pt.toLowerCase().includes(q) ||
          c.title_en.toLowerCase().includes(q) ||
          c.description_pt.toLowerCase().includes(q) ||
          c.description_en.toLowerCase().includes(q)
      );
    }
    return list;
  }, [effectiveRole, filter, mandatoryIds, selectedCategoryId, searchQuery]);

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.3 }}
      className="mx-auto max-w-6xl space-y-6"
    >
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">
          {t.title}
        </h1>
        <p className="mt-1 text-muted-foreground">
          {t.subtitle}
        </p>
      </div>

      <AcademyFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filter={filter}
        onFilterChange={setFilter}
        role={role}
        rolePreview={rolePreview}
        onRolePreviewChange={setRolePreview}
        reducedMotion={reducedMotion}
      />

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="lg:w-56 lg:shrink-0">
          <CategorySidebar
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={setSelectedCategoryId}
          />
        </div>
        <div className="min-w-0 flex-1">
          {courses.length === 0 ? (
            <p className="rounded-2xl border border-border bg-surface2/50 p-8 text-center text-muted-foreground">
              {t.emptyState}
            </p>
          ) : (
            <CourseList courses={courses} reducedMotion={reducedMotion} />
          )}
        </div>
      </div>
    </motion.div>
  );
}
