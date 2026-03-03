"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getPortalContent } from "@/content/i18n";
import type { AcademyCourse } from "@/content/demoAcademyData";
import { cardHover, fadeInUp } from "@/components/motion/variants";
import { cn } from "@/lib/utils";

interface CourseCardProps {
  course: AcademyCourse;
  reducedMotion?: boolean;
}

function difficultyLabel(
  difficulty: AcademyCourse["difficulty"],
  t: ReturnType<typeof getPortalContent>["academy"]
): string {
  switch (difficulty) {
    case "beginner":
      return t.difficultyBeginner ?? "Iniciante";
    case "intermediate":
      return t.difficultyIntermediate ?? "Intermediário";
    case "advanced":
      return t.difficultyAdvanced ?? "Avançado";
    default:
      return t.difficultyBeginner ?? "Iniciante";
  }
}

function progressLabel(
  progress: AcademyCourse["progressDemo"],
  t: ReturnType<typeof getPortalContent>["academy"]
): string {
  switch (progress) {
    case "not_started":
      return t.notStarted;
    case "in_progress":
      return t.inProgress;
    case "completed":
      return t.completed;
    default:
      return t.notStarted;
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

export function CourseCard({ course, reducedMotion }: CourseCardProps) {
  const { locale } = useLocale();
  const t = getPortalContent(locale).academy;
  const tDash = getPortalContent(locale).dashboard;
  const isEn = locale === "en";

  const ctaText =
    course.progressDemo === "not_started"
      ? t.start
      : course.progressDemo === "completed"
        ? t.viewCourse
        : t.continue;

  return (
    <motion.div variants={fadeInUp}>
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
              {course.mandatory_for_roles.length ? tDash.courseMandatory : tDash.courseGeneral}
            </span>
            <span className={cn(progressBadgeClass(course.progressDemo))}>
              {progressLabel(course.progressDemo, t)}
            </span>
          </div>
          <h3 className="mt-2 font-semibold text-foreground line-clamp-2">
            {isEn ? course.title_en : course.title_pt}
          </h3>
          <p className="mt-1 flex-1 text-xs text-muted-foreground line-clamp-2">
            {isEn ? course.description_en : course.description_pt}
          </p>
          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>{course.duration_minutes} {tDash.minutes}</span>
            <span>{difficultyLabel(course.difficulty, t)}</span>
          </div>
          <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
            {ctaText}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </motion.div>
      </Link>
    </motion.div>
  );
}
