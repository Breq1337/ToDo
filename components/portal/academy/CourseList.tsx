"use client";

import { motion } from "framer-motion";
import type { AcademyCourse } from "@/content/demoAcademyData";
import { staggerContainer } from "@/components/motion/variants";
import { CourseCard } from "./CourseCard";

interface CourseListProps {
  courses: AcademyCourse[];
  reducedMotion?: boolean;
}

export function CourseList({ courses, reducedMotion }: CourseListProps) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          course={course}
          reducedMotion={reducedMotion}
        />
      ))}
    </motion.div>
  );
}
