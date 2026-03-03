"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getPortalContent } from "@/content/i18n";
import { getFeaturedForRole } from "@/content/demoAcademyData";
import type { PortalRole } from "@/lib/authClient";
import type { AcademyCourse } from "@/content/demoAcademyData";
import { sectionReveal, staggerContainer, fadeInUp, cardHover } from "@/components/motion/variants";
import { cn } from "@/lib/utils";

interface AcademyFeaturedProps {
  role: PortalRole;
  reducedMotion?: boolean;
}

function difficultyLabel(
  difficulty: AcademyCourse["difficulty"],
  t: ReturnType<typeof getPortalContent>["dashboard"]
): string {
  switch (difficulty) {
    case "beginner":
      return t.difficultyBeginner;
    case "intermediate":
      return t.difficultyIntermediate;
    case "advanced":
      return t.difficultyAdvanced;
    default:
      return t.difficultyBeginner;
  }
}

function statusLabel(
  progress: AcademyCourse["progressDemo"],
  t: ReturnType<typeof getPortalContent>["dashboard"]
): string {
  switch (progress) {
    case "not_started":
      return t.courseNew;
    case "in_progress":
      return t.courseInProgress;
    case "completed":
      return t.courseCompleted;
    default:
      return t.courseNew;
  }
}

function progressBadgeClass(progress: AcademyCourse["progressDemo"]): string {
  switch (progress) {
    case "completed":
      return "rounded-md px-2 py-0.5 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200";
    case "in_progress":
      return "rounded-md px-2 py-0.5 text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200";
    default:
      return "rounded-md px-2 py-0.5 text-xs font-medium bg-muted text-foreground";
  }
}

export function AcademyFeatured({ role, reducedMotion }: AcademyFeaturedProps) {
  const { locale } = useLocale();
  const t = getPortalContent(locale).dashboard;
  const isEn = locale === "en";
  const courses = getFeaturedForRole(role);

  return (
    <motion.section
      variants={sectionReveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      className="space-y-4"
    >
      <h2 className="font-display text-lg font-semibold text-foreground">
        {t.sectionAcademyFeatured}
      </h2>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {courses.map((course) => (
          <motion.div key={course.id} variants={fadeInUp}>
            <Link
              href={`/portal/academy/${course.id}`}
              className="group block rounded-2xl border border-border bg-surface2/50 p-4 transition-colors hover:border-primary/30 hover:bg-surface2 focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <motion.div
                variants={cardHover}
                initial="rest"
                whileHover={reducedMotion ? "rest" : "hover"}
                className="flex h-full flex-col"
              >
                <div className="flex flex-wrap gap-1.5">
                  <span
                    className={cn(
                      "rounded-md px-2 py-0.5 text-xs font-medium",
                      course.mandatory_for_roles.length
                        ? "bg-primary/15 text-primary"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {course.mandatory_for_roles.length ? t.courseMandatory : t.courseGeneral}
                  </span>
                  <span className={cn(progressBadgeClass(course.progressDemo))}>
                    {statusLabel(course.progressDemo, t)}
                  </span>
                </div>
                <h3 className="mt-2 font-semibold text-foreground line-clamp-2">
                  {isEn ? course.title_en : course.title_pt}
                </h3>
                <p className="mt-1 flex-1 text-xs text-muted-foreground line-clamp-2">
                  {isEn ? course.description_en : course.description_pt}
                </p>
                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{course.duration_minutes} {t.minutes}</span>
                  <span>{difficultyLabel(course.difficulty, t)}</span>
                </div>
                <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                  {course.progressDemo === "not_started"
                    ? t.viewAcademy
                    : course.progressDemo === "completed"
                      ? t.viewAcademy
                      : t.continueLearning}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}
