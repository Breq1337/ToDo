"use client";

import { motion } from "framer-motion";
import { useAuthRoleContext } from "@/components/portal/AuthRoleContext";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  WelcomeHeader,
  NextBestActions,
  ProgressOverview,
  RoleExplainer,
  AvisosPreview,
  AcademyFeatured,
  FAQQuick,
  DashboardSkeleton,
} from "@/components/portal/home";
import { fadeInUp } from "@/components/motion/variants";

export function DashboardContent() {
  const auth = useAuthRoleContext();
  const reducedMotion = useReducedMotion();
  const loading = auth?.loading ?? false;
  const user = auth?.user ?? null;
  const role = auth?.role ?? "EMPLOYEE";

  const displayName = user?.displayName ?? "Visitante";

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.3 }}
      className="mx-auto max-w-4xl space-y-10"
    >
      <WelcomeHeader
        displayName={displayName}
        role={role}
        reducedMotion={reducedMotion}
      />
      <NextBestActions reducedMotion={reducedMotion} />
      <ProgressOverview reducedMotion={reducedMotion} />
      <RoleExplainer role={role} reducedMotion={reducedMotion} />
      <AvisosPreview reducedMotion={reducedMotion} />
      <AcademyFeatured role={role} reducedMotion={reducedMotion} />
      <FAQQuick reducedMotion={reducedMotion} />
    </motion.div>
  );
}
