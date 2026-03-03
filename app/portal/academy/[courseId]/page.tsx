import { notFound } from "next/navigation";
import { getCourseById } from "@/content/demoAcademyData";
import { CourseDetail } from "@/components/portal/academy";

interface PageProps {
  params: Promise<{ courseId: string }>;
}

export default async function AcademyCoursePage({ params }: PageProps) {
  const { courseId } = await params;
  const course = getCourseById(courseId);
  if (!course) notFound();
  return <CourseDetail course={course} />;
}
