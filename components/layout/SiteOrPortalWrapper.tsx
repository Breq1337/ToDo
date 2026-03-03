"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/common/ScrollProgress";
import { BackToTop } from "@/components/common/BackToTop";
import { JsonLd } from "@/components/common/JsonLd";
import { FirstVisitTutorial } from "@/components/common/FirstVisitTutorial";

/**
 * Wraps root layout children: show main site chrome (Navbar, Footer) only for public routes.
 * /portal/* is rendered without main site nav (portal has its own layout).
 */
export function SiteOrPortalWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPortal = pathname?.startsWith("/portal");

  if (isPortal) {
    return <>{children}</>;
  }

  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <BackToTop />
      <JsonLd />
      <FirstVisitTutorial />
    </>
  );
}
