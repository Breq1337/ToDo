"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Play } from "lucide-react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getPortalContent } from "@/content/i18n";
import type { AcademyCourse } from "@/content/demoAcademyData";
import { sectionReveal } from "@/components/motion/variants";
import { cn } from "@/lib/utils";

interface CourseDetailProps {
  course: AcademyCourse;
  reducedMotion?: boolean;
}

function difficultyLabel(
  difficulty: AcademyCourse["difficulty"],
  tDash: ReturnType<typeof getPortalContent>["dashboard"]
): string {
  switch (difficulty) {
    case "beginner":
      return tDash.difficultyBeginner;
    case "intermediate":
      return tDash.difficultyIntermediate;
    case "advanced":
      return tDash.difficultyAdvanced;
    default:
      return tDash.difficultyBeginner;
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

export function CourseDetail({ course, reducedMotion }: CourseDetailProps) {
  const { locale } = useLocale();
  const t = getPortalContent(locale).academy;
  const tDash = getPortalContent(locale).dashboard;
  const isEn = locale === "en";

  return (
    <motion.div
      variants={sectionReveal}
      initial="hidden"
      animate="visible"
      className="mx-auto max-w-3xl space-y-8"
    >
      <Link
        href="/portal/academy"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring rounded-lg px-2 py-1"
      >
        <ArrowLeft className="h-4 w-4" />
        {t.tracks}
      </Link>

      <header className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <span
            className={cn(
              "rounded-md px-2.5 py-1 text-xs font-medium",
              course.mandatory_for_roles.length
                ? "bg-primary/15 text-primary"
                : "bg-muted text-muted-foreground"
            )}
          >
            {course.mandatory_for_roles.length ? tDash.courseMandatory : tDash.courseGeneral}
          </span>
          <span className="rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
            {progressLabel(course.progressDemo, t)}
          </span>
          <span className="rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
            {course.duration_minutes} {tDash.minutes} · {difficultyLabel(course.difficulty, tDash)}
          </span>
        </div>
        <h1 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
          {isEn ? course.title_en : course.title_pt}
        </h1>
        <p className="text-muted-foreground">
          {isEn ? course.description_en : course.description_pt}
        </p>
      </header>

      <section>
        <h2 className="font-display text-lg font-semibold text-foreground">
          {t.objectives}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {isEn
            ? course.modules[0]?.objectives_en.join(" · ") ?? ""
            : course.modules[0]?.objectives_pt.join(" · ") ?? ""}
        </p>
      </section>

      <section>
        <h2 className="font-display text-lg font-semibold text-foreground">
          {t.syllabus}
        </h2>
        <ul className="mt-4 space-y-4">
          {course.modules.map((mod, i) => (
            <li
              key={mod.id}
              className="rounded-xl border border-border bg-surface2/50 p-4"
            >
              <h3 className="font-medium text-foreground">
                {t.moduleLabel} {i + 1}: {isEn ? mod.title_en : mod.title_pt}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {isEn ? mod.summary_en : mod.summary_pt}
              </p>
              <ul className="mt-2 list-inside list-disc text-sm text-muted-foreground">
                {(isEn ? mod.objectives_en : mod.objectives_pt).map((obj, j) => (
                  <li key={j}>{obj}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>

      <div className="flex flex-wrap gap-4 pt-4">
        <Link
          href={`/portal/academy/${course.id}`}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <Play className="h-4 w-4" />
          {course.progressDemo === "not_started"
            ? t.start
            : course.progressDemo === "completed"
              ? t.viewCourse
              : t.continue}
        </Link>
        <Link
          href="/portal/academy"
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface2 px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface2/80 focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <ArrowLeft className="h-4 w-4" />
          {t.tracks}
        </Link>
      </div>
    </motion.div>
  );
}
